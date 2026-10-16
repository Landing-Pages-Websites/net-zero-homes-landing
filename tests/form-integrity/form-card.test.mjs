// Regression tests for FormCard submission-result handling under the current
// director contract: one submission attempt per browser session, never
// resent after an unconfirmed outcome. Run:
//   node --test tests/form-integrity/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  brokenStorage,
  createEnv,
  freshPage,
  leadPlatformModel,
  loadSource,
  memoryStorage,
  mount,
  query,
  renderOnServer,
  settle,
  textOf,
  transport,
  ENDPOINT,
  MERGE_WINDOW_MS,
} from "./harness.mjs";

const { DISQUALIFYING_BUDGET, BUDGET_OPTIONS, FORM, PHONE_HREF } = loadSource("lib/content.ts");

const QUALIFIED_BUDGET = BUDGET_OPTIONS.find((o) => o !== DISQUALIFYING_BUDGET);
const MARKER_KEY = `nzc_lead_attempt:${FORM.siteId}`;
const HOOK_SESSION_KEY = "_mega_sid";
const VALID = {
  firstName: "Test",
  lastName: "MEGA QA",
  email: "qatest+fixture@gomega.ai",
  phone: "2125550147",
};
const EDITED = { ...VALID, firstName: "Edited", email: "qatest+edited@gomega.ai" };
const HERO = { name: "hero", props: { idPrefix: "hero" }, route: "/" };
const CONSULT = { name: "consult", props: { idPrefix: "consult", routeSlug: "/#consultation" }, route: "/#consultation" };
const INSTANCES = [HERO, CONSULT];
const FAILURES = {
  "network rejection": transport.networkError(),
  "HTTP 500": transport.json(500, { ok: false, error: "db down: secret detail" }),
  "HTTP 200 {ok:false}": transport.json(200, { ok: false, error: "rejected: secret detail" }),
  "malformed JSON": transport.malformed(),
  "missing ok": transport.json(200, { id: "abc" }),
  "null ok": transport.json(200, { ok: null }),
  "string ok": transport.json(200, { ok: "true" }),
  "numeric ok": transport.json(200, { ok: 1 }),
  "null response": transport.json(200, null),
  "primitive true": transport.json(200, true),
  "primitive string": transport.json(200, "ok"),
};
const THANK_YOU = /Thank you/;
const RESEND_WORDING = /try again|retry|resend|submit again/i;

// ─── Page / card helpers ───

// One page load in `env`: fresh module state, both real cards mounted.
function openPage(env = createEnv()) {
  const FormCard = freshPage();
  const [hero, consult] = INSTANCES.map((inst) => card(FormCard, inst, env));
  return { env, hero, consult, FormCard };
}

function card(FormCard, instance, env) {
  const inst = mount(FormCard, instance.props, env);
  return { env, card: inst, q: query(inst), id: (k) => `${instance.props.idPrefix}-${k}`, instance };
}

function fill(ctx, budget = QUALIFIED_BUDGET, values = VALID) {
  const { q, card: inst, id } = ctx;
  for (const [k, v] of Object.entries(values)) {
    q.byId(id(k)).props.onChange({ target: { value: v } });
    inst.render();
  }
  q.byId(id("projectBudget")).props.onChange({ target: { value: budget } });
  inst.render();
}

async function settleAll(page) {
  await settle(page.hero.card);
  page.consult.card.render();
}

async function click(page, ctx) {
  ctx.q.button().props.onClick();
  await settleAll(page);
}

function notice(ctx) {
  return ctx.q.byId(ctx.id("submit-error"));
}

function assertNoSuccess(env, ...cards) {
  assert.equal(env.megaTag.length, 0, "no MegaTag events");
  assert.equal(env.dataLayer.length, 0, "no dataLayer events");
  for (const c of cards) assert.doesNotMatch(c.q.text(), THANK_YOU);
}

function assertRetained(ctx, values = VALID, budget = QUALIFIED_BUDGET) {
  for (const [k, v] of Object.entries(values)) {
    const expected = k === "phone" ? v.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") : v;
    assert.equal(ctx.q.byId(ctx.id(k)).props.value, expected, `${k} retained`);
  }
  assert.equal(ctx.q.byId(ctx.id("projectBudget")).props.value, budget);
}

// Locked, but visibly NOT busy: no spinner text, inputs usable, button off.
function assertLockedNotBusy(ctx) {
  assert.equal(ctx.q.button().props.disabled, true, "no resend possible");
  assert.doesNotMatch(ctx.q.text(), /Sending/);
  assert.equal(ctx.q.byId(ctx.id("firstName")).props.disabled, false, "not busy");
}

function assertNotice(ctx, kind, { announced }) {
  const n = notice(ctx);
  assert.ok(n, `${ctx.instance.name}: notice rendered`);
  assert.equal(n.props["data-notice"], kind);
  assert.equal(ctx.q.form().props["aria-describedby"], ctx.id("submit-error"), "form references notice");
  assert.equal(n.props.role, announced ? "alert" : undefined);
  if (announced) assert.equal(ctx.env.focused, ctx.id("submit-error"), "focus moved to notice");
  const text = textOf(n);
  assert.doesNotMatch(text, RESEND_WORDING, "no retry/resend suggestion");
  assert.doesNotMatch(ctx.q.text(), /secret detail|HTTP|status|Failed to fetch/i, "no backend details");
  const phone = ctx.q.all().find((x) => x.type === "a" && x.props.href === PHONE_HREF);
  assert.ok(phone, "existing phone link offered");
  return text;
}

function assertUnconfirmed(ctx, opts) {
  const text = assertNotice(ctx, "unconfirmed", opts);
  assert.match(text, /couldn.t confirm/);
  assert.match(text, /may already have reached our team/);
  assert.doesNotMatch(text, /wasn.t sent/, "never claims it was not sent");
}

function assertNoPii(env) {
  const stored = JSON.stringify(env.session.entries());
  for (const v of [...Object.values(VALID), ...Object.values(EDITED), QUALIFIED_BUDGET]) {
    assert.ok(!stored.includes(v), `sessionStorage holds no "${v}"`);
  }
}

// Attempts every possible resend: stale + fresh handlers on both cards,
// edited fields, and the native Enter/submit path.
async function attemptEverything(page) {
  for (const ctx of [page.hero, page.consult]) {
    if (!ctx.q.form()) continue; // thank-you panel: no form left to submit
    fill(ctx, QUALIFIED_BUDGET, EDITED);
    ctx.q.button().props.onClick();
    ctx.q.form().props.onSubmit({ preventDefault() {} });
  }
  await settleAll(page);
}

// ─── Pre-dispatch validation stays correctable ───

for (const [name, values] of [["empty", null], ["invalid email + phone", { ...VALID, email: "nope@", phone: "1115550100" }]]) {
  test(`${name} input: no request, guard not acquired, then corrected submit sends once`, async () => {
    const page = openPage();
    if (values) fill(page.hero, QUALIFIED_BUDGET, values);
    await click(page, page.hero);
    assert.equal(page.env.requests.length, 0);
    assert.equal(page.env.session.getItem(MARKER_KEY), null, "marker not written");
    assert.equal(notice(page.hero), undefined);
    assert.equal(page.consult.q.button().props.disabled, false, "other card not locked");
    assertNoSuccess(page.env, page.hero);

    fill(page.hero);
    page.env.responders.push(transport.json(200, { ok: true }));
    await click(page, page.hero);
    assert.equal(page.env.requests.length, 1);
    assert.match(page.hero.q.text(), THANK_YOU);
  });
}

// ─── Accepted path: separate fresh sessions ───
// Only the sending card thanks the visitor; its twin keeps its form, values
// and a quiet session-lock notice, and never claims its details were received.

const NOT_RECEIVED = /received|got your|we.ve got|confirm/i;

function assertSessionLockedTwin(twin, values, budget) {
  assert.ok(twin.q.form(), "twin stays a form");
  assert.doesNotMatch(twin.q.text(), THANK_YOU, "twin shows no success");
  assertLockedNotBusy(twin);
  assert.equal(twin.q.button().props.type, "button", "no native submit button");
  const text = assertNotice(twin, "session-locked", { announced: false });
  assert.notEqual(twin.env.focused, twin.id("submit-error"), "twin notice does not take focus");
  assert.match(text, /already started from this page/);
  assert.match(text, /won.t send again/);
  assert.doesNotMatch(text, NOT_RECEIVED, "never says the twin's details were received");
  assertRetained(twin, values, budget);
}

function assertUniqueIds(...cards) {
  const ids = cards.flatMap((c) => c.q.all().map((n) => n.props.id).filter(Boolean));
  assert.deepEqual(ids, [...new Set(ids)], "no duplicate IDs across both cards");
}

for (const inst of INSTANCES) {
  for (const qualified of [true, false]) {
    test(`${inst.name}: accepted ${qualified ? "qualified" : "unqualified"} lead (fresh session) emits exact events once; twin stays session-locked`, async () => {
      const page = openPage();
      const ctx = page[inst.name];
      const twin = inst === HERO ? page.consult : page.hero;
      const budget = qualified ? QUALIFIED_BUDGET : DISQUALIFYING_BUDGET;
      const twinBudget = qualified ? DISQUALIFYING_BUDGET : QUALIFIED_BUDGET;
      page.env.responders.push(transport.json(200, { ok: true, id: "lead_1" }));
      fill(ctx, budget);
      fill(twin, twinBudget, EDITED);
      const staleTwin = twin.q.button().props.onClick;
      const staleTwinSubmit = twin.q.form().props.onSubmit;
      await click(page, ctx);
      assert.match(ctx.q.text(), THANK_YOU);
      assertSessionLockedTwin(twin, EDITED, twinBudget);
      assertUniqueIds(page.hero, page.consult);
      staleTwin();
      staleTwinSubmit({ preventDefault() {} });
      await attemptEverything(page);

      assert.equal(page.env.requests.length, 1);
      const { url, body } = page.env.requests[0];
      assert.equal(url, ENDPOINT);
      assert.equal(body.customer_id, FORM.customerId);
      assert.equal(body.site_id, FORM.siteId);
      assert.equal(body.source_provider, FORM.sourceProvider);
      assert.deepEqual(body.form_data, {
        ...VALID,
        projectBudget: budget,
        qualified,
        disqualification_reason: qualified ? null : "budget_under_1m",
        route_slug: inst.route,
      });

      const route = { form_route: inst.route };
      const tail = qualified ? ["qualified_lead"] : [];
      assert.deepEqual(page.env.megaTag, ["form_submit", ...tail].map((event) => ({ event, ...route })));
      assert.deepEqual(page.env.dataLayer, ["form_submission", ...tail].map((event) => ({ event, ...route })));
      assert.match(ctx.q.text(), THANK_YOU);
      // attemptEverything refilled the twin with EDITED + a qualified budget.
      assert.doesNotMatch(twin.q.text(), THANK_YOU);
      assertLockedNotBusy(twin);
      assert.equal(notice(twin).props.role, undefined, "twin notice never announced");
      assertRetained(twin, EDITED, QUALIFIED_BUDGET);
      assert.equal(page.env.session.getItem(MARKER_KEY), "attempted", "marker kept after acceptance");
      assert.deepEqual(Object.keys(page.env.session.entries()).sort(), [HOOK_SESSION_KEY, MARKER_KEY].sort());
      assertNoPii(page.env);
    });
  }
}

test("tracking that throws cannot unlock: no second request or event attempt", async () => {
  const page = openPage();
  page.env.trackingThrows = true;
  page.env.responders.push(transport.json(200, { ok: true }));
  fill(page.hero);
  const stale = page.hero.q.button().props.onClick;
  await click(page, page.hero);
  assert.match(page.hero.q.text(), THANK_YOU);
  stale();
  await attemptEverything(page);
  assert.equal(page.env.requests.length, 1);
  assert.equal(page.env.megaTag.length, 1, "first trackEvent threw; never repeated");
});

test("accepted, then same-tab reload: no success replay, no resend", async () => {
  const first = openPage();
  first.env.responders.push(transport.json(200, { ok: true }));
  fill(first.hero);
  await click(first, first.hero);
  assert.equal(first.env.requests.length, 1);

  const reload = openPage(createEnv({ session: first.env.session }));
  assertNoSuccess(reload.env, reload.hero, reload.consult);
  assertNotice(reload.hero, "previous", { announced: false });
  assertLockedNotBusy(reload.hero);
  fill(reload.hero);
  await attemptEverything(reload);
  assert.equal(reload.env.requests.length, 0);
});

// ─── Unconfirmed outcomes lock both cards for the session ───

for (const [name, responder] of Object.entries(FAILURES)) {
  test(`unconfirmed (${name}): honest alert, values kept, both cards locked`, async () => {
    const page = openPage();
    page.env.responders.push(responder);
    fill(page.hero);
    const stale = page.hero.q.button().props.onClick;
    await click(page, page.hero);

    assert.equal(page.env.requests.length, 1);
    assertNoSuccess(page.env, page.hero, page.consult);
    assertUnconfirmed(page.hero, { announced: true });
    assertRetained(page.hero);
    assertLockedNotBusy(page.hero);
    assertUnconfirmed(page.consult, { announced: false });
    assertLockedNotBusy(page.consult);

    stale();
    await attemptEverything(page);
    assert.equal(page.env.requests.length, 1, "no second POST from either card");
    assertNoSuccess(page.env, page.hero, page.consult);
    assertNoPii(page.env);
  });
}

// ─── Stored-but-unconfirmed: never resent, now or later ───
// leadPlatformModel() stores the first request, then loses its confirmation.
// It is an in-memory model, not the endpoint; it shows that this client never
// sends the second request, not anything about server-side deduplication.
const LOST_CONFIRMATIONS = { "network rejection": transport.networkError, "malformed JSON": transport.malformed };

for (const [name, lose] of Object.entries(LOST_CONFIRMATIONS)) {
  test(`stored-but-unconfirmed (${name}): immediate, >2 min, remount and reload never resend`, async (t) => {
    t.mock.timers.enable({ apis: ["Date"] });
    const platform = leadPlatformModel();
    const page = openPage();
    page.env.responders.push(platform.persistThenLose(lose()));
    fill(page.consult);
    await click(page, page.consult);
    assert.equal(platform.rows.length, 1, "first request was stored");
    assertUnconfirmed(page.consult, { announced: true });

    await attemptEverything(page);
    t.mock.timers.tick(MERGE_WINDOW_MS + 1);
    await attemptEverything(page);

    const FormCard = freshPage();
    const remounted = card(FormCard, CONSULT, page.env);
    assertNotice(remounted, "previous", { announced: false });

    const reload = openPage(createEnv({ session: page.env.session }));
    assertNotice(reload.hero, "previous", { announced: false });
    assertLockedNotBusy(reload.consult);
    await attemptEverything(reload);

    assert.equal(page.env.requests.length + reload.env.requests.length, 1, "one POST in total");
    assert.equal(platform.rows.length, 1);
    assertNoSuccess(page.env, page.hero, page.consult);
    assertNoSuccess(reload.env, reload.hero, reload.consult);
  });
}

test("in-app remount after unconfirmed: still locked, not re-announced", async () => {
  const page = openPage();
  page.env.responders.push(transport.networkError());
  fill(page.hero);
  await click(page, page.hero);
  assertUnconfirmed(page.hero, { announced: true });
  page.env.focused = null;

  const remounted = card(page.FormCard, HERO, page.env); // same module state
  assertUnconfirmed(remounted, { announced: false });
  assert.equal(page.env.focused, null, "focus not stolen on remount");
  assertLockedNotBusy(remounted);
  fill(remounted);
  remounted.q.button().props.onClick();
  await settle(remounted.card);
  assert.equal(page.env.requests.length, 1);
});

test("server render (real react-dom/server): idle form, no notice, no storage access", () => {
  for (const inst of INSTANCES) {
    const html = renderOnServer(inst.props);
    assert.match(html, new RegExp(`id="${inst.props.idPrefix}-firstName"`));
    assert.doesNotMatch(html, /submit-error|data-notice/);
    assert.doesNotMatch(html, /<button[^>]*\sdisabled=""/, "button enabled in server HTML");
    assert.doesNotMatch(html, /type="submit"/);
  }
});

test("same-tick clicks on both cards reach the hook once; sibling is never left 'sending'", async () => {
  const page = openPage();
  const pending = transport.deferred();
  page.env.responders.push(pending);
  fill(page.hero);
  fill(page.consult, DISQUALIFYING_BUDGET);
  const heroClick = page.hero.q.button().props.onClick;
  const consultClick = page.consult.q.button().props.onClick;
  heroClick();
  consultClick();
  heroClick();
  consultClick();
  await settleAll(page);
  assert.equal(page.env.requests.length, 1);
  assert.equal(page.env.requests[0].body.form_data.route_slug, "/");
  assert.match(page.hero.q.text(), /Sending/);
  assert.doesNotMatch(page.consult.q.text(), /Sending/);
  assert.equal(page.consult.q.button().props.disabled, true);

  pending.resolve(500, {});
  await settleAll(page);
  assertUnconfirmed(page.hero, { announced: true });
  assertUnconfirmed(page.consult, { announced: false });
  assertLockedNotBusy(page.consult);
  assert.equal(page.env.requests.length, 1);
});

test("rapid clicks on one card before re-render send exactly one request", async () => {
  const page = openPage();
  const pending = transport.deferred();
  page.env.responders.push(pending);
  fill(page.hero);
  const staleClick = page.hero.q.button().props.onClick;
  staleClick();
  staleClick();
  staleClick();
  await settleAll(page);
  assert.equal(page.env.requests.length, 1);
  assert.equal(page.hero.q.button().props.disabled, true);
  assert.equal(notice(page.hero), undefined, "no notice while sending");

  pending.resolve(200, { ok: true });
  await settleAll(page);
  staleClick();
  await settleAll(page);
  assert.equal(page.env.requests.length, 1);
  assert.equal(page.env.megaTag.length, 2);
  assert.equal(page.env.dataLayer.length, 2);
});

// ─── Marker storage is required before sending ───

for (const [name, make] of Object.entries(brokenStorage)) {
  test(`storage refusal (${name}): nothing sent, distinct pre-send fallback`, async () => {
    const page = openPage(createEnv({ session: make() }));
    fill(page.consult);
    await click(page, page.consult);
    assert.equal(page.env.requests.length, 0, "hook never invoked");
    assertNoSuccess(page.env, page.hero, page.consult);
    const text = assertNotice(page.consult, "storage-unavailable", { announced: true });
    assert.match(text, /wasn.t sent/);
    assert.doesNotMatch(text, /couldn.t confirm|may already/, "no unconfirmed-receipt wording");
    assertRetained(page.consult);
    assert.equal(notice(page.hero), undefined, "other card unaffected");
  });
}

test("a retained marker blocks even when in-memory state is idle", async () => {
  const session = memoryStorage();
  const page = openPage(createEnv({ session }));
  assert.equal(notice(page.hero), undefined, "nothing attempted yet");
  session.setItem(MARKER_KEY, "attempted"); // e.g. written by another same-session page load
  fill(page.hero);
  await click(page, page.hero);
  assert.equal(page.env.requests.length, 0);
  assertNotice(page.hero, "previous", { announced: true });
  assertNoSuccess(page.env, page.hero);
});
