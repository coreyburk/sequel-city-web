# WP-288: case 001 durable attempts and shared query lab

## Objective

Deliver the complete Case 001 durable-attempt vertical slice and one reusable Query Lab consuming the backend current-task contract.

## Scope

Requires independently audited and human-accepted WP-287. Supersedes WP-284 UI implementation scope; Case 004 retains its legacy adapter until WP-289.

Contract: docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md. Baseline aea394a. This is a local deterministic runtime change; no accounts/cloud/CMS/runtime AI and no stack change. END-OF-DAY-HANDOFF is closeout-only. WP-286 may create downstream plans but does not implement their runtime scopes.

## Impact Analysis

### Understand Status

- Graph available: Yes, knowledge graph/fingerprints/metadata/inventory present.
- Baseline commit: 9237261c87af0e5fbc42408ba0dc4dba1322b4b7.
- Freshness assessment: usable working-source baseline for navigation; WP-283 graph was refreshed for its runner changes before aea394a closeout. New architecture docs require refresh. Verify freshness again when this package begins.
- Analysis performed: Required tier; targeted graph searches for databaseBootstrapService, schemaService, queryExecutionService and studentCaseModule; source paths, current SQL account provisioning, case hooks, API/package tests and browser specs verified. Source governs over graph summaries.

### Affected Architecture

- Layers: case authoring/SSOT, SQL bootstrap/security, API repositories/progression, browser workspace/shared presentation as scoped below.
- Primary files/components: allowed paths; contract couples existing queryExecutionService and databaseBootstrapService to future parameterized repository/attempt services.
- Upstream consumers: student case entry, Query Lab, Evidence Board and local setup scripts.
- Downstream dependencies: dbo evidence, controlled suspect verifier, versioned app content/proofs and learner workspace.

### Regression Surface

- Related tests: npm run test --workspace api; npm run test --workspace web; npm run build; npm run test:browser --workspace web -- case-001-live-smoke.spec.ts student-mode.spec.ts. Add isolated concurrency/permission integration tests and record live local stack identity.
- User workflows: fresh/resume, complete clue path, logging, suspect verification where released, custom draft, saved notes and setup recovery.
- Security/data boundaries: no app/answer/future-step leakage; actual learner permissions, ownership, CSRF, pinned versions and no UI-only proof.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: structural contracts/runtime/database/progression changes; own all four tracked artifacts and readiness verification in this package. Do not introduce unimplemented runtime relationships from proposed documentation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-288-case-001-durable-attempts-and-shared-query-lab.md
- apps/api/src/app.ts
- apps/api/src/routes/caseRuntimeRoutes.ts
- apps/api/src/routes/caseRuntimeRoutes.test.ts
- apps/api/src/routes/queryRoutes.ts
- apps/api/src/routes/queryRoutes.test.ts
- apps/api/src/services/localLearnerService.ts
- apps/api/src/services/localLearnerService.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/case001ResultPatternService.ts
- apps/api/src/services/case001GatedMilestoneEvaluationService.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/package.json
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/api/types.ts
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.case001.test.tsx
- apps/web/src/studentCaseModule.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/student/StudentMentorHeader.tsx
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/components/student/StudentCaseEntryFlow.tsx
- apps/web/src/components/student/CurrentCaseTask.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/useCaseAttempt.ts
- apps/web/src/useCaseAttempt.test.tsx
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/studentModeApi.ts
- apps/web/tests/browser/studentModeHarness.ts
- apps/web/tests/browser/student-mode.spec.ts
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/00-ssot/SSOT-UI-UX-Experience.md
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- database/migrations/**

## Constraints

Dependencies must pass independent audit and human acceptance. Never execute destructive base scripts against the live database without explicit rebuild authorization. Do not accept your own package. External audit requires user authorization and isolated active-WP scope. Preserve unrelated work. Do not add dependencies or an arbitrary rule engine. If a required integration file is missing from scope, amend/review the scope before editing it; do not silently expand it.

## Required Behavior

- Implement owner cookie/trusted CORS/CSRF and strict route schemas; document session secret configuration without shipping a default secret.
- Implement transactional attempts, actions, ordered Case 001 proofs, workspace bounds, ownership/version checks, idempotency and revision races.
- Build generic current-task UI and typed client; separate whole-case dossier from task guidance and offered starter from retained draft.
- Fresh preserves old attempt; resume visibly shows saved progress. Preserve legacy backups and import only notes/draft or safely revalidated references.
- Run fresh CrimeType -> narrowed report -> linked interviews -> released-review browser path, multi-row refinement, owner/CSRF/replay/stale/version failures and draft edit races. Verify Case 004 legacy regression.

Simplicity check: reuse existing SQL safety, result normalization, verifier and native disclosure controls; use one current-task contract and one bounded workspace. Backend validator code is justified for real evidence semantics; do not create a generic scripting language. Database protection and reference playthroughs are mandatory even if they increase implementation size.

## Acceptance Criteria

- [ ] Fresh Case 001 starts at CrimeType with no claim that rows were found.
- [ ] One direction and collapsed hint align with task/start SQL; no automatic custom draft replacement.
- [ ] Reload/restart resumes database-owned progress; fresh archives/resumes previous attempt with saved summary.
- [ ] Untrusted flags/rows, wrong owners, future steps, stale requests and mismatched versions cannot advance.
- [ ] Full API/web tests/build, live Case 001 smoke, legacy Case 004 smoke and graph checks pass.

## Code Prompt

Implement this package only after its dependencies are accepted. Follow CASE-RUNTIME-CONTRACTS and this allowed list. Record exact changed files, validation commands/outcomes and limitations. Maintain authoritative base creation/data/FK coverage whenever schema/content changes. Refresh the graph, run readiness and prepare isolated audit context. Do not self-accept, commit or push.

## Audit Prompt

Independently audit changed files against package scope, SSOT and runtime contracts. Verify simplicity, evidence authority, all listed positive/negative validation and bootstrap coverage, draft ownership, Case 001 completion limits and Case 004 parity where applicable. Require actual SQL-access evidence for database packages; mocked checks are insufficient. Confirm no future-step/answer leakage and no live destructive actions. Report Verdict: PASS or FAIL with evidence, or BLOCKED for missing environment/authorization; leave human acceptance pending.

## Code Results

Pending implementation.

## Audit Results

Pending audit.

## Final Decision

Pending human acceptance.