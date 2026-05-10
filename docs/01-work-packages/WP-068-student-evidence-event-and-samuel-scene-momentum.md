# student-evidence-event-and-samuel-scene-momentum

## Objective

Advance Student Mode from a simplified Samuel-led interface into a more game-like detective experience by making evidence logging feel like an event, making Samuel and scene visuals work as a coordinated gameplay header, and adding clearer case momentum states.

This WP focuses on:

- experimenting with Samuel as a full-height visual anchor paired with the current scene image
- making correct clue logging feel like a visible "evidence pinned" event
- making incorrect clue logging feel like a recoverable detective misread
- replacing passive Samuel Check-In text with a lightweight deterministic comprehension interaction
- reducing scene-art dominance during active query work so the query runner remains central
- clarifying the student's current case momentum state

The goal is to make the interaction loop feel more like:

`Samuel briefs -> student queries -> student logs evidence -> clue is pinned -> Samuel checks understanding -> next lead unlocks`

---

## Background

WP-066 introduced the first staged Student Mode shell.

WP-067 simplified the interface around Samuel-led gameplay by:

- enlarging Samuel's avatar
- compressing Active Case metadata
- replacing tab-like labels with action-oriented controls
- reducing duplicated Briefing guidance
- preserving Workbench and Evidence Board flow

The next improvement should focus less on static layout and more on the feel of the learning loop. Correct evidence logging should be more satisfying and meaningful than a text update, and comprehension should be lightly assessed before the next lead feels earned.

---

## Scope

Create and implement a first-pass gameplay momentum upgrade for Student Mode.

In scope:

- Student Mode visual header layout
- Samuel/avatar and scene image sizing/relationship
- clue logging feedback choreography
- evidence pinning / confirmation event presentation
- deterministic comprehension check UI
- case momentum state labels or indicators
- Workbench vertical-priority refinements
- frontend tests for updated UI contracts
- work package documentation

Out of scope:

- backend/API changes
- database content changes
- runtime AI, chatbot behavior, or generated responses
- new generated artwork unless a small local UI treatment is required
- full final-case expansion
- authentication, deployment, or build-system changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-068-student-evidence-event-and-samuel-scene-momentum.md
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/App.test.tsx
- apps/web/src/assets/avatars/**
- apps/web/src/assets/student-scenes/**

Only change additional frontend files if directly required by the accepted implementation.

Do Not Modify:

- apps/api/**
- database/**
- package.json files
- build configuration
- scripts/**

---

## Constraints

- Preserve deterministic gameplay.
- Do not introduce runtime AI, chatbot behavior, or generated Samuel dialogue.
- Preserve the student's SQL work as the core interaction.
- Preserve validated clue logging and false-clue rejection.
- Preserve removable notebook/manual notes behavior.
- Do not make animation or visuals block essential query work.
- Keep the layout usable in the narrow Codex in-app browser pane and normal desktop widths.
- Keep all new comprehension checks recoverable; wrong answers should coach, not punish.
- Avoid adding another always-visible dashboard panel.

---

## Design Direction

### 1. Samuel And Scene As A Coordinated Header

Evaluate a split-header layout where Samuel is a major full-height visual anchor and the scene image remains the cinematic case context.

Possible direction:

- Samuel portrait panel on one side
- scene image panel on the other side
- compact case status and Samuel guidance between or below, depending on width
- Samuel avatar height may match the scene image height on desktop
- narrow layouts should stack cleanly without consuming the entire first screen

The goal is not just to make the avatar larger. Samuel should feel like the guide driving the gameplay loop.

### 2. Evidence Logging As An Event

Correct clue logging should create a visible payoff.

Possible first-pass behaviors:

- show a short "Evidence pinned" event panel near the query results and/or Evidence Board
- highlight the exact notebook entry that was added
- show a clear Samuel reaction tied to the correct clue
- offer an obvious next action: `Explain Clue`, `Review Evidence`, or `Return to Query Lab`

Incorrect clue logging should be visible and recoverable:

- show a skeptical Samuel state/copy
- keep the incorrect row unlogged
- make it clear what the student should re-check

### 3. Lightweight Comprehension Interaction

Replace or augment passive `Samuel Check-In` text with deterministic UI.

Possible first-pass controls:

- a small multiple-choice check
- a short "select the meaning of this clue" prompt
- a confirmation button after a correct explanation choice

Example:

Prompt: `What did CrimeID 1080 prove?`

Options:

- `It identifies Murder as the crime type to filter reports by.`
- `It identifies the suspect.`
- `It gives the witness address.`

Wrong answers should keep the student in the same state and show coaching copy.

### 4. Case Momentum States

Make the current phase of play explicit.

Recommended deterministic states:

- `Briefing`
- `Query Active`
- `Clue Pending`
- `Evidence Pinned`
- `Lead Unlocked`
- `Misread`

These states should appear as small visual state labels or styling changes, not another large panel.

### 5. Protect Query Lab Space

During active query work, reduce visual dominance of the scene art/header if needed.

Possible behavior:

- compact the header after entering Query Lab
- keep Samuel present but smaller during query work
- keep scene art visible as context but avoid consuming the primary workbench viewport
- preserve independent scrolling and Workbench access to Query Runner

---

## Required Behavior

### 1. Implementation Proposal

Before editing, document the chosen approach in Codex Results:

- how Samuel and scene visuals will be coordinated
- whether Samuel will match the scene image height
- how the evidence event will appear
- how incorrect clue feedback will appear
- how comprehension check interaction will work
- how Workbench vertical space will be protected

### 2. First-Pass Implementation

Implement the accepted first pass.

The implementation should improve:

- gameplay feel
- clue payoff
- Samuel's role as guide
- comprehension-based progression
- Workbench usability
- state clarity

### 3. Verification

Verify:

- frontend tests
- direct Vite build if practical
- no backend/runtime AI changes
- clue validation behavior remains deterministic
- incorrect clue rows are not logged
- removable notes behavior remains intact
- browser visual verification if Codex can attach to the in-app browser; otherwise document the limitation

---

## Acceptance Criteria

- `WP-068` exists and defines the evidence-event and Samuel-scene momentum scope.
- Samuel and scene visuals have a clearer coordinated role in the header.
- Correct clue logging produces a stronger visible event than plain feedback text.
- Incorrect clue logging remains visible, recoverable, and unlogged.
- A deterministic comprehension interaction is implemented or explicitly scoped as a follow-up if blocked.
- Case momentum state is visible without adding a large new panel.
- Query Lab remains the primary work area during investigation.
- Existing evidence validation and removable notes behavior are preserved.
- No runtime AI behavior is introduced.
- Frontend tests pass or unrelated blockers are documented.

---

## Codex Prompt

Implement WP-068 student evidence event and Samuel-scene momentum.

Do:

- review the current WP-067 Student Mode layout and state model
- document the chosen implementation approach before editing
- coordinate Samuel portrait and scene image into a stronger gameplay header
- evaluate whether Samuel should match scene image height on desktop
- make correct clue logging feel like an evidence-pinning event
- make incorrect clue logging visibly recoverable and clearly unlogged
- add deterministic comprehension interaction for at least the opening clue path if practical
- add or refine case momentum state indicators
- protect Query Lab vertical space and query runner priority
- preserve existing validation and removable notes behavior
- update frontend tests for the new UI contract
- run frontend tests and direct Vite build when practical
- update Codex Results with implementation details and verification

Do not:

- add runtime AI behavior
- create a chatbot or freeform generated Samuel response system
- modify backend, database, package, build, or script files
- expand the full case content beyond the accepted first-pass gameplay loop
- remove existing validation protections

Return:

- chosen implementation approach
- files changed
- Samuel/scene header treatment
- evidence event behavior
- comprehension interaction behavior
- verification summary
- follow-up recommendations

---

## Gemini Audit Prompt

Audit WP-068 student evidence event and Samuel-scene momentum.

Verify:

1. Samuel and scene visuals now feel coordinated rather than competing.
2. Samuel's visual presence supports gameplay without crowding Query Lab.
3. Correct clue logging produces a clear evidence-pinning payoff.
4. Incorrect clue logging remains recoverable and does not log false evidence.
5. Comprehension interaction is deterministic and curriculum-aligned.
6. Case momentum state is visible and helpful.
7. Query Lab remains the primary work area during investigation.
8. Existing clue validation and removable notes did not regress.
9. The implementation stays within allowed frontend/docs/assets scope.
10. No backend, database, package, build, script, or runtime AI behavior was introduced.
11. Frontend tests pass or unrelated failures are documented.

Flag:

- oversized visuals that consume the query workspace
- animations or event panels that obscure the evidence row or query results
- comprehension checks that are guessable, punitive, or not tied to SQL evidence
- decorative Samuel reactions that do not clarify next action
- hidden navigation or reduced recoverability
- spoiler leakage before clues are unlocked
- regressions in evidence logging or notes

---

## Codex Results

Implemented first-pass student evidence event and Samuel-scene momentum upgrade.

Chosen implementation approach:

- Preserve the WP-067 internal `briefing`, `workbench`, and `case-board` state model for safety.
- Add visible deterministic case momentum states instead of adding another large panel.
- Coordinate Samuel and scene visuals through the existing header: Samuel becomes a larger scene-height anchor on desktop, while the scene remains the cinematic state image.
- Compact the header during Query Lab so the query runner keeps vertical priority.
- Add evidence event cards for correct and incorrect clue logging.
- Replace passive Samuel Check-In text with deterministic multiple-choice comprehension checks.

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-068-student-evidence-event-and-samuel-scene-momentum.md`

Samuel/scene header treatment:

- Added case momentum labels: `Briefing`, `Query Active`, `Clue Pending`, `Evidence Pinned`, `Lead Unlocked`, and `Misread`.
- Added state-specific header classes so momentum can drive visual treatment.
- On desktop, the non-Workbench header gives Samuel a taller portrait treatment that visually pairs with the scene frame.
- In Query Lab, the header compacts Samuel and scene imagery to protect the query workspace.
- Completeness review found that Samuel did not yet visually change state; added first-pass deterministic Samuel visual states for `Mentor`, `Skeptical`, `Confirmed`, and `Breakthrough` using portrait framing, color grade, glow, and a visible state badge.
- No new permanent dashboard panel was added.

Evidence event behavior:

- Correct clue logging now produces an `Evidence Event` card with:
  - `Evidence Pinned`
  - event title
  - Samuel/evidence detail
  - the exact pinned notebook clue when available
- Incorrect clue logging now produces a recoverable `Detective Misread` event.
- Incorrect rows remain unlogged and continue to preserve false-clue rejection behavior.
- Existing notebook entry highlighting remains intact.

Comprehension interaction behavior:

- Replaced passive `Samuel Check-In` text with deterministic multiple-choice prompts.
- Opening path checks include:
  - proving what CrimeID 1080 means
  - proving the target report row with CrimeID, city, date, and ReportID
- Correct answers show Samuel approval copy.
- Incorrect answers show coaching copy and keep the student recoverable.
- No runtime AI, generated guidance, or freeform chatbot behavior was introduced.

Preserved behavior:

- Existing clue validation remains deterministic.
- Incorrect murder-report rows are not logged.
- Manual and removable notebook notes remain functional.
- Query Lab remains the primary work area during investigation.
- Backend, database, package, build, and script files were not modified.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 30 tests.
- `npx vite build` from `apps/web` passed and produced a production bundle; Vite reported existing deprecation warnings for `esbuild` / `optimizeDeps.esbuildOptions` plugin options.
- Generated Vite build outputs were removed after verification.
- Tests now cover Samuel visual state labels for neutral mentor, confirmed clue, skeptical misread, and breakthrough.
- User visual review in the in-app browser found header alignment inconsistency and a stretched breadcrumb badge at larger widths; CSS was updated so the Samuel strip, scene panel, and breadcrumb badge align consistently across desktop and narrow Codex browser widths.

Follow-up recommendations:

- Evaluate whether the scene image should shrink further or become a slim banner during Query Lab.
- Consider adding a short CSS transition for the evidence event card after visual review confirms it does not distract from query results.
- Consider making comprehension checks unlock the next lead explicitly in a later WP if stricter assessment is desired.
- True Samuel facial-expression changes still require separate avatar artwork assets for neutral, skeptical, confirmed, and breakthrough expressions; WP-068 now provides the deterministic UI state hook and first-pass visual treatment.

## Gemini Audit Results

The audit of **WP-068: Student Evidence Event and Samuel-Scene Momentum** is complete. The implementation successfully enhances the Student Mode experience by introducing clear gameplay momentum, coordinated visuals, and interactive comprehension checks, all while adhering to the established architectural boundaries and preserving existing functionality.

### Audit Findings

1.  **Samuel and Scene Coordination**:
    *   The header now effectively pairs Samuel as a visual anchor with the noir scene image.
    *   On desktop, Samuel receives a taller portrait treatment that visually balances the scene frame.
    *   Deterministic visual states (`Mentor`, `Skeptical`, `Confirmed`, `Breakthrough`) have been added, utilizing color grading and glows to reflect gameplay progress and feedback.

2.  **Query Lab Workspace Protection**:
    *   The header correctly transitions to a compact state (`student-case-header--compact`) when the student enters the **Query Lab**.
    *   This refinement ensures that the query runner and results remain the primary focus, preventing oversized visuals from crowding the work area.

3.  **Evidence Event Payoff**:
    *   Correct clue logging now triggers a distinct `Evidence Pinned` event card within the workbench.
    *   This card provides a clear visual confirmation and highlights the specific clue added to the notebook, creating a more satisfying feedback loop than simple text updates.

4.  **Incorrect Clue Handling**:
    *   Incorrect logging attempts result in a recoverable `Detective Misread` event.
    *   The implementation correctly preserves false-clue rejection, ensuring that incorrect rows are never logged to the notebook.

5.  **Comprehension Interaction**:
    *   Passive `Samuel Check-In` text has been replaced with deterministic multiple-choice interactions.
    *   These interactions require students to actively interpret the SQL evidence they've discovered (e.g., explaining what `CrimeID 1080` proves) before advancing, which aligns with the curriculum goals.

6.  **Case Momentum States**:
    *   Six distinct momentum states (`Briefing`, `Query Active`, `Clue Pending`, `Evidence Pinned`, `Lead Unlocked`, `Misread`) are implemented.
    *   These states are visible via labels and styling changes in the header, providing students with clear orientation within the investigation.

7.  **No Regressions**:
    *   Existing functionality, including manual notebook entries, removable notes, and core query execution, remains fully intact.
    *   Updated tests in `App.test.tsx` verify both the new momentum features and the stability of established behaviors.

8.  **Scope Compliance**:
    *   All changes are strictly limited to the frontend (`App.tsx`, `styles.css`, `App.test.tsx`).
    *   No backend, database, or runtime AI behaviors were introduced.

### Final Decision

**PASSED** - WP-068 successfully delivers a more immersive and momentum-driven detective experience for students, meeting all objective and architectural requirements.

### Strategic Recap
Completed the audit of WP-068, verifying the implementation of coordinated Samuel/scene visuals, evidence-pinning events, and deterministic comprehension checks. Confirmed that the Query Lab remains the prioritized work area and that no out-of-scope backend or AI changes were introduced. Verified that existing clue validation and notebook functionality are preserved through updated tests.

## Final Decision

Accepted.

WP-068 is accepted based on the completed implementation, passing frontend test suite, successful production build, user visual review corrections, and Gemini audit pass. Follow-up work remains appropriate for true multi-expression Samuel avatar artwork assets, but the deterministic UI state system and first-pass visual treatment are accepted for this WP.


