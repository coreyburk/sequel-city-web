# Database bootstrap: the source of truth

The three numbered SQL files are the canonical origin of the current database. An installed database is a deployment of these files, not an alternative authoring source. Changes start here and are verified against the runtime contracts that consume them.

## What belongs here

Only current live schema, evidence, protected answers, case definitions, relationships and permissions. Fresh builds contain **Case 001 v3** and **Case 004 v2**. They do not contain previous case releases, internal authoring examples, historical data or test fixture imports. Content version numbers retain their stable identities; current does not mean renumbering everything to version 1.

## Read and run in this order

| File | Responsibility | Where to look |
| --- | --- | --- |
| [01 — Create DB](<01-SequelCityCrimesDB - Create DB.sql>) | Recreate the database, establish a stable local SQL owner, define public/application tables, procedures and release protection | File index, `Create Tables`, `Application tables`, readiness procedures and immutable release protections |
| [02 — Insert Data](<02-SequelCityCrimesDB - Insert Data.sql>) | Seed current evidence and answers; assemble and publish current cases | `Table:` headings, `InterviewLog - Murder`, `CaseAnswerKey`, `CURRENT CASE-001 CONTENT`, `CURRENT CASE-004 CONTENT` |
| [03 — ForeignKeys](<03-SequelCityCrimesDB - ForeignKeys.sql>) | Validate links, grant bounded roles, and record current installation capabilities | Public foreign keys, application relationships, learner/repository grants and readiness markers |

**Running the complete first script destroys the named database, including saved attempts.** Use this sequence only for an explicitly authorized empty/fresh installation. Do not rerun the seed against an installed application. Ordinary students use the launcher; its guarded installer extracts the bounded fresh sections for new installations and preserves existing work.

Run the three files in order on the intended local SQL Server, with database-creation/ownership permissions available to setup. Application services use restricted SQL accounts afterward. The built-in SQL principal is resolved by its stable SID; no developer's Windows identity is an installation requirement. The scripts do not provision application passwords or embed credentials.

## Find a case across its records

A case spans tables because the student follows relationships:

1. `CrimeType` supplies the crime identifier.
2. `CrimeSceneReport` contains the incident. Its `ReportID` links to `InterviewLog.ReportID`.
3. Statements reference `PersonsOfInterest.PersonID`; other records supply the supporting trail.
4. `CaseAnswerKey` stores protected verification answers; it is never learner-queryable.
5. `app.CaseDefinition`, `CaseStep`, `CaseStepPrerequisite`, `CaseFactDefinition`, `CaseBriefingFact` and `CaseStepFactBinding` define guidance, required evidence and progression.

For Case 001, find the May 2, 2023 report in `CrimeSceneReport`, the steward and suspect statements in `InterviewLog - Murder`, the culprit in `CaseAnswerKey`, then the current Case 001 content section. Report lookup in the interview section resolves the one authored incident rather than assuming an unrelated row position.

## Add or change current content

- Edit records in their table's existing section. Keep interview statements grouped by crime and label case-specific groups. Never append a second replacement version to the end of the seed.
- Preserve primary keys and foreign-key links. Interview rows list explicit `LogID` values so moving a statement does not renumber other clues. Existing current IDs remain 1001–7142; reserve unused IDs for additional statements. Other identity-backed bulk inserts still rely on their documented order: do not reorder those rows casually.
- Replace the current fresh-build case definition directly. Declare its exact version and all facts/steps explicitly; do not create an old release and clone or patch it into the current release.
- Draft publication is construction, not seeded history: create a draft with no entry pointer, insert linked records, then set its entry step and release it. Only the completed released definition remains after bootstrap.
- Keep the report, natural witness recollections, identity records and final answer consistent. Follow the canonical case authoring guide for logical clues, tokens, notebook presentation and proof boundaries.
- Update consumers and readiness contracts when the database contract intentionally changes. Application validator constants are consumers of this origin, not an independent seed source. Do not weaken validation just to make changed data load.
- Make comments explain purpose, relationships, ordering or safety. Use clear table/case headings; keep obsolete row counts, work-package chronology and one-off correction blocks out of the source.

## Existing installations and historical testing

Existing-installation migrations are separate under `scripts/student-package/migrations/`. These frozen compatibility sections preserve supported older installations and saved attempts through the guarded installer. Fresh installs never execute them. The older API migration lane under `database/migrations/` is also separate from these three bootstrap files; it is not a place to author or reload current story data. A story/schema change that must update an existing installation needs an explicit scoped migration; reorganizing bootstrap source is not permission to rewrite classroom data.

Historical test assembly lives in `scripts/tests/bootstrap-test-fixtures.ps1`, `scripts/tests/fixtures/database-history.sql` and the guarded legacy interview fixture under `apps/api/src/services/fixtures/`. Tests deliberately load these only into the registered workspace after verifying the current fresh build. Never reference them from bootstrap or the packaged fresh-install path.

`AppSchemaVersion` markers are current capability/readiness identifiers, even where their names include `v1` or `v2`. They are not historical case definitions. Keep them aligned with the installer and API contracts.

## Verify a change

From the repository root:

```powershell
scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
```

These commands exclusively lease the **one** registered `SequelCityRuntimeTest_Workspace`, verify its recovery backup, run scenarios sequentially, restore its saved preview state and restart it when appropriate. Never create another clone or point the fixtures at `SequelCityCrimesDB`.

The runtime harness first builds solely from these three files. It verifies the exact two current releases and compares all 11 evidence/answer tables against the pre-cleanup fingerprints in `scripts/tests/fixtures/bootstrap-current-baseline.json`, including IDs and links. It also verifies every value in all six current authoring tables against the original current-release fingerprints. It then reconstructs historical scenarios from the separate sources and exercises compatibility and current resolution. The launcher matrix verifies deployment, ownership repair, rollback, restricted accounts and packaged startup.

If an intentional future data change invalidates a fingerprint, review the expected row/ID changes and refresh that baseline through the same protected workspace workflow as part of the authorized change. Never replace fingerprints merely to suppress a failure. The bootstrap remains the authoring origin; the fingerprint is a regression expectation.
