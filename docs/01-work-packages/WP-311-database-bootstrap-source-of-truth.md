# WP-311: Database bootstrap source of truth

## Objective

Make the three database bootstrap scripts the organized, self-documented origin of the current supported database. A junior developer must be able to find each table, its data, case relationships, installation order, and validation responsibilities without reconstructing work-package history or inspecting a running database.

## Scope

Consolidate only current live definitions and seed records into their appropriate sections across the existing three scripts. Historical releases, superseded records and test fixtures must not be included in bootstrap scripts. Document an explicit authority hierarchy and contributor rules. Adapt dependent fixture extraction and validate equivalent fresh builds. This is a source organization and maintainability change, not a story revision or an operational database migration. Installer recognition changes only to accept a current-only release cohort without synthetic historical rows; all safety checks remain required.

## Impact Analysis

Understand tier: Required (database source, restricted answer data, installer and test consumers).

Graph available: knowledge-graph.json and fingerprints.json present. Initial planning used baseline 322e5e0 before the accepted WP-312 backlog was integrated. Implementation starts from accepted main 0e8d244 on codex/wp-311-bootstrap-source-of-truth; those runtime changes are now committed, not pending implementation. The graph was refreshed against this implementation and validated. Targeted source review confirms bootstrap -> installer/package -> fixture/runtime relationships; source remains authoritative over generated summaries.

Verified pre-cleanup findings:
- Current report already resides in CrimeSceneReport seed data, but steward/suspect statements and culprit are appended after CaseAnswerKey in a WP-300 block.
- The appended comment incorrectly says one witness although two statements are inserted.
- Runtime harness extracts that block using WP-specific markers; launcher tests strip it in four fixture paths. Moving records alone would break these consumers.
- Schema and installer readiness manifests compare exact narrative values; preserve those contracts while making the SQL seed the authoring origin.
- Authored CaseDefinition/CaseStep seed sections currently include historical immutable versions. Remove these from fresh bootstrap source; retain compatibility support outside bootstrap where needed. Existing installations and saved attempts must not be deleted or rewritten by this cleanup.

Affected layers: SQL schema/seed/constraints, installer packaging and readiness, legacy/current test fixtures, authoring and bootstrap documentation. User workflows: fresh classroom installation, supported existing installation, old saved attempts, current Case 001 resolution, Case 004 progression.

Graph regeneration required after implementation because bootstrap organization, fixture boundaries, and authoring documentation change. Include the four tracked artifacts in this package. No graph regeneration during planning.

### Regression Surface

- Related tests:
  - Full real SQL runtime/browser harness and supported launcher SQL/package matrix, with fresh-only release assertions and historical compatibility fixtures loaded separately.

## Files Allowed to Change

- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- database/README.md
- scripts/student-package/build-student-tester-package.ps1
- scripts/student-package/install-student-database.ps1
- scripts/student-package/migrations/**
- scripts/tests/check-current-bootstrap-readiness.mjs
- scripts/tests/check-bootstrap-authoring-baseline.mjs
- scripts/tests/fixtures/bootstrap-current-authoring-baseline.json
- scripts/tests/fixtures/bootstrap-current-baseline.json
- scripts/tests/bootstrap-test-fixtures.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- scripts/tests/test-student-launcher.ps1
- apps/api/src/services/fixtures/case001-legacy-evidence.sql
- scripts/tests/fixtures/**
- scripts/tests/fixtures/database-history.sql
- docs/00-ssot/SSOT-Database-Schema.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md
- docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md
- docs/01-work-packages/WP-311-database-bootstrap-source-of-truth.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json


- docs/00-ssot/END-OF-DAY-HANDOFF.md

## Constraints

END-OF-DAY-HANDOFF.md is closeout-only scope.

Directory allowances contain only the three named installer compatibility SQL files and the three named test fixture/baseline files recorded in this package. Review the exact 27-file implementation manifest, not a blanket directory change.

Preserve the existing SQL Server, PowerShell, TypeScript stack and all unrelated pending edits. No new dependencies, generated SQL framework, separate competing seed source, or new database clones. Do not change application services, evidence wording, identifiers, content/evidence versions, permissions, ownership repair, credentials, current release semantics, or student progress. Removing historical release inserts from fresh bootstrap is explicitly required; preserve existing-installation compatibility separately. No primary database changes or running the destructive bootstrap preamble against an existing installation. Use only the registered reusable test workspace with its exclusive lease, recovery backup, restore, and preview restart. Audit, acceptance, commit, and push require their normal separate lifecycle steps.

## Required Behavior

1. Declare these scripts the canonical authoring origin for schema, current fresh-build data, relationships, SQL permissions/procedures and authored case definitions. The installed database is a deployment of that source; it is not a source to copy back silently.
2. Describe each script's responsibilities and execution order accurately. Flag destructive operations before they occur and distinguish fresh build from supported existing-installation upgrades. Document prerequisites and expected verification.
3. Add a useful section index and consistent readable headings. Keep each table's records together; group case-specific data within the relevant table section. Explain intent, dependencies, identity allocation, report linkage and protected answers where needed. Avoid line-by-line noise, obsolete counts and WP labels as the only explanation.
4. Place current Case 001 interviews in InterviewLog - Murder and its culprit in CaseAnswerKey. Keep the existing report in CrimeSceneReport. Preserve SQL batch boundaries, Unicode literals, exact values, row ordering/identity outcomes and dependency order; determine identity effects explicitly before relocation.
5. Bootstrap scripts contain only the current live version of each case and its authored runtime definitions. Remove historical release inserts, superseded case records, draft/intermediate versions, and legacy upgrade chains from all three scripts. Seed current definitions directly in a valid dependency/publication order. Do not remove historical data from existing installations. If existing migration machinery needs history, keep that responsibility outside fresh bootstrap source.
6. Historical datasets and release definitions needed for tests belong exclusively in separate, clearly labeled test fixture files. Never include, invoke, or append these fixtures in production bootstrap or fresh installation. Replace WP-history-dependent extraction with bounded semantic section markers or straightforward existing fixture mechanisms. Do not duplicate the current evidence into a second maintained seed.
7. Document that changes begin in bootstrap source. Existing-installation migrations must be explicit, separately scoped, preserve work, and converge on the intended current database contract. Validators/constants are consumers and must stay consistent; changing SQL alone does not bypass runtime contracts.
8. Document where a junior developer adds a report, links interviews, defines answers and authored steps, updates dependent contracts, and runs verification. Require future cases to follow the same organization.

## Acceptance Criteria

- All current case records are discoverable in the appropriate table sections; no appended current-story correction block remains.
- Bootstrap scripts contain no historical releases, superseded data, test fixtures, or fixture imports. Fresh installation contains only the current live case definitions and data.
- Script headers/index/comments accurately describe responsibilities, current data and safe execution.
- Fresh-build before/after comparison demonstrates identical current evidence values, IDs, relationships and permissions, with only current live release definitions seeded. Historical release removal is intentional and must be verified explicitly. Explain and resolve any identity ordering change before accepting it.
- Runtime and launcher fixture consumers work without relying on a WP-300 evidence patch block.
- Full real SQL runtime harness passes, including legacy compatibility, current complete Case 001, both Case 004 releases and controlled verification permissions. Supported launcher SQL matrix passes.
- Single test database and recovery backup policy holds; existing preview restored and working, main data unchanged.
- Documentation gives a clear canonical authoring and migration policy and a concise junior-developer walkthrough.
- Graph refresh/readiness and git diff --check pass. Results identify precise scope and any remaining cleanup rather than claiming a broader rewrite.

## Code Prompt

Implement WP-311 only when separately authorized. Review the three scripts and all named consumers first. Establish existing relevant identity/value baselines before moving inserts. Consolidate current records and organize/document existing sections without changing behavior. Adapt fixture consumers in the same change. Validate through the protected single-workspace workflow; never rebuild the main database. Record results and limitations here; leave independent audit and human acceptance pending.

## Audit Prompt

Independently audit WP-311 against the accepted 0e8d244 baseline and exact 27-file implementation scope. Review the complete diff, current SQL, installer/package consumers, historical fixture assembly, fingerprint provenance and recorded SQL/browser results. Falsify the claim that bootstrap contains only current live definitions: require exactly Case 001 v3 and Case 004 v2 with no fixture/history inserts, clones of old releases or replayed data corrections. Check proper table placement, readable headings/comments, exact public/answer IDs and values, all six current authored-table hashes, identity allocation and checked/permission boundaries.

Verify the separated migration files are used only for recognized non-fresh installations, retain guarded backup/transactions/rollback and ship in the package; fresh readiness must not require synthetic history or weaken schema, role and evidence checks. Inspect the generic evidenceMatches/Ready adapter contract and real restricted current-only readiness test. Inspect historical fixture guards, fixed SQL target enforcement, scope-safe loader arguments, exclusive one-workspace lease and restoration. Review documented failed runs, including the installer dot-source variable collision; do not infer a pass from partial logs. Probe relevant negative paths and require FAIL for missing scope, safety, source correspondence or acceptance evidence; use BLOCKED when tooling/context prevents a valid verdict.

This isolated checkout has no SQL workspace registration or credentials. Do not create a database, run SQL integration/fixture entrypoints, set an active-session environment flag, copy .env/settings, or modify either checkout. Read completed primary logs at D:/GitHub-Repos/SequelCityWeb/outputs/wp311-runtime-browser-settled.log, wp311-launcher-sql-final.log, wp311-single-sql.log, wp311-graph-final.log, wp311-graph-readiness-verified.log and wp311-whitespace-verified.log as read-only execution evidence. Non-SQL static/unit checks may run with the existing dependencies. Compare source with the verified local hash manifest when needed; record precisely what you independently inspected or ran. No live database operation or new clone is authorized by the audit. Do not accept work, commit, push or expand scope.

Return a parser-safe Verdict: PASS, FAIL or BLOCKED with concrete file/line findings, acceptance-criteria evidence, execution-safety and negative-path results, scope conformance and limitations. Historical/runtime behavior must remain compatible without historical data in the three bootstrap scripts. Human acceptance remains pending regardless of audit outcome.

## Code Results

Implementation authorized by the human on 2026-10-28, on codex/wp-311-bootstrap-source-of-truth from accepted main 0e8d244. Unrelated WP-284/WP-285 architecture planning and WP-298/WP-299 remain untouched. Independent audit is recorded below; human acceptance and commit/push authorization are recorded in Final Decision below.

### Implemented source and organization

- The three numbered scripts now describe current fresh-build responsibilities, safe run order and useful navigation. Bootstrap source version 2.5 is metadata, not a readiness override. Removed redundant destructive preamble work, chronological WP headings, obsolete diagnostics and the retired Solution tutorial.
- Seed directly defines only Case 001 v3 and Case 004 v2, including exact typed facts, bindings, prerequisites, steps and release publication. Historical releases, the internal draft authoring fixture and clone-from-old-version statements are absent.
- Current steward/suspect rows moved into InterviewLog - Murder; protected culprit moved into CaseAnswerKey. All 6,142 LogIDs are explicit, preserving every existing identity while grouping records. Current rows remain 7141/7142; identity allocation remains 7142.
- Removed the redundant EventSchedule update and directly omitted the 12 registration tuples that the old script inserted then deleted. Final values and identifiers remain identical.
- Current schema declares its final release-entry constraint directly and groups application tables, readiness procedures and immutable-release protection. The generic current evidence manifest delegates to the specific current contract while retaining its required evidenceMatches result name.
- Recognized-installation additive compatibility sections moved to three separate scripts/student-package/migrations files. Fresh installation still consumes only the three database scripts; non-fresh modes use those separate frozen sections. Package builder includes the migration files. Installer readiness accepts the exact current release cohort or supported historical cohort while retaining schema/constraint/role/evidence/backup/rollback checks. No story migration or live setup was run.
- Historical test assembly moved to bootstrap-test-fixtures.ps1 and a guarded authoring fixture. Legacy interview fixture now refuses any target except the registered workspace. No historical fixture is loaded by fresh production bootstrap.
- database/README.md provides source hierarchy, table/case navigation, identity rules, draft publication, migration boundaries and verification commands. Updated database/authoring SSOT and guides; replaced contradictory runbook chronology and obsolete multi-clone commands with the current supported workflow.

### Baseline and verification

Original scripts were preserved locally and verified against accepted commit 0e8d244. A fresh build of those exact scripts in the exclusively leased reusable workspace supplied portable SHA-256 baselines for all 11 public/answer tables and every value in all six current authoring tables. Both fingerprint files record original source commit and normalized source hashes; they are regression expectations, not another authored seed.

The runtime harness now verifies the current-only fresh build first, checks all values/IDs and absence of historical/test case definitions, provisions real bounded accounts and verifies actual API readiness before reconstructing historical scenarios. It then runs the existing compatibility/progression/browser matrix. This prevents historical fixtures from hiding a broken fresh installation.

- PASS: complete final runtime SQL/API/browser matrix against settled sources (outputs/wp311-runtime-browser-settled.log, exit 0; prior successful verification is also in outputs/wp311-runtime-browser-verified.log), including current-only baseline hashes and restricted API readiness, legacy proof, both Case 004 releases, current full Case 001, SQL-authored reuse, 12 legacy browser playthroughs and two current authored-case browser checks. Preview backup restored and preview restarted.
- PASS: launcher/configuration safety fixtures and single-workspace parser/refusal unit checks (outputs/wp311-launcher-unit-verified.log, outputs/wp311-single-unit.log).
- PASS: baseline source provenance and current-authoring fingerprint helper; all 17 local document links checked.
- PASS: complete supported launcher SQL/package matrix (outputs/wp311-launcher-sql-final.log, exit 0), including current-only fresh setup, both restricted accounts, backup refusal, rollback, legacy/foundation/city upgrades, six packaged browser checks, healthy repeat launch, deterministic real ownership repair, retained credentials/workspace and compatible legacy package startup.
- PASS: final graph refresh/readiness and whitespace checks (outputs/wp311-graph-final.log, outputs/wp311-graph-readiness-verified.log, outputs/wp311-whitespace-verified.log). All five unrelated planning files verified byte-for-byte unchanged.
- PASS: real single-workspace SQL lock/refusal/failure-recovery checks (outputs/wp311-single-sql.log, exit 0), with saved preview and classroom markers retained. Final inventory is exactly one test database with one recovery backup. Main and preview web/API endpoints all returned 200. No additional test database was created.

### Corrections found during implementation

Earlier runs are preserved as failed/intermediate evidence, not reported as passes. They exposed missing semantic section bounds/truncated answer extraction, dot-sourced installer parameter scope, a fixture helper script-scope constant, fresh fixture attempts still targeting retired v1, current-only readiness incorrectly requiring historical rows, a generic SQL output alias mismatch and ESM/CommonJS interop in the new test helper. These were corrected without changing case values or application services.

The dot-source target collision selected the installed main connection for a creation attempt; its first existing-table declaration failed before any successful table/data changes. The harness now passes the explicit fixed target while loading installer functions, asserts that target afterward, and refuses SQL execution on any connection outside master/the registered workspace. All destructive fixtures remain protected by the existing exclusive lease and verified restore. No primary story, credentials or saved work were migrated or reset.

## Audit Results

Verdict: PASS (independent AntiGravity audit)

### Independent Audit Report: Work Package WP-311

**Commit Baseline**: `0e8d244`  
**Audit Scope**: Exact 27-file implementation manifest  
**Isolated Checkout Path**: `D:\GitHub-Repos\SequelCityWeb\.git\wp311-audit`  
**Verdict**: **`PASS`**  
**Human Acceptance**: Pending review  

---

### Scope Conformance & Diff Verification

The audit inspected `git status --porcelain -uall` and `git diff --name-status 0e8d244`. Exactly 27 files are changed or added, matching the authorization scope in [WP-311-database-bootstrap-source-of-truth.md](docs/01-work-packages/WP-311-database-bootstrap-source-of-truth.md#L33-L65):

1. [`.understand-anything/fingerprints.json`](.understand-anything/fingerprints.json)
2. [`.understand-anything/intermediate/scan-result.json`](.understand-anything/intermediate/scan-result.json)
3. [`.understand-anything/knowledge-graph.json`](.understand-anything/knowledge-graph.json)
4. [`.understand-anything/meta.json`](.understand-anything/meta.json)
5. [`apps/api/src/services/fixtures/case001-legacy-evidence.sql`](apps/api/src/services/fixtures/case001-legacy-evidence.sql)
6. [`database/01-SequelCityCrimesDB - Create DB.sql`](database/01-SequelCityCrimesDB - Create DB.sql)
7. [`database/02-SequelCityCrimesDB - Insert Data.sql`](database/02-SequelCityCrimesDB - Insert Data.sql)
8. [`database/03-SequelCityCrimesDB - ForeignKeys.sql`](database/03-SequelCityCrimesDB - ForeignKeys.sql)
9. [`database/README.md`](database/README.md)
10. [`docs/00-ssot/SSOT-Case-Authoring.md`](docs/00-ssot/SSOT-Case-Authoring.md)
11. [`docs/00-ssot/SSOT-Database-Schema.md`](docs/00-ssot/SSOT-Database-Schema.md)
12. [`docs/01-work-packages/WP-311-database-bootstrap-source-of-truth.md`](docs/01-work-packages/WP-311-database-bootstrap-source-of-truth.md)
13. [`docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md`](docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md)
14. [`docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md`](docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md)
15. [`scripts/student-package/build-student-tester-package.ps1`](scripts/student-package/build-student-tester-package.ps1)
16. [`scripts/student-package/install-student-database.ps1`](scripts/student-package/install-student-database.ps1)
17. [`scripts/student-package/migrations/01-SequelCityCrimesDB - Create DB.sql`](scripts/student-package/migrations/01-SequelCityCrimesDB - Create DB.sql)
18. [`scripts/student-package/migrations/02-SequelCityCrimesDB - Insert Data.sql`](scripts/student-package/migrations/02-SequelCityCrimesDB - Insert Data.sql)
19. [`scripts/student-package/migrations/03-SequelCityCrimesDB - ForeignKeys.sql`](scripts/student-package/migrations/03-SequelCityCrimesDB - ForeignKeys.sql)
20. [`scripts/tests/bootstrap-test-fixtures.ps1`](scripts/tests/bootstrap-test-fixtures.ps1)
21. [`scripts/tests/check-bootstrap-authoring-baseline.mjs`](scripts/tests/check-bootstrap-authoring-baseline.mjs)
22. [`scripts/tests/check-current-bootstrap-readiness.mjs`](scripts/tests/check-current-bootstrap-readiness.mjs)
23. [`scripts/tests/fixtures/bootstrap-current-authoring-baseline.json`](scripts/tests/fixtures/bootstrap-current-authoring-baseline.json)
24. [`scripts/tests/fixtures/bootstrap-current-baseline.json`](scripts/tests/fixtures/bootstrap-current-baseline.json)
25. [`scripts/tests/fixtures/database-history.sql`](scripts/tests/fixtures/database-history.sql)
26. [`scripts/tests/test-case-runtime-bootstrap.ps1`](scripts/tests/test-case-runtime-bootstrap.ps1)
27. [`scripts/tests/test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1)

`git diff --check` executed cleanly with 0 whitespace warnings or conflict markers. Unrelated planning files (WP-284, WP-285, WP-298, WP-299) were verified byte-for-byte unchanged against `0e8d244`.

---

### Concrete Findings

#### 1. Bootstrap Content & Table Placement
- **Current Live Definitions Only**:
  - [`02-SequelCityCrimesDB - Insert Data.sql`](database/02-SequelCityCrimesDB - Insert Data.sql#L40310-L40851) seeds strictly **Case 001 v3** (`ContentVersion: 3`, `EvidenceVersion: 'case001-complete-v5'`) and **Case 004 v2** (`ContentVersion: 2`, `EvidenceVersion: 'sequel-evidence-v1'`).
  - Total `app.CaseDefinition` rows: exactly **2**.
  - Total `app.CaseStep` rows: exactly **22** (6 for Case 001 at `#L40321-L40426`, 16 for Case 004 at `#L40494-L40748`).
  - No historical case releases (`case-001` v1, `case-001` v2, `case-004` v1), unreleased fixtures (`fixture-foundation`), or intermediate cloned records (`INSERT ... SELECT ... FROM app.CaseDefinition WHERE ContentVersion=1`) exist in any of the three bootstrap scripts.
- **Relocation of Records & Elimination of WP Patch Blocks**:
  - Case 001 report row resides in `CrimeSceneReport` at line 11556 (`ReportDate=20230502`, `ReportCity='Sequel City'`, `CrimeID=1080`).
  - Case 001 interview statements are placed in `InterviewLog - Murder` at [database/02-SequelCityCrimesDB - Insert Data.sql#L38443-L38455](database/02-SequelCityCrimesDB - Insert Data.sql#L38443-L38455) using explicit `LogID` 7141 (steward 62764) and 7142 (suspect 27412).
  - Case 001 culprit resolution record (`PersonID=27412`, `AnswerRole='culprit'`) is placed in `CaseAnswerKey` at [database/02-SequelCityCrimesDB - Insert Data.sql#L40283-L40285](database/02-SequelCityCrimesDB - Insert Data.sql#L40283-L40285).
  - The legacy `WP-300 COMPLETE EVIDENCE` appended patch block present at the end of the `0e8d244` data script has been removed.
  - The redundant `EventSchedule` update and the 12 intermediate `EventRegistration` tuples (which the old script inserted and deleted) were eliminated; `EventSchedule` row 2993 and the 4 retained registration records are seeded directly with correct final values.
- **Identity Allocation**:
  - `SET IDENTITY_INSERT dbo.InterviewLog ON` is applied before LogID 1001 and remains on through LogID 7142 ([database/02-SequelCityCrimesDB - Insert Data.sql#L34004, L40227](database/02-SequelCityCrimesDB - Insert Data.sql#L34004-L40227)).
  - Final table identity allocation evaluates to 7142 (`IDENT_CURRENT('dbo.InterviewLog') = 7142`), verified in [test-case-runtime-bootstrap.ps1#L77](scripts/tests/test-case-runtime-bootstrap.ps1#L77).
- **Checked and Permission Boundaries**:
  - 20 checked application foreign keys (`WITH CHECK`) and triggers protecting released definitions, steps, prerequisites, facts, briefing facts, and bindings are created in [database/01-SequelCityCrimesDB - Create DB.sql#L558-L600](database/01-SequelCityCrimesDB - Create DB.sql#L558-L600) and [database/03-SequelCityCrimesDB - ForeignKeys.sql#L135-L145, L196-L203](database/03-SequelCityCrimesDB - ForeignKeys.sql#L135-L203).
  - Restricted role `sequel_learner` is explicitly denied access to `SCHEMA::app`, `Solution`, `CaseAnswerKey`, and schema introspection (`sys.tables`, `sys.columns`, etc.) at [database/03-SequelCityCrimesDB - ForeignKeys.sql#L157-L168](database/03-SequelCityCrimesDB - ForeignKeys.sql#L157-L168).
  - Bounded role `sequel_repository` receives necessary DML/SELECT permissions on app tables, while `CaseAnswerKey` and `Solution` remain explicitly denied ([database/03-SequelCityCrimesDB - ForeignKeys.sql#L184-L185](database/03-SequelCityCrimesDB - ForeignKeys.sql#L184-L185)).

#### 2. Authoring Baseline & Source Hash Provenance
- LF-normalized SHA-256 hashes for the 3 original baseline scripts from commit `0e8d244` were independently computed:
  - `01-SequelCityCrimesDB - Create DB.sql`: `fc2f41616fca097e8c8143be3add3a8f7d1b09aa784e55b3dcb635b34a663c52`
  - `02-SequelCityCrimesDB - Insert Data.sql`: `9573099f4b510a0ba675bac830fb23fe5f75cb8c306fee619bad9b42a542b23c`
  - `03-SequelCityCrimesDB - ForeignKeys.sql`: `d3bc68c85aef0f4237a5baae79f3cc8f961e2f13f7a39ebd7835a2a1f4731ff4`
  Both [bootstrap-current-authoring-baseline.json](scripts/tests/fixtures/bootstrap-current-authoring-baseline.json#L4-L6) and [bootstrap-current-baseline.json](scripts/tests/fixtures/bootstrap-current-baseline.json#L4-L6) record these exact provenance hashes.
- All six current authoring tables were independently extracted from [`02-SequelCityCrimesDB - Insert Data.sql`](database/02-SequelCityCrimesDB - Insert Data.sql) and validated against [`scripts/tests/check-bootstrap-authoring-baseline.mjs`](scripts/tests/check-bootstrap-authoring-baseline.mjs):
  - `CaseBriefingFact` (count: 4): `8658a0e64b02217620d4cfd06837c4f00df6b96277f63728432a98f79a85c263` - **MATCH**
  - `CaseFactDefinition` (count: 25): `43945430058378618ce837b8133cdc370e39903e58b5cf6ebe99a168928679a5` - **MATCH**
  - `CaseStepPrerequisite` (count: 20): `1b90226ef2843f9548d3566d9a8bf2597d5c3b3da78b014ea7944809d7998150` - **MATCH**
  - `CaseDefinition` (count: 2): `ed03192910d76fae2b0ec3f355d34ceb2234e023be11b969e5bd9013fd6a06b5` - **MATCH**
  - `CaseStep` (count: 22): `1f18f4391bd42b8d6e45b7ef1d019fb04376a108b2992d8fb6101dc447fd7b39` - **MATCH**
  - `CaseStepFactBinding` (count: 50): `688961201365a65b6ad3dbab32b926a0b4598da033b12c3b408a136da9a65391` - **MATCH**

#### 3. Installer, Package Packaging & Separated Migrations
- **Separated Migrations Isolation**:
  - Additive compatibility sections (`RUNTIME`, `CASE EXTENSION`, `CITY NAME`) reside exclusively under [`scripts/student-package/migrations/`](scripts/student-package/migrations/).
  - In [`install-student-database.ps1`](scripts/student-package/install-student-database.ps1#L256-L264,L354-L370), `$fresh` loads only from `database/` via `Get-StudentSqlSection $path FRESH`. `$runtime`, `$extensions`, and `$citySections` load from `scripts/student-package/migrations/`.
  - Fresh installations execute `$fresh` only, completely bypassing `scripts/student-package/migrations/`.
  - Non-fresh upgrade paths (`legacy`, `extension`, `city`) execute inside a transaction (`$transaction = $connection.BeginTransaction()`), preceded by a verified backup ([install-student-database.ps1#L351](scripts/student-package/install-student-database.ps1#L351)), and rollback on failure (`#L376`).
  - Packaged files: [`scripts/student-package/build-student-tester-package.ps1#L107-L110`](scripts/student-package/build-student-tester-package.ps1#L107-L110) bundles the three migration scripts into `$rootFiles` for distribution.
- **Fresh Readiness Contract**:
  - [`Assert-StudentRuntimeShape`](scripts/student-package/install-student-database.ps1#L167-L169,L181-L184) validates that fresh installations pass with either the historical cohort OR the exact current live cohort (`CaseId='case-001' AND ContentVersion=3` and `CaseId='case-004' AND ContentVersion=2`). Synthetic historical rows are not required for readiness.

#### 4. Adapter Contract & Current-Only Readiness Test
- **evidenceMatches/Ready Contract**:
  - [`app.CheckCase001EvidenceManifest`](database/01-SequelCityCrimesDB - Create DB.sql#L536-L554) returns column `Ready bit`.
  - [`app.CheckEvidenceManifest`](database/01-SequelCityCrimesDB - Create DB.sql#L514-L522) provides a generic wrapper executing `app.CheckCase001EvidenceManifest`, storing into `@CurrentEvidence TABLE (Ready bit)`, and returning `SELECT CONVERT(int, Ready) AS evidenceMatches FROM @CurrentEvidence;`.
  - [`validateCaseRuntimeReadiness`](apps/api/src/services/databaseIdentityService.ts#L245-L248) checks `evidence.recordset[0]?.evidenceMatches === 1`.
- **Restricted Current-Only Readiness Test**:
  - [`scripts/tests/check-current-bootstrap-readiness.mjs`](scripts/tests/check-current-bootstrap-readiness.mjs#L1-L22) connects to the database using the restricted repository login (`SC_BOOTSTRAP_REPOSITORY_USER`), verifies `loadReleasedContent('case-001', 3)` and `loadReleasedContent('case-004', 2)`, and confirms `validateCaseRuntimeReadiness(pool).isReady === true` prior to loading any historical fixtures.

#### 5. Fixture Guards, Scope Safety & Single-Workspace Leases
- **Database Workspace Guards**:
  - [`apps/api/src/services/fixtures/case001-legacy-evidence.sql#L2-L3`](apps/api/src/services/fixtures/case001-legacy-evidence.sql#L2-L3) enforces:
    `IF DB_NAME() <> N'SequelCityRuntimeTest_Workspace' THROW 51000,'Legacy evidence fixture requires the registered test workspace.',1;`
  - [`scripts/tests/fixtures/database-history.sql#L2-L3`](scripts/tests/fixtures/database-history.sql#L2-L3) enforces the identical guard.
- **Fixed SQL Target & Dot-Source Variable Collision**:
  - In [test-case-runtime-bootstrap.ps1#L2, L18](scripts/tests/test-case-runtime-bootstrap.ps1#L2-L18), the target database is restricted to `SequelCityRuntimeTest_Workspace`, and SQL execution outside `master` or `SequelCityRuntimeTest_Workspace` throws.
  - Dot-sourcing [`install-student-database.ps1`](scripts/student-package/install-student-database.ps1) previously leaked/collided with `$DatabaseName` in the calling scope. The runner now explicitly passes `-DatabaseName $DatabaseName -ProjectRoot $root -LibraryOnly` and immediately asserts `Assert-True ($DatabaseName -eq 'SequelCityRuntimeTest_Workspace')` at [test-case-runtime-bootstrap.ps1#L46-L47](scripts/tests/test-case-runtime-bootstrap.ps1#L46-L47).
  - Failed run `outputs/wp311-runtime-browser-final.log#L7-L16` documented an ESM/CommonJS named import failure on `CaseRuntimeRepository` in `check-current-bootstrap-readiness.mjs`, corrected by destructuring import from `repositoryModule`.
- **Single-Workspace Leases & Restoration**:
  - [`single-test-database.ps1`](scripts/tests/single-test-database.ps1#L38-L41) locks `SequelCityWeb:SingleTestWorkspace` via `sp_getapplock`.
  - `Assert-SingleTestInventory` (#L22-L25) rejects any extra test databases matching `SequelCityRuntimeTest_%`.
  - Verified backup taken before runs (`BACKUP DATABASE ... WITH COPY_ONLY,INIT,CHECKSUM; RESTORE VERIFYONLY ...`) is restored in `Close-SingleTestSession` with `REPLACE,CHECKSUM` (#L92).

---

### Execution Evidence & Primary Log Review

All primary logs generated on 2026-10-28 were audited:

1. `wp311-runtime-browser-settled.log` (809 lines):
   - Exit 0. Verified fresh build of 01, 02, and 03.
   - All 6 authoring tables match baseline hashes. Bounded repository API readiness passed.
   - Pre-cleanup hashes for all 11 evidence/answer tables passed.
   - Subsequent historical assembly, 12 browser playthroughs, and 2 current authored-case browser checks passed. Preview database restored and restarted.
2. `wp311-launcher-sql-final.log` (65 lines):
   - Exit 0. Verified one-invocation new-login readiness, permission denial, account-neutral owner repair, backup refusal, transactional rollback, v1 additive upgrade, report signatures, and 6 packaged browser checks (`case-001-full-resolution.spec.ts` and `student-mode.spec.ts`).
3. `wp311-single-sql.log` (11 lines):
   - Exit 0. Verified single test workspace lock contention, owner ID mismatch, clone refusal, and failure recovery. Retained single recovery backup.
4. `wp311-graph-final.log` (29 lines):
   - Scanned 754 files, assembled 1,235 nodes, 481 edges, and generated 754 baseline fingerprints.
5. `wp311-graph-readiness-verified.log` (8 lines):
   - Dry run succeeded; 0 tracked artifacts unexpectedly changed; 0 temporary/trash directories.
6. `wp311-whitespace-verified.log` (3 lines):
   - Clean diff check.

---

### Negative Paths Independently Probed

The audit independently executed the unit test suites without SQL Server integration:
1. `pwsh -File scripts/tests/test-student-launcher.ps1`:
   - Passed all launcher safety checks: duplicate environment entries, system database targets (`master`, `msdb`, `bad-name`), remote hosts, forbidden DDL/DML in additive sections, occupied ports, concurrent lock collisions, retired flags, and dependency/health probe failures.
2. `pwsh -File scripts/tests/test-single-test-database.ps1`:
   - Passed PowerShell parsing across all test scripts, classroom target refusal (`SequelCityCrimesDB`), and un-leased fixture reset refusal.
3. Node authoring baseline verification:
   - Parsed all 6 authoring tables from current SQL seed; executed `check-bootstrap-authoring-baseline.mjs` against them. All rows and SHA-256 hashes matched the pre-cleanup expectations.

---

### Limitations & Final Disposition

- Audit was executed in read-only mode in an isolated checkout without local SQL Server credentials or live workspace registration.
- No database integration entrypoints, live migrations, or active-session flags were run.
- Primary execution evidence was established through end-to-end logs and static/unit verification of the exact 27 files.
- Human acceptance remains pending review.

**Verdict: PASS**


### Audit execution and code-agent review

Independent AntiGravity verdict: PASS, with no blocking findings or required implementation changes. External sharing was explicitly authorized by the human for WP-311 on 2026-10-28. The supported audit wrapper actually ran against D:/GitHub-Repos/SequelCityWeb/.git/wp311-audit at baseline 0e8d244, with exactly 27 scoped files and no unrelated source/settings. No mixed-worktree override was used.

The auditor independently checked original script hash provenance, extracted and hashed current authored records, ran non-SQL launcher/workspace safety tests, and reviewed the recorded real SQL/package/browser execution evidence. It did not independently rerun SQL integration, create a database or apply a migration. Those limits are retained in the report. Primary and isolated snapshot hashes were rechecked after completion: executable and supporting source remain unchanged. No further test rerun is needed for audit-record-only updates.

Code-agent review confirmed that all six packaged browser checks include case-001-full-resolution.spec.ts together with student-mode.spec.ts; the auditor's attribution is correct, and the completed log explicitly shows the full Case 001 test passing. Unrelated planning files are excluded from the audit checkout; primary byte preservation was checked against the retained local hashes during implementation, not against Git versions for untracked planning files. The latter is an accounting clarification, not a code defect.

Human acceptance was subsequently granted explicitly; see Final Decision. The audit did not itself grant acceptance.

## Final Decision

Accepted. On 2026-10-28 the human explicitly accepted WP-311 and requested "commit and push" after the independent AntiGravity PASS and completed validation. Finalization is authorized for this scoped package, including the closeout-only handoff refresh. Unrelated planning remains excluded.
