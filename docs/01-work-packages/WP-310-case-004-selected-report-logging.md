# WP-310: Case 004 selected report logging

## Objective
Accept the correct selected murder report from a mixed returned set and use accurate collected-facts wording.

## Scope
Remove only Case 004 report-isolation's result-count gate. A selected canonical report must still match earned CrimeID and authored city/date. Query execution alone does not prove isolation. Update Pinned Facts to Facts you have collected, retaining insertion guidance. Align the result-table prompt with row selection.

## Impact Analysis
Required Case 004 progression analysis. Graph present at HEAD 322e5e0, refreshed after WP-309; source authoritative. collectCase004 report-isolation rejects rows.length != 1 before validating selection. CaseAttemptService already loads owned/nonexpired server query rows, verifies canonical evidence, current step, revision and prerequisites, then stores collection proof. Reuse those boundaries; no frontend proof, SQL/content or migration change. Affected layers: protected API collection/action persistence, selected-row feedback and shared reference presentation. Upstream: server-executed report queries; downstream: ReportID facts, notebook and witness guidance. Targeted graph nodes confirm collectCase004, CaseAttemptService and ProtectedCasePresentation with one-hop containment edges; source verifies the call/transaction relationships. Existing parity matrix requires selecting/logging a matching target report and only forbids broad execution alone, consistent with this correction. Refresh four graph artifacts after shared progression changes. Preserve pending shared-file work and account for it during audit.

### Regression Surface

- Related tests:
- case004ProgressionService.test.ts, caseAttemptService.test.ts, caseRuntimeAuthoring.test.ts, StudentQueryLab.test.tsx and case-004-selected-report.spec.ts.
- scripts/tests/test-case-runtime-bootstrap.ps1 includes both complete Case 004 releases and selected-row handoff.

## Files Allowed to Change
- docs/01-work-packages/WP-310-case-004-selected-report-logging.md
- docs/15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md
- apps/api/src/services/caseRuntimeAuthoring.test.ts — same shared-handler feedback expectation only; retain wrong-row refusal and SQL-authored case proof checks
- apps/api/src/services/caseAttemptService.test.ts — update the broad-result feedback expectation to evidence-ready while retaining the no-query-proof check
- apps/api/src/services/caseAttemptService.ts — bounded inspection-to-selected-report handoff
- apps/api/src/services/case004ProgressionService.ts
- apps/api/src/services/case004ProgressionService.test.ts
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/tests/browser/case-004-selected-report.spec.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: SQL/data, Case 001, other Case 004 gates, dependencies, credentials or unrelated WPs. Copy only changed application files to existing preview checkout; restart verified owned primary/preview services as necessary without changing data. Destructive SQL tests use only the registered single workspace and restore saved preview state.

## Constraints
Selected rows still require returned ReportID, earned murder CrimeID and matching city/date; canonical/live/source/owner/revision/expiry/current-step checks remain in the service. Wrong assault rows and fabricated/foreign/stale candidates cannot progress. Query-only inspection is not selected proof. Preserve full sixteen-step progression and both content versions. No new clone or reset of the primary database.

### Supporting handoff correction

Source tracing also found that report-inspection proves itself on query execution, leaving its displayed rows tied to the prior step. Permit only a current report-isolation step that directly depends on that proved inspection action to consume the same owned canonical candidates. Require the source action to be the persisted inspection proof. Do not rewrite query action history or reuse unrelated/foreign/stale results. This scoped service correction is necessary to avoid an identical rerun before selecting visible evidence.

## Required Behavior
1. Clicking the correct row in the three-row city/date result produces green confirmation, pins ReportID, saves the report and advances to witness observations.
2. Incorrect rows do not advance; no selection means no proof. Duplicate logging does not add distinct evidence.
3. Pinned Facts begins Facts you have collected. Click one to insert it into the query editor.
4. Result-table instructions allow reading and selecting a relevant row without claiming a SQL single-row filter is mandatory for this log task.

## Acceptance Criteria
Focused tests cover correct mixed-result selection, wrong crime/city/date, absent prerequisite and missing selected row. Real SQL full progression tests cover both Case 004 versions with wrong-row refusal and selected correct report from broad city/date results. Live browser reproduces the screenshot query, confirms visible success, next guidance, notebook/pinned persistence after reload and revised copy. Web/API tests/builds pass, graph/diff checks pass, one test database only.

## Code Prompt
Implement the user's reported correction and wording, verify, and update running primary/preview app source without modifying their datasets. No audit/acceptance/commit/push.

## Audit Prompt
Check selected-row evidence identity, preserved canonical/current-step/prerequisite/expiry/revision guards, false selections, idempotency, full Case 004 parity and reference wording. Account for pending shared-file prerequisites; no mixed HEAD diff presented as isolated scope.

## Code Results
Implemented selected-report isolation without the extra result-count restriction. Matching earned CrimeID plus authored city/date and a returned ReportID still applies. The service preserves live canonical validation, ownership, expiry, current-step and revision checks. Added the bounded handoff for the immediately preceding proved report-inspection action into its directly dependent selected-report task; action history is not rewritten. Unrelated/stale/foreign candidates cannot use the handoff. Other Case 004 gates remain unchanged.

Pinned Facts now says Facts you have collected. Click one to insert it into the query editor. Result-table prompt now directs selection of the relevant returned row rather than requiring narrowing first. The parity matrix documents selected-row isolation.

Validation:
- 229 web tests and web/API builds passed (outputs/wp310-web-all.log, wp310-web-build.log, wp310-api-build.log); API unit suite passed (outputs/wp310-api-all.log). Added pure validator coverage for mixed results, wrong crime/city/date, absent prerequisite, missing selection and repeated same-record rows.
- scripts/tests/test-case-runtime-bootstrap.ps1 passed in its final run (outputs/wp310-runtime-verified.log). Includes both full sixteen-step Case 004 content-version paths and controlled verifier roles, correct selection after wrong-row refusal, immediate inspection-result handoff, stale/foreign/literal candidates, saved collections/resume, repository/CSRF/revision boundaries, current Case 001 proof and SQL-authored reusable-case coverage. Earlier runs exposed old narrow-results expectations in durable-attempt and authoring fixtures; scoped corrections retain their no-query-only-proof/wrong-row checks.
- Live browser regression passed against primary http://127.0.0.1:5173 and preview http://localhost:27077 (outputs/wp310-main-browser-final.log and wp310-preview-browser.log). Reproduces three city/date report rows, rejects the assault row, accepts ReportID 10975 directly from the first inspection result with green feedback, advances to witness observations, checks revised drawer copy, and verifies pinned/notebook evidence and 3/16 progress after reload. Live tests use independent browser ownership/attempts, without changing existing users' saved attempts or public case content.
- Graph refresh/readiness and diff checks passed. Tracked generated API build output restored to prior state. Only one SQL test workspace was used, with the existing backup/restore wrapper; primary public evidence was not reset or migrated.

Operationally updated the four scoped application files in the existing preview checkout and restarted matching repository-owned primary/preview services. A stale retained launcher PID did not identify the active primary launcher; the active launcher was matched by exact repository script and process creation time before stopping its descendants. A first browser attempt overlapped the launcher's dependency reinstall and failed to load Playwright; it passed after dependency installation completed. Source behavior needed no change for that environment race. Both applications are running with the correction. Previous rejected logging attempts need to be retried after reload/rerun.

No independent audit, human acceptance, commit or push. Shared-file prerequisites remain pending and must be accounted for in an isolated audit comparison.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
