# Case 001 full-resolution runtime

## Objective

Deliver the complete six-phase Clocktower Poisoning investigation specified in Case-001-Reverse-Clue-Chain.md, with natural authored evidence, a canonical identity proof and one controlled culprit verification, while preserving Case 004 and explicit old-dataset compatibility.

## Scope

Implementation sequencing was requested by the human on 2026-10-15 after WP-290. WP-290 is now fast-forward merged and pushed to origin/main at 322e5e0. Work branch: codex/case-001-complete-mystery. WP-299 remains the authoring design record; this package is the runtime implementation scope, not an expansion of its documentation-only permission.

Product decision updated on 2026-10-16: Case 001 remains Tier 1. The human explicitly rejected a hard five-step count and requested Les's statement. Six natural phases use separate basic SELECT/WHERE queries across four public tables, three people and three narrative evidence records. No required joins/aggregation, padding, red herrings or unresolved contradictions are added.

In scope: new immutable Case 001 v3 content, one canonical incident report, a steward account and a suspect statement, earned name facts and proof, restricted single-culprit verification, bounded role/type/API integration into the shared UI, case-specific evidence compatibility and supported launcher readiness, appropriate classification/contract documentation and real regression coverage. Preserve existing shared presentation and the React/Vite/TypeScript + Fastify + SQL Server stack.

Out of scope: live database rebuilding or story updates, automatic upgrades of old proof, changing Case 004 rows or outcomes, generic validator engines, AI, dependencies, redesigning the UI, arbitrary case verification and WP-298 implementation. No external audit sharing authorization is inferred from the earlier WP-290 audit. Final acceptance is human-only.

## Impact Analysis

### Understand Status

Required analysis for authored progression, public evidence, private answers, saved attempts and shared verification. Four graph artifacts exist; metadata names f79c3c5, but they were generated from the accepted WP-290 working snapshot. Current baseline is 322e5e0. Classify metadata as behind the commit and verify all critical relationships in source; do not claim current metadata proves the new architecture. Targeted graph inspection in WP-299 located case001ResultPatternService and caseAttemptService nodes/containment. This package owns regeneration after implementation.

Source inspection confirms: caseContentValidationService enforces exactly the old three Case 001 handlers and evidence-review scope; caseAttemptService.verify rejects cases other than Case 004; caseVerification types and SQL answer handling use trigger_man/mastermind; current Case 001 transcript checks require old token groups; snapshot facts, canonical-source checks and actual SQL actions provide the protected integration points. EventRegistration is not an access log. The read-only proposed person predicate resolves one existing person.

### Affected Architecture

Authoritative public seed and install manifests; app.CaseDefinition/steps/facts; case-content validation; repository/attempt proof and verify transaction; private answer roles; shared client result types and theory surface; dataset/readiness/installer recognition; tests and active case-authoring/classification contracts. No new stack or package adoption.

### Regression Surface

Old supported Case 001 v1/v2 on legacy evidence fixtures; new v3 on the new fixture; Case 004 v1/v2 full sixteen-step paths and both verification roles; WP-290 case-008 proof; old/current/unsupported dataset recognition; actual bounded logins; released immutability; read-only public evidence permissions; owner/CSRF/revision/idempotency; save/reload/resume and premature verification negatives.

### Graph Update Decision

Regenerate all four allowed artifacts after code/docs/tests stabilize. Run check-understand-refresh-readiness and diff checks. Include graph outputs in this package, not a later refresh WP.

## Files Allowed to Change

Allowed:
- apps/web/src/components/student/studentCaseLibrary.ts
- apps/web/src/components/student/StudentCaseEntryFlow.tsx
- apps/web/src/styles.css
- docs/01-work-packages/WP-300-case-001-full-resolution-runtime.md
- docs/15-case-plans/Case-001-Reverse-Clue-Chain.md
- docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md
- docs/15-case-plans/Case-001-Existing-Data-Inventory.md
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/00-ssot/SSOT-Case-Tier-System.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- apps/api/src/services/case001ResultPatternService.ts
- apps/api/src/services/case001ResultPatternService.test.ts
- apps/api/src/services/caseContentValidationService.ts
- apps/api/src/services/caseContentValidationService.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/caseVerificationService.ts
- apps/api/src/services/caseVerificationService.test.ts
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- apps/api/src/services/databaseBootstrapService.ts
- apps/api/src/services/databaseBootstrapService.test.ts
- apps/api/src/services/databaseMetadataService.ts
- apps/api/src/services/databaseMetadataService.test.ts
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/repositories/caseRuntimeRepository.test.ts
- apps/api/src/routes/caseRuntimeRoutes.ts
- apps/api/src/routes/caseRuntimeRoutes.test.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/src/types/caseVerification.ts
- apps/api/src/services/case001FullResolutionService.ts
- apps/api/src/services/case001FullResolutionService.test.ts
- apps/api/src/services/caseRuntimeAuthoring.test.ts
- apps/api/src/services/case001FullResolution.test.ts
- apps/api/src/services/fixtures/case001-legacy-evidence.sql
- apps/api/package.json
- apps/web/src/api/types.ts
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/useCaseAttempt.ts
- apps/web/src/useCaseAttempt.test.tsx
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/App.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- scripts/student-package/install-student-database.ps1
- scripts/tests/test-student-launcher.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Scope notes: handoff is accepted-closeout only; package.json is test registration only; shared frontend changes are only bounded role/result typing and existing theory control integration; installer/identity changes are evidence-version recognition and refusal, not a new automatic story repair. Tier policy editing records the human correction: natural step count, basic sequential lookups across four tables, and accurate Case 001 classification. Shared frontend scope also includes the reported responsive briefing and duplicate-content corrections. Any newly required source path must be scoped before its implementation, not added retrospectively.

Do Not Modify:
- docs/01-work-packages/WP-284-simplify-case-001-query-lab-guidance.md
- docs/01-work-packages/WP-285-case-runtime-architecture-improvement-plan.md
- docs/01-work-packages/WP-298-correct-legacy-city-repair-encoding-signature.md
- docs/15-case-plans/CASE-RUNTIME-ARCHITECTURE-IMPROVEMENT-PLAN.md
- package-lock.json
- apps/web/src/studentCase.ts
- apps/web/src/useStudentCaseState.ts
- apps/api/src/services/case004ProgressionService.ts
- apps/api/dist/**
- database/migrations/**

Compatibility decision: fresh builds use one incident report and two linked accounts with case001-complete-v5. Legacy installations and the explicit guarded regression fixture retain their old evidence. Historical immutable definitions and saved work remain preserved; old proof is incompatible with the changed story. Setup never silently rewrites a live installation.

## Constraints

No live mutations or destructive rebuild; SQL tests create newly owned SequelCityRuntimeTest_ databases and clean up only their own targets. No secrets or app credentials in outputs/commits. Existing account provisioning script remains the supported bounded setup; do not add a fourth manual seed step.

Preserve current ownership, SQL safety, evidence authenticity, restricted answer access, immutable publication and Case 004 verifier semantics. Single culprit is not a mastermind alias. Keep Case 001 Tier 1 under the explicit product decision; the other Tier 1 limits remain unchanged.

Fresh-install validation finding (before correction): Windows-domain ownership prevents existing EXECUTE AS OWNER manifests from resolving NEUMONT\Cburk while the domain is unavailable. Scope includes assigning only a newly created database to the built-in SQL principal SID 0x01, in the installer and explicit fresh-build preamble. Existing database ownership is not altered. Owned disposable legacy fixtures receive the same deterministic owner. No runtime account gains administrative privileges.

Human refinement authorized after implementation: retain Case 001 as a quick introductory win, label that purpose honestly, and fade direct instruction into applying the earned link. Add first-time-user observation criteria; do not add tasks, advanced SQL, new evidence or free-text progression gates. This is scoped authored-copy refinement before independent audit.

## Required Behavior

1. Record the human tier decision and authoring review. Validate natural dialogue, plausible knowledge, timing before drinking and absence of a missing ledger. Resolve report <=400 and transcript <=500 limits before seed edits.
2. Publish Case 001 version 3 from a checked draft with the six natural ordered tasks, facts/bindings and full-resolution scope. Use the complete authored text; no hidden IDs/answer names in early hints, starters or catalogue responses. Retain immutable historical definitions.
3. Derive the earned culprit name only from the canonical linked witness account for this exact case/version. The linked canonical witness account names the culprit from personal recognition; no PersonsOfInterest lookup is required. A guessed name, literal projection, broad extra rows or unrelated source cannot establish proof.
4. Add one restricted culprit role and controlled Case 001 verification after all four SQL evidence proofs. Reject arbitrary cases, wrong role/version, stale/duplicate/wrong-owner actions and early guesses without revealing the answer. Preserve both Case 004 roles and existing outcomes.
5. Before data changes, implement an explicit case-specific evidence compatibility contract. New v3 and its new public report/accounts must not reinterpret old Case 001 proofs. Preserve legacy v1/v2 handling against legacy evidence fixtures; Keep old evidence unchanged and old attempts readable; refuse genuinely incompatible content/evidence versions with clear recovery guidance. Keep Case 004 data/version support intact. Do not globally bump every case's evidence version as a shortcut.
6. A current fresh build installs coherent new Case 001 evidence/content/manifest/readiness. Existing old datasets must not receive silent public story UPDATEs or a destructive rebuild. Distinguish an old supported evidence-review installation from new full-resolution availability; unsupported mixtures fail clearly. A later live rebuild needs explicit consent and honest explanation of attempt loss/export.
7. Preserve broad starters, student-written SQL, earned fact tokens, saved notes/drafts, archive/resume and existing theory surface. Terminal state names the server-confirmed culprit and explains the evidence, without inventing motive or a mastermind.
8. Update the active old Case 001 authoring plan/inventory/classification to remove contradictions, while preserving historical WPs and scope boundaries.
9. Run API unit tests/no-emit typecheck, web tests/build, new real full-resolution API/browser proof, old supported Case 001 fixtures, complete Case 004 v1/v2 and case-008 tests, launcher unit/actual SQL integration, graph readiness and diff checks. Do not change assertions just to hide broken old compatibility.

## Acceptance Criteria

- [ ] Human tier choice and final narrative contract are recorded before dependent implementation.
- [ ] New case is a complete natural-language/SQL chain with no unexplained next predicate or phantom ledger.
- [ ] New v3 completes through actual SQL/API/shared browser with four earned single-table SQL tasks and one controlled culprit check.
- [ ] Unsupported/premature/fabricated/stale/wrong-owner verification cannot advance or reveal the answer.
- [ ] Evidence versions, old attempts and old/new dataset recognition are explicit and tested; no live rebuild or story mutation occurs.
- [ ] Shared UI, saved work and complete Case 004 v1/v2 behavior remain intact.
- [ ] Authoritative fresh scripts, manifests, launcher account provisioning and readiness agree.
- [ ] Required real regressions/builds, graph refresh and diff checks pass.
- [ ] Independent audit and human final acceptance remain separate; no self-acceptance or unrequested external sharing.

## Code Prompt

The human tier choice is recorded: Tier 1, natural linear clue progression, basic SQL. The simplified authoring contract is finalized and meets the unchanged Tier 1 limits. Treat the user's execution-order request as implementation direction once that product prerequisite is resolved. First establish evidence-version and verifier-role contracts in tests; preserve legacy behavior through explicit fixtures. Implement the full authored case coherently across fresh SQL, bounded backend proof/verification and existing shared UI. Do not stop at dialogue replacement. Run real SQL/browser/security/launcher regressions, refresh the graph and record evidence. Stop before independent external audit sharing without explicit authorization and before human acceptance, commit or push of this new package.

## Audit Prompt

Independently try to solve the case without answer spoilers; challenge the timing, witness knowledge, unique identity and final inference. Execute actual disposable SQL/API/browser tests, including wrong address, duplicate/missing interviews, synthetic rows, early guesses and old/new dataset incompatibility. Verify private answers, owner/CSRF/revision gates, immutable releases, launcher safety and unchanged Case 004 authority. Check tier policy against the actual human decision, allowed paths and simplicity. Report PASS/FAIL/BLOCKED with executable evidence and preserve the human final decision.

## Code Results

Implemented on codex/case-001-complete-mystery from merged origin/main baseline 322e5e0. Human implementation authorization: "Proceed with implementation" on 2026-10-15. Independent audit and final human acceptance remain pending. No commit/push or classroom database mutation performed. Earlier additive preview results below are historical validation; the cleaning correction and its final verification supersede that dataset design.

### Previous delivery — superseded by the 2026-10-16 review correction

- Explicit Tier 1 policy: up to five clear linear steps; no relaxation of the other budgets. The final case uses only CrimeSceneReport and InterviewLog, with one witness, victim and culprit. Report inspection/isolation, interview inspection/linked proof and controlled verification replace the earlier over-budget identity/roster design.
- New immutable Case 001 v3, evidence version case001-complete-v5. Fresh seed contains one report for the briefing city/date and one natural steward account. Old evidence is isolated in a guarded legacy test fixture. Historical content and raw saved work remain preserved, while old attempts correctly report incompatibility on the changed evidence.
- Version-scoped handlers validate actual public source rows and canonical evidence; a name is earned only from the exact linked account. Synthesized rows, wrong reports and premature verification cannot advance. Shared presentation and theory controls are reused without new frontend modules, dependencies or runtime AI.
- A separate bounded Case 001 culprit procedure reads restricted answers and returns only a matching supported identity. The Case 004 procedure, two roles and solution flow are unchanged. A static non-spoiler manifest verifies exact new records, one answer, release marker and private-verifier permission; missing/corrupt evidence is refused. App readiness reaches this through content loading; launcher readiness checks advertised v3 explicitly while supporting old datasets without v3.
- Authoritative scripts are version 2.4 dated 2026-10-15. Public story/answer inserts stay in the fresh section, outside runtime install blocks. App procedures are static additive DDL. All three runtime sections pass the existing no-evidence-DML/no-dynamic-SQL safety gate. Conditional v3 publication requires its evidence/answer to exist; existing v2 installations are not silently rewritten.
- Exact manifests recognize either the real legacy bundle or the clean current bundle. Current readiness rejects competing city/date reports or extra linked accounts. Case 004 retains its natural city count without a special report exclusion.
- Fresh-install validation exposed an existing offline-domain owner dependency in EXECUTE AS OWNER manifests. Only databases just created by the installer/manual fresh script are assigned to the built-in SQL principal (SID 0x01, supports renamed sa). Existing database ownership and bounded runtime accounts are unchanged. Disposable fixtures use the same owner.
- Historical installer fixtures now reconstruct their actual old dataset instead of accidentally combining new full-case evidence with an old city manifest. The runtime regression fixture proves legacy flow first, explicitly switches its owned disposable evidence to the clean current case, and checks raw legacy proof/workspace preservation with explicit incompatibility. No immutable trigger is disabled for this publication.

### Verification

- API regression suite and no-emit typecheck passed: outputs/wp300-api-tests.log and outputs/wp300-api-typecheck.log.
- Web tests: 225 passed across 23 files. Web production build passed. Logs: outputs/wp300-web-tests.log and outputs/wp300-web-build.log.
- Complete disposable SQL/browser matrix passed with exit 0: outputs/wp300-sql-browser-verified.log. Includes actual bounded login/security checks, legacy Case 001 ordered proof and save/resume, all 12 existing browser regressions, full Case 004 v1/v2 sixteen-step paths and both roles, new complete Case 001 API proof, corruption refusal, forged/wrong evidence and early/wrong-name refusal, saved notes/drafts/archive/resume, controlled closure/replay, preserved legacy completed attempts, case-008 authoring proof and two real browser proofs. The new case browser saves a custom draft, reloads, resumes and completes all five tasks. No mocked case responses.
- Launcher unit and real SQL matrix passed with exit 0: outputs/wp300-launcher-unit.log and outputs/wp300-launcher-sql-final.log. Fresh/current/legacy/extension/city paths, actual account readiness/denial, verified backups, interruption rollback, exact signature/unknown/corrupt refusal, immutable v1/workspace/evidence preservation and repeat launch passed.
- Graph readiness passed; four owned artifacts refreshed. git diff --check passed. No dependency lockfile or tracked build output changed.

### Audit preparation and remaining boundaries

Isolated audit checkout: C:/Users/cburk/.codex/worktrees/wp-300-audit/SequelCityWeb. It receives only this package's allowed changed files and ignored wp300 validation logs. No new external auditor has been invoked; external sharing authorization is needed for WP-300. Prior WP-290 audit authorization is not reused.

WP-284/WP-285/historical architecture edits, WP-298 and the separate WP-299 planning record remain preserved outside this implementation scope. The classroom database is unchanged; the running local application therefore still uses its installed older release until an accepted operational installation is explicitly requested. Do not run a destructive rebuild merely to preview unaccepted work.

### Introductory-case refinement

Human approved retaining Case 001 as a quick introductory win. The v3 dossier now explicitly labels its onboarding purpose. After direct initial scaffolding, interview guidance asks which column links records and places the specific ReportID reminder in the optional hint; the next task asks students to apply the link and distinguish observations from assumptions. No task, evidence, authority or difficulty expansion was added.

The real SQL/API/browser suite was rerun after these changes and passed with exit 0: outputs/wp300-intro-sql-browser.log. Includes all 12 existing browser regressions, both full Case 004 paths, complete Case 001 proof, and two real browser tests. New assertions verify the introductory briefing and less directive interview prompt; save/reload/resume and verified closure still pass. git diff --check passed.

First-time-user comprehension testing is still pending. The authoring specification now records observation criteria and three post-case explanation questions. Automated success is not presented as proof of student understanding, and no duration target or free-text completion gate was introduced.

### Current review correction delivered (2026-10-16)

The active case now follows six natural phases: Murder type -> incident report -> steward account -> named identity -> Les's own account -> controlled resolution. Archive-inspection padding is removed. CrimeID is earned through CrimeType and appears as Murder CrimeID in Pinned Facts. The named identity and suspect statement each require actual canonical SQL evidence; the steward's name alone cannot unlock verification. Theory choices remain the earned name, not narrative finding text.

The concise briefing is displayed once. Removed the duplicate Case File Snapshot. Protected runtime guidance uses intrinsic height and stacked label/value tracks, so resized windows do not force text outside a fixed-height panel. Browser bounding-box assertions passed at 375, 768, 900, 1044 and 1440 pixels; the 1044-pixel screenshot was visually inspected.

The report establishes selective poisoning without naming a suspect or prescribing the full path. The steward remembers separate preparation and service, without seeing a bottle, poison or an overt criminal act. Les explains his private drink mix source in his own statement. Resolution requires correlating all three narrative records. The authoritative seed, exact manifests, case handlers, bindings, Tier SSOT and authoring contracts now share evidence version case001-complete-v5. Old preview databases and saved work remain preserved; the classroom database is unchanged.

Verification: API regression suite and typechecks passed (outputs/wp300-natural-api.log); 225 web tests and production build passed (outputs/wp300-natural-web.log, outputs/wp300-natural-web-build.log). Launcher unit and real SQL compatibility matrix passed with exit 0 (outputs/wp300-natural-launcher.log). The refreshed isolated preview at http://localhost:27077 passed its complete six-phase browser test, including Pinned Facts, resized layouts and save/reload/resume (outputs/wp300-natural-preview-browser.log). Combined SQL/API/browser verification passed with exit 0 (outputs/wp300-natural-verified-sql-browser.log), including all 12 legacy browser regressions, both complete Case 004 versions, current six-phase Case 001 and both authored-case live browser journeys. Graph refresh and scope/diff checks remain part of audit preparation. External audit, acceptance, commit and push remain pending.

## Audit Results

Pending audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision

Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
