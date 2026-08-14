# WP-255 - Case 001 Live Metadata Blocker Investigation

## Objective

Diagnose and narrowly correct the accepted WP-254 live-stack blocker where `/api/query/execute` responds locally to the gated Case 001 fixture query but does not return `caseMilestoneEvaluation`, without adding Case 001 gameplay, release unlock, persistence, migrations, Query Lab integration, or answer-key exposure.

## Scope

### In Scope

- Reproduce or explain the WP-254 blocker using the focused Case 001 live-stack smoke command or an equivalent local API request.
- Determine whether the missing `caseMilestoneEvaluation` is caused by:
  - a stale API server/runtime using pre-WP-252 code,
  - request-body transport loss between Fastify route and `executeSafeQuery`,
  - backend guard behavior in `createCase001MilestoneEvaluation`,
  - result-pattern no-match behavior being misclassified as missing metadata,
  - local database fixture absence or mismatch,
  - or a smoke-test preflight classification issue.
- Add the narrowest deterministic API/backend contract test coverage needed to lock the discovered cause.
- If the defect is in current source code, apply the smallest backend/source fix needed for explicit enabled Case 001 milestone metadata to be returned on successful safe queries.
- If the defect is environmental or stale-runtime only, record that conclusion in Code Results and update only scoped test/runbook documentation if needed.
- Keep the WP-254 browser smoke as the live verification path for the fixed or explained behavior.

### Out of Scope

- No Case 001 release unlock.
- No new Case 001 gameplay, milestone progression, persistence, clue logging, evidence-board behavior, investigation threads, suspect verification, reset behavior, or Query Lab integration.
- No database seed, migration, schema, fixture, rebuild, or bootstrap behavior changes.
- No answer-key exposure, restricted-table exposure, hidden solution data, suspect names, or runtime AI.
- No package dependency changes or lockfile changes.
- No broad API rewrite, broad Playwright harness rewrite, or unrelated test cleanup.
- No Case 004 behavior changes.

## Impact Analysis

### Understand Status

- Graph available: Yes, `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` exist.
- Baseline commit: `f6c2f100a048b388b1bab3b5d0cc54c227748ba4`, from `.understand-anything/meta.json`.
- Current HEAD during planning: `9c604e5`.
- Freshness assessment: Usable with non-structural WP-254 closeout drift. WP-254 added the live smoke spec, testing docs, WP record, handoff refresh, and tracked graph refresh artifacts; the current graph contains the relevant `case-001-live-smoke.spec.ts`, query route, query execution service, Case 001 evaluator, and result-pattern surfaces. Source inspection remains authoritative because the graph metadata baseline records the pre-WP-254 closeout commit.
- Analysis performed: Verified clean `main` aligned with `origin/main`, read the latest handoff and workflow planning guidance, confirmed WP-255 as the next package number, inspected graph metadata and targeted graph hits for `queryRoutes`, `queryExecutionService`, `case001GatedMilestoneEvaluationService`, `case001ResultPatternService`, `case-001-live-smoke.spec.ts`, and `caseMilestoneEvaluation`, then verified current source/tests with `rg` and file reads.

### Affected Architecture

- Layers: Fastify query route transport, query execution service, Case 001 gated milestone evaluator, Case 001 result-pattern validator, live-stack browser smoke, and local runtime testing docs.
- Primary files/components:
  - `apps/api/src/routes/queryRoutes.ts`
  - `apps/api/src/routes/queryRoutes.test.ts`
  - `apps/api/src/services/queryExecutionService.ts`
  - `apps/api/src/services/queryExecutionService.test.ts`
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
  - `apps/api/src/services/case001ResultPatternService.ts`
  - `apps/api/src/services/case001ResultPatternService.test.ts`
  - `apps/web/tests/browser/case-001-live-smoke.spec.ts`
  - `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
  - `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- Upstream consumers: `POST /api/query/execute`, the gated Case 001 skeleton UI/API-client slice, and the opt-in WP-254 browser smoke.
- Downstream dependencies: SQL safety validation, restricted-table guard, SQL Server query execution, query result normalization, Case 001 result-pattern validation, and query history recording.

### Regression Surface

- Related tests: API route tests, query execution service tests, Case 001 gated evaluator tests, Case 001 result-pattern tests, API build, focused Case 001 browser smoke, and existing mocked Student Mode browser smoke where relevant.
- User workflows: gated Case 001 development/test entry path and first SQL feedback path; released Case 004 student flow should remain untouched.
- Security/data boundaries: SQL must still pass backend safety and restricted-table checks; Case 001 milestone metadata must remain non-progressing and non-spoiler; query history must not persist milestone metadata; no answer-key, restricted table, or suspect-verification exposure.

### Graph Update Decision

- Regeneration required: Yes, if implementation changes backend route/service/test files or the browser smoke spec.
- Rationale: This corrective WP may change API route/execution/evaluator behavior and test relationships. If source changes are made, the originating package can safely include tracked Understand graph artifacts to keep the architecture map current. If implementation proves the blocker is only stale local runtime with documentation/WP-only updates, Code Results may record why graph regeneration was unnecessary.

## Files Allowed to Change

Allowed:

- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/services/case001ResultPatternService.test.ts`
- `apps/web/tests/browser/case-001-live-smoke.spec.ts`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- `docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Closeout-only allowance:

- `docs/00-ssot/END-OF-DAY-HANDOFF.md` may be modified only during accepted-WP closeout.

Do Not Modify:

- `apps/web/src/App.tsx`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/types.ts`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCasePersistence.ts`
- `apps/web/src/hooks/useStudentCaseState.ts`
- `apps/api/src/server.ts`
- `apps/api/src/app.ts`
- `apps/api/src/services/queryHistoryService.ts`
- `apps/api/src/services/sqlSafetyService.ts`
- `apps/api/src/services/studentRestrictedTables.ts`
- `apps/api/src/db/**`
- `database/**`
- `database/migrations/**`
- `package.json`
- `package-lock.json`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/api/package-lock.json`
- `scripts/**`
- `.codex/**`

## Constraints

- Preserve existing behavior unless directly required to return explicit enabled Case 001 milestone metadata.
- Keep the correction deterministic and backend-owned.
- Do not make the frontend infer, synthesize, or repair missing milestone metadata.
- Do not weaken SQL safety, restricted-table blocking, query result normalization, or query history boundaries.
- Do not write milestone metadata to query history.
- Do not mutate local database state.
- Do not add migrations, seed scripts, fixture rows, or bootstrap behavior.
- Do not expose raw query result rows, answer keys, hidden validation details, suspect data, or restricted table content in UI assertions or docs.
- If the observed blocker is caused by a stale local API process or stale compiled output rather than current source, record that clearly and avoid unnecessary source changes.
- If a source fix is made, keep it to the minimum route/service/evaluator path needed and add focused regression coverage.

## Required Behavior

- The implementation must classify the live metadata blocker with evidence, not speculation.
- A successful safe query to `/api/query/execute` with:
  - `caseMilestoneEvaluation.caseId = "case-001"`
  - `caseMilestoneEvaluation.milestoneId = "case-001-clocktower-report-located"`
  - `caseMilestoneEvaluation.isSkeletonGateEnabled = true`
  must return `caseMilestoneEvaluation` when current source handles the request and the query succeeds.
- If the query result matches the Case 001 public clocktower report pattern, metadata must include `matched: true`, `runtimeStatus: "evaluated-no-progression"`, and `milestoneAdvanced: false`.
- If the query result does not match but the request is an explicit enabled Case 001 opt-in, metadata should be returned as evaluated no-match rather than omitted, unless an existing guard intentionally blocks evaluation before query execution.
- Metadata must remain omitted for missing opt-in, wrong case id, wrong milestone id, disabled skeleton gate, blocked SQL, restricted-table SQL, or failed SQL execution.
- The focused WP-254 smoke should either pass when local API/database prerequisites are available or produce a more accurate blocker than "metadata missing" if the remaining issue is fixture/data/runtime readiness.

## Acceptance Criteria

- [ ] The implementation records a concrete diagnosis for why WP-254 observed a response without `caseMilestoneEvaluation`.
- [ ] Current-source API route/service tests cover explicit enabled Case 001 opt-in through the route and prove metadata is returned on successful safe query execution.
- [ ] Current-source service tests still prove metadata is omitted for missing opt-in, disabled gate, wrong case, wrong milestone, blocked SQL, restricted SQL, and execution failure.
- [ ] If source code changed, the fix is limited to the scoped query route/execution/evaluator/result-pattern path.
- [ ] If no source code changed, Code Results explain why the blocker was stale-runtime/environmental and identify the exact rerun/startup requirement.
- [ ] The WP-254 browser smoke command is rerun or its rerun blocker is recorded exactly.
- [ ] No Case 001 release unlock, gameplay progression, persistence, clue logging, evidence board, suspect verification, Query Lab integration, migration, seed, dependency, or lockfile behavior is introduced.
- [ ] Query history remains free of Case 001 milestone metadata.
- [ ] Run `npm run test --workspace apps/api`.
- [ ] Run `npm run build --workspace apps/api`.
- [ ] Run the focused Case 001 live-stack smoke command when local API/database prerequisites are available, or record the exact remaining blocker.
- [ ] Run `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` to verify default skip isolation still works.
- [ ] Run Understand readiness/refresh/readiness if source or browser smoke files changed and graph regeneration remains required:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- [ ] Run `git diff --check`.
- [ ] Run the relevant work-package status and validation-plan helper scripts.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-255 exactly as specified.

Start by reading:

- `docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/services/case001ResultPatternService.test.ts`
- `apps/web/tests/browser/case-001-live-smoke.spec.ts`

Then:

1. Reproduce or explain the WP-254 live metadata blocker using the focused smoke command or an equivalent local API request. Do not mutate the database.
2. Determine whether the missing metadata comes from stale runtime, request-body transport, route guard behavior, service guard behavior, validator mismatch, fixture absence, or smoke-test classification.
3. Add the narrowest deterministic test that proves the route/service returns `caseMilestoneEvaluation` for explicit enabled Case 001 opt-in on successful query execution.
4. If current source is defective, make the smallest source fix in the allowed backend path.
5. Preserve omission behavior for missing opt-in, disabled gate, wrong case/milestone, blocked SQL, restricted SQL, and execution failure.
6. Improve the WP-254 smoke or runbook only if its blocker classification is materially misleading after diagnosis.
7. Run:
   - `npm run test --workspace apps/api`
   - `npm run build --workspace apps/api`
   - `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`
   - the opt-in Case 001 live smoke command when prerequisites are available, or record the exact blocker
   - Understand readiness/refresh/readiness if source or smoke files changed
   - `git diff --check`
   - work-package status and validation-plan helper scripts
8. Record Code Results with changed files, diagnosis, validation evidence, live smoke result or blocker, graph-refresh evidence or rationale for no refresh, and scope check.

Scope:

- Only modify files listed under `Allowed:`.
- Keep frontend runtime, Case 001 module/UI, backend database access, database scripts, package files, and lockfiles unchanged unless explicitly allowed.

Return:

- Diagnosis.
- Exact code/documentation changes.
- Tests run and results.
- Live-stack smoke pass evidence or exact remaining blocker.
- Any deviations from the allowed file list or acceptance criteria.

## Audit Prompt

Audit WP-255 against the implemented changes with an adversarial stance.

Verify:

- The diagnosis is evidence-backed and matches current source/runtime behavior.
- All changed files are in `Allowed:` and no `Do Not Modify:` boundary was touched.
- The correction, if any, is limited to the Case 001 metadata route/service/evaluator path.
- The route/service returns `caseMilestoneEvaluation` for explicit enabled Case 001 opt-in on successful safe query execution.
- Metadata remains omitted for missing opt-in, disabled gate, wrong case, wrong milestone, blocked SQL, restricted-table SQL, and execution failure.
- Query history still does not record `caseMilestoneEvaluation`.
- The WP-254 browser smoke is either passing under available prerequisites or reports a more accurate remaining blocker.
- No release unlock, gameplay progression, persistence, clue logging, evidence board, suspect verification, Query Lab integration, migration, seed, dependency, lockfile, answer-key exposure, restricted-table exposure, or runtime AI was introduced.
- Required validation and graph-refresh evidence is recorded, or graph refresh omission is justified by no source/smoke changes.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:

- Verdict: PASS, FAIL, or BLOCKED.
- Scope compliance.
- Diagnosis quality.
- Acceptance-criteria coverage.
- Runtime/data-boundary findings.
- Validation evidence and missing evidence.
- Drift risks or recommended follow-up.

## Code Results

Status: ImplementedNeedsAudit

Changed files:

- Updated `apps/api/src/routes/queryRoutes.test.ts`.
- Updated `apps/web/tests/browser/case-001-live-smoke.spec.ts`.
- Updated `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`.
- Updated `docs/11-testing-strategy/local-runtime-test-scenarios.md`.
- Refreshed tracked Understand graph artifacts:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`
- Updated this work-package record.

Diagnosis:

- The running local API at `http://127.0.0.1:3001` returned `success: true` for the WP-254 gated fixture query but omitted `caseMilestoneEvaluation`.
- Current-source API route/service behavior is correct: the new route-level regression test drives the request through `createQueryExecutionHandler` into `executeSafeQuery` with an explicit enabled Case 001 opt-in and verifies returned non-spoiler metadata with `matched: true`, `runtimeStatus: "evaluated-no-progression"`, and `milestoneAdvanced: false`.
- Existing service tests still prove metadata is omitted for missing opt-in, disabled gate, wrong case, wrong milestone, blocked SQL, restricted SQL, and execution failure, and that query history does not record milestone metadata.
- Therefore the observed missing-metadata blocker is not a current-source route/service defect. The most likely cause is a stale local API process or stale runtime using pre-metadata-transport code.
- A separate read-only local API probe for the exact Case 001 fixture row returned `rowCount: 0`, so after restarting the API from current source the next likely blocker may become missing local fixture data rather than missing metadata transport.

Implementation summary:

- Added a route-level contract test proving explicit enabled Case 001 metadata survives route-to-service transport and is returned by the query response.
- Left backend source behavior unchanged because current source already satisfies the metadata contract.
- Updated the WP-254 smoke blocker message to distinguish successful SQL execution with missing metadata from fixture absence and to instruct a current-source API restart before deeper diagnosis.
- Updated testing docs to clarify stale API/runtime handling for successful query responses that omit `caseMilestoneEvaluation`.

Validation evidence:

- PASS: Direct local API health probe, `GET http://127.0.0.1:3001/api/health/full`, returned `success: true`, database connected to `SequelCityCrimesDB`, and bootstrap `ready`.
- BLOCKER REPRODUCED: Direct local API POST to `/api/query/execute` with the WP-254 starter SQL plus explicit enabled Case 001 metadata returned `success: true`, `rowCount: 182`, and no `caseMilestoneEvaluation`.
- FIXTURE GAP OBSERVED: Direct local API POST to `/api/query/execute` for `CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City'` returned `success: true`, `rowCount: 0`, and no `caseMilestoneEvaluation` from the currently running API.
- PASS: `npm run test --workspace apps/api` completed successfully, including the new route-level metadata regression test.
- PASS: `npm run build --workspace apps/api` completed `tsc -p tsconfig.json`.
- PASS: default focused smoke isolation, `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`, completed with 1 skipped test because `CASE_001_LIVE_SMOKE` was not set.
- BLOCKER RECORDED: opt-in live-stack smoke, `$env:CASE_001_LIVE_SMOKE = "1"; $env:VITE_ENABLE_CASE_001_PLAYABLE_SKELETON = "true"; $env:VITE_API_BASE_URL = "http://127.0.0.1:3001"; npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`, completed with 1 skipped test and the explicit blocker `WP-254 live smoke blocker: Case 001 milestone metadata was not returned for the fixture query. Restart the local API from current source and rerun; if it still reproduces, the query route is dropping the caseMilestoneEvaluation transport.`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before graph refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=630`, graph assembly `nodes=1009`, `edges=379`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 630 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after graph refresh reported `READY`.
- PASS: `git diff --check` completed with no whitespace errors.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-255` reported `ImplementedNeedsAudit`, `Code results recorded: True`, and no out-of-scope dirty files.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-255` reported `ValidationEvidenceRecorded`, `Blocks audit readiness: False`, and no missing findings.

Scope check:

- No app runtime UI, Case 001 module, API source behavior, database, migration, seed, package, lockfile, persistence, Query Lab, suspect verification, answer-key, restricted-table, or runtime AI files were modified.
- `npm run build --workspace apps/api` rewrote tracked `apps/api/dist` generated output; those generated files were restored and are not part of the WP-255 diff.

## Audit Results

### Audit Report: WP-255 ΓÇö Case 001 Live Metadata Blocker Investigation

**Verdict:** **PASS**

---

### 1. Scope Compliance

| Area | Status | Notes |
| :--- | :---: | :--- |
| **Investigation & Boundary Focus** | **PASS** | Investigation was empirical and non-destructive. Added deterministic route-level test coverage and clarified smoke blocker messaging without adding gameplay progression, unlock mechanics, persistence, migrations, or database mutations. |
| **Allowed Files List** | **PASS** | All modified and untracked files are within the [`WP-255`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md) `Allowed:` list:<br>ΓÇó [`apps/api/src/routes/queryRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.test.ts)<br>ΓÇó [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts)<br>ΓÇó [`docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-Browser-Test-Guide.md)<br>ΓÇó [`docs/11-testing-strategy/local-runtime-test-scenarios.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/11-testing-strategy/local-runtime-test-scenarios.md)<br>ΓÇó [`docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md)<br>ΓÇó Tracked Understand artifacts (`.understand-anything/*`). |
| **`Do Not Modify:` Boundaries** | **PASS** | Zero protected files were touched. [`apps/web/src/App.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx), [`apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx), [`apps/api/src/server.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/server.ts), [`apps/api/src/app.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/app.ts), [`apps/api/src/services/queryHistoryService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryHistoryService.ts), database files, migrations, and package/lockfiles remained untouched. |
| **Dirty File Audit** | **PASS** | [`scripts/get-work-package-status.ps1 WP-255`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1) confirms `Out-of-scope dirty files: none`. |

---

### 2. Diagnosis Quality

- **Empirical Live Probe:** Probing the currently running local API on `http://127.0.0.1:3001` via `POST /api/query/execute` with starter SQL and explicit enabled Case 001 metadata confirmed HTTP 200 `success: true` with `rowCount: 182`, but omitted the `caseMilestoneEvaluation` property.
- **Source vs Runtime Discrepancy:** Inspection of current source in [`apps/api/src/routes/queryRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts#L46-L48) and [`apps/api/src/services/queryExecutionService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L115-L124) proved that current source code already forwards and returns `caseMilestoneEvaluation`.
- **Contract Verification:** The new route-level regression test in [`queryRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.test.ts#L75-L127) verified that calling [`createQueryExecutionHandler`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts#L24) with [`executeSafeQuery`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L34) and a valid Case 001 opt-in returns the non-spoiler milestone evaluation payload.
- **Next Blocker Identification:** A probe for the specific Case 001 clocktower report row (`CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City'`) returned `rowCount: 0`, accurately diagnosing that upon restarting the API from current source, the next live-stack requirement will be local database fixture presence.

---

### 3. Acceptance-Criteria Coverage

| Requirement / Acceptance Criteria | Status | Evidence / Analysis |
| :--- | :---: | :--- |
| Concrete diagnosis of missing metadata blocker | **PASS** | Evidence-backed finding recorded: stale local API runtime rather than a source route/service defect. |
| Current-source route test covers explicit Case 001 opt-in | **PASS** | Added test `route handler returns Case 001 metadata for explicit enabled milestone opt-in` in [`apps/api/src/routes/queryRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.test.ts#L75-L127). |
| Service tests prove metadata omission rules | **PASS** | Covered across [`apps/api/src/services/queryExecutionService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.test.ts) for: missing opt-in, disabled gate, wrong case (`case-004`), wrong milestone, blocked SQL (`DELETE`), restricted-table SQL (`dbo.Solution`, `dbo.CaseAnswerKey`), and execution failure. |
| Fix scoped to allowed path / no unneeded source changes | **PASS** | No unnecessary source changes made; source was verified correct. |
| Blocker message actionable and accurate | **PASS** | Updated [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts#L108-L115) and documentation to guide restarting the API from current source. |
| Query history remains free of milestone metadata | **PASS** | Verified via test assertion in [`queryExecutionService.test.ts:L274`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.test.ts#L274-L277). |
| No progression, persistence, unlock, or AI introduced | **PASS** | Confirmed zero persistence, release unlock, runtime AI, or answer-key exposure. |
| API build and unit test suites pass | **PASS** | `npm run test --workspace apps/api` (all 31 test suites pass) and `npm run build --workspace apps/api` (`tsc`) pass. |
| Default browser smoke isolation maintained | **PASS** | `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` skips cleanly when unflagged. |
| Understand graph refreshed and validated | **PASS** | [`scripts/check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) confirms `READY` with zero drift. |

---

### 4. Runtime & Data-Boundary Findings

1. **Transport Contract Verification:**
   - [`createQueryExecutionHandler`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts#L24) properly extracts [`QueryExecutionCaseMilestoneEvaluationRequest`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/query.ts) from the request body and passes it via [`QueryExecutionOptions`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L29) into [`executeSafeQuery`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L34).
2. **Evaluator Gate Integrity:**
   - [`createCase001MilestoneEvaluation`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L163) strictly guards evaluation on `caseId === "case-001"`, `milestoneId === "case-001-clocktower-report-located"`, and `isSkeletonGateEnabled === true`.
3. **Query History Isolation:**
   - [`addQueryHistoryRecord`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryHistoryService.ts) records only SQL text, row count, execution time, and outcome/error, strictly excluding milestone metadata.
4. **Smoke Blocker Precision:**
   - The updated preflight logic in [`classifyLiveStackReadiness`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts#L37-L136) clearly disambiguates a stale API process omitting metadata from fixture absence or failed query execution.

---

### 5. Validation Evidence

| Check / Verification Command | Result |
| :--- | :--- |
| Direct probe: `GET http://127.0.0.1:3001/api/health/full` | **PASS** (`SequelCityCrimesDB` connected, bootstrap `ready`) |
| Direct probe: `POST http://127.0.0.1:3001/api/query/execute` (Starter SQL + Case 001 metadata) | **REPRODUCED BLOCKER** (Executed SQL successfully, omitted `caseMilestoneEvaluation`) |
| Direct probe: `POST http://127.0.0.1:3001/api/query/execute` (Fixture SQL) | **OBSERVED FIXTURE GAP** (`rowCount: 0`) |
| `npm run test --workspace apps/api` | **PASS** (31 tests passed across all API test suites) |
| `npm run build --workspace apps/api` | **PASS** (`tsc -p tsconfig.json` clean; generated `dist` restored) |
| `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` (Default isolation) | **PASS** (1 test skipped) |
| Opt-in live smoke command (`CASE_001_LIVE_SMOKE=1`) | **PASS** (Correctly intercepted missing metadata with actionable restart message) |
| `powershell -File scripts/check-understand-refresh-readiness.ps1` | **PASS** (`READY`) |
| `git diff --check` | **PASS** (No whitespace or formatting errors) |
| `powershell -File scripts/get-work-package-status.ps1 WP-255` | **PASS** (`ImplementedNeedsAudit`, 0 out-of-scope dirty files) |
| `powershell -File scripts/get-work-package-validation-plan.ps1 WP-255` | **PASS** (`ValidationEvidenceRecorded`, `Blocks audit readiness: False`) |
| `powershell -File scripts/check-work-package-closeout.ps1 WP-255` | **PASS** (`ReadyForAudit`) |

---

### 6. Drift Risks & Recommended Follow-up

- **Next Step:** Update [`docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-255-case-001-live-metadata-blocker-investigation.md) and [`docs/00-ssot/END-OF-DAY-HANDOFF.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/END-OF-DAY-HANDOFF.md) to close out WP-255.
- **Runtime Follow-up:** When preparing for future live-stack playthrough testing, restart the local API service from the current source tree so that recent metadata transport updates are active in the running process, and ensure the Case 001 `CrimeSceneReport` fixture data is populated in the local database.

## Final Decision

Accepted on 2026-08-14 after audit PASS and human closeout request. WP-255 is approved for closeout because it diagnosed the live metadata blocker as a stale local API/runtime issue rather than a current-source route/service defect, added route-level metadata contract coverage, improved live-smoke blocker guidance, refreshed Understand graph artifacts, and kept all dirty files within the accepted package scope.

