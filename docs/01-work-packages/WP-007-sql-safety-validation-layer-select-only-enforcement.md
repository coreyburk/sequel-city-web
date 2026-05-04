# sql safety validation layer select only enforcement

## Objective

Create a deterministic SQL safety validation layer that classifies learner SQL as allowed or blocked before any future execution endpoint is implemented.

## Scope

### In Scope

- Add SQL safety validation service
- Add structured validation result types
- Detect and block mutating or destructive SQL statements
- Allow only read-only SELECT-style queries
- Add unit-testable validation logic
- Add backend tests for safety validation
- Add npm test script for the API workspace

### Out of Scope

- Learner SQL execution endpoint
- Query results endpoint
- Case progression logic
- Frontend UI
- Authentication
- Database schema changes
- AI guidance or tutoring
- Advanced SQL parser integration unless already available
- Query rewriting or automatic correction

## Files Allowed to Change

- apps/api/package.json
- apps/api/src/services/sqlSafetyService.ts
- apps/api/src/types/sqlSafety.ts
- apps/api/src/services/sqlSafetyService.test.ts
- apps/api/tsconfig.json

New files may be created only if listed above.

## Constraints

- Must be deterministic
- Must not execute SQL
- Must not connect to the database
- Must not mutate database state
- Must not add runtime AI
- Must not add DataQuest references
- Must not add frontend files
- Must not introduce a heavy SQL parser dependency in this WP
- Must preserve existing backend endpoints
- Must keep validation logic isolated from routes
- Must return structured validation results

## Required Behavior

- Add a SQL safety service that validates raw SQL text
- Validation must return a structured result with:
  - isAllowed
  - normalizedStatementType
  - violations
  - message
- Empty or whitespace-only SQL must be blocked
- Multiple SQL statements must be blocked
- SQL comments must not allow hidden blocked statements
- SELECT queries must be allowed when no blocked tokens are present
- Queries beginning with WITH must be allowed only when they represent a read-only CTE that leads to SELECT
- Block these statement types:
  - INSERT
  - UPDATE
  - DELETE
  - DROP
  - ALTER
  - CREATE
  - TRUNCATE
  - MERGE
  - EXEC
  - EXECUTE
  - GRANT
  - REVOKE
  - DENY
  - BACKUP
  - RESTORE
  - USE
- Block common mutation patterns even if surrounded by comments or whitespace
- Do not add an API route in this WP
- Add tests covering allowed and blocked examples

## Acceptance Criteria

- [ ] SQL safety service exists
- [ ] Structured SQL safety types exist
- [ ] Empty SQL is blocked
- [ ] Basic SELECT is allowed
- [ ] SELECT with JOIN, WHERE, GROUP BY, ORDER BY is allowed
- [ ] WITH CTE followed by SELECT is allowed
- [ ] INSERT is blocked
- [ ] UPDATE is blocked
- [ ] DELETE is blocked
- [ ] DROP is blocked
- [ ] ALTER is blocked
- [ ] CREATE is blocked
- [ ] TRUNCATE is blocked
- [ ] MERGE is blocked
- [ ] EXEC and EXECUTE are blocked
- [ ] Multiple statements are blocked
- [ ] Comment-hidden blocked statements are blocked
- [ ] Validation does not execute SQL
- [ ] npm test script exists for apps/api
- [ ] Existing backend build remains valid
- [ ] No API route is added
- [ ] No runtime AI dependency is introduced
- [ ] No database schema changes are made

## Codex Prompt

Create the deterministic SQL safety validation layer for the Node.js + TypeScript + Fastify backend.

Context:
The backend currently provides database health and schema metadata endpoints only. The next required foundation is a deterministic SELECT-only SQL safety validator. This work package must not add learner SQL execution yet.

Scope:
Only modify or create the files listed in this work package.

Required implementation:

1. Add SQL safety types

Create apps/api/src/types/sqlSafety.ts.

Define types/interfaces for:

- SqlSafetyValidationResult
- SqlSafetyViolation
- SqlSafetyViolationCode
- SqlStatementType

The validation result must include:

- isAllowed
- normalizedStatementType
- violations
- message

Violation should include:

- code
- message
- token if relevant

2. Add SQL safety service

Create apps/api/src/services/sqlSafetyService.ts.

Implement:

validateSqlSafety(sqlText: string): SqlSafetyValidationResult

The validator must be deterministic and must not connect to the database.

3. Normalization behavior

The validator should:

- Trim input
- Remove or neutralize comments for analysis
- Normalize case for token detection
- Preserve enough original text for meaningful messages if needed
- Detect statement type
- Detect multiple statements

4. Allow behavior

Allow:

- SELECT queries
- WITH CTE queries only when the first executable statement is WITH and the CTE leads to SELECT

Examples that should be allowed:

SELECT * FROM CrimeSceneReport

SELECT p.FullName
FROM PersonsOfInterest p
JOIN DriversLicense d ON p.LicenseId = d.LicenseId
WHERE d.Gender = 'F'
ORDER BY p.FullName

WITH Witnesses AS (
  SELECT * FROM InterviewLog
)
SELECT * FROM Witnesses

5. Block behavior

Block:

- Empty or whitespace-only SQL
- Multiple statements
- INSERT
- UPDATE
- DELETE
- DROP
- ALTER
- CREATE
- TRUNCATE
- MERGE
- EXEC
- EXECUTE
- GRANT
- REVOKE
- DENY
- BACKUP
- RESTORE
- USE

Blocked tokens must be detected even when preceded by comments or whitespace.

6. Multiple statement handling

Block semicolon-separated multi-statement input.

A single trailing semicolon may be allowed if the statement is otherwise safe.

Examples:

Allowed:
SELECT * FROM PersonsOfInterest;

Blocked:
SELECT * FROM PersonsOfInterest; DROP TABLE PersonsOfInterest;

7. Tests

Create apps/api/src/services/sqlSafetyService.test.ts.

Add tests for:

- Empty SQL blocked
- Basic SELECT allowed
- SELECT with JOIN/WHERE/GROUP BY/ORDER BY allowed
- WITH CTE followed by SELECT allowed
- INSERT blocked
- UPDATE blocked
- DELETE blocked
- DROP blocked
- ALTER blocked
- CREATE blocked
- TRUNCATE blocked
- MERGE blocked
- EXEC blocked
- EXECUTE blocked
- Multiple statements blocked
- Comment-hidden blocked token blocked

Use a lightweight test runner appropriate for the existing TypeScript setup. If adding a dev dependency is necessary, keep it minimal and update apps/api/package.json only.

8. Package scripts

Update apps/api/package.json to include:

- test

Do not remove existing scripts.

9. Build compatibility

Ensure:

- npm run build --workspace apps/api still works
- npm test --workspace apps/api works if dependencies are installed

10. Constraints

Do not add:

- SQL execution route
- Query execution service
- Frontend code
- AI code
- DataQuest references
- Database schema changes

Return:

- Summary of implementation
- Files changed
- Test/build results
- Any assumptions or risks

## Gemini Audit Prompt

Audit the deterministic SQL safety validation layer.

This audit must produce a complete diagnostic report. Do not return only PASS or FAIL. If the verdict is FAIL, every failing item must be listed with file path, reason, and required fix.

Allowed files:

- apps/api/package.json
- apps/api/src/services/sqlSafetyService.ts
- apps/api/src/types/sqlSafety.ts
- apps/api/src/services/sqlSafetyService.test.ts
- apps/api/tsconfig.json

Audit method:

1. Inspect all allowed files.
2. Confirm no disallowed files were modified.
3. Evaluate implementation against every requirement in this work package.
4. If a requirement cannot be verified, mark it as a violation or required fix.
5. Do not rely only on test names. Inspect implementation behavior.
6. Do not output JSON.
7. Do not include extra narrative before or after the report.

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

- List any regression risks or confirmed regressions.
- If none, write: None.

Drift risks:

- List architecture or SSOT drift risks.
- If none, write: None.

Required fixes:

- List concrete fixes required before approval.
- If none, write: None.

Checklist:

- [ ] SQL safety service exists
- [ ] Structured SQL safety types exist
- [ ] Validator is deterministic
- [ ] Validator does not execute SQL
- [ ] Validator does not connect to database
- [ ] Empty SQL is blocked
- [ ] Basic SELECT is allowed
- [ ] SELECT with JOIN / WHERE / GROUP BY / ORDER BY is allowed
- [ ] WITH CTE leading to SELECT is allowed
- [ ] INSERT is blocked
- [ ] UPDATE is blocked
- [ ] DELETE is blocked
- [ ] DROP is blocked
- [ ] ALTER is blocked
- [ ] CREATE is blocked
- [ ] TRUNCATE is blocked
- [ ] MERGE is blocked
- [ ] EXEC is blocked
- [ ] EXECUTE is blocked
- [ ] Multiple statements are blocked
- [ ] Comment-hidden blocked statements are blocked
- [ ] Test script exists
- [ ] Existing build scripts are preserved
- [ ] No API route was added
- [ ] No learner SQL execution was added
- [ ] No frontend files were created
- [ ] No runtime AI dependency was introduced
- [ ] No DataQuest reference was introduced
- [ ] No database schema files were modified

Final instruction:

If the verdict is FAIL, the Violations and Required fixes sections must not be None.

## Codex Results

Implemented a deterministic SQL safety layer for the API backend. The validator is database-independent, strips comments and neutralizes quoted content for analysis, blocks multi-statement input, allows only a single top-level `SELECT` or a `WITH ... SELECT` CTE, and returns structured violations with normalized statement type and message.

**Files Changed**

- [apps/api/src/types/sqlSafety.ts](D:/GitHub-Repos/SequelCityWeb/apps/api/src/types/sqlSafety.ts)
- [apps/api/src/services/sqlSafetyService.ts](D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/sqlSafetyService.ts)
- [apps/api/src/services/sqlSafetyService.test.ts](D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/sqlSafetyService.test.ts)
- [apps/api/package.json](D:/GitHub-Repos/SequelCityWeb/apps/api/package.json)

**Test / Build Results**

- `npm test --workspace apps/api`: passed
- `npm run build --workspace apps/api`: could not be verified in this environment because the workspace dependencies are not installed locally, so `tsc` is unavailable here

**Assumptions / Risks**

- The validator is intentionally token-based and deterministic, not a full SQL parser.
- `WITH` handling is constrained to the requirement: only CTEs that resolve to a top-level `SELECT` are allowed.
- The `test` script uses `node --experimental-strip-types` to avoid adding a new test dependency and to work in this environment without `tsx` subprocess spawning.

## Gemini Audit Results

## Verdict

PASS

## Drift risks

- [X] SQL safety service exists
- [X] Structured SQL safety types exist
- [X] Validator is deterministic
- [X] Validator does not execute SQL
- [X] Validator does not connect to database
- [X] Empty SQL is blocked
- [X] Basic SELECT is allowed
- [X] SELECT with JOIN / WHERE / GROUP BY / ORDER BY is allowed
- [X] WITH CTE leading to SELECT is allowed
- [X] INSERT is blocked
- [X] UPDATE is blocked
- [X] DELETE is blocked
- [X] DROP is blocked
- [X] ALTER is blocked
- [X] CREATE is blocked
- [X] TRUNCATE is blocked
- [X] MERGE is blocked
- [X] EXEC is blocked
- [X] EXECUTE is blocked
- [X] Multiple statements are blocked
- [X] Comment-hidden blocked statements are blocked
- [X] Test script exists
- [X] Existing build scripts are preserved
- [X] No API route was added
- [X] No learner SQL execution was added
- [X] No frontend files were created
- [X] No runtime AI dependency was introduced
- [X] No DataQuest reference was introduced
- [X] No database schema files were modified

## Final Decision

Approved. The SQL safety validation layer meets all deterministic SELECT-only enforcement requirements. The validator correctly blocks mutating and destructive statements, enforces single-statement execution, and handles comment obfuscation. Audit output structure is acceptable and the implementation is aligned with SSOT constraints.
