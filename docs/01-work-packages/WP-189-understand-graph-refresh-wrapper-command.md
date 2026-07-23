# WP-189 - Understand Graph Refresh Wrapper Command

## Objective

Add a first-class repository command for refreshing the Understand graph baseline so future agents and contributors do not have to manually orchestrate local Understand plugin internals.

## Scope

### In Scope

- Add a PowerShell wrapper command at `scripts/refresh-understand-graph.ps1`.
- Make the wrapper discover or accept the local Understand plugin root and fail clearly when required plugin scripts are unavailable.
- Support a non-mutating validation/dry-run path so agents can verify environment readiness without regenerating the graph.
- Document the wrapper in the Understand workflow guide.
- Add focused script tests for command parsing, plugin-root override behavior, dry-run behavior, and failure messaging.
- Preserve the existing tracked Understand baseline artifacts unless the wrapper is explicitly run in a mutating refresh mode during implementation validation.

### Out of Scope

- Regenerating or committing a new Understand graph baseline as part of this WP.
- Changing `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, or `.understand-anything/intermediate/scan-result.json`.
- Changing Understand plugin source outside this repository.
- Changing application runtime behavior.
- Changing database schema, seed data, migrations, restricted-table rules, answer-key behavior, or Case 004 progression.
- Changing OpenAI Agents SDK prototype source or tests.
- Adding dependencies, package files, lockfiles, virtual environments, live API calls, or runtime AI behavior.
- Changing audit runner, work-package resolver, closeout, or commit-helper behavior.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/meta.json`, `.understand-anything/fingerprints.json`, `.understand-anything/intermediate/scan-result.json`, and `.understand-anything/config.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Usable with non-structural drift. Current `HEAD` is `3cabdb9`, and the only later accepted commit refreshed the Understand baseline/cadence and accepted WP-188. Exact baseline-to-HEAD equality is not required when later commits only add or refresh Understand artifacts.
- Analysis performed: Read SSOT development workflow, work-package lifecycle guidance, Understand workflow guidance, WP planning skill/checklist, current graph metadata, current git status, recent commits, script inventory, existing PowerShell script-test patterns, and targeted graph/source search results for Understand graph, work-package helper, and script-test surfaces.

### Affected Architecture

- Layers: Development workflow scripts, script tests, and workflow documentation.
- Primary files/components:
  - `docs/01-work-packages/WP-189-understand-graph-refresh-wrapper-command.md`
  - `scripts/refresh-understand-graph.ps1`
  - `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- Upstream consumers: Human developer, Codex WP planning, future agentic workflow WPs, future graph-refresh packages, AntiGravity audit.
- Downstream dependencies: Future Understand baseline refreshes, future work-package impact analysis, handoff recommendations that rely on the graph, agentic workflow readiness around repeatable tooling.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
  - `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/refresh-understand-graph.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
  - `git diff --check`
- User workflows:
  - A contributor checks whether local Understand refresh prerequisites are available.
  - A future agent refreshes the graph through one repo command instead of manually running plugin internals.
  - An auditor verifies whether a graph-refresh package used the documented wrapper.
- Security/data boundaries: No runtime AI, live API calls, database mutations, secret reads, answer-key exposure, trace export, external data sharing, or dependency installation. The wrapper must operate only on local repository files and local plugin scripts.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This WP adds a wrapper command and tests for the refresh workflow; it should not change the graph baseline itself. A future package may use the wrapper to refresh graph artifacts when structural drift requires it.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-189-understand-graph-refresh-wrapper-command.md`
- `scripts/refresh-understand-graph.ps1`
- `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
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
- Do not write transient Understand temp, trash, log, cache, or dashboard output during normal dry-run validation.
- Do not depend on a hard-coded user profile path as the only supported path; allow an explicit plugin-root override for tests and machine differences.
- Keep failure messages actionable enough to tell the user what local path or script is missing.
- Treat Understand output as advisory and preserve SSOT/source/test authority.

## Required Behavior

- Add `scripts/refresh-understand-graph.ps1` as the repository-owned entry point for graph refreshes.
- The wrapper must:
  - resolve the repository root from its own script location
  - accept a `-PluginRoot` override
  - search reasonable local default plugin locations when `-PluginRoot` is omitted
  - verify required Understand plugin scripts exist before invoking a refresh
  - support `-DryRun` or equivalent non-mutating mode that prints the planned refresh steps and exits without modifying graph artifacts
  - support a normal mutating mode that is intended to orchestrate the same deterministic refresh stages used in WP-188
  - clean up or avoid transient Understand inputs that should not be committed
  - return non-zero on missing prerequisites or failed stages
- Add focused tests that do not require the real external Understand plugin and do not mutate tracked graph artifacts.
- Update `Understand-Codebase-Analysis.md` to document the wrapper as the preferred repository command before falling back to direct `$understand` skill/plugin internals.
- Keep Code Results, Audit Results, and Final Decision pending after planning.

## Acceptance Criteria

- [x] `scripts/refresh-understand-graph.ps1` exists and parses successfully.
- [x] The wrapper provides a dry-run or validation mode that does not modify tracked `.understand-anything` baseline artifacts.
- [x] The wrapper supports an explicit plugin-root override suitable for tests and machine-specific installs.
- [x] The wrapper reports clear failures when required Understand plugin scripts are missing.
- [x] Focused tests cover dry-run behavior, plugin-root override behavior, and missing-prerequisite failure behavior without requiring the real Understand plugin.
- [x] `Understand-Codebase-Analysis.md` documents the wrapper as the preferred repository refresh command.
- [x] No app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or graph baseline artifact files are modified.
- [x] Validation commands are recorded in Code Results.
- [x] No unrelated files changed.

## Code Prompt

Implement WP-189 exactly as scoped.

Scope:

- Add `scripts/refresh-understand-graph.ps1`.
- Add `scripts/tests/test-understand-graph-refresh-wrapper.ps1`.
- Update `docs/05-development-workflow/Understand-Codebase-Analysis.md`.
- Update this WP's Code Results with exact changed files, validation commands, and limitations.

Constraints:

- Do not modify app, API, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or tracked graph baseline artifact files.
- Do not add dependencies.
- Do not require the real Understand plugin for the focused tests; use temporary test fixtures or dry-run behavior.
- Do not write `.understand-anything/tmp/**`, `.trash-*`, `*.log`, or regenerated graph artifacts during normal test validation.
- Preserve existing behavior outside the new wrapper and documentation.

Verification:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
- `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/refresh-understand-graph.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
- `git diff --check`
- `git status --short --untracked-files=all`

Return:

- Changed files.
- Wrapper behavior summary.
- Validation commands and results.
- Any blocker or follow-up recommendation.

## Audit Prompt

Audit WP-189 against the work package.

Verify:

- The wrapper is a first-class repository command and does not require manual plugin-internal orchestration for normal use.
- Dry-run or validation mode is non-mutating.
- Plugin-root override and missing-prerequisite paths are testable without the real plugin.
- Documentation points future agents to the wrapper before plugin internals.
- Tests are focused and do not mutate tracked graph artifacts.
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

- `docs/01-work-packages/WP-189-understand-graph-refresh-wrapper-command.md`
- `scripts/refresh-understand-graph.ps1`
- `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md` (post-audit closeout refresh)

Wrapper behavior:

- Added `scripts/refresh-understand-graph.ps1` as the repository-owned Understand graph refresh entry point.
- The wrapper resolves the repository root from its own script location.
- The wrapper accepts `-PluginRoot` and also searches `UNDERSTAND_PLUGIN_ROOT`, `UA_PLUGIN_ROOT`, and reasonable user-profile default plugin locations.
- The wrapper verifies required local Understand plugin files before refresh:
  - `skills/understand/scan-project.mjs`
  - `skills/understand/extract-import-map.mjs`
  - `skills/understand/extract-structure.mjs`
  - `skills/understand/build-fingerprints.mjs`
  - `packages/core/dist/index.js`
- The wrapper supports `-DryRun`, which prints the resolved repository root, plugin root, required scripts, tracked outputs, and planned stages without modifying graph artifacts.
- The normal mutating path is implemented to run scan, import-map extraction, structure extraction, graph assembly, fingerprint generation, metadata write, and cleanup of `.understand-anything/tmp/refresh-understand-graph`.
- The wrapper includes path-containment checks before writing or deleting under `.understand-anything`.

Documentation update:

- Updated `Understand-Codebase-Analysis.md` so future graph refreshes use `scripts/refresh-understand-graph.ps1 -DryRun` and then `scripts/refresh-understand-graph.ps1` as the preferred repository path before falling back to prompt-driven `$understand` skill usage.

Validation commands and results:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
  - Resolved plugin root: `C:\Users\cburk\.understand-anything-plugin`
  - Listed all required plugin scripts and tracked refresh outputs.
  - Reported `Dry run: no files modified.`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -Command "& { `$errors=`$null; [System.Management.Automation.Language.Parser]::ParseFile('scripts/refresh-understand-graph.ps1', [ref]`$null, [ref]`$errors) | Out-Null; if (`$errors) { throw (`$errors | Out-String) } }"`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git diff --name-only -- .understand-anything` returned no output.
- PASS: `Test-Path .understand-anything\tmp` returned `False`.
- PASS: `.understand-anything` directory checks found no `.trash-*` directories and no `*.log` files.
- PASS: `git status --short --untracked-files=all` showed only WP-189 allowed files.

Limitations:

- The mutating refresh path was implemented but not executed during WP-189 validation because this package explicitly excludes regenerating or committing graph baseline artifacts.
- Focused tests use temporary fake plugin roots for dry-run and missing-prerequisite behavior; they do not require or execute the real external Understand plugin.

Post-audit closeout update:

- The first AGY attempt was blocked by sandboxed Antigravity auth/log-file access. The audit was rerun outside the sandbox with normal local AGY access and completed with PASS.
- Added `docs/00-ssot/END-OF-DAY-HANDOFF.md` to the allowed file list as a closeout-only artifact because the repo lifecycle requires a handoff refresh before every accepted-WP commit and push.
- Refreshed `docs/00-ssot/END-OF-DAY-HANDOFF.md` after the AntiGravity PASS to reflect current WP-189 status, validation evidence, open risks, and the next recommended step.

## Audit Results

Verdict: PASS

# Audit Report: WP-189 — Understand Graph Refresh Wrapper Command

## Summary of Verification

The audit of [WP-189](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-189-understand-graph-refresh-wrapper-command.md) was performed against repository source files, test suites, git status, and development workflow documentation in accordance with work package requirements.

### Key Verification Items:

1. **First-Class Repository Command**:
   - `scripts/refresh-understand-graph.ps1` exists as a repository-owned entry point. It automates root discovery, prerequisite validation, node stage invocation (scan, import map, structure, graph assembly, fingerprints, metadata), and intermediate cleanup without manual plugin-internal steps.

2. **Non-Mutating Dry-Run Mode**:
   - `scripts/refresh-understand-graph.ps1 -DryRun` outputs resolved paths, required scripts, tracked artifacts, and planned stages without writing or altering any repository or graph files. SHA256 hashes of `.understand-anything` baseline files were verified before and after execution to confirm non-mutation.

3. **Testability of Override & Failure Paths**:
   - `scripts/tests/test-understand-graph-refresh-wrapper.ps1` uses temporary fake plugin roots to test `-PluginRoot` overrides and missing-prerequisite failure paths without requiring the real external Understand plugin.

4. **Documentation Alignment**:
   - [Understand-Codebase-Analysis.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Understand-Codebase-Analysis.md) was updated to instruct future agents and contributors to run `scripts/refresh-understand-graph.ps1 -DryRun` and `scripts/refresh-understand-graph.ps1` as the primary repository workflow before falling back to the interactive `$understand` skill.

5. **Focused Tests & Artifact Integrity**:
   - Test execution passed cleanly with zero mutations to tracked `.understand-anything` graph baseline artifacts (`knowledge-graph.json`, `fingerprints.json`, `meta.json`, `intermediate/scan-result.json`).

6. **Scope & File Boundary Enforcement**:
   - Exactly 4 files changed, all within the allowed list:
     - [WP-189-understand-graph-refresh-wrapper-command.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-189-understand-graph-refresh-wrapper-command.md)
     - [Understand-Codebase-Analysis.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Understand-Codebase-Analysis.md)
     - [refresh-understand-graph.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/refresh-understand-graph.ps1)
     - [test-understand-graph-refresh-wrapper.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-understand-graph-refresh-wrapper.ps1)
   - No app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, resolver, or graph baseline files were modified.

7. **Validation Evidence Credibility**:
   - Re-verified via live execution:
     - `test-understand-graph-refresh-wrapper.ps1`: **PASS**
     - `refresh-understand-graph.ps1 -DryRun`: **PASS** (Resolved `C:\Users\cburk\.understand-anything-plugin`)
     - PowerShell parser check: **PASS**
     - `git diff --check`: **PASS**
     - `git status --short --untracked-files=all`: **PASS** (Only allowed files present)

8. **Advisory Role of Understand Output**:
   - Maintained. Understand graph output remains advisory and does not override SSOT, source code, or test evidence.

---

## Verdict

**PASS**

---

## Violations
- None.

## Regressions
- None.

## Drift Risks
- None. The wrapper uses dynamic root discovery, explicit parameter overrides (`-PluginRoot`), and prerequisite assertion prior to execution.

## Required Corrections
- None.

## Final Decision

Accepted.

Rationale: Independent AntiGravity audit returned PASS with no violations, regressions, drift risks, or required corrections. Scope remained limited to the allowed wrapper command, focused wrapper test, Understand workflow documentation, WP record, and closeout-only handoff refresh. Validation evidence confirms dry-run behavior is non-mutating, required plugin paths are checked, missing-prerequisite failures are clear, tracked graph baseline artifacts were not modified, and no app, database, prototype source, package, lockfile, secret, output, runtime AI, audit runner, closeout, commit-helper, or resolver files changed.



