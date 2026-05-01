# SSOT Architecture

## Architecture Principle

The application is layered. The database and deterministic services are authoritative. AI is advisory only.

## Recommended Initial Stack

| Layer | Recommendation |
|---|---|
| Frontend | React with Vite, or Blazor if the team prefers a .NET-only approach |
| Backend | ASP.NET Core Web API |
| Database | SQL Server Developer Edition or LocalDB |
| Data Access | ADO.NET or Dapper |
| AI Layer | Deferred until deterministic execution and case flow are stable |
| Audit | Gemini CLI |
| Implementation | Codex CLI or Claude CLI with scoped work packages |

## Runtime Layers

### Presentation Layer

Displays case narrative, SQL editor, query results, learner notes, deterministic messages, and later advisory AI guidance. It must not decide correctness, invent schema, directly connect to SQL Server, or bypass backend safety checks.

### API Layer

Exposes endpoints for schema metadata, query execution, case state, notebook entries, and suspect verification. Controllers must stay thin and delegate safety, execution, and progression logic to services.

### Application Layer

Orchestrates SQL safety checks, approved query execution, result normalization, case progression, and optional AI advisory prompts later.

### Domain Layer

Defines deterministic concepts such as query safety, query execution outcome, case milestone, evidence discovery, and suspect verification result. It contains no SQL Server client code and no AI client code.

### Infrastructure Layer

Connects to SQL Server, executes approved SQL, retrieves schema metadata, and reads configuration. It must not decide learner progression or override safety rules.

## Authority Model

| Concern | Authority |
|---|---|
| Database contents | SQL Server database |
| Query execution | Backend infrastructure after safety approval |
| Query safety | Deterministic safety service |
| Case progression | Deterministic case progression service |
| Suspect verification | Database-backed verification path |
| Hints and tutoring | AI advisory layer, when enabled |
| Documentation truth | SSOT package |

## Local Configuration

The backend should read the database connection string from local configuration. Do not hard-code machine-specific server names in source code.

```json
{
  "ConnectionStrings": {
    "SequelCityCrimesDb": "Server=(localdb)\\MSSQLLocalDB;Database=SequelCityCrimesDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```
