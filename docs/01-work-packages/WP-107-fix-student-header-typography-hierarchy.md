# WP-107: fix-student-header-typography-hierarchy

## Objective

Fix Student Mode header and guidance typography hierarchy so labels are visually stronger than the body text they introduce.

Recent header polish improved layout stability and image composition, but the typography hierarchy is still inverted in key areas. Labels such as `Samuel's Guidance` are too small compared with the guidance text, and Evidence Board uses redundant headings.

The goal is to make view-level labels clear, readable, and visually authoritative without adding new content or changing gameplay behavior.

The guiding principle is:

Labels introduce guidance. Guidance explains the next action.

---

## Scope

Refine Student Mode typography hierarchy and redundant guidance labels.

This WP may modify:

- StudentMentorHeader markup and copy
- student header typography CSS
- Evidence Board check-in labels
- required/secondary guidance labels
- student navigation tab typography
- related tests
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
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/WP-107-fix-student-header-typography-hierarchy.md

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
- Preserve stable header shell behavior from WP-104
- Preserve header image composition behavior from WP-106
- Do not add new guidance systems
- Do not change gameplay logic
- Do not change progression logic
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and typography-focused

UX constraints:

- Labels should be larger and more prominent than the guidance text they introduce
- Guidance text should remain readable but not overpower labels
- Remove redundant headings
- Remove confusing `Optional` wording from student-facing check-ins
- Increase student navigation tab text size
- Preserve noir visual identity
- Preserve accessibility and readability

---

## Required Behavior

### 1. Query Lab Header Typography

Fix Query Lab header hierarchy.

Required behavior:

- `Samuel's Guidance` should be the dominant label/heading in the Query Lab header.
- The guidance body text should remain large and readable, but smaller than the `Samuel's Guidance` label.
- Do not reintroduce `Samuel's nudge` in Query Lab.
- Do not reintroduce Samuel image name label in Query Lab.
- Keep the header concise.

Expected hierarchy:

1. `Samuel's Guidance`
2. guidance sentence or paragraph
3. badges if retained

---

### 2. Evidence Board Header Typography And Copy

Fix Evidence Board header hierarchy.

Required behavior:

- Replace the current `Evidence Review` label and `Samuel's advice` heading combination with one large label:

  `Samuel's Evidence Review`
- Remove redundant `Samuel's advice`.
- Keep the evidence review guidance text readable but smaller than the label.
- Preserve the Evidence Board scene image.
- Preserve Samuel avatar hidden on Evidence Board.

Expected hierarchy:

1. `Samuel's Evidence Review`
2. evidence review guidance sentence or paragraph
3. badges if retained

---

### 3. Remove Confusing Optional Wording

Remove the visible word `Optional` from student-facing check-in labels.

The section can remain visually subordinate through:

- dashed border
- subdued background
- smaller body text
- placement below required content

Use clearer wording such as:

- `Samuel's Check-In`
- `Check-In`
- `Reasoning Check-In`

Do not make the check-in look required.

Do not remove the check-in functionality unless already unused.

---

### 4. Navigation Tab Typography

Increase student navigation tab text size.

Tabs should be easier to read:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

Preserve existing active-state behavior unless minor CSS tuning is needed.

---

### 5. Preserve Stable Header Layout

Do not undo previous header layout fixes.

Preserve:

- stable header shell across Student Mode views
- Briefing avatar plus scene image
- Query Lab avatar only
- Evidence Board scene image only
- image prominence and composition

---

### 6. Accessibility And Readability

Preserve or improve:

- color contrast
- semantic heading structure
- readable spacing
- responsive behavior
- keyboard navigation

Do not rely on subtle color differences alone.

---

### 7. Tests

Update or add tests for:

- Query Lab renders `Samuel's Guidance`
- Query Lab does not render `Samuel's nudge`
- Evidence Board renders `Samuel's Evidence Review`
- Evidence Board does not render redundant `Samuel's advice`
- visible `Optional` label is removed from student-facing check-ins
- navigation tabs remain accessible and visible
- WP-100/WP-104 header behavior remains intact where practical

Visual font size is mostly CSS-reviewed, but rendered text and absence of redundant labels should be tested.

---

### 8. Documentation

Update user journey documentation only if needed.

If updated, explain that header typography now uses stronger view labels and quieter supporting guidance.

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Query Lab `Samuel's Guidance` label is visually larger than the guidance body text
- Query Lab guidance body text remains readable
- Query Lab does not show `Samuel's nudge`
- Query Lab does not show Samuel image name label
- Evidence Board shows `Samuel's Evidence Review`
- Evidence Board does not show redundant `Samuel's advice`
- Evidence Board guidance body text is smaller than its label
- visible `Optional` wording is removed from student-facing check-in labels
- check-in remains visually subordinate and not required-looking
- navigation tab text size is increased
- stable header shell remains intact
- view-specific image behavior remains intact
- accessibility/readability is preserved
- tests updated where practical
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-107 for the Sequel City Web Detective project.

Objective:
Fix Student Mode header and guidance typography hierarchy so labels are larger and more visually authoritative than the body text they introduce.

Problem:
Recent header polish improved layout and image composition, but the typography hierarchy is inverted. Labels such as `Samuel's Guidance` are smaller than the guidance text. On Evidence Board, `Evidence Review` and `Samuel's advice` are redundant. The visible word `Optional` in check-ins is confusing. Student navigation tab text is still too small.

Guiding principle:
Labels introduce guidance. Guidance explains the next action.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s mentor role
- Preserve WP-104 stable header shell behavior
- Preserve view-specific image behavior:
  - Briefing shows Samuel avatar and scene image
  - Query Lab shows Samuel avatar only
  - Evidence Board shows scene image only
- No gameplay logic changes
- No backend changes
- No SQL execution changes
- No runtime AI behavior

Before editing:

1. Review StudentMentorHeader.tsx.
2. Review StudentEvidenceBoardView.tsx for check-in labels.
3. Review App.tsx student tab rendering.
4. Review styles.css header, tab, required callout, and check-in styles.
5. Review App tests and relevant student component tests.
6. Review docs/10-user-journey only if documentation needs updating.

Implement:

1. Query Lab typography hierarchy:

   - make `Samuel's Guidance` the dominant label/heading.
   - make the guidance body text smaller than the label but still readable.
   - ensure `Samuel's nudge` is not rendered in Query Lab.
   - ensure Samuel image name label is not rendered in Query Lab.
2. Evidence Board header copy and hierarchy:

   - replace `Evidence Review` plus `Samuel's advice` with one large label: `Samuel's Evidence Review`.
   - remove redundant `Samuel's advice`.
   - make the guidance body text smaller than the label.
   - preserve scene image and hide Samuel avatar.
3. Check-in wording:

   - remove visible `Optional` text from student-facing check-in labels.
   - use clearer wording such as `Samuel's Check-In` or `Reasoning Check-In`.
   - keep check-in visually subordinate through styling rather than the word `Optional`.
4. Navigation tabs:

   - increase font size for student navigation tab labels.
   - preserve active tab behavior.
5. Preserve header layout:

   - do not reintroduce view-to-view header jumps.
   - do not change image visibility rules.
   - do not shrink or remove imagery.
6. Tests:

   - update or add tests for the new/removed labels.
   - preserve existing header behavior tests.
   - verify check-in no longer shows `Optional` where practical.
7. Documentation:

   - update docs/10-user-journey only if needed.

Do not:

- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- undo WP-104 stable header shell
- remove Samuel or scene imagery
- make check-ins look required
- rely only on color for hierarchy

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, concise, and student-centered.

---

## Gemini Audit Prompt

Audit WP-107 Student Mode header typography hierarchy fixes.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab renders `Samuel's Guidance`.
6. Query Lab does not render `Samuel's nudge`.
7. Query Lab does not render Samuel image name label.
8. Query Lab `Samuel's Guidance` is visually stronger than the guidance body text.
9. Evidence Board renders `Samuel's Evidence Review`.
10. Evidence Board does not render redundant `Samuel's advice`.
11. Evidence Board guidance body text is smaller than its label.
12. Visible `Optional` wording is removed from student-facing check-in labels.
13. Check-in content remains visually subordinate and does not appear required.
14. Navigation tab text size is increased.
15. WP-104 stable header shell behavior remains intact.
16. View-specific image behavior remains intact.
17. Accessibility and readability are preserved.
18. Tests were updated or added where practical.
19. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader typography hierarchy
- Query Lab header labels
- Evidence Board header labels
- check-in wording
- tab typography
- stable shell preservation
- view-specific image preservation
- test coverage

Flag:

- label text still smaller than body guidance
- `Samuel's nudge` still visible in Query Lab
- Samuel name label still visible in Query Lab
- `Samuel's advice` still visible on Evidence Board
- visible `Optional` label still present in check-ins
- check-in appearing required
- navigation tab text still too small
- reintroduced header height jumps
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

All changes implemented and verified. Summary:

**StudentMentorHeader.tsx** (`apps/web/src/components/student/StudentMentorHeader.tsx`)
- Promoted role-kicker from `<p>` to `<h2>` for proper heading semantics.
- Evidence Board label changed: `Evidence Review` ΓåÆ `Samuel's Evidence Review`.
- `showAvatarName` is now briefing-only.
- `showMentorTitle` shows on briefing and on case-board only when the title isn't the redundant "Samuel's advice" / "Samuel's nudge" (preserves "Witness trail unlocked" status).

**StudentEvidenceBoardView.tsx**
- Removed the visible `Optional` badge.
- Renamed `Optional Samuel's Check-In` ΓåÆ `Samuel's Check-In`.
- Rewrote helper line: `A quick reasoning check if you want to confirm why the clue matters.` Dashed-border `student-optional-callout` styling keeps it visually subordinate.

**styles.css**
- Student nav tabs: font-size up to `clamp(1.18rem, 1.5vw, 1.36rem)`, padding `14px 16px`.
- Workbench role-kicker (label): `clamp(1.62rem, 2.3vw, 2.1rem)`, no uppercase. Message: `clamp(1.04rem, 1.25vw, 1.24rem)`, weight 500 ΓÇö smaller than the label.
- Case-board role-kicker: `clamp(1.5rem, 2.15vw, 1.98rem)`. Message: `clamp(1rem, 1.18vw, 1.16rem)` ΓÇö smaller than the label.

**App.test.tsx**
- Updated Evidence Board test: kicker is now `H2`, text `Samuel's Evidence Review`; asserts absence of `Samuel's advice`, `Samuel's nudge`, and `Evidence Review`.
- Updated Query Lab consolidation test: kicker H2 with `Samuel's Guidance`; asserts absence of `Samuel's advice` too.
- Updated check-in copy test: `Samuel's Check-In` only, no `Optional` text in the section.
- Updated the progression tests to use the new check-in copy.

Result: `vitest run` ΓåÆ 111/111 passing; `tsc --noEmit` ΓåÆ clean.

Header shell stability preserved (no panel/structure or stable-shell attribute changes). View-specific image rules unchanged (Briefing: avatar + scene; Query Lab: avatar; Evidence Board: scene). No gameplay, backend, SQL, or AI behavior was modified.

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
- docs/01-work-packages/wp-107-fix-student-header-typography-hierarchy.md

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
- apps/web/src/components/student/studentevidenceboardview.tsx
- apps/web/src/components/student/studentmentorheader.tsx
- apps/web/src/styles.css
- docs/01-work-packages/wp-107-fix-student-header-typography-hierarchy.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

The audit of **WP-107 Student Mode header typography hierarchy fixes** is complete. The implementation successfully resolves the typography inversion and redundant labeling issues while strictly adhering to the architectural boundaries and layout stability requirements.

### Audit Summary

1.  **Typography Hierarchy (Verified):**
    *   **Query Lab:** Now correctly renders `Samuel's Guidance` as a dominant `<h2>` heading. The label size (`clamp(1.62rem, 2.3vw, 2.1rem)`) is significantly larger than the guidance body text (`clamp(1.04rem, 1.25vw, 1.24rem)`), establishing a clear hierarchy.
    *   **Evidence Board:** Successfully consolidated `Evidence Review` and `Samuel's advice` into a single authoritative label: `Samuel's Evidence Review` (`<h2>`). The label size (`clamp(1.5rem, 2.15vw, 1.98rem)`) properly outweighs the body text.

2.  **Redundancy Removal (Verified):**
    *   `Samuel's nudge` and the Samuel image name label have been removed from the Query Lab.
    *   `Samuel's advice` has been removed from the Evidence Board (except when it contains unique status information like "Witness trail unlocked").
    *   `Optional` wording has been removed from student-facing check-in labels.

3.  **Check-in Styling (Verified):**
    *   The check-in section is renamed to `Samuel's Check-In`.
    *   It remains visually subordinate via `.student-optional-callout` (dashed border, subdued background) and does not appear required, fulfilling the design intent.

4.  **Navigation & Layout (Verified):**
    *   **Tabs:** Navigation tab text size increased to `clamp(1.18rem, 1.5vw, 1.36rem)` for better legibility.
    *   **Stability:** The `data-stable-shell="student-case-header"` attribute and overall header structure from WP-104 remain intact.
    *   **Images:** View-specific imagery rules are preserved (Briefing: avatar + scene; Query Lab: avatar only; Evidence Board: scene only).

5.  **Test Coverage (Verified):**
    *   `App.test.tsx` has been updated with comprehensive assertions for the new labels and the absence of redundant ones.
    *   Existing progression and layout tests remain passing (111/111 as per WP report).

6.  **Scope & Safety (Verified):**
    *   Only approved frontend files (`apps/web/**`) and the WP documentation were modified.
    *   **No changes** to backend API (`apps/api/**`), database scripts (`database/**`), or SQL execution logic were found.

### Final Verification Table

| Requirement | Status | Evidence |
| :--- | :--- | :--- |
| Query Lab `Samuel's Guidance` | PASS | `StudentMentorHeader.tsx` L104-110 |
| Query Lab No `Samuel's nudge` | PASS | `isRedundantMentorTitle` logic & `App.test.tsx` |
| Evidence Board `Samuel's Evidence Review` | PASS | `StudentMentorHeader.tsx` L111-117 |
| Evidence Board No `Samuel's advice` | PASS | `showMentorTitle` logic in `StudentMentorHeader.tsx` |
| Remove `Optional` from check-ins | PASS | `StudentEvidenceBoardView.tsx` L171 |
| Increased Navigation Tab Size | PASS | `styles.css` L477 |
| Stable Header Shell (WP-104) | PASS | `data-stable-shell` preserved |
| View-specific Image Behavior | PASS | `showSamuelAvatar`/`showSceneVisual` logic |
| No Backend/Database Changes | PASS | Scope check confirmed |

The changes are **approved** and meet all acceptance criteria.

## Final Decision

Approved. `StudentMentorHeader.tsx` role-kicker promoted to `<h2>` for proper heading semantics. Evidence Board label consolidated from `Evidence Review` + `Samuel's advice` to single `Samuel's Evidence Review` heading. `showAvatarName` restricted to Briefing only; `showMentorTitle` conditional suppresses redundant `Samuel's advice` and `Samuel's nudge` while preserving meaningful status text. `StudentEvidenceBoardView.tsx` removes visible `Optional` badge and renames check-in to `Samuel's Check-In` with clearer helper text; dashed-border `.student-optional-callout` styling maintains visual subordination. `styles.css` increases nav tab font size to `clamp(1.18rem, 1.5vw, 1.36rem)` and establishes correct label-over-body hierarchy: workbench kicker `clamp(1.62rem, 2.3vw, 2.1rem)` / message `clamp(1.04rem, 1.25vw, 1.24rem)`, case-board kicker `clamp(1.5rem, 2.15vw, 1.98rem)` / message `clamp(1rem, 1.18vw, 1.16rem)`. `App.test.tsx` updated with `<h2>` assertions for `Samuel's Guidance` and `Samuel's Evidence Review`, absence checks for `Samuel's advice`, `Samuel's nudge`, and `Evidence Review`, updated check-in copy test, and updated progression tests. WP-104 stable shell (`data-stable-shell="student-case-header"`) and WP-100 view-specific image rules unchanged. Scope check PASS. Gemini audit PASS with all 19 checklist items verified, no flags.


