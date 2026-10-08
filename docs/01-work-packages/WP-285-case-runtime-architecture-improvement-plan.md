# Case runtime architecture improvement plan

## Objective

Define a coherent, reviewable architecture for database-backed case content, backend-owned learner attempts and progression, and one shared Query Lab surface before further implementation of WP-284.

## Scope

### In Scope
- Document current source-backed storage/authority and the architectural gap.
- Propose protected versioned case/step records, local learner ownership, attempts, evidence, and workspace persistence.
- Define a case-neutral current-task contract, authoring lane, security boundaries, migration bundles, and validation gates.
- Mark WP-284 dependent on accepted architecture and repository work rather than implementing its existing frontend-only scope.
- Refresh handoff only at accepted closeout.

### Out of Scope
- Runtime implementation, SQL schema/data changes, database rebuild, production release, external service invocation, acceptance, commit, or push.
- Updating architecture SSOT as if the proposal were already accepted.
- New accounts/cloud services, runtime AI, generic workflow engines, or admin CMS.

## Impact Analysis

### Understand Status
- Analysis tier: Required; this proposal spans shared presentation, database/security, backend progression, Case 004, and persistence.
- Graph available: Yes; four tracked analysis artifacts exist.
- Baseline: 9237261c87af0e5fbc42408ba0dc4dba1322b4b7; planning HEAD: aea394a.
- Freshness assessment: WP-283 refreshed the graph including its working-snapshot normalizer changes; baseline metadata predates closeout. It is advisory for architecture planning; source inspection governs existing authority.
- Analysis performed: Targeted nodes confirm queryExecutionService, schemaService, studentRestrictedTables, databaseBootstrapService, studentCaseModule, and Case 001 evaluators. Source verifies shared App/header/workbench composition, frontend-authored guidance/drafts, browser saves, backend safe-query and verification paths, and lack of persisted attempt APIs. Existing base DDL has public evidence, Solution, AppSchemaVersion, and CaseAnswerKey; no proposed app content/attempt tables exist yet.

### Affected Architecture
- Proposed layers: Case authoring/seed data, SQL permissions, infrastructure repositories, backend progression/current-task service, learner workspace, and shared presentation.
- Current source anchors: apps/web/src/studentCase.ts, studentCase001.ts, studentCaseModule.ts, useStudentCaseState.ts, components/student/StudentMentorHeader.tsx, StudentWorkbenchView.tsx; apps/api/src/services/queryExecutionService.ts, schemaService.ts, studentRestrictedTables.ts, case001GatedMilestoneEvaluationService.ts, caseVerificationService.ts, databaseBootstrapService.ts, config/database.ts; database base creation/seed scripts.
- Upstream consumers: Case authoring, setup/rebuild, case entry and fresh/resume actions.
- Downstream dependencies: SQL execution, evidence logging, suspect verification, current guidance, drafts/notes, and release/version boundaries.

### Regression Surface
- Planning validation: Required section checks, source-reference checks, and whitespace validation; no runtime tests for documentation-only changes.
- Future validation: SQL permissions/schema leakage tests; content validation; attempt ownership/version/concurrency tests; Case 001 and complete Case 004 parity playthroughs; browser fresh/resume/reset/draft/hint checks; full affected web/API suites.
- Security boundaries: Learner SELECT access must exclude future guidance, app tables, other attempts, and answer keys; repository writes never execute learner SQL.

### Graph Update Decision
- No regeneration during this planning-only package: proposed architecture must not be added as implemented relationships. Structural implementation bundles must own graph regeneration and four tracked artifacts after their changes. Reassess at the accepted SSOT decision package.

## Files Allowed to Change

Allowed:
- docs/15-case-plans/CASE-RUNTIME-ARCHITECTURE-IMPROVEMENT-PLAN.md
- docs/01-work-packages/WP-285-case-runtime-architecture-improvement-plan.md
- docs/01-work-packages/WP-284-simplify-case-001-query-lab-guidance.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Handoff changes are closeout-only. WP-284 changes are dependency/replanning notes only.

Do Not Modify:
- apps/**
- database/**
- scripts/**
- .understand-anything/**
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-Database-Schema.md
- docs/01-work-packages/WP-283-portable-audit-wrapper-tests.md

## Constraints

- Proposed design must be clearly separated from current runtime and accepted SSOT.
- Preserve current local SQL Server/Fastify/React stack, offline play, read-only learner SQL, spoiler boundaries, and explicit database rebuild confirmation.
- Simplicity check: One typed task response and shared page, native SQL records/constraints, deterministic handler registry, bounded workspace document; no duplicate proof engine or premature CMS.
- Do not invent existing account/attempt support or claim the current evaluator persists milestones.

## Required Behavior

1. Explain case content, evidence, progression, workspace, and UI responsibilities separately.
2. Define the runtime database repository and version-controlled authoring source without competing content copies.
3. Propose a local ownership mechanism with honest browser-clearing and cross-device limitations.
4. Define fresh-versus-resume behavior, evidence-backed advancement, version/rebuild handling, and bounded legacy import.
5. Make database access isolation a prerequisite for exposing internal content/attempt tables.
6. Sequence independent architecture, repository, Case 001 vertical-slice, Case 004 parity migration, and authoring/cleanup bundles with acceptance gates.
7. Defer WP-284 implementation until its API/database dependencies and scopes are accepted.

## Acceptance Criteria

- [ ] Plan reflects actual source and distinguishes proposal from implemented authority.
- [ ] Shared page and case content contracts cover both released cases and future cases.
- [ ] Authoring flow, versions, attempts, identity limits, reset/resume, and draft preservation are explicit.
- [ ] Backend evidence validation and protected data access remain mandatory.
- [ ] Implementation bundles have concrete deliverables, dependencies, migration/rollback boundaries, and validation gates.
- [ ] Case 004 parity and Case 001 released-review limitation are preserved.
- [ ] WP-284 carries an explicit architecture dependency; no implementation/DDL/SSOT changes occur.

## Code Prompt

Complete and verify the documentation-only architecture proposal using current source and SSOT. Record proposed contracts and implementation gates without implementing them. Keep WP-284 dependent on architecture/repository acceptance. Do not mutate the database, claim implementation, accept, commit, or push.

## Audit Prompt

Independently review the proposal for source accuracy, coherent ownership, manageable table/API/UI contracts, attempt identity and versioning, spoiler/access protection, Case 004 migration parity, migration safety, and explicit implementation gates. Verify allowed documentation-only scope. Report Verdict: PASS or FAIL and decisions requiring human acceptance; do not accept on the human's behalf.

## Code Results

Architecture proposal created and reviewed by the user. Bootstrap coverage explicitly requested; methodical implementation authorized on 2026-10-08. WP-286 owns detailed contracts and the dependency-ordered WP-287 through WP-290 scopes. Independent audit and final lifecycle acceptance remain pending.

## Audit Results

Pending audit.

## Final Decision

Pending human acceptance.
