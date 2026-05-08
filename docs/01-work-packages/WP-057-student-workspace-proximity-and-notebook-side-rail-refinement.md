# student-workspace-proximity-and-notebook-side-rail-refinement

## Objective

Refine Student Mode so the investigation workspace feels deliberate instead of overloaded.

This WP focuses on:

- restoring a clear side-by-side working layout
- keeping the Evidence Notebook visible while the student queries
- moving clue feedback close to the `Log clue` interaction
- removing low-value controls that add noise without helping the student

The goal is to make the student always understand:

- where to look
- what to do next
- what changed after an evidence action

---

## Scope

Improve Student Mode workspace layout, evidence feedback proximity, and related tests.

In scope:

- Student Mode layout refinement in the app shell
- persistent notebook side rail
- local evidence feedback inside the results area
- removal of redundant `Load Query Draft` behavior
- test updates for the revised student workspace flow
- styling updates required for the new hierarchy

Out of scope:

- backend changes
- evidence-logging rules themselves
- Developer Mode behavior changes
- new gameplay systems beyond the existing Samuel-guided opening

---

## Files Allowed to Change

- docs/01-work-packages/WP-057-student-workspace-proximity-and-notebook-side-rail-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/styles.css

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve backend-authoritative query execution
- Keep Student Mode evidence logging frontend-only and deterministic
- Keep Developer Mode behavior unchanged
- Do not add dependencies
- Do not reintroduce equal-weight dashboard clutter in Student Mode

---

## Required Behavior

### 1. Side-by-Side Student Workspace

Student Mode should present the action flow and the notebook/case-file context in a clearer two-column workspace on larger screens.

### 2. Persistent Evidence Notebook

The Evidence Notebook should remain visible during the student workflow instead of being buried in a lower support accordion.

### 3. Local Evidence Feedback

Clue feedback should appear in the same results area as the `Log clue` controls so the student immediately sees what happened.

### 4. Remove Redundant Query-Draft Control

If Samuel already stages the active guided query, Student Mode should not show a redundant `Load Query Draft` button.

### 5. Preserve Tertiary Support Sections

Bottom accordions should remain for lower-priority support material such as schema help and full story recap.

### 6. Test Coverage

Add or update tests to verify:

- the notebook remains visible in Student Mode
- Samuel-guided query drafting still updates correctly without the removed button
- evidence feedback appears in the results area
- Developer Mode remains unchanged

---

## Acceptance Criteria

- `WP-057` exists
- Student Mode restores a clearer side-by-side workspace
- the Evidence Notebook is visible without opening a lower accordion
- clue feedback appears adjacent to the results interaction area
- `Load Query Draft` is removed
- bottom accordions remain for schema/story support
- tests cover the revised behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-057 student workspace proximity and notebook side-rail refinement.

Do:

- add the work package
- restore a clearer side-by-side Student Mode workspace
- keep the notebook visible in a side rail
- move clue feedback into the results area
- remove the redundant query-draft button
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- student workspace refinement summary
- test summary

---

## Gemini Audit Prompt

Audit WP-057 student workspace proximity and notebook side-rail refinement.

Verify:

1. Only approved files were modified.
2. Student Mode restores a clearer side-by-side workspace on larger screens.
3. The Evidence Notebook remains visible without requiring a lower accordion to be opened.
4. Clue feedback appears in the results area near the `Log clue` interaction.
5. The redundant `Load Query Draft` control was removed.
6. Lower-priority support remains available through bottom accordions.
7. Developer Mode remains unchanged.
8. Tests cover the revised student workspace behavior.

Flag:

- evidence feedback that still requires the student to search the screen
- notebook/case-note context that still competes equally with the main task
- unauthorized file changes
- missing or stale test coverage

---

## Codex Results

Implemented a proximity-focused Student Mode refinement pass on top of the existing Samuel/evidence workflow.

Files changed:

- `docs/01-work-packages/WP-057-student-workspace-proximity-and-notebook-side-rail-refinement.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Restored Student Mode to a clearer workbench layout with the action flow on the left and a persistent notebook/case-notes rail on the right.
- Removed the redundant `Load Query Draft` button and automatically staged Samuel&apos;s current guided query as the opening breadcrumbs advance.
- Kept `Evidence Notebook` visible instead of burying it in the lower support area.
- Moved student clue feedback into the query results area via a local `Evidence Desk`, so the student sees evidence summary, clue feedback, and notebook prompt close to the `Log clue` interaction.
- Kept schema help and full story recap as lower-priority support accordions.
- Updated tests to cover the visible notebook rail, local evidence feedback, and guided draft progression without the removed button.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `29` tests passed

## Gemini Audit Results

Audit WP-057 student workspace proximity and notebook side-rail refinement.

### Audit Summary

The implementation of **WP-057** has been verified against the required behavior and constraints. The changes effectively restore a focused, side-by-side working layout for students while ensuring that evidence logging and feedback are highly visible and proximal to the user's actions.

### Verification Results

1.  **Approved Files:** Verified. Only the 8 files specified in the work package were modified.
2.  **Side-by-Side Workspace:** Verified. `styles.css` now includes a responsive grid for `.student-workspace` (1.5fr / 0.8fr) and a sticky rail for larger screens (960px+).
3.  **Evidence Notebook Visibility:** Verified. The Evidence Notebook and Detective's Case Notes have been moved from bottom accordions to a persistent side rail (`aside.student-workspace__rail`) in `App.tsx`.
4.  **Local Evidence Feedback:** Verified. A new `Evidence Desk` HUD (`.student-evidence-hud`) was added to `QueryResultsTable.tsx`, placing clue feedback and notebook prompts directly above the query results and "Log clue" buttons.
5.  **Removed Redundant Control:** Verified. The `Load Query Draft` button has been removed. Samuel's guided queries are now automatically staged via an effect in `App.tsx` that updates the `studentDraftQuery` passed to `QueryRunner`.
6.  **Tertiary Support:** Verified. "Need Table Help?" and "Full Story Recap" remain available in bottom accordions.
7.  **Developer Mode:** Verified. The Developer Mode layout and component configuration remain unchanged.
8.  **Test Coverage:** Verified. New and updated tests in `App.test.tsx`, `QueryRunner.test.tsx`, and `QueryResultsTable.test.tsx` explicitly cover the persistent rail, the HUD feedback, and the automatic query staging.

### Flags

-   **Dead Code:** `App.tsx` contains a block of dead code where the original "Detective's Case Notes" accordion is wrapped in `{false ? (...) : null}`. While this does not impact functionality, it should be removed to maintain codebase cleanliness.
-   **Feedback Proximity:** While the `Evidence Desk` is correctly placed within the results area, students viewing a full page of 25 rows may still need to scroll up slightly to see the `Clue Feedback` if they click "Log clue" on a lower row. However, this is a significant improvement over the previous accordion-based layout.

### Final Decision: APPROVED

The student experience is now significantly more "deliberate" and less "overloaded," successfully achieving the goals of WP-057.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

