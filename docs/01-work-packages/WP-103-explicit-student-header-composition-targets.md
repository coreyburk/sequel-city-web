# WP-103: explicit-student-header-composition-targets

## Objective

Apply explicit Student Mode header composition targets so each view has a clear, intentional visual layout.

WP-102 preserved the correct view-specific image rules, but the visual composition still does not meet the intended experience:

- Briefing is acceptable and should remain mostly unchanged.
- Query Lab still makes Samuelâ€™s avatar too small.
- Evidence Board still renders the scene image as a thin banner strip.

This WP provides more concrete sizing and composition targets to remove ambiguity from the implementation.

The guiding principle is:

Samuel should feel present in Query Lab. The Evidence Board scene should feel like a composed case-board image, not a banner crop.

---

## Scope

Refine Student Mode header composition with explicit per-view visual targets.

This WP may modify:

- StudentMentorHeader rendering classes or structure
- header-specific CSS
- responsive header behavior
- image object-fit and object-position behavior
- tests for view-specific header variants/classes
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
- docs/01-work-packages/WP-103-explicit-student-header-composition-targets.md

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
- Preserve WP-102 intent of prominent but disciplined imagery
- Preserve noir visual identity
- Preserve accessibility and readability
- Do not shrink images into decorative thumbnails
- Do not allow images to dominate working space
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual

UX constraints:

- Briefing should remain mostly unchanged unless minor balancing is necessary
- Query Lab should make Samuel visibly present and mentor-like
- Evidence Board should show a prominent composed scene image, not a thin strip
- Working views should remain usable and not sacrifice excessive workspace
- Image composition should feel intentional
- Header height should be predictable per view

---

## Required Behavior

### 1. Preserve Briefing Layout

The Briefing header is currently acceptable.

Preserve:

- Samuel avatar
- scene image
- cinematic case-entry feel
- current general proportions

Only make minor changes if necessary to keep CSS consistent.

Do not substantially redesign the Briefing header.

---

### 2. Query Lab Samuel Composition

The Query Lab header should show Samuel as a prominent mentor presence.

Required desktop targets:

- Samuel avatar/card target width: approximately 140 to 170px
- Samuel avatar/card target height: approximately 140 to 170px
- header content row target height: approximately 170 to 210px
- no scene image

The exact values may be adjusted slightly to fit the existing design, but Samuel must not look like a small icon.

The layout should support:

- Samuel avatar on the left
- guidance text beside the avatar
- badges below or near the guidance text
- compact but meaningful mentor presence

---

### 3. Evidence Board Scene Composition

The Evidence Board header should show the scene image as a composed case-board image.

Required desktop targets:

- scene image card target height: approximately 220 to 260px
- not a thin full-width strip
- scene image should feel like a framed illustration
- no Samuel avatar

Acceptable layout approaches:

- a centered/max-width scene card
- a right-aligned scene card with text beside it
- a balanced two-column header where the scene retains real height

The scene should use:

- object-fit: cover
- intentional object-position
- a focal area that shows the notebook, magnifying glass, or case-board details

Avoid:

- ultra-wide shallow banner crop
- stretching
- excessive empty header space
- sacrificing too much workspace

---

### 4. Explicit CSS Composition Rules

Add or refine explicit CSS rules for:

- Query Lab avatar sizing
- Query Lab header row height
- Evidence Board scene card height
- Evidence Board scene card width or max-width
- object-fit
- object-position
- responsive behavior

Do not rely on intrinsic image dimensions.

The CSS should make the intended composition obvious to future maintainers.

---

### 5. Responsive Behavior

On narrower screens:

- Query Lab avatar may scale down, but should remain visibly mentor-like
- Evidence Board scene may reduce height, but should not become an awkward strip
- images should not overflow horizontally
- working views should remain usable

Use responsive constraints such as clamp values or media queries where appropriate.

---

### 6. Tests

Update or add tests for:

- view-specific header variant class/data attributes
- Query Lab mentor-focused variant
- Evidence Board scene-focused variant
- Briefing full variant remains intact
- scene image absent from Query Lab
- Samuel avatar absent from Evidence Board

CSS sizing is primarily visual, but class hooks and rendering behavior should be testable.

---

### 7. Documentation

Update user journey documentation only if needed.

If updated, note that Student Mode uses explicit view-specific header compositions:

- Briefing for full atmosphere
- Query Lab for mentor presence
- Evidence Board for case-board atmosphere

---

## Acceptance Criteria

- Briefing header remains generally unchanged and balanced
- Query Lab Samuel avatar is visibly larger and mentor-like
- Query Lab no longer makes Samuel look like a small icon
- Query Lab still hides the scene image
- Evidence Board scene image is prominent and composed
- Evidence Board scene no longer appears as a thin banner strip
- Evidence Board still hides Samuel avatar
- explicit CSS sizing/composition rules exist
- object-fit and object-position are intentional
- responsive behavior remains acceptable
- existing WP-100 view-specific behavior remains intact
- tests cover view-specific header variants/classes where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-103 for the Sequel City Web Detective project.

Objective:
Apply explicit Student Mode header composition targets so Query Lab and Evidence Board imagery looks intentional and prominent without sacrificing excessive workspace.

Problem:
WP-102 preserved the correct view-specific image behavior, but the visual result is still not right. Briefing is acceptable. Query Lab makes Samuel too small. Evidence Board still renders the scene image as a thin strip. The goal is not to minimize imagery. The goal is to make images prominent and composed.

Guiding principle:
Samuel should feel present in Query Lab. The Evidence Board scene should feel like a composed case-board image, not a banner crop.

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
3. Review styles.css header/image classes from WP-100 through WP-102.
4. Review existing App tests for view-specific header behavior.
5. Inspect current header class names and data attributes.

Implement:

1. Preserve Briefing:

   - keep current general Briefing layout
   - keep avatar and scene image
   - avoid substantial redesign
2. Query Lab composition:

   - make Samuel avatar/card approximately 140 to 170px wide and tall on desktop
   - make the Query Lab header row approximately 170 to 210px tall on desktop
   - keep scene image hidden
   - place guidance text beside the avatar
   - make Samuel feel like a mentor presence, not a small icon
3. Evidence Board composition:

   - make the scene image card approximately 220 to 260px tall on desktop
   - avoid full-width thin strip treatment
   - use a composed card or balanced two-column layout
   - keep Samuel avatar hidden
   - use object-fit cover
   - tune object-position to show notebook, magnifying glass, or case-board details
4. CSS constraints:

   - add explicit view-specific sizing rules
   - avoid relying on intrinsic image dimensions
   - use clamp values, max-height, aspect-ratio, or media queries where useful
   - make the intended layout obvious from the CSS
5. Responsive behavior:

   - allow scaling down on narrow screens
   - prevent overflow
   - prevent Evidence Board scene from becoming an awkward strip
6. Tests:

   - update or add tests for view-specific class/data attributes and image presence/absence
   - preserve existing WP-100 behavior tests
7. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- remove images from working views
- shrink Samuel into a small icon
- render Evidence Board as a shallow strip
- substantially redesign Briefing
- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 header behavior

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-103 explicit Student Mode header composition targets.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Briefing still shows both Samuel avatar and scene image.
6. Briefing remains generally unchanged and balanced.
7. Query Lab still shows Samuel avatar only.
8. Query Lab Samuel avatar is visibly larger and mentor-like.
9. Query Lab scene image remains hidden.
10. Evidence Board still shows scene image only.
11. Evidence Board Samuel avatar remains hidden.
12. Evidence Board scene image is prominent and composed.
13. Evidence Board scene no longer appears as a thin banner strip.
14. Explicit CSS sizing/composition rules exist.
15. Images use intentional object-fit and object-position behavior.
16. Responsive behavior remains acceptable.
17. WP-100 guidance hierarchy behavior remains intact.
18. Tests were updated or added where practical.
19. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader variant behavior
- Query Lab avatar sizing/composition
- Evidence Board scene sizing/composition
- Briefing preservation
- header CSS constraints
- responsive implications
- preservation of WP-100 behavior
- test coverage

Flag:

- Samuel still appearing as a small icon in Query Lab
- Evidence Board still rendering as a thin banner strip
- minimized image treatment
- oversized working-view imagery
- scene image visible in Query Lab
- Samuel avatar visible in Evidence Board
- missing sizing constraints
- image overflow
- substantial Briefing redesign
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-103 implemented as a focused, visual-only change.

**What changed**
- `apps/web/src/styles.css` ΓÇö explicit per-view composition rules:
  - Query Lab: `--view-workbench .samuel-avatar` desktop `clamp(148px, 14vw, 170px)` (140ΓÇô170 target); mentor row desktop `min-height: 188px; max-height: 212px` (170ΓÇô210 target). Base/mobile floors raised so Samuel stays mentor-like.
  - Evidence Board: desktop switched from single column to `grid-template-columns: minmax(0, 1fr) clamp(300px, 32vw, 400px)` so the scene lives in a constrained card next to the summary, not a full-width strip. Scene desktop `aspect-ratio: auto; height: clamp(220px, 24vw, 256px)` (220ΓÇô260 target). Base/mobile aspect ratio changed from 16/9 to 4/3 so the scene remains composed at every width. `object-position: 50% 48%` tunes focus to the dossier/notebook area.
  - Briefing rules untouched.
- `apps/web/src/App.test.tsx` ΓÇö Query Lab header test now also asserts `.noir-scene-frame` absent and view-class/composition hooks present; Evidence Board test asserts no `.samuel-avatar-frame` and that the visual contains the noir-scene-frame elements.
- `docs/01-work-packages/WP-103-ΓÇªmd` ΓÇö Code Results section filled in.

**No changes** to `StudentMentorHeader.tsx`, App wiring, backend, database, SQL execution, AI, gameplay, or progression. Existing `data-active-view` / `data-header-variant` / variant classes already provided the composition hooks tests need.

**Verification**
- `npm test --prefix apps/web` ΓÇö 107/107 passing.
- `npm run build --prefix apps/web` ΓÇö TS + Vite build clean.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-103-explicit-student-header-composition-targets.md

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
- apps/web/src/styles.css
- docs/01-work-packages/wp-103-explicit-student-header-composition-targets.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

Audit of WP-103 "Explicit Student Mode header composition targets" is complete. The implementation is verified as successful and strictly follows the requirements and constraints.

### **Audit Highlights**

*   **Surgical Scope**: Verified that only `apps/web/src/styles.css`, `apps/web/src/App.test.tsx`, and the work package documentation were modified. No backend runtime files, database scripts, or gameplay logic were changed.
*   **Query Lab Composition**: 
    *   Samuel's avatar is now prominent and "mentor-like" with a desktop width/height of `clamp(148px, 14vw, 170px)`.
    *   The scene image is correctly hidden (`.noir-scene-frame` is absent).
    *   The mentor row height is explicitly constrained (`min-height: 188px; max-height: 212px`).
*   **Evidence Board Composition**:
    *   The scene image is now a prominent, composed card (4/3 aspect ratio base, custom grid on desktop) that avoids the "thin banner strip" appearance.
    *   Desktop height is constrained to `clamp(220px, 24vw, 256px)`.
    *   Samuel's avatar is correctly hidden.
    *   `object-position: 50% 48%` focuses the image on the dossier/notebook area.
*   **Briefing Preservation**: The Briefing header remains balanced, showing both Samuel and the scene image without substantial redesign.
*   **CSS Precision**: Sizing rules are explicit and use `clamp`, `aspect-ratio`, and `grid` layouts to ensure predictability across screen sizes.
*   **Test Validation**: `App.test.tsx` was updated with specific assertions for element presence/absence and view-specific class names/data attributes. 107/107 tests are passing.

### **Checklist Verification**
- [x] **Only approved frontend/doc files modified**
- [x] **No backend/database/SQL changes**
- [x] **Briefing remains balanced and unchanged**
- [x] **Query Lab shows large Samuel avatar only**
- [x] **Evidence Board shows prominent scene image only**
- [x] **No thin banner strips in Evidence Board**
- [x] **Explicit CSS sizing/composition rules**
- [x] **Responsive behavior acceptable**
- [x] **Tests updated and passing**

**Conclusion**: WP-103 is verified. The visual composition targets are met, and the implementation maintains high standards of structural integrity and surgical precision. No flags were raised.

## Final Decision

Approved. CSS-only change targeting explicit per-view composition. Query Lab Samuel avatar set to `clamp(148px, 14vw, 170px)` with mentor row `min-height: 188px / max-height: 212px`. Evidence Board switched to a two-column grid on desktop with scene card `clamp(220px, 24vw, 256px)` height, 4:3 base aspect ratio, and `object-position: 50% 48%` — thin-strip appearance eliminated. Briefing rules untouched. `StudentMentorHeader.tsx` and App wiring unchanged. `App.test.tsx` updated to assert `.noir-scene-frame` absent in Query Lab and `.samuel-avatar-frame` absent in Evidence Board. Scope check PASS. Gemini audit: PASS with all 19 checklist items verified, no flags.


