# WP-309: Student-independent local database ownership

## Objective

Make fresh and recognized existing student installations work without a developer-specific Windows identity or reachable Windows domain. Use a stable local SQL database owner for owner-executed verification while preserving restricted runtime accounts, saved work and the normal non-elevated launch path.

## Scope

- Diagnose and safely correct Windows-dependent database ownership during authorized local SQL setup, including existing supported databases.
- Preserve the existing restricted-SQL-account readiness fast path; distinguish setup/repair requirements from ordinary student launches.
- Provide actionable ownership/permission errors instead of an unexplained ExecuteScalar/domain lookup exception.
- Cover repository launch and extracted student packages using the same scripts, including offline/domain-unavailable behavior and repeat launch.
- Document instructor provisioning, account-neutral ownership and recovery. No case-content migration.

## Observed Problem

A launch failed during ExecuteScalar with a Windows user/group lookup error. Read-only metadata inspection found the configured application database and the retained test workspace owned by a WINDOWS_LOGIN associated with the developer's domain identity. Do not copy that identity into implementation, fixtures or readiness tests.

Source inspection shows Install-StudentDatabase sets a SQL owner only inside its CREATE DATABASE branch. Recognized existing targets call owner-executed evidence/runtime manifests before ownership correction. Invoke-StudentLaunch already tests the restricted SQL accounts first; failed readiness falls back to administrative setup. Test-StudentRuntimeConnection currently collapses errors into false, obscuring the reason. The exact failing manifest must be reproduced/identified during implementation; metadata/source evidence identifies the missing existing-database guard but is not a completed repair test.

## Impact Analysis

### Understand Status

- Analysis tier: Required, because database ownership changes a security boundary and affects shared setup and runtime readiness.
- Graph available: knowledge-graph.json and fingerprints.json present; metadata last analyzed October 20, 2026, baseline 322e5e0f016d66ba8c77f3f92c6c0134fb0a5632.
- HEAD matches baseline on codex/case-001-complete-mystery; no committed baseline-to-HEAD drift. Graph includes pending source through WP-308. Classification: Current for navigation of the analyzed working tree; not an accepted or isolated implementation baseline. Source is authoritative.
- Targeted graph nodes located install-student-database.ps1, start-student-package.ps1, setup-local-sql-accounts.ps1, test-student-launcher.ps1 and databaseIdentityService.ts. One-hop graph edges explicitly identify databaseIdentityService's readiness functions; do not infer PowerShell call edges from absent graph edges. Source verifies the launcher-to-installer/account-setup chain and SQL readiness manifest dependencies.
- Numerous unaccepted changes remain, notably WP-300 installer/content changes and WP-302 sequential test-runner changes. Preserve these and establish a scoped comparison baseline before independent audit; do not present the whole HEAD diff as WP-309.

### Affected Architecture

- Layers: local Windows launcher, administrative SQL provisioning, database ownership/module execution, bounded runtime-login checks, packaged deployment and test harness.
- Primary surfaces: Install-StudentDatabase/Invoke-StudentSql; Invoke-StudentLaunch/Test-StudentRuntimeConnection; launcher fixture ownership and package tests.
- Upstream consumers: Start-SequelDetective.cmd, repository script shims, extracted student tester package and instructor SetupOnly provisioning.
- Downstream dependencies: SQL database owner SID, owner-executed evidence manifests, existing learner/repository roles, secret configuration, bootstrap/runtime readiness and saved attempt/workspace data.
- Inspect setup-local-sql-accounts.ps1 and databaseIdentityService.ts for assumptions; they are read-only context unless scope is explicitly revised for a demonstrated dependency.

### Regression Surface

- scripts/tests/test-student-launcher.ps1 already normalizes fixture owners to SID 0x01 in a helper, which can mask the existing-owner defect. Add a dedicated unsafe-existing-owner scenario before that normalization.
- Retain fresh/current/legacy/extension/city/unknown/corrupt fixtures, actual bounded SQL-login probes and extracted-package/relaunch assertions.
- Ownership discovery must use local catalog/SID metadata and must not perform Windows name/group resolution just to determine whether the owner is suitable.
- Preserve owner/session/attempt identity, workspace data, public evidence, answer restrictions, runtime login permissions and server settings.
- All destructive SQL tests run sequentially in the one registered SequelCityRuntimeTest_Workspace through the existing exclusive backup/restore runner; no second clone or classroom fixture.

### Graph Update Decision

Regeneration required after implementation: Yes. This changes administrative lifecycle/security scripts. Include the four tracked graph artifacts below and run refresh/readiness checks after source validation. Do not regenerate during this planning-only task.

## Files Allowed to Change

- docs/01-work-packages/WP-309-student-independent-local-database-ownership.md
- scripts/student-package/install-student-database.ps1
- scripts/student-package/start-student-package.ps1
- scripts/tests/test-student-launcher.ps1
- apps/web/tests/browser/student-mode.spec.ts — only the stale legacy notebook text assertion; check the existing label/value field without changing application UI
- docs/00-ssot/SSOT-Database-Schema.md — additive ownership/security contract only, no schema redesign
- docs/15-case-plans/CASE-RUNTIME-BOOTSTRAP-RUNBOOK.md — canonical provisioning/repair procedure
- docs/09-release-readiness/student-install-and-run-guide.md — concise student/instructor guidance linked to runbook
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: application UI, case progression/content/validators, authoritative evidence/answer seed data, SQL schema, account passwords, unrelated databases/logins, Windows accounts/domain membership, SQL service identity, server authentication mode, owner-executed module protections or earlier WP result/acceptance records. Do not weaken readiness to bypass an owner error. Scope revision must precede necessary changes outside this list.

## Constraints

1. Never hardcode, test for or depend on a particular student's, instructor's or developer's account name, domain, profile path or SID. Current user identity used for local ACL/installation locking is legitimate; distinguish that from making their identity the database owner or a readiness requirement.
2. Stable database ownership must resolve to a local SQL principal by SID, not a guessed display name. Reuse the existing built-in SQL principal at SID 0x01 if valid; support a renamed principal. Do not enable its interactive login, reset its password, grant runtime accounts sysadmin/db_owner, or run app services under that owner.
3. Ownership repair requires an authorized local SQL administrator, an exclusively locked local target, owner-independent recognition of a supported application installation, and a verified retained COPY_ONLY/CHECKSUM backup before changing an existing database. The ownership change must occur before invoking manifests that need the owner. A backup failure prevents repair.
4. Do not blanket-normalize all databases or infer ownership authorization from a matching name alone. Unknown/partial/inconsistent targets must be refused without ownership/data/account mutation. Existing SQL-authenticated owners need explicit safe classification; do not replace a suitable configured SQL owner unnecessarily.
5. After repair, verify canonical evidence/runtime shape and both bounded SQL accounts. Define and test rollback of the ownership change on subsequent validation failure, or an equally safe documented recovery boundary before implementation. No disabled protection, TRUSTWORTHY setting change or data rebuild as a workaround.
6. Normal configured launches use the existing restricted SQL readiness path without Windows/SQL administration or UAC elevation. Initial setup/repair may require instructor provisioning; missing administrative permission produces actionable guidance, not a credential prompt loop or an automatic grant.
7. Preserve saved attempts, notes/drafts, content versions, owner capability/session secret, existing SQL credentials and public evidence. Do not reset an installation or silently upgrade its story to solve ownership.
8. Keep ownership repair idempotent: a verified suitable owner is a no-op, repeat launch does not accumulate repair backups, and completed repair does not repeat administrative work unnecessarily. A later restore/recreation with unsuitable ownership must be detected again.
9. No live/classroom mutation while implementing or auditing this WP without separate authorization for that named target. Prove the fix in the registered workspace first. A manual ALTER AUTHORIZATION on the developer database is not the deliverable; the script/package must contain the correction.

## Required Behavior

1. Reproduce the existing-owner failure on a bounded fixture or controlled SQL failure path; identify the operation and precondition. Inventory owner metadata without resolving a Windows domain principal.
2. Fresh setup establishes stable SQL ownership before owner-executed checks, independent of the installing Windows account. Validate SID-based owner resolution and fail clearly if the suitable local principal is unavailable.
3. Existing supported installations with unsuitable Windows-dependent ownership pass owner-independent recognition, backup verification and guarded ownership repair before manifest checks. Reuse supported upgrade flow without silently altering public evidence or saved attempts.
4. Existing suitable ownership and healthy restricted runtime accounts take the normal launch fast path. Both application services remain non-elevated and use their bounded local SQL roles.
5. If ownership cannot be safely inspected/repaired or SQL admin access is unavailable, report the phase and required instructor action safely. Do not print credentials, domain-dependent stack traces or hidden evidence.
6. The packaged student distribution consumes the same fix without embedding the developer's machine configuration or .env. Each student installation provisions/retains its own secrets and browser ownership; this WP does not add shared-PC learner transfer or account roaming.
7. Document the setup-versus-runtime distinction, expected owner/role boundaries, existing-database repair safeguards and recovery. Explain that local-only operation excludes reliance on a reachable organizational domain, not legitimate use of each user's Windows identity for local setup/ACLs.

### Scoped validation correction

The first implementation-time packaged run passed SQL repair checks and the full Case 001 walkthrough, but shared student-mode checks still expected the pre-WP-303 raw string CrimeID: 1080. The actual notebook correctly renders Crime ID and 1080 as separate semantic fields, with the colon generated by CSS. Add the one browser assertion file to scope before correcting this stale expectation; retain the identity-value, saved-draft and layout checks. No application presentation change is authorized by this correction.

## Implementation Tasks

1. Establish isolated WP comparison context that accounts for the pending installer/test prerequisites. Add failing ownership/readiness coverage without modifying unrelated changes.
2. Implement the smallest reusable ownership inspection/repair logic inside the existing installer. Order recognition, backup, repair and full validation explicitly. Reuse the fresh-install owner selection and application lock; quote identifiers and parameterize values.
3. Preserve readiness results sufficiently to distinguish ownership repair, unavailable connection and unsupported schema without hiding actual failures or bypassing checks. Keep the existing fast path and safe error reporting.
4. Extend the single-database launcher matrix and extracted-package checks. Verify actual SQL role restrictions and no data/session/configuration loss across repair and relaunch.
5. Update scoped documentation, refresh graph and record tested source state, commands, results, limitations and untested environmental scenarios in Code Results. Stop for independent audit and human acceptance.

## Acceptance Criteria

- Account neutrality: no developer-specific identity is introduced. Tests use generated SQL names, local catalog metadata and controlled principal-type/domain-unavailable stubs, not a real named company domain. Do not create a domain account or require VPN/DC connectivity for tests.
- Fresh install: correct stable owner SID before manifest execution; disabled or renamed built-in SQL principal is handled without enabling/resetting it. Missing/unsupported owner principal fails before an unsafe mutation.
- Existing supported target: unsafe-owner test reproduces the issue, then script-driven repair verifies backup and correct owner, preserves saved workspace/evidence/config hashes, and passes owner-executed manifests plus actual restricted-account checks.
- Offline/domain-unavailable path: controlled lookup-failure tests demonstrate no Windows name resolution during ownership inspection/selection. Run a real unavailable-domain scenario if safely available; otherwise explicitly record the simulated versus actual coverage limitation.
- Safety failures: wrong/unknown target, missing local admin rights, failed backup, post-repair validation failure and concurrent setup leave the target protected and produce actionable results. No protection disabling, ownership drift on refused unknown targets or unexpected password/server changes.
- Repeat/normal launch: suitable owner is not rewritten, repeat repair creates no unnecessary backup, and a healthy configured launch reaches readiness with the administrative setup function made unavailable in the test. Services are not elevated and neither runtime role gains administrative authority.
- Extracted package: first supported setup/repair and subsequent normal launch use the same scripts, retain saved work and contain no developer .env or identity-specific expectations.
- Required checks: scripts/tests/test-student-launcher.ps1 (non-SQL); the same runner with -SqlIntegration -PackageLaunch through the one-workspace wrapper; relevant existing connection/shim checks. Run only the single registered database sequentially, restore preview after success/failure and confirm one-clone inventory.
- Graph refresh, refresh-readiness and git diff --check pass after implementation. Independent audit is scoped to WP-309 plus acknowledged prerequisite baselines; final acceptance remains human.

## Code Prompt

Implement WP-309 only after explicit implementation authorization. Follow the allowed files and account-neutral/security contracts. Correct the scripts and packaged path rather than applying a one-off live ownership change. Verify with the one registered SQL workspace, keep initial setup/admin authority separate from ordinary student runtime, retain backups and saved work, and record actual evidence/limitations. Stop before independent audit, human acceptance, live classroom repair, commit or push.

## Audit Prompt

Challenge target recognition before owner changes, offline-safe catalog/SID inspection, lock/backup/rollback ordering, both fresh and existing ownership paths, refusal of unknown targets, normal-launch admin independence, restricted-role boundaries and preserved learner identity/data. Verify tests do not conceal the defect by normalizing owners first or use a developer/company identity as an expected value. Check extracted-package behavior and absence of credential/server/domain changes. Account explicitly for pending WP-300/302 changes in shared files; do not audit an unexplained mixed diff. Record any simulated domain-failure limitations. Do not accept the WP or repair live databases.

## Code Results

Implemented after the human explicitly authorized WP-309 implementation in this chat. Initial authorization covered code and test-workspace work. The subsequent named-target authorization and operation are recorded below.

Implementation: the installer discovers stable SQL ownership by local SID/catalog lookup, handles renamed/disabled built-in SQL owners without enabling them, preserves suitable SQL owners, and refuses missing/unclassifiable owner metadata. Recognized Windows-owned targets pass direct evidence/catalog gates before any mutation, retain a verified backup, and change ownership in the same transaction as full validation/supported upgrades. Ownership rolls back on a later validation failure. Fresh and installer-marked empty retries use the stable SQL owner. Current repair does not change data or runtime credentials. Guarded SQL domain/permission failures now report local setup requirements without printing the Windows account. The launcher's existing restricted-account fast path is retained, with an ownership reason carried into setup diagnostics.

Validation commands and evidence:
- scripts/tests/test-student-launcher.ps1: PASS, outputs/wp309-nonsql-final.log. Includes catalog-only renamed-owner and absent/unclassifiable-owner checks, simulated domain-failure message handling and existing configuration/port/lock safeguards.
- scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch: PASS, outputs/wp309-launcher-sql-final.log. Real SQL Windows-owner repair, backup refusal, injected permission refusal, post-change validation rollback, workspace SHA-256/evidence checksums, suitable-owner no-op/repeat backup behavior, actual restricted-login role/permission checks, unknown/partial Windows-owner refusal, existing legacy/v1/city upgrade/rollback and lock checks. All fixtures sequentially reuse the registered workspace.
- Extracted-package coverage in that run: fresh setup, saved workspace and browser cookie/session recovery, healthy relaunch with the administrative installer replaced by a throwing test stub, actual Windows-owner repair on a later launch with verified backup, unchanged credentials/session secret, compatible legacy launch, six browser regressions including the complete Case 001 chain. Final run: 6 browser tests passed.
- scripts/tests/test-student-package-script-shims.ps1: PASS, outputs/wp309-shims-final.log.
- scripts/tests/test-single-test-database.ps1 -SqlIntegration: PASS, outputs/wp309-recovery-final.log; exclusive lock/ownership/one-clone guards, deliberate failure recovery, retained preview workspace hash and unchanged classroom markers.
- Source/parser/package execution covers PowerShell test runtime and Windows PowerShell packaged launches. Graph refresh/readiness and git diff --check passed; outputs/wp309-graph.log and wp309-graph-readiness.log.

First packaged run found the pre-WP-303 raw notebook string assertion stale in student-mode.spec.ts; scope was amended before changing it to verify semantic Crime ID/1080 label/value. The corrected final run passed. No application presentation was changed for that correction.

Operational verification: the restored existing preview initially retained a Windows owner after SQL restore, so the corrected installer repaired only SequelCityRuntimeTest_Workspace, retained/verified its backup and reached readiness at http://localhost:27077. Subsequent recovery test restored saved work and relaunched successfully. Final checks show one project test database, a SQL_LOGIN owner on that workspace, one retained recovery backup, HTTP 200 and both restricted SQL accounts ready. Removed only obsolete test backup artifacts using the existing exact-path/header-validated cleanup. No additional database clone was created.

Read-only inspection of SequelCityCrimesDB confirmed its Windows owner and Case 001 released versions 1/2; its direct compatibility recognition passed. Its owner-executed manifest failed to finish within the bounded read-only diagnostic timeout. During initial implementation that main/classroom database remained unchanged. Its newer-case preview is separate; ownership repair is not a story/data upgrade. The subsequent authorized ownership repair below supersedes that interim operational status.

Limitations: actual repair/role/package checks ran under this machine's existing setup identity; no second Windows student account, new domain identity, domain membership change or domain-controller outage was created. Missing-principal/domain-failure and denied-owner-change branches have controlled test coverage; renamed/disabled principal selection was catalog-stubbed rather than renaming/enabling server principals. Normal-launch admin independence is demonstrated with a forbidden installer path and real bounded SQL accounts, not a second OS login. No separate build/API suite was rerun because product changes are PowerShell setup only; the real packaged runtime/browser tests exercise startup and protected case behavior.

### Authorized main database repair

After the explicit named-target question, the human selected option 1 (Apply backed-up repair), authorizing SequelCityCrimesDB. Ran the same Install-StudentDatabase localhost 1433 SequelCityCrimesDB code, not a manual ALTER-only workaround. It returned Mode=current and OwnershipRepaired=true. Verified retained backup: C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup\SequelCityCrimesDB_before_runtime_3bade73aadff4047bd3ad42f3c7bc86a.bak. Full manifests passed and fourteen pre/post SHA-256 table fingerprints matched across public evidence, answers, content/version markers, learner identity, attempts, saved workspaces, actions and proofs. apps/api/.env SHA-256 remained identical after repair and normal launch; both configured restricted SQL accounts passed readiness. Evidence: outputs/wp309-main-before.json, wp309-main-repair.json and wp309-main-launch.log.

Normal launcher reached Ready at http://127.0.0.1:5173 with API http://127.0.0.1:3001. HTTP/API health checks passed. Started it hidden with NoBrowser for verification; owned launcher metadata is in ignored .git/wp309-main-launch.json. Left it running for the operator. The main database retains its older Case 001 content, and the current revised Case 001 preview remains available at http://localhost:27077. No reset, reseed, password change, new clone, domain account/server-auth change or ownership change to unrelated databases occurred.

Independent audit, human final acceptance, commit and push have not occurred. Existing WP-300 installer and WP-302 test-runner prerequisites remain pending/mixed in shared files. An isolated audit comparison must account for those prerequisite snapshots; do not call the entire current HEAD diff WP-309. The existing preview checkout received only these two setup scripts; it remains a mixed development preview, not a clean audit baseline.

## Audit Results

Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision

Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
