# case 004 milestone progression and guided clue flow

## Objective

Implement milestone-driven progression for Case #004 in Student Mode so learners get structured, spoiler-safe guidance through multiple valid investigation paths instead of a rigid fixed step order.

## Scope

### In Scope

- Add a Student Mode "Case Progress" milestone panel for Case #004.
- Track milestone completion from executed query text patterns.
- Show multi-path clue guidance from the set of remaining incomplete milestones.
- Keep guidance spoiler-safe and evidence-process oriented.
- Keep query execution backend-authoritative and unchanged.
- Add focused frontend tests for milestone panel rendering and query callback wiring.

### Out of Scope

- Backend or API changes.
- New persistence or user profile state.
- Automatic suspect reveal or answer key exposure.
- Developer Mode redesign.

## Files Allowed to Change

- docs/01-work-packages/WP-045-case-004-milestone-progression-and-guided-clue-flow.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

## Constraints

- Preserve existing query execution flow and response rendering.
- Keep guidance deterministic and spoiler-safe.
- Do not infer correctness from frontend-only logic; track only query-pattern milestones.
- Keep Student Mode compact.

## Required Behavior

- Student Mode includes a Case Progress section with milestone checklist.
- Milestones map to major assignment flow stages, such as:
  - crime type/report discovery
  - narrowed crime scene filtering
  - witness extraction
  - gym/member clue chain
  - trigger-man verification
  - mastermind trace path
- Query execution in QueryRunner notifies parent shell with executed SQL and result status.
- App updates milestone completion when matching query patterns are executed.
- App displays an "Available Leads" set from remaining incomplete milestones, allowing non-linear progression.

## Acceptance Criteria

- [ ] Case Progress panel appears in Student Mode and lists Case #004 milestones.
- [ ] Available lead guidance updates from remaining incomplete milestones (non-linear progression).
- [ ] QueryRunner emits query execution callback data to the parent app.
- [ ] Milestone completion updates when matching query patterns are executed.
- [ ] Existing query execution behavior and tests remain stable.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-045 milestone progression and guided clue flow for Case #004.

Do:

- add case progress milestone UI in Student Mode
- wire query callback from QueryRunner to App
- implement spoiler-safe milestone matching from query text
- show available-leads guidance tied to milestone state
- update tests

Do not:

- change backend/API behavior
- reveal final answers directly in guidance
- add dependencies

Return:

- files changed
- milestone behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-045 case milestone progression and guided clue flow.

Verify:

1. Only allowed files were modified.
2. Student Mode includes Case Progress milestone panel.
3. QueryRunner callback wiring exists and is used by App.
4. Milestones update from query-pattern execution events.
5. Guidance remains spoiler-safe and process-oriented.
6. Existing query execution behavior remains intact.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-045 to define milestone progression and guided clue flow for Case #004.
- Implemented Student Mode `Case Progress` panel with milestone checklist.
- Added spoiler-safe `Available Leads` guidance based on remaining incomplete milestones.
- Added query execution callback wiring from `QueryRunner` to `App`.
- Implemented query-pattern milestone completion tracking for key investigation phases:
  - crime type/report discovery
  - crime scene filtering
  - witness clue extraction
  - gym clue chain
  - trigger-man solution check
  - mastermind trace path
- Preserved backend query execution behavior and response rendering.
- Added/updated frontend tests for Case Progress rendering and QueryRunner callback behavior.

Updated Files:

- docs/01-work-packages/WP-045-case-004-milestone-progression-and-guided-clue-flow.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Case Progress panel appears in Student Mode and lists Case #004 milestones.
- [x] Available lead guidance updates from remaining incomplete milestones (non-linear progression).
- [x] QueryRunner emits query execution callback data to the parent app.
- [x] Milestone completion updates when matching query patterns are executed.
- [x] Existing query execution behavior and tests remain stable.
- [x] No files outside allowed list changed.

## Gemini Audit Results

The audit of **WP-045: Case Milestone Progression and Guided Clue Flow** is complete. The implementation successfully introduces structured investigation tracking for Case #004 in Student Mode while maintaining the integrity of the existing query execution system.

### Verdict: PASS

#### Verification Summary
1.  **Allowed Files:** Only the six files specified in WP-045 were modified.
2.  **Case Progress Panel:** The `Case Progress` section is correctly implemented in `App.tsx` and appears only in Student Mode. It includes a milestone checklist and dynamic "Next Clue" guidance.
3.  **QueryRunner Callback:** `QueryRunner.tsx` was successfully extended with an `onExecutionComplete` prop. `App.tsx` utilizes this callback to receive executed SQL and update milestone states.
4.  **Milestone Updates:** Milestone tracking logic in `App.tsx` uses regex-like pattern matching (normalized for case and whitespace) to detect key investigation steps (e.g., filtering `CrimeSceneReport`, tracing `FitNFlabClub` leads).
5.  **Spoiler-Safe Guidance:** Clue prompts (e.g., "Start with `CrimeType` and `CrimeSceneReport`") provide process-oriented direction without revealing specific data values or solutions, adhering to the project's learning principles.
6.  **Query Execution Integrity:** The core query execution flow remains backend-authoritative. `QueryRunner` continues to emit queries to the API and render results independently of the milestone tracking logic.

#### Violations
- **None.** All changes are within the defined scope and follow the project's architectural constraints.

#### Regressions
- **None.** Existing functionality in Developer Mode and standard query execution behavior remains stable.

#### Drift Risks
- **Integration Test Coverage:** While `App.test.tsx` verifies the presence of the progress panel and `QueryRunner.test.tsx` verifies callback emission, there is no integration test in `App.test.tsx` that simulates a query execution to verify that milestones actually update in the UI. This relies on manual verification or future integration tests.
- **Pattern Matching Brittleness:** The milestone matching logic in `App.tsx` (e.g., `sql.includes("from crimetype")`) is effective for standard student queries but may miss valid SQL variations (e.g., using unusual aliasing or quoting). This is acceptable for the current prototype phase but may require more robust parsing in the future.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Approved.

Reason:
Gemini audit returned PASS and WP-045 requirements are satisfied. Case progression now supports structured, spoiler-safe, multi-path investigation guidance while preserving backend-authoritative query execution behavior.

