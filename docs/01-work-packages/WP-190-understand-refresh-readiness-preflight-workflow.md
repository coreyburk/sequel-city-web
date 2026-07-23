# WP-190 - Understand Refresh Readiness Preflight Workflow

## Objective

Add a read-only preflight workflow for the Understand graph refresh wrapper so future agents can verify refresh readiness and non-mutation guarantees before any package runs a mutating graph refresh.

## Scope

### In Scope

- Add a PowerShell readiness preflight command at `scripts/check-understand-refresh-readiness.ps1`.
- Have the preflight call or validate `scripts/refresh-understand-graph.ps1 -DryRun`.
- Verify tracked Understand baseline artifacts are not modified by dry-run validation.
- Verify no `.understand-anything/tmp/**`, `.understand-anything/.trash-*`, or `.understand-anything/*.log` artifacts appear during readiness checks.
- Support human-readable output and `-Json` output for future agentic workflow/tool use.
- Add focused tests for success, JSON output, missing wrapper/plugin-root behavior, and no-mutation checks.
- Update Understand workflow documentation to distinguish readiness preflight from mutating graph refresh.
- Preserve the existing tracked Understand baseline artifacts.

### Out of Scope

- Regenerating or committing a new Understand graph baseline.
- Changing `scripts/refresh-understand-graph.ps1` mutating refresh semantics beyond what is required to support the read-only preflight, if anything.
- Changing Understand plugin source outside this repository.
- Changing application runtime behavior.
- Changing database schema, seed data, migrations, restricted-table rules, answer-key behavior, or Case 004 progression.
- Changing OpenAI Agents SDK prototype source or tests.
- Adding dependencies, package files, lockfiles, virtual environments, live API calls, runtime AI behavior, or external data sharing.
- Changing audit runner, work-package resolver, closeout, or commit-helper behavior.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/meta.json`, `.understand-anything/fingerprints.json`, `.understand-anything/intermediate/scan-result.json`, and `.understand-anything/config.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Usable with non-structural drift. Current `HEAD` is `4494354`, and accepted commits after the baseline established/updated Understand baseline/cadence and added the wrapper command. Exact baseline-to-HEAD equality is not required when later commits only add or refresh Understand artifacts or narrow wrapper tooling.
- Analysis performed: Read SSOT development workflow, work-package lifecycle guidance, Understand workflow guide, WP planning skill/checklist, current handoff, current graph metadata, current git status, recent commits, WP-189, script inventory, existing PowerShell script-test patterns, and targeted source/graph search results for `refresh-understand-graph`, preflight, validation, and wrapper workflows.

### Affected Architecture

- Layers: Development workflow scripts, script tests, and workflow documentation.
- Primary files/components:
  - `docs/01-work-packages/WP-190-understand-refresh-readiness-preflight-workflow.md`
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- Upstream consumers: Human developer, Codex WP planning, future agentic workflow WPs, future graph-refresh packages, AntiGravity audit.
- Downstream dependencies: Future graph-refresh readiness checks, future work-package impact analysis, agentic workflow tool contracts that need safe read-only preflights before mutating commands.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/check-understand-refresh-readiness.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
  - `git diff --check`
- User workflows:
  - A contributor checks whether the local environment is ready to refresh the Understand graph.
  - A future agent records readiness evidence before a graph-refresh WP performs a mutating refresh.
  - An auditor verifies that readiness checks did not modify graph baseline artifacts.
- Security/data boundaries: No runtime AI, live API calls, database mutations, secret reads, answer-key exposure, trace export, external data sharing, dependency installation, or graph baseline mutation. The preflight must be read-only with respect to tracked repository artifacts.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This WP adds a read-only readiness preflight for the wrapper. It must not regenerate or commit graph artifacts. A future graph-refresh WP can use the preflight before running a mutating refresh when structural drift requires it.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-190-understand-refresh-readiness-preflight-workflow.md`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for the closeout refresh required before accepted-WP commit/push.

Do Not Modify:

- `apps/**`
- `database/**`
- `tools/openai-agents-prototype/**`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `.understand-anything/.trash-*`
- `.understand-anything/tmp/**`
- `.understand-anything/*.log`
- `.understand-anything/config.json`
- `scripts/run-work-package.ps1`
- `scripts/audit-work-package.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/lib/WorkPackageResolver.ps1`
- `package.json`
- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `.env`
- `.env.*`
- `outputs/**`

## Constraints

- Keep the change development-tooling-only.
- Do not add dependencies.
- Do not change app, API, database, runtime, package, lockfile, audit, closeout, commit-helper, resolver, or prototype behavior.
- Do not commit regenerated graph baseline artifacts in this WP.
- Do not write transient Understand temp, trash, log, cache, or dashboard output during readiness validation.
- Keep the preflight read-only with respect to tracked repository files.
- Use the existing `scripts/refresh-understand-graph.ps1 -DryRun` behavior rather than duplicating refresh orchestration logic.
- Treat Understand output as advisory and preserve SSOT/source/test authority.

## Required Behavior

- Add `scripts/check-understand-refresh-readiness.ps1` as the read-only readiness entry point.
- The preflight must:
  - resolve the repository root from its own script location
  - accept `-PluginRoot` and pass it through to `scripts/refresh-understand-graph.ps1 -DryRun`
  - support `-Json` output suitable for future agentic tool wrapping
  - compute tracked Understand artifact hashes before and after dry-run validation
  - report whether the dry-run succeeded
  - report whether tracked graph artifacts changed
  - report whether `.understand-anything/tmp`, `.trash-*`, or `*.log` artifacts are present after the check
  - return non-zero when dry-run prerequisites fail or when any non-mutation check fails
- Add focused tests that do not require a real graph refresh and do not mutate tracked graph artifacts.
- Update `Understand-Codebase-Analysis.md` so future graph-refresh WPs run the readiness preflight before any mutating refresh.
- Keep Code Results, Audit Results, and Final Decision pending after planning.

## Acceptance Criteria

- [x] `scripts/check-understand-refresh-readiness.ps1` exists and parses successfully.
- [x] The preflight runs the wrapper dry-run path without mutating tracked `.understand-anything` baseline artifacts.
- [x] The preflight supports `-Json` output with clear readiness, dry-run, mutation, and artifact hygiene fields.
- [x] The preflight returns non-zero when wrapper prerequisites are missing or when mutation/artifact hygiene checks fail.
- [x] Focused tests cover success output, JSON output, plugin-root pass-through/failure behavior, and no-mutation checks without running a mutating graph refresh.
- [x] `Understand-Codebase-Analysis.md` documents the readiness preflight before mutating graph refreshes.
- [x] No app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or graph baseline artifact files are modified.
- [x] Validation commands are recorded in Code Results.
- [x] No unrelated files changed.

## Code Prompt

Implement WP-190 exactly as scoped.

Scope:

- Add `scripts/check-understand-refresh-readiness.ps1`.
- Add `scripts/tests/test-understand-refresh-readiness-preflight.ps1`.
- Update `docs/05-development-workflow/Understand-Codebase-Analysis.md`.
- Update this WP's Code Results with exact changed files, validation commands, and limitations.

Constraints:

- Do not modify app, API, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or tracked graph baseline artifact files.
- Do not add dependencies.
- Do not run a mutating graph refresh.
- Do not write `.understand-anything/tmp/**`, `.trash-*`, `*.log`, or regenerated graph artifacts during normal test validation.
- Preserve existing behavior outside the new preflight and documentation.

Verification:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
- `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/check-understand-refresh-readiness.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
- `git diff --check`
- `git status --short --untracked-files=all`

Return:

- Changed files.
- Preflight behavior summary.
- Validation commands and results.
- Any blocker or follow-up recommendation.

## Audit Prompt

Audit WP-190 against the work package.

Verify:

- The preflight is a first-class read-only repository command for Understand refresh readiness.
- The preflight uses `scripts/refresh-understand-graph.ps1 -DryRun` rather than duplicating mutating refresh logic.
- JSON output is suitable for future agentic tool wrapping.
- Tests are focused and do not mutate tracked graph artifacts.
- Documentation tells future graph-refresh WPs to run readiness preflight before mutating refreshes.
- Changed files are within the allowed list.
- No app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or graph baseline artifact files changed.
- Validation evidence is present and credible.
- Understand output remains advisory and does not override SSOT/source/test evidence.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections, if any

## Code Results

Implemented.

Changed files:

- `docs/01-work-packages/WP-190-understand-refresh-readiness-preflight-workflow.md`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md` (post-audit closeout refresh)

Preflight behavior:

- Added `scripts/check-understand-refresh-readiness.ps1` as the repository-owned read-only readiness entry point.
- The preflight resolves the repository root from its own script location.
- The preflight accepts `-PluginRoot` and passes it through to `scripts/refresh-understand-graph.ps1 -DryRun`.
- The preflight supports human-readable output and `-Json` output.
- The preflight computes SHA256 hashes for tracked graph artifacts before and after wrapper dry-run execution:
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/meta.json`
  - `.understand-anything/intermediate/scan-result.json`
- The preflight reports dry-run success, changed tracked artifacts, `.understand-anything/tmp` presence, `.trash-*` directories, `*.log` files, and errors.
- The preflight returns non-zero when wrapper dry-run fails, tracked graph artifacts change, or transient Understand artifacts are present.

Documentation update:

- Updated `Understand-Codebase-Analysis.md` so future graph-refresh WPs run `scripts/check-understand-refresh-readiness.ps1` before any mutating refresh.
- Documented `-Json` for future agentic workflow/tool use.

Validation commands and results:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - Reported `Understand refresh readiness: READY`.
  - Reported `Dry run succeeded: True`.
  - Reported `Tracked artifacts changed: 0`.
  - Reported no temp directory, trash directories, or log files.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - Reported `ready: true`.
  - Reported `dryRun.succeeded: true`.
  - Reported `changedArtifacts: []`.
  - Reported `artifactHygiene.tmpExists: false`.
  - Reported empty `trashDirs`, `logFiles`, and `errors`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/check-understand-refresh-readiness.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git diff --name-only -- .understand-anything` returned no output.
- PASS: `Test-Path .understand-anything\tmp` returned `False`.
- PASS: `.understand-anything` directory checks found no `.trash-*` directories and no `*.log` files.
- PASS: `git status --short --untracked-files=all` showed only WP-190 allowed files.

Limitations:

- The preflight uses the wrapper dry-run path only. No mutating graph refresh was executed because this package explicitly excludes regenerating or committing graph baseline artifacts.
- Focused tests use temporary fake plugin roots for success and missing-prerequisite behavior; they do not execute the real Understand plugin mutating path.

Post-audit closeout update:

- Added `docs/00-ssot/END-OF-DAY-HANDOFF.md` to the allowed file list as a closeout-only artifact because the repo lifecycle requires a handoff refresh before every accepted-WP commit and push.
- Refreshed `docs/00-ssot/END-OF-DAY-HANDOFF.md` after the AntiGravity PASS to reflect current WP-190 status, validation evidence, open risks, and the next recommended step.

## Audit Results

### WP-190 Audit Summary

All verification points specified in the work package and audit guidelines were verified against [WP-190-understand-refresh-readiness-preflight-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-190-understand-refresh-readiness-preflight-workflow.md).

---

### Verification Findings

1. **First-Class Read-Only Preflight Command**:
   - `scripts/check-understand-refresh-readiness.ps1` exists as a repository-owned PowerShell script.
   - It hashes tracked Understand baseline artifacts before and after execution, checks dry-run success, and confirms transient file hygiene without mutating repository files.

2. **Delegation to Refresh Wrapper (`-DryRun`)**:
   - `scripts/check-understand-refresh-readiness.ps1` invokes `scripts/refresh-understand-graph.ps1 -DryRun` with `-PluginRoot` parameter pass-through instead of duplicating mutating refresh logic.

3. **JSON Output for Tooling**:
   - `-Json` produces structured JSON containing `ready`, `repositoryRoot`, `wrapperPath`, `pluginRoot`, `dryRun` details, `trackedArtifacts`, `changedArtifacts`, `artifactHygiene`, and `errors`.

4. **Focused Non-Mutating Tests**:
   - `scripts/tests/test-understand-refresh-readiness-preflight.ps1` uses temporary fake plugin roots in a temp directory, validates text & JSON modes, tests blocked prerequisites handling, and verifies that SHA256 hashes of tracked graph artifacts remain identical.
   - Test run completed cleanly with `PASS Understand refresh readiness preflight checks`.

5. **Updated Workflow Documentation**:
   - `docs/05-development-workflow/Understand-Codebase-Analysis.md` documents `scripts/check-understand-refresh-readiness.ps1` and instructs running it before any mutating graph refresh.

6. **Allowed File Boundary Compliance**:
   - `git status --short --untracked-files=all` confirms only allowed files are modified/created:
     - [WP-190-understand-refresh-readiness-preflight-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-190-understand-refresh-readiness-preflight-workflow.md)
     - [check-understand-refresh-readiness.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1)
     - [test-understand-refresh-readiness-preflight.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-understand-refresh-readiness-preflight.ps1)
     - [Understand-Codebase-Analysis.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Understand-Codebase-Analysis.md)

7. **Prohibited File Audit**:
   - Zero changes to app code, database schemas/seed/migrations, Agents SDK prototype source, package files, lockfiles, secrets, outputs, runtime AI, audit runner, closeout helpers, resolvers, or tracked `.understand-anything` baseline files.

8. **Validation Evidence**:
   - Empirical test execution confirmed script parsing, text preflight execution (`READY`), JSON preflight execution (`ready: true`), parser validation, clean git status, and artifact hash invariance.

9. **SSOT Authority**:
   - Preflight tooling and documentation maintain Understand output as strictly advisory.

---

### Output

- **Verdict**: PASS
- **Violations**: None
- **Regressions**: None
- **Drift risks**: None identified. Script resolves `$repoRoot` dynamically from `$PSCommandPath` ensuring path stability across invocation contexts.
- **Required corrections**: None
## Final Decision

Accepted.

Rationale: Independent AntiGravity audit returned PASS with no violations, regressions, drift risks, or required corrections. Scope remained limited to the allowed readiness preflight, focused test, Understand workflow documentation, WP record, and closeout-only handoff refresh. Validation evidence confirms the preflight delegates to wrapper dry-run, JSON output is suitable for future tooling, tracked graph baseline artifacts were not modified, transient Understand artifacts were absent, and no app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, or resolver files changed.

