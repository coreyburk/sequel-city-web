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

Implemented the Student Mode noir scene upgrade as a cohesive CSS-driven visual system tied directly to investigation progress.

Files changed:

- `docs/01-work-packages/WP-062-student-noir-scene-art-upgrade-and-state-driven-visuals.md`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`

Visual system delivered:

- replaced the flatter placeholder scene treatment with a stronger noir composition built around a detective silhouette, moonlit window, desk, evidence card, and scene-state overlays
- mapped Student Mode progress to distinct scene states: `crime-ledger`, `records-vault`, `murder-board`, `student-initiative`, `breakthrough`, and `misfire`
- kept the visuals lightweight by using scoped CSS illustration and state-driven copy instead of external image dependencies
- preserved Developer Mode behavior while improving the Student Mode case-header visual experience in the narrower in-app browser pane

Verification:

- verified scene swapping logic in `App.tsx` through updated `App.test.tsx` expectations
- confirmed the visuals remain readable in the in-app browser pane
- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit complete. PASS.

Verified:

- only approved files were modified
- Student Mode visuals are materially stronger than the prior placeholder treatment
- major investigation states map to distinct noir scenes
- `getStudentSceneVisual` swaps scenes correctly based on Student Mode progress
- the visual treatment remains usable in the narrower in-app browser pane
- Developer Mode behavior remains unchanged

Flags:

- none

## Final Decision

Approved.

