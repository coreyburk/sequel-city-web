# Student Tester Package

Build the package with npm run package:student. It contains the CMD launcher, three public compatibility shims, internal student installer/account/launcher scripts, API/web source, locked workspace definitions, authoritative SQL scripts and installation documentation.

Students extract it and double-click Start-SequelDetective.cmd. That execution handles dependencies, safe database setup, bounded credentials and ready application startup. There are no separate student SQL/account/environment commands. See [the student/instructor guide](student-install-and-run-guide.md).

Instructor-prepared Windows machines need Node/npm and local SQL Server with TCP/IP, SQL authentication and appropriate first-provisioning Windows SQL permissions. SQL Server engine installation is not part of this source package.

The package excludes Git metadata, node_modules, local .env/secrets, database backups, dist/build output, logs, coverage and browser test artifacts. Installer inputs are authoritative SQL sections, not duplicated schema templates. Repeat launch preserves the installation's credentials and saved attempts. Unknown existing databases are retained and reported; no automatic destructive rebuild occurs.

Validate packaging/shims with scripts/tests/test-student-package-script-shims.ps1. Validate extracted-package fresh/repeat launch against a newly owned disposable SQL database with scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch. Integration tests install dependencies from the lockfile in the extracted package and verify that an unchanged repeat launch skips reinstallation.
