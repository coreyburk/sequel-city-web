# case-001-manual-test-student-facing-opening

## Objective

Correct the gated Case 001 opening experience exposed by manual testing so it reads as Case 001, gives a basic student-facing first briefing, and starts Query Runner with a light exploratory SQL draft instead of the full answer-shaped opening query.

## Scope

### In Scope
- Fix the shared student mentor header so gated Case 001 briefing view does not render `Case 004 Briefing`.
- Remove the shared-header hard-code that assumes every briefing is Case 004; derive the briefing label from the active case state or metadata already passed into the shell.
- Rewrite only the Case 001 opening briefing/guidance copy needed for M1 so it is basic, approachable, and useful to a first-case student.
- Replace the Case 001 first Query Runner draft with a simple table-inspection query that does not include every exact answer filter up front.
- Keep the deterministic Case 001 M1 backend validator contract intact so a student can still edit toward the report-located milestone.
- Tighten tests so the Case 001 header heading, opening instructions, and first Query Runner draft match the intended student-facing behavior.
- Update the browser smoke expectation if it asserts the old full opening query.
- Refresh tracked Understand graph artifacts after implementation.

### Out of Scope
- Releasing or unlocking Case 001 by default.
- Adding M4 or any new Case 001 gameplay.
- Changing backend validators, API transport, database data, schema, creation scripts, migrations, persistence, suspect verification, final solve flow, answer keys, runtime AI, or dependencies.
- Redesigning the shared shell layout, tabs, Query Runner mechanics, Evidence Board, or Case File beyond copy/prop behavior required for the opening defects.
- Changing Case 004 briefing behavior except where the shared header fix must preserve its current labels and guidance.
- Creating a new database-backed public case metadata table/API in this corrective package.

## Impact Analysis

### Understand Status
- Graph available: Yes (`.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, and `intermediate/scan-result.json` exist).
- Baseline commit: `ab1e5afdf23be528cd809d0aa76bf186a8ad3e00`
- Freshness assessment: Usable for this frontend planning surface with non-app workflow drift. Current `HEAD` is `f557668`, and accepted drift since the graph baseline is WP-263 workflow/script/docs/skill hardening plus graph artifacts. The Case 001 shared-shell app source has not changed since the baseline, but this WP will modify frontend source/tests, so graph regeneration is required after implementation.
- Analysis performed: Confirmed clean worktree on `main`, inspected current `HEAD`, read workflow and Understand guidance, read graph metadata, searched Case 001 gate/copy/query wiring, and verified the defect against source. Source inspection found `StudentMentorHeader.tsx` hard-codes `briefing: "Case 004 Briefing"` while `useStudentCaseState.ts` passes `mentorTitle: "Case 001 Briefing"` for gated Case 001. `studentCase001.ts` authors the full M1 starter SQL with `CrimeID`, `ReportDate`, and `ReportCity` filters, and `App.test.tsx` currently expects that full draft instead of a beginner-friendly exploratory query. A focused search found no existing public case-metadata table or case-library API; current case-library metadata is frontend-static in `studentCaseLibrary.ts`, and the database only exposes case-related `CaseAnswerKey` storage. Therefore WP-264 must not add more shared hard-coded case labels, and a separate database-backed public case metadata WP is required before scaling case-library metadata across many cases.

### Affected Architecture
- Layers: frontend student shared shell, gated Case 001 authoring content, student-mode test coverage, browser smoke expectations, Understand graph artifacts.
- Primary files/components: `apps/web/src/components/student/StudentMentorHeader.tsx`, `apps/web/src/studentCase001.ts`, `apps/web/src/useStudentCaseState.ts`, `apps/web/src/App.test.tsx`, `apps/web/src/studentCaseModule.test.ts`, `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`, `apps/web/tests/browser/case-001-live-smoke.spec.ts`.
- Upstream consumers: Case library entry flow, gated Case 001 shared playable shell, Case 004 shared shell.
- Downstream dependencies: Query Runner initial draft, Case 001 milestone metadata opt-in builder, M1-M3 feedback slices, App and browser smoke tests.

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web -- App.test.tsx studentCaseModule.test.ts StudentPlayableCaseSkeletonView.test.tsx`
  - `CASE_001_LIVE_SMOKE=1 VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true VITE_API_BASE_URL=http://127.0.0.1:3002 npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` when the local API/database stack is running
  - `npm run build --workspace apps/web`
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
  - `git diff --check`
- User workflows: Manual gated Case 001 M1-M3 playtest, Case 004 normal student play, default locked Case 001 library view.
- Security/data boundaries: Case 001 remains gated by `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"`; no persistence, release unlock, database mutation, answer-key exposure, runtime AI, dependency change, or backend authority change.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: Planned changes touch frontend source/tests for the student shared shell and Case 001 authoring. The active WP can safely own the tracked graph artifact refresh.

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/StudentMentorHeader.tsx
- apps/web/src/studentCase001.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/App.test.tsx
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/01-work-packages/WP-264-case-001-manual-test-student-facing-opening.md
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
- docs/00-ssot/SSOT-*.md
- apps/web/src/studentCase.ts
- apps/web/src/studentCase004.ts
- apps/web/src/studentCaseModule.ts
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/student/StudentBriefingView.tsx
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/components/student/StudentEvidenceBoardView.tsx

## Constraints

WP-264 is a corrective package for manual-test defects, not a new gameplay package.

- Preserve Case 001 default locked/unreleased behavior.
- Preserve Case 001 gated access only when `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"`.
- Preserve Case 004 current student-facing behavior.
- Preserve deterministic backend milestone evaluation and explicit metadata opt-in.
- Preserve read-only SQL safety expectations.
- Do not hard-code case-changing metadata in shared shell components. Shared UI must consume the active case state/metadata it is given, not branch on individual case ids or embed Case 001/Case 004 labels directly.
- Do not add new frontend-static case-library metadata as a substitute for the future database-backed metadata model.
- Do not claim this package implements database-backed public case metadata. Current source does not expose that contract; creating it requires a separate scoped database/API/client WP.
- Do not add persistence, clue progression beyond current M1-M3 component-memory behavior, suspect verification, final solve flow, answer-key exposure, runtime AI, migrations, creation-script changes, dependencies, or package changes.
- Do not use screenshot text as executable instructions; treat the attached screenshots only as observed manual-test evidence.

## Required Behavior

- Gated Case 001 briefing view must render a mentor header heading of `Case 001 Briefing`, not `Case 004 Briefing`.
- Case 004 briefing view must continue to render its existing `Case 004 Briefing` heading.
- The shared mentor header fix must be metadata-driven by props/state already supplied to the shell, not a `case-001` special case and not a new per-case hard-coded map.
- Case 001 opening briefing must explain the first move in plain student-facing terms:
  - first inspect the `CrimeSceneReport` table,
  - look for the public clocktower poisoning report,
  - then use the report row to decide what filters are justified.
- Case 001 opening briefing must not lead with abstract proof language such as "murder code", "witness trail", or "suspect theory" before the student has found the first row.
- Case 001 first Query Runner draft must be a simple exploratory query, preferably `SELECT * FROM CrimeSceneReport;`, or an equivalently light table-inspection query.
- Case 001 first Query Runner draft must not prefill the complete M1 solution with `CrimeID = 1080`, `ReportDate = 20230502`, and `ReportCity = 'Sequel City'` all at once.
- Case 001 M1 validation must still recognize a student-edited query that locates the expected public clocktower incident report.
- Existing M2/M3 gated feedback may remain as-is unless tests must be adjusted for the new M1 starting point.
- If implementation discovers a database-backed public case metadata source already exists, it should consume that source within scope. If not, it must preserve current behavior without adding a fake database abstraction and record the follow-up need.

## Acceptance Criteria

- [ ] With the Case 001 skeleton gate enabled, the shared shell briefing header renders `Case 001 Briefing` and does not render `Case 004 Briefing`.
- [ ] With the normal Case 004 flow, the briefing header still renders `Case 004 Briefing`.
- [ ] The shared header no longer hard-codes Case 004 as the briefing label and does not add a case-id switch or per-case heading map.
- [ ] Case 001 opening copy is basic, student-facing, and directs the student to inspect `CrimeSceneReport` before narrowing.
- [ ] Case 001 first Query Runner draft is a simple exploratory query and does not contain the full M1 solution filter set.
- [ ] Case 001 M1 milestone metadata opt-in still works after a student edits the query toward the target report.
- [ ] Case 001 remains locked by default and unreleased unless the explicit skeleton gate is enabled.
- [ ] Case 004 behavior, persistence, and released play remain unchanged.
- [ ] Implementation records whether a database-backed public case metadata source exists; if it does not, the remaining need is documented as a follow-up rather than solved with more hard-coded metadata.
- [ ] No backend, database, creation-script, migration, package, dependency, runtime AI, persistence, suspect verification, answer-key, or release-unlock changes are made.
- [ ] Required web tests/build pass or any local-stack-only smoke limitation is recorded.
- [ ] Understand graph is refreshed after implementation.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-264 exactly as specified.

Scope:
- Only modify the allowed files.

Required implementation shape:
- Fix the shared mentor header so briefing headings are case-aware while preserving Case 004 behavior.
- Do not implement the case-aware heading with a case-id switch, per-case hard-coded heading map, or duplicated Case 001/Case 004 literals in the shared component; consume existing active case state/metadata.
- Update Case 001 authored M1 copy and initial query draft to be beginner-friendly and exploratory.
- Keep the Case 001 validator request builder and backend contract compatible with student-edited M1 queries.
- Update focused tests so they fail on the screenshot defects: Case 001 must not show `Case 004 Briefing`, and the first draft must not be the full filtered answer query.
- Refresh Understand graph after the frontend source/test changes.
- Check whether a database-backed public case metadata source already exists. If it does not, record that limitation in `Code Results` and keep this package from pretending frontend-static metadata is the scalable solution.

Verification:
- `npm run test --workspace apps/web -- App.test.tsx studentCaseModule.test.ts StudentPlayableCaseSkeletonView.test.tsx`
- `npm run build --workspace apps/web`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/refresh-understand-graph.ps1`
- `scripts/check-understand-refresh-readiness.ps1`
- `git diff --check`
- If the local API/database stack is already running, also run `CASE_001_LIVE_SMOKE=1 VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true VITE_API_BASE_URL=http://127.0.0.1:3002 npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`; otherwise record the local-stack limitation without broadening scope.

Return:
- Exact code changes.
- Validation results.
- Any remaining manual-test caveats.

## Audit Prompt

Audit WP-264 with an adversarial stance.

Verify:
- All acceptance criteria are satisfied.
- No files outside the allowed list were modified.
- The screenshot defects are actually blocked by tests, not just manually patched.
- Gated Case 001 briefing header is case-aware and does not show Case 004 copy.
- The shared header does not replace one hard-code with a case-id switch or per-case hard-coded map.
- Case 004 briefing behavior is preserved.
- Case 001 opening copy is student-facing and does not over-explain proof theory before the first row is found.
- Case 001 first Query Runner draft is exploratory and does not prefill all M1 answer filters.
- Case 001 M1 metadata opt-in and result feedback still work when the student edits toward the target report.
- Case 001 remains gated/unreleased by default.
- Any database-backed public case metadata limitation is recorded honestly; no fake abstraction or new frontend-only metadata expansion is treated as the scalable solution.
- No backend, database, creation-script, migration, persistence, suspect verification, answer-key, runtime AI, dependency, package, or release-unlock boundary changed.
- Validation evidence covers source and tests touched.
- Graph regeneration decision was followed.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Acceptance-criteria findings
- Regression risks
- Manual-test risks
- Drift risks

## Code Results

- Implemented the shared mentor header fix in `apps/web/src/components/student/StudentMentorHeader.tsx`: briefing headings now use the active `mentorTitle` supplied by case state, while workbench/case-board headings remain shared shell labels. The shared component no longer embeds `Case 004 Briefing` or a case-id switch/map for briefing labels.
- Preserved Case 004 briefing behavior by supplying its existing briefing direction copy from `apps/web/src/useStudentCaseState.ts`; Case 001 supplies its own opening direction copy through the same props.
- Updated Case 001 M1 authoring in `apps/web/src/studentCase001.ts` so the first guidance tells students to inspect `CrimeSceneReport`, find the public clocktower poisoning report, and then choose justified filters. The first starter SQL is now `SELECT * FROM CrimeSceneReport;`.
- Preserved the gated deterministic Case 001 milestone request builder. Tests still submit an edited M1 target query with `CrimeID = 1080`, `ReportDate = 20230502`, and `ReportCity = 'Sequel City'` to verify backend milestone metadata remains compatible.
- Tightened focused tests in `apps/web/src/App.test.tsx`, `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`, and `apps/web/tests/browser/case-001-live-smoke.spec.ts` so Case 001 fails if it shows `Case 004 Briefing` or preloads the full M1 answer-shaped query.
- Checked for database-backed public case metadata. None exists in the current public case-library path: library metadata remains frontend-static in `apps/web/src/components/student/studentCaseLibrary.ts`, while database/API case storage found by search is limited to restricted answer-key/verification surfaces such as `CaseAnswerKey`. The database-backed public case metadata need remains a follow-up and was not faked in this WP.
- Refreshed tracked Understand artifacts after source/test changes.

Validation:
- PASS: `npm run test --workspace apps/web -- App.test.tsx studentCaseModule.test.ts StudentPlayableCaseSkeletonView.test.tsx` (80 tests).
- PASS: `npm run build --workspace apps/web`.
- PASS: `scripts/check-understand-refresh-readiness.ps1` before graph refresh.
- PASS: `scripts/refresh-understand-graph.ps1`.
- PASS: `scripts/check-understand-refresh-readiness.ps1` after graph refresh.
- NOT RUN: `CASE_001_LIVE_SMOKE=1 VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true VITE_API_BASE_URL=http://127.0.0.1:3002 npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`; local API/database stack was not running (`127.0.0.1:3002` refused connection).

## Audit Results

Verdict: PASS

All acceptance criteria are satisfied, the manual test defects are verified and regression-tested, no files outside the allowed list were modified, and no architectural boundaries were breached.

---

### Scope Violations

**None.**
- Modified files strictly match the allowed list in [WP-264-case-001-manual-test-student-facing-opening.md](docs/01-work-packages/WP-264-case-001-manual-test-student-facing-opening.md#L56-L73):
  - [`apps/web/src/components/student/StudentMentorHeader.tsx`](apps/web/src/components/student/StudentMentorHeader.tsx)
  - [`apps/web/src/studentCase001.ts`](apps/web/src/studentCase001.ts)
  - [`apps/web/src/useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts)
  - [`apps/web/src/App.test.tsx`](apps/web/src/App.test.tsx)
  - [`apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`](apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx)
  - [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts)
  - Tracked graph files: `.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, `intermediate/scan-result.json`
- Zero changes were made to restricted backend, database, migration, package configuration, runtime AI, or answer key files.

---

### Acceptance-Criteria Findings

| Acceptance Criteria | Status | Evidence & Verification |
| :--- | :---: | :--- |
| **Gated Case 001 briefing header renders `Case 001 Briefing`** | **PASS** | [`StudentMentorHeader`](apps/web/src/components/student/StudentMentorHeader.tsx#L56-L58) dynamically assigns `guidanceHeading = mentorTitle` on briefing view. Asserted via [`App.test.tsx:L2071`](apps/web/src/App.test.tsx#L2071). |
| **Case 004 briefing header preserved** | **PASS** | Case 004 passes `mentorTitle: "Case 004 Briefing"` from [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L2049) and retains its existing copy. Verified via full suite of 64 App tests passing. |
| **No case-id switch or per-case hard-coded map in shared header** | **PASS** | [`StudentMentorHeader.tsx`](apps/web/src/components/student/StudentMentorHeader.tsx#L56-L69) purely consumes `mentorTitle`, `studentObjective`, and `mentorMessage` props without branching on `caseId` or maintaining case dictionaries. |
| **Case 001 opening copy is student-facing without proof theory** | **PASS** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L364-L377) directs the student to inspect `CrimeSceneReport` first. Proof jargon (`murder code`, `witness trail`, `suspect theory`) was excised and asserted absent in [`App.test.tsx:L2075-2077`](apps/web/src/App.test.tsx#L2075-L2077). |
| **Exploratory Query Runner draft** | **PASS** | [`CASE_001_FIRST_SQL_FEEDBACK_SLICE`](apps/web/src/studentCase001.ts#L272-L280) and step 1 draft set `starterSql: "SELECT * FROM CrimeSceneReport;"`. Asserted in [`App.test.tsx:L2085-2088`](apps/web/src/App.test.tsx#L2085-L2088) and [`StudentPlayableCaseSkeletonView.test.tsx:L121-126`](apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx#L121-L126). |
| **M1 metadata opt-in & feedback work on query edit** | **PASS** | Gated request builder contract in [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L4533) preserved. Tests demonstrate editing from exploratory draft to target SQL triggers milestone resolution. |
| **Case 001 remains locked by default** | **PASS** | `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` remains required for gated skeleton access. |
| **Case 004 behavior and persistence unchanged** | **PASS** | No changes to [`studentCase004.ts`](apps/web/src/studentCase004.ts) or Case 004 persistence pipeline. |
| **Database-backed case metadata limitation recorded honestly** | **PASS** | Documented in WP-264 [Impact Analysis](docs/01-work-packages/WP-264-case-001-manual-test-student-facing-opening.md#L33) and [Code Results](docs/01-work-packages/WP-264-case-001-manual-test-student-facing-opening.md#L206) without inventing fake frontend shim abstractions. |
| **No boundary changes** | **PASS** | Verified across all git diffs. |
| **Validation evidence covers source & tests** | **PASS** | Focused tests (80/80 passed), full web suite (221/221 passed), full API suite passed, web build passed cleanly. |
| **Graph regeneration decision followed** | **PASS** | `scripts/check-understand-refresh-readiness.ps1` confirmed ready; graph artifacts refreshed. |
| **No Understand override of SSOT / source** | **PASS** | Verified. |

---

### Regression Risks

1. **Header Component Contract Coupling**:
   - [`StudentMentorHeader`](apps/web/src/components/student/StudentMentorHeader.tsx#L56-L58) now delegates the briefing header title to `props.mentorTitle`. Any new playable case wired into the shared shell must ensure its state hook provides a valid `mentorTitle` on initialization when `activeView === "briefing"`.
2. **Step Progression Dependence on Student Edit**:
   - Because the initial draft is now `SELECT * FROM CrimeSceneReport;`, automated and manual playtests can no longer simply press "Check Report Query" immediately on load to pass M1; tests must explicitly simulate the student editing the query to the narrowed clocktower report criteria.

---

### Manual-Test Risks

1. **Live Browser Smoke Execution**:
   - [`case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts) correctly tests the exploratory draft and target edit flow against the live backend, but requires a live local API server (`127.0.0.1:3001` / `127.0.0.1:3002`) and active SQL Server database. In offline or unit test runs, live end-to-end network assertion is bypassed.

---

### Drift Risks

1. **Public Case Library Metadata Storage**:
   - Case metadata for the library view continues to reside in the frontend-static file [`apps/web/src/components/student/studentCaseLibrary.ts`](apps/web/src/components/student/studentCaseLibrary.ts). As noted in WP-264, scaling beyond existing cases will require a dedicated backend database schema and API package rather than continuing frontend-static expansions.
The adversarial audit of **WP-264** is complete with a verdict of **PASS**. All background tasks have concluded cleanly. Please let me know if you would like to proceed with committing the changes, updating the end-of-day handoff documentation, or addressing any other work package.

## Final Decision

Accepted on 2026-08-20 after PASS audit and human acceptance. WP-264 corrected the gated Case 001 opening defects without broadening release scope: the shared mentor header is case-aware through active state props, Case 001 starts with beginner-friendly `CrimeSceneReport` inspection and an exploratory SQL draft, M1 validation remains compatible with student-edited target queries, Case 004 behavior is preserved, the database-backed public case metadata limitation is recorded as follow-up scope, and tracked Understand graph artifacts were refreshed.

