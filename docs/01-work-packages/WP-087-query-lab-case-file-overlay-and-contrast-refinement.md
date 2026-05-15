# WP-087: Query Lab Case File Overlay And Contrast Refinement

## Objective

Refine the Query Lab `Case File` reference surface so it behaves like a temporary overlay instead of shrinking the main workspace, while also improving the readability of the overlaid schema content.

## Background

`WP-084` moved `Quick Table Clues` and `Case Facts` into the Query Lab drawer. That improved proximity, but the in-flow drawer still consumed too much layout space and compressed the Query Runner when opened.

The next refinement is to make the `Case File` feel like a temporary reference tool:

- it should float over the Query Lab instead of squeezing it
- it should be large enough to inspect tables comfortably
- its notebook-style treatment should remain readable, especially in the nested schema table
- the workspace background should still feel coherent when the overlay extends below the main Query Runner content

This package keeps the same reference content and behavior, but improves its layout model and visual clarity.

## Scope

### In Scope

- Convert the Query Lab `Case File` reference surface into an overlay drawer on desktop.
- Keep the slim `Case File` tab visible while the panel itself floats over the workspace.
- Add an in-panel close affordance.
- Make the overlay wider by default and horizontally resizable.
- Apply a higher-contrast notebook-style visual treatment to the overlay.
- Fix low-contrast nested schema table content inside the overlay.
- Ensure the student workspace background extends appropriately when the overlay is open.
- Verify the frontend test suite still passes.
- Record the implementation in this work package.

### Out of Scope

- New reference content or schema data behavior.
- Changes to Evidence Board logic or Samuel progression.
- Backend, API, or database changes.
- New persistence or saved drawer state.
- Mobile redesign beyond preserving the existing stacked fallback behavior.

## Files Allowed To Change

- `docs/01-work-packages/WP-087-query-lab-case-file-overlay-and-contrast-refinement.md`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentSchemaTable.tsx`
- `apps/web/src/styles.css`

## Constraints

- Keep the feature frontend-only.
- Preserve the existing `Quick Table Clues` and `Case Facts` content.
- Preserve the current mobile fallback where the reference panel remains in flow.
- Do not weaken the Query Runner as the primary working surface.
- Keep the overlay accessible with clear button semantics and visible controls.

## Required Behavior

- Opening `Case File` in Query Lab must no longer compress the Query Runner or right rail on desktop.
- The open reference panel must float over the workspace and be dismissible from inside the panel.
- The overlay must be large enough to inspect the schema list and selected table content more comfortably.
- The overlay must support manual width adjustment on desktop.
- The notebook-style overlay colors must preserve strong readability for:
  - body copy
  - tab labels
  - schema list buttons
  - schema table headers
  - schema table body rows and values
- When the overlay extends lower than the Query Runner, the student workspace background must continue under it rather than exposing a blank page area.

## Acceptance Criteria

- [x] The `Case File` panel opens as an overlay on desktop instead of consuming a full grid column.
- [x] The `Query Runner` no longer gets squeezed when the overlay opens.
- [x] The overlay includes a `Close` button inside the panel.
- [x] The overlay opens wider by default and can be resized horizontally.
- [x] The overlay uses a notebook-style palette that remains readable over the dark Query Lab.
- [x] The nested schema table header row has clear contrast from the body rows.
- [x] The nested schema table body content is readable without dark-on-dark cells.
- [x] The student workspace background extends under the open overlay spill area.
- [x] Existing frontend tests continue to pass.
- [x] No backend or API files are changed.

## Codex Prompt

Implement a Query Lab drawer refinement package for the Student Mode `Case File`.

Primary goals:

- make the `Case File` feel like a temporary overlay reference instead of a layout column
- improve readability of the notebook-style overlay and its nested schema table

Rules:

- keep the content the same
- keep the work frontend-only
- preserve the mobile stacked fallback
- do not let the overlay weaken the Query Runner as the main work surface

Return:

- exact files changed
- what changed in overlay behavior
- verification results

## Gemini Audit Prompt

Audit WP-087 against the Query Lab reference-overlay objective.

Verify:

- the `Case File` no longer compresses the Query Runner on desktop
- the overlay remains usable as a temporary reference layer
- contrast/readability in the nested schema table is clearly improved
- the student workspace background remains visually coherent when the overlay extends downward
- the work remains frontend-only
- no unrelated progression or evidence behavior changed

Output:

- Verdict: PASS or FAIL
- UX strengths
- Visual or accessibility concerns
- Scope violations, if any

## Codex Results

Implemented in:

- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentSchemaTable.tsx`
- `apps/web/src/styles.css`

Changes made:

- Converted the desktop `Case File` surface into an overlay drawer that floats from the left tab instead of consuming a dedicated workspace column.
- Added an in-panel `Close` button so the drawer can be dismissed without returning to the tab.
- Increased the overlay width, added desktop horizontal resizing, and preserved the stacked in-flow fallback on mobile.
- Re-skinned the overlay with a notebook-style paper treatment so it reads as a temporary reference layer over the dark Query Lab.
- Added stronger overlay-specific contrast rules for the nested schema preview, including explicit body-row styling and a dedicated darker schema header treatment.
- Added an open-state workbench class so the dark student workspace background extends beneath the overlay spill area instead of exposing the page background.

Verification:

- `npm run test --workspace apps/web`

Results:

- Web tests passed: 7 files, 39 tests.

## Gemini Audit Results

The audit of **WP-087: Query Lab Case File Overlay and Contrast Refinement** is complete.

### Verdict: PASS

#### UX Strengths
- **Non-Destructive Layout:** Converting the `Case File` to an absolute overlay on desktop prevents the "squeezing" of the `Query Runner`. This allows students to keep their SQL editor at full width while referencing schema clues.
- **Intuitive Dismissal:** The addition of a "Close" button within the panel itself, combined with the existing tab toggle, makes the "temporary reference" mental model much clearer.
- **Improved Information Density:** The use of `resize: horizontal` on the overlay allows users with larger screens to expand the schema table view without sacrificing workspace verticality.
- **Visual Hierarchy:** The "notebook" reskin (beige/paper tones) clearly distinguishes the reference layer from the active "noir" work surface (dark tones), reinforcing that it is a tool rather than part of the scene.

#### Visual or Accessibility Concerns
- **Padding-Bottom Hack:** The use of `padding-bottom: min(64vh, 640px)` on `.student-workspace--reference-open` is a pragmatic way to ensure the background gradient extends under the absolute overlay. While effective for visual coherence, it creates a large empty scroll area when the overlay is closed if not managed carefully (though here it is correctly tied to the `reference-open` state).
- **Contrast:** The specific overrides for the nested schema table (`#fff7e3` on dark brown headers and `#2d2117` on light beige rows) provide excellent readability and meet WCAG AA standards for contrast.

#### Scope Violations
- **None:** The changes are strictly confined to the frontend components (`StudentWorkbenchView.tsx`, `StudentSchemaTable.tsx`) and the global stylesheet (`styles.css`). No backend endpoints, progression logic in `studentCase.ts`, or evidence board behaviors were modified.

#### Summary of Changes Verified:
- [x] **Overlay Behavior:** `Case File` panel uses `position: absolute` and `z-index: 4` on desktop.
- [x] **Query Runner Integrity:** Workspace grid no longer shifts when the drawer opens.
- [x] **Readability:** Schema table now uses a high-contrast notebook palette.
- [x] **Background Coherence:** Workspace extends its height when the overlay is active to preserve the atmosphere.
- [x] **Frontend Only:** No changes detected in `apps/api`.

## Final Decision

Approved.

