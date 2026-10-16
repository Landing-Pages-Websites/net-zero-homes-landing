# FormCard submission-integrity tests

## Current acceptance: no resend of an unconfirmed submission

This supersedes the earlier "retryable error" contract, which released the
guard after a failed POST so the visitor could send again. That retry
behavior and its tests (failure → retry → success, retry inside the
2-minute merge window) were removed. Director ruling, quoted from the task:

> Current director decision: do not resend an unconfirmed submission. This
> decision supersedes only the earlier requirement to release the guard and
> permit a POST retry after every failure, including the
> failure→success/another-failure acceptance cases. Pre-dispatch
> invalid/empty input remains correctable and retryable.

The current contract, as implemented in `src/components/FormCard.tsx`,
`src/components/submissionAttempt.ts` and `src/components/SubmissionNotice.tsx`:

1. **Validation first.** Empty or invalid input sends nothing, claims
   nothing, and stays correctable. It can be submitted once fixed.
2. **One attempt per browser session, shared by both cards.** After
   validation, `beginAttempt()` synchronously claims a single page-wide
   attempt shared by the hero and consultation cards. It writes and reads back
   a non-PII `sessionStorage` marker (`nzc_lead_attempt:<siteId>` =
   `attempted`) **before** the unchanged `useMegaLeadForm` hook is called.
   Same-tick clicks on either card can only reach the hook once.
3. **Storage refused, nothing sent.** If the marker cannot be written or read
   back (throwing `setItem`, silently ignored write, throwing `getItem`,
   inaccessible `sessionStorage`), the hook is not called. The card says
   "Your request wasn't sent" and offers the existing phone number.
4. **Only `{ ok: true }` confirms.** Thank-you plus the existing
   `form_submit`/`form_submission` (and `qualified_lead` when qualified)
   events fire once. Every other result or throw is **unconfirmed**: the
   spinner clears, the entered details stay, and the originating card shows
   and focuses a `role="alert"` notice tied to the form by `aria-describedby`.
   The notice says receipt couldn't be confirmed, that it may already have
   reached the team, and offers the existing phone number. There is no
   retry/resend wording or button. The other card shows the same notice,
   without announcing it, and is locked too. It is never left "Sending…".
5. **The lock is permanent for the session.** Time (including past the
   2-minute merge window), edited fields, the other card, remounts, same-tab
   reloads and back navigation do not release it. After a reload the cards
   show "You already started a request from this page". The marker never
   implies a confirmed success, and there is no reset or resend control. The
   marker is also kept after an accepted response.

**This is a local, conservative client policy, NOT server-side or global
exactly-once delivery.** It doesn't cover separate browsing sessions, other
devices, or cleared browser state. The lead endpoint has no idempotency key,
and this change does not add one or claim backend deduplication. Any future
UX that safely re-POSTs an ambiguous submission needs a real lead-endpoint
idempotency contract (owner: Instrumentation / lead API).

`src/hooks/**` and `src/lib/**` are byte-identical to `main`.

## Node suite (no extra dependencies)

```bash
node --test tests/form-integrity/*.test.mjs
```

`harness.mjs` transpiles the **real** `FormCard.tsx`, `submissionAttempt.ts`,
`SubmissionNotice.tsx`, `useMegaLeadForm.ts` and `content.ts` with the
project's `typescript` package. It runs them on a tiny hooks runtime that keeps
React's closure semantics (a handler captured from one render sees that
render's state), so rapid and same-tick clicks before a re-render are
reproducible.

- `freshPage()` reloads the module graph, so the attempt store starts over
  like a real page load. No reset export exists in production code.
- `createEnv()` is a separate browsing session with its own `sessionStorage`.
  `createEnv({ session: previous.session })` is a same-tab reload that keeps
  the marker.
- Transport is fully isolated: `fetch` is a scripted fake and
  MegaTag/dataLayer are in-memory recorders. Nothing is sent anywhere.
- `leadPlatformModel()` is an in-memory stand-in that stores a request and
  then loses the confirmation. It counts what reached it. It is not the
  endpoint and proves nothing about server-side deduplication.

Covered:

- empty and invalid input: no request, no marker, then corrected → one accepted POST
- accepted qualified/unqualified on each card, each in a fresh session:
  payload, IDs, source, qualification, route; exactly one event set per
  destination; marker kept; no PII in storage; the twin card blocked
- unconfirmed outcomes: network rejection, HTTP 500, 200 `{ok:false}`,
  malformed JSON, missing/null/string/numeric `ok`, null and primitive
  bodies. Each keeps its values, clears busy, shows an honest focused alert
  and emits zero success events. Resends from both cards (stale and fresh
  handlers, edited fields, native submit) stay at one POST.
- stored-but-unconfirmed (network, malformed): resend attempts immediately
  and after the clock passes 2 minutes, remount, and fresh-module reload all
  stay at one POST and zero success events
- same-tick clicks on both cards, rapid clicks on one card
- tracking that throws cannot unlock or repeat events
- accepted then reload: no success replay, no resend
- storage refusal variants: zero requests and the distinct pre-send notice
- a retained marker blocks even when in-memory state is idle
- in-app remount after an unconfirmed outcome: still locked, not re-announced, focus not stolen
- server render with the real `react-dom/server`: idle form, no notice, enabled button, no storage access

Not covered here: real client hydration, StrictMode and real focus behavior.
Those belong to the browser fixture and the post-deploy browser gate.

## Browser fixture

`browser-fixture.js` is a single `async (page) => {...}` Playwright function
for the real rendered page (both cards). **Each scenario runs in a separate
fresh browser context**, or a new tab if contexts can't be created. A new
tab also has fresh `sessionStorage`. Scenarios never clear or fake the
marker. Reload and back steps inside a scenario reuse that scenario's tab on
purpose.

It aborts every request that is not same-origin with `FIXTURE_BASE_URL`, so
the optimizer, GTM, Meta and CTM never load. It answers the lead endpoint
with scripted responses and records MegaTag/dataLayer in-page. It also queues
an `{ok:true}` after every unconfirmed response, so any resend would show up
as an extra request and success events. It returns a JSON report of
lead-request counts, events, notice kind/role/text, focus, busy state and
retained values per scenario. Set `FIXTURE_SHOT_DIR` for desktop (1440) and
mobile (360) screenshots of the confirmed, unconfirmed, sibling-locked,
previous-attempt and storage-refused states.

`FIXTURE_BASE_URL` defaults to a local `next start -p 3417`. It can point at
the deployed URL with the same isolation.

## History

The retry-era evidence for review rounds 2 and 3 is kept unchanged
outside the repo (`evidence/r2-*`).
