# playable-case-module-gating-consumption

## Objective

Make the existing Case 004 student app entry/gating path consume the playable-case module boundary, so only registered playable modules can enter the investigation view while locked/future cases remain landing-page-only.

## Scope

### In Scope
- Update `App.tsx` to use the playable-case module registry from `studentCaseModule.ts` when deciding whether a selected case can enter/render the investigation view.
- Keep Case 004 as the only registered playable case.
- Preserve the existing case library and landing-page presentation for locked/future cases.
- Add focused App tests proving:
  - Case 004 still enters the investigation from the library/landing flow.
  - locked/future cases still open their landing pages but cannot enter or render the investigation view.
  - direct browser-history or state restoration to a non-playable case does not make that case active/playable.
  - existing Case 004 local progress key behavior remains unchanged.
- Update SSOT wording to state that app entry/render gating now consumes the playable-case module registry.
- Refresh tracked Understand graph artifacts after implementation because this package changes App architecture/imports around the module boundary.

### Out of Scope
- Adding a new playable case.
- Unlocking any currently locked case.
- Changing Case 004 gameplay, milestone, clue, guidance, answer, SQL, suspect, reward, or visual behavior.
- Changing the playable-case module contract created by WP-237 unless a compile/test issue strictly requires a tiny integration fix.
- Refactoring `useStudentCaseState.ts`, `studentCase.ts`, case library data, landing-page rendering, student entry-flow rendering, investigation threads, query reinforcement, Samuel reactions, evidence-board logic, or backend/API/database behavior.
- Changing local persistence semantics, storage keys, migrations, reset/clear behavior, package manifests, lockfiles, dependencies, runtime AI, external services, browser automation, generated build outputs, or scripts.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `42c062ebd7987683b8acfa9cb13f28675d3b9e7e` (`Generalize student case progress persistence`), from `.understand-anything/meta.json`.
- Freshness assessment: Usable with known structural metadata drift for this planning surface. Current `HEAD` is `683903f` (`Define playable case module boundary`). WP-237 refreshed the graph from the implementation worktree before closeout, so the graph contains `apps/web/src/studentCaseModule.ts` and `apps/web/src/studentCaseModule.test.ts` nodes even though `meta.json` records the pre-closeout commit used by the wrapper. The only commit after the recorded baseline is the accepted WP-237 closeout commit, which contains the module boundary, SSOT update, WP record, handoff refresh, and tracked graph artifacts. Source inspection remains authoritative for this plan.
- Analysis performed: Verified clean `main`, attempted then reran `git pull --ff-only` with escalation because the sandbox could not write `.git/FETCH_HEAD`; remote reported already up to date. Read workflow SSOT, work-package lifecycle guidance, Understand guidance, planning checklist, graph metadata, changed paths since graph baseline, targeted graph/source references for `App.tsx`, `studentCaseModule.ts`, `studentCaseLibrary.ts`, `StudentCaseEntryFlow.tsx`, `StudentCaseLandingPage.tsx`, `useStudentCaseState.ts`, `App.test.tsx`, and `SSOT-Investigation-State-Architecture.md`.

### Affected Architecture
- Layers:
  - Frontend student app case-entry and investigation-render gating.
  - Frontend playable-case module registry integration.
  - Frontend Case 004 local progress activation boundary.
  - SSOT investigation state/persistence architecture.
  - Understand graph baseline.
- Primary files/components:
  - `apps/web/src/App.tsx`
  - `apps/web/src/App.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - tracked Understand graph artifacts
- Upstream consumers:
  - Student case library and landing-page workflow.
  - Browser history state for student case screen/case id.
  - Future playable case implementation packages that will rely on the module boundary.
- Downstream dependencies:
  - `apps/web/src/studentCaseModule.ts` for `getPlayableStudentCaseModule`.
  - `apps/web/src/components/student/studentCaseLibrary.ts` for presentation metadata.
  - `apps/web/src/useStudentCaseState.ts` for Case 004 local progress hydration/writes.
  - Existing App integration tests and focused student state persistence tests.

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web -- --run src/App.test.tsx`
  - `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts`
  - `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`
  - `npm run build --workspace apps/web`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- User workflows:
  - Student opens Case Library.
  - Student opens Case 004 landing page and enters the investigation.
  - Student opens locked/future case landing pages.
  - Browser back/forward or history state attempts to restore library, landing, and case screens.
  - Student resumes Case 004 local progress.
- Security/data boundaries:
  - No backend, database, answer-key, restricted-table, SQL execution, suspect-verification, account, cloud, or runtime AI authority changes.
  - Local browser persistence remains learner-owned convenience state only.
  - Locked/future cases must not become playable, restorable, or writable by route/history state.
  - No hidden suspect, answer-key, or spoiler values are introduced.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: This package intentionally changes `App.tsx` imports/gating to consume the WP-237 playable-case module boundary. That is an app architecture/import change on the exact surface the graph represents. The package can safely own tracked graph artifacts, so refresh belongs in this originating WP after implementation and validation.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md`

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/src/components/student/studentCaseLibrary.ts`
- `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
- `apps/web/src/components/student/StudentCaseLandingPage.tsx`
- `apps/web/src/features/investigationThreads/**`
- `apps/web/src/features/queryReinforcement/**`
- `apps/web/src/features/samuelReactions/**`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/tests/browser/**`
- `apps/api/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- generated build outputs, coverage, screenshots, videos, traces, and `apps/web/test-results/**`

## Constraints

- Preserve normal user-facing behavior for Case 004 entry, resume, and investigation flow.
- Do not make any new case playable.
- Do not unlock any case library entry.
- Do not change landing-page content, case-library card content, or student visual design.
- Do not change the WP-237 module contract, except for a minimal compile/test-driven integration correction if impossible to avoid.
- Do not change local storage keys or persistence semantics.
- Do not modify backend, database, SQL safety, answer-key, restricted-table, runtime AI, dependency, package, lockfile, generated-output, or browser automation behavior.
- Keep changes narrow to App consuming the registry for gating.

## Required Behavior

- `App.tsx` must import and use the playable-case module registry/helper to determine whether the currently selected case can enter/render the investigation view.
- The active student case id passed to `useStudentCaseState` must come from the registered playable module, not directly from `selectedLibraryCase?.isUnlocked`.
- The investigation view must render only when the selected case resolves to a registered playable module.
- Case 004 must remain the only case that can enter/render the investigation.
- Locked/future cases must still open their landing pages and keep their disabled `Archive Locked` action, but must not enter/render the investigation view through normal clicks or browser history state.
- `initialStudentCaseEntered` must continue to open Case 004 for existing tests/dev flows.
- Existing Case 004 storage key compatibility must remain unchanged.
- SSOT must state that App entry/render gating consumes the playable-case module registry and that library `isUnlocked` metadata alone is not enough to make a case playable.
- After implementation and validation, refresh the tracked Understand graph artifacts with the repository wrapper and verify readiness before/after refresh.

## Acceptance Criteria

- [ ] App entry/render gating consumes `studentCaseModule.ts` rather than relying only on case-library `isUnlocked` metadata.
- [ ] Case 004 remains the only case that can enter and render the investigation view.
- [ ] Locked/future/unknown case ids do not enter or render the investigation view, including through browser history state.
- [ ] Locked/future case landing pages remain visible and disabled as before.
- [ ] Existing Case 004 local progress storage key behavior remains unchanged.
- [ ] No App routing, landing-page content, case-library data, Case 004 progression, student state hook, investigation-thread behavior, backend, database, package, lockfile, runtime AI, or generated build output changes are introduced outside the explicit gating integration.
- [ ] SSOT documents that playable-case module registry membership is the app entry/render gate.
- [ ] `npm run test --workspace apps/web -- --run src/App.test.tsx` passes.
- [ ] `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts` passes.
- [ ] `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx` passes.
- [ ] `npm run build --workspace apps/web` passes.
- [ ] Understand readiness passes before graph refresh.
- [ ] `scripts/refresh-understand-graph.ps1` completes successfully.
- [ ] Understand readiness passes after graph refresh.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-238 exactly as specified.

Start by reading:
- `docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/components/student/studentCaseLibrary.ts`
- `apps/web/src/useStudentCaseState.ts`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`

Scope:
- Only modify the allowed files.

Constraints:
- No refactors.
- No new dependencies.
- Preserve existing Case 004 behavior.
- Do not make another case playable.
- Do not change persistence storage keys or semantics.
- Do not change backend, database, packages, lockfiles, runtime AI, or generated outputs.

Implementation requirements:
- Update `App.tsx` so the selected playable module is resolved through `getPlayableStudentCaseModule(selectedLibraryCaseId)`.
- Use the resolved playable module to derive the active student case id passed to `useStudentCaseState`.
- Render the investigation view only when the current student screen is `case` and a playable module exists.
- Ensure `handleEnterStudentCase` cannot push/render the case screen for a selected non-playable case.
- Preserve `initialStudentCaseEntered` opening Case 004.
- Add or update focused `App.test.tsx` coverage for normal Case 004 entry, locked/future direct history/state non-entry, and unchanged Case 004 local storage key behavior.
- Update SSOT wording to describe registry-based App entry/render gating.
- Run required focused tests and web build.
- Run `scripts/check-understand-refresh-readiness.ps1`, then `scripts/refresh-understand-graph.ps1`, then `scripts/check-understand-refresh-readiness.ps1` again.
- Record Code Results with changed files, validation evidence, graph refresh evidence, and scope check.

Validation commands:
- `npm run test --workspace apps/web -- --run src/App.test.tsx`
- `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts`
- `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`
- `npm run build --workspace apps/web`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`

Return:
- Summary of changed files and behavior.
- Validation and graph-refresh commands run with results.
- Any blockers or follow-up needed.

## Audit Prompt

Audit WP-238 against the work package and SSOT.

Verify:
- All acceptance criteria are satisfied.
- Changed files are limited to the `Allowed:` list.
- `Do Not Modify:` boundaries were preserved.
- `App.tsx` consumes the playable-case module registry/helper for entry/render gating.
- Case 004 remains the only registered playable module and the only case that can enter/render the investigation view.
- Locked/future/unknown case ids cannot enter/render the investigation view through normal UI or browser history state.
- Locked/future landing pages remain visible and disabled as before.
- Existing Case 004 local progress storage key behavior remains unchanged.
- No runtime behavior changed outside the intended gating boundary.
- No case-library data, landing-page content, Case 004 progression, state-hook behavior, investigation-thread behavior, backend, database, restricted data, answer key, package, lockfile, dependency, runtime AI, external service, or generated app build output changes were introduced.
- SSOT wording matches the implemented registry-based entry/render gate and does not authorize another playable case.
- Required focused tests, web build, and Understand refresh/readiness commands were run or any blocked validation is clearly recorded.
- Graph regeneration decision was followed; tracked graph artifacts changed only as expected and no transient `.understand-anything` trash/temp/log artifacts were included.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Missing tests or validation
- Scope drift risks

## Code Results

Implemented by Codex.

Changed files:
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md`

Behavior implemented:
- Updated `App.tsx` to resolve the selected playable case through `getPlayableStudentCaseModule(selectedLibraryCaseId)`.
- Changed the active student case id passed to `useStudentCaseState` so it comes from the registered playable module instead of directly from case-library `isUnlocked` metadata.
- Guarded investigation rendering so the `case` screen renders only when a playable module exists.
- Guarded `handleEnterStudentCase` so non-playable selected cases remain on their landing page instead of pushing/rendering the investigation screen.
- Guarded browser history `case` restoration so non-playable case ids are redirected to landing state, while `case-004` remains the default playable direct-entry case.
- Preserved Case 004 as the only case that can enter/render the investigation.
- Preserved locked/future case landing pages and disabled `Archive Locked` action.
- Added focused App coverage for Case 004 storage-key compatibility and for browser history attempts to restore locked/unknown cases into the investigation.
- Updated SSOT wording to state that App entry/render gating consumes the playable-case module registry and that case-library `isUnlocked` metadata alone is not sufficient.
- Refreshed tracked Understand graph artifacts after implementation and validation.

Validation:
- PASS: `npm run test --workspace apps/web -- --run src/App.test.tsx` (1 file / 60 tests).
- PASS: `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts` (1 file / 4 tests).
- PASS: `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx` (1 file / 7 tests).
- PASS: `npm run build --workspace apps/web`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=601`, `nodes=936`, `edges=335`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 601 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.
- PASS: `git diff --check` with CRLF working-copy warnings only.

Scope check:
- Allowed patterns:
  - `apps/web/src/App.tsx`
  - `apps/web/src/App.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/meta.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md`
- Modified files:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/App.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md`
- Out-of-scope files: none observed.

## Audit Results

### Audit Summary for WP-238

- **Work Package**: [WP-238-playable-case-module-gating-consumption.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md)
- **Repository**: `SequelCityWeb` ([App.tsx](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx))
- **SSOT**: [SSOT-Investigation-State-Architecture.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md)

---

### Verdict

**PASS**

---

### Verification Matrix & Criteria Audit

| Criteria | Result | Details |
| :--- | :---: | :--- |
| **Acceptance Criteria Satisfied** | **PASS** | All acceptance criteria outlined in [WP-238](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-238-playable-case-module-gating-consumption.md) were fulfilled. |
| **Allowed File Scope** | **PASS** | Modified/created files are strictly limited to the `Allowed:` list. |
| **Do Not Modify Boundaries** | **PASS** | All files in `Do Not Modify:` were preserved without edit. |
| **App.tsx Gating Consumption** | **PASS** | [App.tsx](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx) imports and consumes `getPlayableStudentCaseModule` for entry (`handleEnterStudentCase`), history state (`popstate`), active case ID derivation, and investigation view rendering. |
| **Case 004 Playable Status** | **PASS** | Case 004 remains the sole registered playable module and the only case allowed to enter or render the investigation view. |
| **Locked/Future/Unknown Case Isolation** | **PASS** | Non-playable cases cannot enter or render the investigation view via normal UI clicks or direct `popstate` browser navigation. |
| **Landing Page Preservation** | **PASS** | Locked/future landing pages remain visible with disabled action buttons intact. |
| **Case 004 Storage Key Compatibility** | **PASS** | `getStudentCaseStorageKey("case-004")` continues to map strictly to `STUDENT_CASE_STORAGE_KEY`. |
| **SSOT Alignment** | **PASS** | [SSOT-Investigation-State-Architecture.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md#L304) explicitly documents that app entry/render gating consumes the playable-case module registry and that `isUnlocked` metadata alone is not sufficient. |
| **Validation Commands** | **PASS** | All focused tests, Vite build, and Understand readiness/refresh scripts passed cleanly with 100% success. |
| **Graph Regeneration** | **PASS** | Tracked Understand graph artifacts were refreshed via `scripts/refresh-understand-graph.ps1`; readiness checks reported `READY` both before and after refresh, with zero transient trash/temp files left over. |

---

### Empirical Validation Results

1. **App Tests**: `npm run test --workspace apps/web -- --run src/App.test.tsx`
   - **Result**: PASSED (60 tests passed)
2. **Module Contract Tests**: `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts`
   - **Result**: PASSED (4 tests passed)
3. **State Upsert Tests**: `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`
   - **Result**: PASSED (7 tests passed)
4. **Web Application Build**: `npm run build --workspace apps/web`
   - **Result**: PASSED (`tsc -b && vite build` built clean in 195ms)
5. **Pre-refresh Understand Readiness**: `scripts/check-understand-refresh-readiness.ps1`
   - **Result**: `READY`
6. **Understand Graph Refresh**: `scripts/refresh-understand-graph.ps1`
   - **Result**: Completed (`601` files scanned, `936` nodes, `335` edges)
7. **Post-refresh Understand Readiness**: `scripts/check-understand-refresh-readiness.ps1`
   - **Result**: `READY`

---

### Summary of Audit Sections

- **Violations**: None.
- **Regressions**: None observed.
- **Missing tests or validation**: None. Full test suite and validation scripts executed and verified.
- **Scope drift risks**: None. Work is tightly scoped to playable-case module gating consumption in `App.tsx`, corresponding tests in `App.test.tsx`, SSOT documentation, and tracked Understand graph artifacts.

## Final Decision

Accepted on 2026-08-11 after AntiGravity audit reported PASS with no violations, regressions, missing validation, or scope drift risks. Proceed to closeout commit and push.
