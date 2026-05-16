# WP-106: consolidate-student-guidance-and-header-hierarchy

## Objective

Consolidate Student Mode guidance and header hierarchy so students have one clear primary instruction source per view.

The current Query Lab view has Samuel guidance scattered across multiple areas:

- header guidance text
- Query Runner helper text
- Pinned Facts helper text
- empty-state guidance
- repeated labels and headings

This creates redundant instructional noise. The header should carry the primary guidance. Supporting panels should stay quiet and functional.

This WP also corrects remaining header image composition issues:

- Evidence Board scene image should match the Briefing scene image size and composition.
- Query Lab Samuel avatar should be larger and more mentor-like.
- Query Lab header should remove redundant labels and simplify to one strong Samuel guidance message.
- Navigation tab labels should be easier to read.

The guiding principle is:

One primary instruction source per view. Everything else supports it quietly.

---

## Scope

Refine Student Mode header hierarchy, guidance text placement, image sizing, and tab readability.

This WP may modify:

- StudentMentorHeader content and styling
- Query Lab helper text
- Pinned Facts helper text
- student navigation tab styling
- Evidence Board scene image sizing
- Query Lab Samuel avatar sizing
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
- docs/01-work-packages/WP-106-consolidate-student-guidance-and-header-hierarchy.md

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
- Preserve the stable header shell behavior from WP-104
- Preserve prominent imagery
- Reduce redundant guidance text
- Do not change gameplay logic
- Do not change progression logic
- Do not add new systems
- No runtime AI behavior
- No backend API changes
- No SQL execution changes
- Keep changes surgical and visual/content-focused

UX constraints:

- Use one primary instruction source per view
- Header guidance should be primary
- Query Runner helper text should be short and secondary
- Pinned Facts helper text should be short and secondary
- Query Lab Samuel avatar should be visibly larger
- Evidence Board scene image should match Briefing scene image size and composition
- Navigation tab labels should be larger and easier to read
- Avoid excessive repeated labels
- Avoid increasing cognitive load

---

## Required Behavior

### 1. Consolidate Query Lab Guidance

Query Lab should have one dominant guidance source: the StudentMentorHeader.

Reduce or simplify redundant helper text in:

- Query Runner
- Pinned Facts
- empty pinned facts state
- any other Query Lab instructional copy

The Query Runner should focus on function, not repeated instruction.

Pinned Facts should explain usage briefly, not repeat Samuelâ€™s next step.

Do not remove necessary functional labels such as SQL Query or Run Query.

---

### 2. Simplify Query Lab Header Labels

In Query Lab header:

- Keep `Samuel's Guidance` as the main label or heading.
- Remove or hide redundant labels such as:
  - Samuel image name label
  - `Samuel's nudge` heading
  - duplicate mentor labels
- Increase the main guidance text size significantly.
- Preserve Samuelâ€™s trust and Insight Marks badges if they remain useful and not visually noisy.

The Query Lab header should feel like direct mentor guidance, not a cluster of labels.

---

### 3. Increase Query Lab Avatar Prominence

Make Samuelâ€™s avatar larger in Query Lab.

The avatar should:

- feel mentor-like and intentional
- be visually larger than the current implementation
- remain balanced with the enlarged guidance text
- not dominate the workspace

Do not shrink Samuel into an icon-like treatment.

---

### 4. Evidence Board Scene Image Match

Evidence Board should use the same scene image sizing and composition as the Briefing scene image.

Expected behavior:

- same scene image card size as Briefing on desktop
- same or very similar aspect ratio and object-fit behavior
- no narrow strip treatment
- no reduced scene card that feels secondary
- Samuel avatar remains hidden on Evidence Board

The Evidence Board scene should feel as visually prominent as the Briefing scene.

---

### 5. Navigation Tab Readability

Increase student navigation tab font size.

Tabs should be easier to read at a glance:

- Samuelâ€™s Briefing
- Query Lab
- Evidence Board

Preserve current active-state behavior unless minor refinements are necessary.

---

### 6. Preserve Stable Header Shell

Do not undo WP-104.

The header shell should remain stable across views.

The tab bar and main content start position should remain stable when switching views.

---

### 7. Accessibility And Readability

Preserve or improve:

- color contrast
- semantic headings
- readable spacing
- responsive behavior
- keyboard navigation
- non-color-only distinctions where applicable

Do not rely on subtle color differences alone.

---

### 8. Tests

Update or add tests for:

- Query Lab header renders `Samuel's Guidance`
- Query Lab header does not render redundant `Samuel's nudge` heading
- Query Lab header does not render Samuel image name label if removed from DOM
- Evidence Board scene image remains present
- Evidence Board Samuel avatar remains absent
- navigation tabs render with updated class hooks or remain accessible
- core Query Lab functionality remains intact

Visual font sizing is primarily CSS-reviewed, but testable content and class hooks should be covered where practical.

---

### 9. Documentation

Update user journey documentation only if needed.

If updated, explain:

- Student Mode now uses one primary instruction source per view
- Query Lab header carries Samuelâ€™s main guidance
- supporting panels use shorter functional helper text
- Evidence Board keeps a prominent scene image

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Query Lab uses the header as the single primary guidance source
- Query Lab redundant guidance text is reduced
- Query Runner helper text is shorter and secondary
- Pinned Facts helper text is shorter and secondary
- Query Lab header keeps `Samuel's Guidance`
- Query Lab header removes redundant `Samuel's nudge` style heading
- Query Lab image name label is removed or hidden
- Query Lab guidance text is significantly larger and easier to read
- Query Lab Samuel avatar is visibly larger and mentor-like
- Evidence Board scene image matches Briefing scene image size and composition
- Evidence Board still hides Samuel avatar
- navigation tab font size is increased
- stable header shell behavior remains intact
- no gameplay logic changed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced
- tests updated where practical

---

## Code Prompt

You are implementing WP-106 for the Sequel City Web Detective project.

Objective:
Consolidate Student Mode guidance and header hierarchy so students have one clear primary instruction source per view.

Problem:
The Query Lab currently scatters guidance across too many places. Students see Samuelâ€™s guidance in the header, Query Runner helper text, Pinned Facts helper text, and empty-state instructions. The Query Lab header also has too many labels: image name label, `Samuel's Guidance`, and `Samuel's nudge`. This creates redundant instructional noise.

The Evidence Board scene image also needs to match the Briefing scene image size and composition, and the navigation tab text should be larger.

Guiding principle:
One primary instruction source per view. Everything else supports it quietly.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s mentor role
- Preserve WP-104 stable header shell behavior
- Preserve prominent imagery
- No gameplay logic changes
- No backend changes
- No SQL execution changes
- No runtime AI behavior

Before editing:

1. Review StudentMentorHeader.tsx.
2. Review App.tsx active view wiring and student tab rendering.
3. Review Query Runner and Pinned Facts components/copy.
4. Review styles.css header, tab, pinned facts, and query runner styles.
5. Review App tests and relevant student component tests.
6. Review docs/10-user-journey only if documentation needs updating.

Implement:

1. Query Lab guidance consolidation:

   - make StudentMentorHeader the primary guidance source
   - shorten Query Runner helper text
   - shorten Pinned Facts helper text and empty-state text
   - avoid repeating Samuelâ€™s next-step language in multiple panels
2. Query Lab header simplification:

   - keep `Samuel's Guidance`
   - remove or hide `Samuel's nudge` heading in Query Lab
   - remove or hide Samuel image name label in Query Lab
   - significantly increase the main guidance text size
   - keep badges only if they remain useful and not noisy
3. Query Lab avatar sizing:

   - increase Samuel avatar size compared with current Query Lab implementation
   - keep avatar balanced with larger guidance text
   - do not make avatar icon-like
4. Evidence Board scene sizing:

   - make Evidence Board scene image match Briefing scene image size and composition on desktop
   - keep Samuel avatar hidden on Evidence Board
   - avoid strip treatment or reduced scene card
5. Navigation tab readability:

   - increase font size for student navigation tabs
   - preserve current active-state behavior unless minor visual tuning is necessary
6. Preserve stable header shell:

   - do not reintroduce header height jumps
   - keep tab bar/main content position stable
7. Tests:

   - update or add tests for Query Lab header text and absence of redundant labels
   - update or add tests for Evidence Board image/avatar behavior
   - update or add tests only where practical for tab accessibility/hooks
   - preserve existing gameplay tests
8. Documentation:

   - update docs/10-user-journey only if needed

Do not:

- change student progression logic
- change query execution logic
- modify backend APIs
- introduce runtime AI
- introduce new systems or panels
- remove WP-100 view-specific behavior
- undo WP-104 stable header shell
- shrink images into tiny thumbnails
- make supporting panels compete with the header guidance
- remove necessary functional labels such as SQL Query or Run Query

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

Keep the implementation focused, visual, concise, and student-centered.

---

## Gemini Audit Prompt

Audit WP-106 Student Mode guidance consolidation and header hierarchy.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab uses the header as the primary guidance source.
6. Query Lab redundant helper guidance is reduced.
7. Query Runner helper text is shorter and secondary.
8. Pinned Facts helper text is shorter and secondary.
9. Query Lab header keeps `Samuel's Guidance`.
10. Query Lab header no longer renders redundant `Samuel's nudge` heading.
11. Query Lab image name label is removed or hidden.
12. Query Lab guidance text is significantly larger and easier to read.
13. Query Lab Samuel avatar is visibly larger and mentor-like.
14. Evidence Board scene image matches Briefing scene image size and composition.
15. Evidence Board Samuel avatar remains hidden.
16. Navigation tab font size is increased.
17. WP-104 stable header shell behavior remains intact.
18. Accessibility and readability are preserved.
19. Tests were updated or added where practical.
20. No gameplay logic was changed.

Specifically validate:

- StudentMentorHeader Query Lab content hierarchy
- Query Runner helper text reduction
- Pinned Facts helper text reduction
- Evidence Board scene sizing/composition
- tab readability
- stable shell preservation
- view-specific image preservation
- responsive implications
- test coverage

Flag:

- Query Lab still showing redundant heading labels
- Samuel name label still visible in Query Lab
- guidance still scattered across panels
- Query Lab guidance still visually weak
- Query Lab Samuel avatar still too small
- Evidence Board scene still smaller than Briefing scene
- Evidence Board still using strip treatment
- tab text still too small
- reintroduced header height jumps
- gameplay logic changes
- backend or database modifications
- missing tests

---

## Code Results

WP-106 implemented and committed (`288f624`).

**Summary of changes**

- **Query Lab header simplified** ΓÇö `StudentMentorHeader.tsx` now hides the `Samuel Tupleton` avatar name, the redundant `Samuel's nudge` / `Samuel's advice` mentor title h2, and the `Samuel's Trust` / `Insight Marks` reward strip when active view is workbench. `Samuel's Guidance` kicker remains as the single primary label, and the message text is now the prominent guidance source.
- **Guidance text and avatar enlarged** ΓÇö workbench message font bumped to `clamp(1.28rem, 1.7vw, 1.62rem)` with brighter color and weight 600; workbench Samuel avatar enlarged to `clamp(188px, 18vw, 232px)` on desktop and `clamp(148px, 26vw, 176px)` otherwise.
- **Supporting copy shortened** ΓÇö `QueryRunner.tsx` helper fallbacks shortened to `Write SQL and run it to inspect rows.` / `Review the restored result, then write your next query.`, query-builder hint shortened to `Click a block or pinned fact to insert it.`; `StudentWorkbenchView.tsx` Pinned Facts helper to `Click a fact to insert it.` and empty state to `No facts pinned yet.`.
- **Evidence Board scene matches Briefing** ΓÇö desktop grid changed to `1.2fr 1fr` and noir-scene-frame aspect ratio aligned to `16 / 10` with the same height envelope; Samuel avatar remains hidden on Evidence Board.
- **Navigation tabs enlarged** ΓÇö `font-size: clamp(1.04rem, 1.2vw, 1.18rem)`, padding `12px 14px`; active-state, `aria-pressed`, and `aria-current` hooks preserved.
- **Stable header shell preserved** ΓÇö workbench and case-board keep the `min-height: 240px; max-height: 288px` envelope on desktop; `data-stable-shell` and view variant classes unchanged.
- **Tests updated** ΓÇö App.test.tsx asserts removal of redundant labels and Evidence Board scene presence; new tab accessibility test added; QueryRunner.test.tsx witness-transition assertion updated. All 111 tests across 12 files pass; `tsc --noEmit` is clean.
- **Boundaries respected** ΓÇö no backend, database, schema, SQL execution, or runtime AI changes; deterministic gameplay and progression logic untouched.

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
- docs/01-work-packages/wp-106-consolidate-student-guidance-and-header-hierarchy.md

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
- None

Out-of-scope files
------------------
- None

## Gemini Audit Results

The audit of Work Package WP-106 (Consolidate student guidance and header hierarchy) is complete. The implementation successfully centralizes guidance into the student header, reduces instructional noise in sub-panels, and improves the visual hierarchy and readability of the student workspace.

### Audit Summary

1.  **Guidance Consolidation:**
    *   The `StudentMentorHeader` is now the primary guidance source in the Query Lab (Workbench) view.
    *   Redundant instructional noise has been removed from `QueryRunner` and `StudentWorkbenchView` (Pinned Facts).
    *   Helper text in these panels is now shorter and more functional (e.g., "Click a fact to insert it." instead of repeating Samuel's instructions).

2.  **Query Lab Visual Hierarchy:**
    *   **Guidance Text:** Significantly enlarged in Workbench view (`clamp(1.28rem, 1.7vw, 1.62rem)`) with high-contrast colors.
    *   **Samuel Avatar:** Enlarged to `176px` on desktop, making it feel more mentor-like and intentional.
    *   **Label Reduction:** Hides the `Samuel Tupleton` name label, the redundant `Samuel's nudge` title, and the reward strip when in Workbench view, reducing cognitive load.
    *   **Label Retention:** Keeps `Samuel's Guidance` as the single primary kicker.

3.  **Evidence Board Alignment:**
    *   The noir scene image on the Evidence Board now matches the Briefing scene's size and 16/10 aspect ratio, ensuring visual prominence.
    *   The Samuel avatar remains hidden on the Evidence Board to maintain the view's focus on independent review.

4.  **Navigation & Stability:**
    *   Student navigation tabs have been enlarged (`clamp(1.04rem, 1.2vw, 1.18rem)`) for better readability.
    *   The stable header shell behavior from WP-104 is preserved, ensuring no height jumps when switching views.

5.  **Technical Integrity:**
    *   Only approved frontend and documentation files were modified.
    *   No changes were made to the backend, database, SQL execution, or gameplay logic.
    *   Existing tests were updated and new assertions were added to verify the removal of redundant labels and the consistency of scene imagery. All 111 tests pass.

### Findings

| Point | Requirement | Status | Verification |
| :--- | :--- | :--- | :--- |
| 1-4 | Scope & Boundaries | **PASS** | Only frontend/docs modified; no backend/DB changes. |
| 5-6 | Primary Guidance Source | **PASS** | `StudentMentorHeader` carries guidance; sub-panel noise reduced. |
| 7-8 | Helper Text Reduction | **PASS** | `QueryRunner` and `PinnedFacts` use short, functional copy. |
| 9-11 | Header Label Cleanup | **PASS** | Redundant headings and name labels hidden in Query Lab. |
| 12-13 | Image & Font Sizing | **PASS** | Guidance font and Samuel avatar significantly enlarged in Workbench. |
| 14-15 | Evidence Board Scene | **PASS** | Matches Briefing sizing; Samuel avatar hidden. |
| 16 | Tab Readability | **PASS** | Tab font size increased via `styles.css`. |
| 17 | Stable Shell | **PASS** | `data-stable-shell` and height envelopes preserved. |
| 18-20 | General Standards | **PASS** | Accessibility preserved; tests passing; no logic changes. |

### Conclusion
WP-106 successfully achieves its objective of creating a clearer, less noisy instructional experience for students by establishing a strong guidance hierarchy and improving visual consistency across views.

**Final Decision: APPROVED**

## Final Decision

Approved. `StudentMentorHeader` now hides the avatar name label, redundant mentor title heading, and reward strip in Query Lab — "Samuel's Guidance" is the sole primary label. Query Lab mentor message font enlarged to `clamp(1.28rem, 1.7vw, 1.62rem)` with weight 600; avatar grown to `clamp(188px, 18vw, 232px)` desktop. `QueryRunner` and Pinned Facts helper copy shortened to functional single-line text. Evidence Board scene matched to Briefing: `1.2fr/1fr` desktop grid, 16:10 aspect ratio, same height envelope; Samuel avatar remains hidden. Navigation tabs enlarged via `clamp(1.04rem, 1.2vw, 1.18rem)`. WP-104 stable header shell and WP-100 view-specific image rules preserved. All 111 tests pass. Scope check PASS. Gemini audit: PASS with all 20 checklist items verified, no flags.


