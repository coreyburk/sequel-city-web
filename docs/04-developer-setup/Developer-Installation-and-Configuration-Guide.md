# Developer Installation and Configuration Guide

## Purpose

This guide defines the validated developer installation and configuration workflow for Sequel City Web Detective. It is based on the setup steps and troubleshooting outcomes that were confirmed during successful development on multiple machines.

Use this document as the master reference for:

- first-time developer installation
- local runtime configuration
- SQL Server connectivity setup
- startup validation
- smoke testing

## Supported Environment

The validated development workflow assumes:

- Windows 10 or Windows 11
- local SQL Server instance
- local Node.js and npm installation
- repository checked out locally
- frontend started with Vite using `npm run dev`
- backend available locally on the expected API port

This guide is intentionally written for the environment that was actually validated during development. If you are using a different OS, containerized SQL Server, or a remote SQL host, treat those as deviations that require separate validation.

## Required Software

Install the following before starting setup:

- Git
- Node.js LTS
- npm
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)

Recommended validation commands:

```powershell
git --version
node --version
npm --version
```

## Repository Clone

Clone the repository locally:

```powershell
git clone <REPOSITORY-URL>
cd SequelCityWeb
```

If the repository already exists locally, update it:

```powershell
git pull
```

## Install Project Dependencies

Install dependencies from the repository root:

```powershell
npm install
```

Important:

- Run `npm install` from the repository root, not from a nested folder.
- If installation partially fails, resolve the error before attempting startup.
- In restricted environments, Vite or esbuild may encounter `EPERM` errors. See [Troubleshooting-Reference.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Troubleshooting-Reference.md).

## SQL Server Configuration

The application depends on a reachable local SQL Server instance with SQL authentication enabled and TCP/IP available on port `1433`.

Validated requirements:

- SQL Server service is running
- SQL Server Authentication is enabled
- TCP/IP is enabled
- SQL Server is listening on port `1433`
- the SQL login `sequel_web_user` exists
- the application database user exists and has `db_datareader`

## Enable SQL Server Authentication

Open SQL Server Management Studio and connect using Windows authentication.

Enable mixed-mode authentication:

1. In Object Explorer, right-click the SQL Server instance.
2. Select `Properties`.
3. Open the `Security` page.
4. Select `SQL Server and Windows Authentication mode`.
5. Select `OK`.

Restart the SQL Server service after changing authentication mode.

You can restart the service from SQL Server Configuration Manager or from an elevated terminal if your environment allows it.

## Enable TCP/IP

Open SQL Server Configuration Manager and enable TCP/IP:

1. Open `SQL Server Network Configuration`.
2. Select `Protocols for <YourInstanceName>`.
3. Confirm `TCP/IP` is `Enabled`.
4. If it is disabled, enable it.
5. Restart the SQL Server service.

## Confirm Port 1433 Is Listening

The validated runtime expects SQL Server to be listening on port `1433`.

Check for a listening process:

```powershell
netstat -ano | findstr :1433
```

Expected result:

- at least one line shows `LISTENING` on `0.0.0.0:1433`, `127.0.0.1:1433`, or the machine hostname binding

If nothing is listening on `1433`, review TCP/IP configuration and SQL Server port settings, then restart the SQL Server service.

## Create the SQL Login

If `sequel_web_user` does not already exist, create it in SSMS or by running a SQL script while connected as an administrator.

Example:

```sql
USE [master];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE name = 'sequel_web_user'
)
BEGIN
    CREATE LOGIN [sequel_web_user]
    WITH PASSWORD = 'ReplaceWithStrongPasswordHere';
END;
GO
```

Record the password securely and use the same value in the `.env` configuration.

## Create the Database User

Map the login into the application database.

Example:

```sql
USE [SequelCity];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = 'sequel_web_user'
)
BEGIN
    CREATE USER [sequel_web_user]
    FOR LOGIN [sequel_web_user];
END;
GO
```

If your validated local database name differs, replace `SequelCity` with the actual application database name used in your environment.

## Assign db_datareader

Grant read access required by the application:

```sql
USE [SequelCity];
GO

ALTER ROLE [db_datareader]
ADD MEMBER [sequel_web_user];
GO
```

If your environment requires additional roles for local development, document that separately before expanding permissions here. This guide reflects the validated minimum.

## .env Configuration

Confirm the local `.env` file is present and correctly configured for your machine.

Required principles:

- server name must point to the local SQL Server host
- use `localhost` instead of `127.0.0.1` when SQL TLS validation is involved
- login name must be `sequel_web_user`
- password must match the SQL login password
- database name must match the application database
- frontend and backend URLs must match the runtime ports used locally

Validated guidance:

- Prefer `localhost` over `127.0.0.1` for SQL Server host configuration.
- `localhost` was more reliable for TLS/certificate validation in the validated development workflow.

Example pattern:

```dotenv
DB_HOST=localhost
DB_PORT=1433
DB_NAME=SequelCity
DB_USER=sequel_web_user
DB_PASSWORD=ReplaceWithActualPassword
```

If the project uses different variable names in its `.env` file, keep the project-specific names but preserve the same values and host guidance.

## Localhost TLS Guidance

Use `localhost` for the SQL host unless there is a validated reason not to.

Why:

- `localhost` was consistently more reliable than `127.0.0.1` for SQL TLS validation in the validated setup workflow
- `127.0.0.1` may trigger certificate name or trust mismatches depending on local SQL configuration and client behavior

If a SQL connection succeeds with `localhost` and fails with `127.0.0.1`, keep `localhost` in `.env` and do not treat that as an application defect.

## Start the Application

From the repository root:

```powershell
npm run dev
```

Expected behavior:

- Vite starts successfully
- frontend development server becomes available on the configured local port
- the backend is reachable on its configured local port
- the application loads without SQL connection errors

If the frontend and backend are started separately in your local workflow, start each service using the project-standard command sequence already used by the team.

## Runtime Validation

Validate the following after startup:

1. The frontend dev server starts without dependency or permission errors.
2. The browser loads the application successfully.
3. The backend responds on its configured port.
4. The application can access the expected schema/data without login failures.
5. No SQL connectivity or TLS errors appear in runtime logs.

## Smoke-Test Queries

Use these queries in SSMS to validate the login, user mapping, and data readability.

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

Confirm role assignment:

```sql
USE [SequelCity];
GO

SELECT rp.name AS role_name, mp.name AS member_name
FROM sys.database_role_members drm
JOIN sys.database_principals rp
    ON drm.role_principal_id = rp.principal_id
JOIN sys.database_principals mp
    ON drm.member_principal_id = mp.principal_id
WHERE rp.name = 'db_datareader'
  AND mp.name = 'sequel_web_user';
```

Confirm the database is readable:

```sql
USE [SequelCity];
GO

SELECT TOP (10) *
FROM INFORMATION_SCHEMA.TABLES;
```

If your application validates against a specific schema or table, add a local environment-specific read query after the checks above.

## Expected Successful Runtime State

A fully successful setup should produce all of the following:

- repository dependencies install successfully with `npm install`
- local `.env` values are present and correct
- SQL Server accepts SQL authentication logins
- TCP/IP is enabled
- SQL Server listens on port `1433`
- `sequel_web_user` login exists
- `sequel_web_user` database user exists
- `sequel_web_user` is a member of `db_datareader`
- SQL host is configured as `localhost`
- `npm run dev` starts the frontend successfully
- the backend is reachable
- the application loads and reads database-backed content without login or schema errors

## Related Runtime Documents

- [Developer-Startup-Workflow.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md)
- [Backend-Setup-and-Validation.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Backend-Setup-and-Validation.md)
- [Frontend-First-Launch-Validation.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md)
- [Troubleshooting-Reference.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Troubleshooting-Reference.md)

After installation and validation, continue with the [Contributor Workflow Guide](../05-development-workflow/Contributor-Workflow-Guide.md).
