# WP-288: case 001 durable attempts and shared query lab

## Objective

Deliver the complete Case 001 durable-attempt vertical slice and one reusable Query Lab consuming the backend current-task contract.

## Scope

Requires independently audited and human-accepted WP-287. Supersedes WP-284 UI implementation scope; Case 004 retains its legacy adapter until WP-289.

Contract: docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md. Implementation baseline 7229921 (accepted, independently audited WP-287). This is a local deterministic runtime change; no accounts/cloud/CMS/runtime AI and no stack change. END-OF-DAY-HANDOFF is closeout-only. WP-287 was accepted and pushed as 7229921; this package does not implement WP-289/WP-290 scope.

## Impact Analysis

### Understand Status

- Graph available: Yes, knowledge graph/fingerprints/metadata/inventory present.
- Baseline commit: 7229921790889fd51ce5097f12521a9d46362f7f (accepted WP-287).
- Freshness assessment: WP-287 graph records its pre-closeout 326c276 metadata baseline but fingerprints include the accepted protected foundation. Verified current source at 7229921; WP-288 changes require regeneration before audit.
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
- apps/api/src/services/caseVerificationService.ts
- apps/api/src/types/mssql.d.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- scripts/tests/test-case-runtime-bootstrap.ps1
- docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md
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
- docs/00-ssot/SSOT-Database-Schema.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
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

### Pre-implementation scope refinement

Durable idempotency for fresh/workspace/resume/archive/delete needs an owner request ledger surviving attempt deletion. Include its authoritative table/FK/grants and readiness coverage; extend the existing disposable harness for real API and browser tests. Add the bootstrap runbook for stable session secret/origin configuration. The unchanged verifier module cast needs an explicit unknown bridge after the declaration gains transaction exports; no verification behavior changes. The local mssql declaration also needs its existing transaction/request API typed before use. Include Database Schema and Case Progression SSOT plus the accepted runtime contract to document the ledger and actual Case 001 authority consistently before their updates. These integration files are listed above before implementation; no additional dependency or live rebuild is authorized.

## Required Behavior

- Implement owner cookie/trusted CORS/CSRF and strict route schemas; document session secret configuration without shipping a default secret.
- Implement transactional attempts, actions, ordered Case 001 proofs, workspace bounds, ownership/version checks, idempotency and revision races.
- Build generic current-task UI and typed client; separate whole-case dossier from task guidance and offered starter from retained draft.
- Fresh preserves old attempt; resume visibly shows saved progress. Preserve legacy backups and import only notes/draft or safely revalidated references.
- Run fresh CrimeType -> narrowed report -> linked interviews -> released-review browser path, multi-row refinement, owner/CSRF/replay/stale/version failures and draft edit races. Verify Case 004 legacy regression.

Simplicity check: reuse existing SQL safety, result normalization, verifier and native disclosure controls; use one current-task contract and one bounded workspace. Backend validator code is justified for real evidence semantics; do not create a generic scripting language. Database protection and reference playthroughs are mandatory even if they increase implementation size.

## Acceptance Criteria

- [x] Fresh Case 001 starts at CrimeType with no claim that rows were found.
- [x] One direction and collapsed hint align with task/start SQL; no automatic custom draft replacement.
- [x] Reload/restart resumes database-owned progress; fresh archives/resumes previous attempt with saved summary.
- [x] Untrusted flags/rows, wrong owners, future steps, stale requests and mismatched versions cannot advance.
- [x] Full API/web tests/build, live Case 001 smoke, legacy Case 004 smoke and graph checks pass.

## Code Prompt

Implement this package only after its dependencies are accepted. Follow CASE-RUNTIME-CONTRACTS and this allowed list. Record exact changed files, validation commands/outcomes and limitations. Maintain authoritative base creation/data/FK coverage whenever schema/content changes. Refresh the graph, run readiness and prepare isolated audit context. Do not self-accept, commit or push.

## Audit Prompt

Independently audit changed files against package scope, SSOT and runtime contracts. Verify simplicity, evidence authority, all listed positive/negative validation and bootstrap coverage, draft ownership, Case 001 completion limits and Case 004 parity where applicable. Require actual SQL-access evidence for database packages; mocked checks are insufficient. Confirm no future-step/answer leakage and no live destructive actions. Report Verdict: PASS or FAIL with evidence, or BLOCKED for missing environment/authorization; leave human acceptance pending.

## Code Results

Implemented the Case 001 durable vertical slice and shared current-task surface:

- Strict protected runtime routes for session, dossiers, owned attempt summaries/snapshots, fresh/resume/archive/delete, query, notebook logging and bounded workspace. Case 001 culprit verification explicitly remains unreleased.
- Random opaque HttpOnly/SameSite owner capability, stored SHA-256 hash, stable configured HMAC CSRF, exact credentialed CORS and loopback HTTP constraints. Session issuance requires trusted Origin even with query parameters; capabilities/secrets are not returned in JSON or logged.
- Owner-serialized SQL transactions, immutable pinned content/evidence, revision conflicts with latest snapshot, canonical request digests and durable idempotency including deletion. Atomic snapshot reads avoid torn progress/revisions. SQL executes before transaction locks; returned rows remain available when saving fails or races.
- Ordered query-mode CrimeType -> one clocktower report -> same-report interviews, reusing the existing result patterns and additionally comparing candidate identifiers/fields with canonical public evidence through the learner pool. No frontend completion flags, literal lookalikes or forged report identifiers establish proof.
- Bounded action/proof candidates, expiry and request-owned notebook row references. Notes/drafts/imports never advance steps. Fresh retains prior attempts; summaries show saved progress and compatibility. The extended base schema owns app.LearnerRequest and its checked FK/grants; explicit readiness now requires nine tables, 65 columns, twelve checked FKs and bounded writer grants. Existing authoritative versioned seed remains unchanged; no hidden data load or story migration.
- Reusable CurrentCaseTask/useCaseAttempt client renders the whole-case dossier separately from one current Samuel direction and collapsed hint. Starters are explicit; custom drafts persist on task changes/reload. Local edit generation, active case/attempt/version checks and serialized mutations protect typing from late responses. Case File shows backend-proved facts; schema tools and result/notebook logging remain available.
- Case 001 registration now identifies the durable backend adapter. Historical frontend skeleton exports/legacy localStorage remain for backup compatibility; import/export accepts only notes/draft. Case 004 keeps its existing adapter and controlled verifier.
- Reconciled architecture/state/UI/database/progression SSOT and runtime/runbook contracts. Bootstrap harness chooses isolated ports and cleans only owned disposable resources. Browser helpers now target configured ports, open the actual application menu and await each new query response.

Validation evidence:

- PASS: npm run build --workspace api and npm run build --workspace web.
- PASS: npm run test --workspace api (22 files; ownership/origin/CSRF/strict schema, workspace bounds, established safety/bootstrap/identity/authoring/repository regressions).
- PASS: npm run test --workspace web (21 files, 238 tests), plus focused late-save/selection/surface/module checks after final refinements.
- PASS: scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_d36416074b25445192cae25d6e9147d2 -RunBrowsers. Local SQL Server, all three authoritative scripts, both bounded provisioning paths and actual learner/repository login negatives passed. API port 49928 and web port 49722 were isolated from existing dev servers.
- PASS: actual SQL ordered flow, multi-row refinement, quoted identifiers/result aliases, canonical forged-ID rejection, version mismatch, wrong owner, duplicate payload/replay, competing revision writes, saved draft/notes, fresh/resume retention and idempotent owned deletion; actual API origin/CSRF/authority-field/stale failures.
- PASS: browser Case 001 fresh -> CrimeType -> refine report -> linked interviews -> released review, notebook logging, retained custom draft/reload, fresh preservation and unchanged legacy backups. Actual Case 004 browser evidence path through controlled first-suspect verification passed. Mocked Case 004 UI suite includes the mastermind endgame regression.
- Browser result: 12 passed, 1 existing deliberately skipped invalid legacy mastermind walkthrough; not a skipped required live check.
- PASS: visual inspection of the actual first Query Lab screenshot, confirming one warm direction, collapsed hint, offered CrimeType starter and empty learner-owned draft; adjusted controls to existing noir styling.
- PASS: graph refresh covering all 698 current source/documentation files, readiness READY; closeout preflight ReadyForAudit with no findings or out-of-scope changes.
- Generated tracked API dist output restored to the clean implementation baseline after build. Ignored validation logs/screenshots are development artifacts, not package contents.

Scope refinements were recorded before edits: owner ledger readiness/harness/runbook, local mssql transaction declarations and unchanged verifier cast, and governing SSOT/runtime contract reconciliation. No dependencies, runtime AI, cloud services, automatic story migrations or live database rebuild were added. Local deployment needs the updated authoritative bootstrap, bounded accounts and stable session secret/origin configuration from CASE-RUNTIME-BOOTSTRAP-RUNBOOK. Independent audit and human acceptance remain pending; do not switch Case 004 until WP-289.

User-requested bootstrap header correction: all three authoritative SQL scripts now identify bootstrap script version 2.0 and last updated 2026-10-08, with a summary of the repository/content/attempt changes. Script release metadata is distinct from installed database readiness; no live database was modified. Verified matching headers in all three scripts; SQL executable content was unchanged by this correction.

## Audit Results

### Independent Work Package Audit: WP-288

**Target**: [WP-288: Case 001 Durable Attempts and Shared Query Lab](docs/01-work-packages/WP-288-case-001-durable-attempts-and-shared-query-lab.md)
**Auditor**: AntiGravity (Independent Audit)
**Verdict**: **PASS**
**Human Acceptance**: **PENDING** (Awaiting user decision)

---

### 1. Audit Evaluation & Verification

### Package Scope & Worktree Isolation
- **46 files changed / created**: Every dirty and untracked file is strictly enumerated in the `Files Allowed to Change` list of [WP-288](docs/01-work-packages/WP-288-case-001-durable-attempts-and-shared-query-lab.md#L40-L105).
- Zero out-of-scope files detected (`scripts/work-package/get-work-package-status.ps1` confirms `Out-of-scope dirty files: none`).
- Prohibited patterns (`database/migrations/**`) remain untouched.
- No unapproved external libraries or dependencies were added (`apps/api/package.json` diff contains only test runner scripts).

### SSOT & Runtime Contracts
- SSOT documentation cleanly updated and aligned:
  - [SSOT-Architecture.md](docs/00-ssot/SSOT-Architecture.md)
  - [SSOT-Case-Progression.md](docs/00-ssot/SSOT-Case-Progression.md)
  - [SSOT-Database-Schema.md](docs/00-ssot/SSOT-Database-Schema.md)
  - [SSOT-Investigation-State-Architecture.md](docs/00-ssot/SSOT-Investigation-State-Architecture.md)
  - [SSOT-UI-UX-Experience.md](docs/00-ssot/SSOT-UI-UX-Experience.md)
  - [CASE-RUNTIME-CONTRACTS.md](docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md)
  - [CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md](docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md)
- Schema definitions accurately reflect the new `app.LearnerRequest` table, 12 checked foreign keys, 65 columns across 9 app tables, and explicit permissions for `sequel_learner` and `sequel_repository`.
- Pinned content and evidence versions (`case-001`, `sequel-evidence-v1`) are enforced at the database and repository layers.

### Simplicity & Design
- No generic scripting engines, dynamic evaluators, or CMS layers introduced.
- Clean and focused services:
  - [`CaseAttemptService`](apps/api/src/services/caseAttemptService.ts) for lifecycle, queries, and evidence proofs.
  - [`LocalLearnerService`](apps/api/src/services/localLearnerService.ts) for session, origin, cookie, and CSRF token handling.
  - [`CaseRuntimeRepository`](apps/api/src/repositories/caseRuntimeRepository.ts) for parameterized SQL transactions.
- Unified frontend presentation in [`CurrentCaseTask`](apps/web/src/components/student/CurrentCaseTask.tsx) driven by [`useCaseAttempt`](apps/web/src/useCaseAttempt.ts).

### Evidence Authority & Anti-Leakage
- Progress advancement is governed solely by [`readCase001ProofRows`](apps/api/src/services/queryExecutionService.ts#L163) checking executed candidates against canonical `dbo` rows via the learner connection pool.
- Rejection of forged report IDs, literal lookalikes, out-of-order queries, and unauthorized table queries is verified.
- Client notes, drafts, and legacy `localStorage` imports cannot mark tasks complete.
- Responses from `/api/cases`, `/api/cases/:caseId/attempts`, and `/api/attempts/:attemptId` return only the active task and proven facts; answer keys and future steps remain completely unexposed.

### Draft Ownership & Case 001 Completion Limits
- Draft SQL is saved per-attempt in `app.AttemptWorkspace` and preserved across navigation, view switches, and reloads. Offered task starter SQL does not overwrite custom drafts without explicit user confirmation.
- Attempt deletion retains the owner request ledger in `app.LearnerRequest` for idempotency.
- Case 001 strictly completes after 3 verified evidence steps (`crime-type`, `clocktower-report`, `interviews`). Suspect verification endpoint `/api/attempts/:attemptId/verify` returns HTTP 422: `"Culprit verification is not released for this case. Complete the available evidence review."`

### Case 004 Parity
- Case 004 remains registered on its legacy adapter ([`CASE_004_PLAYABLE_MODULE`](apps/web/src/studentCaseModule.ts#L162)) pending WP-289.
- Controlled first-suspect verification via `/api/case/verify-suspect` remains intact and passes live smoke tests.

---

### 2. Validation & Live SQL Execution Evidence

| Validation Suite | Scope / Command | Result | Details |
|---|---|---|---|
| **API Unit Tests** | `npm run test --workspace api` | **PASS** | 22 test files passed. Ownership, origins, CSRF, strict schemas, bounds, and repositories verified. |
| **Web Unit Tests** | `npm run test --workspace web` | **PASS** | 21 test files, 238 unit tests passed. |
| **Web Build** | `npm run build --workspace web` | **PASS** | Production client bundle built in 291ms. |
| **SQL Server Bootstrap & Isolation** | `scripts/tests/test-case-runtime-bootstrap.ps1` | **PASS** | Executed on local SQL Server 2022 instance against disposable target `SequelCityRuntimeTest_<guid>`. All 3 base SQL scripts passed; dual provisioning paths, role bounds, CTE/join/view leaks, immutable triggers, and manifest checks passed. |
| **Live Database Integration** | `caseRuntimeRepository.test.ts` & `caseAttemptService.test.ts` | **PASS** | Live SQL transactions, multi-row refinement, retry/delete replay, owner isolation, concurrent revision updates, and stale request boundaries passed. |
| **Live Browser Tests (Playwright)** | `case-001-live-smoke.spec.ts` & `student-mode.spec.ts` | **PASS** | 12 passed, 1 legacy skipped. Case 001 durable ordered flow, notebook logging, draft retention, and fresh restart verified in real browser. Case 004 suspect verification confirmed. |
| **Safety Check** | Live DB Destructive Actions | **PASS** | Zero destructive actions against live database; disposable test databases were cleaned up atomically. |
| **Knowledge Graph** | `scripts/understand/check-understand-refresh-readiness.ps1` | **PASS** | 698 files scanned, graph refreshed and `READY`. |
| **Closeout Preflight** | `scripts/work-package/check-work-package-closeout.ps1` | **PASS** | Status: `ReadyForAcceptance`, 0 findings. |

---

### 3. Final Conclusion & Next Action

- **Verdict**: **PASS**
- **Audit Findings**: Zero blockers.
- **Next Action**: Work package is ready for final human acceptance or closeout commit by the repository maintainer.

## Final Decision

Accepted by the human on 2026-10-08 after independent AntiGravity re-audit PASS with zero findings. Authorized closeout, commit and push. Live database installation remains a separate authorization; no existing database was rebuilt.
