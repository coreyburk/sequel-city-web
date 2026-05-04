# WP-001: Establish SSOT and Local Database Connection

## Status

Draft

## Objective

Create the initial project documentation baseline and implement the smallest possible application foundation that can connect to the local `SequelCityCrimesDB` database and expose schema metadata through a safe backend endpoint.

## Scope

This work package includes:

1. Add the initial SSOT documentation set.
2. Create a backend project skeleton.
3. Configure a local database connection string.
4. Add a database connectivity health check.
5. Add a schema metadata endpoint that lists tables and columns.
6. Add a deterministic schema service.
7. Add basic error handling for missing or unreachable database connection.

## Out of Scope

Do not implement full frontend game UI, SQL editor, free-form query execution, case progression, suspect verification, AI agents, authentication, cloud deployment, database mutation features, or answer key exposure.

## SSOT References

- `docs/00-ssot/SSOT-Index.md`
- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

## Recommended Repo Structure

```text
SequelCityWeb/
  docs/
    00-ssot/
    01-work-packages/
  src/
    SequelCityWeb.Api/
    SequelCityWeb.Application/
    SequelCityWeb.Domain/
    SequelCityWeb.Infrastructure/
    SequelCityWeb.Web/
  tests/
    SequelCityWeb.Tests/
  database/
    01-SequelCityCrimesDB - Create DB.sql
    02-SequelCityCrimesDB - Insert Data.sql
    03-SequelCityCrimesDB - ForeignKeys.sql
```

## Backend Initial Endpoints

### GET `/api/health/database`

Purpose: Confirm the API can connect to `SequelCityCrimesDB`.

Recommended response:

```json
{
  "database": "SequelCityCrimesDB",
  "canConnect": true,
  "message": "Connected"
}
```

### GET `/api/schema`

Purpose: Return safe schema metadata for learner and AI advisory use.

Recommended response:

```json
{
  "database": "SequelCityCrimesDB",
  "tables": [
    {
      "name": "CrimeSceneReport",
      "columns": [
        { "name": "ReportID", "dataType": "int", "isNullable": false },
        { "name": "CrimeID", "dataType": "int", "isNullable": false }
      ]
    }
  ]
}
```

## Implementation Guidance

Use a thin controller and delegate database work to application or infrastructure services.

Suggested services:

- `IDatabaseHealthService`
- `ISchemaMetadataService`

Suggested models:

- `DatabaseHealthResult`
- `SchemaSnapshot`
- `TableSchema`
- `ColumnSchema`

## Acceptance Criteria

The work is acceptable when:

- The SSOT docs exist in `docs/00-ssot`.
- This work package exists in `docs/01-work-packages`.
- The backend solution builds successfully.
- The database connection string is configurable.
- `/api/health/database` returns a clear success or failure payload.
- `/api/schema` returns actual table and column metadata from SQL Server.
- No answer key data is exposed.
- No learner-submitted SQL execution is implemented yet.
- No AI agent behavior is implemented yet.

## Codex Prompt

You are working in the SequelCityWeb repository.

Implement WP-001 only.

Goal:
Create the initial backend foundation for a locally hosted Sequel City Web Detective application. The only runtime features for this package are database health checking and schema metadata retrieval from the local `SequelCityCrimesDB` SQL Server database.

Required work:

1. Create or update the solution structure as needed for:
   - `src/SequelCityWeb.Api`
   - `src/SequelCityWeb.Application`
   - `src/SequelCityWeb.Domain`
   - `src/SequelCityWeb.Infrastructure`
   - `tests/SequelCityWeb.Tests`
2. Add configurable connection string key:
   - `ConnectionStrings:SequelCityCrimesDb`
3. Implement a database health service.
4. Implement a schema metadata service that reads actual user tables and columns from SQL Server.
5. Add API endpoint:
   - `GET /api/health/database`
6. Add API endpoint:
   - `GET /api/schema`
7. Keep controllers thin.
8. Do not implement free-form SQL execution.
9. Do not expose answer key contents.
10. Do not add AI behavior.
11. Do not refactor unrelated files.

SSOT authority:
Follow all documents in `docs/00-ssot`.

Output requirements:
Provide a concise summary of changed files, design choices, and any manual setup needed to run the API locally.

## Gemini Audit Prompt

Audit the implementation of WP-001 against the SSOT documents.

Check for:

1. Scope compliance.
2. Backend layer separation.
3. Configurable database connection string.
4. Thin API controllers.
5. Deterministic schema metadata retrieval.
6. No free-form SQL execution.
7. No suspect verification implementation.
8. No AI behavior.
9. No answer key exposure.
10. Build or test issues.
11. Any SSOT drift.

Return results in this structure:

- Verdict
- Strengths
- Violations
- Regressions
- Drift risks
- Required fixes
- Non-blocking observations

## Codex Results

Pending.

## Gemini Audit Results

Pending.

## Final Decision

Pending.
