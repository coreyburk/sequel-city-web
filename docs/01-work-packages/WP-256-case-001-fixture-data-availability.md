# WP-256 - Case 001 Fixture Data Availability

## Objective

Make the public Case 001 clocktower `CrimeSceneReport` row reliably available to the local live-stack first SQL smoke path through a scoped, repeatable database data path, while keeping Case 001 gated and unreleased.

## Scope

### In Scope

- Add a narrow, idempotent database data migration for the public Case 001 clocktower incident report row:
  - `CrimeID = 1080`
  - `ReportDate = 20230502`
  - `ReportCity = 'Sequel City'`
  - `ReportDescription` containing the existing public clocktower ceremony wording from the base insert script.
- Keep fresh database builds and migrated existing databases aligned by updating only the migration ledger stamping required for the new migration key.
- Add or update focused tests that prove the migration/version contract handles the new migration key without weakening bootstrap readiness.
- Update the Case 001 live-stack testing docs only as needed to describe the fixture availability path and rerun order.
- Rerun the opt-in Case 001 live smoke after restarting the API from current source and applying pending migrations when local API/database prerequisites are available; record any remaining blocker exactly.
- Refresh tracked Understand graph artifacts after implementation because this package changes database structure/version surfaces.

### Out of Scope

- No Case 001 release unlock.
- No new Case 001 gameplay, milestones, clue progression, persistence, evidence board behavior, investigation threads, suspect verification, Query Lab rendering, or UI copy beyond existing live-smoke/runbook blocker guidance.
- No answer-key rows, suspect names, hidden solution data, restricted-table exposure, or runtime AI.
- No schema redesign, table creation, column changes, foreign-key changes, stored procedures, or broad database rebuild changes.
- No package dependency or lockfile changes.
- No Case 004 behavior changes.
- No changes to frontend runtime Case 001 module code or API-client code.

## Impact Analysis

### Understand Status

- Graph available: Yes, `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` exist.
- Baseline commit: `9c604e50aed27c285f55dddc46d4e16cd38af09f`, from `.understand-anything/meta.json`.
- Freshness assessment: Usable with non-structural closeout drift. Current `HEAD` during planning is `9ae0803`; the only accepted commit after the graph baseline is WP-255 closeout, which committed the already-refreshed graph artifacts, route-level test coverage, live-smoke/docs guidance, WP record, and handoff refresh. Source inspection remains authoritative for database and smoke scope.
- Analysis performed: Verified clean `main` aligned with `origin/main`, confirmed WP-256 as the next package number, inspected graph metadata and targeted graph hits for `databaseMigrationService`, `databaseBootstrapService`, `databaseIdentityService`, `CrimeSceneReport`, `case-001-live-smoke.spec.ts`, and Case 001 validator/query metadata surfaces, then verified all proposed files against current source with `rg` and direct file reads. Confirmed the base insert script already contains the public clocktower row, while WP-255 recorded the currently running local database/API returned `rowCount: 0` for the exact fixture query.

### Affected Architecture

- Layers: SQL Server data migrations, database bootstrap/version readiness, database identity tests, local runtime test documentation, opt-in Case 001 live-stack smoke.
- Primary files/components:
  - `database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`
  - `database/03-SequelCityCrimesDB - ForeignKeys.sql`
  - `apps/api/src/services/databaseBootstrapService.test.ts`
  - `apps/api/src/services/databaseIdentityService.test.ts`
  - `apps/api/src/services/databaseMetadataService.test.ts`
  - `apps/api/src/routes/healthRoutes.test.ts`
  - `apps/api/src/routes/adminRoutes.test.ts`
  - `apps/web/tests/browser/case-001-live-smoke.spec.ts`
  - `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
  - `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- Upstream consumers: API startup/bootstrap readiness, Admin Mode upgrade path, `/api/health/full`, `/api/query/execute`, and the opt-in Case 001 live-stack smoke.
- Downstream dependencies: SQL Server `dbo.CrimeSceneReport`, `dbo.AppSchemaVersion`, migration runner ordering, Case 001 result-pattern validator, gated milestone metadata transport, and local browser smoke setup.

### Regression Surface

- Related tests: API bootstrap/identity/metadata/health/admin tests, Case 001 result-pattern/evaluator/query route/query execution tests, default Case 001 browser-smoke skip, opt-in Case 001 live-stack smoke when prerequisites are available, API build, and Understand readiness/refresh/readiness.
- User workflows: local developer/tester first-run or upgrade flow, Admin Mode Apply Required Upgrade, and gated Case 001 development smoke. Released Case 004 student play should remain unchanged.
- Security/data boundaries: The migration may insert only public, non-spoiler incident-report data into `dbo.CrimeSceneReport`; it must not expose answer keys, restricted tables, suspect identities, hidden validation details, or runtime AI behavior. Student query safety and restricted-table rules must remain unchanged.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: The planned package changes database migration/version assets and may update tests/docs connected to bootstrap and live smoke. The tracked Understand graph should be refreshed in the originating package so future planning sees the current database and Case 001 live-stack surfaces.

## Files Allowed to Change

Allowed:

- `database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`
- `database/03-SequelCityCrimesDB - ForeignKeys.sql`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseIdentityService.test.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/routes/adminRoutes.test.ts`
- `apps/web/tests/browser/case-001-live-smoke.spec.ts`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- `docs/01-work-packages/WP-256-case-001-fixture-data-availability.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Closeout-only allowance:

- `docs/00-ssot/END-OF-DAY-HANDOFF.md` may be modified only during accepted-WP closeout.

Do Not Modify:

- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `database/migrations/2026-05-21-001-create-case-answer-key-table.sql`
- `database/migrations/2026-05-21-002-seed-case-answer-key-case-004.sql`
- `database/migrations/2026-05-21-003-add-case-answer-key-foreign-key.sql`
- `database/migrations/2026-05-21-004-create-solution-verifier-user.sql`
- `database/migrations/2026-05-21-005-create-case-verification-objects.sql`
- `apps/api/src/services/databaseMigrationService.ts`
- `apps/api/src/services/databaseBootstrapService.ts`
- `apps/api/src/services/databaseIdentityService.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/routes/healthRoutes.ts`
- `apps/api/src/routes/adminRoutes.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/web/src/**`
- `apps/web/src/api/**`
- `apps/web/src/components/**`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCasePersistence.ts`
- `package.json`
- `package-lock.json`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/api/package-lock.json`
- `scripts/**`
- `.codex/**`

## Constraints

- Preserve existing behavior unless directly required to make the public Case 001 fixture row available through the current database upgrade path.
- Keep the migration idempotent and non-destructive.
- Do not change existing `ReportID` identity behavior or require a hard-coded `ReportID`.
- Do not delete, update, or reinterpret existing unrelated `CrimeSceneReport` rows.
- Do not mutate the base insert data script; it already contains the row for fresh rebuild content.
- Keep migration ledger changes limited to marking the new migration key for fresh builds.
- Do not add runtime UI, progression, persistence, release unlock, Query Lab rendering, suspect verification, answer-key data, or runtime AI.
- Do not weaken SQL safety, restricted-table blocking, bootstrap identity validation, or query history boundaries.
- If the local API/database cannot apply or verify the migration in this environment, record the exact blocker and keep deterministic tests/docs complete.

## Required Behavior

- Existing local databases that are missing the public Case 001 clocktower report row must be able to receive it by applying pending database migrations.
- Fresh databases built from the existing base scripts must remain version-aligned with the latest migration key after the final database script stamps `dbo.AppSchemaVersion`.
- The fixture insertion must be guarded by an existence check using the public row identity fields, not by a brittle identity `ReportID`.
- The inserted row must match the Case 001 result-pattern validator expectations without exposing spoiler or answer-key content.
- `/api/query/execute` with explicit enabled Case 001 metadata and the starter report query should return matched non-progressing milestone metadata after the API is restarted from current source and the fixture migration is applied.
- The default Case 001 browser smoke must remain skipped unless `CASE_001_LIVE_SMOKE=1`; the skeleton must remain gated by `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true`.

## Acceptance Criteria

- [ ] Add exactly one new idempotent migration file for the public Case 001 clocktower `CrimeSceneReport` row.
- [ ] Update fresh-build migration ledger stamping so fresh rebuilt databases are not left with the new data migration pending.
- [ ] Update focused migration/bootstrap/health/admin test fixtures only where needed for the new latest migration key.
- [ ] Preserve all Case 001 gate and unreleased behavior; no frontend runtime module or release gating file changes.
- [ ] Preserve absence of Query Lab rendering, persistence, suspect verification, answer-key exposure, restricted-table exposure, and runtime AI.
- [ ] Run `npm run test --workspace apps/api`.
- [ ] Run `npm run build --workspace apps/api`.
- [ ] Run `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` to verify default skip isolation still works.
- [ ] Run the opt-in Case 001 live-stack smoke after restarting the API from current source and applying pending migrations when local prerequisites are available, or record the exact blocker.
- [ ] Run a direct read-only local API/database probe proving the exact fixture query returns at least one matching public row after migration when local prerequisites are available, or record the exact blocker.
- [ ] Run Understand readiness/refresh/readiness:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- [ ] Run `git diff --check`.
- [ ] Run the relevant work-package status and validation-plan helper scripts.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-256 exactly as specified.

Start by reading:

- `docs/01-work-packages/WP-256-case-001-fixture-data-availability.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `database/03-SequelCityCrimesDB - ForeignKeys.sql`
- `apps/api/src/services/databaseMigrationService.ts`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseIdentityService.test.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/routes/adminRoutes.test.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/web/tests/browser/case-001-live-smoke.spec.ts`
- `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
- `docs/11-testing-strategy/local-runtime-test-scenarios.md`

Then:

1. Add `database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`.
2. Make the migration insert the public Case 001 clocktower `CrimeSceneReport` row only when no row already exists for `CrimeID = 1080`, `ReportDate = 20230502`, `ReportCity = 'Sequel City'`, and the public clocktower report description.
3. Update `database/03-SequelCityCrimesDB - ForeignKeys.sql` only as needed so fresh database builds stamp the new migration key in `dbo.AppSchemaVersion`.
4. Update focused API test fixtures only where needed to keep migration/bootstrap readiness expectations aligned with the new latest migration key.
5. Update live-smoke/runbook docs only if they need to name the apply-migration step or fixture-data blocker more precisely.
6. Do not change frontend runtime Case 001 module code, query API client code, backend query execution source, validator source, bootstrap source, or migration-runner source.
7. Restart the local API from current source before the opt-in live smoke if a stale API process is still running, and apply pending migrations through the existing bootstrap/admin path when local credentials permit. If local permissions block this, record the exact blocker.
8. Run:
   - `npm run test --workspace apps/api`
   - `npm run build --workspace apps/api`
   - `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`
   - the opt-in Case 001 live-stack smoke when prerequisites are available, or record the exact blocker
   - a direct read-only fixture probe when prerequisites are available, or record the exact blocker
   - Understand readiness/refresh/readiness
   - `git diff --check`
   - work-package status and validation-plan helper scripts
9. Record Code Results with changed files, fixture availability path, validation evidence, live-smoke pass/blocker, graph-refresh evidence, and scope check.

Scope:

- Only modify files listed under `Allowed:`.
- Keep Case 001 locked and unreleased.
- Keep the package focused on public fixture availability for the existing first SQL smoke path.

Return:

- Exact database/test/documentation changes.
- Validation commands and results.
- Live-stack smoke pass evidence or exact remaining blocker.
- Any deviations from the allowed file list or acceptance criteria.

## Audit Prompt

Audit WP-256 against the implemented changes with an adversarial stance.

Verify:

- Exactly one new migration was added and it is idempotent.
- The migration inserts only the public Case 001 clocktower `CrimeSceneReport` row and no spoiler, answer-key, restricted-table, suspect, or hidden solution data.
- Fresh database migration ledger stamping was updated only enough to keep rebuilt databases version-aligned with the new migration key.
- Existing migration runner/bootstrap source behavior was not changed.
- Test fixture updates are limited to the new latest migration key and do not mask bootstrap, identity, health, or admin readiness failures.
- Case 001 remains gated and unreleased by default.
- No frontend runtime module, Query Lab rendering, persistence, suspect verification, answer-key exposure, restricted-table exposure, package, lockfile, runtime AI, or Case 004 behavior was introduced.
- The opt-in live smoke either passes under available prerequisites or records the exact remaining blocker.
- Required validation and graph-refresh evidence is recorded.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:

- Verdict: PASS, FAIL, or BLOCKED.
- Scope compliance.
- Data/migration safety findings.
- Bootstrap/version compatibility findings.
- Case 001 gating and spoiler-boundary findings.
- Validation evidence and missing evidence.
- Drift risks or recommended follow-up.

## Code Results

Status: ImplementedNeedsAudit

Changed files:

- Added `database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`.
- Updated `database/03-SequelCityCrimesDB - ForeignKeys.sql`.
- Updated migration-key fixtures in:
  - `apps/api/src/services/databaseBootstrapService.test.ts`
  - `apps/api/src/services/databaseIdentityService.test.ts`
  - `apps/api/src/services/databaseMetadataService.test.ts`
  - `apps/api/src/routes/healthRoutes.test.ts`
  - `apps/api/src/routes/adminRoutes.test.ts`
- Updated fixture-blocker guidance in `apps/web/tests/browser/case-001-live-smoke.spec.ts`.
- Updated Case 001 live-stack runbook guidance in:
  - `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`
  - `docs/11-testing-strategy/local-runtime-test-scenarios.md`
- Refreshed tracked Understand graph artifacts:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`
- Updated this work-package record.

Fixture availability path:

- Added exactly one idempotent migration for the public Case 001 clocktower `CrimeSceneReport` row.
- The migration inserts only the existing public base-script row when no row already exists for `CrimeID = 1080`, `ReportDate = 20230502`, `ReportCity = 'Sequel City'`, and the public clocktower report description.
- The migration does not set or depend on `ReportID`; SQL Server identity behavior remains unchanged.
- Fresh database builds remain version-aligned by stamping `2026-08-14-001-seed-case-001-clocktower-report.sql` in `dbo.AppSchemaVersion` from the final database script.
- Existing databases receive the row through the existing pending-migration/bootstrap path.

Validation evidence:

- PASS: `npm run test --workspace apps/api` completed successfully.
- PASS: `npm run build --workspace apps/api` completed `tsc -p tsconfig.json`; generated `apps/api/dist` output was restored out of the WP diff.
- PASS: `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` completed with 1 skipped test because `CASE_001_LIVE_SMOKE` was not set.
- PASS: `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts` completed all focused bootstrap tests.
- PASS: `node --experimental-strip-types apps/api/src/services/databaseIdentityService.test.ts` completed all focused identity tests.
- PASS: `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts` completed all focused admin-route tests.
- PASS: Local current-source API was started on `http://127.0.0.1:3002`; startup reported `expectedMigrationKey = "2026-08-14-001-seed-case-001-clocktower-report.sql"`, `currentMigrationKey = "2026-08-14-001-seed-case-001-clocktower-report.sql"`, and `pendingMigrationCount = 0`.
- PASS: Direct read-only local API fixture probe against `http://127.0.0.1:3002/api/query/execute` with `SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City';` returned `success: true`, `rowCount: 1`, and `caseMilestoneEvaluation.matched: true`, `matchedRowCount: 1`, `runtimeStatus: "evaluated-no-progression"`, `milestoneAdvanced: false`.
- PASS: Opt-in live-stack smoke against the current-source API, `$env:CASE_001_LIVE_SMOKE = "1"; $env:VITE_ENABLE_CASE_001_PLAYABLE_SKELETON = "true"; $env:VITE_API_BASE_URL = "http://127.0.0.1:3002"; npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts`, completed with 1 passed.
- OBSERVED: The pre-existing API on `http://127.0.0.1:3001` reported the database upgraded and the exact fixture query returned `rowCount: 1`, but that process still omitted `caseMilestoneEvaluation`; the current-source API on port `3002` returned metadata correctly, confirming the remaining `3001` issue is stale runtime rather than fixture data availability.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before graph refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=632`, graph assembly `nodes=1011`, `edges=379`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 632 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after graph refresh reported `READY`.
- PASS: `git diff --check` completed with no whitespace errors; output included only expected Windows line-ending warnings.

Scope check:

- No frontend runtime module, release gate, API client, query execution source, validator source, bootstrap source, migration runner source, package, lockfile, answer-key, restricted-table, suspect-verification, persistence, Query Lab rendering, runtime AI, or Case 004 behavior was modified.
- The temporary current-source API process on port `3002` was stopped after the live-stack smoke completed.

## Audit Results

### Audit Report: WP-256 ΓÇö Case 001 Fixture Data Availability

**Verdict:** **PASS**

---

### Scope Compliance

| Audit Area | Status | Evidence & Notes |
| :--- | :---: | :--- |
| **Package Boundary** | **PASS** | WP-256 scope was strictly adhered to. Changes provide the public Case 001 clocktower report row via a standalone idempotent migration without introducing progression, persistence, gameplay unlock, or runtime UI. |
| **Allowed Files List** | **PASS** | All modified and untracked files are within the [`WP-256`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-256-case-001-fixture-data-availability.md) `Allowed:` list:<br>ΓÇó [`database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql)<br>ΓÇó [`database/03-SequelCityCrimesDB - ForeignKeys.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/03-SequelCityCrimesDB%20-%20ForeignKeys.sql)<br>ΓÇó [`apps/api/src/services/databaseBootstrapService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseBootstrapService.test.ts)<br>ΓÇó [`apps/api/src/services/databaseIdentityService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseIdentityService.test.ts)<br>ΓÇó [`apps/api/src/services/databaseMetadataService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMetadataService.test.ts)<br>ΓÇó [`apps/api/src/routes/healthRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/healthRoutes.test.ts)<br>ΓÇó [`apps/api/src/routes/adminRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/adminRoutes.test.ts)<br>ΓÇó [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts)<br>ΓÇó [`docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-Browser-Test-Guide.md)<br>ΓÇó [`docs/11-testing-strategy/local-runtime-test-scenarios.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/11-testing-strategy/local-runtime-test-scenarios.md)<br>ΓÇó [`docs/01-work-packages/WP-256-case-001-fixture-data-availability.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-256-case-001-fixture-data-availability.md)<br>ΓÇó Tracked Understand artifacts (`.understand-anything/*`). |
| **`Do Not Modify:` Boundaries** | **PASS** | Zero protected files were touched. Base database scripts ([`01-SequelCityCrimesDB - Create DB.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/01-SequelCityCrimesDB%20-%20Create%20DB.sql), [`02-SequelCityCrimesDB - Insert Data.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/02-SequelCityCrimesDB%20-%20Insert%20Data.sql)), previous migrations, backend services ([`databaseMigrationService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMigrationService.ts), [`databaseBootstrapService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseBootstrapService.ts), [`databaseIdentityService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseIdentityService.ts), [`databaseMetadataService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMetadataService.ts), [`queryExecutionService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts), [`case001GatedMilestoneEvaluationService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/case001GatedMilestoneEvaluationService.ts), [`case001ResultPatternService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/case001ResultPatternService.ts)), backend routes ([`healthRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/healthRoutes.ts), [`adminRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/adminRoutes.ts), [`queryRoutes.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts)), frontend runtime files ([`apps/web/src/**`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src)), and package/lockfiles remained untouched. |
| **Dirty File Check** | **PASS** | [`scripts/get-work-package-status.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1) confirms `Out-of-scope dirty files: none`. |

---

### Data / Migration Safety Findings

- **Exactly One New Migration:** Added [`database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql). No other migration files were added or modified.
- **Idempotency & Safety:** The migration inserts the row conditionally using `IF NOT EXISTS (SELECT 1 FROM dbo.CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City' AND ReportDescription = '...')`. Repeated runs or runs on databases built from base scripts that already contain the record execute as safe no-ops without error.
- **SQL Server Identity Column Handling:** The migration does not supply or override `ReportID`, preserving database auto-increment identity generation and preventing `IDENTITY_INSERT` errors or key collisions.
- **No Solution / Answer Key / Restricted Data:** The row contains strictly public incident-report information matching the starter scenario. It inserts no records into `dbo.CaseAnswerKey`, `dbo.Solution`, or any restricted student table, and mentions no suspects or hidden solution answers.

---

### Bootstrap / Version Compatibility Findings

- **Fresh Build Alignment:** [`database/03-SequelCityCrimesDB - ForeignKeys.sql`](file:///D:/GitHub-Repos/SequelCityWeb/database/03-SequelCityCrimesDB%20-%20ForeignKeys.sql) was updated only in the `MERGE dbo.AppSchemaVersion` block to register `2026-08-14-001-seed-case-001-clocktower-report.sql`. Rebuilt databases from base scripts are version-stamped accurately with 0 pending migrations.
- **Existing Database Upgrade Path:** Migration discovery in [`databaseMigrationService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMigrationService.ts) automatically discovers and applies `2026-08-14-001-seed-case-001-clocktower-report.sql` in alphanumeric sequence.
- **Bootstrap / Runner Behavior Unaltered:** [`databaseMigrationService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMigrationService.ts) and [`databaseBootstrapService.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseBootstrapService.ts) source logic was not modified.
- **Fixture Update Integrity:** Test fixtures in [`databaseBootstrapService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseBootstrapService.test.ts), [`databaseIdentityService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseIdentityService.test.ts), [`databaseMetadataService.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMetadataService.test.ts), [`healthRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/healthRoutes.test.ts), and [`adminRoutes.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/adminRoutes.test.ts) were updated solely to reflect the new latest migration key. All failure scenarios (degraded state HTTP 503, invalid identity, missing table, unapplied upgrade HTTP 409) remain strictly asserted and unmasked.

---

### Case 001 Gating & Spoiler-Boundary Findings

- **Default Lock & Skeleton Isolation:** Case 001 remains unreleased and gated. Frontend execution requires both `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true` and `CASE_001_LIVE_SMOKE=1`.
- **Smoke Isolation:** [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/case-001-live-smoke.spec.ts) skips cleanly by default during browser test runs.
- **Zero Frontend Runtime Drift:** No frontend runtime code ([`apps/web/src/**`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src)), Query Lab rendering, clue tracker, suspect verification, persistence, or runtime AI code was added or modified.
- **Case 004 Isolation:** No changes to Case 004 data, verifications, or flows.

---

### Validation Evidence & Missing Evidence

| Verification Step | Result |
| :--- | :--- |
| `npm run test --workspace apps/api` | **PASS** (31 test suites passed) |
| `npm run build --workspace apps/api` | **PASS** (`tsc -p tsconfig.json` clean; generated `dist` restored) |
| `npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts` (Default isolation) | **PASS** (1 test skipped) |
| `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts` | **PASS** (9 tests passed) |
| `node --experimental-strip-types apps/api/src/services/databaseIdentityService.test.ts` | **PASS** (5 tests passed) |
| `node --experimental-strip-types apps/api/src/services/databaseMetadataService.test.ts` | **PASS** (4 tests passed) |
| `node --experimental-strip-types apps/api/src/routes/healthRoutes.test.ts` | **PASS** (4 tests passed) |
| `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts` | **PASS** (3 tests passed) |
| Live API fixture probe against current-source API (`http://127.0.0.1:3002/api/query/execute`) | **PASS** (`success: true`, `rowCount: 1`, `caseMilestoneEvaluation.matched: true`, `runtimeStatus: "evaluated-no-progression"`, `milestoneAdvanced: false`) |
| Opt-in live smoke command (`CASE_001_LIVE_SMOKE=1`, `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true`) | **PASS** (1 passed against current-source API) |
| Diagnostic recorded for stale API instance (`http://127.0.0.1:3001`) | **OBSERVED** (Stale API process lacked recent metadata transport; current-source API restart resolved it) |
| `powershell -File scripts/check-understand-refresh-readiness.ps1` (Pre-refresh) | **PASS** (`READY`) |
| `powershell -File scripts/refresh-understand-graph.ps1` | **PASS** (`filesScanned=632`, `nodes=1011`, `edges=379`, `layers=6`, `tourSteps=7`) |
| `powershell -File scripts/check-understand-refresh-readiness.ps1` (Post-refresh) | **PASS** (`READY`) |
| `git diff --check` | **PASS** (No whitespace errors) |
| `powershell -File scripts/get-work-package-status.ps1 docs/01-work-packages/WP-256-case-001-fixture-data-availability.md` | **PASS** (`AuditedNeedsFinalDecision`, 0 out-of-scope dirty files) |
| `powershell -File scripts/get-work-package-validation-plan.ps1 docs/01-work-packages/WP-256-case-001-fixture-data-availability.md` | **PASS** (`ValidationEvidenceRecorded`, `Blocks audit readiness: False`) |
| `powershell -File scripts/check-work-package-closeout.ps1 docs/01-work-packages/WP-256-case-001-fixture-data-availability.md` | **PASS** (`ReadyForAcceptance`) |
| **Missing Evidence** | **None** |

---

### Drift Risks & Recommended Follow-up

1. **Closeout:** [`WP-256`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-256-case-001-fixture-data-availability.md) has recorded Audit Results and is in `ReadyForAcceptance`. Upon human decision, finalize the work package and record the handoff entry in [`docs/00-ssot/END-OF-DAY-HANDOFF.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/END-OF-DAY-HANDOFF.md).
2. **Local Environment Runbook:** When running live-stack playthrough smoke tests locally, ensure any existing background API process on port 3001 is stopped and restarted from current source so it picks up both the new database migration and metadata evaluation transport.

## Final Decision

Accepted on 2026-08-14 after audit PASS and human closeout request. WP-256 is approved for closeout because it added the scoped idempotent public Case 001 `CrimeSceneReport` fixture migration, aligned fresh-build migration stamping and version fixtures, proved the current-source live stack returns the fixture plus non-progressing metadata, refreshed Understand graph artifacts, and preserved the Case 001 locked/unreleased boundary with no gameplay, persistence, Query Lab, suspect verification, answer-key, restricted-table, package, lockfile, or runtime AI changes.

