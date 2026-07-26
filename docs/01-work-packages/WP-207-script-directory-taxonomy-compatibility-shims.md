# WP-207: Script Directory Taxonomy And Compatibility Shims

## Objective

Define a narrow migration plan for organizing the increasingly crowded top-level `scripts/` command surface into domain subdirectories while preserving existing documented command paths through compatibility shims.

## Scope

### In Scope

- Inventory top-level scripts by functional domain.
- Identify command-path references in docs, work packages, tests, and repo-local skills that would be affected by moving scripts.
- Propose a target `scripts/` taxonomy for workflow, agentic, Understand, student-package, and shared helper scripts.
- Define compatibility-shim requirements so existing commands such as `scripts/get-work-package-status.ps1` continue to work during and after migration.
- Define validation and audit requirements for a later implementation package.
- Keep this package planning-only; no script moves are authorized here.

### Out of Scope

- Moving or renaming script files.
- Creating compatibility shims.
- Updating production script imports or command previews.
- Updating docs, skills, or tests beyond this WP record.
- Changing workflow behavior, status/decision output contracts, audit/finalization gates, SDK manager semantics, graph refresh behavior, app runtime, database behavior, or package/dependency state.
- Adding dependencies, runtime AI, external calls, graph refresh, app startup, browser automation, package/lockfile changes, output artifact changes, or Case 004 progression changes.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `7186b432ad74156d817cdb552eb01dbe1581def6`.
- Freshness assessment: Structurally stale for this planning surface. Current `HEAD` is `fe314a3`; accepted WP-205 changed workflow helper scripts and tests after the graph baseline, and uncommitted WP-206 planning exists. Because this package concerns script organization and command-path relationships, graph relationship data was not relied on as authoritative.
- Analysis performed: Recommended-tier workflow tooling planning. Used direct source and docs search for top-level `scripts/*.ps1` commands and references across `scripts/`, `scripts/tests/`, `docs/05-development-workflow/`, `.codex/skills/`, and recent work packages. Confirmed the current `scripts/` directory has only `lib/` and `tests/` subdirectories while many newer workflow commands remain flat at top level.

### Affected Architecture
- Layers: development workflow tooling, command-line compatibility surface, repo-local skills, documentation command examples, tests.
- Primary files/components:
  - `scripts/*.ps1`
  - `scripts/tests/*.ps1`
  - `scripts/lib/WorkPackageResolver.ps1`
  - `.codex/skills/sequel-city-*/*`
  - `docs/05-development-workflow/*`
  - `docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md`
- Upstream consumers:
  - contributors running documented `scripts/*.ps1` commands
  - work-package runner and closeout/finalization flows
  - AGY/Gemini audit wrapper workflows
  - agentic workflow status/decision checks
  - SDK manager dry-run tooling
  - Understand refresh wrappers
- Downstream dependencies:
  - command previews embedded in helper JSON/text output
  - tests that assert command-preview text and evidence source strings
  - docs and skills that instruct agents to call top-level script paths
  - Git worktree/audit/finalization gates that rely on stable script names

### Regression Surface
- Related tests for a later implementation package:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- User workflows:
  - creating, running, auditing, accepting, committing, and pushing work packages
  - checking agentic workflow status and next-action recommendations
  - running SDK manager dry-run recommendations
  - refreshing or checking Understand graph readiness
  - building and starting student tester packages
- Security/data boundaries:
  - development-only command organization
  - no runtime AI
  - no live SDK/model calls
  - no external audit dispatch changes
  - no dependency installation
  - no app/database/package/lockfile changes
  - no graph baseline mutation
  - no destructive filesystem cleanup

### Graph Update Decision
- Regeneration required: No for this planning package.
- Rationale: This package creates a migration plan only and does not change scripts. If a later implementation package moves scripts or adds shims, graph regeneration should be considered after acceptance because it will materially change workflow-tooling file relationships.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md`
- docs/05-development-workflow/**
- .codex/**
- .understand-anything/**
- tools/**
- scripts/**
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Planning-only package.
- Do not move scripts, create shims, or update command references in this WP.
- Preserve current documented command paths as the compatibility baseline.
- Treat top-level `scripts/*.ps1` names as public contributor-facing entry points until a later accepted migration package proves replacement safety.
- Do not break AGY audit, closeout, commit-helper, work-package runner, SDK manager, Understand refresh, or student-package workflows.
- Do not add dependencies or introduce runtime AI, external calls, app/database changes, package/lockfile changes, graph changes, output artifacts, or Case 004 progression changes.

## Required Behavior

- The plan must inventory the current top-level script groups:
  - work-package lifecycle and execution
  - agentic workflow status/decision
  - SDK manager dry-run tooling
  - Understand graph tooling
  - student package and local setup tooling
  - shared libraries and tests
- The plan must propose a target taxonomy, for example:
  - `scripts/work-packages/`
  - `scripts/agentic-workflow/`
  - `scripts/understand/`
  - `scripts/student-package/`
  - `scripts/lib/`
  - `scripts/tests/`
- The plan must require top-level compatibility shims for existing public commands unless a command is proven internal-only.
- The plan must require shim tests that prove old top-level commands still invoke the moved implementation and preserve exit codes, parameters, JSON/text output, command-preview strings, and dry-run safety.
- The plan must identify docs, skills, tests, and helper output strings that would need reference updates or deliberate preservation.
- The plan must define a future implementation sequence that minimizes blast radius and allows auditing before graph refresh.

## Acceptance Criteria

- [x] Current top-level script groups are inventoried.
- [x] Proposed target subdirectory taxonomy is documented.
- [x] Compatibility-shim policy is documented for public commands.
- [x] Internal-only versus public command classification criteria are documented.
- [x] Required future validation suite is documented.
- [x] Required docs/skills/reference update strategy is documented.
- [x] Migration sequencing and rollback/safety expectations are documented.
- [x] Graph regeneration decision for this planning package and later implementation package is documented.
- [x] Code Results remain pending until implementation is separately requested.
- [x] Audit Results remain pending until audit is separately requested.
- [x] Final Decision remains pending until human acceptance.
- [x] No files outside this WP record are changed.

## Code Prompt

Do not implement script moves or shims in this package.

Planning task:
1. Review current `scripts/` layout and command references.
2. Produce a concise migration plan in this WP's `Code Results` section only if implementation is separately requested.
3. The migration plan must include:
   - current script inventory by domain
   - proposed target directories
   - public command compatibility-shim policy
   - internal-only command criteria
   - docs/skills/test reference update strategy
   - validation commands for a later implementation WP
   - graph refresh recommendation after accepted implementation

Constraints:
- Modify only this WP record.
- Do not move scripts.
- Do not create shims.
- Do not update docs, skills, tests, source, graph artifacts, package files, lockfiles, app files, database files, or outputs.

Return:
- Planning summary only.
- Confirmation that no implementation changes were made.

## Audit Prompt

Audit WP-207 as a planning-only package.

Verify:
- Only the WP-207 record changed.
- The plan addresses command compatibility and does not authorize breaking current top-level script paths without shims.
- The target taxonomy is narrow and domain-based.
- The plan identifies docs, skills, tests, command previews, and helper outputs as compatibility surfaces.
- The package does not move scripts, create shims, update production behavior, add dependencies, modify graph artifacts, or touch app/database/package/lockfile/output/runtime AI surfaces.
- The graph freshness limitation is recorded honestly.
- Code Results, Audit Results, and Final Decision remain pending unless a later step explicitly fills them.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented as a planning-only package after explicit implementation request.

No script files were moved, no compatibility shims were created, and no command references outside this WP record were changed.

### Current Top-Level Script Inventory

Work-package lifecycle and execution:
- `scripts/new-lite-work-package.ps1` - canonical new work-package generator.
- `scripts/new-work-package.ps1` - compatibility entry point that warns users to prefer `new-lite-work-package`.
- `scripts/run-work-package.ps1` - implementation/audit runner and prompt preview surface.
- `scripts/audit-work-package.ps1` - human-facing audit-only wrapper.
- `scripts/get-work-package-status.ps1` - read-only lifecycle/status checker.
- `scripts/get-work-package-validation-plan.ps1` - read-only validation/test evidence checker.
- `scripts/check-work-package-closeout.ps1` - read-only closeout preflight.
- `scripts/commit-work-package.ps1` - accepted-WP commit gate.

Agentic workflow and SDK manager tooling:
- `scripts/get-agentic-workflow-status.ps1` - aggregate read-only workflow state.
- `scripts/get-agentic-workflow-decision.ps1` - dry-run next-action decision router.
- `scripts/get-sdk-manager-recommendation.ps1` - manager-facing dry-run recommendation contract.
- `scripts/get-sdk-manager-orchestration-dry-run.ps1` - SDK manager dry-run facade.

Understand graph tooling:
- `scripts/check-understand-refresh-readiness.ps1` - read-only Understand refresh readiness preflight.
- `scripts/refresh-understand-graph.ps1` - deterministic graph refresh wrapper.

Student package and local setup tooling:
- `scripts/build-student-tester-package.ps1` - student tester package build helper.
- `scripts/start-student-package.ps1` - local student package startup helper.
- `scripts/setup-local-sql-accounts.ps1` - local SQL account setup helper.

Miscellaneous command surface:
- `scripts/statusline.js` - Antigravity/statusline support.

Existing organized areas:
- `scripts/lib/WorkPackageResolver.ps1` - shared work-package path resolver.
- `scripts/tests/*.ps1` - PowerShell regression tests for workflow helpers, runner behavior, SDK manager dry-run tooling, Understand wrappers, and package fixtures.

### Proposed Target Taxonomy

Use domain subdirectories for implementation files while preserving top-level public command names as wrappers:

```text
scripts/
  work-packages/
    new-lite-work-package.ps1
    new-work-package.ps1
    run-work-package.ps1
    audit-work-package.ps1
    get-work-package-status.ps1
    get-work-package-validation-plan.ps1
    check-work-package-closeout.ps1
    commit-work-package.ps1
  agentic-workflow/
    get-agentic-workflow-status.ps1
    get-agentic-workflow-decision.ps1
    get-sdk-manager-recommendation.ps1
    get-sdk-manager-orchestration-dry-run.ps1
  understand/
    check-understand-refresh-readiness.ps1
    refresh-understand-graph.ps1
  student-package/
    build-student-tester-package.ps1
    start-student-package.ps1
    setup-local-sql-accounts.ps1
  lib/
    WorkPackageResolver.ps1
  tests/
    ...
```

Keep `scripts/statusline.js` at top level unless a later package proves it belongs under a specific Antigravity/tooling subdirectory and updates all consumers safely.

### Compatibility-Shim Policy

Treat every current top-level `scripts/*.ps1` command as public unless proven otherwise by source and docs search.

For public commands, a later implementation package should:
- move implementation code to the target domain subdirectory;
- leave a top-level shim at the original path;
- forward all parameters using the same PowerShell parameter binding behavior;
- preserve exit codes, stdout/stderr behavior, JSON/text output shapes, and `LASTEXITCODE` expectations;
- preserve command-preview strings unless the implementation package explicitly updates every tested/documented reference;
- keep dry-run/read-only safety guarantees unchanged;
- avoid creating shims that execute command-preview strings or broaden authorization gates.

Recommended top-level shim pattern:

```powershell
param(...)

$target = Join-Path $PSScriptRoot 'work-packages/get-work-package-status.ps1'
& $target @PSBoundParameters
exit $LASTEXITCODE
```

The exact shim pattern must be validated for scripts that use positional arguments, switch parameters, array parameters, common parameters, or direct `$args` handling. Do not assume one wrapper shape fits every script without tests.

### Public Versus Internal Classification

Classify a command as public when any of these are true:
- referenced in `docs/05-development-workflow/**`;
- referenced in `.codex/skills/**`;
- referenced in work-package prompts, Code Results, Audit Results, handoff docs, or resume prompts;
- used as a contributor-facing command in terminal examples;
- emitted in command previews, evidence source fields, recommendations, or next-action text;
- directly invoked by tests as the command under test;
- used by another top-level script or workflow helper.

Classify a command as internal only when all of these are true:
- no docs, skills, WPs, tests, or helper output strings reference the top-level path;
- no external contributor workflow depends on the path;
- the command is not used as an entry point by another tool or script;
- migration risk is limited to source-local imports that can be updated and tested in the same package.

Current assessment: all top-level PowerShell scripts should be treated as public for the first migration package. `statusline.js` needs separate classification because it is not a PowerShell work-package command.

### Reference Update Strategy

Do not mass-update docs and skills during the first move unless the migration intentionally changes the public command path. The safer first implementation package should preserve top-level command paths and keep existing docs valid.

For moved implementation files, update only source-local references needed for internal delegation. Keep these compatibility-sensitive strings stable unless a later docs-migration package is explicitly scoped:
- `scripts/get-agentic-workflow-decision.ps1` command previews for run, audit, and commit helpers;
- SDK manager evidence source values that name top-level scripts;
- tests that assert top-level command preview strings;
- docs and skills that instruct agents to run `scripts/*.ps1`;
- work-package lifecycle examples and OpenAI Agents SDK readiness tool mappings.

After shims are accepted, a separate documentation package may introduce preferred domain paths while continuing to document top-level shims as supported compatibility entry points.

### Future Implementation Sequence

Use small packages rather than one broad migration:

1. Move low-risk student package helpers into `scripts/student-package/` and leave top-level shims.
2. Move Understand wrappers into `scripts/understand/` and leave top-level shims.
3. Move agentic workflow and SDK manager helpers into `scripts/agentic-workflow/` and leave top-level shims.
4. Move work-package lifecycle helpers into `scripts/work-packages/` last, because they are the most referenced and gate audit/finalization.
5. After all moves are accepted and tested, consider a docs/skills package that documents preferred domain paths while preserving top-level shims.
6. Refresh the Understand graph after accepted script moves because workflow-tooling file relationships will materially change.

Rollback expectation:
- because top-level shims remain, rollback should be limited to moving implementation files back or correcting shim delegation;
- do not remove top-level shims in the same package that first moves implementations;
- do not update public docs to domain paths until shim behavior has passed audit.

### Required Future Validation Suite

Each implementation package should run tests for the moved domain plus compatibility smoke checks for every shim touched.

Baseline validation candidates:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`

Additional shim-specific checks:
- run each top-level shim with `-?` or a safe read-only mode where available;
- compare JSON output from top-level shim and domain implementation for representative read-only commands;
- verify strict failure exit codes remain unchanged for invalid WP identifiers;
- verify command previews still display top-level public paths where downstream tests expect them;
- verify no shim executes implementation, audit, finalization, commit, push, graph refresh, external calls, app startup, browser automation, dependency installation, or destructive filesystem actions without existing explicit authorization.

### Graph Refresh Recommendation

No graph refresh is required for WP-207 because this package changes only the planning record.

After any accepted implementation package that moves scripts or adds shims:
- run focused validation first;
- complete AGY audit and human acceptance;
- then create or include a focused Understand graph refresh package before relying on graph relationships for workflow-tooling planning again.

### Validation Performed

- Inspected current top-level `scripts/` files with `Get-ChildItem scripts -File`.
- Searched command-path references across workflow docs, repo-local skills, scripts, and tests with `rg`.
- Confirmed the worktree contains only untracked planning WPs before editing: WP-206 and WP-207.

No executable regression tests were run because WP-207 is planning-only and no script behavior changed.

## Audit Results

### WP-207 Audit Summary

An audit of [WP-207-script-directory-taxonomy-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md) was performed as a planning-only package.

#### Verification Items
1. **Worktree Scope**: Verified via `git status`. Only `docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md` is present in the worktree. No other files were modified or untracked.
2. **Command Compatibility & Shim Policy**: Verified. The plan treats all current top-level `scripts/*.ps1` entry points as public and explicitly requires top-level compatibility shims that forward parameter bindings, preserve exit codes, stdout/stderr formatting, and maintain dry-run safety.
3. **Target Taxonomy**: Verified. The proposed structure is domain-based and narrowly scoped (`scripts/work-packages/`, `scripts/agentic-workflow/`, `scripts/understand/`, `scripts/student-package/`, `scripts/lib/`, `scripts/tests/`).
4. **Compatibility Surfaces Identified**: Verified. The plan explicitly identifies documentation, repo-local skills, tests, command previews (e.g. in `get-agentic-workflow-decision.ps1`), and helper output fields as critical compatibility surfaces.
5. **Planning-Only Boundary Integrity**: Verified. No scripts were moved, no shims created, no production behaviors modified, no dependencies added, no graph artifacts mutated, and no app/database/package/lockfile/output/runtime AI surfaces touched.
6. **Graph Freshness Limitation**: Verified. The `Understand Status` section records the graph baseline (`7186b432ad74156d817cdb552eb01dbe1581def6` vs HEAD `fe314a3`) and explicitly notes that the graph is structurally stale for script path relationship analysis, relying instead on direct file and text searches.
7. **Results & Decision Fields**: Verified. Code Results contains the detailed planning inventory, Audit Results reflects audit state, and Final Decision is correctly set to `Pending human acceptance.`.

---

### Audit Output

- **Verdict**: PASS
- **Violations**: None.
- **Regressions**: None. WP-207 is planning-only and introduces zero code or behavior changes.
- **Drift Risks**: 
  - *Implementation Drift*: Future implementation packages moving scripts without creating top-level shims. (Mitigated by WP-207's explicit shim requirements).
  - *Command Preview & Output Drift*: Helper JSON/text output and tests expecting top-level paths breaking if internal paths are exposed prematurely. (Mitigated by identifying command previews and helper outputs as compatibility surfaces).
  - *Graph Structural Drift*: Moving script files will alter file location relationships in `.understand-anything/`. (Mitigated by recommending a focused graph refresh after accepted script moves).
- **Required Corrections**: None. WP-207 satisfies all requirements for a planning-only package.

## Final Decision

Accepted on 2026-07-26.

Human reviewer accepted WP-207 after planning-only implementation evidence and audit PASS. The package establishes a script-directory taxonomy and compatibility-shim migration plan, preserves current top-level script command paths as the compatibility baseline, and introduces no script moves, shims, production behavior changes, dependencies, graph artifact changes, app/database changes, package/lockfile changes, runtime AI, external data behavior, output artifacts, or Case 004 progression changes.


