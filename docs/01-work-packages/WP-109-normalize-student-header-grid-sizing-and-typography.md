# WP-109: normalize-student-header-grid-sizing-and-typography

## Objective

Normalize Student Mode header grid sizing and typography so Samuelâ€™s Briefing, Query Lab, and Evidence Board feel like one stable interface with consistent visual anchors.

WP-108 successfully moved the header in the right direction by establishing a shared grid. The remaining issues are precision polish:

- avatar imagery does not fully consume the available visual region
- Query Lab header height is slightly different from the other views
- text and label sizes are inconsistent across views
- small labels use inconsistent scale and treatment
- badge placement and sizing need normalization

The guiding principle is:

Same grid. Same typography scale. Different content.

---

## Scope

Refine Student Mode header grid sizing, image sizing, and typography scale.

This WP may modify:

- StudentMentorHeader markup if needed
- header-specific CSS
- shared typography classes
- header visual region sizing
- header badge placement and styling
- tests for stable header hooks/classes
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
- docs/01-work-packages/WP-109-normalize-student-header-grid-sizing-and-typography.md

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

- Preserve WP-108 shared header grid direction
- Preserve stable visual anchors across all Student Mode views
- Preserve prominent imagery
- Preserve noir visual identity
- Preserve readability and accessibility
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes focused on layout and typography normalization

UX constraints:

- Briefing, Query Lab, and Evidence Board should share the same header grid structure
- Query Lab header shell should match the other views in height
- Avatar should fill the visual region on Briefing and Query Lab
- Evidence Board scene should fill the visual region consistently
- Heading sizes should be consistent across views
- Body guidance text sizes should be consistent across views
- Small labels should use a consistent typography style
- Badge placement and sizing should be consistent
- Avoid further design exploration

---

## Required Behavior

### 1. Normalize Header Shell Height

Ensure the Student Mode header shell has the same height across:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

The Query Lab header should no longer appear slightly shorter or differently sized than the other views.

The tab bar and content start position should remain stable across view switching.

---

### 2. Normalize Header Grid Columns

Ensure the shared header grid uses consistent column sizing across all three views.

The grid should preserve stable regions for:

- left visual/scene-detail region
- center guidance region
- right scene/atmosphere region

Do not allow column widths to shift noticeably between views.

---

### 3. Make Avatar Fill Available Visual Region

Samuelâ€™s avatar should consume the available visual region on:

- Samuelâ€™s Briefing
- Query Lab

The avatar should:

- fill the visual card more completely
- remain cropped/composed intentionally
- avoid looking like a small thumbnail
- avoid stretching
- preserve object-fit behavior

The Query Lab avatar should feel as intentionally composed as the Briefing avatar.

---

### 4. Normalize Scene Image Sizing

Scene imagery should fill its visual region consistently.

Evidence Board and Briefing scene image cards should feel like part of the same header system.

The scene image should:

- fill the card
- avoid strip treatment
- avoid underuse of available space
- preserve object-fit and object-position

---

### 5. Normalize Header Typography Scale

Create or apply a consistent header typography scale.

Headings should use one consistent size and treatment across:

- `Meet Samuel Tupleton`
- `Samuel's Guidance`
- `Samuel's Evidence Review`

Body guidance text should use one consistent size and line-height across views.

Small labels should use one consistent style across labels such as:

- `CASE STATUS`
- `SCENE DETAIL`
- `CASE ATMOSPHERE`

Do not let labels appear smaller/larger unpredictably between views.

---

### 6. Normalize Badge Placement And Sizing

Badges such as:

- Samuelâ€™s Trust
- Insight Marks

should appear in a consistent position and size across views.

They should not jump or appear differently scaled depending on the active view.

---

### 7. Preserve View-Specific Content

Preserve current content mapping from WP-108:

- Briefing:

  - avatar in the visual region
  - `Meet Samuel Tupleton`
  - scene image region
- Query Lab:

  - avatar in the visual region
  - `Samuel's Guidance`
  - atmosphere/status region
- Evidence Board:

  - scene detail or equivalent visual region
  - `Samuel's Evidence Review`
  - scene image region

Do not reintroduce removed labels such as:

- `Samuel's nudge` in Query Lab
- `Samuel's advice` on Evidence Board
- Samuel name label on Query Lab avatar

---

### 8. Responsive Behavior

Preserve responsive behavior.

On narrower screens:

- grid may stack consistently
- imagery should remain composed
- text should remain readable
- header should avoid overflow
- view-to-view jumps should remain minimized

---

### 9. Tests

Update or add tests for:

- shared header grid hooks/classes remain present
- all views render the expected heading
- Query Lab still does not render scene image if that rule remains
- Evidence Board still does not render Samuel avatar if that rule remains
- badge region remains present
- removed labels remain absent

CSS exact sizes are primarily visual-review items, but class hooks and content rules should be testable.

---

### 10. Documentation

Update user journey documentation only if needed.

If updated, note that the Student Mode header uses a normalized grid and typography scale to preserve orientation across views.

---

## Acceptance Criteria

- Query Lab header shell height visually matches Briefing and Evidence Board
- header grid columns are consistent across views
- Samuel avatar fills the visual region on Briefing and Query Lab
- avatar no longer appears thumbnail-like in Query Lab
- scene imagery fills the visual region consistently
- headings use consistent size and treatment across views
- body guidance text uses consistent size and line-height across views
- small labels use consistent style across views
- badges use consistent placement and sizing across views
- tab bar and content start position remain stable
- WP-108 shared-grid direction remains intact
- view-specific content mapping remains intact
- removed redundant labels do not return
- accessibility/readability is preserved
- tests updated where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-109 for the Sequel City Web Detective project.

Objective:
Normalize Student Mode header grid sizing and typography so Samuelâ€™s Briefing, Query Lab, and Evidence Board feel like one stable interface with consistent visual anchors.

Problem:
WP-108 established the correct shared-grid direction. The remaining issues are precision polish. The avatar does not fully consume the available visual region. Query Lab header height is still slightly different. Text and label sizes are inconsistent. Badge placement and sizing need normalization.

Guiding principle:
Same grid. Same typography scale. Different content.

Important:

- Preserve WP-108 shared header grid direction.
- Preserve stable visual anchors across all Student Mode views.
- Preserve prominent imagery.
- Preserve noir visual identity.
- Do not perform new design exploration.
- Keep this focused on sizing and typography normalization.
- No gameplay logic changes.
- No backend changes.
- No SQL execution changes.
- No runtime AI behavior.

Before editing:

1. Review `apps/web/src/components/student/StudentMentorHeader.tsx`.
2. Review `apps/web/src/App.tsx` active student view wiring.
3. Review `apps/web/src/styles.css` header classes from WP-100 through WP-108.
4. Review existing `App.test.tsx` tests for header behavior.
5. Identify CSS rules that still vary header height, column widths, heading size, body text size, label style, image sizing, or badge placement by view.

Implement:

1. Normalize header shell height:

   - all three Student Mode views should use the same header shell height on desktop.
   - Query Lab must not be shorter or taller than Briefing and Evidence Board.
   - tab bar and main content should remain vertically stable across view switching.
2. Normalize grid columns:

   - use consistent column sizing across Briefing, Query Lab, and Evidence Board.
   - preserve left visual region, center guidance region, and right scene/atmosphere region.
   - do not allow column widths to shift noticeably by view.
3. Make Samuel avatar fill the visual region:

   - Briefing avatar and Query Lab avatar should fill their visual card more completely.
   - Query Lab avatar must not look like a small thumbnail.
   - use object-fit and object-position intentionally.
   - avoid stretching.
4. Normalize scene image sizing:

   - Briefing and Evidence Board scene image cards should fill their visual region consistently.
   - avoid strip treatment.
   - avoid underusing available image space.
   - preserve object-fit and object-position.
5. Normalize typography:

   - headings across the three views should use one consistent size/treatment:
     - `Meet Samuel Tupleton`
     - `Samuel's Guidance`
     - `Samuel's Evidence Review`
   - guidance body text across views should use one consistent size/line-height.
   - small labels across views should use one consistent style:
     - `CASE STATUS`
     - `SCENE DETAIL`
     - `CASE ATMOSPHERE`
6. Normalize badges:

   - Samuel Trust and Insight Marks badges should appear in a consistent region.
   - badges should use consistent size and spacing across views.
7. Preserve current content mapping:

   - Briefing renders avatar, `Meet Samuel Tupleton`, and scene image.
   - Query Lab renders avatar and `Samuel's Guidance`.
   - Evidence Board renders `Samuel's Evidence Review` and scene image.
   - preserve the right-region atmosphere/status content if currently used.
   - do not reintroduce `Samuel's nudge`, `Samuel's advice`, or Samuel image name label in Query Lab.
8. Responsive behavior:

   - preserve responsive layout.
   - avoid overflow.
   - keep view-to-view jumps minimized on smaller screens.
9. Tests:

   - update or add tests for shared grid hooks/classes and expected headings.
   - verify removed labels remain absent.
   - verify view-specific image presence/absence rules remain intact.
   - preserve existing gameplay tests.
10. Documentation:

- update `docs/10-user-journey` only if needed.

Do not:

- change student progression logic.
- change query execution logic.
- modify backend APIs.
- introduce runtime AI.
- introduce new gameplay systems.
- create another major header redesign.
- optimize each view with a separate layout.
- shrink images into thumbnails.
- reintroduce header height jumps.
- reintroduce `Samuel's nudge` in Query Lab.
- reintroduce `Samuel's advice` on Evidence Board.
- reintroduce Samuel name label on Query Lab avatar.

Preserve:

- frontend/backend boundaries.
- deterministic gameplay behavior.
- mentor-guided noir tone.
- simplified Student Mode structure.
- accessibility and readability.
- existing required/secondary guidance hierarchy.

Keep the implementation precise, visual, consistent, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-109 Student Mode header grid sizing and typography normalization.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab header shell height visually matches Briefing and Evidence Board.
6. Header grid columns are consistent across Student Mode views.
7. Samuel avatar fills the visual region on Briefing and Query Lab.
8. Query Lab avatar no longer appears thumbnail-like.
9. Scene imagery fills the visual region consistently.
10. Evidence Board scene does not appear as a strip.
11. Header headings use consistent size and treatment across views.
12. Guidance body text uses consistent size and line-height across views.
13. Small labels use consistent style across views.
14. Badge placement and sizing are consistent across views.
15. Tab bar and content start position remain stable.
16. WP-108 shared-grid direction remains intact.
17. View-specific content mapping remains intact.
18. Removed redundant labels did not return.
19. Accessibility and readability are preserved.
20. Tests were updated or added where practical.
21. No gameplay logic was changed.

Specifically validate:

- `StudentMentorHeader` shared-grid structure
- header shell height consistency
- grid column consistency
- avatar visual-region fill
- scene visual-region fill
- heading typography scale
- body guidance typography scale
- small label typography scale
- badge region consistency
- view-specific content mapping
- responsive implications
- test coverage

Flag:

- Query Lab header still shorter or taller than other views
- avatar still thumbnail-like in Query Lab
- scene image still strip-like on Evidence Board
- inconsistent heading sizes
- inconsistent body text sizes
- inconsistent small label styles
- inconsistent badge placement
- reintroduced `Samuel's nudge`
- reintroduced `Samuel's advice`
- reintroduced Samuel image name label in Query Lab
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-109 is implemented. Summary of what changed:

**`apps/web/src/styles.css`**
- Unified three small-label kicker classes (`__kicker`, `__detail-card-kicker`, `__atmosphere-kicker`) into a single shared declaration block so `CASE STATUS`, `SCENE DETAIL`, and `CASE ATMOSPHERE` use one scale/treatment.
- Changed `.student-case-header__region--visual` from `center`/`center` to `stretch`/`stretch` so the avatar frame fills the region the same way the detail card and scene frame already do.
- Replaced the small square-clamped `.samuel-avatar` (148-196px box) with a full-bleed card that fills the visual region: `width: 100%; height: 100%; border-radius: 14px` to match the scene/detail card system. Kept the noir gradient, border, and emotional-state shadow variants. Tightened `object-position` to keep Samuel's face anchored.
- Removed the desktop `samuel-avatar` size clamp override.
- Anchored `.student-case-header__rewards` with `margin-top: auto` so Trust and Insight Marks badges land in the same vertical slot of the guidance region regardless of heading/message length.
- Mobile: replaced the small-square avatar override with a width-100% avatar capped at `192-248px` so the stacked header still gets a proportional avatar.

**`apps/web/src/App.test.tsx`**
- Added `renders normalized small labels with shared kicker hooks across views (WP-109)`: asserts each view exposes its expected kicker (`Case Status`, `Scene Detail`, `Case Atmosphere`).
- Added `anchors avatar and scene visuals to fill their region (WP-109)`: asserts the avatar frame is present in Briefing/Query Lab visual regions, the detail-card is present in Evidence Board's visual region, the scene frame is present in Briefing/Evidence Board, and the Query Lab avatar still has no name label.

**Verification**
- `npm test --workspace apps/web` ΓåÆ 12 files / 115 tests pass.
- `npm run build --workspace apps/web` ΓåÆ tsc + vite clean.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-109-normalize-student-header-grid-sizing-and-typography.md

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
- docs/01-work-packages/wp-109-normalize-student-header-grid-sizing-and-typography.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

I have completed the audit of **WP-109: Normalize Student Mode header grid sizing and typography**. 

The audit confirms that the implementation successfully achieves the objective of creating a stable, consistent interface across SamuelΓÇÖs Briefing, Query Lab, and Evidence Board views.

### Audit Summary

1.  **File Modification Scope:** Verified that only approved frontend (`styles.css`, `App.test.tsx`) and documentation files were modified. No backend, database, or gameplay logic was affected.
2.  **Header Shell & Grid Stability:** 
    *   The `student-case-header__grid` now uses a unified `grid-template-columns` definition on desktop, ensuring visual anchors (Visual, Guidance, Scene) remain stationary during view switching.
    *   Header height is stabilized across all views using consistent `min-height` (240px) and `max-height` (296px) constraints on the grid regions.
3.  **Visual Region Normalization:**
    *   **Avatar:** SamuelΓÇÖs avatar now fills the available visual region completely (`width: 100%; height: 100%`) instead of being clamped to a small thumbnail. 
    *   **Scene Imagery:** The scene frame and imagery now fill their regions consistently using `stretch` alignment and `object-fit: cover`.
    *   **Evidence Board:** The "Scene Detail" card correctly fills the visual region, matching the footprint of the avatar in other views.
4.  **Typography Normalization:**
    *   **Labels:** Unified three separate kicker classes into a shared style for `CASE STATUS`, `SCENE DETAIL`, and `CASE ATMOSPHERE`.
    *   **Scale:** Headings and body guidance text use consistent `clamp`-based scales across all views.
5.  **Badge Consistency:** The Samuel Trust and Insight Marks badges are anchored to the bottom of the guidance region using `margin-top: auto`, ensuring they occupy the same vertical slot regardless of message length.
6.  **Redundant Label Suppression:** Verified that `Samuel's nudge`, `Samuel's advice`, and the Samuel name label in Query Lab remain suppressed.
7.  **Test Coverage:** Added two new tests in `App.test.tsx` (`renders normalized small labels...` and `anchors avatar and scene visuals...`) to verify kicker hooks, visual region anchoring, and the absence of redundant labels.

### Final Conclusion
The changes are surgical, visually precise, and strictly adhere to the "Same grid. Same typography scale. Different content." principle defined in the work package.

**Decision: PASS**

```json
{
  "wp": "WP-109",
  "status": "APPROVED",
  "audit_date": "2026-05-16",
  "verified_files": [
    "apps/web/src/styles.css",
    "apps/web/src/App.test.tsx",
    "docs/01-work-packages/WP-109-normalize-student-header-grid-sizing-and-typography.md"
  ]
}
```

## Final Decision

Approved. CSS-only change (`styles.css`) normalizing the WP-108 shared header grid. Unified three separate small-label kicker classes (`__kicker`, `__detail-card-kicker`, `__atmosphere-kicker`) into a single shared declaration so `CASE STATUS`, `SCENE DETAIL`, and `CASE ATMOSPHERE` all use the same scale and treatment. Changed `.student-case-header__region--visual` alignment to `stretch`/`stretch` so the avatar frame fills the region consistently with the scene and detail cards. Replaced the small-square-clamped `.samuel-avatar` with a full-bleed card (`width: 100%; height: 100%; border-radius: 14px`) matching the scene/detail card system; retained noir gradient, border, and emotional-state shadow variants; tightened `object-position` to anchor Samuel's face. Removed the conflicting desktop `samuel-avatar` size-clamp override. Anchored `.student-case-header__rewards` with `margin-top: auto` so Trust and Insight Marks badges land in the same vertical slot of the guidance region regardless of heading/message length. Mobile: replaced small-square avatar override with `width: 100%` capped at `192–248px`. `App.test.tsx` extended with two new tests: normalized small labels assert each view's expected kicker hook; avatar/scene anchoring asserts avatar frame present in Briefing/Query Lab visual regions, detail-card present in Evidence Board visual region, scene frame present in Briefing/Evidence Board, and no name label on Query Lab avatar. 115/115 tests passing, TypeScript clean. `StudentMentorHeader.tsx` and App wiring unchanged. Scope check PASS. Gemini audit PASS with all 21 checklist items verified, no flags.


