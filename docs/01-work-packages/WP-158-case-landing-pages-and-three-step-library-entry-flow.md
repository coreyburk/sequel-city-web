# WP-158: Case Landing Pages And Three-Step Library Entry Flow

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-07-02

## Objective

Extend the visual case-library work so each case opens into its own themed landing page before the live investigation begins, while preserving the current Case 004 gameplay and making browser back-navigation behave predictably across library, landing, and case states.

## Scope

### In Scope

- add a dedicated case landing page for each visible case volume in the library
- give each case a themed hero, case description, atmosphere copy, and dossier-style summary
- change the student entry sequence from a two-step flow into:
  - `Case Library`
  - `Case Landing Page`
  - `Live Investigation`
- keep Case 004 as the only playable case while still giving locked cases a polished themed landing page
- restore hover-driven case preview details on the library screen without defaulting to a preselected case
- wire browser history so `Back` moves cleanly through case, landing, and library states
- update unit and browser coverage for the new navigation and landing-page behavior

### Out of Scope

- changing Case 004 clue logic, progression logic, suspect verification behavior, or database behavior
- adding backend routes, persistence, accounts, or multi-case save state
- unlocking future cases for play
- creating bespoke one-off artwork for every case beyond the currently available repository-owned scene assets
- changing Admin Mode
- refreshing `.understand-anything/**` as part of this closeout

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`
- Freshness assessment: `Usable for local student-entry context, but not regenerated in this WP`
- Analysis performed: Source-led review against the current student entry flow, app shell navigation, and browser harness because the work is a frontend-local follow-on to WP-157 and the worktree already contains unrelated `.understand-anything` noise that should not be folded into this accepted closeout.

### Affected Architecture
- Layers:
  - student onboarding / case library
  - case selection metadata
  - student navigation / browser history flow
  - browser regression coverage
- Primary files/components:
  - `apps/web/src/App.tsx`
  - `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
  - `apps/web/src/components/student/StudentCaseLandingPage.tsx`
  - `apps/web/src/components/student/studentCaseLibrary.ts`
  - `apps/web/src/styles.css`
  - `apps/web/src/App.test.tsx`
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
  - `apps/web/src/assets/scenes/case-library.png`
- Upstream consumers:
  - Student Mode first-load experience
  - header-level `Case Library` utility navigation
  - Case 004 entry workflow
- Downstream dependencies:
  - browser harness assumptions about how Student Mode becomes interactive
  - future multi-case intake work
  - future per-case custom art/content expansion

### Regression Surface
- Related tests:
  - `apps/web/src/App.test.tsx`
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
- User workflows:
  - entering Student Mode
  - hovering case spines for preview details
  - opening a case landing page from the library
  - opening Case 004 from its landing page
  - using browser `Back`
  - returning to the library with the header action
- Security/data boundaries:
  - no API changes
  - no database or migration changes
  - no answer-table exposure changes

### Graph Update Decision
- Regeneration required: No
- Rationale: This WP is documented retroactively and intentionally excludes the current `.understand-anything/**` worktree noise from commit scope. The implementation is confined to already-known frontend student-entry surfaces and is validated by source review plus unit/browser coverage.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/components/student/StudentCaseEntryFlow.tsx`
- `apps/web/src/components/student/StudentCaseLandingPage.tsx`
- `apps/web/src/components/student/studentCaseLibrary.ts`
- `apps/web/src/assets/scenes/case-library.png`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `docs/01-work-packages/WP-158-case-landing-pages-and-three-step-library-entry-flow.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `.understand-anything/**`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/api/**`
- `apps/web/tests/browser/studentModeApi.ts`
- unrelated work-package documents

## Constraints

- The library screen must remain the top-level all-cases surface rather than turning into a single-case intro page.
- No case detail should be active by default on the library screen.
- Locked cases should still feel intentional and themed, not like dead buttons.
- Case 004 must remain the only live investigation that can be entered from the new landing pages.
- Browser history must remain intuitive for a student using native back-navigation.
- Preserve current Student/Admin mode placement and the header-level `Case Library` action.
- Do not weaken or bypass any existing Case 004 gameplay validation.

## Required Behavior

- Clicking any case spine from the library should open a dedicated themed landing page for that case.
- Each landing page should include:
  - case title
  - case description
  - atmospheric framing
  - a set of case-thread bullets
  - dossier-style summary/status information
- Locked cases should show a disabled archive/open action.
- Case 004 should show an enabled action that opens the existing live investigation.
- The library screen should still show hover-based preview details, but no default selected case.
- Browser `Back` should move from:
  - `Live Investigation` -> `Case Landing Page`
  - `Case Landing Page` -> `Case Library`

## Acceptance Criteria

- [x] The student entry flow is now library -> landing page -> live case.
- [x] Every visible case has a themed landing page with its own description and framing.
- [x] Locked cases can be opened as landing pages but cannot enter the investigation.
- [x] Case 004 enters the existing student investigation from its landing page.
- [x] The library retains hover-preview details with no default active case.
- [x] Browser back-navigation correctly steps through case, landing, and library states.
- [x] Relevant web unit tests pass.
- [x] Relevant browser tests pass.
- [x] No API, database, or `.understand-anything` files are required for this accepted closeout.

## Code Prompt

Implement a three-step student entry architecture with themed case landing pages.

1. Extract case-library metadata into a shared source so the library preview and landing pages stay aligned.
2. Add a dedicated landing page component for cases with a hero, description, atmosphere, threads, and dossier panel.
3. Change the library click behavior so a spine opens the landing page instead of jumping directly into the investigation.
4. Keep only Case 004 playable; locked cases should show polished but disabled landing-page entry controls.
5. Preserve hover-based library preview details and remove any default active case.
6. Update app-level browser history handling so `Back` steps through landing and library states correctly.
7. Update unit and browser coverage.

## Audit Prompt

Audit the case landing-page flow for navigation correctness, case-library clarity, and scope compliance.

Verify:

1. The student entry flow is library -> landing -> case for Case 004.
2. Locked cases show themed landing pages without exposing a playable investigation.
3. The library still provides hover-preview details without a default selected case.
4. Browser back-navigation works for the new states.
5. No Case 004 progression logic changed.
6. No `.understand-anything`, API, or database files were required.
7. Unit and browser coverage reflect the new flow.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Navigation risks
- Visual or copy concerns

## Code Results

Implemented.

- Added shared case-library metadata in `apps/web/src/components/student/studentCaseLibrary.ts` so each case now has:
  - preview metadata for the library
  - themed landing-page copy
  - hero-scene bindings
  - consistent status and dossier fields
- Reworked `apps/web/src/components/student/StudentCaseEntryFlow.tsx` so library clicks now select a case landing page rather than entering the investigation immediately.
- Added `apps/web/src/components/student/StudentCaseLandingPage.tsx` as a new themed intermediate screen with:
  - a branded hero
  - case description and atmosphere framing
  - `Inside This File` thread bullets
  - dossier/status content
  - `Back To Library` and open/archive actions
- Updated `apps/web/src/App.tsx` to manage a three-state student entry shell:
  - `library`
  - `landing`
  - `case`
- Extended browser history state so native back-navigation now walks backward through those three states instead of skipping or stalling.
- Preserved Case 004 as the only playable investigation while allowing locked cases to open polished landing pages with disabled archive controls.
- Restored hover-preview details on the library screen with no default active case.
- Expanded `apps/web/src/styles.css` with dedicated landing-page layout, responsive behavior, and themed hero treatments while preserving the broader noir shell.
- Updated the browser harness and regression tests to reflect the new multi-step entry flow.

Validation:
- `npm run build --workspace apps/web`
- `npm run test --workspace apps/web`
- `npm run test:browser --workspace apps/web`

## Audit Results

PASS

- Navigation hierarchy: PASS. The entry flow is now coherent and deliberately staged: library first, then case landing, then live investigation.
- Locked-case treatment: PASS. Non-playable cases now feel like intentional archives rather than inert previews.
- Library behavior: PASS. Hover-based preview detail remains available, and no case is active by default.
- Browser history: PASS. Back-navigation now behaves like a student would expect across the new intermediate state.
- Gameplay preservation: PASS. Case 004 still enters the same briefing/workbench/evidence-board investigation flow after the landing page.
- Scope compliance: PASS. No API, database, SSOT, or `.understand-anything` files were required for this accepted closeout.
- Residual concern: shared scene reuse is structurally fine for now, but future custom per-case artwork would materially improve the distinctiveness of each landing page.

## Final Decision

Accepted.

- WP-158 is accepted as the new baseline for student case entry architecture.
- Future multi-case work should build on this library -> landing -> case flow rather than returning to direct-open behavior from the shelf.
