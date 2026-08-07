# student-case-keyed-persistence-contract

## Objective

Generalize the existing learner-owned browser progress persistence from a Case 004-only storage key to a case-id keyed local storage contract that preserves current Case 004 resume behavior and does not create playable progress for locked or future cases.

## Scope

### In Scope
- Define and implement the frontend local storage key/envelope contract for persisted student case progress by case id.
- Preserve migration compatibility for the current `sequel-city.case-004.student-state.v1` Case 004 storage key.
- Keep Case 004 as the only currently restorable playable case state.
- Define common persisted student progress fields versus Case 004-specific validation fields in code and SSOT wording.
- Ensure locked/future case library entries do not hydrate or write investigation progress.
- Define reset/clear semantics at the helper level only: malformed, unsupported, wrong-version, locked, or future-case state is ignored without deleting unrelated storage.
- Add focused tests for valid Case 004 restore, legacy key migration compatibility, wrong-case isolation, malformed/wrong-version rejection, and locked/future case non-persistence.

### Out of Scope
- Backend persistence, accounts, server sync, database writes, query history persistence, or multi-user isolation.
- New playable cases or new case modules.
- Case 004 milestone, clue, suspect, answer, guidance, SQL, reward, or progression changes.
- Student UI redesign, new controls, new visible reset button, or copy polish unrelated to persistence.
- New dependencies, package or lockfile changes, build output, generated assets, or runtime AI behavior.
- Deleting learner storage automatically beyond replacing/migrating the owned Case 004 progress payload when implementation requires it.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `5b6697a2375b40a5dd53d9c19744de3506f77c89` (`Persist Case 004 student progress locally`), from `.understand-anything/meta.json`.
- Freshness assessment: Usable with non-structural drift for this product-facing persistence scope. Commits after the baseline touch audit-runner skill/docs/scripts/tests, workflow docs, handoff, graph artifacts, and WP-235 records. They do not touch app source, app tests, database structure, restricted data boundaries, package manifests, lockfiles, or Case 004 progression source. Source inspection is still authoritative.
- Analysis performed: Read workflow requirements, inspected git branch/status/recent commits, compared changed paths from graph baseline to `HEAD`, searched graph and source for storage/case/library/progression references, and verified relevant files/tests with `rg` and direct reads.

### Affected Architecture
- Layers:
  - Frontend student state hook and persistence helpers.
  - Frontend case-library routing/integration.
  - SSOT investigation-state persistence expectations.
  - Frontend unit/integration tests.
- Primary files/components:
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/App.tsx`
  - `apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `apps/web/src/App.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- Upstream consumers:
  - `App.tsx`, which currently calls `useStudentCaseState(mode)` while student mode can be on library, landing, locked-case landing, or active case screens.
  - Student Case Library and Case Landing flow, which select locked and unlocked case ids.
  - Tests and browser helpers that seed or inspect student state.
- Downstream dependencies:
  - Browser `localStorage`.
  - Case 004 constants and milestone validation in `studentCase.ts`.
  - Suspect verification response shape from `apps/web/src/api/types.ts`.
  - Schema loading through `getSchemaTables` when student investigation mode is active.

### Regression Surface
- Related tests:
  - `npm run test -- --run apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `npm run test -- --run apps/web/src/App.test.tsx`
  - `npm run build`
  - Optional if integration risk is discovered: `npm run test:browser -- --grep "locked cases|Case 004|student progress"` or the repository's current browser-test equivalent.
- User workflows:
  - Student opens Sequel Detective to the case library.
  - Student opens locked/future case landing pages without entering an investigation.
  - Student enters Case 004, progresses, refreshes, and resumes.
  - Student returns to the case library and later re-enters Case 004.
  - Student has malformed, stale, legacy, or wrong-case local storage.
- Security/data boundaries:
  - Persistence remains learner-owned browser convenience state only.
  - No backend evidence authority, SQL execution authority, query history authority, suspect verification authority, answer-key exposure, database writes, account identity, cloud sync, runtime AI, or multi-user isolation is introduced.
  - Locked/future cases must not become playable or gain hydrated progress through local storage.

### Graph Update Decision
- Regeneration required: No, unless implementation expands beyond the allowed integration surface by adding new modules/import layers or changing Case 004 progression architecture.
- Rationale: This package is allowed to adjust existing frontend state persistence helpers, one existing App integration point, focused tests, one SSOT persistence section, and the WP record. It should not alter app architecture/import topology, database structure, restricted-data boundaries, package dependencies, or Case 004 progression. If the implementer discovers that a new shared persistence module or broader case-module architecture is required, stop and request a follow-up WP instead of expanding this one.

## Files Allowed to Change

Allowed:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/src/App.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md`

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/api/**`
- `database/**`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/studentCaseLibrary.ts`
- `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
- `apps/web/src/components/student/StudentCaseLandingPage.tsx`
- `apps/web/src/features/**`
- `apps/web/tests/browser/**`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `.understand-anything/**`
- `scripts/**`
- `.codex/skills/**`
- Generated build outputs, coverage, screenshots, videos, traces, and `apps/web/test-results/**`

## Constraints

- Preserve existing Case 004 resume behavior for valid current persisted state.
- Preserve compatibility with the existing legacy key `sequel-city.case-004.student-state.v1`.
- Keep storage local to the browser and convenience-only.
- Keep the student storage envelope versioned and explicit.
- Do not treat local storage as authoritative evidence, milestone authority, query execution proof, suspect verification proof, or account identity.
- Do not make locked or future cases playable.
- Do not add a visible reset/clear UI in this package.
- Do not add dependencies or change package manifests/lockfiles.
- Do not refactor unrelated student state, query runner, mentor, evidence-board, or case-library code.
- If a broader case-module abstraction becomes necessary, stop and record the need for a follow-up package instead of widening this scope.

## Required Behavior

- Introduce a storage-key strategy that derives the current student progress storage key from a case id.
- The current Case 004 key must remain supported either as the canonical key for Case 004 or through a tested legacy-read/migration path.
- Persisted envelopes must include at minimum:
  - explicit version
  - case id
  - persisted state payload
- Hydration must reject:
  - malformed JSON
  - unsupported versions
  - missing or non-string case ids
  - envelopes whose case id does not match the requested active case id
  - locked/future case ids
  - invalid Case 004 state payloads
- Writing must occur only for the active unlocked playable case. In current source, that means Case 004 investigation mode only.
- Common learner-owned fields must remain clearly separated from Case 004-specific validation assumptions. At minimum, document in code or SSOT that the current persisted payload contains common frontend progress fields but validates them against Case 004 milestones, views, pending evidence steps, and suspect-theory response shape.
- Locked/future case landing pages must not hydrate Case 004 state under their case ids and must not write default progress entries.
- Reset/clear semantics must be explicit: invalid or unsupported data is ignored and the app falls back to authored defaults; this package does not add broad localStorage clearing or a user-facing reset control.
- Storage failures must remain non-fatal; gameplay continues in memory when browser storage is unavailable or write fails.

## Acceptance Criteria

- [ ] Valid Case 004 persisted state still restores after reload using the supported Case 004 storage key path.
- [ ] Existing legacy Case 004 storage seeded at `sequel-city.case-004.student-state.v1` remains compatible.
- [ ] Wrong-case, unsupported-version, and malformed envelopes are ignored and authored defaults are used.
- [ ] Locked/future case ids do not hydrate or write investigation progress.
- [ ] The implementation does not add backend, database, account, cloud sync, runtime AI, dependency, package, lockfile, graph, or generated-output changes.
- [ ] SSOT persistence wording reflects the case-id keyed local browser contract and its limits.
- [ ] Focused tests cover restore, migration/compatibility, wrong-case rejection, malformed/wrong-version rejection, and locked/future non-persistence.
- [ ] `npm run test -- --run apps/web/src/useStudentCaseState.upsert.test.tsx` passes.
- [ ] `npm run test -- --run apps/web/src/App.test.tsx` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-236 exactly as specified.

Start by reading:
- `docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/src/App.test.tsx`

Implementation requirements:
- Keep the change narrow and limited to the allowed files.
- Add a case-id keyed local storage contract for student progress without adding new modules or dependencies.
- Preserve compatibility with `sequel-city.case-004.student-state.v1`.
- Ensure `useStudentCaseState` only hydrates/writes progress for the currently active unlocked playable case. If changing the hook signature is the smallest safe integration, update only the App call site and focused test harnesses.
- Reject unsupported cases, locked/future cases, wrong-case envelopes, malformed payloads, and unsupported versions without throwing.
- Update SSOT persistence wording to describe the new local browser contract and limits.
- Add or update focused tests for the acceptance criteria.

Validation commands:
- `npm run test -- --run apps/web/src/useStudentCaseState.upsert.test.tsx`
- `npm run test -- --run apps/web/src/App.test.tsx`
- `npm run build`

Return:
- Summary of changed files and behavior.
- Validation commands run and results.
- Any blocked validation or follow-up needed.

## Audit Prompt

Audit WP-236 against the work package and SSOT.

Verify:
- All acceptance criteria are satisfied.
- Changed files are limited to the `Allowed:` list.
- `Do Not Modify:` boundaries were preserved.
- Valid Case 004 persisted state still restores.
- Legacy Case 004 storage compatibility is preserved.
- Wrong-case, unsupported-version, malformed, locked, and future-case storage paths are rejected without throwing.
- Locked/future case landing flows do not write or restore investigation progress.
- Persistence remains learner-owned browser convenience state only and does not become backend evidence, milestone authority, query execution authority, suspect verification authority, account identity, cloud sync, runtime AI, or multi-user isolation.
- No Case 004 milestone, clue, answer, SQL, reward, guidance, or progression behavior changed.
- SSOT wording matches the implementation and does not authorize speculative persistence infrastructure.
- Required tests and build were run, or any blocked validation is clearly recorded.
- Graph regeneration decision was followed; no `.understand-anything/**` files changed.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Missing tests or validation
- Scope drift risks

## Code Results

Implemented by Codex.

Changed files:
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/src/App.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md`

Behavior implemented:
- Added `getStudentCaseStorageKey(caseId)` so student progress storage is derived from case id while preserving the current Case 004 key `sequel-city.case-004.student-state.v1`.
- Restricted hydration and writes to the currently active playable case id. In current source, only `case-004` is playable.
- Updated `App.tsx` to pass a persistence case id only when the student is inside the unlocked Case 004 investigation; library and locked/future landing screens pass `null`.
- Added a hydration guard for the always-mounted hook so entering Case 004 from the library can restore persisted progress without first writing default state over it.
- Rejected unsupported case ids, wrong-case envelopes, missing/non-string case ids, unsupported versions, malformed JSON, and invalid Case 004 payloads by falling back to authored defaults.
- Preserved non-fatal storage behavior when local storage is unavailable or write fails.
- Updated SSOT persistence wording for case-id keyed local browser storage, Case 004-specific validation, locked/future case behavior, and reset/clear limits.

Validation:
- `npm run test -- --run apps/web/src/useStudentCaseState.upsert.test.tsx`: BLOCKED at repo root because there is no root `test` script.
- `npm run test --workspace apps/web -- --run apps/web/src/useStudentCaseState.upsert.test.tsx`: BLOCKED because Vitest resolves filters relative to `apps/web`; repo-relative path found no test files.
- `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx`: PASS, 1 file / 7 tests.
- `npm run test --workspace apps/web -- --run src/App.test.tsx`: PASS, 1 file / 59 tests.
- `npm run build --workspace apps/web`: PASS.
- `npm run build`: PASS; note this root script builds `apps/api` only. It touched tracked API `dist` output during validation, and those generated artifacts were restored afterward because they are outside WP-236 scope.

Scope check:
- Allowed patterns:
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/App.tsx`
  - `apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `apps/web/src/App.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md`
- Modified files:
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/App.tsx`
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md`
- Out-of-scope files: none after restoring root-build API `dist` artifacts.

## Audit Results

### Audit Report: WP-236 (Student-Case Keyed Persistence Contract)

**Verdict:** **PASS**

---

### Detailed Checklist Verification

| Verification Requirement | Status | Details |
| :--- | :---: | :--- |
| **Acceptance Criteria Satisfied** | **PASS** | All criteria from [`WP-236-student-case-keyed-persistence-contract.md`](file:///d:/github-repos/sequelcityweb/docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md) were met and validated. |
| **Allowed Files List Adherence** | **PASS** | Only files from the `Allowed:` list were modified or added. |
| **`Do Not Modify:` Boundaries** | **PASS** | No changes occurred in `apps/api/**`, `database/**`, `apps/web/src/studentCase.ts`, `.understand-anything/**`, or `package.json` / `package-lock.json`. |
| **Case 004 Restorability** | **PASS** | Valid Case 004 state restores via `getStudentCaseStorageKey("case-004")`, returning `sequel-city.case-004.student-state.v1`. |
| **Legacy Case 004 Storage Compatibility** | **PASS** | `STUDENT_CASE_STORAGE_KEY` is preserved and maps directly to the canonical key for Case 004. |
| **Rejection of Invalid Storage Envelopes** | **PASS** | `hydrateStudentCaseState` safely returns `null` for wrong-case IDs, unsupported envelope versions, malformed JSON, and missing fields without throwing. |
| **Locked/Future Case Non-Persistence** | **PASS** | `App.tsx` passes `null` as the active case ID when on library or locked/future case landing screens, preventing reads/writes for locked/future cases. |
| **Learner-Owned Convenience Boundary** | **PASS** | Persistence remains restricted to browser `localStorage` and is treated as non-authoritative convenience state. |
| **Case 004 Progression Integrity** | **PASS** | No milestone, clue, answer, SQL, reward, or guidance logic was altered. |
| **SSOT Wording Alignment** | **PASS** | Updated [`SSOT-Investigation-State-Architecture.md`](file:///d:/github-repos/sequelcityweb/docs/00-ssot/SSOT-Investigation-State-Architecture.md) accurately documents the case-id keyed local storage contract, Case 004-specific validation scope, and reset semantics. |
| **Required Tests & Build Verification** | **PASS** | Executed all required test suites and build scripts successfully. |
| **Graph Regeneration Decision** | **PASS** | No `.understand-anything/**` files were created or modified. |

---

### Audit Output Sections

#### Violations
- **None.** All code changes and documentation edits strictly comply with the WP-236 specifications and project guidelines.

#### Regressions
- **None detected.** All 59 tests in [`App.test.tsx`](file:///d:/github-repos/sequelcityweb/apps/web/src/App.test.tsx) and 7 tests in [`useStudentCaseState.upsert.test.tsx`](file:///d:/github-repos/sequelcityweb/apps/web/src/useStudentCaseState.upsert.test.tsx) passed.

#### Missing Tests or Validation
- **None.** Test coverage includes:
  - Key derivation and legacy key preservation
  - Valid Case 004 restore from local storage
  - Wrong-case envelope rejection
  - Unsupported version and missing case ID rejection
  - Malformed JSON fallback to authored defaults
  - Prevention of progress writes/hydration for locked/future cases

#### Scope Drift Risks
- **None.** The implementation adds no speculative backend sync, multi-user isolation, user accounts, or extra abstraction layers.

---

### Validation Command Results

1. **Upsert Tests:**
   ```powershell
   npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx
   ### Result: 1 passed (7 tests)
   ```

2. **App Suite Tests:**
   ```powershell
   npm run test --workspace apps/web -- --run src/App.test.tsx
   ### Result: 1 passed (59 tests)
   ```

3. **Web Build:**
   ```powershell
   npm run build --workspace apps/web
   ### Result: Built cleanly in 209ms (dist/ assets generated)
   ```

---

### Modified Files Reviewed
- [`useStudentCaseState.ts`](file:///d:/github-repos/sequelcityweb/apps/web/src/useStudentCaseState.ts)
- [`App.tsx`](file:///d:/github-repos/sequelcityweb/apps/web/src/App.tsx)
- [`useStudentCaseState.upsert.test.tsx`](file:///d:/github-repos/sequelcityweb/apps/web/src/useStudentCaseState.upsert.test.tsx)
- [`App.test.tsx`](file:///d:/github-repos/sequelcityweb/apps/web/src/App.test.tsx)
- [`SSOT-Investigation-State-Architecture.md`](file:///d:/github-repos/sequelcityweb/docs/00-ssot/SSOT-Investigation-State-Architecture.md)
- [`WP-236-student-case-keyed-persistence-contract.md`](file:///d:/github-repos/sequelcityweb/docs/01-work-packages/WP-236-student-case-keyed-persistence-contract.md)

## Final Decision

Accepted on 2026-08-07 after completed audit.

Reason: Human reviewer accepted WP-236 after audit recorded verdict `PASS` with no violations, regressions, missing validation, or scope drift risks. The package satisfies its objective by generalizing learner-owned browser progress persistence to a case-id keyed local storage contract while preserving the existing Case 004 key, rejecting wrong-case and unsupported storage envelopes, preventing locked/future cases from hydrating or writing investigation progress, updating focused tests and SSOT wording, and preserving backend, database, account, cloud sync, runtime AI, dependency, package/lockfile, graph, generated-output, and Case 004 progression boundaries.


