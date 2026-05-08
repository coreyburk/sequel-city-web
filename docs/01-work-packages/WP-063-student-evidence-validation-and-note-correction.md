# student-evidence-validation-and-note-correction

## Objective

Correct the Student Mode evidence logging behavior so guided clue acceptance reflects the actual case objective, and allow students to remove incorrect logged notes and try again.

This WP focuses on:

- tightening guided clue validation for the crime scene report step
- preventing incorrect murder-report rows from being accepted as correct evidence
- allowing students to remove logged notebook entries and retry
- preserving the existing Student Mode progression structure while improving assessment accuracy

The goal is to ensure the notebook reflects actual understanding rather than permissive row selection.

---

## Scope

Improve Student Mode evidence-validation and notebook correction behavior.

In scope:

- Student Mode clue-validation logic updates
- notebook removal behavior for logged and manual notes
- related UI affordances for note removal
- targeted test updates for the corrected evidence behavior
- work package documentation for the fix

Out of scope:

- backend changes
- Developer Mode behavior changes
- large Student Mode layout rewrites
- final Gemini / Nano Banana art prompt generation

---

## Files Allowed to Change

- docs/01-work-packages/WP-063-student-evidence-validation-and-note-correction.md
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

- Preserve Developer Mode behavior
- Preserve the existing Student progression and milestone structure
- Keep note correction lightweight and obvious
- Do not add dependencies

---

## Required Behavior

### 1. Guided Evidence Must Match The Actual Objective

The crime scene report evidence step must only accept rows that represent the intended murder report, not any arbitrary row that happens to share the same `CrimeID`.

### 2. Incorrect Evidence Must Be Rejected Clearly

If the student logs the wrong row, Student Mode should reject it and keep the notebook unchanged.

### 3. Students Must Be Able To Remove Notes

Students must be able to remove notebook entries so they can correct mistaken evidence or delete their own manual notes.

### 4. Existing Guided Flow Must Remain Intact

The Samuel progression and milestone handoff should still work, but only after the correct evidence is logged.

---

## Acceptance Criteria

- `WP-063` exists
- the incorrect murder-report row is no longer accepted as valid evidence
- wrong evidence does not advance the guided flow or pollute the notebook
- notebook entries can be removed
- Developer Mode remains unchanged
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-063 student evidence validation and note correction.

Do:

- add the work package
- tighten the guided crime scene report evidence validation
- prevent incorrect row logging from advancing the case
- add notebook entry removal behavior
- update tests for the corrected logic

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- evidence-validation summary
- notebook correction summary
- verification summary

---

## Gemini Audit Prompt

Audit WP-063 student evidence validation and note correction.

Verify:

1. Only approved files were modified.
2. The incorrect murder-report row is rejected.
3. Correct evidence is still accepted and advances the guided flow.
4. Notebook entries can be removed safely.
5. Developer Mode behavior remains unchanged.

Flag:

- evidence checks that are still too permissive
- notebook removal that breaks progression state
- unauthorized file changes

---

## Codex Results

Implemented the Student Mode evidence-validation correction and notebook note-removal flow.

Files changed:

- `docs/01-work-packages/WP-063-student-evidence-validation-and-note-correction.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

Evidence-validation behavior delivered:

- tightened the guided crime scene report clue check so Step 3 no longer accepts any arbitrary row that merely shares `CrimeID = 1080`
- required the intended report pattern before the murder-report clue is accepted and Samuel advances
- preserved the existing guided flow so the student still progresses normally once the correct report evidence is logged

Notebook correction behavior delivered:

- added remove controls to compact notebook entries
- allowed students to delete mistaken logged notes and their own manual notes without leaving the notebook polluted by bad evidence
- kept the right-rail notebook compact while making correction behavior explicit

Verification:

- updated `App.test.tsx` to cover rejection of the incorrect report row
- updated `App.test.tsx` to cover removal of manual notebook notes
- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit complete. PASS.

Verified:

- only approved files were modified for the `WP-063` behavior changes
- the incorrect murder-report row is rejected even when the `CrimeID` matches
- the correct murder report still advances the guided flow and milestone state
- notebook entries can be removed safely without regressing milestone progress
- Developer Mode behavior remains unchanged

Results:

- evidence validation now requires matching report ID, city, and date for the guided murder-report clue
- notebook entries now support correction through explicit remove actions
- rejection logic and note removal are covered in `App.test.tsx`

Flags:

- `WP-062` files are also present in the current combined closeout and should be committed with their own approved package record

## Final Decision

Approved.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

