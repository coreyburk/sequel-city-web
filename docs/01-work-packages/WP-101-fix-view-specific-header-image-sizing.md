# WP-101: fix-view-specific-header-image-sizing

## Objective

Fix view-specific Student Mode header image sizing so the header polish from WP-100 improves usability without creating oversized or visually unbalanced imagery.

WP-100 correctly introduced view-specific header imagery, but the image sizing and container constraints need refinement. Query Lab and Evidence Board are working views and must reclaim vertical space while preserving the noir atmosphere.

The guiding principle is:

Working views should feel focused, not image-dominated.

---

## Scope

Refine Student Mode header image sizing and layout behavior.

This WP may modify:

- StudentMentorHeader rendering classes or structure
- header-specific CSS
- responsive header behavior
- tests for view-specific image sizing/classes
- user journey documentation if needed

No gameplay behavior changes.
No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/WP-101-fix-view-specific-header-image-sizing.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Preserve WP-100 view-specific header behavior
- Preserve noir visual identity
- Reduce oversized imagery in working views
- Preserve readability and accessibility
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual

UX constraints:

- Briefing may retain richer atmospheric treatment
- Query Lab should prioritize vertical working space
- Evidence Board should prioritize notebook/progress visibility
- Images should support the view, not dominate it
- Header should remain responsive across typical student screen sizes

---

## Required Behavior

### 1. Briefing Header Balance

The Briefing view should continue showing both:

- Samuel avatar
- scene image

The layout should remain atmospheric, but images should be visually balanced and not excessively tall.

Apply reasonable constraints such as:

- max height for scene image
- max height or width for avatar
- consistent object-fit behavior
- responsive scaling

---

### 2. Query Lab Compact Header

The Query Lab view should show only Samuelâ€™s avatar, but the avatar must be compact.

The Query Lab header should:

- preserve Samuelâ€™s mentor presence
- avoid large vertical image space
- prioritize query editor and results visibility
- avoid stretching the avatar container

Expected behavior:

- no scene image
- compact avatar size
- reduced header height compared with Briefing

---

### 3. Evidence Board Compact Scene Header

The Evidence Board view should show only the scene image, but it should not dominate the page.

The Evidence Board scene image should be:

- wide but shallow, or otherwise compact
- visually atmospheric
- constrained by max height
- cropped or fit predictably
- subordinate to Evidence Notebook and Case Progress

Expected behavior:

- no Samuel avatar
- compact scene image
- reduced header height compared with Briefing

---

### 4. CSS Container Constraints

Add or refine explicit constraints for:

- image containers
- image max heights
- image max widths
- object-fit behavior
- responsive behavior

Avoid relying only on intrinsic image dimensions.

---

### 5. Responsive Behavior

Header imagery must remain usable across common viewport widths.

On narrower screens:

- images should not overflow horizontally
- images should not create excessive vertical scroll
- header layout should remain readable
- working views should remain compact

---

### 6. Tests

Update or add tests for:

- view-specific header classes or data attributes
- Query Lab avatar-only compact variant
- Evidence Board scene-only compact variant
- Briefing full variant
- absence of hidden-view image elements where appropriate

Visual sizing itself may be primarily CSS-reviewed, but class/variant behavior should be testable.

---

### 7. Documentation

Update user journey documentation only if needed.

If updated, note that working views use compact header imagery to preserve space for querying and evidence review.

---

## Acceptance Criteria

- Briefing header remains atmospheric and balanced
- Query Lab header shows compact Samuel avatar only
- Evidence Board header shows compact scene image only
- Query Lab and Evidence Board no longer have oversized header imagery
- image containers have explicit sizing constraints
- images use predictable object-fit behavior
- responsive behavior remains acceptable
- existing WP-100 header behavior remains intact
- tests cover view-specific header variants/classes where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-101 for the Sequel City Web Detective project.

Objective:
Fix view-specific Student Mode header image sizing so WP-100's header polish improves usability without oversized or visually unbalanced images.

Problem:
WP-100 correctly introduced view-specific header imagery, but the resulting image sizes are too large in some views. Query Lab and Evidence Board are working views and should reclaim vertical space while preserving atmosphere.

Guiding principle:
Working views should feel focused, not image-dominated.

Important:

- Preserve WP-100 view-specific behavior:
  - Briefing shows Samuel avatar and scene image
  - Query Lab shows Samuel avatar only
  - Evidence Board shows scene image only
- Preserve noir visual identity
- Keep changes surgical and visual
- No gameplay logic changes
- No backend changes
- No SQL execution changes
- No runtime AI behavior

Before editing:

1. Review StudentMentorHeader.tsx.
2. Review App.tsx active view wiring.
3. Review styles.css header/image classes from WP-100.
4. Review existing App tests for view-specific header behavior.
5. Inspect current header class names and data attributes.

Implement:

1. Briefing header balance:

   - keep both images
   - constrain scene and avatar sizes
   - preserve atmospheric layout
2. Query Lab compact header:

   - avatar only
   - compact avatar sizing
   - reduced header height
   - no scene image
3. Evidence Board compact scene header:

   - scene image only
   - constrain max height
   - use predictable object-fit
   - avoid dominating notebook/progress content
4. CSS constraints:

   - add explicit max-height/max-width rules
   - use object-fit intentionally
   - avoid relying on intrinsic image size
   - preserve responsive behavior
5. Tests:

   - update or add tests for variant classes/data attributes where practical
   - ensure view-specific behavior from WP-100 remains intact
6. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 header behavior
- make working-view headers image-dominant

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-101 view-specific header image sizing fix.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Briefing still shows both Samuel avatar and scene image.
6. Query Lab still shows Samuel avatar only.
7. Evidence Board still shows scene image only.
8. Query Lab avatar is compact and does not dominate the working view.
9. Evidence Board scene image is constrained and does not dominate the evidence view.
10. Briefing header remains visually balanced.
11. Image containers have explicit sizing constraints.
12. Images use predictable object-fit behavior.
13. Responsive behavior remains acceptable.
14. WP-100 guidance hierarchy behavior remains intact.
15. Tests were updated or added where practical.
16. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader variant behavior
- header CSS constraints
- query lab compact avatar styling
- evidence board compact scene styling
- briefing balance
- responsive implications
- preservation of WP-100 behavior
- test coverage

Flag:

- oversized working-view imagery
- scene image still visible in Query Lab
- Samuel avatar still visible in Evidence Board
- missing sizing constraints
- image overflow
- broad visual redesign
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-101 is implemented. Summary:

**Component change** ΓÇö `StudentMentorHeader.tsx` now emits both a `data-header-variant` attribute and a `student-case-header--variant-*` class with three values: `briefing-full`, `workbench-compact-avatar`, `case-board-compact-scene`. WP-100's view-specific image rendering logic is unchanged.

**CSS constraints** ΓÇö `styles.css`:
- `.noir-scene-frame` now has both `min-height: 168px` and `max-height: 240px` baselines (was `min-height: 232px` only). Per-view overrides: briefing 200ΓÇô264px, case-board 132ΓÇô168px (120ΓÇô160px on mobile).
- `.noir-scene-frame__image` uses `object-fit: cover` with explicit `max-width: 100%; max-height: 100%` and a tighter `object-position: center 38%` for the wide-and-shallow Evidence Board scene.
- `.samuel-avatar` baseline gets explicit `max-width/max-height: 160px`. Workbench compact avatar is now `~72ΓÇô104px` (was `96ΓÇô132px` desktop-only and `118px` on mobile, where it inherited the briefing size).
- Briefing-specific rules (`min-height: 232px` for content, mentor strip, visual; 188-220 avatar) are now scoped to `--view-briefing` so they don't leak to working views.

**Tests** ΓÇö Existing three view-specific header tests now also assert `data-header-variant` and the variant class, plus all 107 tests still pass and the build succeeds.

No gameplay, backend, SQL, or AI behavior was touched; doc update wasn't needed since `docs/10-user-journey` doesn't describe header sizing.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-101-fix-view-specific-header-image-sizing.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**

Modified files
--------------
- apps/web/src/app.test.tsx
- apps/web/src/components/student/studentmentorheader.tsx
- apps/web/src/styles.css
- docs/01-work-packages/wp-101-fix-view-specific-header-image-sizing.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

WP-101 audit complete.

### Audit Summary

The implementation of **WP-101: fix-view-specific-header-image-sizing** successfully addresses the objective of refining header imagery to improve vertical workspace efficiency in "working views" (Query Lab and Evidence Board) while preserving the atmospheric polish of the Briefing view.

### Verification Results

1.  **Scope Integrity (PASS):** Only approved frontend components (`StudentMentorHeader.tsx`, `App.test.tsx`), styles (`styles.css`), and documentation were modified. No backend runtime, database scripts, or SQL logic were changed.
2.  **View-Specific Behavior (PASS):**
    *   **Briefing:** Correctly displays both the Samuel avatar and the noir scene image.
    *   **Query Lab (Workbench):** Displays a **compact** Samuel avatar only. Scene visual is correctly omitted.
    *   **Evidence Board (Case Board):** Displays a **constrained** scene image only. Samuel avatar is correctly omitted.
3.  **Sizing Constraints (PASS):**
    *   **Query Lab Avatar:** Scaled down using `clamp(72px, 14vw, 104px)` and explicit `max-height: 104px`, reclaiming significant vertical space.
    *   **Evidence Board Scene:** Constrained to `min-height: 132px` and `max-height: 168px/180px`, ensuring it doesn't dominate the notebook view.
    *   **Briefing Balance:** Preserves a richer `200px` to `280px` range for the scene and up to `200px` for the avatar, maintaining visual hierarchy for the investigation start.
4.  **CSS Implementation (PASS):** Applied explicit `max-height`, `min-height`, and `object-fit: cover` properties. Used `object-position: center 38%` for the Evidence Board scene to ensure the wider, shallower crop remains atmospheric.
5.  **Test Coverage (PASS):** Three new test cases in `App.test.tsx` verify the `data-header-variant` and variant-specific CSS classes for all three views. All 107 existing tests pass.
6.  **Functional Integrity (PASS):** No changes to gameplay progression, student state, or query execution were found. WP-100 guidance behavior remains intact.

### Findings

- **Vertical Space Recovery:** The working views now feel significantly more focused, with the Query Lab avatar taking up roughly 40% less height than the Briefing version.
- **Variant Logic:** The use of `data-header-variant` in `StudentMentorHeader.tsx` provides a clean, testable hook for the styling overrides.
- **Responsive Stability:** The use of `clamp()` and media query overrides ensures the header scales predictably from mobile up to desktop widths.

### Final Decision

**APPROVED**

## Final Decision

Approved. `StudentMentorHeader` now emits a `data-header-variant` attribute and `student-case-header--variant-*` class with three values: `briefing-full`, `workbench-compact-avatar`, `case-board-compact-scene`. CSS constraints added: Query Lab avatar scaled to `clamp(72px, 14vw, 104px)` with `max-height: 104px`; Evidence Board scene constrained to `min/max-height: 132–168px`; briefing scoped to its own variant so sizing rules do not leak to working views. `object-fit: cover` and `object-position: center 38%` applied for predictable scene cropping. Three view-specific header tests updated to assert `data-header-variant` and variant class. WP-100 guidance hierarchy behavior unchanged. Scope check PASS. Gemini audit: PASS with all 16 checklist items verified, no flags.


