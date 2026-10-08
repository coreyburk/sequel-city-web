# SSOT Database Schema

## Database Name

`SequelCityCrimesDB`

## Document Scope

This document owns database name, source scripts, table purposes, key relationships, schema access rules, and spoiler-control rules. SQL execution safety is owned by `SSOT-SQL-Safety-Rules.md`. Runtime service layering is owned by `SSOT-Architecture.md`.

## Database Source Scripts

- `01-SequelCityCrimesDB - Create DB.sql`
- `02-SequelCityCrimesDB - Insert Data.sql`
- `03-SequelCityCrimesDB - ForeignKeys.sql`
- `SequelCityCrimesDB - AnswerKey.sql`

The application uses the local SequelCityCrimesDB database as its authoritative runtime data source. The initial version must run locally from a fresh setup with no internet requirement and no dependency on DataQuest, cloud services, external APIs, MCP, Ollama, or LLM runtimes.

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
| Solution | Supports deterministic suspect verification |

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

## Case Evidence Fixtures

Case 001 (`The Clocktower Poisoning`) uses the existing `CrimeSceneReport` table for its first pre-release evidence fixture. The base seed data includes one public clocktower ceremony poisoning report row using the existing `ReportDate`, `CrimeID`, `ReportDescription`, and `ReportCity` columns. This fixture does not require a schema shape change and is public evidence data only; it is not answer-key data, restricted table content, suspect verification data, or a runtime progression implementation.

## Spoiler Control

The answer key must not be exposed in the learner interface. Suspect verification should return the database-backed verdict without exposing the full answer key source script.

Database-backed evidence and query results are authoritative. No AI or UI-only interpretation may override actual database contents.

## Case runtime transition contract (WP-286)

Status: target contract pending independent design audit and human acceptance; no new runtime behavior is claimed.

Target app schema and checked constraints are defined in the implementation contract. These tables are not installed yet. Every schema/content package must update the base creation, data-load and foreign-key scripts together and prove a disposable zero-state build. Existing databases require explicit setup/version handling; no automatic destructive rebuild is authorized.

Detailed interfaces and bootstrap responsibilities: [Case Runtime Contracts](../15-case-plans/CASE-RUNTIME-CONTRACTS.md). Case 004 gates: [Runtime Parity Matrix](../15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md). Implementation sequence: WP-287 foundation, WP-288 Case 001, WP-289 Case 004, WP-290 authoring/cleanup. This section governs the proposed transition; existing behavior remains identified above until implementation and release verification.

## Protected runtime foundation (WP-287 implementation)

Source bootstrap now defines app.CaseDefinition, CaseStep, CaseStepPrerequisite, LocalLearner, LearnerAttempt, AttemptWorkspace, AttemptAction and AttemptStepEvidence. All eleven application FKs are checked, with same-version content and same-attempt action/evidence references. Released definitions, steps and prerequisites are immutable. Seed source supplies Case 001 version 1 (three query-mode steps, evidence-review completion) and an unreleased fixture. No Case 004 runtime content or frontend switch is claimed.

Roles sequel_learner and sequel_repository separate public evidence SELECT from parameterized content/attempt access. Controlled aggregate procedures validate legacy identity and evidence compatibility without direct answer reads. Protected readiness checks explicit case-runtime-v1/sequel-evidence-v1 manifests, content, required columns, roles and constraints rather than trusting a legacy migration key. Installation and actual-login test coverage are documented in [Bootstrap Runbook](../15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md). Existing live databases have not been rebuilt; application of destructive base scripts requires explicit authorization.
## Durable request ledger (WP-288)

The protected foundation now has nine app tables. app.LearnerRequest stores (OwnerId, RequestId) as its primary key, a SHA-256 request digest, bounded JSON outcome and UTC creation time. Its checked FK_Request_Owner references LocalLearner with NO ACTION. It intentionally has no attempt FK: duplicate deletion requests remain idempotent after child-first deletion removes the attempt. It contains no owner capability, unrestricted query results or learner PII.

Creation originates in the base creation script; the FK and bounded repository DML grants originate in the foreign-key script. The ledger starts empty and needs no story seed. Existing versioned Case 001 data remains unchanged in the authoritative data script. Explicit readiness requires all nine tables, 65 named columns and twelve checked application foreign keys; a legacy/schema marker alone cannot authorize routing. Learner app-schema denial covers the new table. Runtime creates attempts/proofs/workspaces through bounded parameterized repository transactions, never through learner execution credentials.