# WP-140: Mastermind Progression

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-29

## Objective

Stabilize the final Student Mode mastermind progression so learners can follow the `EventSchedule` and `EventRegistration` trail through to the final mastermind confirmation without losing state, missing notebook evidence, or running into flaky browser-test behavior.

## Why This WP Exists

The late mastermind branch still had three practical problems after the earlier guidance passes:

- the final browser walkthrough was flaky when logging clue rows and advancing through the event trail
- `EventSchedule` evidence needed a stronger notebook contract so event clues could be pinned and revisited reliably
- the solved mastermind confirmation panel could be cleared by later cleanup state even after the student had completed the branch

This WP hardened the end of the mastermind investigation so the browser-validated student path reaches and keeps the final confirmed state.

## Scope

### In Scope

- refine mastermind query/token guidance around the Symphony clue path
- upsert `EventSchedule` notebook entries with a stable id and source label contract
- strengthen the browser harness for repeatable clue logging and late-branch progression
- preserve the final solved mastermind confirmation state after completion
- extend focused unit and browser coverage for the stabilized endgame
- document the accepted implementation, verification, and audit result in this WP

### Out of Scope

- backend or database-schema changes
- redesigning the overall mastermind investigation structure
- new student content outside the event-trail and final-confirmation branch
- broad browser-suite expansion beyond the failing mastermind progression path

## Files Allowed to Change

Allowed:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `docs/01-work-packages/WP-140-mastermind-progression.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- unrelated docs, scripts, or generated test artifacts

## Constraints

- keep the implementation within frontend/browser-test/doc scope
- preserve deterministic browser behavior under `VITE_TESTING`
- do not introduce production-only behavior changes just to satisfy tests
- keep notebook upsert behavior stable and explicit for event evidence

## Required Behavior

- the mastermind event trail must advance cleanly from `EventSchedule` and `EventRegistration` to final mastermind confirmation
- browser-test instrumentation must stay gated to testing behavior
- `EventSchedule` evidence must upsert into the notebook with:
  - id format `mastermind-event-<EventID>`
  - `sourceLabel: "EventSchedule"`
- the final mastermind confirmation UI must remain visible after the branch completes

## Acceptance Criteria

- [x] Student Mode progression supports the mastermind event trail through final confirmation
- [x] `EventSchedule` notebook upserts use the required id and source label contract
- [x] Browser-test harness interactions are stable enough for the late mastermind branch
- [x] The final mastermind confirmation panel remains visible after completion
- [x] Focused frontend and browser-test verification exists for the stabilized branch

## Implementation Summary

Implemented:

- replaced the literal `"Symphony Hall"` guidance token with `"Symphony"` and updated the SQL expectation to `EventName LIKE '%Symphony%'`
- added notebook upsert behavior in `useStudentCaseState.ts` so `EventSchedule` evidence is stored with id format `mastermind-event-<EventID>` and `sourceLabel: "EventSchedule"`
- strengthened `studentModeHarness.ts` with more reliable waits, scroll-into-view behavior, and fallback interaction handling for late-branch clue logging
- extended `tests/browser/student-mode.spec.ts` to drive the `EventSchedule` / `EventRegistration` trail through final mastermind confirmation
- preserved the solved suspect-theory result in `useStudentCaseState.ts` so the final confirmation panel is not cleared immediately after completion

## Files Changed

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `docs/01-work-packages/WP-140-mastermind-progression.md`

## Verification

- `VITE_TESTING=true npm run test:browser:headed --workspace apps/web -- tests/browser/student-mode.spec.ts -g "walks the shortlist into identity and event-trail guidance in a real browser"`
- Result: `1 passed`
- `VITE_TESTING=true npm run test:browser --workspace apps/web`
- Result: passed during closeout validation

## Audit Prompt

Audit WP-140 mastermind progression implementation for scope compliance, behavioral correctness, regression risk, and acceptance-criteria completion.

Verify:

1. The implementation stays inside the approved frontend/browser-test/doc scope.
2. Student Mode progression now supports the mastermind event trail through final confirmation.
3. The final mastermind confirmation UI is preserved instead of being cleared immediately after completion.
4. `EventSchedule` notebook upsert behavior matches the required id and source label contract.
5. Test-only instrumentation is gated to testing behavior and does not introduce production drift.
6. Focused validation evidence exists, including the targeted headed Playwright run and the full browser-suite validation under `VITE_TESTING=true`.

## Audit Results

Verdict: **APPROVED**

- Scope compliance: confirmed
- Behavioral correctness: confirmed
- Regression risk: low
- Production drift from test instrumentation: not detected

Verification summary:

1. Implementation remained within `apps/web` frontend, browser-test, and WP-doc scope.
2. The `Symphony` token / `EventName LIKE '%Symphony%'` path correctly supports the mastermind event trail.
3. `useStudentCaseState.ts` preserves the final solved result so the `Mastermind Confirmed` UI remains visible.
4. `useStudentCaseState.upsert.test.tsx` verifies the `mastermind-event-<EventID>` notebook contract with `sourceLabel: "EventSchedule"`.
5. Browser harness gating via `VITE_TESTING` keeps Playwright-only selectors and waits out of production behavior.
6. Targeted headed validation and the browser suite both passed for the stabilized branch.

## Final Decision

Accepted

Reason:
WP-140 successfully stabilized the late mastermind progression, preserved the final confirmation state, and added the notebook and browser-test hardening needed for repeatable endgame validation.
