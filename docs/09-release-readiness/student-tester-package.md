# Student tester package

## Build and find the package

From the repository root:

```powershell
npm run package:student
```

The builder prints the generated path. By default, ZIPs and their build folders go into **artifacts/student-packages/** inside the repository (or source-package root). This location is excluded from Git. The ZIP and extracted folder use this pattern:

```text
sequel-detective-student-tester-YYYYMMDD-HHmmss.zip
```

The suffix is the build date and time, not a product version or a required installation name. A build timestamp alone does not prove which source revision was packaged. When distributing a build, record the source commit alongside the ZIP. Rebuild after source or documentation changes; existing ZIPs are snapshots and do not update automatically.

To choose another output directory, use the PowerShell builder:

```powershell
scripts/build-student-tester-package.ps1 -OutputRoot C:\StudentPackages
```

Generated packages are local build artifacts; keep them outside source commits. Build from the reviewed source state, and use a fresh extraction when testing a new package.

## What students do

Extract the ZIP into a local folder and double-click **Start-SequelDetective.cmd**. The launcher name stays the same regardless of the ZIP timestamp. Students do not need to run SQL scripts, create accounts or edit environment files separately.

Machines must already have Windows, Node.js/npm, a browser and prepared local SQL Server. The package does not install the SQL Server engine. First provisioning requires authorized Windows-integrated SQL administrator access. See the [student and instructor guide](student-install-and-run-guide.md) for preparation and recovery.

## Contents and update behavior

The package includes the CMD launcher, public PowerShell entry points, internal installer/account/launcher scripts, API/web source, locked workspace definitions, canonical database scripts, supported compatibility migrations and installation documentation.

It excludes Git metadata, `node_modules`, local `.env` files/secrets, database files/backups, build output, logs, coverage and browser-test artifacts. Do not add local credentials or copy a configured installation folder into a distribution ZIP.

Fresh installs use the [canonical current database scripts](../../database/README.md); supported existing-installation migrations are separate. Repeat launch preserves local credentials and saved attempts. Unknown or inconsistent databases are reported without automatic reset.

## Developer validation

Run packaging/entry-point checks:

```powershell
scripts/tests/test-student-package-script-shims.ps1
```

Run extracted-package setup/relaunch and SQL integration checks:

```powershell
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
```

The SQL runner uses the single registered **SequelCityRuntimeTest_Workspace**, with an exclusive lock and verified backup/restore. Fixtures reuse that database rather than creating per-run clones. Tests cover locked dependency installation and unchanged repeat-launch reuse. See the [workspace and recovery runbook](../15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md#verification-with-one-registered-workspace) before running SQL tests on another development machine.
