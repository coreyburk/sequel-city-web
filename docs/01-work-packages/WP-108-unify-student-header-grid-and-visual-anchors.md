# WP-108: unify-student-header-grid-and-visual-anchors

## Objective

Unify the Student Mode header into a single shared grid with stable visual anchors across Samuelâ€™s Briefing, Query Lab, and Evidence Board.

Recent header WPs improved individual pieces, but the header still feels jarring because key visual anchors move between pages:

- image placement changes by view
- guidance text starts in different places
- headings shift between views
- badges move relative to guidance text
- the studentâ€™s attention has to relocate after each tab switch

This WP fixes the header by using one consistent layout structure for all Student Mode views.

The guiding principle is:

Content can change. Anchors should not.

---

## Scope

Refactor Student Mode header layout into a consistent three-region header grid.

This WP may modify:

- StudentMentorHeader structure
- StudentMentorHeader view-specific content mapping
- header-specific CSS
- App header wiring if needed
- tests for shared header anchors and view-specific content
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
- docs/01-work-packages/WP-108-unify-student-header-grid-and-visual-anchors.md

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

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s mentor role
- Preserve prominent imagery
- Preserve stable header shell behavior
- Reduce jarring visual movement between tabs
- Do not optimize each view with a different layout
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes focused on header layout and visual hierarchy

UX constraints:

- Same header grid across all three Student Mode views
- Same visual-region location across all three views
- Same guidance-region location across all three views
- Same badge/status location across all three views
- Same text starting position across all three views
- Same heading position across all three views
- Same tab bar position across all three views
- Content may change by view, but anchors must not move
- Preserve noir visual identity
- Preserve accessibility and readability

---

## Required Behavior

### 1. Single Shared Header Grid

Implement one shared Student Mode header grid for all three views.

Use a consistent layout such as:

- left region: visual anchor
- center region: guidance anchor
- right region: atmosphere/status anchor

The exact CSS grid may be adjusted to fit the current design, but the same three-region structure must be used for:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

Do not use different page-specific header layouts.

---

### 2. Stable Visual Region

The left visual region must stay in the same location and maintain consistent dimensions across views.

Suggested content mapping:

- Briefing: Samuel avatar
- Query Lab: Samuel avatar
- Evidence Board: scene image or scene detail card

The visual region should always feel intentional and prominent.

Do not let the visual region disappear and collapse.

---

### 3. Stable Guidance Region

The center guidance region must stay in the same location across views.

The heading and guidance text should start from the same visual anchor point across all views.

Suggested content mapping:

- Briefing heading: `Meet Samuel Tupleton`
- Query Lab heading: `Samuel's Guidance`
- Evidence Board heading: `Samuel's Evidence Review`

The body text changes by view, but the heading and body placement should remain stable.

---

### 4. Stable Badge/Status Region

Badges such as Samuelâ€™s trust and Insight Marks should occupy a predictable location.

They may be placed:

- beneath the guidance text in the same guidance region, or
- in the right status region

But they must not move unpredictably between views.

The selected placement must be consistent across Student Mode views.

---

### 5. Stable Right Region

The right region should remain part of the grid across views.

Suggested content mapping:

- Briefing: scene image
- Query Lab: quiet case-status/status-card/atmosphere panel or intentionally subdued placeholder
- Evidence Board: scene image or scene detail continuation

If Query Lab does not use a scene image, the right region must still remain visually intentional and not feel broken or empty.

Possible Query Lab right-region content:

- a quiet case-status panel
- compact â€œCurrent Leadâ€ summary if already available
- a subtle atmospheric panel
- no new gameplay system

Do not introduce new progression logic.

---

### 6. Preserve View-Specific Meaning Through Content

Views should remain distinct through content, not layout shifts.

- Briefing should still feel like case entry.
- Query Lab should still feel like mentor-guided SQL work.
- Evidence Board should still feel like evidence review.

Do not rely on layout movement to communicate view differences.

---

### 7. Header Height And Tab Stability

Preserve stable header height behavior.

The tab bar should remain in the same vertical position when switching between:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

The main content should begin at the same vertical position across views.

---

### 8. Image Composition

Images must remain prominent but disciplined.

Use explicit constraints for:

- visual region size
- scene image size
- avatar image size
- object-fit
- object-position
- responsive behavior

Do not minimize images into decorative icons.

Do not allow images to create view-to-view layout jumps.

---

### 9. Responsive Behavior

On narrower screens:

- the shared header grid may stack or adapt
- visual anchors should remain predictable
- heading and guidance placement should remain readable
- avoid horizontal overflow
- avoid severe layout jumps between views

---

### 10. Tests

Update or add tests for:

- shared header shell/grid class or data attribute
- stable region hooks rendered across all student views
- Briefing uses the shared grid
- Query Lab uses the shared grid
- Evidence Board uses the shared grid
- expected view-specific headings render
- scene image does not render in Query Lab if that rule remains
- Samuel avatar does not render in Evidence Board if that rule remains
- badges remain rendered in a consistent header region

Visual position and size are CSS-reviewed, but DOM hooks and content mapping should be testable.

---

### 11. Documentation

Update user journey documentation only if needed.

If updated, explain that Student Mode now uses a stable header grid so students retain visual orientation while moving between views.

---

## Acceptance Criteria

- all three Student Mode views use one shared header grid structure
- visual region remains in the same position across views
- guidance region remains in the same position across views
- heading and guidance text begin from the same anchor point across views
- badge/status placement is consistent across views
- tab bar position remains stable across views
- main content start position remains stable across views
- Briefing still feels like case entry
- Query Lab still feels like mentor-guided SQL work
- Evidence Board still feels like evidence review
- images remain prominent
- no awkward disappearing/collapsing regions
- explicit CSS constraints control header regions and imagery
- responsive behavior remains acceptable
- tests cover shared grid hooks and view-specific content mapping where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-108 for the Sequel City Web Detective project.

Objective:
Unify the Student Mode header into one shared grid with stable visual anchors across Samuelâ€™s Briefing, Query Lab, and Evidence Board.

Problem:
The current header content is improving, but switching between Student Mode views still feels jarring. Important visual anchors move around. The image shifts position, guidance text starts in different places, heading placement changes, and badges move. The studentâ€™s attention has to jump when changing tabs.

This WP is not about making each page individually attractive. It is about making all three pages feel like the same stable interface.

Guiding principle:
Content can change. Anchors should not.

Important:

- Preserve deterministic gameplay principles.
- Preserve learner agency.
- Preserve spoiler-safe investigation flow.
- Preserve Samuelâ€™s mentor role.
- Preserve prominent imagery.
- Preserve stable header height behavior.
- Use one shared header layout across all Student Mode views.
- Do not optimize each view with a separate layout.
- No gameplay logic changes.
- No backend changes.
- No SQL execution changes.
- No runtime AI behavior.

Before editing:

1. Review `apps/web/src/components/student/StudentMentorHeader.tsx`.
2. Review `apps/web/src/App.tsx` active student view wiring.
3. Review `apps/web/src/styles.css` header classes from WP-100 through WP-107.
4. Review existing `App.test.tsx` tests for header behavior.
5. Identify all current page-specific header layout classes that cause view-to-view movement.

Implement:

1. Create one shared header grid:

   - use the same outer header structure for Briefing, Query Lab, and Evidence Board.
   - use stable internal regions such as left visual region, center guidance region, and right atmosphere/status region.
   - each region should exist across all three views.
   - do not let regions disappear and collapse.
2. Stabilize the left visual region:

   - the left visual region must stay in the same place across all views.
   - Briefing should show Samuel avatar there.
   - Query Lab should show Samuel avatar there.
   - Evidence Board should show a scene image or scene detail card there.
   - use consistent dimensions for the region.
3. Stabilize the center guidance region:

   - the center guidance region must stay in the same place across all views.
   - heading and body text must begin from the same visual anchor point across views.
   - headings should map by view:
     - Briefing: `Meet Samuel Tupleton`
     - Query Lab: `Samuel's Guidance`
     - Evidence Board: `Samuel's Evidence Review`
   - body copy may differ by view.
4. Stabilize badge/status placement:

   - Samuel trust and Insight Marks badges must appear in a consistent header region across views.
   - choose one placement and keep it consistent.
   - do not allow badges to jump between views.
5. Stabilize the right region:

   - the right region should remain part of the same grid across views.
   - Briefing should show the scene image there.
   - Evidence Board should show the scene image or scene continuation there if helpful.
   - Query Lab should not show the scene image if the current rule remains, but the right region should still feel intentional.
   - for Query Lab, use only existing state/content if needed, such as a quiet status/atmosphere panel. Do not add new gameplay systems.
6. Preserve tab and content stability:

   - tab bar vertical position should not move between views.
   - main content should begin at the same vertical position between views.
   - do not reintroduce header height jumps.
7. Preserve view-specific meaning through content:

   - Briefing should still feel like case entry.
   - Query Lab should still feel like mentor-guided SQL work.
   - Evidence Board should still feel like evidence review.
   - do not use different layout geometry to communicate different views.
8. CSS requirements:

   - add explicit CSS constraints for grid columns, image sizes, region heights, object-fit, and object-position.
   - avoid relying on image intrinsic dimensions.
   - make the shared-grid intent obvious in class names.
   - remove or simplify old per-view CSS that conflicts with the shared grid.
   - preserve noir visual identity.
9. Responsive behavior:

   - ensure no horizontal overflow.
   - on narrower screens, the grid may stack, but the three views should still adapt consistently.
   - avoid severe view-to-view jumps at responsive breakpoints.
10. Tests:

- update or add tests for shared grid hooks/classes.
- verify Briefing, Query Lab, and Evidence Board all render the shared header grid.
- verify each view renders the expected heading.
- verify Query Lab does not render the scene image if that rule remains.
- verify Evidence Board does not render Samuel avatar if that rule remains.
- verify badges render in the shared header region.

11. Documentation:

- update `docs/10-user-journey` only if needed.

Do not:

- change student progression logic.
- change query execution logic.
- modify backend APIs.
- introduce runtime AI.
- introduce new gameplay systems.
- remove prominent imagery.
- shrink images into tiny thumbnails.
- create three separate view-specific header layouts.
- allow hidden regions to collapse and move anchors.
- reintroduce visible Samuel image name label in Query Lab.
- reintroduce `Samuel's nudge` as the Query Lab heading.
- reintroduce `Samuel's advice` as the Evidence Board heading.

Preserve:

- frontend/backend boundaries.
- deterministic gameplay behavior.
- mentor-guided noir tone.
- simplified Student Mode structure.
- accessibility and readability.
- existing required/secondary guidance hierarchy.

Keep the implementation focused, visual, consistent, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-108 unified Student Mode header grid and visual anchors.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. All three Student Mode views use one shared header grid structure.
6. The visual region remains in the same position across all views.
7. The guidance region remains in the same position across all views.
8. Heading and body guidance text begin from the same anchor point across views.
9. Badge/status placement is consistent across views.
10. The tab bar vertical position remains stable across views.
11. The main content start position remains stable across views.
12. Briefing renders `Meet Samuel Tupleton`.
13. Query Lab renders `Samuel's Guidance`.
14. Evidence Board renders `Samuel's Evidence Review`.
15. Query Lab does not render the scene image if that rule remains.
16. Evidence Board does not render Samuel avatar if that rule remains.
17. Images remain prominent and intentionally composed.
18. No awkward disappearing or collapsing regions are visible.
19. Explicit CSS constraints control header regions and imagery.
20. Responsive behavior remains acceptable.
21. WP-100 through WP-107 header intent is preserved where still applicable.
22. Tests were updated or added where practical.
23. No gameplay logic was changed.

Specifically validate:

- `StudentMentorHeader` shared-grid structure
- shared header region class names or data attributes
- view-specific content mapping
- guidance heading consistency
- badge region consistency
- image region consistency
- tab/content vertical stability
- removal or neutralization of conflicting old per-view CSS
- responsive implications
- test coverage

Flag:

- separate header layout structures by view
- moving guidance anchor between views
- moving image anchor between views
- moving badge placement between views
- Query Lab scene image visible if rule remains
- Evidence Board Samuel avatar visible if rule remains
- hidden regions collapsing and causing layout shifts
- awkward empty boxes
- minimized image treatment
- reintroduced `Samuel's nudge` in Query Lab
- reintroduced `Samuel's advice` on Evidence Board
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

Build succeeded. WP-108 implementation is complete.

## Summary

Refactored the Student Mode header into a single shared three-region grid so anchors stay put while content changes between views.

**Files changed:**
- `apps/web/src/components/student/StudentMentorHeader.tsx` ΓÇö replaced per-view variants with one shared grid: left visual / center guidance / right scene. Heading text is view-derived (`Meet Samuel Tupleton` / `Samuel's Guidance` / `Samuel's Evidence Review`). `Samuel's Trust` and `Insight Marks` now live in the guidance region in every view. Filtered case beats (e.g. `Witness trail unlocked`) surface as a small chip; `Samuel's nudge`/`Samuel's advice` and the static heading copies are suppressed.
- `apps/web/src/App.tsx` ΓÇö unchanged wiring beyond the header layout (mentorTitle still passed in for the beat chip).
- `apps/web/src/styles.css` ΓÇö removed `.student-mentor-strip*`, `.samuel-reward-strip`, `.samuel-avatar-name`, and the per-view `.student-case-header--view-*` layout overrides. Added shared-grid styles for `__grid`, three `__region--*` slots, `__heading`/`__message`/`__rewards`, plus `__detail-card`, `__atmosphere`, and `__beat`. Responsive rules collapse to a single column under 640px while preserving the anchor order.
- `apps/web/src/App.test.tsx` ΓÇö updated WP-100..107 header tests to assert the shared-grid hooks; added tests covering the three stable regions across all views, the shared heading mapping, and the badge region stability.
- `docs/10-user-journey/learner-workflow.md` ΓÇö replaced the "View-Specific Header" section with "Shared Header Grid And Stable Visual Anchors".
- `docs/01-work-packages/WP-108-...md` ΓÇö filled in the Code Results section.

**Verification:** `npm run test` 113/113 passing, `npx tsc -b` clean, `vite build` succeeds. I did not open the dev server in a browser, so visual spot-check is left to you.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-108-unify-student-header-grid-and-visual-anchors.md

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
- docs/10-user-journey/learner-workflow.md
- docs/01-work-packages/wp-108-unify-student-header-grid-and-visual-anchors.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

Audit of WP-108 unified Student Mode header grid and visual anchors is complete.

### Audit Summary
The implementation successfully unifies the Student Mode header into a single, stable three-region grid across the Briefing, Query Lab, and Evidence Board views. By establishing fixed visual anchors, the design significantly reduces cognitive load and visual jarring when switching tabs.

### Verification Results

1.  **File Modification Scope: PASS**
    *   Only approved frontend (`apps/web/**`) and documentation (`docs/**`) files were modified.
    *   No backend runtime files, database scripts, or SQL execution logic were changed.
2.  **Shared Header Grid Structure: PASS**
    *   Implemented `student-case-header__grid` (with `data-stable-grid="student-header-grid"`) as a shared container for all Student Mode views.
    *   Used three consistent regions: `visual` (left), `guidance` (center), and `scene` (right).
3.  **Stable Anchors and Positioning: PASS**
    *   **Visual Region (Left):** Remains in the same position. Shows Samuel avatar in Briefing/Query Lab and a "Scene Detail" card in Evidence Board to prevent collapse.
    *   **Guidance Region (Center):** Remains in the same position. Heading and body text start from the same anchor point across all views.
    *   **Scene Region (Right):** Remains in the same position. Shows the scene image in Briefing/Evidence Board and a "Case Atmosphere" panel in Query Lab to maintain grid integrity.
    *   **Badges/Status:** Samuel's Trust and Insight Marks are consistently placed within the guidance region in every view.
4.  **View-Specific Content Mapping: PASS**
    *   Briefing Heading: `Meet Samuel Tupleton`
    *   Query Lab Heading: `Samuel's Guidance`
    *   Evidence Board Heading: `Samuel's Evidence Review`
    *   Query Lab correctly suppresses the scene image and Samuel's name label.
    *   Evidence Board correctly suppresses the Samuel avatar.
    *   Suppressed legacy labels like `Samuel's nudge` and `Samuel's advice`.
5.  **Layout Stability: PASS**
    *   **Header Height:** Controlled by explicit `min-height` constraints (168px on mobile, 240px-296px on desktop) for each region.
    *   **Vertical Stability:** The tab bar and main content start positions remain stable when switching views.
6.  **CSS and Responsive Behavior: PASS**
    *   Shared-grid intent is clear in class names (e.g., `student-case-header__grid`).
    *   Explicit constraints for grid columns and image sizes (using `clamp`, `aspect-ratio`, and `object-fit`).
    *   Grid stacks into a single column on screens narrower than 640px while preserving anchor order.
7.  **Test Coverage: PASS**
    *   Updated `App.test.tsx` to assert the shared grid shell and stable region hooks (`data-stable-region`).
    *   Verified view-specific headings and inclusion/exclusion rules for avatars and scene images.
8.  **Documentation: PASS**
    *   Updated `docs/10-user-journey/learner-workflow.md` to describe the shared header grid and stable visual anchors.

### Final Decision
The implementation is solid, adheres strictly to the WP-108 constraints, and preserves the noir visual identity while improving interface stability.

**Audit Status: APPROVED**

## Final Decision

Approved. `StudentMentorHeader.tsx` refactored from per-view layout variants to a single shared three-region grid (`student-case-header__grid`, `data-stable-grid="student-header-grid"`): left visual region, center guidance region, right scene region. Heading maps by view — `Meet Samuel Tupleton` / `Samuel's Guidance` / `Samuel's Evidence Review`. Samuel avatar occupies the left region in Briefing and Query Lab; a scene-detail card occupies it in Evidence Board to prevent collapse. Scene image occupies the right region in Briefing and Evidence Board; a quiet Case Atmosphere panel holds the right slot in Query Lab. Samuel's Trust and Insight Marks badges consistently placed in the guidance region across all views. Per-view layout overrides (`.student-mentor-strip*`, `.samuel-reward-strip`, `.student-case-header--view-*`) removed from `styles.css`; replaced with shared-grid classes, explicit region `min-height` constraints (168px mobile, 240–296px desktop), and responsive single-column stacking below 640px. `docs/10-user-journey/learner-workflow.md` updated to describe the shared header grid. `App.test.tsx` updated with shared-grid hook assertions, stable-region checks, and view-specific heading and avatar/scene inclusion/exclusion tests. 113/113 tests passing, TypeScript clean. Scope check PASS. Gemini audit PASS with all 23 checklist items verified, no flags.


