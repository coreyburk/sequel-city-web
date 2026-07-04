# Database Identity Verification And Gated Rebuild Bootstrap

## Objective

Ensure the local bootstrap process does not treat any database named `SequelCityCrimesDB` as valid unless it matches the expected Sequel Detective schema, seed data, and migration state, and provide an explicitly gated rebuild path when the database is missing or invalid.

## Scope

### In Scope

- Add deterministic database identity validation to startup/bootstrap readiness.
- Validate more than the database name:
  - required core tables exist
  - expected row counts or sentinel rows exist for seeded tables
  - Case 004 answer-key rows exist
  - expected migration key is present
  - expected verification procedure/objects exist
- Expose invalid database identity as a degraded bootstrap state in health/admin responses.
- Add or update tests for valid, missing, stale, and wrong-database identity states.
- Add an explicitly gated rebuild mode/action that can run the full database scripts in order:
  - `database/01-SequelCityCrimesDB - Create DB.sql`
  - `database/02-SequelCityCrimesDB - Insert Data.sql`
  - `database/03-SequelCityCrimesDB - ForeignKeys.sql`
- Wire the student launcher to request the rebuild only when the instructor/student explicitly opts in.
- Update local package/student docs to explain that database rebuild is destructive and should only be used for the local classroom test database.

### Out of Scope

- No silent or default drop/recreate behavior.
- No destructive rebuild through learner Query Lab.
- No broad production installer or SQL Server installer.
- No changes to Case 004 progression, clue logic, final verdict logic, or UI reward behavior.
- No database data changes unless a minimal version/identity marker is required by this work package.
- No runtime AI or external service dependency.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`.
- Freshness assessment: Structurally stale for the current worktree. Later commits changed student-mode UI, package scripts/docs, root `package.json`, and there are uncommitted WP-162 packaging changes. The graph still identifies the relevant backend bootstrap, migration, health, metadata, and HealthStatus relationships, but source inspection is authoritative for WP-163.
- Analysis performed: Required-tier analysis using graph search for `databaseBootstrapService`, `databaseMigrationService`, `databaseMetadataService`, `healthRoutes`, `HealthStatus`, and `AppSchemaVersion`; direct source inspection of bootstrap/migration/health/admin services and tests; direct database script inspection for create/drop, seed counts, CaseAnswerKey seeding, and migration stamping.

### Affected Architecture

- Layers:
  - API bootstrap/application layer
  - API health/admin routes
  - database script/bootstrap assets
  - student package launcher/docs
  - frontend health display if new status fields must be surfaced
- Primary files/components:
  - `apps/api/src/services/databaseBootstrapService.ts`
  - `apps/api/src/services/databaseMigrationService.ts`
  - new `apps/api/src/services/databaseIdentityService.ts` if separation keeps bootstrap readable
  - `apps/api/src/services/databaseBootstrapService.test.ts`
  - new `apps/api/src/services/databaseIdentityService.test.ts` if a new service is added
  - `apps/api/src/services/databaseMetadataService.ts`
  - `apps/api/src/services/databaseMetadataService.test.ts`
  - `apps/api/src/routes/adminRoutes.ts`
  - `apps/api/src/routes/adminRoutes.test.ts`
  - `apps/api/src/routes/healthRoutes.test.ts`
  - `apps/api/src/types/database.ts`
  - `apps/web/src/components/HealthStatus.tsx`
  - `apps/web/src/components/HealthStatus.test.tsx`
  - `scripts/start-student-package.ps1`
  - `Start-SequelDetective.cmd` if launcher messaging changes
  - `docs/09-release-readiness/student-install-and-run-guide.md`
  - `docs/09-release-readiness/student-tester-package.md`
- Upstream consumers:
  - API startup in `apps/api/src/app.ts`
  - health endpoint `GET /api/health/full`
  - admin endpoint `POST /api/admin/bootstrap/apply`
  - student package launcher
  - instructor/student pilot setup workflow
- Downstream dependencies:
  - local SQL Server connection
  - database scripts under `database/`
  - migration key loading from `database/migrations`
  - frontend Health Status rendering

### Regression Surface

- Related tests:
  - `npm run test --workspace apps/api`
  - `npm run test --workspace apps/web`
  - focused API tests for bootstrap identity states
  - focused frontend tests for invalid database guidance if UI text changes
  - `npm run package:student`
  - PowerShell parser checks for changed launcher/package scripts
- User workflows:
  - student launches packaged app
  - app connects to missing database
  - app connects to database with correct name but wrong schema/data
  - app connects to stale Sequel City database with missing migrations
  - instructor/student explicitly chooses to rebuild local classroom database
  - Admin Mode applies non-destructive migrations
- Security/data boundaries:
  - Destructive rebuild must be impossible through learner Query Lab.
  - Destructive rebuild must require explicit environment flag, launcher prompt, or admin endpoint/action named for rebuild/reset.
  - Health responses may report identity status but must not expose answer-key details.
  - Rebuild must not package or log SQL credentials.
  - SQL safety rules for learner-submitted SQL remain unchanged.

### Graph Update Decision

- Regeneration required: Yes after implementation.
- Rationale: WP-163 changes backend bootstrap structure, database readiness semantics, API response types, package launcher behavior, and potentially frontend health display. The Understand graph should be refreshed after implementation and verification.

## Files Allowed to Change

Allowed:

- `apps/api/src/services/databaseBootstrapService.ts`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseMigrationService.ts`
- `apps/api/src/services/databaseIdentityService.ts`
- `apps/api/src/services/databaseIdentityService.test.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/routes/adminRoutes.ts`
- `apps/api/src/routes/adminRoutes.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/types/database.ts`
- `apps/web/src/components/HealthStatus.tsx`
- `apps/web/src/components/HealthStatus.test.tsx`
- `scripts/start-student-package.ps1`
- `scripts/build-student-tester-package.ps1`
- `Start-SequelDetective.cmd`
- `docs/09-release-readiness/student-install-and-run-guide.md`
- `docs/09-release-readiness/student-tester-package.md`
- `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`

Do Not Modify:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/tests/**`
- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `database/migrations/**`
- `docs/01-work-packages/WP-162-student-tester-package-and-bootstrap-distribution.md`
- `.understand-anything/**` until implementation is complete and a graph refresh is explicitly performed

## Constraints

- Do not silently drop or recreate any database.
- Destructive rebuild must be explicit, visibly named, and gated.
- Default startup must verify and degrade on invalid database identity.
- Migration-only upgrade behavior must continue to work for a valid but stale Sequel City database.
- Wrong database identity must not be “fixed” by applying migrations alone.
- Learner SQL safety remains SELECT-only.
- Do not expose full answer keys or spoiler data in diagnostics.
- Preserve local-first operation and no runtime AI.
- Keep WP-162 uncommitted packaging changes intact; do not revert or rewrite them.

## Required Behavior

- Add a deterministic database identity check.
- The identity check must return structured status such as:
  - `ready`
  - `missing`
  - `invalid`
  - `stale`
- The check must validate concrete database facts, not just `DB_NAME()`:
  - required table list
  - expected seed-data row counts or sentinel data points
  - Case 004 answer-key presence by role/count, without exposing names or IDs to frontend
  - current migration key
  - verification procedure/object presence
- Bootstrap readiness must be false when identity is missing or invalid.
- Bootstrap messages must clearly distinguish:
  - cannot connect
  - database missing
  - database name exists but contents are not Sequel Detective
  - valid database needs migrations
  - valid database is ready
- Existing `apply` behavior must only apply migrations to a valid identity/stale database.
- Add an explicitly gated rebuild function/path that:
  - runs the three full database scripts in order
  - requires bootstrap/admin authority
  - is not invoked by default startup
  - returns a structured success/failure result
  - leaves health ready only after identity and migration checks pass
- Launcher update:
  - when health/bootstrap says database is missing or invalid, prompt whether to rebuild the local classroom database
  - default answer must be non-destructive
  - if the user opts in, invoke the gated rebuild path or script
- Docs update:
  - explain the version/identity check
  - explain that rebuild drops and recreates `SequelCityCrimesDB`
  - tell students to use rebuild only when instructed or on the dedicated local test database

## Acceptance Criteria

- [ ] A database named `SequelCityCrimesDB` with missing required tables is reported as invalid/degraded, not ready.
- [ ] A database named `SequelCityCrimesDB` with required tables but missing expected seed identity is reported as invalid/degraded, not ready.
- [ ] A valid seeded database with missing migrations is reported as stale/degraded and can use the existing migration apply path.
- [ ] A valid seeded database with all migrations is reported as ready.
- [ ] Migration apply does not run against an invalid or wrong database identity.
- [ ] Destructive rebuild is available only through an explicit gated path.
- [ ] Destructive rebuild is not triggered by default startup.
- [ ] Student launcher defaults to non-destructive behavior and only rebuilds after explicit user confirmation.
- [ ] Health/Admin response types and tests cover identity status.
- [ ] Frontend health display shows actionable guidance for invalid/missing database identity without exposing spoilers.
- [ ] Student package docs explain the rebuild boundary.
- [ ] `npm run test --workspace apps/api` passes.
- [ ] `npm run test --workspace apps/web` passes.
- [ ] `npm run package:student` passes.
- [ ] Changed files remain inside the allowed list.

## Code Prompt

Implement WP-163 exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Treat `Do Not Modify` entries as read-only references.
- Preserve all uncommitted WP-162 packaging changes unless a listed file needs a compatible update.

Implementation guidance:

- Prefer a new `databaseIdentityService.ts` if it keeps identity checks separate from migration application.
- Use parameterized SQL or static internal SQL only.
- Do not expose answer IDs, names, or answer-key contents in API health responses.
- Keep destructive rebuild behind an explicit action/flag. Do not run it automatically during startup.
- Consider a new admin route for rebuild only if the existing apply endpoint cannot safely express destructive reset semantics.
- If a route is added, name it clearly enough that callers cannot confuse it with a non-destructive migration apply.
- The full rebuild path may execute the existing SQL scripts, but it must be clear that the create script drops `SequelCityCrimesDB`.

Verification:

- Run `npm run test --workspace apps/api`.
- Run `npm run test --workspace apps/web`.
- Run `npm run package:student`.
- Run PowerShell syntax checks for changed scripts.

Return:

- Exact changed files.
- Verification results.
- Any manual SQL Server validation that could not be performed in the local environment.

## Audit Prompt

Audit WP-163.

Verify:

- No silent destructive database operation exists.
- Rebuild/reset is explicitly gated and visibly destructive.
- Invalid database identity cannot be marked ready by database name alone.
- Migration apply cannot run against wrong database identity.
- Health/Admin responses are actionable and spoiler-safe.
- Student launcher behavior defaults to non-destructive.
- Tests cover ready, stale, missing, invalid, migration apply, and rebuild gating.
- Docs accurately state version/identity and rebuild boundaries.
- No files outside allowed scope changed.
- Graph regeneration decision is followed after implementation.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Data-loss risks
- Missing verification, if any

## Code Results

Pending.

## Audit Results

Pending.

## Final Decision

Pending.
