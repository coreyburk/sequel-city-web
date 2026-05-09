# student-gameplay-flow-and-samuel-mentor-redesign

## Objective

Redesign Student Mode around a clearer game-play progression model where Samuel Tupleton acts as the student's visible case mentor, reducing information overload and making each step of the investigation feel intentional, interactive, and assessable.

This WP focuses on:

- rethinking the current dense single-screen experience
- defining a staged case-flow model
- introducing Samuel Tupleton as an avatar-guided mentor
- clarifying when the student should query, log evidence, review notes, and answer comprehension checks
- deciding whether the experience should use multiple pages, state-driven views, or a hybrid staged shell

The goal is to create a stronger learner experience before additional UI polish or content expansion.

---

## Background

Recent Student Mode improvements added:

- interactive evidence logging
- compact notebook entries
- removable case notes
- support accordions
- state-driven noir scene artwork
- generated static artwork assets

Those changes improved the interface, but the experience still risks feeling like a dense dashboard. The screen is trying to serve as briefing, tutorial, notebook, SQL workbench, feedback system, reference panel, story progression, and visual narrative all at once.

The next design step should define the game-play model, not just continue tuning the current layout.

---

## Scope

Create and implement a first-pass gameplay flow redesign for Student Mode.

In scope:

- Student Mode case progression UX
- Samuel Tupleton mentor/avatar concept
- staged case views or state-driven layout modes
- primary next-action clarity
- clue logging and comprehension-gated progression
- notebook/case-board role refinement
- frontend implementation for the first pass
- static avatar/art asset prompt guidance if needed
- work package documentation

Out of scope:

- backend schema or API changes unless explicitly required by the accepted design
- runtime AI, chatbot behavior, or generated dialogue
- voice, animation, or procedural content generation
- new database content
- final full-case expansion beyond the current guided opening path
- production deployment or authentication

---

## Files Allowed to Change

- docs/01-work-packages/WP-066-student-gameplay-flow-and-samuel-mentor-redesign.md
- apps/web/src/**
- apps/web/src/assets/**
- docs/13-art-direction/**

Only change additional docs if they are directly needed to keep navigation or design guidance accurate.

Do Not Modify:

- apps/api/**
- database/**
- package.json files
- build configuration
- scripts/**

---

## Constraints

- Preserve deterministic gameplay; no runtime AI guidance or chatbot responses
- Samuel's dialogue must be static, state-driven, and curriculum-aligned
- Avoid spoilers beyond the current unlocked investigation state
- Preserve the student's SQL work as the core interaction
- Reduce visible information density instead of adding more permanent panels
- The experience must remain usable in the narrow in-app browser pane and normal desktop widths
- Existing evidence validation and note correction behavior must not regress
- New artwork or avatar assets must be static local assets

---

## Design Direction

### 1. Staged Experience Model

Evaluate and implement a first-pass model that separates the current dense interface into clearer modes.

Recommended stages:

- Briefing View: Samuel introduces the current case objective with minimal UI clutter.
- Investigation Workbench: query editor, results, clue logging, and compact notebook are the primary focus.
- Evidence Notebook / Case Board: logged clues and student notes are easier to review and reason about.
- Samuel Check-In: short comprehension questions or confirmations before progression.
- Case Resolution: final evidence chain and suspect/mastermind verification path.

This does not necessarily require separate routes. A state-driven shell, tabs, panels, or modal checkpoints may be preferable if it keeps flow lightweight.

### 2. Samuel Tupleton Mentor Avatar

Introduce Samuel as a visible guide, not just text.

First-pass expectations:

- static Samuel avatar or portrait card
- short state-driven dialogue
- clear current objective
- one useful nudge at a time
- feedback after correct and incorrect clue logging
- optional future states for neutral, approving, skeptical, and breakthrough expressions

Samuel must not behave like a live chatbot. He should be a deterministic mentor and narrator.

### 3. Primary Next Action

At every stage, the UI should make the next expected student action obvious.

Examples:

- run this starter query
- inspect these result fields
- choose the evidence row to log
- explain why this clue matters
- decide which lead to pursue next

Avoid presenting all support material with equal visual weight.

### 4. Comprehension-Gated Progression

Progression should assess understanding, not just clicks.

Possible first-pass gates:

- "What did CrimeID 1080 prove?"
- "Why did we filter by ReportCity and ReportDate?"
- "Which logged clue tells us where to look next?"

These checks should be lightweight and recoverable. Wrong answers should trigger Samuel coaching, not punishment.

### 5. Notebook / Case Board Role

The notebook should become an evolving evidence record, not a large static panel.

Evaluate whether to:

- keep the compact notebook in the workbench
- add a larger case-board review mode
- show relationships between logged clues
- let student notes remain visible but secondary

---

## Required Behavior

### 1. Gameplay Flow Proposal

Document the chosen structure before implementing it:

- multi-page, state-driven single shell, or hybrid
- why that structure reduces cognitive load
- how Samuel appears and guides progression
- how the student moves between query work, evidence review, and checks

### 2. First-Pass Implementation

Implement the accepted first-pass flow in Student Mode.

The first pass should improve:

- visual hierarchy
- next-action clarity
- Samuel's presence
- clue feedback proximity
- notebook/case-board usefulness
- progression clarity after each logged clue

### 3. Deterministic Dialogue

Samuel dialogue must be data-driven from local state, not generated at runtime.

### 4. Verification

Verify:

- frontend tests
- no backend/runtime AI changes
- visual behavior in the in-app browser or documented manual limitation
- no regression in clue validation and removable notes

---

## Acceptance Criteria

- `WP-066` exists and defines the gameplay redesign scope
- Student Mode has a clearer staged experience model
- Samuel Tupleton appears as a visible mentor/avatar concept or implemented first-pass avatar
- each investigation state communicates one primary next action
- clue logging remains deterministic and validated
- comprehension-gated progression is designed and implemented or explicitly documented as the next sub-step
- notebook/case-board behavior reduces information overload
- no runtime AI behavior is introduced
- frontend tests pass or unrelated blockers are documented

---

## Codex Prompt

Implement WP-066 student gameplay flow and Samuel mentor redesign.

Do:

- review the current Student Mode UI and state model
- propose the concrete staged-flow structure before editing
- implement the first-pass Student Mode gameplay redesign
- introduce Samuel Tupleton as a deterministic mentor/avatar presence
- make the current objective and next action visually dominant
- preserve existing evidence validation and removable notes behavior
- keep support material secondary and progressive
- update or create static artwork/avatar prompt guidance if needed
- run frontend tests
- update Codex Results with implementation details and verification

Do not:

- add runtime AI behavior
- create chatbot or freeform generated Samuel responses
- change backend, database, package, build, or script files
- expand the final case content beyond the accepted first-pass flow
- remove existing validation protections

Return:

- chosen gameplay structure
- files changed
- Samuel mentor behavior summary
- UX reduction strategy
- verification summary
- any follow-up recommendations

---

## Gemini Audit Prompt

Audit WP-066 student gameplay flow and Samuel mentor redesign.

Verify:

1. The implementation meaningfully reduces Student Mode information overload.
2. The chosen structure makes the student's next action obvious at each stage.
3. Samuel Tupleton functions as a deterministic mentor/avatar, not a runtime AI chatbot.
4. Existing clue validation and removable notes behavior did not regress.
5. The notebook/case-board role is clearer and less visually overwhelming.
6. Comprehension-gated progression is implemented or clearly scoped for follow-up.
7. The implementation stays within allowed frontend/docs/assets scope.
8. No backend, database, package, build, or script files were modified.
9. Frontend tests pass or unrelated failures are documented.

Flag:

- any new permanent panel that increases screen clutter
- Samuel dialogue that feels decorative instead of instructional
- hidden or ambiguous next actions
- progression based only on clicking instead of understanding
- runtime AI behavior or generated guidance
- spoiler leakage before a lead is unlocked
- regressions in evidence logging, false-clue feedback, or note removal

---

## Codex Results

Implemented first-pass Student Mode gameplay redesign.

Chosen structure:

- Hybrid state-driven single shell.
- Student Mode now separates the experience into `Briefing`, `Workbench`, and `Case Board` views without adding routes.
- The case header remains stable, but dense support content is no longer all visible at once.
- Successful evidence logging can move the student to the Case Board so the logged clue is visible immediately.
- Query execution returns focus to the Workbench so SQL remains the primary interaction.

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-066-student-gameplay-flow-and-samuel-mentor-redesign.md`

Samuel mentor behavior:

- Added a persistent Samuel Tupleton mentor strip with an avatar placeholder, state-driven title, state-driven guidance, and breadcrumb progress.
- Samuel remains deterministic. No runtime AI, chatbot behavior, or generated dialogue was introduced.
- Briefing view presents Samuel's current mission, next action, why it matters, and success signal.
- Workbench view keeps Samuel's immediate objective visible while the student works in the query runner.
- Case Board view includes a Samuel Check-In prompt that asks the student to explain the evidence chain before moving on.

UX reduction strategy:

- Initial Student Mode now opens on a focused Briefing instead of showing the full dashboard.
- Query runner, schema help, full story recap, notebook, case notes, leads, and milestones are separated by view.
- Workbench prioritizes the current action, query editor/results, and a compact notebook rail.
- Case Board becomes the deliberate review space for logged evidence, manual notes, leads, and comprehension check-ins.
- Support accordions stay secondary inside Workbench instead of competing with the main task.

Validation/progression behavior:

- Existing clue validation was preserved.
- Incorrect murder-report rows still produce feedback and do not log notebook entries.
- Student notes remain removable.
- Comprehension-gated progression is implemented as first-pass Samuel Check-In prompts; full answer validation remains a follow-up opportunity.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 30 tests.
- `npx vite build` from `apps/web` passed and produced a production bundle.
- Attempted in-app browser automation after implementation, but the `browser-use` IAB backend could not attach to the visible browser surface in this Codex session.
- `npm run build --workspace apps/web` is still blocked by pre-existing TypeScript build issues outside this WP:
  - `apps/web/vite.config.ts` includes a `test` key that `tsc -b` rejects.
  - `apps/web/src/components/QueryRunner.test.tsx` has a mock `QueryColumn` missing `ordinal` and `dataType`.
- No backend, database, package, or script files were modified.

Follow-up recommendations:

- Replace the `ST` avatar placeholder with a proper Samuel Tupleton portrait once the art direction is accepted.
- Add lightweight answer controls for Samuel Check-In prompts if comprehension gating should require student input instead of reflective prompts.
- Consider a future route-based case map only after the staged shell proves the desired instructional flow.

## Gemini Audit Results

I have completed the audit of Work Package 066. The implementation aligns with the required deterministic gameplay and correctly implements the staged UI structure.

**Verification Results:**

1. **Information Overload Reduction:** Confirmed. The single dense screen is now split into three logical states (`Briefing`, `Workbench`, `Case Board`) using the `studentView` state. Support content is collapsed into accordions.
2. **Next-Action Clarity:** Confirmed. The UI surfaces a prominent `Current Objective` derived from Samuel's static stages (e.g., "Run a query against CrimeType...").
3. **Deterministic Mentor:** Confirmed. Samuel Tupleton relies on static arrays (`SAMUEL_TUPLETON_STEPS`) and state-driven conditional checks (`getSamuelReaction`). No runtime AI or generated dialogue was found.
4. **No Regressions:** Confirmed. `handleStudentEvidenceLog` properly enforces the specific expected clues (CrimeID = 1080, valid report row with city and date). Removable notes (`removeNotebookEntry`) and manual notes remain functional.
5. **Notebook/Case-Board Role:** Confirmed. The Case Board serves as a focused review space mapping clues to emerging leads, and the Workbench keeps a compact notebook rail to minimize context switching.
6. **Comprehension Gating:** Confirmed. Implemented as static reflective prompts (`Samuel Check-In`) at the Case Board stage. Full answer validation is appropriately scoped for follow-up as described in the Codex results.
7. **Scope Restrictions:** Confirmed. Changes were localized to `apps/web/src/App.tsx`, `apps/web/src/styles.css`, `apps/web/src/App.test.tsx`, and the WP definition file. 
8. **No Backend Modfications:** Confirmed. `apps/api/`, `database/`, and script directories are untouched.
9. **Frontend Tests:** Confirmed. The 30 frontend tests cover the new structure successfully. The overall build failure is due to pre-existing type issues in `vite.config.ts` and `QueryRunner.test.tsx`, independent of this WP logic.

**Flags:**

* **Permanent Panels:** The `student-mentor-strip` is a new persistent panel across all views. However, it integrates cleanly without cluttering the main task area and successfully replaces bulkier guidance text.
* **Samuel Dialogue:** The dialogue is highly instructional ("Start simple. Pull the crime types first..."), properly advancing based on exact SQL outcomes and not feeling decorative.
* **Progression Mechanics:** The `Samuel Check-In` relies on the student voluntarily answering reflective questions. Progression remains gated by correct evidence logging (`clue validation`), not just arbitrary clicking.
* **Spoiler Leakage:** Leads are gated correctly in the `getLeadBoardCards` logic (e.g., witness leads remain "locked" until the murder report is isolated).

**Decision:**
The implementation meets all acceptance criteria. WP-066 is approved.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Accepted.

WP-066 is approved for commit. The staged Student Mode shell, Samuel mentor strip, Workbench focus, Case Board review space, deterministic clue validation, removable notes behavior, and static comprehension check-ins meet the accepted first-pass gameplay redesign criteria. Follow-up work should address a proper Samuel portrait/avatar and stronger answer-based comprehension controls after the revised flow has been evaluated in the browser.

