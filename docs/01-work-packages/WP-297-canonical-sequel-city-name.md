# WP-297: canonical Sequel City name

## Objective

Use Sequel City as the single current name for the fictional city in CrimeSceneReport and current case guidance, without losing report identities, saved work or the original city names in immutable historical records.

## Scope

Implementation authorized by the human developer on 2026-10-14 and resumed on 2026-10-15, following student review of accepted WP-296 (baseline 1a82336). This is a data/content compatibility correction independent of the feedback feature. WP-296 explicitly excludes database writes and must remain independently auditable. The user's implementation request supplies separate authorization; WP-296 is accepted and committed. Independent audit and human acceptance of WP-297 remain separate.

Read-only verification of the configured database found 15 CrimeSceneReport rows named SQL City and one named Sequel City. The legacy Case 004 incident/report 10975 and its manifest/briefing use SQL City; Case 001 uses Sequel City. The seed has other occurrences in narrative/person data, so blind repository-wide replacement is not an acceptable migration.

The separate duplicated Pinned Facts rendering defect is corrected within the current WP-296 shared UI scope using exclusive conditional rendering; it is not part of this database package.

## Impact Analysis

### Understand Status

- Required tier: protected content, evidence data, saved-version compatibility and bootstrap/readiness changes.
- Graph available: four tracked artifacts refreshed for current WP-296 source at accepted baseline 1b1121f, 714 analyzed files. WP-296 acceptance and commit 1a82336 verified before implementation; graph refresh required for the final WP-297 source.
- Source-verified dependencies: authoritative creation/seed/FK scripts; app.CheckCase004EvidenceManifest hardcodes SQL City; typed CaseBriefingFact for Case 004, backend report collection and saved Case 004 v1 attempts; frontend historical/Admin case copy, library art metadata and browser/API fixtures.
- Targeted dependency evidence: caseAttemptService consumes versioned briefing facts and passes typed city into collectCase004. Existing immutable content cannot simply be updated in place. Installer currently protects public evidence from general extension DML; preserve that boundary except for a narrowly audited correction path.

### Affected Architecture

Evidence seed/data correction, versioned authored content, repository compatibility projection, readiness/manifests, backed-up one-launch repair and case regression tests. Shared UI structure and query-feedback rules remain unchanged.

### Regression Surface

Fresh database, intact older runtime, repeat launch, interrupted repair rollback, both released cases, archived/active/completed attempts, pending query candidates and legacy notes/drafts. Check other ReportCity values remain unchanged. Distinguish current evidence from immutable historical query/proof text.

### Graph Update Decision

Regeneration required after implementation; include all four artifacts. No refresh or database writes during planning.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-297-canonical-sequel-city-name.md
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- scripts/student-package/install-student-database.ps1
- scripts/tests/test-student-launcher.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- apps/api/src/services/caseContentValidationService.ts
- apps/api/src/services/caseContentValidationService.test.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/case004ProgressionService.test.ts
- apps/web/src/studentCase.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.upsert.test.tsx
- apps/web/src/components/student/studentCaseLibrary.ts
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/features/queryReinforcement/generateReinforcement.test.ts
- apps/web/tests/browser/studentModeApi.ts
- apps/web/tests/browser/studentModeHarness.ts
- apps/web/tests/browser/student-mode.spec.ts
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/demo-walkthrough.spec.ts
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Handoff is accepted-closeout only. If source inventory identifies another required authoritative path, revise/review scope before editing it.

Do Not Modify:
- database/migrations/**
- report IDs, crime/person/interview identities, evidence relationships or unrelated real city names
- immutable released content or historical query/proof/workspace text in place
- SQL safety, ownership/CSRF, verifier authority or general public-data write restrictions
- shared Query Lab layout, feedback rules, dependencies or runtime AI

## Constraints

No blind string replacement and no general public-evidence mutation facility. No live update during implementation tests. Test only newly owned disposable databases. Before any configured local database repair, use the existing explicitly authorized backed-up setup path, verify a COPY_ONLY/CHECKSUM backup, inventory expected rows/manifest and apply one transaction. Refuse unknown or conflicting datasets; do not rely on the live count alone as a signature. Never drop/recreate a student's database automatically.

Simplicity: one narrowly identified legacy spelling correction and a bounded compatibility rule, not a generic city master-data platform. Preserve released rows in place. Publish a new Case 004 content version for fresh attempts. Old pinned attempts need an explicit tested compatibility projection for known city fields (and clear instructions to rerun stale candidates), rather than silently losing progress or rewriting SQL drafts. New architecture/schema beyond that needs an explicit revised design review.

## Required Behavior

1. Inventory every SQL City occurrence by table/column and authored use. Verify which refer to the same fictional city; classify historical records separately. Target the 15 legacy CrimeSceneReport rows by verified identities/signature, update only ReportCity and preserve all other column values/relationships. Confirm every unrelated city is unchanged.
2. Make a clean build seed canonical ReportCity values and current Case 004 metadata/dossier/library copy. Publish new immutable content version for fresh attempts; preserve v1 historical rows. Update script version/date, expected releases/readiness and Case 004 evidence manifest in the same package.
3. Provide an explicit bounded compatibility projection for the known legacy city in pinned Case 004 v1 public city facts/guidance. Source released records and saved proofs remain immutable. Canonical typed tokens must use Sequel City. Do not alter stored drafts; explain that historical SQL City filters or pre-repair query candidates require editing/rerunning. Preserve proved IDs, notes, status and saved attempts. Prove this approach before applying the repair; if it cannot preserve progression cleanly, return a concrete migration alternative for review.
4. Deliver a one-launch, idempotent repair for a recognized intact existing runtime, with verified backup, row-signature checks, transactional data/content/manifest publication, a recorded readiness marker and rollback on interruption. Keep the general installer evidence-DML prohibition; allow only this specific audited repair path. Refuse unrelated data changes, partial/unknown schemas and unexpected row sets.
5. Fresh install and repaired install agree on current evidence/case versions. Live ReportCity has no SQL City rows; Sequel City gains exactly the identified legacy reports. Historical content/proof text may retain the old name as audit history and must not be falsely described as current report data.
6. Update test/active documentation fixtures semantically, not historical migration/audit records. Full Case 001 and sixteen-step Case 004 playthroughs, both verifier roles, old-version resume and new-version start remain valid. Original SQL City spelling should remain only where explicitly testing/preserving the legacy transition.

## Acceptance Criteria

Checked implementation criteria refer to fresh and repaired disposable fixtures. The configured classroom database remains unchanged. Independent audit passed; human acceptance is recorded in Final Decision.

- [x] Current CrimeSceneReport contains zero SQL City rows; the same verified reports now use Sequel City without identity or relationship changes.
- [x] Current metadata, tokens, dossier, manifests and fresh scripts agree; script version/date and readiness markers reflect the change.
- [x] Saved v1 attempts/notes/proof remain preserved and can progress with canonical public facts; stale drafts/candidates are handled explicitly without automatic rewriting.
- [x] Backed-up recognized-runtime repair is atomic/idempotent, rolls back on interruption and rejects unknown datasets without weakening general evidence protection.
- [x] Full SQL, bootstrap/launcher and browser regression covers fresh/old attempts and both cases, including full Case 004 resolution.
- [x] Independent audit and human acceptance remain pending until actually completed.

## Code Prompt

After explicit implementation authorization and dependency acceptance, inventory source/data uses and prove the minimal compatibility design using disposable old/new-version fixtures. Then update the authoritative scripts, new content version and tightly bounded one-launch repair with verified backup/transaction/signature checks. Preserve existing proof identities, immutable content and drafts. Run the required real SQL/launcher/browser checks, refresh the four graph artifacts and record exact limitations and changes. Do not mutate configured live data as a test, accept your own work or commit/push.

## Audit Prompt

Independently audit the exact row inventory, canonical naming, new content version, old-attempt compatibility, manifest/readiness and authoritative creation/seed/FK coverage. Verify backup/atomicity/idempotency and adversarial refusal of unknown row sets or unrelated public writes. Confirm no blanket replacement, historical rewrite, automatic draft rewrite, changed identity or weakened proof/security. Require real SQL and both full case/browser paths. Record Verdict: PASS, FAIL or BLOCKED; final acceptance remains human-owned.

## Code Results

Implemented and locally verified, baseline 1a82336. No configured live database write, commit, push or final acceptance has been performed. The independent audit is recorded below.

Source/data inventory and classification:

| Location | Treatment |
|---|---|
| CrimeSceneReport.ReportCity | Fifteen verified legacy report tuples become Sequel City; report identities, crime/date/description and relationships remain unchanged. |
| PersonsOfInterest.AddressCity (123 seed values) | Existing address data is outside this bounded report correction and remains unchanged; it is not current case guidance. |
| CaseAnswerKey.SuccessVerdict (one historical narrative) | Preserve the original verifier narrative, including the historical spelling. No answer data writes. |
| Case 004 v1 CaseDefinition.Title/Dossier, CaseStep.TaskTitle, CaseBriefingFact.TextValue/DisplayValue | Retain immutable released rows. Publish v2; project only the known v1 public spelling at repository read time after source validation. |
| Saved workspace, query action and proof JSON | Preserve history and drafts byte-for-byte. A pending report candidate carrying the old city is rejected with an explicit edit/rerun instruction. |
| Current web library, Admin guidance and browser/unit fixtures | Update only the scoped semantic uses; legacy transition tests explicitly keep the old spelling. |
| database/migrations and historical work packages/audits | Preserve historical records. |

Verified legacy report identities: 10056, 10138, 10154, 10216, 10317, 10506, 10562, 10571, 10791, 10927, 10969, 10970, 10975, 11049, 11050. Each is checked against CrimeID, ReportDate and the full binary ReportDescription. Report 10571 preserves the seed decoder's existing replacement-character representation; no description cleanup is bundled into this repair.

Implementation:

- Authoritative script version 2.3, dated 2026-10-15. Fresh report seed is canonical; all original Case 004 v1 authored rows remain unchanged. Nested CITY NAME sections publish Case 004 v2, update the existing owner-executed evidence manifest and record canonical-city-v1 in the same installer transaction.
- Installer retains the general extension evidence-DML prohibition. Its separate fixed-identity correction requires a recognized runtime, expected report signatures, no unexpected old-city report rows, and a uniform old/new city state. Unknown, partial and conflicting datasets stop. It retains and verifies COPY_ONLY/CHECKSUM backup before mutation; signature locks are reacquired inside the transaction. Interrupted data/content/manifest/marker publication rolls back.
- Repository projection checks the exact v1 case/version/fact identity and historical value. It returns a canonical city token, known title/dossier/task wording and explicit guidance to edit old filters/rerun pending candidates. Released source records, accepted report IDs, notes, saved drafts and proofs are not rewritten. Case 004 report proof contains ReportID rather than a mutable city fact; previously proved progression stays valid.
- Readiness requires the canonical marker, released Case 004 v2 and canonical evidence manifest. Content validation enforces the historical v1 and canonical current city contracts before projection.

Validation:

- Final API regression suite passed, including the versioned city-contract tests: outputs/wp297-api-tests.log.
- Frontend: all 230 tests in 23 files passed after correcting two lowercase legacy city comparisons: outputs/wp297-web-tests.log. Final API no-emit typecheck and web production build passed: outputs/wp297-api-typecheck.log and outputs/wp297-web-build.log.
- Real disposable SQL/browser run passed: outputs/wp297-sql-browser.log, database SequelCityRuntimeTest_WP297_Release_20261014. All 12 browser tests passed; complete sixteen-step Case 004 paths passed for pinned v1 and fresh v2, both verifier roles, partial collection resume, archived/completed attempts, stale draft retention and rejection of a pre-correction query candidate. Case 001 and actual-login security checks passed.
- Real launcher/SQL run passed: outputs/wp297-launcher.log. Fresh/current/legacy/extension/city transitions, retained backup verification, injected transaction interruption, altered description, unknown legacy row and mixed-city refusal, report-value hashes, unrelated evidence/workspace hashes, immutable v1 step preservation and repeated launch passed. Disposable databases and fixture logins were cleaned by their owning harnesses; verified backups remain retained.
- Active runtime/UI contracts updated. All four graph artifacts regenerated through the repository wrapper (715 files); scope review found 33 WP-297 paths and zero out-of-scope changes, excluding four pre-existing planning documents that were preserved. Whitespace checks passed.
- Final launcher unit/safety fixtures passed: outputs/wp297-launcher-unit.log.
- Final disposable SQL/API/browser run on 2026-10-15 exited 0: outputs/wp297-sql-browser-final.log, database SequelCityRuntimeTest_WP297_Final_20261015. All 12 browser tests passed; both full sixteen-step Case 004 v1/v2 paths passed, along with Case 001, both verifier roles, ownership/CSRF/security, missing-marker and corrupt-current-city readiness checks. The harness cleaned its owned database and fixture logins.
- Final launcher/SQL run on 2026-10-15 exited 0: outputs/wp297-launcher-final.log. Recognized v1 content checks before backup and inside the transaction, corrupted-content refusal, full six-table immutable-content hashes, pre-existing accepted action/proof/item preservation, exact report signature/unknown-row/mixed-city refusal, verified backups, rollback and idempotency all passed. The harness cleaned its owned databases and logins; verified backups remain retained.
- The temporary SQL-service blocker was resolved when the user started MSSQLSERVER. The final SQL-dependent additions are now verified. The configured classroom database was never mutated. Packaged-launch rebuild was not run; the actual database installer, launcher safety/account fixtures and SQL/browser paths were exercised directly.
- Read-only source comparison checked all 1,229 parsed original report tuples: exactly the fifteen listed ReportCity values changed; their other fields and every other parsed report tuple remained unchanged.

Earlier failures were corrected: runtime readiness initially attempted administrative signature locking with the restricted repository login; locking now stays in the administrative repair path and runtime evidence checks use the existing owner-executed manifest. One frontend test exposed lowercase legacy comparisons; both now use the canonical spelling. These are implementation/test findings, not independent audit evidence.

## Audit Results

Verdict: PASS

### Audit provenance and isolation resolution

AntiGravity actually ran through `scripts/audit-work-package.ps1 WP-297 -AllowExternalAudit -TimeoutMinutes 30` on 2026-10-15. External audit sharing was explicitly authorized by the human's original command; the same audit was rerun after resolving isolation, without a mixed-worktree override.

Audited repository: `C:/Users/cburk/.codex/worktrees/wp-297-audit/SequelCityWeb`, baseline `1a823362031a03b2b3dd70b3eb545a1f3f89da82`. The pre-audit checkout contained exactly 33 WP-297 dirty files and zero out-of-scope files. All 25 implementation files match the main checkout byte-for-byte after restoring newline-only churn in the walkthrough fixture. Generated tracked API build outputs were cleaned by the auditor; no runtime/source changes were incorporated from the audit.

The first attempt in `D:/GitHub-Repos/SequelCityWeb` invoked no auditor because four pre-existing planning documents were dirty (WP-284, WP-285, WP-290 and CASE-RUNTIME-ARCHITECTURE-IMPROVEMENT-PLAN). Those edits remain untouched in the main checkout. The original isolation record is retained locally in `outputs/wp297-original-isolation-block.log`. Independent review used the attached isolated worktree; the main checkout still contains those separate planning changes.

Runner log: `outputs/wp297-isolated-audit-run.log`. The audit process exited 0. Final acceptance remains human-owned; no acceptance, handoff refresh, commit or push was performed.

### Independent auditor output
I have launched `test-student-launcher.ps1 -SqlIntegration` to verify the authoritative creation, backup, atomicity, idempotency, adversarial refusal of altered descriptions, unknown row sets, corrupt content, and mixed cities, as well as byte-exact hash preservation. I am awaiting the execution results.
I am waiting for `test-student-launcher.ps1 -SqlIntegration` to finish running its test matrix against SQL Server.
I am waiting for the background SQL integration test task to complete.
The SQL launcher integration tests are progressing. I will now wait for the system notification upon test completion.
I have launched the comprehensive database bootstrap, live SQL integration, and Playwright browser regression test suite (`test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP297_Audit_20261015 -RunBrowsers`) to independently verify both Case 001 and Case 004 paths across real SQL and browser execution. I will wait for the test run to complete.
I have launched `npm run test:browser --workspace apps/web` to execute the Playwright browser suite. I will wait for the test run to finish.
I have launched `npm run demo:walkthrough` to test the walkthrough script against the application. I will wait for the result.
I have re-launched `npm run demo:walkthrough` to verify that the walkthrough completes end-to-end. I will wait for it to finish.
I have launched `npm run demo:walkthrough` to verify that the walkthrough now interacts with the SQL Query editor properly. I will wait for it to complete.
### Audit Verdict: **PASS**

**Work Package:** [WP-297: canonical Sequel City name](docs/01-work-packages/WP-297-canonical-sequel-city-name.md)  
**Auditor:** AntiGravity (Independent Audit)  
**Date:** 2026-10-15  
**Final Acceptance:** Human-owned (pending human review and closeout)

---

### Audit Assessment & Evidence

#### 1. Exact Row Inventory & Canonical Naming
- **15 Legacy `CrimeSceneReport` Rows:** Report IDs `10056`, `10138`, `10154`, `10216`, `10317`, `10506`, `10562`, `10571`, `10791`, `10927`, `10969`, `10970`, `10975`, `11049`, and `11050` were verified by exact `CrimeID`, `ReportDate`, and binary `ReportDescription`. Only `ReportCity` was updated from `'SQL City'` to `'Sequel City'`.
- **CrimeSceneReport Totals:** Exactly 0 rows with `ReportCity = 'SQL City'` remain. Exactly 16 rows now have `ReportCity = 'Sequel City'` (15 updated legacy rows + 1 preexisting Case 001 row, Report ID `11596`).
- **Unrelated Public Data Preserved:** All 123 `PersonsOfInterest.AddressCity` rows remain `'SQL City'` (address data outside the report correction scope). `CaseAnswerKey.SuccessVerdict` is preserved byte-for-byte (`"Everyone in SQL City hails you as the greatest SQL detective of all time."`). No repository-wide or blanket string substitutions were applied.

#### 2. Authoritative Creation, Seed, FK Coverage & Manifest Readiness
- Authoritative scripts ([01-SequelCityCrimesDB - Create DB.sql](database/01-SequelCityCrimesDB - Create DB.sql), [02-SequelCityCrimesDB - Insert Data.sql](database/02-SequelCityCrimesDB - Insert Data.sql), and [03-SequelCityCrimesDB - ForeignKeys.sql](database/03-SequelCityCrimesDB - ForeignKeys.sql)) bumped to version 2.3, dated 2026-10-15.
- `app.CheckCase004EvidenceManifest` was updated and verified: enforces Report ID `10975` in `'Sequel City'`, checks `NOT EXISTS (SELECT 1 FROM dbo.CrimeSceneReport WHERE ReportCity='SQL City')`, and verifies `COUNT(*) = 16` for `'Sequel City'`.
- `dbo.AppSchemaVersion` records the migration marker `canonical-city-v1`.
- [`validateCaseRuntimeReadiness`](apps/api/src/services/databaseIdentityService.ts#L227) enforces the migration marker, released Case 004 v2, and evidence manifest checks.
- [`validateCaseContent`](apps/api/src/services/caseContentValidationService.ts#L102) strictly enforces versioned city contracts (v1 requires `'SQL City'`, v2 requires `'Sequel City'`) prior to projection.

#### 3. New Content Version & Old-Attempt Compatibility
- **Case 004 v1 Immutability:** Released Case 004 v1 rows (`CaseDefinition`, `CaseStep`, `CaseStepPrerequisite`, `CaseFactDefinition`, `CaseBriefingFact`, `CaseStepFactBinding`) remain completely unmodified in the database.
- **Case 004 v2 Publication:** Case 004 v2 is published as released with canonical `'Sequel City'` titles, dossier, task descriptions, and briefing facts.
- **In-Memory Projection:** [`projectLegacyCityContent`](apps/api/src/repositories/caseRuntimeRepository.ts#L19) projects canonical `'Sequel City'` at query/read time for v1 attempts only after verifying immutable database content.
- **Draft & Note Preservation:** No student workspaces, drafts, notes, or saved proof records are rewritten or altered automatically.
- **Explicit Instruction on Stale Candidates:** [`CaseAttemptService`](apps/api/src/services/caseAttemptService.ts#L292) explicitly rejects query candidate rows containing `ReportCity = 'SQL City'` with HTTP 422 instructing the learner to update filters and rerun before logging.

#### 4. Backup, Atomicity, Idempotency & Adversarial Rejection
- General evidence-DML restrictions in [`install-student-database.ps1`](scripts/student-package/install-student-database.ps1) remain fully active outside the single bounded repair routine.
- Repair path verifies a `COPY_ONLY, CHECKSUM` backup with `RESTORE VERIFYONLY` before any mutation.
- Protected by `UPDLOCK, HOLDLOCK` inside a single transaction with `SET XACT_ABORT ON`.
- Adversarial rejection verified: rejects altered descriptions, partial/conflicting repairs, unexpected legacy rows with `'SQL City'` (e.g., Report ID `10001`), and corrupted Case 004 content.
- Injected interruption verified to roll back cleanly to legacy state.
- Idempotency verified: re-running installation on a repaired database reports `current` without modifying data.
- Byte-exact SHA256 hashes of all 16 evidence/runtime tables and all 6 Case 004 v1 tables confirmed preserved.

---

### Verification Test Summary

| Test Suite | Command | Result |
|---|---|---|
| API Unit Regression | `npm test --workspace apps/api` | **PASS** |
| API TypeScript Build | `npm run build --workspace apps/api` | **PASS** |
| Web Unit Tests | `npm test --workspace apps/web` | **PASS** (23 files, 230 tests) |
| Web Production Build | `npm run build --workspace apps/web` | **PASS** |
| Launcher Unit & Safety | `scripts/tests/test-student-launcher.ps1` | **PASS** |
| Launcher SQL & Backup Integration | `scripts/tests/test-student-launcher.ps1 -SqlIntegration` | **PASS** (retained backups, adversarial refusal, rollback, SHA256 preservation) |
| Real SQL Bootstrap & Playwright Browsers | `scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP297_Audit_20261015 -RunBrowsers` | **PASS** (12 live browser tests passed: Case 001, full 16-step Case 004 v1 & v2 playthroughs, both verification roles) |
| Worktree Scope Isolation | `scripts/get-work-package-status.ps1 wp-297 -Json` | **PASS** (0 out-of-scope files; `state: AuditedNeedsFinalDecision`) |
| Closeout Preflight | `scripts/check-work-package-closeout.ps1 wp-297` | **PASS** (`Closeout state: ReadyForAcceptance`) |

---

### Status
The work package audit record in [WP-297-canonical-sequel-city-name.md](docs/01-work-packages/WP-297-canonical-sequel-city-name.md) has been updated to **`Verdict: PASS`**.

The repository state is **`AuditedNeedsFinalDecision`** / **`ReadyForAcceptance`**. Final acceptance remains human-owned.
root agent idle; waiting up to 30m0s for 1 background task(s)

## Final Decision

Accepted by the human developer on 2026-10-15 following independent AntiGravity audit PASS and completed implementation validation. Acceptance was explicitly requested in this chat: "accept WP-297".

Commit, push and accepted-WP handoff closeout were explicitly authorized by the human on 2026-10-15: "commit and push". Destination: origin/main. Finalization uses codex/wp-297-closeout in the primary checkout because the existing commit helper requires a .git directory and rejects managed worktrees with a .git file. The four unrelated planning documents were SHA256-backed up under .git/wp297-preserved-planning, removed from the commit scope and will be restored byte-for-byte after finalization. No mixed-worktree override is used.

The live handoff is refreshed for this accepted closeout. No configured classroom database repair or destructive rebuild is authorized by this commit/push request.
