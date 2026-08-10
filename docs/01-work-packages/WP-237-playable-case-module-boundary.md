# playable-case-module-boundary

## Objective

Define the code and SSOT boundary for a future playable case module so new cases can be added through an explicit contract instead of hard-coding another case into the existing Case 004 student state hook.

## Scope

### In Scope
- Add a narrow frontend TypeScript contract for playable case modules.
- Represent Case 004 as the only current playable case module at the contract level.
- Define the required module fields for:
  - case id
  - unlocked/playable status
  - authored library/landing metadata reference
  - milestone ids/schema reference
  - storage key strategy
  - persisted-state validation contract reference
  - initial/default student state factory reference
  - investigation-thread seed/storage contract reference
  - mentor/guidance/progression ownership notes
- Add focused tests for the contract shape and for preserving Case 004 as the only registered playable case.
- Update SSOT persistence/state architecture wording to describe the playable-case module boundary and what future cases must provide before becoming restorable/playable.
- Refresh tracked Understand graph artifacts after implementation because this package introduces an app-architecture contract and the current graph is structurally stale for this planning surface.

### Out of Scope
- Adding a new playable case.
- Unlocking any currently locked case.
- Moving Case 004 gameplay logic out of `studentCase.ts`.
- Refactoring `useStudentCaseState.ts`, `useInvestigationThreads.ts`, App routing, case library rendering, mentor guidance, query reinforcement, or evidence-board behavior.
- Changing Case 004 milestone, clue, suspect, answer, SQL, reward, guidance, progression, or visual behavior.
- Changing backend/API/database behavior, database migrations, answer-key data, restricted-table rules, SQL safety, account identity, cloud sync, runtime AI, package manifests, lockfiles, dependencies, generated app build output, or browser automation.
- Creating a broad case-module framework, router, registry service, or dynamic module loader beyond the narrow contract and current Case 004 registration.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `5b6697a2375b40a5dd53d9c19744de3506f77c89` (`Persist Case 004 student progress locally`), from `.understand-anything/meta.json`.
- Freshness assessment: Structurally stale for this planning surface. Accepted changes after the baseline include WP-236 app source changes in `apps/web/src/App.tsx`, `apps/web/src/useStudentCaseState.ts`, focused web tests, and `SSOT-Investigation-State-Architecture.md`; those changes materially affect the per-case persistence and playable-case boundary being planned here. Source inspection is therefore authoritative for planning, and the implementation package must refresh the tracked Understand graph after the contract change.
- Analysis performed: Read required workflow/planning docs, checked clean `main`, inspected recent commits and WP numbering, read graph metadata, confirmed graph artifacts exist, compared changed paths since graph baseline, searched graph/source for case library, case id, persistence, thread storage, and Case 004 symbols, and directly read `studentCaseLibrary.ts`, `useStudentCaseState.ts`, `useInvestigationThreads.ts`, and `studentCase.ts`.

### Affected Architecture
- Layers:
  - Frontend playable-case contract/module boundary.
  - Frontend student case library integration contract.
  - Frontend student progress persistence contract.
  - Frontend investigation-thread storage contract.
  - SSOT investigation state/persistence architecture.
  - Understand graph baseline.
- Primary files/components:
  - New narrow frontend module contract file, expected path: `apps/web/src/studentCaseModule.ts`.
  - New focused test file, expected path: `apps/web/src/studentCaseModule.test.ts`.
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`.
  - Tracked Understand graph artifacts.
- Upstream consumers:
  - Future case-module implementation packages.
  - `App.tsx`, which currently gates active persistence by selected unlocked case id.
  - `studentCaseLibrary.ts`, which owns locked/open case library metadata.
  - `useStudentCaseState.ts`, which currently validates and persists only Case 004 state.
  - `useInvestigationThreads.ts`, which currently uses Case 004 thread seeds and a Case 004 storage key.
- Downstream dependencies:
  - Case 004 constants and authored progression content in `studentCase.ts`.
  - Existing Case 004 library entry in `studentCaseLibrary.ts`.
  - Browser `localStorage` key conventions from WP-236.
  - Focused Vitest test runner in `apps/web`.

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts`
  - `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`
  - `npm run test --workspace apps/web -- --run src/App.test.tsx`
  - `npm run build --workspace apps/web`
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
  - `scripts/check-understand-refresh-readiness.ps1`
- User workflows:
  - Student opens the case library.
  - Student opens locked/future case landing pages.
  - Student enters Case 004 and resumes local progress.
  - Future developer adds a playable case through a defined contract rather than by duplicating Case 004 state behavior.
- Security/data boundaries:
  - No backend, database, answer-key, restricted-table, SQL execution, suspect-verification, account, cloud, or runtime AI authority changes.
  - Local browser persistence remains learner-owned convenience state only.
  - Locked/future cases remain non-playable and non-restorable.
  - No hidden suspect, answer-key, or spoiler values are introduced.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: The graph baseline is structurally stale for this planning surface because WP-236 changed app persistence architecture after the baseline. WP-237 is also planned to add a frontend architecture contract. The package can safely own the tracked graph artifacts, so graph refresh belongs in this originating WP after implementation and validation.

## Files Allowed to Change

Allowed:

- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-237-playable-case-module-boundary.md`

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.ts`
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

- Preserve current runtime behavior.
- Do not make any new case playable.
- Keep Case 004 as the only registered playable case.
- Do not move, rename, or refactor existing Case 004 logic.
- Do not modify App routing or the student state hook in this package.
- Do not add dependencies.
- Do not add runtime AI, external calls, database changes, package/lockfile changes, or generated app build output.
- Keep the contract explicit enough to guide the next playable-case implementation package, but do not build a speculative framework.
- Refresh Understand graph artifacts only after implementation validation and through the repository wrapper.

## Required Behavior

- Add a focused TypeScript module that defines:
  - `PlayableStudentCaseModule` or equivalent contract type.
  - a registered Case 004 module value.
  - a `PLAYABLE_STUDENT_CASE_MODULES` or equivalent registry containing only Case 004.
  - a helper such as `getPlayableStudentCaseModule(caseId)` that returns the module for Case 004 and `null` for locked/future/unknown cases.
- The module contract must explicitly name the boundaries a future playable case must provide before being enabled:
  - authored case metadata identity/reference
  - milestone id set/schema reference
  - initial/default persisted state factory reference
  - persisted-state validator reference
  - student progress storage key strategy/reference
  - investigation-thread seed/storage contract reference
  - mentor/guidance/progression ownership notes
- The Case 004 module must reference existing Case 004 constants and storage keys without changing their behavior.
- Tests must prove:
  - Case 004 is the only registered playable case.
  - unknown and currently locked case ids return no playable module.
  - the Case 004 module exposes the expected case id and storage key.
  - contract fields are present for persistence, validation, default state, milestones, thread storage, and guidance/progression ownership.
- SSOT must state that future playable cases cannot be enabled until their case module defines the required storage, validation, milestone, thread, and guidance contracts.
- After implementation and validation, refresh the tracked Understand graph artifacts with the repository wrapper and verify readiness before/after refresh.

## Acceptance Criteria

- [ ] A narrow frontend playable-case module contract exists.
- [ ] Case 004 is represented as the only current playable module.
- [ ] Locked/future/unknown case ids are not returned as playable modules.
- [ ] The module contract explicitly covers storage key, persisted-state validation, default state, milestone schema, investigation-thread storage/seed contract, library metadata identity, and guidance/progression ownership.
- [ ] Existing runtime behavior is unchanged; no App routing, state hook, library rendering, Case 004 progression, thread behavior, backend, database, package, lockfile, runtime AI, or generated app build output changes are introduced.
- [ ] SSOT documents the playable-case module boundary and future-case enablement requirements.
- [ ] Focused tests cover the contract and current Case 004-only registry.
- [ ] `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts` passes.
- [ ] `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx` passes.
- [ ] `npm run test --workspace apps/web -- --run src/App.test.tsx` passes.
- [ ] `npm run build --workspace apps/web` passes.
- [ ] Understand readiness passes before graph refresh.
- [ ] `scripts/refresh-understand-graph.ps1` completes successfully.
- [ ] Understand readiness passes after graph refresh.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-237 exactly as specified.

Start by reading:
- `docs/01-work-packages/WP-237-playable-case-module-boundary.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/studentCaseLibrary.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/features/investigationThreads/useInvestigationThreads.ts`

Implementation requirements:
- Keep changes limited to the allowed files.
- Add `apps/web/src/studentCaseModule.ts` and `apps/web/src/studentCaseModule.test.ts`.
- Define a narrow playable-case module contract and register only Case 004.
- Reference existing Case 004 constants and storage keys without moving or altering Case 004 behavior.
- Provide a helper that returns Case 004 for `case-004` and `null` for locked/future/unknown case ids.
- Update SSOT wording to explain that future playable cases must provide the module contract before being enabled.
- Do not modify App routing, student state hook behavior, case library rendering, investigation threads, `studentCase.ts`, package manifests, backend, database, or scripts.
- Run the required focused tests and web build.
- Run `scripts/check-understand-refresh-readiness.ps1`, then `scripts/refresh-understand-graph.ps1`, then `scripts/check-understand-refresh-readiness.ps1` again.
- Record Code Results with changed files, validation evidence, graph refresh evidence, and scope check.

Validation commands:
- `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts`
- `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`
- `npm run test --workspace apps/web -- --run src/App.test.tsx`
- `npm run build --workspace apps/web`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`

Return:
- Summary of changed files and behavior.
- Validation and graph-refresh commands run with results.
- Any blockers or follow-up needed.

## Audit Prompt

Audit WP-237 against the work package and SSOT.

Verify:
- All acceptance criteria are satisfied.
- Changed files are limited to the `Allowed:` list.
- `Do Not Modify:` boundaries were preserved.
- The new contract is narrow and does not introduce a broad speculative framework.
- Case 004 is the only registered playable module.
- Locked/future/unknown case ids are not returned as playable modules.
- The module contract covers metadata identity, milestone schema, storage key strategy, persisted-state validation, default state, investigation-thread contract, and guidance/progression ownership.
- No runtime behavior changed in App routing, state hook behavior, case library rendering, investigation threads, or Case 004 progression.
- No backend, database, restricted data, answer key, package, lockfile, dependency, runtime AI, external service, or generated app build output changes were introduced.
- SSOT wording matches the implemented contract and does not authorize a new playable case.
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
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-237-playable-case-module-boundary.md`

Behavior implemented:
- Added a narrow `PlayableStudentCaseModule` contract in `apps/web/src/studentCaseModule.ts`.
- Registered only Case 004 in `PLAYABLE_STUDENT_CASE_MODULES`.
- Added `getPlayableStudentCaseModule(caseId)` and `isRegisteredPlayableStudentCase(caseId)` helpers that return the Case 004 module only for `case-004` and reject locked/future/unknown/missing case ids.
- Represented the Case 004 module with references to existing Case 004 library metadata, milestone ids, student progress storage key, persisted-state validator/default-state factory contract references, investigation-thread storage/seed contract references, and guidance/progression ownership notes.
- Preserved existing runtime behavior by not modifying App routing, `useStudentCaseState.ts`, `studentCase.ts`, case library rendering, investigation-thread behavior, backend, database, package manifests, lockfiles, or generated app build output.
- Updated SSOT persistence/state architecture wording so future playable cases must define storage, validation, milestone, thread, and guidance contracts before they can become playable/restorable.
- Refreshed tracked Understand graph artifacts after implementation and validation.

Validation:
- PASS: `npm run test --workspace apps/web -- --run src/studentCaseModule.test.ts` (1 file / 4 tests).
- PASS: `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx` (1 file / 7 tests).
- PASS: `npm run test --workspace apps/web -- --run src/App.test.tsx` (1 file / 59 tests).
- PASS: `npm run build --workspace apps/web`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=600`, `nodes=935`, `edges=335`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 600 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.

Scope check:
- Allowed patterns:
  - `apps/web/src/studentCaseModule.ts`
  - `apps/web/src/studentCaseModule.test.ts`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/meta.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-237-playable-case-module-boundary.md`
- Modified files:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`
  - `apps/web/src/studentCaseModule.test.ts`
  - `apps/web/src/studentCaseModule.ts`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/01-work-packages/WP-237-playable-case-module-boundary.md`
- Out-of-scope files: none observed.

## Audit Results

I have scheduled a timer to wait for the test completion notification. I will update you as soon as the test task finishes.
I have scheduled a timer to wait for the App.test.tsx test execution. I will update you as soon as it completes.
I have scheduled a timer to wait for the Understand graph refresh script completion. I will update you as soon as it finishes.
### WP-237 Audit Report

### Verdict
**PASS**

---

### Audit Verification Summary

| Requirement / Checklist Item | Status | Findings / Evidence |
| :--- | :---: | :--- |
| **All Acceptance Criteria Satisfied** | **PASS** | Contract created, Case 004 registered as sole playable module, locked/future cases rejected, SSOT updated, all focused tests, web build, and Understand readiness checks passed. |
| **Changed Files Limited to Allowed List** | **PASS** | Only 8 allowed files changed (`studentCaseModule.ts`, `studentCaseModule.test.ts`, `SSOT-Investigation-State-Architecture.md`, 4 `.understand-anything` JSON files, and `WP-237-playable-case-module-boundary.md`). |
| **`Do Not Modify:` Boundaries Preserved** | **PASS** | Zero changes to `App.tsx`, `useStudentCaseState.ts`, `studentCaseLibrary.ts`, `studentCase.ts`, `useInvestigationThreads.ts`, `apps/api/**`, `database/**`, `package.json`, `package-lock.json`, or `scripts/**`. |
| **Narrow Contract (No Speculative Framework)** | **PASS** | `studentCaseModule.ts` is lightweight (~120 lines), defining explicit type interfaces and static references to existing Case 004 exports without dynamic class loaders or speculative framework abstractions. |
| **Case 004 Sole Registered Playable Module** | **PASS** | `PLAYABLE_STUDENT_CASE_MODULES` contains only `CASE_004_PLAYABLE_MODULE`. |
| **Locked/Future/Unknown Case Handling** | **PASS** | `getPlayableStudentCaseModule()` returns `null` and `isRegisteredPlayableStudentCase()` returns `false` for `case-001`, `case-006`, `case-999`, `null`, and `undefined`. |
| **Module Contract Coverage** | **PASS** | Contract explicitly specifies library metadata identity, milestone schema, storage key strategy, persisted-state validator, default state factory, investigation-thread storage/seed contracts, and guidance/progression ownership. |
| **No Runtime Behavior Changes** | **PASS** | App routing, state hook behavior, case library rendering, investigation threads, and Case 004 progression logic remain completely untouched. |
| **No Unintended Side Effects / External Changes** | **PASS** | No backend, database, restricted data, answer key, package manifest, lockfile, external service, runtime AI, or build output changes were introduced. |
| **SSOT Wording Alignment** | **PASS** | [`SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md#L302-L315) accurately documents the module boundary requirements and confirms only `case-004` is registered. |
| **Required Verification Commands Executed** | **PASS** | All unit tests, App integration tests, web build, pre-refresh readiness, graph refresh, and post-refresh readiness passed cleanly. |
| **Graph Regeneration Followed** | **PASS** | Tracked graph artifacts (`knowledge-graph.json`, `fingerprints.json`, `meta.json`, `scan-result.json`) updated as expected. Readiness script confirmed zero transient trash, temp, or log artifacts remained. |

---

### Execution & Test Validation Results

- **`src/studentCaseModule.test.ts`**: PASS (1 file, 4 passed)
- **`src/useStudentCaseState.upsert.test.tsx`**: PASS (1 file, 7 passed)
- **`src/App.test.tsx`**: PASS (1 file, 59 passed)
- **`npm run build --workspace apps/web`**: PASS (built cleanly in 463ms)
- **Pre-refresh Understand Readiness**: `READY` (`check-understand-refresh-readiness.ps1`)
- **Understand Graph Refresh**: Success (`filesScanned=600`, `nodes=935`, `edges=335`, `layers=6`, `tourSteps=7`)
- **Post-refresh Understand Readiness**: `READY` (`check-understand-refresh-readiness.ps1`)

---

### Violations
**None**

---

### Regressions
**None**

---

### Missing Tests or Validation
**None**

---

### Scope Drift Risks
**None** ΓÇö Implementation strictly follows the WP-237 specification boundary.
The late background task search (`task-53`) has also completed, confirming the location of WP-237 in `D:\GitHub-Repos\SequelCityWeb`.

As reported above, the formal audit of WP-237 is complete:
- **Verdict**: **PASS**
- **Violations**: None
- **Regressions**: None
- **Missing tests or validation**: None
- **Scope drift risks**: None

## Final Decision

Accepted on 2026-08-10 after AntiGravity re-audit reported PASS with no violations, regressions, missing validation, or scope drift risks. Proceed to closeout commit and push.





