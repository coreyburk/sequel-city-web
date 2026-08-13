# case-001-query-execution-transport-contract

## Objective

Add the narrow backend API transport contract needed to carry gated, non-progressing Case 001 milestone evaluation metadata through successful query execution only when the request explicitly opts in and the Case 001 skeleton gate is explicitly enabled, without release unlock, Query Lab rendering, persistence, suspect verification, answer-key exposure, runtime AI, migrations, or broader case progression.

## Scope

### In Scope
- Extend the backend query execution request/type contract with an optional, explicitly named Case 001 milestone-evaluation request payload.
- The optional payload must require:
  - case id `case-001`
  - milestone id `case-001-clocktower-report-located`
  - an explicit Case 001 skeleton-gate enabled boolean
- Extend successful `/api/query/execute` responses with optional non-spoiler milestone-evaluation metadata only when:
  - SQL safety validation allows execution
  - query execution succeeds
  - the optional evaluation request is present
  - the optional evaluation request targets `case-001`
  - the optional evaluation request targets `case-001-clocktower-report-located`
  - the explicit skeleton-gate input is `true`
- Wire the existing WP-251 `evaluateCase001GatedMilestone` service into the backend query execution service as a transport-only metadata producer.
- Keep failure, blocked SQL, malformed request, restricted-table, and no-opt-in response shapes free of milestone-evaluation metadata.
- Add focused backend service tests for transport opt-in, no-opt-in, gate-disabled, wrong-case/wrong-milestone, blocked SQL, restricted-table, and execution-failure paths.
- Add a focused query route contract test if route-level request forwarding or malformed-body behavior changes are needed.
- Update API and SSOT documentation to record the opt-in transport contract and its non-progression limits.
- Refresh tracked Understand graph artifacts after implementation because this package modifies API route/service/type contracts and query execution relationships.

### Out of Scope
- Releasing Case 001 by default or changing `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` behavior in frontend runtime.
- Adding Case 001 to `PLAYABLE_STUDENT_CASE_MODULES`.
- Rendering Query Lab for Case 001 or changing any frontend view/component.
- Adding frontend API client consumption, UI display, browser persistence, reset behavior, clue logging, evidence-board entries, investigation threads, mentor guidance, or student-visible progression.
- Advancing milestone state, creating a progression service, storing progression, or broadening Case 004 progression.
- Changing SQL safety rules, restricted-table detection, query normalization semantics, database schema, seed data, migrations, local database sync, or SQL execution authority.
- Changing query history storage or adding milestone data to query history.
- Adding suspect verification, suspect answers, culprit identity, mastermind identity, `CaseAnswerKey` rows, `Solution` rows, restricted table content, hidden solution values, or direct solution query paths.
- Adding dependencies, package-lock changes, generated art, runtime AI, external services, or broad refactors.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `afa23ed9f6a3b5e2d07c914ad4b1d301d27e9c41` (`Add Case 001 clocktower result-pattern validation`), from `.understand-anything/meta.json`.
- Freshness assessment: Structurally stale by one accepted backend service commit for this planning surface. Current `HEAD` is `0870e8a` (`Add Case 001 gated milestone evaluation boundary`). Drift since the graph metadata baseline is WP-251: a new Case 001 gated milestone evaluation service/test, API test registration, SSOT updates, tracked graph artifact refresh, handoff refresh, and the WP-251 record. The committed graph artifacts include the WP-251 service/test nodes and relationships, but the metadata baseline still records the pre-WP-251 commit. Source and SSOT inspection are authoritative; implementation must refresh the graph in this originating package.
- Analysis performed: Verified clean `main` aligned with `origin/main`, confirmed WP-252 as the next package number, read workflow/lifecycle/Understand planning guidance and the live handoff, inspected graph metadata and changed paths since baseline, searched graph/source/docs for query execution, `/api/query/execute`, `QueryExecutionRequest`, `QueryExecutionResponse`, `evaluateCase001GatedMilestone`, `case-001-clocktower-report-located`, and Case 001 gating, and reviewed the current query types, query execution service/tests, query route, API query execution contract doc, and relevant SSOT progression/authoring/investigation-state/architecture docs.

### Affected Architecture
- Layers:
  - Backend API route request transport.
  - Backend query execution service.
  - Backend query response/type contract.
  - Case 001 gated milestone-evaluation metadata boundary.
  - API/SSOT documentation.
  - Understand graph baseline.
- Primary files/components:
  - `apps/api/src/types/query.ts`
  - `apps/api/src/services/queryExecutionService.ts`
  - `apps/api/src/services/queryExecutionService.test.ts`
  - `apps/api/src/routes/queryRoutes.ts`
  - optional new `apps/api/src/routes/queryRoutes.test.ts`
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.ts` as read-only dependency unless a type export is required for the transport contract
  - `apps/api/package.json` if a new route test must be added to the existing test script
  - `docs/07-api-contracts/query-execution-endpoints.md`
  - `docs/00-ssot/SSOT-Case-Progression.md`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/00-ssot/SSOT-Case-Authoring.md`
  - tracked Understand graph artifacts
- Upstream consumers:
  - Future gated Case 001 Query Lab/frontend package that may request and display non-spoiler milestone metadata.
  - Existing frontend API client remains unaffected unless a future package opts in.
  - Auditors validating that the backend owns SQL result validation and that frontend state is not progression authority.
- Downstream dependencies:
  - `validateSqlSafety` and restricted-table checks must still run before any database call or milestone evaluation.
  - `normalizeQueryResult` must remain the only query-result normalization path before Case 001 evaluation.
  - WP-251 `evaluateCase001GatedMilestone` must remain the only Case 001 evaluator called by query execution.
  - `addQueryHistoryRecord` must not receive or persist milestone metadata.

### Regression Surface
- Related tests:
  - Existing and expanded `apps/api/src/services/queryExecutionService.test.ts`.
  - Optional new `apps/api/src/routes/queryRoutes.test.ts` if route forwarding is touched.
  - Existing `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`.
  - Existing `apps/api/src/services/case001ResultPatternService.test.ts`.
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `git diff --check`
- User workflows:
  - Existing normal query execution responses remain unchanged unless the backend request explicitly opts into Case 001 milestone metadata.
  - Blocked SQL, restricted-table SQL, execution failures, and malformed requests continue returning the current failure shapes.
  - Case 004 remains the only released playable/restorable case.
  - Case 001 remains locked and unreleased by default, with no Query Lab rendering added by this package.
- Security/data boundaries:
  - SQL safety and restricted-table checks must remain authoritative before query execution and before any Case 001 result evaluation.
  - The transport metadata must not include SQL text, full result rows, hidden solution values, answer-key data, restricted table names beyond existing safety errors, suspect verification data, culprit/mastermind identity, prompt text, localStorage data, or frontend skeleton selections.
  - Runtime AI, UI state, free-text guesses, query history, and browser persistence remain invalid progression authorities.
  - The metadata is advisory transport only and must explicitly report no milestone advancement.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: The package modifies API request/response types, query execution service wiring, route transport behavior, tests, and documentation. The originating WP can safely own tracked graph artifacts, so graph refresh belongs in this package after implementation and validation.

## Files Allowed to Change

Allowed:

- `apps/api/src/types/query.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/package.json`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md`

`apps/api/src/services/case001GatedMilestoneEvaluationService.ts` is allowed only for exporting or reusing transport-safe types/constants required by the query response contract. Do not change validator behavior unless implementation reveals an unavoidable contract mismatch; if that happens, stop and create a corrective WP instead of expanding scope.

`apps/api/package.json` is allowed only to add a new route test to the existing `test` script if `apps/api/src/routes/queryRoutes.test.ts` is created. No dependency, package metadata, package-lock, or unrelated script changes are allowed.

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/web/**`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/services/queryHistoryService.ts`
- `apps/api/src/services/queryResultNormalizer.ts`
- `apps/api/src/services/schemaService.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/sqlSafetyService.ts`
- `apps/api/src/services/studentRestrictedTables.ts`
- `apps/api/src/services/caseVerificationService.ts`
- `apps/api/src/routes/caseRoutes.ts`
- `apps/api/src/routes/schemaRoutes.ts`
- `apps/api/src/routes/queryHistoryRoutes.ts`
- `database/**`
- `database/migrations/**`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `package.json`
- `package-lock.json`
- `scripts/**`
- `.codex/skills/**`
- generated build outputs, coverage, screenshots, videos, traces, and test-result artifacts

## Constraints

- Preserve existing query execution behavior unless the request explicitly opts into Case 001 milestone metadata.
- No release unlock.
- No Query Lab rendering.
- No frontend changes.
- No runtime milestone advancement.
- No persistence.
- No query history metadata persistence.
- No suspect verification.
- No answer-key exposure.
- No runtime AI.
- No database changes.
- No migrations.
- No new dependencies.
- Keep route handlers thin; delegate transport/evaluation behavior to services.
- Do not read `import.meta.env`, frontend globals, localStorage, browser state, or frontend Case 001 modules from backend code.
- Do not make `process.env` the authority for the Case 001 skeleton gate in this package; the API contract must require an explicit request value.
- Do not evaluate milestone metadata before SQL safety and restricted-table checks pass.
- Do not evaluate milestone metadata for blocked SQL, restricted-table SQL, malformed requests, execution failures, missing opt-in payloads, wrong case ids, wrong milestone ids, or disabled gate inputs.
- Do not include hidden suspect names, culprit identity, mastermind identity, answer-key values, restricted table contents, direct solution paths, SQL text, or full row contents in response metadata, tests, docs, or constants.
- Do not modify the WP-250 validator or SQL safety/restricted-table services.

## Required Behavior

- Extend `QueryExecutionRequest` with an optional Case 001 evaluation request field.
  - The field name must make the opt-in explicit, for example `caseMilestoneEvaluation`.
  - The field must not be required for existing callers.
  - The field must include enough data to pass only explicit inputs into the WP-251 boundary:
    - `caseId`
    - `milestoneId`
    - `isSkeletonGateEnabled`
- Extend `QueryExecutionSuccessResponse` with an optional metadata field for milestone evaluation.
  - The field must be absent for existing no-opt-in success responses.
  - When present, it must contain only non-spoiler metadata from the WP-251 boundary.
  - It must preserve `milestoneAdvanced: false`.
  - It must not include `data.rows`, `data.columns`, SQL text, prompt text, hidden solution data, suspect-verification data, or restricted-table content.
- Update `executeSafeQuery` so it can accept an optional execution options/request context parameter without breaking existing call sites.
  - The default call shape `executeSafeQuery(sql, executeQuery)` must continue to work for existing tests.
  - The new opt-in path must run only after successful SQL execution and normalization.
  - The new opt-in path must call `evaluateCase001GatedMilestone` only when the request targets `case-001`, `case-001-clocktower-report-located`, and the explicit gate input is enabled.
  - Gate-disabled, wrong-case, wrong-milestone, no-opt-in, blocked, restricted-table, malformed, and execution-failure paths must not call the evaluator.
- Update `registerQueryRoutes` so `/api/query/execute` forwards the optional evaluation payload to `executeSafeQuery` only after validating that the body includes a string `sql`.
  - Malformed requests must keep the existing `400` response behavior and must not include milestone metadata.
  - The route must not read environment variables or infer gate state from server configuration.
- Add or expand tests to prove:
  - existing no-opt-in success response shape remains unchanged
  - opt-in + gate enabled + matching Case 001 result includes non-spoiler metadata
  - opt-in + gate enabled + no matching result includes evaluated no-match metadata
  - opt-in + gate disabled does not call the evaluator and does not include success-path milestone metadata unless the chosen contract explicitly returns a safe gate-disabled metadata object; document the chosen behavior
  - wrong-case and wrong-milestone requests do not call the evaluator and do not expose Case 001 metadata
  - blocked SQL and restricted-table SQL do not call the executor/evaluator and do not include metadata
  - execution failure does not include metadata
  - query history remains unchanged and does not store milestone metadata
  - route forwarding preserves the explicit request payload if route-level forwarding is implemented
- Update `docs/07-api-contracts/query-execution-endpoints.md` to document:
  - the optional request field
  - the optional success metadata field
  - all conditions required for metadata to be present
  - the no-progression/no-persistence/no-spoiler/no-release limitations
- Update SSOT docs to record:
  - query execution can transport gated Case 001 milestone metadata only through explicit opt-in and explicit gate input
  - the transport path does not release Case 001, render Query Lab, persist progress, advance runtime milestones, verify suspects, expose answers, or authorize frontend/local state as progression authority
- Run focused validation and graph refresh.
- Record Code Results with changed files, validation evidence, graph-refresh evidence, and scope check.

## Acceptance Criteria

- [ ] `QueryExecutionRequest` supports an optional explicit Case 001 milestone-evaluation request payload without requiring existing callers to change.
- [ ] Successful query execution can include optional non-spoiler Case 001 milestone-evaluation metadata only after explicit opt-in, successful SQL safety validation, successful restricted-table screening, successful execution, successful normalization, `case-001`, `case-001-clocktower-report-located`, and explicit skeleton-gate enabled input.
- [ ] Existing no-opt-in successful query execution response shape remains unchanged.
- [ ] Blocked SQL, restricted-table SQL, malformed requests, execution failures, missing opt-in payloads, wrong case ids, wrong milestone ids, and disabled gate inputs do not call the Case 001 evaluator.
- [ ] The metadata, when present, preserves `milestoneAdvanced: false` and does not advance runtime milestone state.
- [ ] The metadata does not include SQL text, full result rows, full columns, hidden solution values, answer-key data, restricted table content, suspect-verification data, culprit/mastermind identity, prompt text, frontend state, localStorage state, or runtime AI output.
- [ ] Query history behavior remains unchanged and does not persist milestone metadata.
- [ ] `/api/query/execute` forwards the optional evaluation payload only as explicit request data and does not infer gate state from environment variables, frontend globals, or server configuration.
- [ ] Route handlers remain thin and deterministic.
- [ ] API and SSOT docs record the opt-in transport contract and its limits.
- [ ] Case 001 remains gated and unreleased by default.
- [ ] Case 001 is not added to `PLAYABLE_STUDENT_CASE_MODULES`.
- [ ] No Case 001 Query Lab rendering, frontend API-client consumption, persistence, reset, evidence logging, investigation threads, mentor guidance, suspect verification, database migration, seed data, SQL safety behavior, dependency, package lockfile, generated art, runtime AI, or broader progression behavior is introduced.
- [ ] Case 004 behavior and data remain unchanged.
- [ ] `npm run test --workspace apps/api` passes.
- [ ] `npm run build --workspace apps/api` passes.
- [ ] Understand refresh readiness passes before graph refresh.
- [ ] Tracked Understand graph artifacts are refreshed after implementation.
- [ ] Understand refresh readiness passes after graph refresh.
- [ ] `git diff --check` passes.
- [ ] Scope check reports no out-of-scope dirty files.

## Code Prompt

Implement WP-252 exactly as scoped.

Start by reading:
- `docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `apps/api/src/types/query.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`

Then:
1. Add the optional Case 001 milestone-evaluation request/response transport contract to backend query types.
2. Wire successful query execution to call the existing WP-251 gated evaluator only after all opt-in, gate, case, milestone, safety, restricted-table, execution, and normalization requirements are satisfied.
3. Forward the optional payload through `/api/query/execute` without reading environment variables or changing malformed-body behavior.
4. Add focused API tests for success metadata, no-opt-in compatibility, disabled/wrong-target no-call paths, blocked/restricted/failure no-metadata paths, query-history preservation, and route forwarding if touched.
5. Update API and SSOT docs for the transport contract and no-progression limits.
6. Run:
   - `npm run test --workspace apps/api`
   - `npm run build --workspace apps/api`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `git diff --check`
7. Record Code Results with changed files, validation evidence, graph-refresh evidence, and scope check.

Scope:
- Modify only files listed under `Allowed:`.
- Respect all `Do Not Modify:` boundaries.

Constraints:
- No frontend changes.
- No release unlock.
- No Query Lab rendering.
- No runtime progression advancement.
- No persistence or query history metadata storage.
- No suspect verification.
- No answer-key, restricted table, culprit, mastermind, or hidden solution exposure.
- No runtime AI.
- No database changes or migrations.
- No dependency or package-lock changes.

Return:
- Exact code changes made.
- Validation results.
- Scope check result.
- Any implementation notes needed for audit.

## Audit Prompt

Audit WP-252 against this work package and the referenced SSOT/API docs.

Verify:
- All acceptance criteria are satisfied.
- Only files listed under `Allowed:` changed.
- All `Do Not Modify:` boundaries were preserved.
- Existing query execution behavior is unchanged for callers that do not opt in.
- `/api/query/execute` only transports Case 001 metadata when the request explicitly opts in and explicitly provides enabled gate state.
- The evaluator is not called for blocked SQL, restricted-table SQL, malformed requests, execution failures, missing opt-in payloads, wrong case ids, wrong milestone ids, or disabled gate inputs.
- Metadata, when present, is non-spoiler and preserves `milestoneAdvanced: false`.
- Query history remains unchanged and does not store milestone metadata.
- Case 001 remains locked/unreleased and no frontend Query Lab rendering was added.
- No persistence, suspect verification, answer-key exposure, runtime AI, migrations, SQL safety changes, restricted-table behavior changes, package-lock changes, or Case 004 behavior changes were introduced.
- API/SSOT docs match the implemented contract.
- Tests and build evidence are present and relevant.
- Understand graph regeneration was performed and tracked artifacts contain no transient temp/trash/log outputs.
- Impact analysis matches the actual changed files and dependencies.

Output:
- Audit verdict label
- Violations
- Regressions
- Missing tests or validation
- Scope drift risks

## Code Results

Implemented WP-252 on 2026-08-13.

Changed files:
- `apps/api/src/types/query.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/package.json`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md`

Implementation summary:
- Added optional `caseMilestoneEvaluation` request metadata to `QueryExecutionRequest`.
- Added optional `caseMilestoneEvaluation` success metadata to `QueryExecutionSuccessResponse`.
- Wired `executeSafeQuery` to pass normalized successful query results to `evaluateCase001GatedMilestone` only when the request explicitly targets:
  - `caseId: "case-001"`
  - `milestoneId: "case-001-clocktower-report-located"`
  - `isSkeletonGateEnabled: true`
- Kept no-opt-in, disabled-gate, wrong-case, wrong-milestone, blocked SQL, restricted-table SQL, malformed request, and execution-failure paths free of milestone metadata.
- Added injectable query execution options for tests while preserving the existing `executeSafeQuery(sql, executeQuery)` call shape.
- Added a thin `createQueryExecutionHandler` route handler factory and kept `registerQueryRoutes` as route registration only.
- Added `apps/api/src/routes/queryRoutes.test.ts` and registered it in the existing API test script.
- Updated API/SSOT docs to record the opt-in transport contract and its no-release, no-UI, no-progression, no-persistence, no-query-history-metadata, no-suspect-verification, and no-answer-key limits.

Validation:
- Initial `npm run test --workspace apps/api` failed because the newly exercised query route imports lacked explicit `.ts` extensions under the current Node strip-types test runner. Fixed imports in `queryRoutes.ts` and `types/query.ts`.
- PASS: `npm run test --workspace apps/api`.
  - Existing Node `MODULE_TYPELESS_PACKAGE_JSON` warnings appeared for pre-existing API test execution paths.
- PASS: `npm run build --workspace apps/api`.
  - The build rewrote existing `apps/api/dist` generated files; those generated out-of-scope changes were restored before continuing.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before graph refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=625`, `nodes=999`, `edges=374`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 625 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after graph refresh reported `READY`.
- PASS: `git diff --check` with CRLF working-copy warnings only.

Scope check:
- Modified files are limited to the WP-252 allowed list.
- `apps/web/**`, database files, migrations, SQL safety, restricted-table detection, query history service, query result normalizer, schema services, case verification, Case 001 result-pattern validator, package lockfile, root package files, scripts, repo-local skills, and generated build outputs were not modified.
- No release unlock, Query Lab rendering, frontend API-client consumption, runtime milestone advancement, persistence, reset behavior, evidence logging, investigation threads, mentor guidance, suspect verification, answer-key exposure, restricted-table exposure, runtime AI, database mutation, migration, seed data, or Case 004 behavior/data change was introduced.

## Audit Results

### Audit Verdict: PASS

### Verdict Summary
**VERDICT: PASS**

WP-252 (`case-001-query-execution-transport-contract`) has been thoroughly audited against its work package specification (`docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md`), referenced SSOT documentation, API endpoint contracts, test suite, and Understand graph baseline. All criteria pass with zero violations, zero regressions, zero missing tests, and zero scope drift.

---

### Detailed Findings

### 1. Acceptance Criteria & Required Behavior Verification
- **Optional Request Payload**: `QueryExecutionRequest` in [`apps/api/src/types/query.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/query.ts) extended with optional `caseMilestoneEvaluation?: QueryExecutionCaseMilestoneEvaluationRequest`. Existing callers are unaffected.
- **Opt-in Transport**: [`executeSafeQuery`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L30-L125) transports milestone evaluation metadata under `caseMilestoneEvaluation` only after explicit opt-in, successful SQL safety validation, restricted-table screening, database execution, normalization, and when `caseId === "case-001"`, `milestoneId === "case-001-clocktower-report-located"`, and `isSkeletonGateEnabled === true`.
- **No-Opt-In Backwards Compatibility**: Callers that do not provide `caseMilestoneEvaluation` receive the standard response shape without the metadata field.
- **Short-Circuit Evaluation Boundaries**: `evaluateCase001GatedMilestone` is **never called** for:
  - Blocked SQL statements (returns safety error early).
  - Restricted-table SQL (returns restricted table error early).
  - Malformed requests (route handler returns HTTP 400 early).
  - Execution failures (caught in try/catch, returns execution failure early).
  - Missing opt-in payloads (`!request`).
  - Mismatched case IDs (`caseId !== "case-001"`).
  - Mismatched milestone IDs (`milestoneId !== "case-001-clocktower-report-located"`).
  - Disabled gate state (`isSkeletonGateEnabled !== true`).
- **Non-Spoiler & Non-Advancing**: Metadata preserves `milestoneAdvanced: false` and contains only non-spoiler status data from WP-251 (`caseId`, `milestoneId`, `evidenceTableFamily`, `gate`, `evaluated`, `matched`, `matchedRowCount`, `runtimeStatus`).
- **Query History Preservation**: [`addQueryHistoryRecord`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts#L106-L114) continues receiving only query text, execution time, outcome, and row count. Milestone metadata is not stored in history.
- **Route Forwarding**: `/api/query/execute` in [`apps/api/src/routes/queryRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts) forwards `body.caseMilestoneEvaluation` strictly as explicit request data without inferring gate state from environment variables or server configuration.
- **Case 001 Unreleased & No UI**: Frontend code ([`apps/web/**`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web)) is untouched. Case 001 remains locked by default with no Query Lab rendering.
- **Out of Scope Boundaries Preserved**: No persistence, suspect verification, answer-key exposure, runtime AI, database migrations, SQL safety rule changes, restricted-table behavior changes, package-lock changes, or Case 004 behavior changes were introduced.

### 2. File Scoping & Boundary Compliance
- **Only Allowed Files Modified**:
  - [`apps/api/src/types/query.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/query.ts)
  - [`apps/api/src/services/queryExecutionService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts)
  - [`apps/api/src/services/queryExecutionService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.test.ts)
  - [`apps/api/src/routes/queryRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts)
  - [`apps/api/src/routes/queryRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.test.ts)
  - [`apps/api/package.json`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/package.json)
  - [`docs/07-api-contracts/query-execution-endpoints.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/07-api-contracts/query-execution-endpoints.md)
  - [`docs/00-ssot/SSOT-Case-Progression.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Progression.md)
  - [`docs/00-ssot/SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md)
  - [`docs/00-ssot/SSOT-Case-Authoring.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md)
  - Tracked Understand Graph: `.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, `scan-result.json`
  - [`docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-252-case-001-query-execution-transport-contract.md)
- **Do Not Modify List**: 100% compliant. No files outside `Allowed:` were altered.

### 3. Documentation Alignment
- [`docs/07-api-contracts/query-execution-endpoints.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/07-api-contracts/query-execution-endpoints.md) updated with request/response schemas, JSON examples, and transport limits.
- SSOT documents ([`SSOT-Case-Progression.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Progression.md), [`SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md), [`SSOT-Case-Authoring.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md)) accurately record the transport boundary contract and its no-release, no-persistence, no-UI restrictions.

### 4. Tests and Verification Evidence
- `npm run test --workspace apps/api`: **PASS** (100% test pass rate across unit and route tests).
- `npm run build --workspace apps/api`: **PASS** (TypeScript compilation succeeds with 0 errors).
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`: **PASS** (reports `READY`, 0 untracked logs/trash).
- `git diff --check`: **PASS** (0 whitespace/formatting errors).

---

### Audit Checklist Categories

### Violations
**None.** All rules, constraints, and contracts were strictly adhered to.

### Regressions
**None.** Existing call sites, safety mechanisms, restricted-table protections, normalization routines, and query history mechanisms continue operating identically.

### Missing Tests or Validation
**None.** Test cases explicitly verify no-opt-in callers, enabled gate matches/non-matches, disabled gates, invalid case/milestone targets, blocked SQL, restricted-table SQL, execution failures, query history immutability, and route-handler forwarding.

### Scope Drift Risks
**None.** All changes are confined exclusively to the allowed file list. Tracked Understand graph artifacts are clean and free of transient build outputs.
I have noted the completion of the background drive listing task (`task-107`). 

The audit for **WP-252** remains complete with a final verdict of **PASS**. All acceptance criteria, file boundaries, safety rules, documentation alignment, test coverage, and graph regeneration requirements have been fully verified.

## Final Decision

Accepted on 2026-08-13 after independent audit PASS and human closeout request. WP-252 satisfies the backend API transport-contract requirements for explicit gated Case 001 milestone metadata, preserves Case 001 as gated and unreleased, avoids Query Lab rendering, persistence, runtime milestone advancement, suspect verification, answer-key exposure, runtime AI, migrations, and Case 004 behavior changes.

