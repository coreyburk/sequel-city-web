# WP-317 Confirm a pinned identity clue

## Objective and scope
In Case 001 v3, confirming the suspect identity automatically pins the PersonID. Clicking Log Clue on that row or repeating the identity lookup should acknowledge the saved clue and preserve the next milestone. The reported preview returned HTTP 422 after four proved milestones.

## Impact and acceptance criteria
Use the attempt's earned facts and the existing canonical row validator. Scope the confirmation to the selected row of the owning attempt. Preserve the normal rejection path for unearned clues and the existing requirements for interview evidence. Existing saved attempts must work on rerun. No schema or seed changes.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-317-confirm-pinned-identity-clue.md`
- `apps/api/src/services/caseAttemptService.ts`
- `apps/web/tests/browser/case-001-full-resolution.spec.ts`

## Code Prompt
Return the existing duplicate-clue outcome for a canonical identity already proved. Display the current authored direction after a repeat lookup.

## Audit Prompt
Check row identity, ownership, stale revisions, duplicate handling, incorrect rows and continued progression. Verify both initial and repeated clicks in the browser.

## Code Results
API type check passed. The packaged SQL launcher suite passed all six browser tests. The live Case 001 walkthrough verified confirmation immediately after identity proof and after running the query again, four milestones after either click, HTTP 422 for a different person, and completion at six milestones. The exclusive runner restored the registered workspace and restarted the preview.

## Audit Results

Verdict: PASS

Auditor: AntiGravity

### Audit Verification Summary

- **Row Identity**: Confirmed. In [`CaseAttemptService.query`](apps/api/src/services/caseAttemptService.ts#L294-L307), `proof.pinnedIdentity = true` is set strictly for single-row queries (`data.rows.length === 1`) that either match `case001.suspect-identity` via [`evaluateFullCase001`](apps/api/src/services/case001FullResolutionService.ts#L35-L38) and [`canonical004`](apps/api/src/services/caseAttemptService.ts#L274), or (on repeat lookups) match the attempt's already earned `PersonID:suspect` in `before.facts`, target `PersonsOfInterest`, and pass canonical validation. Evidence logging in [`CaseAttemptService.evidence`](apps/api/src/services/caseAttemptService.ts#L345-L348) is bound to `input.rowIndex === 0`; all other row indices fall through and reject with HTTP 422.
- **Ownership**: Confirmed. [`CaseAttemptService.snapshot`](apps/api/src/services/caseAttemptService.ts#L92-L95) enforces attempt ownership via [`CaseRuntimeRepository.loadOwnedAttempt`](apps/api/src/repositories/caseRuntimeRepository.ts#L86-L87), throwing HTTP 404 for non-owners. [`CaseRuntimeRepository.action`](apps/api/src/repositories/caseRuntimeRepository.ts#L138-L142) filters actions by `WHERE AttemptId = @attemptId AND ActionId = @actionId`, rejecting mismatched action attempts with HTTP 422.
- **Stale Revisions**: Confirmed. In [`CaseAttemptService.evidence`](apps/api/src/services/caseAttemptService.ts#L346), stale submissions are immediately caught: `if (before.revision !== input.expectedRevision) throw new CaseRuntimeError(409, "Saved progress changed. Review the latest attempt.");`.
- **Duplicate Handling**: Confirmed. When clicking "Log row 1 as evidence" on an already proved identity, [`CaseAttemptService.evidence`](apps/api/src/services/caseAttemptService.ts#L345-L348) returns `before` (HTTP 200) without inserting duplicate evidence or bumping revision. The web client recognizes `updated.revision === s.revision` in [`useCaseAttempt.ts`](apps/web/src/useCaseAttempt.ts#L108), displays `"This clue is already logged."`, and assigns `data-log-feedback="duplicate"` in [`StudentQueryLab.tsx`](apps/web/src/components/student/StudentQueryLab.tsx#L125-L126). Repeat lookups return structured feedback (`title: "Clue already logged"`) displaying the current authored task direction. Repeated clicks return HTTP 200 with unchanged progress.
- **Incorrect Rows**: Confirmed. Non-matching `PersonID` queries fail identity match and do not set `proof.pinnedIdentity`. Logging an incorrect row throws HTTP 422 (`"Refine and re-execute before logging a selectable row."`).
- **Continued Progression**: Confirmed. Progress remains 4/6 completed upon identity clue logging/repetition. The learner continues seamlessly to milestone 5 (interview statement lookup in `InterviewLog`) and milestone 6 (culprit verification), completing the full 6-task case.
- **Browser Verification**: Confirmed. The Playwright browser test [`case-001-full-resolution.spec.ts`](apps/web/tests/browser/case-001-full-resolution.spec.ts#L123-L140) was executed against real SQL Server in the packaged launcher environment via `invoke-single-database-test.ps1 -Task Launcher -PackageLaunch`. All 6 browser tests passed (`6 passed (12.2s)`), verifying initial click (HTTP 200, completed: 4, `data-log-feedback="duplicate"`), repeat query feedback (`"Clue already logged"`), repeated click (HTTP 200, completed: 4, `data-log-feedback="duplicate"`), incorrect person rejection (HTTP 422), and final resolution at 6 milestones.

### Regressions
None. All 26 API test suites and the full packaged launcher integration test suite passed cleanly.

### Scope Violations
None. Only the permitted files were modified:
- [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts)
- [`case-001-full-resolution.spec.ts`](apps/web/tests/browser/case-001-full-resolution.spec.ts)
- [`WP-317-confirm-pinned-identity-clue.md`](docs/01-work-packages/WP-317-confirm-pinned-identity-clue.md)
root agent idle; waiting up to 30m0s for 1 background task(s)

## Final Decision
Rejected after independent PASS. The human clarified on 2026-11-04 that a clue must first be logged by the student. The audited first-click duplicate shortcut will not be integrated.
