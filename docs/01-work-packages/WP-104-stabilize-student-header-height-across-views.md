# WP-104: stabilize-student-header-height-across-views

## Objective

Stabilize the Student Mode header height across Samuelâ€™s Briefing, Query Lab, and Evidence Board so switching between views does not create jarring vertical layout shifts.

The current implementation changes the height and composition of the header area by view. The Briefing page currently has the best header size and visual balance. Query Lab and Evidence Board should use the same outer header shell height while showing view-specific content inside that stable shell.

The guiding principle is:

Same header space. Different view-specific content. No vertical jump.

---

## Scope

Update Student Mode header layout so all three student views preserve the same outer header height and tab position.

This WP may modify:

- StudentMentorHeader structure
- StudentMentorHeader view-specific rendering
- header-specific CSS
- App header wiring if needed
- tests for view-specific header layout hooks
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
- docs/01-work-packages/WP-104-stabilize-student-header-height-across-views.md

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

- Preserve WP-100 view-specific content rules
- Preserve prominent imagery
- Preserve noir visual identity
- Preserve readability and accessibility
- Preserve the current Briefing header height as the target desktop height
- Do not collapse the header height in Query Lab
- Do not collapse the header height in Evidence Board
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual

UX constraints:

- Switching between student tabs should not move the tab bar vertically
- Switching between student tabs should not cause the main content area to jump vertically
- The outer header shell should maintain the same desktop height across all three student views
- View-specific differences should happen inside the stable header shell
- Images should remain prominent and intentionally composed
- Header content should feel balanced in each view

---

## Required Behavior

### 1. Stable Header Shell

Create or refine a stable Student Mode header shell.

The outer header region containing Samuel guidance and view imagery must keep the same desktop height across:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

Use the current Briefing header height as the visual target.

Do not allow Query Lab or Evidence Board to shrink the outer header area.

---

### 2. Preserve View-Specific Content Rules

Keep the existing view-specific content behavior:

- Briefing:

  - show Samuel avatar
  - show scene image
- Query Lab:

  - show Samuel avatar
  - do not show scene image
- Evidence Board:

  - do not show Samuel avatar
  - show scene image

These rules remain correct.

The change is that hidden content should not collapse the overall header shell height.

---

### 3. Stable Internal Layout Regions

Use stable internal regions inside the header shell.

Recommended conceptual structure:

- left region: Samuel/guidance region
- right region: scene/atmosphere region

Per view:

- Briefing:

  - left region contains avatar plus guidance text
  - right region contains scene image
- Query Lab:

  - left region contains avatar plus guidance text
  - right region may be an empty ambient panel, reserved space, or visually quiet placeholder
  - the outer header height must remain unchanged
- Evidence Board:

  - left region contains Samuel guidance/status text without avatar
  - right region contains scene image
  - the outer header height must remain unchanged

Do not create a visually awkward empty box. If placeholder space is used, it should feel intentional and quiet.

---

### 4. Stable Tab Position

The student tab bar should remain in the same vertical position when switching between:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

The content below the tab bar should also begin at a consistent vertical position.

---

### 5. Image Composition Within Stable Shell

Images should fit within the fixed header shell.

Use explicit CSS constraints such as:

- height
- min-height
- max-height
- aspect-ratio
- object-fit
- object-position

Images should remain prominent without changing the outer shell height.

---

### 6. Responsive Behavior

On narrower screens:

- the stable shell may adapt responsibly
- content should not overflow
- images should remain readable
- the layout should avoid excessive vertical jumps between student views

If the single fixed-height shell is impractical at narrow widths, use responsive CSS that still minimizes jarring layout shifts.

---

### 7. Tests

Update or add tests for:

- shared header shell class or data attribute across all student views
- view-specific content rules remain intact
- Query Lab does not render the scene image
- Evidence Board does not render the Samuel avatar
- Briefing renders both avatar and scene image
- active view attribute remains available for CSS targeting

Visual height itself may be primarily CSS-reviewed, but the stable-shell hooks and view-specific rendering behavior should be testable.

---

### 8. Documentation

Update user journey documentation only if needed.

If updated, note that Student Mode uses a stable header shell across views to preserve orientation and prevent layout jumps.

---

## Acceptance Criteria

- all three Student Mode views use the same outer header shell height on desktop
- Briefing remains the visual target for header height
- switching tabs does not create a noticeable vertical jump in the tab bar
- switching tabs does not create a noticeable vertical jump in the main content start position
- Briefing still shows avatar and scene image
- Query Lab still shows avatar only
- Evidence Board still shows scene image only
- Query Lab avatar remains prominent
- Evidence Board scene remains prominent
- images are composed inside the stable header shell
- explicit CSS constraints control header/image sizing
- existing WP-100 view-specific behavior remains intact
- tests cover view-specific header rendering hooks where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-104 for the Sequel City Web Detective project.

Objective:
Stabilize the Student Mode header height across all three student views so switching between Samuelâ€™s Briefing, Query Lab, and Evidence Board does not create jarring vertical layout shifts.

Problem:
Recent WPs changed the view-specific header imagery, but the header area now changes size by view. The Briefing page currently has the best header size and visual balance. Query Lab and Evidence Board should match that same outer header space. The view-specific content can differ, but the outer header shell height should remain stable.

Guiding principle:
Same header space. Different view-specific content. No vertical jump.

Important:

- Preserve WP-100 view-specific content behavior:
  - Briefing shows Samuel avatar and scene image
  - Query Lab shows Samuel avatar only
  - Evidence Board shows scene image only
- Preserve the current Briefing header height as the target desktop height
- Keep images prominent
- Keep changes visual and surgical
- No gameplay logic changes
- No backend changes
- No SQL execution changes
- No runtime AI behavior

Before editing:

1. Review StudentMentorHeader.tsx.
2. Review App.tsx active view wiring.
3. Review styles.css header classes from WP-100 through WP-103.
4. Review existing App tests for view-specific header behavior.
5. Inspect current header class names and data attributes.

Implement:

1. Stable outer header shell:

   - all three student views use the same desktop outer header height
   - use the current Briefing header height as the target
   - do not let Query Lab collapse shorter
   - do not let Evidence Board collapse shorter
2. Preserve view-specific content:

   - Briefing shows avatar and scene
   - Query Lab shows avatar only
   - Evidence Board shows scene only
3. Stable internal layout:

   - use stable left/right regions or equivalent structure
   - hidden view-specific content should not collapse the outer shell height
   - any reserved/empty space should feel intentional, not broken
4. Stable tab position:

   - tab bar should remain at the same vertical position when switching views
   - main content should begin at a consistent vertical position
5. Image composition:

   - images fit inside the stable header shell
   - use explicit CSS constraints
   - use object-fit and object-position intentionally
   - keep Samuel prominent in Query Lab
   - keep scene prominent in Evidence Board
6. Responsive behavior:

   - avoid overflow
   - preserve readable layout
   - minimize vertical jumps on smaller screens
7. Tests:

   - update or add tests for shared shell hooks and view-specific rendering
   - preserve tests for WP-100 behavior
8. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 view-specific behavior
- shrink images into tiny thumbnails
- let working views collapse into shorter headers
- create visibly broken empty header boxes

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-104 stable Student Mode header height implementation.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. All three Student Mode views use a stable outer header shell on desktop.
6. Briefing remains the visual target for header height.
7. Query Lab does not collapse to a shorter header than Briefing.
8. Evidence Board does not collapse to a shorter header than Briefing.
9. Tab bar position remains stable across student views.
10. Main content start position remains stable across student views.
11. Briefing still shows both Samuel avatar and scene image.
12. Query Lab still shows Samuel avatar only.
13. Evidence Board still shows scene image only.
14. Query Lab avatar remains prominent.
15. Evidence Board scene remains prominent.
16. Image containers have explicit sizing constraints.
17. Images use intentional object-fit and object-position behavior.
18. Responsive behavior remains acceptable.
19. WP-100 guidance hierarchy behavior remains intact.
20. Tests were updated or added where practical.
21. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader stable shell behavior
- shared header shell CSS hooks
- active view data attributes/classes
- Query Lab avatar-only rendering
- Evidence Board scene-only rendering
- Briefing full rendering
- tab bar vertical stability
- header CSS constraints
- responsive implications
- preservation of WP-100 behavior
- test coverage

Flag:

- Query Lab header shorter than Briefing
- Evidence Board header shorter than Briefing
- tab bar moving vertically between student views
- main content jumping vertically between views
- scene image visible in Query Lab
- Samuel avatar visible in Evidence Board
- minimized image treatment
- missing sizing constraints
- awkward empty header boxes
- image overflow
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-104 implementation complete. Summary of changes:

**`StudentMentorHeader.tsx`** ΓÇö added `data-stable-shell="student-case-header"` data attribute on the header `<section>` as a stable testable hook shared across all three views. No structural rendering changes; WP-100 view-specific behavior (avatar/scene visibility) is preserved as-is.

**`styles.css`** (desktop `@media (min-width: 768px)` block) ΓÇö equalized the inner-region height range across all three views so the outer shell matches the Briefing height:
- Query Lab (workbench) inner regions: 188-212px ΓåÆ **240-288px** (matches Briefing)
- Evidence Board (case-board) inner regions: removed `height: clamp(220px,24vw,256px)`, set `min-height: 240px; max-height: 288px` on content/strip/visual/frame; frame fills 100% of the row
- Query Lab Samuel avatar: 148-170px ΓåÆ **168-200px** so Samuel stays prominent at the now-taller header

**`App.test.tsx`** ΓÇö added a test that asserts the shared `data-stable-shell` hook is present (and `data-active-view` correct) across Briefing, Query Lab, and Evidence Board. The existing WP-100 view-specific tests are untouched.

**Verification**:
- All 108 tests across 12 files pass (16 in `App.test.tsx`, including the new stable-shell test)
- `tsc --noEmit` clean
- No backend/db/api/SQL/AI files touched; only frontend + a documented WP markdown (added by the WP step, not the implementation)

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-104-stabilize-student-header-height-across-views.md

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
- docs/01-work-packages/wp-104-stabilize-student-header-height-across-views.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

Audit WP-104 stable Student Mode header height implementation.

### 1. File Modification Analysis
- **Approved Files Only:** Verified. Only `apps/web/src/components/student/StudentMentorHeader.tsx`, `apps/web/src/styles.css`, `apps/web/src/App.test.tsx`, and `docs/01-work-packages/WP-104-stabilize-student-header-height-across-views.md` were modified.
- **No Backend/Database Changes:** Verified. `apps/api/` and `database/` directories remain untouched.
- **No SQL/Gameplay Changes:** Verified. No logic changes to query execution or gameplay progression.

### 2. Header Stability Verification
- **Stable Shell (Desktop):** Verified. `styles.css` now equalizes heights for all three student views using `min-height: 240px` and `max-height: 288px` on the inner regions (`student-case-header__content`, `student-mentor-strip--embedded`, `noir-scene-frame`).
- **Target Height:** Verified. The heights match the established Briefing visual target.
- **No Collapsing:** Verified. Query Lab and Evidence Board headers maintain the 240-288px range even when specific elements (like scene image or avatar) are hidden.
- **Tab/Content Position:** Verified. Since the header shell height is fixed, the tab bar and following main content start at consistent vertical positions across all three views.

### 3. View-Specific Rendering
- **Briefing:** Shows both Samuel avatar and scene image (verified in code and tests).
- **Query Lab:** Shows Samuel avatar only (verified in code and tests). Uses a single-column layout (`grid-template-columns: minmax(0, 1fr)`) to prevent empty space.
- **Evidence Board:** Shows scene image only (verified in code and tests). The mentor region contains guidance text without the avatar, maintaining balance next to the scene visual.
- **Image Sizing:** Samuel's avatar in Query Lab is kept prominent (`clamp(168px, 16vw, 200px)`), and the Evidence Board scene fills the stable height.

### 4. Technical Implementation
- **CSS Constraints:** Verified use of explicit `min-height`, `max-height`, `aspect-ratio: auto`, and `grid` adjustments to stabilize the layout.
- **Data Hooks:** Verified addition of `data-stable-shell="student-case-header"` as a shared hook for cross-view targeting and testing.
- **Responsive Behavior:** The stable height is correctly scoped to desktop media queries (`min-width: 768px`), ensuring mobile flexibility while solving the jarring shift on desktop.
- **WP-100 Preservation:** Guidance hierarchy and view-specific content rules remain intact.

### 5. Test Coverage
- **New Tests:** Added test case in `App.test.tsx` that asserts the presence of the `data-stable-shell` hook across all three views.
- **Existing Tests:** Updated to reflect more descriptive variant names (`workbench-mentor-hero`, `case-board-scene-hero`) while preserving assertions for view-specific element visibility.

### Audit Result: PASS

All acceptance criteria are met. The implementation successfully eliminates vertical layout shifts between student views while preserving the intentional visual identity and content rules of each view.

## Final Decision

Approved. All three Student Mode views now share a stable outer header shell of 240–288px on desktop. Query Lab and Evidence Board inner regions (`student-case-header__content`, `student-mentor-strip--embedded`, `noir-scene-frame`) equalized to Briefing height so the tab bar and main content start at a consistent vertical position when switching views. `data-stable-shell="student-case-header"` added as a shared testable hook. Query Lab Samuel avatar grown to `clamp(168px, 16vw, 200px)` to remain prominent at the taller height. WP-100 view-specific content rules and guidance hierarchy unchanged. New stable-shell test added to `App.test.tsx`. Scope check PASS. Gemini audit: PASS with all 21 checklist items verified, no flags.


