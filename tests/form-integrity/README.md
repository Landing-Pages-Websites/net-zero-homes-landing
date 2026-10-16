# FormCard submission-integrity tests

Regression coverage for the lead form's result handling: only an explicit
`{ ok: true }` from the lead endpoint counts as a captured lead.

## Node suite (no extra dependencies)

```bash
node --test tests/form-integrity/*.test.mjs
```

`harness.mjs` transpiles the **real** `src/components/FormCard.tsx`,
`src/hooks/useMegaLeadForm.ts` and `src/lib/content.ts` with the project's
`typescript` package and runs them on a tiny hooks runtime that keeps React's
closure semantics (a handler captured from one render sees that render's
state), so rapid clicks before a re-render are reproducible.

Transport is fully isolated: `fetch` is a scripted fake and MegaTag/dataLayer
are in-memory recorders. Nothing is sent anywhere.

Covers: empty/invalid input, accepted qualified/unqualified on both cards,
network rejection, HTTP 500, `{ok:false}`, malformed JSON, missing/null/string
`ok`, null and primitive bodies, rapid clicks, failure → failure → success,
throwing analytics, independent hero/consult instances, and ambiguous
outcomes (below).

## Ambiguous outcomes and retry deduplication

A request can be stored by the lead platform while its confirmation is lost
(network drop, malformed body). The form then shows "We couldn't confirm your
request", keeps the visitor's details, and allows a retry. It does not claim the
request "wasn't sent", because it may have been.

The retry relies on the lead platform's documented merge rule, from
https://docs.gomega.ai/landing-pages/form-submission-guide#repeated-test-leads-and-the-shared-phone :

> The lead platform merges a form submission into an earlier lead on the same
> site when the two share a phone or email and arrive within **2 minutes**. That
> is how one submission reported twice (a double click, the tag plus a webhook, a
> redelivery) becomes one lead.
>
> A submission after the window creates its own row and never modifies an
> earlier lead.

A retry resends the same site ID, phone and email, so a retry inside 2 minutes
merges into the stored lead. The hook (`src/hooks/useMegaLeadForm.ts`) has no
idempotency key, and the documented contract does not define one, so this
change does not add one.

Limits:

- **This is bounded deduplication, not exactly-once.** A retry more than
  2 minutes after a stored-but-unconfirmed request creates a second lead row.
  The test `documented limit: a retry after the 2-minute window is a second
  lead` shows this.
- `leadPlatformModel()` in `harness.mjs` is an in-memory **model** of the
  documented rule. These tests show how the real FormCard and real hook behave
  *under that contract*: 2 requests, 1 modeled lead, the original modeled ID
  returned (the hook's optional `id`; FormCard does not read it),
  and no thank-you or conversion events until an explicit `{ ok: true }`, then
  exactly one event set per destination. They do **not** prove how the endpoint
  is implemented. Deployed accepted-path checks and readback happen separately.

## Browser fixture

`browser-fixture.js` is a single `async (page) => {...}` Playwright function
for the real rendered page (both cards). It aborts every request that is not
same-origin with `FIXTURE_BASE_URL` (optimizer, GTM, Meta, CTM never load),
answers the lead endpoint with scripted responses, and records MegaTag/dataLayer
in-page. It returns a JSON report of lead-request counts, events, alert text,
focus and retained values. Set `FIXTURE_SHOT_DIR` for desktop/mobile
failure-state screenshots.

`FIXTURE_BASE_URL` defaults to a local `next start -p 3417`. It can also
point at the deployed URL, with the same isolation.
