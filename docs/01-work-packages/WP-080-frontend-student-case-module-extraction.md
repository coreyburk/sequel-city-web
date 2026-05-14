# WP-080: Frontend Student Case Module Extraction

## Objective

Improve frontend readability by extracting Student Mode case data, types, and pure progression helpers out of `App.tsx` without changing runtime behavior or student experience.

## Scope

### In Scope
- Move Student Mode case constants, milestone definitions, Samuel copy, and expected report metadata into a dedicated module.
- Move pure helper functions for Samuel visuals/reactions, scene selection, Case Review, lead cards, available leads, and visible milestones into that module.
- Keep `App.tsx` responsible for state, event handlers, and rendering.
- Preserve all existing Student Mode behavior, copy, tests, and styling.
- Run web test and build gates.

### Out of Scope
- UX/copy changes.
- CSS restructuring.
- Backend, API, database, route, runtime AI, or artwork changes.
- Changing progression rules, evidence validation, rewards, or lead gating.
- Splitting React render sections into multiple components; that can be a later refactor WP.

## Files Allowed to Change

- `docs/01-work-packages/WP-080-frontend-student-case-module-extraction.md`
- `apps/web/src/App.tsx`
- `apps/web/src/studentCase.ts`

## Constraints

- Refactor only; do not change visible behavior.
- Preserve existing tests and test expectations.
- Do not add dependencies.
- Keep comments sparse; prefer clear names and smaller modules.
- Do not touch `styles.css` or component files in this WP.

## Required Behavior

- Student Mode should render and progress exactly as before.
- Developer Mode should remain unaffected.
- Web tests must pass.
- Web build must pass.
- The extracted module should make the case/progression model easier for a junior developer to scan.

## Acceptance Criteria

- [x] `App.tsx` no longer owns Student Mode case constants and pure progression helpers.
- [x] Extracted types/constants/helpers are grouped in a clear frontend module.
- [x] No UX, copy, CSS, backend, or API behavior changes are introduced.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No files outside the allowed list are modified.

## Codex Prompt

Implement WP-080.

Scope:
- Only modify the allowed files.

Constraints:
- Refactor only.
- Preserve all behavior, tests, copy, and styling.
- Keep `App.tsx` focused on state/event/rendering while moving case data and pure helpers out.

Return:
- Exact files changed.
- Verification results.

## Gemini Audit Prompt

Audit WP-080 against the refactor-only objective.

Verify:
- All acceptance criteria are satisfied.
- Changed files stay within the allowed list.
- Student Mode behavior, copy, progression, and tests are preserved.
- The extracted module improves readability without adding new abstractions that change behavior.
- Web tests and build pass.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-080.

Changes made:

- Added `apps/web/src/studentCase.ts` as a dedicated Student Mode case module.
- Moved case data and types out of `App.tsx`, including:
  - case metadata and known facts
  - Samuel intro/header copy
  - briefing steps
  - milestone definitions
  - expected report metadata
  - Case Review types
  - Student Mode visual/progression types
- Moved pure progression helpers out of `App.tsx`, including:
  - Samuel avatar state/source selection
  - case momentum
  - scene visual selection
  - Samuel reaction text
  - lead board card selection
  - Case Review question selection
  - available lead and visible milestone selection
- Kept `App.tsx` responsible for application state, handlers, rendering, and the local `StudentSchemaTable`.
- Preserved all existing Student Mode copy, progression rules, validation behavior, and styling.
- Reduced `App.tsx` from about 73 KB to about 56 KB; the extracted `studentCase.ts` is about 18 KB.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` passed.
- Generated build artifacts were removed after verification.

## Gemini Audit Results

I have completed the audit of Work Package **WP-080: Frontend Student Case Module Extraction**.

### Verdict: PASS

The implementation is a clean, surgical refactor that successfully extracts Student Mode data and pure logic into a dedicated module while preserving all existing behavior and technical integrity.

### Acceptance Criteria Verification

- **[x] Extraction of Case Constants & Helpers:** `App.tsx` no longer contains the bulk of Student Mode constants (`SAMUEL_TUPLETON_STEPS`, `CASE_004_MILESTONES`, etc.) or pure helper functions. These are now imported from `./studentCase`.
- **[x] Dedicated Module Organization:** `apps/web/src/studentCase.ts` provides a clear, well-typed foundation for Case 004 metadata, types, and progression helpers.
- **[x] Behavioral Preservation:** Student Mode renders, progresses, and reacts exactly as before. State management, event handling, and rendering remains correctly in `App.tsx`.
- **[x] Test & Build Integrity:**
  - `npm run test --workspace apps/web` passes (34 tests).
  - `npm run build --workspace apps/web` passes.
- **[x] Scope Compliance:** Only the three allowed files were modified. `App.test.tsx` remains untouched, confirming the component's external behavior is unchanged.

### Observations

- **Readability:** `App.tsx` was reduced from ~73 KB to ~56 KB, making the core component logic significantly easier to scan.
- **Logic Purity:** The extracted functions (e.g., `getSamuelReaction`, `getCaseMomentum`) are pure and depend only on their inputs, which is an architectural improvement.
- **Copy Integrity:** All Samuel mentor copy and briefing steps were moved without alteration to wording or structure.

### Violations
- **None.**

### Regressions
- **None.**

### Drift Risks
- **None.** The refactor strictly adheres to the "refactor-only" constraint and does not introduce new abstractions that change runtime behavior. Minor dynamic feedback strings remaining in `App.tsx` event handlers are acceptable as they are tied to local state transitions rather than static case data.

## Final Decision

Accepted.

WP-080 is accepted based on the passing audit and verification. The implementation may be committed and pushed as one cohesive frontend refactor work package.

