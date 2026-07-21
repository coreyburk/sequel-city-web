# Audit Work Package Command Wrapper

## Objective

Add a clear audit-only command wrapper so independent work-package audits can be requested without using the ambiguous `run-work-package.ps1 -Execute AntiGravity` command shape.

## Scope

### In Scope

- Add `scripts/audit-work-package.ps1` as a thin wrapper around `scripts/run-work-package.ps1`.
- Default the wrapper to `AntiGravity` while preserving Gemini as an explicit supported audit agent.
- Support `WP-###` shorthand and all work-package identifiers already supported by `run-work-package.ps1`.
- Preserve explicit external-audit authorization requirements for AntiGravity.
- Add focused wrapper tests with mock AGY execution.
- Update audit workflow docs and repo-local audit skill references to prefer the audit-only wrapper.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP state before final closeout.

### Out of Scope

- Renaming or removing `scripts/run-work-package.ps1`.
- Changing underlying audit execution, result-writing, timeout, isolation, or blocker behavior.
- Adding OpenAI Agents SDK, MCP, runtime AI, external services, or dependencies.
- Application frontend/backend behavior.
- Database schema, seed, migration, bootstrap, or SQL safety behavior.
- Understand graph regeneration.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current workflow tooling because WP-170 through WP-179 added and changed repo-local skills and helper scripts after the graph baseline.
- Analysis performed: Read workflow SSOT, work-package lifecycle docs, audit execution guide, audit runner contract skill/reference, planning checklist, current runner/resolver scripts, and existing audit-runner tests. Used direct source/test inspection because the affected surface is workflow tooling added after the graph baseline.

### Affected Architecture

- Layers:
  - development workflow scripts
  - audit workflow documentation
  - repo-local audit skill guidance
  - work-package lifecycle documentation
  - live handoff documentation
- Primary files/components:
  - `scripts/audit-work-package.ps1`
  - `scripts/run-work-package.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md`
- Upstream consumers:
  - human developer audit requests
  - Codex closeout/audit workflow
  - future agentic orchestration over work-package lifecycle helpers
- Downstream dependencies:
  - `run-work-package.ps1` remains the single execution engine
  - AGY authorization and worktree isolation gates remain unchanged
  - audit result writing remains unchanged

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-180 -Execute None`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-180`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-180`
  - `git diff --check`
- User workflows:
  - running an AGY audit with a clearly named audit command
  - running a Gemini audit through the same wrapper
  - asking agents to audit a WP without implying implementation execution
  - closeout after external audit
- Security/data boundaries:
  - no runtime application changes
  - no database changes
  - no dependency changes
  - no runtime AI behavior
  - AGY still requires explicit `-AllowExternalAudit`

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds a development workflow wrapper, focused tests, docs, skill guidance, and handoff state. It does not alter application architecture, imports, database structure, Case 004 progression, package dependencies, or runtime behavior.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md
- scripts/audit-work-package.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- .codex/skills/sequel-city-audit-runner-contracts/SKILL.md
- .codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- .understand-anything/**
- scripts/run-work-package.ps1
- scripts/lib/**
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md

## Constraints

- Keep `run-work-package.ps1` as the canonical execution engine.
- Do not duplicate audit process logic in the wrapper.
- Preserve AGY external-audit authorization and mixed-worktree isolation behavior.
- Preserve Gemini audit support.
- Do not change app, database, package, lockfile, graph, dependency, or runtime AI files.
- Do not commit or push until audit passes and Final Decision is accepted.

## Required Behavior

- `scripts/audit-work-package.ps1 WP-180 -AllowExternalAudit -TimeoutMinutes 30` must invoke `run-work-package.ps1 WP-180 -Execute Audit -AuditAgent AntiGravity -AllowExternalAudit -AntiGravityTimeoutMinutes 30`.
- The wrapper must default `-Agent` to `AntiGravity`.
- The wrapper must allow `-Agent Gemini` and map timeout to `-GeminiTimeoutMinutes`.
- The wrapper must pass `-AllowMixedWorktree` through to the runner.
- The wrapper must return the runner exit code.
- Documentation and audit skill guidance must present the wrapper as the preferred audit-only command while retaining `run-work-package.ps1` as the underlying/backward-compatible execution surface.

## Acceptance Criteria

- [x] `scripts/audit-work-package.ps1` exists and parses.
- [x] Wrapper defaults to AntiGravity.
- [x] Wrapper supports `-Agent Gemini`.
- [x] Wrapper preserves `-AllowExternalAudit`, `-AllowMixedWorktree`, and timeout behavior.
- [x] Wrapper uses `run-work-package.ps1 -Execute Audit` internally.
- [x] Focused wrapper test proves blocked AGY behavior without `-AllowExternalAudit`.
- [x] Focused wrapper test proves mock AGY PASS behavior with `-AllowExternalAudit`.
- [x] Docs and audit skill references prefer the wrapper for audit-only requests.
- [x] No app, database, package, lockfile, graph, runtime AI, or unrelated files changed.

## Code Prompt

Implement WP-180 exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Keep `scripts/run-work-package.ps1` unchanged.
- Keep all app, database, dependency, package, lockfile, graph, and runtime AI files unchanged.

Implementation:

1. Add `scripts/audit-work-package.ps1` as a thin wrapper over `scripts/run-work-package.ps1 -Execute Audit`.
2. Add focused tests for wrapper parse, default AntiGravity routing, blocked missing authorization behavior, and mock AGY PASS behavior.
3. Update the audit execution guide, contributor workflow guide, audit runner skill, and audit contract reference to prefer the wrapper.
4. Update this WP with Code Results and validation evidence.
5. Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP state.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-180 -Execute None`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-180`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-180`
- `git diff --check`

Return:

- Exact code changes
- Validation results
- Any limitations

## Audit Prompt

Audit WP-180 against this work package and development workflow docs.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- The wrapper is audit-only and delegates to `run-work-package.ps1 -Execute Audit`.
- Default agent is AntiGravity.
- Gemini remains supported.
- AGY still requires explicit external-audit authorization.
- Worktree isolation and audit result writing remain owned by the runner.
- Docs and audit skill references prefer the wrapper without breaking existing runner commands.
- Handoff was refreshed for the current repo state.
- No app, database, package, lockfile, graph, runtime AI, or unrelated files changed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Wrapper behavior gaps
- Documentation gaps
- Missing tests
- Boundary risks

## Code Results

Implemented.

Files changed:

- `scripts/audit-work-package.ps1`
- `scripts/tests/test-audit-work-package-wrapper.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md`

Implementation summary:

- Added `scripts/audit-work-package.ps1` as a thin audit-only wrapper over `scripts/run-work-package.ps1 -Execute Audit`.
- Defaulted the wrapper to AntiGravity and preserved explicit `-Agent Gemini` support.
- Passed `-AllowExternalAudit`, `-AllowMixedWorktree`, and `-TimeoutMinutes` through to the underlying runner.
- Added focused wrapper tests for parsing, default AGY routing, missing authorization blocker behavior, and mock AGY PASS behavior.
- Updated existing audit-runner fixture scope for the new wrapper package.
- Updated contributor, execution-guide, audit-contract, and audit-skill guidance to prefer the wrapper for audit-only requests while preserving the runner as the canonical execution engine.
- Refreshed the live handoff for the current WP-180 state.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-180 -Execute None`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-180`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-180`
- PASS: `git diff --check` with CRLF warnings only.

Limitations:

- Independent AGY audit was run outside Codex by the human because Codex cannot directly invoke AGY under the current external-audit policy boundary.

## Audit Results

# WP-180 Audit Report

## Verdict
**PASS**

---

## Detailed Audit Summary

### 1. Acceptance Criteria Verification
- **`scripts/audit-work-package.ps1` exists & parses**: Verified. PowerShell AST parser test passes without syntax or structural errors.
- **Default agent is AntiGravity**: Verified. `[string]$Agent = "AntiGravity"` is configured in the script param block.
- **Gemini remains supported**: Verified. `[ValidateSet("AntiGravity", "Gemini")]` is enforced, mapping `-Agent Gemini` to `-AuditAgent Gemini` in the runner call.
- **AGY external-audit authorization requirement preserved**: Verified. `-AllowExternalAudit` switch is passed through to the runner. Without `-AllowExternalAudit`, execution blocks at the runner authorization gate and records a blocked result without sending repo context to AGY.
- **Delegation to `run-work-package.ps1 -Execute Audit`**: Verified. The wrapper contains no custom execution or writing logic; it calls `run-work-package.ps1` with `-Execute Audit`.
- **Worktree isolation and result writing owned by runner**: Verified. The wrapper relies entirely on `run-work-package.ps1` for worktree dirty file checks, isolation enforcement, and markdown result writing.
- **Wrapper tests pass**: Verified via `scripts/tests/test-audit-work-package-wrapper.ps1`.
- **Runner tests pass**: Verified via `scripts/tests/test-run-work-package-audit-runner.ps1`.
- **Documentation & skills preference**: Updated across developer guides and skill contracts to prefer `audit-work-package.ps1` for audit-only operations while maintaining full backward compatibility for `run-work-package.ps1`.

---

### 2. Scope Violations
**None.** 
All changed and created files fall strictly within the `Files Allowed to Change` list defined in `WP-180`:
- `docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md`
- `scripts/audit-work-package.ps1`
- `scripts/tests/test-audit-work-package-wrapper.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

No files outside this list were touched.

---

### 3. Wrapper Behavior Gaps
**None.**
- `scripts/audit-work-package.ps1` correctly handles `-WorkPackage` (with aliases `Name`, `Task`, `Id`), `-Agent`, `-AllowExternalAudit`, `-AllowMixedWorktree`, and `-TimeoutMinutes`.
- Option routing maps `-TimeoutMinutes` to `-AntiGravityTimeoutMinutes` when `-Agent AntiGravity` and to `-GeminiTimeoutMinutes` when `-Agent Gemini`.
- Returns `$LASTEXITCODE` matching the runner's exit code.

---

### 4. Documentation Gaps
**None.**
- [Codex-Gemini-Execution-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Codex-Gemini-Execution-Guide.md#L27-L32): Introduces `scripts/audit-work-package.ps1` as the preferred audit-only command wrapper.
- [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md#L86): Recommends `scripts/audit-work-package.ps1 <work-package> -AllowExternalAudit` for audit-only requests.
- [SKILL.md](file:///D:/.codex/skills/sequel-city-audit-runner-contracts/SKILL.md#L45): Updates skill rules to prefer the wrapper.
- [audit-contract.md](file:///D:/.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md#L33): Clarifies wrapper syntax for audit-only requests.
- [END-OF-DAY-HANDOFF.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/END-OF-DAY-HANDOFF.md): Updated for WP-180 implementation state and next steps.

---

### 5. Missing Tests
**None.**
- `test-audit-work-package-wrapper.ps1` tests parser validation, AntiGravity default selection, `-Execute Audit` mapping, missing external authorization blocking, and mock AGY PASS result writing.
- `test-run-work-package-audit-runner.ps1` allowed files fixture was updated to include WP-180 files and passes clean.

---

### 6. Boundary Risks
**None.**
- No changes to `apps/`, `database/`, `package.json`, `package-lock.json`, `.understand-anything/`, or runtime AI agents/dependencies.
- Security boundary requiring explicit `-AllowExternalAudit` for AGY is preserved and tested.
- Worktree isolation gates remain fully enforced by `run-work-package.ps1`.
The audit for **WP-180** is complete and verified against the work package specification and repository development workflow documentation.

### Final Audit Summary

- **Verdict**: **PASS**
- **Scope Violations**: None. All modified and untracked files are within the allowed file list.
- **Wrapper Behavior Gaps**: None. `scripts/audit-work-package.ps1` correctly defaults to `AntiGravity`, supports `-Agent Gemini`, hardcodes `-Execute Audit`, forwards parameters (`-AllowExternalAudit`, `-AllowMixedWorktree`, `-TimeoutMinutes`), and returns exit codes.
- **Documentation Gaps**: None. `Codex-Gemini-Execution-Guide.md`, `Contributor-Workflow-Guide.md`, `.codex/skills/sequel-city-audit-runner-contracts`, and `END-OF-DAY-HANDOFF.md` have been updated.
- **Missing Tests**: None. `test-audit-work-package-wrapper.ps1` and `test-run-work-package-audit-runner.ps1` both run clean and pass.
- **Boundary Risks**: None. External audit authorization requirements, worktree isolation enforcement, and audit result writing remain intact in `scripts/run-work-package.ps1`. Application, database, package, lockfile, graph, and runtime AI surfaces were not altered.

## Final Decision

Accepted.

Reason: Human instruction was given to close out WP-180 after completed audit. AntiGravity audit returned PASS with no scope violations, wrapper behavior gaps, documentation gaps, missing tests, or boundary risks. WP-180 satisfies its acceptance criteria by adding a clear audit-only wrapper over the existing runner, preserving runner-owned authorization/isolation/result-writing behavior, updating focused tests and audit guidance, and preserving app, database, package, lockfile, graph, dependency, runtime AI, and unrelated-file boundaries.

