# WP-082: Student Case State Hook Extraction

## Objective

Improve frontend maintainability by extracting Student Mode state orchestration, evidence logging handlers, notebook mutation, and query-completion progression logic from `App.tsx` into a dedicated hook without changing runtime behavior.

## Background

`WP-080` moved Student Mode case data and pure helpers into `studentCase.ts`.
`WP-081` moved the major Student Mode UI sections into focused components, reducing `App.tsx` to about 37 KB.

The remaining highest-ROI readability issue is that `App.tsx` still owns dense Student Mode orchestration:

- schema loading and table selection
- draft query and restored query result state
- completed milestones
- notebook entries and manual notes
- pending evidence steps and feedback
- witness bundle detection
- query-completion progression
- evidence logging progression
- Case Review reward state

Extracting that into a hook should let `App.tsx` become the top-level mode switcher and view composer while preserving state flow in one explicit place.

## Scope

### In Scope
- Create a focused Student Mode state hook, tentatively `useStudentCaseState`.
- Move Student Mode state, effects, derived values, and handlers from `App.tsx` into the hook.
- Keep pure case constants/helpers in `studentCase.ts`.
- Keep UI components from `WP-081` as presentation components.
- Preserve all existing copy, labels, CSS class names, tests, behavior, and progression rules.
- Run web test and build gates.

### Out of Scope
- UX/copy changes.
- CSS restructuring or class renaming.
- Backend, API, database, route, runtime AI, dependency, or artwork changes.
- Changing evidence validation, rewards, lead gating, query progression, or Case Review behavior.
- Adding external state-management libraries.

## Files Allowed to Change

- `docs/01-work-packages/WP-082-student-case-state-hook-extraction.md`
- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/StudentBriefingView.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSchemaTable.tsx`

## Constraints

- Refactor only; do not change visible behavior.
- Preserve existing tests and test expectations.
- Do not add dependencies.
- Keep hook return values explicit and typed.
- Avoid hiding important state transitions behind vague prop bags.
- Keep comments sparse; prefer clear names and cohesive return groups.

## Required Behavior

- Student Mode should render and progress exactly as before across all tabs.
- Query Lab behavior, restored results, evidence logging, support panels, and pinned facts must continue to work.
- Evidence Board notebook, manual notes, Case Review, Insight Marks, Current Action, lead gating, and milestone visibility must continue to work.
- Developer Mode should remain unaffected.
- Web tests must pass.
- Web build must pass.

## Acceptance Criteria

- [x] `App.tsx` no longer directly owns most Student Mode state/effects/handlers.
- [x] A dedicated hook owns Student Mode orchestration with explicit typed return values.
- [x] Existing `studentCase.ts` pure data/helper boundaries remain intact.
- [x] Existing Student Mode presentation components remain presentation-focused.
- [x] No UX, copy, CSS, backend, API, dependency, or progression changes are introduced.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No files outside the allowed list are modified.

## Codex Prompt

Implement WP-082.

Scope:
- Only modify the allowed files.

Constraints:
- Refactor only.
- Preserve all behavior, tests, copy, labels, class names, styling, and progression rules.
- Move Student Mode orchestration out of `App.tsx` into a focused hook while keeping `App.tsx` as the top-level shell.

Return:
- Exact files changed.
- Verification results.
- Any follow-up refactor recommendation.

## Gemini Audit Prompt

Audit WP-082 against the refactor-only objective.

Verify:
- All acceptance criteria are satisfied.
- Changed files stay within the allowed list.
- Student Mode behavior, copy, labels, class names, and progression are preserved.
- Developer Mode remains unaffected.
- The hook improves readability without hiding or weakening important state flow.
- Web tests and build pass.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-082.

Changes made:

- Added `apps/web/src/useStudentCaseState.ts` as the Student Mode orchestration hook.
- Moved Student Mode state, effects, derived values, and handlers out of `App.tsx`, including:
  - schema loading and selected table state
  - draft query and restored query result state
  - completed milestones and Samuel stage
  - notebook entries, highlighted note, and manual-note state
  - pending evidence step and feedback state
  - witness bundle detection and checklist construction
  - query-completion progression
  - evidence logging progression
  - Case Review answer/reward state
- Kept `studentCase.ts` as the pure case data/helper boundary from WP-080.
- Kept Student Mode UI components presentation-focused from WP-081.
- Kept `App.tsx` as the top-level mode shell and view composer.
- Reduced `App.tsx` from about 37 KB after WP-081 to about 8.4 KB after WP-082.
- Preserved all existing copy, labels, class names, button behavior, tests, and progression rules.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` passed.
- Generated build artifacts were removed after verification.

Follow-up recommendation:

- Consider extracting the dense witness/evidence validation helpers from `useStudentCaseState.ts` into a pure helper module with direct unit tests once the hook boundary has been audited. That would keep the hook focused on orchestration while making the witness validation rules easier to test independently.

## Gemini Audit Results

## Verdict
PASS

## Final Decision

Accepted.

WP-082 is accepted based on the passing audit and verification results. The work stays within the approved refactor-only scope, preserves Student Mode behavior, and may be committed and pushed as one cohesive work package.

