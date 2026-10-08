# WP-287: protected case repository and bootstrap

## Objective

Create a protected, reproducible SQL Server content/attempt repository without switching a released case to the new runtime.

## Scope

Requires independently audited and human-accepted WP-286. Runtime release remains legacy until WP-288/WP-289.

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

- Related tests: npm run test --workspace api; npm run build --workspace api; powershell -File scripts/tests/test-case-runtime-bootstrap.ps1 against an explicitly named disposable database. Include databaseBootstrapService and databaseIdentityService tests in package test command.
- User workflows: fresh/resume, complete clue path, logging, suspect verification where released, custom draft, saved notes and setup recovery.
- Security/data boundaries: no app/answer/future-step leakage; actual learner permissions, ownership, CSRF, pinned versions and no UI-only proof.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: structural contracts/runtime/database/progression changes; own all four tracked artifacts and readiness verification in this package. Do not introduce unimplemented runtime relationships from proposed documentation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-287-protected-case-repository-and-bootstrap.md
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- apps/api/src/config/database.ts
- apps/api/src/db/sqlServerPool.ts
- apps/api/src/db/caseRepositoryPool.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/src/services/caseContentValidationService.ts
- apps/api/src/services/caseContentValidationService.test.ts
- apps/api/src/services/databaseBootstrapService.ts
- apps/api/src/services/databaseBootstrapService.test.ts
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- apps/api/src/services/databaseMigrationService.ts
- apps/api/src/services/studentRestrictedTables.ts
- apps/api/src/services/studentRestrictedTables.test.ts
- apps/api/src/services/sqlSafetyService.ts
- apps/api/src/services/sqlSafetyService.test.ts
- apps/api/src/services/schemaService.ts
- apps/api/src/services/schemaService.test.ts
- apps/api/package.json
- scripts/student-package/setup-local-sql-accounts.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- docs/00-ssot/SSOT-Database-Schema.md
- docs/00-ssot/SSOT-SQL-Safety-Rules.md
- docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- apps/web/**
- database/migrations/**

## Constraints

Dependencies must pass independent audit and human acceptance. Never execute destructive base scripts against the live database without explicit rebuild authorization. Do not accept your own package. External audit requires user authorization and isolated active-WP scope. Preserve unrelated work. Do not add dependencies or an arbitrary rule engine. If a required integration file is missing from scope, amend/review the scope before editing it; do not silently expand it.

## Required Behavior

- Implement contract app tables/indexes/checks and checked same-version FKs; seed draft fixture and complete released Case 001 content in authoritative base scripts. Case 004 remains unavailable on new routing until WP-289.
- Provision separate bounded learner/repository accounts in both setup paths; remove broad reader access and protect metadata/internal schema. Trusted metadata enumeration emits only public evidence.
- Implement parameterized content/attempt repository and allowlisted content validation. Do not enable arbitrary learner execution through writer credentials.
- Require explicit object/permission/content/evidence manifest readiness. Legacy migrations cannot satisfy new runtime readiness; retain legacy startup compatibility until route switch.
- Add disposable database zero-build, partial-build, permission/adversarial SQL and repository tests. Name/verify disposable target before any rebuild; no live destructive execution. Document backup/export/setup behavior.

Simplicity check: reuse existing SQL safety, result normalization, verifier and native disclosure controls; use one current-task contract and one bounded workspace. Backend validator code is justified for real evidence semantics; do not create a generic scripting language. Database protection and reference playthroughs are mandatory even if they increase implementation size.

## Acceptance Criteria

- [ ] Create -> seed -> FKs -> account provisioning -> readiness works from zero without story migrations.
- [ ] Actual learner login cannot read app, hidden answers or internal metadata; legitimate evidence SELECT and dedicated verification still work.
- [ ] Released content is valid/reachable/immutable; unsupported keys and mismatches fail closed.
- [ ] Repository DML is parameterized and bounded; no released frontend routing change.
- [ ] API tests/build, disposable SQL integration and graph checks pass.

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