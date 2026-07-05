# Student Tester Package

## Purpose

This document explains how to create and use a local Sequel Detective package for a small student pilot test.

The package is local-first. It does not provide production hosting, SQL Server installation, database restoration automation, or a standalone installer.

## Instructor: Build The Package

From the repository root:

```powershell
npm run package:student
```

The command creates a timestamped package under the current user's temp directory and prints the artifact path.

The package includes:

- root npm workspace files
- `Start-SequelDetective.cmd`
- `scripts/setup-local-sql-accounts.ps1`
- API and web source needed for local install, build, and startup
- database SQL setup files
- running and release-readiness documentation
- `docs/09-release-readiness/student-install-and-run-guide.md`
- this student-tester guide

The package excludes:

- `.git`
- `node_modules`
- `apps/api/.env`
- build output
- coverage output
- Playwright output
- local logs

## Student: Required Software

Each testing machine needs:

- Windows
- Node.js and npm
- Microsoft SQL Server
- a local browser
- a local `SequelCityCrimesDB` database restored from the provided database SQL files or a database prepared by the instructor

SQL Server must be running, TCP/IP must be enabled, and port `1433` must be reachable locally.

## Student: Extract And Install

For the student-facing handout, use `docs/09-release-readiness/student-install-and-run-guide.md`.

Extract the package to a local folder, then double-click:

```text
Start-SequelDetective.cmd
```

The launcher checks Node/npm, creates `apps/api/.env` with local classroom defaults when needed, runs `npm install` when dependencies are missing, starts the app, and opens the browser.
On first run, the launcher writes local classroom defaults and the backend attempts to create or repair the Sequel Detective SQL accounts through Windows-integrated bootstrap authority when the machine allows it.

## Student: Configure The Backend

Most pilot students should not create `apps/api/.env` by hand. The launcher creates it automatically.

If manual setup is required, use this template:

```dotenv
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=sequel_web_user
SQLSERVER_PASSWORD=SQL-Web-PasSW0rd!
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
SQLSERVER_BOOTSTRAP_MODE=apply
```

Use `localhost` for `SQLSERVER_HOST` unless the instructor gives a different validated host.

## Student: Start The App

From the extracted package folder:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Confirm Readiness

In the app, open the Health Status area and confirm:

- API status is ready
- database status is connected
- bootstrap status is ready
- schema status is ready

Useful smoke-test query:

```sql
SELECT DB_NAME() AS CurrentDatabase;
```

The returned database should be `SequelCityCrimesDB`.

## Bootstrap Boundary

Sequel Detective has an existing classroom bootstrap path, but it has a specific boundary.

It can:

- verify that the app database is reachable
- report database, bootstrap, and schema readiness
- create or repair the local `sequel_web_user` and `sequel_bootstrap_user` SQL accounts when Windows-integrated local permissions allow it
- apply Sequel Detective database migrations when the local SQL Server permissions allow it
- expose an Admin Mode `Apply Required Upgrade` action when an in-app upgrade is available

It cannot:

- install SQL Server
- enable SQL Server TCP/IP
- restore the base `SequelCityCrimesDB`
- bypass local Windows or SQL Server permission rules

If Health Status reports that bootstrap is degraded, open Admin Mode and use `Apply Required Upgrade` if the button is available. If the button is not available or the database is unreachable, the instructor must finish the local SQL Server setup first.

## Instructor: Account Repair Fallback

If the student launcher cannot create the local SQL accounts automatically, run PowerShell as a local Windows administrator from the extracted package folder:

```powershell
scripts\setup-local-sql-accounts.ps1
```

The script is idempotent. It creates or repairs:

- SQL login and database user `sequel_web_user`
- `db_datareader` membership for `sequel_web_user`
- SQL login and database user `sequel_bootstrap_user`
- `db_owner` membership for `sequel_bootstrap_user`

This is account provisioning only. It does not drop, create, or restore `SequelCityCrimesDB`.

## Known Pilot Limits

- The app runs locally on the tester machine.
- Both API and web processes must stay running while testing.
- The backend owns SQL safety checks and only allows read-only query execution.
- The frontend is not a standalone database client.
- The student package is for pilot testing, not broad public distribution.

## Feedback To Report

Ask testers to report:

- whether `npm install` succeeded
- whether `npm run dev` started both services
- Health Status messages if readiness fails
- the exact query and screen where they got stuck
- whether the Case 004 guidance made the next step clear
- whether the final resolution felt complete
