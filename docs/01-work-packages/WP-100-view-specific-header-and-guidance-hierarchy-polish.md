# WP-100: view-specific-header-and-guidance-hierarchy-polish

## Objective

Polish the Student Mode header and guidance hierarchy so students can more quickly identify what matters in each view.

This WP reduces visual noise and wasted vertical space while improving the distinction between:

- required next actions
- optional check-ins
- ambient mentor guidance
- view-specific atmosphere

The goal is to strengthen the simple student experience created by recent WPs.

The guiding principle is:

Each view should show only the guidance and imagery that helps the student succeed in that moment.

---

## Scope

Update Student Mode header presentation and guidance visual hierarchy.

This WP may modify:

- student header rendering
- student view tab/layout wiring
- query lab guidance callout styling
- evidence board required/optional content styling
- shared student mode CSS
- tests
- user journey documentation

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/**
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/WP-100-view-specific-header-and-guidance-hierarchy-polish.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
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
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- Reduce cognitive load
- Do not add new gameplay systems
- Do not add new progression logic
- No runtime AI behavior
- No automatic suspect deduction
- No backend API changes
- No SQL execution changes
- No broad visual redesign

UX constraints:

- Reduce wasted vertical space in working views
- Preserve the noir mentor atmosphere
- Make required actions visually clearer than optional content
- Keep optional content visually subordinate
- Preserve accessibility and readability
- Avoid flashy or distracting effects

Architecture constraints:

- Frontend remains presentation-oriented
- Backend remains authoritative for SQL validation and execution
- UI polish must not change gameplay authority
- Guidance styling must not imply hidden correctness authority

---

## Required Behavior

### 1. View-Specific Header Imagery

Update Student Mode header imagery based on the active student view.

Expected behavior:

- Samuel's Briefing view:

  - show Samuel avatar
  - show scene image
  - preserve full case-entry atmosphere
- Query Lab view:

  - show Samuel avatar
  - hide scene image
  - reduce vertical space
  - preserve mentor presence during active work
- Evidence Board view:

  - hide Samuel avatar
  - show scene image
  - reduce mentor duplication
  - reinforce independent evidence review atmosphere

The header should remain visually cohesive across views.

---

### 2. Required Action Callout Treatment

Make required next-step callouts visually distinct from ambient guidance.

Required action callouts should have:

- stronger visual weight
- clear accent treatment
- improved scanability
- solid visual boundary

Examples may include:

- stronger left accent border
- bolder heading
- warmer highlight color
- improved spacing

Do not make required callouts overly large or distracting.

---

### 3. Optional Content De-Emphasis

Make optional content visually subordinate to required content.

Optional blocks such as Samuelâ€™s optional check-ins should use lighter treatment such as:

- softer border
- reduced background contrast
- lighter heading weight
- optional label clarity
- dashed or subdued border where appropriate

Students should immediately understand that optional content is not required for progression.

---

### 4. Preserve View Intent

Each student view should have a clear visual purpose:

- Briefing:

  - atmospheric case entry
  - full narrative and mentor presence
- Query Lab:

  - heads-down SQL work
  - minimal atmospheric overhead
  - clear required next-step callouts
- Evidence Board:

  - independent evidence review
  - notebook and progress focus
  - optional reflection clearly secondary

---

### 5. Accessibility And Readability

Preserve or improve:

- color contrast
- keyboard navigation
- semantic headings
- readable spacing
- responsive behavior

Do not rely on color alone to distinguish required vs optional content.

Use labels, structure, or visible affordances where appropriate.

---

### 6. Tests

Add or update tests for:

- header imagery by active view
- Query Lab hides scene image and keeps Samuel avatar
- Evidence Board hides Samuel avatar and keeps scene image
- Briefing keeps both images
- required callout class or label is rendered where appropriate
- optional content class or label is rendered where appropriate

Preserve existing tests.

---

### 7. Documentation

Update user journey documentation to explain:

- view-specific header intent
- required vs optional guidance hierarchy
- simplified working-view layout
- student cognitive-load reduction goal

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Briefing view shows both Samuel avatar and scene image
- Query Lab view shows Samuel avatar only
- Evidence Board view shows scene image only
- Query Lab and Evidence Board reclaim vertical space compared with full header treatment
- required next-step callouts are visually stronger than optional content
- optional content is visually subordinate and clearly optional
- accessibility/readability is preserved
- tests cover view-specific header behavior
- tests cover required/optional guidance presentation where practical
- user journey documentation updated
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-100 for the Sequel City Web Detective project.

Objective:
Polish Student Mode header imagery and guidance hierarchy so students can more quickly identify what matters in each view.

Problem:
Student Mode still shows similar header imagery and guidance treatment across views. This wastes vertical space in working views and makes required actions, optional check-ins, and ambient guidance less visually distinct than they should be.

Guiding principle:
Each view should show only the guidance and imagery that helps the student succeed in that moment.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- No runtime AI behavior
- No automatic suspect deduction
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Before editing:

1. Review the Student Mode header component.
2. Review App.tsx active student view state and tab rendering.
3. Review StudentWorkbenchView and StudentEvidenceBoardView guidance/callout markup.
4. Review styles.css for header, callout, required guidance, and optional guidance styles.
5. Review existing tests for Student Mode rendering.

Implement:

1. View-specific header imagery:

   - Briefing view shows Samuel avatar and scene image.
   - Query Lab view shows Samuel avatar only.
   - Evidence Board view shows scene image only.
   - Pass active student view to the header if needed.
2. Required action callout visual treatment:

   - Make required next-step or action-required callouts visually stronger.
   - Use non-color-only affordances such as labels, borders, or structure where appropriate.
3. Optional content de-emphasis:

   - Make optional check-ins visually subordinate.
   - Ensure optional content is clearly labeled or visually distinct from required progression actions.
4. Preserve visual identity:

   - Keep noir mentor atmosphere.
   - Avoid broad redesign.
   - Preserve responsive behavior.
5. Tests:

   - update or add tests for view-specific header image rendering.
   - update or add tests for required and optional guidance presentation where practical.
6. Documentation:

   - update docs/10-user-journey to reflect view-specific header and guidance hierarchy improvements.

Do not:

- change gameplay progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce automatic clue detection
- reveal hidden suspect identities
- add new systems or panels
- make optional content look required
- rely on color alone for required vs optional distinction

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- learner ownership of reasoning
- mentor-guided noir tone
- local-first assumptions
- current simplified Student Mode structure

Keep the implementation focused, accessible, readable, and student-centered.

---

## Gemini Audit Prompt

Audit WP-100 view-specific header and guidance hierarchy polish.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Briefing view shows both Samuel avatar and scene image.
6. Query Lab view shows Samuel avatar only.
7. Evidence Board view shows scene image only.
8. Query Lab and Evidence Board reduce unnecessary header visual overhead.
9. Required next-step callouts are visually stronger than optional content.
10. Optional content is visually subordinate and clearly optional.
11. Accessibility and readability are preserved.
12. No gameplay progression logic was changed.
13. No runtime AI behavior was introduced.
14. No automatic suspect deduction was introduced.
15. Tests were added or updated for header behavior and guidance hierarchy where practical.
16. User journey documentation was updated.

Specifically validate:

- StudentMentorHeader behavior
- App active-view wiring
- Query Lab header rendering
- Evidence Board header rendering
- Briefing header rendering
- required callout styling
- optional check-in styling
- responsive behavior
- accessibility considerations
- test coverage

Flag:

- full header still showing in all views
- required and optional content still visually equivalent
- optional content appearing required
- color-only distinction without structural cue
- broad visual redesign
- gameplay logic changes
- frontend/backend boundary violations
- missing tests
- documentation mismatch

---

## Code Results

WP-100 is implemented and verified. Summary of changes:

**Files modified**
- `apps/web/src/components/student/StudentMentorHeader.tsx`: accepts `activeView`; conditionally renders avatar (Briefing/Query Lab) and scene image (Briefing/Evidence Board); adds `data-active-view` attr and view modifier class.
- `apps/web/src/App.tsx`: passes `activeView={studentView}` to the header.
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`: required callouts (`shouldShowCrimeReportHandoff`, lead board, active leads fallback, default) now share `student-required-callout` with a "Required Next Step" badge. The witness evidence checklist gets the same treatment. The case-review section gains `student-optional-callout` with an explicit "Optional" badge.
- `apps/web/src/components/student/StudentWorkbenchView.tsx`: Samuel's witness trail field note adopts the shared required-callout class + badge.
- `apps/web/src/styles.css`: view-specific header gradients, single-column layout for working views, smaller avatar on Query Lab, shared `.student-required-callout` (accent border + badge) and `.student-optional-callout` (dashed border, subdued background, optional badge) styles.
- `apps/web/src/App.test.tsx`: existing assertions for scene image on Query Lab and Samuel avatar variant on auto-switched Evidence Board updated; added three view-specific header tests and one callout-hierarchy test.
- `docs/10-user-journey/learner-workflow.md`: added the view-specific header and required/optional guidance hierarchy section.
- `docs/01-work-packages/WP-100-...md`: filled in Code Results.

**Verification**: `npm test -- --run` ΓåÆ 107/107 passing. `npm run build` ΓåÆ clean tsc + vite build.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/components/student/**
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/wp-100-view-specific-header-and-guidance-hierarchy-polish.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- apps/api/**
- database/**
- docs/00-ssot/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**

Modified files
--------------
- apps/web/src/app.test.tsx
- apps/web/src/app.tsx
- apps/web/src/components/student/studentevidenceboardview.tsx
- apps/web/src/components/student/studentmentorheader.tsx
- apps/web/src/components/student/studentworkbenchview.tsx
- apps/web/src/styles.css
- docs/10-user-journey/learner-workflow.md
- docs/01-work-packages/wp-100-view-specific-header-and-guidance-hierarchy-polish.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

WP-100 Audit: **PASS**

Work Package 100 has been successfully implemented and verified. The changes effectively polish the Student Mode header and guidance hierarchy, reducing visual noise and improving the clarity of required vs. optional actions while strictly adhering to the project's architectural and gameplay boundaries.

### Key Verification Points

1.  **File Scope Adherence**: All modifications were confined to the approved frontend (`apps/web/src/**`) and documentation (`docs/**`) paths. No backend (`apps/api`), database, or shared logic files were touched.
2.  **View-Specific Header Imagery**:
    *   **Briefing**: Shows both Samuel avatar and scene image (Noir Scene Visual), preserving full atmospheric framing.
    *   **Query Lab (`workbench`)**: Shows Samuel avatar only. The scene image is hidden, reclaiming vertical space for SQL work.
    *   **Evidence Board (`case-board`)**: Shows scene image only. The Samuel avatar is hidden to reduce redundancy and emphasize independent review.
3.  **Guidance Hierarchy Polish**:
    *   **Required Next Steps**: Callouts in Query Lab (Field Note) and Evidence Board (Action Cards, Evidence Checklist) now feature a solid `student-required-callout` treatment with a distinct "Required Next Step" badge and a solid left accent border.
    *   **Optional Content**: Samuel's reasoning check-ins on the Evidence Board are now subordinate, using the `student-optional-callout` class with a dashed border, subdued background, and an explicit "Optional" label.
4.  **Accessibility & Readability**: The distinction between required and optional content uses structural cues (borders, badges, dashed vs. solid lines) rather than relying on color alone, ensuring accessibility for all users.
5.  **Test Coverage**: Four new tests were added to `App.test.tsx` specifically verifying view-specific header rendering and the guidance hierarchy labels/classes. Existing tests were updated to reflect the new conditional imagery.
6.  **Documentation**: `docs/10-user-journey/learner-workflow.md` was updated to reflect the new header intent and guidance hierarchy, providing clear rationale for the changes.

### Integrity & Boundaries
*   **No Gameplay Logic Changes**: Investigation progression and milestone logic (e.g., in `useStudentCaseState.ts`) were untouched.
*   **No AI/Automatic Deduction**: Samuel's guidance remains deterministic and one-step-at-a-time.
*   **No Visual Redesign**: The updates are surgical CSS refinements that preserve the established noir aesthetic.

The implementation successfully balances atmospheric immersion with the practical needs of a focused learning environment.

**Audit Status**: Verified and Approved.

## Final Decision

Approved. `StudentMentorHeader` now accepts `activeView` and conditionally renders the Samuel avatar (Briefing and Query Lab) and scene image (Briefing and Evidence Board). Required callouts in Evidence Board and Query Lab share the `student-required-callout` class with a solid accent border and "Required Next Step" badge. The case-review reasoning check-in uses `student-optional-callout` with a dashed border, subdued background, and explicit "Optional" badge — distinction is structural, not color-only. Four new header and hierarchy tests added to `App.test.tsx`. Scope check PASS. Gemini audit: PASS with all 16 checklist items verified, no flags.


