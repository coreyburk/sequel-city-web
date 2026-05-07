# student story card and adventure scene refinement

## Objective

Refine Student Mode into a compact adventure-style learning surface with a stronger product name, concise case metadata narration, and per-step visual scene elements that enhance storytelling.

## Scope

### In Scope

- Update app title to a broader multi-case name.
- Rework Story Narration into concise multi-line case metadata:
  - Case #
  - Case Name
  - Short description
- Ensure narration content updates as story steps progress.
- Add per-step graphical scene variations for storytelling in Student Mode.
- Tighten overall Student Mode layout spacing to reduce scrolling.
- Update frontend tests for title and narration behavior.

### Out of Scope

- Backend changes.
- API contract changes.
- Query execution logic changes.
- Developer Mode workflow redesign.
- New dependencies.

## Files Allowed to Change

- docs/01-work-packages/WP-044-student-story-card-and-adventure-scene-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css

## Constraints

- Keep Student Mode default.
- Preserve backend-authoritative and presentation-only boundaries.
- Keep Query Runner and Schema Snapshot functionality intact.
- Keep Developer Mode functional and intentionally sterile.

## Required Behavior

- Header title uses a broader multi-case identity suitable for future cases.
- Story Narration displays case metadata in concise multi-line format.
- Story narration updates when `Next`/`Previous` changes the active step.
- Visual scene area changes per step (graphical elemental per step).
- Student Mode spacing is further compacted to reduce vertical scrolling.

## Acceptance Criteria

- [ ] Header title is updated to broader multi-case product naming.
- [ ] Story Narration shows Case #, Case Name, and concise description.
- [ ] Story content changes correctly across story steps.
- [ ] Visual scene changes across story steps.
- [ ] Student Mode layout is denser and requires less scrolling.
- [ ] Frontend tests reflect updated title and narration behavior.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-044 story card and scene refinement.

Do:

- update app title for multi-case roadmap
- convert narration to compact case metadata card
- add per-step visual scene variants
- tighten student layout spacing
- update tests

Do not:

- change backend/API behavior
- add dependencies

Return:

- files changed
- behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-044 student story card and adventure scene refinement.

Verify:

1. Only allowed files were modified.
2. Title update supports multi-case direction.
3. Narration card includes Case #, Case Name, and concise description.
4. Story and visual scene both change with step progression.
5. Student Mode density is improved without breaking functionality.
6. Tests cover updated title and story progression behavior.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-044 to define student story-card and adventure-scene refinements.
- Updated app title from `Sequel City Web Detective` to `Sequel City Case Files` to support multi-case direction.
- Reworked Story Narration into concise case metadata format with:
  - Case #
  - Case Name
  - Description
- Updated story progression behavior so narration metadata changes by active step.
- Added per-step scene variation classes and visuals for storytelling atmosphere.
- Tightened Student Mode layout density to reduce scroll depth.
- Updated App tests for title change and story progression content updates.

Updated Files:

- docs/01-work-packages/WP-044-student-story-card-and-adventure-scene-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Header title is updated to broader multi-case product naming.
- [x] Story Narration shows Case #, Case Name, and concise description.
- [x] Story content changes correctly across story steps.
- [x] Visual scene changes across story steps.
- [x] Student Mode layout is denser and requires less scrolling.
- [x] Frontend tests reflect updated title and narration behavior.
- [x] No files outside allowed list changed.

## Gemini Audit Results

The audit of WP-044 is complete.

### Audit Summary

The implementation successfully transforms the Student Mode into a compact, adventure-style interface with a multi-case identity. The app title has been updated to **"Sequel City Case Files"**, and the story narration is now a structured metadata card. Visual scene progression is implemented through distinct CSS classes for each story step, and the layout density has been significantly improved using a combination of tighter spacing and responsive grid layouts.

### Verification Results

1.  **Only allowed files were modified:** **PASS**. The `glob` search confirms that only the four specified files (`App.tsx`, `App.test.tsx`, `styles.css`, and the WP document itself) were the most recently modified.
2.  **Title update supports multi-case direction:** **PASS**. Updated to "Sequel City Case Files".
3.  **Narration card includes Case #, Case Name, and concise description:** **PASS**. Verified in `App.tsx` using a definition list (`dl`) with the required fields.
4.  **Story and visual scene both change with step progression:** **PASS**. The `STORY_STEPS` array defines distinct content and scene classes for each step, which are correctly indexed and rendered.
5.  **Student Mode density is improved without breaking functionality:** **PASS**. CSS refinements (reduced padding, grid layouts, and compact `min-height` for visuals) effectively reduce scroll depth.
6.  **Tests cover updated title and story progression behavior:** **PASS**. `App.test.tsx` has been updated to verify the new title, the presence of metadata labels, and the progression of narration text.

### Final Verdict: **PASS**

#### Violations
- None.

#### Regressions
- None. Developer Mode and Schema Snapshot functionality remain intact and verified by tests.

#### Drift Risks
- **Hardcoded Story Data:** Story steps are currently hardcoded in `App.tsx`. As the "multi-case" roadmap expands, this logic should eventually transition to a backend-driven or configuration-based model to avoid `App.tsx` becoming bloated.
- **Redundant Labeling:** The `caseNumber` data (e.g., `"Case #004"`) is displayed next to a `"Case #"` label, resulting in "Case # Case #004" in the UI. This is a minor aesthetic point but technically fulfills the requirement.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Approved.

Reason:
Gemini audit returned PASS with no violations or regressions, and implementation meets WP-044 acceptance criteria for naming, concise narration metadata, step-based scene progression, compact student layout, and updated frontend test coverage.

