# WP-081: Student Mode UI Section Extraction

## Objective

Continue improving frontend readability by extracting the largest Student Mode render sections from `App.tsx` into focused React components without changing visible behavior.

## Background

`WP-080` moved Student Mode case data and pure progression helpers into `apps/web/src/studentCase.ts`, reducing `App.tsx` from about 73 KB to about 56 KB. The next highest-ROI improvement is to extract actual UI sections so a junior developer can follow the screen structure without reading one large render tree.

## Scope

### In Scope
- Extract Student Mode presentation sections from `App.tsx` into focused components.
- Prioritize the highest-value seams:
  - `StudentMentorHeader` for the stable Samuel/avatar/scene/status area above navigation
  - `StudentBriefingView` for the opening case briefing
  - `StudentWorkbenchView` for Query Lab content and support panels
  - `StudentEvidenceBoardView` for notebook, Case Progress, Current Action, Case Review, and milestones
- Keep `App.tsx` responsible for top-level state, data fetching, event handlers, and mode switching.
- Preserve all existing copy, DOM labels, CSS class names, test behavior, and progression rules.
- Run web test and build gates.

### Out of Scope
- UX/copy changes.
- CSS restructuring or class renaming.
- Hook extraction such as `useStudentCaseState`; that can follow after component boundaries are stable.
- Backend, API, database, route, runtime AI, dependency, or artwork changes.
- Changing evidence validation, rewards, lead gating, or query progression.

## Files Allowed to Change

- `docs/01-work-packages/WP-081-student-mode-ui-section-extraction.md`
- `apps/web/src/App.tsx`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/StudentBriefingView.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSchemaTable.tsx`

## Constraints

- Refactor only; do not change visible behavior.
- Preserve existing tests and test expectations.
- Do not add dependencies.
- Do not touch CSS unless a later audit proves the extraction requires it.
- Keep props explicit and typed; avoid broad `any` or opaque prop bags.
- Keep comments sparse and only add them if the component boundary is not obvious.

## Required Behavior

- Student Mode should render exactly as before across all three tabs.
- Query Lab behavior, evidence logging, support panels, pinned facts, and restored results must continue to work.
- Evidence Board notebook, manual notes, Case Review, Insight Marks, Current Action, lead gating, and milestone visibility must continue to work.
- Developer Mode should remain unaffected.
- Web tests must pass.
- Web build must pass.

## Acceptance Criteria

- [x] `App.tsx` delegates major Student Mode UI sections to focused components.
- [x] Extracted components preserve existing class names, labels, text, and button behavior.
- [x] `App.tsx` remains the owner of state, effects, and event handlers for this WP.
- [x] No UX, copy, CSS, backend, API, dependency, or progression changes are introduced.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No files outside the allowed list are modified.

## Codex Prompt

Implement WP-081.

Scope:
- Only modify the allowed files.

Constraints:
- Refactor only.
- Preserve all behavior, tests, copy, labels, class names, and styling.
- Keep `App.tsx` as the state owner while extracting the major Student Mode render sections.

Return:
- Exact files changed.
- Verification results.
- Any follow-up refactor recommendation.

## Gemini Audit Prompt

Audit WP-081 against the refactor-only objective.

Verify:
- All acceptance criteria are satisfied.
- Changed files stay within the allowed list.
- Student Mode behavior, copy, labels, class names, and progression are preserved.
- Developer Mode remains unaffected.
- The extracted components improve readability without hiding important state flow.
- Web tests and build pass.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-081.

Changes made:

- Added `StudentMentorHeader` for the stable Samuel/avatar/scene/status area above the student navigation.
- Added `StudentBriefingView` for the opening case briefing.
- Added `StudentWorkbenchView` for Query Lab content, witness guide, support panels, and pinned facts snapshot.
- Added `StudentEvidenceBoardView` for the notebook, witness checklist, Case Progress, Current Action, Case Review, Insight Marks, and milestone list.
- Added `StudentSchemaTable` so the schema table used by the workbench is no longer local to `App.tsx`.
- Updated `App.tsx` to delegate those major Student Mode UI sections while retaining ownership of:
  - state and effects
  - data fetching
  - evidence logging handlers
  - query completion handling
  - notebook mutation handlers
  - view/mode switching
- Preserved all existing copy, labels, class names, button behavior, tests, and progression rules.
- Reduced `App.tsx` from about 56 KB after WP-080 to about 37 KB after WP-081.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` passed.
- Generated build artifacts were removed after verification.

Follow-up recommendation:

- Consider a later `useStudentCaseState` hook extraction only after the component boundaries settle. That would reduce the remaining handler/state density in `App.tsx` without changing UI behavior.

## Gemini Audit Results

- Verdict: PASS
- Violations: None. All changed files are within the allowed list, and no out-of-scope changes (UX, CSS, backend) were detected.
- Regressions: None. The extraction is a faithful decomposition of the original `App.tsx` render logic. Prop passing correctly preserves state flow and handler connectivity. Component structure, labels, and class names match the requirements.
- Drift risks: None identified. The refactor successfully reduced `App.tsx` density (~56 KB to ~37 KB) while maintaining architectural boundaries. The use of explicit prop types for the new components (e.g., `StudentEvidenceBoardViewProps`) prevents type safety degradation.

### Summary of Audit
The refactor of `App.tsx` into specialized Student Mode components is clean and compliant with the "refactor-only" objective. The largest render sections (Header, Briefing, Workbench, and Evidence Board) have been isolated, significantly improving codebase readability for the student experience without altering system behavior or affecting Developer Mode. All acceptance criteria from WP-081 are satisfied.

## Final Decision

Accepted.

WP-081 is accepted based on the passing audit and verification. The implementation may be committed and pushed as one cohesive frontend refactor work package.

