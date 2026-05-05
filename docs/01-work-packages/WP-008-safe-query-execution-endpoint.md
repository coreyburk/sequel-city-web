# safe query execution endpoint

## Objective

Create a deterministic learner SQL execution endpoint that validates SQL through the safety layer before executing read-only queries against SequelCityCrimesDB.

## Scope

### In Scope

- Add query execution request and response types
- Add read-only query execution service
- Add Fastify route for safe query execution
- Integrate SQL safety validation before execution
- Return rows, columns, row count, execution time, and safety result
- Handle SQL errors without exposing unsafe internals
- Add tests for safety-blocked execution behavior where practical

### Out of Scope

- Frontend UI
- SQL editor
- Case progression
- Evidence notebook
- AI guidance
- Authentication
- Query history persistence
- Scoring
- Database schema changes
- SQL mutation support
- Advanced SQL parser integration

## Files Allowed to Change

- apps/api/src/app.ts
- apps/api/src/routes/queryRoutes.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/types/query.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/package.json

New files may be created only if listed above.

## Constraints

- Must validate SQL before execution
- Must use existing sqlSafetyService
- Must execute only when validation is allowed
- Must not execute blocked SQL
- Must not mutate database state
- Must not add runtime AI
- Must not add DataQuest references
- Must not add frontend files
- Must not change database schema
- Must keep database access isolated from route files
- Must keep responses deterministic and structured
- Must not bypass existing SQL Server pool logic

## Required Behavior

- Add POST /api/query/execute
- Request body must include:
  - sql
- Endpoint must call validateSqlSafety before any database execution
- If safety validation fails:
  - do not execute SQL
  - return a structured blocked response
  - include safety validation result
- If safety validation passes:
  - execute the query using the existing SQL Server pool
  - return structured query results
- Response must include:
  - isExecuted
  - safety
  - columns
  - rows
  - rowCount
  - executionTimeMs
  - message
- SQL errors must return structured failure responses
- No mutation route or mutation option may be added
- Existing health and schema endpoints must remain unchanged

## Acceptance Criteria

- [ ] POST /api/query/execute exists
- [ ] Request body accepts sql
- [ ] SQL safety validation runs before execution
- [ ] Blocked SQL is not executed
- [ ] Safe SELECT SQL is executed
- [ ] Response includes isExecuted
- [ ] Response includes safety result
- [ ] Response includes columns
- [ ] Response includes rows
- [ ] Response includes rowCount
- [ ] Response includes executionTimeMs
- [ ] SQL execution errors return structured responses
- [ ] Query execution logic is isolated from route files
- [ ] Existing health endpoint remains unchanged
- [ ] Existing schema endpoint remains unchanged
- [ ] No frontend files are added
- [ ] No runtime AI dependency is introduced
- [ ] No DataQuest dependency is introduced
- [ ] No database schema changes are made

## Codex Prompt

Create the safe learner SQL execution endpoint for the Node.js + TypeScript + Fastify backend.

Context:
The backend already has:

- Fastify app setup
- SQL Server connection pool
- Database health endpoint
- Schema metadata endpoint
- Deterministic sqlSafetyService

This work package adds the first learner SQL execution endpoint. It must validate SQL before execution and must never execute blocked SQL.

Scope:
Only modify or create the files listed in this work package.

Required implementation:

1. Query types

Create apps/api/src/types/query.ts.

Define request and response types for:

- QueryExecutionRequest
- QueryExecutionResponse
- QueryColumn
- QueryRow

QueryExecutionRequest:

- sql: string

QueryExecutionResponse:

- isExecuted: boolean
- safety: existing SqlSafetyValidationResult type
- columns: QueryColumn[]
- rows: QueryRow[]
- rowCount: number
- executionTimeMs: number
- message: string

QueryColumn:

- name: string
- dataType?: string

QueryRow:

- flexible object keyed by column name

2. Query execution service

Create apps/api/src/services/queryExecutionService.ts.

Implement:

executeSafeQuery(sql: string): Promise `<QueryExecutionResponse>`

Behavior:

- Call validateSqlSafety(sql)
- If not allowed:
  - return isExecuted false
  - do not call database pool
  - return empty rows and columns
  - include safety result
- If allowed:
  - get SQL Server pool using existing pool utility
  - execute the SQL as read-only
  - measure execution time
  - return rows, columns, rowCount, executionTimeMs, and safety result
- Catch SQL errors and return structured response
- Do not mutate database state
- Do not add transaction or write behavior

3. Route

Create apps/api/src/routes/queryRoutes.ts.

Register:

POST /api/query/execute

Behavior:

- Validate request body shape at minimum
- Require sql to be a string
- Call executeSafeQuery
- Return structured response
- Do not perform database logic in the route

4. App registration

Update apps/api/src/app.ts.

- Register queryRoutes
- Preserve existing health and schema route registration

5. Tests

Create apps/api/src/services/queryExecutionService.test.ts.

At minimum, test:

- blocked SQL returns isExecuted false
- blocked SQL includes safety result
- blocked SQL returns no rows
- empty SQL is not executed
- mutation SQL is not executed

If database mocking is too heavy for this WP, focus tests on safety-blocked execution path and document that live safe SELECT execution requires local database integration testing.

6. Package scripts

Update apps/api/package.json only if needed to include the new test file in existing test script.

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
npm test --workspace apps/api
npm run build --workspace apps/api

If build cannot run due to dependency installation restrictions, document the blocker clearly.

Return:

- Summary of implementation
- Files changed
- Test/build results
- Any assumptions or risks

## Gemini Audit Prompt

Audit the safe query execution endpoint.

This audit must produce a complete diagnostic report. Do not return only PASS or FAIL. If the verdict is FAIL, every failing item must be listed with file path, reason, and required fix.

Allowed files:

- apps/api/src/app.ts
- apps/api/src/routes/queryRoutes.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/types/query.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/package.json

Verify:

- POST /api/query/execute exists
- Request body requires sql
- SQL safety validation runs before execution
- Blocked SQL is not executed
- Blocked SQL returns isExecuted false
- Blocked SQL includes safety result
- Safe SELECT execution uses existing SQL Server pool
- Query execution logic is isolated from route files
- Response includes isExecuted
- Response includes safety
- Response includes columns
- Response includes rows
- Response includes rowCount
- Response includes executionTimeMs
- Response includes message
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

## Gemini Audit Results

## Verdict

FAIL

## Violations

- File: apps/api/src/routes/queryRoutes.ts
- Requirement: POST /api/query/execute exists
- Problem: The file is missing entirely.
- Required fix: Create the file and implement the `POST /api/query/execute` route.
- File: apps/api/src/services/queryExecutionService.ts
- Requirement: Query execution logic is isolated from route files
- Problem: The service file is missing.
- Required fix: Create the service to handle `executeSafeQuery` logic, including safety validation and database interaction.
- File: apps/api/src/types/query.ts
- Requirement: Response includes isExecuted, safety, columns, rows, rowCount, executionTimeMs, message
- Problem: The types file is missing.
- Required fix: Define `QueryExecutionRequest`, `QueryExecutionResponse`, `QueryColumn`, and `QueryRow` interfaces.
- File: apps/api/src/app.ts
- Requirement: POST /api/query/execute exists
- Problem: The endpoint is not registered in the application builder.
- Required fix: Import `registerQueryRoutes` and call it within `buildApp`.
- File: apps/api/src/services/queryExecutionService.test.ts
- Requirement: SQL safety validation runs before execution
- Problem: The test file is missing.
- Required fix: Implement tests verifying that blocked SQL returns `isExecuted: false` and includes safety results.

## Regressions

- None. Existing health and schema endpoints remain functional.

## Drift risks

- Architecture drift: The absence of the query execution layer delays the core functionality of the Sequel City platform (learner SQL execution) and prevents downstream integration.
- Implement all missing files and logic as specified in WP-008:

## Final Decision
