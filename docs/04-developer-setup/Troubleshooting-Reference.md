# Troubleshooting Reference

## Purpose

This reference documents common setup and startup failures observed during validated developer installation and local runtime setup for Sequel City Web Detective.

Use this document together with the master setup guide:

- [Developer-Installation-and-Configuration-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md)

## npm Failures

### Symptoms

- `npm install` fails
- missing package errors appear during startup
- `npm run dev` fails immediately after clone

### Likely Causes

- dependencies were never installed
- `npm install` was run from the wrong directory
- Node.js or npm is missing or incompatible
- prior install left a partially corrupted dependency tree

### Fixes

Run from the repository root:

```powershell
npm install
```

Validate tool availability:

```powershell
node --version
npm --version
```

If install still fails, resolve the specific package error before moving to runtime validation.

## SQL Login Failures

### Symptoms

- login failed for user `sequel_web_user`
- application reports SQL authentication errors
- backend starts but database access fails

### Likely Causes

- `sequel_web_user` does not exist as a SQL login
- the password in `.env` does not match the SQL login password
- SQL authentication is disabled
- the database user mapping is missing

### Fixes

Confirm the login exists:

```sql
SELECT name
FROM sys.sql_logins
WHERE name = 'sequel_web_user';
```

Confirm the database user exists:

```sql
USE [SequelCity];
GO

SELECT name
FROM sys.database_principals
WHERE name = 'sequel_web_user';
```

If missing, create the login and user using the master setup guide.

## SQL Authentication Disabled

### Symptoms

- SQL logins fail even when username and password are correct
- Windows-authenticated SSMS sessions work, but application login does not

### Likely Causes

- SQL Server is configured for Windows authentication only

### Fixes

Enable `SQL Server and Windows Authentication mode` in SQL Server instance properties, then restart SQL Server.

See:

- [Developer-Installation-and-Configuration-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md)

## TCP/IP Disabled

### Symptoms

- application cannot connect to SQL Server over the configured host and port
- local SQL Server appears installed, but connections time out or fail remotely through the client stack

### Likely Causes

- SQL Server TCP/IP protocol is disabled

### Fixes

Open SQL Server Configuration Manager, enable `TCP/IP`, and restart the SQL Server service.

## Port 1433 Unavailable

### Symptoms

- connection refused
- connection timeout
- SQL Server hostname resolves, but connection cannot be established

### Likely Causes

- SQL Server is not listening on `1433`
- another process owns the port
- SQL Server service is stopped
- TCP/IP configuration is incomplete

### Fixes

Check port usage:

```powershell
netstat -ano | findstr :1433
```

If nothing is listening:

- verify SQL Server service is running
- verify TCP/IP is enabled
- verify SQL Server is configured to listen on `1433`
- restart SQL Server after changes

## localhost vs 127.0.0.1 TLS Issue

### Symptoms

- SQL connection fails with certificate, TLS, trust, or host validation errors
- `127.0.0.1` fails while `localhost` works

### Likely Causes

- local SQL TLS validation is more reliable with `localhost`
- certificate or hostname validation does not align with `127.0.0.1`

### Fixes

Update the SQL host in `.env` to:

```dotenv
DB_HOST=localhost
```

Validated guidance:

- prefer `localhost`
- do not switch to `127.0.0.1` unless it has been explicitly validated in your environment

## Backend Unavailable

### Symptoms

- frontend loads but API requests fail
- browser network calls return connection refused or 5xx errors
- application shell loads with no data

### Likely Causes

- backend process is not running
- backend is running on a different port than expected
- backend failed during startup because of SQL connectivity or `.env` issues

### Fixes

- start the backend using the team-standard local command flow
- verify the configured backend port
- review backend logs for SQL, schema, or environment-variable failures
- confirm frontend configuration points to the correct backend URL

## Schema Unavailable

### Symptoms

- login succeeds but data access fails
- runtime errors mention missing tables, views, or schemas
- smoke-test queries succeed against the server but not against expected application objects

### Likely Causes

- wrong database name in `.env`
- application database is missing or not restored on the local machine
- `sequel_web_user` is mapped incorrectly

### Fixes

Confirm the database name configured in `.env`.

Confirm table visibility:

```sql
USE [SequelCity];
GO

SELECT TOP (10) *
FROM INFORMATION_SCHEMA.TABLES;
```

If expected objects are missing, correct the database target or restore the required database locally.

## .env Issues

### Symptoms

- startup succeeds partially but runtime services connect to the wrong host, port, database, or API
- login failures continue after SQL configuration looks correct
- frontend and backend behave inconsistently across machines

### Likely Causes

- wrong SQL host
- wrong database name
- wrong login or password
- wrong frontend or backend port value
- missing `.env` file

### Fixes

Review and correct the local `.env` values.

Validated checks:

- SQL host should be `localhost`
- SQL port should be `1433`
- SQL login should be `sequel_web_user`
- password must match the SQL login password exactly
- database name must match the local database actually being used

## Vite or esbuild EPERM

### Symptoms

- `npm install` or `npm run dev` fails with `EPERM`
- esbuild binary access fails
- Vite startup fails in a restricted or security-controlled environment

### Likely Causes

- antivirus or endpoint protection is locking files
- the environment restricts binary execution or file replacement under `node_modules`
- the install was interrupted, leaving invalid artifacts

### Fixes

Retry dependency installation from the repository root:

```powershell
npm install
```

If the issue persists:

- close terminals or editors that may be locking files
- retry from a normal user shell with the repo in a writable location
- exclude the repository from local security tooling if allowed by policy
- delete and reinstall dependencies only if your environment allows it and you understand the local impact

If your team has a validated machine policy exception for `esbuild`, apply that exception before retrying.

## Frontend or Backend Port Conflicts

### Symptoms

- startup reports port already in use
- frontend opens on an unexpected port
- backend fails to bind to its configured port

### Likely Causes

- another local service is already using the frontend or backend port
- a previously started dev server is still running
- `.env` points to ports that do not match the active local services

### Fixes

Identify the process using the port:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :8000
```

Use the actual frontend and backend ports used by this project on your machine. Replace the sample ports above with the real project ports if they differ.

Then:

- stop the conflicting process
- restart the correct frontend or backend service
- update `.env` or runtime configuration if the expected ports changed

## Quick Validation Checklist

When local runtime fails, verify these in order:

1. `npm install` completed at the repository root.
2. `.env` exists and uses `localhost` for SQL host.
3. SQL authentication is enabled.
4. TCP/IP is enabled.
5. SQL Server is listening on `1433`.
6. `sequel_web_user` exists as a login.
7. `sequel_web_user` exists in the application database.
8. `sequel_web_user` has `db_datareader`.
9. backend is running and reachable.
10. frontend is running on the expected local port.
