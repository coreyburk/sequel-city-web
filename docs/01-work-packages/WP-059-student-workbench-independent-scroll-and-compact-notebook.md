# student-workbench-independent-scroll-and-compact-notebook

## Objective

Improve Student Mode workbench usability as the case file grows by letting the main work area and the case-notes rail scroll independently, while making the Evidence Notebook more compact and practical.

This WP focuses on:

- independent vertical scrolling for the left and right workbench panels
- a tighter notebook presentation that consumes less space
- a lightweight way for students to add their own notes alongside logged clues

The goal is to keep Student Mode usable during longer investigations without forcing students to choose between seeing the query flow and seeing their notes.

---

## Scope

Improve Student Mode workbench scrolling behavior, notebook density, and related tests.

In scope:

- independent panel scrolling on the student workbench
- compact Evidence Notebook rendering
- manual student note entry in the notebook rail
- concise logged clue formatting
- related test updates

Out of scope:

- backend changes
- Developer Mode behavior changes
- new clue-logging mechanics beyond the current button-driven flow
- new dependencies

---

## Files Allowed to Change

- docs/01-work-packages/WP-059-student-workbench-independent-scroll-and-compact-notebook.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
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
- Keep Student Mode clue logging frontend-only and deterministic
- Keep Developer Mode behavior unchanged
- Do not regress the Samuel / evidence loop delivered in prior work packages
- Do not add dependencies

---

## Required Behavior

### 1. Independent Desktop Scrolling

On larger screens, the left work area and the right case-notes rail should be able to scroll vertically without forcing the whole Student Mode page to move as one long column.

### 2. Compact Evidence Notebook

The Evidence Notebook should read as a concise working list rather than a stack of large cards.

### 3. Concise Logged Facts

Logged evidence should be recorded as compact fact entries such as `CrimeID = 1080` and `ReportCity = SQL City`.

### 4. Manual Student Notes

Students should be able to add their own freeform notes into the notebook rail.

### 5. Test Coverage

Add or update tests to verify:

- concise logged entries appear in the notebook
- manual notes can be added
- existing Student Mode progression remains intact

---

## Acceptance Criteria

- `WP-059` exists
- the student workbench supports independent panel scrolling on desktop
- the notebook is presented as a compact list
- logged clues appear as concise fact entries
- students can add their own notes
- tests cover the revised notebook behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-059 student workbench independent scroll and compact notebook.

Do:

- add the work package
- allow independent left/right panel scrolling on desktop
- make the notebook a compact list
- store logged clues as concise facts
- add a simple manual-note input for students
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- notebook/workbench refinement summary
- test summary

---

## Gemini Audit Prompt

Audit WP-059 student workbench independent scroll and compact notebook.

Verify:

1. Only approved files were modified.
2. The main work area and case-notes rail can scroll independently on larger screens.
3. The notebook now renders as a compact list rather than large stacked cards.
4. Logged evidence is recorded as concise fact entries.
5. Students can add manual notes.
6. Developer Mode remains unchanged.
7. Tests cover the revised notebook behavior.

Flag:

- oversized notebook UI that still wastes vertical space
- scrolling changes that break the student workbench layout
- manual-note behavior that disrupts the existing guided flow
- unauthorized file changes

---

## Codex Results

Implemented a Student Mode workbench usability pass focused on independent scrolling and a tighter notebook.

Files changed:

- `docs/01-work-packages/WP-059-student-workbench-independent-scroll-and-compact-notebook.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- On larger screens, the left student work area and the right notebook/case-notes rail now scroll independently instead of behaving like one long shared column.
- Converted the Evidence Notebook from large stacked cards into a compact bulleted list so it consumes much less vertical space.
- Changed guided clue logging to record concise fact entries such as:
  - `CrimeID = 1080`
  - `ReportCity = Sequel City`
  - `ReportDate = 2023-01-15`
- Added a lightweight manual note input so students can record their own observations and hunches in the notebook rail.
- Preserved the existing Samuel-guided evidence flow while making the case-notes rail more practical during longer investigation work.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit of WP-059 is complete. All requirements have been successfully implemented and verified.

### 1. File Modification Audit
Only approved files were modified:
- `docs/01-work-packages/WP-059-student-workbench-independent-scroll-and-compact-notebook.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

### 2. Independent Scrolling
Verified in `apps/web/src/styles.css`. At the 960px breakpoint, `.student-workspace__main` and `.student-workspace__rail` now feature `max-height: calc(100vh - 220px)` and `overflow-y: auto`. This ensures that on desktop screens, the work area and the notebook rail scroll independently.

### 3. Compact Evidence Notebook
Verified in `apps/web/src/App.tsx` and `apps/web/src/styles.css`. The notebook has been converted from a stack of cards to a bulleted list using the `notebook-entry-list--compact` class. This class removes borders, backgrounds, and padding from individual items, significantly increasing information density.

### 4. Concise Logged Facts
Verified in `apps/web/src/App.tsx`. Guided clue logging now records evidence in a "Key = Value" format (e.g., `CrimeID = 1080`, `ReportCity = Sequel City`), fulfilling the requirement for concise fact entries.

### 5. Manual Student Notes
Verified in `apps/web/src/App.tsx`. A new manual note input field and "Add Note" button have been added to the notebook rail, allowing students to record their own observations.

### 6. Developer Mode Integrity
Verified in `apps/web/src/App.tsx` and `apps/web/src/App.test.tsx`. Developer Mode continues to render its specialized diagnostic panels and is unaffected by the student-specific workbench scrolling and notebook refinements.

### 7. Test Coverage
Verified in `apps/web/src/App.test.tsx`. Existing tests were updated and new tests were added to confirm:
- Progressively revealed case-note items appear as concise facts.
- Students can successfully add and view manual notes.
- The overall Samuel-guided flow remains intact.

**Result: PASS**

## Final Decision

Approved.

