# WP-234 - Student Case Local State Persistence

## Objective

Persist learner-owned Case 004 frontend progress across browser refreshes in the local runtime without changing backend authority, SQL safety, suspect verification, or deterministic progression boundaries.

## Scope

### In Scope
- Add local-only browser storage for the active student case view, queued draft query, Samuel step, completed milestone map, pending evidence step, notebook entries, notebook page placement, earned case-review IDs, suspect theory draft/result display state, and other learner-facing frontend case progress already owned by `useStudentCaseState`.
- Hydrate persisted state defensively so malformed, stale, or partial storage falls back to the authored Case 004 defaults.
- Persist only student-mode case progress; developer/admin mode behavior must remain unchanged.
- Preserve the existing investigation thread storage behavior and prune behavior.
- Update current-state documentation so the release-readiness limitation no longer claims all notebook/case progress is memory-only after this package is implemented.
- Refresh tracked Understand graph artifacts after implementation because this package changes app source and current-state documentation.

### Out of Scope
- Backend persistence.
- Database schema, migrations, seed data, bootstrap scripts, SQL Server accounts, or query-history persistence.
- Authentication, authorization, multi-user isolation, account/session models, cloud sync, or production storage.
- Changing SQL safety validation, query execution authority, suspect verification authority, or answer-key access.
- Runtime AI behavior or any AI-assisted gameplay authority.
- Case 004 milestone definitions, clue requirements, hidden suspect identities, authored solution values, or progression shortcuts.
- UI redesign beyond any minimal copy required to keep documentation accurate.
- Investigation thread model rewrites or storage key migrations outside compatibility-safe hydration.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `95b27fd8b0db9ae91fc12524a96e8a5436d60721`.
- Freshness assessment: Usable with non-structural drift for this product-facing plan. `HEAD` is `073c8c1c0a9218145a305057d8587b6306ed98e4`; changed paths since the baseline are WP-233 workflow/script/test/docs graph-refresh artifacts, not app source, database structure, restricted data boundaries, or Case 004 progression.
- Analysis performed: Targeted graph search for `useStudentCaseState`, `useInvestigationThreads`, `StudentEvidenceBoardView`, `StudentWorkbenchView`, `QueryRunner`, `localStorage`, `notebookEntries`, and `completedMilestones`; source verification with `rg`; SSOT/release-doc verification against `SSOT-Investigation-State-Architecture.md`, `SSOT-Case-Progression.md`, `known-limitations.md`, and `release-readiness-checklist.md`.

### Affected Architecture
- Layers: frontend student runtime state, frontend persistence helper logic, student-mode tests, current-state documentation, Understand graph artifacts.
- Primary files/components:
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
  - `docs/09-release-readiness/known-limitations.md`
  - `docs/09-release-readiness/release-readiness-checklist.md`
- Upstream consumers:
  - `apps/web/src/App.tsx` consumes `useStudentCaseState` and passes restored state into student views.
  - `apps/web/src/features/investigationThreads/useInvestigationThreads.ts` consumes notebook entry IDs from restored notebook state and already persists thread notes/links separately.
  - Student view components render notebook entries, milestones, draft query, guidance, suspect theory state, and current case view derived from the hook.
- Downstream dependencies:
  - Browser `window.localStorage` only.
  - Existing authored Case 004 defaults from `studentCase.ts`.
  - Existing frontend API contracts for schema loading, query execution, and suspect verification.

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web -- App.test.tsx`
  - `npm run test --workspace apps/web -- useStudentCaseState.upsert.test.tsx`
  - `npm run test --workspace apps/web -- features/investigationThreads/threadState.test.ts features/investigationThreads/threadVisibility.test.ts features/investigationThreads/CurrentInvestigationFocusCard.test.tsx`
  - `npm run test --workspace apps/web`
  - `npm run build --workspace apps/web`
- User workflows:
  - Student opens Case 004, logs notebook evidence, switches views, refreshes or revisits the page, and sees learner-owned progress restored.
  - Student resumes with the same current case view and queued draft query when stored data is valid.
  - Student still relies on backend query execution and suspect verification for evidence and correctness.
  - Admin/developer mode continues to expose diagnostics without becoming authoritative gameplay state.
- Security/data boundaries:
  - Persisted frontend state is convenience state, not authoritative evidence or correctness proof.
  - No restricted tables, answer keys, hidden solution rows, database credentials, API secrets, or backend query-history records may be stored by this package.
  - Malformed storage must not crash the app, advance hidden progression, bypass verification, or reveal solution values.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: Planned changes touch app source and current-state SSOT/release documentation. Include tracked graph artifacts in this originating package and refresh them after implementation before audit.

## Files Allowed to Change

Allowed:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/09-release-readiness/known-limitations.md`
- `docs/09-release-readiness/release-readiness-checklist.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-234-student-case-local-state-persistence.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `tools/**`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `apps/web/src/api/**`
- `apps/web/src/features/investigationThreads/**`
- `apps/web/src/studentCase.ts`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`

## Constraints

- Preserve existing behavior unless explicitly changing it.
- No new dependencies.
- No package or lockfile changes.
- No backend, database, API, SQL safety, or suspect verification changes.
- No runtime AI behavior.
- No solution leakage, hidden suspect naming, or answer-key persistence.
- No progression shortcut: restored state may display learner-owned progress, but it must not execute queries, verify suspects, or mark new milestones by itself.
- Storage must be best-effort and local-only; unavailable storage, quota errors, invalid JSON, or malformed values must fall back gracefully.
- Hydration must merge against authored defaults so added future milestones or fields do not break older stored payloads.
- Documentation updates must describe current localStorage convenience persistence without overstating production readiness, multi-device sync, user accounts, or authoritative backend persistence.

## Required Behavior

- `useStudentCaseState` initializes student-mode learner progress from a versioned Case 004 localStorage payload when one is valid.
- The hook writes relevant learner-owned state changes back to localStorage after state changes settle.
- The persisted payload must include enough state to restore meaningful learner progress after refresh:
  - current student view
  - selected student table when safe to restore
  - student draft query
  - last visible student query execution only if it is already frontend response state and does not contain restricted hidden data
  - preserved transcript execution when already visible to the learner
  - completed milestone map
  - Samuel step
  - notebook entries and notebook page placement
  - pending evidence step
  - manual notebook draft
  - earned case-review IDs and current case-review display state
  - suspect theory draft and last successful visible verification response/error/loading-safe display fields where appropriate
- Persisted state must not include schema metadata, API credentials, backend health data, database configuration, hidden solution-table data, or any non-student admin/developer diagnostic state.
- Hydration must validate primitive shapes, known milestone keys, known student views, known pending evidence steps, notebook entry shape, and arrays before using stored data.
- Malformed or incompatible storage must be ignored without throwing.
- Existing student flow tests must continue to pass.
- Add focused test coverage that proves valid persisted learner state restores and malformed storage falls back to defaults.
- Update current-state docs to distinguish:
  - frontend learner case progress and notebook entries now persist locally in the browser
  - backend query history remains in-memory
  - no authenticated, multi-user, cloud, or backend gameplay persistence exists
- Refresh Understand graph artifacts after implementation and record the refresh in Code Results.

## Acceptance Criteria

- [ ] Student-mode learner progress restores from a valid versioned localStorage payload after reload or hook remount.
- [ ] Invalid, malformed, stale, or partial localStorage payloads do not crash the app and fall back or merge to authored defaults.
- [ ] Restored state does not execute SQL, call suspect verification, mark new milestones, or alter backend authority by itself.
- [ ] No backend, database, API, package, lockfile, workflow script, or repo-skill files are changed.
- [ ] Documentation accurately reflects local browser persistence while preserving current limitations for backend query history, production persistence, accounts, and multi-user isolation.
- [ ] Focused student-state persistence tests pass.
- [ ] `npm run test --workspace apps/web` passes.
- [ ] `npm run build --workspace apps/web` passes.
- [ ] Understand graph artifacts are refreshed after implementation, with no transient `.understand-anything/.trash-*`, temp, or log artifacts committed.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-234 exactly as specified.

Before editing:
- Confirm `git status --short --branch --untracked-files=all`.
- Review the current `useInvestigationThreads` localStorage pattern and preserve its compatibility.
- Review `SSOT-Investigation-State-Architecture.md`, `known-limitations.md`, and `release-readiness-checklist.md` so documentation updates remain narrow.

Implementation:
- Add versioned, defensive localStorage persistence to `apps/web/src/useStudentCaseState.ts` for learner-owned Case 004 frontend progress.
- Keep storage local-only, best-effort, and non-authoritative.
- Validate and merge hydrated state against existing authored defaults.
- Do not persist backend-owned schema metadata, backend query-history records, credentials, restricted data, or developer/admin diagnostic state.
- Add focused tests in the allowed app test files for valid restore and malformed-storage fallback.
- Update only the allowed documentation files to reflect the new current-state boundary.
- Refresh tracked Understand graph artifacts after implementation because app source and current-state docs changed.

Validation:
- Run `npm run test --workspace apps/web -- App.test.tsx`.
- Run `npm run test --workspace apps/web -- useStudentCaseState.upsert.test.tsx`.
- Run `npm run test --workspace apps/web`.
- Run `npm run build --workspace apps/web`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before and after graph refresh.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`.
- Run `git diff --check`.

Return:
- Exact files changed.
- Tests and graph-refresh commands run with results.
- Any storage fallback or documentation limitations that remain.

## Audit Prompt

Audit WP-234 against the work package, SSOT, source, tests, and changed files.

Verify:
- All acceptance criteria are satisfied.
- Only allowed files were modified.
- No backend, database, API, package, lockfile, workflow script, repo-skill, or restricted-data boundary changes were made.
- Persistence remains local-only, best-effort, and frontend learner-owned.
- Hydration is defensive and malformed storage cannot crash the app or advance hidden progression.
- Restored state does not execute SQL, call suspect verification, decide correctness, or become authoritative evidence.
- Documentation accurately distinguishes local browser convenience persistence from backend/query-history/production/account persistence.
- Related app tests and build evidence are recorded.
- Graph regeneration decision was followed and generated artifacts contain no temp/trash/log output.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

Implemented WP-234 within the allowed scope.

Files changed:
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/09-release-readiness/known-limitations.md`
- `docs/09-release-readiness/release-readiness-checklist.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-234-student-case-local-state-persistence.md`

Implemented behavior:
- Added versioned Case 004 student-state localStorage persistence behind `STUDENT_CASE_STORAGE_KEY`.
- Hydrates student-mode state only, with defensive validation for student view, pending evidence step, completed milestone map, notebook entries, feedback tone, case-review status, visible query execution payloads, and visible suspect verification result payloads.
- Merges stored milestone state against authored defaults so partial or future-stale payloads do not remove expected milestone keys.
- Keeps storage best-effort and local-only; malformed JSON, invalid shapes, unavailable storage, and quota/write failures fall back to in-memory defaults without throwing.
- Persists learner-owned frontend progress only: current view, selected table, draft query, visible query payloads, milestone display state, Samuel step, notebook entries, pending evidence step, learner feedback display, manual notebook draft, earned check-in IDs, and visible suspect-theory display state.
- Does not persist schema metadata, backend query-history records, credentials, database config, admin/developer diagnostic state, or hidden answer-key data.
- Added focused restore and malformed-storage fallback tests.
- Updated current-state documentation to distinguish local browser learner-progress persistence from backend query-history, account, cloud, cross-device, multi-user, and production persistence.
- Refreshed tracked Understand graph artifacts after implementation.

Validation:
- PASS: `npm run test --workspace apps/web -- useStudentCaseState.upsert.test.tsx` (`1 passed`, `3 passed`)
- PASS: `npm run test --workspace apps/web -- features/investigationThreads/threadState.test.ts features/investigationThreads/threadVisibility.test.ts features/investigationThreads/CurrentInvestigationFocusCard.test.tsx` (`3 passed`, `18 passed`)
- PASS: `npm run test --workspace apps/web -- App.test.tsx` (`1 passed`, `59 passed`)
- PASS: `npm run test --workspace apps/web` (`14 passed`, `182 passed`)
- PASS: `npm run build --workspace apps/web`
- PASS: pre-refresh `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` reported `READY`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` reported `filesScanned=595`, `nodes=926`, `edges=331`, `layers=6`, `tourSteps=7`, and `fingerprints baseline=595 files`
- PASS: post-refresh `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` reported `READY`

Notes:
- `npm run build --workspace apps/web` initially exposed missing `bootstrap.identity` fields in allowed test fixtures plus one validator narrowing issue. Those were corrected before final validation.
- Local browser persistence remains convenience state only. Backend query history is still in-memory, and no production/account/cross-device persistence is implemented.

## Audit Results

Verdict: PASS

---

### Audit Verification Summary

| Criteria / Boundary | Status | Empirical Evidence |
| :--- | :--- | :--- |
| **Acceptance Criteria** | **Satisfied** | All 10 acceptance criteria in [`WP-234-student-case-local-state-persistence.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-234-student-case-local-state-persistence.md#L149-L160) are verified satisfied. |
| **Allowed Files** | **Satisfied** | Only allowed files were modified. No disallowed paths were touched. |
| **Protected Boundaries** | **Satisfied** | No changes to `apps/api/**`, `database/**`, `scripts/**`, `.codex/skills/**`, `tools/**`, `package.json`, or `package-lock.json`. |
| **Local-Only & Best-Effort** | **Satisfied** | [`useStudentCaseState.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts#L481-L510) uses versioned `localStorage` (`sequel-city.case-004.student-state.v1`) wrapped in `try...catch` blocks with debounced persistence (120ms). Storage failures fall back gracefully to in-memory defaults without throwing. |
| **Defensive Hydration** | **Satisfied** | `hydrateStudentCaseState` rigorously validates primitive shapes, enum/view sets ([`VALID_STUDENT_VIEWS`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts#L116), [`VALID_PENDING_EVIDENCE_STEPS`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts#L117-L124)), milestone keys, query response columns, and notebook entry schemas before restoring. Malformed or partial payloads fall back to authored Case 004 defaults. |
| **Non-Authoritative Execution** | **Satisfied** | Hydration only populates React hook state for UI display. Restored state does not execute SQL, call `verifySuspect()`, decide correctness, mark unearned milestones, or expose restricted answer-key data. |
| **Documentation Integrity** | **Satisfied** | [`SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md#L289-L300), [`known-limitations.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/09-release-readiness/known-limitations.md#L13-L17), and [`release-readiness-checklist.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/09-release-readiness/release-readiness-checklist.md#L34-L37) accurately distinguish local browser convenience persistence from backend query history, production accounts, cross-device sync, and multi-user isolation. |
| **Test & Build Verification** | **Satisfied** | - `useStudentCaseState.upsert.test.tsx`: 3/3 passed<br>- `App.test.tsx`: 59/59 passed<br>- `npm run test --workspace apps/web`: 14/14 test files passed (182/182 tests)<br>- `npm run build --workspace apps/web`: TypeScript type check & Vite build passed cleanly in 277ms |
| **Understand Graph Refresh** | **Satisfied** | [`check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) reported `READY`. Tracked graph artifacts are updated with zero transient `.trash-*`, temp, or log files committed. |

---

### Changed Files Audit

The exact set of modified files matches the scope allowed in WP-234:

- [`apps/web/src/useStudentCaseState.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts)
- [`apps/web/src/App.test.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx)
- [`apps/web/src/useStudentCaseState.upsert.test.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.upsert.test.tsx)
- [`docs/00-ssot/SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md)
- [`docs/09-release-readiness/known-limitations.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/09-release-readiness/known-limitations.md)
- [`docs/09-release-readiness/release-readiness-checklist.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/09-release-readiness/release-readiness-checklist.md)
- [`.understand-anything/knowledge-graph.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/knowledge-graph.json)
- [`.understand-anything/fingerprints.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/fingerprints.json)
- [`.understand-anything/meta.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/meta.json)
- [`.understand-anything/intermediate/scan-result.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/intermediate/scan-result.json)
- [`docs/01-work-packages/WP-234-student-case-local-state-persistence.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-234-student-case-local-state-persistence.md)

---

### Violations
**None.** No boundary, schema, security, package, or authority violations detected.

### Regressions
**None.** All 182 web tests pass cleanly, and the frontend production build completes with zero errors.

### Drift Risks
- **Low / Informational**: Learner progress stored in browser `localStorage` is local to the current browser/domain. Clearing browser cache resets progress to the default Case 004 briefing state. As documented in the SSOT and release checklist, backend query history remains in-memory only and no multi-user/cloud persistence exists.
The audit for WP-234 is complete. All verification steps passed, all tests and build checks succeeded, and the final verdict of **PASS** has been rendered.

## Final Decision

Accepted on 2026-08-07 after AntiGravity audit PASS and human closeout approval.

Acceptance notes:
- Case 004 learner-owned frontend progress now persists locally in browser storage with defensive hydration and best-effort write behavior.
- The implementation preserves backend SQL execution, query-history, suspect verification, database, package, lockfile, runtime AI, and multi-user/cloud persistence boundaries.
- Validation and build evidence are recorded in Code Results, and the independent audit found no violations, regressions, or blocking drift risks.
- Audit markdown heading levels were normalized after the audit write so the repo lifecycle parser can detect the recorded PASS without changing the audit substance.

