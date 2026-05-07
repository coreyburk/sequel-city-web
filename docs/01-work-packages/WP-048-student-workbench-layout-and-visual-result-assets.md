# student workbench layout and visual result assets

## Objective

Improve Student Mode readability and engagement by strengthening query-input contrast, making the Run Query action more visible, introducing a two-column investigation workbench, and adding richer visual assets tied to query results.

## Scope

### In Scope

- Increase SQL textarea contrast in Student Mode.
- Increase Run Query button visual distinction in Student Mode.
- Split Student Mode workbench into two columns:
  - Query Runner
  - Detective's Case Notes
- Keep Story Narration at top.
- Add visual result asset block tied to query response context.
- Keep row-expansion controls from WP-047.

### Out of Scope

- Backend/API changes.
- Query execution logic changes.
- Milestone matching logic changes.
- Developer Mode redesign.

## Files Allowed to Change

- docs/01-work-packages/WP-048-student-workbench-layout-and-visual-result-assets.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

## Constraints

- Preserve existing Student Mode functionality.
- Preserve Developer Mode behavior and diagnostics.
- Keep layout compact and reduce unnecessary vertical scroll.
- Do not add dependencies.

## Required Behavior

- SQL textarea stands out with clearer contrast in Student Mode.
- Run Query button has stronger visual priority in Student Mode.
- Query Runner and Detective's Case Notes render side-by-side on wider screens.
- Query result area includes a visual asset strip that changes by result context (e.g., row volume and/or safety status).

## Acceptance Criteria

- [x] Student SQL textarea has visibly improved contrast.
- [x] Student Run Query button is visibly more distinct.
- [x] Student workbench shows Query Runner and Detective's Case Notes in a two-column layout on desktop widths.
- [x] Query result visual asset block appears and updates with result context.
- [x] Existing tests pass and no files outside allowed list are changed.

## Codex Results

Implemented WP-048 in Student Mode with compact workbench and result-linked visuals.

Created/Updated:
- apps/web/src/App.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

Validation performed:
- npm run test --workspace apps/web
- Result: 7 test files passed, 23 tests passed.

## Gemini Audit Prompt

Audit WP-048 implementation against these exact requirements and files.

Target files and expected implementation details:
- apps/web/src/App.tsx
  - Student shell includes a `student-workbench` container.
  - `QueryRunner` and `Detective's Case Notes` are both rendered inside that container.
- apps/web/src/components/QueryRunner.tsx
  - Student result visual logic exists via `getStudentResultVisual`.
  - Visual states include: blocked, quiet, clue, street, archive.
  - A visual asset strip is rendered before query results in Student Mode.
- apps/web/src/styles.css
  - `.student-workbench` desktop split is defined in media query (`min-width: 960px`).
  - Student textarea styling increases contrast from base student panel styling.
  - `.app-shell--student .query-runner-submit` uses stronger contrast styling than prior WP.
  - Result visual strip styles exist for all state classes:
    - `.result-visual-strip--blocked`
    - `.result-visual-strip--quiet`
    - `.result-visual-strip--clue`
    - `.result-visual-strip--street`
    - `.result-visual-strip--archive`
- apps/web/src/components/QueryResultsTable.tsx
  - WP-047 row-limiting behavior remains: first 25 rows with expansion controls.

Audit checks:
- Confirm no backend/API files changed.
- Confirm no dependency changes in package manifests.
- Confirm behavior matches WP-048 objective without Developer Mode regression.

Return format:
- PASS or FAIL
- File-by-file verification notes
- Any required fixes

## Gemini Audit Results

PASS

### File-by-File Verification

#### apps/web/src/App.tsx
- **PASS**: The `student-workbench` container is implemented (line 218).
- **PASS**: Both `QueryRunner` and `Detective's Case Notes` (labeled as `case-progress`) are rendered inside the `student-workbench` section (lines 219-255).
- **PASS**: Layout uses the specified `student-workbench` class.

#### apps/web/src/components/QueryRunner.tsx
- **PASS**: `getStudentResultVisual` function is implemented with the correct logic (lines 135-167).
- **PASS**: All 5 visual states are handled: `blocked` (error/safety), `quiet` (0 rows), `clue` (>0 rows), `street` (>=25 rows), and `archive` (>=250 rows).
- **PASS**: The visual asset strip (`result-visual-strip`) is rendered before query results in Student Mode (lines 88-93).

#### apps/web/src/styles.css
- **PASS**: Media query for `min-width: 960px` defines the `.student-workbench` desktop split as `1.4fr 1fr` (lines 793-796).
- **PASS**: Student textarea contrast is increased via `.query-runner--student .query-controls textarea` using a lighter background (`rgba(67, 63, 75, 0.6)`) and a subtle gold inset shadow (lines 665-671).
- **PASS**: `.app-shell--student .query-runner-submit` uses a high-contrast Gold-to-Crimson gradient (`linear-gradient(100deg, #d9ae57, #b74356)`) and a prominent box shadow (lines 611-616).
- **PASS**: Result visual strip styles exist for all states:
  - `.result-visual-strip--blocked` (line 715)
  - `.result-visual-strip--quiet` (line 725)
  - `.result-visual-strip--clue` (line 692)
  - `.result-visual-strip--street` (line 698)
  - `.result-visual-strip--archive` (line 709)

#### apps/web/src/components/QueryResultsTable.tsx
- **PASS**: WP-047 row-limiting behavior remains intact. It defaults to 25 rows for students with "Show 25 More" and "Show All" controls (lines 14-19, 58-66).

### Audit Summary
- **Backend/API**: No changes detected in `apps/api/src` or its subdirectories.
- **Dependencies**: Checked `package.json` manifests; no new dependencies or version changes were introduced.
- **Developer Mode**: Verified no regressions. Developer Mode still uses the standard `app-grid` and `QueryRunner` (defaulting to developer audience) without visual strips or row limiting.

WP-048 is fully implemented according to requirements.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

Reason:
Gemini audit returned PASS and confirmed WP-048 implementation is within scope, satisfies all acceptance criteria, preserves WP-047 row-expansion behavior, introduces no backend/dependency drift, and maintains Student/Developer mode boundaries.


