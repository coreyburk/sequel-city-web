# student mode density and schema drilldown refinement

## Objective

Refine Student Mode into a tighter, lower-scroll investigation surface by reordering key sections, adding clickable schema drilldown links, emphasizing query execution action, and removing non-essential context blocks.

## Scope

### In Scope

- Move Schema Snapshot below Query Runner in Student Mode.
- Add clickable schema table links in Student Mode that reveal concise selected-table schema details.
- Emphasize the Run Query action visually.
- Tighten spacing and reduce vertical footprint in Student Mode.
- Remove Workspace Context section from the app shell.
- Update tests for reordered Student Mode layout and schema drilldown behavior.

### Out of Scope

- Backend or API changes.
- Query execution logic changes.
- SQL safety behavior changes.
- Developer Mode tooling removal.
- New dependencies.

## Files Allowed to Change

- docs/01-work-packages/WP-043-student-mode-density-and-schema-drilldown-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/styles.css

## Constraints

- Preserve presentation-only frontend boundaries.
- Preserve deterministic backend-authoritative behavior.
- Keep Student Mode as default.
- Keep Developer Mode functional.

## Required Behavior

- Student Mode order:
  1. Story narration and visual
  2. SQL query editor/results panel
  3. Schema Snapshot drilldown
- Schema Snapshot shows table names as links/buttons.
- Selecting a table shows a concise schema table with compact columns (`Column`, `Type`, `PK`, `FK`).
- Run Query button has strong visual emphasis.
- Student Mode spacing is tightened to reduce scrolling.
- Workspace Context section is removed.

## Acceptance Criteria

- [ ] Schema Snapshot appears below Query Runner in Student Mode.
- [ ] Clicking a schema table link displays concise selected-table schema details.
- [ ] Run Query button is visually emphasized.
- [ ] Workspace Context section is removed.
- [ ] Student Mode uses tighter spacing and reduced vertical density.
- [ ] Frontend tests cover schema drilldown behavior and Student Mode layout expectations.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-043 student-mode refinement exactly as scoped.

Do:

- reorder Student Mode sections
- add schema drilldown link behavior with compact table display
- style Run Query as primary action
- reduce Student Mode spacing
- remove Workspace Context section
- update tests

Do not:

- change backend behavior
- add dependencies
- modify files outside allowed list

Return:

- files changed
- behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-043 student mode density and schema drilldown refinement.

Verify:

1. Only allowed files were modified.
2. Student Mode layout order matches required behavior.
3. Schema table links reveal concise selected-table schema details.
4. Run Query button emphasis is present.
5. Workspace Context section is removed.
6. Frontend tests cover the new behavior.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-043 refinement scope for student-mode density and schema drilldown.
- Reordered Student Mode sections so Schema Snapshot appears below Query Runner.
- Implemented schema drilldown links using backend schema metadata (`getSchemaTables`).
- Added concise selected-table schema display with compact columns (`Column`, `Type`, `PK`, `FK`).
- Added primary styling emphasis for the Run Query button.
- Tightened Student Mode spacing and reduced vertical footprint.
- Removed Workspace Context section from the shell.
- Updated App tests for layout expectations and schema drilldown behavior.

Updated Files:

- docs/01-work-packages/WP-043-student-mode-density-and-schema-drilldown-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Schema Snapshot appears below Query Runner in Student Mode.
- [x] Clicking a schema table link displays concise selected-table schema details.
- [x] Run Query button is visually emphasized.
- [x] Workspace Context section is removed.
- [x] Student Mode uses tighter spacing and reduced vertical density.
- [x] Frontend tests cover schema drilldown behavior and Student Mode layout expectations.
- [x] No files outside allowed list changed.

## Gemini Audit Results

Audit of WP-043 student mode density and schema drilldown refinement is complete.

### Final Decision: PASS

#### Verification Summary
1.  **Allowed Files:** Only the files listed in the "Files Allowed to Change" section of WP-043 were modified. This was verified using `glob` sorted by modification time.
2.  **Layout Order:** `App.tsx` correctly implements the required Student Mode order:
    - Story Narration and Visual (`student-stage`)
    - Query Runner (`<QueryRunner />`)
    - Schema Snapshot (`schema-snapshot`)
3.  **Schema Drilldown:** Clickable table links were added to the Schema Snapshot section. Selecting a table displays a compact schema table with `Column`, `Type`, `PK`, and `FK` columns.
4.  **Run Query Emphasis:** The `.query-runner-submit` class in `styles.css` provides a strong visual emphasis using a gold-to-red linear gradient and shadow.
5.  **Workspace Context Removal:** The Workspace Context section has been entirely removed from the app shell in `App.tsx`.
6.  **Density Refinement:** Vertical density was reduced by tightening padding in the student-mode shell (`20px` vs `32px`) and panels (`12px` vs `16px`), and reducing gaps between sections.
7.  **Frontend Tests:** `App.test.tsx` was updated to verify the presence of the new layout sections, the absence of the Workspace Context, and the functionality of the schema drilldown links.

#### Violations
- None.

#### Regressions
- None observed. Developer Mode remains functional and retains its original layout density.

#### Drift risks
- **Dead CSS:** The `.workspace-context` class remains in `styles.css` despite the corresponding section being removed from the JSX. This does not impact functionality but contributes a small amount of style debt.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Approved.

Reason:
Codex implementation stayed within WP-043 scope and Gemini audit returned PASS with no violations or regressions. Student mode layout order, schema drilldown behavior, Run Query emphasis, density refinements, and workspace-context removal are complete.

