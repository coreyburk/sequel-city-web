# student briefing and scene copy simplification

## Objective

Simplify the Student Mode opening experience so the Samuel Briefing, Known Case Facts, and noir scene artwork each have a distinct purpose without duplicating or confusing instructions.

## Scope

### In Scope
- Reframe the opening mentor title away from the confusing "Start with the briefing" instruction.
- Establish who Samuel Tupleton is and why he appears first in Student Mode.
- Introduce the case background and the student's clue-finding loop before presenting the first SQL task.
- Restructure the Samuel Briefing content so stable case facts complement the current on-ramp lead instead of repeating a long narrative paragraph.
- Keep breadcrumb progress in the lower Case Briefing section and remove it from the avatar/mentor strip.
- Remove redundant status labels around Samuel's avatar, including the initial `Briefing` pill above the avatar area and the `Mentor` label below the avatar.
- Place Samuel's name below his avatar instead of in the mentor message column.
- Rename the navigation tab from `Samuel Briefing` to the possessive `Samuel's Briefing`.
- Keep everything above the three navigation buttons at a stable size across all Student Mode tabs.
- Reduce the visual footprint of the Query Lab `Do This Next` action card.
- Evaluate and adjust the noir scene image overlay text so it does not compete with Samuel's guidance or cover the artwork.
- Update tests for the revised briefing and scene copy behavior.
- Document the UX rationale and implementation results in this work package.

### Out of Scope
- Changing the on-ramp query sequence or SQL drafts.
- Changing milestone, evidence logging, notebook, or lead gating behavior.
- Changing backend, database, package, runtime AI, scripts, or generated artwork assets.
- Full Student Mode layout redesign outside the briefing and scene-copy surfaces.
- New dependencies.

## Files Allowed to Change

- `docs/01-work-packages/WP-074-student-briefing-and-scene-copy-simplification.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

## Constraints

- Preserve the guided on-ramp through `CrimeType`, broad `CrimeSceneReport`, murder filtering, SQL City filtering, and target report-row logging.
- Preserve WP-073's autonomy bridge and witness/gym lead gating.
- Do not reveal witness names, witness addresses, gym lead details, suspects, or hidden solution information earlier than current behavior.
- Keep the scene artwork visible and useful, but avoid putting instructional text over the image if that text is redundant or distracting.
- No architectural changes, new dependencies, or unrelated refactors.

## Required Behavior

- The initial mentor header should state the current investigative move, not tell the student to "Start with the briefing" while already on the briefing view.
- The opening mentor header should introduce Samuel as the student's data detective mentor.
- The Briefing should explain why Samuel is present, what case students are investigating, and how they will find clues before showing the first SQL task.
- The briefing section should separate:
  - Samuel's role
  - case background
  - how students find clues
  - stable known facts about the case
  - the first Samuel on-ramp lead
  - why the current step matters and what success looks like
- The long case briefing paragraph should be replaced or simplified so it is easier to scan.
- Breadcrumb progress should not be displayed twice; keep it in the lower Case Briefing panel and remove it from the avatar/mentor strip.
- The initial `Briefing` status pill above Samuel and the `Mentor` label below Samuel's avatar should not be shown.
- Samuel's name should sit below his avatar so the copy beside the avatar focuses on the current mentor message.
- The briefing tab should use the possessive `Samuel's Briefing`.
- Everything above the navigation buttons should remain the same size and aspect ratio as students switch between `Samuel's Briefing`, Query Lab, and Evidence Board.
- `Do This Next` should read as a compact action cue instead of a large feature card.
- The noir scene should no longer display a large instructional caption over the image.
- If a scene label remains, it should be decorative/wayfinding only and should not compete with the active task copy.
- Tests should verify the revised opening copy and the absence of scene overlay instruction text.

## Acceptance Criteria

- [x] Opening Student Mode no longer shows "Start with the briefing" as the mentor title.
- [x] Samuel introduces himself as the student's data detective mentor before the first SQL task.
- [x] The Briefing introduces the case background and clue-finding loop before the first lead.
- [x] Samuel Briefing still exposes the necessary case facts in a clearer, scannable format.
- [x] Samuel's current step remains visible and actionable.
- [x] Breadcrumb progress appears in the lower Case Briefing section and is not duplicated by the avatar/mentor strip.
- [x] The redundant initial `Briefing` status pill and avatar `Mentor` label are removed.
- [x] Samuel's name appears below his avatar instead of in the mentor message column.
- [x] The briefing tab is labeled `Samuel's Briefing`.
- [x] The full header area above the three navigation buttons uses stable sizing across Student Mode tabs.
- [x] Query Lab's `Do This Next` section is visually tightened.
- [x] The Crime Ledger scene image remains visible, but its old overlaid instructional caption is not rendered as visible UI copy.
- [x] Existing on-ramp draft query behavior is preserved.
- [x] Tests cover the revised briefing and scene-copy behavior.
- [x] No unrelated files changed

## Codex Prompt

Implement WP-074.

Scope:
- Only modify the allowed files.

Constraints:
- Preserve the existing guided on-ramp queries and evidence progression.
- Preserve WP-073 autonomy bridge and lead gating.
- Do not add dependencies or change backend/database behavior.

UX intent:
- Make "Known Case Facts" a concise stable reference, not a duplicate briefing paragraph.
- Make Samuel's mentor/header copy tell the student the current move.
- Let the noir scene artwork support atmosphere and state without carrying redundant overlaid instructional notes.

Implementation expectations:
- Replace the confusing opening "Start with the briefing" title.
- Introduce Samuel's mentor role and the case background before the first concrete SQL task.
- Restructure the briefing facts into a clearer scannable surface.
- Move breadcrumb progress out of the avatar/mentor strip and into the lower Case Briefing section.
- Remove the redundant initial `Briefing` status pill above Samuel and the `Mentor` label below Samuel's avatar.
- Move Samuel's name below the avatar and keep the message column focused on the mentor heading and guidance.
- Rename the tab to `Samuel's Briefing`.
- Remove tab-specific header status pills and compact-only header sizing so the full top section remains stable across views.
- Remove the forced viewport-height Query Lab workspace and tighten the `Do This Next` card spacing and text scale.
- Remove or reduce the visible scene caption overlay if it does not add enough value to justify covering the image.
- Update tests.
- Run `npm run test --workspace apps/web`.
- Run `npx vite build` from `apps/web`.
- Remove generated Vite build outputs after verification.
- Update this work package with Codex Results and verification.

Return:
- Exact code changes
- Short summary of what was implemented

## Gemini Audit Prompt

Audit WP-074 against the Student Mode UX goals.

Verify:
- All acceptance criteria are satisfied
- No files outside allowed list were modified
- No functional regression
- Behavior remains consistent outside scope
- The Briefing and Known Case Facts surfaces complement each other instead of duplicating or contradicting each other
- Samuel is clearly introduced as the student's mentor before the first task
- Breadcrumb progress appears in the lower Case Briefing section, not beside Samuel's avatar
- Redundant avatar/status labels are removed without losing useful later case status feedback
- Samuel's name is visually attached to the avatar rather than competing with the mentor message
- Navigation grammar uses `Samuel's Briefing`
- The full header area above the navigation buttons is consistent between Student Mode tabs
- The Query Lab action cue is compact enough to avoid pushing primary work down the page
- The scene image treatment improves clarity and does not bury important instructions in an image overlay
- The on-ramp, autonomy bridge, and future-lead gating remain preserved

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-074.

UX evaluation:

- The previous "Start with the briefing" mentor heading was confusing because it appeared while the user was already on the briefing surface and did not name the actual task.
- The previous Known Case Facts block was valuable, but it was too paragraph-like and duplicated briefing/mentor guidance instead of acting as a quick reference.
- The Crime Ledger scene overlay provided light wayfinding, but not enough value to justify covering the artwork or competing with Samuel's active instruction. The better location for instructional copy is the mentor/current-lead surface and Query Lab action card, not over the image.

Changes made:

- Replaced the opening mentor title with `Meet Samuel Tupleton`.
- Added a concise top-level Samuel welcome plus a fuller mentor-role introduction before the first SQL task.
- Renamed the primary briefing panel to `Case Briefing` and made `Samuel's Current Lead` a subsection within it.
- Added case background and an overview of how students find clues before the first lead appears.
- Moved breadcrumb progress to the lower Case Briefing panel and removed it from the avatar/mentor strip.
- Removed the redundant initial `Briefing` status pill above Samuel and the `Mentor` label below Samuel's avatar.
- Moved `Samuel Tupleton` below the avatar and removed the name from the mentor message column.
- Renamed the Student Mode tab to `Samuel's Briefing`.
- Removed the compact Query Lab header mode and top status-pill rendering so the full header area above the navigation buttons keeps the same size across Student views.
- Removed the fixed viewport-height Student workspace layout that stretched Query Lab cards.
- Tightened `Do This Next` with forced reduced padding, smaller body text, tighter line-height, and top alignment.
- Converted the long case briefing paragraph into a concise `KNOWN_CASE_FACTS` list.
- Reused the facts list in the Query Lab case briefing details so the recap stays consistent.
- Removed visible badge/caption overlay text from the noir scene frame and softened the scrim so the artwork remains atmospheric instead of carrying instructions.
- Removed now-unused scene badge/caption descriptor fields and scene overlay CSS.
- Added compact list styling for Known Case Facts.
- Added responsive intro-grid styling for Samuel's role and case background.
- Replaced the unused avatar-state label styles with a reusable avatar-name style.
- Updated tests to verify:
  - the opening mentor no longer uses "Start with the briefing"
  - stable case facts are still visible
  - the Crime Ledger image remains available
  - the old overlaid instructional scene caption is no longer rendered
  - existing guided query draft behavior remains intact

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 31 tests.
- `npx vite build` from `apps/web` passed; Vite reported existing deprecation warnings for `esbuild` and `optimizeDeps.esbuildOptions`.
- Generated Vite build outputs were removed after verification.

## Gemini Audit Results

## Final Audit Results - WP-074

**Verdict: PASS**

### Verification Summary

The audit of WP-074 confirms that the Student Mode UX goals have been successfully implemented. The opening experience is significantly clearer, with a strong introduction to the mentor role and the case background.

### Audit Checklist Results

*   **Acceptance Criteria:** All satisfied. The title was renamed, redundant labels were removed, and the briefing facts were restructured into a scannable format.
*   **File Modifications:** Verified. Only `App.tsx`, `App.test.tsx`, and `styles.css` were modified in the web app, remaining within the allowed scope.
*   **Functional Regression:** None observed. Existing on-ramp queries and evidence logging logic remain intact.
*   **Complementary Surfaces:** The `Samuel's Briefing` narrative and the `Known Case Facts` list act as effective complements. The side-rail recap in Query Lab now uses the concise facts list instead of repeating the full briefing intro.
*   **Samuel's Introduction:** Clearly established as a "data detective mentor" with a focused message column.
*   **Breadcrumb Placement:** Successfully moved to the `Samuel's Briefing` content panel and removed from the mentor strip, preventing duplication.
*   **Visual Consistency:** The header area remains stable across Student Mode tabs thanks to fixed minimum heights and the removal of tab-specific header status pills.
*   **Scene Image Treatment:** Instructional caption overlays have been removed, and the scrim has been softened to prioritize artwork atmosphere over redundant text.
*   **Compact Action Cue:** The Query Lab `Do This Next` section is visually tightened as requested.

### Violations
*   **None.**

### Regressions
*   **None.**

### Drift Risks
*   **Dead Code:** The `samuelStatus.detail` property is currently unused in `App.tsx`, as its role has been superseded by the `getSamuelReaction` helper function. This does not affect functional performance but should be cleaned up in a future maintenance cycle.
*   **Hardcoded Narrative:** Introduction and overview text are hardcoded in `App.tsx`. While correct for the current case, future story additions will benefit from moving these to a centralized story configuration.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Accepted.

WP-074 is accepted after Gemini audit PASS. The implementation improves Student Mode briefing clarity, introduces Samuel as the mentor before the first SQL task, keeps the header stable across navigation tabs, removes redundant scene/mentor/status labels, tightens the Query Lab action cue, and preserves the existing on-ramp, autonomy bridge, lead gating, backend, database, package, runtime AI, script, and artwork boundaries.

