# implement missing safe query execution endpoint

## Objective

Implement the missing safe query execution endpoint files and route wiring required by WP-008 so learner SQL is validated before any database execution.

## Scope

### In Scope

- Create missing query request and response types
- Create missing query execution service
- Create missing query route
- Register query route in Fastify app
- Add tests for blocked SQL execution behavior
- Ensure blocked SQL is never executed

### Out of Scope

- Frontend UI
- Case progression
- Query history
- Authentication
- AI guidance
- Database schema changes
- SQL mutation support
- Advanced SQL parsing
- Refactoring existing health or schema endpoints

## Files Allowed to Change

- apps/api/src/app.ts
- apps/api/src/routes/queryRoutes.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/types/query.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/package.json

New files may be created only if listed above.

## Constraints

- Address the WP-008 Gemini audit violations directly
- Must use existing sqlSafetyService
- Must validate SQL before database execution
- Must not execute blocked SQL
- Must use existing SQL Server pool for allowed queries
- Must keep database access out of route files
- Must not alter existing health or schema routes
- Must not add frontend files
- Must not add runtime AI
- Must not add DataQuest references
- Must not modify database scripts

## Required Behavior

- Create `apps/api/src/types/query.ts`
- Create `apps/api/src/services/queryExecutionService.ts`
- Create `apps/api/src/routes/queryRoutes.ts`
- Create `apps/api/src/services/queryExecutionService.test.ts`
- Update `apps/api/src/app.ts` to register query routes
- POST `/api/query/execute` must exist
- Request body must require `sql` as a string
- Query service must call `validateSqlSafety(sql)` before database execution
- If validation fails:
  - Do not call SQL Server pool
  - Return `isExecuted: false`
  - Return empty `columns`
  - Return empty `rows`
  - Return `rowCount: 0`
  - Return safety validation result
- If validation passes:
  - Use existing SQL Server pool
  - Execute read-only SQL
  - Return rows, columns, row count, execution time, safety, and message
- SQL execution errors must return structured failure responses
- Tests must verify blocked SQL does not execute

## Acceptance Criteria

- [ ] `apps/api/src/routes/queryRoutes.ts` exists
- [ ] `apps/api/src/services/queryExecutionService.ts` exists
- [ ] `apps/api/src/types/query.ts` exists
- [ ] `apps/api/src/services/queryExecutionService.test.ts` exists
- [ ] `POST /api/query/execute` is registered
- [ ] Request body requires `sql`
- [ ] Query service validates SQL before execution
- [ ] Blocked SQL returns `isExecuted: false`
- [ ] Blocked SQL returns safety result
- [ ] Blocked SQL returns no rows
- [ ] Blocked SQL does not call SQL Server pool
- [ ] Safe SQL uses existing SQL Server pool
- [ ] Query execution logic is isolated from route files
- [ ] Existing health and schema routes remain registered
- [ ] No frontend files are created
- [ ] No runtime AI dependency is introduced
- [ ] No DataQuest dependency is introduced
- [ ] No database schema files are modified

## Codex Prompt

Implement the missing safe query execution endpoint from WP-008.

Context:
WP-008 failed audit because the implementation was missing required files and route wiring. The audit reported these missing or incomplete items:

- `apps/api/src/routes/queryRoutes.ts` missing
- `apps/api/src/services/queryExecutionService.ts` missing
- `apps/api/src/types/query.ts` missing
- `apps/api/src/services/queryExecutionService.test.ts` missing
- `POST /api/query/execute` not registered in `apps/api/src/app.ts`

This work package is a targeted correction. Implement only the missing pieces required to satisfy WP-008.

Scope:
Only modify or create the files listed in this work package.

Required implementation:

1. Query types

Create `apps/api/src/types/query.ts`.

Define:

- `QueryExecutionRequest`
- `QueryExecutionResponse`
- `QueryColumn`
- `QueryRow`

`QueryExecutionRequest`:

- `sql: string`

`QueryExecutionResponse`:

- `isExecuted: boolean`
- `safety: SqlSafetyValidationResult`
- `columns: QueryColumn[]`
- `rows: QueryRow[]`
- `rowCount: number`
- `executionTimeMs: number`
- `message: string`

`QueryColumn`:

- `name: string`
- `dataType?: string`

`QueryRow`:

- flexible object keyed by column name

Import and reuse `SqlSafetyValidationResult` from the existing SQL safety types.

2. Query execution service

Create `apps/api/src/services/queryExecutionService.ts`.

Implement:

`executeSafeQuery(sql: string): Promise<QueryExecutionResponse>`

Required behavior:

- Call `validateSqlSafety(sql)` first
- If `safety.isAllowed` is false:
  - Do not call the SQL Server pool
  - Return:
    - `isExecuted: false`
    - `safety`
    - `columns: []`
    - `rows: []`
    - `rowCount: 0`
    - `executionTimeMs`
    - clear blocked message
- If `safety.isAllowed` is true:
  - Use the existing SQL Server pool utility
  - Execute the SQL
  - Measure execution time
  - Return:
    - `isExecuted: true`
    - `safety`
    - `columns`
    - `rows`
    - `rowCount`
    - `executionTimeMs`
    - success message
- If execution throws:
  - Return structured failure response
  - Include `isExecuted: false`
  - Include safety result
  - Return no rows
  - Return user-safe error message
- Do not mutate database state
- Do not add transactions
- Do not add query rewriting

3. Query route

Create `apps/api/src/routes/queryRoutes.ts`.

Register:

`POST /api/query/execute`

Behavior:

- Validate body shape
- If body is missing or `sql` is not a string:
  - Return structured response with `isExecuted: false`
  - Use `validateSqlSafety("")` or equivalent blocked safety result
  - Return clear message
- If valid:
  - Call `executeSafeQuery(sql)`
  - Return result
- Route file must not directly use SQL Server pool

4. App registration

Update `apps/api/src/app.ts`.

- Import query routes
- Register query routes
- Preserve existing health and schema route registration

5. Tests

Create `apps/api/src/services/queryExecutionService.test.ts`.

At minimum verify:

- Empty SQL returns `isExecuted: false`
- `DELETE FROM PersonsOfInterest` returns `isExecuted: false`
- Blocked SQL includes safety result
- Blocked SQL returns empty rows and columns
- Blocked SQL has `rowCount: 0`
- Blocked SQL path does not require a database connection

If mocking the SQL Server pool is too heavy for this WP, do not test successful database execution. Document that safe SELECT execution requires integration testing with a local SQL Server instance.

6. Package script

Update `apps/api/package.json` only if needed so the existing test script runs the new test file.

7. Constraints

Do not add:

- frontend files
- AI code
- DataQuest references
- case progression
- query history
- mutation support
- database schema changes

Validation:

Run:

`npm test --workspace apps/api`

Run if possible:

`npm run build --workspace apps/api`

If build cannot run due to missing dependencies or environment restrictions, document the blocker clearly.

Return:

- Summary of implementation
- Files changed
- Test/build results
- Any assumptions or risks

## Gemini Audit Prompt

Audit the targeted WP-008A correction for the safe query execution endpoint.

This audit must produce a complete diagnostic report. Do not return only PASS or FAIL. If the verdict is FAIL, every failing item must be listed with file path, reason, and required fix.

Allowed files:

- apps/api/src/app.ts
- apps/api/src/routes/queryRoutes.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/types/query.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/package.json

Verify:

- `apps/api/src/routes/queryRoutes.ts` exists
- `apps/api/src/services/queryExecutionService.ts` exists
- `apps/api/src/types/query.ts` exists
- `apps/api/src/services/queryExecutionService.test.ts` exists
- `POST /api/query/execute` is registered
- Request body requires `sql`
- SQL safety validation runs before execution
- Blocked SQL is not executed
- Blocked SQL returns `isExecuted: false`
- Blocked SQL includes safety result
- Blocked SQL returns no rows
- Blocked SQL returns no columns
- Blocked SQL has `rowCount: 0`
- Safe SELECT execution uses existing SQL Server pool
- Query execution logic is isolated from route files
- SQL execution errors return structured responses
- Existing health and schema endpoints remain registered
- No frontend files were created
- No runtime AI dependency was introduced
- No DataQuest reference was introduced
- No database schema files were modified
- No SQL mutation support was introduced

Required output format:

Verdict: PASS or FAIL

Strengths:

- List what is correct.
- If none, write: None.

Violations:

- For each violation, use:
  - File:
  - Requirement:
  - Problem:
  - Required fix:
- If none, write: None.

Regressions:

- List regressions or regression risks.
- If none, write: None.

Drift risks:

- List architecture or SSOT drift risks.
- If none, write: None.

Required fixes:

- List concrete fixes required before approval.
- If none, write: None.

Final instruction:
If the verdict is FAIL, the Violations and Required fixes sections must not be None.

## Codex Results

Implemented the missing WP-008 safe query execution pieces only in the scoped API files.

The new flow is:
- [query.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/query.ts:1) defines the request/response and row/column types.
- [queryExecutionService.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.ts:1) validates SQL first, blocks non-`SELECT` statements without touching the SQL pool, lazily imports the SQL pool only for allowed queries, returns structured execution results, and returns a user-safe failure message on execution errors.
- [queryRoutes.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/queryRoutes.ts:1) registers `POST /api/query/execute`, validates the request body, and delegates to the service.
- [app.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/app.ts:1) now registers the query route while preserving health and schema route registration.
- [queryExecutionService.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/queryExecutionService.test.ts:1) covers the blocked-path requirements from WP-008.
- [package.json](/D:/GitHub-Repos/SequelCityWeb/apps/api/package.json:1) test script now runs both service test files.

**Files Changed**

- `apps/api/src/types/query.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/app.ts`
- `apps/api/package.json`

**Test / Build Results**

- `npm test --workspace apps/api`: passed
- `npm run build --workspace apps/api`: blocked in this environment because `tsc` is not installed/available (`'tsc' is not recognized as an internal or external command`)

**Assumptions / Risks**

- Successful safe `SELECT` execution is intentionally not unit tested here; the test file notes that it requires integration testing against a local SQL Server instance.
- The service uses lazy runtime imports for SQL pool access so blocked SQL does not require the DB driver or a connection. That behavior is verified indirectly by the blocked-path tests.
- Running tests with NodeΓÇÖs `--experimental-strip-types` produces a module-type warning for TS files; tests still pass. The TypeScript build could not be validated further because the local build toolchain is missing.

## Gemini Audit Results

## Verdict
PASS

## Violations
- None.

## Regressions
- None. Existing health and schema routes remain registered and functional.

## Drift risks
- None. The implementation adheres to the standalone, local-first architecture defined in the SSOT.
- None.
---
**Audit Summary:**

## Final Decision

Approved. The missing safe query execution endpoint files required by WP-008 are implemented and verified. `POST /api/query/execute` exists, SQL safety validation runs before any database execution, blocked SQL returns `isExecuted: false` with empty rows and columns, and all execution logic is isolated from the route layer. Existing health and schema routes remain registered and unchanged. Gemini audit returned PASS with no violations, regressions, or drift risks.
