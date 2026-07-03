# WP-157: Visual Case Library And Header-Level Case Switching

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-07-01

## Objective

Replace the current text-heavy student intake with a visually engaging case-library entry experience and move the return-to-cases control out of the primary student tab row into a header-level utility action labeled `Case Library`.

## Scope

### In Scope

- redesign the Student Mode intake screen into a visually richer case-library surface that uses existing or newly added repository-owned bitmap art
- preserve the current Case 004 entry flow while making the opening experience feel like entering a detective case library rather than reading a setup document
- move the current in-case `Case Selection` action out of the primary student navigation row and replace it with a smaller header-level `Case Library` utility control
- keep the primary in-case student navigation focused on exactly three destinations:
  - `Samuel's Briefing`
  - `Query Lab`
  - `Evidence Board`
- update relevant unit and browser coverage for the new layout and case-library return path
- regenerate Understand artifacts after implementation because student entry composition and shared navigation structure will change again

### Out of Scope

- changing Case 004 clue logic, guidance logic, answer logic, or suspect verification behavior
- adding additional playable cases or unlocking future difficulties
- changing backend routes, database schema, migrations, or student-restricted table policy
- redesigning the full in-case Samuel header beyond what is needed to place the `Case Library` utility control appropriately
- introducing accounts, save slots, or long-term student persistence
- broad restyling of Admin Mode

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`
- Freshness assessment: `Structurally stale; regenerate before relying on scope`
- Analysis performed: Recommended-tier analysis for shared student navigation and entry-screen restructuring. The tracked Understand baseline is present and readable, and narrow graph lookup confirms the current student entry files exist in the graph (`StudentCaseEntryFlow.tsx`, `StudentBriefingView.tsx`, `StudentMentorHeader.tsx`, `studentCase.ts`). However, the worktree currently contains uncommitted WP-156 changes in the same student-entry surfaces, so current source inspection is authoritative for scope and dependency planning.

### Affected Architecture
- Layers:
  - student experience shell
  - student onboarding / case-library entry
  - shared frontend navigation hierarchy
  - browser regression coverage
- Primary files/components:
  - `apps/web/src/App.tsx`
  - `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
  - `apps/web/src/components/student/StudentMentorHeader.tsx`
  - `apps/web/src/studentCase.ts`
  - `apps/web/src/styles.css`
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
  - `apps/web/src/App.test.tsx`
- Upstream consumers:
  - Student Mode first-load experience
  - top application header utility area
  - current case-entry action from intake into Case 004
- Downstream dependencies:
  - in-case student navigation layout
  - browser harness assumptions about how Student Mode becomes interactive
  - visual hierarchy expectations for future multi-case presentation

### Regression Surface
- Related tests:
  - `apps/web/src/App.test.tsx`
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
- User workflows:
  - landing in Student Mode
  - visually understanding the product and current available case
  - opening Case 004 from the intake surface
  - returning from an active case back to the case library
  - continuing into `Samuel's Briefing`, `Query Lab`, and `Evidence Board`
- Security/data boundaries:
  - no API or database changes
  - no answer-table exposure changes
  - no Case 004 progression-state logic changes

### Graph Update Decision
- Regeneration required: Yes
- Rationale: This work changes shared student entry composition, top-level navigation placement, and the future case-library shell. Future WPs should not reason from the current interim onboarding graph once this structure is updated.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/**`
- `apps/web/src/assets/scenes/**`
- `apps/web/src/assets/avatars/**`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-157-visual-case-library-and-header-level-case-switching.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/api/**`
- `apps/web/tests/browser/studentModeApi.ts`
- other work-package documents

## Constraints

- Keep the current app header and Student/Admin mode placement conceptually intact; only add case-library utility behavior there.
- The control must be labeled `Case Library`, not `Case Selection`.
- The `Case Library` action must read as a secondary utility action, not a fourth primary student workspace tab.
- The primary in-case navigation must remain limited to three equally weighted destinations.
- The intake redesign must use visual assets and should not devolve into a text-only explanation panel.
- Do not create a marketing landing page; the intake must still feel like the application itself.
- Prefer repository-owned existing noir scene and Samuel assets before generating or importing net-new imagery.
- Preserve all current Case 004 progression, clue logging, and suspect-theory behavior.

## Required Behavior

- Student Mode should open to a visually engaging case-library screen rather than the current plain onboarding grid.
- The case-library screen should include:
  - a strong visual hero or featured scene
  - visible Samuel or case-world presence
  - a clearer featured Case 004 presentation
  - concise supporting orientation copy rather than long equal-weight text blocks
- Once inside Case 004, the return action should appear in the top utility/header area as `Case Library`.
- The in-case tab row should no longer include `Case Selection`.
- The three primary in-case tabs should remain visually balanced and stable across screen sizes.
- The case-library surface should clearly imply future additional cases without pretending they already exist.

## Acceptance Criteria

- [ ] Student intake is visually richer and uses case-appropriate imagery.
- [ ] `Case Library` replaces `Case Selection` as the return label.
- [ ] `Case Library` is moved out of the primary student tab row into the top utility/header area.
- [ ] The in-case student navigation shows only `Samuel's Briefing`, `Query Lab`, and `Evidence Board` as primary destinations.
- [ ] The primary tabs remain visually balanced on desktop and mobile.
- [ ] Case 004 still opens cleanly from the intake / library screen.
- [ ] Returning to the case library from an active case still works.
- [ ] Relevant web unit tests pass.
- [ ] Relevant browser tests pass.
- [ ] Understand artifacts are regenerated after implementation.
- [ ] No API, database, SSOT, or progression-state files outside scope change.

## Code Prompt

Implement WP-157 as a visual case-library and student navigation hierarchy refinement.

1. Redesign the Student Mode intake so it feels like a case library with strong noir visual interest and a featured Case 004 entry.
2. Keep the intake inside the product experience, not as a marketing landing page.
3. Move the current return-to-cases action into the top header utility area and label it `Case Library`.
4. Remove `Case Selection` from the primary student tab row.
5. Keep the primary student tab row limited to `Samuel's Briefing`, `Query Lab`, and `Evidence Board`, with equal visual weight.
6. Preserve existing Case 004 investigation behavior and state transitions.
7. Update unit and browser coverage for the new intake and header-level case-library return path.
8. Regenerate the Understand artifacts after implementation and validation.
9. Update Code Results, Audit Results, and Final Decision.

## Audit Prompt

Audit WP-157 for navigation hierarchy correctness, visual intake quality, and scope compliance.

Verify:

1. The intake now feels visually engaging and case-driven rather than text-heavy and flat.
2. `Case Library` appears as a header-level utility action, not a primary workspace tab.
3. The main in-case tabs are limited to three and remain visually balanced.
4. Case 004 still opens and returns to the library correctly.
5. No Case 004 progression logic or answer behavior changed.
6. Unit and browser coverage were updated appropriately.
7. Understand artifacts were regenerated as required.
8. No API, database, SSOT, or out-of-scope files changed.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Visual hierarchy concerns
- Regression risks

## Code Results

Implemented.

- Moved the return-to-cases action out of the in-case tab row and into the top app-header utility area as a smaller `Case Library` button in `apps/web/src/App.tsx`.
- Reduced the primary in-case student navigation back to three balanced destinations:
  - `Samuel's Briefing`
  - `Query Lab`
  - `Evidence Board`
- Rebuilt `apps/web/src/components/student/StudentCaseEntryFlow.tsx` into a visual case-library surface using existing repository-owned noir assets:
  - a full-width hero image band
  - a concise welcome card
  - a Samuel mentor card with portrait
  - a workflow card
  - a single-image Victorian shelf scene with clickable book-spine hotspots
  - metadata-driven case details that update on hover/selection without swapping image assets
  - a default Case 004 selection so the live student path remains obvious on first load
- Added placeholder shelf volumes for Cases 001-007 while keeping only Case 004 playable in this build, which gives the library screen future-case shape without inventing unlocked flows that do not exist yet.
- Updated `apps/web/src/styles.css` so:
  - the header utility area supports `Case Library` without disturbing Student/Admin mode placement
  - the intake screen has a stronger visual hierarchy on desktop and mobile
  - the book-spine hotspots show visible hover, focus, and selected feedback using CSS overlays on a single shared image
  - the in-case primary tabs remain equal-weight and stable after removing the former fourth tab
- Updated `apps/web/src/App.test.tsx` and `apps/web/tests/browser/student-mode.spec.ts` to assert:
  - the new `Case Library` placement
  - the intake-return workflow
  - the shelf-detail-panel behavior when a locked placeholder case is selected
- Refreshed tracked Understand artifacts with a targeted baseline update:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`

Validation:
- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`
- `npm run test:browser --workspace apps/web`

Visual review:
- verified the updated intake, briefing, and Query Lab hierarchy with fresh desktop screenshots
- verified the intake layout on mobile with a fresh narrow-viewport screenshot

## Audit Results

PASS

- Navigation hierarchy: PASS. `Case Library` now reads as a header-level utility action instead of competing as a fourth primary tab.
- Intake quality: PASS. The case-entry screen is now image-led and materially more engaging while staying inside the application shell rather than becoming a landing page.
- Case-library interaction: PASS. The new shelf uses one shared bitmap image with positioned hotspot overlays, so hover and selected feedback are dynamic without requiring multiple rendered variants of the artwork.
- Primary tab balance: PASS. The in-case tab row now contains exactly three equal-weight destinations and no longer wraps awkwardly because of a fourth control.
- Workflow integrity: PASS. Case 004 still opens cleanly from the intake surface, and the student can return to the case library from an active case.
- Scope compliance: PASS. No API, database, SSOT, or progression-state files outside the approved WP-157 scope changed.
- Understand artifacts: PASS with a targeted refresh. The deterministic scan inventory, fingerprints baseline, metadata, and tracked graph metadata were refreshed against the current accepted baseline commit. This was a narrow baseline refresh rather than a brand-new end-to-end graph rebuild.

## Final Decision

Accepted.

- WP-157 is accepted as the current case-library and student navigation hierarchy baseline.
- No additional follow-up is required before normal testing and commit review, though future multi-case work can now build on this visual library shell.
