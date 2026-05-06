# Backend Setup and Validation

## Purpose

This document defines the repeatable backend runtime checklist for the Sequel City Web Detective API before frontend integration begins. Use it to verify local SQL Server connectivity, backend startup, and the core runtime endpoints that the frontend depends on.

## Environment File

Required environment file location:

`apps/api/.env`

Required variables:

- `SQLSERVER_HOST`
- `SQLSERVER_PORT`
- `SQLSERVER_DATABASE`
- `SQLSERVER_USER`
- `SQLSERVER_PASSWORD`
- `SQLSERVER_TRUST_SERVER_CERTIFICATE`

Example configuration with placeholder credentials:

```dotenv
SQLSERVER_HOST=127.0.0.1
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=your_sql_login
SQLSERVER_PASSWORD=your_password_here
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

## SQL Server Requirements

- SQL Server service running
- TCP/IP enabled
- Port `1433` listening
- SQL Server and Windows Authentication mode enabled for SQL logins
- SQL login exists
- Login maps to a database user in `SequelCityCrimesDB`
- Database user has `db_datareader` access

Commands to verify port `1433`:

```powershell
Test-NetConnection 127.0.0.1 -Port 1433
netstat -ano | findstr :1433
```

## Backend Startup

From the repository root:

```powershell
npm install
npm run dev --workspace apps/api
```

Preferred full-stack startup path:

- Use [Developer-Startup-Workflow.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md) and run `npm run dev` from the repository root when starting both backend and frontend together.
- Use `npm run dev --workspace apps/api` when you only need the backend process.

Expected local URL after backend startup:

- Backend API: `http://127.0.0.1:3001`

For the preferred combined startup workflow, use [Developer-Startup-Workflow.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md).

For the frontend startup sequence, browser launch checklist, and first-launch runtime decision, use [Frontend-First-Launch-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md).

## Smoke Tests

Run the backend, then validate these endpoints in order.

### 1. Database Health

Request:

`GET /api/health/database`

Expected result:

- HTTP `200` when the database is reachable
- Response reports `isConnected: true`
- `databaseName` resolves to `SequelCityCrimesDB`
- `serverName` is populated
- `message` indicates the connection succeeded

### 2. Schema Tables

Request:

`GET /api/schema/tables`

Expected result:

- HTTP `200`
- Response has `success: true`
- `data.tables` is present
- `data.relationships` is present
- Returned table metadata is deterministic and UI-ready

### 3. Query Execution

Request:

`POST /api/query/execute`

Example body:

```json
{
  "sql": "SELECT DB_NAME() AS CurrentDatabase"
}
```

Expected result:

- HTTP `200`
- Response has `success: true`
- Result set includes `CurrentDatabase`
- `CurrentDatabase` resolves to `SequelCityCrimesDB`

### 4. Query History

Request:

`GET /api/query/history`

Expected result:

- HTTP `200`
- Response has `success: true`
- `data.records` is present
- The most recent query execution appears in history after the execute smoke test runs

## First-Use Frontend Validation

Use [Frontend-First-Launch-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md) for the full frontend runtime checklist.

## Common Troubleshooting

- Root URL returning `Route GET:/ not found` is expected.
- `GET /api/query/execute` returning `404` is expected because the endpoint is `POST` only.
- `Failed to connect to 127.0.0.1:1433` means SQL Server TCP/IP or port configuration is wrong.
- `Login failed for user` means the SQL credentials, authentication mode, or database user mapping is wrong.
# Related Setup Documentation

- Master setup guide: [Developer-Installation-and-Configuration-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md)
