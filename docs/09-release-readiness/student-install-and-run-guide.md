# Start Sequel Detective

Extract the package into a local folder and double-click **Start-SequelDetective.cmd**. Leave its window open while using the app.

That execution installs application dependencies when needed, creates the database or updates a recognized compatible installation, configures local accounts, starts both services and opens the browser only when the application is ready. Later launches preserve your saved attempts, SQL drafts and notes.

If startup fails, send the launcher message to your instructor. Do not delete the database, edit credentials or reset your browser to fix startup; those actions can make saved work inaccessible.

## Instructor machine preparation

Provide Windows, a supported Node.js/npm installation, a browser and local SQL Server with its service running, TCP/IP enabled on the configured port and SQL authentication available. The launcher does not install the SQL Server engine or change machine-wide authentication/network settings.

First-time database/account provisioning needs Windows-integrated SQL Server administrator rights. If the student identity lacks those rights, prepare that machine using the launcher setup-only option under the intended installation owner or configure bounded credentials before distribution. Students still launch the same CMD entry point. Do not run normal application services with an elevated Windows token.

The default local SQL target is localhost:1433 / SequelCityCrimesDB. Instructors may configure another supported local target before first launch. Existing .env target settings are preserved. Remote administrative setup is refused.

## Saved progress and updates

Each installation retains random local learner/repository credentials and its session secret in apps/api/.env with restricted permissions. Do not share or delete that file. Existing configuration is augmented without changing saved secrets. Administrative bootstrap credentials are removed from application configuration; normal runtime uses bounded accounts.

A recognized legacy database is backed up with SQL Server COPY_ONLY/CHECKSUM and RESTORE VERIFYONLY before protected runtime additions. The launcher prints the retained backup location in SQL Server's default backup directory. Public evidence is not reseeded, and no existing database is dropped. Current databases are verified without reinstalling content. Unknown or inconsistent schemas stop with an instructor-facing message.

Keep database backups and the student's browser owner cookie for full saved-attempt recovery. Notes/draft exports do not restore ownership or prove case progress.

## Instructor troubleshooting

- Missing Node/SQL prerequisites: prepare the machine image, then launch again.
- Insufficient SQL permissions: provision using an authorized local SQL administrator; no manual student SQL commands are required.
- Existing incompatible database: retain it and review compatibility/backup recovery. The launcher never automatically rebuilds it.
- Port already in use: close the earlier launcher or resolve the conflict. Unrelated processes are not stopped.
- Dependency/readiness failure: review the reported local log directory. The browser remains closed until readiness succeeds.

ResetEnvironment and interactive database prompts are retired; they must not erase credentials or saved progress. SetupOnly and NoBrowser are instructor/testing options, not extra student steps.
