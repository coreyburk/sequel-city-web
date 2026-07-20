# Database Identity Validation Health Status

## Objective

Add deterministic database identity validation to Sequel Detective health/admin readiness so a database with the expected name but wrong or incomplete contents is reported as degraded and cannot receive migration-only upgrade actions.

## Scope

### In Scope

- Add a backend database identity validation service or equivalent focused helper.
- Validate connected database identity using concrete schema/object/data facts, not `DB_NAME()` alone.
- Surface identity status through bootstrap, full health, and admin apply responses.
- Block migration apply when identity is `missing` or `invalid`.
- Keep valid-but-stale databases eligible for the existing non-destructive migration apply path.
- Update API and frontend health response types.
- Update Health Status UI only enough to show actionable missing/invalid/stale identity guidance.
- Add focused API and frontend tests for ready, stale, missing, and invalid identity states.

### Out of Scope

- Destructive rebuild/drop/create orchestration.
- New admin reset/rebuild routes.
- Launcher behavior or account provisioning changes.
- Database SQL script changes, seed changes, migration changes, or manual SQL execution.
- Case 004 progression, clue, solution, or reward behavior changes.
- SQL safety rule changes.
- Package generation changes.
- New dependencies, runtime AI, external services, OpenAI Agents SDK, or AGY runner integration.
- Understand graph regeneration in this planning package.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Usable with non-structural drift for planning. Later commits changed workflow documentation, repo-local skills, handoff notes, release-readiness notes, and graph metadata. They do not materially change the API database bootstrap, health, admin, or frontend Health Status surfaces inspected for this package.
- Analysis performed: Required-tier planning with direct source verification. Reviewed `WP-163`, `WP-171`, SSOT development workflow, work-package lifecycle, Understand guidance, `databaseBootstrapService`, `databaseMetadataService`, `healthRoutes`, `adminRoutes`, database response types, frontend health types/display/tests, database migration scripts, and database create/seed/foreign-key scripts for identity sentinel candidates.

### Affected Architecture

- Layers:
  - API database/bootstrap services
  - API health/admin routes
  - API/frontend response contracts
  - Admin Mode Health Status display
  - work-package governance
- Primary files/components:
  - `apps/api/src/services/databaseIdentityService.ts`
  - `apps/api/src/services/databaseIdentityService.test.ts`
  - `apps/api/src/services/databaseBootstrapService.ts`
  - `apps/api/src/services/databaseBootstrapService.test.ts`
  - `apps/api/src/services/databaseMetadataService.ts`
  - `apps/api/src/services/databaseMetadataService.test.ts`
  - `apps/api/src/routes/adminRoutes.ts`
  - `apps/api/src/routes/adminRoutes.test.ts`
  - `apps/api/src/routes/healthRoutes.test.ts`
  - `apps/api/src/types/database.ts`
  - `apps/web/src/api/types.ts`
  - `apps/web/src/components/HealthStatus.tsx`
  - `apps/web/src/components/HealthStatus.test.tsx`
- Upstream consumers:
  - API startup/bootstrap readiness
  - `GET /api/health/full`
  - `POST /api/admin/bootstrap/apply`
  - Admin Mode Health Status
  - student/instructor first-run validation workflow
- Downstream dependencies:
  - SQL Server connection pool
  - existing migration status service
  - schema metadata service
  - existing in-app migration apply behavior
  - future destructive rebuild/reset package, if separately approved

### Regression Surface

- Related tests:
  - `node --experimental-strip-types apps/api/src/services/databaseIdentityService.test.ts`
  - `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts`
  - `node --experimental-strip-types apps/api/src/services/databaseMetadataService.test.ts`
  - `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts`
  - `node --experimental-strip-types apps/api/src/routes/healthRoutes.test.ts`
  - `npm run test --workspace apps/web -- HealthStatus`
  - `npm run build`
- User workflows:
  - student/instructor starts app with correct seeded database
  - app connects to a database named `SequelCityCrimesDB` with missing required tables
  - app connects to a database named `SequelCityCrimesDB` with required tables but missing expected seed identity
  - app connects to a valid database missing migrations
  - Admin Mode applies non-destructive required upgrades
  - Admin Mode displays database/bootstrap/schema readiness
- Security/data boundaries:
  - Identity diagnostics must not expose answer names, person IDs, verdict text, or other spoiler content.
  - Learner Query Lab remains SELECT-only and unrelated.
  - Migration apply must not run against an invalid or wrong database identity.
  - No destructive action is introduced.
  - Runtime AI remains out of scope.

### Graph Update Decision

- Regeneration required: Yes after implementation, if accepted.
- Rationale: The planned implementation adds a new backend service and response-contract fields and updates health/admin/UI relationships. Those are structural source changes that should refresh the Understand graph after implementation and validation. Do not regenerate the graph while creating this planning WP.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-173-database-identity-validation-health-status.md
- apps/api/src/services/databaseIdentityService.ts
- apps/api/src/services/databaseIdentityService.test.ts
- apps/api/src/services/databaseBootstrapService.ts
- apps/api/src/services/databaseBootstrapService.test.ts
- apps/api/src/services/databaseMetadataService.ts
- apps/api/src/services/databaseMetadataService.test.ts
- apps/api/src/routes/adminRoutes.ts
- apps/api/src/routes/adminRoutes.test.ts
- apps/api/src/routes/healthRoutes.test.ts
- apps/api/src/types/database.ts
- apps/web/src/api/types.ts
- apps/web/src/components/HealthStatus.tsx
- apps/web/src/components/HealthStatus.test.tsx
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- database/**
- scripts/**
- apps/api/src/services/databaseMigrationService.ts
- apps/api/src/config/**
- apps/api/src/db/**
- apps/api/src/services/caseVerificationService.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/services/sqlSafetyService.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/studentCase.ts
- apps/web/tests/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md
- docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md
- docs/01-work-packages/WP-171-supersede-pending-database-bootstrap-plan.md

## Constraints

- Do not add destructive rebuild behavior.
- Do not add launcher/account provisioning behavior.
- Do not run SQL against a real local database during implementation unless the human explicitly asks for manual validation.
- Do not modify database scripts or migrations.
- Do not expose spoiler data in health/admin/frontend responses.
- Keep identity validation deterministic and backend-owned.
- Keep migration apply non-destructive and limited to valid identity states.
- Preserve the existing `WP-165` account-provisioning path.
- Preserve local-first operation and no runtime AI.
- Treat Understand graph output as advisory; source, tests, and SSOT remain authoritative.

## Required Behavior

- Add structured database identity status with values:
  - `ready`
  - `stale`
  - `missing`
  - `invalid`
- Identity validation must distinguish:
  - unable to connect
  - connected to expected database with required identity facts present
  - database missing or unreachable
  - database name exists but required Sequel Detective schema/object facts are missing
  - valid Sequel Detective database that is missing migrations
- Validate concrete facts without relying on database name alone. Suggested checks:
  - required tables exist: `PersonsOfInterest`, `CrimeSceneReport`, `CrimeType`, `DriversLicense`, `EventSchedule`, `EventRegistration`, `Solution`, `AppSchemaVersion`, `CaseAnswerKey`
  - Case 004 answer-key aggregate has exactly the expected roles `trigger_man` and `mastermind`, without returning person IDs, names, or verdict text
  - verification object exists: `dbo.VerifySuspectSubmission`
  - migration status from existing `databaseMigrationService` is ready or stale
- Bootstrap readiness must be false for `missing` and `invalid` identity states.
- Existing migration apply must not run for `missing` or `invalid` identity states.
- Existing migration apply may run for `stale` identity when bootstrap authority is available.
- Full health response must include identity status and a user-actionable message.
- Admin apply response must preserve a safe failure shape when identity blocks migration apply.
- Health Status UI must show missing/invalid/stale guidance without offering a destructive rebuild action.
- Tests must cover ready, stale, missing, invalid, and migration-apply-blocked-by-identity states.

## Acceptance Criteria

- [x] A correctly seeded and migrated Sequel Detective database reports identity `ready`, bootstrap `ready`, and full health HTTP 200.
- [x] A valid seeded database with pending migrations reports identity `stale`, bootstrap `degraded`, and remains eligible for existing non-destructive migration apply when authority exists.
- [x] A database named `SequelCityCrimesDB` with missing required tables reports identity `invalid`, bootstrap `degraded`, and full health HTTP 503.
- [x] A database named `SequelCityCrimesDB` with required tables but missing expected Case 004 answer-key role aggregates reports identity `invalid`, not ready.
- [x] Missing/unreachable database state reports identity `missing` or preserves database connection failure while keeping bootstrap degraded.
- [x] `POST /api/admin/bootstrap/apply` does not run migrations when identity is `missing` or `invalid`.
- [x] Health/admin responses do not expose answer person IDs, suspect names, verdict text, or answer-key contents.
- [x] Health Status UI displays actionable identity guidance and does not offer any rebuild/reset action.
- [x] No launcher, account provisioning, destructive rebuild, database script, migration, SQL safety, package manifest, lockfile, dependency, or runtime AI changes occur.
- [x] Focused API and frontend tests pass.
- [x] `npm run build` passes.
- [ ] Understand graph is regenerated after implementation and committed only if validation succeeds.

## Code Prompt

Implement WP-173 exactly as scoped.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Treat `Do Not Modify` entries as read-only references.
- Do not implement destructive rebuild, launcher prompts, account provisioning, database script edits, dependency changes, or runtime AI.

Implementation guidance:

1. Add `databaseIdentityService.ts` unless a smaller local helper is clearly better.
2. Keep identity checks deterministic and spoiler-safe.
3. Return aggregate/missing-fact diagnostics only; never return answer names, person IDs, or verdict text.
4. Integrate identity status into `DatabaseBootstrapResult` and mapped health/admin bootstrap payloads.
5. Block migration apply before calling `applyPendingMigrations` when identity status is `missing` or `invalid`.
6. Preserve migration apply behavior for valid but stale databases.
7. Update frontend health response types and Health Status display only enough to surface identity guidance.
8. Update tests for the new response shapes and state handling.
9. Regenerate Understand graph after source/test validation because this package adds a backend service and response-contract relationships.

Verification:

- `node --experimental-strip-types apps/api/src/services/databaseIdentityService.test.ts`
- `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts`
- `node --experimental-strip-types apps/api/src/services/databaseMetadataService.test.ts`
- `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts`
- `node --experimental-strip-types apps/api/src/routes/healthRoutes.test.ts`
- `npm run test --workspace apps/web -- HealthStatus`
- `npm run build`
- Understand graph regeneration and validation

Return:

- exact files changed
- identity states implemented
- verification results
- whether any manual SQL Server validation was skipped
- graph regeneration result

## Audit Prompt

Use `sequel-city-audit-runner-contracts` for the audit contract, then audit WP-173.

Verify:

- Changed files are limited to the allowed list.
- Identity validation checks concrete database facts and does not rely on database name alone.
- Missing/invalid identity states degrade health and block migration apply.
- Stale but valid identity preserves the existing non-destructive migration path.
- No destructive rebuild/reset/launcher/account-provisioning behavior was added.
- Health/admin/frontend responses are actionable and spoiler-safe.
- Tests cover ready, stale, missing, invalid, and migration-blocked-by-identity states.
- No database scripts, migrations, SQL safety rules, package manifests, lockfiles, dependencies, or runtime AI boundaries changed.
- Understand graph regeneration was performed after implementation.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Identity-state defects
- Data-loss/destructive-action risks
- Spoiler or authority-boundary risks
- Missing tests or graph work
- Recommended corrections

## Code Results

Implemented.

### Files Changed

- `docs/01-work-packages/WP-173-database-identity-validation-health-status.md`
- `apps/api/src/services/databaseIdentityService.ts`
- `apps/api/src/services/databaseIdentityService.test.ts`
- `apps/api/src/services/databaseBootstrapService.ts`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/routes/adminRoutes.ts`
- `apps/api/src/routes/adminRoutes.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/types/database.ts`
- `apps/web/src/api/types.ts`
- `apps/web/src/components/HealthStatus.tsx`
- `apps/web/src/components/HealthStatus.test.tsx`

### Implementation Summary

- Added `databaseIdentityService.ts` with deterministic identity states: `ready`, `stale`, `missing`, and `invalid`.
- Validates concrete database facts through required table checks, required verification procedure checks, and a spoiler-safe Case 004 answer-key role aggregate check.
- Uses migration status as an input so valid databases with pending migrations report identity `stale` and remain eligible for the existing non-destructive migration apply path.
- Treats missing/unreachable database connection states as identity `missing` and returns degraded bootstrap state instead of throwing away the health payload.
- Blocks `POST /api/admin/bootstrap/apply` before migration execution when identity is `missing` or `invalid`.
- Added identity status/message/missing facts to backend diagnostic bootstrap responses, admin apply success responses, and admin apply failure responses.
- Updated frontend health/admin API types and the Health Status display to show database identity guidance without adding rebuild, reset, launcher, provisioning, or destructive controls.
- Kept identity diagnostics spoiler-safe: no answer person IDs, suspect names, verdict text, or answer-key contents are returned.

### Verification

- PASS: `node --experimental-strip-types apps/api/src/services/databaseIdentityService.test.ts`
- PASS: `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts`
- PASS: `node --experimental-strip-types apps/api/src/services/databaseMetadataService.test.ts`
- PASS: `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts`
- PASS: `node --experimental-strip-types apps/api/src/routes/healthRoutes.test.ts`
- PASS: `npm run test --workspace apps/web -- HealthStatus`
- PASS: `npm run build`
- PASS with CRLF warnings only: `git diff --check`

Notes:

- Several API test commands still emit Node `MODULE_TYPELESS_PACKAGE_JSON` warnings. Package manifest changes are out of scope for WP-173, so this was not changed.
- Manual SQL Server validation was skipped because WP-173 prohibits real local SQL execution unless explicitly requested by the human.
- `npm run build` rewrote tracked `apps/api/dist/**` output; those generated changes were restored because `dist` is outside the WP-173 allowed file list.

### Understand Graph Result

Not completed in this implementation pass.

Attempted local Understand execution found no callable `understand` or `ua` command. The plugin-local `scan-project.mjs` script succeeded as a scan-only operation, but the full graph regeneration path was not cleanly available from the current Codex tool surface. Existing `.understand-anything/meta.json` also records `gitCommitHash` as `418990872a72e034197857ff383f74dfa575a90f`; regenerating before an accepted WP-173 commit would produce metadata that cannot honestly represent the final committed source state. No graph artifacts were modified.

Recommended handling: regenerate the Understand graph after WP-173 is accepted and committed, then commit the graph refresh separately or include it only if the finalization workflow can run graph generation against the accepted commit.

## Audit Results

BLOCKED AGY AUDIT plus SELF-AUDIT WARN.

AGY audit attempt:

- Auditor: AntiGravity CLI (`agy.exe`) attempted from `D:\GitHub-Repos\SequelCityWeb`.
- Invocation summary: non-interactive `agy --print` audit prompt against `docs/01-work-packages/WP-173-database-identity-validation-health-status.md` and the current uncommitted git diff.
- Result: BLOCKED.
- Blocker type: authentication plus approval/data-sharing policy.
- Details: the first local run found `agy.exe` but failed because the CLI was not logged into AntiGravity and timed out waiting for OAuth. A second run with workspace-local logging and escalation was requested because the first output also showed log/network access failures. Escalation was rejected because sending private uncommitted repository contents and diffs to the external AGY service was classified as unacceptable exfiltration risk.
- Workaround: none. No indirect AGY workaround was attempted.
- Audit status: no AGY verdict was produced; do not treat this as an independent audit pass.

Self-audit fallback:

Auditor: Codex self-audit fallback. AntiGravity was not run in this turn, so this is not an independent audit.

Scope check:

- Changed files are limited to the WP-173 allowed list.
- No `database/**`, `scripts/**`, migration service, database config, SQL safety, package manifest, lockfile, dependency, runtime AI, launcher, account-provisioning, rebuild, or reset files were changed.
- Generated `apps/api/dist/**` build output was restored and is not part of the final worktree.

Acceptance-criteria check:

- Ready, stale, missing, invalid, and migration-blocked-by-invalid-identity states are covered by focused API tests.
- Health/admin/frontend response shape changes are covered by focused route, metadata, admin, and Health Status tests.
- Identity validation checks concrete schema/object/data facts rather than database name alone.
- Stale but valid identity preserves the existing non-destructive migration path.
- Missing/invalid identity degrades readiness and blocks migration apply before migrations run.
- Spoiler-safe boundary preserved; identity responses expose only status, messages, and missing fact labels.

Boundary check:

- No destructive rebuild/reset behavior added.
- No launcher or account provisioning behavior added.
- No runtime AI or dependency adoption added.
- No database scripts, migrations, SQL safety rules, package manifests, or lockfiles changed.

Unresolved limitation:

- Understand graph regeneration was not completed. This prevents a full audit PASS under WP-173 as written.
- This self-audit is not independent review and should not replace AntiGravity review if the work is accepted for behavioral/database-boundary risk.

Recommended correction:

- Before final acceptance or immediately after the accepted commit, run the current AntiGravity audit path and regenerate the Understand graph with tooling that can produce a clean graph/meta/fingerprint update for the accepted source state.

## Final Decision

Accepted.

Reason: Human instruction was given to move forward and commit the work despite the documented audit/tooling limitations. The implementation adds deterministic database identity validation, preserves the non-destructive migration path for valid stale databases, blocks migration apply for missing/invalid identity, keeps diagnostics spoiler-safe, and passes the focused API/frontend validation and build commands recorded above.

Accepted limitations:

- AntiGravity audit from Codex was blocked by authentication/approval/data-sharing constraints and no independent AGY verdict was produced for this package.
- Self-audit fallback is recorded as non-independent evidence, not as an AGY pass.
- Manual SQL Server validation was skipped because WP-173 prohibited real local SQL execution unless explicitly requested.
- Understand graph regeneration was not completed before this commit; it remains a follow-up after the accepted source state is committed.
