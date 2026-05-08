# student-case-notes-progressive-lead-reveal

## Objective

Reduce student information overload in `Detective's Case Notes` by revealing only a small number of starting leads and progressively unlocking additional notes as students make query progress.

This WP establishes:

- two starting leads instead of a large up-front lead dump
- a progressively revealed case-note checklist instead of showing all six items immediately
- lighter student-facing copy that supports exploration without over-directing the next query

The goal is to preserve guidance while making the investigation feel more manageable and self-directed.

---

## Scope

Adjust the Student Mode case-notes experience and related tests.

In scope:

- case-note reveal logic
- student lead count and checklist visibility
- related student-facing copy
- student starter query content
- app-level tests for the reveal flow

Out of scope:

- backend changes
- schema snapshot behavior changes
- query execution logic changes
- developer mode changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-053-student-case-notes-progressive-lead-reveal.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx

Do Not Modify:

- apps/api/**
- apps/web/src/styles.css
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve current milestone tracking logic
- Preserve Student Mode default startup experience
- Keep the guidance spoiler-safe
- Do not add dependencies
- Keep the implementation simple and deterministic

---

## Required Behavior

### 1. Starting Lead Load

Student Mode should begin with only the first couple of actionable leads visible.

### 2. Progressive Reveal

As milestones are completed, additional case-note items should be revealed gradually instead of showing the full six-item list immediately.

### 3. Lead Cap

Visible active leads should remain concise, with no more than two incomplete leads shown at once.

### 4. Student Copy

Student-facing lead/caption language should avoid prematurely listing all future clue tracks at once.

### 5. Starter Query

Student Mode should not begin with `SELECT DB_NAME() AS CurrentDatabase`.

It should start with the original-assignment style query guidance that begins by investigating `CrimeType` and then `CrimeSceneReport`.

### 6. Test Coverage

Add or update tests to verify:

- only the starting leads are visible on first render
- later note items unlock after milestone progress
- future leads are not shown too early
- student starter query differs from the developer default query

---

## Acceptance Criteria

- `WP-053` exists
- Student Mode shows only two starting leads
- the checklist no longer shows all six milestone items immediately
- additional note items unlock after milestone progress
- future leads remain hidden until unlocked
- Student Mode no longer starts with `SELECT DB_NAME() AS CurrentDatabase`
- app tests cover the progressive reveal behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-053 progressive lead reveal for Student Mode case notes.

Do:

- add the work package
- reduce initial lead overload
- reveal case-note items progressively as milestones are completed
- replace the student starter query with the original assignment's opening investigation guidance
- update tests for the new reveal flow

Do not:

- change backend behavior
- change developer mode
- add dependencies

Return:

- files changed
- student UX behavior change summary
- test summary

---

## Gemini Audit Prompt

Audit WP-053 progressive lead reveal for Student Mode case notes.

Verify:

1. Only approved files were modified.
2. Student Mode initially shows only a small number of leads.
3. The case-note checklist no longer reveals all six items on first render.
4. Additional note items unlock after milestone progress.
5. Future clue tracks are not exposed too early.
6. Developer Mode behavior remains unchanged.
7. App tests were updated to cover the reveal flow.

Flag:

- early spoiler leakage
- overly prescriptive student copy
- unauthorized file changes
- missing test coverage

---

## Codex Results

Completed:

- Added `WP-053` for progressive lead reveal in Student Mode case notes.
- Updated `apps/web/src/App.tsx` so:
  - only two leads are visible at a time
  - the case-note checklist reveals milestones progressively instead of showing all six immediately
  - the mid-progress scene caption no longer lists multiple future clue tracks at once
- Updated `apps/web/src/components/QueryRunner.tsx` so Student Mode starts with the original assignment-style `CrimeType` / `CrimeSceneReport` investigation guidance instead of the developer `DB_NAME()` query.
- Updated `apps/web/src/App.test.tsx` to verify:
  - only the starting case-note items are visible on first render
  - future note items remain hidden initially
  - additional note items unlock after milestone progress
- Updated `apps/web/src/components/QueryRunner.test.tsx` to verify the student starter query differs from the developer default.

Validation Performed:

- Ran `npm run test --workspace apps/web`
- Result: 7 test files passed, 25 tests passed.

Notes:

- No backend or Developer Mode behavior was changed.

## Gemini Audit Results

The audit of WP-053 "Student Mode case notes progressive lead reveal" is complete. The implementation successfully reduces information overload for students and introduces a more discovery-focused experience.

### Verification Results

1.  **Approved File Changes:** All modifications were restricted to the allowed set (`App.tsx`, `App.test.tsx`, `QueryRunner.tsx`, `QueryRunner.test.tsx`). No backend or unauthorized frontend files were changed.
2.  **Initial Lead Load:** Student Mode now correctly initializes with only the first two leads visible ("Find the right crime records" and "Narrow the exact case report"). 
3.  **Progressive Reveal:** The `revealedMilestones` logic in `App.tsx` dynamically expands the checklist as milestones are completed, maintaining a "completed + 2" visibility window.
4.  **Lead Capping:** The `activeLeads` logic ensures students are never presented with more than two incomplete leads at once, preventing "to-do list" fatigue.
5.  **Spoiler Safety:** The `sceneCaption` copy has been refactored to use generic, atmosphere-building language (e.g., "Midnight fog over Sequel City") instead of listing future clue tracks.
6.  **Student Starter Query:** The default query for Student Mode has been changed from `SELECT DB_NAME()` to a multi-step investigation guidance starting with `CrimeType` and `CrimeSceneReport`, aligning with the original project vision.
7.  **Developer Mode Integrity:** Developer Mode remains unchanged, preserving its diagnostic tools and default "First-Run Guidance" queries.
8.  **Test Coverage:** `App.test.tsx` and `QueryRunner.test.tsx` have been updated to specifically verify the progressive reveal behavior and the new starter query.

### Findings

- **Early Spoiler Leakage:** None. Future leads remain hidden until the student reaches the appropriate milestone.
- **Student Copy:** Copy is supportive and thematic without being overly prescriptive about specific future table names until they are relevant.
- **Unauthorized Changes:** None.
- **Test Coverage:** Comprehensive for the new logic.

The implementation is **approved** and aligns with the SSOT for Case 004's progression model.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

Reason:
Gemini rerun returned PASS and confirmed the progressive lead reveal, reduced initial case-note load, student starter-query correction, unchanged Developer Mode behavior, and updated test coverage all meet the work package requirements without unauthorized file changes.


