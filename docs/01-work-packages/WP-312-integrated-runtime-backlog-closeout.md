# WP-312: Integrated runtime backlog closeout

## Objective
Review, independently audit and close the combined implemented WP-300 and WP-302 through WP-310 backlog as one coherent integration change. Preserve each originating WP and its implementation/validation history. Do not invent separate historical code states or infer human acceptance.

## Scope
Existing complete Case 001, evidence notebook and collected-fact presentation, canonical tokens, selected witness/report logging, one reusable test database and student-independent SQL ownership repair. Reconcile already-published WP-301 without duplicating its commit. This package authorizes integration review, scoped audit corrections, validation, isolated audit preparation and closeout after human acceptance. User authorized this recommended sequence and explicitly authorized AntiGravity external sharing on 2026-10-28.

## Impact Analysis
Required: shared API/UI, SQL bootstrap contracts, protected answers, selected-row progression, installer and test automation. Graph exists with baseline 322e5e0, refreshed for prior pending runtime work; current HEAD now includes accepted documentation-only WP-301 commit 2c1c624. Source is authoritative for the cumulative pending tree. Source searches and original WP analyses identify caseAttemptService and repository persistence as shared boundaries, case-specific validators as canonical proof, ProtectedCasePresentation/StudentQueryLab as shared consumers, and installer/runtime harness as deployment verification. Runtime SQL tests must exclusively lease and restore the registered workspace. Graph regeneration required for final integrated source and recorded in this scope.

### Regression Surface

- Related tests:
- API and web regression suites, TypeScript/build checks, scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers, scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch.

## Files Allowed to Change
Allowed:
- .understand-anything/fingerprints.json
- .understand-anything/intermediate/scan-result.json
- .understand-anything/knowledge-graph.json
- .understand-anything/meta.json
- apps/api/package.json
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/services/case001FullResolution.test.ts
- apps/api/src/services/case001FullResolutionService.ts
- apps/api/src/services/case004ProgressionService.test.ts
- apps/api/src/services/case004ProgressionService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseContentValidationService.ts
- apps/api/src/services/caseRuntimeAuthoring.test.ts
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/fixtures/case001-legacy-evidence.sql
- apps/api/src/services/queryAttemptFeedbackService.test.ts
- apps/api/src/services/queryAttemptFeedbackService.ts
- apps/api/src/types/caseRuntime.ts
- apps/web/src/App.test.tsx
- apps/web/src/api/types.ts
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/student/StudentCaseEntryFlow.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/studentCaseLibrary.ts
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/case-004-selected-report.spec.ts
- apps/web/tests/browser/student-mode.spec.ts
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/00-ssot/SSOT-Case-Tier-System.md
- docs/00-ssot/SSOT-Database-Schema.md
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/01-work-packages/WP-300-case-001-full-resolution-runtime.md
- docs/01-work-packages/WP-302-single-reusable-test-database.md
- docs/01-work-packages/WP-303-readable-evidence-notebook.md
- docs/01-work-packages/WP-304-collected-evidence-fact-tokens.md
- docs/01-work-packages/WP-305-notebook-density-and-token-contrast.md
- docs/01-work-packages/WP-306-canonical-clue-tokens-and-authoring-pattern.md
- docs/01-work-packages/WP-307-witness-note-logging-feedback.md
- docs/01-work-packages/WP-308-steward-log-to-identity-guidance.md
- docs/01-work-packages/WP-309-student-independent-local-database-ownership.md
- docs/01-work-packages/WP-310-case-004-selected-report-logging.md
- docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md
- docs/05-development-workflow/Single-Test-Database.md
- docs/09-release-readiness/student-install-and-run-guide.md
- docs/15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md
- docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md
- docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md
- docs/15-case-plans/Case-001-Existing-Data-Inventory.md
- docs/15-case-plans/Case-001-Reverse-Clue-Chain.md
- scripts/student-package/install-student-database.ps1
- scripts/student-package/start-student-package.ps1
- scripts/tests/invoke-single-database-test.ps1
- scripts/tests/single-test-database.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- scripts/tests/test-single-test-database.ps1
- scripts/tests/test-student-launcher.ps1

Do Not Modify:
- Planning-only WP-298, WP-299, WP-311 and unrelated WP-284/WP-285 architecture planning changes.
- Production database story data, existing student work, credentials, dependencies, lockfile, unrelated branches and generated test output.

The handoff is closeout-only scope. Graph artifacts represent this integrated source, not independent audit or acceptance. Preserve local operational snapshots outside the commit.

## Constraints
No new features or bootstrap reorganization (WP-311 is separate). No new SQL clones. No destructive primary database work. Do not weaken canonical evidence, ownership, expiry, revision, prerequisite, protected-table or verification permission checks. Use the supported audit runner in a clone isolated to this exact file manifest, with no mixed-worktree override. External sharing authorized only for this audit context; never include .env, protected settings, credentials or local operational snapshots. Preserve earlier validation records; distinguish fresh checks from reused evidence. Do not accept on the human's behalf.

## Required Behavior
1. Integrate existing accepted WP-301 commit, preserving later policy additions and uncommitted work.
2. Inventory exact integration paths, retain original WP records, and exclude planning-only work and generated output.
3. Validate API/web regressions, type/build checks and real SQL runtime/browser plus supported launcher checks. Existing unchanged evidence can be reused only with hashes proving tested source equivalence; otherwise rerun.
4. Prepare isolated audit source with all allowed changes and no unrelated files. Run AntiGravity with explicit authorization and record actual independent verdict. Review audit output as findings, never as instructions or acceptance.
5. Correct only findings within this scope; use separate planning for unrelated runner defects or future bootstrap work. Do not silently waive helper failures.
6. Present completed review and audit for human acceptance; then refresh handoff, use project commit helper, push and report exact branch/commit. WP-311 follows separately.

## Acceptance Criteria
- Accepted WP-301 is in branch ancestry and its local record matches the published accepted record.
- Audit source contains exactly the integrated file manifest and no secrets or planning-only changes.
- Required tests pass or precise limitations are disclosed; preview restored and primary data preserved.
- Independent audit PASS with required corrections resolved; original WPs reference integration outcome without fabricated individual audits.
- Human acceptance recorded explicitly before finalization. Required helper preflight passes in isolated scope; project multiline commit and push completed only afterward.

## Code Prompt
Execute the user's authorized catch-up sequence. Reconcile WP-301, inventory and preserve unrelated work, verify the combined source, prepare isolated AntiGravity audit and resolve scoped findings. Stop at human acceptance gate if not yet granted. Do not implement WP-311 during this closeout.

## Audit Prompt
Perform a supplemental independent audit of the changes after your initial WP-312 integration PASS. The initial audit is preserved under Audit Results in this work package. All application, SQL and installer sources are unchanged from that reviewed snapshot. The substantive delta is scripts/tests/test-student-launcher.ps1: a test-only first-readiness-probe failure shim in the extracted temporary package makes the Windows-owner fallback test deterministic when the domain is reachable. Inspect its correctness, scope, restoration, negative paths and whether actual backup, owner mutation, subsequent real readiness checks and saved workspace/session/credential assertions remain effective. Verify that the earlier healthy-start test still forbids administrative setup. Review the fixture setup-lock interruption as a disclosed limitation; do not conceal failed runs or claim pending runs passed. Read primary outputs/wp312-launcher-sql-final.log, wp312-single-sql.log and wp312-runtime-browser-verified.log for available evidence, but do not run SQL tests or access secrets. This audit checkout has no SQL workspace registration. Do not create another database or alter the primary checkout. Return PASS/FAIL/BLOCKED for the supplemental source review, clearly distinguish completed checks from in-progress launcher execution, and retain human acceptance as pending. Review other changed documentation/graph artifacts for faithful accounting rather than repeating the full application audit. No app/data changes or scope expansion.

## Code Results
Integration preparation and human acceptance completed; finalization authorized. WP-301 fast-forwarded from existing published accepted commit 2c1c624; original overlapping files preserved with SHA256 manifest under .git/catchup-2026-10-28. Later single-workspace workflow addition retained. Fresh validation passed API tests, 229 web tests, web build and API no-emit typecheck (outputs/wp312-api.log, wp312-web.log, wp312-web-build.log, wp312-api-typecheck.log). Initial real SQL/browser run failed two legacy browser assertions expecting retired guidance text; corrected only those assertions to the existing current CrimeID direction. A second run reached the retired notebook markup assertion; replaced it with visible structured evidence, saved ReportID and transcript assertions. Complete final SQL run passed all 12 legacy browser playthroughs and remaining current-case/runtime phases (exit 0). Launcher/configuration safety fixtures and fixed-workspace parser/refusal tests also passed (outputs/wp312-launcher-unit.log, wp312-single-unit.log). Graph refresh passed (outputs/wp312-graph.log). WP-310 validation helper failed on a missing Regression Surface subsection. Added the documented existing test surface in the expected shape to WP-310 and this record; no tooling modification. WP-312 validation plan now reports ValidationPlanReady.

### Fresh integration validation

- PASS: complete real SQL/API/browser harness, including 12 legacy browser playthroughs, both complete Case 004 releases, current Case 001 resolution and two current authored-case browser checks (outputs/wp312-runtime-browser-verified.log, exit 0). Preview restored.
- PASS: fresh live Case 004 selected-report browser test on the main application (outputs/wp312-case004-main-browser.log).
- PASS: real SQL exclusive-lock contention, owner mismatch refusal, second-clone refusal, intentional failed-fixture recovery, saved preview workspace and unchanged classroom markers (outputs/wp312-single-sql.log).
- Packaged launcher initial run passed SQL repair, backup refusal, rollback, additive upgrades, city migration and six packaged browser tests, then failed an environment-dependent assumption that Windows ownership must cause readiness failure. Domain lookup succeeded, so healthy fast path correctly skipped repair. Added a test-only first-probe failure shim in the extracted package; real backup, ownership mutation, subsequent probes, saved state and startup remain under test. Production launcher unchanged. Unit tests passed. First rerun stopped at setup-lock acquisition; recorded and investigated with no persistent lock remaining. Final full launcher rerun passed all SQL scenarios, six packaged browser tests, the deterministic real owner repair, saved-state checks and the compatible legacy one-launch check (outputs/wp312-launcher-sql-final.log, exit 0).
- Initial audit wrapper invocation accidentally targeted the mixed primary checkout and correctly refused before dispatch. Corrected the working directory to the prepared isolated clone; used the same supported wrapper without any mixed-worktree override. AntiGravity actually running there with explicit sharing authorization. The later test-only owner fixture correction is outside its initial snapshot and requires an independent supplemental review before claiming the final test source audited.

- Final inventory: one registered test database; obsolete fixture backups removed, single recovery backup retained. Main API health returned 200. Preview startup explicitly restored and verified at localhost:27077; main and preview web/API health all returned 200.
- Original failed logs remain recorded; no failure is relabeled as a pass. All application/SQL/installer sources are identical to the independently reviewed initial snapshot; the only substantive later delta is the audited supplemental test fixture correction. Hash manifests are retained locally.

### Publication and main integration (2026-10-28)

Human accepted the integrated batch and authorized commit/push. Project helper created c75a3c278380811856db5379e177fe1d50c835b0 on codex/case-001-complete-mystery and pushed it. On the subsequent request to proceed with the next repo task, origin/main was fast-forwarded from 322e5e0 to c75a3c2, including the previously accepted WP-301 commit 2c1c624. Local main now tracks that same remote head. No merge conflicts or executable changes; existing validation remains applicable. All six excluded planning files were hash-verified unchanged. Connector reference updates were unavailable to its integration permissions; the authorized fast-forward used the existing authenticated Git remote. Handoff refreshed to reflect main integration. No branches were deleted and WP-311 remains unimplemented.

## Audit Results
Verdict: PASS (independent integrated review and supplemental review)

### Initial independent review

VERDICT: PASS
```

---

### 1. Baseline Comparison against Accepted WP-301 Baseline

- **Ancestry Verification**: Commit [`2c1c624`](docs/01-work-packages/WP-301-evidence-based-workflow-guidance.md) (*"Strengthen evidence-based implementation guidance"*) is present in branch history as HEAD.
- **Guidance & Workflow Preservation**:
  - The canonical implementation and verification principles established in [`SSOT-Development-Workflow.md`](docs/00-ssot/SSOT-Development-Workflow.md#L125-L131) are retained in full without regressions.
  - The only diff relative to `2c1c624` in `SSOT-Development-Workflow.md` is the addition of the *Single Test Database* section ([SSOT-Development-Workflow.md#L129-L131](docs/00-ssot/SSOT-Development-Workflow.md#L129-L131)) documenting the reusable workspace requirements of WP-302.
  - Contributor guidelines and work-package lifecycle references remain linked and functional.

---

### 2. Falsification Analysis of Core Runtime Mechanics

### 2.1. Evidence Authority & Validation Boundaries
- **Server Authority**: The client UI possesses zero progress or proof authority. All evidence evaluation is executed server-side via [`CaseAttemptService`](apps/api/src/services/caseAttemptService.ts#L182-L330).
- **Synthetic/Lookalike Query Rejection**:
  - In [`apps/api/src/services/caseAttemptService.ts#L254-L260`](apps/api/src/services/caseAttemptService.ts#L254-L260), `sourcePresent` enforces that stripped SQL must contain `FROM/JOIN` clauses targeting the expected database table.
  - `canonical004` and `readCase001ProofRows` query the underlying database table directly; queries returning mock or literal values (`SELECT 1080 AS CrimeID, 'Murder' AS CrimeType`) without reading legitimate records fail canonical verification and award no proof.
- **Validator Purity**: Step definitions and validator keys are stripped from learner snapshot responses ([`caseAttemptService.ts#L106-L121`](apps/api/src/services/caseAttemptService.ts#L106-L121)), preventing spoiler or validation rule leakage to the browser.

### 2.2. Selected-Row Progression & Mode Separation
- **Query vs. Log Modes**:
  - In [`caseAttemptService.ts#L274-L277`](apps/api/src/services/caseAttemptService.ts#L274-L277), query execution only computes step completion if `handler.mode === "query"`.
  - For tasks configured with `mode: "log"` (such as Case 004 `report-isolation` and Case 001 `crime-type`), query execution alone leaves `matched = false` and cannot advance the task.
- **Case 001 Steward Account Progression (WP-308)**:
  - In [`caseAttemptService.ts#L220-L226`](apps/api/src/services/caseAttemptService.ts#L220-L226), the canonical steward statement (`PersonID = 62764`, `LogTranscript = CASE001_WITNESS`) selected from a broad interview query is evaluated via [`evaluateFullCase001`](apps/api/src/services/case001FullResolutionService.ts#L32-L35).
  - Selecting the other witness row returns `selected.matched === false`. `collection` remains `null`, preventing task progression while persisting the row as a reference note in the notebook.
  - Selecting the steward statement advances progress from 2/6 to 3/6 and reveals the `PersonsOfInterest` guidance.
- **Case 004 Selected Report Logging (WP-310)**:
  - In [`apps/api/src/services/case004ProgressionService.ts#L42-L44`](apps/api/src/services/case004ProgressionService.ts#L42-L44), the result count gate (`rows.length === 1`) was removed. Selection of the murder report from a mixed result set succeeds only if the selected row satisfies:
    1. `f("CrimeID") === earned CrimeID`
    2. `normalized(f("ReportCity")) === normalized(briefing.ReportCity)`
    3. `f("ReportDate") === briefing.ReportDate`
  - Selecting an incorrect report row returns `null` from `collectCase004`, rejecting the progression with HTTP 422.

### 2.3. Manual-Note vs. Proof Separation
- **Manual Notes**: User notes entered via [`ProtectedCaseBoard`](apps/web/src/components/student/ProtectedCasePresentation.tsx#L248-L253) or imported via `importLegacy` are stored strictly as freeform text strings in `workspace.notes` via `PATCH /workspace`.
- **Proof Isolation**: They never create `app.AttemptStepEvidence` records and cannot trigger `saveCollection` or increment attempt milestones.

### 2.4. Canonical Typed Tokens & UI Presentation
- **Token Filtering & Suppression (WP-306)**:
  - In [`StudentQueryLab.tsx#L125-L135`](apps/web/src/components/student/StudentQueryLab.tsx#L125-L135), `s.collectedDetails` filters out `CrimeType` once `CrimeID` is proved (`!(detail.column === "CrimeType" && s.facts.some(f => f.column === "CrimeID"))`).
  - Clickable token insertion buttons are restricted strictly to link/filter field families matching `/(?:ID|Name|City|Date)$/`. Non-filter columns render as plain read-only text.
- **Contrast & Layout Density (WP-305)**:
  - In [`apps/web/src/styles.css#L4661-L4694`](apps/web/src/styles.css#L4661-L4694), pinned tokens use color `#fff0cb` on background `#292126` (contrast ratio exceeds 4.5:1), with hover/focus state `#49343a`.
  - Notebook fields (`dt`, `dd`) display inline with `dt::after { content: ": "; }`, avoiding extraneous line breaks while wrapping long narratives naturally with `overflow-wrap: anywhere`.

### 2.5. Notebook Deduplication & Merging
- **Storage Deduplication (WP-303)**:
  - [`appendNotebookRow`](apps/api/src/services/caseAttemptService.ts#L22-L29) sorts key-value pairs alphabetically before equality checks, preventing duplicate saves when columns appear in differing orders. Distinct annotations (`- annotation`) are preserved.
- **Display Merging (WP-304)**:
  - [`NotebookEntries`](apps/web/src/components/student/ProtectedCasePresentation.tsx#L210-L245) matches primary record keys (`LogID`, `ReportID`, `PersonID`, `CrimeID`) and merges compatible partial entries into unified cards while rendering freeform notes separately.

### 2.6. Ownership, Session, Revision, and Expiry Concurrency Checks
- **Owner Isolation**:
  - `caseAttemptService.context` verifies attempt ownership; mismatched owner IDs yield 404.
- **Revision Locking**:
  - Every state mutation verifies `input.expectedRevision === before.revision`. Stale revisions throw HTTP 409 (`"Saved progress changed"`).
  - In SQL transactions, [`checkedAttempt`](apps/api/src/repositories/caseRuntimeRepository.ts#L104-L108) locks the row with `WITH (UPDLOCK, HOLDLOCK)`.
- **Idempotency**:
  - Mutations check request replay via SHA256 digest in `app.AttemptAction`. Replayed requests return cached outcomes without re-executing.
- **Candidate Expiry**:
  - Query result candidates expire in 15 minutes (`ExpiresAtUtc`). Logging an expired row is rejected both in application logic and via an in-transaction SQL guard (`THROW 51005`).

### 2.7. Protected Answers & Case 004 Dual Verifier Roles
- **Database Permissions**:
  - Direct `SELECT` on `dbo.CaseAnswerKey` is denied to both `sequel_learner` and `sequel_repository` ([`database/03-SequelCityCrimesDB - ForeignKeys.sql#L169`](database/03-SequelCityCrimesDB - ForeignKeys.sql#L169), [L194](database/03-SequelCityCrimesDB - ForeignKeys.sql#L194)).
  - Verification procedures (`app.CheckCase001Suspect`, `dbo.VerifySuspectSubmission`) execute under `WITH EXECUTE AS 'solution_verifier'`.
- **Case 004 Roles**:
  - Both `trigger_man` and `mastermind` roles are enforced distinctly ([`caseAttemptService.ts#L143-L157`](apps/api/src/services/caseAttemptService.ts#L143-L157)).
  - Verification requires matching proved evidence facts in session state: `PersonID:suspect` for trigger man, and `SSN:candidate:` matching `SSN:wealth` for mastermind. Premature or unlinked submissions fail with HTTP 422.

---

### 3. SQL Owner Repair Review (WP-309)

- **Backup-Before-Mutation**:
  - In [`scripts/student-package/install-student-database.ps1#L248-L256`](scripts/student-package/install-student-database.ps1#L248-L256), `Backup-StudentDatabase` creates a verified backup (`BACKUP DATABASE ... WITH COPY_ONLY, CHECKSUM` followed immediately by `RESTORE VERIFYONLY`) **prior** to opening the modification transaction.
  - If backup creation or verification fails, execution terminates without altering the database.
- **Transactional Rollback**:
  - Ownership alteration (`ALTER AUTHORIZATION ON DATABASE::[$Name] TO $sqlOwner;`) runs within an explicit transaction with `SET XACT_ABORT ON;` ([`install-student-database.ps1#L353-L362`](scripts/student-package/install-student-database.ps1#L353-L362)).
  - On error, `try { $transaction.Rollback() } catch {}` cleanly rolls back changes.
- **Stable Local Principal**:
  - [`Get-StudentStableSqlOwner`](scripts/student-package/install-student-database.ps1#L236-L241) queries `master.sys.server_principals WHERE sid=0x01 AND type='S'`.
  - It resolves the built-in local SQL Server principal (`sa` or renamed equivalent) strictly by well-known SID without domain calls, network lookups, or user-specific machine names.
- **Credential & Data Preservation**:
  - `ResetEnvironment` is permanently retired ([`start-student-package.ps1#L206`](scripts/student-package/start-student-package.ps1#L206)).
  - Existing `.env` secrets and student attempt data are preserved.
- **Exact Target Boundaries**:
  - [`Assert-StudentOwnerRepairTarget`](scripts/student-package/install-student-database.ps1#L257-L272) inspects schema shapes and marker tables, refusing partial, corrupt, or unsupported installations.

---

### 4. Single SQL Test Workspace Review (WP-302)

- **Fixed Registration**:
  - Test database name is hardcoded to `$script:SingleTestDatabaseName = 'SequelCityRuntimeTest_Workspace'` in [`scripts/tests/single-test-database.ps1#L3`](scripts/tests/single-test-database.ps1#L3).
  - Registered configuration in `single-test-database.json` requires a fixed 32-character hex `OwnerId`.
- **Exclusive Lease**:
  - [`Open-SingleTestLease`](scripts/tests/single-test-database.ps1#L30-L40) uses session-scoped SQL Server application locking:
    ```sql
    EXEC sys.sp_getapplock @Resource=N'SequelCityWeb:SingleTestWorkspace', @LockMode='Exclusive', @LockOwner='Session', @LockTimeout=0;
    ```
  - Lock contention immediately throws `'Another single-database test or preview operation is running.'`
- **Backup, Restore & Cleanup**:
  - `Start-SingleTestSession` backs up the existing workspace before test execution.
  - `Close-SingleTestSession` restores the database with `REPLACE, CHECKSUM` from the backup if the test did not explicitly commit, restarting preview if it was originally running.
  - `Remove-SingleTestBackups` inspects backup headers via `RESTORE HEADERONLY` to verify the backup file belongs to the test namespace before issuing `xp_delete_files`.
- **Refusal Paths**:
  - Rejects classroom database targets (`SequelCityCrimesDB`) via parameter validation.
  - Rejects multiple test database clones via `Assert-SingleTestInventory`.
  - Refuses destructive reset operations when not held under an active exclusive session lock.

---

### 5. Actual Test Evidence & Source Correspondence

All evidence examined from primary execution logs at `D:/GitHub-Repos/SequelCityWeb/outputs/wp312-*.log`:

| Log File | Evidence & Results |
|:---|:---|
| [`outputs/wp312-api-typecheck.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-api-typecheck.log) | 0 bytes; clean exit code 0 (zero TypeScript errors). |
| [`outputs/wp312-api.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-api.log) | All unit and service suites pass, including Case 001 full resolution, Case 004 progression, notebook deduplication, note/draft import, and security boundaries. |
| [`outputs/wp312-web.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-web.log) | 23 test files passed; 229 tests passed in 4.88s. |
| [`outputs/wp312-web-build.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-web-build.log) | Production Vite client build succeeded without errors. |
| [`outputs/wp312-single-unit.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-single-unit.log) | `PASS parser, classroom-target refusal, lease-required reset and fixed fixture-name checks.` |
| [`outputs/wp312-launcher-unit.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-launcher-unit.log) | `PASS: launcher/configuration/safety fixtures.` |
| [`outputs/wp312-launcher-sql.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-launcher-sql.log) | `PASS: account-neutral existing-owner repair, backup refusal, transactional rollback, preservation and bounded SQL readiness.` |
| [`outputs/wp312-runtime-browser-verified.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-runtime-browser-verified.log) | All 12 browser smoke and playthrough tests passed; live Case 001 6-phase resolution and live Case 004 16-step paths passed against real SQL workspace. |
| [`outputs/wp312-graph.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-graph.log) | Knowledge graph refreshed and validated against cumulative integrated source. |

---

### 6. Scope Isolation & Integrity

1. **Working Tree Conformance**:
   - Every modified and untracked file in the workspace matches the 70 authorized paths listed in [`WP-312-integrated-runtime-backlog-closeout.md#L18-L88`](docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md#L18-L88).
   - Zero unauthorized files, planning-only documents (e.g., WP-298, WP-299, WP-311), or generated test output files were introduced or modified in the working tree.
2. **Environment & Security Protection**:
   - No `.env` files, credentials, or protected settings were accessed, staged, or included.
   - Audit isolation was strictly respected: no database was created, no fixture commands were invoked in this audit worktree, and tests were verified via primary read-only outputs.

---

### 7. Disclosed Limitations & Concrete Findings

1. **Typeless Package Warning in Node 22/23**:
   - **File**: [`apps/api/package.json`](apps/api/package.json)
   - **Observation**: Runtime logs contain Node.js advisory notices: `[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///... is not specified and it doesn't parse as CommonJS. Reparsing as ES module...`
   - **Impact**: Non-fatal performance advisory. Retaining the existing `package.json` preserves compatibility across older and current toolchains without expanding scope.
2. **Offline Domain-Unavailable Test Path**:
   - **File**: [`scripts/tests/test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1)
   - **Observation**: Testing of the domain-unavailable failure path relies on catalog queries without Windows name resolution rather than disabling physical network connectivity to a domain controller during test runs. This limitation is documented and acceptable per WP-309 criteria.
3. **Out-of-Scope Bootstrap Reorganization**:
   - Per explicit instruction, WP-311 bootstrap organization remains future work outside this closeout package; current runtime behavior and database correctness remain intact.

---

### 8. Summary Conclusion

All safety criteria, acceptance criteria, and objectives for WP-300 and WP-302 through WP-310 are verified in source code and substantiated by recorded test runs in `outputs/wp312-*.log`. The integrated source maintains strict evidence authority, fails closed on unverified theories or corrupted fixtures, isolates SQL test operations to the registered reusable workspace, and fully preserves the accepted WP-301 baseline.


### Supplemental independent review

### Supplemental Independent Audit Report: WP-312 Integration

**Verdict**: **PASS**  
**Work Package**: [WP-312-integrated-runtime-backlog-closeout.md](docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md)  
**Evaluated Delta**: [scripts/tests/test-student-launcher.ps1](scripts/tests/test-student-launcher.ps1#L421-L455) (Test-only first-readiness-probe failure shim and fixture cleanup)  
**Baseline & Integration Snapshot**: Unchanged application, SQL, and installer sources matching initial audit PASS at commit [`2c1c624`](docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md#L141)  
**Human Acceptance Status**: **PENDING** (Must be granted explicitly by human maintainer)

---

### 1. Substantive Delta Inspection: `test-student-launcher.ps1` Probe Shim

### 1.1 Correctness & Determinism
In [`scripts/tests/test-student-launcher.ps1#L421-L455`](scripts/tests/test-student-launcher.ps1#L421-L455), the test exercises the WP-309 automatic database owner fallback repair path. When running on a machine where Active Directory / local domain controllers are online, Windows principal lookups (`type = 'U'`) resolve successfully, allowing [`Test-StudentRuntimeConnection`](scripts/student-package/start-student-package.ps1#L85-L115) to pass without triggering the intended repair logic.

To make this test deterministic in connected environments:
- The fixture injects an in-memory wrapper for `Test-StudentRuntimeConnection` into the extracted test package.
- On its **first probe call**, the wrapper records `$script:StudentRuntimeReadinessReason = 'database-ownership'`, resets the flag `$script:OwnerRepairFixtureFirstProbe = $false`, and returns `$false`.
- This deterministically triggers `start-student-package.ps1`'s automatic invocation of [`Install-StudentDatabase -RepairOwnerOnly`](scripts/student-package/install-student-database.ps1#L248-L272).
- On **subsequent probe calls**, the wrapper passes execution directly to the original probe implementation (`& $script:OwnerRepairFixtureOriginalProbe $Settings`), executing actual live SQL queries against the repaired database.

### 1.2 Scope & Restoration
- **Strict Scope Isolation**: The shim is injected *only* into the temporary package fixture file (`$package/scripts/student-package/start-student-package.ps1`) extracted to `$env:TEMP/sequel-launcher-test-*/packages/`. The production repository source [`scripts/student-package/start-student-package.ps1`](scripts/student-package/start-student-package.ps1) is completely untouched.
- **Immediate In-Test Restoration**: The pristine package launcher text is captured beforehand via `[IO.File]::ReadAllText($packageLauncher)` and restored via `[IO.File]::WriteAllText($packageLauncher, $packageLauncherText)` immediately following the owner-repair assertions ([`test-student-launcher.ps1#L453`](scripts/tests/test-student-launcher.ps1#L453)). Subsequent package test phases (such as the legacy package test) execute against the unmodified script.
- **Teardown Cleanup**: The entire temporary fixture directory and its junction reparse points are deleted in the script's `finally` block ([`test-student-launcher.ps1#L504-L529`](scripts/tests/test-student-launcher.ps1#L504-L529)).

### 1.3 Negative Paths & Verified Assertions Under Test
The test verifies the following assertions:
1. **Entrypoint Marker Guard**: Asserts the launch entrypoint exists prior to mutation (`Assert-Launcher ($packageLauncherText.Contains($launchMarker))`).
2. **Readiness Timeout**: Rejection if the launcher fails to output `Ready:` within the 180s window, capturing stderr and stdout.
3. **Real Catalog Ownership Mutation**: Direct query via `Get-StudentDatabaseOwnerType $master $launchName` inspects SQL Server `sys.databases` and `sys.server_principals`, confirming the owner SID has been mutated to the stable local SQL principal (`sa` SID `0x01`, principal type `'S'`).
4. **Actual Verified Backup Retained**: Asserts that `Verified database backup retained:` appears in the launch log, confirming `BACKUP DATABASE ... WITH COPY_ONLY, CHECKSUM` followed by `RESTORE VERIFYONLY` completed prior to altering database authorization.
5. **Saved Workspace / Student Work Preservation**: Performs an authenticated GET to `/api/attempts/$attemptId` and asserts `$restored.workspace.notes -contains 'package reload note'`.
6. **Credential & Secret Immutability**: Asserts that existing `.env` secrets (`CASE_RUNTIME_SESSION_SECRET`, `SQLSERVER_PASSWORD`, `SQLSERVER_APP_PASSWORD`) were preserved without regeneration.

---

### 2. Healthy-Start Administrative Setup Prohibition

In [`scripts/tests/test-student-launcher.ps1#L394-L405`](scripts/tests/test-student-launcher.ps1#L394-L405), the healthy repeat launch test:
- Appends `function Install-StudentDatabase {throw 'WP309 administrative setup forbidden during healthy launch'}` to the extracted package's `install-student-database.ps1`.
- Launches `start-student-package.ps1` and waits for readiness.
- Asserts that the healthy repeat launch achieves `Ready:` within the timeout without invoking `Install-StudentDatabase`.
- Asserts that no unnecessary dependency reinstallation occurred (`!(Read-LauncherLog ...).Contains('Installing application dependencies')`).

This guarantees that ordinary learner launches never invoke elevated administrative setup functions once initial provisioning has succeeded.

---

### 3. Fixture Setup-Lock Interruption (Disclosed Limitation)

- **Root Cause & Behavior**: [`Open-SingleTestLease`](scripts/tests/single-test-database.ps1#L30-L40) enforces single-workspace exclusive access using SQL Server session application locking:
  ```sql
  EXEC sys.sp_getapplock @Resource=N'SequelCityWeb:SingleTestWorkspace', @LockMode='Exclusive', @LockOwner='Session', @LockTimeout=0;
  ```
  With `@LockTimeout=0`, overlapping invocations or an active test process terminating its connection will cause an immediate refusal (`'Another single-database test or preview operation is running.'`).
- **Accounting & Safety**: An intermediate run encountered this transient contention during fixture setup lock acquisition. Inspection verified that no orphaned locks, half-configured databases, or corrupt workspace states remained. The condition was accurately disclosed in [`WP-312-integrated-runtime-backlog-closeout.md#Post-review verification status`](docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md#L301-L304) rather than concealed. Subsequent runs acquired the lease cleanly.

---

### 4. Primary Log Evidence Review

All log evidence was inspected from the primary `outputs/` directory without running test commands or modifying databases in this audit checkout:

| Output Log | Recorded Evidence & Status | Completed vs In-Progress Distinction |
|:---|:---|:---|
| [`outputs/wp312-launcher-sql-final.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-launcher-sql-final.log) | Lines 1-57 (5,097 bytes). Passed launcher/configuration safety fixtures, new login readiness, permission denial, account-neutral existing-owner repair, backup verification, transactional rollback, backed-up v1 additive upgrade, WP-297 report signatures, 6 Playwright browser tests (12.4s), repeat healthy launch, deterministic owner repair via the probe shim (`PASS: extracted package existing-owner repair after simulated first-probe failure preserves saved work, credentials and browser ownership.`), legacy package launch, and cleanup of 11 test backups. | **COMPLETED** (Started prior to audit invocation at line 28; continued and finished through line 57 with exit code 0 during audit inspection). |
| [`outputs/wp312-single-sql.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-single-sql.log) | 3 lines. Passed parser, classroom-target refusal, lease-required reset, fixed fixture-name checks, SQL lock contention, ownership mismatch, second-clone refusal, failure recovery, retained preview workspace, and unchanged classroom markers. | **COMPLETED** |
| [`outputs/wp312-runtime-browser-verified.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-runtime-browser-verified.log) | 803 lines. Passed SQL creation/insertion/foreign keys, actual learner/repository logins, immutable content, parameterized repository, wrong-owner boundaries, notebook deduplication, note/draft import limits, database-authored titles, ordered proof status, and all 12 browser playthrough tests. | **COMPLETED** |
| [`outputs/wp312-graph-final.log`](D:/GitHub-Repos/SequelCityWeb/outputs/wp312-graph-final.log) | 29 lines. Full refresh of the Understand Anything knowledge graph across all 744 files in the repository (1,225 nodes, 481 edges, 6 layers, 7 tour steps). Exit code 0. | **COMPLETED** |

---

### 5. Review of Documentation & Graph Artifacts

- **Knowledge Graph**: The refreshed graph artifacts ([`knowledge-graph.json`](.understand-anything/knowledge-graph.json), [`fingerprints.json`](.understand-anything/fingerprints.json), [`meta.json`](.understand-anything/meta.json), and [`scan-result.json`](.understand-anything/intermediate/scan-result.json)) accurately map the integrated 744-file working tree without dangling edges or orphaned components.
- **Workflow & Lifecycle SSOTs**:
  - [`SSOT-Development-Workflow.md`](docs/00-ssot/SSOT-Development-Workflow.md#L125-L131) strictly retains all evidence-based implementation guidelines from accepted commit `2c1c624` (WP-301), adding only the necessary Single Test Database operational boundaries ([`Single-Test-Database.md`](docs/05-development-workflow/Single-Test-Database.md)) required by WP-302.
  - Case progression, authoring, and schema specifications ([`SSOT-Case-Progression.md`](docs/00-ssot/SSOT-Case-Progression.md), [`SSOT-Case-Authoring.md`](docs/00-ssot/SSOT-Case-Authoring.md), [`SSOT-Database-Schema.md`](docs/00-ssot/SSOT-Database-Schema.md)) faithfully reflect the server-authoritative evidence contracts and dual-role verification.
- **Work Package Accounting**: The historical records for WP-300 and WP-302 through WP-310 remain intact, truthfully documenting their respective development, validation, and integration paths into WP-312 without synthetic individual audit claims.

---

### 6. Audit Isolation & Scope Conformance

- **Audit Worktree Isolation**: This audit checkout has zero SQL workspace registrations; no database was created, altered, or accessed.
- **No Secret Access**: No `.env` credentials, connection strings, or protected secrets were exposed or staged.
- **No Working Tree Scope Creep**: All 70 modified and untracked files match the authorized file manifest in [`WP-312-integrated-runtime-backlog-closeout.md#L18-L88`](docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md#L18-L88). No application, SQL, or installer source files were touched.
- **Human Acceptance Gate**: Retained strictly as **Pending human acceptance after integration audit**.


### Code-agent review of audit evidence

Both independent AntiGravity source reviews returned PASS through the supported runner in the isolated 70-path checkout, with explicit external sharing authorization. The supplemental reviewer examined the deterministic test-only correction and completed final launcher log. These are integrated audits; no separate individual WP audits are claimed.

Clarifications to auditor narrative: there is no -RepairOwnerOnly parameter; the fixture triggers the existing Install-StudentDatabase path. The interrupted assertion involved the SequelDetectiveInstall setup resource, not the separate SingleTestWorkspace lease; no persistent lock remained on inspection, but its transient holder/root cause was not established. The final identical run passed. Do not treat the auditor's inferred cause as verified. Graph inventory counts are owned by the generated artifacts; audited narrative counts are descriptive. These reporting clarifications do not change the reviewed executable source.

Final validations: API suite, 229 web tests, web build, API typecheck, full SQL/runtime/browser harness, fresh Case 004 selected-report browser check, full packaged-launcher SQL/browser matrix and single-workspace SQL failure/recovery tests all passed. Source hashes confirm executable correspondence with the final audit snapshot. Graph readiness and whitespace checks passed. Both main and preview web/API endpoints returned 200; preview v3 restored. Exactly one test database and one workspace recovery backup remain. No primary story migration, dependency change, commit or push was performed during catch-up.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. This accepts the integrated WP-300 and WP-302 through WP-310 batch; WP-311 and unrelated planning are excluded.
