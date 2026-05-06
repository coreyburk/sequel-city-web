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
npm run dev --workspace apps/web
```

Expected local URLs after startup:

- Backend API: `http://127.0.0.1:3001`
- Frontend app: `http://127.0.0.1:5173`

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

1. Start the backend:

```powershell
npm run dev --workspace apps/api
```

2. Start the frontend in a second terminal:

```powershell
npm run dev --workspace apps/web
```

3. Open `http://127.0.0.1:5173`.
4. Check the Health Status panel and confirm API, database, and schema details load.
5. Inspect the Schema Explorer and confirm tables and columns render.
6. In Query Runner, run `SELECT DB_NAME() AS CurrentDatabase`.
7. Confirm Query Results shows `CurrentDatabase` and the expected row count.
8. Open Query History, use Refresh History, and confirm the executed query appears.

## Common Troubleshooting

- Root URL returning `Route GET:/ not found` is expected.
- `GET /api/query/execute` returning `404` is expected because the endpoint is `POST` only.
- `Failed to connect to 127.0.0.1:1433` means SQL Server TCP/IP or port configuration is wrong.
- `Login failed for user` means the SQL credentials, authentication mode, or database user mapping is wrong.
