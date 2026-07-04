# Sequel Detective Student Install And Run Guide

## What You Received

You received a local Sequel Detective test package from your instructor.

This is not a normal app-store installer. It is a local classroom test package that runs on your computer and connects to a local SQL Server database.

## Before You Start

Your computer needs:

- Windows
- Node.js and npm
- Microsoft SQL Server
- a browser
- the `SequelCityCrimesDB` database prepared by your instructor or restored from the provided SQL files
- the database username and password from your instructor

If SQL Server or the database is not ready, the app can open but the investigation will not be ready to use.

## Start The App

1. Extract the zip file to a normal folder, such as:

```text
C:\SequelDetective
```

2. Double-click:

```text
Start-SequelDetective.cmd
```

The launcher will:

- check that Node.js and npm are available
- ask for database settings if `apps\api\.env` does not exist
- install app dependencies if needed
- start Sequel Detective
- open the app in your browser

Leave the launcher window open while you use the app.

## If The Launcher Asks For Database Settings

Use the values from your instructor.

Defaults:

```text
SQL Server host: localhost
SQL Server port: 1433
Database name: SequelCityCrimesDB
Database user: sequel_web_user
```

Enter the database password from your instructor when prompted.

The launcher creates:

```text
apps\api\.env
```

## Manual Start Option

If your instructor asks you to start the app manually, open PowerShell in the extracted folder and run:

```powershell
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5173
```

## Manual Database Settings

If you are not using the launcher, create `apps\api\.env`.

Paste this template into it:

```dotenv
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=sequel_web_user
SQLSERVER_PASSWORD=ReplaceWithInstructorProvidedPassword
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

Replace `ReplaceWithInstructorProvidedPassword` with the password from your instructor.

Do not change the database name unless your instructor tells you to.

## Check That It Is Ready

Open the Health Status area in the app.

You want to see:

- API status: ready
- database status: connected
- bootstrap status: ready
- schema status: ready

Then run this test query:

```sql
SELECT DB_NAME() AS CurrentDatabase;
```

The result should show:

```text
SequelCityCrimesDB
```

## If You See A Bootstrap Warning

The app can sometimes finish a required Sequel Detective database upgrade from Admin Mode.

If the app says bootstrap is degraded:

1. Open Admin Mode.
2. Click `Apply Required Upgrade` if the button is available.
3. Return to Health Status and check readiness again.

This upgrade button does not install SQL Server and does not restore the database. If the database is missing or unreachable, send the Health Status message to your instructor.

## Start The Case

When Health Status is ready:

1. Choose Student Mode.
2. Open Case 004.
3. Follow Samuel's guidance.
4. Use Query Lab to investigate the database.
5. Log clues as you prove them.

## What To Send If Something Fails

Send your instructor:

- what step failed
- the command you ran
- the final error message
- a screenshot of Health Status, if the app opened
- the query you ran, if a query failed

Do not send your `.env` password in screenshots or messages.
