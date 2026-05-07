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

The audit of **WP-048: student workbench layout and visual result assets** is complete. The implementation is verified as correct, within scope, and aligned with SSOT requirements.

### **Audit Result: PASS**

---

### **Findings**

#### **1. Scope & Dependencies**
- **Files Modified:** All changes are strictly contained within the allowed list: `App.tsx`, `App.test.tsx`, `QueryRunner.tsx`, `QueryRunner.test.tsx`, and `styles.css`.
- **Dependencies:** No new dependencies were added. Visual enhancements (noir scene, result strips) are implemented entirely using CSS (gradients, animations, `clip-path`).
- **Backend Integrity:** No changes were made to `apps/api/` or backend-facing client code.

#### **2. UI/UX Refinement (Student Mode)**
- **SQL Textarea Contrast:** In Student Mode, the textarea now uses `rgba(67, 63, 75, 0.6)` background with a `#9d8690` border and an inner shadow, significantly improving focus and readability against the dark noir theme.
- **Run Query Priority:** The button now features a high-contrast `linear-gradient(100deg, #d9ae57, #b74356)` with a distinct box-shadow, giving it clear primary action status.
- **Two-Column Layout:** The `.student-workbench` container in `App.tsx` correctly implements a side-by-side layout for the **Query Runner** and **Detective's Case Notes** (milestone tracker) at desktop widths (ΓëÑ960px).

#### **3. Functional Correctness**
- **Visual Result Assets:** `QueryRunner.tsx` includes the `getStudentResultVisual` logic which dynamically selects a visual strip (`clue`, `street`, `archive`, `blocked`, `quiet`) and narrative caption based on query success and row volume.
- **WP-047 Preservation:** The `QueryResultsTable` maintains its row-limiting and expansion behavior (showing 25 rows initially with "Show More" controls), ensuring consistency with previous work packages.
- **Milestone Tracking:** `App.tsx` maintains the Case 004 milestone logic, updating the `noir-visual` scene and `Detective's Case Notes` as the student executes relevant SQL.

#### **4. SSOT & Architecture**
- **Separation of Concerns:** The "Student" vs "Developer" mode distinction is cleanly maintained. Developer Mode remains a high-density diagnostic shell, while Student Mode provides a themed, immersive investigation experience.
- **Density Management:** A compact **Schema Snapshot** was added to the bottom of the Student Mode shell, improving workbench utility without cluttering the primary investigation columns.

---

### **Remediation Steps**
- **None required.** The implementation meets all acceptance criteria.

---
**Audit performed by Gemini CLI.**
**Date:** Thursday, May 7, 2026
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

Reason:
Gemini audit returned PASS and confirmed WP-048 implementation is within scope, satisfies all acceptance criteria, preserves WP-047 row-expansion behavior, introduces no backend/dependency drift, and maintains Student/Developer mode boundaries.

