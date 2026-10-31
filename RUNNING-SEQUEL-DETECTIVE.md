# Running Sequel Detective

## Start the app

On a prepared Windows machine:

1. If you received a ZIP, extract it into a local folder first.
2. Open that folder (or the repository) and double-click **Start-SequelDetective.cmd**.
3. Wait for the browser to open. Leave the launcher window open while using the app.

The ZIP/folder name may include a build timestamp. The launcher filename is always **Start-SequelDetective.cmd**. To stop the app, press **Ctrl+C** in its launcher window.

The launcher installs locked dependencies when needed, sets up a new database or updates a recognized compatible installation, configures local credentials, and starts the API and web services. It opens the browser after readiness checks pass. Normal relaunch preserves saved work.

Windows, Node.js/npm, a browser and a prepared local SQL Server are required. The launcher does not install SQL Server. First provisioning requires authorized Windows-integrated SQL administrator access; routine launch uses restricted local SQL accounts. For preparation or startup failures, follow the [student and instructor guide](docs/09-release-readiness/student-install-and-run-guide.md).

## Build a student package

Developers build from the repository root:

```powershell
npm run package:student
```

The builder saves the ZIP and build folder in **artifacts/student-packages/** under the repository and prints the full path. Generated packages are excluded from Git. Naming, output location and package contents are explained in the [package guide](docs/09-release-readiness/student-tester-package.md). Do not distribute your local credentials or an already configured installation folder.

## Developer launch options

From the repository root, the PowerShell entry point is:

```powershell
scripts/start-student-package.ps1
```

For separate local targets, explicit `SqlHost`, `SqlPort`, `DatabaseName`, `ApiPort` and `WebPort` options are supported. Existing `.env` database-target settings take precedence, so use separate installation folders/configuration for separate targets. `SetupOnly` performs setup without starting services; `NoBrowser` starts the app without opening a browser tab.

`npm run dev` starts source processes; it does not perform the launcher's installation/setup steps. Use the launcher for a first-install test.

The three [canonical database scripts](database/README.md) define fresh schema and current data. Running the complete creation script is destructive. The launcher uses guarded fresh-install sections for a missing database and separate, backed-up compatibility migrations for supported existing installations. It stops on unknown or inconsistent databases rather than resetting them.

## Developer validation

Run configuration/safety fixtures without SQL integration:

```powershell
scripts/tests/test-student-launcher.ps1
```

Run the SQL and extracted-package checks:

```powershell
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
```

SQL tests use only the registered **SequelCityRuntimeTest_Workspace**. The runner acquires an exclusive lock, backs up the workspace, rebuilds fixtures in that same database, restores its prior state and restarts the preview if it was running. It does not create a clone per test run. One verified workspace recovery backup is retained; obsolete per-run test backups are cleaned up.

If registration is missing or recovery fails, stop and follow the [bootstrap and recovery runbook](docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#verification-with-one-registered-workspace). Do not substitute the installed classroom database as a test fixture.
