# WP-302: Single reusable test database

## Objective

Remove obsolete Sequel City test databases and retain exactly one registered reusable clone. Preview and automated SQL tests share it sequentially; the classroom database is never a reset target.

## Scope

The human explicitly authorized deleting obsolete clones and prohibited multiple clones on 2026-10-16. Clean the observed obsolete test databases and their unused associated accounts/artifacts. Rename the current preview database in place to SequelCityRuntimeTest_Workspace. Preserve its current data. Add a session-owned application lock, exact target registration, one backup/restore recovery boundary, and sequential fixture resets. Runtime and launcher test entrypoints route through that shared boundary. Preview configuration keeps one database and existing credentials rather than generating names. No external audit dispatch, acceptance, commit or push.

## Impact Analysis

Required: destructive test lifecycle, SQL credentials, automation and recovery. Graph metadata baseline matches HEAD 322e5e0 but includes mixed unaccepted source; use source as authority. Inspected runtime bootstrap's fresh-name ownership/cleanup and launcher's concurrently allocated fresh/legacy/unknown/v1/city/package fixtures. Their actual SQL/API assertions must remain. Preview helper already persists configuration, but repeated ad hoc rotation created obsolete clones; replace that behavior with a fixed registered workspace. Preserve original classroom and unrelated databases, including SQLCityCrimesDB and SQLMurderMystery. Regenerate all four scoped graph artifacts after implementation. WP-300 application edits and WP-301 workflow edits remain separate.

## Files Allowed to Change

Allowed:
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/01-work-packages/WP-302-single-reusable-test-database.md
- docs/05-development-workflow/Single-Test-Database.md
- scripts/tests/single-test-database.ps1
- scripts/tests/invoke-single-database-test.ps1
- scripts/tests/test-single-test-database.ps1
- scripts/tests/test-case-runtime-bootstrap.ps1
- scripts/tests/test-student-launcher.ps1
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: application runtime, production installer behavior, classroom database or its accounts, unrelated databases and the existing unaccepted WP-301 paragraphs. The development workflow addition is limited to a new single-database policy/link; preserve those prior edits. Local ignored configuration/process helpers may be updated to enforce this operational policy; secrets stay protected and unprinted.

## Constraints

At most one SequelCityRuntimeTest_ database. Fixed name SequelCityRuntimeTest_Workspace, explicit registered ownership and local administrative connection only. No arbitrary target overrides. Lock contention fails before mutation. Stop only verified preview processes before taking the workspace offline. Back up and verify current workspace once, restore on success/failure, and retain recovery backup on restore failure. Never reset any original/classroom database. Fixture cleanup and SQL test login cleanup remain bounded. No new database for a test's recovery or backup. Temporary fixture backups are artifacts, not additional online databases, and must be removed when no longer needed.

## Required Behavior

1. Inventory before cleanup; retain current preview data and remove obsolete test copies and unused associated logins.
2. Rename current preview clone to fixed workspace, register it, update protected configuration and restart same URL.
3. Serialize all SQL fixture writers using a master-database session lock. Snapshot preview to a single verified backup, exercise scenarios sequentially in the same database, restore preview and restart in finally.
4. Runtime test entrypoint reuses only the fixed workspace. Launcher matrix resets that same database between scenarios while preserving its assertions.
5. Preview launch refuses missing/mismatched registration or any additional test clone; no automatic GUID database names.
6. Document commands, lifecycle, recovery and one-clone limit.

## Acceptance Criteria

- SQL inventory shows exactly one project test database, the fixed workspace, and regular/unrelated databases unchanged.
- Existing preview data is retained and same URL is ready after cleanup/tests.
- Arbitrary classroom names and second-clone requests are rejected before mutation.
- Concurrent workspace lease attempt fails safely.
- Real runtime and launcher SQL checks pass sequentially and restore preview after success/failure.
- Obsolete accounts/backup artifacts are removed only when proven unused and owned by these tests.
- Graph, scope and diff checks pass; no secrets in tracked files or logs.

## Code Prompt

Execute the human's cleanup and one-clone instruction. Implement a narrow registered workspace lease/recovery helper and adapt existing test entrypoints without weakening test assertions. Use one database throughout. Verify recovery and preview readiness. Stop before independent audit, acceptance, commit or push.

## Audit Prompt

Challenge destructive target guards, registration, lock scope, preview process ownership, cleanup ownership, backup restore on failures, and the maximum concurrent database count. Confirm classroom/unrelated databases remain untouched and legacy/current test assertions still run.

## Code Results

Implemented the registered single workspace and sequential fixture runners. Removed six obsolete databases (864 MB allocated) and ten unused associated SQL logins. Renamed the retained preview in place to SequelCityRuntimeTest_Workspace, preserving credentials, workspace data and URL. Removed 95 obsolete backup artifacts; successful fixture runs remove their temporary installer backups and retain one verified recovery backup.

Validation: real runtime/bootstrap/browser suite passed (outputs/wp302-runtime-single.log); launcher SQL matrix passed (outputs/wp302-launcher-single.log); extracted package fresh/relaunch and compatible legacy launch passed, including six browser checks (outputs/wp302-package-single.log). Guard tests cover invalid classroom target, exclusive SQL lease, owner mismatch, additional-clone refusal and intentional failure restoration with matching preview-workspace hash and unchanged classroom schema markers. Final guard evidence: outputs/wp302-final-guards.log. Graph refresh/readiness and diff checks pass. Existing-registration initialization was verified; fresh initialization and explicit Refresh were not exercised against the retained preview to avoid resetting saved work.

Operational changes to protected local preview helpers/settings remain ignored. No classroom or unrelated database was modified. SQL backup cleanup uses exact validated paths, test filenames and backup headers through the SQL service account; no server configuration changes. Hard process termination requires the documented recovery procedure using the same database.

Audit sequencing: the adapted test runners include prior unaccepted WP-300 changes, and the workflow document contains prior WP-301 changes. Independent scope comparison must account for those prerequisites; do not treat the entire current HEAD diff as WP-302. No independent audit, human acceptance, commit or push performed.

## Audit Results

Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision

Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
