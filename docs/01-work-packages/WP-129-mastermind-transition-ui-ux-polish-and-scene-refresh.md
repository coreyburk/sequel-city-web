# WP-129: Mastermind Transition UI/UX Polish and Scene Refresh

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-05-23

## Goal

Polish the transition from `First Suspect Confirmed` into the mastermind investigation so the interface feels like a deliberate new chapter of the case instead of a mechanical continuation of the same workflow.

This WP is limited to transition presentation and interaction polish. It does not own the later mastermind clue-extraction gameplay or the suspect-interview pacing changes that now live in WP-130 and WP-131.

## Problem Statement

The mastermind transition was functionally correct, but the UI still felt too operational in several places:

- the Evidence Notebook supported Page 1 / Page 2, but the controls were visually heavy and repetitive
- the student could move clues between pages, but the interaction did not yet feel like a crafted notebook workflow
- the shift from hired-killer confirmation into mastermind investigation lacked a distinct visual beat of its own
- the scene treatment still leaned on the hired-killer reveal rather than a fresh mastermind-investigation atmosphere
- the new investigation phase needed to feel like "the case just deepened," not simply "keep doing more of the same"

## Desired Outcomes

- the mastermind transition feels like a deliberate new chapter of the case
- the notebook controls feel lighter, more tactile, and less button-heavy
- the student immediately understands that they are now reviewing, curating, and pursuing second-layer clues
- a dedicated scene image supports the shift from suspect confirmation into mastermind hunting
- Samuel's presentation, the notebook, and the Query Lab all reinforce the same emotional and instructional beat

## Scope

### 1. Mastermind transition scene refresh

- add a dedicated noir scene image for the mastermind investigation transition
- use it after the hired killer is confirmed and before the final mastermind reveal
- ensure the art direction communicates:
  - the hired killer is known
  - the real power behind the crime is still hidden
  - the next phase is deeper, more analytical, and more conspiratorial

### 2. Evidence Notebook UI/UX polish

- reduce the visual weight of the page-movement controls
- keep the page-tab metaphor, but refine the controls so the notebook reads like a real object instead of a form with many repeated buttons
- improve spacing, visual grouping, and hierarchy on both notebook pages
- preserve the hand-drawn circled killer note as the accomplishment anchor

### 3. Mastermind transition framing

- refine the copy around the Page 1 to Page 2 transition so it feels investigative rather than administrative
- make Page 2 feel like a curated working surface
- keep the student responsible for deciding what matters next, without implying conclusions they have not yet earned

### 4. Samuel and scene alignment

- ensure Samuel's guidance, avatar/visual state, and the new scene image all match the mastermind-transition beat
- the tone should feel like:
  - "You solved the first layer"
  - "Now review the trail and decide what still matters"
  - "Someone else is behind this"

## Out of Scope

- changing the suspect-verification architecture
- adding admin authoring for suspect names
- changing bootstrap or setup behavior
- changing the full mastermind-solution flow itself unless required for UI clarity
- suspect-interview pacing before theory testing
- mastermind clue extraction and profile-building logic

## Acceptance Criteria

- the mastermind transition uses a dedicated scene image instead of reusing only the hired-killer reveal beat
- notebook controls are visually lighter and less repetitive
- the notebook still supports Page 1 / Page 2 movement, but the interaction feels more intentional and less cluttered
- the murderer-confirmation accomplishment remains visible without dominating Page 2
- Samuel's guidance, the notebook, and the scene all clearly signal the shift into the mastermind chapter

## Verification

- visual walkthrough in Student Mode from suspect confirmation into mastermind investigation
- confirm Page 1 / Page 2 controls remain functional
- confirm the new scene image appears in the intended mastermind-transition state
- confirm web tests and build remain green

## Codex Results

Implemented a focused mastermind-transition polish pass on top of the accepted hired-killer reveal flow.

Summary:

- added a dedicated mastermind-transition scene state using the noir evidence-board review artwork after the hired-killer breakthrough shifts into transcript analysis
- kept the hired-killer reveal panel for the celebratory evidence-side beat, but moved the header/workbench scene into a calmer "deeper conspiracy" chapter image once the mastermind chapter opens
- updated the mastermind chapter language so Samuel, the header objective, and the lead-board card all frame this phase as reviewing the murder-report transcript and curating clues rather than mechanically "doing more queries"
- upgraded the Samuel beat label after first suspect confirmation to `Mastermind chapter opened`
- lightened the Evidence Notebook page controls:
  - small upper-right page tabs
  - lighter inline carry / return actions
  - subtler remove actions
- reduced the visual dominance of the confirmed hired-killer note on Page 2 while preserving it as the accomplishment anchor
- refined notebook copy so Page 1 and Page 2 both read like investigation surfaces rather than administrative storage buckets
- updated focused frontend regression coverage to verify the new mastermind-transition scene, notebook copy, and lighter page-action labels

Changed files:

- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-129-mastermind-transition-ui-ux-polish-and-scene-refresh.md`

Verification:

- `npm run test --workspace apps/web` passed with `152/152` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Prompt

Audit the mastermind transition UI/UX after hired-killer confirmation.

Verify all of the following:

1. A dedicated mastermind-transition scene image is used instead of relying only on the hired-killer reveal visual beat.
2. The notebook still preserves Page 1 and Page 2 behavior, but the controls feel lighter and less cluttered than the previous repeated button-heavy version.
3. Page 2 does not imply conclusions the student has not earned; it reads as a working page for reviewing and pursuing clues.
4. The circled hired-killer note remains a visible accomplishment anchor without overwhelming the mastermind page.
5. Samuel's guidance, the notebook framing, and the scene image all reinforce the same transition into the mastermind investigation.

## Gemini Audit Results

Audit confirmed the notebook polish, transition framing, and accomplishment-anchor behavior. One real discrepancy surfaced: the header scene could remain on the hired-killer reveal image until the first mastermind clue was logged.

Accepted follow-up:

- update `getStudentSceneVisual()` so the header scene switches to the dedicated `mastermind-transition` image immediately after `trigger-check` is completed
- update the matching `App.test.tsx` expectation to the dedicated mastermind-transition alt text

With that post-audit correction applied, the WP satisfies all accepted criteria.

## Final Decision

Accepted.

The mastermind transition now opens on its dedicated scene state immediately after hired-killer confirmation, and the notebook / scene / guidance trio reads as a coherent new chapter of the case.
