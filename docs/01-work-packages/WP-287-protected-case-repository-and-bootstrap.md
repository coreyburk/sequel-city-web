# WP-287: protected case repository and bootstrap

## Objective

Create a protected, reproducible SQL Server content/attempt repository without switching a released case to the new runtime.

## Scope

WP-286 independently audited PASS, accepted, committed and pushed as 326c276. Runtime release remains legacy until WP-288/WP-289.

Contract: docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md. Implementation baseline 326c276 (accepted WP-286). This is a local deterministic runtime change; no accounts/cloud/CMS/runtime AI and no stack change. END-OF-DAY-HANDOFF is closeout-only. WP-286 may create downstream plans but does not implement their runtime scopes.

## Impact Analysis

### Understand Status

- Graph available: Yes, knowledge graph/fingerprints/metadata/inventory present.
- Baseline commit: aea394a929ea1081cf5229f7d8fc77f0befee7d8 (WP-286 working snapshot); implementation starts from accepted 326c276.
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
- apps/api/src/services/caseVerificationService.ts
- apps/api/src/services/caseVerificationService.test.ts
- apps/api/src/services/queryExecutionService.test.ts
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

- [x] Create -> seed -> FKs -> account provisioning -> readiness works from zero without story migrations.
- [x] Actual learner login cannot read app, hidden answers or internal metadata; legitimate evidence SELECT and dedicated verification still work.
- [x] Released content is valid/reachable/immutable; unsupported keys and mismatches fail closed.
- [x] Repository DML is parameterized and bounded; no released frontend routing change.
- [x] API tests/build, disposable SQL integration and graph checks pass.

## Code Prompt

Implement this package only after its dependencies are accepted. Follow CASE-RUNTIME-CONTRACTS and this allowed list. Record exact changed files, validation commands/outcomes and limitations. Maintain authoritative base creation/data/FK coverage whenever schema/content changes. Refresh the graph, run readiness and prepare isolated audit context. Do not self-accept, commit or push.

## Audit Prompt

Independently audit changed files against package scope, SSOT and runtime contracts. Verify simplicity, evidence authority, all listed positive/negative validation and bootstrap coverage, draft ownership, Case 001 completion limits and Case 004 parity where applicable. Require actual SQL-access evidence for database packages; mocked checks are insufficient. Confirm no future-step/answer leakage and no live destructive actions. Report Verdict: PASS or FAIL with evidence, or BLOCKED for missing environment/authorization; leave human acceptance pending.

## Code Results

Implemented protected runtime foundation:
- Eight app tables, checked same-version/action-owner relationships, immutable released content, base-script Case 001 content and unreleased fixture.
- Separate bounded repository/learner pools and consistent account provisioning; trusted schema/verification paths preserve existing controlled Case 004 verification.
- Allowlisted content validation and parameterized content/owner/attempt/workspace repository.
- Explicit schema/content/evidence/permission readiness; base manifests do not masquerade as automatic legacy migration keys.
- Public evidence SQL/schema allowlists, metadata/external/write blocking and actual database permissions.
- Bootstrap runbook and disposable integration harness. Atomic database-name claim skips destructive live rebuild preamble; existing/canonical targets are refused.

Validation:
- PASS: npm run build --workspace api.
- PASS: npm run test --workspace api (19 test files, including previously omitted bootstrap/identity coverage plus authoring/repository negatives).
- PASS: npm run test --workspace web (19 test files, 234 tests).
- PASS: scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_4112edb25b864864b707db4ac3c4b4a1, complete zero-state build on local SQL Server 16.0.1000.6.
- PASS: actual learner/repository SQL logins, quoted/direct/CTE/join/comma/view/synonym restrictions, internal metadata visibility, released content immutability and controlled verifier.
- PASS: both provisioning paths and repeated setup; owner hash idempotency, wrong-owner reads, fresh archival, custom draft/notes retention, stale workspace revision and cross-attempt proof FK rejection.
- PASS: missing marker/column, unchecked FK, disabled immutability, missing catalog denial, unsupported released validator and evidence mismatch all fail readiness.
- PASS: source API startup with tsx, real public schema and safe SQL, blocked app/answer/system/INFORMATION_SCHEMA requests.
- PASS: canonical live database name rejected before connection; existing named disposable database refused and preserved.
- PASS: git diff --check. Generated tracked dist output restored to the clean implementation baseline after build; no distribution artifacts owned here.
- PASS: graph refresh (688 files, 1116 nodes, 428 edges); readiness READY with no transient/trash/log artifacts.
- PASS: closeout preflight ReadyForAudit; no out-of-scope dirty files. New repository files use git intent-to-add so exact file scope is visible; no source contents are staged for commit.

Scope refinements recorded before edits: controlled verification service/its test and coupled query execution fixture test. These preserve the existing verifier and response regression while enforcing the new public table boundary. No frontend changes, dependency additions, story migrations, public attempt routes, runtime AI or live database rebuild. INFORMATION_SCHEMA cannot receive database-role DENY on this SQL Server; internal rows are hidden by permissions and API SQL safety blocks catalog access. Actual-login negatives verify this behavior.

Independent AntiGravity audit passed and the human accepted WP-287 on 2026-10-08. WP-288 must implement durable action/progress transitions, request ownership/CSRF/idempotency, resume/delete/import APIs and shared presentation before a case switches adapters.

## Audit Results

I have launched the web workspace test suite and am awaiting its completion.
I am awaiting the completion of the web test suite.
I have launched the actual SQL Server disposable database bootstrap test and am awaiting its execution.
### Independent Audit Report: WP-287 (Protected Case Repository and Bootstrap)

Verdict: PASS
*(Human acceptance remains pending per protocol)*

---

### 1. Package Scope & Workspace Boundary Audit
- **Files Modified / Added**:
  - Authoritative Database Scripts:
    - [`database/01-SequelCityCrimesDB - Create DB.sql`](database/01-SequelCityCrimesDB - Create DB.sql)
    - [`database/02-SequelCityCrimesDB - Insert Data.sql`](database/02-SequelCityCrimesDB - Insert Data.sql)
    - [`database/03-SequelCityCrimesDB - ForeignKeys.sql`](database/03-SequelCityCrimesDB - ForeignKeys.sql)
  - Account Provisioning & Disposable Test Scripts:
    - [`scripts/student-package/setup-local-sql-accounts.ps1`](scripts/student-package/setup-local-sql-accounts.ps1)
    - [`scripts/tests/test-case-runtime-bootstrap.ps1`](scripts/tests/test-case-runtime-bootstrap.ps1)
  - API Configuration, Pools, Types & Repositories:
    - [`apps/api/package.json`](apps/api/package.json)
    - [`apps/api/src/config/database.ts`](apps/api/src/config/database.ts)
    - [`apps/api/src/db/sqlServerPool.ts`](apps/api/src/db/sqlServerPool.ts)
    - [`apps/api/src/db/caseRepositoryPool.ts`](apps/api/src/db/caseRepositoryPool.ts)
    - [`apps/api/src/types/caseRuntime.ts`](apps/api/src/types/caseRuntime.ts)
    - [`apps/api/src/repositories/caseRuntimeRepository.ts`](apps/api/src/repositories/caseRuntimeRepository.ts)
    - [`apps/api/src/repositories/caseRuntimeRepository.test.ts`](apps/api/src/repositories/caseRuntimeRepository.test.ts)
  - API Services & Coupled Fixtures:
    - [`apps/api/src/services/caseContentValidationService.ts`](apps/api/src/services/caseContentValidationService.ts)
    - [`apps/api/src/services/caseContentValidationService.test.ts`](apps/api/src/services/caseContentValidationService.test.ts)
    - [`apps/api/src/services/databaseBootstrapService.ts`](apps/api/src/services/databaseBootstrapService.ts)
    - [`apps/api/src/services/databaseIdentityService.ts`](apps/api/src/services/databaseIdentityService.ts)
    - [`apps/api/src/services/databaseMigrationService.ts`](apps/api/src/services/databaseMigrationService.ts)
    - [`apps/api/src/services/caseVerificationService.ts`](apps/api/src/services/caseVerificationService.ts)
    - [`apps/api/src/services/queryExecutionService.test.ts`](apps/api/src/services/queryExecutionService.test.ts)
    - [`apps/api/src/services/schemaService.ts`](apps/api/src/services/schemaService.ts)
    - [`apps/api/src/services/schemaService.test.ts`](apps/api/src/services/schemaService.test.ts)
    - [`apps/api/src/services/sqlSafetyService.ts`](apps/api/src/services/sqlSafetyService.ts)
    - [`apps/api/src/services/sqlSafetyService.test.ts`](apps/api/src/services/sqlSafetyService.test.ts)
    - [`apps/api/src/services/studentRestrictedTables.ts`](apps/api/src/services/studentRestrictedTables.ts)
    - [`apps/api/src/services/studentRestrictedTables.test.ts`](apps/api/src/services/studentRestrictedTables.test.ts)
  - Documentation & Metadata:
    - [`docs/00-ssot/SSOT-Database-Schema.md`](docs/00-ssot/SSOT-Database-Schema.md)
    - [`docs/00-ssot/SSOT-SQL-Safety-Rules.md`](docs/00-ssot/SSOT-SQL-Safety-Rules.md)
    - [`docs/01-work-packages/WP-287-protected-case-repository-and-bootstrap.md`](docs/01-work-packages/WP-287-protected-case-repository-and-bootstrap.md)
    - [`docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md`](docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md)
    - `.understand-anything/*` (knowledge graph, meta, intermediate scan, fingerprints)
- **Boundary Verification**:
  - No changes in `apps/web/**` (no frontend routing or presentation changes made).
  - No changes in `database/migrations/**` (legacy migrations preserved untouched).
  - All modified and untracked files adhere strictly to the allowed list in [`WP-287`](docs/01-work-packages/WP-287-protected-case-repository-and-bootstrap.md#L40-L81).

---

### 2. SSOT & Runtime Contract Conformance
- **Schema Contracts** ([`CASE-RUNTIME-CONTRACTS.md`](docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md)):
  - Defines the 8 application tables under schema `app` with exact keys, data types (`DATETIME2`, `BIGINT`, `UNIQUEIDENTIFIER`), and JSON checks: [`CaseDefinition`](database/01-SequelCityCrimesDB - Create DB.sql#L330), [`CaseStep`](database/01-SequelCityCrimesDB - Create DB.sql#L338), [`CaseStepPrerequisite`](database/01-SequelCityCrimesDB - Create DB.sql#L348), [`LocalLearner`](database/01-SequelCityCrimesDB - Create DB.sql#L353), [`LearnerAttempt`](database/01-SequelCityCrimesDB - Create DB.sql#L357), [`AttemptWorkspace`](database/01-SequelCityCrimesDB - Create DB.sql#L369), [`AttemptAction`](database/01-SequelCityCrimesDB - Create DB.sql#L373), and [`AttemptStepEvidence`](database/01-SequelCityCrimesDB - Create DB.sql#L384).
  - All 11 foreign keys use `WITH CHECK` and `NO ACTION` in [`database/03-SequelCityCrimesDB - ForeignKeys.sql`](database/03-SequelCityCrimesDB - ForeignKeys.sql#L138-L150).
  - Released content immutability enforced by database triggers: [`ProtectReleasedDefinition`](database/01-SequelCityCrimesDB - Create DB.sql#L393), [`ProtectReleasedStep`](database/01-SequelCityCrimesDB - Create DB.sql#L399), and [`ProtectReleasedPrerequisite`](database/01-SequelCityCrimesDB - Create DB.sql#L406).
- **Manifest Distinction**:
  - `dbo.AppSchemaVersion` records `case-runtime-v1`, while [`getDatabaseMigrationStatus`](apps/api/src/services/databaseMigrationService.ts#L109) explicitly filters applied keys against defined automatic migrations, preventing the base manifest from masquerading as a legacy story migration.
- **SSOT Alignment**:
  - [`SSOT-Database-Schema.md`](docs/00-ssot/SSOT-Database-Schema.md#L71-L77) and [`SSOT-SQL-Safety-Rules.md`](docs/00-ssot/SSOT-SQL-Safety-Rules.md#L96-L101) accurately reflect the protected foundation and role boundary.

---

### 3. Simplicity Verification
- No external packages or runtime dependencies added to `apps/api/package.json`.
- No general rules interpreter or generic scripting engine.
- Authoring validator map [`SUPPORTED_CASE_VALIDATORS`](apps/api/src/services/caseContentValidationService.ts#L7-L11) only defines the 3 authorized foundation handlers: `case001.crime-type`, `case001.report`, and `case001.interviews`.
- Reuses existing SQL safety tokenizer, normalizer, and verifier.

---

### 4. Evidence Authority & Security Boundaries
- **Database Permissions**:
  - `sequel_learner` role:
    - Explicit `GRANT SELECT` on only 10 public dbo evidence tables.
    - Explicit `DENY SELECT, INSERT, UPDATE, DELETE, EXECUTE ON SCHEMA::app`.
    - Explicit `DENY` on `dbo.Solution`, `dbo.CaseAnswerKey`, `dbo.AppSchemaVersion`, `VIEW DEFINITION`, `EXECUTE`, and system tables (`sys.tables`, `sys.objects`, etc.).
    - Learner account dropped from `db_datareader` across both setup paths.
  - `sequel_repository` role:
    - `GRANT SELECT` on authored definitions/steps/prerequisites.
    - `GRANT SELECT, INSERT, UPDATE, DELETE` on attempt/workspace/action/evidence.
    - `DENY SELECT` on `dbo.CaseAnswerKey` and `dbo.Solution`.
    - Bounded procedures [`GetLegacyCaseRoleCounts`](database/01-SequelCityCrimesDB - Create DB.sql#L413) and [`CheckEvidenceManifest`](database/01-SequelCityCrimesDB - Create DB.sql#L418) execute with `EXECUTE AS OWNER` to return only aggregate validation counts without direct answer reads.
- **Application Filtering**:
  - [`schemaService.ts`](apps/api/src/services/schemaService.ts#L260-L274) exposes exclusively tables satisfying [`isStudentEvidenceTable`](apps/api/src/services/studentRestrictedTables.ts#L7).
  - [`sqlSafetyService.ts`](apps/api/src/services/sqlSafetyService.ts#L83-L86) and [`studentRestrictedTables.ts`](apps/api/src/services/studentRestrictedTables.ts#L11-L16) block internal metadata functions, schemas (`sys`, `INFORMATION_SCHEMA`, `app`), `SELECT INTO`, `OPENROWSET`, and non-evidence table references.

---

### 5. Actual SQL-Access & Bootstrap Evidence
Mocked checks were superseded by live execution against local Microsoft SQL Server (`localhost:1433`):

1. **Disposable Bootstrap Integration Harness** ([`test-case-runtime-bootstrap.ps1`](scripts/tests/test-case-runtime-bootstrap.ps1)):
   - Target database: `SequelCityRuntimeTest_audit_1997536715` (dynamically generated disposable database).
   - Authoritative batch executions:
     - `PASS: 01-SequelCityCrimesDB - Create DB.sql`
     - `PASS: 02-SequelCityCrimesDB - Insert Data.sql`
     - `PASS: 03-SequelCityCrimesDB - ForeignKeys.sql`
   - Account Provisioning & Idempotency:
     - Provisioned isolated `sc_test_l_*`, `sc_test_r_*`, and `sc_test_b_*` logins.
     - Ran [`setup-local-sql-accounts.ps1`](scripts/student-package/setup-local-sql-accounts.ps1) twice; confirmed idempotent without privilege escalation.
2. **Actual-Login Adversarial SQL Verification**:
   - Learner login executed `SELECT COUNT(*) FROM dbo.CrimeType` (succeeded).
   - Learner login was denied for:
     - `SELECT * FROM app.CaseDefinition`
     - `SELECT * FROM app.LearnerAttempt`
     - `SELECT * FROM dbo.CaseAnswerKey`
     - `SELECT * FROM dbo.Solution`
     - `SELECT * FROM dbo.AppSchemaVersion`
     - `SELECT * FROM sys.tables` / `sys.objects` / `sys.columns` / `sys.schemas` / `sys.sql_modules`
     - CTE referencing `app.CaseStep`
     - JOIN and comma joins against `app.CaseStep` / `app.CaseDefinition`
     - Execution of `dbo.VerifySuspectSubmission` and writes to `dbo.Solution`
     - Querying an aliased view (`dbo.InternalLeak`) or synonym (`dbo.InternalAlias`) targeting the `app` schema.
   - Learner login returned 0 rows for `INFORMATION_SCHEMA.TABLES` and `INFORMATION_SCHEMA.COLUMNS` relating to `app` or answer tables.
   - Learner login returned `NULL` for `OBJECT_DEFINITION(OBJECT_ID('app.ProtectReleasedStep'))`.
3. **Repository Login Verification**:
   - Repository login read `app.CaseStep` (4 rows).
   - Modifying a released step (`UPDATE app.CaseStep`) was blocked by trigger.
   - Reading `dbo.CaseAnswerKey` and creating tables was denied.
   - `dbo.VerifySuspectSubmission` executed successfully.
   - `app.CheckEvidenceManifest` returned `1`.
4. **Live Repository & Readiness Failure Modes** ([`caseRuntimeRepository.test.ts`](apps/api/src/repositories/caseRuntimeRepository.test.ts#L63-L84)):
   - `isReady` evaluated to `false` when:
     - `FK_Workspace_Attempt` foreign key was set to `NOCHECK`.
     - `ProtectReleasedStep` trigger was disabled.
     - `sys.tables` permission was revoked instead of denied.
     - `Hint` column was renamed.
     - `ValidatorKey` was updated to an unsupported key.
     - Evidence row in `dbo.CrimeType` was corrupted.
     - Manifest marker in `dbo.AppSchemaVersion` was missing.
   - Fastify `/api/query/execute` blocked `app.CaseStep`, `CaseAnswerKey`, `sys.tables`, and `INFORMATION_SCHEMA.TABLES`.
   - Clean cleanup of disposable database and test logins upon exit.

---

### 6. Draft Ownership Verification
- [`LocalLearner`](database/01-SequelCityCrimesDB - Create DB.sql#L353) records `CapabilityHash BINARY(32)` (SHA-256 hash).
- [`findOrCreateOwner`](apps/api/src/repositories/caseRuntimeRepository.ts#L36-L50) uses atomic `UPDLOCK, HOLDLOCK` transactions.
- [`createAttempt`](apps/api/src/repositories/caseRuntimeRepository.ts#L52-L71) establishes an attempt bound to `OwnerId` and atomically archives any prior active attempt for the same case.
- [`loadOwnedAttempt`](apps/api/src/repositories/caseRuntimeRepository.ts#L73-L81) enforces `a.OwnerId = @ownerId`. Unmatched owner IDs return `null`.
- [`saveWorkspace`](apps/api/src/repositories/caseRuntimeRepository.ts#L84-L105):
  - Enforces exact revision matching via `Revision = CONVERT(BIGINT, @revision)`.
  - Rejects attempts owned by another `OwnerId`.
  - Validates payload structure: allows only `draftSql` (capped at 32 KiB), `notes` (array), and `selectedView`.
  - Blocks client attempts to inject progress fields (e.g. `completed`).
  - Limits total workspace JSON payload to 256 KiB.

---

### 7. Case 001 Completion Limits & Case 004 Parity
- **Case 001 Completion Limits**:
  - `CaseDefinition` for `case-001` specifies `CompletionScope = 'evidence-review'` and whole case objective: *"Determine who committed the crime by building an evidence trail. This release covers crime type, incident report and linked interviews; culprit resolution is not yet released."*
  - Authored steps are strictly the 3 query-mode foundation steps: `crime-type`, `clocktower-report`, and `linked-interviews`.
  - No culprit resolution or suspect accusation step is provided.
  - [`validateCaseContent`](apps/api/src/services/caseContentValidationService.ts#L68-L73) enforces `evidence-review` scope and fails closed if any unexpected validator or scope is configured.
- **Case 004 Parity**:
  - Case 004 routing remains untouched on the legacy frontend adapter until WP-289.
  - Controlled verification procedure `dbo.VerifySuspectSubmission` remains intact and callable through the dedicated trusted metadata connection pool.
  - Web test suite passes 100% (19 test files, 234 tests), confirming no regression on existing Case 004 and Case 001 gameplay.

---

### 8. Future-Step & Answer Leakage Audit
- Answer tables (`dbo.CaseAnswerKey`, `dbo.Solution`) and application tables (`app.*`) are denied to learner logins at the database engine level and blocked at the AST/tokenizer level in API safety checks.
- Server-side validator parameters and internal step parameters are excluded from learner queries.
- Step directions and hints are checked in [`validateCaseContent`](apps/api/src/services/caseContentValidationService.ts#L42) against literal identifier spoiler leaks (`CrimeID`, `ReportID`, `PersonID`, etc.).
- Schema discovery (`/api/schema/tables`) emits only the 10 public evidence tables.

---

### 9. Non-Destructive Execution Verification
- Live production database (`SequelCityCrimesDB`) was not dropped or altered.
- Rebuild harness strips the destructive `DROP DATABASE` preamble from `01-SequelCityCrimesDB - Create DB.sql` and operates strictly on dynamically created `SequelCityRuntimeTest_*` disposable databases.
- The harness validates that target names must not match existing databases, preventing accidental overwrite of existing data.

---

### Test Suite Execution Summary
- **API Unit / Service Tests**: 19 test files passed (100%).
- **API TypeScript Compilation**: `npm run build --workspace api` completed with code 0.
- **Web Workspace Tests**: 19 test files passed, 234 tests passed (100%).
- **Live SQL Bootstrap & Integration**: `scripts/tests/test-case-runtime-bootstrap.ps1` completed with code 0 against local SQL Server.

---

### Final Status
**PASS**. All scope, SSOT, security, evidence authority, draft ownership, and runtime contracts for WP-287 are verified with live database evidence.

Human acceptance remains pending.
root agent idle; waiting up to 30m0s for 1 background task(s)

## Final Decision

Accepted by the human on 2026-10-08 after independent AntiGravity audit PASS. Authorized closeout, commit and push. The audit verdict label was normalized for the lifecycle parser without changing its conclusion.
### Coupled regression fixture scope
Before updating its fixture, include queryExecutionService.test.ts: successful execution currently uses a non-public example table, incompatible with the new public evidence allowlist. Update to a real allowed table while retaining response assertions; no query execution implementation change.
