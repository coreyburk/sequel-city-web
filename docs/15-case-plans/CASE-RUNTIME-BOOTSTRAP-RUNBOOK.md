# Protected Case Runtime Bootstrap (WP-287)

The foundation is implemented in source; Case 001 and Case 004 still use their existing frontend adapters. This package does not release database-owned gameplay, ownership cookies or attempt routes. Those belong to WP-288/WP-289.

## Credentials and connections

Keep learner SQL, repository and bootstrap credentials distinct. Set locally, never in committed files:

- SQLSERVER_USER / SQLSERVER_PASSWORD: learner login, normally sequel_web_user.
- SQLSERVER_APP_USER / SQLSERVER_APP_PASSWORD: separate repository login, normally sequel_case_repository. Supply your own password; no repository password is shipped.
- SQLSERVER_BOOTSTRAP_USER / SQLSERVER_BOOTSTRAP_PASSWORD: administrative database upgrade account. Server-login provisioning requires a Windows-integrated local administrator, not merely db_owner.
- SQLSERVER_HOST, SQLSERVER_PORT and SQLSERVER_DATABASE select the same intended local database for both bounded pools.

The learner connection executes approved student SQL only. Repository methods bind all values to parameters. The trusted connection reads content/metadata and invokes controlled verification; it never runs student SQL. Both provisioning paths remove learner db_datareader membership and assign dedicated roles. Repository startup requires bounded roles, checked relationships, immutable-content triggers, explicit schema/evidence manifests and validated released content before the writer pool is returned.

An unchanged legacy installation without repository configuration retains its existing adapter/connection behavior. Setting repository credentials opts into complete foundation readiness; missing or partial protected schema fails closed and cannot be repaired by the legacy migration runner. Legacy bootstrap isReady does not stand in for protected caseRuntime.isReady.

## Explicit installation/rebuild

The existing creation script drops the selected database. Do not run it automatically, against the live database merely to test this change, or as a response to a version mismatch.

Before an approved live rebuild:

1. Verify the exact server/database identity with the operator.
2. Take a SQL Server full database backup using the normal administrator tooling, verify it, and test restoration to a separate database. Preserve the installed application version and configuration.
3. Export/copy learner-owned browser drafts/notes before migration. Workspace exports grant neither ownership nor proof. In the future durable runtime, full attempt recovery needs the database backup and the browser owner capability; clearing that cookie is not recovery.
4. Obtain explicit authorization for the destructive rebuild. Source implementation approval is not database-drop authorization.
5. Execute, in order, the authoritative scripts:
   - database/01-SequelCityCrimesDB - Create DB.sql
   - database/02-SequelCityCrimesDB - Insert Data.sql
   - database/03-SequelCityCrimesDB - ForeignKeys.sql
6. Run scripts/setup-local-sql-accounts.ps1 (delegates to the student-package implementation) with the intended names and a separately supplied RepositoryPassword. Store matching API environment credentials locally.
7. Start the API and check protected readiness. Do not switch any frontend adapter until its later package is audited and accepted.

All eight app tables, indexes, checks and immutable content guards originate in the creation script. Case 001's three versioned query-mode steps and a draft authoring fixture originate in the data script. Eleven app foreign keys use WITH CHECK in the FK script, which also installs explicit roles/permissions and the case-runtime-v1 manifest. No story migration or hidden manual load supplements these scripts. The unreleased fixture is not a student catalogue entry. Released case content cannot be edited in place; publish and validate a new version through the authoring lane.

Readiness verifies required table/column names, checked/enabled foreign keys, release protection, bounded learner permissions, supported content/prerequisites and the sequel-evidence-v1 public evidence fixture. Unchecked FK, missing marker/column/permission, unsupported handler, incomplete content and mismatched evidence fail readiness. Controlled procedures return only aggregate identity/evidence compatibility checks; repository credentials cannot SELECT the answer key or Solution directly.

## Learner protection

Learner role SELECT grants cover ten explicit dbo evidence tables. Application/answer/version data and EXECUTE/writes are denied. System catalog SELECT and VIEW DEFINITION are denied where SQL Server permits database-level denial. INFORMATION_SCHEMA system objects require master-level permission changes, so this installation does not change shared server permissions: permission-based visibility hides internal app/answer objects, and API safety rejects all INFORMATION_SCHEMA access. Actual login tests assert zero internal rows, not merely hidden UI entries.

API table-reference checks cover quoted schemas, joins, subqueries, comma sources and CTEs; only public dbo evidence/CTE names are accepted. Metadata functions, external rowsets and SELECT INTO are blocked. Schema responses filter columns, keys and relationships to the same public allowlist, including rejecting an app table with a public-looking name. Database permissions remain the final boundary for views/synonyms and direct reads.

## Reproducible disposable validation

Run from the repository root:

    scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_<unique_suffix>

The name must start with SequelCityRuntimeTest_; an existing database is refused. The harness atomically claims a new empty database and skips the live creation script's destructive rebuild preamble. It substitutes the owned disposable name into all three authoritative scripts, executes their schema/seed/FK batches, uses integrated local administration, and creates temporary SQL logins with generated passwords. A name-claim race fails without deleting another process's database. It cleans only the database/logins it owns. No password is printed or written to the repository. It restores child environment variables and cleans pooled connections.

Coverage includes clean bootstrap, repeated account setup, actual learner/repository connections, protected table/catalog/CTE/join/view/synonym access, released-content immutability, bounded verifier execution, both provisioning implementations, parameter binding, duplicate owner lookup, fresh attempt archiving, wrong-owner reads, retained workspace, stale revision rejection, cross-attempt evidence FK rejection, negative schema/content/evidence/permission readiness, API startup, schema response and real safe/blocked query execution.

The harness uses the installed tsx development loader for source API integration, avoiding tracked dist changes. Standard API test runs include bootstrap/identity/authoring/repository regressions; live SQL coverage runs only with disposable integration context. API build is a separate validation command. Generated tracked dist files from a build must be restored to their pre-build state before scope audit; no runtime distribution change is owned by WP-287.

## Recovery and limitations

Do not load app tables through automatic legacy migrations. Setup mismatch requires an explicit repair/rebuild decision and retained backup. Restoring the accepted prior database/application can retain legacy adapters; do not invent progress from newer browser flags or mix new proof with old frontend authority.

This foundation supplies content loading, owner lookup, fresh attempt archival, owned workspace reads and revision-checked saves internally. Durable action/progress transitions, CSRF/idempotency, resume/delete APIs, legacy import and the shared UI remain future WP-288 work. Case 004 content/validators remain WP-289 work. No public attempt/content route or frontend release flag has been added.