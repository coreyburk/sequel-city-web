# WP-232 - SDK Manager Readiness Guidance Consumption

## Objective

Make the SDK manager recommendation and orchestration dry-run surfaces explicitly consume and surface the agentic workflow decision router's readiness and serial fixture-test guidance.

## Scope

### In Scope
- Add explicit SDK manager recommendation JSON fields for decision-router `readiness` and `testExecutionGuidance`.
- Add explicit SDK manager orchestration dry-run JSON fields that carry the recommendation layer's readiness and test-execution guidance.
- Add text output lines for validation readiness and test-execution guidance on both SDK manager commands when guidance is available.
- Extend SDK manager recommendation and orchestration dry-run tests to assert the new JSON and text contract.
- Refresh tracked Understand graph artifacts after implementation because scoped workflow scripts/tests change.

### Out of Scope
- No changes to `scripts/agentic-workflow/get-agentic-workflow-status.ps1` or `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`.
- No changes to lifecycle helper parsing, audit wrappers, commit helpers, work-package creation helpers, or graph refresh wrappers.
- No SDK dependency installation, package manifest changes, lockfile changes, runtime AI execution, external network calls, or app runtime changes.
- No changes to the future SDK prototype under `tools/openai-agents-sdk/`.
- No documentation-roadmap expansion beyond this work package and normal handoff closeout.

## Impact Analysis

### Understand Status
- Graph available: Yes, `.understand-anything/knowledge-graph.json` and supporting artifacts are present.
- Baseline commit: `.understand-anything/meta.json` records `62291e3179f6c7f3b95728616400ca6511977942`.
- Freshness assessment: Usable with non-structural metadata drift. The latest accepted WP-231 closeout commit is `021b7bd`, and the post-baseline diff consists of the accepted WP-231 readiness-routing implementation, tests, handoff, WP document, and tracked graph artifacts. Source/test verification was used for the SDK manager surface before writing this package.
- Analysis performed:
  - Verified `main` was aligned with `origin/main` and clean before package creation.
  - Reviewed SDK manager recommendation and orchestration dry-run implementation surfaces with `rg` and targeted source reads.
  - Reviewed related SDK manager tests and WP-231 readiness producer tests with `rg`.
  - Checked graph references for SDK manager scripts/tests and roadmap/readiness documents.

### Affected Architecture
- Layers: development-time workflow tooling only.
- Primary files/components:
  - `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
  - `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- Upstream producers:
  - `scripts/agentic-workflow/get-agentic-workflow-decision.ps1` already places `readiness` and `testExecutionGuidance` inside `recommendation`.
  - `scripts/agentic-workflow/get-agentic-workflow-status.ps1` already produces the readiness and serial fixture-test guidance source data.
- Downstream consumers:
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-sdk-manager-orchestration-dry-run.ps1`
  - Future development-time SDK manager recommendation/orchestration workflows documented in `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`.

### Regression Surface
- Related tests:
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - direct JSON/text smoke commands for both SDK manager surfaces
- User workflows:
  - Previewing the next work-package action through `scripts/get-sdk-manager-recommendation.ps1`.
  - Previewing orchestration intent through `scripts/get-sdk-manager-orchestration-dry-run.ps1`.
  - Choosing serial execution for work-package fixture tests when the workflow decision says fixture tests should not run in parallel.
- Security/data boundaries:
  - Commands remain read-only, dry-run, dependency-free, and forbidden to execute workflow command previews.
  - Test-only decision snapshot input remains guarded by `-AllowTestDecisionSnapshot`.
  - No external audit dispatch, graph refresh, commit, push, network call, package install, or runtime AI execution is authorized by this package.

### Graph Update Decision
- Regeneration required: Yes, during implementation closeout.
- Rationale: The package changes tracked workflow scripts/tests under `scripts/**`, which affects the Understand graph's script/test relationships. Refresh the graph within this same implementation package rather than creating a separate graph-only WP.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-232-sdk-manager-readiness-guidance-consumption.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
- `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`

Do Not Modify:

- `scripts/agentic-workflow/get-agentic-workflow-status.ps1`
- `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`
- `scripts/work-package/**`
- `scripts/audit-work-package.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/run-work-package.ps1`
- `tools/openai-agents-sdk/**`
- `package.json`
- lockfiles
- `apps/**`
- database or release-readiness artifacts

## Constraints

- Preserve all existing SDK manager action mapping, command-preview, blocker, authorization, source, and evidence behavior unless this package explicitly adds readiness/test-guidance surfacing.
- Preserve additive output compatibility: existing JSON fields must remain present and keep their current meaning.
- Preserve text output readability without requiring JSON for the new guidance.
- Do not execute command previews, workflow tests, graph refresh, audits, commits, or pushes from the SDK manager commands.
- Keep test fixtures serial when running this package's work-package fixture tests. Do not parallelize SDK manager fixture tests.
- No broad refactors, renames, helper relocations, new dependencies, or future SDK manager implementation work.

## Required Behavior

- `scripts/sdk-manager/get-sdk-manager-recommendation.ps1` must explicitly read `decision.recommendation.readiness` and `decision.recommendation.testExecutionGuidance` when available.
- The recommendation JSON result must expose top-level additive fields:
  - `readiness`
  - `testExecutionGuidance`
- When the decision router is blocked, unparseable, or unavailable, the recommendation result must still emit those fields with deterministic empty or unavailable values rather than omitting the contract.
- Recommendation text output must include validation readiness and test-execution guidance when those fields are available, including `run serially` wording when `requiresSerial` is true.
- `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1` must explicitly carry `recommendation.readiness` and `recommendation.testExecutionGuidance` to top-level additive orchestration fields:
  - `readiness`
  - `testExecutionGuidance`
- Orchestration text output must include the same validation readiness and test-execution guidance summaries without executing nested recommendation commands beyond the existing recommendation dry-run delegation.
- Evidence/source metadata should make it clear the guidance came from the decision router through the SDK manager recommendation layer.
- Existing protected paths must remain protected: unguarded test snapshots, unparseable recommendation output, invalid work packages, and blocked states must not preserve or execute workflow command previews beyond current behavior.

## Acceptance Criteria

- [ ] SDK manager recommendation JSON includes explicit top-level `readiness` and `testExecutionGuidance` fields sourced from the decision-router recommendation.
- [ ] SDK manager orchestration dry-run JSON includes explicit top-level `readiness` and `testExecutionGuidance` fields sourced from the nested recommendation.
- [ ] Text output for both SDK manager surfaces includes validation readiness and serial fixture-test guidance when available.
- [ ] Existing action mapping, authorization flags, blockers, command previews, dry-run flags, non-execution guarantees, and test-only snapshot guards are preserved.
- [ ] SDK manager fixture tests assert the new JSON/text contract and are run serially.
- [ ] Tracked Understand graph artifacts are refreshed after implementation and no transient Understand temp/trash/log artifacts are left behind.
- [ ] No files outside the allowed list are modified.

## Code Prompt

Implement WP-232 exactly as specified.

Scope:
- Only modify the files listed under "Files Allowed to Change".

Constraints:
- Do not modify the agentic workflow producer scripts.
- Do not install dependencies or implement a live SDK manager.
- Do not execute workflow command previews.
- Keep SDK manager fixture tests serial; do not parallelize the work-package fixture tests.
- Preserve all existing behavior except the additive readiness/test-guidance fields and text output.

Verification:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-232 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -WorkPackage WP-232 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- Refresh the Understand graph as part of this implementation package.
- `git diff --check`

Return:
- Exact code changes.
- Validation evidence.
- Graph refresh evidence.
- Next highest-ROI task after implementation.

## Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied
- No files outside allowed list were modified
- No functional regression
- Behavior remains consistent outside scope
- Impact analysis matches the actual changed files
- Dependencies and related tests were not omitted
- Graph regeneration decision was followed
- Understand output did not override SSOT or source evidence
- SDK manager recommendation and orchestration outputs explicitly surface readiness and serial fixture-test guidance rather than only tolerating nested additive fields
- Fixture tests were run serially

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Missing validation evidence
- Graph artifact concerns

## Code Results

Implemented WP-232.

Changes:
- Added deterministic readiness and test-execution guidance objects to the SDK manager recommendation layer.
- Added top-level recommendation JSON fields:
  - `readiness`
  - `testExecutionGuidance`
- Added SDK manager recommendation text summaries for validation readiness and test-execution guidance, including `run serially` wording when applicable.
- Added top-level orchestration dry-run JSON fields:
  - `readiness`
  - `testExecutionGuidance`
- Added orchestration text summaries for the same guidance while preserving dry-run, non-execution behavior.
- Added evidence entries that identify readiness and test-execution guidance availability from the decision router.
- Extended SDK manager recommendation and orchestration tests to assert the new JSON/text contract, deterministic unavailable guidance for blocked paths, and serial guidance for WP-232.
- Refreshed tracked Understand graph artifacts in this implementation package.

Validation:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-232 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -WorkPackage WP-232 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`

Graph refresh:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
- Result: filesScanned=593, graph nodes=909, edges=316, layers=6, tourSteps=7, fingerprints baseline=593 files.
- PASS: post-refresh `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`

Next highest-ROI task after WP-232 acceptance:
- Create a narrow WP to make the SDK manager recommendation/orchestration text and JSON output provide an explicit operator handoff summary for the next required human action, using the now-surfaced readiness and serial test guidance without executing workflow commands.

## Audit Results

I have launched the verification test task in the background and will inspect the logs once execution completes.
I'm waiting for task-94 (`test-sdk-manager-recommendation.ps1`) to finish executing.
I'm waiting for task-112 (`test-sdk-manager-recommendation.ps1`) to finish.
I'm waiting for task-127 (`get-sdk-manager-recommendation.ps1`) to finish.
### Audit Results for WP-232

**Verdict:** PASS

---

### Verification Summary

1. **Acceptance Criteria**: **SATISFIED**
   - SDK manager recommendation JSON explicitly surfaces top-level `readiness` and `testExecutionGuidance` fields populated from the decision router.
   - SDK manager orchestration dry-run JSON explicitly surfaces top-level `readiness` and `testExecutionGuidance` fields mirrored from the nested recommendation layer.
   - Text output for both recommendation and orchestration dry-run surfaces formats validation readiness and serial test execution guidance (`run serially`) when available.
   - Existing action mappings, authorization flags, blockers, command preview protections, non-execution dry-run guarantees, and test-only snapshot guards (`-AllowTestDecisionSnapshot`) are preserved.
   - Tracked Understand graph artifacts were regenerated post-implementation and clean readiness was verified.

2. **Allowed Files Enforcement**: **PASS**
   - Modified tracked files:
     - [get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-recommendation.ps1)
     - [get-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1)
     - [test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1)
     - [test-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-orchestration-dry-run.ps1)
     - [.understand-anything/knowledge-graph.json](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/knowledge-graph.json)
     - [.understand-anything/fingerprints.json](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/fingerprints.json)
     - [.understand-anything/meta.json](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/meta.json)
     - [.understand-anything/intermediate/scan-result.json](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/intermediate/scan-result.json)
   - Untracked file:
     - [WP-232-sdk-manager-readiness-guidance-consumption.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-232-sdk-manager-readiness-guidance-consumption.md)
   - **0** files outside the allowed list were modified. Producer scripts ([get-agentic-workflow-decision.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/agentic-workflow/get-agentic-workflow-decision.ps1) and [get-agentic-workflow-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/agentic-workflow/get-agentic-workflow-status.ps1)) remained untouched.

3. **Functional Regressions**: **NONE**
   - Non-execution, dry-run guarantees are preserved (`forbiddenToExecute: true`, `executed: false`).
   - Fallback constructors (`New-EmptyReadiness` and `New-EmptyTestExecutionGuidance`) ensure deterministic contract shapes on blocked or unparseable inputs.

4. **Consistency Outside Scope**: **PASS**
   - Additive JSON schema expansion preserves full backwards compatibility with existing consumers expecting `kind`, `workPackage`, `statusState`, `recommendedAction`, `commandPreview`, `requiresHumanAuthorization`, `requiresExternalAuthorization`, `forbiddenToExecute`, `blockers`, `evidence`, and `source`.

5. **Impact Analysis & Dependencies**: **ALIGNED**
   - Impact analysis matched the exact set of workflow scripts, test suites, and graph artifacts. All related test suites were updated to assert top-level properties and text output formatting.

6. **Graph Regeneration & SSOT Integrity**: **FOLLOWED**
   - Understand graph artifacts were fully refreshed post-implementation (`593` files scanned, `909` nodes, `316` edges).
   - Structural graph updates did not override SSOT work packages or decision router evidence.

7. **Readiness & Serial Guidance Surfacing**: **VERIFIED**
   - Recommendation and orchestration dry-run outputs explicitly promote readiness and test-execution guidance into top-level properties rather than hiding them solely inside nested objects.

8. **Serial Test Execution**: **VERIFIED**
   - Tests assert `requiresSerial: true` guidance and were run sequentially.

---

### Audit Output Checklist

- **Verdict:** `PASS`
- **Violations:** None
- **Regressions:** None
- **Drift Risks:** None detected. Worktree status and graph fingerprints are fully synchronized.
- **Missing Validation Evidence:** None. JSON and text outputs for recommendation, orchestration, and graph readiness were verified live.
- **Graph Artifact Concerns:** None. `check-understand-refresh-readiness.ps1` confirms zero tracked artifact drift, zero temp/trash directories, and zero leftover log files.

## Final Decision

Accepted on 2026-08-07 after PASS audit and human closeout request.

The SDK manager recommendation and orchestration dry-run layers now explicitly surface readiness and serial fixture-test guidance while preserving dry-run, non-execution, dependency-free, and no-runtime-AI boundaries.

