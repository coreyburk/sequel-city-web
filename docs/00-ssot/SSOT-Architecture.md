# SSOT Architecture

## Architecture Principle

The application is layered. The database and deterministic backend services are authoritative. The initial runtime has no AI dependency. Any future AI is advisory only.

## Document Scope

This document owns system layering, runtime boundaries, and local hosting architecture. SQL statement rules are owned by `SSOT-SQL-Safety-Rules.md`. Database tables and relationships are owned by `SSOT-Database-Schema.md`. Deterministic case progression is owned by `SSOT-Case-Progression.md`.

## Technology Decision

The selected initial stack for Sequel City Web Detective is a modern local web application served on `localhost`.

| Layer | Selected Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + TypeScript + Fastify |
| Database | Local SQL Server using `SequelCityCrimesDB` |
| Runtime | Local browser app served from `localhost` |
| AI Layer | Not part of the initial runtime; future optional advisory enhancement only |
| Audit | Gemini CLI |
| Implementation | Codex CLI or Claude CLI with scoped work packages |

`C#` / `ASP.NET Core` is not the selected initial stack. Prior ASP.NET work is preserved only as historical audit context and must not be treated as the active architecture direction.

This architecture describes Sequel City Web Detective as a standalone project. It is not DataQuest, not a DataQuest extension, and not a DataQuest Phase II. Development workflow patterns may be reused, but runtime dependencies on DataQuest code, agents, MCP services, or other external systems are not allowed.

## Runtime Layers

### Presentation Layer

Displays case narrative, SQL editor, query results, learner notes, and deterministic messages. The initial version requires no AI UI components. It must not decide correctness, invent schema, directly connect to SQL Server, duplicate backend SQL validation logic, or bypass backend safety checks.

### API Layer

Exposes deterministic endpoints for schema metadata, read-only query execution, case state, notebook entries, and suspect verification. Route handlers must stay thin and delegate safety, execution, and progression logic to backend services.

The API layer must support fully local play from a fresh setup and must not require internet access, cloud services, external APIs, MCP, Ollama, or LLM runtimes.

### Application Layer

Orchestrates SQL safety checks, approved read-only query execution, result normalization, and deterministic case progression. Any future AI advisory prompts are out of the initial runtime scope.

### Domain Layer

Defines deterministic concepts such as query safety, query execution outcome, case milestone, evidence discovery, and suspect verification result. It contains no SQL Server client code and no AI client code.

### Infrastructure Layer

Connects to SQL Server, executes backend-approved read-only SQL, retrieves schema metadata, and reads configuration. It must not decide learner progression or override safety rules.

## Deterministic Backend Responsibilities

The selected backend remains deterministic and is responsible for:

- database connection
- schema metadata
- SQL safety validation
- read-only SQL execution
- deterministic case progression when implemented by a scoped work package

Frontend code remains presentation-oriented. It may display validation and execution results returned by the backend, but it must not become the authority for SQL safety, query execution, suspect verification, or case progression.

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

## Configuration Model

The backend uses environment-based configuration.

Example `.env` file:

```dotenv
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=your_username
SQLSERVER_PASSWORD=your_password
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

Configuration is loaded using `dotenv`. Credentials are not stored in source control. Each developer provides their own local configuration. The system remains local-first and self-contained. Do not hard-code machine-specific server names in source code.

The initial runtime must be self-contained and locally hosted so a student can launch and play from a fresh setup using the local SequelCityCrimesDB database.
