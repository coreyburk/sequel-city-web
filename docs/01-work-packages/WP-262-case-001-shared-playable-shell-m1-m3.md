# case-001-shared-playable-shell-m1-m3

## Objective

Convert gated Case 001 M1-M3 from the standalone skeleton UI into the same student playable shell used by Case 004, so a tester can evaluate the early Case 001 SQL clue path through Samuel's Briefing, Query Lab, Query Runner, Query Results, Case File, and Evidence Board without releasing the case.

## Scope

Convert only the gated Case 001 M1-M3 frontend runtime into the existing shared student shell while preserving all release, persistence, backend, and database boundaries.

### In Scope
- Route gated Case 001 into the shared playable student shell instead of `StudentPlayableCaseSkeletonView`.
- Keep Case 001 hidden/locked unless `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"`.
- Provide Case 001-specific briefing copy, starter SQL, M1-M3 milestone labels, and non-spoiler feedback through the shared shell.
- Allow Query Runner to submit Case 001 M1-M3 queries with explicit `caseMilestoneEvaluation` metadata and render normal query result rows.
- Keep Case 001 progress component-memory-only in this package.
- Keep the existing Case 004 shell, persistence, clue logging, and suspect verification behavior unchanged.

### Out of Scope
- Release-unlocking Case 001 by default.
- Backend route, validator, database, creation script, fixture, migration, or schema changes.
- Case 001 M4+ data, milestones, validators, clue logging, persistence, reset, suspect verification, final solve, answer key, or runtime AI.
- Broadly generalizing all Case 004 progression/state machinery.
- Removing existing skeleton source/tests unless required for import cleanup.
- New dependencies.

## Impact Analysis

### Understand Status
- Graph available: Yes (`.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, and `intermediate/scan-result.json` exist).
- Baseline commit: `ecf1041a6237d8709639147927cd2b7b00753383`
- Freshness assessment: Structurally stale for this surface. The baseline predates WP-261, which touched Case 001 module typing, skeleton UI feedback, frontend API metadata typing, and related tests. Source inspection is authoritative for this package; graph refresh is required after implementation.
- Analysis performed: Verified clean worktree before WP creation, confirmed `HEAD` at `fd44396acd66be3c2535c8dd2daecc61e953eeb0`, confirmed WP-262 as the next package, read workflow/lifecycle/Understand planning guidance, read current handoff, checked graph metadata/artifacts, reviewed drift since the graph baseline, and inspected `App.tsx`, `studentCaseModule.ts`, `studentCase001.ts`, `useStudentCaseState.ts`, `StudentBriefingView.tsx`, `StudentWorkbenchView.tsx`, `StudentEvidenceBoardView.tsx`, `QueryRunner.tsx`, API client/types, and related tests.

### Affected Architecture
- Layers: frontend student routing, playable-case module contract, student case state, shared student shell components, API client metadata transport, tests, SSOT/work-package documentation, Understand graph artifacts.
- Primary files/components: `apps/web/src/App.tsx`, `apps/web/src/studentCaseModule.ts`, `apps/web/src/studentCase001.ts`, `apps/web/src/useStudentCaseState.ts`, `apps/web/src/components/student/StudentBriefingView.tsx`, `apps/web/src/components/student/StudentWorkbenchView.tsx`, `apps/web/src/components/student/StudentEvidenceBoardView.tsx`, `apps/web/src/components/QueryRunner.tsx`.
- Upstream consumers: student Case Library and landing flow, browser history restoration, reset-progress visibility, Case 001 gated local testing.
- Downstream dependencies: `/api/query/execute`, `executeQuery`, `QueryResultsTable`, schema loading, Case 004 student progression state, Case 001 deterministic M1-M3 metadata contract.

### Regression Surface
- Related tests: `App`, `studentCaseModule`, `useStudentCaseState`, `StudentBriefingView`, `StudentWorkbenchView`, `StudentEvidenceBoardView`, `QueryRunner`, API client tests, and existing Case 001 skeleton tests if still present.
- User workflows: Case 004 released playthrough must remain unchanged; Case 001 must remain locked by default; gated Case 001 testers should see the same playable shell and run M1-M3 SQL through Query Lab with visible result rows and non-spoiler milestone feedback.
- Security/data boundaries: Case 001 metadata opt-in remains explicit and gate-bound; no restricted tables, answer keys, suspect verification, runtime AI, database writes, persistence expansion, or release unlock.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: Planned changes alter frontend architecture/imports and the Case 001 playable module boundary. The graph is already stale for the active surface after WP-261.

## Files Allowed to Change

Allowed:

- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/api/client.test.ts
- apps/web/src/api/types.ts
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/student/StudentBriefingView.tsx
- apps/web/src/components/student/StudentBriefingView.test.tsx
- apps/web/src/components/student/StudentEvidenceBoardView.tsx
- apps/web/src/components/student/StudentEvidenceBoardView.test.tsx
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/components/student/StudentWorkbenchView.test.tsx
- apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/src/studentCase.ts
- apps/web/src/studentCase001.ts
- apps/web/src/studentCaseModule.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.upsert.test.tsx
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/01-work-packages/WP-262-case-001-shared-playable-shell-m1-m3.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- apps/api/**
- database/**
- package.json
- package-lock.json
- apps/web/package.json
- apps/api/package.json
- docs/15-case-plans/**
- docs/02-runtime/**

## Constraints

WP-262 closeout constraints for the gated Case 001 shared-shell conversion.

- Preserve existing behavior unless explicitly changing it
- Keep architectural changes limited to Case 001 entering the existing playable shell.
- No renaming outside scope
- No speculative improvements
- No "while we're here" changes
- Preserve Case 004 behavior, storage key, milestone ids, tests, and released availability.
- Preserve Case 001 default locked/unreleased behavior.
- Do not expose answer-key, culprit, final solve, or suspect verification behavior for Case 001.
- Do not add runtime AI.

## Required Behavior

- With the Case 001 gate disabled, Case 001 remains locked and cannot enter playable runtime.
- With the Case 001 gate enabled, entering Case 001 renders the same shared shell structure as Case 004: Samuel header, Samuel's Briefing tab, Query Lab tab, Evidence Board tab, Query Runner, Query Results, and Case File reference drawer.
- Case 001 briefing and header text use Case 001 public dossier and M1-M3-specific non-spoiler guidance, not Case 004 murder-case copy.
- Case 001 Query Runner renders normal query result tables for successful SQL queries.
- Case 001 query execution includes explicit milestone metadata only for gated Case 001 M1-M3 checks.
- Case 001 M1-M3 feedback is non-spoiler, non-progressing, and component-memory-only.
- Case 001 Evidence Board uses the existing board structure with a minimal M1-M3 progress/notebook view and no suspect theory panel.
- Case 004 remains the only released/default playable module in `PLAYABLE_STUDENT_CASE_MODULES`.

## Acceptance Criteria

- [ ] Case 001 no longer renders `StudentPlayableCaseSkeletonView` when the gate is enabled; it enters the shared playable shell.
- [ ] Gated Case 001 exposes Samuel's Briefing, Query Lab, Evidence Board, Query Runner, Query Results, and Case File surfaces in the same structure as Case 004.
- [ ] M1-M3 SQL queries can run through Query Runner with explicit gated metadata and visible result rows.
- [ ] M1-M3 matched/no-match/missing-metadata feedback is shown without persisting progress or advancing final case progression.
- [ ] Case 001 remains locked by default and absent from `PLAYABLE_STUDENT_CASE_MODULES`.
- [ ] Case 004 behavior and tests remain unchanged.
- [ ] No backend, database, migration, dependency, answer-key, runtime AI, suspect verification, or release-unlock changes.
- [ ] Understand graph is refreshed after implementation.
- [ ] No unrelated files changed

## Code Prompt

Implement the WP-262 gated Case 001 shared-shell conversion exactly as specified.

Scope:
- Only modify the allowed files.

Constraints:
- No refactors
- No new dependencies
- Preserve all existing behavior
- Keep Case 001 gated and unreleased.
- Keep Case 001 M1-M3 non-persistent and non-progressing.
- Do not change backend/database behavior.

Return:
- Exact code changes
- Short summary of what was implemented

## Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied
- No files outside allowed list were modified
- No functional regression
- Behavior remains consistent outside scope
- Impact analysis matches the actual changed files
- Dependencies and related tests were not omitted
- Graph regeneration decision was followed
- Understand output did not override SSOT or source evidence

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

- Routed gated Case 001 through the shared student playable shell instead of the standalone skeleton view while keeping Case 001 locked by default and absent from released playable modules.
- Added Case 001 M1-M3 shell content: public dossier briefing, known facts, milestone labels, Samuel guidance, starter SQL, Query Lab guide copy, and component-memory-only milestone feedback/notebook state.
- Extended shared shell components to accept case-specific briefing/facts/milestone totals/query metadata builders while preserving Case 004 defaults.
- Extended Query Runner with an optional explicit `caseMilestoneEvaluation` metadata builder and kept metadata omitted unless the active gated Case 001 query matches M1-M3.
- Updated Case 001 browser smoke coverage to exercise the shared shell, first SQL feedback path, visible query results, Evidence Board progress, and no Case 001 localStorage persistence.
- Updated SSOT UI/state architecture notes to record the gated Case 001 shared-shell preview contract.

Validation:
- `npm run test --workspace apps/web` - pass, 17 files / 221 tests.
- `npm run build --workspace apps/web` - pass.
- `git diff --check` - pass, line-ending warnings only.
- `CASE_001_LIVE_SMOKE=1 VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true VITE_API_BASE_URL=http://127.0.0.1:3002 npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` - pass, 1 browser smoke test.
- `scripts/check-understand-refresh-readiness.ps1` - pass before and after refresh.
- `scripts/refresh-understand-graph.ps1` - pass, graph rebuilt with 640 files, 1039 nodes, 399 edges.

## Audit Results

### Audit Results: WP-262 Case 001 Shared Playable Shell (M1-M3)

### Verdict: PASS

---

### Verification Checklist

- [x] **All acceptance criteria are satisfied**:
  - Gated Case 001 routes into the shared playable student shell (`StudentMentorHeader`, `StudentBriefingView`, `StudentWorkbenchView`, `StudentEvidenceBoardView`) instead of `StudentPlayableCaseSkeletonView`.
  - Exposes Samuel's Briefing, Query Lab, Evidence Board, Query Runner, Query Results, and Case File drawer in the standard playable structure.
  - M1-M3 SQL queries execute through `apps/web/src/components/QueryRunner.tsx` with explicit `caseMilestoneEvaluation` metadata and display visible result rows.
  - M1-M3 milestone evaluation provides non-spoiler feedback in component memory without persisting progression or writing to `localStorage`.
  - Case 001 remains locked by default and absent from `PLAYABLE_STUDENT_CASE_MODULES`.
  - Case 004 gameplay, storage keys, clue logging, and test suites remain untouched and fully passing.
  - No backend, database, migration, answer-key, runtime AI, suspect-verification, or release-unlock changes were introduced.
  - Understand graph was refreshed post-implementation.
  - No unrelated files were modified.

- [x] **No files outside allowed list were modified**:
  - All 19 modified/untracked files match the allowed list in `docs/01-work-packages/WP-262-case-001-shared-playable-shell-m1-m3.md`.

- [x] **No functional regression**:
  - `npm run test --workspace apps/web`: 17 test files / 221 tests passed.
  - `npm run build --workspace apps/web`: TypeScript type-check and Vite production build succeeded cleanly.

- [x] **Behavior remains consistent outside scope**:
  - Case 004 default playable experience, persistence, suspect theory verification, and investigation threads operate identically.
  - Case 001 remains locked behind `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"`.

- [x] **Impact analysis matches actual changed files**:
  - Changes are scoped strictly to frontend student routing, case state, shared shell components, query metadata construction, tests, SSOT docs, and Understand artifacts.

- [x] **Dependencies and related tests were not omitted**:
  - Zero new dependencies added. Existing unit and integration tests were updated to reflect the shared shell contract.

- [x] **Graph regeneration decision was followed**:
  - Knowledge graph, scan result, fingerprints, and metadata in `.understand-anything/` were regenerated against the updated baseline (`fd44396acd66be3c2535c8dd2daecc61e953eeb0`).
  - Readiness check `scripts/check-understand-refresh-readiness.ps1` returned `READY`.

- [x] **Understand output did not override SSOT or source evidence**:
  - Authority flowed strictly from SSOT documentation (`docs/00-ssot/SSOT-Investigation-State-Architecture.md`, `docs/00-ssot/SSOT-UI-UX-Experience.md`) and source code to the Understand graph.

---

### Violations
*None.*

---

### Regressions
*None.*

---

### Drift Risks
- **Low**: Case 001 milestone progress and notebook entries are component-memory only by design in WP-262; when persistent Case 001 state is introduced in future work packages, ensure `useStudentCaseState` cleanly segregates Case 001 storage keys from Case 004 keys.

## Final Decision

Accepted on 2026-08-20 after PASS audit. WP-262 is approved for closeout because gated Case 001 M1-M3 now uses the shared Case 004-style playable shell while preserving the locked release gate, non-persistent Case 001 state, backend/database boundaries, and Case 004 behavior.

