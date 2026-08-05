# WP-224 - Work Package Creation Script Directory Compatibility Shims

## Objective

Move the canonical work-package creation helper implementation behind `scripts/work-package/` while preserving the public top-level package creation commands and their current behavior.

## Scope

### In Scope

- Create `scripts/work-package/new-lite-work-package.ps1` containing the current canonical lite work-package generator implementation.
- Replace `scripts/new-lite-work-package.ps1` with a public top-level compatibility shim that preserves the current parameter contract and delegates to the moved implementation.
- Preserve `scripts/new-work-package.ps1` as the legacy compatibility command.
- Adjust `scripts/new-work-package.ps1` only as needed so it continues to route through the supported lite generator after relocation.
- Add focused tests for package-creation shim parsing, delegation, parameter parity, destination-directory generation, explicit-number generation, suffix collision behavior, and legacy wrapper warning behavior.
- Record implementation and validation evidence in this work package.

### Out of Scope

- Changing generated work-package template content, section order, default destination, numbering rules, slug normalization, collision suffix behavior, console output wording except path-equivalent relocation effects, or legacy warning intent.
- Updating docs, repo-local skills, agentic workflow previews, SDK manager previews, command examples, or guidance to prefer moved implementation paths.
- Moving or modifying runner, audit wrapper, commit helper, lifecycle helpers, resolver, agentic workflow, SDK manager, student-package, Understand, database, app, package, lockfile, output, or runtime AI files.
- Regenerating `.understand-anything/**`.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `c010e9d47f6e1990abb03da66b25b7f255a5a929`.
- Freshness assessment: Usable with non-structural drift for package-creation planning. Current `HEAD` is `00a156b00cfea5963912b8bdbf40a9fe9fba2289`; the only commit after the graph baseline is accepted WP-223, a focused Understand refresh closeout that updated graph artifacts, added the WP-223 record, and refreshed the live handoff. No package-creation helper source or tests changed after the baseline.
- Analysis performed: Required-tier Understand-assisted planning. Searched refreshed graph and scan inventory for `scripts/new-lite-work-package.ps1`, `scripts/new-work-package.ps1`, `scripts/work-package/**`, runner/audit/commit helper relocation patterns, and related docs/skills. Verified graph findings against current source by directly reading `scripts/new-lite-work-package.ps1`, `scripts/new-work-package.ps1`, `scripts/tests/test-run-work-package-isolation.ps1`, workflow docs, and repo-local planning/corrective skills.

### Affected Architecture

- Layers:
  - Development workflow tooling
  - Work-package creation
  - Script-directory taxonomy compatibility shims
- Primary files/components:
  - `scripts/new-lite-work-package.ps1`
  - `scripts/work-package/new-lite-work-package.ps1`
  - `scripts/new-work-package.ps1`
  - `scripts/tests/test-work-package-creation-shims.ps1`
  - `docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`
- Upstream consumers:
  - contributors invoking `scripts/new-lite-work-package.ps1`
  - legacy callers invoking `scripts/new-work-package.ps1`
  - repo-local planning and corrective skills that instruct agents to use the top-level lite generator
  - workflow docs and OpenAI SDK readiness docs that describe top-level package creation commands
- Downstream dependencies:
  - filesystem destination-directory creation
  - existing `docs/01-work-packages` numbering conventions
  - PowerShell parser and bound-parameter forwarding behavior
  - generated WP section template

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-creation-shims.ps1`
  - PowerShell parser checks for `scripts/new-lite-work-package.ps1`, `scripts/work-package/new-lite-work-package.ps1`, and `scripts/new-work-package.ps1`
  - temporary destination-directory generation checks for top-level and direct moved lite generator paths
  - temporary destination-directory checks for legacy `scripts/new-work-package.ps1`
  - `git diff --name-only .understand-anything`
  - transient temp fixture hygiene check for owned `WP-9###-*temp.md` files in `docs/01-work-packages`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - creating the next work package from the public top-level lite generator
  - using the legacy top-level generator wrapper
  - repo-local planning/corrective skills creating scoped packages
  - future SDK manager or agentic workflow tooling treating package creation as a deterministic public command
- Security/data boundaries:
  - No runtime AI behavior, app behavior, database mutation, restricted data, answer-key, spoiler boundary, Case 004 progression, dependency, package/lockfile, live SDK/model call, external audit dispatch, commit, push, graph refresh, or output artifact changes are authorized.

### Graph Update Decision

- Regeneration required: Yes, after implementation and acceptance in a follow-up focused graph-refresh package.
- Rationale: Moving the package-creation helper implementation changes structural workflow-tooling relationships under `scripts/**`. Do not regenerate the graph in WP-224; create the focused graph refresh after this package is audited, accepted, committed, and pushed.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md
- scripts/new-lite-work-package.ps1
- scripts/work-package/new-lite-work-package.ps1
- scripts/new-work-package.ps1
- scripts/tests/test-work-package-creation-shims.ps1

Do Not Modify:

- .understand-anything/**
- scripts/run-work-package.ps1
- scripts/work-package/run-work-package.ps1
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
- scripts/lib/**
- scripts/agentic-workflow/**
- scripts/sdk-manager/**
- scripts/understand/**
- scripts/student-package/**
- scripts/tests/** except `scripts/tests/test-work-package-creation-shims.ps1`
- .codex/skills/**
- tools/**
- apps/**
- database/**
- docs/00-ssot/**
- docs/05-development-workflow/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Preserve `scripts/new-lite-work-package.ps1` as the documented public canonical work-package creation command.
- Preserve every current public parameter name, alias, validation attribute, default, and positional behavior for `scripts/new-lite-work-package.ps1`.
- Delegate from the top-level lite generator shim to `scripts/work-package/new-lite-work-package.ps1` with `@PSBoundParameters`.
- Preserve `scripts/new-work-package.ps1` as a legacy public command that warns and routes to the supported lite generator.
- Do not change generated WP template content or lifecycle section shape.
- Do not update docs or skills to prefer moved implementation paths.
- Do not modify graph artifacts in this package.
- Do not create package files in `docs/01-work-packages` during tests except transient owned fixtures that are removed before completion.
- Do not introduce dependencies, runtime AI behavior, network calls, app startup, browser automation, external audit dispatch, commit, push, or handoff refresh.

## Required Behavior

- `scripts/work-package/new-lite-work-package.ps1` exists and parses.
- `scripts/new-lite-work-package.ps1` remains present as the public top-level compatibility shim.
- The top-level lite generator shim preserves the current parameter contract.
- The top-level lite generator shim delegates to `scripts/work-package/new-lite-work-package.ps1` using `@PSBoundParameters`.
- The moved lite generator resolves the project root and default `docs/01-work-packages` destination correctly from its new directory.
- Top-level lite generator calls with a temporary `-DestinationDirectory` create the same WP template shape as before.
- Direct moved lite generator calls with a temporary `-DestinationDirectory` work for validation but are not documented as the preferred public command.
- Explicit `-Number`, slug normalization, and collision suffix behavior remain unchanged.
- `scripts/new-work-package.ps1` still warns that it is retained for compatibility and routes through the supported lite generator.
- No `.understand-anything/**` graph artifacts are modified.

## Acceptance Criteria

- [x] `scripts/work-package/new-lite-work-package.ps1` exists and parses.
- [x] `scripts/new-lite-work-package.ps1` remains present as the public top-level compatibility shim.
- [x] The top-level lite generator shim preserves the public parameter contract and delegates with `@PSBoundParameters`.
- [x] The moved lite generator resolves the repository root and default work-package destination correctly from `scripts/work-package/`.
- [x] `scripts/new-work-package.ps1` remains present, parses, preserves its public parameter contract, warns for compatibility, and routes through the supported lite generator.
- [x] Top-level lite generator creates a valid WP file in a temporary destination directory without touching `docs/01-work-packages`.
- [x] Direct moved lite generator creates a valid WP file in a temporary destination directory without touching `docs/01-work-packages`.
- [x] Legacy `scripts/new-work-package.ps1` creates a valid WP file in a temporary destination directory and emits the compatibility warning.
- [x] Explicit `-Number`, slug normalization, and collision suffix behavior are covered by focused tests.
- [x] Generated WP template sections remain unchanged.
- [x] No `.understand-anything/**` graph artifacts are modified.
- [x] No docs, skills, app, database, dependency, package, lockfile, output, runtime AI, runner, audit wrapper, commit helper, lifecycle helper, resolver, SDK manager, agentic workflow, Understand, or student-package files are modified beyond the allowed set.

## Code Prompt

Implement WP-224 exactly as specified.

Scope:
- Only modify files listed under `Allowed`.

Required steps:
1. Create `scripts/work-package/new-lite-work-package.ps1` by moving the current implementation body of `scripts/new-lite-work-package.ps1`.
2. Replace `scripts/new-lite-work-package.ps1` with a compatibility shim that preserves the current parameter block and delegates to `scripts/work-package/new-lite-work-package.ps1` with `@PSBoundParameters`.
3. Update the moved implementation's path resolution so `$scriptRoot` resolves to `scripts/`, `$projectRoot` resolves to the repository root, and the default destination remains `docs/01-work-packages`.
4. Preserve `scripts/new-work-package.ps1` as a public legacy wrapper. Adjust its routing only as needed so it continues to call the supported top-level lite generator or moved implementation safely after relocation.
5. Add `scripts/tests/test-work-package-creation-shims.ps1` to verify:
   - top-level lite generator shim parsing
   - moved lite generator implementation parsing
   - legacy generator wrapper parsing
   - top-level shim delegation path
   - `@PSBoundParameters` forwarding
   - parameter parity between top-level shim and moved lite implementation
   - temporary destination generation through the top-level lite generator
   - temporary destination generation through the moved lite implementation
   - temporary destination generation through legacy `new-work-package.ps1`
   - explicit number handling
   - slug normalization
   - collision suffix behavior
   - unchanged generated WP template section headings
   - no accidental files created in `docs/01-work-packages`
6. Record implementation results, validation evidence, scope check, and limitations in `Code Results`.

Required validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-creation-shims.ps1`
- PowerShell parser checks for `scripts/new-lite-work-package.ps1`, `scripts/work-package/new-lite-work-package.ps1`, and `scripts/new-work-package.ps1`
- Top-level, direct moved, and legacy generator temporary destination checks
- `git diff --name-only .understand-anything`
- transient temp fixture hygiene check for owned `WP-9###-*temp.md` files in `docs/01-work-packages`
- `git diff --check`
- `git status --short --untracked-files=all`

Do not:
- Modify docs, repo-local skills, graph artifacts, app code, database files, package manifests, lockfiles, runtime AI files, SDK prototype files, outputs, handoff files, runner files, audit wrapper files, commit helper files, lifecycle helper files, resolver files, SDK manager files, agentic workflow files, Understand files, or student-package files.
- Run app startup, browser automation, external audit dispatch, live SDK/model calls, dependency installation, graph refresh, commit, push, or handoff refresh.

Return:
- Exact files changed.
- Validation commands and results.
- Confirmation that public top-level package creation compatibility is preserved.
- Follow-up graph refresh recommendation after acceptance.

## Audit Prompt

Audit WP-224 against the work package, SSOT workflow rules, and current source.

Verify:
- The implementation changed only the allowed files.
- `scripts/new-lite-work-package.ps1` remains the public top-level canonical package-creation command and preserves the original public parameter contract.
- The top-level lite generator shim delegates to `scripts/work-package/new-lite-work-package.ps1` using `@PSBoundParameters`.
- The moved lite generator correctly resolves the repository root and default `docs/01-work-packages` destination.
- `scripts/new-work-package.ps1` remains a legacy public compatibility command and still warns before routing to the supported lite generator.
- Temporary destination validation proves the top-level, direct moved, and legacy generator paths create valid WP templates without touching `docs/01-work-packages`.
- Explicit number, slug normalization, and suffix collision behavior remain intact.
- Generated WP template headings are unchanged.
- Validation evidence covers parser checks, shim delegation, parameter parity, generation behavior, legacy warning behavior, graph non-modification, temp fixture hygiene, whitespace checks, and scope isolation.
- No `.understand-anything/**`, docs/skills, app, database, dependency, package, lockfile, output, runtime AI, runner, audit wrapper, commit helper, lifecycle helper, resolver, SDK manager, agentic workflow, Understand, or student-package files changed outside the allowed set.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Scope violations
- Public command compatibility findings
- Package generation behavior findings
- Missing validation evidence
- Regressions
- Required corrections

## Code Results

Implemented WP-224 after the initial audit correctly failed the unimplemented planning-only state.

### Files Changed

- `scripts/new-lite-work-package.ps1`
- `scripts/work-package/new-lite-work-package.ps1`
- `scripts/tests/test-work-package-creation-shims.ps1`
- `docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`

### Implementation Summary

- Created `scripts/work-package/new-lite-work-package.ps1` with the canonical lite work-package generator implementation.
- Replaced `scripts/new-lite-work-package.ps1` with a public top-level compatibility shim that preserves the parameter block and delegates to the moved implementation with `@PSBoundParameters`.
- Updated moved generator path resolution so:
  - `$scriptRoot` resolves to `scripts/`
  - `$projectRoot` resolves to the repository root
  - the default destination remains `docs/01-work-packages`
- Preserved `scripts/new-work-package.ps1` as the legacy public wrapper that warns and routes through the supported lite generator.
- Added `scripts/tests/test-work-package-creation-shims.ps1` to validate parsing, shim delegation, parameter parity, generation through all public/direct paths, explicit numbering, slug normalization, suffix collision behavior, template headings, legacy warning behavior, and fixture hygiene.

### Validation Evidence

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-creation-shims.ps1`
  - Reported `PASS work-package creation shim checks`.
- PASS: PowerShell parser checks for:
  - `scripts/new-lite-work-package.ps1`
  - `scripts/work-package/new-lite-work-package.ps1`
  - `scripts/new-work-package.ps1`
- PASS: Temporary destination generation through top-level `scripts/new-lite-work-package.ps1`.
- PASS: Temporary destination generation through direct moved `scripts/work-package/new-lite-work-package.ps1`.
- PASS: Temporary destination generation through legacy `scripts/new-work-package.ps1`, including the compatibility warning.
- PASS: Explicit number handling, slug normalization, and collision suffix behavior were covered by `scripts/tests/test-work-package-creation-shims.ps1`.
- PASS: Generated WP template section headings remain unchanged.
- PASS: `git diff --name-only .understand-anything`
  - Returned no graph artifact changes.
- PASS: `Get-ChildItem docs/01-work-packages -Force -File | Where-Object { $_.Name -match '^WP-9\d{3}-.+temp\.md$' } | Select-Object -ExpandProperty Name`
  - Returned no owned temporary WP fixture files.
- PASS: `git diff --check`
  - Reported known line-ending normalization warnings only for allowed `scripts/new-lite-work-package.ps1`.
- PASS: `git status --short --untracked-files=all`
  - Dirty files are limited to WP-224 allowed files.

### Scope Check

- Allowed patterns:
  - `docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`
  - `scripts/new-lite-work-package.ps1`
  - `scripts/work-package/new-lite-work-package.ps1`
  - `scripts/new-work-package.ps1`
  - `scripts/tests/test-work-package-creation-shims.ps1`
- Modified files:
  - `scripts/new-lite-work-package.ps1`
  - `scripts/work-package/new-lite-work-package.ps1`
  - `scripts/tests/test-work-package-creation-shims.ps1`
  - `docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`
- Out-of-scope files:
  - None.

### Follow-Up

- After WP-224 is re-audited, accepted, committed, and pushed, create a focused Understand graph refresh package for the package-creation helper relocation before relying on graph relationships for more script-directory cleanup.

## Audit Results

- **Verdict**: **PASS**
- **Auditor**: Antigravity
- **Target Work Package**: [WP-224-work-package-creation-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md)

---

### Scope Violations
- **None**: All changes are strictly confined to allowed files:
  - [`scripts/new-lite-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/new-lite-work-package.ps1)
  - [`scripts/work-package/new-lite-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/work-package/new-lite-work-package.ps1)
  - [`scripts/tests/test-work-package-creation-shims.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-creation-shims.ps1)
  - [`docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-224-work-package-creation-script-directory-compatibility-shims.md)
- No `.understand-anything/**`, docs, skills, app, database, dependency, lockfile, output, runner, audit wrapper, commit helper, lifecycle helper, or student-package files were modified.

---

### Public Command Compatibility Findings
1. [`scripts/new-lite-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/new-lite-work-package.ps1) remains present as the public canonical work package creation command and preserves exact parameter contract parity with the moved generator (Position 0 `$Slug` with aliases `Name`, `Task`, `Id`, `Title`, `[ValidateRange(1, [int]::MaxValue)] [int]$Number`, `[string]$DestinationDirectory`).
2. Delegation from top-level shim to [`scripts/work-package/new-lite-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/work-package/new-lite-work-package.ps1) forwards parameters accurately using `@PSBoundParameters`.
3. [`scripts/new-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/new-work-package.ps1) remains present as a legacy compatibility command, emits a compatibility warning, and routes safely through the supported lite generator.

---

### Package Generation Behavior Findings
1. Moved implementation [`scripts/work-package/new-lite-work-package.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/work-package/new-lite-work-package.ps1) correctly resolves project root as `$projectRoot = Split-Path -Path $scriptRoot -Parent` and defaults destination to `docs/01-work-packages`.
2. Temporary destination testing confirms top-level shim, direct moved generator, and legacy wrapper paths create valid WP template files matching all 12 section headings without altering `docs/01-work-packages`.
3. Explicit `-Number` assignment, slug normalization (`  Mixed___Slug!!! Temp  ` -> `mixed-slug-temp`), and collision suffix incrementing (`WP-9004-...-2.md`) operate as expected.

---

### Validation Evidence
1. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-creation-shims.ps1`: Executed clean with output `PASS work-package creation shim checks`.
2. AST Parser Checks: Verified AST parsing for all 3 script files (`scripts/new-lite-work-package.ps1`, `scripts/work-package/new-lite-work-package.ps1`, `scripts/new-work-package.ps1`).
3. Graph non-modification: `git diff --name-only .understand-anything` produced no changes.
4. Fixture hygiene: No transient `WP-9###-*temp.md` files were left in `docs/01-work-packages`.
5. Whitespace / line-endings: `git diff --check` reported 0 errors.

---

### Regressions
- None detected.

---

### Required Corrections
- None.

## Final Decision

ACCEPTED on 2026-08-05 after AntiGravity independent audit PASS and human closeout request. WP-224 is approved for commit and push. Follow-up: create a focused Understand graph refresh package for the accepted package-creation helper relocation before relying on graph relationships for more script-directory cleanup.



