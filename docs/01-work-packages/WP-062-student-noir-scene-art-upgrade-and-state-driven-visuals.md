# student-noir-scene-art-upgrade-and-state-driven-visuals

## Objective

Replace the current placeholder noir visuals in Student Mode with a stronger, more cinematic image system that materially improves immersion and better matches each investigation step.

This WP focuses on:

- defining a consistent Student Mode noir art direction
- mapping investigation states to specific scene imagery
- generating or importing task-appropriate visual assets
- wiring those assets into Student Mode so the scene changes with case progress

The goal is to make the case feel like a living detective story rather than a dark UI with decorative placeholders.

---

## Scope

Improve Student Mode scene art, image progression, and state-driven visual presentation.

In scope:

- Student Mode noir visual direction refinement
- scene-by-scene mapping for the guided opening case flow
- generated or imported image assets for the mapped states
- frontend integration for state-driven image swapping
- sizing/cropping treatment for the actual in-app browser layout
- related test updates if state rendering logic changes
- work package documentation for the visual upgrade

Out of scope:

- backend changes
- Developer Mode behavior changes
- broad layout rewrites unrelated to scene visuals
- new clue-logging mechanics
- audio, video, or animation-heavy media systems

---

## Files Allowed to Change

- docs/01-work-packages/WP-062-student-noir-scene-art-upgrade-and-state-driven-visuals.md
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/App.test.tsx
- apps/web/public/**
- apps/web/src/assets/**

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve Developer Mode behavior
- Preserve existing Student Mode progression, notebook, Samuel, and evidence interactions
- Keep image handling lightweight enough for local development
- Do not add dependencies unless they are clearly required
- Keep visuals legible within the narrower in-app browser pane

---

## Required Behavior

### 1. Stronger Noir Art Direction

Student Mode should use a more deliberate noir visual language than the current abstract dark illustration treatment.

### 2. Step-Appropriate Scene Imagery

Each major guided state should show an image that supports the current investigation objective.

Minimum expected states:

- opening case / crime ledger
- crime type lookup
- broad crime scene report review
- filtered murder report
- witness lead emergence
- clue confirmed / evidence advancement

### 3. State-Driven Visual Swapping

Scene visuals should change based on real Student Mode progress rather than remaining static.

### 4. In-Context Usability

Images must work in the actual Student Mode layout, especially in the narrower in-app browser pane.

### 5. Asset/System Consistency

The scenes should feel like one visual system instead of unrelated illustrations.

---

## Acceptance Criteria

- `WP-062` exists
- Student Mode uses stronger noir scene imagery than the current placeholder treatment
- major investigation states map to distinct visuals
- visuals change with Student Mode progress
- the scenes remain usable in the in-app browser layout
- Developer Mode remains unchanged
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-062 student noir scene art upgrade and state-driven visuals.

Do:

- add the work package
- define the Student Mode noir art direction
- create or import step-appropriate scene visuals
- map visuals to investigation progress states
- integrate them into Student Mode
- verify the result in the in-app browser layout
- update tests if rendering logic changes

Do not:

- change backend behavior
- change Developer Mode behavior
- add unnecessary dependencies

Return:

- files changed
- visual-system summary
- state-to-scene summary
- verification summary

---

## Gemini Audit Prompt

Audit WP-062 student noir scene art upgrade and state-driven visuals.

Verify:

1. Only approved files were modified.
2. Student Mode visuals are materially improved beyond the prior placeholder noir treatment.
3. Major guided investigation states map to distinct, appropriate scene imagery.
4. Scene swapping follows Student Mode state correctly.
5. The visuals remain usable within the actual in-app browser pane.
6. Developer Mode behavior remains unchanged.

Flag:

- visuals that feel generic, repetitive, or inconsistent
- image states that do not correspond clearly to the investigation step
- sizing/cropping that harms usability in the app
- unauthorized file changes

---

## Codex Results

Implemented a real asset-backed Student Mode noir scene system and replaced the previous CSS-only placeholder illustration treatment.

Files changed:

- `docs/01-work-packages/WP-062-student-noir-scene-art-upgrade-and-state-driven-visuals.md`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `apps/web/src/assets/student-scenes/crime-ledger.svg`
- `apps/web/src/assets/student-scenes/records-vault.svg`
- `apps/web/src/assets/student-scenes/murder-board.svg`
- `apps/web/src/assets/student-scenes/student-initiative.svg`
- `apps/web/src/assets/student-scenes/breakthrough.svg`
- `apps/web/src/assets/student-scenes/misfire.svg`

Visual system delivered:

- replaced the procedural noir placeholder scene with framed illustration assets that share one palette, desk-board composition language, and dossier-driven detective tone
- reworked the Student case header visual into an image-backed scene frame with controlled scrim, grain, badge, and caption overlays that stay legible in the narrower in-app browser pane
- preserved the existing Student progression, Samuel guidance, notebook, and Developer Mode behavior while materially upgrading the scene quality

State-to-scene mapping delivered:

- `crime-ledger`: desk-lamp dossier scene for opening crime-type work
- `records-vault`: archive-drawer scene for broad crime scene report review
- `murder-board`: pinned evidence board for filtered report narrowing
- `student-initiative`: open-trail desk scene after Samuel hands control back
- `breakthrough`: illuminated board for confirmed clue moments
- `misfire`: crossed-out evidence board for false-lead feedback

Verification:

- updated `App.tsx` scene descriptors to return image source, badge, caption, and alt text per state
- updated `App.test.tsx` to verify real image swapping for the key Student progression states
- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit complete. PASS.

Verified:

- only approved files were modified
- the asset-backed Student Mode visuals are materially stronger than the prior CSS-only placeholder treatment
- major guided investigation states map to distinct noir scene assets
- `getStudentSceneVisual` swaps scenes correctly based on Student Mode progress and feedback state
- the scene frame remains usable in the narrower in-app browser pane
- Developer Mode behavior remains unchanged

Results:

- 6 custom SVG scenes delivered with one unified detective-noir visual language
- real asset swapping is covered in `App.test.tsx`

Flags:

- none

## Final Decision

Approved.



