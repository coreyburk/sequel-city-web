# WP-102: balanced-prominent-student-header-imagery

## Objective

Refine Student Mode header imagery so Samuel and scene visuals remain prominent, intentional, and atmospheric without consuming excessive workspace.

WP-100 and WP-101 introduced view-specific header behavior, but the current image sizing still feels visually unbalanced. The Evidence Board scene image appears as a narrow strip, and working-view imagery needs a more deliberate composition strategy.

This WP establishes a balanced hero treatment for Student Mode views.

The guiding principle is:

Prominent imagery, disciplined layout.

---

## Scope

Update Student Mode header image composition, sizing, and layout behavior.

This WP may modify:

- StudentMentorHeader rendering classes or structure
- header-specific CSS
- responsive header behavior
- view-specific image object positioning
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
- docs/01-work-packages/WP-102-balanced-prominent-student-header-imagery.md

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
- Preserve prominent imagery
- Preserve noir visual identity
- Preserve readability and accessibility
- Do not minimize images into decorative thumbnails
- Do not allow images to dominate working space
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual

UX constraints:

- Briefing should retain the richest cinematic treatment
- Query Lab should preserve prominent Samuel mentor presence
- Evidence Board should preserve prominent case-board atmosphere
- Working views should remain focused and usable
- Images should feel designed, not accidentally cropped
- Header height should be predictable per view
- Image composition should use intentional focal points

---

## Required Behavior

### 1. Balanced Hero Strategy

Create an intentional per-view hero layout.

Expected intent:

- Briefing:

  - full cinematic case-entry hero
  - Samuel avatar and scene image both present
  - tallest header treatment
- Query Lab:

  - mentor-focused working hero
  - Samuel avatar remains prominent
  - scene image remains hidden
  - medium height, not tiny and not dominant
- Evidence Board:

  - case-board-focused working hero
  - scene image remains prominent
  - Samuel avatar remains hidden
  - scene image should not appear as a narrow strip
  - medium-wide composed image treatment

---

### 2. Predictable View-Specific Header Heights

Define clear height constraints by view.

Recommended design targets:

- Briefing: taller hero treatment
- Query Lab: medium compact mentor treatment
- Evidence Board: medium scene treatment

Do not rely on intrinsic image dimensions.

Use explicit sizing such as:

- min-height
- max-height
- aspect-ratio
- clamp values
- container constraints

Exact values may be adjusted to fit the current layout, but the result must feel balanced.

---

### 3. Evidence Board Scene Composition

Fix the Evidence Board scene presentation.

The scene image should:

- feel prominent
- avoid the thin-strip look
- maintain useful visual composition
- use predictable object-fit behavior
- use intentional object-position
- preserve enough workspace for Notebook and Case Progress

If needed, use a composed image card rather than a full-width strip.

---

### 4. Query Lab Samuel Composition

Fix Query Lab Samuel avatar sizing.

The avatar should:

- remain prominent enough to reinforce mentor presence
- not consume excessive vertical space
- align cleanly with guidance text
- avoid awkward scaling or stretching

---

### 5. Briefing Header Balance

The Briefing view should continue showing both Samuel avatar and scene image.

The layout should:

- remain cinematic
- feel visually balanced
- avoid excessive empty space
- avoid uncontrolled image growth

---

### 6. CSS Container Constraints

Add or refine explicit constraints for:

- image containers
- image max heights
- image width behavior
- aspect ratios
- object-fit
- object-position
- responsive adjustments

Images should appear intentionally composed across views.

---

### 7. Responsive Behavior

Header imagery must remain usable across common viewport widths.

On narrower screens:

- images should not overflow horizontally
- images should not create excessive vertical scroll
- hero composition should remain readable
- working views should remain usable

---

### 8. Tests

Update or add tests for:

- view-specific header classes or data attributes
- Briefing full hero variant
- Query Lab mentor hero variant
- Evidence Board scene hero variant
- absence of hidden-view image elements where appropriate

Visual sizing itself may be primarily CSS-reviewed, but variant behavior and class hooks should be testable.

---

### 9. Documentation

Update user journey documentation only if needed.

If updated, note that Student Mode uses view-specific hero imagery to preserve atmosphere while keeping working views focused.

---

## Acceptance Criteria

- Briefing retains prominent avatar and scene image
- Query Lab retains prominent Samuel avatar only
- Evidence Board retains prominent scene image only
- Evidence Board scene no longer appears as an awkward narrow strip
- Query Lab avatar is prominent but disciplined
- Briefing header remains cinematic and balanced
- header heights are predictable by view
- image containers have explicit sizing constraints
- images use intentional object-fit and object-position behavior
- responsive behavior remains acceptable
- existing WP-100 view-specific behavior remains intact
- tests cover view-specific header variants/classes where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-102 for the Sequel City Web Detective project.

Objective:
Refine Student Mode header imagery so images remain prominent and atmospheric while using disciplined, predictable layout constraints.

Problem:
WP-100 and WP-101 introduced view-specific header imagery, but the current sizing is visually unbalanced. The Evidence Board scene image appears as a narrow strip, and working-view imagery does not yet feel intentionally composed. The goal is not to minimize images. The goal is to make them prominent without sacrificing too much workspace.

Guiding principle:
Prominent imagery, disciplined layout.

Important:

- Preserve WP-100 view-specific behavior:
  - Briefing shows Samuel avatar and scene image
  - Query Lab shows Samuel avatar only
  - Evidence Board shows scene image only
- Preserve prominent imagery
- Preserve noir visual identity
- Keep changes surgical and visual
- No gameplay logic changes
- No backend changes
- No SQL execution changes
- No runtime AI behavior

Before editing:

1. Review StudentMentorHeader.tsx.
2. Review App.tsx active view wiring.
3. Review styles.css header/image classes from WP-100 and WP-101.
4. Review existing App tests for view-specific header behavior.
5. Inspect current header class names and data attributes.

Implement:

1. Balanced hero strategy:

   - Briefing: full cinematic treatment with avatar and scene
   - Query Lab: mentor-focused hero with prominent Samuel avatar only
   - Evidence Board: case-board-focused hero with prominent scene image only
2. Predictable header heights:

   - establish per-view height constraints
   - avoid uncontrolled image growth
   - avoid overly minimized thumbnail treatment
3. Evidence Board scene composition:

   - remove thin-strip feeling
   - use intentional object-fit and object-position
   - keep image prominent but contained
   - preserve enough workspace below
4. Query Lab Samuel composition:

   - keep Samuel prominent
   - avoid oversized or stretched avatar
   - align cleanly with guidance text
5. Briefing balance:

   - keep cinematic feel
   - balance avatar and scene image
   - avoid excessive empty space
6. CSS constraints:

   - add or refine max-height, min-height, aspect-ratio, object-fit, and object-position
   - use view-specific classes or data attributes as needed
7. Tests:

   - update or add tests for variant classes/data attributes where practical
   - ensure WP-100 view-specific behavior remains intact
8. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- remove images from working views
- shrink images into tiny thumbnails
- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 header behavior
- make images dominate the workspace

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-102 balanced prominent Student Mode header imagery.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Briefing still shows both Samuel avatar and scene image.
6. Query Lab still shows Samuel avatar only.
7. Evidence Board still shows scene image only.
8. Query Lab avatar remains prominent but disciplined.
9. Evidence Board scene image remains prominent and no longer appears as an awkward narrow strip.
10. Briefing header remains cinematic and balanced.
11. Header heights are predictable by view.
12. Image containers have explicit sizing constraints.
13. Images use intentional object-fit and object-position behavior.
14. Responsive behavior remains acceptable.
15. WP-100 guidance hierarchy behavior remains intact.
16. Tests were updated or added where practical.
17. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader variant behavior
- header CSS constraints
- query lab mentor composition
- evidence board scene composition
- briefing balance
- responsive implications
- preservation of WP-100 behavior
- test coverage

Flag:

- minimized image treatment
- oversized working-view imagery
- thin-strip Evidence Board image
- scene image visible in Query Lab
- Samuel avatar visible in Evidence Board
- missing sizing constraints
- image overflow
- broad visual redesign
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-102 implemented.

**Summary of changes:**

- **StudentMentorHeader.tsx**: Renamed working-view variants `workbench-compact-avatar` ΓåÆ `workbench-mentor-hero` and `case-board-compact-scene` ΓåÆ `case-board-scene-hero` to signal hero treatment rather than thumbnail.
- **styles.css**:
  - Added `aspect-ratio` constraints to `.noir-scene-frame` (16/9 base, 16/10 briefing) so images compose intentionally rather than relying on intrinsic dimensions.
  - Evidence Board scene grew from `132ΓÇô180px` to `200ΓÇô272px` ΓÇö no more thin strip.
  - Query Lab Samuel avatar grew from `72ΓÇô104px` to `124ΓÇô156px` (desktop) with a 168ΓÇô196px embedded strip min-height for clean alignment with guidance text.
  - Briefing tuned to 240ΓÇô288px with a balanced mentor strip.
  - Refined `object-position` to `center 42ΓÇô44%` for better focal framing.
  - Mobile breakpoint heights raised to match.
- **App.test.tsx**: Updated variant assertions to new hero names.
- **WP-102 doc**: Recorded code results.

Verification: 107/107 tests pass, `tsc --noEmit` clean. WP-100 view-specific behavior intact (briefing shows both, Query Lab avatar only, Evidence Board scene only). No backend/SQL/AI/gameplay changes.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-102-balanced-prominent-student-header-imagery.md

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
- docs/01-work-packages/wp-102-balanced-prominent-student-header-imagery.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

The audit of Work Package 102 is complete. The implementation successfully refines the Student Mode header imagery, transitioning from the minimized/unbalanced treatment introduced in earlier WPs to a more "prominent but disciplined" hero strategy.

### 1. Scope and Integrity
- **File Scope:** Only approved frontend files (`apps/web/src/**`) and the work package document were modified. 
- **No Out-of-Scope Changes:** No backend runtime files (`apps/api`), database scripts, or SQL execution logic were changed.
- **Gameplay Integrity:** Gameplay and progression logic remain untouched. The changes are strictly visual and presentation-oriented.

### 2. Header Imagery Composition
- **Briefing View:** Verified that both the Samuel avatar and scene image are visible, using the `briefing-full` variant. The header remains cinematic and balanced.
- **Query Lab (`workbench`):** Verified that only the Samuel avatar is visible, using the `workbench-mentor-hero` variant. The avatar is prominent (`124ΓÇô156px` on desktop) but doesn't dominate the workspace.
- **Evidence Board (`case-board`):** Verified that only the scene image is visible, using the `case-board-scene-hero` variant. The "narrow strip" issue has been resolved by increasing the height to `200ΓÇô272px` and using a stable `16:9` aspect ratio.

### 3. Sizing and CSS Constraints
- **Explicit Constraints:** Added `min-height`, `max-height`, and `aspect-ratio` to image containers, ensuring predictable header heights across different views.
- **Intentional Framing:** Images use `object-fit: cover` with refined `object-position` (e.g., `center 42%` for briefing, `44%` for case-board) to maintain focal points.
- **Responsive Behavior:** Media queries for mobile and desktop have been tuned to keep imagery prominent while preserving usable vertical space for the Query Runner and Evidence Notebook.

### 4. Technical Standards and Validation
- **WP-100 Preservation:** The guidance hierarchy (required vs. optional callouts) and view-specific visibility rules established in WP-100 remain fully intact.
- **Test Coverage:** `App.test.tsx` was updated to assert the new hero variant names (`workbench-mentor-hero`, `case-board-scene-hero`). All existing tests continue to pass.
- **Code Cleanliness:** `tsc --noEmit` and build checks are clean.

### Flagged Items (None Found)
- No minimized "thumbnail" treatment observed.
- No oversized imagery obstructing working views.
- No scene images visible in Query Lab; no Samuel avatar visible in Evidence Board.
- No missing sizing constraints or image overflows.

**Audit Status: PASS**

## Final Decision

Approved. Working-view variant names updated from compact to hero treatment: `workbench-compact-avatar` → `workbench-mentor-hero`, `case-board-compact-scene` → `case-board-scene-hero`. Evidence Board scene height increased from 132–180px to 200–272px with a 16:9 aspect ratio — thin-strip issue resolved. Query Lab avatar grown to 124–156px desktop with a 168–196px embedded strip min-height. Briefing tuned to 240–288px. All views use `object-fit: cover` with refined `object-position` for intentional focal framing. `App.test.tsx` updated to assert new hero variant names. WP-100 guidance hierarchy and view-specific visibility rules unchanged. Scope check PASS. Gemini audit: PASS with all 17 checklist items verified, no flags.


