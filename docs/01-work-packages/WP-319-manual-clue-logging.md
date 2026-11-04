# WP-319 Student-controlled clue logging

## Objective and impact
Separate finding a record from saving it. WP-317's audited behavior showed â€œAlready Loggedâ€ on a first click. Only an explicit log action should collect row details. In Case 001 v3, the student selects each clue before its milestone advances. Keep the legacy case versions, Case 004 analytical query milestones, ownership, canonical row validation, revision checks and stored progress.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-319-manual-clue-logging.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `apps/api/src/services/caseAttemptService.ts`
- `apps/api/src/services/case001FullResolution.test.ts`
- `apps/api/src/repositories/caseRuntimeRepository.ts`
- `apps/web/src/components/student/StudentQueryLab.tsx`
- `apps/web/tests/browser/case-001-full-resolution.spec.ts`

## Code Prompt
Remove automatic collection of query rows. Validate selected rows on the server. Preserve previously earned progress, allowing the first actual click to save a previously proved identity.

## Audit Prompt
Review fresh, repeated and historical clicks. Check that unclicked results cannot populate collected details, the first click persists one clue, repeated clicks preserve progress, and unrelated rows cannot complete the milestone. Verify Case 004 query-only comparisons and historical compatibility.

## Code Results
The API type check and registered SQL runtime suite with browsers passed. All 14 browser tests passed, including the Case 001 v3 and Case 004 walkthroughs. The Case 001 test asserts three milestones after the identity query, four after the first log, duplicate confirmation after rerunning with fewer columns, rejection of a different person, and successful completion at six milestones. The runner restored the workspace and retained the recovery backup.

## Audit Results

An independent audit of the student-controlled clue logging implementation in **WP-319** has been completed.

### Summary of Audit Findings

| Requirement | Status | Verification Summary |
| :--- | :--- | :--- |
| **Unclicked results cannot populate collected details** | **PASS** | [`ownedSnapshotData`](apps/api/src/repositories/caseRuntimeRepository.ts#L76-L80) strictly filters `ActionKind='log'`. Unclicked queries write `ActionKind='query'` and set `proof.selectableStep` rather than proving steps automatically. Because [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts#L116) derives `collectedDetails` from `collectedNotebookDetails(loggedRows ?? [])`, unclicked rows never enter collected details. Asserted in [`case001FullResolution.test.ts`](apps/api/src/services/case001FullResolution.test.ts#L54). |
| **First click persists one clue** | **PASS** | Clicking **Log Clue** on an eligible candidate row triggers [`CaseAttemptService.evidence`](apps/api/src/services/caseAttemptService.ts#L341-L408), which validates against canonical tables, writes one `app.AttemptAction` record (`ActionKind='log'`), persists `app.AttemptStepEvidence`, appends the summary to `workspace.notes`, and increments attempt revision. Progress advances by 1 milestone and the web client confirms with `data-log-feedback="logged"`. |
| **Repeated clicks preserve progress** | **PASS** | [`hasLoggedRow`](apps/api/src/repositories/caseRuntimeRepository.ts#L138-L146) matches repeats either by `SqlOrSubmission` / `rowIndex` or by canonical `clueKey`. For already-proved steps, [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts#L394) exits early without modifying notes, inserting actions, or bumping revision. [`useCaseAttempt.ts`](apps/web/src/useCaseAttempt.ts#L108) receives an unchanged revision, applies `data-log-feedback="duplicate"`, and displays `"This clue is already logged."` Progress remains preserved (e.g. 4/6 completed). |
| **Unrelated rows cannot complete milestones** | **PASS** | Queries from non-eligible sources omit selectable rows from `proof.rows`, and clicking log rejects with HTTP 422 (`"Refine and re-execute before logging a selectable row."`). Queries against expected tables returning non-matching data (e.g., a different person in `PersonsOfInterest` or a non-murder record in `CrimeType`) fail evaluation, throw HTTP 422, or log purely as general notebook notes without invoking `saveCollection` or advancing milestones. |
| **Case 004 query-only comparisons** | **PASS** | [`CASE004_HANDLERS`](apps/api/src/services/case004ProgressionService.ts#L4-L21) configures `report-inspection` and `attendance-comparison` with `mode: "query"`. Qualifying query executions directly prove the milestone via `AttemptStepEvidence` with `ActionKind='query'`. No rows are added to `workspace.notes` or `collectedDetails`, preserving Case 004 analytical milestone semantics. |
| **Historical compatibility** | **PASS** | Legacy Case 001 v1/v2 attempts encounter `EvidenceVersion` mismatch and throw HTTP 409 (`compatible: false` in summaries), preserving historical attempts. Older Case 001 v3 attempts can re-run queries to activate `proof.selectableStep` via [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts#L300-L310) to explicitly log past clues without duplicating milestones. Case 004 versions 1 and 2 remain supported, and old `"SQL City"` filters produce an explicit HTTP 422 redirection to `"Sequel City"`. |

---

### Key Verification Points

1. **Unclicked Queries & Collected Details**:
   - In [`caseRuntimeRepository.ts`](apps/api/src/repositories/caseRuntimeRepository.ts#L79), `SELECT CONVERT(VARCHAR(36),ActionId) ActionId,ProofJson FROM app.AttemptAction a WHERE a.AttemptId=@attemptId AND a.ActionKind='log'` excludes query actions.
   - In [`StudentQueryLab.tsx`](apps/web/src/components/student/StudentQueryLab.tsx#L114), the copy accurately specifies: *"Values from rows you selected with Log Clue. These details do not prove additional tasks."*

2. **Fresh vs. Repeated Click Flow**:
   - **Fresh click**: Matches `evaluateFullCase001` &rarr; forms `collection` &rarr; inserts `AttemptAction` and `AttemptStepEvidence` &rarr; bumps revision &rarr; UI updates state with `data-log-feedback="logged"`.
   - **Repeated click**: `hasLoggedRow` matches `(SqlOrSubmission=@actionId AND rowIndex=@rowIndex)` or `clueKey` &rarr; `collection` is null &rarr; returns `{ attemptId }` without revision bump &rarr; `useCaseAttempt.ts` detects `updated.revision === s.revision` &rarr; UI displays advisory notice `"This clue is already logged."` and `data-log-feedback="duplicate"`.

3. **Case 004 Analytical Milestones**:
   - Query-only validators (`report-inspection`, `attendance-comparison`) retain `matched = true` upon meeting analytical requirements without forcing the student to select a row.
   - Milestone progress advances directly from query execution while keeping the notebook free of synthetic row entries.

4. **Regression & Scope Review**:
   - All 230 web unit tests pass.
   - All 26 API unit/integration suites pass.
   - Both web and API TypeScript builds compile cleanly.
   - Changes are strictly confined to permitted files as documented in [`WP-319-manual-clue-logging.md`](docs/01-work-packages/WP-319-manual-clue-logging.md).

## Final Decision
Accepted by the human on 2026-11-04 after independent audit PASS. Approved for commit, merge and push to main.
