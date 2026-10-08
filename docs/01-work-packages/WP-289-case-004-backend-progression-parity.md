# WP-289: case 004 backend progression parity

## Objective

Port the complete Case 004 clue path into database-authored tasks and backend proof handlers, using the same Query Lab as Case 001.

## Scope

Requires independently audited and human-accepted WP-288 and source-traced parity matrix. No Case 004 release before every substep passes.

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

- Related tests: npm run test --workspace api; npm run test --workspace web; npm run build; npm run test:browser --workspace web -- student-mode.spec.ts outlier-user-path.spec.ts case-001-live-smoke.spec.ts; disposable bootstrap suite.
- User workflows: fresh/resume, complete clue path, logging, suspect verification where released, custom draft, saved notes and setup recovery.
- Security/data boundaries: no app/answer/future-step leakage; actual learner permissions, ownership, CSRF, pinned versions and no UI-only proof.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: structural contracts/runtime/database/progression changes; own all four tracked artifacts and readiness verification in this package. Do not introduce unimplemented runtime relationships from proposed documentation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-289-case-004-backend-progression-parity.md
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- apps/api/src/services/case004ProgressionService.ts
- apps/api/src/services/case004ProgressionService.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/caseContentValidationService.ts
- apps/api/src/services/caseContentValidationService.test.ts
- apps/api/src/services/caseVerificationService.ts
- apps/api/src/services/caseVerificationService.test.ts
- apps/api/src/routes/caseRuntimeRoutes.ts
- apps/api/src/routes/caseRuntimeRoutes.test.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/package.json
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.upsert.test.tsx
- apps/web/src/studentCase.ts
- apps/web/src/studentCaseModule.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/useCaseAttempt.ts
- apps/web/src/useCaseAttempt.test.tsx
- apps/web/tests/browser/student-mode.spec.ts
- apps/web/tests/browser/outlier-user-path.spec.ts
- apps/web/tests/browser/studentModeApi.ts
- apps/web/tests/browser/studentModeHarness.ts
- apps/web/tests/browser/studentOutlierHarness.ts
- docs/15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
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

- Trace every matrix row against current helpers/fixtures before porting; preserve explicit collection/log/verify semantics, not SQL-string correctness defects.
- Seed full Case 004 version and prerequisites in base scripts, register strict backend handlers and observed facts.
- Persist witness/identity/profile/event collections, ambiguity and employment comparison; verify murderer then mastermind with proved prerequisites.
- Switch Case 004 adapter atomically; remove duplicate instructional branches for that case and safely retain/import legacy notes.
- Run complete reference playthrough and restart/resume at each collection boundary, equivalent SQL, duplicates and cross-case isolation.

Simplicity check: reuse existing SQL safety, result normalization, verifier and native disclosure controls; use one current-task contract and one bounded workspace. Backend validator code is justified for real evidence semantics; do not create a generic scripting language. Database protection and reference playthroughs are mandatory even if they increase implementation size.

## Acceptance Criteria

- [ ] Every parity matrix row passes including both suspect roles and all mastermind substeps.
- [ ] No SQL draft/normalization/notebook prose establishes correctness.
- [ ] Case 004 uses generic task rendering without a second Query Lab or competing directions.
- [ ] Creation/data/FK rebuild includes full Case 004 content; new version validity proven before release.
- [ ] Case 001 regression, full API/web/browser suites, disposable rebuild and graph checks pass.

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