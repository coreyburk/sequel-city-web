# student interface shell and mode toggle

## Objective

Introduce a student-focused frontend shell that improves investigation orientation and guided flow entry without removing the existing developer-focused workspace.

## Scope

### In Scope

- Add a frontend mode toggle between student and developer shell views.
- Add student-focused header/context and guided task framing in the shell.
- Preserve access to all existing investigation panels and runtime behavior.
- Add frontend tests for mode switching and core section visibility.

### Out of Scope

- Backend changes.
- API contract changes.
- Query execution logic changes.
- Schema, history, or suspect verification feature rewrites.
- Styling refactors beyond shell-level additions needed for the new view.

## Files Allowed to Change

- docs/01-work-packages/WP-041-student-interface-shell-and-mode-toggle.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css

## Constraints

- Keep frontend presentation-only boundaries intact.
- Preserve deterministic/backend-authoritative behavior.
- Keep all existing panels available and functional.
- Do not add dependencies.

## Required Behavior

- App defaults to Student Mode.
- Shell includes explicit mode toggle for Student Mode and Developer Mode.
- Student Mode presents concise guided task framing aligned to WP-040 baseline.
- Developer Mode preserves existing first-run guidance context.
- Core panels (`HealthStatus`, `SchemaExplorer`, `QueryRunner`, `SuspectVerificationPanel`, `QueryHistoryPanel`) remain rendered and accessible in both modes.

## Acceptance Criteria

- [ ] Student Mode is default.
- [ ] Mode toggle switches shell content between student and developer framing.
- [ ] Existing core panel headings remain visible in both modes.
- [ ] Frontend tests cover default mode and mode switching.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-041 frontend shell mode toggle and student framing.

Do:

- update App shell and styles for student/developer mode framing
- keep existing core panels rendered
- add tests for default and toggled mode behavior

Do not:

- modify backend or API code
- remove existing panel functionality
- add dependencies

Return:

- files changed
- behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-041 student interface shell and mode toggle.

Verify:

1. Only allowed files were modified.
2. Student Mode is default and mode toggle behavior works.
3. Core investigation panels remain present in both modes.
4. Changes remain presentation-only with no backend/API drift.
5. Frontend tests cover the new mode behavior.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-041 and implemented a student/developer mode shell toggle in `App`.
- Set Student Mode as the default view.
- Added student quickstart framing aligned to WP-040 task baseline.
- Preserved developer first-run guidance as a toggleable shell view.
- Preserved rendering of all existing core backend-connected panels in both modes.
- Added frontend tests for default mode and mode switching behavior.

Updated Files:

- docs/01-work-packages/WP-041-student-interface-shell-and-mode-toggle.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Student Mode is default.
- [x] Mode toggle switches shell content between student and developer framing.
- [x] Existing core panel headings remain visible in both modes.
- [x] Frontend tests cover default mode and mode switching.
- [x] No files outside allowed list changed.

## Gemini Audit Results

Audit of WP-041 student interface shell and mode toggle is complete.

- Verdict: PASS
- Violations: None.
- Regressions: None.
- Drift risks: None.

### Verification Summary

1.  **Scope Control:** Only the allowed files (`apps/web/src/App.tsx`, `apps/web/src/App.test.tsx`, `apps/web/src/styles.css`, and the WP doc) were modified. No backend or API code was touched.
2.  **Student Mode Default:** `App.tsx` correctly initializes state to `"student"`, ensuring the app starts in the guided student view.
3.  **Mode Toggle Behavior:** The header includes a functional mode toggle that switches between "Student Mode" and "Developer Mode", updating the guidance and context sections accordingly.
4.  **Panel Preservation:** All five core investigation panels (`HealthStatus`, `SchemaExplorer`, `SuspectVerificationPanel`, `QueryRunner`, `QueryHistoryPanel`) are rendered unconditionally at the bottom of the layout, remaining functional in both modes.
5.  **Presentation-Only Boundaries:** The implementation is strictly UI-level conditional rendering and styling. No backend logic, API contracts, or data models were altered.
6.  **Test Coverage:** `App.test.tsx` includes new test cases that verify the default student mode state and the successful transition to developer mode, including the visibility of appropriate guidance text.

### Files Modified

- `docs/01-work-packages/WP-041-student-interface-shell-and-mode-toggle.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Approved.

Reason:
Codex implementation stayed within scope and Gemini audit returned PASS with no violations, regressions, or drift risks. Student mode default behavior, mode toggle shell framing, and panel preservation requirements are satisfied.

