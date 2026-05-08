# student-support-flow-correction-and-reactive-case-progression

## Objective

Correct the Student Mode support-flow regression introduced by the independent workbench scrolling, and add a more reactive layer of case progression so the student receives stronger engagement cues as clues unlock.

This WP focuses on:

- restoring the support accordions to normal flow below the workbench
- keeping the independent left/right scrolling behavior
- adding reactive Samuel feedback
- revealing emerging lead cards as the case advances

The goal is to keep the workbench structurally correct while making the investigation feel more responsive and alive.

---

## Scope

Improve Student Mode workbench/support flow and reactive progression cues.

In scope:

- desktop workbench height/scroll correction
- reactive Samuel response text tied to clue and stage state
- emerging lead cards that unlock as the case progresses
- related Student Mode test updates
- styling required for the new reactive UI elements

Out of scope:

- backend changes
- Developer Mode behavior changes
- new dependencies
- new clue-logging mechanics beyond the existing query-result actions

---

## Files Allowed to Change

- docs/01-work-packages/WP-060-student-support-flow-correction-and-reactive-case-progression.md
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
- Do not regress prior Samuel / evidence / notebook work
- Do not add dependencies

---

## Required Behavior

### 1. Support Accordions Flow Below the Workbench

The desktop workbench should remain independently scrollable while the support accordions continue to appear below it in normal page flow.

### 2. Reactive Samuel Guidance

Samuel should react more specifically to the student's current case state rather than only showing static stage copy.

### 3. Emerging Lead Cards

Student Mode should surface lightweight lead cards that unlock as the case becomes more concrete.

### 4. Test Coverage

Add or update tests to verify:

- reactive Samuel text appears
- lead cards unlock when the case advances
- existing student progression remains intact

---

## Acceptance Criteria

- `WP-060` exists
- support accordions remain below the desktop workbench
- left and right workbench panels still scroll independently
- Samuel reacts to clue/stage state
- emerging leads unlock as the case progresses
- tests cover the new reactive behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-060 student support-flow correction and reactive case progression.

Do:

- add the work package
- correct the workbench/support flow regression
- keep independent desktop scrolling
- add reactive Samuel response copy
- add emerging lead cards
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- support-flow/reactive progression summary
- test summary

---

## Gemini Audit Prompt

Audit WP-060 student support-flow correction and reactive case progression.

Verify:

1. Only approved files were modified.
2. Support accordions remain below the workbench while left/right student panels still scroll independently.
3. Samuel reacts to case state beyond static stage copy.
4. Emerging lead cards unlock as the case progresses.
5. Developer Mode remains unchanged.
6. Tests cover the new reactive behavior.

Flag:

- support sections that still feel detached from normal page flow
- reactive text that does not materially change with case progress
- lead cards that reveal too early or never unlock
- unauthorized file changes

---

## Codex Results

Implemented a Student Mode flow correction and reactive progression pass.

Files changed:

- `docs/01-work-packages/WP-060-student-support-flow-correction-and-reactive-case-progression.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Rebounded the student workbench into a fixed desktop-height region so the left and right panels still scroll independently while the lower support accordions remain in normal flow beneath the workbench.
- Added a `Samuel Reacts` block that changes based on clue feedback and case stage instead of relying only on static stage copy.
- Added `Emerging Leads` cards in the case-notes rail so the witness trail becomes visibly unlocked after the murder report is isolated, with later leads staying locked until the case advances.
- Preserved the existing notebook and guided-evidence loop while making the support rail feel more like an active case board.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit of `WP-060` is complete.

### Audit Results

1.  **Scope and File Integrity:**
    *   **Pass:** Only the approved files were modified:
        *   `docs/01-work-packages/WP-060-student-support-flow-correction-and-reactive-case-progression.md`
        *   `apps/web/src/App.tsx`
        *   `apps/web/src/App.test.tsx`
        *   `apps/web/src/styles.css`
    *   No unauthorized changes to the backend, database, or build configurations were found.

2.  **Layout and Flow:**
    *   **Pass:** The student workbench now correctly uses a fixed-height region on desktop (`max-height: calc(100vh - 210px)`) with independent `overflow-y: auto` for the left (`__main`) and right (`__rail`) panels.
    *   **Pass:** The `student-support` accordions follow the workbench in the DOM and appear below it in the normal page flow, resolving the previous regression.

3.  **Reactive Progression:**
    *   **Pass:** `getSamuelReaction` provides dynamic feedback based on clue logging state and case stage (e.g., specific guidance for "crime-type" vs "crime-scene-filter" and success/error feedback).
    *   **Pass:** `getLeadBoardCards` implements progressive lead unlocking. For example, "Witness" leads remain `locked` until the `crime-scene-filter` milestone is complete, at which point they transition to `ready`.

4.  **Developer Mode Integrity:**
    *   **Pass:** Developer Mode logic in `App.tsx` and related verification tests in `App.test.tsx` remain unchanged, ensuring the diagnostic tools are still functional.

5.  **Test Coverage:**
    *   **Pass:** `App.test.tsx` was updated with new assertions that verify Samuel's reactive text and the progressive appearance of lead cards in the case notes rail.

### Final Status: **PASS**

## Final Decision

Approved.

