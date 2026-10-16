// Real-browser fixture for FormCard submission integrity (both #hero and
// #consultation cards) under the no-resend policy. One Playwright function,
// usable via the Playwright MCP `browser_run_code` (filename=...) or any
// runner that passes `page`.
//
// SESSION INDEPENDENCE: every scenario runs in its own fresh browser context
// (or, if the runner cannot create contexts, its own new tab, which also gets
// a fresh sessionStorage). Scenarios never clear or fake the attempt marker.
// Reload/back steps inside a scenario reuse that scenario's tab on purpose.
//
// FULL TRANSPORT ISOLATION: every request that is not same-origin with
// FIXTURE_BASE_URL is aborted (optimizer, GTM, Meta, CTM never load), and the
// lead endpoint is answered by a scripted fake. MegaTag/dataLayer are in-page
// recorders. No lead or conversion can leave the browser.
//
// FIXTURE_BASE_URL defaults to a local `next start -p 3417`; it can point at
// the deployed URL with the same isolation. Returns a JSON report; set
// FIXTURE_SHOT_DIR to also write desktop/mobile screenshots of each state.
async (page) => {
  const env = globalThis.process?.env ?? {};
  const BASE = env.FIXTURE_BASE_URL || "http://localhost:3417/";
  const SHOTS = env.FIXTURE_SHOT_DIR || "";
  const ENDPOINT = "https://analytics.gomega.ai/submission/submit";
  const origin = new URL(BASE).origin;
  const QUAL = "$1 million–$3 million";
  const UNQUAL = "Under $1 million";
  const report = { base: BASE, blocked: new Set(), scenarios: [] };

  // ─── A fresh, isolated browsing session ───
  const openSession = async ({ blockStorage = false, viewport } = {}) => {
    const browser = page.context().browser();
    const context = browser ? await browser.newContext({ viewport }) : page.context();
    const tab = await context.newPage();
    if (viewport) await tab.setViewportSize(viewport);
    const s = { tab, context, owned: Boolean(browser), queue: [], leadRequests: [], events: [] };
    await tab.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.startsWith(ENDPOINT)) {
        s.leadRequests.push(JSON.parse(route.request().postData() || "{}"));
        const next = s.queue.shift() || { abort: true };
        if (next.abort) return route.abort("failed");
        return route.fulfill({ status: next.status, contentType: "application/json", body: next.body });
      }
      if (new URL(url).origin === origin) return route.continue();
      report.blocked.add(new URL(url).host);
      return route.abort("blockedbyclient");
    });
    await tab.addInitScript((block) => {
      window.__events = [];
      window.MegaTag = { trackEvent: (event, p) => window.__events.push({ via: "MegaTag", event, ...p }) };
      window.dataLayer = [];
      window.dataLayer.push = (...e) => window.__events.push(...e.map((x) => ({ via: "dataLayer", ...x })));
      if (block) Storage.prototype.setItem = () => { throw new DOMException("denied", "SecurityError"); };
    }, blockStorage);
    s.close = () => (s.owned ? context.close() : tab.close());
    return s;
  };

  // Events are per page load; collect them before any reload/navigation.
  const collectEvents = async (s) => s.events.push(...(await s.tab.evaluate(() => window.__events.splice(0))));
  const load = async (s, url = BASE) => {
    await s.tab.goto(url, { waitUntil: "networkidle" });
  };
  const fill = async (s, prefix, budget, first = "Test") => {
    await s.tab.fill(`#${prefix}-firstName`, first);
    await s.tab.fill(`#${prefix}-lastName`, "MEGA QA");
    await s.tab.fill(`#${prefix}-email`, "qatest+fixture@gomega.ai");
    await s.tab.fill(`#${prefix}-phone`, "2125550147");
    await s.tab.selectOption(`#${prefix}-projectBudget`, budget);
  };
  // Waits until no card shows "Sending…", plus a beat for any late request.
  const waitIdle = async (s) => {
    await s.tab.waitForFunction(() => !/Sending/.test(document.body.innerText), null, { timeout: 5000 }).catch(() => {});
    await s.tab.waitForTimeout(200);
  };
  const click = async (s, prefix, times = 1) => {
    const btn = s.tab.locator(`#${prefix}-firstName`).locator("xpath=ancestor::form").locator("button");
    for (let i = 0; i < times; i++) btn.click({ force: true, timeout: 1000 }).catch(() => {});
    await waitIdle(s);
  };
  const cardState = (s, prefix) =>
    s.tab.evaluate((p) => {
      const form = document.getElementById(`${p}-firstName`)?.closest("form");
      const notice = document.getElementById(`${p}-submit-error`);
      return {
        thankYou: !form,
        notice: notice?.dataset.notice ?? null,
        noticeRole: notice?.getAttribute("role") ?? null,
        noticeText: notice?.innerText ?? null,
        formDescribedBy: form?.getAttribute("aria-describedby") ?? null,
        focused: document.activeElement?.id === `${p}-submit-error`,
        values: form ? [...form.querySelectorAll("input,select")].map((el) => el.value) : null,
        buttonDisabled: form?.querySelector("button")?.disabled ?? null,
        busy: /Sending/.test(form?.innerText ?? ""),
      };
    }, prefix);
  const snapshot = async (s) => ({ hero: await cardState(s, "hero"), consult: await cardState(s, "consult") });
  const marker = (s) => s.tab.evaluate(() => JSON.stringify({ ...sessionStorage }));

  const scenario = async (name, opts, steps) => {
    const s = await openSession(opts);
    const snaps = {};
    try {
      await load(s);
      await steps(s, snaps);
      await collectEvents(s);
      snaps.sessionStorage = await marker(s).catch(() => "unreadable");
    } finally {
      report.scenarios.push({ name, leadRequests: s.leadRequests.length, events: s.events, snaps });
      await s.close();
    }
  };

  // Every possible resend path on a loaded page: both cards, edited values,
  // native Enter in a field, rapid clicks.
  const tryResendEverywhere = async (s) => {
    for (const p of ["hero", "consult"]) {
      if (!(await s.tab.$(`#${p}-firstName`))) continue;
      await fill(s, p, QUAL, "Edited");
      await click(s, p, 3);
      await s.tab.press(`#${p}-email`, "Enter");
    }
    await s.tab.waitForTimeout(300);
  };

  // ─── Scenarios (each a separate session) ───
  for (const prefix of ["hero", "consult"]) {
    await scenario(`${prefix}: empty then corrected → accepted qualified`, {}, async (s, snaps) => {
      await click(s, prefix);
      snaps.afterEmpty = await snapshot(s);
      await fill(s, prefix, QUAL);
      s.queue.push({ status: 200, body: '{"ok":true,"id":"fixture"}' });
      await click(s, prefix, 3);
      snaps.accepted = await snapshot(s);
      await tryResendEverywhere(s);
    });
    await scenario(`${prefix}: accepted unqualified, rapid triple click`, {}, async (s, snaps) => {
      await fill(s, prefix, UNQUAL);
      s.queue.push({ status: 200, body: '{"ok":true}' });
      await click(s, prefix, 3);
      snaps.accepted = await snapshot(s);
    });
  }

  const UNCONFIRMED = {
    "network abort": { abort: true },
    "HTTP 500": { status: 500, body: '{"ok":false,"error":"secret"}' },
    "200 ok:false": { status: 200, body: '{"ok":false}' },
    "malformed JSON": { status: 200, body: "<html>oops" },
    "missing ok": { status: 200, body: "{}" },
    "ok:null": { status: 200, body: '{"ok":null}' },
    "null body": { status: 200, body: "null" },
  };
  let i = 0;
  for (const [kind, response] of Object.entries(UNCONFIRMED)) {
    const prefix = i++ % 2 ? "consult" : "hero";
    await scenario(`${prefix}: unconfirmed (${kind}) → resend attempts, reload, back`, {}, async (s, snaps) => {
      await fill(s, prefix, QUAL);
      s.queue.push(response, { status: 200, body: '{"ok":true}' }); // a resend would be "accepted"
      await click(s, prefix);
      snaps.unconfirmed = await snapshot(s);
      await tryResendEverywhere(s);
      await collectEvents(s);
      await load(s);
      snaps.afterReload = await snapshot(s);
      await tryResendEverywhere(s);
      await collectEvents(s);
      await load(s, `${BASE}?fixture-nav=1`);
      await s.tab.goBack({ waitUntil: "networkidle" });
      snaps.afterBack = await snapshot(s);
      await tryResendEverywhere(s);
    });
  }

  await scenario("same-tick clicks on both cards", {}, async (s, snaps) => {
    await fill(s, "hero", QUAL);
    await fill(s, "consult", UNQUAL);
    s.queue.push({ status: 500, body: "{}" }, { status: 200, body: '{"ok":true}' });
    await s.tab.evaluate(() => {
      const buttons = ["hero", "consult"].map((p) => document.getElementById(`${p}-firstName`).closest("form").querySelector("button"));
      buttons.forEach((b) => b.click());
      buttons.forEach((b) => b.click());
    });
    await waitIdle(s);
    snaps.after = await snapshot(s);
  });

  await scenario("accepted, then same-tab reload", {}, async (s, snaps) => {
    await fill(s, "hero", QUAL);
    s.queue.push({ status: 200, body: '{"ok":true}' }, { status: 200, body: '{"ok":true}' });
    await click(s, "hero");
    await collectEvents(s);
    await load(s);
    snaps.afterReload = await snapshot(s);
    await tryResendEverywhere(s);
  });

  await scenario("storage refused before send", { blockStorage: true }, async (s, snaps) => {
    await fill(s, "consult", QUAL);
    s.queue.push({ status: 200, body: '{"ok":true}' });
    await click(s, "consult");
    snaps.refused = await snapshot(s);
  });

  if (SHOTS) {
    const sizes = [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 360, height: 800 }]];
    for (const [label, viewport] of sizes) {
      const states = [
        ["unconfirmed", { status: 500, body: "{}" }, {}],
        ["confirmed", { status: 200, body: '{"ok":true}' }, {}],
        ["storage-refused", null, { blockStorage: true }],
      ];
      for (const [state, response, opts] of states) {
        const s = await openSession({ ...opts, viewport });
        await load(s);
        await fill(s, "hero", QUAL);
        if (response) s.queue.push(response);
        await click(s, "hero");
        await s.tab.locator("#hero").scrollIntoViewIfNeeded();
        await s.tab.screenshot({ path: `${SHOTS}/hero-${state}-${label}.png` });
        if (state === "unconfirmed") {
          await s.tab.locator("#consult-firstName").scrollIntoViewIfNeeded();
          await s.tab.screenshot({ path: `${SHOTS}/consult-sibling-locked-${label}.png` });
          await load(s);
          await s.tab.locator("#hero-firstName").scrollIntoViewIfNeeded();
          await s.tab.screenshot({ path: `${SHOTS}/hero-previous-after-reload-${label}.png` });
        }
        await s.close();
      }
    }
  }
  report.blocked = [...report.blocked];
  return JSON.stringify(report, null, 1);
};
