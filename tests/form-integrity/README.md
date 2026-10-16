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
throwing analytics, and independent hero/consult instances.

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
