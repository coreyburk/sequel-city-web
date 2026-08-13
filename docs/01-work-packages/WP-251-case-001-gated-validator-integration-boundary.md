# case-001-gated-validator-integration-boundary

## Objective

Add a narrow backend integration-boundary service that consumes the Case 001 clocktower result-pattern validator only when an explicit Case 001 skeleton gate is enabled, without wiring Case 001 into release runtime, Query Lab rendering, persistence, suspect verification, answer-key exposure, runtime AI, migrations, or broader case progression.

## Scope

### In Scope
- Add a pure backend service-level integration boundary for the Case 001 first SQL milestone.
- The boundary must accept:
  - case id
  - explicit Case 001 skeleton-gate enabled flag
  - normalized successful backend query result data compatible with `QueryExecutionSuccessData`
- The boundary must call/consume `validateCase001ClocktowerReportLocated` only when:
  - case id is `case-001`
  - the explicit skeleton gate flag is `true`
  - normalized query result data is present
- Return structured non-spoiler integration output that identifies:
  - case id
  - milestone id `case-001-clocktower-report-located`
  - evidence table family `CrimeSceneReport`
  - gate status
  - match status from the WP-250 validator when evaluated
  - a non-progression runtime status that makes clear no milestone state was advanced
- Add focused backend service tests for gate-enabled, gate-disabled, wrong-case, match, no-match, and no-side-effect paths.
- Update SSOT documentation to record that the validator now has a gated backend integration-boundary consumer, but still remains unwired from API routes, query execution, frontend rendering, milestone state, persistence, suspect verification, and release behavior.
- Refresh tracked Understand graph artifacts after implementation because this package adds a new backend service/test surface and validator import relationship.

### Out of Scope
- Releasing Case 001 by default or changing `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` behavior in frontend runtime.
- Adding Case 001 to `PLAYABLE_STUDENT_CASE_MODULES`.
- Rendering Query Lab for Case 001.
- Modifying frontend app components, routing, views, case-library unlocking, browser history restoration, or skeleton UI.
- Modifying API routes, `/api/query/execute`, query execution response shape, query execution service, query history, schema services, SQL safety, restricted-table checks, or backend request handlers.
- Advancing milestone state, creating a progression service, storing progression, logging clues, creating evidence-board entries, creating investigation threads, adding mentor guidance, or changing Case 004 progression.
- Adding persistence, reset/clear-progress behavior, localStorage behavior, backend persisted state, database state mutation, runtime migrations, database seed changes, or schema changes.
- Adding suspect verification, suspect answers, culprit identity, mastermind identity, `CaseAnswerKey` rows, `Solution` rows, restricted table content, hidden solution values, or direct solution query paths.
- Adding dependencies, package-lock changes, generated art, runtime AI, external services, or broad refactors.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `626a145d790674dbe3b1ae076ed2649a35bbf423` (`Add Case 001 first evidence fixture`), from `.understand-anything/meta.json`.
- Freshness assessment: Usable with non-structural closeout drift for planning, but the implementation package should refresh the graph. Current `HEAD` is `afa23ed` (`Add Case 001 clocktower result-pattern validation`). Drift since the graph metadata baseline is the accepted WP-250 closeout set: new Case 001 validator service/test, API test registration, SSOT updates, tracked Understand artifacts, handoff, and the WP-250 record. The committed graph artifacts already include the WP-250 service and test, even though `meta.json` records the pre-closeout commit. Source and SSOT inspection remain authoritative for this new integration-boundary package.
- Analysis performed: Verified clean `main` aligned with `origin/main`, confirmed WP-251 as the next package number, read workflow/lifecycle/Understand planning guidance and the live handoff, inspected graph metadata and drift since baseline, searched graph/source/docs for `case001ResultPatternService`, `queryExecutionService`, `studentCaseModule`, `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON`, and `case-001-clocktower-report-located`, and reviewed `case001ResultPatternService.ts`, its tests, backend query execution service/tests, Case 001 skeleton/module source/tests, and relevant SSOT progression/authoring/investigation-state docs.

### Affected Architecture
- Layers:
  - Backend service/domain integration boundary.
  - Backend normalized query result validation contract.
  - Case 001 gated skeleton/progression SSOT documentation.
  - Understand graph baseline.
- Primary files/components:
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
  - `apps/api/src/services/case001ResultPatternService.ts` as read-only validator dependency.
  - `apps/api/src/types/query.ts` as read-only normalized query result shape reference.
  - `apps/api/package.json`
  - `docs/00-ssot/SSOT-Case-Progression.md`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/00-ssot/SSOT-Case-Authoring.md`
  - tracked Understand graph artifacts
- Upstream consumers:
  - Future API/query execution integration package that may pass approved successful query results through the gated boundary.
  - Future Case 001 Query Lab package after release gates and response contracts are explicitly scoped.
  - Auditors checking that Case 001 validation cannot run as progression unless the dev/test gate is explicit.
- Downstream dependencies:
  - WP-250 `validateCase001ClocktowerReportLocated` service and result shape.
  - Existing `QueryExecutionSuccessData` shape from `apps/api/src/types/query.ts`.
  - Existing frontend Case 001 skeleton gate name/value as a documented contract, not a backend runtime import.

### Regression Surface
- Related tests:
  - New focused backend service tests for the gated integration boundary.
  - Existing `case001ResultPatternService.test.ts`.
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `git diff --check`
- User workflows:
  - Normal release builds still keep Case 001 locked and non-playable.
  - Developer/test builds with the explicit skeleton gate still render only the current skeleton surface.
  - No learner can run Case 001 Query Lab or complete `case-001-clocktower-report-located` through UI/API runtime as a result of this package alone.
  - Case 004 remains the only released playable/restorable case.
- Security/data boundaries:
  - The boundary must not treat SQL text, UI state, skeleton selections, localStorage, prompt text, runtime AI output, free-text guesses, answer keys, restricted tables, suspect verification, or case-library lock state as progression authority.
  - The boundary must not expose hidden solution identities, direct solution paths, answer-key data, restricted table contents, or suspect-verification answers.
  - The boundary must not execute SQL, call routes/APIs, mutate database state, write files, persist state, or advance milestones.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: The package adds a new backend service/test surface and a new import relationship to the WP-250 validator. The originating WP can safely own tracked graph artifacts, so graph refresh belongs in this package after implementation and validation.

## Files Allowed to Change

Allowed:

- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- `apps/api/package.json`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-251-case-001-gated-validator-integration-boundary.md`

`apps/api/package.json` is allowed only to add the new service test to the existing `test` script. No dependency, package metadata, package-lock, or unrelated script changes are allowed.

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/web/**`
- `apps/api/src/routes/**`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryHistoryService.ts`
- `apps/api/src/services/queryResultNormalizer.ts`
- `apps/api/src/services/schemaService.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/sqlSafetyService.ts`
- `apps/api/src/services/studentRestrictedTables.ts`
- `apps/api/src/services/caseVerificationService.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/types/query.ts`
- `database/**`
- `database/migrations/**`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `package.json`
- `package-lock.json`
- `scripts/**`
- `.codex/skills/**`
- generated build outputs, coverage, screenshots, videos, traces, and test-result artifacts

## Constraints

- Preserve existing runtime behavior unless explicitly changing it.
- No release unlock.
- No Query Lab rendering.
- No frontend changes.
- No route or query-execution changes.
- No response-shape changes to `/api/query/execute`.
- No runtime progression wiring.
- No persistence.
- No suspect verification.
- No answer-key exposure.
- No runtime AI.
- No database changes.
- No migrations.
- No new dependencies.
- Keep the integration boundary pure, synchronous, deterministic, and side-effect free.
- Do not read environment variables directly in backend code; accept the skeleton-gate state as an explicit input.
- Do not import frontend Case 001 modules into backend code.
- Do not modify the WP-250 validator unless a test exposes a defect that cannot be addressed in the new boundary service; if that happens, stop and create a corrective WP instead of expanding scope.
- Do not include hidden suspect names, culprit identity, mastermind identity, answer-key values, restricted table contents, or direct solution paths in implementation constants, tests, docs, or returned validation payloads.

## Required Behavior

- Add `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`.
  - Export stable identifiers or equivalent structured constants for:
    - case id `case-001`
    - skeleton gate name `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON`
    - skeleton gate enabled value `true`
    - milestone id `case-001-clocktower-report-located`
    - evidence table family `CrimeSceneReport`
  - Export a pure function that accepts an object containing:
    - `caseId`
    - `isSkeletonGateEnabled`
    - `queryResult`
  - The function must not read `process.env`, `import.meta.env`, localStorage, request state, database state, files, or network.
  - The function must return a structured non-spoiler result for all paths.
  - When `caseId` is not `case-001`, return a non-evaluated result and do not call the validator.
  - When `isSkeletonGateEnabled` is `false`, return a gate-disabled result and do not call the validator.
  - When the gate is enabled for `case-001`, call `validateCase001ClocktowerReportLocated(queryResult)` and copy only non-spoiler validator metadata into the boundary result.
  - The result must explicitly state that no runtime milestone state was advanced.
  - The result must not echo full rows, query text, answer rows, restricted values, hidden solution values, or suspect-verification data.
- Add `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`.
  - Follow the existing backend service test style using `node:assert/strict`.
  - Cover successful gate-enabled matching of the WP-249 public fixture row through the WP-250 validator.
  - Cover gate-enabled no-match output.
  - Cover gate-disabled behavior and prove the validator is not called.
  - Cover wrong-case behavior and prove the validator is not called.
  - Cover that returned metadata is non-spoiler and does not include row contents or query text.
  - Cover that the result reports no milestone advancement.
- Update `apps/api/package.json` only to include the new test in the existing `test` script.
- Update SSOT docs to record:
  - a gated backend integration-boundary consumer exists for the Case 001 validator
  - the boundary requires an explicit Case 001 skeleton-gate input
  - the boundary is not wired into API routes, query execution, frontend rendering, Query Lab, persistence, suspect verification, or release behavior
  - runtime milestone advancement remains unimplemented
- Run focused validation and graph refresh.
- Record Code Results with changed files, validation evidence, graph-refresh evidence, and scope check.

## Acceptance Criteria

- [ ] A pure deterministic backend integration-boundary service exists for Case 001 gated milestone evaluation.
- [ ] The boundary consumes the WP-250 validator only for `case-001` when an explicit skeleton-gate input is enabled.
- [ ] Gate-disabled and wrong-case paths do not call the validator.
- [ ] The boundary consumes normalized successful query result data and does not execute SQL, call APIs/routes, read/write files, mutate database state, use persistence, read environment variables, or use runtime AI.
- [ ] The boundary returns structured non-spoiler output including case id, milestone id, evidence table family, gate status, match status when evaluated, and an explicit no-milestone-advanced status.
- [ ] The boundary does not echo full query result rows, SQL text, hidden solution values, answer-key data, restricted table content, or suspect-verification data.
- [ ] Focused backend tests cover gate-enabled match, gate-enabled no-match, gate-disabled no-call, wrong-case no-call, non-spoiler metadata, and no-progression behavior.
- [ ] `apps/api/package.json` adds only the new service test to the existing `test` script and does not add dependencies or unrelated script changes.
- [ ] SSOT progression/state/authoring docs record the gated integration boundary while preserving that runtime milestone progression remains unwired.
- [ ] Case 001 remains gated and unreleased by default.
- [ ] Case 001 is not added to `PLAYABLE_STUDENT_CASE_MODULES`.
- [ ] No Case 001 Query Lab rendering, API route integration, query execution integration, query history behavior, runtime milestone completion, persistence, reset, evidence logging, investigation threads, mentor guidance, suspect verification, database migration, seed data, SQL safety behavior, dependency, package lockfile, generated art, or runtime AI behavior is introduced.
- [ ] No culprit identity, mastermind identity, suspect-verification answer, answer-key row, restricted table content, hidden solution value, or direct solution query path is exposed.
- [ ] Case 004 behavior and data remain unchanged.
- [ ] `npm run test --workspace apps/api` passes.
- [ ] `npm run build --workspace apps/api` passes.
- [ ] Understand readiness passes before graph refresh.
- [ ] `scripts/refresh-understand-graph.ps1` completes successfully.
- [ ] Understand readiness passes after graph refresh.
- [ ] `git diff --check` passes or reports only known CRLF working-copy warnings.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-251 exactly as specified.

Start by reading:
- `docs/01-work-packages/WP-251-case-001-gated-validator-integration-boundary.md`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/services/case001ResultPatternService.test.ts`
- `apps/api/src/types/query.ts`
- `apps/api/package.json`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`

Scope:
- Only modify the allowed files.

Constraints:
- No refactors.
- No new dependencies.
- No frontend changes.
- No API route changes.
- No query execution changes.
- No query response-shape changes.
- No persistence.
- No suspect verification.
- No answer-key exposure.
- No runtime AI.
- No database changes.
- No migrations.
- Preserve all existing behavior.
- Keep Case 001 gated and unreleased.
- Do not import frontend modules into backend code.
- Do not expose hidden solution details in constants, tests, docs, or return payloads.

Implementation requirements:
- Add a pure backend integration-boundary service that accepts case id, explicit skeleton-gate state, and normalized successful query result data.
- Call the WP-250 validator only when case id is `case-001` and the explicit skeleton gate is enabled.
- Return structured non-spoiler integration output with no milestone advancement.
- Add focused backend service tests and include them in the existing API test script.
- Update only the allowed SSOT docs to describe the gated integration boundary and preserve the unwired/runtime-locked status.
- Run required validation and graph-refresh commands.

Validation commands:
- `npm run test --workspace apps/api`
- `npm run build --workspace apps/api`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `git diff --check`

Return:
- Summary of changed files and boundary behavior.
- Validation and graph-refresh commands run with results.
- Any blockers or follow-up needed.

## Audit Prompt

Audit WP-251 against the work package and SSOT.

Verify:
- All acceptance criteria are satisfied.
- Changed files are limited to the `Allowed:` list.
- `Do Not Modify:` boundaries were preserved.
- The integration boundary is pure, deterministic, synchronous, and side-effect free.
- The boundary accepts explicit skeleton-gate state and does not read frontend env, backend env, localStorage, files, database state, network, request state, prompt text, runtime AI output, or SQL text as authority.
- The boundary calls the WP-250 validator only for `case-001` when the explicit skeleton gate is enabled.
- Gate-disabled and wrong-case tests prove the validator is not called.
- The boundary consumes normalized successful query result data and does not execute SQL, call routes/APIs, mutate DB state, write files, use persistence, use runtime AI, or inspect answer-key/restricted data.
- The boundary returns structured non-spoiler metadata for case id, milestone id, evidence table family, gate status, match status, and no-milestone-advanced status.
- The boundary does not echo full rows, SQL text, hidden solution values, answer-key rows, restricted table content, suspect-verification answers, culprit identity, mastermind identity, or direct solution paths.
- Tests cover gate-enabled match, gate-enabled no-match, gate-disabled no-call, wrong-case no-call, non-spoiler metadata, and no-progression behavior using the existing backend service test style.
- `apps/api/package.json` changed only to include the new test in the existing test script.
- SSOT progression/state/authoring docs record the gated integration boundary without implying runtime milestone progression.
- Case 001 remains gated and unreleased by default.
- Case 001 was not added to `PLAYABLE_STUDENT_CASE_MODULES`.
- No Query Lab rendering, API route integration, query execution integration, query history behavior, runtime milestone completion, persistence, reset, evidence logging, investigation threads, mentor guidance, suspect verification, database migration, seed data, SQL safety behavior, dependency, package lockfile, generated art, runtime AI, answer-key exposure, restricted-table exposure, or release behavior was introduced.
- Case 004 behavior and data remain unchanged.
- Required API tests, API build, Understand refresh/readiness commands, and `git diff --check` were run or any blocked validation is clearly recorded.
- Graph regeneration decision was followed; tracked graph artifacts changed only as expected and no transient `.understand-anything` trash/temp/log artifacts were included.
- Adversarial contract-shape checks were performed for required sections, allowed/prohibited file boundaries, result-state labels, validation evidence, and blocker fields.
- Relevant negative paths were probed: gate disabled, wrong case id, no-match query results, duplicate/partial results, accidental validator call outside gate, release unlock drift, frontend import drift, Query Lab rendering drift, route/query-execution wiring drift, persistence drift, suspect verification exposure, answer-key exposure, stale graph artifacts, and out-of-scope dirty files.
- Explicit failure thresholds were applied: missing boundary, validator call outside gate, runtime wiring, release unlock, answer-key exposure, hidden solution leakage, SQL execution/mutation, environment/localStorage authority, scope violation, missing negative-path tests, missing validation, or graph refresh omission is a FAIL; unavailable clean worktree, repository context, or required tooling is a non-ready audit state.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Missing tests or validation
- Scope drift risks

## Code Results

Implemented by Codex.

Changed files:
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- `apps/api/package.json`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-251-case-001-gated-validator-integration-boundary.md`

Implementation summary:
- Added `evaluateCase001GatedMilestone`, a pure backend service-level integration boundary for Case 001 gated milestone evaluation.
- The boundary accepts explicit inputs for `caseId`, `isSkeletonGateEnabled`, and normalized successful query result data.
- The boundary calls the WP-250 `validateCase001ClocktowerReportLocated` validator only when `caseId` is `case-001` and the explicit skeleton gate input is enabled.
- Gate-disabled and wrong-case paths return non-evaluated metadata and do not call the validator.
- The boundary returns non-spoiler metadata only:
  - case id
  - milestone id `case-001-clocktower-report-located`
  - evidence table family `CrimeSceneReport`
  - gate name/value/enabled state
  - evaluated state
  - match state
  - matched row count
  - runtime status
  - `milestoneAdvanced: false`
- The boundary does not read environment variables, localStorage, request state, database state, files, network, SQL text, prompt text, runtime AI output, answer keys, restricted tables, or suspect-verification data.
- Added focused backend service tests for gate-enabled match, gate-enabled no-match, gate-disabled no-call, wrong-case no-call, non-spoiler metadata, duplicate-match metadata, and no-progression behavior.
- Updated `apps/api/package.json` only to include the new test in the existing API test script.
- Updated SSOT authoring/progression/state docs to record the gated backend integration-boundary consumer while preserving that runtime progression remains unwired.

Validation:
- Initial `npm run test --workspace apps/api` failed because the new service imported the WP-250 validator without the explicit `.ts` extension required by the current Node strip-types test runner. Fixed inside the new service file only.
- PASS: `npm run test --workspace apps/api`.
  - The new boundary tests passed along with existing API service/route tests.
  - Existing Node `MODULE_TYPELESS_PACKAGE_JSON` warnings appeared for pre-existing API test execution paths.
- PASS: `npm run build --workspace apps/api`.
  - The build rewrote existing `apps/api/dist` generated files; those generated out-of-scope changes were restored before continuing.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=623`, `nodes=992`, `edges=369`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 623 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.
- PASS: `git diff --check` with CRLF working-copy warnings only.

Scope check:
- `scripts/get-work-package-status.ps1 WP-251` reports no out-of-scope dirty files.
- Modified files are limited to the WP-251 allowed list.
- `apps/web/**`, API routes, query execution/history/result-normalizer/schema/database metadata/SQL safety/restricted-table/case-verification services, the WP-250 validator, API query types, database files, SQL safety docs, architecture docs, root package files, lockfiles, scripts, and repo-local skills were not modified.
- No release unlock, Case 001 Query Lab rendering, API route integration, query execution integration, query history behavior, runtime milestone completion, persistence, reset, evidence logging, investigation threads, mentor guidance, suspect verification, database migration, seed data change, SQL safety behavior, dependency, package lockfile, generated art, runtime AI, answer-key exposure, restricted-table exposure, or Case 004 behavior/data change was introduced.

## Audit Results

### WP-251 Audit Report

### Verdict
**PASS**

---

### Violations
**None.** All changed and added files are strictly within the `Allowed:` list in [WP-251-case-001-gated-validator-integration-boundary.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-251-case-001-gated-validator-integration-boundary.md):
- [`case001GatedMilestoneEvaluationService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/case001GatedMilestoneEvaluationService.ts)
- [`case001GatedMilestoneEvaluationService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts)
- [`package.json`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/package.json)
- [`SSOT-Case-Progression.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Progression.md)
- [`SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md)
- [`SSOT-Case-Authoring.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md)
- Tracked `.understand-anything/*` graph artifacts

All `Do Not Modify:` boundaries (`apps/web/**`, `apps/api/src/routes/**`, query execution/history/schema/metadata/safety/restricted-table/verification services, `case001ResultPatternService.ts`, `types/query.ts`, `queryResultNormalizer.ts`, `database/**`, scripts, package-lock.json) were fully preserved.

---

### Regressions
**None.**
- All 14 API service and route test suites passed (`npm run test --workspace apps/api`).
- API build succeeded (`npm run build --workspace apps/api`).
- Case 004 data, authoring definitions, and playable module bindings remain unchanged.

---

### Missing Tests or Validation
**None.**
- **Positive paths**: Covers gate-enabled evaluation calling the WP-250 validator for `case-001` and matching public fixture rows.
- **Negative & Gate paths**: Covers gate-enabled no-match, gate-disabled no-call (verifying validator call count is 0), wrong case ID no-call (verifying validator call count is 0), non-spoiler metadata stripping (no row data or SQL text in result payload), and duplicate match handling without advancing progression.
- **Validation Commands**: API unit tests, API build, pre-refresh Understand readiness (`check-understand-refresh-readiness.ps1`), Understand graph refresh (`refresh-understand-graph.ps1`), post-refresh Understand readiness (`READY`), and `git diff --check` were executed and passed cleanly.

---

### Scope Drift Risks
**None.**
- Case 001 remains gated by default (`VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` is `false`) and locked in the UI.
- Case 001 was **not** added to `PLAYABLE_STUDENT_CASE_MODULES`.
- The integration boundary is pure, synchronous, deterministic, and unwired from runtime API routes, query execution, frontend rendering, milestone transitions, persistence, evidence logging, investigation threads, mentor guidance, or suspect verification.
- No environment variables, localStorage, request state, files, database state, network, or AI outputs are used as progression authority.
- No suspect identities, answer key values, restricted table contents, or hidden solution details are exposed.

## Final Decision

Accepted on 2026-08-13 after independent audit PASS and human closeout request. WP-251 satisfies the Case 001 gated validator integration-boundary requirements, preserves Case 001 as gated and unreleased, avoids runtime query execution/route wiring and answer-key exposure, and leaves Case 004 behavior intact.


