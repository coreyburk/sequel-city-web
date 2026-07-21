# Unified Work Package Identifier Resolution

## Objective

Make the work-package lifecycle helper scripts resolve `WP-###` shorthand consistently, and update closeout guidance so every accepted-WP commit/push refreshes the live handoff.

## Scope

### In Scope

- Add one shared PowerShell resolver for work-package identifiers.
- Support `WP-###` shorthand in lifecycle helpers when the number uniquely matches a file in `docs/01-work-packages`.
- Preserve existing support for full filenames, repo-relative paths, absolute paths, and unique slugs where the runner already supported them.
- Update focused helper tests to prove number-only resolution works for status, validation-plan, runner, and commit-helper workflows.
- Update closeout skill and workflow documentation so agents can use `WP-###` consistently.
- Update closeout guidance to refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` before every accepted-WP commit/push.
- Refresh the live handoff for this WP closeout.

### Out of Scope

- Application frontend/backend behavior.
- Database schema, seed, migration, bootstrap, or SQL safety behavior.
- Runtime AI, OpenAI Agents SDK, MCP, external APIs, or new package dependencies.
- Repository, directory, product, or package renaming.
- Understand graph regeneration.
- Broad workflow refactors beyond identifier resolution and closeout/handoff wording.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current workflow tooling because WP-170 through WP-178 added and changed repo-local skills and helper scripts after the graph baseline.
- Analysis performed: Read workflow SSOT, work-package lifecycle docs, Understand guidance, planning checklist, closeout/finalization skills, current helper scripts, and existing focused tests. Used direct source/test inspection rather than graph relationships because the affected surfaces are the newer workflow scripts and skills added after the graph baseline.

### Affected Architecture

- Layers:
  - development workflow scripts
  - repo-local Codex skills
  - work-package lifecycle documentation
  - live handoff documentation
- Primary files/components:
  - `scripts/lib/WorkPackageResolver.ps1`
  - `scripts/run-work-package.ps1`
  - `scripts/get-work-package-status.ps1`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/commit-work-package.ps1`
  - `scripts/tests/test-work-package-status.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-run-work-package-isolation.ps1`
  - `scripts/tests/test-wp-closeout-handoff-skill.ps1`
  - `.codex/skills/sequel-city-wp-closeout-handoff/**`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md`
- Upstream consumers:
  - human developer closeout requests
  - Codex work-package planning, implementation, audit, and closeout flows
  - AntiGravity audit handoff workflow
  - future agentic orchestration over work-package lifecycle helpers
- Downstream dependencies:
  - deterministic work-package status checks
  - validation-plan checks
  - accepted-WP commit isolation and staging
  - handoff freshness during machine switches

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-179 -Execute None`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-179`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-179`
  - `git diff --check`
- User workflows:
  - running or previewing a WP by number
  - checking lifecycle status by number
  - checking validation-plan readiness by number
  - finalizing accepted work by number
  - closing out WPs with required handoff refresh
- Security/data boundaries:
  - no runtime application behavior changes
  - no database changes
  - no external audit invocation
  - no dependency changes
  - no runtime AI behavior

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package changes development workflow scripts, repo-local skill documentation, workflow docs, handoff state, and tests. It does not alter application architecture, imports, database structure, Case 004 progression, package dependencies, or runtime behavior.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md
- scripts/lib/**
- scripts/run-work-package.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/commit-work-package.ps1
- scripts/tests/test-work-package-status.ps1
- scripts/tests/test-work-package-validation-plan.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- scripts/tests/test-run-work-package-isolation.ps1
- scripts/tests/test-wp-closeout-handoff-skill.ps1
- .codex/skills/sequel-city-wp-closeout-handoff/**
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- .understand-anything/**
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md

## Constraints

- Preserve existing helper behavior except identifier resolution parity.
- Keep resolver behavior deterministic: number-only input must require exactly one matching file.
- Do not stage, commit, or push unless the WP final decision is accepted.
- Do not add dependencies.
- Do not invoke external audit from Codex.
- Do not update runtime AI, app, database, graph, package, or lockfile files.
- Keep the handoff refresh factual and limited to current project/workflow state.

## Required Behavior

- `scripts/run-work-package.ps1`, `scripts/get-work-package-status.ps1`, `scripts/get-work-package-validation-plan.ps1`, and `scripts/commit-work-package.ps1` must resolve `WP-###` shorthand through the same shared logic.
- The shared resolver must also support full filenames, repo-relative paths, absolute paths, date-style legacy work-package names where already supported, and unique slugs.
- Ambiguous or missing shorthand/slug inputs must fail clearly.
- Status and validation-plan tests must include shorthand coverage.
- Commit-helper isolation tests must prove shorthand can identify the target WP.
- Closeout skill and prompt references must no longer tell agents to manually resolve `WP-###` before running helper scripts.
- Workflow docs must state that lifecycle helpers accept `WP-###` shorthand.
- Closeout docs and skill guidance must require handoff refresh before every accepted-WP commit and push.

## Acceptance Criteria

- [x] A shared resolver exists for work-package identifier resolution.
- [x] Runner, status checker, validation-plan checker, and commit helper all use the shared resolver.
- [x] `scripts/get-work-package-status.ps1 WP-179` resolves this work package.
- [x] `scripts/get-work-package-validation-plan.ps1 WP-179` resolves this work package.
- [x] Focused tests pass for runner, isolation/commit helper, status checker, validation-plan checker, and closeout skill.
- [x] Closeout skill/docs use `WP-###` helper commands directly.
- [x] Closeout skill/docs require handoff refresh before every accepted-WP commit/push.
- [x] Live handoff is refreshed as part of this commit.
- [x] No app, database, package, lockfile, graph, runtime AI, or unrelated files changed.

## Code Prompt

Implement WP-179 exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Keep all app, database, dependency, package, lockfile, graph, and runtime AI files unchanged.

Implementation:

1. Add a shared PowerShell resolver for work-package identifier inputs.
2. Wire the runner, status checker, validation-plan checker, and commit helper to the shared resolver.
3. Add focused number-only test coverage for status and validation-plan helpers.
4. Update commit-helper/isolation tests so shorthand finalization paths are covered.
5. Update closeout skill, prompt references, and workflow docs to remove the resolved-path workaround.
6. Update closeout skill/docs so handoff refresh is required before every accepted-WP commit/push.
7. Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` from current repo state before final commit.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-179 -Execute None`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-179`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-179`
- `git diff --check`

Return:

- Exact code changes
- Validation results
- Any limitations

## Audit Prompt

Audit WP-179 against this work package and the development workflow docs.

Verify:

- All acceptance criteria are satisfied
- No files outside allowed list were modified
- Runner, status checker, validation-plan checker, and commit helper share identifier resolution behavior
- `WP-###` shorthand works for the relevant helper scripts
- Existing filename/path/slug behavior is preserved where applicable
- Missing or ambiguous inputs fail clearly
- Closeout skill/docs no longer require manual resolved-path workaround
- Closeout skill/docs require handoff refresh before every accepted-WP commit/push
- Live handoff was refreshed for the current repo state
- Impact analysis matches the actual changed files
- Dependencies and related tests were not omitted
- Graph regeneration decision was followed
- Understand output did not override SSOT or source evidence
- No app, database, package, lockfile, graph, runtime AI, or unrelated files changed

Output:

- Verdict: PASS or FAIL
- Scope violations
- Identifier-resolution gaps
- Closeout/handoff rule gaps
- Missing tests
- Boundary risks

## Code Results

Implemented.

Files changed:

- `scripts/lib/WorkPackageResolver.ps1`
- `scripts/run-work-package.ps1`
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `scripts/tests/test-run-work-package-isolation.ps1`
- `scripts/tests/test-work-package-status.ps1`
- `scripts/tests/test-work-package-validation-plan.ps1`
- `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md`

Implementation summary:

- Added a shared PowerShell resolver for work-package identifiers.
- Routed runner, lifecycle status, validation-plan, and accepted-WP commit helper scripts through the shared resolver.
- Preserved support for full filenames, repo-relative paths, absolute paths, legacy date-style names, and unique slugs.
- Added shorthand coverage for status and validation-plan tests.
- Updated isolation/commit-helper tests so `WP-###` shorthand is exercised by finalization paths.
- Updated closeout skill and prompt text to use `WP-###` helper commands directly.
- Updated workflow docs so lifecycle helpers document `WP-###` shorthand support.
- Updated closeout guidance so `END-OF-DAY-HANDOFF.md` refresh is required before every accepted-WP commit/push.
- Refreshed the live handoff for the current WP-179 state.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-179 -Execute None`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-179`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-179`
- PASS: `git diff --check` with CRLF warnings only.

Limitations:

- Independent AGY audit was run outside Codex by the human because Codex cannot directly invoke AGY under the current external-audit policy boundary.

## Audit Results

The task `task-45` is running in the background to execute `test-run-work-package-isolation.ps1`. I will wait for it to complete.
The task `task-49` is running in the background to execute `test-work-package-status.ps1`. I will wait for it to complete.
- **Verdict**: PASS

- **Scope violations**:
  - None. All modified and untracked files strictly match the allowed file list specified in `WP-179`:
    - `docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md`
    - `scripts/lib/WorkPackageResolver.ps1`
    - `scripts/run-work-package.ps1`
    - `scripts/get-work-package-status.ps1`
    - `scripts/get-work-package-validation-plan.ps1`
    - `scripts/commit-work-package.ps1`
    - `scripts/tests/test-work-package-status.ps1`
    - `scripts/tests/test-work-package-validation-plan.ps1`
    - `scripts/tests/test-run-work-package-audit-runner.ps1`
    - `scripts/tests/test-run-work-package-isolation.ps1`
    - `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
    - `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
    - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
    - `docs/05-development-workflow/Work-Package-Lifecycle.md`
    - `docs/00-ssot/END-OF-DAY-HANDOFF.md`

- **Identifier-resolution gaps**:
  - None. All 4 helper scripts (`scripts/run-work-package.ps1`, `scripts/get-work-package-status.ps1`, `scripts/get-work-package-validation-plan.ps1`, and `scripts/commit-work-package.ps1`) dot-source `scripts/lib/WorkPackageResolver.ps1` and use `Resolve-WorkPackageInputPath`.
  - Supports `WP-###` shorthand, full `.md` filenames, repo-relative paths, absolute paths, legacy date-based filenames (`WP-YYYY-MM-DD-*`), and unique slugs.
  - Throws explicit, actionable errors for missing files, empty inputs, or ambiguous matches (>1 match).

- **Closeout/handoff rule gaps**:
  - None. The closeout skill (`.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md` and reference prompts) as well as workflow docs (`Contributor-Workflow-Guide.md` and `Work-Package-Lifecycle.md`) have been updated to remove the manual resolved-path workaround and now mandate refreshing `docs/00-ssot/END-OF-DAY-HANDOFF.md` before every accepted-WP commit and push.
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md` was refreshed to accurately reflect the current repository state and WP-179 status.

- **Missing tests**:
  - None. All 5 test suites were updated and executed successfully:
    - `scripts/tests/test-run-work-package-audit-runner.ps1` (PASS)
    - `scripts/tests/test-run-work-package-isolation.ps1` (PASS)
    - `scripts/tests/test-work-package-status.ps1` (PASS)
    - `scripts/tests/test-work-package-validation-plan.ps1` (PASS)
    - `scripts/tests/test-wp-closeout-handoff-skill.ps1` (PASS)

- **Boundary risks**:
  - None. Changes are strictly limited to PowerShell helper scripts, repo skills, test files, and workflow documentation. No app files (`apps/**`), database files (`database/**`), packages (`package.json`, `package-lock.json`), or Understand graph files (`.understand-anything/**`) were altered.

## Final Decision

Accepted.

Reason: Human instruction was given to finalize WP-179 after completed audit. AntiGravity audit returned PASS with no scope violations, identifier-resolution gaps, closeout/handoff rule gaps, missing tests, or boundary risks. WP-179 satisfies its acceptance criteria by adding shared `WP-###` work-package identifier resolution across the lifecycle helpers, updating focused tests, refreshing closeout/handoff guidance, and preserving app, database, dependency, package, lockfile, graph, runtime AI, and unrelated-file boundaries.

