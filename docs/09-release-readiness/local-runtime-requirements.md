# Local Runtime Requirements

Students run Start-SequelDetective.cmd once from the extracted package. Developers can use the same entry point from the checkout.

## Prepared machine prerequisites

- Windows with Node.js/npm and a local browser.
- Local SQL Server service running, TCP/IP configured and SQL authentication available.
- Windows-integrated SQL administrator access for first database/account setup, or an instructor-prepared installation with bounded credentials already present.

Git is needed for repository development, not for an extracted student package. Node/SQL Server engine installation and machine-wide SQL configuration are instructor image responsibilities.

## Launcher-owned setup

The launcher installs locked npm dependencies when needed, creates or safely updates the recognized local database, generates missing random learner/repository credentials and a stable session secret, and retains local configuration in restricted apps/api/.env. Existing secrets and unknown settings are preserved. The default target is localhost:1433 / SequelCityCrimesDB; configured existing target settings take precedence.

Fresh installation uses explicit authoritative SQL sections without a destructive preamble. Compatible legacy upgrades retain a verified SQL Server backup and install protected runtime additions transactionally without changing public evidence. Current databases are verified. Unknown or partial inconsistent databases stop without an automatic reset.

Runtime uses two bounded SQL logins for the same database, a stable session secret, exact loopback origins and verify-mode bootstrap. Administrative SQL configuration is not inherited by student API processes. Default API/web URLs are http://127.0.0.1:3001 and http://127.0.0.1:5173.

## Readiness

The browser opens only after API/database/protected content readiness, web availability and the Case 001 session/catalogue routes succeed. Case 001 starts at CrimeType; Case 004 retains its existing legacy progression. Missing prerequisites, occupied ports, bad credentials and readiness timeouts are explicit failures, not successful launches.

Subsequent launches preserve saved attempts, notes, drafts and ownership configuration. See the student/instructor guide and CASE-RUNTIME-BOOTSTRAP-RUNBOOK for backup/recovery and advanced installation details.
