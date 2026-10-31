# WP-315: clarify launch and package documentation

## Objective

Give new students and developers a concise, consistent startup path and explain package naming without date-specific instructions or stale database-test guidance.

## Scope

The human explicitly requested implementation on 2026-10-29 and subsequently authorized changing the default package output to artifacts/student-packages inside the repository, excluded from Git. This explicit scope amendment supersedes the original documentation-only restriction. Update the root launch guide, package guide and student/instructor guide. Explain the builder's timestamped ZIP convention and default output location; distinguish the stable launcher filename from the variable package filename. Replace per-test-clone guidance with the registered single-workspace runner. Replace stale three-task Case 001 claims with a link to the canonical current-data reference. Keep maintenance detail in linked guides rather than copying the installer implementation into student instructions.

## Impact Analysis

### Understand Status

Optional: narrow documentation correction. Existing graph artifacts are available; metadata baseline 2fce050. Current main is c49b1f3; subsequent installer signature work is unrelated to package naming and these doc corrections. Graph is usable for this limited surface with source-confirmed drift; direct source inspection is authoritative. No graph regeneration required for copy/navigation edits.

### Affected Architecture

Documentation and the explicitly authorized package-output default only. Source authorities: package.json package:student command, scripts/student-package/build-student-tester-package.ps1, launcher implementation, single-test-database and invoke-single-database-test, and database/README.md. The sole executable change is the package builder default directory. Launcher behavior, database behavior and installed data are unchanged.

### Regression Surface

- Related tests: scripts/tests/test-student-package-script-shims.ps1; real default ZIP build, source-byte comparison, git check-ignore and graph refresh/readiness.

Check local links/anchors, documented commands/defaults against source, absence of stale per-run-clone/three-task case claims, scope and whitespace. SQL/browser tests are unnecessary because application/launcher/database behavior is unchanged. Generated ZIPs are snapshots, not live views of the repository.

### Graph Update Decision

Regenerate the four tracked graph artifacts after the explicitly authorized builder-default change; include them in this amended scope. Documentation link checks remain source-based.

## Files Allowed to Change

Allowed:
- `RUNNING-SEQUEL-DETECTIVE.md`
- docs/09-release-readiness/student-tester-package.md
- docs/09-release-readiness/student-install-and-run-guide.md
- docs/01-work-packages/WP-315-clarify-launch-and-package-documentation.md
- `.gitignore`
- scripts/student-package/build-student-tester-package.ps1
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Handoff is accepted-closeout only.

Do Not Modify:
- apps/**
- database/**
- scripts/** except the explicitly allowed package builder
- tools/**
- .codex/**
- dependencies, package manifests/lockfiles, credentials, installed databases and generated packages

## Constraints

No account-specific installation assumptions, automatic database resets, old-story equivalence claims or fixed release task counts in startup docs. Preserve warnings and recovery boundaries without burying the basic start steps. The follow-up human instruction authorizes a fresh package in the new ignored default output directory. Do not mutate SQL, accept, commit or push as part of implementation.

## Required Behavior

1. Root guide gives short extraction/start/stop instructions and points to detailed setup/package guides.
2. Package guide explains stable entry point, timestamp pattern, standard build command and default output folder.
3. Developer SQL-test guidance names the single registered workspace, exclusive backup/restore runner and one recovery backup; no per-run clones.
4. Student guide removes stale case counts/version-specific walkthrough claims and links current canonical bootstrap documentation.
5. All edited links resolve and documented commands/defaults match source.
6. Default builds use artifacts/student-packages relative to the source root, independent of caller directory; custom OutputRoot behavior remains supported. Generated packages are excluded from Git. Run existing packaging/shim checks and build/inspect a fresh ZIP without starting services or changing SQL.

## Acceptance Criteria

- [x] Clear basic launch path and package naming/output guidance.
- [x] Single-workspace test policy documented accurately.
- [x] Stale case claims removed without new duplication.
- [x] Links, source comparisons, scope and whitespace checks pass.
- [x] Only authorized docs/builder-default/ignore/graph changes; generated package matches current source and is ignored by Git.

## Code Prompt

Implement the authorized documentation corrections and explicit package-default amendment above. Run `scripts/tests/test-student-package-script-shims.ps1`, build with `npm run package:student`, verify Git ignores the result, and refresh graph artifacts. Verify instructions against existing source and check edited local links. Record actual results and stop for review without audit sharing, acceptance, commit or push.

## Audit Prompt

Independently check naming/defaults and launcher/test instructions against source, student readability, links and scope. Reject date-specific package filenames, per-run database clones, invented setup behavior or stale case descriptions. Verify the two-line builder default/ignore change and actual package checks; no application startup or database changes are required. Human acceptance remains separate.

## Code Results

Implemented on `codex/wp-315-launch-package-docs` after the explicit 2026-10-29 documentation request and subsequent authorization to place generated packages inside the repository while excluding them from Git. The builder/ignore/graph allowance was recorded before those edits; it supersedes the initial documentation-only plan.

- Root guide leads with extraction, fixed Start-SequelDetective.cmd entry point, browser readiness, keeping the window open and Ctrl+C shutdown. Build/default-output, advanced options and validation are separated for developers.
- Package guide explains timestamp naming, source-commit traceability, snapshots, standard npm build command, default repository artifacts/student-packages directory and custom OutputRoot. The same default is documented in the root guide.
- Builder now derives the default artifacts/student-packages directory from projectRoot, independent of the caller's working directory. Explicit OutputRoot behavior is unchanged. .gitignore excludes only the root generated student-package directory; no global ZIP ignore was added.
- Student/instructor guide removes stale Case 001 task/version walkthrough claims and links to canonical current-data documentation. Both developer test descriptions now document the single registered workspace, exclusive lock and backup/restore runner.

Validation:

- `scripts/tests/test-student-package-script-shims.ps1`: PASS, exit 0, including its explicit custom-output build and entry-point checks.
- `npm run package:student`: PASS, exit 0. Generated artifacts/student-packages/sequel-detective-student-tester-20261029-095436.zip and its build folder.
- All 222 ZIP entries were read from the archive and compared byte-for-byte by SHA-256 with current source; all matched, including updated guides and builder. Builder exclusion checks passed without including local secrets, dependency folders, Git metadata or SQL backups.
- `git check-ignore` confirms both ZIP and build folder are ignored. The generated artifacts do not appear as dirty/untracked source files.
- Edited guide links and anchors resolve; naming/build defaults match source, and obsolete three-task/per-run-clone guidance is removed.
- Graph refresh completed for 758 files; refresh-readiness and `git diff --check` passed. Four graph artifacts updated within scope.

No database was removed, created or changed; no application services were started. Application, launcher, dependencies and SQL sources remain unchanged. No extra SQL clone, external audit, handoff refresh, source commit or push performed. Independent audit and human acceptance remain pending. The new package includes this implementation's current source but is not an independently audited release; the earlier temporary-folder ZIP was left untouched.

## Audit Results

Verdict: PASS

Auditor: AntiGravity

### Independent Audit: WP-315 Launch & Package Documentation

**Verdict**: **PASS**  
**Auditor**: AntiGravity (Independent Audit)  
**Status**: `AuditedNeedsFinalDecision` (Human acceptance remains separate)

---

### Key Findings & Verification Summary

1. **Source-Grounded Naming and Defaults**
   - **Build Command**: [`package.json`](../../package.json#L13) defines `"package:student"` invoking [`scripts/build-student-tester-package.ps1`](../../scripts/build-student-tester-package.ps1).
   - **Entry Point / Launcher**: Documented as **`Start-SequelDetective.cmd`** across all guides. Confirmed stable regardless of package timestamp.
   - **Package Output & Naming**: The ZIP follows `sequel-detective-student-tester-YYYYMMDD-HHmmss.zip`. Default output root is derived from `$projectRoot` as `artifacts/student-packages/`. The custom `-OutputRoot` override parameter remains intact and functional.
   - **PowerShell Launcher Options**: [`scripts/start-student-package.ps1`](../../scripts/start-student-package.ps1#L1-L15) parameters (`SqlHost`, `SqlPort`, `DatabaseName`, `ApiPort`, `WebPort`, `SetupOnly`, `NoBrowser`) match documented options and precedence behavior (existing `.env` target settings take precedence).

2. **Negative Constraint Verifications (Rejections Confirmed)**
   - **Date-Specific Package Filenames**: Rejected. Guides explicitly explain the timestamp pattern as a build snapshot convention and differentiate it from the constant `Start-SequelDetective.cmd` launcher name.
   - **Per-Run Database Clones**: Rejected. Stale clone guidance is removed. Docs explicitly cite the single registered workspace [`SequelCityRuntimeTest_Workspace`](../../scripts/tests/single-test-database.ps1#L3), exclusive application locking (`sys.sp_getapplock`), backup/restore runner, and retention of one verified recovery backup.
   - **Invented Setup Behavior**: Rejected. Guides do not instruct students to run SQL scripts manually, edit `.env`, or configure credentials; first-provisioning and routine launch contracts are maintained.
   - **Stale Case Descriptions**: Rejected. Stale claims that Case 001 is a three-task evidence review were removed from [`docs/09-release-readiness/student-install-and-run-guide.md`](../../docs/09-release-readiness/student-install-and-run-guide.md#L36-L41) and replaced with direct references to the canonical bootstrap documentation in [`database/README.md`](../../database/README.md).

3. **Two-Line Builder Default and `.gitignore` Change**
   - [`.gitignore`](../../.gitignore#L50): Added `/artifacts/student-packages/` (confirmed ignored via `git check-ignore -v`).
   - [`scripts/student-package/build-student-tester-package.ps1`](../../scripts/student-package/build-student-tester-package.ps1#L14): Defaults `$OutputRoot = Join-Path $projectRoot "artifacts/student-packages"`.

4. **Student Readability & Link Integrity**
   - Startup sequence leads with a 3-step action path (extract ZIP, run `Start-SequelDetective.cmd`, wait for browser), followed by stop (`Ctrl+C`) and non-destructive failure recovery.
   - All relative links and markdown anchors resolve:
     - [`docs/09-release-readiness/student-install-and-run-guide.md`](../../docs/09-release-readiness/student-install-and-run-guide.md)
     - [`docs/09-release-readiness/student-tester-package.md`](../../docs/09-release-readiness/student-tester-package.md)
     - [`database/README.md`](../../database/README.md)
     - [`docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#verification-with-one-registered-workspace`](../../docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#L59)
     - [`docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#existing-installations`](../../docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#L11)
     - [`docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#account-independent-local-ownership-wp-309`](../../docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#L49)

5. **Package and Test Execution Checks**
   - [`scripts/tests/test-student-package-script-shims.ps1`](../../scripts/tests/test-student-package-script-shims.ps1): **PASS** (exit 0).
   - [`scripts/tests/test-student-launcher.ps1`](../../scripts/tests/test-student-launcher.ps1): **PASS** (exit 0, fixtures without SQL integration).
   - [`scripts/tests/test-single-test-database.ps1`](../../scripts/tests/test-single-test-database.ps1): **PASS** (exit 0).
   - [`scripts/check-understand-refresh-readiness.ps1`](../../scripts/check-understand-refresh-readiness.ps1): **READY**.
   - `npm run package:student`: Successfully generated `artifacts/student-packages/sequel-detective-student-tester-20261029-095436.zip`.
   - **Archive Inspection**: 226 entries verified. Excludes `.git`, `node_modules`, `.env`, database backups (`.bak`, `.mdf`, etc.), build outputs (`dist/`), and logs.
   - `git diff --check`: **PASS** (zero whitespace errors).
   - `scripts/get-work-package-status.ps1 -WorkPackage WP-315`: Reports `Out-of-scope dirty files: none` and state `AuditedNeedsFinalDecision`.
   - **Zero Application / Database Mutation**: No application servers were started and no database changes were made.

The audit section in [`docs/01-work-packages/WP-315-clarify-launch-and-package-documentation.md`](../../docs/01-work-packages/WP-315-clarify-launch-and-package-documentation.md#L105-L186) has been recorded. Human acceptance remains separate.

### Invocation, scope and maintainer review (2026-10-29)

The human explicitly authorized AntiGravity sharing for WP-315. The first isolation preflight stopped before invoking AGY because root-level Allowed filenames were not backtick-quoted. Quoting the already authorized .gitignore and RUNNING-SEQUEL-DETECTIVE.md entries corrected parser compatibility without broadening scope or using AllowMixedWorktree.

AGY then actually ran through `scripts/audit-work-package.ps1 WP-315 -AllowExternalAudit -TimeoutMinutes 10`, dispatched from `D:/GitHub-Repos/SequelCityWeb/.git/wp315-independent-audit`, and returned PASS after 00:07:41. The prepared snapshot had ten scoped changed files and excluded credentials, local settings, SQL registration and generated ZIPs. The auditor also referenced primary-repository scoped paths and placed equivalent audit text in the active WP. This record retains the completed runner-returned review; byte comparisons confirmed all nine implementation/graph files remained identical to the snapshot, and the WP's pre-audit planning/code results and pending Final Decision were unchanged. Absolute source citations were mechanically made relative to this WP.

The review reports no blocking findings. Packaging/shim, non-SQL launcher and workspace-safety tests passed; no SQL integration, application startup or database mutation was needed or performed. The 226 archive entries comprise 222 files and four directory entries, independently reconfirmed during review; this agrees with the implementation's 222-file source comparison. Independent checks cover package/default/ignore behavior and documentation, not a new end-to-end student SQL installation test. Existing installed data and services remain untouched.

Handoff refresh, human acceptance, commit and push remain separate. Invocation and initial preflight logs are retained in the isolated snapshot's local .git directory.

## Final Decision

Accepted by the human on 2026-10-31: "accepted, commit and push". Independent AntiGravity audit passed on 2026-10-29 with no blocking findings; source/packaging, ignore, documentation and graph checks support closeout. Commit and push the scoped implementation and refreshed handoff. Acceptance does not authorize database replacement or an installed-application reset.
