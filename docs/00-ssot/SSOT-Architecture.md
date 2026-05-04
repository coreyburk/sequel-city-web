# SSOT Architecture

## Architecture Principle

The application is layered. The database and deterministic services are authoritative. The initial runtime has no AI dependency. Any future AI is advisory only.

## Recommended Initial Stack

| Layer | Recommendation |
|---|---|
| Frontend | React with Vite, or Blazor if the team prefers a .NET-only approach |
| Backend | ASP.NET Core Web API |
| Database | SQL Server Developer Edition or LocalDB |
| Data Access | ADO.NET or Dapper |
| AI Layer | Not part of the initial runtime; future optional advisory enhancement only |
| Audit | Gemini CLI |
| Implementation | Codex CLI or Claude CLI with scoped work packages |

This architecture describes Sequel City Web Detective as a standalone project. It is not DataQuest, not a DataQuest extension, and not a DataQuest Phase II. Development workflow patterns may be reused, but runtime dependencies on DataQuest code, agents, MCP services, or other external systems are not allowed.

## Runtime Layers

### Presentation Layer

Displays case narrative, SQL editor, query results, learner notes, and deterministic messages. The initial version requires no AI UI components. It must not decide correctness, invent schema, directly connect to SQL Server, or bypass backend safety checks.

### API Layer

Exposes endpoints for schema metadata, query execution, case state, notebook entries, and suspect verification. Controllers must stay thin and delegate safety, execution, and progression logic to services.

The API layer must support fully local play from a fresh setup and must not require internet access, cloud services, external APIs, MCP, Ollama, or LLM runtimes.

### Application Layer

Orchestrates SQL safety checks, approved query execution, result normalization, and deterministic case progression. Any future AI advisory prompts are out of the initial runtime scope.

### Domain Layer

Defines deterministic concepts such as query safety, query execution outcome, case milestone, evidence discovery, and suspect verification result. It contains no SQL Server client code and no AI client code.

### Infrastructure Layer

Connects to SQL Server, executes approved SQL, retrieves schema metadata, and reads configuration. It must not decide learner progression or override safety rules.

## Authority Model

| Concern | Authority |
|---|---|
| Database contents | SQL Server database |
| Query execution | Backend infrastructure after deterministic safety approval |
| Query safety | Deterministic safety service |
| Case progression | Deterministic case progression service driven only by verified query results or deterministic result-pattern checks |
| Suspect verification | Database-backed verification path |
| Hints and tutoring | Future Optional Enhancement - Advisory Only - Not Required for Initial Version |
| Documentation truth | SSOT package |

Database query results and database-backed evidence are authoritative. AI must not determine correctness, advance case state, invent schema, invent data, or override database results.

## Local Configuration

The backend should read the database connection string from local configuration. Do not hard-code machine-specific server names in source code.

The initial runtime must be self-contained and locally hosted so a student can launch and play from a fresh setup using the local SequelCityCrimesDB database.

```json
{
  "ConnectionStrings": {
    "SequelCityCrimesDb": "Server=(localdb)\\MSSQLLocalDB;Database=SequelCityCrimesDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```
