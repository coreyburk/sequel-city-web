# Single SQL test database

## Policy

Use exactly one registered local test database: `SequelCityRuntimeTest_Workspace`. Preview, runtime tests and launcher compatibility scenarios share it sequentially. Do not create GUID-named databases per run or preserve obsolete preview copies. Never use `SequelCityCrimesDB`, `SQLCityCrimesDB` or another teaching database as a test/reset target.

The registration is in the Git common directory at `single-test-database.json`; it contains the fixed name, an ownership identifier and local connection coordinates, not passwords. Worktrees use the same registration and SQL session lock. SQL Server also stores the ownership identifier as a database extended property. A mismatched/missing registration, another test database, or an active lease stops before mutation.

## Commands

From the repository root, initialize once only if no project test database exists:

```powershell
scripts/tests/invoke-single-database-test.ps1 -Task Initialize
```

Existing registration is verified and reused. An existing unregistered test database is refused rather than overwritten or accompanied by another clone; review/adopt or remove it explicitly.

Run the existing entrypoints normally:

```powershell
scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers
scripts/tests/test-student-launcher.ps1 -SqlIntegration
scripts/tests/test-single-test-database.ps1 -SqlIntegration
```

The runtime runner accepts only the fixed database name. Launcher fresh, legacy, extension, city, unknown and corrupt scenarios reset that same database in sequence. Existing ownership/permissions, compatibility, interruption/rollback and saved-state assertions remain. Optional packaged-launch scenarios also reuse the same database:

```powershell
scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch
```

When reviewed story/schema changes intentionally require new preview data, rebuild the one workspace explicitly:

```powershell
scripts/tests/invoke-single-database-test.ps1 -Task Refresh
```

Refresh replaces the test workspace's current data, including test attempts; it never creates another database name. The previous workspace is retained in the one recovery backup. Ordinary tests instead restore the preview unchanged after completion.

## Lifecycle and recovery

The runner takes a session-owned lock in master, verifies fixed target/ownership and checks there are no other Sequel City test databases. It stops only the verified local preview processes, overwrites one COPY_ONLY/CHECKSUM recovery backup, verifies it, then runs fixtures using the fixed database. A test failure still runs restore in `finally`. After restoration it verifies ownership, removes temporary fixture backup artifacts, releases the lease and restarts the preview if it had been running.

The recovery file is `SequelCityRuntimeTest_Workspace_recovery.bak` in SQL Server's configured default backup directory. It is overwritten on the next operation, never copied to another database. If the PowerShell process is forcibly terminated or restore fails, keep this file and the registration. Use an SQL administrator to restore it **to `SequelCityRuntimeTest_Workspace`**, then verify its `SequelCityTestWorkspaceOwner` property against the registration. Do not recover into a second clone. Automatic preview startup refuses mismatched ownership; a failed fixture is not silently treated as the preview.

SQL Server owns the backup folder, which the Windows developer account cannot enumerate directly. Backup cleanup runs through the SQL service account with `sys.xp_delete_files`, using exact paths only: validated default-directory parent, narrow test-backup basename, and test-only database names in the backup headers. No wildcard deletion command, shell execution, server configuration change or classroom-backup deletion is used. This cleanup helper targets the local SQL Server 2022 environment; the extended procedure is not a portable production installer dependency. If cleanup is unavailable, restore succeeds and reports the remaining artifacts.

The current local preview remains at `http://localhost:27077/`, uses the fixed registered database and reuses its protected credentials/session configuration. Starting it no longer generates a database name. Local preview process/settings files remain ignored and must not be committed.

## Validation evidence

WP-302 records the cleanup inventory, real runtime and launcher suites, lock contention and ownership/target refusal tests, intentional-failure recovery, preview-workspace hash preservation, classroom marker checks and the final single-database inventory. Database backup artifacts are recovery files, not additional online clones.
