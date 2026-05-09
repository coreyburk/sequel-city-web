# samuel-led-gameplay-simplification

## Objective

Simplify Student Mode further by making Samuel Tupleton the primary gameplay guide and reducing the number of competing instructional surfaces on screen.

This WP focuses on:

- making Samuel feel like the central game master / mentor
- increasing the visual importance of Samuel's avatar
- compressing Active Case metadata into a smaller case status line
- reducing repeated guidance between the header, briefing, workbench, and case board
- replacing tab-like navigation with a clearer next-action progression model where practical
- keeping the SQL query runner as the student's core interaction

The goal is to make the experience feel less like a dashboard and more like a guided detective game where Samuel reveals the next useful action at the right moment.

---

## Background

WP-066 introduced a staged Student Mode shell with:

- `Briefing`
- `Workbench`
- `Case Board`
- Samuel Tupleton mentor strip
- deterministic Samuel guidance
- Samuel Check-In prompts

Follow-up UI work added a generated Samuel avatar and combined the Active Case area with the mentor strip. This improved visual hierarchy, but the interface can still be simplified.

Current concerns:

- the case header still competes with Samuel for attention
- Samuel's avatar is important to the gameplay tone but is still not dominant enough
- the three-view tab model feels more like app navigation than detective progression
- the Briefing view repeats some of the same guidance already shown by Samuel in the header
- the student may still see too many guidance panels before reaching the query work
- Workbench space should remain the highest-priority area once the student starts investigating

---

## Scope

Create and implement a first-pass Samuel-led simplification of Student Mode.

In scope:

- Student Mode layout and navigation simplification
- Samuel avatar size, placement, and responsive behavior
- compact Active Case metadata treatment
- primary next-action controls
- Briefing, Workbench, and Case Board information hierarchy
- deterministic Samuel guidance and feedback copy
- frontend tests for updated UI contracts
- WP documentation updates

Out of scope:

- backend/API changes
- database content changes
- runtime AI or chatbot behavior
- freeform Samuel responses
- new generated artwork unless needed for minor avatar presentation work
- full final-case expansion
- authentication, deployment, or build-system changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-067-samuel-led-gameplay-simplification.md
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/App.test.tsx
- apps/web/src/assets/avatars/**

Only change additional frontend files if directly required by the accepted implementation.

Do Not Modify:

- apps/api/**
- database/**
- package.json files
- build configuration
- scripts/**

---

## Constraints

- Preserve deterministic gameplay; no runtime AI guidance or chatbot behavior.
- Preserve validated clue logging and false-clue rejection.
- Preserve removable notebook/manual notes behavior.
- Preserve Student Mode as the core SQL learning experience.
- Do not hide essential query controls behind decorative interaction.
- Reduce visible complexity rather than adding another permanent panel.
- The layout must remain usable in the narrow Codex in-app browser pane and normal desktop widths.
- Any navigation changes must keep the student oriented and recoverable.

---

## Design Direction

### 1. Samuel As Primary Gameplay Driver

Samuel should become the dominant instructional affordance.

Expected direction:

- larger Samuel portrait, likely around `140px` to `160px` on desktop
- responsive smaller size for narrow browser widths
- Samuel's guidance should be the main source of "what do I do next?"
- the case header should support Samuel instead of competing with him
- Samuel should feel like the mentor/game master, not a decorative badge

### 2. Compact Case Status

Compress Active Case information into a small status line.

Example target:

`Case 004 · SELECT * FROM Suspects · 0/6 clues logged`

The current objective should be expressed through Samuel's guidance and the current action card, not repeated as separate case metadata.

### 3. Replace Tabs With Action-Oriented Progression

Evaluate whether `Briefing`, `Workbench`, and `Case Board` should remain as tabs or become action-oriented controls.

Possible direction:

- `Talk to Samuel`
- `Run Query`
- `Review Evidence`

Only one primary action should feel dominant at a time. Secondary navigation can remain available, but it should not compete visually with the current step.

### 4. Reduce Briefing Duplication

The Briefing should become a concise mission-start moment.

Recommended target:

- one mission card
- one starter action
- one short "why it matters"
- no repeated full mentor copy that already appears in the combined header

### 5. Protect Workbench Priority

Once the student starts investigating, the Workbench should dominate the screen.

Recommended behavior:

- compact Samuel presence remains visible
- query editor/results receive the most vertical and horizontal space
- support content remains secondary
- notebook stays compact until the student deliberately reviews evidence

### 6. Case Board As Reward And Review

The Case Board should feel like a payoff after correct evidence logging.

Recommended behavior:

- correct clue appears in the notebook/case board clearly
- Samuel reacts briefly
- student can review why the clue matters
- primary action returns them to the Workbench for the next query

---

## UX Audit Rubric

Use a lightweight rubric inspired by structured UI/game-interface evaluation research, including:

- Layout: Does the screen guide the eye to the next action?
- Readability: Is the instructional copy short enough to act on immediately?
- Consistency: Do navigation and progression controls behave predictably?
- Completeness: Can the student still access the needed query, evidence, notes, and support functions?
- Aesthetics: Does the noir detective tone support gameplay rather than adding clutter?
- Gameplay clarity: Does the student understand what Samuel wants them to do next?

This rubric should guide implementation and be used in the Gemini audit prompt.

---

## Required Behavior

### 1. Simplification Proposal

Before implementation, document the chosen simplification model in Codex Results:

- how Samuel is made visually dominant
- what happens to Active Case metadata
- whether tabs remain or are replaced with action-oriented controls
- how duplicate Briefing guidance is reduced
- how Workbench priority is protected
- how Case Board review remains available

### 2. First-Pass Implementation

Implement the accepted simplification in Student Mode.

The first pass should improve:

- visual hierarchy
- gameplay feel
- Samuel's importance
- next-action clarity
- reduced repeated guidance
- efficient use of top-of-screen space

### 3. Verification

Verify:

- frontend tests
- direct Vite build if practical
- no backend/runtime AI changes
- clue validation behavior remains deterministic
- removable notes behavior remains intact
- narrow-browser usability is preserved or limitations are documented

---

## Acceptance Criteria

- `WP-067` exists and defines the Samuel-led simplification scope.
- Samuel's avatar is visually more prominent than in the WP-066/WP-066-follow-up layout.
- Active Case metadata is compressed and no longer competes with Samuel guidance.
- The student's next action is more obvious than the current tab-like model.
- Briefing content is shorter and less duplicative.
- Workbench remains the primary query workspace after investigation begins.
- Case Board remains available for evidence review without becoming another always-visible dashboard.
- Existing clue validation, incorrect-clue feedback, and removable notes behavior are preserved.
- No runtime AI behavior is introduced.
- Frontend tests pass or unrelated blockers are documented.

---

## Codex Prompt

Implement WP-067 Samuel-led gameplay simplification.

Do:

- review the current Student Mode layout after the Samuel avatar/header integration
- document the chosen simplification model before editing
- make Samuel visually dominant as the primary gameplay guide
- compress Active Case metadata into a smaller case status treatment
- reduce duplicated guidance between the header and Briefing view
- evaluate and improve the tab/navigation model toward action-oriented progression
- protect Workbench space and query runner priority
- keep Case Board as a deliberate evidence review/payoff space
- preserve deterministic clue validation and removable notes
- update frontend tests for the new UI contract
- run frontend tests and direct Vite build when practical
- update Codex Results with implementation details and verification

Do not:

- add runtime AI behavior
- create a chatbot or freeform Samuel response system
- modify backend, database, package, build, or script files
- expand full case content beyond the accepted UI/gameplay simplification
- remove existing validation protections

Return:

- chosen simplification model
- files changed
- Samuel/avatar treatment summary
- navigation/progression changes
- verification summary
- follow-up recommendations

---

## Gemini Audit Prompt

Audit WP-067 Samuel-led gameplay simplification.

Verify:

1. Samuel is visually and functionally more central to gameplay than before.
2. Active Case metadata is compact and does not compete with Samuel guidance.
3. The student's next action is clearer than the prior tab-like model.
4. Briefing content is meaningfully shorter and less repetitive.
5. Workbench space and query runner priority are preserved.
6. Case Board remains available as an evidence review/payoff space.
7. Existing clue validation, false-clue feedback, and removable notes did not regress.
8. The implementation stays within allowed frontend/docs/assets scope.
9. No backend, database, package, build, script, or runtime AI behavior was introduced.
10. Frontend tests pass or unrelated failures are documented.

Use the UX audit rubric:

- layout
- readability
- consistency
- completeness
- aesthetics
- gameplay clarity

Flag:

- any new permanent panel that increases clutter
- Samuel avatar changes that crowd the query workspace
- navigation that hides essential tools
- decorative Samuel copy that does not help the student act
- progression that becomes less recoverable
- spoiler leakage before clues are unlocked
- regressions in evidence logging or notes

---

## Codex Results

Chosen simplification model before implementation:

- Samuel becomes the primary gameplay driver by expanding the avatar treatment and keeping Samuel's guidance as the main "what now?" surface.
- Active Case metadata is compressed into one compact status line: case number, case title, and clue progress.
- The internal state model remains `briefing`, `workbench`, and `case-board` for implementation safety, but the student-facing controls are changed to action-oriented labels: `Talk to Samuel`, `Run Query`, and `Review Evidence`.
- Briefing is reduced to a concise mission-start card with current mission, next action, why it matters, and two action buttons. The duplicate Samuel guidance paragraph and opening breadcrumb list are removed from the Briefing body because the combined header already carries Samuel and breadcrumb state.
- Workbench priority is protected by keeping query runner and results in the main work area while support content remains in accordions and the notebook remains compact.
- Case Board remains available as a deliberate evidence review/payoff space after correct clue logging and through the `Review Evidence` action.

Implementation completed.

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-067-samuel-led-gameplay-simplification.md`

Samuel/avatar treatment:

- Increased Samuel's avatar from the prior fixed `104px` treatment to a responsive `clamp(118px, 13vw, 160px)` treatment.
- Enlarged the mentor header typography so Samuel's state and guidance carry more visual weight.
- Kept Samuel embedded in the case header so he remains the central gameplay guide without adding another persistent panel.

Case status simplification:

- Replaced the old stacked Active Case title plus separate progress line with one compact status heading.
- New status format: `Case 004 · SELECT * FROM Suspects · 0/6 clues logged`.
- Removed the separate progress sentence from the header so case metadata supports Samuel instead of competing with him.

Navigation/progression changes:

- Replaced tab-like labels with action-oriented student labels:
  - `Talk to Samuel`
  - `Query Lab`
  - `Evidence Board`
- Added a visually dominant primary action button whose label changes by state:
  - `Start Query` from Samuel briefing
  - `Review Evidence` from the query workbench
  - `Return to Query` from the evidence board
- Preserved the existing internal state model for implementation safety and recoverable navigation.

Briefing simplification:

- Renamed the briefing panel to `Samuel's Current Lead`.
- Removed duplicate `Samuel Tupleton:` guidance from the Briefing body because the mentor header already provides Samuel's direct instruction.
- Removed the opening breadcrumb list from the Briefing body because breadcrumb progress remains visible in the Samuel header.
- Kept only the mission title, next step, why it matters, success signal, and action buttons.

Preserved behavior:

- Existing clue validation remains deterministic.
- Incorrect murder-report rows still produce false-clue feedback and do not log notebook entries.
- Removable notes/manual note behavior remains intact.
- Workbench continues to prioritize the query runner and results after investigation begins.
- Case Board remains an explicit review/payoff destination after correct clue logging.
- No runtime AI, chatbot behavior, backend, database, package, build, or script changes were introduced.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 30 tests.
- `npx vite build` from `apps/web` passed and produced a production bundle.
- Attempted direct in-app browser evaluation after implementation, but the `browser-use` IAB backend could not attach to the visible browser surface in this Codex session.
- Generated Vite/TypeScript build outputs were removed after verification.

Follow-up recommendations:

- Evaluate the larger Samuel avatar in the narrow in-app browser and normal desktop width before deciding whether to increase it further.
- Consider collapsing the noir scene visual or making it state-dependent height if Workbench vertical space still feels constrained.
- Consider replacing the `Success Looks Like` briefing card with an interactive answer check in a later comprehension-focused WP.

## Gemini Audit Results

The audit of **WP-067 Samuel-led gameplay simplification** is complete. The implementation successfully transitions the user interface from a dashboard-like model to a more immersive, guided detective experience where Samuel Tupleton is the central figure.

### UX Audit Rubric Results

*   **Layout**: Excellent. The consolidation of Samuel guidance and Active Case metadata into a single header area reduces visual noise. The two-column desktop layout for the Workbench preserves the priority of the SQL Query Runner while keeping the Evidence Notebook accessible.
*   **Readability**: High. Instructional copy is concise and structured into "Next Step", "Why It Matters", and "Success Looks Like". The compact status line (`Case 004 · SELECT * ...`) provides essential context without competing for attention.
*   **Consistency**: Strong. Navigation labels ("Talk to Samuel", "Query Lab", "Evidence Board") and the state-aware primary action button ("Start Query", "Review Evidence") provide a predictable and goal-oriented flow.
*   **Completeness**: All essential investigative tools (Schema help, story recap, notebook, lead board) remain fully accessible, though some are now contextually prioritized.
*   **Aesthetics**: The noir detective aesthetic is enhanced by the larger Samuel avatar and the consistent use of atmospheric gradients and "scene" visuals.
*   **Gameplay Clarity**: Significantly improved. The prominence of Samuel's guidance and the new "Breadcrumbs" progress indicator make it clear what the student's current objective is and how far they are in the guided portion of the case.

### Verification of Audit Criteria

1.  **Samuel Prominence**: Samuel's avatar has been increased to a responsive `clamp(118px, 13vw, 160px)` and his guidance is now the dominant element of the header.
2.  **Metadata Compression**: Active Case details are now a single, compact status line, successfully reducing visual competition.
3.  **Progression Model**: The "primary action" button and descriptive navigation labels effectively replace the previous generic tab model with a clearer progression.
4.  **Briefing Efficiency**: The Briefing panel is now "Samuel's Current Lead," focusing on actionable steps and removing duplicate guidance already present in the header.
5.  **Workbench Priority**: The Query Runner remains the most prominent element in the investigation view, with vertical space protected via responsive height clamping and scrolling.
6.  **Case Board Accessibility**: The Evidence Board serves as an effective payoff and review space, showing unlocked leads and the full Evidence Notebook.
7.  **Functional Integrity**: Existing clue validation, false-clue rejection, and manual note behaviors have been preserved and verified through test updates.
8.  **Technical Scope**: Changes are strictly frontend-only (`App.tsx`, `styles.css`, `App.test.tsx`), adhering to WP constraints. No backend or runtime AI was introduced.
9.  **Test Coverage**: `App.test.tsx` has been updated to reflect the new UI contract, and logic for milestone progression remains robust.

### Flagged Observations
*   **Clutter**: No new permanent panels were added; complexity was reduced through better grouping and prioritization.
*   **Workspace Crowding**: The larger avatar is housed in the header and does not encroach on the query editor space.
*   **Essential Tools**: Schema help and story recaps are preserved in collapsible panels, keeping them available but out of the way.

**Final Verdict**: The implementation meets all acceptance criteria and significantly improves the "mentor-led" feel of the application. The simplification makes the core SQL learning experience more focused and engaging.

## Final Decision

Accepted.

User accepted the WP-067 improvements for commit and push. Browser automation remains unavailable from Codex in this session, so any final visual sizing judgment should be made by direct user review in the visible in-app browser.

