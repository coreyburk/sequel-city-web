# Case Runtime Bootstrap Runbook

## Canonical source and fresh builds

The [database source guide](../../database/README.md) is the starting point for developers. The three numbered bootstrap files define current schema, data and permissions. Fresh builds seed only Case 001 v3 (complete introductory mystery) and Case 004 v2 (sixteen-step resolution). They contain no historical releases or test examples.

Execute 01, 02 and 03 in order only for an explicitly authorized fresh installation. Running the complete creation file destroys the named database and saved work. Do not rerun these files against an existing application. Bootstrap header version 2.5 describes source organization; it is not an installed-readiness shortcut.

Students normally launch `Start-SequelDetective.cmd`. The guarded installer extracts the `STUDENT FRESH INSTALL` sections into a newly claimed local database, never its destructive preamble. A failed fresh transaction may resume only when the recognized installer marker and empty state permit it. It never globally replaces database names inside evidence text.

## Existing installations

The installer recognizes supported legacy, foundation, extension and canonical-city states through schema, evidence, permissions and capability checks. Historical additive sections live separately in `scripts/student-package/migrations/`. Fresh installation never executes those sections. They preserve supported installed versions and pinned work; they are not a second place to author current fresh-build content.

Before an existing installation changes, setup requires a recognized exact target, an exclusive setup lock and a retained `COPY_ONLY, CHECKSUM` backup verified with `RESTORE VERIFYONLY`. Additive installation and validation execute in one transaction. Failed validation rolls back. Unknown, inconsistent and partial targets fail closed. Current installations are verified without reseeding evidence or changing credentials.

A current-only installation is valid without synthetic older case rows. Supported historical installations remain valid on their own explicit compatibility path. Both require checked constraints, enabled release protection, bounded roles and complete evidence manifests. A version marker or header by itself never proves readiness.

Changing the bootstrap scripts does not migrate an existing classroom story. Such a change requires its own explicit migration scope, backup and saved-work compatibility decision. Do not drop/rebuild a classroom database to bypass a failed preflight.

## Local prerequisites and credentials

The instructor prepares Windows with local SQL Server, the supported Node runtime and application dependencies or package prerequisites. Initial creation/account provisioning and ownership repair need authorized local SQL administration. Normal API/web processes run without elevation using separate restricted SQL accounts.

Keep these values local; do not commit passwords or owner capabilities:

| Setting | Purpose |
| --- | --- |
| `SQLSERVER_HOST`, `SQLSERVER_PORT`, `SQLSERVER_DATABASE` | Local target selected by guarded setup |
| `SQLSERVER_USER`, `SQLSERVER_PASSWORD` | Learner evidence-query account |
| `SQLSERVER_APP_USER`, `SQLSERVER_APP_PASSWORD` | Distinct bounded repository account |
| `SQLSERVER_BOOTSTRAP_MODE` | Normal protected launch uses verification; application startup is not an unrestricted setup path |
| `CASE_RUNTIME_SESSION_SECRET` | Stable secret of at least 32 random bytes, retained across launches |
| `CASE_RUNTIME_ALLOWED_ORIGINS` | Exact permitted frontend origins, including scheme and port |
| `VITE_API_BASE_URL` | Optional frontend API address override |

The launcher retains configured passwords, session secret and unrelated local settings. It must not grant runtime users `sysadmin`, `db_owner` or broad table-reader permissions. It installs neither a developer-specific login nor a fixed runtime password. Failed setup reports the instructor action before opening an unusable application.

## Runtime and readiness

The protected runtime has thirteen app tables: case definitions, steps and prerequisites; local learners, attempts and request outcomes; workspaces, actions and step proof; typed fact definitions, briefing facts, bindings and collected evidence items. All twenty app foreign keys are enabled and checked. Released definitions and their linked authored records are immutable; publish a new supported version rather than editing an installed released record.

Learners may query public evidence only. Repository credentials can read authored content and persist owned attempts, but cannot directly read `CaseAnswerKey` or `Solution`. Bounded procedures perform theory verification and readiness checks. The current generic evidence manifest delegates to the current Case 001 contract. Case 004 has its own exact evidence check. Recognized historical installations use their separately retained compatibility contracts.

Use the same hostname for frontend and API: `localhost` and `127.0.0.1` have distinct cookie scopes. Runtime listeners remain loopback-only. Owner cookies are HttpOnly and SameSite Strict, with Secure under HTTPS. They provide browser continuity, not a named student login. Losing the cookie loses access to its owned attempts; notes/draft exports do not carry ownership or proof.

Queries use learner credentials. Only server-validated returned evidence can advance tasks. Manual notes and imported local flags cannot create proof. Revision and request-digest checks protect state changes; archived attempts and saved drafts remain available through their existing owned interfaces.

## Account-independent local ownership (WP-309)

Readable tables in SSMS do not prove that owner-executed procedures work. A Windows-owned database can require domain lookup even when SQL Server is local. Student application ownership must not depend on a particular developer, instructor or student's Windows identity.

Fresh setup resolves the built-in SQL principal by SID `0x01`, including renamed or interactively disabled principals. It never enables that login or resets its password. Supported existing Windows-owned targets require owner-independent recognition, verified backup, transactional ownership correction and complete validation before commit. Suitable existing SQL ownership is retained. Unknown or missing owner identities fail closed.

The application never runs as that SQL owner. Ownership repair preserves existing case data, saved work and runtime credentials. It does not enable TRUSTWORTHY, disable module protections, change server authentication mode or bypass manifests. A healthy restricted-account launch must not invoke administrative setup.

A real second Windows user or physical domain outage is not manufactured by the tests. The suite uses generated fixture identities, catalog checks and controlled failure probes, plus real SQL backup/ownership/rollback and actual packaged application runs. Keep that distinction explicit in reports.

## Verification with one registered workspace

Run sequentially from the repository root:

```powershell
scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
scripts/tests/test-single-test-database.ps1 -SqlIntegration
```

Use only `SequelCityRuntimeTest_Workspace`. The [single-workspace runner](../05-development-workflow/Single-Test-Database.md) exclusively leases it, verifies a recovery backup, stops only its verified preview processes, runs scenarios sequentially and restores saved preview state in `finally`. No per-run or per-scenario clones are permitted. The main classroom database is never a test fixture.

The runtime suite first builds from the three current scripts alone. It checks exact evidence/answer fingerprints, stable identities, every current authored record and absence of historical/test case definitions. It then uses `scripts/tests/bootstrap-test-fixtures.ps1` and separate historical fixture data to test older versions and pinned attempts. Those fixtures never enter production bootstrap or the fresh package path.

Coverage includes actual restricted account permissions, metadata/CTE/join/view/synonym denial, release immutability, owned parameterized queries, idempotency/revisions, wrong-owner and cross-attempt rejection, all supported Case 004 paths, complete Case 001, SQL-authored reuse, notebook persistence and real browser playthroughs. Package checks include one-launch provisioning, healthy repeat launch, owner repair, saved workspace and credential preservation.

The source integration uses the installed `tsx` loader and does not require changes to tracked API distribution output. Record exact command results and failures; do not call a partial run a full pass. Keep one test database and one recovery backup after verification.

## Recovery and review boundaries

Retain verified installation backups. Attempt recovery also requires the browser's owner capability. If the test workspace restore fails, preserve its one recovery backup and registration and follow the single-workspace recovery instructions; never recover into another clone.

Independent audit and human acceptance remain separate from implementation and test success. No cleanup package authorizes a live story rewrite, dependency adoption, runtime AI, broad permissions or unrelated database changes.
