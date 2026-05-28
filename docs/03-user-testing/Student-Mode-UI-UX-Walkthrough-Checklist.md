# Student Mode UI/UX Walkthrough Checklist

## Purpose

This checklist defines the current official manual walkthrough for reviewing the Student Mode UI/UX in Sequel City Web Detective before or alongside follow-up work packages.

Use it to evaluate the live student experience step-by-step, capture interaction friction, and document visual or behavioral inconsistencies without inventing conclusions ahead of observation.

This checklist is intentionally grounded in the current implementation state and does not assume that the full student-case walkthrough has already been completed.

## When To Use This Checklist

Use this checklist when:

- running a live Student Mode walkthrough in the browser
- performing a manual UI/UX review before drafting a new work package
- validating whether recent student-flow changes created new friction
- collecting evidence about layout, hierarchy, guidance clarity, notebook behavior, pinned-fact usability, or progression continuity

Do not use this checklist as a replacement for focused acceptance testing of a single completed work package. Use it for broader experience review across multiple steps of the student journey.

## Prerequisites

- The frontend is running locally and reachable at `http://127.0.0.1:5173` or `http://localhost:5173`.
- Student Mode is available and loads successfully.
- The tester can move through the live application in a browser.
- The tester or observer has a note-taking document ready.
- Screenshots can be captured when needed.

## Evidence Capture Rules

- Record what is visible and interactive now, not what earlier implementations did.
- Note the exact step or screen where friction appears.
- Capture whether the issue is visual, copy, state, layout, or interaction related.
- Prefer screenshots for anything involving spacing, density, emphasis, overflow, or unexpected state change.
- Separate observation from recommendation.

For each issue candidate, capture:

- screen or step
- expected behavior
- actual behavior
- why it interrupts or slows the student flow
- severity estimate: low, medium, or high

## Walkthrough Scope

This checklist covers the current Student Mode shell and the main surfaces that shape the moment-to-moment learner experience:

- global page shell
- Samuel's Briefing
- Query Lab
- Case File drawer
- Pinned Facts
- Evidence Board / Evidence Notebook
- mastermind-stage handoffs and guidance continuity

## Checklist

### 1. Setup And Initial Load

- Confirm `Student Mode` is active.
- Confirm the page loads without broken layout, missing imagery, or overlapping controls.
- Check the initial desktop layout before any interaction.
- Repeat spot checks at a narrower browser width.
- Confirm the first visible call to action is understandable without prior context.

### 2. Global Shell

- Verify the overall hierarchy is clear:
  - application title
  - case status
  - Samuel guidance area
  - main navigation tabs
- Confirm the three primary sections feel stable:
  - `Samuel's Briefing`
  - `Query Lab`
  - `Evidence Board`
- Check whether scene art changes only when the experience meaningfully changes.
- Note any jumpy or distracting layout shifts while moving between sections.

### 3. Samuel's Briefing

- Verify the first step is obvious before the first query is run.
- Check whether Samuel's copy is concise enough to scan quickly.
- Look for repeated or redundant instruction blocks.
- Confirm the "what to do next" message matches the actual next student action.
- Note whether the briefing introduces the case without overloading the student.

### 4. Query Lab

- Check whether the primary instruction is obvious at first glance.
- Verify the Query Runner does not feel visually overloaded.
- Check whether too many support layers are shown at once:
  - instruction
  - failure guidance
  - evidence prompt
  - reinforcement
  - Samuel reaction
- Confirm SQL building blocks are easy to scan and click.
- Confirm scene art does not change while the student merely drafts SQL.
- Confirm scene art changes only after `Run Query` or another meaningful progression action.

### 5. Case File Drawer

- Open `Case File` and verify it feels stable while the student edits SQL.
- Check whether the drawer closes unexpectedly when the student clicks back into the editor.
- Confirm the default drawer tab makes sense for the current step.
- Verify `Quick Table Clues`, `Pinned Facts`, and `Case Facts` are visually distinct.
- Check whether opening and closing the drawer feels intentional rather than fragile.

### 6. Pinned Facts

- Verify pinned facts appear only after the corresponding clue is actually logged.
- Remove a clue from the Evidence Board and confirm it disappears from `Pinned Facts`.
- Check whether multi-token entries remain readable.
- Confirm token labels are specific enough to understand before clicking.
- Look for ambiguous repeated labels such as:
  - `PersonID`
  - `LicenseID`
  - `EventPersonID`
  - `EventID`
- Check for encoding, punctuation, or separator issues in labels or token source text.
- Confirm students can tell what query fragment will be inserted before they click.

### 7. Evidence Board And Evidence Notebook

- Confirm logged clues appear on the correct notebook page.
- Verify page-carry actions such as `Carry to Page 2` and `Return to Page 1` are understandable.
- Check whether the notebook becomes too dense after several clues are logged.
- Confirm highlighted clues are visually distinct without becoming noisy.
- Verify `Remove` actions feel predictable and stay synced with other student surfaces.

### 8. Progression Accuracy

At each major step, confirm:

- Samuel's Guidance matches the actual next action.
- Query Tokens support that action.
- Pinned Facts support that action.
- the Evidence Board reflects what was just learned.

Watch for:

- stale references to earlier phases after progression advances
- references to hard-coded suspect or mastermind names where the app should remain data-driven
- correct clues that are visible but not reusable

### 9. Mastermind Flow Checks

- Confirm the shortlist phase clearly transitions into identity lookup.
- Confirm the identity phase clearly transitions into `EventRegistration`.
- Confirm `EventRegistration` clearly transitions into `EventSchedule`.
- Verify the student is not repeatedly pulled back into earlier killer or transcript guidance once those phases are complete.
- Check whether the next step feels explicit enough at each mastermind handoff.

### 10. Visual QA

- Check for text wrapping issues in:
  - long guidance copy
  - notebook entries
  - pinned fact rows
  - query tokens
- Check whether pill-shaped UI still works once content becomes multi-line.
- Check contrast and readability across dark noir surfaces and gold accent text.
- Check spacing consistency between panels, buttons, and content blocks.
- Check whether any region feels too cramped or too empty.

### 11. Interaction Friction

- Note any point where the student has to remember too much across panels.
- Note any point where the interface hides the next required value instead of surfacing it.
- Note any point where the student makes the correct move but the UI makes it feel wrong.
- Note any place where the student must fight the interface rather than use it.

## Recommended Capture Format

When logging findings from this walkthrough, use the following structure:

1. Step or screen
2. Observation
3. Why it matters
4. Severity
5. Screenshot reference, if any

## Relationship To Other User-Testing Documents

- Use [Structured-User-Testing-Plan.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Structured-User-Testing-Plan.md) for moderated testing structure and facilitator behavior.
- Use [Session-Data-Collection-Guide.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Session-Data-Collection-Guide.md) for evidence capture rules.
- Use this checklist when the immediate goal is a focused Student Mode UI/UX walkthrough rather than a broader first-run or general-product testing session.
