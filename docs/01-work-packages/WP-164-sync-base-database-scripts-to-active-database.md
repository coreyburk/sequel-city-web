# Sync Base Database Scripts To Active Database

## Objective

Make the base database SQL scripts reproduce the current active `SequelCityCrimesDB` database state so the scripts can become the future source of truth for student installs and bootstrap rebuilds.

## Scope

### In Scope

- Compare the active local `SequelCityCrimesDB` database against the base scripts.
- Update base SQL scripts where the active database is confirmed to be the current source of truth.
- Specifically resolve verified drift in:
  - `EventSchedule`
  - `EventRegistration`
- Preserve existing Case 004/current student flow data.
- Add a repeatable verification command or documented verification notes if practical.

### Out of Scope

- No application behavior changes.
- No bootstrap identity/rebuild implementation; that remains WP-163.
- No learner UI changes.
- No SQL Server installer.
- No destructive operation against the active database.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`.
- Freshness assessment: Structurally stale for the current worktree because WP-162 packaging changes and WP-163 planning are uncommitted, and recent commits changed student flow files after graph baseline. For this package, the graph is secondary because the affected source is database scripts and live SQL verification.
- Analysis performed: Required-tier database analysis. Direct source inspection of `database/01-SequelCityCrimesDB - Create DB.sql`, `database/02-SequelCityCrimesDB - Insert Data.sql`, and `database/03-SequelCityCrimesDB - ForeignKeys.sql`; active DB queries through local SQL Server; script tuple parsing for `EventSchedule` and `EventRegistration`; attempted temporary-database rebuild comparison.

### Affected Architecture

- Layers:
  - database source scripts
  - student package database assets
  - future bootstrap rebuild input
- Primary files/components:
  - `database/02-SequelCityCrimesDB - Insert Data.sql`
  - optionally `docs/09-release-readiness/student-tester-package.md` if verification notes are added
  - optionally `docs/01-work-packages/WP-164-sync-base-database-scripts-to-active-database.md`
- Upstream consumers:
  - student package build output
  - future WP-163 rebuild bootstrap
  - local SQL Server setup workflow
- Downstream dependencies:
  - Case 004 Symphony/EventRegistration flow
  - student walkthrough and guidance that depends on current EventIDs/person registrations

### Regression Surface

- Related tests:
  - non-destructive active DB row-count/sentinel verification
  - script tuple count verification for changed tables
  - optional temp database rebuild comparison when SQL admin credentials are available
  - `npm run package:student`
- User workflows:
  - fresh database created from scripts
  - student follows current Case 004 Symphony/EventRegistration path
  - future bootstrap rebuild uses base scripts
- Security/data boundaries:
  - Do not expose answer-key details in student docs.
  - Do not run destructive scripts against active database.
  - Do not commit local credentials or generated database artifacts.

### Graph Update Decision

- Regeneration required: No for this package alone.
- Rationale: Updating seed data in SQL scripts changes database assets but not application imports, runtime architecture, or TypeScript source structure. WP-163 will require graph regeneration after implementation because it changes bootstrap/runtime behavior.

## Verification Findings Before Implementation

- Full safe rebuild comparison was attempted by creating a temp database from scripts under a different name.
- That was blocked locally because:
  - Windows integrated auth failed with SSPI target-principal errors.
  - `sequel_bootstrap_user` can connect but lacks `CREATE DATABASE` permission in `master`.
- Non-destructive active DB checks succeeded enough to identify drift:
  - Active `CaseAnswerKey` has 2 Case 004 rows: 1 `trigger_man`, 1 `mastermind`, reveal orders 1 and 2.
  - Active migration keys match the five keys stamped by `database/03-SequelCityCrimesDB - ForeignKeys.sql`.
  - Most script-comment row counts match active DB.
  - `EventSchedule` and `EventRegistration` do not match the script counts/content.

Observed count drift:

| Table | Script rows | Active rows | Status |
|---|---:|---:|---|
| EventSchedule | 200 | 206 | DIFF |
| EventRegistration | 17,511 | 17,514 | DIFF |

Observed `EventSchedule` content drift:

Active-only rows:

- `2021-02-15 | Annual Symphony of Sweets Dessert Festival`
- `2021-05-12 | Symphony of the Heart`
- `2021-12-20 | Annual Winter Wonderland Symphony`
- `2022-04-30 | Springtime at the Symphony`
- `2022-06-13 | Birthday Celebration at the Symphony`
- `2022-09-22 | Falltime at the Symphony`
- `2022-12-09 | Skyline Symphony Showcase`
- `2022-12-15 | Neon Nights Symphony Delights`
- `2022-12-19 | Winter Wonderland Symphony`
- `2022-12-21 | Skyline Soundstage Showcase`
- `2023-12-02 | Winter Wonderland Ice Sculpture Showcase`
- `2023-12-22 | Holiday Cheer Christmas Concert`

Script-only rows:

- `2022-12-02 | Winter Wonderland Ice Sculpture Showcase`
- `2022-12-15 | Neon Nights Nosh Night`
- `2022-12-20 | Holiday Cheer Christmas Concert`
- `2023-05-07 | Skyline Symphony Showcase`
- `2023-09-26 | Springtime Serenade Symphony`
- `2023-12-21 | Skyline Soundstage Showcase`

Observed `EventRegistration` tuple drift:

Active-only tuples:

- `1021 | 14307`
- `1469 | 99716`
- `1909 | 14307`
- `2669 | 14307`
- `2669 | 99716`
- `2705 | 14307`
- `2705 | 99716`
- `2789 | 14307`
- `2789 | 99716`
- `3005 | 14307`
- `3005 | 99716`
- `3257 | 14307`
- `3257 | 99716`
- `8995 | 14307`
- `9267 | 14307`

Script-only tuples:

- `1021 | 54206`
- `1143 | 99716`
- `1143 | 99716`
- `1143 | 99716`
- `1811 | 88667`
- `1811 | 88966`
- `1909 | 17957`
- `2789 | 43662`
- `2789 | 55536`
- `5023 | 37055`
- `8995 | 50838`
- `9267 | 66535`

## Files Allowed to Change

Allowed:

- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `docs/01-work-packages/WP-164-sync-base-database-scripts-to-active-database.md`

Do Not Modify:

- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/03-SequelCityCrimesDB - ForeignKeys.sql`
- `database/migrations/**`
- `apps/**`
- `docs/01-work-packages/WP-162-student-tester-package-and-bootstrap-distribution.md`
- `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`

## Constraints

- Treat the active database as current source of truth for this sync.
- Do not run destructive scripts against the active database.
- Preserve all uncommitted WP-162/WP-163 work.
- Keep changes focused on reproducing active database data.
- Do not alter answer-key semantics except to preserve active/current behavior.

## Required Behavior

- Update `database/02-SequelCityCrimesDB - Insert Data.sql` so a fresh script-created database contains the active database's current `EventSchedule` and `EventRegistration` data.
- Update script count comments for changed tables if needed.
- After update, re-run non-destructive tuple parsing and active DB comparison for changed tables.
- If an admin-capable SQL login becomes available, perform the stronger temp-database rebuild comparison.

## Acceptance Criteria

- [x] `EventSchedule` parsed from script matches active DB tuples exactly.
- [x] `EventRegistration` parsed from script matches active DB tuples exactly.
- [x] Script count comments for changed tables match active DB counts.
- [x] No application files changed by WP-164.
- [x] No destructive SQL was run against active `SequelCityCrimesDB`.
- [x] Any remaining inability to perform temp rebuild verification is documented with the exact permission blocker.

## Code Prompt

Implement WP-164 exactly as specified.

Scope:

- Only modify `database/02-SequelCityCrimesDB - Insert Data.sql` and this WP.
- Do not modify application code or other work packages.

Requirements:

- Use active database query results as source of truth.
- Update the EventSchedule insert block to match active database rows.
- Update EventRegistration insert tuples to match active database rows.
- Update row-count comments for changed tables.
- Keep SQL formatting consistent with the existing file.

Verification:

- Parse `EventSchedule` tuples from the script and compare to active DB.
- Parse `EventRegistration` tuples from the script and compare to active DB.
- Confirm active migration keys and Case 004 sentinel rows remain valid.
- Do not run the base create script against active DB.

Return:

- Exact changed rows/sections.
- Verification results.
- Any remaining full-rebuild verification blocker.

## Audit Prompt

Audit WP-164.

Verify:

- The script now matches active `EventSchedule` data.
- The script now matches active `EventRegistration` data.
- No unrelated database or app files changed.
- The active database was not dropped/recreated.
- The work does not conflict with WP-163's future gated rebuild plan.

Output:

- Verdict: PASS or FAIL
- Violations
- Data drift risks
- Missing verification, if any

## Code Results

Implemented.

Changed `database/02-SequelCityCrimesDB - Insert Data.sql` only in the active data drift areas:

- Replaced the `EventSchedule` seed block with the active database's 206 rows.
- Added explicit `EventID` seeding with `SET IDENTITY_INSERT EventSchedule ON/OFF` so fresh databases preserve the active identity values.
- Replaced the `EventRegistration` seed blocks with the active database's 17,514 rows.
- Added explicit `RegistrationID` seeding with `SET IDENTITY_INSERT EventRegistration ON/OFF` so fresh databases preserve the active identity values.
- Updated script count comments from `EventSchedule --200` to `--206` and from `EventRegistration --17,511` to `--17,514`.

Verification run after implementation:

| Check | Result |
|---|---:|
| Script `EventSchedule` rows | 206 |
| Active `EventSchedule` rows | 206 |
| `EventSchedule` tuple diff count | 0 |
| Script `EventRegistration` rows | 17,514 |
| Active `EventRegistration` rows | 17,514 |
| `EventRegistration` tuple diff count | 0 |
| Active migration sentinel rows | 5 |
| Case 004 answer roles | `trigger_man: 1`, `mastermind: 1` |

Full temporary database rebuild verification remains blocked locally:

- Windows integrated auth still fails with SSPI target-principal errors.
- The SQL login available to the application can connect to `SequelCityCrimesDB`, but does not have `CREATE DATABASE` permission in `master`, so it cannot create a disposable comparison database.

No destructive SQL was run against the active `SequelCityCrimesDB`.

## Audit Results

Self-audit PASS.

- Target table tuple comparisons pass with zero drift.
- Count comments match the active database counts.
- WP-164 did not modify application source files.
- The change does not alter WP-163's future gated rebuild plan; it gives that plan corrected base seed data to rebuild from.

## Final Decision

Accepted for implementation.
