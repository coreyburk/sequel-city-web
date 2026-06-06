# WP-144: Student Clue Feedback And Mastermind Employment Tie-Break

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-05

## Objective

Make repeated evidence collection clear and non-disruptive, enforce clue-specific logging where the case requires it, and complete the Mastermind reasoning path with an Employment-based tie-break after EventRegistration leaves both candidates viable.

## Why This WP Exists

Manual review after WP-143 exposed a connected set of learner-facing defects that were outside its original browser-hardening scope:

1. Only the most recently logged row showed a green confirmation, even when a query required collecting multiple rows.
2. Incorrect button feedback was truncated.
3. Logging clues frequently moved the student to Evidence Board or cleared the active query/results, creating unnecessary back-and-forth work.
4. The confession step accepted any row from the killer's transcript instead of the row that directly admitted the murder.
5. Guidance sometimes disclosed completed query details instead of scaffolding the student toward the next query.
6. The final suspect theory control was subtle and often required entering a name that the interface had already supplied.
7. EventRegistration did not resolve the Mastermind: both shortlisted women attended all three December 2022 Symphony events.
8. The case already contained a wealth/paid-hit clue and Employment data that could provide a meaningful final comparison, but that path was not represented in the Student Mode state machine.

## Scope

### In Scope

- provide visible success and error state on the selected `Log Clue` button
- preserve successful button states for queries that require multiple clues
- use concise incorrect-selection text such as `Try Again`
- keep Query Lab, the query editor, and result rows stable while the student collects related clues
- stop automatically moving to Evidence Board after routine clue logging
- add guidance that tells the student when to review collected clues on Evidence Board
- require the direct confession transcript row for the hired-killer confession milestone
- keep guidance scaffolded and avoid revealing completed answer queries or exact filter lists prematurely
- persist pinned identity SSNs for the final Mastermind comparison
- treat the three shared Symphony registrations as opportunity evidence rather than identity proof
- add an `employment-cross-check` Mastermind phase
- guide the student to compare both candidates in Employment using pinned SSNs, Salary, and CompanyName
- withhold the final Mastermind theory panel until the Employment comparison is ready
- present collected names as theory choices and show explicit negative feedback for an incorrect theory
- update focused unit and Playwright coverage for the full progression

### Out of Scope

- changing the correct hired killer or Mastermind
- changing database seed records
- modifying backend SQL execution or restricted-table security
- redesigning unrelated Student Mode screens
- adding a new scoring, grading, or persistence system
- changing WP-141, WP-142, or WP-143 acceptance decisions

## SSOT References

- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

## Files Allowed To Change

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeApi.ts`
- focused browser harness/configuration files needed for deterministic headed and headless execution
- this work-package document

Do not modify:

- `apps/api/**`
- database migrations or seed data
- answer-key or restricted-table policy
- unrelated work-package documents

## Required Behavior

### Clue Logging

- A correctly logged row changes its button to a persistent green `Clue Logged` state.
- An incorrect row changes its button to a red `Try Again` state.
- Multi-row evidence queries retain green state on every successfully logged required row.
- Logging a clue does not automatically navigate away from Query Lab.
- The current query and results remain available when additional rows from the same result set must be logged.
- Guidance can direct the student to Evidence Board without forcing the navigation.

### Clue Validation

- Witness and event bundles only mark the rows actually accepted by progression logic.
- The hired-killer confession milestone requires the transcript row that directly admits the killing.
- Other killer transcript rows return corrective feedback and do not advance the milestone.

### Query Scaffolding

- Guidance identifies the table, relevant columns, and evidence relationship without supplying the completed answer query.
- Pinned Facts and Query Tokens update when the progression phase changes.
- The query editor may preload a table-level starter such as `SELECT * FROM Employment`, but not the completed filters.

### Mastermind Tie-Break

- EventRegistration shows that both shortlisted women attended the three December 2022 Symphony events.
- Guidance explicitly explains that this proves opportunity but does not identify the Mastermind.
- Both candidate identity notes include SSN values from PersonsOfInterest.
- The next phase guides the student to Employment using both pinned SSNs.
- Employment results expose Salary and CompanyName so the student can apply the wealthy paid-hit clue.
- The final Mastermind theory panel is unavailable until both candidate SSNs have been used in Employment.
- The theory panel lists collected names as choices.
- An incorrect choice produces a visible negative response and does not close the case.
- Selecting Miranda Priestly after the Employment comparison reaches `Mastermind Confirmed`.

## Acceptance Criteria

- [x] Correct and incorrect `Log Clue` selections have visible button-level feedback.
- [x] Incorrect button text fits without truncation.
- [x] Multi-row clue success states persist across all accepted rows.
- [x] Routine clue logging does not force an Evidence Board navigation.
- [x] Query and result state remain stable during repeated clue collection.
- [x] The confession milestone rejects non-confession transcript rows.
- [x] Guidance uses hints and scaffolding instead of completed answer queries.
- [x] EventRegistration leaves both Mastermind candidates viable.
- [x] Candidate SSNs are available in Pinned Facts and Query Tokens.
- [x] Employment is the explicit final tie-break phase.
- [x] The final theory panel is gated on the Employment comparison.
- [x] Collected-name choices replace unnecessary final free-text entry.
- [x] Incorrect theory selection produces visible negative feedback.
- [x] Focused unit tests pass.
- [x] Headed Playwright verification passes.
- [x] Headless Playwright verification passes.
- [x] The web production build passes.

## Code Prompt

Implement WP-144 as a focused extension of the accepted WP-143 progression:

1. Track button-level clue logging feedback by result row and support persistent multi-row success state.
2. Keep accepted evidence collection in Query Lab without clearing the active result set unless the next phase truly requires a new table.
3. Validate milestone-specific evidence, especially the direct confession row.
4. Keep guidance instructional: provide table/column/evidence hints and pinned-value tokens, not completed answer queries.
5. Add the Employment tie-break phase using SSNs obtained from the two pinned Mastermind identities.
6. Gate the final Mastermind theory check until the Employment query compares both candidates.
7. Present collected-name theory choices with clear positive and negative verdict feedback.
8. Add focused unit and browser regression coverage.

## Code Results

Implemented:

- Added per-row `Log Clue` feedback state with green `Clue Logged` and red `Try Again` presentation.
- Added multi-row persistence mode so all accepted Symphony event rows and other required bundles retain success state.
- Kept clue logging in Query Lab for repeated evidence collection and preserved the active query/results.
- Added guidance directing students to Evidence Board for review without forcing a tab change.
- Restricted the confession milestone to the direct admission row.
- Updated guidance and drafts to scaffold table-level next steps without inserting completed filter queries.
- Added SSN capture to Mastermind identity notebook entries and exposed SSN tokens in Case File and the Employment briefing.
- Added `employment-cross-check` to the Mastermind endgame state machine.
- Updated EventRegistration fixtures so both candidates attend all three Symphony events.
- Added Employment fixtures that distinguish the wealthy candidate through Salary and CompanyName.
- Gated the final Mastermind theory panel until both pinned SSNs are used in Employment.
- Added collected-name radio choices and negative theory feedback.
- Hardened Playwright startup and browser fixtures for deterministic headed/headless verification.
- Fixed QueryRunner and QueryResultsTable test typing so the web production build succeeds.

## Verification

Completed on 2026-06-05:

- `npm run test --workspace apps/web`
  - Passed: 13 files, 170 tests.
- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryResultsTable.test.tsx`
  - Passed: 2 files, 67 tests.
- `npm run test:browser:headed --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run test:browser --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run build --workspace apps/web`
  - Passed.

Final audit rerun on 2026-06-06:

- `npm run test --workspace apps/web`
  - Passed: 13 files, 170 tests.
- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryResultsTable.test.tsx src/useStudentCaseState.upsert.test.tsx`
  - Passed: 3 files, 68 tests.
- `npm run test:browser:headed --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run test:browser --workspace apps/web`
  - Passed: 4 tests, 1 intentionally skipped legacy invalid walkthrough.
- `npm run build --workspace apps/web`
  - Passed.

## Audit Prompt

Audit WP-144 for progression correctness, instructional quality, UI feedback consistency, and regression risk.

Verify:

1. Button feedback accurately represents the row that was accepted or rejected.
2. Multi-row success state persists without incorrectly marking unrelated rows.
3. Logging clues does not cause disruptive navigation or destroy result state needed for the next clue.
4. The direct confession row is required for confession progression.
5. Guidance provides scaffolding without disclosing completed answer queries.
6. EventRegistration correctly leaves both women viable and does not falsely identify the Mastermind.
7. Employment uses pinned SSNs and the wealth clue to create a meaningful final comparison.
8. The final theory panel is gated until Employment evidence is available.
9. Collected-name choices include the relevant candidates and incorrect choices produce visible negative feedback.
10. Headed and headless browser tests cover the full valid progression through `Mastermind Confirmed`.
11. No backend, database, or restricted-table behavior changed.

## Audit Results

I have completed the audit of **WP-144**. The implementation successfully meets all acceptance criteria and properly completes the Mastermind reasoning path.

### Audit Summary: PASS

1. **Button Feedback:** Verified. Row-specific feedback is accurate and clearly presented via the `rowLogFeedbacks` state map in `QueryResultsTable.tsx`.
2. **Multi-Row Success:** Verified. Success states correctly persist for all required rows in "multi" mode.
3. **Clue Logging Navigation:** Verified. Successful clue logging keeps the student in Query Lab and retains the current query/results, removing disruptive jumps to Evidence Board.
4. **Confession Progression:** Verified. `isDirectKillerConfessionTranscript` properly restricts the confession milestone to the specific direct admission transcript row.
5. **Guidance Scaffolding:** Verified. Guidance provides instructional hints about tables and filters rather than disclosing the fully formed answer queries.
6. **EventRegistration Feint:** Verified. Browser-test mocks confirm both shortlisted candidates attended all three December 2022 Symphony events, preserving the mystery.
7. **Employment Tie-Break:** Verified. The Employment data sets up a clear contrast (Salary/CompanyName) that perfectly leverages the "wealth/paid-hit" clue.
8. **Final Theory Gating:** Verified. `StudentSuspectTheoryPanel` is correctly hidden until the Employment phase is engaged.
9. **Collected Names Feedback:** Verified. The theory check correctly uses collected-name choices, and selecting an incorrect candidate produces proper negative feedback without prematurely closing the case.
10. **Browser Tests:** Verified. E2E tests (`student-mode.spec.ts`) cover the full correct sequence through the "Mastermind Confirmed" state.
11. **Backend Integrity:** Verified. No backend files, restricted-table logic, or database structures were modified.

### Final Review Corrections

The 2026-06-06 closeout review found and corrected two guidance/state issues before acceptance:

1. Removed stale EventRegistration copy and `COUNT`/`GROUP BY` tokens that told the student to find a stronger repeated EventPersonID even though both candidates attend all three events.
2. Tightened the Employment transition so it requires both candidate EventPersonIDs and all three pinned Symphony EventIDs. Partial EventRegistration comparisons now remain in the registration phase.

### Residual Risk

- The intentionally invalid legacy Mastermind walkthrough remains skipped. The supported confirmed-trigger progression is covered by the active headed and headless browser tests.

## Final Decision

Accepted.

Reason: WP-144 provides consistent row-level clue feedback, preserves the student's working context, validates milestone-specific evidence, and adds a coherent Employment tie-break before the final Mastermind theory. The final review removed contradictory EventRegistration guidance and prevented premature Employment advancement. All required web tests and the production build pass.
