# Isolated Work-Package Audit Finalization Workflow

## Objective

Prevent mixed-worktree scope failures during AGY audits and accepted-WP commits by adding deterministic isolation checks to the work-package audit and finalization workflow.

## Scope

### In Scope

- Add a pre-audit isolation check to `scripts/run-work-package.ps1` for audit modes.
- Add a finalization isolation check to `scripts/commit-work-package.ps1` before staging/committing.
- Make isolation checks compare current modified files against the active WP's `Allowed:` patterns and flag prohibited or out-of-scope files before AGY or commit execution.
- Preserve an intentional override only when explicitly supplied and clearly recorded in output.
- Update workflow documentation to require one-WP-at-a-time audit/finalization state.
- Update the AGY audit contract skill to require isolation checks before independent audit.
- Add focused PowerShell validation for clean scope, mixed-WP detection, and explicit override behavior.

### Out of Scope

- Implementing full `git worktree` orchestration.
- Automatically stashing, moving, reverting, or deleting user changes.
- Running AGY from Codex.
- Changing AGY authentication, approval, or external data-sharing behavior.
- Changing application runtime code, database code, frontend UI, package manifests, lockfiles, dependencies, generated build output, or Understand graph artifacts.
- Changing commit message format.
- Accepting, auditing, committing, or pushing WP-173 or WP-174.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Usable with non-structural drift for planning. The graph predates recent workflow-script and database-identity packages, but this WP affects development workflow scripts and docs only. Relevant files and relationships were verified directly against current source and documentation.
- Analysis performed: Required-tier planning with direct source verification. Reviewed `scripts/run-work-package.ps1`, `scripts/commit-work-package.ps1`, `Codex-Gemini-Execution-Guide.md`, `Contributor-Workflow-Guide.md`, `Work-Package-Lifecycle.md`, `SSOT-Development-Workflow.md`, `.codex/skills/sequel-city-audit-runner-contracts`, WP-174 audit results, and recent commit history.

### Affected Architecture

- Layers:
  - development workflow automation
  - audit execution guardrails
  - accepted work-package finalization
  - repo-local Codex skills
  - workflow documentation
- Primary files/components:
  - `scripts/run-work-package.ps1`
  - `scripts/commit-work-package.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/00-ssot/SSOT-Development-Workflow.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
  - `docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md`
- Upstream consumers: human developer, Codex planning/implementation agents, Claude implementation agents, AGY audit agent, Gemini audit agent.
- Downstream dependencies: future work-package audits, accepted-WP commit helper flow, agentic workflow reliability, corrective-WP generation.

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-175-isolated-work-package-audit-finalization-workflow.md -Execute None`
  - `scripts/commit-work-package.ps1 ... -Preview`
  - `git diff --check`
- User workflows:
  - running AGY audit after implementation
  - running Gemini/default audit after implementation
  - committing an accepted WP with only its allowed files staged
  - discovering mixed pending changes before audit/finalization
  - intentionally overriding isolation for documented exceptional cases
- Security/data boundaries:
  - do not send unrelated dirty files to external audit agents
  - do not commit unrelated dirty files with accepted work
  - do not hide or automatically manipulate user changes
  - preserve no-runtime-AI boundary
  - preserve package/dependency/database boundaries

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package changes development workflow scripts, validation scripts, local skill instructions, and workflow documentation only. It does not alter app architecture, imports, runtime behavior, database structure, or Case 004 domain flow. Source/docs/test validation is sufficient.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md
- scripts/run-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/tests/test-run-work-package-isolation.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/00-ssot/SSOT-Development-Workflow.md
- .codex/skills/sequel-city-audit-runner-contracts/SKILL.md
- .codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- docs/01-work-packages/WP-173-database-identity-validation-health-status.md
- docs/01-work-packages/WP-174-agentic-audit-runner-blockage-resolution.md
- .understand-anything/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .tmp/**

## Constraints

- Do not automatically stash, revert, delete, move, or rewrite user changes.
- Do not block read-only prompt preview mode.
- Do not change the default audit agent or AGY authorization gate added in WP-174.
- Do not remove existing scope check output from code-agent execution.
- Do not require AGY to be runnable from Codex.
- Do not add dependencies or package changes.
- Preserve the accepted-WP multi-line commit format.
- Keep overrides explicit, rare, and visible in command output or result text.

## Required Behavior

- `scripts/run-work-package.ps1` must detect out-of-scope modified files before running audit modes:
  - `-Execute Gemini`
  - `-Execute AntiGravity`
  - `-Execute Audit`
  - the audit step of `-Execute Full`
- Audit isolation checks must compare `git status --porcelain` modified/untracked files against the active WP's allowed patterns.
- Audit isolation checks must ignore deleted files only to the same extent the current scope checker already does; do not silently ignore modified or untracked files.
- If out-of-scope files are present, the runner must stop before invoking Gemini or AGY and report the offending paths.
- Add an explicit override switch, such as `-AllowMixedWorktree`, for exceptional manual cases. Without it, mixed worktrees fail before audit execution.
- `scripts/commit-work-package.ps1` must refuse to commit when the working tree contains modified/untracked files outside the target WP's allowed patterns, unless the same explicit override is supplied.
- The commit helper must still stage only `-StagePath` entries when provided.
- Isolation checks must not mutate the worktree.
- Workflow docs must explain one-WP-at-a-time audit/finalization and how to resolve mixed worktrees.
- Audit contract skill must require isolation verification before claiming independent audit completion.
- Focused tests must cover:
  - clean allowed-file state passes
  - mixed out-of-scope state fails
  - explicit override allows continuation
  - AGY is not invoked when isolation fails
  - commit helper refuses mixed worktree before commit

## Acceptance Criteria

- [x] Audit modes fail before external/internal audit execution when unrelated modified or untracked files are present.
- [x] Audit modes still pass isolation when all dirty files are within the active WP's allowed list.
- [x] `-AllowMixedWorktree` or equivalent explicit override exists and is clearly reported.
- [x] AGY is not invoked when isolation fails.
- [x] Commit helper refuses mixed-worktree finalization before staging/committing unless explicit override is supplied.
- [x] Commit helper continues to support preview mode without requiring a clean worktree.
- [x] Existing code-agent execution scope checks remain intact.
- [x] Workflow docs and audit skill explain isolated audit/finalization requirements.
- [x] Focused PowerShell validation passes.
- [x] `git diff --check` passes.
- [x] No app, database, package, lockfile, dependency, runtime AI, graph, WP-173, WP-174, handoff, or generated-output files change.

## Code Prompt

Implement WP-175 exactly as scoped.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Do not modify application, database, package, graph, handoff, or generated-output files.

Implementation guidance:

1. Reuse the existing work-package allowed-file parsing and git status normalization logic where possible.
2. Add a shared isolation-check helper in `scripts/run-work-package.ps1` for audit execution paths.
3. Add equivalent target-WP allowed-file parsing and isolation enforcement in `scripts/commit-work-package.ps1`.
4. Add an explicit override switch such as `-AllowMixedWorktree`; do not make it implicit.
5. Ensure the audit runner checks isolation before it could invoke Gemini or AGY.
6. Ensure the commit helper checks isolation before staging or committing.
7. Add focused PowerShell tests under `scripts/tests/` using temporary WPs/files and mock commands where needed.
8. Update workflow docs and the audit contract skill.
9. Update this WP with code results, validation, audit results, and final decision only after implementation/audit.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-175-isolated-work-package-audit-finalization-workflow.md -Execute None`
- commit-helper preview command for WP-175
- `git diff --check`

Return:

- exact files changed
- isolation checks added
- override behavior
- validation results
- any limitations

## Audit Prompt

Use `sequel-city-audit-runner-contracts`, then audit WP-175.

Verify:

- Changed files are limited to WP-175 allowed files.
- Audit modes refuse mixed worktrees before invoking Gemini or AGY.
- AGY cannot be invoked when isolation fails.
- Commit helper refuses mixed-worktree finalization before staging/committing.
- Override behavior is explicit and visible.
- Existing code-agent scope checks and Gemini/default audit behavior are preserved.
- Preview modes remain usable.
- Docs and audit skill explain isolated audit/finalization.
- Tests cover clean, mixed, override, no-AGY-on-failure, and commit-helper refusal scenarios.
- No app, database, package, lockfile, dependency, runtime AI, graph, WP-173, WP-174, handoff, or generated-output files changed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Isolation defects
- Regression risks
- Data-sharing or audit-boundary risks
- Missing tests
- Recommended corrections

## Code Results

Implemented.

### Files Changed

- `docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md`
- `scripts/run-work-package.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/tests/test-run-work-package-isolation.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`

### Implementation Summary

- Added `-AllowMixedWorktree` to `scripts/run-work-package.ps1`.
- Added audit-mode worktree isolation checks for `-Execute Gemini`, `-Execute AntiGravity`, `-Execute Audit`, and the audit step of `-Execute Full`.
- Audit isolation compares `git status --porcelain` against the active WP's `Allowed:` file patterns.
- Mixed worktrees write `Verdict: BLOCKED` to the audit result section and return before invoking Gemini or AGY.
- `-AllowMixedWorktree` allows an intentional override and prints the isolation report before continuing.
- Added `-AllowMixedWorktree` to `scripts/commit-work-package.ps1`.
- Commit helper preview mode remains non-blocking.
- Real commit mode checks target-WP isolation before staging or committing, and fails with the out-of-scope file list unless explicitly overridden.
- Added `scripts/tests/test-run-work-package-isolation.ps1` with temporary WP/mock AGY validation for clean scope, mixed-worktree block, no-AGY-on-failure, override continuation, commit-helper refusal, and preview behavior.
- Updated `scripts/tests/test-run-work-package-audit-runner.ps1` so the existing AGY runner validation remains compatible with audit isolation.
- Updated workflow docs and audit contract skill to require isolated audit/finalization state.

### Validation

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-175-isolated-work-package-audit-finalization-workflow.md -Execute None`
- PASS with CRLF warnings only: `git diff --check`
- PASS cleanup check: temporary test WPs/files were not left behind.

Validation notes:

- The requested commit-helper preview behavior is covered by `scripts/tests/test-run-work-package-isolation.ps1` using a temporary accepted WP. A direct WP-175 commit-helper preview was not run because WP-175's `Final Decision` remains pending until audit/acceptance.
- The focused tests must be run serially. Running isolation-sensitive tests in parallel creates temporary dirty files that intentionally trigger the mixed-worktree guard.

## Audit Results

An audit of **WP-175 (Isolated Work-Package Audit & Finalization Workflow)** was performed using the `sequel-city-audit-runner-contracts` skill.

---

### Audit Findings

- **Verdict**: PASS

- **Scope violations**: None
  All 11 changed files are strictly within the allowed patterns specified in [WP-175-isolated-work-package-audit-finalization-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md):
  - [WP-175-isolated-work-package-audit-finalization-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md)
  - [run-work-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/run-work-package.ps1)
  - [commit-work-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/commit-work-package.ps1)
  - [test-run-work-package-isolation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-run-work-package-isolation.ps1)
  - [test-run-work-package-audit-runner.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-run-work-package-audit-runner.ps1)
  - [Codex-Gemini-Execution-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Codex-Gemini-Execution-Guide.md)
  - [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md)
  - [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md)
  - [SSOT-Development-Workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Development-Workflow.md)
  - [SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-audit-runner-contracts/SKILL.md)
  - [audit-contract.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md)

  No app, database, package, lockfile, dependency, runtime AI, graph, WP-173, WP-174, handoff, or generated-output files were modified.

- **Isolation defects**: None
  - `Test-WorktreeIsolation` in [run-work-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/run-work-package.ps1#L1840-L1885) verifies worktree cleanliness before invoking Gemini or AGY. On isolation failure without `-AllowMixedWorktree`, it writes a `Verdict: BLOCKED` section and returns early before process execution.
  - AGY cannot be invoked when isolation fails (verified via mock AGY process assertion in test suite).
  - `Assert-WorktreeIsolatedForWorkPackage` in [commit-work-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/commit-work-package.ps1#L330-L342) throws before staging or committing if out-of-scope modified files exist.

- **Regression risks**: None
  - Existing code-agent scope checks in `run-work-package.ps1` remain active.
  - Preview modes (`-Execute None` and `commit-work-package.ps1 -Preview`) bypass isolation enforcement as intended and remain fully functional.

- **Data-sharing or audit-boundary risks**: None
  - Pre-audit isolation prevents out-of-scope files or unreviewed changes from being passed to external audit agents.
  - Explicit external audit authorization (`-AllowExternalAudit`) remains mandatory for AGY.
  - Override behavior (`-AllowMixedWorktree`) requires an explicit CLI switch and logs a clear warning.

- **Missing tests**: None
  - [test-run-work-package-isolation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-run-work-package-isolation.ps1) covers clean worktree, mixed worktree block, no-AGY invocation on failure, explicit override, commit helper refusal prior to staging, and preview behavior.
  - All tests (`test-run-work-package-isolation.ps1`, `test-run-work-package-audit-runner.ps1`, `git diff --check`) passed cleanly.

- **Recommended corrections**: None required. WP-175 is ready for final human acceptance.

## Final Decision

Accepted.

AGY audit passed with no scope violations, isolation defects, regression risks, data-sharing boundary risks, or missing tests. WP-175 is accepted for implementation and finalization because it adds enforced active-work-package isolation before independent audit and commit staging while preserving the existing human acceptance gate, external audit authorization gate, and application/database/runtime AI boundaries.

