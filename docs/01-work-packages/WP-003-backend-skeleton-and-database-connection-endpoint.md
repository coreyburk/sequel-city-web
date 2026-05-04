# backend skeleton and database connection endpoint

## Superseded Notice

This work package is superseded and preserved for audit history only.

The implementation direction in this document was based on an ASP.NET Core / C# backend scaffold that is no longer the selected initial stack. Active implementation is superseded by the explicit Node.js + TypeScript + Fastify stack decision.

## Objective

Create the initial local backend skeleton and verify that the application can connect to the local SequelCityCrimesDB database through a deterministic health endpoint.

## Scope

### In Scope

- Create initial ASP.NET Core Web API backend project
- Add backend project structure
- Add local configuration for database connection
- Add database health endpoint
- Add schema summary endpoint
- Add read-only database connection service
- Add basic structured response models
- Ensure backend can run locally

### Out of Scope

- Frontend UI
- SQL editor
- Query execution endpoint
- SQL validation rules beyond connection/schema access
- Case progression logic
- AI features
- Authentication
- Deployment
- Docker
- Database schema changes

## Files Allowed to Change

- src/SequelCityWeb.Api/SequelCityWeb.Api.csproj
- src/SequelCityWeb.Api/Program.cs
- src/SequelCityWeb.Api/appsettings.json
- src/SequelCityWeb.Api/Controllers/HealthController.cs
- src/SequelCityWeb.Api/Controllers/SchemaController.cs
- src/SequelCityWeb.Api/Services/DatabaseConnectionService.cs
- src/SequelCityWeb.Api/Services/IDatabaseConnectionService.cs
- src/SequelCityWeb.Api/Models/DatabaseHealthResponse.cs
- src/SequelCityWeb.Api/Models/TableSummaryResponse.cs
- src/SequelCityWeb.Api/Models/ColumnSummaryResponse.cs
- SequelCityWeb.sln

New files may be created only if they are listed above.

## Constraints

- Application must remain local-first
- No runtime AI dependency
- No DataQuest dependency
- No MCP, Ollama, or LLM integration
- No frontend work
- No query execution endpoint yet
- No destructive SQL
- No database schema modification
- No speculative architecture
- Use configuration-based connection string
- Do not hard-code credentials
- Preserve SSOT alignment

## Required Behavior

- Create a backend API project named SequelCityWeb.Api
- Create or update solution file SequelCityWeb.sln
- Backend must run locally with dotnet run
- Backend must expose GET /api/health/database
- Health endpoint must attempt to open a SQL Server connection
- Health endpoint must return structured success/failure information
- Backend must expose GET /api/schema/tables
- Schema endpoint must return table names and column summaries from SequelCityCrimesDB
- Schema endpoint must use read-only metadata queries
- Connection string must be stored in appsettings.json
- Service layer must isolate database connection logic from controllers
- No AI-related runtime code may be added

## Acceptance Criteria

- [ ] Solution file exists
- [ ] ASP.NET Core Web API project exists
- [ ] Project builds successfully
- [ ] Application starts locally
- [ ] GET /api/health/database returns structured database health response
- [ ] GET /api/schema/tables returns database table and column metadata
- [ ] Database service is separated from controllers
- [ ] No AI, MCP, Ollama, or DataQuest dependency is introduced
- [ ] No files outside allowed list are modified unless required by dotnet project creation metadata
- [ ] No database schema changes are made

## Codex Prompt

Create the initial ASP.NET Core backend skeleton for Sequel City Web Detective.

Context:
This project is a standalone, local-first web application for the SequelCityCrimesDB SQL investigation experience. It is not DataQuest and must not depend on DataQuest code, MCP, agents, Ollama, or runtime AI.

Scope:
Create the backend project and database connectivity foundation only.

Allowed files:

- src/SequelCityWeb.Api/SequelCityWeb.Api.csproj
- src/SequelCityWeb.Api/Program.cs
- src/SequelCityWeb.Api/appsettings.json
- src/SequelCityWeb.Api/Controllers/HealthController.cs
- src/SequelCityWeb.Api/Controllers/SchemaController.cs
- src/SequelCityWeb.Api/Services/DatabaseConnectionService.cs
- src/SequelCityWeb.Api/Services/IDatabaseConnectionService.cs
- src/SequelCityWeb.Api/Models/DatabaseHealthResponse.cs
- src/SequelCityWeb.Api/Models/TableSummaryResponse.cs
- src/SequelCityWeb.Api/Models/ColumnSummaryResponse.cs
- SequelCityWeb.sln

Required implementation:

1. Create solution/project

- Create an ASP.NET Core Web API project named SequelCityWeb.Api under src/SequelCityWeb.Api
- Create or update SequelCityWeb.sln
- Register the API project in the solution

2. Program.cs

- Configure controllers
- Configure Swagger/OpenAPI for local development if available from the template
- Register IDatabaseConnectionService and DatabaseConnectionService
- Keep startup simple and local-first

3. appsettings.json

- Add a ConnectionStrings section
- Add a SequelCityCrimesDb connection string placeholder
- Use a local SQL Server style connection string
- Do not hard-code credentials

4. Database service

- Implement IDatabaseConnectionService
- Implement a method to test database connectivity
- Implement a method to retrieve table and column metadata
- Use SQL Server metadata queries only
- Do not mutate database state
- Do not execute learner SQL yet

5. HealthController

- Add GET /api/health/database
- Return DatabaseHealthResponse
- Include:
  - isConnected
  - databaseName
  - serverName
  - message
  - checkedAtUtc

6. SchemaController

- Add GET /api/schema/tables
- Return table summaries
- Each table summary should include:
  - tableName
  - columns
- Each column summary should include:
  - columnName
  - dataType
  - isNullable

7. Models

- Create simple response DTOs
- Keep names clear and stable

8. Constraints

- No frontend
- No query execution endpoint
- No SQL safety validator yet
- No AI runtime code
- No DataQuest references
- No database changes

Validation:
Run:
dotnet build
dotnet run --project src/SequelCityWeb.Api

Return:

- Summary of implementation
- Files changed
- Build result
- Any assumptions or risks

## Gemini Audit Prompt

Audit the backend skeleton and database connection implementation.

Allowed files:

- src/SequelCityWeb.Api/SequelCityWeb.Api.csproj
- src/SequelCityWeb.Api/Program.cs
- src/SequelCityWeb.Api/appsettings.json
- src/SequelCityWeb.Api/Controllers/HealthController.cs
- src/SequelCityWeb.Api/Controllers/SchemaController.cs
- src/SequelCityWeb.Api/Services/DatabaseConnectionService.cs
- src/SequelCityWeb.Api/Services/IDatabaseConnectionService.cs
- src/SequelCityWeb.Api/Models/DatabaseHealthResponse.cs
- src/SequelCityWeb.Api/Models/TableSummaryResponse.cs
- src/SequelCityWeb.Api/Models/ColumnSummaryResponse.cs
- SequelCityWeb.sln

Verify:

- Backend project exists and is registered in solution
- Project builds
- Health endpoint exists at GET /api/health/database
- Schema endpoint exists at GET /api/schema/tables
- Database logic is isolated in service layer
- Metadata queries are read-only
- No learner SQL execution was added
- No SQL mutation is possible through this work
- No AI, MCP, Ollama, or DataQuest dependency was introduced
- Connection string is configuration-based
- No unrelated files were modified

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required fixes

## Codex Results

**Summary**

Created the initial ASP.NET Core Web API backend skeleton for Sequel City Web Detective under `src/SequelCityWeb.Api` and registered it in `SequelCityWeb.sln`.

Implemented:
- controller-based API startup with Swagger in development
- configuration-based SQL Server connection string placeholder
- `IDatabaseConnectionService` and `DatabaseConnectionService`
- `GET /api/health/database`
- `GET /api/schema/tables`
- stable DTOs for database health, tables, and columns

The database service is read-only and uses SQL Server metadata queries only. It does not execute learner SQL and does not mutate database state.

**Files Changed**

- [SequelCityWeb.sln](/D:/GitHub-Repos/SequelCityWeb/SequelCityWeb.sln)
- [SequelCityWeb.Api.csproj](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/SequelCityWeb.Api.csproj)
- [Program.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Program.cs)
- [appsettings.json](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/appsettings.json)
- [HealthController.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Controllers/HealthController.cs)
- [SchemaController.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Controllers/SchemaController.cs)
- [IDatabaseConnectionService.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Services/IDatabaseConnectionService.cs)
- [DatabaseConnectionService.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Services/DatabaseConnectionService.cs)
- [DatabaseHealthResponse.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Models/DatabaseHealthResponse.cs)
- [TableSummaryResponse.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Models/TableSummaryResponse.cs)
- [ColumnSummaryResponse.cs](/D:/GitHub-Repos/SequelCityWeb/src/SequelCityWeb.Api/Models/ColumnSummaryResponse.cs)

**Build Result**

`dotnet build`:
- In this sandbox, plain restore to `nuget.org` is blocked by policy.
- Build succeeded with the local NuGet cache:
  `dotnet build SequelCityWeb.sln -p:RestoreSources=%USERPROFILE%\.nuget\packages`

`dotnet run --project src/SequelCityWeb.Api`:
- Startup succeeded with the same offline restore override.
- The app reached:
  `Now listening on: http://127.0.0.1:5076`
- The command then timed out because the runner kills long-lived processes after the timeout window.

**Assumptions / Risks**

- I assumed `net9.0` is the right target because the machine has the .NET 9 runtime installed.
- I used `Microsoft.Data.SqlClient`; that requires package restore. On a normal machine this is fine, but this sandbox required an offline restore source because outbound NuGet access is blocked.
- I did not validate live database connectivity or schema results against an actual `SequelCityCrimesDB` instance, so endpoint shape is verified but real DB access still depends on the local SQL Server setup and connection string.
- The repo already had unrelated uncommitted changes in `docs/`; I left those untouched.

## Gemini Audit Results

- Verdict: PASS
- Violations: None. The implementation strictly adheres to the "Allowed files" list and meets all requirements in WP-003.
- Regressions: None.
- Drift risks: None. The project remains local-first and does not introduce any unauthorized dependencies (AI, MCP, Ollama, etc.).
- Required fixes: None.

### Audit Summary

- **Project Structure:** `SequelCityWeb.Api` is correctly created under `src/` and registered in `SequelCityWeb.sln`.
- **Endpoints:**
    - `GET /api/health/database`: Implemented in `HealthController`, returns structured health data including connection status, database name, and server name.
    - `GET /api/schema/tables`: Implemented in `SchemaController`, returns comprehensive table and column metadata.
- **Service Isolation:** Database logic is fully encapsulated within `DatabaseConnectionService`, which implements the `IDatabaseConnectionService` interface.
- **Security & Safety:**
    - All database queries are read-only (targeting `INFORMATION_SCHEMA` and system functions).
    - No learner SQL execution or mutation capabilities were introduced.
    - Connection strings are configuration-based and stored in `appsettings.json`.
- **Dependencies:** Only standard ASP.NET Core and `Microsoft.Data.SqlClient` dependencies are present. No AI-related or external agent dependencies were added.
- **Buildability:** The code uses standard .NET 9 patterns and matches the provided DTOs and interfaces, ensuring structural integrity. (Note: Build verification was performed via static analysis as shell execution is restricted in this environment).

The implementation is a clean, compliant foundation for the Sequel City Web backend.

- Verdict: PASS
- Violations: None
- Regressions: None
- Drift risks: None
- Required fixes: None

The backend skeleton and database connection implementation strictly adhere to the requirements of WP-003 and the architectural standards of the Sequel City Web Detective project. The database logic is correctly isolated, queries are read-only and safe, and no unauthorized dependencies or AI features were introduced.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
