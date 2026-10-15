# WP-290: prove database case authoring and retire unused student scaffolding

## Objective

Demonstrate an additional evidence-review case from authored SQL records through the real protected runtime and shared Query Lab, document the supported authoring formula honestly, and remove only obsolete frontend module-registration scaffolding with verified zero production consumers.

## Scope

Implementation authorized by the human on 2026-10-15 ("Proceed") after accepted/pushed WP-297 baseline f79c3c5ba43038b1a7807ff5bd1e64d09478bb4a. Scope revalidated against current source before implementation. WP-284 and WP-285 are superseded historical plans, not prerequisites awaiting execution.

Accepted WP-289, WP-296 and WP-297 are dependencies already delivered. The configured database upgrade is a separate operation: read-only preflight refused report 10571 encoding and WP-298 records that correction for review; no live writes occurred. WP-290 uses only disposable SQL and does not depend on repairing the configured database.

### Re-evaluation findings and disposition

| Original obligation | Current evidence | Revised disposition |
|---|---|---|
| One generic Query Lab | WP-289 StudentQueryLab/ProtectedCaseQueryEditor; legacy StudentWorkbenchView deleted; App test opens mocked case-008 without a case module | Delivered. Preserve and extend proof; do not rebuild UI. |
| Author validation | caseContentValidationService tests cover registry/mode/parameter rejection, safe scaffolds, cycles/reachability, types/cardinality and a synthetic branched AND graph | Delivered at unit level. Reuse; add end-to-end authored SQL proof and missing negative coverage. |
| Additional-case runtime proof | Existing foundation fixture is a draft shipped seed; additional-case UI test is mocked; branched graph is an in-memory validation fixture | Still needed: real SQL authored records, owned attempts, actual query/log progression, partial resume, browser rendering and non-leakage. Do not describe existing mock/unit coverage as this proof. |
| Fully data-only arbitrary cases | Registered handler schemas currently accept empty parameters. Case 001 validators encode its clocktower semantics; Case 004 handler semantics remain explicit. Snapshot collection projection checks CaseId == case-004; verification is intentionally gated to Case 004 | Narrow the claim: metadata/presentation and supported handler reuse can be data-authored. New evidence semantics and future verifier roles still require reviewed backend work. Fix the two source-confirmed collection couplings required by the fixture: snapshot metadata and evidence logging dispatch. Select only registered existing handlers; preserve canonical checks and the Case 004-only verification gate. |
| Delete frontend legacy state/content | App AdminInvestigationDiagnostics still uses useStudentCaseState in developer mode; hook imports studentCase001/studentCase001Progress/studentCase; QueryResultsTable and other features use shared types | Blanket deletion rejected. Preserve Admin, shared types/assets and recovery. Remove only unused studentCaseModule registration layer after consumer inventory. |
| Updated authoring SSOT/guide | SSOT-Case-Authoring still describes old compiled module contracts, browser progress and rebuild-only expectations; CASE-RUNTIME-AUTHORING-GUIDE is absent | Needed: align active documentation with accepted versioned SQL/runtime/bootstrap contracts and provide a concrete worked recipe. Preserve full-case pedagogical planning. |
| Bootstrap/fixtures/catalog safety | WP-289 already audited authoritative scripts, additive backup/rollback, typed facts and manifest checks | Preserve. New fixture belongs exclusively to disposable test SQL; no new public release, schema, production seed or live database writes. |

## Impact Analysis

### Understand Status

- Analysis tier: Required; cross-module authoring proof, shared runtime projection and selective retirement.
- Graph available: all four tracked artifacts, refreshed for accepted WP-297 source (715 files); metadata identifies pre-commit 1a82336. The accepted f79c3c5 source is represented by the graph; later audit/acceptance/handoff edits are non-structural. Targeted nodes and imports rechecked; no planning regeneration. Previous analysis: metadata baseline 9b0c3662a97fb1c5b52171d0bb970d166f67145b, refreshed 2026-10-14T20:28:23Z against the WP-289 working implementation; accepted HEAD is 1b1121f containing that implementation plus closeout documentation. Usable for navigation; metadata predates closeout. Recheck after WP-296.
- Targeted graph nodes: caseContentValidationService, caseAttemptService, useStudentCaseState and studentCaseModule; verified actual imports and consumer searches. Source governs inferred retirement decisions.
- Current import evidence: App uses the legacy hook only inside AdminInvestigationDiagnostics; studentCaseModule has no production import found by source search, but its contract is consumed by studentCaseModule.test and caseAuthoring.test. studentCase and studentCase001 families are still dependency-bearing. CurrentCaseTask remains a compatibility export used by tests; no benefit from removing it in this package. New inventory: StudentPlayableCaseSkeletonView still imports SkeletonPlayableStudentCaseModule, and its test uses CASE_001_PLAYABLE_SKELETON_MODULE. Preserve these type/fixture exports; retire only unused released-case registry/lookup/storage exports and their obsolete registration assertions. Useful skeleton and author-vetting checks remain.

### Affected Architecture

- Authoring: documentation and a test-only SQL fixture use existing CaseDefinition/CaseStep/prerequisite/fact/binding tables and existing registered handlers.
- Backend: collection metadata and evidence logging dispatch must derive from the selected registered handler, not an unrelated hardcoded case ID; canonical evidence/provenance and verifier authority stay unchanged.
- Frontend: existing App, dossier discovery and StudentQueryLab serve the fixture without a new component, case module, route switch or artwork entry.
- Consumers: case authors, author validation, installer/bootstrap regression, owned learner attempts and generic catalogue/rendering.

### Regression Surface

- New disposable fixture author/release/attempt/query/log/resume/reload/render flow; draft/retired/unpublished non-discovery; future-step and answer leakage; malformed content rejection.
- Existing Case 001 v1/v2 saved work, three-step boundary, Case 004 full sixteen-step progression, Admin diagnostics and explicit legacy notes/draft recovery.
- Scope includes existing unit, SQL integration and selected browser tests. Do not remove tests solely to claim legacy retirement.

### Graph Update Decision

- Regeneration required after implementation: Yes; real runtime projection/test relationships and retired modules change structure. Own all four tracked artifacts below.
- No graph regeneration during this documentation-only re-evaluation; proposals are not implemented relationships.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-290-case-authoring-proof-and-legacy-retirement.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/05-development-workflow/Case-Production-Workflow.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/caseContentValidationService.test.ts
- apps/api/src/services/caseRuntimeAuthoring.test.ts
- apps/api/src/services/fixtures/case-runtime-authoring.sql
- apps/api/package.json
- apps/web/src/studentCaseModule.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/caseAuthoring.test.ts
- apps/web/src/App.test.tsx
- apps/web/tests/browser/student-mode.spec.ts
- apps/web/tests/browser/studentModeApi.ts
- apps/web/tests/browser/studentModeHarness.ts
- apps/web/tests/browser/case-runtime-authoring.spec.ts
- scripts/tests/test-case-runtime-bootstrap.ps1
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Scope notes: caseAttemptService changes are limited to registered-handler collection metadata/log dispatch; package.json is test registration only; the SQL fixture is disposable-only. Handoff remains accepted-closeout only.

Do Not Modify:
- database/**, production/released content, actual learner attempts or configured live databases. No schema/content extension is planned; if real requirements demand one, amend/review scope and include authoritative creation/seed/FK, readiness and additive backup/rollback tests before implementation.
- apps/web/src/useStudentCaseState.ts, studentCase.ts, studentCase001.ts, studentCase001Progress.ts and their recovery/Admin consumers.
- StudentQueryLab/ProtectedCasePresentation/App production layout, artwork, QueryRunner or CurrentCaseTask compatibility export.
- Canonical validator semantics, verifier role/case gates, SQL safety, cookie/CSRF/ownership or private schema boundaries.
- WP-296 implementation, audit tooling and dependencies.

## Constraints

No generic rule engine, dynamic validator SQL, runtime AI, CMS or new dependencies. A data-authored case does not imply arbitrary mysteries are executable without backend validators. Keep explicit handler semantics and report capability limits. AND prerequisites have current support; do not claim OR/optional branches or arbitrary role verification.

Keep test SQL outside production install sections. Fixture release is local to a newly owned disposable database and absent from shipped catalogue/base seed. Tests refuse an existing or non-SequelCityRuntimeTest_ target and clean up in finally. Follow accepted draft assembly with NULL entry, checked keys and release immutability; never disable constraints or triggers.

Simplicity check: reuse repository, validation service, registered handlers and existing shared UI. Add one fixture integration and one browser proof. Do not build authoring infrastructure or broaden legacy removal when the immediate requirement is proof/documentation.

## Required Behavior

1. Provide a worked authoring recipe: whole-case objective/dossier; task title/objective/Samuel direction/hint/broad starter; prerequisite order; handler/completion mode and supported semantics; typed briefing facts; earned output/input bindings; expected evidence; validation, draft assembly, publication, version pinning and regression gates. Explain exactly when a new backend handler is required.
2. Create one uniquely named synthetic evidence-review case in test-only SQL, reusing existing Case 004 crime-type, report-inspection and report-isolation handlers against existing public evidence. Give it independent keys/text, typed public City/Date and appropriate bindings. Avoid asserting that changing IDs/text alone changes handler semantics. Add no new frontend module or production case-ID allowlist.
3. Execute its complete authored path through actual SQL, repository, API and browser: fresh entry/tokens before queries, canonical CrimeType log, report inspection, isolated report log, completion, resume/reload and draft preservation. Compare expected state to authoritative saved proof, not test-injected milestone flags. If a distinct multi-item collection is needed to exercise handler metadata, use an existing supported collection handler with its authentic prerequisites; do not weaken or fake proof to simplify the fixture.
4. Derive collection projection and evidence logging dispatch from the selected registered handler for any supported authored case. Preserve existing counts and proof semantics; do not generalize Case 004 verification to other cases. Test the narrow case-ID independence and retain complete released-case regressions.
5. In disposable tests, verify draft and retired fixtures stay out of discovery and cannot be opened as released; an authorized released test fixture can be discovered without a new frontend registration. Verify future task/answer/validator details remain hidden. Existing shipped draft fixture remains non-playable.
6. Reuse existing author-validation negatives; add only uncovered cases for SQL fixture integrity and release workflow. Unsupported validator/mode/parameters, invalid facts/bindings, cycles/unreachable steps, inappropriate starter filters and hidden literal identifiers fail. Do not present bounded identifier checks as a complete natural-language spoiler detector; authors still perform case review.
7. Inventory production imports, tests, documentation and local-storage recovery before any deletion. Retire studentCaseModule registration only if no live consumer remains; preserve its genuinely useful pedagogical contract checks through updated runtime/documentation tests. Keep Admin diagnostics/shared types/assets and legacy import/export intact. Leave dependency-bearing modules explicitly classified instead of deleting them wholesale.
8. Update stale authoring and persistence prose to accepted runtime contracts, including immutable published versions, saved attempts, public evidence requirements, automatic supported additive setup with verified backup, and explicit consent for any destructive rebuild. Document expected authoring/validator capability limits and remaining retained legacy dependencies.

## Acceptance Criteria

- [x] Existing WP-289 delivery is explicitly credited; no repeated migration/layout work.
- [x] New test case completes through real SQL/API/shared browser surface from authored records, with zero new case presentation module or production seed.
- [x] Handler-derived collection projection works independently of CaseId without broadening validator/verifier authority.
- [x] Draft/retired/unpublished fixtures remain unavailable; shipped catalogue never contains the released test case.
- [x] Authoring guide covers concrete record fields, sample SQL, supported handler reuse limits, validation, publication, versions and bootstrap/rebuild safety.
- [x] Retirement inventory documents retained Admin/recovery/shared dependencies; only provably unused module registration is removed, with useful tests preserved.
- [x] API/web tests and builds, new fixture browser proof, actual SQL bootstrap and existing Case 001/Case 004 playthroughs pass; graph/readiness and diff checks pass.
- [x] Independent audit and human acceptance remain separate; no live schema/content mutation.

## Code Prompt

After explicit implementation authorization, confirm accepted WP-289 and preferably WP-296, refresh baseline analysis and review this narrowed scope. First document authoring capabilities and prove a supported three-step synthetic case using test-only SQL. Correct only the registered-handler collection projection and evidence logging dispatch and integrate real API/browser proof without changing production UI. Preserve all canonical proof/security gates. Inventory consumers before selectively retiring the unused module-registration layer and replacing its obsolete tests. Update scoped authoring documentation to current runtime, execute stated real-SQL/browser/regression checks and refresh graph artifacts. Record limitations. Do not accept, commit or push your own implementation.

## Audit Prompt

Independently verify the additional case is truly authored in SQL and completes through real API/browser with unchanged shared presentation and existing handler authority. Falsify claimed case-ID independence, release/catalogue isolation, saved-version compatibility and future-step secrecy. Verify no fixture entered production seed and no live database was changed. Check retained Admin/recovery imports and useful pedagogical tests before approving retirement. Require actual SQL/browser evidence, both released-case regressions, bootstrap consistency and honest limits on validators/branches/spoiler detection. Check scoped diff and simplicity. Report Verdict: PASS, FAIL or BLOCKED with evidence; leave final human acceptance pending.

## Code Results

Implemented on codex/wp-290-authoring-proof from accepted WP-297 baseline f79c3c5. SQL/browser verification and graph refresh passed; independent audit and human acceptance remain pending. No commit or push performed.

Changes:

- Reuses accepted WP-289/296/297 runtime. Exactly two runtime predicates now select the registered collection handler for snapshot counts and evidence logging, rather than CaseId. Canonical row/source checks, owned actions, expiry/revisions, authored facts/prerequisites and the Case 004-only verification gate remain unchanged. No generic rule engine, dependencies or production UI changes.
- Adds a transactionally published, disposable-only SQL case-008 with independent catalogue/archive/incident step keys and existing log/query/log handlers. The fixture refuses a non-test target or existing fixture and never enters authoritative seed. Real API proof checks typed public facts, no future-task/validator leakage, forged/unrelated/stale clue refusal, immutable released records, draft/retired non-discovery, archive/resume, retained drafts/notes, completion and authoritative saved proof/items.
- Adds a real browser proof against this fixture using the unchanged shared Query Lab, including public city facts, explicit logging, reload/resume, retained draft, and completed evidence notebook. Existing Case 001 and complete sixteen-step Case 004 v1/v2 paths remain in the owning bootstrap suite.
- Retires unused released-case registry/lookup/storage exports from studentCaseModule. Retains SkeletonPlayableStudentCaseModule and CASE_001_PLAYABLE_SKELETON_MODULE for the historical skeleton view/type/test consumer. Keeps AdminInvestigationDiagnostics, useStudentCaseState, studentCase/studentCase001/studentCase001Progress, shared types/assets, local-storage recovery and CurrentCaseTask. Removes five obsolete registry tests; preserves the remaining four skeleton tests and all ten independent author-vetting tests. Removes only the now-unused registry import from caseAuthoring.test.
- Adds CASE-RUNTIME-AUTHORING-GUIDE with exact table fields, typed bindings, worked SQL, handler/code capability limits, draft assembly, immutable versions, validation/publication, supported AND prerequisites, verifier restrictions, backup/rebuild safety and retained dependency inventory. Updates only allowed authoring/state/workflow contracts.

Validation:

- API regression and no-emit typecheck passed: outputs/wp290-api-tests.log and outputs/wp290-api-typecheck.log. Web production build passed: outputs/wp290-web-build.log.
- Web tests: 225 passed in 23 files, compared with 230 before removal of five obsolete registry tests. All pedagogical author-vetting and remaining skeleton checks remain. Log: outputs/wp290-web-tests.log.
- Final combined disposable SQL run passed with exit 0: outputs/wp290-sql-browser-verified.log. Includes the real three-step authoring/API proof, new real browser proof (1 passed), existing 12-browser regression, Case 001 and both full released Case 004 version paths. The owning disposable bootstrap suite reported PASS.
- Refreshed all four graph artifacts (720 scanned files); graph refresh/readiness and git diff --check passed. API/web verification command exited 0. No dependency lock changes.
- Earlier failures: an incomplete existing snapshot mock omitted ValidatorKey/CompletionMode; updated only its step fixtures. New browser assertions initially expected plain city text rather than the rendered typed condition, then used a zero-based UI row label; both test interactions now match the existing shared renderer. No production UI changes were made to satisfy tests.
- Local dependency installation was missing a locked package. Restored it with npm ci --ignore-scripts --offline; package-lock.json is unchanged. Stopped only the PID/ancestry-verified retained WP-296 preview that held an esbuild file lock. No new dependency/version adopted.

Separate live operation:

The human also authorized the accepted configured-database upgrade. Read-only preflight refused report 10571's exact older dash encoding before backup or any mutation. Fourteen target reports match; one full description signature differs. No live database/configuration/content/attempt was changed. WP-298 records the narrow corrective plan and remains unimplemented pending review/authorization. It is outside WP-290's implementation and audit scope.

Unrelated WP-284/WP-285/historical architecture planning edits remain preserved and excluded. Isolated audit checkout: C:\Users\cburk\.codex\worktrees\wp-290-audit\SequelCityWeb. Only WP-290 files and local validation logs are copied. The human authorized external audit via the reported -AllowExternalAudit invocation on 2026-10-15. AntiGravity ran in this isolated checkout; initial verdict FAIL identified one reload-selection race in the new browser test. Replaced the non-waiting visibility branch with an auto-waiting case selection click; post-audit disposable SQL/browser suite passed with exit 0 (outputs/wp290-post-audit-sql-browser.log), including the corrected browser proof and complete released-case regressions. Independent AntiGravity re-audit returned PASS after independently rerunning the disposable SQL/browser suite with exit 0. Final human acceptance remains pending. Initial report preserved in outputs/wp290-first-independent-audit.log.

## Audit Results

Verdict: PASS

Auditor: AntiGravity. External data sharing was authorized by the human's WP-290 -AllowExternalAudit invocation. Audited repository: C:\Users\cburk\.codex\worktrees\wp-290-audit\SequelCityWeb. The checkout contained only WP-290 changes; diffs, source, documentation and actual SQL/browser execution were reviewed. Initial FAIL and its scoped test correction are recorded in Code Results and outputs/wp290-first-independent-audit.log. Re-audit report follows; human acceptance remains pending.

I have launched the end-to-end disposable bootstrap suite with live SQL Server integration and browser testing (`scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_Audit_1 -RunBrowsers`) to independently verify the authored case progression, schema/catalogue isolation, and regressions. Awaiting completion.
### Audit Summary: WP-290 Case Authoring Proof & Legacy Retirement

**Verdict: PASS**
*(Final human acceptance remains pending)*

---

### Independent Verification & Evidence

#### 1. Authentic SQL Authoring & Shared Presentation Runtime
- **Authored in SQL**: The synthetic case [`case-008`](apps/api/src/services/fixtures/case-runtime-authoring.sql#L8-L32) ("Authored Incident Review") is authored purely via declarative SQL inserts into `app.CaseDefinition`, `app.CaseStep`, `app.CaseStepPrerequisite`, `app.CaseFactDefinition`, `app.CaseBriefingFact`, and `app.CaseStepFactBinding`.
- **Zero Frontend UI Mutation**: No new React components, routes, or case presentation modules were created. The existing generic [`StudentCaseEntryFlow`](apps/web/src/components/student/StudentCaseEntryFlow.tsx), `StudentQueryLab`, and `ProtectedCasePresentation` discover and render `case-008` dynamically from `/api/cases` SQL dossiers.
- **Handler Authority & Re-use**: Steps reuse existing registered backend handlers (`case004.crime-type`, `case004.report-inspection`, and `case004.report-isolation`). Canonical source checks, column validations, and provenance remain strictly enforced; synthesized/forged rows and unverified queries fail validation (HTTP 422).

#### 2. Falsification & Isolation Checks
- **Case-ID Independence**:
  - In [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts#L84-L291), collection count metadata and evidence logging dispatch were decoupled from `CaseId === "case-004"` to select registered handlers (`step.ValidatorKey.startsWith("case004.")`).
  - **Verifier Authority Preserved**: In [`caseAttemptService.ts`](apps/api/src/services/caseAttemptService.ts#L181), theory verification remains strictly gated (`before.caseId !== "case-004"` returns HTTP 422). Falsification attempt confirmed: submitting a theory for `case-008` is rejected with HTTP 422.
- **Catalogue & Release Isolation**:
  - `fixture-authoring-draft` and `fixture-authoring-retired` do not appear in `/api/cases` dossiers and attempt creation is rejected with HTTP 404.
  - Released records in `app.CaseDefinition` and `app.CaseStep` are immutable; direct DML updates to released steps throw via database trigger.
- **Saved-Version Compatibility**:
  - Attempt progress preserves custom notes and SQL drafts across `/archive` and `/resume` cycles without altering proved step evidence.
- **Future-Step Secrecy**:
  - Attempt snapshots redact future step keys, titles, objectives, guidance, hints, starter SQL, and validator parameters (`assert.doesNotMatch` passes). Browser guidance elements do not reveal subsequent steps until prerequisite completion.

#### 3. Production Seed & Live Database Protection
- **No Fixture in Production Seed**: `git status` confirms zero changes to `database/`. Repo-wide grep verifies `case-008`, `fixture-authoring-draft`, and `fixture-authoring-retired` exist only in disposable test fixtures, tests, and documentation.
- **No Live Database Alterations**: Direct inspection of the live SQL Server instance confirmed that `SequelCityCrimesDB` has no `case-008` or fixture rows. Schema `app` table `modify_date` timestamps remain unchanged from prior work packages (10/14/2026).
- **Disposable Safety Guards**: [`case-runtime-authoring.sql`](apps/api/src/services/fixtures/case-runtime-authoring.sql#L3-L4) explicitly throws if `DB_NAME() NOT LIKE 'SequelCityRuntimeTest[_]%'` or if the fixture already exists.

#### 4. Retained Admin/Recovery Imports & Pedagogical Tests
- **Admin Diagnostics & Local Recovery**:
  - [`AdminInvestigationDiagnostics`](apps/web/src/App.tsx#L491) is retained and consumes [`useStudentCaseState`](apps/web/src/useStudentCaseState.ts).
  - `studentCase.ts`, `studentCase001.ts`, `studentCase001Progress.ts`, and local-storage recovery remain intact.
  - Historical skeleton exports [`SkeletonPlayableStudentCaseModule`](apps/web/src/studentCaseModule.ts#L17) and [`CASE_001_PLAYABLE_SKELETON_MODULE`](apps/web/src/studentCaseModule.ts#L22) remain preserved for [`StudentPlayableCaseSkeletonView`](apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx).
- **Pedagogical Tests Retained**:
  - All 10 pedagogical author-vetting tests in [`caseAuthoring.test.ts`](apps/web/src/caseAuthoring.test.ts) pass.
  - Only the 5 obsolete compiled-registry assertions were retired from [`studentCaseModule.test.ts`](apps/web/src/studentCaseModule.test.ts); the remaining 4 skeleton/normalization tests continue to pass.
  - Full suite run: `vitest run` passes 225/225 tests across 23 test files.

#### 5. Bootstrap Consistency & Honest Limits
- **Flakiness Resolution**: The unawaited visibility branch in [`case-runtime-authoring.spec.ts`](apps/web/tests/browser/case-runtime-authoring.spec.ts#L22) was replaced with auto-waiting `page.getByRole("button", { name: "Authored Incident Review", exact: true }).click()`.
- **Live Bootstrap & Browser Proof Execution**:
  - Independent run: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_Audit_1 -RunBrowsers` exited 0.
  - Passed live repository tests, attempt service tests, Case 004 progression tests, API authoring tests, all 12 existing browser regression tests, and the new Playwright browser proof (`case-runtime-authoring.spec.ts:4:1` in 2.5s).
  - Disposable database and test logins were cleanly dropped in `finally`.
- **Honest Authoring Limits**: [`CASE-RUNTIME-AUTHORING-GUIDE.md`](docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md) documents exact database schemas, explicitly clarifies that multiple prerequisites represent `AND` joins rather than arbitrary `OR` branches, notes `ValidatorParametersJson` is `{}` only, and cautions that literal ID validation is bounded and does not substitute for human spoiler review.

#### 6. Scoped Diff & Simplicity
- `git diff --check` passes with no whitespace errors.
- Changes are strictly bounded to the allowed WP-290 surfaces (authoring documentation, decoupled collection/logging dispatch, disposable SQL fixture, test harness integration, and selective module retirement).
- No new runtime dependencies or architectural complexity added.

---

### Conclusion & Recommendation
All verification requirements are satisfied. Verdict is **PASS**. Final human acceptance remains pending.
root agent idle; waiting up to 30m0s for 1 background task(s)

## Final Decision

Accepted by the human on 2026-10-15 ("WP-290 accepted") after independent AntiGravity re-audit PASS and successful post-correction SQL/browser verification. All acceptance criteria are satisfied. Commit and push authorized by the human on 2026-10-15; finalization uses the project helper and publishes codex/wp-290-authoring-proof.
