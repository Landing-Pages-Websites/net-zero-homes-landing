// Regression tests for FormCard submission-result handling.
// Run: node --test tests/form-integrity/
import { test } from "node:test";
import assert from "node:assert/strict";
import { createEnv, loadSource, mount, query, settle, transport, ENDPOINT } from "./harness.mjs";

const { FormCard } = loadSource("components/FormCard.tsx");
const { DISQUALIFYING_BUDGET, BUDGET_OPTIONS, FORM } = loadSource("lib/content.ts");

const QUALIFIED_BUDGET = BUDGET_OPTIONS.find((o) => o !== DISQUALIFYING_BUDGET);
const VALID = {
  firstName: "Test",
  lastName: "MEGA QA",
  email: "qatest+fixture@gomega.ai",
  phone: "2125550147",
};
const INSTANCES = [
  { name: "hero", props: { idPrefix: "hero" }, route: "/" },
  { name: "consult", props: { idPrefix: "consult", routeSlug: "/#consultation" }, route: "/#consultation" },
];
const FAILURES = {
  "network rejection": transport.networkError(),
  "HTTP 500": transport.json(500, { ok: false, error: "db down: secret detail" }),
  "HTTP 200 {ok:false}": transport.json(200, { ok: false, error: "rejected: secret detail" }),
  "malformed JSON": transport.malformed(),
  "missing ok": transport.json(200, { id: "abc" }),
  "null ok": transport.json(200, { ok: null }),
  "null response": transport.json(200, null),
  "primitive true": transport.json(200, true),
  "string ok": transport.json(200, { ok: "true" }),
};
const THANK_YOU = /Thank you/;

function setup(instance = INSTANCES[0], env = createEnv()) {
  const card = mount(FormCard, instance.props, env);
  return { env, card, q: query(card), id: (k) => `${instance.props.idPrefix}-${k}` };
}

function fill(ctx, budget = QUALIFIED_BUDGET, values = VALID) {
  const { q, card, id } = ctx;
  for (const [k, v] of Object.entries(values)) {
    q.byId(id(k)).props.onChange({ target: { value: v } });
    card.render();
  }
  q.byId(id("projectBudget")).props.onChange({ target: { value: budget } });
  card.render();
}

async function click(ctx) {
  ctx.q.button().props.onClick();
  await settle(ctx.card);
}

function assertNoSuccess(env, q) {
  assert.equal(env.megaTag.length, 0, "no MegaTag events");
  assert.equal(env.dataLayer.length, 0, "no dataLayer events");
  assert.doesNotMatch(q.text(), THANK_YOU);
}

function submitError(q) {
  return q.alerts().find((n) => n.props.id?.endsWith("-submit-error"));
}

function assertRetryableError(ctx) {
  const { q, id, env } = ctx;
  const alert = submitError(q);
  assert.ok(alert, "submission error rendered with role=alert");
  assert.equal(alert.props.id, id("submit-error"));
  assert.equal(q.form().props["aria-describedby"], id("submit-error"), "form references the error");
  assert.equal(env.focused, id("submit-error"), "focus moved to the error");
  assert.doesNotMatch(q.text(), /secret detail|HTTP|status|Failed to fetch/i, "no backend details");
  assert.equal(q.button().props.disabled, false, "busy state cleared");
  assert.match(q.text(), /Request a Consultation/);
  for (const [k, v] of Object.entries(VALID)) {
    const expected = k === "phone" ? "(212) 555-0147" : v;
    assert.equal(q.byId(id(k)).props.value, expected, `${k} retained`);
  }
  assert.equal(q.byId(id("projectBudget")).props.value, QUALIFIED_BUDGET);
}

test("empty submit: no request, no events, focus first invalid field", async () => {
  const ctx = setup();
  await click(ctx);
  assert.equal(ctx.env.requests.length, 0);
  assertNoSuccess(ctx.env, ctx.q);
  assert.equal(ctx.env.focused, "hero-firstName");
  assert.equal(submitError(ctx.q), undefined);
});

test("invalid email and phone: no request, no events", async () => {
  const ctx = setup();
  fill(ctx, QUALIFIED_BUDGET, { ...VALID, email: "nope@", phone: "1115550100" });
  await click(ctx);
  assert.equal(ctx.env.requests.length, 0);
  assertNoSuccess(ctx.env, ctx.q);
  assert.equal(ctx.env.focused, "hero-email");
});

for (const inst of INSTANCES) {
  for (const qualified of [true, false]) {
    test(`${inst.name}: accepted ${qualified ? "qualified" : "unqualified"} lead emits exact events once`, async () => {
      const ctx = setup(inst);
      const budget = qualified ? QUALIFIED_BUDGET : DISQUALIFYING_BUDGET;
      ctx.env.responders.push(transport.json(200, { ok: true, id: "lead_1" }));
      fill(ctx, budget);
      await click(ctx);

      assert.equal(ctx.env.requests.length, 1);
      const { url, body } = ctx.env.requests[0];
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
      assert.deepEqual(ctx.env.megaTag, ["form_submit", ...tail].map((event) => ({ event, ...route })));
      assert.deepEqual(ctx.env.dataLayer, ["form_submission", ...tail].map((event) => ({ event, ...route })));
      assert.match(ctx.q.text(), THANK_YOU);
    });
  }
}

for (const [name, responder] of Object.entries(FAILURES)) {
  test(`failure (${name}): retryable accessible error, zero success signals`, async () => {
    const ctx = setup();
    ctx.env.responders.push(responder);
    fill(ctx);
    await click(ctx);
    assert.equal(ctx.env.requests.length, 1);
    assertNoSuccess(ctx.env, ctx.q);
    assertRetryableError(ctx);

    ctx.env.responders.push(transport.json(200, { ok: true }));
    await click(ctx);
    assert.equal(ctx.env.requests.length, 2, "retry sends a second request");
    assert.equal(ctx.env.dataLayer.length, 2, "form_submission + qualified_lead once");
    assert.match(ctx.q.text(), THANK_YOU);
  });
}

test("rapid clicks before re-render send exactly one request", async () => {
  const ctx = setup();
  const pending = transport.deferred();
  ctx.env.responders.push(pending);
  fill(ctx);
  const staleClick = ctx.q.button().props.onClick;
  staleClick();
  staleClick();
  staleClick();
  await settle(ctx.card);
  assert.equal(ctx.env.requests.length, 1);
  assert.equal(ctx.q.button().props.disabled, true);
  assert.equal(submitError(ctx.q), undefined, "no stale error while sending");

  pending.resolve(200, { ok: true });
  await settle(ctx.card);
  staleClick();
  await settle(ctx.card);
  assert.equal(ctx.env.requests.length, 1);
  assert.equal(ctx.env.megaTag.length, 2);
  assert.equal(ctx.env.dataLayer.length, 2);
});

test("failure -> failure -> success: one set of success events, error cleared", async () => {
  const ctx = setup();
  ctx.env.responders.push(transport.networkError(), transport.json(500, {}), transport.json(200, { ok: true }));
  fill(ctx);
  await click(ctx);
  assertRetryableError(ctx);
  await click(ctx);
  assertRetryableError(ctx);
  assertNoSuccess(ctx.env, ctx.q);
  await click(ctx);
  assert.equal(ctx.env.requests.length, 3);
  assert.equal(ctx.env.megaTag.length, 2);
  assert.equal(ctx.env.dataLayer.length, 2);
  assert.equal(submitError(ctx.q), undefined);
  assert.match(ctx.q.text(), THANK_YOU);
});

test("tracking that throws still locks accepted state; no second capture", async () => {
  const ctx = setup();
  ctx.env.trackingThrows = true;
  ctx.env.responders.push(transport.json(200, { ok: true }));
  fill(ctx);
  const staleClick = ctx.q.button().props.onClick;
  await click(ctx);
  assert.match(ctx.q.text(), THANK_YOU);
  assert.equal(submitError(ctx.q), undefined);
  staleClick();
  await settle(ctx.card);
  assert.equal(ctx.env.requests.length, 1);
  assert.equal(ctx.env.megaTag.length, 1, "first trackEvent threw; no repeat attempt");
});

test("independent instances: accepting hero does not lock consult", async () => {
  const env = createEnv();
  const hero = setup(INSTANCES[0], env);
  const consult = setup(INSTANCES[1], env);
  env.responders.push(transport.json(200, { ok: true }), transport.json(200, { ok: false }));
  fill(hero);
  fill(consult, DISQUALIFYING_BUDGET);
  await click(hero);
  await click(consult);
  assert.equal(env.requests.length, 2);
  assert.match(hero.q.text(), THANK_YOU);
  assert.doesNotMatch(consult.q.text(), THANK_YOU);
  assert.ok(submitError(consult.q));
  assert.deepEqual(env.dataLayer.map((e) => e.form_route), ["/", "/"]);
});
