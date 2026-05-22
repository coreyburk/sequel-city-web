# WP-127: in-app-admin-upgrade-resolution-path

## Objective

Create a true in-app teacher/admin resolution path for required classroom database upgrades so setup recovery no longer depends on external terminal commands or manual SQL intervention.

The goal is:

When Student Mode is blocked behind a database-upgrade requirement, the application should be able to recover without asking a teacher or student to know SQL logins or passwords. On local admin-managed student machines, Sequel City should use Windows-integrated bootstrap authority to provision its own SQL identities, apply the required upgrade, and return the classroom to a ready state.

---

## Scope

Plan and implement the first complete in-app upgrade workflow on top of WP-126:

- add an admin-only API path that can run pending classroom database migrations on demand
- surface upgrade readiness, pending migration count, and actionable recovery guidance in Admin Mode
- add an Admin Mode action to start the upgrade when the backend is configured for bootstrap apply
- use Windows-integrated bootstrap authority on local administrator machines when the server does not already have Sequel City's managed bootstrap account
- during that first privileged flow, create Sequel City's own SQL Server accounts for:
  - the low-privilege runtime app path
  - the application-owned upgrade/bootstrap path used by future in-app upgrades
- remove any dependence on teacher-entered SQL credentials for normal classroom operation
- show clear in-progress, success, and failure states during the upgrade flow
- refresh Student Mode readiness automatically after a successful in-app upgrade
- preserve the production-safe privilege boundary by keeping runtime access low privilege and using elevated bootstrap authority only during explicit first-run provisioning or authorized upgrade operations
- update focused API and frontend tests
- update this work package document

This WP should build directly on the WP-126 bootstrap architecture rather than replacing it.

---

## Files Allowed to Change

Allowed:

- apps/api/src/**
- apps/web/src/**
- database/01-SequelCityCrimesDB - Create DB.sql
- database/migrations/2026-05-21-005-create-case-verification-objects.sql
- docs/01-work-packages/WP-127-in-app-admin-upgrade-resolution-path.md

Do Not Modify:

- docs/00-ssot/**
- package.json files

---

## Problems To Solve

### 1. Admin Mode Is Diagnostic-Only

WP-126 correctly blocks Student Mode and exposes Admin Mode diagnostics, but it stops short of an actual recovery action.

That means:

- teachers/admins can see that the database is behind
- teachers/admins cannot resolve the problem from inside the application
- setup still depends on external terminal or SQL tooling

### 2. Recovery Path Is Not Yet Classroom-Friendly

The current recovery instructions reference bootstrap mode and credentials.

That is useful for development, but not ideal for classroom operations.

The application should provide:

- a clear explanation of what is wrong
- a clear explanation of what the upgrade action will do
- an obvious one-click recovery action when the server is allowed to perform it
- a first-time provisioning path that uses the student's or teacher/admin's existing Windows-integrated SQL authority automatically on local admin machines
- no requirement for the classroom user to know or enter SQL Server usernames/passwords

### 3. Readiness Should Return Automatically

After an in-app upgrade succeeds, the app should not leave the teacher/admin in a stale degraded state.

The application should:

- refresh health/bootstrap state
- remove the Student Mode block when the database is ready
- make the next action obvious

### 4. Bootstrap Safety Must Be Preserved

The in-app recovery path must not weaken the production-safe model established in WP-126.

That means:

- no broad write/DDL access for the normal runtime user
- no student-accessible mutation route
- no hidden auto-upgrade in production verify mode
- explicit use of bootstrap authority only through a guarded admin action or startup provisioning path that the application itself controls

---

## Proposed Direction

### 1. Add A Dedicated Admin Upgrade Endpoint

Add a backend route that:

- checks current bootstrap/migration readiness
- attempts to use Sequel City's managed bootstrap account when it already exists
- falls back to Windows-integrated bootstrap on local admin machines when the managed account is not yet provisioned
- applies pending migrations using the existing migration service and bootstrap authority model
- returns a structured status payload with:
  - `success`
  - `message`
  - `migrated`
  - `currentMigrationKey`
  - `expectedMigrationKey`
  - `pendingMigrationKeys`

This route should stay tightly scoped to the migration/bootstrap path and should not become a generic admin SQL runner.

### 2. Add Admin Mode Upgrade UX

Admin Mode should gain an explicit upgrade section that:

- explains when the database is behind
- shows whether in-app upgrade is available
- presents an `Apply Required Upgrade` action when allowed
- shows progress while the request is running
- shows success/failure results clearly

### 3. Make Availability Explicit

The app should distinguish between:

- upgrade required and available in-app
- upgrade required but Sequel City's managed bootstrap account is not yet provisioned, while Windows-integrated bootstrap is available
- upgrade required but no acceptable bootstrap authority is available on this machine
- upgrade already complete

That prevents a teacher/admin from pressing a dead control or guessing what is misconfigured.

### 4. Refresh Readiness After Success

After the upgrade action succeeds:

- refresh `/api/health/full`
- clear the degraded bootstrap state
- allow Student Mode to proceed normally

### 5. Keep Admin Mode Teacher/Admin-Focused

Admin Mode should read like classroom operations, not internal engineering diagnostics only.

The copy should be:

- clear
- task-oriented
- minimal on raw implementation jargon

---

## Acceptance Criteria

- Admin Mode provides a clear in-app upgrade path when the classroom database is behind and bootstrap apply is available
- on local admin-managed machines, first-run bootstrap can use Windows-integrated authority without asking the classroom user for SQL usernames or passwords
- the backend exposes a dedicated migration/apply endpoint for the admin upgrade action
- the in-app upgrade action uses the existing WP-126 bootstrap authority model instead of bypassing it
- the upgrade action reports clear progress, success, and failure states
- Student Mode unblocks automatically after a successful in-app upgrade and health refresh
- the UI distinguishes between:
  - upgrade available
  - upgrade unavailable because Sequel City's managed bootstrap account is not provisioned yet but Windows-integrated bootstrap can resolve it
  - upgrade unavailable because no acceptable bootstrap authority is available on this machine
  - already up to date
- the implementation preserves low-privilege runtime boundaries and does not expose generic SQL mutation capability
- focused API and frontend regression coverage is updated where practical

---

## Codex Results

Revised target methodology implemented. WP-127 now follows the classroom-safe first-run bootstrap path instead of the temporary credential-entry fallback.

Summary:

- Added a dedicated admin bootstrap-apply API route at `POST /api/admin/bootstrap/apply`.
- Extended bootstrap status reporting with:
  - `canApplyInApp`
  - `applyActionMessage`
- Added a teacher/admin upgrade action in Admin Mode when bootstrap apply is available.
- Added first-time Sequel City account provisioning during the privileged bootstrap flow so future upgrades can rely on application-owned SQL identities instead of unrelated server logins.
- Added automatic local/dev startup promotion to `apply` mode when Sequel City's managed bootstrap account already exists, so the next restart can self-apply pending migrations without asking again.
- Corrected the case-verification SQL object creation path so the trigger/procedure bootstrap executes safely through the single-batch migration runner.
- Added in-progress, success, and failure messaging for the in-app upgrade flow.
- Refreshed Student Mode readiness automatically after a successful in-app upgrade.
- Preserved the low-privilege runtime boundary by routing the action through the existing WP-126 bootstrap authority model instead of exposing generic SQL mutation.
- Removed the teacher-entered SQL credential form from the normal classroom flow. First-run recovery now relies on Windows-integrated bootstrap authority on local admin-managed machines.

Accepted target delivered:

- Windows-integrated first-run bootstrap on local admin machines
- automatic provisioning of Sequel City's own SQL identities
- no teacher-entered SQL credentials in normal classroom use

Changed files:

- `apps/api/src/app.ts`
- `apps/api/src/routes/adminRoutes.ts`
- `apps/api/src/routes/adminRoutes.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/services/databaseBootstrapService.ts`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/types/database.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/api/types.ts`
- `apps/web/src/components/HealthStatus.tsx`
- `apps/web/src/components/HealthStatus.test.tsx`
- `apps/web/src/styles.css`
- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/migrations/2026-05-21-005-create-case-verification-objects.sql`
- `docs/01-work-packages/WP-127-in-app-admin-upgrade-resolution-path.md`

Verification:

- `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts`
- `node --experimental-strip-types apps/api/src/routes/adminRoutes.test.ts`
- `npm run test --workspace apps/api`
- `npm run test --workspace apps/web` passed with `151/151` tests
- `npm run build --workspace apps/web` passed

Operational model after this WP:

- first-time classroom recovery on local admin machines:
  - Sequel City uses Windows-integrated bootstrap authority
  - Sequel City provisions:
    - `sequel_web_user`
    - `sequel_bootstrap_user`
  - the app applies pending migrations
- later local/dev restarts:
  - if `sequel_bootstrap_user` already exists, startup promotes itself into automatic `apply` mode in non-production environments and uses the managed Sequel City bootstrap account without asking the teacher/admin again

---

## Gemini Audit Prompt

Audit WP-127 in-app admin upgrade resolution path.

Verify:

1. Only approved API, web, and WP files changed.
2. Admin Mode provides a clear in-app upgrade action when the classroom database is behind and bootstrap apply is available.
3. The backend exposes a dedicated route for migration/apply rather than a generic SQL execution path.
4. The upgrade action uses the existing WP-126 bootstrap/migration services and preserves the low-privilege runtime boundary.
5. The UI distinguishes between upgrade-available, upgrade-unavailable, and already-ready states.
6. On local admin-managed machines, first-run bootstrap uses Windows-integrated authority instead of prompting for SQL login credentials.
7. That privileged first-run action provisions Sequel City's required SQL identities so later upgrades no longer depend on unrelated SQL logins.
8. Success and failure states are clearly surfaced to the teacher/admin.
9. Student Mode readiness refreshes automatically after a successful in-app upgrade.
10. No student-accessible path can trigger privileged database mutation beyond the tightly scoped admin bootstrap route.
11. Focused API and frontend regression coverage was updated where practical.
12. Success confirmation remains visible long enough for a teacher/admin to understand that the in-app upgrade completed, even after health refresh changes bootstrap from degraded to ready.
13. The SQL object bootstrap path still starts cleanly after a restart, with the trigger/procedure creation compatible with the migration runner's execution model.

## Gemini Audit Results

Approved. The audit confirmed that WP-127 delivers the intended classroom-safe upgrade path.

Confirmed points:

- the changed files stay within the approved API, web, database-bootstrap, and WP scope
- Admin Mode exposes a dedicated `Apply Required Upgrade` path instead of a generic SQL runner
- first-run recovery uses Windows-integrated bootstrap authority on local admin-managed machines
- that first privileged run provisions Sequel City's managed SQL identities for later upgrades
- success and failure states are teacher/admin readable, and success remains visible after health refresh
- Student Mode unblocks automatically after a successful in-app upgrade
- the SQL trigger/procedure bootstrap path is compatible with the migration runner's execution model

## Final Decision

Accepted. WP-127 is approved for closeout and commit.

