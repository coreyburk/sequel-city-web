# Running Sequel Detective

This is the quickstart for launching the local Sequel Detective application during development, testing, or demo prep.

## Prerequisites

From the repository root, install dependencies once:

```powershell
npm install
```

The app also requires a local SQL Server setup:

- SQL Server service running
- TCP/IP enabled
- port `1433` listening
- local `SequelCityCrimesDB` restored
- SQL login configured with read access to `SequelCityCrimesDB`
- `apps/api/.env` present

## Backend Environment

Create or confirm `apps/api/.env`.

Expected local pattern:

```dotenv
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=sequel_web_user
SQLSERVER_PASSWORD=ReplaceWithActualPassword
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

Use `localhost` for `SQLSERVER_HOST` unless you have separately validated a different SQL Server host.

## Start The App

From the repository root:

```powershell
npm run dev
```

This starts both local processes:

- API: `http://127.0.0.1:3001`
- Web app: `http://127.0.0.1:5173`

Open the web app:

```text
http://127.0.0.1:5173
```

## Confirm It Is Ready

In the browser, confirm:

- health/status panel reports API, database, and schema readiness
- schema explorer loads tables
- Query Lab accepts a safe query
- query history updates after a query runs

Useful smoke-test query:

```sql
SELECT DB_NAME() AS CurrentDatabase;
```

Useful safety check:

```sql
DELETE FROM CrimeSceneReport;
```

The `DELETE` query should be blocked by backend safety validation. Do not treat that as a defect.

## Common Problems

### Frontend Loads But Health Fails

The backend may not be running or may be unreachable. Confirm `npm run dev` is still running and check the API output in the terminal.

### Database Or Schema Fails

Check:

- SQL Server service is running
- `apps/api/.env` exists
- `SQLSERVER_HOST=localhost`
- `SQLSERVER_PORT=1433`
- `SQLSERVER_DATABASE=SequelCityCrimesDB`
- configured SQL login can read the database

### Browser Port Is Different

The expected frontend URL is `http://127.0.0.1:5173`. If Vite reports another port, use the URL printed in the terminal.

## Verification Commands

Run backend checks:

```powershell
npm run test --workspace apps/api
npm run build --workspace apps/api
```

Run frontend checks:

```powershell
npm run test --workspace apps/web
npm run build --workspace apps/web
```

Run the root build:

```powershell
npm run build
```

## Related Docs

- `docs/02-runtime/Developer-Startup-Workflow.md`
- `docs/09-release-readiness/local-runtime-requirements.md`
- `docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md`
- `docs/04-developer-setup/Troubleshooting-Reference.md`
