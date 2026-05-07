# student query runner density and diagnostics split

## Objective

Reduce Student Mode Query Runner vertical footprint and cognitive load by removing developer-oriented diagnostics from the student experience while preserving full diagnostic detail for Developer Mode.

## Scope

### In Scope

- Add QueryRunner display-mode behavior for Student vs Developer audiences.
- Hide student-facing query guidance callout block in Student Mode.
- Hide student-facing diagnostic summary cards (`Safety`, `Backend Message`, `Execution Time`) in Student Mode.
- Keep those diagnostics visible in Developer Mode.
- Tighten Query Runner spacing in Student Mode to reduce scrolling.
- Update tests for mode-specific rendering behavior.

### Out of Scope

- Backend or API changes.
- SQL execution behavior changes.
- Schema Snapshot behavior changes.
- Milestone progression logic changes.

## Files Allowed to Change

- docs/01-work-packages/WP-046-student-query-runner-density-and-diagnostics-split.md
- apps/web/src/App.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

## Constraints

- Preserve backend-authoritative execution behavior.
- Preserve existing callback behavior for milestone tracking.
- Keep Student Mode default.
- Keep Developer Mode fully functional and diagnostic-friendly.

## Required Behavior

- QueryRunner supports a mode/audience switch (`student` and `developer`).
- Student mode:
  - no callout guidance box
  - no safety/backend/execution summary cards
  - tighter spacing and smaller textarea footprint
- Developer mode:
  - retain callout guidance
  - retain safety/backend/execution summary cards
- Student Mode app shell passes student audience behavior to QueryRunner.

## Acceptance Criteria

- [ ] Student QueryRunner hides callout guidance box.
- [ ] Student QueryRunner hides safety/backend/execution summary cards.
- [ ] Developer QueryRunner still shows callout and summary cards.
- [ ] QueryRunner callback behavior remains intact.
- [ ] Student QueryRunner layout is visibly denser.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-046 QueryRunner student/developer diagnostics split.

Do:

- add audience-mode support to QueryRunner
- pass student audience mode from App Student Mode branch
- hide student-unneeded diagnostics and callout
- apply compact student-mode spacing styles
- update tests

Do not:

- change backend/API logic
- break milestone callback behavior
- add dependencies

Return:

- files changed
- behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-046 student query runner density and diagnostics split.

Verify:

1. Only allowed files were modified.
2. Student QueryRunner hides callout and summary diagnostics.
3. Developer QueryRunner preserves those diagnostics.
4. Callback and execution behavior remain intact.
5. Student QueryRunner density/scroll footprint is reduced.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-046 for QueryRunner student/developer diagnostics split.
- Added `audience` prop to `QueryRunner` with `student` and `developer` modes.
- Student mode now hides query guidance callout.
- Student mode now hides summary diagnostics cards (`Safety`, `Backend Message`, `Execution Time`).
- Developer mode retains callout and summary diagnostics.
- Wired Student Mode in `App` to render `QueryRunner` with `audience="student"`.
- Added compact student QueryRunner spacing and textarea height adjustments.
- Added/updated tests for:
  - student callout hidden
  - student diagnostics hidden
  - callback behavior preserved

Updated Files:

- docs/01-work-packages/WP-046-student-query-runner-density-and-diagnostics-split.md
- apps/web/src/App.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Student QueryRunner hides callout guidance box.
- [x] Student QueryRunner hides safety/backend/execution summary cards.
- [ ] Developer QueryRunner still shows callout and summary cards.
- [ ] QueryRunner callback behavior remains intact.
- [x] Student QueryRunner layout is visibly denser.
- [x] No files outside allowed list changed.

## Gemini Audit Results

- Verdict: FAIL

- Violations:
  1. **Functional Violation (Requirement 4):** Callback behavior for milestone tracking is NOT preserved in Developer Mode. The `onExecutionComplete` prop is missing from the `QueryRunner` instance in the Developer Mode branch of `App.tsx`. This means any investigation progress made while in Developer Mode is not tracked or recorded in the application state.
  2. **Constraint Violation:** The requirement "Keep Developer Mode fully functional" is violated because the lack of milestone tracking in this mode prevents it from being functionally equivalent to the pre-split state regarding case progression.

- Regressions:
  1. **State Regression:** Local state of the `QueryRunner` (specifically the SQL query text and execution results) is lost when toggling between Student and Developer modes. This occurs because `App.tsx` unmounts and remounts separate instances of the component instead of toggling the `audience` prop on a single instance.
  2. **UX Regression:** The current implementation forces a choice between "clean view" (Student) and "diagnostics" (Developer) that destroys user work-in-progress during the transition, degrading the usability of the mode toggle.

- Drift risks:
  1. **Component Duplication:** Defining two separate `QueryRunner` instances in the same `App` component branch structure makes it harder to maintain state synchronization and ensures that future props added to one might be forgotten in the other (as happened with `onExecutionComplete`).
  2. **Test Coverage Gap:** The tests in `App.test.tsx` use a shallow mock for `QueryRunner`, which masked the failure to pass the `onExecutionComplete` prop to the Developer instance. This creates a false sense of security regarding integration integrity.

### Audit Summary
While the component-level changes in `QueryRunner.tsx` correctly implement the diagnostics split and the `styles.css` successfully reduces density, the integration within `App.tsx` fails to meet the project's core stability and functional preservation constraints. The loss of milestone tracking in Developer Mode and the destruction of local state during mode toggles are significant regressions from the previous "single view" architecture.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Not Approved.

Reason:
Gemini audit returned FAIL due functional regressions in Developer Mode integration (missing callback continuity and mode-toggle state continuity risks). WP-046 acceptance criteria are not fully satisfied in its audited state.

