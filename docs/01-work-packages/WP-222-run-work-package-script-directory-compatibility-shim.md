# WP-222 - Run Work Package Script Directory Compatibility Shim

## Objective

Move the work-package runner implementation behind `scripts/work-package/` while preserving `scripts/run-work-package.ps1` as the public compatibility command for implementation, prompt preview, and audit dispatch workflows.

## Scope

### In Scope

- Create `scripts/work-package/run-work-package.ps1` containing the current runner implementation.
- Replace `scripts/run-work-package.ps1` with a top-level compatibility shim that preserves the public parameter contract and delegates to the moved implementation.
- Adjust implementation path resolution so the moved runner still resolves the project root, work-package directory, and `scripts/lib/WorkPackageResolver.ps1` correctly.
- Preserve audit dispatch behavior for `-Execute Audit`, `-Execute AntiGravity`, `-AllowExternalAudit`, `-AllowMixedWorktree`, timeout handling, blocked audit recording, and result-section updates.
- Preserve prompt preview behavior for `-Execute None`.
- Preserve code-agent execution behavior and scope-check recording without changing supported agents.
- Extend focused workflow tests for the moved runner and top-level shim.
- Record implementation and validation evidence in this work package.

### Out of Scope

- Changing audit policy, authorization rules, runner modes, command previews, prompt text extraction semantics, result trimming, scope-matching rules, or external audit behavior.
- Moving or modifying `scripts/audit-work-package.ps1`, `scripts/work-package/audit-work-package.ps1`, `scripts/commit-work-package.ps1`, `scripts/work-package/commit-work-package.ps1`, lifecycle read-only helpers, `new-lite-work-package.ps1`, or `new-work-package.ps1`.
- Updating docs, repo-local skills, SDK manager previews, agentic workflow previews, or command examples to prefer `scripts/work-package/run-work-package.ps1`.
- Regenerating `.understand-anything/**`.
- Changing app code, database assets, SSOT architecture, dependencies, package manifests, lockfiles, runtime AI behavior, or output artifacts.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `d9b1b4f587be065691326cdae6cbb22018417c26`.
- Freshness assessment: Usable with non-structural drift. Current `HEAD` is `7cf66968d83f8c1c0c75c642e7082449a71f6d37`; the only commit after the graph baseline is the accepted WP-221 graph-refresh closeout itself, which changed graph artifacts, the WP-221 record, and the live handoff but did not change workflow source behavior.
- Analysis performed: Required-tier Understand-assisted planning. Searched the refreshed graph and current source for `run-work-package.ps1`, `audit-work-package.ps1`, `commit-work-package.ps1`, `new-lite-work-package.ps1`, `new-work-package.ps1`, `WorkPackageResolver.ps1`, and related audit/runner tests. Verified graph findings against source with direct reads of `scripts/run-work-package.ps1`, `scripts/work-package/audit-work-package.ps1`, `scripts/tests/test-run-work-package-audit-runner.ps1`, `scripts/tests/test-run-work-package-isolation.ps1`, `scripts/tests/test-audit-work-package-wrapper.ps1`, workflow docs, and repo-local audit skills.

### Affected Architecture

- Layers:
  - Development workflow tooling
  - Work-package implementation/audit orchestration
  - Script-directory taxonomy compatibility shims
- Primary files/components:
  - `scripts/run-work-package.ps1`
  - `scripts/work-package/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
  - `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`
- Upstream consumers:
  - contributors invoking `scripts/run-work-package.ps1`
  - `scripts/work-package/audit-work-package.ps1`
  - `scripts/audit-work-package.ps1` through the moved audit implementation
  - agentic workflow decision previews that display `scripts/run-work-package.ps1`
  - SDK manager recommendations and dry-run facade previews that display `scripts/run-work-package.ps1`
  - docs and repo-local skills that instruct contributors to use the top-level runner command
- Downstream dependencies:
  - `scripts/lib/WorkPackageResolver.ps1`
  - Git status/diff commands used for scope isolation
  - external CLIs selected by `LITE_WP_CODEX_CLI`, `LITE_WP_CLAUDE_CLI`, `LITE_WP_GEMINI_CLI`, `LITE_WP_AGY_CLI`, or default commands
  - PowerShell parser and process-launch behavior

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - PowerShell parser checks for both top-level and moved runner scripts
  - Top-level and direct moved-runner `-Execute None` prompt-preview checks against a safe existing WP
  - Audit wrapper blocked-authorization and mock AGY success checks
  - `git diff --name-only .understand-anything`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - previewing implementation and audit prompts
  - running Codex/Claude implementation steps
  - requesting Gemini or AntiGravity audits
  - blocked audit recording when external audit authorization is missing
  - worktree isolation before audit dispatch
  - downstream audit wrapper invocation
- Security/data boundaries:
  - No runtime AI behavior should be introduced.
  - External audit context must still require `-AllowExternalAudit`.
  - No database, restricted data, answer-key, Case 004 progression, dependency, package, lockfile, app, output, or graph artifact changes are authorized.

### Graph Update Decision

- Regeneration required: Yes, after implementation and acceptance in a follow-up focused graph-refresh package.
- Rationale: Moving `scripts/run-work-package.ps1` changes structural workflow-tooling relationships under `scripts/**`. Do not regenerate the graph in WP-222; create the focused graph refresh after this package is audited, accepted, committed, and pushed.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md
- scripts/run-work-package.ps1
- scripts/work-package/run-work-package.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- scripts/tests/test-run-work-package-isolation.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-sdk-manager-orchestration-dry-run.ps1

Do Not Modify:

- .understand-anything/**
- scripts/audit-work-package.ps1
- scripts/work-package/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/work-package/commit-work-package.ps1
- scripts/check-work-package-closeout.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/work-package/check-work-package-closeout.ps1
- scripts/work-package/get-work-package-status.ps1
- scripts/work-package/get-work-package-validation-plan.ps1
- scripts/new-lite-work-package.ps1
- scripts/new-work-package.ps1
- scripts/lib/**
- scripts/agentic-workflow/**
- scripts/sdk-manager/**
- scripts/understand/**
- scripts/student-package/**
- .codex/skills/**
- tools/**
- apps/**
- database/**
- docs/00-ssot/**
- docs/05-development-workflow/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Preserve `scripts/run-work-package.ps1` as the documented public command path.
- Preserve every existing public parameter name, alias, type, validation attribute, default, and positional behavior.
- Delegate from the top-level shim to the moved implementation with `@PSBoundParameters`.
- Preserve stdout/stderr behavior except for path-equivalent relocation effects.
- Preserve worktree isolation, blocked audit recording, external audit authorization, timeout, prompt preview, result-section update, and scope-check behavior.
- Do not update docs or skills to prefer the moved implementation path.
- Do not modify graph artifacts in this package.
- Do not make package creation or runner behavior improvements beyond the relocation required by this package.

## Required Behavior

- `scripts/work-package/run-work-package.ps1` exists and parses.
- `scripts/run-work-package.ps1` remains present as the public top-level compatibility shim.
- The top-level shim preserves the current runner parameter contract.
- The top-level shim delegates to `scripts/work-package/run-work-package.ps1` using `@PSBoundParameters`.
- The moved implementation correctly resolves:
  - project root
  - `docs/01-work-packages`
  - `scripts/lib/WorkPackageResolver.ps1`
- Top-level `scripts/run-work-package.ps1 <wp> -Execute None` still previews prompts and does not execute implementation or audit agents.
- Direct `scripts/work-package/run-work-package.ps1 <wp> -Execute None` works for validation but is not documented as the preferred public command.
- `scripts/audit-work-package.ps1` still reaches the runner through the preserved top-level path.
- `-Execute AntiGravity` and `-Execute Audit -AuditAgent AntiGravity` still refuse without `-AllowExternalAudit` before sending repository context.
- Mixed-worktree audit isolation still blocks before invoking external audit unless `-AllowMixedWorktree` is provided.
- Agentic workflow and SDK manager previews continue to reference top-level `scripts/run-work-package.ps1`, not the moved implementation path.

## Acceptance Criteria

- [x] `scripts/work-package/run-work-package.ps1` exists and parses.
- [x] `scripts/run-work-package.ps1` remains present as the public top-level compatibility shim.
- [x] The top-level shim preserves the public parameter contract and delegates with `@PSBoundParameters`.
- [x] The moved implementation resolves `scripts/lib/WorkPackageResolver.ps1` correctly from its new directory.
- [x] Top-level prompt preview through `scripts/run-work-package.ps1 <wp> -Execute None` still works.
- [x] Direct moved-runner prompt preview through `scripts/work-package/run-work-package.ps1 <wp> -Execute None` works for validation.
- [x] Audit wrapper tests still pass through the public `scripts/audit-work-package.ps1` command and moved audit implementation.
- [x] AntiGravity authorization and mixed-worktree negative-path tests still prove forbidden external audit dispatch cannot happen without explicit authorization and clean/overridden scope.
- [x] Agentic workflow and SDK manager previews still point to top-level `scripts/run-work-package.ps1`.
- [x] No `.understand-anything/**` graph artifacts are modified.
- [x] No docs, skills, app, database, dependency, package, lockfile, output, runtime AI, package-creation helper, audit wrapper, commit helper, lifecycle helper, resolver, SDK manager, agentic workflow, Understand, or student-package files are modified beyond the allowed test files and runner files.

## Code Prompt

Implement WP-222 exactly as specified.

Scope:
- Only modify files listed under `Allowed`.

Required steps:
1. Create `scripts/work-package/run-work-package.ps1` by moving the current implementation body of `scripts/run-work-package.ps1`.
2. Replace `scripts/run-work-package.ps1` with a compatibility shim that preserves the original parameter block and delegates to `scripts/work-package/run-work-package.ps1` with `@PSBoundParameters`.
3. Update the moved implementation's path resolution so `$scriptRoot` resolves to `scripts/`, `$projectRoot` resolves to the repository root, `$workPackageDirectory` resolves to `docs/01-work-packages`, and `WorkPackageResolver.ps1` is loaded from `scripts/lib/WorkPackageResolver.ps1`.
4. Extend focused tests to verify:
   - top-level runner shim parsing
   - moved runner implementation parsing
   - shim delegation path
   - `@PSBoundParameters` forwarding
   - parameter parity between shim and implementation
   - top-level `-Execute None` prompt-preview behavior
   - direct moved implementation `-Execute None` prompt-preview behavior
   - audit wrapper still routes through the preserved public runner path
   - AGY authorization and mixed-worktree blockers still prevent unauthorized external audit dispatch
   - agentic workflow and SDK manager command previews still reference top-level `scripts/run-work-package.ps1`
5. Do not change command examples, docs, skills, SDK manager source, or agentic workflow source unless an existing allowed test must be updated to preserve top-level public command assertions.
6. Record implementation results, validation evidence, and any limitations in `Code Results`.

Required validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PowerShell parser checks for `scripts/run-work-package.ps1` and `scripts/work-package/run-work-package.ps1`
- top-level and direct moved-runner `-Execute None` prompt-preview checks against a safe existing WP
- `git diff --name-only .understand-anything`
- transient temp fixture hygiene check for owned `WP-9###-*temp.md` files
- `git diff --check`
- `git status --short --untracked-files=all`

Return:
- Exact files changed.
- Validation commands and results.
- Confirmation that public top-level command compatibility and authorization boundaries are preserved.
- Follow-up graph refresh recommendation after acceptance.

## Audit Prompt

Audit WP-222 against the work package, SSOT workflow rules, and current source.

Verify:
- The implementation changed only the allowed files.
- `scripts/run-work-package.ps1` remains a public top-level compatibility shim and preserves the original public parameter contract.
- The top-level shim delegates to `scripts/work-package/run-work-package.ps1` using `@PSBoundParameters`.
- The moved runner implementation resolves project root, work-package directory, and `scripts/lib/WorkPackageResolver.ps1` correctly.
- Prompt preview mode remains non-executing.
- Audit wrapper behavior still routes through the preserved public runner command.
- AntiGravity audit dispatch still requires explicit `-AllowExternalAudit` before repository context can be sent.
- Mixed-worktree isolation still blocks audit dispatch before external invocation unless `-AllowMixedWorktree` is provided.
- Agentic workflow and SDK manager previews continue to show top-level `scripts/run-work-package.ps1`.
- Validation evidence covers parse checks, preview behavior, audit wrapper routing, authorization blockers, mixed-worktree blockers, command-preview preservation, graph non-modification, and scope isolation.
- No `.understand-anything/**`, docs/skills, app, database, dependency, package, lockfile, output, runtime AI, package-creation helper, audit wrapper, commit helper, lifecycle helper, resolver, SDK manager, agentic workflow, Understand, or student-package files changed outside the allowed set.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Scope violations
- Public command compatibility findings
- Authorization/isolation boundary findings
- Missing validation evidence
- Regressions
- Required corrections

## Code Results

Implemented WP-222.

### Files Changed

- `scripts/run-work-package.ps1`
- `scripts/work-package/run-work-package.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `scripts/tests/test-run-work-package-isolation.ps1`
- `scripts/tests/test-audit-work-package-wrapper.ps1`
- `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`

### Implementation Summary

- Created `scripts/work-package/run-work-package.ps1` with the existing runner implementation.
- Replaced `scripts/run-work-package.ps1` with a top-level compatibility shim that preserves the public parameter block and delegates to the moved implementation with `@PSBoundParameters`.
- Updated moved runner path resolution so:
  - `$scriptRoot` resolves to `scripts/`
  - `$projectRoot` resolves to the repository root
  - `docs/01-work-packages` resolves from the repository root
  - `scripts/lib/WorkPackageResolver.ps1` loads through `scripts/`
- Extended focused tests to verify top-level shim delegation, parameter parity, moved implementation parsing, direct moved-runner preview behavior, audit wrapper routing, authorization gates, mixed-worktree blockers, and public command-preview preservation.

### Validation Evidence

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -Command '<parser checks for scripts/run-work-package.ps1 and scripts/work-package/run-work-package.ps1>'`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-222 -Execute None`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/work-package/run-work-package.ps1 WP-222 -Execute None`
- PASS: `git diff --name-only .understand-anything`
  - Returned no graph artifact changes.
- PASS: `Get-ChildItem docs/01-work-packages -Force -File | Where-Object { $_.Name -match '^WP-9\d{3}-.+temp\.md$' } | Select-Object -ExpandProperty Name`
  - Returned no temporary WP fixture files.
- PASS: `git diff --check`
  - Reported known line-ending normalization warnings only for allowed runner and test files.
- PASS: `git status --short --untracked-files=all`
  - Dirty files are limited to WP-222 allowed files.

### Validation Note

The runner/audit-wrapper tests were run serially. They intentionally create temporary WP fixtures and validate worktree isolation, so running them in parallel can make each test observe the other test's temporary fixture as mixed-worktree state.

### Scope Check

- Allowed patterns:
  - `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`
  - `scripts/run-work-package.ps1`
  - `scripts/work-package/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- Modified files:
  - `scripts/run-work-package.ps1`
  - `scripts/work-package/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
  - `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`
- Out-of-scope files:
  - None.

### Follow-Up

After WP-222 is audited, accepted, committed, and pushed, create a focused Understand graph refresh package for the runner relocation before relying on graph relationships for runner/audit-dispatch planning.

## Audit Results

Verdict: PASS

Auditor: independent audit agent

### Scope Violations

- None. Modified and untracked files are limited to WP-222 allowed files:
  - `docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md`
  - `scripts/run-work-package.ps1`
  - `scripts/work-package/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
- No `.understand-anything/**`, docs/skills, app, database, dependency, package, lockfile, output, runtime AI, package-creation helper, audit wrapper, commit helper, lifecycle helper, resolver, SDK manager, agentic workflow, Understand, or student-package files outside the allowed set were changed.

### Public Command Compatibility Findings

- `scripts/run-work-package.ps1` remains present as the public top-level compatibility shim.
- The shim preserves public parameters, aliases, validation sets, ranges, defaults, and switch behavior matching `scripts/work-package/run-work-package.ps1`.
- The shim delegates to the moved implementation with `@PSBoundParameters` and forwards the implementation exit code.
- Audit wrapper routing, agentic workflow previews, and SDK manager recommendations continue to reference the top-level public command path.

### Authorization And Isolation Boundary Findings

- AntiGravity audit execution still requires explicit `-AllowExternalAudit` before repository context can be sent.
- Mixed-worktree isolation still blocks audit dispatch when dirty files fall outside the active WP scope unless `-AllowMixedWorktree` is provided.
- `-Execute None` remains non-executing prompt preview and does not launch implementation or audit agents.

### Missing Validation Evidence

- None. Required validation evidence is recorded in Code Results and was confirmed by audit, including parser checks, runner/audit-wrapper tests, command-preview tests, prompt-preview checks, graph non-modification, temp fixture hygiene, whitespace checks, and scope isolation.

### Regressions

- None.

### Required Corrections

- None.

### Follow-Up

- Create a focused Understand graph refresh package after WP-222 is accepted, committed, and pushed.

## Final Decision

Accepted on 2026-08-05.

Human reviewer accepted the independent PASS audit and implementation evidence. WP-222 preserves the public top-level runner command, moves the implementation behind `scripts/work-package/`, keeps authorization and mixed-worktree audit boundaries intact, and leaves the required follow-up Understand graph refresh as the next work package.

