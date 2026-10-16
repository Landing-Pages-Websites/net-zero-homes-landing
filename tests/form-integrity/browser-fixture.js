// Real-browser fixture for FormCard submission integrity (both #hero and
// #consultation cards). One Playwright function, usable via the Playwright
// MCP `browser_run_code` (filename=...) or any runner that passes `page`.
//
// FULL TRANSPORT ISOLATION: every request that is not same-origin with
// FIXTURE_BASE_URL is aborted (optimizer, GTM, Meta, CTM never load), and the
// lead endpoint is answered by a scripted fake. MegaTag/dataLayer are
// in-page recorders. No lead or conversion can leave the browser.
//
// FIXTURE_BASE_URL defaults to a local `next start -p 3417`. It can point at
// the deployed URL; isolation is identical. Returns a JSON report; set
// FIXTURE_SHOT_DIR to also write desktop/mobile failure-state screenshots.
async (page) => {
  const env = globalThis.process?.env ?? {};
  const BASE = env.FIXTURE_BASE_URL || "http://localhost:3417/";
  const SHOTS = env.FIXTURE_SHOT_DIR || "";
  const ENDPOINT = "https://analytics.gomega.ai/submission/submit";
  const origin = new URL(BASE).origin;
  const queue = [];
  const report = { base: BASE, leadRequests: [], blocked: new Set(), scenarios: [] };

  await page.context().route("**/*", async (route) => {
    const url = route.request().url();
    if (url.startsWith(ENDPOINT)) {
      report.leadRequests.push(JSON.parse(route.request().postData() || "{}"));
      const next = queue.shift() || { abort: true };
      if (next.abort) return route.abort("failed");
      return route.fulfill({ status: next.status, contentType: "application/json", body: next.body });
    }
    if (new URL(url).origin === origin) return route.continue();
    report.blocked.add(new URL(url).host);
    return route.abort("blockedbyclient");
  });
  await page.addInitScript(() => {
    window.__events = { megaTag: [], dataLayer: [] };
    window.MegaTag = { trackEvent: (event, p) => window.__events.megaTag.push({ event, ...p }) };
    window.dataLayer = [];
    window.dataLayer.push = (...e) => window.__events.dataLayer.push(...e);
  });

  const card = (prefix) => page.locator(`#${prefix}-firstName`).locator("xpath=ancestor::form");
  const fill = async (prefix, budget) => {
    await page.fill(`#${prefix}-firstName`, "Test");
    await page.fill(`#${prefix}-lastName`, "MEGA QA");
    await page.fill(`#${prefix}-email`, "qatest+fixture@gomega.ai");
    await page.fill(`#${prefix}-phone`, "2125550147");
    await page.selectOption(`#${prefix}-projectBudget`, budget);
  };
  const state = (prefix) =>
    page.evaluate((p) => {
      const form = document.getElementById(`${p}-firstName`)?.closest("form");
      const alert = document.getElementById(`${p}-submit-error`);
      return {
        events: window.__events,
        thankYou: /Thank you/.test(document.body.innerText),
        alertText: alert?.innerText ?? null,
        alertRole: alert?.getAttribute("role") ?? null,
        formDescribedBy: form?.getAttribute("aria-describedby") ?? null,
        activeElement: document.activeElement?.id ?? null,
        values: form ? [...form.querySelectorAll("input,select")].map((el) => el.value) : null,
        buttonDisabled: form?.querySelector("button")?.disabled ?? null,
      };
    }, prefix);
  const click = async (prefix, times = 1) => {
    const btn = card(prefix).locator("button");
    for (let i = 0; i < times; i++) btn.click({ force: true }).catch(() => {});
    // Settle: wait until the card is no longer busy (error, thank-you or idle).
    await page
      .waitForFunction((p) => !document.getElementById(`${p}-firstName`)?.closest("form")?.querySelector("button")?.disabled, prefix, { timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(150);
  };
  const run = async (name, prefix, steps) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const before = report.leadRequests.length;
    const snaps = [];
    for (const step of steps) snaps.push(await step(prefix));
    report.scenarios.push({ name, prefix, leadRequests: report.leadRequests.length - before, snaps });
  };

  const respond = (status, body) => () => queue.push({ status, body });
  const step = (before, n = 1) => async (p) => (before(), await click(p, n), state(p));
  const QUAL = "$1 million–$3 million";
  const UNQUAL = "Under $1 million";

  for (const prefix of ["hero", "consult"]) {
    await run("empty submit", prefix, [async (p) => (await click(p), state(p))]);
    await run("network → 500 → {ok:false} → malformed → {} → {ok:null} → null → accepted", prefix, [
      async (p) => (await fill(p, QUAL), queue.push({ abort: true }), await click(p), state(p)),
      step(respond(500, '{"ok":false,"error":"secret"}')),
      step(respond(200, '{"ok":false}')),
      step(respond(200, "<html>oops")),
      step(respond(200, "{}")),
      step(respond(200, '{"ok":null}')),
      step(respond(200, "null")),
      step(respond(200, '{"ok":true,"id":"fixture"}'), 3),
      step(() => {}, 3),
    ]);
    await run("accepted unqualified, rapid triple click", prefix, [
      async (p) => (await fill(p, UNQUAL), respond(200, '{"ok":true}')(), await click(p, 3), state(p)),
    ]);
  }

  if (SHOTS) {
    for (const [label, size] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 360, height: 800 }]]) {
      await page.setViewportSize(size);
      for (const prefix of ["hero", "consult"]) {
        await page.goto(BASE, { waitUntil: "domcontentloaded" });
        await fill(prefix, QUAL);
        queue.push({ status: 500, body: "{}" });
        await click(prefix);
        await card(prefix).screenshot({ path: `${SHOTS}/${prefix}-error-${label}.png` });
      }
    }
  }
  report.blocked = [...report.blocked];
  return JSON.stringify(report, null, 1);
};
