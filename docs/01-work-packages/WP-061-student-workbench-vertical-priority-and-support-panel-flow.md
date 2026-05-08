# student-workbench-vertical-priority-and-support-panel-flow

## Objective

Correct the remaining Student Mode desktop layout regression so the workbench keeps priority over the viewport and the lower support accordions do not consume primary screen space.

This WP focuses on:

- restoring clear vertical priority to the Student workbench
- keeping the Query Runner reachable inside the left workbench column
- keeping left and right workbench columns independently scrollable
- ensuring support accordions live after the workbench instead of feeling viewport-anchored

The goal is to make the Student workspace behave like the primary investigation surface, with support panels available afterward rather than competing for the same frame.

---

## Scope

Improve Student Mode desktop vertical layout behavior and support-panel flow.

In scope:

- Student Mode desktop CSS adjustments for workbench height and scroll ownership
- Student Mode structure adjustments required to place support sections in the correct flow
- support-panel placement and flow correction
- work package documentation for the regression fix
- verification of existing Student Mode behavior after layout changes

Out of scope:

- backend changes
- Developer Mode behavior changes
- new Student Mode content blocks
- new clue-logging mechanics
- broad visual redesign beyond layout correction

---

## Files Allowed to Change

- docs/01-work-packages/WP-061-student-workbench-vertical-priority-and-support-panel-flow.md
- apps/web/src/App.tsx
- apps/web/src/styles.css

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration
- Student Mode content logic unless required by the layout fix

---

## Constraints

- Preserve Developer Mode behavior
- Preserve existing Student Mode notebook, Samuel, and evidence interactions
- Preserve independent desktop scrolling within the workbench columns
- Do not add dependencies

---

## Required Behavior

### 1. Workbench Owns the Primary Viewport

The Student workbench should consume the main desktop viewport area so the case workflow remains the dominant surface.

### 2. Query Runner Remains Reachable

The left workbench column must stay vertically scrollable so the Query Runner and results remain reachable at normal desktop viewport sizes.

### 3. Support Panels Flow After the Workbench

Support accordions should appear after the workbench rather than reading as anchored inside the same visible frame.

### 4. Right Rail Remains Independently Scrollable

The notebook and case-file rail should continue to scroll independently from the main workbench column.

---

## Acceptance Criteria

- `WP-061` exists
- Student Mode workbench has clear vertical priority on desktop
- Query Runner remains reachable through left-column scrolling
- left and right workbench columns still scroll independently
- support accordions no longer feel viewport-anchored
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-061 student workbench vertical priority and support-panel flow.

Do:

- add the work package
- correct the Student Mode desktop vertical priority regression
- preserve independent column scrolling
- ensure support accordions flow after the workbench
- verify the frontend workspace tests still pass

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- layout summary
- verification summary

---

## Gemini Audit Prompt

Audit WP-061 student workbench vertical priority and support-panel flow.

Verify:

1. Only approved files were modified.
2. The Student workbench remains the primary desktop surface.
3. The Query Runner is reachable within the left column.
4. Left and right workbench columns still scroll independently.
5. Support accordions no longer read as viewport-anchored.
6. Developer Mode behavior remains unchanged.

Flag:

- support panels that still intrude into the primary workbench frame
- workbench height behavior that regresses Query Runner reachability
- unauthorized file changes

---

## Codex Results

Implemented the Student Mode desktop layout correction needed to make support panels follow the main investigation flow instead of competing with it.

Files changed:

- `docs/01-work-packages/WP-061-student-workbench-vertical-priority-and-support-panel-flow.md`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- moved the Student support accordions into the left workbench column beneath the Query Runner so query and result growth pushes them down naturally
- preserved independent scrolling between the left workbench column and the right notebook/case-file rail
- kept Developer Mode unchanged while correcting the Student Mode desktop flow

Verification:

- live user validation confirmed the support-panel flow is now correct
- `npm run test --workspace apps/web`
- Result: `7` test files passed, `30` tests passed

## Gemini Audit Results

Audit complete. PASS.

Verified:

- only approved files were modified
- the Student workbench remains the primary desktop investigation surface
- the Query Runner is reachable within the left column
- the left and right workbench columns still scroll independently
- the support accordions now flow after the workbench instead of feeling viewport-anchored
- Developer Mode behavior remains unchanged

Flags:

- none

## Final Decision

Approved.


