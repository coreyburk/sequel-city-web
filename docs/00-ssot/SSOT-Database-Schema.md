# SSOT Database Schema

## Database Name

`SequelCityCrimesDB`

## Document Scope

This document owns database name, source scripts, table purposes, key relationships, schema access rules, and spoiler-control rules. SQL execution safety is owned by `SSOT-SQL-Safety-Rules.md`. Runtime service layering is owned by `SSOT-Architecture.md`.

## Database Source Scripts

- `01-SequelCityCrimesDB - Create DB.sql`
- `02-SequelCityCrimesDB - Insert Data.sql`
- `03-SequelCityCrimesDB - ForeignKeys.sql`

The three numbered scripts are the canonical authoring origin; the local SequelCityCrimesDB database is their deployed runtime data source. The initial version must run locally from a fresh setup with no internet requirement and no dependency on DataQuest, cloud services, external APIs, MCP, Ollama, or LLM runtimes.

The database platform remains local SQL Server using `SequelCityCrimesDB`. This stack correction does not change schema requirements, table definitions, relationships, or spoiler-control rules.

## Tables

| Table | Purpose |
|---|---|
| CrimeType | Defines crime categories used by crime scene reports |
| CrimeSceneReport | Stores crime report entries |
| DriversLicense | Stores physical and vehicle details |
| PersonsOfInterest | Stores people who may be suspects, witnesses, or other relevant persons |
| InterviewLog | Stores interview transcripts linked to people and reports |
| FitNFlabClub | Stores fitness club membership records |
| FitNFlabClubCheckIn | Stores fitness club check-in and check-out records |
| Employment | Stores employment and income records |
| EventSchedule | Stores scheduled events |
| EventRegistration | Links people to events |
| Solution | Supports bounded deterministic suspect verification |
| CaseAnswerKey | Protected verification answers; excluded from learner and direct repository reads |
| AppSchemaVersion | Current installation capability identifiers used with full readiness validation |

## Key Relationships

- `CrimeSceneReport.CrimeID` to `CrimeType.CrimeID`
- `PersonsOfInterest.LicenseID` to `DriversLicense.LicenseID`
- `PersonsOfInterest.SSN` to `Employment.SSN`
- `InterviewLog.PersonID` to `PersonsOfInterest.PersonID`
- `InterviewLog.ReportID` to `CrimeSceneReport.ReportID`
- `EventRegistration.EventPersonID` to `PersonsOfInterest.PersonID`
- `EventRegistration.EventID` to `EventSchedule.EventID`
- `FitNFlabClub.PersonID` to `PersonsOfInterest.PersonID`
- `FitNFlabClubCheckIn.FitMemberID` to `FitNFlabClub.FitMemberID`

## Schema Access Rules

The application may expose schema metadata to learners, but must expose only actual database tables and columns. Schema metadata shown to learners or used by services must come from the database or SSOT, not from inference. The frontend may present schema metadata returned by the backend, but it must not invent tables, columns, or relationships. AI agents, if added later as optional advisory enhancements, must use schema metadata retrieved from the backend or SSOT.

## Current case evidence

The seed contains the current live evidence for Case 001 and Case 004. Case 001 links one incident report to a steward account and suspect statement, then resolves one protected culprit. Case 004 retains its complete linked evidence and two controlled verification roles. Reports, interviews and protected answers are authored in their corresponding table sections. Historical case versions and test fixtures are not bootstrap data.

## Spoiler Control

The answer key must not be exposed in the learner interface. Suspect verification should return the database-backed verdict without exposing the full answer key source script.

Database-backed evidence and query results are authoritative. No AI or UI-only interpretation may override actual database contents.

## Protected application schema

The current schema has thirteen `app` tables: CaseDefinition, CaseStep, CaseStepPrerequisite, LocalLearner, LearnerAttempt, LearnerRequest, AttemptWorkspace, AttemptAction, AttemptStepEvidence, CaseFactDefinition, CaseBriefingFact, CaseStepFactBinding and AttemptEvidenceItem. Twenty checked/enabled application foreign keys enforce owner, same-version content and same-attempt action/evidence links. Enabled triggers protect released definitions, steps, prerequisites and typed fact/binding records.

Fresh source seeds only Case 001 v3 and Case 004 v2. A definition is assembled as a draft, linked records are inserted, then its entry step is selected and it is released. No older case rows or unreleased authoring examples are required for a current-only installation. Installed historical versions remain a separate compatibility concern; this source cleanup never deletes existing saved work.

Roles `sequel_learner` and `sequel_repository` separate public evidence SELECT from bounded authored content/attempt access. Controlled procedures verify answers and evidence without direct answer-key reads. Required columns, checked relationships, release protections, permissions, manifests and supported content are all part of readiness; neither a legacy marker nor a script header alone authorizes routing.

Detailed interfaces: [Case Runtime Contracts](../15-case-plans/CASE-RUNTIME-CONTRACTS.md). Case 004 gates: [Runtime Parity Matrix](../15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md). Current setup and testing: [Bootstrap Runbook](../15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md).

## Durable request ledger

`app.LearnerRequest` stores (OwnerId, RequestId), a SHA-256 request digest, bounded outcome JSON and UTC creation time. Its checked FK_Request_Owner references LocalLearner with NO ACTION. It intentionally has no attempt foreign key, allowing duplicate deletion requests to remain idempotent after child-first attempt deletion. It stores no owner capability, unrestricted result sets or learner PII. It starts empty; runtime persistence uses bounded parameterized repository transactions rather than learner credentials.

## Installation source boundaries

The current bootstrap headers identify source version 2.5. The installer uses only the bounded FRESH sections for new installations and never executes their destructive preamble. Supported existing-installation additive sections are separate under `scripts/student-package/migrations/`, validated before administrative SQL execution and applied only after recognition and verified backup. Current installs are verified, not reseeded. Unknown/partial installations fail closed. Exact readiness and capability checks remain authoritative; no automatic story migration or reset is introduced.

## Local database owner and runtime identity (WP-309)

Student installations must not depend on a developer-specific Windows identity or reachable domain. Fresh setup selects a stable local SQL owner by SID 0x01 without enabling that principal's login. Existing suitable SQL ownership is retained; guarded repair of recognized Windows-owned installations requires owner-independent compatibility checks, a verified backup and transactional ownership/validation rollback. Unknown/partial targets fail closed. Ownership repair does not reset data, change stored runtime credentials, grant learner/repository administrative rights, or disable owner-executed manifests. Normal application launch uses restricted SQL accounts and must not need administrative setup when healthy. Initial setup/repair requires authorized local SQL administration, separate from non-elevated student runtime. Detailed procedure: [Bootstrap Runbook](../15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#account-independent-local-ownership-wp-309).


## Bootstrap authority

The three numbered files under `database/` are the canonical origin of the current live database. Seed only current schema, evidence, protected answers and released case definitions; keep records in their table/case sections. No historical releases, superseded records, authoring examples or test fixtures belong in bootstrap. Define current cases directly rather than replaying earlier releases. Preserve keys, relationships, bounded permissions and current validators.

Existing-installation compatibility lives separately under `scripts/student-package/migrations/`; fresh installation never executes it. Historical test reconstruction is explicitly separate from both bootstrap and classroom operations. Updating these files does not authorize migration or reset of an existing installation. See [database authoring and verification](../../database/README.md) for navigation, identity allocation, draft publication, migration boundaries and the single-workspace validation commands.
