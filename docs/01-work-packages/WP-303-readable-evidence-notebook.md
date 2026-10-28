# WP-303: Readable evidence notebook

## Objective
Make logged clues readable and prevent repeated logging from duplicating notebook evidence.

## Scope
Correct notebook layout and duplicate handling in shared web presentation and server logging. Keep full narratives, distinct annotations and personal notes. Preserve the existing string-array workspace format.

## Impact Analysis
Required: shared API/web behavior. Graph available at HEAD 322e5e0, refreshed October 16 including pending WP-300/302 source. Targeted graph nodes identify caseAttemptService, ProtectedCasePresentation and CurrentCaseTask tests; source verifies the unconditional notebook push and compressed semicolon rendering. Source is authoritative over generated summaries. Preserve pending WP-300 edits. Ownership, transaction, validation and progression remain unchanged. Refresh the four graph artifacts after implementation. No SQL, migration or new dependencies.

## Files Allowed to Change
- docs/01-work-packages/WP-303-readable-evidence-notebook.md
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/styles.css
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: SQL/data, progression validators, unrelated pending work, dependencies. Preview may copy only changed application files to its existing checkout and restart its existing services without resetting or cloning the database.

## Constraints
Retain distinct narrative/annotation text and personal notes. Saved duplicate suppression is presentation-only. Server logging still validates and records actions within the existing transaction. No inferred conclusions or protected evidence exposure.

## Required Behavior
1. Separate evidence fields, wrap descriptions and remove repeated summary/body identifiers.
2. Display identical saved logged rows once without rewriting saved personal notes.
3. Avoid appending an identical row and annotation on repeated logging, including reordered columns.
4. Keep different rows, annotations and personal notes.

## Acceptance Criteria
Focused regressions cover full narrative readability, existing duplicate suppression, distinct/manual note retention and server repeated logging. Web tests and API/web builds pass. Existing preview displays updated UI. Graph/diff checks pass.

## Code Prompt
Implement this reported defect correction and record evidence. Do not audit, accept, commit or push.

## Audit Prompt
Check duplicate identity, readable complete narratives, annotation/manual-note retention, workspace compatibility and unchanged deterministic progression. Account for prerequisite WP-300 changes.

## Code Results
Implemented spaced label/value evidence entries with full wrapping narratives and no repeated summary/body. Identical saved evidence rows are hidden without rewriting workspace data. API logging compares full fields independently of column order, including matching annotations, before appending; distinct records, annotations and personal notes remain. No database or workspace-format changes.

Validation: all 226 web tests passed; final focused notebook suite (12 tests) passed after the final presentation guard. API service tests cover repeated rows, reordered columns, semicolons and annotations. API/web builds passed. Existing live Case 001 full-resolution browser proof passed against localhost:27077 (one test), using the same registered database. Logs: outputs/wp303-web-all.log, wp303-web-focused.log, wp303-api-focused.log, wp303-api-build.log, wp303-web-build.log and wp303-live-browser.log. Existing preview restarted with only the three changed application files copied to its checkout; saved data retained. Generated tracked API build output was reverted to its prior state. Graph refresh/readiness and diff checks passed.

No independent audit, human acceptance, commit or push. Audit must account for existing WP-300 changes in the same files; preview checkout now also contains this WP's three application changes.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
