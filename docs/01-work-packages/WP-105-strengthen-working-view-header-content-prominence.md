# WP-105: strengthen-working-view-header-content-prominence

## Objective

Strengthen the content prominence inside the stable Student Mode header shell created by WP-104.

WP-104 fixed the jarring header-height changes across student views. The next refinement is to ensure the content inside that stable header space earns its space, especially in the working views.

The Query Lab header should make Samuelâ€™s guidance and the studentâ€™s next step clear and prominent. The Evidence Board header should make the evidence-review context readable and intentional while keeping the scene image prominent.

The guiding principle is:

The header space is now stable. Make the content inside it earn that space.

---

## Scope

Refine Student Mode working-view header content hierarchy.

This WP may modify:

- StudentMentorHeader content styling
- view-specific header text sizing
- Samuel guidance prominence
- working-view next-step presentation
- Evidence Board header text presentation
- header-specific CSS
- tests for view-specific header content hooks/classes
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
- docs/01-work-packages/WP-105-strengthen-working-view-header-content-prominence.md

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

- Preserve WP-104 stable header shell height
- Preserve WP-100 view-specific content behavior
- Preserve prominent imagery across all student views
- Preserve noir visual identity
- Preserve readability and accessibility
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual

UX constraints:

- Query Lab should clearly communicate Samuelâ€™s guidance and the studentâ€™s next step
- Query Lab Samuel avatar should remain visually prominent
- Evidence Board header text should be larger and easier to read
- Evidence Board scene image should remain prominent
- Briefing should remain generally unchanged unless minor consistency tuning is needed
- Working-view header content should not feel sparse or underused
- Do not create excessive instructional noise

---

## Required Behavior

### 1. Preserve Stable Header Shell

Do not undo WP-104.

The outer Student Mode header shell must remain stable across:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

The tab bar and main content start position should remain stable across view switching.

---

### 2. Query Lab Header Content Prominence

Improve Query Lab header content hierarchy.

Query Lab should make these items more prominent:

- Samuelâ€™s current guidance
- the studentâ€™s immediate next step
- Samuelâ€™s mentor presence

Possible refinements:

- larger heading
- larger guidance text
- stronger line length and spacing
- clearer next-step phrase
- improved text alignment beside Samuel avatar
- stronger contrast without broad redesign

The Query Lab header should feel like Samuel is actively guiding the student before they work in the SQL editor.

---

### 3. Query Lab Avatar Prominence

Maintain or improve Samuel avatar prominence in Query Lab.

The avatar should:

- feel like a mentor presence
- remain balanced with the text
- not shrink back into icon-like treatment
- not dominate the SQL workspace

---

### 4. Evidence Board Header Text Prominence

Improve Evidence Board header text readability and purpose.

The Evidence Board header should:

- use larger and more readable text
- clearly frame the review mode
- support independent evidence review
- not duplicate Case Progress content too heavily
- complement the prominent scene image

The header should help students understand they are reviewing and organizing evidence, not receiving a new instruction panel.

---

### 5. Preserve Prominent Imagery

All views should continue to use prominent, intentional imagery:

- Briefing: Samuel avatar and scene image
- Query Lab: Samuel avatar
- Evidence Board: scene image

Do not minimize images.

---

### 6. Accessibility And Readability

Preserve or improve:

- color contrast
- semantic headings
- readable spacing
- responsive behavior
- non-color-only distinctions where applicable

Do not rely on subtle color differences alone.

---

### 7. Responsive Behavior

On narrower screens:

- header content should remain readable
- Samuel avatar should remain visually meaningful
- scene image should remain composed
- text should not overflow
- stable header shell behavior should remain acceptable

---

### 8. Tests

Update or add tests for:

- Query Lab header content hooks/classes
- Evidence Board header content hooks/classes
- active view data attributes remain available
- WP-104 stable-shell rendering hooks remain intact
- WP-100 view-specific image rules remain intact

Visual font sizing is primarily CSS-reviewed, but testable hooks and rendered text should be covered where practical.

---

### 9. Documentation

Update user journey documentation only if needed.

If updated, note that working-view headers use prominent content hierarchy to orient students while preserving stable layout.

---

## Acceptance Criteria

- WP-104 stable header shell behavior remains intact
- Query Lab guidance text is more prominent and readable
- Query Lab next-step framing is clearer
- Query Lab Samuel avatar remains prominent
- Evidence Board header text is larger and more readable
- Evidence Board scene image remains prominent
- Briefing remains generally unchanged and balanced
- working-view header content no longer feels sparse or underused
- accessibility/readability is preserved
- tests cover relevant view-specific header hooks where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-105 for the Sequel City Web Detective project.

Objective:
Strengthen the content prominence inside the stable Student Mode header shell created by WP-104.

Problem:
WP-104 fixed the jarring view-to-view header height changes. Now the working-view header content needs to better use that stable space. Query Lab should make Samuelâ€™s guidance and the studentâ€™s next step clearer and more prominent. Evidence Board header text should be larger and easier to read while preserving the prominent scene image.

Guiding principle:
The header space is now stable. Make the content inside it earn that space.

Important:

- Preserve WP-104 stable header shell behavior
- Preserve WP-100 view-specific content behavior:
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
3. Review styles.css header classes from WP-100 through WP-104.
4. Review existing App tests for view-specific header behavior.
5. Inspect current header text, heading, badge, and image class names.

Implement:

1. Preserve stable header shell:

   - do not change outer header shell height behavior from WP-104
   - do not reintroduce view-to-view vertical jumps
2. Strengthen Query Lab header content:

   - increase prominence of Samuelâ€™s guidance
   - make the studentâ€™s next step clearer
   - improve heading/text sizing and spacing
   - keep guidance concise and not noisy
3. Preserve Query Lab avatar prominence:

   - Samuel should feel present and mentor-like
   - avatar should remain balanced with text
4. Strengthen Evidence Board header text:

   - increase readability and prominence
   - frame evidence review clearly
   - avoid duplicating Case Progress too heavily
   - keep scene image prominent
5. Preserve Briefing:

   - leave Briefing generally unchanged unless minor consistency tuning is needed
6. CSS:

   - use view-specific classes or data attributes where appropriate
   - improve typography, spacing, and text contrast
   - preserve responsive behavior
7. Tests:

   - update or add tests for view-specific header hooks/classes where practical
   - preserve tests for WP-100 and WP-104 behavior
8. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 header behavior
- undo WP-104 stable header shell
- shrink images into tiny thumbnails
- create excessive repeated instruction text

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, responsive, and student-centered.

---

## Gemini Audit Prompt

Audit WP-105 working-view header content prominence improvements.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. WP-104 stable header shell behavior remains intact.
6. WP-100 view-specific image behavior remains intact.
7. Briefing still shows Samuel avatar and scene image.
8. Query Lab still shows Samuel avatar only.
9. Evidence Board still shows scene image only.
10. Query Lab guidance text is more prominent and readable.
11. Query Lab next-step framing is clearer.
12. Query Lab Samuel avatar remains prominent.
13. Evidence Board header text is larger and more readable.
14. Evidence Board scene image remains prominent.
15. Briefing remains generally unchanged and balanced.
16. Accessibility and readability are preserved.
17. Tests were updated or added where practical.
18. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader content hierarchy
- Query Lab header typography and spacing
- Evidence Board header typography and spacing
- stable shell preservation
- view-specific image preservation
- responsive implications
- preservation of WP-100 guidance hierarchy
- preservation of WP-104 layout stability
- test coverage

Flag:

- reintroduced header height jumps
- Query Lab guidance still visually weak
- Evidence Board header text still too small
- Samuel avatar minimized in Query Lab
- Evidence Board scene minimized
- excessive instruction duplication
- broad visual redesign
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

Typecheck passed (silent success). Tests pass. Implementation summary:

**StudentMentorHeader.tsx** ΓÇö added view-specific kicker (`Samuel's Guidance` for workbench, `Evidence Review` for case-board) at the top of the mentor copy block, plus stable hook classes `student-mentor-strip__title` / `__message` for CSS targeting. Briefing intentionally has no kicker.

**styles.css** ΓÇö new `.student-mentor-strip__role-kicker` style (small uppercase noir-gold), plus view-scoped typography:
- Workbench: title `clamp(1.34ΓÇô1.92rem)`, message `clamp(1.02ΓÇô1.2rem)` w/ `max-width: 60ch` and looser line-height/`gap: 8px`.
- Case-board: bumps for `__summary h2`, title `clamp(1.26ΓÇô1.72rem)`, message `clamp(1.02ΓÇô1.18rem)` w/ `max-width: 56ch`.
All clamp-based to preserve responsive behavior; no min-height/grid changes, so WP-104 stable shell is untouched.

**App.test.tsx** ΓÇö extended existing variant tests:
- Briefing: asserts no `student-mentor-strip__role-kicker` is present.
- Query Lab: asserts kicker present with `data-mentor-strip-role="workbench"` and text `Samuel's Guidance`, plus presence of title/message hooks.
- Evidence Board: same pattern with `data-mentor-strip-role="case-board"` and text `Evidence Review`.

All 108 tests pass; TypeScript clean. Docs left unchanged (no prior WP references in `docs/10-user-journey`, and WP-105 says "update only if needed").

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-105-strengthen-working-view-header-content-prominence.md

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
- docs/01-work-packages/wp-105-strengthen-working-view-header-content-prominence.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

The audit of **WP-105: Strengthen Working-View Header Content Prominence** is complete. The implementation successfully improves the visual hierarchy and readability of the Student Mode headers in working views while preserving the layout stability and core logic established in previous work packages.

### Audit Summary

1.  **Scope Verification**: 
    - Only approved frontend files (`StudentMentorHeader.tsx`, `styles.css`, `App.test.tsx`) and the WP documentation were modified.
    - No changes were made to the backend, database, or gameplay logic.
2.  **Visual Hierarchy & Prominence**:
    - **Query Lab (Workbench)**: Added a "Samuel's Guidance" kicker. Increased font sizes for the title and message using responsive `clamp` values. Improved line height and set a maximum line length for better readability.
    - **Evidence Board (Case Board)**: Added an "Evidence Review" kicker. Increased font sizes and optimized spacing to frame the review context more effectively.
    - **Briefing**: Remained balanced and consistent without the new kickers, as required.
3.  **Preservation of Stability (WP-100/104)**:
    - The **stable header shell** (`data-stable-shell`) and height behavior from WP-104 remain intact. No vertical layout jumps were reintroduced.
    - The **view-specific image rules** from WP-100 are strictly preserved:
        - **Briefing**: Shows both Samuel avatar and scene visual.
        - **Query Lab**: Shows Samuel avatar only.
        - **Evidence Board**: Shows scene visual only.
    - Samuel avatar and scene images remain prominent and visually consistent with the noir identity.
4.  **Technical Quality**:
    - **Accessibility**: Improved typography and spacing enhance readability across devices.
    - **Test Coverage**: `App.test.tsx` was updated to specifically assert the presence of new view-scoped kickers and hooks, ensuring the changes are durable.
    - **Type Safety**: The implementation is clean and passes type checks.

### Conclusion
The implementation earns the space provided by the stable header shell, providing clearer orientation and guidance for students in the working views. All acceptance criteria have been met.

**Audit Status: PASS**

## Final Decision

Approved. `StudentMentorHeader` now renders a view-specific role kicker — "Samuel's Guidance" in Query Lab and "Evidence Review" in Evidence Board; Briefing has none. Stable hook classes `student-mentor-strip__title` and `__message` added for CSS targeting. View-scoped typography lifted via `clamp` for title and message in both working views with `max-width` and adjusted `line-height` for readability. WP-104 stable shell heights and WP-100 view-specific image rules are untouched. `App.test.tsx` extended to assert kicker presence and `data-mentor-strip-role` attribute per view. Scope check PASS. Gemini audit: PASS with all 18 checklist items verified, no flags.


