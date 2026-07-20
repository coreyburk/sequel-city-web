# Work Package State Readiness Checker

## Objective

Add a deterministic repository-local checker that classifies a work package's current lifecycle state and reports the next allowed action before an agent, auditor, or finalizer proceeds.

## Scope

### In Scope

- Add a PowerShell readiness/status checker for one target work package.
- Classify core lifecycle states from the WP sections: planning incomplete, ready for implementation, implementation recorded, audit recorded, accepted, rejected/deferred, or blocked by mixed worktree.
- Reuse the same `Allowed:`/`Do Not Modify:` scope semantics used by the runner and commit helper.
- Report concise next-action guidance for humans and future orchestration agents.
- Add focused script validation for section parsing, status classification, final decision handling, and mixed-worktree detection.
- Update workflow documentation to reference the readiness checker as an advisory preflight.

### Out of Scope

- OpenAI Agents SDK installation or dependency changes.
- Full multi-agent orchestration.
- Automatic implementation, audit, commit, push, stash, revert, or cleanup.
- Runtime AI behavior, runtime LLM calls, MCP runtime requirements, cloud services, or external APIs.
- Application frontend/backend behavior.
- Database schema, seed, migration, or SQL safety changes.
- Understand graph regeneration.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current repository state. Later accepted work added database identity validation, AGY runner support, audit/finalization isolation checks, and repo-local workflow skills/scripts.
- Analysis performed: Read `SSOT-Development-Workflow.md`, `Work-Package-Lifecycle.md`, `Understand-Codebase-Analysis.md`, the agentic workflow evaluation, recent WP-168 through WP-175 records, and the current work-package runner/finalization scripts. Used source inspection rather than graph relationships for scope because the graph baseline is stale for the relevant script workflow surface.

### Affected Architecture

- Layers:
  - development workflow scripts
  - work-package documentation
  - workflow guidance
- Primary files/components:
  - `scripts/get-work-package-status.ps1`
  - `scripts/tests/test-work-package-status.ps1`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/01-work-packages/WP-176-work-package-state-readiness-checker.md`
- Upstream consumers:
  - human developer
  - Codex planning/implementation agents
  - future agentic orchestration layer
  - audit/finalization workflow
- Downstream dependencies:
  - future OpenAI Agents SDK evaluation
  - future repo-native work-package orchestration
  - future handoff refresh automation

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md`
  - `git diff --check`
- User workflows:
  - checking whether a WP is ready for implementation
  - checking whether audit should run
  - checking whether finalization can proceed
  - detecting unrelated dirty files before audit/finalization
- Security/data boundaries:
  - no runtime AI
  - no application or database changes
  - no external audit invocation
  - no automatic Git staging, committing, pushing, stashing, reverting, or destructive cleanup

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds development workflow tooling and documentation only. It does not change application architecture, imports, database structure, Case 004 progression, runtime behavior, or dependency graph. The existing graph is already stale for planning, but this package should not refresh graph artifacts as part of the change.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-176-work-package-state-readiness-checker.md
- scripts/get-work-package-status.ps1
- scripts/tests/test-work-package-status.ps1
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- .understand-anything/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-Database-Schema.md
- docs/01-work-packages/WP-173-database-identity-validation-health-status.md
- docs/01-work-packages/WP-174-agentic-audit-runner-blockage-resolution.md
- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md

## Constraints

- Keep the checker deterministic and repository-local.
- Do not invoke Codex, Claude, Gemini, AGY, OpenAI Agents SDK, or external services.
- Do not add dependencies.
- Do not mutate the target WP, stage files, commit, push, stash, revert, or delete files.
- Preserve existing runner and commit helper behavior.
- Treat the checker as advisory; it must not replace human final acceptance or independent audit.
- Keep output stable enough for future scripts or agents to parse.

## Required Behavior

- The checker accepts a work package path or filename and resolves it under `docs/01-work-packages` when needed.
- It reads the standard sections and reports:
  - work package path
  - lifecycle state
  - whether code results exist
  - whether audit results exist
  - final decision value
  - dirty files
  - out-of-scope dirty files based on `Allowed:` patterns
  - next recommended action
- It recognizes accepted/approved, rejected, deferred, and pending final decisions.
- It blocks audit/finalization readiness when dirty files include paths outside the active WP's allowed scope.
- It supports a machine-readable JSON output mode.
- It exits non-zero only for true tool failures or blocked readiness states that should stop automation.

## Acceptance Criteria

- [x] A new `scripts/get-work-package-status.ps1` script reports lifecycle state and next action for a target WP.
- [x] The script uses the same exact-path and `/**` directory-glob semantics documented for work-package scope checks.
- [x] Mixed worktree detection identifies out-of-scope dirty files without mutating them.
- [x] JSON output mode is available for future orchestration.
- [x] Focused tests cover planning-incomplete, ready-for-implementation, implemented-needs-audit, audited-needs-final-decision, accepted, rejected/deferred, and mixed-worktree blocked states.
- [x] Focused tests cover blocked audit records so automation does not treat a blocked audit as an independent audit pass.
- [x] Workflow docs explain when to use the readiness checker.
- [x] No app, database, package, lockfile, graph, runtime AI, or generated-output files are modified.

## Code Prompt

Implement WP-176 exactly as scoped.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Do not modify app, database, dependency, package, lockfile, graph, handoff, runtime AI, or generated-output files.

Implementation guidance:

1. Add `scripts/get-work-package-status.ps1`.
2. Reuse the existing work-package section parsing and path normalization style from `scripts/run-work-package.ps1` and `scripts/commit-work-package.ps1` where practical.
3. Parse `Allowed:` and `Do Not Modify:` patterns with exact-path and directory-glob semantics.
4. Use `git status --porcelain` only to inspect dirty files; do not mutate Git state.
5. Classify lifecycle state conservatively:
   - missing/incomplete required planning sections
   - ready for implementation
   - implementation recorded, needs audit
   - audit recorded, needs final decision
   - accepted/approved
   - rejected/deferred
   - blocked by mixed worktree
6. Add `-Json` output mode for future agent orchestration.
7. Add focused tests under `scripts/tests/test-work-package-status.ps1` using temporary WP files and temporary out-of-scope dirty files.
8. Update workflow docs with short preflight guidance.
9. Update this WP with code results and validation evidence.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-176-work-package-state-readiness-checker.md -Execute None`
- `git diff --check`

Return:

- exact files changed
- lifecycle states supported
- validation results
- any limitations

## Audit Prompt

Audit WP-176 against the work package and SSOT development workflow.

Verify:

- The checker is deterministic and development-only.
- The checker does not mutate files, Git state, app behavior, database state, dependencies, graph artifacts, runtime AI boundaries, or external services.
- Lifecycle classification is conservative and does not replace human acceptance or independent audit.
- Mixed-worktree detection is consistent with the documented `Allowed:` semantics.
- JSON output is suitable for future orchestration without adding SDK dependencies.
- Tests cover the required lifecycle states and mixed-worktree block.
- Workflow documentation aligns with the implementation.
- No files outside the allowed list were modified.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Missing states or readiness defects
- Mutation or boundary risks
- Missing tests
- Recommended corrections

## Code Results

Implemented.

Files changed:

- `docs/01-work-packages/WP-176-work-package-state-readiness-checker.md`
- `scripts/get-work-package-status.ps1`
- `scripts/tests/test-work-package-status.ps1`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`

Lifecycle states supported:

- `PlanningIncomplete`
- `ReadyForImplementation`
- `ImplementedNeedsAudit`
- `AuditedNeedsFinalDecision`
- `AuditBlockedNeedsResolution`
- `AcceptedReadyForFinalization`
- `ClosedRejected`
- `ClosedDeferred`
- `BlockedMixedWorktree`

Implementation details:

- Added `scripts/get-work-package-status.ps1` as a read-only lifecycle/readiness checker for a target WP.
- Added text output and `-Json` output for future orchestration.
- Parsed standard WP sections, `Allowed:` patterns, `Do Not Modify:` patterns, code results, audit results, and final decision state.
- Used exact-path and directory-glob `/**` matching consistent with the documented work-package scope semantics.
- Used `git status --porcelain` for dirty-file inspection only; the script does not stage, commit, push, stash, revert, delete, invoke auditors, or mutate the target WP.
- Added blocked readiness behavior for out-of-scope dirty files and blocked audit records.
- Added fixture-based tests for planning-incomplete, ready, implemented, audited, audit-blocked, accepted, rejected, deferred, and mixed-worktree blocked states.
- Updated contributor and lifecycle documentation to describe the checker as a read-only preflight before implementation, audit, or finalization.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md` initially reported `ImplementedNeedsAudit` before the AGY attempt.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md -Json` now reports `AuditBlockedNeedsResolution` with exit code `2`, `auditBlocked: true`, and no out-of-scope dirty files after the blocked AGY attempt was recorded.
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-176-work-package-state-readiness-checker.md -Execute None`
- PASS: `git diff --check` with CRLF warnings only.

AGY audit attempt:

- BLOCKED: Codex policy rejected the `scripts/run-work-package.ps1 WP-176-work-package-state-readiness-checker.md -Execute AntiGravity -AllowExternalAudit -AntiGravityTimeoutMinutes 10` invocation before AGY ran because the request would send repository prompt/diff context to an external destination from the Codex environment.
- No independent AGY verdict was produced inside Codex.

Post-audit correction:

- Added an explicit `PlanningIncomplete` fixture assertion to `scripts/tests/test-work-package-status.ps1` after the independent audit identified that state as an untested gap.
- The new assertion verifies both the `PlanningIncomplete` state and that `Objective` appears in `missingPlanningSections`.

## Audit Results

# Audit Report: WP-176 State Readiness Checker

- **Target Work Package**: [WP-176-work-package-state-readiness-checker.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-176-work-package-state-readiness-checker.md)
- **Repository Path**: `D:\GitHub-Repos\SequelCityWeb`

---

## Audit Checklist Verification

| Verification Requirement | Status | Details |
| :--- | :---: | :--- |
| **Deterministic & Development-Only** | **PASS** | Pure PowerShell script operating locally via regex parsing and standard `git status`. No dynamic AI calls, external network APIs, or non-deterministic behavior. |
| **Zero Mutation / Boundary Risks** | **PASS** | Operates strictly read-only (`Get-Content` and `git status --porcelain`). Does not mutate target files, Git index/tree, database state, app behavior, dependencies, graph artifacts, or AI boundaries. |
| **Conservative Lifecycle Classification** | **PASS** | Advisory preflight script. Correctly distinguishes blocked audits (`AuditBlockedNeedsResolution`) from completed audits (`AuditedNeedsFinalDecision`), exiting with code `2` on blocked states. Does not auto-accept or bypass human/auditor verification. |
| **Mixed-Worktree Detection** | **PASS** | Reuses exact path and `/**` directory-glob scope semantics matching `scripts/commit-work-package.ps1` and `scripts/run-work-package.ps1`. Accurately flags out-of-scope dirty files. |
| **JSON Output & SDK Independence** | **PASS** | `-Json` switch formats output via built-in `ConvertTo-Json -Depth 6`. Zero external dependencies or SDK requirements added. |
| **Lifecycle & Mixed-Worktree Tests** | **PASS** | [test-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-status.ps1) verifies 8 lifecycle states including blocked audit and out-of-scope mixed worktree blocking. |
| **Workflow Documentation Alignment** | **PASS** | Preflight instructions added to [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md) and [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md). |
| **Allowed File Scope Compliance** | **PASS** | Only the 5 allowed files were created/modified. No app, database, lockfile, graph, or SSOT files were touched. |

---

## Detailed Audit Results

### Verdict
**PASS**

### Scope Violations
- **None**. All changed and created files match the exact `Allowed:` list in WP-176:
  - [WP-176-work-package-state-readiness-checker.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-176-work-package-state-readiness-checker.md)
  - [get-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1)
  - [test-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-status.ps1)
  - [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md)
  - [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md)

### Missing States or Readiness Defects
- **None**. Supports all 9 required/classified lifecycle states:
  1. `PlanningIncomplete`
  2. `ReadyForImplementation`
  3. `ImplementedNeedsAudit`
  4. `AuditedNeedsFinalDecision`
  5. `AuditBlockedNeedsResolution`
  6. `AcceptedReadyForFinalization`
  7. `ClosedRejected`
  8. `ClosedDeferred`
  9. `BlockedMixedWorktree`

### Mutation or Boundary Risks
- **None**. The script executes `git status --porcelain` in read-only mode and reads target markdown files without staging, committing, stashing, reverting, writing files, or calling external web/AI services.

### Missing Tests
- Minor test gap: `PlanningIncomplete` is implemented in [get-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1#L288-L290), but [test-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-status.ps1) does not include a specific assertion for a work package with missing planning sections.

### Recommended Corrections
1. **Add explicit test case for `PlanningIncomplete`**: Update [test-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-status.ps1) to pass a fixture missing an required section (e.g. `## Objective`) to verify it classifies as `PlanningIncomplete`.

Post-audit correction applied:

- Added the explicit `PlanningIncomplete` fixture test recommended above.
- The test now verifies both state classification and the missing-section list.

---

## Summary of Verification Commands Run
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`: **PASS**
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md`: **PASS** (Reports `AuditBlockedNeedsResolution` with exit code `2` as expected due to the blocked AGY audit attempt recorded in WP-176).
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-176-work-package-state-readiness-checker.md -Json`: **PASS** (Valid JSON output).
- `git diff --check`: **PASS**

## Final Decision

Accepted.

Reason: Human instruction was given to review, update, commit, and push after audit completion. The AGY audit verdict was `PASS`; the only recommended correction was the missing explicit `PlanningIncomplete` fixture, which has been added. WP-176 remains development-only, preserves human acceptance and independent audit boundaries, adds no dependencies or runtime AI behavior, and modifies only the allowed workflow/script/test files.

