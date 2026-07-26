# WP-204: Correct Understand Graph Refresh Wrapper Defects

## Objective

Repair the repository-owned Understand graph refresh wrapper defects discovered during blocked `WP-203` so the wrapper can run under Windows PowerShell without BOM-corrupted JSON, invalid generated JavaScript, missing graph project metadata, or leftover transient refresh artifacts after failure.

## Scope

### Original Work Package

- Source WP: `docs/01-work-packages/WP-203-understand-graph-refresh-after-agentic-workflow-hardening.md`
- Source state: blocked during implementation and independently audited as `BLOCKED`
- Corrective classification:
  - `defect`: `scripts/refresh-understand-graph.ps1` cannot complete the mutating graph refresh on Windows PowerShell.
  - `omission`: wrapper tests did not cover BOM-less JSON writes, generated assembly-script validity, graph project metadata, or cleanup-on-failure behavior.

### Defects Being Corrected

- `Set-Content -Encoding UTF8` writes BOM-bearing intermediate JSON under Windows PowerShell, causing the Understand plugin Node JSON parsers to fail with `Unexpected token 'Ã¯Â»Â¿'`.
- The wrapper's double-quoted PowerShell here-string strips JavaScript template literal backticks in generated `assemble-graph.mjs`, producing invalid JavaScript.
- The wrapper calls the plugin `GraphBuilder` API with the wrong shape. Current plugin code expects `new GraphBuilder(projectName, gitHash)` plus explicit `addFile*` / edge calls before `build()`, not `new GraphBuilder(repoRoot).build(files)`.
- The generated graph fails plugin validation with `Missing or invalid project metadata`.
- Failure cleanup relies on the current wrapper `finally`, but tests should prove `.understand-anything/tmp/refresh-understand-graph` is removed on failure.

### In Scope

- Update `scripts/refresh-understand-graph.ps1` only as needed to:
  - write wrapper-created JSON and generated scripts as UTF-8 without BOM
  - generate syntactically valid JavaScript for `assemble-graph.mjs`
  - use the installed Understand plugin core `GraphBuilder` API correctly
  - populate required graph project metadata, including name and git commit hash
  - preserve existing dry-run behavior
  - preserve cleanup of `.understand-anything/tmp/refresh-understand-graph` on success and failure
- Update `scripts/tests/test-understand-graph-refresh-wrapper.ps1` with focused regression coverage for the corrected wrapper behavior.
- Optionally update `scripts/tests/test-understand-refresh-readiness-preflight.ps1` only if existing readiness tests need a narrow fixture adjustment to remain consistent with corrected wrapper behavior.
- Record implementation evidence, validation evidence, audit results, and final decision in this corrective WP.

### Out of Scope

- Running the actual mutating graph refresh to update tracked `.understand-anything` graph baseline artifacts. That remains `WP-203` or a successor refresh WP.
- Modifying `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, `.understand-anything/intermediate/scan-result.json`, `.understand-anything/config.json`, or `.understand-anything/.understandignore`.
- Changing app runtime, API, UI, route, database, schema, migration, Case 004 progression, student data, restricted-table, answer-key, or spoiler-boundary behavior.
- Changing audit contracts, SDK manager logic, work-package lifecycle policy, commit helper behavior, package manifests, lockfiles, dependencies, generated presentation/output artifacts, or runtime AI boundaries.
- Installing or updating Understand, Node, npm packages, Python packages, OpenAI Agents SDK, or any other dependency.
- Launching the Understand dashboard or committing dashboard/log output.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for agentic workflow tooling and development-workflow documentation. This corrective package must rely on direct source inspection, not graph relationships.
- Analysis performed: Read WP-203 objective, scope, code results, audit results, and final decision state; read `Work-Package-Lifecycle.md`, `Agentic-Development-Workflow-Evaluation.md`, corrective WP checklist, `scripts/refresh-understand-graph.ps1`, `scripts/tests/test-understand-graph-refresh-wrapper.ps1`, and targeted plugin core files under `C:\Users\cburk\.understand-anything-plugin\packages\core\dist`. Verified the current plugin `GraphBuilder` constructor is `GraphBuilder(projectName, gitHash, languageRegistry?)` and `build()` takes no `files` argument.

### Affected Architecture

- Layers: development workflow tooling, Understand graph refresh wrapper, wrapper regression tests.
- Primary files/components:
  - `scripts/refresh-understand-graph.ps1`
  - `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - optional: `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `docs/01-work-packages/WP-204-correct-understand-graph-refresh-wrapper-defects.md`
- Upstream consumers:
  - `WP-203` graph refresh implementation
  - `scripts/check-understand-refresh-readiness.ps1`
  - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
  - future workflow-tooling planning using refreshed graph data
- Downstream dependencies:
  - local Understand plugin scripts outside the repo
  - plugin core `GraphBuilder`, `detectLayers`, `generateHeuristicTour`, `validateGraph`, and `build-fingerprints.mjs`
  - Node.js available on PATH during refresh

### Regression Surface

- Related tests and validation:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
  - a guarded non-mutating or temp-sandbox wrapper fixture that proves BOM-less intermediate writes, valid generated JavaScript, metadata-bearing graph assembly, and cleanup-on-failure behavior without changing tracked `.understand-anything` artifacts
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - unblocking WP-203 graph refresh
  - future Understand graph refreshes through the repository-owned wrapper
  - readiness preflight and graph artifact audit flows
- Security/data boundaries:
  - development-only wrapper repair
  - no runtime AI
  - no live model calls
  - no external audit dispatch
  - no dependency installation
  - no app/database/package/lockfile changes
  - no graph baseline mutation in this corrective package

### Graph Update Decision

- Regeneration required: No for this corrective package.
- Rationale: This package repairs the wrapper needed for graph regeneration but does not itself authorize updating tracked graph baseline artifacts. The graph refresh should be performed under WP-203 after this wrapper fix is implemented, audited, and accepted, or under a successor refresh WP if a cleaner history is preferred.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-204-correct-understand-graph-refresh-wrapper-defects.md
- scripts/refresh-understand-graph.ps1
- scripts/tests/test-understand-graph-refresh-wrapper.ps1
- scripts/tests/test-understand-refresh-readiness-preflight.ps1

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-204-correct-understand-graph-refresh-wrapper-defects.md`
- docs/05-development-workflow/**
- .codex/**
- .understand-anything/**
- tools/**
- scripts/check-understand-refresh-readiness.ps1
- scripts/get-agentic-workflow-status.ps1
- scripts/get-agentic-workflow-decision.ps1
- scripts/get-sdk-manager-recommendation.ps1
- scripts/get-sdk-manager-orchestration-dry-run.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/check-work-package-closeout.ps1
- scripts/commit-work-package.ps1
- scripts/run-work-package.ps1
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Keep the fix narrowly targeted to the WP-203 refresh blockers.
- Do not hand-edit generated graph JSON.
- Do not update tracked `.understand-anything/**` artifacts.
- Do not install or update local plugin/dependency tooling.
- Do not change `scripts/check-understand-refresh-readiness.ps1` unless a separate corrective package allows it.
- Preserve the wrapper's existing public parameters: `-PluginRoot`, `-DryRun`, and `-KeepIntermediate`.
- Preserve dry-run non-mutation.
- Preserve cleanup behavior and strengthen cleanup-on-failure test coverage.
- Do not introduce runtime AI, network behavior, app startup, browser automation, database mutation, package changes, lockfile changes, external data transmission, commit, push, or graph dashboard behavior.

## Required Behavior

- Wrapper-created JSON intermediate files must be UTF-8 without BOM under Windows PowerShell.
- The generated `assemble-graph.mjs` must parse as valid JavaScript.
- Graph assembly must use the installed plugin `GraphBuilder` API correctly:
  - construct with project name and git hash
  - add scanned files, analyzed code/non-code structures, and import edges before `build()`
  - validate a graph that contains required project metadata
- Dry-run output must remain non-mutating and still report plugin root, required scripts, tracked outputs, and planned stages.
- Failure paths must remove `.understand-anything/tmp/refresh-understand-graph` unless `-KeepIntermediate` is explicitly provided.
- Tests must fail against at least the class of defects found in WP-203:
  - BOM-bearing JSON intermediate writes
  - invalid generated assembly JavaScript
  - missing graph project metadata
  - cleanup failure after a blocked stage

## Acceptance Criteria

- [x] `scripts/refresh-understand-graph.ps1 -DryRun` still succeeds and does not modify tracked graph artifacts.
- [x] Wrapper tests verify generated intermediate JSON is BOM-less UTF-8 where practical.
- [x] Wrapper tests verify generated assembly JavaScript syntax or execution reaches graph validation with valid project metadata.
- [x] Wrapper tests verify the wrapper uses the current plugin `GraphBuilder(projectName, gitHash)` / `build()` API shape rather than `GraphBuilder(repoRoot).build(files)`.
- [x] Wrapper tests verify `.understand-anything/tmp/refresh-understand-graph` is cleaned after a forced failure unless `-KeepIntermediate` is used.
- [x] `scripts/tests/test-understand-graph-refresh-wrapper.ps1` passes.
- [x] `scripts/tests/test-understand-refresh-readiness-preflight.ps1` passes if touched or affected.
- [x] No tracked `.understand-anything/**` artifacts change.
- [x] No app, database, docs policy, package, lockfile, dependency, output, runtime AI, external data, or Case 004 progression change is introduced.
- [x] No unrelated files changed.

## Code Prompt

Implement WP-204 exactly as scoped.

Context:
- WP-203 attempted to refresh the Understand graph with `scripts/refresh-understand-graph.ps1` and was blocked.
- The audit found three wrapper defects: BOM-bearing intermediate JSON under Windows PowerShell, invalid generated JavaScript from PowerShell here-string/template literal handling, and missing/invalid graph project metadata due to incorrect plugin `GraphBuilder` usage.
- This corrective WP authorizes fixing `scripts/refresh-understand-graph.ps1` and focused wrapper tests only. It does not authorize updating tracked graph artifacts.

Scope:
- Modify only the files listed under `Allowed`.
- Do not modify `.understand-anything/**`.
- Do not run a mutating graph refresh that leaves tracked graph artifacts changed under this WP.

Required implementation:
1. Add a wrapper-local helper for BOM-less UTF-8 file writes and use it for wrapper-created JSON and generated script files.
2. Generate `assemble-graph.mjs` without PowerShell corrupting JavaScript template literals or variable placeholders.
3. Update assembly logic to use the installed plugin `GraphBuilder` API correctly and preserve required project metadata.
4. Keep dry-run behavior unchanged.
5. Strengthen tests for BOM-less writes, generated script validity, current GraphBuilder API usage, and cleanup-on-failure behavior.
6. Record implementation and validation evidence in `Code Results`.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1` if touched or affected
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
- `git diff --check`
- `git status --short --untracked-files=all`
- Confirm no tracked `.understand-anything/**` artifact changed.

Return:
- Summary of wrapper fixes.
- Validation results.
- Confirmation that WP-203 graph artifacts remain unchanged and that the corrective scope did not broaden.

## Audit Prompt

Audit WP-204 against this corrective work package, WP-203 audit findings, and the actual repository diff.

Verify:
- The package corrects only the WP-203 wrapper defects and does not attempt the graph refresh itself.
- `scripts/refresh-understand-graph.ps1` writes wrapper-created JSON and generated scripts as UTF-8 without BOM.
- The generated assembly script cannot be corrupted by PowerShell template literal/backtick expansion.
- Graph assembly uses the current installed plugin API shape and produces required project metadata before validation.
- Failure paths clean `.understand-anything/tmp/refresh-understand-graph` unless `-KeepIntermediate` is used.
- Tests cover the corrected defect classes with fixture or dry-run evidence.
- Dry-run remains non-mutating.
- No `.understand-anything/**` tracked artifacts, app files, database files, docs policy files, package manifests, lockfiles, dependencies, outputs, runtime AI boundaries, external data behavior, or Case 004 progression files changed.
- The audit applies the hardened audit stance from WP-202 and the blocked findings from WP-203.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changes:

- Added wrapper-local UTF-8-without-BOM helpers and routed wrapper-created JSON/generated-script writes through them.
- Replaced the interpolated PowerShell assembly here-string with a literal here-string so JavaScript template literals and placeholders cannot be stripped by PowerShell.
- Updated generated graph assembly to use the installed plugin API shape:
  - `new core.GraphBuilder(projectName, gitHash)`
  - explicit scanned-file additions via `addFile` / `addFileWithAnalysis`
  - guarded scanned-file import edges
  - no-argument `builder.build()`
  - validation after required project metadata is produced by the builder
- Preserved dry-run behavior and strengthened cleanup to remove the empty `.understand-anything/tmp` parent after the transient refresh directory is removed.
- Expanded wrapper tests to cover:
  - BOM-less generated `import-input.json` after a forced post-scan failure
  - literal generated assembly script extraction plus `node --check`
  - current `GraphBuilder(projectName, gitHash)` / `build()` contract shape
  - rejection of the old `GraphBuilder(repoRoot).build(files)` shape
  - cleanup of `.understand-anything/tmp/refresh-understand-graph` and the empty `.understand-anything/tmp` parent after forced failure
  - tracked graph artifact hash stability during dry-run and forced failure

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
- PASS: `git diff --check`
- PASS: `git status --short -- .understand-anything` returned no tracked graph artifact changes.
- PASS: `Test-Path -LiteralPath .understand-anything/tmp` returned `False`.

Notes:

- The readiness preflight test must not be run concurrently with the wrapper failure-path test because both inspect the same `.understand-anything/tmp` hygiene path. Serial execution passed.
- `git status --short --untracked-files=all` shows only the authorized WP-204 script/test modifications plus the untracked WP-203 and WP-204 work-package records.

## Audit Results

# Audit Report: WP-204 Correct Understand Graph Refresh Wrapper Defects

> [!NOTE]
> **Active Workspace Recommendation**: Your workspace was not explicitly set. The target repository for this work package is located at [D:/GitHub-Repos/SequelCityWeb](file:///D:/GitHub-Repos/SequelCityWeb). Please set `D:\GitHub-Repos\SequelCityWeb` as your active workspace in your assistant environment settings.

---

### Verdict
**PASS**

---

### Audit Verification Summary

| Verification Criteria | Status | Empirical Evidence / Analysis |
| :--- | :--- | :--- |
| **1. Corrects wrapper defects only without graph refresh** | **PASS** | `scripts/refresh-understand-graph.ps1` and `scripts/tests/test-understand-graph-refresh-wrapper.ps1` updated. No tracked `.understand-anything/**` baseline artifacts were modified or regenerated. |
| **2. UTF-8 without BOM encoding** | **PASS** | Helper functions `Write-Utf8NoBomFile` and `Write-JsonUtf8NoBomFile` use `[System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding $false))`. Applied to all generated JSON intermediates and `assemble-graph.mjs`. |
| **3. JavaScript template literal protection** | **PASS** | Assembly script generation uses a single-quoted PowerShell literal here-string (`@' ... '@`), preventing PowerShell variable/template backtick expansion. Verified with `node --check`. |
| **4. Installed plugin API shape & metadata** | **PASS** | Constructing `new core.GraphBuilder(projectName, gitHash)` populates required project metadata. Graph assembly uses explicit `addFile*` and `addImportEdge` methods, calling `builder.build()` with no arguments before `core.validateGraph(graph)`. |
| **5. Failure path cleanup** | **PASS** | `finally` block cleans `.understand-anything/tmp/refresh-understand-graph` and the parent `.understand-anything/tmp` directory unless `-KeepIntermediate` is supplied. Tested via `Invoke-WrapperExpectFailure` fixtures. |
| **6. Defect class test coverage** | **PASS** | `scripts/tests/test-understand-graph-refresh-wrapper.ps1` validates BOM-less writes, literal assembly script extraction and `node --check`, current API contract shape, failure cleanup, and hash stability of tracked `.understand-anything` artifacts. |
| **7. Non-mutating dry run** | **PASS** | `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun` outputs configuration and planned stages, exiting 0 without creating files or directories. |
| **8. Strict boundary & non-touch policy** | **PASS** | `git status --short --untracked-files=all` confirms changes are strictly limited to allowed script/test files and [WP-204-correct-understand-graph-refresh-wrapper-defects.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-204-correct-understand-graph-refresh-wrapper-defects.md). Zero changes to app runtime, database, docs policy, package manifests, lockfiles, dependencies, outputs, runtime AI boundaries, external data behavior, or Case 004 progression files. |
| **9. WP-202 hardened stance & WP-203 findings** | **PASS** | Adversarial contract-shape checks, negative-path/artifact-hygiene probing, execution verification, and explicit failure thresholds applied. Addresses all three execution blockers logged in WP-203. |

---

### Violations
* **None**: All edits are strictly bounded to allowed files in WP-204. No contract weakening, missing evidence, or out-of-scope file modifications detected.

---

### Regressions
* **None**: Dry-run behavior, preflight checks, and graph hash stability are preserved.

---

### Drift Risks
* **Low**: Running WP-203 or a successor graph refresh work package should be performed serially rather than concurrently with preflight tests to prevent transient `.understand-anything/tmp` hygiene path inspection collisions.

---

### Required Corrections
* **None**: Work package WP-204 meets all acceptance criteria and is ready for closeout and acceptance.
The background drive listing task (`task-47`) has completed. The WP-204 audit report presented above remains complete, accurate, and verified with a verdict of **PASS**. No further action is required.

## Final Decision

ACCEPTED

