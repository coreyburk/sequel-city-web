# WP-231 agentic workflow parser validation readiness routing

## Objective

Update the read-only agentic workflow status and decision-router outputs so parser readiness, validation readiness, and serial fixture-test execution guidance are explicit in both JSON and text output.

## Scope

### In Scope

- Add a small backward-compatible readiness summary to `scripts/agentic-workflow/get-agentic-workflow-status.ps1` output.
- Surface whether status-bundle component output parsed successfully, whether validation evidence is ready or still needs action, and whether work-package fixture tests should be run serially.
- Pass the relevant readiness/test-execution guidance through `scripts/agentic-workflow/get-agentic-workflow-decision.ps1` recommendations.
- Update human-readable text output for the status bundle and decision router so the same readiness guidance is visible without `-Json`.
- Add focused fixture coverage in existing agentic workflow status and decision tests.
- Refresh tracked Understand graph artifacts inside this WP after script/test changes and before audit.

### Out of Scope

- Changing lifecycle helper parsing behavior already covered by WP-230.
- Changing status, validation-plan, closeout, audit, commit, runner, package-creation, SDK manager, graph wrapper, or work-package resolver semantics.
- Changing top-level compatibility shim behavior.
- Adding execution, orchestration, audit dispatch, graph refresh, commit, push, dependency installation, or external calls to the status or decision helpers.
- Changing app, database, package, lockfile, runtime AI, OpenAI SDK prototype, student-package, or Case 004 behavior.
- Migrating command previews away from public top-level script paths.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/intermediate/scan-result.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `bd2bbb8714c82ddeebf988eb017da8394da34b34`
- Freshness assessment: Usable with non-structural metadata drift for this planning surface. Current `HEAD` is `62291e3b3f69dc8235939f02e8d6be7fd8f56781`. WP-230 refreshed graph artifacts from the implementation worktree before closeout, so the graph contains the lifecycle parser/test/doc changes even though `meta.json` records the pre-closeout HEAD used by the wrapper. The only commit after the recorded baseline is the accepted WP-230 closeout commit, which includes those same refreshed graph artifacts plus the WP record and handoff refresh.
- Analysis performed: Read workflow SSOT, work-package lifecycle guidance, Understand guidance, planning checklist, Agentic Workflow Roadmap, graph metadata, changed paths since the graph baseline, targeted graph entries for agentic workflow status/decision scripts and tests, current status/decision implementations, top-level shims, agentic workflow tests, and observed status/decision output for accepted WP-230.

### Affected Architecture

- Layers: Development workflow scripts, read-only agentic workflow recommendation layer, PowerShell fixture tests, generated Understand graph baseline.
- Primary files/components:
  - `scripts/agentic-workflow/get-agentic-workflow-status.ps1`
  - `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`
  - `scripts/tests/test-agentic-workflow-status.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
- Upstream consumers: Human developers resuming work, Codex WP planning/implementation/closeout workflows, future SDK manager recommendation tooling, `docs/05-development-workflow/Contributor-Workflow-Guide.md` workflow commands, `docs/05-development-workflow/Agentic-Workflow-Roadmap.md` workflow direction.
- Downstream dependencies: `scripts/get-agentic-workflow-status.ps1`, `scripts/get-agentic-workflow-decision.ps1`, `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`, `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`, existing agentic workflow and SDK manager tests.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows: resuming a WP, selecting implementation/audit/acceptance/finalization, reviewing validation evidence, deciding whether fixture tests should be run serially.
- Security/data boundaries: Development-only read-only helper output changes. No runtime AI, app behavior, database mutation, dependency installation, package/lockfile mutation, external audit dispatch, graph refresh side effects from status/decision helpers, destructive action, or restricted-data boundary changes.

### Graph Update Decision

- Regeneration required: Yes, inside this WP after implementation and before audit.
- Rationale: This package intentionally changes workflow scripts and tests under `scripts/**`. Per current lifecycle guidance, known structural workflow-tooling changes should include the tracked graph artifacts in the originating WP rather than creating a separate graph-refresh WP afterward.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-231-agentic-workflow-parser-validation-readiness-routing.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `scripts/agentic-workflow/get-agentic-workflow-status.ps1`
- `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`
- `scripts/tests/test-agentic-workflow-status.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`

Do Not Modify:

- `scripts/get-agentic-workflow-status.ps1`
- `scripts/get-agentic-workflow-decision.ps1`
- `scripts/work-package/**`
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`
- `scripts/check-work-package-closeout.ps1`
- `scripts/run-work-package.ps1`
- `scripts/audit-work-package.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/new-lite-work-package.ps1`
- `scripts/new-work-package.ps1`
- `scripts/understand/**`
- `scripts/student-package/**`
- `.codex/skills/**`
- `docs/00-ssot/SSOT-*.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md`
- `docs/02-product/**`
- `docs/03-architecture/**`
- `docs/04-api/**`
- `docs/06-operations/**`
- `apps/**`
- `database/**`
- `tools/**`
- `package.json`
- `package-lock.json`

## Constraints

- Preserve all existing JSON fields and state/action names in status, decision, and downstream SDK manager outputs.
- Add fields only in a backward-compatible way; do not remove or rename existing fields.
- Keep both status and decision helpers read-only and dry-run only.
- Do not add side effects beyond reading helper output and printing/serializing summaries.
- Do not make the decision router execute validation tests. It may recommend or preview only.
- Do not change lifecycle helper parser semantics from WP-230.
- Do not change top-level shims or public command-preview paths.
- Keep fixture-test serial guidance advisory and scoped to tests that create temporary work-package fixtures or dirty-worktree fixtures.
- Use focused tests; avoid broad refactors.
- Use `scripts/refresh-understand-graph.ps1` for graph refresh; do not manually edit graph artifacts.
- Do not leave Understand transient artifacts.

## Required Behavior

- Status JSON must include an additive readiness summary that makes component parse readiness explicit.
- Status JSON must include validation readiness derived from `validationRecommendation`, including at least the action, whether action is required, whether review is required, and whether audit readiness is blocked.
- Status JSON must include additive test-execution guidance that recommends serial execution when related validation commands/tests include work-package fixture tests that create temporary WP files or dirty-worktree fixtures.
- Status text output must print validation readiness in human-readable form, not only the raw validation recommendation action.
- Status text output must print serial fixture-test guidance when applicable.
- Decision JSON must pass through or mirror the status readiness/test-execution guidance inside `recommendation` without removing existing `validationPlan`, `blockers`, or `blockerDetails` fields.
- Decision text output must print validation readiness and serial fixture-test guidance when available.
- Existing implementation/audit/finalization command previews must remain dry-run strings and must continue to use public top-level script paths.
- Blocked, manual-review, no-work-package, closed, unparseable, and unguarded test-snapshot paths must not gain executable command previews.
- Existing SDK manager recommendation and orchestration dry-run tests must continue to pass or be updated only for additive field expectations.

## Acceptance Criteria

- [ ] `get-agentic-workflow-status.ps1 -Json` preserves existing output fields and adds stable readiness/test-execution guidance fields.
- [ ] Status JSON exposes component parse readiness for parsed, skipped, and unparsed/blocked component paths.
- [ ] Status JSON exposes validation readiness from the validation-plan recommendation.
- [ ] Status JSON recommends serial execution for work-package fixture tests when such tests are present in related validation commands or evidence.
- [ ] Status text output includes validation readiness and serial fixture-test guidance.
- [ ] `get-agentic-workflow-decision.ps1 -Json` preserves existing recommendation fields and includes the readiness/test-execution guidance from the status snapshot.
- [ ] Decision text output includes validation readiness and serial fixture-test guidance when present.
- [ ] Existing safe command-preview behavior is preserved; blocked/manual/no-work-package/closed/unparseable paths do not receive executable previews.
- [ ] Agentic workflow status and decision tests cover the new JSON and text output contract.
- [ ] SDK manager recommendation/orchestration tests still pass against the additive decision-router output.
- [ ] Top-level shims remain unchanged and continue delegating to moved implementations.
- [ ] Understand graph refresh runs after script/test changes and no transient Understand artifacts remain.
- [ ] No app, database, package, lockfile, dependency, runtime AI, external audit dispatch, commit-helper behavior, graph-refresh side effect, or Case 004 behavior changes.

## Code Prompt

Implement WP-231 exactly as scoped.

Update the agentic workflow status and decision-router outputs:

- In `scripts/agentic-workflow/get-agentic-workflow-status.ps1`, add a small additive readiness/test-execution guidance contract. Preserve existing fields. The new output should make component parse readiness, validation readiness, and serial fixture-test guidance explicit for both JSON and text output.
- In `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`, pass through or mirror that readiness/test-execution guidance inside `recommendation` while preserving existing recommendation fields and dry-run behavior.
- Update `scripts/tests/test-agentic-workflow-status.ps1` and `scripts/tests/test-agentic-workflow-decision.ps1` with focused assertions for the new JSON and text output behavior.
- Update `scripts/tests/test-sdk-manager-recommendation.ps1` and `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` only if their additive-output expectations need adjustment.
- Do not modify top-level shims, lifecycle helpers, SDK manager source, runner/audit/commit/package-creation helpers, repo skills, app code, database files, package files, dependencies, runtime AI behavior, graph wrapper behavior, or Case 004 behavior.

After script/test changes, run the related tests serially:

1. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
2. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
3. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
4. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
5. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
6. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
7. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
8. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
9. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
10. `git diff --check`
11. `git status --short --untracked-files=all`

Record implementation details, validation evidence, graph metadata, serial-test note, and any limitations in `Code Results`.

## Audit Prompt

Audit WP-231 against this work package, the workflow SSOT, lifecycle documentation, Agentic Workflow Roadmap, changed status/decision scripts, changed tests, downstream SDK manager tests, and refreshed graph artifacts.

Verify:

- Only allowed files changed.
- Status JSON preserves existing fields and adds readiness/test-execution guidance without renaming existing contract fields.
- Status output makes parser readiness, validation readiness, and serial fixture-test guidance clear in JSON and text modes.
- Decision JSON preserves existing recommendation fields and includes the readiness/test-execution guidance.
- Decision text output surfaces validation readiness and serial fixture-test guidance when present.
- Existing dry-run and no-execution boundaries remain intact.
- Blocked, manual-review, no-work-package, closed, unparseable, and unguarded test-snapshot paths do not gain executable command previews.
- Top-level shims remain unchanged.
- Agentic workflow and SDK manager tests pass, and work-package fixture tests are documented/run serially.
- Graph refresh ran inside this WP after script/test changes and no transient Understand artifacts remain.
- No app, database, package, lockfile, dependency, runtime AI, external audit dispatch, commit-helper behavior, graph-wrapper behavior, or Case 004 behavior changed.

Output:

- Verdict: PASS, FAIL, or unable to complete
- Scope violations
- Output-contract findings
- Readiness-guidance findings
- Execution-safety findings
- Missing validation evidence
- Graph artifact concerns
- Drift risks

## Code Results

Implemented WP-231.

Changed agentic workflow outputs:

- Updated `scripts/agentic-workflow/get-agentic-workflow-status.ps1` to add a backward-compatible `readiness` object with component parse readiness and validation readiness.
- Updated `scripts/agentic-workflow/get-agentic-workflow-status.ps1` to add `testExecutionGuidance`, which recommends `run_serially` when related validation commands include work-package fixture tests that create temporary WP files or dirty-worktree fixtures.
- Updated status text output to print validation readiness and test execution guidance.
- Updated `scripts/agentic-workflow/get-agentic-workflow-decision.ps1` to pass status readiness and test execution guidance through inside `recommendation` while preserving existing `validationPlan`, `blockers`, `blockerDetails`, route actions, and command-preview behavior.
- Updated decision text output to print validation readiness and test execution guidance when available.
- Left top-level compatibility shims unchanged.
- Did not change SDK manager source. Updated only SDK manager test fixture templates so temporary WPs allow the exact tracked graph artifacts that are in scope for WP-231 while graph refresh artifacts are dirty.

Added focused fixture coverage:

- `scripts/tests/test-agentic-workflow-status.ps1` now asserts parsed, skipped, and unparsed component readiness; validation readiness; JSON guidance fields; and serial fixture-test guidance in text and JSON output.
- `scripts/tests/test-agentic-workflow-decision.ps1` now asserts readiness/test-execution guidance pass-through in JSON output and text output while preserving route and command-preview safety checks.
- `scripts/tests/test-sdk-manager-recommendation.ps1` and `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` now keep temporary fixture scope compatible with active packages that legitimately include tracked graph refresh artifacts.

Validation performed serially:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1` passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1` passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1` passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` passed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness` passed and emitted `readiness.validation.action: run_planned_validation` plus `testExecutionGuidance.recommendation: run_serially`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness` passed and emitted the same readiness/test-execution guidance inside `recommendation`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` passed before and after graph refresh with READY status and no transient temp/trash/log artifacts.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json` passed before graph refresh with `ready: true`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` passed after script/test changes: scanned 592 files, produced 908 nodes, 316 edges, 6 layers, 7 tour steps, and fingerprinted 592 files.
- `.understand-anything/meta.json` records `gitCommitHash` `62291e3179f6c7f3b95728616400ca6511977942` and `analyzedFiles` 592.
- `git diff --check` passed. Git printed line-ending normalization warnings only.
- `git status --short --untracked-files=all` showed only WP-231 allowed files modified or untracked.

Serial-test note:

- The related fixture tests were run one at a time. `test-agentic-workflow-decision.ps1` and `test-sdk-manager-recommendation.ps1` create temporary work-package fixtures, so the new guidance intentionally recommends serial execution when those tests appear in related validation commands.

Notes:

- No app, database, package, lockfile, dependency, runtime AI, external audit dispatch, commit-helper behavior, top-level shim behavior, graph-wrapper behavior, SDK manager source behavior, or Case 004 behavior was changed.

## Audit Results

I am waiting for `test-agentic-workflow-decision.ps1` to finish in the background before proceeding with the remaining validation checks.
I am waiting for `test-sdk-manager-recommendation.ps1` to finish in the background.
I am waiting for `test-sdk-manager-orchestration-dry-run.ps1` to finish in the background.
### Audit Summary for WP-231

- **Verdict**: PASS
- **Scope violations**: None. All modified and untracked files match the allowed list in [`WP-231`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-231-agentic-workflow-parser-validation-readiness-routing.md#L71-L84). Top-level shims ([`scripts/get-agentic-workflow-status.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-status.ps1) and [`scripts/get-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-decision.ps1)), SDK manager source code, lifecycle helpers, repository skills, application code, database files, dependencies, package lockfiles, and Case 004 behavior remain completely untouched.
- **Output-contract findings**: None. Existing JSON fields (`generatedAt`, `repository`, `workPackage`, `components`, `validationRecommendation`, `overall` for status; `recommendation.action`, `commandPreview`, `requiresHumanDecision`, `requiresExternalAuthorization`, `reason`, `blockers`, `blockerDetails`, `validationPlan` for decision) are preserved without renaming or deletion.
- **Readiness-guidance findings**: None.
  - Status JSON includes additive `readiness.componentParseReadiness` (exposing `skipped`, `parseSucceeded`, `ready`, and `message` across parsed, skipped, and unparsed component states) and `readiness.validation` (exposing `action`, `requiresAction`, `reviewRequired`, and `blocksAuditReadiness`).
  - Status JSON includes `testExecutionGuidance` recommending `run_serially` whenever work-package fixture tests (e.g., [`test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1) or [`test-sdk-manager-recommendation.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1)) appear in related validation commands.
  - Decision JSON mirrors `readiness` and `testExecutionGuidance` inside `recommendation`.
  - Both status and decision human-readable text outputs print validation readiness and serial test-execution guidance.
- **Execution-safety findings**: None. Both [`get-agentic-workflow-status.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/agentic-workflow/get-agentic-workflow-status.ps1) and [`get-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/agentic-workflow/get-agentic-workflow-decision.ps1) remain read-only. Blocked, manual-review, closed, unparseable, and missing work-package states do not produce executable command previews (`""`).
- **Missing validation evidence**: None. The following validation steps were run serially and passed with exit code 0:
  1. [`scripts/tests/test-agentic-workflow-status.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-status.ps1)
  2. [`scripts/tests/test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1)
  3. [`scripts/tests/test-sdk-manager-recommendation.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1)
  4. [`scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-orchestration-dry-run.ps1)
  5. `scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
  6. `scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-231 -Json -SkipUnderstandReadiness`
  7. `scripts/check-understand-refresh-readiness.ps1`
  8. `scripts/check-understand-refresh-readiness.ps1 -Json`
  9. `scripts/refresh-understand-graph.ps1`
  10. `git diff --check`
  11. `git status --short --untracked-files=all`
- **Graph artifact concerns**: None. Tracked graph artifacts ([`.understand-anything/knowledge-graph.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/knowledge-graph.json), [`.understand-anything/fingerprints.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/fingerprints.json), [`.understand-anything/meta.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/meta.json), and [`.understand-anything/intermediate/scan-result.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/intermediate/scan-result.json)) were refreshed inside this WP after script and test modifications. [`check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) reports `READY` with zero transient temp, trash, or log files remaining.
- **Drift risks**: None. Top-level shims delegate properly, downstream SDK manager tests pass against the additive decision structure, and no API or workflow drift was introduced.

## Final Decision

Accepted on 2026-08-06 after PASS audit and human closeout request.

Rationale: WP-231 adds backward-compatible parser readiness, validation readiness, and serial fixture-test guidance to the agentic workflow status and decision-router outputs; preserves dry-run/no-execution boundaries and existing public command previews; keeps downstream SDK manager tests passing; and refreshes tracked Understand graph artifacts inside the package scope.

