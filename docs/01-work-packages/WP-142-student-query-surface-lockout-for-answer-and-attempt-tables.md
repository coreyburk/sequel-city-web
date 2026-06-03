# WP-142: Student Query Surface Lockout For Answer And Attempt Tables

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-06-01  
**Reviewed:** 2026-06-03

## Objective

Prevent Student Mode from discovering or querying solution-bearing backend tables such as `CaseAnswerKey` and `Solution`, while preserving the suspect-verification flow that depends on those tables behind the API.

## Why This WP Exists

Manual testing exposed a critical integrity failure in the classroom investigation flow:

- `SELECT * FROM CaseAnswerKey` reveals the trigger man and mastermind immediately
- `SELECT * FROM Solution` exposes prior suspect attempts and verdict history
- the schema/table discovery surface also exposes these tables, so students can discover them even before querying them directly

This defeats the entire guided investigation loop. The issue is not just UX. It is a backend query-surface and privilege-model problem.

## Problem Summary

Current behavior indicates three separate leaks:

1. The student query endpoint only enforces statement type safety (`SELECT`-only), not table sensitivity.
2. The schema metadata surface exposes every `dbo` table, including answer and attempt tables.
3. The runtime app user is broad enough to read tables that should be backend-only.

Relevant confirmed implementation points:

- `CaseAnswerKey` is the canonical answer store for suspect verification
- `Solution` is the attempt/verdict history table used by the verification workflow
- the student query surface currently uses the same unrestricted runtime pool for arbitrary `SELECT` queries
- metadata listing currently includes all `dbo` tables without a student-facing filter

## Scope

### In Scope

- block student query execution against answer-bearing or backend-only tables on the server before SQL reaches SQL Server
- remove answer-bearing or backend-only tables from the student schema metadata surface returned by `/api/schema/tables`
- preserve `VerifySuspectSubmission` and any other backend verification path that legitimately depends on `CaseAnswerKey` and `Solution`
- introduce one shared restricted-table policy/helper so query execution and schema metadata cannot drift
- decide whether database privilege tightening should supplement the required application-layer lockout
- add regression coverage proving students cannot query or discover restricted tables
- document the accepted implementation, verification, and audit result in this WP

### Out of Scope

- redesigning the overall suspect-verification gameplay
- changing the actual answer data for cases
- removing the stored procedure or trigger architecture unless required for secure lockout
- unrelated student guidance or UI polish work

## Files Allowed to Change

Allowed:

- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/sqlSafetyService.ts`
- `apps/api/src/services/studentRestrictedTables.ts`
- `apps/api/src/services/studentRestrictedTables.test.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/schemaService.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/routes/schemaRoutes.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/services/schemaService.test.ts`
- `apps/api/src/routes/schemaRoutes.test.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/package.json` only if a new backend test file must be added to the package test script
- `database/migrations/**` only if database-level privilege changes are required
- `docs/01-work-packages/WP-142-student-query-surface-lockout-for-answer-and-attempt-tables.md`

Do Not Modify:

- `apps/web/**` unless a backend response contract change makes a minimal frontend adjustment unavoidable
- case content unrelated to table access control
- unrelated docs, scripts, or generated artifacts

## Constraints

- student-visible query behavior must remain deterministic and explain blocked access clearly
- backend verification must continue working for legitimate suspect checks
- do not rely on obscurity alone; table protection must be enforced server-side
- avoid broadening runtime database access further while fixing the leak
- if a table is hidden from students, it must be hidden from both:
  - schema discovery
  - raw student query execution

## Required Behavior

- Student Mode must not be able to query `CaseAnswerKey`
- Student Mode must not be able to query `Solution`
- Student Mode must not be able to discover `CaseAnswerKey` or `Solution` via schema metadata
- any equivalent backend-only operational tables that expose answers or internal state must also be excluded consistently
- blocked student queries against restricted tables must return a safe failure response
- the suspect verification API must still work and return correct verdicts
- health/bootstrap diagnostics may still inspect migrations and backend readiness, but must not expose answer rows or turn restricted tables into student-visible schema entries

## Current Code Review Notes - 2026-06-03

- `apps/api/src/services/queryExecutionService.ts` currently calls `validateSqlSafety(sql)` and executes allowed `SELECT` SQL through the runtime pool; it has no table-sensitivity check.
- `apps/api/src/services/sqlSafetyService.ts` currently validates statement families and CTE top-level behavior only; it does not inspect referenced table names.
- `apps/api/src/services/schemaService.ts` currently loads all non-system tables from `sys.tables`, maps them into schema metadata, and returns them to `/api/schema/tables`; it has no student-facing restricted-table filter.
- `apps/api/src/services/caseVerificationService.ts` uses `VerifySuspectSubmission` as the supported controlled verification path and must continue to work.
- `apps/api/package.json` runs explicit Node test files, not Vitest `--run` patterns; any new backend test file must either be added to that script or run directly with `node --experimental-strip-types`.

## Acceptance Criteria

- [x] `SELECT` queries against `CaseAnswerKey` are blocked from the student query surface
- [x] `SELECT` queries against `Solution` are blocked from the student query surface
- [x] schema metadata no longer exposes answer-bearing or backend-only student-restricted tables
- [x] suspect verification still functions correctly through the supported API path
- [x] focused backend tests cover restricted-table blocking and schema filtering
- [x] the final protection model is documented clearly in this WP

## Implementation Plan

Expected approach:

- create an authoritative restricted-table helper, likely in `studentRestrictedTables.ts`, with at least `CaseAnswerKey` and `Solution`
- match restricted table references case-insensitively and handle common SQL Server forms:
  - unqualified names: `Solution`
  - schema-qualified names: `dbo.Solution`
  - bracketed names: `[Solution]`, `[dbo].[Solution]`
  - aliased joins/subqueries/CTEs that reference restricted base tables
- enforce the restricted-table check in the student query-execution path after basic statement safety passes but before SQL is sent to the database
- enforce the same policy in schema metadata mapping so restricted tables and relationships involving restricted tables are removed from student-facing schema responses
- evaluate whether database-role tightening should supplement application-layer filtering
- add backend regression coverage for:
  - blocked direct access to restricted tables
  - blocked schema-qualified, bracketed, joined, subquery, and CTE references to restricted tables
  - filtered schema responses
  - filtered relationships when either side references a restricted table
  - preserved verification behavior

Preferred minimum protection model:

1. Keep `validateSqlSafety` focused on statement safety.
2. Add a separate restricted-table validator/helper for student-visible query execution.
3. Add schema filtering with the same helper.
4. Add database privilege tightening only if it can be done without breaking `VerifySuspectSubmission` or local setup.

## Code Results

- Added [apps/api/src/services/studentRestrictedTables.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/studentRestrictedTables.ts) as the shared Student Mode restricted-table policy for answer-bearing/backend-only tables.
- Added [apps/api/src/services/studentRestrictedTables.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/studentRestrictedTables.test.ts) covering case-insensitive table matching, schema-qualified names, bracketed names, joins, subqueries, CTEs, and ignored string/comment mentions.
- Updated [apps/api/src/services/queryExecutionService.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts) so restricted table references are blocked after statement safety passes but before the SQL executor is called.
- Updated [apps/api/src/types/sqlSafety.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/sqlSafety.ts) with the `RESTRICTED_TABLE` violation code.
- Updated [apps/api/src/services/schemaService.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/schemaService.ts) so student-facing schema metadata filters restricted tables, their primary keys, and relationships involving restricted tables.
- Extended [apps/api/src/services/queryExecutionService.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.test.ts) to prove restricted-table queries are blocked without calling the executor.
- Extended [apps/api/src/services/schemaService.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/schemaService.test.ts) to prove restricted tables and relationships are removed from schema metadata.
- Updated [apps/api/package.json](/D:/GitHub-Repos/SequelCityWeb/apps/api/package.json) so the new restricted-table tests run in the standard API test script.

## Protection Model

Student Mode now uses a two-layer application boundary:

1. `validateSqlSafety` still owns general SQL statement safety and remains focused on allowing one read-only `SELECT`/read-only CTE query.
2. `studentRestrictedTables` owns answer-bearing/backend-only table policy and is used by both query execution and schema metadata.

This keeps the table restriction server-side, shared across the two student-visible surfaces, and independent of frontend hiding. Database privilege tightening remains a possible future hardening layer, but was not required for this implementation because it could affect local setup and controlled suspect verification.

## Verification

Required verification before audit:

- `npm run test --workspace apps/api`
- if new backend test files are not yet wired into `apps/api/package.json`, run them directly with `node --experimental-strip-types <path-to-test>`
- any additional targeted backend tests added for restricted-table blocking and schema filtering

Manual verification target:

- confirm student queries such as `SELECT * FROM CaseAnswerKey` and `SELECT * FROM Solution` return blocked responses instead of data
- confirm variants such as `SELECT * FROM dbo.Solution`, `SELECT * FROM [dbo].[Solution]`, joins, subqueries, and CTEs that reference restricted tables are also blocked
- confirm `/api/schema/tables` does not include `CaseAnswerKey`, `Solution`, their columns, or relationships that disclose those tables
- confirm suspect verification still returns deterministic verdicts through the supported API path

### Verification Results

- `node --experimental-strip-types apps/api/src/services/studentRestrictedTables.test.ts`
- Result: PASS
- `npm run test --workspace apps/api`
- Result: PASS
- `npm run build --workspace apps/api`
- Result: FAIL, due to existing project-wide TypeScript build configuration/test-file issues including `.ts` import extension settings, missing `mssql` declarations, and duplicate global test declarations. This failure is not isolated to WP-142 changes and predates the focused API test runner pattern.

Manual database/API runtime verification remains pending because this implementation turn used injected executors and service-level tests rather than a live local SQL Server/API session.

## Audit Prompt

Audit WP-142 for security, scope compliance, regression risk, and completeness of the student query-surface lockout.

Verify:

1. Students can no longer discover or query `CaseAnswerKey`.
2. Students can no longer discover or query `Solution`.
3. Any equivalent restricted backend-only tables are filtered consistently.
4. The protection is enforced server-side and does not rely only on frontend hiding.
5. The suspect-verification API still works correctly through its supported path.
6. Tests cover the lockout behavior and schema filtering behavior.

## Audit Results

Accepted.

Audit completed on 2026-06-03.

Findings:

1. Scope compliance: PASS. Changes stayed inside the approved backend service/test/package files and WP-142 documentation. No frontend, case-content, or unrelated generated artifact changes are included.
2. Query execution lockout: PASS. `queryExecutionService` now blocks restricted table references after statement safety passes and before the SQL executor is called. Tests cover direct, schema-qualified, bracketed, joined, subquery, and CTE references.
3. Schema discovery lockout: PASS. `schemaService` now filters restricted tables, their primary keys, and relationships involving restricted tables before returning student-facing schema metadata.
4. Shared policy: PASS. `studentRestrictedTables` is the single shared helper used by both query execution and schema metadata filtering, reducing drift risk between student-visible query and schema surfaces.
5. Suspect verification preservation: PASS. The controlled `VerifySuspectSubmission` path remains unchanged, and `caseVerificationService` tests pass under the full API test script.
6. Regression coverage: PASS. The API suite includes focused tests for restricted-table detection, query blocking, schema filtering, and preserved suspect verification behavior.

Residual risk:

- Manual live API/database verification remains recommended before classroom use because this audit validated the service layer and route-adjacent behavior with injected executors and metadata loaders, not a live SQL Server session.
- `npm run build --workspace apps/api` still fails because of existing project-wide TypeScript build configuration/test-file issues documented in Verification Results. This does not block WP-142 acceptance because the standard API test suite passed and the build failure is not isolated to this WP.

## Final Decision

Accepted.

Reason: WP-142 implements a server-side restricted-table lockout for Student Mode, removes answer-bearing/backend-only tables from student-facing schema metadata, preserves the supported suspect-verification path, and adds focused backend regression coverage. `npm run test --workspace apps/api` passed after audit.
