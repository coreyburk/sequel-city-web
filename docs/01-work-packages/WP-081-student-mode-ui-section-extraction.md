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

- [ ] `App.tsx` delegates major Student Mode UI sections to focused components.
- [ ] Extracted components preserve existing class names, labels, text, and button behavior.
- [ ] `App.tsx` remains the owner of state, effects, and event handlers for this WP.
- [ ] No UX, copy, CSS, backend, API, dependency, or progression changes are introduced.
- [ ] Web tests pass.
- [ ] Web build passes.
- [ ] No files outside the allowed list are modified.

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

Pending.

## Gemini Audit Results

Pending.

## Final Decision

Pending.
