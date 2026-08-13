# WP-254 - Case 001 Gated First-Playthrough Smoke Test

## Objective

Add a narrow repeatable smoke-test package for the gated Case 001 first-playthrough path that exercises the skeleton gate plus first SQL feedback flow against the local API/database setup and records setup or data blockers without adding gameplay.

## Scope

### In Scope

- Add one focused browser or smoke-test path for the gated Case 001 first-playthrough route.
- Exercise the existing Case 001 skeleton gate by setting `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true` only for the smoke run.
- Open Case 001 through the existing case-library and landing-page flow.
- Submit the existing first SQL query feedback path through the real frontend and `/api/query/execute`.
- Use the existing local API/database setup rather than Playwright route mocks for the primary smoke path.
- Verify the smoke path observes non-spoiler Case 001 first-milestone feedback when the local API/database has the Case 001 public `CrimeSceneReport` fixture.
- Record deterministic setup/data blocker evidence when the API is unavailable, database is not connected, or the Case 001 fixture is missing from the local database.
- Add concise smoke-test documentation or testing-strategy notes that explain the command, prerequisites, expected pass signal, and blocker interpretation.
- Preserve existing mocked browser tests for Case 004 and current Student Mode regression coverage.

### Out of Scope

- No Case 001 release unlock.
- No new Case 001 gameplay, progression, persistence, clue logging, evidence-board behavior, investigation threads, suspect verification, or reset behavior.
- No normal Query Lab integration for Case 001.
- No backend API behavior changes.
- No database seed, migration, schema, fixture, or rebuild behavior changes.
- No answer-key exposure, restricted-table exposure, hidden solution data, suspect names, or runtime AI.
- No package dependency changes or lockfile changes.
- No broad browser-test harness rewrite.
- No Case 004 behavior changes.

## Impact Analysis

### Understand Status

- Graph available: Yes, `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `0acb61a6dada309a2a37b6f100a7306d50771b8b`.
- Current HEAD during planning: `f6c2f10`.
- Freshness assessment: Usable with WP-253 drift. The graph was refreshed during WP-253 and includes the relevant Case 001 skeleton, API-client, and browser-test surfaces, but its recorded commit hash is the pre-closeout commit because the graph refresh was part of the WP-253 commit. Source verification was performed against current `HEAD`.
- Analysis performed: Verified clean `main`, current handoff, latest WP number, graph artifacts, changed paths since baseline, existing Playwright runner/config, mocked Student Mode browser tests, browser API mock helper, Case 001 skeleton component/test, Case 001 module constants, app gate/landing flow, package scripts, and local API/database documentation references.

### Affected Architecture

- Layers: browser smoke-test harness/specs, test documentation, work-package record.
- Primary files/components:
  - `apps/web/tests/browser/run-playwright.mjs`
  - `apps/web/playwright.config.ts`
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
  - new focused Case 001 live-stack browser smoke spec under `apps/web/tests/browser/`
  - `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
  - `docs/11-testing-strategy/frontend-rendering-testing.md`
  - `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- Upstream consumers: `npm run test:browser --workspace apps/web` and any focused Playwright invocation.
- Downstream dependencies: local Vite frontend, local Fastify API at the configured API base URL, local SQL Server database, and the existing `/api/health/full` and `/api/query/execute` contracts.

### Regression Surface

- Related tests: focused new Case 001 live-stack smoke command, existing mocked browser suite, `StudentPlayableCaseSkeletonView.test.tsx`, `client.test.ts`, `studentCaseModule.test.ts`, and web build.
- User workflows: gated Case 001 development/test entry path, Case 004 released student flow, locked-case presentation, browser-history/library flow.
- Security/data boundaries: SQL still goes through backend safety and restricted-table checks. The smoke test must not inspect or assert answer-key, restricted-table, suspect-verification, or hidden solution data.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: The planned package adds or changes browser test files and possibly the Playwright runner/config surface. These are tracked architecture/test surfaces, so the WP should own the tracked Understand graph refresh after implementation.

## Files Allowed to Change

Allowed:

- `apps/web/tests/browser/run-playwright.mjs`
- `apps/web/playwright.config.ts`
- `apps/web/tests/browser/case-001-live-smoke.spec.ts`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/frontend-rendering-testing.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- `docs/01-work-packages/WP-254-case-001-gated-first-playthrough-smoke-test.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Closeout-only allowance:

- `docs/00-ssot/END-OF-DAY-HANDOFF.md` may be modified only during accepted-WP closeout.

Do Not Modify:

- `apps/web/src/App.tsx`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/types.ts`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCasePersistence.ts`
- `apps/web/src/hooks/useStudentCaseState.ts`
- `apps/api/**`
- `database/**`
- `database/migrations/**`
- `package.json`
- `package-lock.json`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/api/package-lock.json`
- `scripts/**`
- `.codex/**`

## Constraints

- Preserve existing behavior unless explicitly changing test coverage or test documentation.
- Keep the primary change validation-focused, not product-facing.
- Do not change application runtime code to make the smoke test pass.
- Do not introduce a mock-only pass as the primary local API/database smoke signal.
- Do not install dependencies or change package scripts unless a follow-up WP explicitly allows it.
- Do not mutate local database state.
- Do not add migrations, seed scripts, fixture rows, or bootstrap behavior.
- Do not expose raw query result rows, answer keys, hidden validation details, suspect data, or restricted table content in the smoke assertions.
- If local API/database prerequisites are missing during implementation, record the blocker exactly in Code Results and keep the smoke test deterministic about why it cannot pass locally.

## Required Behavior

- The smoke path must run with `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true` for the web process under test.
- The smoke path must open the app in Student Mode, select `Case 001: The Clocktower Poisoning`, enter through the existing gated landing action, and reach the Case 001 skeleton view.
- The smoke path must confirm the Case 001 first SQL feedback control is visible.
- The smoke path must submit the existing starter SQL or an equivalent read-only query through the real UI.
- The primary smoke path must not install `installStudentModeApiMocks` or route-mock `/api/query/execute`.
- The smoke path must wait for a real `/api/query/execute` response and assert the non-spoiler success feedback when the API/database returns `caseMilestoneEvaluation.matched === true`.
- The smoke path must also assert that the Case 001 skeleton does not render query result rows/tables, does not show normal Query Lab, and does not write Case 001 progress storage.
- If the local API/database is not ready, the test or runbook must produce an actionable blocker message that distinguishes API unavailable, database not connected, and missing Case 001 fixture where practical.
- Existing mocked browser tests must remain runnable and must not accidentally depend on live API/database.
- Documentation must explain the focused command, prerequisites, expected pass signal, and expected blocker signals.

## Acceptance Criteria

- [ ] A focused Case 001 gated first-playthrough smoke spec or equivalent browser smoke path exists.
- [ ] The smoke path uses the real frontend and real `/api/query/execute` transport, not Playwright route mocks, for the primary Case 001 feedback assertion.
- [ ] The smoke path enables the Case 001 skeleton gate only for the smoke run.
- [ ] The smoke path enters Case 001 through the existing case-library and landing-page UI.
- [ ] The smoke path submits the first SQL feedback query and verifies non-spoiler milestone feedback.
- [ ] The smoke path verifies no Case 001 result table/rows, Query Lab, localStorage persistence, release unlock, clue logging, evidence board, suspect verification, or answer-key exposure is introduced.
- [ ] Missing local API/database/fixture prerequisites are reported as blockers, not as product failures or silent passes.
- [ ] Existing mocked Student Mode browser tests remain isolated from live API/database.
- [ ] Test documentation records the command, prerequisites, pass signal, and blocker interpretation.
- [ ] Understand graph artifacts are refreshed after implementation.
- [ ] Run `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts`.
- [ ] Run `npm run build --workspace apps/web`.
- [ ] Run the focused Case 001 live-stack smoke command when the local API/database prerequisites are available, or record the exact blocker if they are not.
- [ ] Run `npm run test:browser --workspace apps/web -- student-mode.spec.ts` or a narrower existing mocked browser regression command to verify existing mocked browser coverage still works.
- [ ] Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`.
- [ ] Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`.
- [ ] Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`.
- [ ] Run `git diff --check`.
- [ ] Run the relevant work-package status and validation-plan helper scripts.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-254 exactly as specified.

Start by reading:

- `docs/01-work-packages/WP-254-case-001-gated-first-playthrough-smoke-test.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/frontend-rendering-testing.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- `apps/web/package.json`
- `apps/web/playwright.config.ts`
- `apps/web/tests/browser/run-playwright.mjs`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/studentModeApi.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/studentCaseModule.test.ts`

Then:

1. Add the narrowest viable live-stack Case 001 browser smoke spec or equivalent focused smoke path under `apps/web/tests/browser/`.
2. Ensure the focused smoke run can set `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true` for the web process without changing the default app gate or existing mocked browser tests.
3. Keep the primary Case 001 smoke path on real `/api/health/full` and `/api/query/execute`; do not install route mocks for the primary assertion.
4. Add preflight/blocker handling that clearly reports API unavailable, database unavailable, or missing Case 001 public `CrimeSceneReport` fixture when those conditions prevent a pass.
5. Assert the safe Case 001 path: library selection, landing entry, skeleton view, first SQL feedback submit, non-spoiler matched feedback, no result table/rows, no Query Lab, and no Case 001 progress storage.
6. Update only the scoped testing documentation for command/prerequisite/pass/blocker guidance.
7. Run:
   - `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts`
   - `npm run build --workspace apps/web`
   - the focused Case 001 live-stack smoke command when prerequisites are available, or record the exact blocker
   - `npm run test:browser --workspace apps/web -- student-mode.spec.ts` or a narrower existing mocked browser regression command
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `git diff --check`
8. Record Code Results with changed files, validation evidence, focused smoke result or blocker, graph-refresh evidence, and scope check.

Scope:

- Only modify files listed under `Allowed:`.
- Keep app runtime, backend, database, package, and lockfile files unchanged.

Return:

- Exact code/documentation changes.
- Tests run and results.
- Live-stack smoke pass evidence or exact blocker.
- Any deviations from the allowed file list or acceptance criteria.

## Audit Prompt

Audit WP-254 against the implemented changes with an adversarial stance.

Verify:

- The package remains validation-focused and does not add gameplay or release behavior.
- All changed files are in `Allowed:` and no `Do Not Modify:` boundary was touched.
- The primary Case 001 smoke path uses real `/api/query/execute` and does not rely on Playwright route mocks for the milestone feedback assertion.
- The Case 001 skeleton gate is enabled only for the smoke run and default release-locked behavior is unchanged.
- The smoke path enters through the existing case library and landing page.
- The smoke path asserts non-spoiler feedback only and does not render raw query rows, answer keys, suspect data, Query Lab, persistence, clue logging, evidence-board behavior, or progression.
- Missing API/database/fixture prerequisites are reported as blockers rather than silent passes.
- Existing mocked browser tests remain isolated and runnable.
- Documentation explains command, prerequisites, pass signal, and blocker interpretation.
- Required validation and graph-refresh evidence is recorded, or any unavailable live prerequisite is explicitly documented.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:

- Verdict: PASS, FAIL, or BLOCKED.
- Scope compliance.
- Acceptance-criteria coverage.
- Runtime/data-boundary findings.
- Validation evidence and missing evidence.
- Drift risks or recommended follow-up.

## Code Results

Status: ImplementedNeedsAudit

Changed files:

- Added `apps/web/tests/browser/case-001-live-smoke.spec.ts`.
- Updated `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`.
- Updated `docs/11-testing-strategy/frontend-rendering-testing.md`.
- Updated `docs/11-testing-strategy/local-runtime-test-scenarios.md`.
- Refreshed tracked Understand graph artifacts:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`
- Updated this work-package record.

Implementation summary:

- Added an opt-in Playwright live-stack smoke for the gated Case 001 skeleton path.
- The smoke is skipped by default unless `CASE_001_LIVE_SMOKE=1` is set, so the default mocked browser suite stays isolated from local API/database availability.
- The focused smoke requires `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true` for the Vite process and does not change default release-locked behavior.
- The smoke preflights the live API with `/api/health/full`, then sends the existing starter SQL through `/api/query/execute` with explicit Case 001 milestone metadata.
- If preflight passes, the smoke enters Case 001 through the existing library and landing action, submits the first SQL feedback form through the real UI, waits for the real `/api/query/execute` response, asserts non-spoiler matched metadata/feedback, and verifies no result table, Query Lab, Evidence Board, Test Theory control, raw metadata text, or Case 001 progress localStorage key appears.
- Documentation now records the command, prerequisites, expected pass signal, and blocker interpretation.

Validation evidence:

- PASS: `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts` completed with 3 test files passed and 20 tests passed.
- PASS: `npm run build --workspace apps/web` completed `tsc -b && vite build`.
- PASS: default focused smoke isolation, `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`, completed with 1 skipped test because `CASE_001_LIVE_SMOKE` was not set.
- BLOCKER RECORDED: opt-in live-stack smoke, `$env:CASE_001_LIVE_SMOKE = "1"; $env:VITE_ENABLE_CASE_001_PLAYABLE_SKELETON = "true"; $env:VITE_API_BASE_URL = "http://127.0.0.1:3001"; npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`, completed with 1 skipped test and the explicit blocker `WP-254 live smoke blocker: Case 001 milestone metadata was not returned for the fixture query.`
- PASS: existing mocked browser regression, `npm run test:browser --workspace apps/web -- student-mode.spec.ts`, completed with 10 passed and 1 intentional skipped legacy test.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=629`, graph assembly `nodes=1007`, `edges=378`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 629 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.
- PASS: `git diff --check` completed with no whitespace errors.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-254` reported `ImplementedNeedsAudit`, `Code results recorded: True`, and no out-of-scope dirty files.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-254` reported `ValidationEvidenceRecorded`, `Blocks audit readiness: False`, and no missing findings.

Scope check:

- No app runtime, backend source, database, package, lockfile, migration, Query Lab, persistence, suspect verification, or release-unlock files were modified.
- `npm run build` initially changed generated `apps/api/dist` output via the root build command; those generated changes were restored and are not part of the WP-254 diff.
- The first opt-in smoke attempt was contaminated by a parallel Vite port collision; it was rerun serially and the clean serial result above is the recorded smoke evidence.

## Audit Results

### Audit Report: WP-254 ΓÇö Case 001 Gated First-Playthrough Smoke Test

Verdict: PASS

---

### 1. Scope Compliance

| Area | Status | Notes |
| :--- | :--- | :--- |
| **Validation-Only Focus** | **PASS** | Changes are strictly test infrastructure, test documentation, and graph refresh. No gameplay logic, progression mechanics, unlock routines, or schema changes were added. |
| **Allowed Files List** | **PASS** | All modified and untracked files match [`WP-254`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-254-case-001-gated-first-playthrough-smoke-test.md) `Allowed:` specifications. |
| **`Do Not Modify:` Boundaries** | **PASS** | No forbidden boundaries were touched (`apps/web/src/App.tsx`, `StudentPlayableCaseSkeletonView.tsx`, `studentCase001.ts`, `studentCaseModule.ts`, `apps/api/**`, `database/**`, `package.json`, `package-lock.json`, etc.). |
| **Dirty File Audit** | **PASS** | Running [`scripts/get-work-package-status.ps1 WP-254`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1) confirms zero out-of-scope dirty files. |

---

### 2. Acceptance-Criteria Coverage

| Requirement / Acceptance Criteria | Status | Evidence / Analysis |
| :--- | :---: | :--- |
| Focused live smoke test exists | **PASS** | Implemented in [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts). |
| Real `/api/query/execute` transport (no Playwright route mocks) | **PASS** | [`case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts) does not import or call `installStudentModeApiMocks` or `page.route()`. It awaits real backend responses via `page.waitForResponse()`. |
| Gate enabled only for smoke run | **PASS** | Guarded by `test.skip(process.env.VITE_ENABLE_CASE_001_PLAYABLE_SKELETON !== "true")` and `test.skip(process.env.CASE_001_LIVE_SMOKE !== "1")`. Default release behavior remains locked. |
| Smoke path enters via Case Library & Landing Page | **PASS** | Navigates to `/` -> selects "Case 001: The Clocktower Poisoning" -> clicks "Open Case File". |
| Non-spoiler milestone feedback assertion | **PASS** | Asserts `responseBody.caseMilestoneEvaluation.matched === true` and UI text `Public report located`. |
| Boundary assertions (no table rows, Query Lab, persistence, etc.) | **PASS** | Asserts table count `0`, button "Query Lab" count `0`, "Evidence Board" count `0`, "Test Theory" count `0`, no raw metadata leaked, and `localStorage` has `0` keys containing `case-001`. |
| Deterministic blocker reporting | **PASS** | `classifyLiveStackReadiness()` inspects `/api/health/full` and `/api/query/execute` preflight and reports explicit `WP-254 live smoke blocker` annotations rather than failing as a regression or silently passing. |
| Existing mocked browser test isolation | **PASS** | Mocked suite in [`student-mode.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/student-mode.spec.ts) runs without live backend dependencies (10 passed, 1 skipped). |
| Test documentation complete | **PASS** | Updated [`Student-Mode-Browser-Test-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-Browser-Test-Guide.md), [`frontend-rendering-testing.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/11-testing-strategy/frontend-rendering-testing.md), and [`local-runtime-test-scenarios.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/11-testing-strategy/local-runtime-test-scenarios.md). |
| Understand graph refreshed | **PASS** | Graph artifacts updated; [`scripts/check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) reports `READY`. |

---

### 3. Runtime & Data-Boundary Findings

1. **Preflight Guardrail Robustness:**
   - Evaluated `classifyLiveStackReadiness()` in [`case-001-live-smoke.spec.ts:37-136`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts#L37-L136). The function validates:
     1. API reachability and HTTP 200 on `/api/health/full`.
     2. Clean execution on `/api/query/execute`.
     3. Presence of `caseMilestoneEvaluation` in the response payload.
     4. `evaluation.matched === true`.
     5. `evaluation.milestoneAdvanced === false` (guaranteeing no progression side-effects).
2. **Negative Boundary Validation:**
   - In execution against the local API lacking active milestone metadata, the test skipped cleanly with:
     `WP-254 live smoke blocker: Case 001 milestone metadata was not returned for the fixture query.`
   - This confirms blocker interpretation works deterministically under real live conditions.
3. **Storage & UI Isolation:**
   - The test explicitly verifies that `window.localStorage` has zero `case-001` keys before and after execution, ensuring strict memory-only lifecycle compliance.
4. **Authoritative Source & SSOT Integrity:**
   - No Understand metadata was used to override canonical code, tests, or documentation.

---

### 4. Validation Evidence

| Check / Command | Result |
| :--- | :--- |
| `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts` | **PASS** (3 test files passed, 20 tests passed) |
| `npm run build --workspace apps/web` | **PASS** (`tsc -b && vite build` completed in 149ms) |
| `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` (Default isolation) | **PASS** (1 test skipped due to default env isolation) |
| Opt-in live smoke command | **PASS** (Correctly intercepted missing fixture metadata and reported standard blocker) |
| `npm run test:browser --workspace apps/web -- student-mode.spec.ts` | **PASS** (10 passed, 1 skipped) |
| `powershell -File scripts/check-understand-refresh-readiness.ps1` | **PASS** (`READY`) |
| `git diff --check` | **PASS** (No whitespace or syntax errors) |
| `powershell -File scripts/get-work-package-status.ps1 WP-254` | **PASS** (`ImplementedNeedsAudit`, 0 out-of-scope dirty files) |
| `powershell -File scripts/get-work-package-validation-plan.ps1 WP-254` | **PASS** (`ValidationEvidenceRecorded`, `Blocks audit readiness: False`) |

---

### 5. Drift Risks & Recommended Follow-up

- **Closeout Action:** Update [`WP-254`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-254-case-001-gated-first-playthrough-smoke-test.md) to record the audit results and closeout decision, and update [`docs/00-ssot/END-OF-DAY-HANDOFF.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/END-OF-DAY-HANDOFF.md) per the SSOT workflow.
- **Port Conflict Awareness:** As documented in the work package, multiple concurrent Playwright Vite instances can compete for default ports; the test runbook guidance in [`docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-Browser-Test-Guide.md) correctly advises serial execution.
The background task notification has been received and noted (the previous PowerShell string escaping test from background task `task-92` completed). The audit findings and verdict remain verified as presented.
All background tasks have completed or been cleaned up. The audit of WP-254 is complete with verdict **PASS**. Let me know if you would like to proceed with the closeout process or any follow-up tasks!

## Final Decision

Accepted on 2026-08-13 after audit PASS. WP-254 is approved for closeout because it added the gated Case 001 live-stack smoke path, preserved the release/progression/persistence/data boundaries, recorded the observed local milestone-metadata blocker explicitly, refreshed Understand graph artifacts, and left no out-of-scope dirty files.

