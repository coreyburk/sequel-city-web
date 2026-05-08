# student-mode-visual-hierarchy-and-guided-progression

## Objective

Reduce Student Mode information overload by establishing a clear visual hierarchy and a deliberate step-by-step progression.

This WP establishes:

- a compact case header instead of a large persistent story block
- a single dominant action flow centered on Samuel Tupleton and the Query Runner
- secondary context panels that stay collapsed until the student needs them
- more explicit "what to do next" guidance in Samuel's current objective

The goal is to make the next action obvious at all times and stop presenting all story/support information with equal visual weight.

---

## Scope

Improve Student Mode hierarchy, progression framing, and related frontend tests.

In scope:

- compact case header and progress framing
- Samuel objective structure and clearer next-step guidance
- Student Mode layout simplification
- collapsing secondary story/support content
- app tests for the new progression hierarchy
- student-mode styling required for the revised experience

Out of scope:

- backend changes
- schema data loading logic changes
- developer mode behavior changes
- suspect verification logic changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-055-student-mode-visual-hierarchy-and-guided-progression.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css

Do Not Modify:

- apps/api/**
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve backend-authoritative query execution
- Keep the case opening spoiler-safe
- Keep Student Mode lightweight and deterministic
- Do not add dependencies
- Preserve Developer Mode behavior

---

## Required Behavior

### 1. Single Dominant Action Flow

Student Mode should present one clear primary path:

- read the current Samuel objective
- run or edit the query
- inspect the result
- proceed to the next breadcrumb

### 2. Compact Persistent Case Header

Once the case is active, story framing should be reduced to a compact header instead of a large full story card.

### 3. Explicit Objective Guidance

Samuel should explicitly communicate:

- what to do next
- why it matters
- what success looks like

### 4. Secondary Context Should Be De-Emphasized

Case notes, schema help, and full story recap should not compete visually with the primary action flow and should be collapsed by default when appropriate.

### 5. Test Coverage

Add or update tests to verify:

- the compact case header is shown
- Samuel presents explicit next-step guidance
- secondary support sections are present but not visually primary
- Developer Mode remains unchanged

---

## Acceptance Criteria

- `WP-055` exists
- Student Mode no longer presents all major panels with equal weight
- the top story area is reduced to a compact case header
- Samuel clearly communicates next step, why it matters, and success criteria
- the Query Runner sits in the dominant action area
- support sections are secondary and collapsible
- app tests cover the new hierarchy and progression framing
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-055 Student Mode visual hierarchy and guided progression.

Do:

- add the work package
- reduce Student Mode to a clearer task-first layout
- replace the large persistent story block with a compact case header
- make Samuel's next step more explicit
- move secondary context into de-emphasized support sections
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- hierarchy/progression summary
- test summary

---

## Gemini Audit Prompt

Audit WP-055 Student Mode visual hierarchy and guided progression.

Verify:

1. Only approved files were modified.
2. Student Mode uses a compact case header instead of a large persistent story card.
3. Samuel explicitly communicates next step, why it matters, and success criteria.
4. The Query Runner remains in the primary action area.
5. Secondary sections are present but visually de-emphasized/collapsible.
6. Developer Mode remains unchanged.
7. Tests cover the new hierarchy and progression behavior.

Flag:

- lingering equal-weight dashboard behavior
- unclear student next-step guidance
- unauthorized file changes
- missing test coverage

---

## Codex Results

Implemented a task-first Student Mode layout that reduces equal-weight panel overload.

Files changed:

- `docs/01-work-packages/WP-055-student-mode-visual-hierarchy-and-guided-progression.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Replaced the large persistent story block with a compact case header showing the active case, current objective, progress, and noir scene.
- Re-centered Student Mode around one dominant action flow: Samuel's briefing followed directly by the Query Runner.
- Refactored Samuel's guidance so each breadcrumb explicitly communicates:
  - next step
  - why it matters
  - success looks like
- Reduced visual competition by moving case notes, schema help, and full story recap into secondary support sections.
- Preserved the existing query progression, schema snapshot behavior, and Developer Mode shell.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `27` tests passed

## Gemini Audit Results

PASS.

Confirmed by audit:

- only approved files were modified
- Student Mode now uses a compact case header instead of a large persistent story card
- Samuel explicitly communicates next step, why it matters, and success criteria
- the Query Runner remains in the primary action area
- case notes, schema help, and story recap are secondary support sections
- Developer Mode remains unchanged
- tests cover the new hierarchy and progression behavior

Audit result:

- no lingering equal-weight dashboard behavior was flagged
- no unauthorized changes were detected

## Final Decision

Approved.

