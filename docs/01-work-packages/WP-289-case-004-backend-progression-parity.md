# WP-289: case 004 backend progression parity

## Objective

Deliver one student Query Lab component and one student SQL editor for every released case, populated exclusively by database-authored current-task data and backend-owned proof. Migrate the complete Case 004 path atomically onto that shared runtime; remove the parallel legacy student Query Lab.

## Scope

Revised 2026-10-13 following explicit human direction to consolidate the application structure. WP-288/WP-293/WP-294/WP-295 are accepted; current baseline 9b0c3662a97fb1c5b52171d0bb970d166f67145b. Source-trace all 16 Case 004 parity steps before implementation. No Case 004 cutover before every substep and shared-surface criterion passes. Implementation authorized 2026-10-14 and completed on codex/wp-289-single-query-lab; independent audit and human acceptance remain pending.

Contract: docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md. Baseline 9b0c3662a97fb1c5b52171d0bb970d166f67145b. This is a local deterministic runtime change; no accounts/cloud/CMS/runtime AI and no stack change. END-OF-DAY-HANDOFF is closeout-only. WP-286 may create downstream plans but does not implement their runtime scopes.

## Impact Analysis

### Understand Status

- Graph available: Yes, knowledge graph/fingerprints/metadata/inventory present.
- Accepted HEAD: 9b0c3662a97fb1c5b52171d0bb970d166f67145b. Graph baseline 492f1cf describes the accepted WP-295 working source; closeout-only drift is documentation/generated artifacts. Verify imports against source.
- Freshness assessment: usable for current application structure. App currently dispatches Case 001 to CurrentCaseTask and Case 004 to StudentWorkbenchView/QueryRunner; the new shared insertQueryAssist utility already eliminates text-insertion duplication, but not page/editor duplication. Backend dossiers are still hard-filtered to Case 001; validators only support three Case 001 steps. Source-traced Case 004 parity matrix contains 16 ordered query/log/verify obligations.
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
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- apps/api/src/services/databaseBootstrapService.ts
- apps/api/src/services/databaseBootstrapService.test.ts
- scripts/student-package/install-student-database.ps1
- scripts/student-package/start-student-package.ps1
- scripts/tests/test-student-launcher.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- apps/web/src/api/client.ts
- apps/web/src/api/types.ts
- apps/web/src/components/student/CurrentCaseTask.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/src/components/student/StudentCaseEntryFlow.tsx
- apps/web/src/components/student/StudentCaseLandingPage.tsx
- apps/web/src/components/student/studentCaseLibrary.ts
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/09-release-readiness/student-install-and-run-guide.md

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

### Required shared-surface contract

There is exactly one StudentQueryLab and one SQL editor used by all released student cases. Case selection changes the backend controller/case key, never the rendered component type. The existing App Case 001 ternary is removed at cutover. StudentWorkbenchView is removed from the student route; QueryRunner may remain an Admin-only tool, not a second student editor. Remove or redirect obsolete student exports/tests so the duplicate route cannot silently return.

The common component receives current task title/objective/direction/hint/starter, proved fact tokens, collection feedback, editor draft, query result, log/verify actions and save status through a case-neutral contract. It contains no case-id switch, frontend walkthrough, answer identifier or generated guidance. Existing protected presentation and insertQueryAssist are reused, not redesigned. Samuel's whole-case Briefing remains separate from current-task guidance.

The service discovers compatible released cases from app.CaseDefinition instead of a Case 001 allowlist. Database CaseStep/CaseStepPrerequisite records own sequence, content, completion mode and validator references. Step collections are backend-owned, stable-key deduplicated and persisted without falsely marking a partial step complete. Decide and document their minimal representation using existing durable evidence tables before editing SQL; add schema only if those tables cannot preserve required semantics. Client notes/drafts cannot complete steps.

Verification is one shared current-task action: the backend chooses the allowed suspect role from the eligible database-authored task and requires all earned prerequisites. No client-supplied role or correct-name flag creates proof. Frontend emits learner theory input and renders the verdict/snapshot.

### Briefing facts as query tokens (human amendment 2026-10-14)

City and Date already supplied in a case briefing must be clickable query tokens on the shared Query Lab, including the report-isolation hint. These are known case facts, not newly proved evidence. Store/read them as structured, typed database-authored case/version data; never extract them from narrative prose or hardcode Case 001/004 values in React.

The API must distinguish briefing facts from backend-proved facts. Known City/Date tokens are available before a report query or clue log, do not increment progress, and do not reveal unreached clues or answer identifiers. Render them with clear provenance (from the case briefing), alongside eligible proved tokens using the existing shared insertion function. Preserve drafts, cursor/selection, quote escaping, focus and semicolon handling. Date token formatting must match the queried public column's SQL representation (for example ReportDate integer YYYYMMDD), while human-readable display may use a normal date. Use validated typed values/bindings rather than arbitrary SQL fragments.

Include structured fact fields/data and any version/readiness changes in the shipped creation, seed, FK and additive-bootstrap coverage. Existing pinned attempts remain compatible with their content version; do not mutate immutable released content. Test Case 001 and Case 004 independently, including fresh entry, no proved facts, City/Date token clicks after AND, draft preservation and no progress advancement from clicks.

### Schema review amendment (human steering 2026-10-14)

Design for future complex cases without introducing a case scripting engine. The initial JSON-only partial-collection proposal is superseded before any database changes.

- Preserve immutable CaseDefinition/CaseStep versions and same-version prerequisite relationships. The existing prerequisite graph already supports parallel branches and AND joins; UI display order is presentation priority, not correctness. Alternative-path groups require separately scoped semantics and tests rather than pretending to support OR today.
- Add CaseFactDefinition, keyed by case/version/fact key, for authored label, public evidence column, validated value type and cardinality. No arbitrary SQL fragment fields.
- Add CaseBriefingFact, keyed by case/version/fact/item key, for typed known values and display text. Only explicitly public briefing facts may be exposed before proof. Same-version FK to CaseFactDefinition.
- Add CaseStepFactBinding, keyed by case/version/step/fact/use, for input/output fact references and allowed insertion operators. Optional same-version source step ties an input to its earned provenance. Backend validates source reachability. Narrative text is not parsed into facts.
- Add AttemptEvidenceItem, keyed by attempt/step/stable item key, with same-version step and attempt FKs, source ActionId ownership FK, validator version, bounded private proof and timestamp. It persists accepted observations independently of step completion. Witnesses, identities, profile categories and events use stable distinct keys. Duplicate observations do not increase counts.
- Retain AttemptStepEvidence exclusively for completed-step proof. Never count partial observations as completed milestones. Completion proof references the accepted action and records collection summary; accepted items remain independently inspectable and resumable.
- All authored additions are immutable after release and read-only to the repository role. Learner role cannot access app tables. All runtime mutations remain owner/revision checked and transactional. Explicit child-first deletion includes the new item records.
- Keep bounded JSON only for heterogeneous private evidence details, query candidates and learner workspace. Keys, versions, ownership, fact types, bindings and collection uniqueness are relational constraints, not JSON conventions.
- Publish new content versions rather than editing released Case 001. Old attempts retain their pinned content and behavior. Bootstrap upgrades are additive, backed up and transactional; fresh creation and FK scripts implement the same schema.

Required proof includes a synthetic branched AND graph, typed briefing fact validation, binding provenance validation, duplicate/partial collection resume, version preservation and checked foreign-key/permission tests. More complex cases can add authored steps/facts/bindings and registered validators without another Query Lab or a new progress representation. OR routes, optional tasks and non-suspect resolution types remain explicit future extensions.

### Implementation sequence

1. Trace and update the 16-step Case 004 parity matrix from source/fixtures; write backend query/log/verify and partial-collection acceptance tests first. Include forged projections/constants, wrong owners, stale revisions, incomplete/duplicate collections and evidence-link negatives.
2. Register narrow allowlisted Case 004 proof handlers using actual canonical evidence and the controlled verifier. Reuse existing SQL safety/repositories. Do not port SQL-string or notebook-prose correctness checks; equivalent safe queries must work.
3. Seed the complete Case 004 content/version/prerequisites in shipped creation/data/FK scripts. Include every required bootstrap/readiness/content-version change and truthful script version/update metadata. Prove fresh rebuild and additive upgrade in owned disposable databases, preserving existing public evidence and attempts. Do not destructively run base scripts against the live database.
4. Extract StudentQueryLab from the accepted presentation; route both migrated cases through the existing durable controller and that single component. Remove the legacy student editor route and competing instructional branches in the same atomic cutover. Import legacy notes/drafts as unverified data; never import their progress flags.
5. Run complete Case 004 playthrough through both suspect roles, restart/resume at every collection boundary, and Case 001 regression. Verify one component/one editor structurally and one rendered instance per case in a browser.
6. Independent audit and human visual/final acceptance before commit/push. No temporary duplicate UI or disabled Case 004 is shipped as completion of this package.

Simplicity decision: extend the existing runtime and accepted presentation; no new case framework, rule engine, alternative editor, dependencies or another UI restoration package. Formulaic authoring refinements beyond fields needed for this migration stay separate. The shortest complete route includes Case 004 backend parity because merely sharing JSX would leave case data/proof authority in frontend code.

## Acceptance Criteria

- [x] Every parity matrix row passes including both suspect roles and all mastermind substeps.
- [x] No SQL draft/normalization/notebook prose establishes correctness.
- [x] App routes every released student case through one StudentQueryLab and one editor; no Case 001/004 presentation branch remains.
- [x] Titles, directions, hints, starters and prerequisites load from the database; no frontend case teaching content populates the shared page.
- [x] Known City and Date values from the briefing are clickable, database-authored tokens before evidence is proved, with appropriate SQL formatting and explicit briefing provenance; clicks never establish proof.
- [x] Legacy student QueryRunner/StudentWorkbenchView route is retired; Admin tools remain separate and unchanged in purpose.
- [x] Creation/data/FK rebuild includes full Case 004 content; new version validity proven before release.
- [x] Case 001 regression, full API/web/browser suites, disposable rebuild and graph checks pass.

## Code Prompt

Implement this package only after its dependencies are accepted. Follow CASE-RUNTIME-CONTRACTS and this allowed list. Record exact changed files, validation commands/outcomes and limitations. Maintain authoritative base creation/data/FK coverage whenever schema/content changes. Refresh the graph, run readiness and prepare isolated audit context. Do not self-accept, commit or push.

## Audit Prompt

Independently audit changed files against package scope, SSOT and runtime contracts. Verify simplicity, evidence authority, all listed positive/negative validation and bootstrap coverage, draft ownership, Case 001 completion limits and Case 004 parity where applicable. Require actual SQL-access evidence for database packages; mocked checks are insufficient. Confirm no future-step/answer leakage and no live destructive actions. Report Verdict: PASS or FAIL with evidence, or BLOCKED for missing environment/authorization; leave human acceptance pending.

## Code Results

Implemented 2026-10-14 on `codex/wp-289-single-query-lab`, based on `9b0c3662a97fb1c5b52171d0bb970d166f67145b`. No commit/push or human acceptance performed. Checkbox completion above records local implementation/validation, not independent acceptance.

- One StudentQueryLab and ProtectedCaseQueryEditor serve released student cases. App's case-specific presentation branch and student progression-hook wiring are removed. StudentWorkbenchView is deleted; QueryRunner and legacy thread diagnostics remain Admin-only. The library reads released dossiers and can open another released case without a frontend case module. Original mentor portrait, detective scenes, reference drawer, notebook and progress presentation are retained.
- Full database-authored Case 004 path: all sixteen query/log/verify steps, prerequisites, guidance, hints and broad starters. Canonical evidence checks, distinct partial collections, duplicate suppression, both controlled verification roles and wealth/identity linkage are backend-owned. Step keys are independent from handler keys. Workspace notes/legacy flags never establish proof.
- Schema extension: CaseFactDefinition, CaseBriefingFact, CaseStepFactBinding and AttemptEvidenceItem; checked same-version and owned-action relationships, immutable released authoring, typed known values and prerequisite-bound output/input definitions. AttemptStepEvidence retains completed-step semantics. Partial items do not complete prerequisites. Typed output validation rejects handler/authoring mismatches.
- Draft entry is nullable during assembly; CK_Definition_ReleasedEntry and the existing checked entry FK require a real entry before release. This resolves the circular additive-publish dependency without disabling constraints. Case 001 v1 remains immutable; fresh attempts use v2, including typed briefing tokens and starter SQL without terminators. Case 004 v1 is a full-resolution release.
- City/date briefing tokens are available before proof in Case Facts. Briefing query tokens are visible from the first task before any query, independent of task input bindings. Earned query helpers remain bound to the current task, with explicit provenance; explanatory hints remain collapsible. Earned query tokens use authored columns/types/operators; theory choices come from bound proved identities. Shared insertion preserves drafts, caret and terminators. Slow summary discovery does not hide an available dossier or permit premature implicit fresh entry; late open responses cannot enter an old selection.
- Authoritative creation/data/FK scripts and additive installer agree on case-runtime-v2. Script headers are version 2.2, updated 2026-10-14. Intact v1 upgrades retain a verified COPY_ONLY/CHECKSUM backup and apply the extension transactionally. Interrupted installs roll back; partial/unknown schemas stop. Existing public evidence and saved work are preserved. Following the previously authorized backed-up setup, the local SequelCityCrimesDB was additively upgraded on 2026-10-14; its verified backup was retained and existing evidence and pinned attempts were preserved.
- Rebuild exposed two outdated DriversLicense seed records. Read-only comparison with the accepted live database confirmed the red-haired female BMW M8 records (66/67 inches); only the fresh seed was synchronized. Added Case 004 evidence readiness manifest so inconsistent installations cannot advertise an unsolvable released path.

Validation:

- Failed safe queries now use exposed schema metadata to explain briefing-column/table mismatches and the current database-authored starter table. Other failures point to Case File Ã¢â€ â€™ Quick Table Clues. Failed drafts and proof are unchanged; unsafe-query messages remain intact. The reported CrimeType/ReportCity/ReportDate mismatch is covered by a passing regression test.

- Starter replacement now uses inline Undo instead of a blocking popup; Undo applies only to the unchanged replacement draft and original attempt. Older saved content versions display a generic notice directing students to Start Fresh for updated guidance/tokens, while preserving their pinned proof. Local read-only verification found Case 001 v1 has no authored briefing facts and v2 has both City/Date facts; no existing attempt was changed. Targeted tests and web TypeScript build passed.

- Preview correction: stopped the identified WP-295 worktree preview and old cached API, then launched the primary WP-289 checkout through the student launcher. /api/health/full reports ready. Targeted shared Query Lab tests: 21 passed, including visible City/Date helper tokens with Hint collapsed for both cases. Windows PowerShell setup failed its SQL connection; PowerShell 7 setup succeeded.

- `npm run build`: PASS. Generated tracked API dist output restored; source changes only.
- `npm run build --workspace apps/web`: PASS.
- `npm test --workspace apps/api`: PASS, including authoring, runtime routes, repositories, existing Case 001 and new Case 004 checks.
- `npx vitest run --root apps/web`: 220 tests passed in 23 files. Obsolete App/Playwright simulations of the retired student editor were replaced with shared-runtime routing, original presentation, setup/Admin separation, draft preservation and failure tests. Existing controller/presentation/insertion suites remain; real SQL tests replace frontend milestone-flag assertions.
- `scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP289_20261014_ReleaseCheck -RunBrowsers`: PASS; authoritative rebuild, actual role/metadata/immutable-content checks, Case 001 regression, full Case 004 path and 10 selected browser tests. Desktop/mobile presentation reviewed; prominent Samuel and notebook/progress preserved.
- `scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP289_20261014_EvidenceFinal`: PASS; equivalent aliased SQL, forged constants/projections, wrong owners, stale evidence logs, wrong verification roles, expired candidates, distinct collection reload/duplicates and same-owner cross-case action isolation. A new service/repository instance reloads each collection boundary.
- `scripts/tests/test-student-launcher.ps1 -SqlIntegration`: PASS with final schema/content; fresh/repeat/legacy installation, verified backups, actual bounded credentials, interruption rollback, additive v1 upgrade, original pinned content/workspace/public evidence preservation and partial/unknown/corrupt rejection.
- Synthetic branched AND graph, typed fact/cardinality and binding provenance validation: PASS. Alternative-path OR/optional-task semantics remain explicit future extensions; no rule engine or extra dependencies added.
- Understand preflight and refresh: PASS; all four allowed artifacts refreshed from the implementation working tree at the baseline commit. Final refresh and scope/diff checks are recorded with this package.

Developer-only local validation logs are retained under `.git/wp289-*.log`; generated browser captures are under `apps/web/test-results/`. They contain no exported owner capabilities/configuration secrets and are not staged. Independent audit results remain pending; this local review is not an AntiGravity audit. END-OF-DAY-HANDOFF remains closeout-only.

### Post-audit corrections â€” 2026-10-14

The independent FAIL identified two stale browser expectations after the authorized starter-popup removal. Updated outlier-user-path.spec.ts to assert immediate starter replacement, visible Undo, and restored custom draft. Removed the dangling starter dialog listener from case-001-live-smoke.spec.ts; Start Fresh retains its own dialog handling.

Revalidation: `pwsh -NoProfile -File scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP289_Reaudit_20261014 -RunBrowsers` exited 0: all 10 browser tests passed, actual SQL security/repository checks passed, and the full Case 004 sixteen-step path passed. Disposable database cleanup completed. Log: `.git/wp289-post-audit-browser.log`. These are local corrective results; the independent FAIL below remains unchanged pending re-audit. WP-296 remains preserved in `.git/wp-planning-hold/` to keep audit isolation.

## Audit Results

### Independent Audit Report: WP-289 Case 004 Backend Progression Parity

**Verdict: PASS**
**Human Acceptance Status: PENDING**

---

### 1. Executive Summary

An independent audit was performed on branch `codex/wp-289-single-query-lab` against package scope, SSOT documents, and runtime contracts defined in [WP-289-case-004-backend-progression-parity.md](docs/01-work-packages/WP-289-case-004-backend-progression-parity.md), [CASE-RUNTIME-CONTRACTS.md](docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md), [SSOT-Case-Progression.md](docs/00-ssot/SSOT-Case-Progression.md), and [SSOT-Investigation-State-Architecture.md](docs/00-ssot/SSOT-Investigation-State-Architecture.md).

All changed files were verified against allowed boundaries, simplicity guidelines, evidence authority rules, draft ownership contracts, Case 001 completion limits, and full Case 004 16-step parity. Full verification was conducted using actual local SQL Server 2022 access; mocked evaluations were rejected.

---

### 2. Package Scope & Worktree Isolation Check

- **Scope Compliance**: Exactly 45 files are modified, untracked, or deleted across the working tree. Programmatic verification against the allowed list in [WP-289](docs/01-work-packages/WP-289-case-004-backend-progression-parity.md#L42-L111) confirmed **0 out-of-scope files** (100% allowed).
- **Prohibited Modifications**: Verified `database/migrations/**` was unmodified.
- **Worktree Cleanliness**: Previous script-runner blocks resulting from transient `apps/api/dist/` build artifacts have been eliminated; tracked dist outputs remain restored and clean in git status.

---

### 3. Architecture, Simplicity & Runtime Contracts

- **Single Query Lab Component**: All released student cases are served exclusively by [`StudentQueryLab`](apps/web/src/components/student/StudentQueryLab.tsx) and [`ProtectedCaseQueryEditor`](apps/web/src/components/student/ProtectedCasePresentation.tsx).
- **Retirement of Legacy Surfaces**: [`StudentWorkbenchView.tsx`](apps/web/src/components/student/StudentWorkbenchView.tsx) is permanently deleted. The legacy `App.tsx` case-routing ternary has been removed.
- **Admin Segregation**: Developer and admin tools ([`QueryRunner`](apps/web/src/components/QueryRunner.tsx) and [`DeveloperInvestigationThreadsPanel`](apps/web/src/components/DeveloperInvestigationThreadsPanel.tsx)) are encapsulated in `AdminInvestigationDiagnostics` for developer mode only and cannot leak into the student surface.
- **Simplicity Compliance**: Zero new npm dependencies were added to [`apps/api/package.json`](apps/api/package.json) or `apps/web/package.json`. No generic rule/scripting engine was introduced; step handlers in [`case004ProgressionService.ts`](apps/api/src/services/case004ProgressionService.ts) use explicit, typed validation for canonical database evidence.

---

### 4. Evidence Authority & Draft Ownership

- **Backend Proof Ownership**: All progress milestone evaluations are executed by the backend repository and validation services ([`CaseAttemptService`](apps/api/src/services/caseAttemptService.ts)).
- **Relational Schema Structure**:
  - `app.CaseFactDefinition`: Stores typed fact definitions (`text`, `integer`, `decimal`, `date`) and public evidence column bindings.
  - `app.CaseBriefingFact`: Stores public known briefing facts with typed constraints and display values.
  - `app.CaseStepFactBinding`: Controls input/output bindings, requiring prerequisite reachability.
  - `app.AttemptEvidenceItem`: Persists distinct accepted observations per attempt/step/item without falsely completing milestones.
  - `app.AttemptStepEvidence`: Reserved strictly for completed-step milestone proof.
- **Draft & Workspace Integrity**: [`validateWorkspace`](apps/api/src/services/caseAttemptService.ts#L15-L19) rejects client attempts to supply completion flags or unauthorized properties, strictly enforcing payload limits (draft &le; 32 KiB, total workspace &le; 256 KiB).
- **Draft Assembly Contract**: Draft case versions allow `EntryStepKey` to be nullable during step assembly, with constraint `CK_Definition_ReleasedEntry` enforcing a non-null entry before release.
- **Owner Security**: Enforced using 32-byte cryptographically random capability hashes in `app.LocalLearner`, HttpOnly Strict cookies, constant-time HMAC-SHA256 CSRF verification, and exact trusted origin matching.

---

### 5. Case 001 Completion Limits & Backward Compatibility

- **Bounded Scope**: Case 001 definition retains `completionScope: "evidence-review"` with exactly 3 ordered query steps (`crime-type`, `report`, `interviews`).
- **Culprit Boundary**: Suspect verification is blocked for Case 001 attempts; when all 3 review tasks are proven, `task` becomes `null` and displays the completion notice stating culprit verification belongs to a later release.
- **Version Immortality**: Case 001 v1 remains immutable for existing saved attempts. New attempts use v2 with structured briefing tokens and non-terminated starters.

---

### 6. Case 004 Parity Verification

All 16 steps from [CASE-004-RUNTIME-PARITY-MATRIX.md](docs/15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md) were verified:
1. `crime-type`: Logging of Murder CrimeID (1080).
2. `report-inspection`: Query of CrimeSceneReport columns.
3. `report-isolation`: Logging of isolated target report (10975) using briefing city and date.
4. `witness-observations`: Logging of 2 distinct witness bundles from report-linked interview logs; confession text deferred.
5. `witness-identities`: Logging of both witness names from PersonsOfInterest.
6. `gym-lead`: Identification of gold membership starting with `48Z` and linked suspect PersonID (67318).
7. `suspect-identity`: Suspect identity resolution.
8. `suspect-confession`: Direct hit confession log.
9. `murderer-verification`: Controlled verifier confirms trigger-man role (`Jeremy Bowers`).
10. `mastermind-profile`: Logging 10 distinct clue categories from killer's interviews.
11. `mastermind-candidates`: Shortlisting 2 female BMW M8 drivers (height 65-67 in). Seed synchronizations for `DriversLicense` verified against live data.
12. `mastermind-identities`: Resolving candidate identities, licenses, and SSNs.
13. `symphony-events`: Logging 3 December Symphony events.
14. `attendance-comparison`: Validating candidate cross-attendance across all 3 events.
15. `employment-comparison`: Wealth clue tie-break via annual income comparison.
16. `mastermind-verification`: Controlled verifier confirms mastermind role (`Miranda Priestly`), completing the case (`completionScope: "full-resolution"`).

---

### 7. Non-Leakage & Safety Controls

- **No Future-Step/Answer Leakage**: Snapshot responses only project completed steps and the immediate eligible current task. All future directions, hints, starters, and validator parameters remain withheld on the server.
- **Briefing Facts**: Public City and Date briefing tokens are exposed prior to queries, with clear provenance ("From your case briefing"). Clicking tokens never creates proof or advances progress.
- **Non-Destructive Actions**: Database scripts refuse destructive drops on existing databases. Additive upgrades in [`install-student-database.ps1`](scripts/student-package/install-student-database.ps1) take a verified `COPY_ONLY/CHECKSUM` backup and execute within an atomic transaction.

---

### 8. Empirical Test Execution & Actual SQL Access Evidence

All verification was executed against Microsoft SQL Server 2022 (Developer Edition) on `localhost:1433`:

| Test Suite / Script | Target & Mode | Result | Notes |
|---|---|---|---|
| `npm test --workspace api` | Node test runner (unit & integration) | **PASS** | 23 test suites passed. |
| `npx vitest run --root apps/web` | Vitest (browser & component units) | **PASS** | 223 tests passed in 23 files. |
| `npm run build` | Full workspace build | **PASS** | API TypeScript & Web Vite bundles built cleanly. |
| `test-case-runtime-bootstrap.ps1` | Real SQL disposable DB (`SequelCityRuntimeTest_Audit_20261014`) | **PASS** | Authoritative creation, data, FKs, account provisioning, learner permission denial (tables, views, synonyms, CTEs, catalogs), and full Case 004 16-step integration pass. |
| `test-student-launcher.ps1 -SqlIntegration` | Real SQL integration testing | **PASS** | Fresh install, legacy upgrade, retained verified backups, v1 extension upgrade, interruption rollback, and corrupt state rejection passed. |
| `test-case-runtime-bootstrap.ps1 -RunBrowsers` | Real SQL disposable DB (`SequelCityRuntimeTest_Browser_20261014`) + Playwright | **PASS** | All 10 browser integration tests passed in 27.7s across desktop and mobile viewports. |

---

### Audit Conclusion

The implementation satisfies all architectural, security, and teaching parity obligations of WP-289 without regression or leakage.

**Verdict: PASS**
*Human acceptance remains pending.*

## Final Decision

Accepted by the human developer on 2026-10-14 after the independent AntiGravity re-audit PASS. Closeout, commit and push explicitly authorized.

Draft assembly contract: EntryStepKey may be NULL while an unpublished draft's steps are assembled. A checked CK_Definition_ReleasedEntry requires an entry before ReleaseStatus becomes released; the existing same-version FK validates that entry. This removes the circular insert dependency for additive publishing without disabling constraints. Released rows remain immutable, and old attempts keep their original entry.
