# student-noir-immersion-and-clue-feedback-choreography

## Objective

Push Student Mode beyond a generic dark interface and into a more deliberate noir detective experience.

This WP focuses on:

- improving clue-feedback choreography after `Log clue`
- reducing text overflow and flattening in Samuel's guided cards
- deepening the visual noir identity
- making the main scene art change in response to guided investigation state

The goal is to make Student Mode feel more cinematic, more legible, and more reactive to student actions.

---

## Scope

Improve Student Mode feedback visibility, Samuel briefing layout, noir presentation, and related tests.

In scope:

- feedback-aware scroll behavior after clue logging
- inline row-level clue feedback near the clicked log action
- Samuel layout changes to prevent cramped instruction cards
- richer noir scene styling in Student Mode
- state-driven top visual changes tied to investigation progression
- related test updates

Out of scope:

- backend changes
- new gameplay systems beyond the current guided opening
- Developer Mode behavior changes
- new image asset imports

---

## Files Allowed to Change

- docs/01-work-packages/WP-058-student-noir-immersion-and-clue-feedback-choreography.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
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
- Keep Student Mode clue logging frontend-only and deterministic
- Keep Developer Mode behavior unchanged
- Do not add dependencies
- Do not regress the guided Samuel/evidence loop from WP-056 and WP-057

---

## Required Behavior

### 1. Feedback Re-enters the Student's View

After a student uses `Log clue`, the clue feedback should be brought back into frame when needed rather than forcing the student to manually search for what changed.

### 2. Local Interaction Feedback

The clicked row should provide a local clue-response cue so the student can connect the action to the resulting feedback.

### 3. Samuel Cards Should Read Cleanly

The `Next Step` instruction should have more visual space than the secondary guidance cards so long instructional text does not feel cramped or overflow-prone.

### 4. Stronger Noir Art Direction

Student Mode should lean into a more specific noir detective aesthetic rather than reading as a generic dark theme.

### 5. State-Driven Visual Changes

The main visual should change according to the guided investigation state so different moments of the case feel visually distinct.

### 6. Test Coverage

Add or update tests to verify:

- the changing scene copy/state remains correct
- row-level clue feedback is shown after interaction
- existing guided Student Mode behavior remains intact

---

## Acceptance Criteria

- `WP-058` exists
- clue feedback can return into frame after `Log clue`
- row-level clue response appears near the clicked action
- Samuel instruction cards no longer treat all guidance as equal-width cramped tiles
- Student Mode has a stronger noir presentation
- the main scene changes with guided interaction state
- tests cover the revised behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-058 student noir immersion and clue-feedback choreography.

Do:

- add the work package
- improve clue-feedback visibility after row logging
- add local row-level clue feedback
- reflow Samuel guidance cards so the main instruction has more space
- deepen the noir theme
- make the top scene change with guided state
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- interaction/visual refinement summary
- test summary

---

## Gemini Audit Prompt

Audit WP-058 student noir immersion and clue-feedback choreography.

Verify:

1. Only approved files were modified.
2. Clue feedback is brought back into view after logging when needed.
3. Row-level clue response appears near the `Log clue` interaction.
4. Samuel's primary instruction has more room than the secondary guidance cards.
5. Student Mode now presents a stronger noir detective feel than a generic dark theme.
6. The main scene changes according to guided investigation state.
7. Developer Mode remains unchanged.
8. Tests cover the revised scene/feedback behavior.

Flag:

- feedback that still leaves the student searching the page
- brittle layout changes that still risk cramped Samuel copy
- visual changes that are merely darker without more specific noir identity
- unauthorized file changes

---

## Codex Results

Implemented a Student Mode refinement pass focused on noir atmosphere, clue-feedback choreography, and better instructional legibility.

Files changed:

- `docs/01-work-packages/WP-058-student-noir-immersion-and-clue-feedback-choreography.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Added state-driven noir scene variants in the Student Mode header so the main visual now changes with the guided investigation state:
  - crime ledger
  - records vault
  - murder board
  - breakthrough / false lead
- Reworked Samuel&apos;s guidance layout so `Next Step` gets a larger primary card while `Why It Matters` and `Success Looks Like` sit in secondary support cards.
- Added row-level clue feedback directly beside the clicked `Log clue` action.
- Added feedback-aware scroll behavior in the results area so the `Evidence Desk` can be brought back into frame after a clue log when needed.
- Deepened the noir styling with more deliberate desk / dossier / evidence-board treatment instead of relying on a generic dark panel look.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `29` tests passed

## Gemini Audit Results

**Audit Results for WP-058**

I have completed the audit of the WP-058 implementation.

**Verified:**
1. **File Modification Scope:** Only the approved files were modified (confirmed via repository check).
2. **Clue Feedback Visibility:** A `useEffect` hook with `scrollIntoView` correctly ensures the `student-evidence-hud` is brought back into frame if it is out of bounds after logging a clue.
3. **Row-Level Clue Response:** The component properly tracks `lastLoggedRowIndex` and injects the inline feedback text directly beneath the clicked `Log clue` action. This behavior is also validated in `QueryResultsTable.test.tsx`.
4. **Samuel's Instruction Layout:** The new `samuel-briefing__support-grid` gives the `Next Step` prompt full width, while `Why It Matters` and `Success Looks Like` are safely arranged side-by-side below it, preventing cramped copy.
5. **Noir Detective Feel:** `styles.css` successfully replaces the generic dark mode with distinct noir graphics (detective silhouette, moon, window, desk, evidence board) and a thematic color palette.
6. **State-Driven Visuals:** The `getStudentSceneVisual` function successfully maps the `samuelStage`, `pendingEvidenceStep`, and `studentEvidenceFeedbackTone` into specific scene states (`crime-ledger`, `records-vault`, `murder-board`, `breakthrough`, `misfire`).
7. **Developer Mode Isolation:** Developer mode behavior, conditional checks, and grid layouts remain completely untouched and functionally unchanged.

**Audit Follow-up:**
- Added scene-transition assertions in `App.test.tsx` so the dynamic noir visual states are now covered by the frontend test suite.

**Final audit status:** PASS

## Final Decision

Approved.

