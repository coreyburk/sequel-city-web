# WP-214 - SDK Manager Script Directory Compatibility Shims

## Objective

Move SDK manager helper implementations into `scripts/sdk-manager/` while preserving the existing top-level SDK manager commands and validating command compatibility.

## Scope

### In Scope

- Move SDK manager helper implementations into:
  - `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
  - `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
- Preserve top-level compatibility shims at:
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-sdk-manager-orchestration-dry-run.ps1`
- Preserve existing parameter names, aliases, switches, JSON/text output contracts, exit behavior, dry-run markers, command-preview display behavior, authorization flags, blocker handling, and fixture cleanup.
- Update focused SDK manager tests to validate:
  - moved implementation files exist and parse
  - top-level shims exist and parse
  - top-level shims delegate to `scripts/sdk-manager/`
  - parameter contracts remain compatible
  - command compatibility works through top-level paths
  - direct moved implementation paths work where safe
  - tracked Understand artifacts and transient fixture files are not mutated or left behind by tests
- Record implementation evidence, audit evidence, and final decision in this WP.

### Out of Scope

- Adopting the OpenAI Agents SDK.
- Installing dependencies or changing `package.json`, lockfiles, Python project files, or SDK prototype files.
- Changing SDK manager recommendation semantics.
- Changing SDK manager orchestration beyond path resolution required by the move.
- Executing live SDK calls, model calls, network calls, or trace export.
- Changing agentic workflow status/decision helper behavior.
- Moving work-package lifecycle, audit runner, commit helper, Understand, student-package, app, database, or Case 004 files.
- Refreshing the Understand graph in this WP.
- Changing SSOT architecture, runtime AI boundaries, or product behavior.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `599dfa4c7cca7c4c5b48aae5cd94cbac175a9ef1`, recorded in `.understand-anything/meta.json`.
- Freshness assessment: Usable with non-structural drift for this planning scope. The only commit after the baseline is WP-213 (`f743891`), a focused Understand graph refresh package whose tracked drift is graph artifacts, handoff, and the WP-213 record. The active SDK manager files are represented in the refreshed graph.
- Analysis performed:
  - Confirmed worktree started clean before WP creation.
  - Confirmed current branch is `main`.
  - Compared `599dfa4c7cca7c4c5b48aae5cd94cbac175a9ef1..HEAD`; drift is limited to WP-213 graph artifacts, handoff, and WP record.
  - Searched graph artifacts for `sdk-manager`, `get-sdk-manager`, and related work packages.
  - Verified graph entries for `scripts/get-sdk-manager-recommendation.ps1`, `scripts/get-sdk-manager-orchestration-dry-run.ps1`, `scripts/tests/test-sdk-manager-recommendation.ps1`, and `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`.
  - Verified current source: `get-sdk-manager-recommendation.ps1` delegates to top-level `get-agentic-workflow-decision.ps1`; `get-sdk-manager-orchestration-dry-run.ps1` delegates to `get-sdk-manager-recommendation.ps1`.
  - Verified focused tests assert dry-run/execution-forbidden behavior, authorization flags, command-preview display text, invalid work-package blockers, temporary WP fixture cleanup, graph artifact hash stability, and transient Understand artifact hygiene.

### Affected Architecture

- Layers: development workflow tooling, repository scripts, work-package documentation, test fixtures.
- Primary files/components:
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
  - `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md`
- Upstream consumers:
  - Humans invoking top-level SDK manager commands.
  - Future SDK manager orchestration planning.
  - Agentic workflow status/decision tooling that is consumed by SDK manager recommendation.
  - Test suites and audit prompts that reference top-level SDK manager commands.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/get-work-package-status.ps1`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - Work package fixture files under `docs/01-work-packages/`
  - Tracked graph artifacts used for hash-stability checks

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
  - `git diff --name-only .understand-anything`
- User workflows:
  - Previewing the next SDK manager workflow recommendation.
  - Running the SDK manager orchestration dry-run facade.
  - Running existing top-level command paths from docs, prompts, shells, or tests.
  - Auditing workflow-tool safety without executing implementation, audit, finalization, SDK, network, or runtime AI actions.
- Security/data boundaries:
  - No database changes.
  - No restricted table, answer-key, spoiler, or Case 004 progression changes.
  - No runtime AI behavior changes.
  - No SDK dependency adoption or live SDK execution.
  - No external audit data sharing during implementation.

### Graph Update Decision

- Regeneration required: Yes, after implementation and acceptance, in a separate focused Understand refresh package.
- Rationale: This WP will add `scripts/sdk-manager/**` and convert the current top-level SDK manager files into compatibility shims. That structurally changes the script graph surface used for future workflow-tool planning. Do not modify `.understand-anything/**` in this WP; create a focused refresh package after acceptance.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/get-sdk-manager-recommendation.ps1
- scripts/get-sdk-manager-orchestration-dry-run.ps1
- scripts/sdk-manager/**
- scripts/sdk-manager/get-sdk-manager-recommendation.ps1
- scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-sdk-manager-orchestration-dry-run.ps1

Do Not Modify:

- .understand-anything/**
- scripts/agentic-workflow/**
- scripts/understand/**
- scripts/student-package/**
- scripts/get-agentic-workflow-status.ps1
- scripts/get-agentic-workflow-decision.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/check-work-package-closeout.ps1
- scripts/audit-work-package.ps1
- scripts/run-work-package.ps1
- scripts/commit-work-package.ps1
- .codex/skills/**
- tools/**
- apps/**
- database/**
- docs/00-ssot/**
- docs/05-development-workflow/**
- package.json
- package-lock.json
- pyproject.toml
- apps/sdk-manager/**

## Constraints

- Preserve existing behavior unless explicitly changing path layout.
- No architectural changes beyond moving SDK manager helper implementations under `scripts/sdk-manager/`.
- No new dependencies.
- No package, lockfile, SDK prototype, runtime AI, app, database, Case 004, SSOT, or Understand graph changes.
- Keep top-level command paths backward-compatible.
- Top-level compatibility shims must preserve the current public parameter contracts and delegate with `@PSBoundParameters`.
- Moved implementations must resolve the repository `scripts/` root correctly from `scripts/sdk-manager/`.
- Do not execute command previews.
- Do not invoke external audits, SDK calls, network calls, dependency installation, commit, push, graph refresh, app startup, browser automation, or database mutation.
- Tests must clean owned temporary WP fixtures and leave no `.understand-anything/tmp`, `.trash-*`, or `*.log` artifacts.

## Required Behavior

- Create `scripts/sdk-manager/`.
- Move the implementation body of `scripts/get-sdk-manager-recommendation.ps1` into `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`.
- Move the implementation body of `scripts/get-sdk-manager-orchestration-dry-run.ps1` into `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`.
- Replace each top-level SDK manager file with a compatibility shim that:
  - exposes the same `param` block, aliases, switches, and binding behavior
  - resolves its moved implementation under `scripts/sdk-manager/`
  - invokes the implementation with `@PSBoundParameters`
  - exits with the delegated process/script exit code
- Update moved implementation path resolution:
  - recommendation implementation must resolve the top-level script root and call `scripts/get-agentic-workflow-decision.ps1`
  - orchestration implementation must resolve the top-level script root and call `scripts/get-sdk-manager-recommendation.ps1`
- Update tests to validate both shim and moved implementation parseability, path existence, delegation, parameter parity, top-level compatibility, direct moved implementation behavior, graph artifact hash stability, transient artifact hygiene, and temporary WP fixture cleanup.
- Record exact commands, outcomes, and any limitations in `Code Results`.

## Acceptance Criteria

- [x] `scripts/sdk-manager/get-sdk-manager-recommendation.ps1` exists and parses.
- [x] `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1` exists and parses.
- [x] `scripts/get-sdk-manager-recommendation.ps1` remains as a top-level compatibility shim with the original public parameter contract.
- [x] `scripts/get-sdk-manager-orchestration-dry-run.ps1` remains as a top-level compatibility shim with the original public parameter contract.
- [x] Top-level shims delegate to `scripts/sdk-manager/` using `@PSBoundParameters`.
- [x] Moved recommendation implementation delegates to top-level `scripts/get-agentic-workflow-decision.ps1`.
- [x] Moved orchestration implementation delegates to top-level `scripts/get-sdk-manager-recommendation.ps1`.
- [x] Existing top-level command invocations continue to work in JSON and text modes.
- [x] Direct moved implementation invocations work for safe no-work-package text mode.
- [x] Focused SDK manager tests pass.
- [x] Tests do not mutate tracked graph artifacts.
- [x] Tests leave no owned temporary SDK manager WP fixture files.
- [x] Tests leave no `.understand-anything/tmp`, `.understand-anything/.trash-*`, or `.understand-anything/*.log` artifacts.
- [x] `git diff --name-only .understand-anything` reports no graph artifact changes.
- [x] No files outside the allowed list are modified.

## Code Prompt

Implement WP-214 exactly as specified.

Scope:
- Only modify the allowed files.
- Move SDK manager helper implementations into `scripts/sdk-manager/`.
- Preserve top-level compatibility shims and public command contracts.
- Update focused tests for command compatibility and hygiene.

Required validation commands:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
- `git diff --name-only .understand-anything`
- transient artifact checks for `.understand-anything/tmp`, `.understand-anything/.trash-*`, `.understand-anything/*.log`, and owned SDK manager temporary WP fixture files

Constraints:
- No refactors outside the path move.
- No new dependencies.
- No SDK adoption.
- No live SDK, model, network, app, database, graph refresh, audit dispatch, finalization, commit, or push execution.
- Preserve dry-run and execution-forbidden guarantees.
- If compatibility cannot be preserved without broader changes, stop and record the blocker.

Return:
- Exact files changed.
- Exact validation commands and outcomes.
- Confirmation of top-level and direct moved command behavior.
- Confirmation of graph and transient artifact hygiene.

## Audit Prompt

Audit WP-214 against the work package, SSOT workflow rules, and agentic audit contract.

Verify:
- All acceptance criteria are satisfied.
- No files outside the allowed list were modified.
- `Do Not Modify` boundaries were preserved, especially `.understand-anything/**`, agentic workflow scripts, lifecycle helpers, SDK prototype files, package/lockfiles, app files, database files, SSOT files, and `.codex/skills/**`.
- Top-level compatibility shims preserve the previous public parameter contracts and delegate with `@PSBoundParameters`.
- Moved implementations resolve dependencies from the top-level `scripts/` root correctly.
- Top-level command compatibility still works in JSON and text modes.
- Direct moved implementation commands work for safe no-work-package text mode.
- Dry-run, execution-forbidden, command-preview display, authorization, blocker, evidence, and source metadata contracts are preserved.
- Tests prove parseability, delegation, parameter parity, command compatibility, graph artifact non-mutation, transient artifact cleanup, and temporary WP fixture cleanup.
- No SDK dependency adoption, live SDK calls, model calls, network calls, graph refresh, external audit dispatch, app startup, browser automation, commit, push, or database mutation occurred.
- Graph regeneration was correctly deferred to a follow-up focused refresh package.

Adversarial checks:
- Try invalid or missing work-package identifiers.
- Check unguarded test snapshot inputs are blocked and do not preserve executable command previews.
- Check command previews remain display text and are not executed.
- Check mixed-worktree and out-of-scope dirty states are not hidden.
- Check tests cannot leave generated temporary WP fixtures or transient Understand artifacts.
- Check direct moved implementations do not become the new documented public path.

Failure thresholds:
- FAIL if top-level command compatibility or parameter contracts regress.
- FAIL if moved implementations cannot resolve their delegated scripts from `scripts/sdk-manager/`.
- FAIL if dry-run/execution-forbidden guarantees regress or command previews execute.
- FAIL if SDK dependencies, package files, runtime AI behavior, network calls, graph artifacts, app files, database files, SSOT files, `.codex/skills/**`, or other prohibited paths change.
- FAIL if required validation evidence is missing or tests leave temp fixtures/transient artifacts.
- BLOCKED if the worktree contains unrelated dirty files and no mixed-worktree audit exception is explicitly authorized.
- BLOCKED if local tooling prevents a reliable independent audit verdict.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changed files:

- `scripts/get-sdk-manager-recommendation.ps1`
- `scripts/get-sdk-manager-orchestration-dry-run.ps1`
- `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
- `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md`

Implementation summary:

- Added `scripts/sdk-manager/` and moved SDK manager recommendation and orchestration dry-run implementation logic into that directory.
- Converted the two top-level SDK manager commands into compatibility shims that preserve their existing `param` blocks and delegate with `@PSBoundParameters`.
- Updated moved implementation path resolution so recommendation delegates to top-level `scripts/get-agentic-workflow-decision.ps1`, and orchestration delegates to top-level `scripts/get-sdk-manager-recommendation.ps1`.
- Extended focused SDK manager tests for moved implementation existence, parser safety, shim delegation, parameter parity, direct implementation text-mode compatibility, graph artifact hash stability, transient Understand artifact hygiene, and owned temp WP fixture cleanup.

### Validation Evidence

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -WorkPackage WP-214 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-recommendation.ps1 -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1 -SkipUnderstandReadiness`
- PASS: `git diff --name-only .understand-anything` returned no changed graph artifact paths.
- PASS: transient artifact checks found `.understand-anything/tmp` absent, `.understand-anything/.trash-*` count `0`, `.understand-anything/*.log` count `0`, and no owned SDK manager temporary WP fixture files.
- PASS: `git status --short --untracked-files=all` shows only WP-214 allowed files dirty.

Command notes:

- The two `-WorkPackage WP-214 -Json -SkipUnderstandReadiness` compatibility checks exited `0` and returned parseable JSON. They reported `BlockedMixedWorktree` with `resolve_blockers` because WP-214 implementation files are intentionally dirty during implementation; this is expected pre-audit lifecycle behavior and confirms blocker propagation without executing command previews.
- Repository-only top-level and direct moved text-mode checks returned `plan`, `Dry run: True`, and `Executed: False`.

Scope notes:

- No `.understand-anything/**`, agentic workflow, lifecycle helper, audit runner, commit helper, student-package, Understand wrapper, app, database, dependency, package/lockfile, SDK prototype, runtime AI, Case 004, SSOT, or `.codex/skills/**` files were modified.
- No SDK dependencies were adopted, no live SDK/model/network calls were made, and no graph refresh, external audit dispatch, app startup, browser automation, database mutation, commit, or push was performed.

## Audit Results

The test runner task is running. I will wait for the test results.
# Independent Audit Report: WP-214

**Verdict: PASS**

---

### Audit Summary

An independent audit of [WP-214-sdk-manager-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md) was performed against the work package specifications, Single Source of Truth (SSOT) workflow rules, and the agentic audit contract.

All acceptance criteria are satisfied, public top-level command compatibility and parameter contracts are preserved, moved helper implementations correctly resolve dependencies from the repository script root, dry-run/execution-forbidden safety guarantees remain intact, and test suites cleanly pass without leaving temporary fixtures or mutating tracked graph artifacts.

---

### Verification Findings

1. **Acceptance Criteria & Scope**
   - All 14 acceptance criteria listed in [WP-214](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md#L176-L193) were verified and satisfied.
   - File modification boundaries were strictly respected. Only the 7 allowed files were created or modified:
     - [WP-214-sdk-manager-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-214-sdk-manager-script-directory-compatibility-shims.md)
     - [scripts/get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1)
     - [scripts/get-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-orchestration-dry-run.ps1)
     - [scripts/sdk-manager/get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-recommendation.ps1)
     - [scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1)
     - [scripts/tests/test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1)
     - [scripts/tests/test-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-orchestration-dry-run.ps1)

2. **Boundary Protection (`Do Not Modify`)**
   - Zero changes were made to `.understand-anything/**`, `scripts/agentic-workflow/**`, `scripts/understand/**`, `scripts/student-package/**`, workflow lifecycle helpers (`get-agentic-workflow-decision.ps1`, `get-work-package-status.ps1`, `check-work-package-closeout.ps1`, `commit-work-package.ps1`), `.codex/skills/**`, `apps/**`, `database/**`, `package.json`, `package-lock.json`, or SSOT documentation.

3. **Top-Level Compatibility Shims & Parameter Delegation**
   - Top-level shims [scripts/get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1) and [scripts/get-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-orchestration-dry-run.ps1) retain their exact public `param(...)` signatures, parameter types, positional positions, and aliases (`Name`, `Task`, `Id`).
   - Both shims resolve target implementation scripts under `scripts/sdk-manager/`, forward bound arguments via `@PSBoundParameters`, and propagate exit codes (`exit $LASTEXITCODE`).

4. **Dependency Path Resolution**
   - Moved implementations resolve the repository `scripts/` root from `scripts/sdk-manager/` using `$scriptRoot = Split-Path -Path (Split-Path -Path $PSCommandPath -Parent) -Parent`.
   - [scripts/sdk-manager/get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-recommendation.ps1) successfully delegates to `scripts/get-agentic-workflow-decision.ps1`.
   - [scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1) successfully delegates to `scripts/get-sdk-manager-recommendation.ps1`.

5. **Execution Mode Parity & Command Behavior**
   - Top-level commands function identically in both `-Json` and text output modes.
   - Direct execution of moved implementation commands in `scripts/sdk-manager/` works as intended for repository-only text mode (`-SkipUnderstandReadiness`).

6. **Safety Contracts**
   - Dry-run (`dryRun: true`), execution forbidden (`forbiddenToExecute: true` / `executionForbidden: true`), command preview display text (`executed: false`), human/external authorization flags, blocker aggregation, evidence lineage, and source metadata contracts are fully preserved.

7. **Empirical Validation & Test Hygiene**
   - `test-sdk-manager-recommendation.ps1`: **PASS**
   - `test-sdk-manager-orchestration-dry-run.ps1`: **PASS**
   - `git diff --name-only .understand-anything`: **Clean (0 diffs)**
   - No transient `.understand-anything/tmp`, `.trash-*`, or `*.log` files were produced.
   - Temporary WP fixture files (`WP-*-temp.md`) were deleted automatically upon test completion.

8. **Prohibited Operation & Graph Refresh Checks**
   - No SDK dependencies were added, no live SDK/model/network calls were executed, no database mutations or app startups occurred, and no git commit/push actions were taken.
   - Graph regeneration was properly deferred to a follow-up focused Understand refresh package.

---

### Adversarial Verification Checks

- **Invalid / Missing Work Packages**: Invocations with invalid work package IDs (e.g. `WP-9999-invalid`) return `resolve_blockers` with `forbiddenToExecute: true`, empty command previews, and explicit status blockers (`workPackageStatus: Unparsed`).
- **Unguarded Decision Snapshots**: Passing decision snapshot parameters without `-AllowTestDecisionSnapshot` returns a `testDecisionSnapshot: RequiresAllowTestDecisionSnapshot` blocker and clears command previews.
- **Command Preview Safety**: Command previews are rendered solely as display text strings (`executed: false`) and are never executed by either top-level shims or moved implementations.
- **Dirty Worktree Visibility**: Dirty worktree states are not masked; `-WorkPackage WP-214` accurately reports `AuditBlockedNeedsResolution` blockers due to in-flight uncommitted files.
- **Public Entry Point Documentation**: Top-level shim paths (`scripts/get-sdk-manager-*.ps1`) remain the documented public API.

---

### Violations

- **None.**

---

### Regressions

- **None.**

---

### Drift Risks

- **None.** Tracked Understand graph artifacts remain intact without structural or content drift. Graph regeneration is deferred to a dedicated follow-up refresh package.

---

### Required Corrections

- **None.** The implementation meets all audit specifications and quality standards.

## Final Decision

Accepted on 2026-07-28.

Human accepted WP-214 after AGY authentication was verified and the independent AntiGravity audit was rerun with verdict `PASS`.

Acceptance notes:

- The SDK manager helper implementations are accepted in `scripts/sdk-manager/`.
- The top-level SDK manager commands remain accepted as compatibility shims preserving public parameter contracts and delegated exit behavior.
- Validation evidence and AGY audit evidence show command compatibility, dry-run safety, graph artifact non-mutation, transient artifact cleanup, and fixture cleanup.
- No SDK dependency adoption, live SDK/model/network calls, runtime AI behavior, app changes, database changes, Case 004 changes, graph refresh, SSOT changes, package/lockfile changes, or `.codex/skills/**` changes are accepted by this WP.
- Follow-up required: create a focused Understand graph refresh package for the accepted SDK manager helper relocation before relying on graph relationships for further SDK-manager or workflow-tooling planning.


