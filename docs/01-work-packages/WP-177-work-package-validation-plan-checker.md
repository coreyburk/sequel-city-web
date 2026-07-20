# Work Package Validation Plan Checker

## Objective

Add a deterministic repository-local checker that reports whether a work package has an explicit validation plan and whether implementation results record validation evidence.

## Scope

### In Scope

- Add a read-only PowerShell checker for validation planning in one target work package.
- Parse the `Regression Surface` related-tests entry from `Impact Analysis`.
- Parse verification commands from `Code Prompt`, `Audit Prompt`, and `Code Results`.
- Report validation-plan state, related tests, verification commands, validation evidence, and next recommended action.
- Add JSON output for future agentic orchestration.
- Add focused tests for missing plan, plan ready, no-automated-tests explanation, and validation evidence recorded states.
- Update workflow documentation to reference the checker during planning and audit preparation.
- Add a narrow runner usability fix so `scripts/run-work-package.ps1 WP-177 ...` resolves by work-package number.

### Out of Scope

- Running tests, builds, auditors, code agents, or external services.
- Automatically editing work packages.
- OpenAI Agents SDK, new dependencies, Python tooling, MCP servers, or runtime AI.
- Application frontend/backend behavior.
- Database schema, seed, migration, or SQL safety changes.
- Git staging, committing, pushing, stashing, reverting, or cleanup.
- Understand graph regeneration.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current repository state. Later accepted work added database identity validation, AGY runner support, audit/finalization isolation checks, lifecycle readiness checking, and repo-local workflow skills/scripts.
- Analysis performed: Read `SSOT-Development-Workflow.md`, `Work-Package-Lifecycle.md`, `Understand-Codebase-Analysis.md`, planning checklist, agentic workflow evaluation, recent WP-168 through WP-176 records, and current workflow scripts. Used source inspection rather than graph relationships because the relevant surface is development workflow tooling added after the graph baseline.

### Affected Architecture

- Layers:
  - development workflow scripts
  - work-package documentation
  - workflow guidance
- Primary files/components:
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
- Upstream consumers:
  - human developer
  - Codex planning/implementation agents
  - audit agents checking missing tests
  - future OpenAI Agents SDK orchestration
- Downstream dependencies:
  - future repo-native orchestration
  - future test-selection skill improvements
  - future handoff refresh automation

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177 -Execute None`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177-work-package-validation-plan-checker.md -Execute None`
  - `git diff --check`
- User workflows:
  - planning a WP with explicit test/build commands
  - auditing whether missing tests are documented
  - preparing future agentic orchestration preflights
- Security/data boundaries:
  - no runtime AI
  - no application or database changes
  - no external audit invocation
  - no automatic test execution or Git mutation

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds development workflow tooling and documentation only. It does not change application architecture, imports, database structure, Case 004 progression, runtime behavior, or package dependencies.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-177-work-package-validation-plan-checker.md
- scripts/get-work-package-validation-plan.ps1
- scripts/tests/test-work-package-validation-plan.ps1
- scripts/run-work-package.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
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
- docs/00-ssot/**
- docs/01-work-packages/WP-173-database-identity-validation-health-status.md
- docs/01-work-packages/WP-174-agentic-audit-runner-blockage-resolution.md
- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md
- docs/01-work-packages/WP-176-work-package-state-readiness-checker.md

## Constraints

- Keep the checker deterministic, read-only, and repository-local.
- Do not invoke tests, builds, agents, auditors, AGY, Gemini, Codex, Claude, SDKs, or external services.
- Do not add dependencies.
- Do not mutate Git state or work-package content.
- Treat output as advisory evidence for humans and future orchestration; it must not replace audit or human acceptance.
- Keep output stable enough for future scripts or agents to parse.

## Required Behavior

- The checker accepts a work package path or filename and resolves it under `docs/01-work-packages` when needed.
- It extracts:
  - related tests from `Impact Analysis` / `Regression Surface`
  - verification commands from `Code Prompt` and `Audit Prompt`
  - validation evidence from `Code Results`
  - explanatory no-test statements when no automated validation applies
- It reports:
  - validation-plan state
  - related tests
  - planned verification commands
  - recorded validation evidence
  - missing-validation findings
  - next recommended action
- It supports `-Json`.
- It exits non-zero for missing validation-plan states that should stop automation.

## Acceptance Criteria

- [x] `scripts/get-work-package-validation-plan.ps1` reports validation-plan state and next action for a target WP.
- [x] The checker identifies verification commands from code/audit prompt sections.
- [x] The checker identifies validation evidence from code results.
- [x] The checker distinguishes a missing validation plan from an explicit no-automated-tests explanation.
- [x] JSON output is available for future orchestration.
- [x] Focused tests cover missing plan, plan ready, no-automated-tests explanation, validation evidence recorded, and target WP behavior.
- [x] Runner audit tests cover resolving a work package by number-only input such as `WP-177`.
- [x] Workflow docs explain when to use the validation-plan checker.
- [x] No app, database, package, lockfile, graph, runtime AI, SSOT, or generated-output files are modified.

## Code Prompt

Implement WP-177 exactly as scoped.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Do not modify app, database, dependency, package, lockfile, graph, SSOT, handoff, runtime AI, or generated-output files.

Implementation guidance:

1. Add `scripts/get-work-package-validation-plan.ps1`.
2. Keep it read-only: use `Get-Content` and section parsing only.
3. Extract related tests from the `Regression Surface` section when present.
4. Extract verification commands from `Verification:` blocks or bullet/code lines in `Code Prompt` and `Audit Prompt`.
5. Extract validation evidence from `Code Results` lines that record `PASS`, `FAIL`, `SKIP`, `BLOCKED`, command names, or validation headings.
6. Treat explicit no-test explanations as acceptable but distinct from automated validation.
7. Add `-Json` output.
8. Add focused tests under `scripts/tests/test-work-package-validation-plan.ps1`.
9. Update workflow docs with short planning/audit preflight guidance.
10. Add a narrow `scripts/run-work-package.ps1` resolution fix for number-only WP input such as `WP-177`, with focused coverage in `scripts/tests/test-run-work-package-audit-runner.ps1`.
11. Update this WP with results and validation evidence.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177 -Execute None`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177-work-package-validation-plan-checker.md -Execute None`
- `git diff --check`

Return:

- exact files changed
- validation states supported
- validation results
- any limitations

## Audit Prompt

Audit WP-177 against the work package and SSOT development workflow.

Verify:

- The checker is deterministic, read-only, and development-only.
- It does not run tests, mutate Git state, modify WPs automatically, invoke agents, call external services, add dependencies, or affect app/database/runtime behavior.
- It accurately distinguishes missing validation plans from explicit no-test explanations and recorded validation evidence.
- JSON output is suitable for future orchestration without adding SDK dependencies.
- Tests cover required validation-plan states.
- Workflow documentation aligns with the implementation.
- No files outside the allowed list were modified.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Missing validation-plan states or parsing defects
- Mutation or boundary risks
- Missing tests
- Recommended corrections

## Code Results

Implemented.

Files changed:

- `docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
- `scripts/get-work-package-validation-plan.ps1`
- `scripts/tests/test-work-package-validation-plan.ps1`
- `scripts/run-work-package.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`

Validation states supported:

- `ValidationPlanMissing`
- `ValidationPlanReady`
- `NoAutomatedValidationExplained`
- `ValidationEvidenceRecorded`

Implementation details:

- Added `scripts/get-work-package-validation-plan.ps1` as a read-only validation-plan checker.
- Added text output and `-Json` output for future orchestration.
- Parsed related tests from `Impact Analysis` / `Regression Surface`.
- Parsed planned verification commands from command-looking lines in `Code Prompt` and `Audit Prompt`.
- Parsed validation evidence from `Code Results` lines that record validation state or command outcomes.
- Added explicit no-automated-validation explanation handling while avoiding false positives from command arguments such as `-Execute None`.
- Added fixture-based tests for missing plan, plan ready, no-automated-tests explanation, recorded validation evidence, and real WP-177 behavior.
- Updated contributor and lifecycle documentation to describe the checker as a read-only planning/audit preflight.
- Updated `scripts/run-work-package.ps1` to resolve unique number-only WP inputs such as `WP-177` to `WP-177-*.md`.
- Added a focused assertion to `scripts/tests/test-run-work-package-audit-runner.ps1` using a temporary `WP-9999-*.md` fixture.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177 -Execute None`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177-work-package-validation-plan-checker.md -Execute None`
- PASS: `git diff --check` with CRLF warnings only.

Limitations:

- The checker is intentionally heuristic and advisory. It does not infer the correct test suite for a source change; it verifies whether a WP records related tests, planned commands, recorded evidence, or a no-automated-validation explanation.

## Audit Results

### Audit Results: WP-177 Work Package Validation Plan Checker

- **Verdict**: PASS

---

### Audit Findings

#### 1. Scope Violations
- **None**.
- All modified and newly created files match the explicit list under **Files Allowed to Change** in [WP-177-work-package-validation-plan-checker.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-177-work-package-validation-plan-checker.md#L85-L96):
  - `docs/01-work-packages/WP-177-work-package-validation-plan-checker.md`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
  - `scripts/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- No application (`apps/**`), database (`database/**`), dependency (`package.json`), graph (`.understand-anything/**`), or SSOT documentation (`docs/00-ssot/**`) files were modified.

#### 2. Missing Validation-Plan States or Parsing Defects
- **None**.
- The checker script [get-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-validation-plan.ps1) accurately parses and categorizes all four specified validation-plan lifecycle states:
  1. `ValidationPlanMissing`: No related tests, planned commands, or no-automation explanation present (returns exit code 2).
  2. `ValidationPlanReady`: Related tests or planned verification commands extracted from `Impact Analysis` / `Regression Surface`, `Code Prompt`, or `Audit Prompt` (returns exit code 0).
  3. `NoAutomatedValidationExplained`: Clear statement in related tests explaining why no automated tests apply (e.g. docs-only change) (returns exit code 0).
  4. `ValidationEvidenceRecorded`: Validation evidence or PASS/FAIL status recorded under `Code Results` (returns exit code 0).
- Standardized `-Json` output is generated via native PowerShell `ConvertTo-Json` without introducing external SDK or npm dependencies.

#### 3. Mutation or Boundary Risks
- **None**.
- The script is purely read-only (using `Get-Content` and section parsing).
- Does not execute tests, invoke external services or AI agents (AGY, Gemini, Codex), modify work package files automatically, mutate Git state, or affect runtime application/database behavior.

#### 4. Missing Tests
- **None**.
- [test-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-validation-plan.ps1) creates an isolated temporary work package fixture to test all four validation-plan states (`ValidationPlanMissing`, `ValidationPlanReady`, `NoAutomatedValidationExplained`, and `ValidationEvidenceRecorded`) plus verification against `WP-177`.
- [test-run-work-package-audit-runner.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-run-work-package-audit-runner.ps1) verifies number-only work package resolution (`WP-177` -> `WP-177-*.md`).
- All tests pass cleanly:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1` -> `PASS`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1` -> `PASS`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 docs/01-work-packages/WP-177-work-package-validation-plan-checker.md` -> `PASS`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-177 -Execute None` -> `PASS`
  - `git diff --check` -> `PASS`

#### 5. Recommended Corrections
- **None**. Implementation is complete, compliant, and ready for human final decision.

## Final Decision

Accepted.

Reason: Human instruction was given to review, update, commit, and push after audit completion. AGY audit passed with no scope violations, missing validation-plan states, parsing defects, mutation risks, boundary risks, missing tests, or recommended corrections. WP-177 remains development-only, adds no dependencies or runtime AI behavior, preserves application/database/SSOT/graph boundaries, and modifies only the allowed workflow script, test, documentation, and work-package files.

