# WP-210: Understand Script Directory Compatibility Shims

## Objective

Move the Understand refresh helper implementations into `scripts/understand/` while preserving the existing top-level `scripts/*.ps1` command paths as compatibility shims and proving command compatibility with focused safe validation.

## Scope

### In Scope

- Move implementation logic for:
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
- Add implementation files under `scripts/understand/` for the same two helpers.
- Replace the original top-level helper files with compatibility shims.
- Preserve public top-level command paths currently referenced by workflow docs, work packages, agentic status tooling, tests, and handoff guidance.
- Update source-local delegation so readiness preflight still invokes the refresh wrapper through a stable path.
- Add or update focused shim/compatibility validation for parser safety, parameter forwarding, dry-run safety, readiness JSON/text behavior, failure propagation, graph-artifact non-mutation, and transient cleanup.

### Out of Scope

- Moving any non-Understand scripts.
- Moving work-package lifecycle, agentic workflow, SDK manager, student-package, or statusline scripts.
- Updating docs, skills, archived work-package records, or command examples to prefer `scripts/understand/`.
- Removing or deprecating top-level Understand command paths.
- Refreshing the Understand graph baseline.
- Changing graph artifacts, app code, database code, dependencies, package/lockfiles, runtime AI behavior, output artifacts, or Case 004 progression.
- Running app startup, browser automation, dependency installation, SQL mutation, external audit dispatch, commit, push, or destructive cleanup.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `b8d1b50f6e766c89ae1906dccf38284f2cd0f39c`.
- Current planning commit: `57684c17` (`WP-209` graph refresh closeout). The graph metadata intentionally records the source state commit `b8d1b50f6e766c89ae1906dccf38284f2cd0f39c`; the later `57684c1` commit only added refreshed graph artifacts, WP-209, and handoff closeout records.
- Freshness assessment: Current for the relevant script source state, with non-structural documentation/graph-artifact drift after the analyzed commit. No accepted source script changes occurred after the graph baseline.
- Analysis performed: Recommended-tier Understand-assisted planning. Used targeted graph search for `scripts/check-understand-refresh-readiness.ps1` and `scripts/refresh-understand-graph.ps1`, then verified references and tests directly with source search and script inspection.

### Affected Architecture

- Layers: development workflow tooling, Understand refresh wrapper tooling, command-line compatibility surface, agentic workflow status support.
- Primary files/components:
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
  - `scripts/understand/check-understand-refresh-readiness.ps1`
  - `scripts/understand/refresh-understand-graph.ps1`
  - `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `scripts/tests/test-understand-script-shims.ps1`
  - `docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md`
- Upstream consumers:
  - contributors running documented top-level Understand refresh commands
  - `scripts/get-agentic-workflow-status.ps1`, which invokes `check-understand-refresh-readiness.ps1`
  - work-package planning, audit, and closeout flows checking graph readiness
  - existing wrapper/readiness tests
- Downstream dependencies:
  - readiness preflight text and JSON output
  - refresh wrapper dry-run output
  - failure-path cleanup for `.understand-anything/tmp/refresh-understand-graph`
  - tracked graph artifact non-mutation guarantees
  - public command examples in workflow docs and work-package records

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-script-shims.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - graph refresh readiness checks
  - graph refresh dry-run planning
  - future work-package impact analysis using graph readiness status
  - agentic workflow status bundle generation
- Security/data boundaries:
  - development-only command organization
  - no graph refresh during this implementation package
  - no runtime AI
  - no live SDK/model calls
  - no dependency installation or package/lockfile mutation
  - no app startup or browser automation
  - no database connection or mutation
  - no external audit dispatch

### Graph Update Decision

- Regeneration required in this package: No.
- Regeneration required after accepted implementation: Yes, before relying on graph relationships for additional script-directory planning.
- Rationale: This package will materially change script file locations and relationships by moving Understand helper implementations. The graph refresh should be performed in a focused follow-up package after implementation, audit, and human acceptance, matching the WP-208/WP-209 pattern.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/refresh-understand-graph.ps1`
- `scripts/understand/**`
- `scripts/understand/check-understand-refresh-readiness.ps1`
- `scripts/understand/refresh-understand-graph.ps1`
- `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `scripts/tests/test-understand-script-shims.ps1`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/**`
- `database/**`
- `docs/00-ssot/**` except `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout only
- `docs/01-work-packages/**` except `docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md`
- `docs/05-development-workflow/**`
- `docs/09-release-readiness/**`
- `.codex/**`
- `.understand-anything/**`
- `tools/**`
- `scripts/**` except the explicit Allowed script paths, `scripts/understand/**`, and the explicit Allowed test files
- `package.json`
- `package-lock.json`
- `pyproject.toml`
- `requirements*.txt`
- `pnpm-lock.yaml`
- `yarn.lock`
- `outputs/**`

## Constraints

- Preserve the existing top-level Understand command paths as public compatibility entry points.
- Do not require users or docs to call the new `scripts/understand/` implementation paths.
- Do not change documented behavior, default parameter values, output shape, JSON fields, dry-run behavior, failure text, or cleanup semantics except where path handling must be corrected for the move.
- Do not perform broad script taxonomy work beyond these two Understand helpers.
- Do not update docs or skills in this package; current documented top-level paths must remain valid through shims.
- Do not run the mutating graph refresh command during validation; use `-DryRun` and readiness checks only.
- Do not add dependencies, runtime AI, external calls, graph changes, app/database changes, package/lockfile changes, output artifacts, or unrelated refactors.

## Required Behavior

- Create `scripts/understand/` if it does not already exist.
- Move each Understand helper implementation into its matching file under `scripts/understand/`.
- Convert each original top-level helper file into a narrow compatibility shim that:
  - forwards all declared parameters to the moved implementation;
  - preserves switch parameter behavior;
  - preserves success and failure exit behavior;
  - does not swallow stdout, stderr, warnings, or terminating errors;
  - resolves the moved implementation relative to the top-level shim path;
  - works when invoked from arbitrary current working directories.
- Update moved implementations so repository-root discovery remains correct from `scripts/understand/`.
- Ensure moved readiness preflight resolves the refresh wrapper safely after the move.
- Preserve the public top-level path contract in output text where command paths are part of documented or tested behavior.
- Update existing Understand wrapper/readiness tests only as needed for the moved implementation path while preserving their original behavioral assertions.
- Add focused shim validation that:
  - parses both top-level shims and moved implementation files;
  - verifies each top-level shim delegates to `scripts/understand/`;
  - verifies public parameter names, types, defaults, and switch behavior remain compatible;
  - verifies `scripts/refresh-understand-graph.ps1 -DryRun` succeeds without modifying tracked graph artifacts;
  - verifies `scripts/check-understand-refresh-readiness.ps1` and `-Json` succeed and preserve text/JSON readiness contracts;
  - verifies blocked readiness/failure propagation remains tested with fake plugin fixtures;
  - verifies no `.understand-anything/tmp`, `.understand-anything/.trash-*`, `.understand-anything/**/*.log`, or tracked graph artifact changes remain after tests.
- Leave `Code Results`, `Audit Results`, and `Final Decision` pending until implementation, audit, and human acceptance occur.

## Acceptance Criteria

- [x] The two Understand helper implementations exist under `scripts/understand/`.
- [x] The two original top-level helper paths still exist and are compatibility shims.
- [x] Top-level shims forward original public parameters and preserve success/failure behavior.
- [x] Moved implementations resolve repository root correctly from `scripts/understand/`.
- [x] Readiness preflight still delegates to the refresh wrapper safely and preserves text/JSON output contracts.
- [x] Existing docs commands remain valid without doc edits.
- [x] Focused shim tests cover parser safety, delegation targets, parameter compatibility, dry-run/readiness compatibility, blocked-path propagation, graph artifact non-mutation, and transient artifact cleanup.
- [x] Existing Understand wrapper/readiness tests pass after the move.
- [x] Validation does not run mutating graph refresh, app startup, browser automation, dependency installation, SQL mutation, or external audit dispatch.
- [x] No files outside the allowed list are changed.
- [x] Graph regeneration is deferred until after accepted implementation.
- [x] Code Results are recorded after implementation.
- [ ] Audit Results remain pending until audit is separately completed.
- [x] Final Decision recorded after human acceptance.

## Code Prompt

Implement WP-210 exactly as specified.

Scope:
- Modify only the files listed in "Files Allowed to Change".
- Move only the two Understand helper implementations into `scripts/understand/`.
- Keep the two original top-level helper paths as compatibility shims.

Implementation requirements:
1. Create moved implementation files:
   - `scripts/understand/check-understand-refresh-readiness.ps1`
   - `scripts/understand/refresh-understand-graph.ps1`
2. Replace the original top-level files with shims:
   - `scripts/check-understand-refresh-readiness.ps1`
   - `scripts/refresh-understand-graph.ps1`
3. Ensure all original parameters, defaults, switch behavior, stdout/stderr behavior, JSON/text output, dry-run safety, cleanup semantics, and terminating failures remain compatible through the top-level shims.
4. Correct repository-root discovery in the moved implementations.
5. Ensure the moved readiness preflight locates the refresh wrapper correctly after the move.
6. Update existing Understand tests only as needed for moved implementation paths and add `scripts/tests/test-understand-script-shims.ps1` for compatibility checks.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-script-shims.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
- `git diff --check`
- `git status --short --untracked-files=all`

Constraints:
- Do not run `scripts/refresh-understand-graph.ps1` without `-DryRun`.
- Do not modify graph artifacts, docs outside WP-210, skills, unrelated scripts, app/database files, dependency files, package/lockfiles, runtime AI surfaces, or output artifacts.
- Do not run app startup, browser automation, dependency installation, SQL mutation, external audit dispatch, commit, push, or handoff refresh during implementation.

Return:
- Exact files changed.
- Validation commands and results.
- Evidence that top-level commands still work and remain safe.
- Any residual risk, especially around mutating graph refresh not being executed.

## Audit Prompt

Audit WP-210 as a narrow Understand script-directory implementation package.

Verify:
- Only allowed files changed.
- The two implementation files moved under `scripts/understand/`.
- The two original top-level paths remain present as compatibility shims.
- Shims preserve public parameters, switch behavior, stdout/stderr behavior, JSON/text output, dry-run safety, cleanup semantics, and failure propagation.
- Moved implementations compute repository root correctly from `scripts/understand/`.
- Readiness preflight still delegates to the refresh wrapper safely and preserves text/JSON output contracts.
- Existing docs commands remain valid because top-level paths still work.
- Focused tests cover parser safety, shim delegation, public parameter compatibility, dry-run/readiness compatibility, blocked-path propagation, graph artifact non-mutation, and transient cleanup.
- Validation avoided mutating graph refresh, app startup, dependency installation, browser automation, SQL mutation, external calls, graph artifact changes, package/lockfile changes, app/database changes, output artifact changes, runtime AI, commit, and push.
- `Code Results` accurately records implementation and validation.
- `Audit Results` and `Final Decision` remain pending unless audit and human acceptance have explicitly occurred.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-210 as a narrow Understand script-directory compatibility package.

Files changed:
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/refresh-understand-graph.ps1`
- `scripts/understand/check-understand-refresh-readiness.ps1`
- `scripts/understand/refresh-understand-graph.ps1`
- `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- `scripts/tests/test-understand-script-shims.ps1`
- `docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md`

Implementation summary:
- Moved the Understand refresh helper implementations into `scripts/understand/`.
- Replaced the original top-level helper files with compatibility shims that preserve the original parameter blocks and delegate via `@PSBoundParameters`.
- Updated moved implementations to resolve the repository root from `scripts/understand/`.
- Preserved top-level wrapper path reporting in readiness output by keeping the readiness implementation pointed at `scripts/refresh-understand-graph.ps1`.
- Updated existing Understand tests to inspect moved implementation files for internal wrapper behavior.
- Added `scripts/tests/test-understand-script-shims.ps1` to validate parser safety, shim delegation, public parameter compatibility, dry-run/readiness compatibility, blocked readiness propagation, graph artifact non-mutation, and transient artifact cleanup.

Validation evidence:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-script-shims.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-graph-refresh-wrapper.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-understand-refresh-readiness-preflight.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - Reported `Understand refresh readiness: READY`.
  - Reported dry run succeeded, tracked artifacts changed `0`, temp directory absent, trash directories `0`, and log files `0`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - Reported `"ready": true`.
  - Reported wrapper dry run exit code `0`.
  - Reported no changed artifacts and no temp/trash/log hygiene errors.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1 -DryRun`
  - Reported the repository root, Understand plugin root, required plugin scripts, tracked refresh outputs, and planned stages.
  - Reported `Dry run: no files modified.`
- PASS: `git diff --check`, with line-ending normalization warnings for touched PowerShell files only.
- PASS: `git status --short --untracked-files=all` showed only WP-210 scoped files.

Boundary notes:
- Did not run `scripts/refresh-understand-graph.ps1` without `-DryRun`.
- Did not modify `.understand-anything/**` graph artifacts.
- Did not modify docs outside WP-210, skills, unrelated scripts, app files, database files, dependencies, package/lockfiles, runtime AI surfaces, output artifacts, or Case 004 progression files.
- Did not run app startup, browser automation, dependency installation, SQL mutation, external audit dispatch, commit, push, or handoff refresh during implementation.

Residual risk:
- The mutating graph refresh path was intentionally not executed in WP-210. Compatibility coverage uses dry-run/readiness checks, existing wrapper failure-path tests, graph-artifact hash checks, and transient cleanup assertions. A focused graph refresh package should follow after acceptance before graph relationships are used for more script-directory planning.

## Audit Results

### Verdict
**PASS**

---

### Verification Summary

1. **Allowed Files Scope**:
   - Exactly **8** files were modified/added, matching the `Allowed Files` list in [WP-210](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md):
     - `docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md`
     - `scripts/check-understand-refresh-readiness.ps1`
     - `scripts/refresh-understand-graph.ps1`
     - `scripts/understand/check-understand-refresh-readiness.ps1`
     - `scripts/understand/refresh-understand-graph.ps1`
     - `scripts/tests/test-understand-graph-refresh-wrapper.ps1`
     - `scripts/tests/test-understand-refresh-readiness-preflight.ps1`
     - `scripts/tests/test-understand-script-shims.ps1`
   - No unexpected files or out-of-scope directories (`apps/`, `database/`, `.understand-anything/`, package lockfiles) were touched.

2. **Implementation Relocation**:
   - Implementations are located under `scripts/understand/`:
     - [check-understand-refresh-readiness.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/understand/check-understand-refresh-readiness.ps1)
     - [refresh-understand-graph.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/understand/refresh-understand-graph.ps1)

3. **Top-Level Compatibility Shims**:
   - Original top-level paths remain present as lightweight shims:
     - [scripts/check-understand-refresh-readiness.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1)
     - [scripts/refresh-understand-graph.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/refresh-understand-graph.ps1)
   - Shims preserve cmdlet binding, parameter declarations, default values, switch parameters, stdout/stderr streams, and exit code propagation (`exit $LASTEXITCODE`).

4. **Path & Root Discovery**:
   - Implementation scripts in `scripts/understand/` compute repository root via two parent traversals:
     ```powershell
     $scriptRoot = Split-Path -Path $PSCommandPath -Parent        # scripts/understand
     $publicScriptRoot = Split-Path -Path $scriptRoot -Parent     # scripts
     $repoRoot = Split-Path -Path $publicScriptRoot -Parent      # repository root
     ```
   - Preflight readiness correctly resolves the top-level refresh wrapper shim via `$publicScriptRoot/refresh-understand-graph.ps1`.

5. **Existing Commands & Documentation Compatibility**:
   - Commands referenced across documentation and workflow guidance (e.g. `powershell -File scripts/check-understand-refresh-readiness.ps1`) continue to function without modification.

6. **Automated Test Coverage**:
   - All focused test suites passed cleanly:
     - `scripts/tests/test-understand-script-shims.ps1`: Validates parser AST safety, parameter parity between shims and implementations, shim delegation, dry-run output, readiness text/JSON shapes, failure propagation on incomplete plugin fixtures, graph artifact SHA-256 non-mutation, and post-execution transient artifact hygiene.
     - `scripts/tests/test-understand-graph-refresh-wrapper.ps1`: Validates wrapper internals, Node.js stage parameters, assembly syntax, dry-run safety, and cleanup semantics.
     - `scripts/tests/test-understand-refresh-readiness-preflight.ps1`: Validates preflight text/JSON output contracts and blocker reporting.

7. **Validation Boundaries**:
   - Mutating graph refresh was **not** executed (only `-DryRun` was used).
   - No app startup, browser automation, SQL mutation, external calls, dependency installations, lockfile updates, or AI model calls occurred.

8. **Package Record Integrity**:
   - `Code Results` in [WP-210](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-210-understand-script-directory-compatibility-shims.md) accurately reflects implementation details, validation evidence, and residual risks.
   - `Audit Results` and `Final Decision` were properly kept pending prior to audit completion.

---

### Violations
**None**

---

### Regressions
**None**

---

### Drift Risks
**None**
*(Note: Mutating graph refresh was intentionally deferred to a follow-up graph refresh package after human acceptance, as specified in WP-210.)*

---

### Required Corrections
**None**

## Final Decision

Accepted on 2026-07-26.

Human reviewer accepted WP-210 after implementation evidence and audit PASS. The package moves the two Understand helper implementations into `scripts/understand/`, preserves the documented top-level command paths as compatibility shims, validates dry-run/readiness behavior and failure-path safety, and introduces no mutating graph refresh, graph artifact changes, app startup, dependency installation, browser automation, SQL mutation, external audit dispatch, app/database changes, package/lockfile changes, runtime AI, output artifact changes, or Case 004 progression changes.

