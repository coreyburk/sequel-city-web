# Running Sequel Detective

On a prepared local Windows machine, double-click **Start-SequelDetective.cmd** from the repository or extracted student package. This is the supported single-execution setup/start path.

The launcher installs locked application dependencies as needed, safely installs the database/protected runtime, persists local credentials, starts API/web services and opens the browser after API/database/case readiness and web availability succeed. Leave the launcher window open while using the app.

Node.js/npm, local SQL Server (service, TCP/IP and SQL authentication configured) and a browser are machine prerequisites. First provisioning requires Windows-integrated SQL administrator access; routine launch uses bounded SQL credentials. See [student/instructor guide](docs/09-release-readiness/student-install-and-run-guide.md) for preparation and recovery details.

## Developer options

Run the same launcher from PowerShell if desired:

```powershell
scripts/start-student-package.ps1
```

For isolated development instances, explicit SqlHost, SqlPort, DatabaseName, ApiPort and WebPort options are supported; existing .env target values take precedence. SetupOnly performs setup without running services, and NoBrowser leaves a ready app available without opening a tab. Use separate installation folders/configuration for separate targets.

The legacy npm run dev command still starts source processes, but does not replace the launcher installation contract. Application SQL scripts remain the authoritative definitions; the full creation script is destructive and is never invoked directly by default launch. Compatible legacy updates use labeled additive runtime sections after a verified retained backup. Unknown schemas stop without automatic reset.

## Validation

Launcher configuration/safety fixtures:

```powershell
scripts/tests/test-student-launcher.ps1
```

Fresh, legacy, preservation and extracted-package integration against newly owned disposable SQL databases:

```powershell
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
```

Tests refuse system/remote targets and clean only their own disposable databases/logins/processes. Legacy-upgrade test backups are retained in SQL Server's backup directory. Instructor-only destructive rebuild and recovery guidance remains in [the bootstrap runbook](docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md).
