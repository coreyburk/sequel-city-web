# developer-installation-runtime-setup-and-troubleshooting-guide

## Objective

Create a complete developer installation, runtime setup, validation, and troubleshooting guide for Sequel City Web Detective so a new developer, student, or evaluator can reliably clone, configure, launch, validate, and troubleshoot the application on a local Windows machine.

## Scope

### In Scope

- Create full installation documentation
- Document repository cloning
- Document Node.js installation requirements
- Document npm workspace setup
- Document SQL Server installation requirements
- Document SQL authentication configuration
- Document TCP/IP configuration
- Document SQL login and database user creation
- Document .env configuration
- Document startup workflow
- Document runtime validation workflow
- Document smoke-test queries
- Document expected successful runtime state
- Document troubleshooting procedures
- Document validated real-world setup issues and fixes

### Out of Scope

- No frontend code changes
- No backend code changes
- No database schema changes
- No Docker/containerization work
- No deployment automation
- No installer creation
- No PowerShell automation scripts
- No contributor workflow documentation
- No Codex/Gemini workflow documentation
- No AI or heuristic behavior

## Files Allowed to Change

- docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md
- docs/04-developer-setup/Troubleshooting-Reference.md
- docs/02-runtime/Developer-Startup-Workflow.md
- docs/02-runtime/Backend-Setup-and-Validation.md
- docs/02-runtime/Frontend-First-Launch-Validation.md

If docs/04-developer-setup does not exist, create it.

## Constraints

- Documentation-only work package
- Must not change application code
- Must not change backend contracts
- Must not modify database files
- Must not modify SSOT files
- Must reflect actual validated setup behavior
- Must avoid speculative setup instructions
- Must avoid environment assumptions
- Must use copy/paste-ready commands
- Must not introduce AI or heuristic behavior

## Required Behavior

1. Create master installation and setup guide

Create:

docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md

The guide must include:

- Purpose
- Supported environment
- Required software
- Repository cloning
- Node.js installation requirement
- npm install workflow
- SQL Server requirements
- SQL authentication configuration
- TCP/IP configuration
- SQL login creation
- Database user creation
- db_datareader assignment
- Port validation
- .env configuration
- Startup workflow
- Runtime validation
- Smoke-test queries
- Expected successful runtime state
- Shutdown workflow

2. Supported environment section

Document validated environment assumptions:

- Windows 10/11
- SQL Server Developer Edition or Express
- Node.js
- npm
- Modern browser

3. Repository setup section

Include copy/paste-ready commands:

```powershell
git clone <repo>
cd SequelCityWeb
npm install
```

4. SQL Server configuration section

Document:

- SQL authentication enablement
- TCP/IP enablement
- SQL Server restart
- Port 1433 validation
- sequel_web_user creation
- sequel_web_user database mapping
- db_datareader assignment

Include validated SQL commands for:

- CREATE LOGIN
- CREATE USER
- ALTER ROLE db_datareader

5. .env configuration section

Document:

apps/api/.env

Use the validated localhost configuration:

```env
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=sequel_web_user
SQLSERVER_PASSWORD=SQL-Web-Pas$W0rd!
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

Must explicitly document:

- no quotes around password
- localhost preferred over 127.0.0.1
- TLS hostname validation issue discovered during real setup

6. Startup workflow section

Document:

```powershell
npm run dev
```

Document expected runtime URLs:

- frontend: http://127.0.0.1:5173
- backend: http://127.0.0.1:3001

7. Runtime validation section

Document expected frontend state:

Health panel:

- API Status: ok
- Database Status: ok
- Schema Status: ok

Expected metadata:

- Database Name: SequelCityCrimesDB
- Table Count: 12
- Relationship Count: 9

8. Smoke-test query section

Document these queries:

```sql
SELECT DB_NAME() AS CurrentDatabase
```

```sql
SELECT TOP 10 * FROM CrimeSceneReport
```

```sql
DELETE FROM CrimeSceneReport
```

Document expected behavior:

- first query succeeds
- second query returns rows
- third query is blocked by SQL safety enforcement

9. Troubleshooting reference

Create:

docs/04-developer-setup/Troubleshooting-Reference.md

Include sections for:

- npm install failures
- missing node_modules
- SQL login failures
- SQL authentication disabled
- TCP/IP disabled
- port 1433 unavailable
- localhost vs 127.0.0.1 TLS issue
- backend unavailable
- schema unavailable
- .env configuration issues
- frontend/backend port conflicts
- vite/esbuild EPERM issue

For each issue include:

- symptoms
- likely cause
- resolution steps

10. Update runtime docs

Update:

docs/02-runtime/Developer-Startup-Workflow.md

Add references to:

- Developer-Installation-and-Configuration-Guide.md
- Troubleshooting-Reference.md

Update:

docs/02-runtime/Backend-Setup-and-Validation.md

Reference the master installation/setup guide.

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Reference the troubleshooting guide.

11. Verification

Confirm:

- only documentation files were modified
- commands are copy/paste ready
- setup steps match actual validated workflow
- no application code changed

## Acceptance Criteria

1. Developer-Installation-and-Configuration-Guide.md exists.
2. Troubleshooting-Reference.md exists.
3. Setup guide documents supported environment.
4. Setup guide documents repository cloning.
5. Setup guide documents npm install workflow.
6. Setup guide documents SQL Server requirements.
7. Setup guide documents SQL authentication setup.
8. Setup guide includes validated SQL login creation commands.
9. Setup guide includes database user creation commands.
10. Setup guide includes db_datareader assignment.
11. Setup guide documents TCP/IP enablement.
12. Setup guide documents port 1433 validation.
13. Setup guide documents .env configuration.
14. Setup guide uses localhost instead of 127.0.0.1.
15. Setup guide explains the TLS hostname validation issue.
16. Setup guide documents npm run dev startup.
17. Setup guide documents expected frontend/backend URLs.
18. Setup guide documents expected health status.
19. Setup guide documents expected table and relationship counts.
20. Setup guide documents smoke-test queries.
21. Setup guide documents blocked-query behavior.
22. Troubleshooting guide includes common setup failures.
23. Troubleshooting guide includes vite/esbuild EPERM guidance.
24. Runtime docs reference the new setup documentation.
25. No frontend code is modified.
26. No backend code is modified.
27. No database files are modified.
28. No SSOT files are modified.
29. No AI, LLM, or heuristic behavior is introduced.

## Codex Prompt

You are implementing WP-023 for the Sequel City Web Detective project.

Goal:
Create a complete developer installation, runtime setup, validation, and troubleshooting guide based on the actual validated setup workflow used during development.

Context:
The application now runs successfully on multiple machines. Several important setup lessons were discovered during real installation and troubleshooting:

- localhost works more reliably than 127.0.0.1 for SQL TLS validation
- SQL authentication must be enabled
- TCP/IP must be enabled
- port 1433 must be listening
- sequel_web_user must exist
- .env configuration must be correct
- npm install is required at the repo root
- vite/esbuild EPERM issues may occur in restricted environments

This WP converts those lessons into formal setup documentation.

Important:
This is documentation-only.
Do not modify application code.
Do not modify backend code.
Do not modify database files.
Do not modify SSOT files.

Tasks:

1. Create:

docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md

Include:

- supported environment
- required software
- repository cloning
- npm install
- SQL Server configuration
- SQL authentication setup
- TCP/IP enablement
- sequel_web_user creation
- database user creation
- db_datareader role assignment
- .env configuration
- localhost TLS guidance
- npm run dev startup
- runtime validation
- smoke-test queries
- expected successful runtime state

2. Create:

docs/04-developer-setup/Troubleshooting-Reference.md

Include:

- symptoms
- likely causes
- fixes

Cover:

- npm failures
- SQL login failures
- SQL auth disabled
- TCP/IP disabled
- 1433 unavailable
- localhost vs 127.0.0.1 TLS issue
- backend unavailable
- schema unavailable
- .env issues
- vite/esbuild EPERM
- frontend/backend port conflicts

3. Update runtime docs.

Update:

docs/02-runtime/Developer-Startup-Workflow.md

Reference the new setup docs.

Update:

docs/02-runtime/Backend-Setup-and-Validation.md

Reference the master setup guide.

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Reference the troubleshooting guide.

4. Verification.

Confirm only documentation files were modified.

Ensure all commands are copy/paste ready.

## Gemini Audit Prompt

Audit WP-023 implementation for Sequel City Web Detective.

Goal:
Verify that a complete developer installation, runtime setup, validation, and troubleshooting guide was created using validated setup evidence without modifying application code.

Scope the audit to:

- docs/04-developer-setup
- docs/02-runtime
- git diff summary

Check:

1. Does Developer-Installation-and-Configuration-Guide.md exist?
2. Does Troubleshooting-Reference.md exist?
3. Does the setup guide document supported environment?
4. Does it document repository cloning?
5. Does it document npm install?
6. Does it document SQL Server requirements?
7. Does it document SQL authentication setup?
8. Does it include validated SQL login creation commands?
9. Does it include database user creation commands?
10. Does it include db_datareader assignment?
11. Does it document TCP/IP enablement?
12. Does it document port 1433 validation?
13. Does it document .env configuration?
14. Does it use localhost instead of 127.0.0.1?
15. Does it explain the TLS hostname validation issue?
16. Does it document npm run dev startup?
17. Does it document expected URLs?
18. Does it document expected health status?
19. Does it document expected table and relationship counts?
20. Does it document smoke-test queries?
21. Does it document blocked-query behavior?
22. Does the troubleshooting guide include common setup failures?
23. Does it include vite/esbuild EPERM guidance?
24. Do runtime docs reference the new setup documentation?
25. Were frontend files left unchanged?
26. Were backend files left unchanged?
27. Were database files left unchanged?
28. Were SSOT files left unchanged?
29. Was AI, LLM, or heuristic behavior avoided?

Report:

Gemini Audit Results

Status: PASS or FAIL

Summary:

- ...

Issues Found:

- None

If issues exist:

Required Fixes:

1. ...
2. ...

## Codex Results

Created the WP-023 documentation set and updated the runtime docs to point to it.

Modified files:
- [Developer-Installation-and-Configuration-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md)
- [Troubleshooting-Reference.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Troubleshooting-Reference.md)
- [Developer-Startup-Workflow.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md)
- [Backend-Setup-and-Validation.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Backend-Setup-and-Validation.md)
- [Frontend-First-Launch-Validation.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md)

The new setup guide covers the validated install flow, SQL Server configuration, `localhost` TLS guidance, `.env` requirements, startup, smoke tests, and expected runtime state. The troubleshooting reference covers npm failures, SQL auth issues, TCP/IP and port `1433`, `localhost` vs `127.0.0.1`, backend/schema issues, `.env` mistakes, `vite`/`esbuild` `EPERM`, and port conflicts.

Verification: the edit operation only touched documentation paths under `docs/`. I could not run a shell-based `git diff` in this session because the Windows shell runner was blocked, but no application, backend, database, or SSOT files were modified in the patch.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

- The audit of WP-023 "developer-installation-runtime-setup-and-troubleshooting-guide" is complete. All 29 check items have been verified. The implementation successfully delivered a comprehensive set of documentation files in `docs/04-developer-setup` and updated existing runtime documentation in `docs/02-runtime` to link to the new guides.
- The documentation is grounded in validated project evidence, covering SQL Server configuration (mixed-mode, TCP/IP, port 1433), SQL login and user management (`sequel_web_user`), and environment-specific connectivity findings (preferring `localhost` over `127.0.0.1` for TLS stability).
- The troubleshooting guide correctly addresses observed local failures such as `EPERM` errors, SQL authentication issues, and port conflicts.
- Verification confirmed that no application code, database scripts, or SSOT files were modified during this work package.

Issues Found:

- None
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Pending


