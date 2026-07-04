# Student Tester Package And Bootstrap Distribution

## Objective

Create a repeatable student-tester distribution package for Sequel Detective that can be handed to a small pilot group and that clearly validates or explains the required local runtime components before students begin testing.

## Scope

### In Scope

- Add a deterministic packaging command that produces a local student-tester archive or folder from the repository.
- Include only the files needed for a pilot tester to install dependencies, configure the backend, start the app, and validate readiness.
- Include student-facing setup and launch documentation for Windows local testing.
- Document the existing bootstrap path accurately:
  - API startup verifies database readiness.
  - Admin Mode can apply required database upgrades when the local Windows and SQL Server setup allows it.
  - Health status reports API, database, bootstrap, and schema readiness.
- Include a package smoke-check that verifies the artifact contains the expected startup files and excludes development-only or secret-bearing content.
- Add a root `npm` script for creating the student-tester package.

### Out of Scope

- No production deployment, hosted release, Docker image, installer executable, or auto-updater.
- No changes to Case 004 gameplay, clue logic, student progression, evidence logging, or final verdict behavior.
- No SQL Server installation automation.
- No database schema changes or seed-data changes.
- No new runtime dependencies.
- No use of `install.cmd` as the application installer unless it is explicitly repurposed in a separate work package. Current source inspection shows it installs `agy.exe`, not Sequel Detective.
- No changes to app bootstrap behavior unless implementation proves the existing documented path cannot support the package.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`.
- Freshness assessment: Usable with structural drift outside the intended packaging surface. Commits after the baseline changed student-mode UI, browser walkthrough tests, release-readiness docs, and root `package.json`. They did not change the backend bootstrap service or database migration service inspected for this package, but the graph should not be treated as current for the latest student-mode UI.
- Analysis performed: Required-tier planning with graph availability check, baseline comparison, changed-file inspection since baseline, targeted source search for packaging/bootstrap/release terms, and direct source verification against package scripts, runtime docs, API bootstrap, health routes, and database assets.

### Affected Architecture

- Layers:
  - root workspace scripts
  - release-readiness documentation
  - local runtime setup documentation
  - API bootstrap/readiness documentation, read-only for implementation unless a blocking gap is discovered
- Primary files/components:
  - `package.json`
  - new packaging script under `scripts/`
  - new or updated student-tester distribution doc under `docs/09-release-readiness/`
  - `RUNNING-SEQUEL-DETECTIVE.md`
  - `apps/api/src/services/databaseBootstrapService.ts` (read-only reference)
  - `apps/api/src/routes/healthRoutes.ts` (read-only reference)
  - `apps/web/src/components/HealthStatus.tsx` (read-only reference)
  - `database/01-SequelCityCrimesDB - Create DB.sql` (packaged read-only asset)
  - `database/02-SequelCityCrimesDB - Insert Data.sql` (packaged read-only asset)
  - `database/03-SequelCityCrimesDB - ForeignKeys.sql` (packaged read-only asset)
- Upstream consumers:
  - instructor/developer creating the tester package
  - pilot students receiving the package
  - future release-readiness reviews
- Downstream dependencies:
  - Node/npm workspace install behavior
  - API `npm run build` and `npm run start --workspace apps/api`
  - web `npm run build --workspace apps/web` and local Vite dev launch for testing
  - local SQL Server and `SequelCityCrimesDB`
  - API health endpoint `GET /api/health/full`
  - Admin Mode `Apply Required Upgrade` path when bootstrap status is degraded and in-app apply is available

### Regression Surface

- Related tests:
  - `npm run build`
  - `npm run test --workspace apps/api`
  - `npm run test --workspace apps/web`
  - packaging script dry run or artifact validation command added by this work package
  - manual package smoke test from a clean temporary extraction directory when practical
- User workflows:
  - instructor creates a package
  - student extracts package
  - student installs dependencies
  - student creates or confirms `apps/api/.env`
  - student starts the app
  - student confirms Health Status is ready or follows documented bootstrap/admin upgrade guidance
  - student opens Student Mode and begins Case 004
- Security/data boundaries:
  - Do not package `.git`, `node_modules`, build caches, coverage, Playwright artifacts, temporary files, or local logs.
  - Do not package `apps/api/.env` or any credential-bearing file.
  - Do not broaden SQL execution permissions.
  - Preserve backend-owned read-only SQL validation.
  - Preserve deterministic, local-only runtime boundaries and no runtime AI.

### Graph Update Decision

- Regeneration required: No for this package if implementation is limited to packaging scripts and docs.
- Rationale: The package should not alter runtime architecture, imports, database schema, Case 004 progression, or security boundaries. If implementation changes API bootstrap behavior, database migration behavior, app source imports, or documentation architecture beyond the listed docs, regenerate or create a follow-up graph refresh package.

## Files Allowed to Change

Allowed:

- `package.json`
- `Start-SequelDetective.cmd`
- `scripts/build-student-tester-package.ps1`
- `scripts/start-student-package.ps1`
- `docs/09-release-readiness/student-install-and-run-guide.md`
- `docs/09-release-readiness/student-tester-package.md`
- `docs/09-release-readiness/README.md`
- `RUNNING-SEQUEL-DETECTIVE.md`
- `docs/01-work-packages/WP-162-student-tester-package-and-bootstrap-distribution.md`

Do Not Modify:

- `apps/api/src/**`
- `apps/web/src/**`
- `apps/web/tests/**`
- `database/**`
- `install.cmd`
- `.understand-anything/**`

## Constraints

- Preserve existing behavior unless explicitly changing it.
- No architectural changes.
- No new npm dependencies.
- No generated package artifact committed to git.
- No secrets or local `.env` files in the package.
- The package script must be Windows-friendly and runnable from the repository root.
- The package script must fail with a useful message if required source files are missing.
- The package script must keep output under an ignored or temporary release directory.
- The student instructions must be honest that SQL Server and a usable `SequelCityCrimesDB` are still required.
- The docs must not imply cloud hosting, production deployment, runtime AI, or unsupported automated SQL Server installation.

## Required Behavior

- Add `scripts/build-student-tester-package.ps1`.
- Add a root npm script, suggested name: `package:student`.
- The packaging script must:
  - create a clean output directory for the package build
  - copy required repository files and directories for local student testing
  - include root workspace package files needed for `npm install`
  - include API and web source needed for local build/start
  - include database creation/seed/foreign-key SQL files as reference/setup assets
  - include student-tester instructions
  - exclude `node_modules`, `.git`, `.env`, `dist`, coverage, Playwright output, temporary captures, and other generated artifacts
  - produce a `.zip` archive or clearly named package folder
  - print the artifact path and next-step instructions
  - validate that excluded secret-bearing files were not copied
- Add a student launcher:
  - `Start-SequelDetective.cmd`
  - `scripts/start-student-package.ps1`
  - checks Node/npm
  - creates `apps/api/.env` from student prompts when missing
  - runs `npm install` when dependencies are missing
  - starts the app with `npm run dev`
  - opens `http://127.0.0.1:5173`
  - does not install SQL Server, restore the database, or embed secrets
- Add `docs/09-release-readiness/student-tester-package.md` with:
  - prerequisites
  - how the instructor builds the package
  - how a student extracts and runs it
  - how to create `apps/api/.env` from documented values
  - how to confirm readiness in Health Status
  - what the bootstrap/Admin Mode upgrade can and cannot do
  - known limitations for pilot testers
  - what feedback students should report
- Add `docs/09-release-readiness/student-install-and-run-guide.md` as the direct student-facing handout.
- Update `docs/09-release-readiness/README.md` to list the new package doc.
- Update `RUNNING-SEQUEL-DETECTIVE.md` to point pilot testers and instructors to the package doc without replacing the existing developer quickstart.

## Acceptance Criteria

- [x] `npm run package:student` creates a fresh student-tester package artifact from the repository root.
- [x] The package artifact contains setup instructions, root workspace package files, app source, database setup SQL files, and startup documentation.
- [x] The package artifact excludes `.git`, `node_modules`, `apps/api/.env`, build output, coverage, Playwright artifacts, temporary captures, and local logs.
- [x] The package script prints the artifact path and short next steps after success.
- [x] Student-tester documentation clearly states that SQL Server, Node/npm, and `SequelCityCrimesDB` are required.
- [x] Student-tester documentation explains the existing bootstrap/Admin Mode upgrade path without claiming it installs SQL Server or restores the database.
- [x] A separate student-facing install/run handout exists and is included by the package.
- [x] A double-click student launcher exists and is included by the package.
- [x] `RUNNING-SEQUEL-DETECTIVE.md` and `docs/09-release-readiness/README.md` link to the new package doc.
- [x] `npm run build` passes.
- [x] `npm run test --workspace apps/api` passes.
- [x] `npm run test --workspace apps/web` passes.
- [x] No unrelated files changed.

## Code Prompt

Implement the student-tester packaging workflow exactly as specified in WP-162.

Scope:

- Only modify the files listed under `Files Allowed to Change`.
- Treat all `Do Not Modify` entries as read-only references.

Implementation requirements:

- Add `scripts/build-student-tester-package.ps1`.
- Add `package:student` to the root `package.json`.
- Add `docs/09-release-readiness/student-tester-package.md`.
- Update the release-readiness README package table.
- Update `RUNNING-SEQUEL-DETECTIVE.md` with a short pointer to the student-tester package workflow.

Packaging script requirements:

- Run from the repository root, or detect the repository root from the script location.
- Create a clean package staging directory under a generated output path that should not be committed.
- Copy only required source/docs/database/package files.
- Exclude `.git`, `node_modules`, `.env`, `dist`, coverage, Playwright reports, test artifacts, temp captures, `.understand-anything`, and local logs.
- Create a zip artifact if `Compress-Archive` is available; otherwise leave the package folder and report that path.
- Validate the package does not include `apps/api/.env` or `node_modules`.
- Print concise success output with artifact location and next steps.

Documentation requirements:

- Use Windows PowerShell examples.
- Include a minimal `.env` template without real secrets.
- State the prerequisite boundary plainly: the bootstrap path verifies/applies app database migrations and SQL accounts where allowed; it does not install SQL Server or restore the database.
- Keep the docs local-first and deterministic. Do not mention runtime AI or production hosting.

Verification:

- Run `npm run package:student`.
- Run `npm run build`.
- Run `npm run test --workspace apps/api`.
- Run `npm run test --workspace apps/web`.

Return:

- Exact code changes.
- Package artifact path from the test run.
- Verification results.
- Any setup limitation that prevented full verification.

## Audit Prompt

Audit this change against WP-162.

Verify:

- All acceptance criteria are satisfied.
- Only allowed files were modified.
- No package artifact or generated release output was committed.
- The packaging script excludes secrets, dependencies, build outputs, git metadata, test artifacts, and local logs.
- The script can be run repeatedly without stale output contaminating a new package.
- The package contains the files needed for a pilot student local test.
- Documentation accurately describes prerequisites and bootstrap limits.
- Documentation does not imply production hosting, runtime AI, SQL Server installation automation, or database restoration automation.
- Impact analysis still matches the actual changed files.
- Graph regeneration decision was followed.
- Understand output did not override SSOT or source evidence.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Missing verification, if any

## Code Results

Implemented.

Changed files:

- Added `scripts/build-student-tester-package.ps1`.
- Added `Start-SequelDetective.cmd`.
- Added `scripts/start-student-package.ps1`.
- Added `docs/09-release-readiness/student-tester-package.md`.
- Added `docs/09-release-readiness/student-install-and-run-guide.md`.
- Added root `package:student` script in `package.json`.
- Updated `docs/09-release-readiness/README.md` to list the student package guide.
- Updated `RUNNING-SEQUEL-DETECTIVE.md` to point instructors to the student package workflow and students to the handout.
- Updated this WP with completion evidence.

Package artifact created during verification:

- `C:\Users\cburk\AppData\Local\Temp\SequelCityWebStudentPackages\sequel-detective-student-tester-20260704-110559.zip`

Verification:

- `npm run package:student` passed after adding the package script itself to the artifact.
- `Start-SequelDetective.cmd` and `scripts/start-student-package.ps1` were added so students can extract the zip and double-click one launcher.
- Archive inspection confirmed `docs/09-release-readiness/student-install-and-run-guide.md` and `docs/09-release-readiness/student-tester-package.md` are present.
- Archive inspection confirmed `Start-SequelDetective.cmd` and `scripts/start-student-package.ps1` are present.
- Archive inspection found zero entries matching `.git`, `node_modules`, `apps/api/.env`, `dist`, `coverage`, `test-results`, or `.log`.
- `npm run build` passed.
- `npm run test --workspace apps/api` passed. Existing Node module-type warnings were emitted but did not fail tests.
- `npm run test --workspace apps/web` passed with 14 files and 179 tests.

Scope note:

- `npm run build` regenerated tracked API `dist` files. Those generated changes were restored because `apps/api/dist` is outside the WP-162 allowed file set.

## Audit Results

Self-audit PASS.

- The package script creates a fresh archive under the temp package output path.
- The package includes the student launcher, package startup script, database SQL files, app source, workspace package files, and student-facing install/run docs.
- The package excludes `.git`, `node_modules`, `apps/api/.env`, build output, coverage, test output, and local logs.
- Documentation keeps the scope to local pilot testing and does not claim production hosting, runtime AI, SQL Server installation automation, or database restoration automation.
- No application runtime source files were changed for WP-162.
- Generated package artifacts were not committed.

## Final Decision

Accepted for implementation.
