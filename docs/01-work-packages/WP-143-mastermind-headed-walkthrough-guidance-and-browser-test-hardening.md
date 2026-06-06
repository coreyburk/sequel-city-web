# WP-143: Mastermind Headed Walkthrough Guidance And Browser Test Hardening

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-03

## Objective

Repair the Student Mode Mastermind browser walkthrough and the underlying event-row logging experience so learners can follow the real confirmed-trigger progression, log all three December 2022 Symphony rows without rerunning the query, and receive explicit EventRegistration handoff guidance.

## Why This WP Exists

A headed Playwright walkthrough of the Mastermind progression exposed that the current long browser test is not reliably testing the actual Mastermind state machine.

Observed commands:

- `npm run test:browser:headed --workspace apps/web -- tests/browser/student-mode.spec.ts -g "walks the shortlist into identity and event-trail guidance" --project=chromium`
  - Result: failed before running because this repo has no named `chromium` Playwright project.
- `npm run test:browser:headed --workspace apps/web -- tests/browser/student-mode.spec.ts -g "walks the shortlist into identity and event-trail guidance"`
  - Result: failed after 60 seconds waiting for `Close Case File`.
  - The captured headed screenshot showed the app still in `Witness trail unlocked`, with `5/8 clues logged`, and guidance telling the student to test the first suspect theory, not to follow the Mastermind event trail.
- `npm run test:browser:headed --workspace apps/web -- tests/browser/student-mode.spec.ts -g "lets students log multiple mastermind transcript clues"`
  - Result: passed.
  - This confirms the headed browser can reach the valid Mastermind entry path when Jeremy is confirmed first.

Follow-up manual walkthrough on 2026-06-04 exposed two additional learner-facing problems after the corrected December 2022 Symphony query:

- When the student logs one of the three returned December 2022 Symphony `EventSchedule` rows, the Query Results are cleared and the app moves away from Query Lab. To log all three rows, the student has to rerun the same `EventSchedule` query repeatedly.
- After the Symphony rows are found and logged, the visible Guidance does not advance clearly. The actionable instruction exists only as vague Query Runner copy: "Good. You found the Symphony event rows that fit the killer's meeting clue. Carry their EventIDs into EventRegistration next." The header/current-step surfaces continue to repeat the broader EventSchedule rationale instead of showing an explicit next query shape.

## Findings

1. The long event-trail browser test manually repeats the pre-Mastermind setup but intentionally does not confirm Jeremy Bowers before it starts asserting Mastermind event-trail guidance.
2. Because Jeremy is not confirmed, the app can remain in the earlier first-suspect/witness-trail state while the test continues issuing later Mastermind queries.
3. Several key guidance checks are wrapped in `try/catch` and treated as optional, so absent or stale guidance does not fail the walkthrough.
4. `closeCaseFile` assumes a `Close Case File` button is always available after `openCaseFile`, but the headed failure captured a state where the test waited for that button while the visible UI showed only the collapsed Case File rail.
5. The current browser coverage is therefore too forgiving to prove that the learner sees the correct sequence:
   - confirm hired killer
   - query Jeremy's Mastermind transcript
   - narrow DriversLicense candidates
   - resolve both identities
   - query `EventSchedule` with December 2022
   - add `EventName LIKE '%Symphony%'`
   - carry returned EventIDs into `EventRegistration`
   - confirm Miranda Priestly as mastermind
6. EventSchedule row logging is not batch-friendly. Logging one of the three Symphony rows clears or hides the result set, forcing repeated query execution to pin the remaining rows.
7. Post-Symphony guidance is too vague for the next action. It should explicitly tell the student to query `EventRegistration` using both returned `PersonID` values and the returned Symphony `EventID` values.

## Scope

### In Scope

- harden the browser harness for deterministic Case File open/close behavior
- replace the invalid event-trail test setup with the real confirmed-trigger path, likely by reusing `solveThroughTriggerCheck` or `buildFullMastermindProfile`
- remove optional `try/catch` wrappers around required Mastermind guidance assertions
- assert the headed-observed guidance and query sequence at each Mastermind phase
- verify the December 2022 date-only query returns the broad December candidate set before the Symphony predicate narrows to the 3 intended rows
- preserve `EventSchedule` query results while the student logs multiple Symphony event rows, or provide an equivalent multi-row logging path that does not require rerunning the same query
- update post-Symphony guidance so the primary header/current-step/Query Runner surfaces clearly point to the next `EventRegistration` query using both candidate `PersonID` values and the returned Symphony `EventID` values
- preserve the WP-141/WP-142 behavior and do not rework backend query security in this package

### Out of Scope

- changing Mastermind case content or answer data
- redesigning the Student Mode UI
- altering backend query execution or restricted-table policy
- broad visual redesign of the Case File drawer
- changing which December 2022 Symphony rows are valid evidence

## SSOT References

- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

## Files Allowed to Change

Allowed:

- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/studentModeApi.ts`
- `apps/web/src/components/student/StudentWorkbenchView.tsx` only if the Case File drawer has an actual accessibility/control defect that cannot be fixed in the harness
- `apps/web/src/useStudentCaseState.ts` only if the headed walkthrough proves a real guidance-state defect after the test uses the correct confirmed-trigger path
- `apps/web/src/studentCase.ts` only if the headed walkthrough proves a real guidance-copy defect after the test uses the correct confirmed-trigger path
- focused frontend/browser tests directly tied to the corrected walkthrough
- `docs/01-work-packages/WP-143-mastermind-headed-walkthrough-guidance-and-browser-test-hardening.md`

Do Not Modify:

- `apps/api/**`
- database migrations or seed data
- unrelated work-package docs
- generated Playwright artifacts or `dist` output

## Constraints

- The browser walkthrough must fail when required Mastermind guidance is missing or stale.
- The test must not issue Mastermind event-trail queries while the app is still in the first-suspect/witness-trail state.
- The harness must close Case File using a user-realistic path that works in headed and headless runs.
- Optional assertions are allowed only for explicitly nonessential UI affordances, not for the main guidance/query path.
- Keep changes focused on test reliability and confirmed Mastermind progression evidence.
- Logging one row from a multi-row evidence result must not make the remaining rows unreachable without rerunning the query.
- The main student guidance surfaces must not leave the learner in a completed EventSchedule instruction after the Symphony rows have already been found.

## Required Behavior

- The event-trail browser test begins Mastermind work only after the first suspect is confirmed.
- After both Mastermind identity rows are pinned, the visible guidance points to `EventSchedule` and the December/Symphony clue chain.
- A date-only query such as `SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%'` shows the broad December candidate set.
- The next guidance instructs adding the Symphony predicate.
- `SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%'` returns the 3 intended rows.
- The student can log all 3 Symphony rows from that result set without rerunning the query after each row.
- After the Symphony rows are found or logged, the next guidance instructs using the returned EventIDs and both returned candidate PersonIDs in `EventRegistration`.
- The guidance should include enough query shape to be actionable, for example: stay in `EventRegistration`, filter by the Symphony `EventID` values, and include both candidate `EventPersonID`/`PersonID` values.
- Final theory confirmation reaches `Mastermind Confirmed` with no stale first-suspect shell content.

## Acceptance Criteria

- [x] The headed Mastermind event-trail walkthrough uses the valid confirmed-trigger progression.
- [x] Required guidance assertions are deterministic and no longer hidden behind broad `try/catch` fallbacks.
- [x] Case File open/close behavior is stable in headed and headless browser runs.
- [x] The browser test explicitly covers December 2022 broad filtering before Symphony narrowing.
- [x] The browser test verifies all 3 Symphony rows can be logged without rerunning the Symphony query between logs.
- [x] The browser test explicitly covers the EventRegistration handoff after Symphony rows are found.
- [x] Header/current-step/Query Runner guidance advances from EventSchedule discovery to an explicit EventRegistration query instruction after the Symphony rows are available.
- [x] Focused browser verification passes in headed mode.
- [x] Standard browser verification passes in headless mode.

## Code Prompt

Implement WP-143 by correcting the Mastermind browser walkthrough to use the valid confirmed-trigger progression, hardening Case File browser interactions, preserving the three-row Symphony result set during clue logging, and advancing visible guidance from EventSchedule to an actionable EventRegistration handoff.

Keep the package focused on browser validity, multi-row Symphony evidence collection, and progression guidance. Do not redesign the broader clue-feedback or final-theory experience in this package.

## Implementation Plan

Expected approach:

1. Refactor the event-trail browser test to use the same confirmed-trigger setup as the passing headed Mastermind transcript test.
2. Replace optional Mastermind guidance checks with required assertions after the correct state is reached.
3. Update `closeCaseFile` to close via the visible close button when present, otherwise use a documented outside-click or toggle fallback that asserts the drawer is closed.
4. Add explicit assertions for:
   - post-identity EventSchedule guidance
   - December 2022 date-only query result count
   - Symphony narrowing query result count and feedback
   - ability to log all three Symphony EventSchedule rows without rerunning the query
   - EventRegistration handoff
   - final `Mastermind Confirmed` shell
5. Inspect `useStudentCaseState.ts` EventSchedule logging behavior. Current code calls `setStudentView("case-board")` after logging an EventSchedule row, which appears to clear or hide results and likely causes the repeated-query problem.
6. Update guidance derivation so logged/found Symphony event rows produce an explicit EventRegistration next-step message in primary surfaces, not only a vague Query Runner success line.
7. Run focused headed Playwright verification.
8. Run standard headless browser verification.

## Code Results

Implemented:

- Reworked the long Mastermind browser walkthrough so it confirms Jeremy Bowers before asserting Mastermind guidance.
- Hardened the Playwright runner and Case File harness for deterministic headed and headless execution.
- Added required assertions for the December 2022 broad query, Symphony narrowing, three-row logging, EventRegistration handoff, and final Mastermind confirmation.
- Preserved the active EventSchedule result set while all three Symphony rows are logged.
- Updated primary guidance surfaces and Query Tokens when the event-trail phase advances.
- Removed stale or optional assertions that allowed the browser test to pass from an invalid progression state.

## Verification

Completed:

- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryResultsTable.test.tsx`
  - Passed: 2 files, 67 tests.
- `npm run test:browser:headed --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run test:browser --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run build --workspace apps/web`
  - Passed.

## Scope Split

The implementation and headed walkthrough uncovered additional learner-facing defects after the original WP-143 requirements were complete. Those changes are related to the same progression but exceed this package's stated test-hardening and EventSchedule-to-EventRegistration scope.

The following work is tracked separately in WP-144:

- persistent success/error state on individual `Log Clue` buttons across multi-row evidence collection
- shorter `Try Again` button feedback for incorrect row selections
- keeping the student in Query Lab after logging clues instead of forcing repeated Evidence Board navigation
- preserving the active query and result set while multiple clues are collected
- validating that the confession row directly admits the killing instead of accepting any suspect transcript row
- replacing subtle free-text theory submission with collected-name choices and visible negative feedback
- recognizing that EventRegistration leaves both Mastermind candidates tied
- adding an Employment/SSN wealth-clue tie-break before the final Mastermind theory check
- expanding Query Runner, Case File, Pinned Facts, and browser fixtures for that Employment phase

## Audit Prompt

Audit WP-143 for browser-test validity, Mastermind progression accuracy, guidance/query coherence, and scope compliance.

Verify:

1. The browser walkthrough cannot pass while still in the first-suspect/witness-trail state.
2. The test confirms Jeremy before expecting Mastermind guidance.
3. Required guidance and query handoffs are asserted, not swallowed as optional.
4. Case File close behavior works in headed and headless runs.
5. December 2022 broad filtering and Symphony narrowing are both covered.
6. All three Symphony event rows can be logged from one result set without repeated query execution.
7. Guidance after finding/logging Symphony rows clearly instructs the EventRegistration query shape.
8. Final confirmation reaches a clean `Mastermind Confirmed` shell.

## Audit Results

Accepted.

Audit completed on 2026-06-05.
Re-reviewed with WP-144 on 2026-06-06.

Findings:

1. Progression validity: PASS. The headed walkthrough confirms Jeremy Bowers before entering the Mastermind path and cannot satisfy the later assertions from the witness or first-suspect state.
2. Browser harness stability: PASS. Case File open/close behavior works in both headed and headless runs.
3. December event sequence: PASS. Browser coverage verifies the 10-row December 2022 result before the Symphony predicate narrows the set to the 3 intended rows.
4. Multi-row Symphony collection: PASS. All 3 EventSchedule clues remain available and can be logged without rerunning the query.
5. EventRegistration handoff: PASS. Primary guidance surfaces advance from EventSchedule into EventRegistration and expose scaffolded tokens without preloading the completed answer query.
6. Verification: PASS. Focused unit tests, headed Playwright, headless Playwright, and the web production build pass.
7. Scope accounting: PASS with split. Additional clue-feedback, theory-choice, confession-validation, and Employment tie-break work is not attributed to WP-143 acceptance; it is documented in WP-144.
8. Follow-up compatibility: PASS. WP-144 preserves WP-143's valid confirmed-trigger walkthrough, three-row Symphony logging, and deterministic EventRegistration handoff.

Residual risk:

- The intentionally invalid legacy Mastermind walkthrough remains skipped. The supported confirmed-trigger walkthrough is covered in headed and headless browser runs.

## Final Decision

Accepted.

Reason: WP-143 now has deterministic headed and headless coverage for the valid Mastermind path, preserves the three Symphony results during clue collection, and provides a coherent EventRegistration handoff. Broader follow-up behavior is separated into WP-144 rather than silently expanding this package.
