# WP-208: Student Package Script Directory Compatibility Shims

## Objective

Move the student-package helper implementations into `scripts/student-package/` while preserving the existing top-level `scripts/*.ps1` command paths as compatibility shims and proving command compatibility with safe validation.

## Scope

### In Scope

- Move implementation logic for:
  - `scripts/build-student-tester-package.ps1`
  - `scripts/start-student-package.ps1`
  - `scripts/setup-local-sql-accounts.ps1`
- Add implementation files under `scripts/student-package/` for the same three helpers.
- Replace the original top-level helper files with compatibility shims.
- Preserve public top-level command paths currently referenced by release-readiness docs, student package docs, and helper output.
- Update the student package build helper so generated packages still include working top-level commands and any required moved implementation files.
- Add focused shim/compatibility validation for parser safety, parameter forwarding, exit-code behavior, and package inclusion behavior.

### Out of Scope

- Moving any non-student-package scripts.
- Updating workflow, agentic, SDK manager, Understand, work-package lifecycle, or statusline script locations.
- Updating docs, skills, archived work-package records, or command examples to prefer the new implementation paths.
- Removing or deprecating top-level student-package command paths.
- Running app startup, browser automation, dependency installation, SQL account creation, graph refresh, external audit dispatch, commit, push, or destructive cleanup.
- Changing application code, database code, dependencies, package/lockfiles, output artifacts, runtime AI behavior, or Case 004 progression.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `7186b432ad74156d817cdb552eb01dbe1581def6`.
- Current planning commit: `d5949a3957245452a8c8b41ac11c3be6646c1d64`.
- Freshness assessment: Structurally stale for this planning surface. Accepted WP-205, WP-206, and WP-207 changed workflow-tooling scripts/tests/planning records after the graph baseline. Because this package changes script organization and command-path relationships, graph relationship data was not used as authoritative.
- Analysis performed: Source-first inspection of the three student-package scripts, direct `rg` reference search for their public paths, review of WP-207 migration plan, and targeted inspection of the build helper's package file list.

### Affected Architecture

- Layers: student tester package tooling, local setup helper scripts, contributor/student command-line compatibility, release-readiness packaging.
- Primary files/components:
  - `scripts/build-student-tester-package.ps1`
  - `scripts/start-student-package.ps1`
  - `scripts/setup-local-sql-accounts.ps1`
  - `scripts/student-package/build-student-tester-package.ps1`
  - `scripts/student-package/start-student-package.ps1`
  - `scripts/student-package/setup-local-sql-accounts.ps1`
  - `scripts/tests/test-student-package-script-shims.ps1`
- Upstream consumers:
  - documented student-package commands in `docs/09-release-readiness/**`
  - pilot tester package generation workflow
  - instructors or local admins running SQL account setup
  - students running `Start-SequelDetective.cmd` or top-level setup helpers from extracted packages
- Downstream dependencies:
  - package builder source file list
  - helper output strings that mention top-level command paths
  - PowerShell parameter binding and exit-code behavior
  - generated package directory structure

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-package-script-shims.ps1`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - `scripts/build-student-tester-package.ps1 -NoZip`
  - `scripts/build-student-tester-package.ps1 -OutputRoot <path> -NoZip`
  - `scripts/start-student-package.ps1` and its documented parameter set
  - `scripts/setup-local-sql-accounts.ps1` and its documented parameter set
  - extracted student tester package use of top-level `scripts/*.ps1` commands
- Security/data boundaries:
  - no SQL execution during validation
  - no `npm install`, `npm run dev`, or browser launch during validation
  - no app/database source changes
  - no dependency or lockfile changes
  - no graph artifact changes
  - no external calls or runtime AI

### Graph Update Decision

- Regeneration required in this package: No.
- Regeneration required after accepted implementation: Yes, before relying on graph relationships for additional workflow-tooling planning.
- Rationale: This package will materially change script file locations and relationships, but graph refresh should happen only after implementation, audit, and human acceptance so the graph captures accepted source state.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `scripts/build-student-tester-package.ps1`
- `scripts/start-student-package.ps1`
- `scripts/setup-local-sql-accounts.ps1`
- `scripts/student-package/**`
- `scripts/student-package/build-student-tester-package.ps1`
- `scripts/student-package/start-student-package.ps1`
- `scripts/student-package/setup-local-sql-accounts.ps1`
- `scripts/tests/test-student-package-script-shims.ps1`

Do Not Modify:

- `apps/**`
- `database/**`
- `docs/00-ssot/**` except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/**` except `docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md`
- `docs/05-development-workflow/**`
- `docs/09-release-readiness/**`
- `.codex/**`
- `.understand-anything/**`
- `tools/**`
- Script files outside the explicit Allowed list.
- `package.json`
- `package-lock.json`
- `pyproject.toml`
- `requirements*.txt`
- `pnpm-lock.yaml`
- `yarn.lock`
- `outputs/**`

## Constraints

- Preserve the existing top-level student-package command paths as public compatibility entry points.
- Do not require users to learn or call the new `scripts/student-package/` implementation paths.
- Do not change documented command behavior, default parameter values, prompts, or student-facing output except where path handling must be corrected for the move.
- Do not perform broad script taxonomy work beyond these three student-package helpers.
- Do not update docs or skills in this package; the old documented paths must remain valid through shims.
- Do not run validation commands that start the app, install dependencies, open a browser, or connect to SQL Server.
- Do not add dependencies, runtime AI, external calls, graph changes, app/database changes, package/lockfile changes, output artifacts, or unrelated refactors.

## Required Behavior

- Create `scripts/student-package/` if it does not already exist.
- Move each student-package helper implementation into its matching file under `scripts/student-package/`.
- Convert each original top-level helper file into a narrow compatibility shim that:
  - forwards all declared parameters to the moved implementation;
  - preserves switch parameter behavior;
  - preserves success and failure exit behavior;
  - does not swallow stdout, stderr, warnings, or terminating errors;
  - resolves the moved implementation relative to the top-level shim path;
  - works when invoked from arbitrary current working directories.
- Update moved implementations so their project-root discovery remains correct from `scripts/student-package/`.
- Keep student-facing output references to top-level public command paths where those paths are part of the compatibility contract.
- Update the build helper's package inclusion logic so generated student packages include:
  - top-level compatibility shims for all three public commands;
  - the required `scripts/student-package/` implementation files;
  - no unrelated script directories or workflow helper scripts.
- Add a focused PowerShell test that:
  - parses all top-level shims and moved implementation files;
  - verifies each top-level shim delegates to the expected `scripts/student-package/` implementation path;
  - verifies parameter names and defaults remain compatible for the public command surface;
  - verifies invalid-input failure propagates through at least one safe shim path without SQL/app/dependency side effects;
  - verifies a `-NoZip` package build to a temporary output root includes the three top-level shims and three moved implementation files;
  - removes any temporary output it creates.
- Leave `Code Results`, `Audit Results`, and `Final Decision` pending until implementation, audit, and human acceptance occur.

## Acceptance Criteria

- [x] The three student-package helper implementations exist under `scripts/student-package/`.
- [x] The three original top-level helper paths still exist and are compatibility shims.
- [x] Top-level shims forward the original public parameters and preserve success/failure behavior.
- [x] Moved implementations resolve the repository/project root correctly from their new subdirectory.
- [x] Existing docs commands under `docs/09-release-readiness/**` remain valid without doc edits.
- [x] The package builder includes both the top-level shims and required moved implementation files in generated student packages.
- [x] Focused shim tests cover parser safety, delegation target, public parameter compatibility, safe failure propagation, package inclusion, and temporary artifact cleanup.
- [x] Validation does not run app startup, browser automation, dependency installation, or SQL account creation.
- [x] No files outside the allowed list are changed.
- [x] Graph regeneration is deferred until after accepted implementation.
- [x] Code Results are recorded after implementation.
- [x] Audit Results updated upon completion of audit.
- [x] Final Decision recorded after human acceptance.

## Code Prompt

Implement WP-208 exactly as specified.

Scope:
- Modify only the files listed in "Files Allowed to Change".
- Move only the three student-package helper implementations into `scripts/student-package/`.
- Keep the three original top-level helper paths as compatibility shims.

Implementation requirements:
1. Create moved implementation files:
   - `scripts/student-package/build-student-tester-package.ps1`
   - `scripts/student-package/start-student-package.ps1`
   - `scripts/student-package/setup-local-sql-accounts.ps1`
2. Replace the original top-level files with shims:
   - `scripts/build-student-tester-package.ps1`
   - `scripts/start-student-package.ps1`
   - `scripts/setup-local-sql-accounts.ps1`
3. Ensure all original parameters, defaults, switch behavior, stdout/stderr behavior, and terminating failures remain compatible through the top-level shims.
4. Correct project-root discovery in the moved implementations.
5. Update package-building logic so generated student packages include both public top-level shims and required `scripts/student-package/` implementation files.
6. Add `scripts/tests/test-student-package-script-shims.ps1` with safe compatibility checks and cleanup.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-package-script-shims.ps1`
- `git diff --check`
- `git status --short --untracked-files=all`

Constraints:
- Do not run `scripts/start-student-package.ps1` in a way that starts the app, installs dependencies, or opens a browser.
- Do not run `scripts/setup-local-sql-accounts.ps1` in a way that connects to SQL Server or changes SQL accounts.
- Do not update docs, skills, unrelated scripts, app/database files, dependency files, graph artifacts, output artifacts, or workflow behavior.

Return:
- Exact files changed.
- Validation commands and results.
- Any residual risk, especially around safe validation coverage for app-start and SQL helper scripts.

## Audit Prompt

Audit WP-208 as a narrow student-package script-directory implementation package.

Verify:
- Only allowed files changed.
- The three implementation files moved under `scripts/student-package/`.
- The three original top-level paths remain present as compatibility shims.
- Shims preserve public parameters, switch behavior, stdout/stderr behavior, and failure propagation.
- Moved implementations compute project root correctly from the new subdirectory.
- The student package builder includes both top-level shims and required moved implementations, without broadening package contents to unrelated workflow scripts.
- Existing release-readiness docs commands remain valid because top-level paths still work.
- Focused tests cover parser safety, shim delegation, public parameter compatibility, safe failure propagation, package inclusion, and temporary artifact cleanup.
- Validation avoided app startup, dependency installation, browser automation, SQL connection/account mutation, external calls, graph refresh, package/lockfile changes, app/database changes, output artifact changes, runtime AI, commit, and push.
- `Code Results` accurately records implementation and validation.
- `Audit Results` and `Final Decision` remain pending unless the audit and human acceptance have explicitly occurred.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-208 as a narrow student-package script-directory compatibility package.

Files changed:
- `scripts/build-student-tester-package.ps1`
- `scripts/start-student-package.ps1`
- `scripts/setup-local-sql-accounts.ps1`
- `scripts/student-package/build-student-tester-package.ps1`
- `scripts/student-package/start-student-package.ps1`
- `scripts/student-package/setup-local-sql-accounts.ps1`
- `scripts/tests/test-student-package-script-shims.ps1`
- `docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md`

Implementation summary:
- Moved the three student-package helper implementations into `scripts/student-package/`.
- Replaced the original top-level helper files with compatibility shims that preserve the original parameter blocks and delegate via `@PSBoundParameters`.
- Updated moved implementations to resolve the repository root from the new nested `scripts/student-package/` location.
- Updated student package build inclusion so generated packages contain the three top-level shims and the three moved implementation files, without copying unrelated workflow scripts.
- Added focused shim validation in `scripts/tests/test-student-package-script-shims.ps1`.

Validation performed:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-package-script-shims.ps1`
- PASS: `git diff --check`, with line-ending normalization warnings for touched PowerShell files only.
- PASS: `git status --short --untracked-files=all` for expected WP-208 scope only.
- After a blocked audit isolation preflight reported `scripts/student-package/` as an out-of-scope untracked directory, the WP allowed list was corrected to include `scripts/student-package/**`. This matches the intended and already listed implementation scope for the new moved helper directory.
- During accepted-WP closeout, the WP allowed list was corrected to include `docs/00-ssot/END-OF-DAY-HANDOFF.md` because the project closeout workflow requires refreshing the live handoff before commit and push.

Validation boundaries:
- Did not run app startup.
- Did not run dependency installation.
- Did not open a browser.
- Did not connect to SQL Server or mutate SQL accounts.
- Did not refresh Understand graph.
- Did not modify app, database, dependency, lockfile, graph, output artifact, runtime AI, docs outside WP-208, or skill files.

Residual risk:
- `start-student-package.ps1` full runtime behavior and successful SQL account setup remain intentionally unexecuted because safe validation must avoid app startup, dependency installation, browser automation, and SQL mutation. Compatibility coverage instead uses parser checks, parameter/default comparison, shim delegation checks, safe pre-SQL failure propagation, and package inclusion validation.

## Audit Results

# Audit Results for WP-208

**Verdict:** PASS

---

### Verification Summary

1. **Allowed Files Scope:** PASS
   - Changes are strictly limited to the allowed files in [WP-208-student-package-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md):
     - [scripts/build-student-tester-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/build-student-tester-package.ps1)
     - [scripts/start-student-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/start-student-package.ps1)
     - [scripts/setup-local-sql-accounts.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/setup-local-sql-accounts.ps1)
     - [scripts/student-package/build-student-tester-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/student-package/build-student-tester-package.ps1)
     - [scripts/student-package/start-student-package.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/student-package/start-student-package.ps1)
     - [scripts/student-package/setup-local-sql-accounts.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/student-package/setup-local-sql-accounts.ps1)
     - [scripts/tests/test-student-package-script-shims.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-student-package-script-shims.ps1)
     - [docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md)

2. **Implementation Relocation:** PASS
   - The implementations for the three helpers were successfully placed in `scripts/student-package/`.

3. **Top-Level Compatibility Shims:** PASS
   - Original top-level script paths remain present as lightweight shims delegating to `scripts/student-package/` via `& $implementationPath @PSBoundParameters` and forwarding `$LASTEXITCODE`.

4. **Behavior & Parameter Forwarding Preservation:** PASS
   - Public parameters, types, defaults, switch behavior, stdout/stderr streams, and failure propagation are 100% identical between shims and implementations.

5. **Subdirectory Project Root Discovery:** PASS
   - Moved implementations calculate `$projectRoot` using two `Split-Path -Parent` calls relative to `$PSScriptRoot` (`scripts/student-package/`), accurately locating the repository root.

6. **Student Package Builder Logic:** PASS
   - The package builder includes both the 3 top-level shims and the 3 moved implementations without including unrelated workflow scripts.

7. **Release-Readiness Documentation Command Compatibility:** PASS
   - All existing release-readiness doc references to top-level `scripts/*.ps1` paths continue to function without modification.

8. **Focused Test Coverage & Artifact Cleanup:** PASS
   - `scripts/tests/test-student-package-script-shims.ps1` validates AST parsing, delegation target paths, parameter compatibility, safe pre-connect failure propagation (invalid SQL identifier check), package staging content, and cleans up temporary test output upon completion. Test executed and passed cleanly.

9. **Validation Boundaries:** PASS
   - Validation adhered to strict safety limits: no app startup, no dependency installation (`npm install`), no browser launching, no SQL Server connections/mutations, no external network calls, no graph regeneration, no package/lockfile changes, and no Git commits or pushes.

10. **Code Results Recording:** PASS
    - `Code Results` in [WP-208-student-package-script-directory-compatibility-shims.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-208-student-package-script-directory-compatibility-shims.md) accurately logs implementation steps and validation evidence.

11. **Audit & Decision Field States:** PASS
    - `Audit Results` updated to PASS and `Final Decision` remains pending human acceptance as specified.

---

### Audit Output

- **Verdict:** PASS
- **Violations:** None.
- **Regressions:** None.
- **Drift risks:** Low. Top-level compatibility shims ensure existing workflows and release documentation remain valid.
- **Required corrections:** None.
The background task has finished, and the audit of **WP-208** is complete.

### Audit Summary for WP-208
- **Verdict:** PASS
- **Violations:** None
- **Regressions:** None
- **Drift Risks:** Low
- **Required Corrections:** None

All 11 audit requirements were verified in `D:\GitHub-Repos\SequelCityWeb`, including file scope boundaries, implementation relocation to `scripts/student-package/`, top-level compatibility shim delegation, parameter forwarding, subdirectory project root discovery, builder inclusion logic, documentation link validity, focused test coverage, and safe validation boundaries.

## Final Decision

Accepted on 2026-07-26.

Human reviewer accepted WP-208 after implementation evidence and audit PASS. The package moves the three student-package helper implementations into `scripts/student-package/`, preserves the documented top-level command paths as compatibility shims, validates shim delegation and package inclusion with focused safe tests, and introduces no app startup, dependency installation, browser automation, SQL account mutation, graph refresh, app/database changes, dependency or lockfile changes, runtime AI, external data behavior, output artifacts, or Case 004 progression changes.


