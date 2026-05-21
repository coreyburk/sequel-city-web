# WP-126: migrate-hard-coded-suspect-logic-to-case-config-driven-answers

## Objective

Replace the current hard-coded suspect identity logic and case-specific guidance assumptions with a case-config-driven design that supports future case expansion and safer admin-side suspect changes.

The immediate architectural concerns are:

- the database trigger currently identifies the murderer and mastermind through hard-coded answer values
- the frontend still contains case-specific suspect names and hand-authored guidance strings that assume the current fixed case
- the suspect-verification flow depends partly on exact verdict wording instead of structured answer metadata
- future case expansion will be fragile if answer keys and progression logic stay embedded in frontend copy and trigger text

The goal is:

Preserve the current gameplay loop, but move suspect verification and guidance derivation toward a configurable case model where answer keys, suspect roles, and case guidance can change without rewriting large pieces of the app.

---

## Scope

Implement the first production slice of the case-config-driven redesign:

- move suspect answer keys out of hard-coded trigger comparisons and into case configuration stored in SQL
- return structured suspect-verification fields from the backend instead of relying on verdict text alone
- switch the frontend theory-check flow to use structured verification metadata for progression
- replace hard-coded post-trigger suspect-name guidance with data derived from the confirmed suspect and pinned facts
- add an idempotent API bootstrap check so startup verifies or converges the required WP-126 database objects instead of assuming manual SQL setup
- keep the bootstrap authority model production-safe by defaulting startup to verify-only mode and requiring explicit opt-in for automatic apply
- introduce a schema-version ledger and ordered migration files so existing databases can be upgraded cleanly without relying on ad hoc object checks
- add a teacher/admin-facing setup gate so Student Mode blocks behind a clear readiness panel whenever the classroom database is behind, while Admin Mode remains available for diagnostics
- keep the existing gameplay loop and celebratory verdict copy intact

This WP is intentionally limited to the suspect-verification path and the immediate mastermind handoff. It does not attempt full multi-case authoring or a full Samuel-copy rewrite yet.

---

## Files Allowed to Change

Allowed:

- apps/api/src/**
- apps/web/src/**
- database/01-SequelCityCrimesDB - Create DB.sql
- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- database/migrations/**
- docs/01-work-packages/WP-126-migrate-hard-coded-suspect-logic-to-case-config-driven-answers.md

Do Not Modify:

- docs/00-ssot/**
- package.json files

---

## Current Problems

### 1. Hard-Coded Answer Keys

The current database trigger and procedure flow still assume fixed suspect identities for the trigger man and mastermind.

That means:

- changing the murderer or mastermind name is not a simple admin operation
- answer-key updates require SQL logic changes
- case expansion to multiple cases will be brittle

### 2. Frontend Guidance Assumes Specific Identities

The frontend currently includes case-specific guidance that references the known trigger man by name and shapes the next steps around that fixed identity.

That means:

- suspect names are partly embedded in React logic
- changing the underlying answer keys can desynchronize the UI
- guidance reuse across future cases is limited

### 3. Verdict Parsing Is Too Text-Dependent

The current controlled suspect-theory flow uses human-readable verdict text for some progression decisions.

That means:

- changing the verdict copy can accidentally break progression
- the UI is not yet using a fully structured verification contract

---

## Proposed Direction

### 1. Move Answer Keys Into Case Configuration

Store answer identity data in a case-config source rather than inside hard-coded trigger comparisons.

Prefer:

- stable internal identifiers like `PersonID`
- explicit suspect roles such as `trigger_man` and `mastermind`
- case-scoped configuration such as `CaseId`

Possible shape:

- `CaseAnswerKey`
  - `CaseId`
  - `AnswerRole`
  - `PersonID`
  - `RevealOrder`

### 2. Return Structured Verification Results

The verification path should return machine-friendly data in addition to narrative verdict text.

Example fields:

- `success`
- `suspect`
- `isCorrect`
- `solvedRole`
- `nextRole`
- `caseId`
- `verdict`

The UI should use structured fields for progression and use `verdict` only for student-facing narrative display.

### 3. Derive Guidance From Case Metadata

Samuel's guidance should be derived from case metadata and pinned facts rather than from fixed suspect names baked into the frontend.

That likely means:

- case-level step descriptors
- clue-to-next-step mappings
- role-based guidance templates
- optional case-specific narrative copy

### 4. Separate Narrative Copy From Answer Logic

Narrative celebration text can stay expressive, but it should not be the source of truth for progression.

The app should:

- progress from structured verification fields
- display narrative copy independently
- allow wording changes without breaking logic

### 5. Keep PersonID As The Stable Internal Key

If admins want to change names, aliases, or display labels, the app should still verify against a stable internal identifier.

That makes:

- suspect-name changes safer
- case maintenance easier
- future localization or alternate-case presentation possible

---

## Questions For Later Follow-Up

1. Should case configuration live in SQL tables, API-served JSON, or a hybrid model?
2. Should the existing `Solution` trigger remain the final authority, or should it be replaced by a stored-procedure / table-driven verifier?
3. Should the admin be able to change only names, or also the actual answer identities and case progression mappings?
4. How much of Samuel's copy should be generic templates versus case-authored narrative content?
5. How should multi-case support select the active case and its answer-key set?

---

## Acceptance Criteria

- answer keys are no longer hard-coded in the trigger/procedure as fixed suspect-name byte comparisons
- the database stores suspect answer configuration using stable identifiers such as `PersonID` and role labels
- suspect verification returns structured fields the frontend can use without parsing verdict prose for progression
- the student theory-check UI and state flow use structured verification metadata for trigger-man and mastermind progression
- mastermind handoff guidance derives the confirmed trigger-man identity from returned or pinned data rather than a fixed Jeremy-specific string
- the redesign preserves the current trigger-backed verdict copy and deterministic gameplay loop
- API startup verifies the required WP-126 database shape and either converges it through an idempotent bootstrap path or fails early with a clear configuration error
- automatic bootstrap apply is explicitly opt-in rather than implicit, so the normal low-privilege app startup path remains production-safe
- startup version checks are driven by `AppSchemaVersion` plus ordered migration files instead of one-off object probing
- local/dev startup defaults to automatic apply when bootstrap credentials are present, while production remains verify-first unless explicitly configured otherwise
- Student Mode blocks behind a teacher/admin setup screen when the API reports degraded bootstrap state, so students cannot quietly work against an out-of-date classroom database
- the teacher/admin setup screen is readable in the noir theme, does not leak unrelated first-run diagnostics underneath it, and provides a visible path into Admin Mode
- Admin Mode remains diagnostic-only in this WP; it exposes readiness details but does not yet run migrations from inside the UI
- focused API and frontend regression coverage is updated where practical

---

## Codex Results

Implemented the first case-config-driven suspect-verification slice across the database scripts, backend verification contract, and Student Mode mastermind handoff.

Summary:

- replaced hard-coded trigger byte comparisons with a new `CaseAnswerKey` table keyed by `CaseId`, `AnswerRole`, and stable `PersonID` values
- aligned the `CaseAnswerKey` schema changes with the repo's database-script convention: table in `01`, seed data in `02`, and foreign key in `03`
- updated `VerifySuspectSubmission` to return structured verification fields including `caseId`, `isCorrect`, `solvedRole`, `nextRole`, and `suspectPersonId`
- replaced the temporary object-shape bootstrap with a real `AppSchemaVersion` ledger and ordered SQL migrations under `database/migrations/`
- added an idempotent API bootstrap service that verifies WP-126 schema state on startup and, when optional bootstrap credentials are configured, applies any pending migrations automatically
- made bootstrap authority explicit with `SQLSERVER_BOOTSTRAP_MODE`, which defaults to `verify`, can fail closed in `enforce`, and only applies schema changes when set to `apply`
- defaulted non-production startup to `apply` automatically when bootstrap credentials are present, so local classroom/dev startup can converge the database without extra manual flags
- changed `/api/health/full` to return `503` when bootstrap is degraded even if the database connection itself is healthy
- added a Student Mode setup gate that replaces the case workflow with a teacher/admin-facing setup panel whenever the health API reports database/bootstrap readiness problems
- separated the Student Mode setup gate from the generic first-run diagnostics panel, gave the setup details their own readable dark-theme styling, and added an explicit `Open Admin Mode` path for the teacher/admin
- renamed the UI surface from `Developer Mode` to `Admin Mode` so the readiness-recovery path reads like an operations tool instead of a coding view
- normalized loopback SQL Server hosts to `localhost` in the SQL config path to avoid the TLS `ServerName` IP warning during local development
- updated API and frontend verification types so progression uses structured response data instead of verdict-text parsing
- switched the student theory-check flow and reveal panel to use `solvedRole` metadata for trigger-man and mastermind progression
- replaced hard-coded Jeremy-specific mastermind guidance with copy derived from the confirmed suspect and pinned facts
- updated focused API and frontend regression coverage for the new structured response contract and bootstrap diagnostics

Files changed:

- `apps/api/src/app.ts`
- `apps/api/src/config/database.ts`
- `apps/api/src/routes/healthRoutes.ts`
- `apps/api/src/routes/caseRoutes.test.ts`
- `apps/api/src/routes/healthRoutes.test.ts`
- `apps/api/src/services/databaseBootstrapService.ts`
- `apps/api/src/services/databaseBootstrapService.test.ts`
- `apps/api/src/services/databaseMigrationService.ts`
- `apps/api/src/services/caseVerificationService.test.ts`
- `apps/api/src/services/caseVerificationService.ts`
- `apps/api/src/services/databaseMetadataService.test.ts`
- `apps/api/src/services/databaseMetadataService.ts`
- `apps/api/src/types/database.ts`
- `apps/api/src/db/sqlServerPool.ts`
- `apps/api/src/types/caseVerification.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/api/types.ts`
- `apps/web/src/components/HealthStatus.tsx`
- `apps/web/src/components/SuspectVerificationPanel.test.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/guidance.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`
- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `database/03-SequelCityCrimesDB - ForeignKeys.sql`
- `database/migrations/2026-05-21-001-create-case-answer-key-table.sql`
- `database/migrations/2026-05-21-002-seed-case-answer-key-case-004.sql`
- `database/migrations/2026-05-21-003-add-case-answer-key-foreign-key.sql`
- `database/migrations/2026-05-21-004-create-solution-verifier-user.sql`
- `database/migrations/2026-05-21-005-create-case-verification-objects.sql`
- `docs/01-work-packages/WP-126-migrate-hard-coded-suspect-logic-to-case-config-driven-answers.md`

Verification:

- `npm run test --workspace apps/api` passed
- `node --experimental-strip-types apps/api/src/services/databaseBootstrapService.test.ts` passed
- `npm run test --workspace apps/web` passed with `148/148` tests
- `npm run build --workspace apps/web` passed

Deployment note:

- API startup now checks schema state through `AppSchemaVersion` plus ordered migration files under `database/migrations`
- startup defaults to `SQLSERVER_BOOTSTRAP_MODE=verify`, which never mutates the database and starts in a degraded-but-readable state when migrations are pending
- when bootstrap credentials are configured and no explicit mode is supplied, non-production startup defaults to automatic `apply` so local classroom/dev launches can converge the database hands-off
- `SQLSERVER_BOOTSTRAP_MODE=enforce` fails closed when the database is behind the expected migration version
- when `SQLSERVER_BOOTSTRAP_MODE=apply` is explicitly set and `SQLSERVER_BOOTSTRAP_USER` plus `SQLSERVER_BOOTSTRAP_PASSWORD` are configured with sufficient DDL rights, startup applies pending migrations and records them in `AppSchemaVersion`
- a fresh database built through `01/02/03` now lands at the same versioned state as a migrated database because the final script records the WP-126 migration keys in `AppSchemaVersion`
- if the API is still running in degraded verify mode, Student Mode now shows a teacher/admin setup panel instead of letting students continue into a partially upgraded case flow
- the setup panel now routes teachers/admins toward Admin Mode for diagnostics, but this WP intentionally stops short of an in-app `Run Upgrade Now` action

## Gemini Audit Prompt

Audit WP-126 case-config-driven suspect verification and mastermind handoff alignment.

Verify:

1. Only approved API, web, database-script, and WP files changed.
2. `database/01-SequelCityCrimesDB - Create DB.sql` no longer hard-codes suspect verification through byte comparisons inside `CheckSuspect`.
3. Suspect answer keys are stored in SQL configuration using stable identifiers such as `PersonID` and explicit roles, with table creation in `01`, seed data in `02`, and foreign-key definition in `03`.
4. `VerifySuspectSubmission` returns structured fields the app can use for progression, including success-role metadata separate from verdict prose.
5. The API verification types and service preserve the current success/failure shape while exposing the new structured fields.
6. Student suspect-theory progression no longer parses verdict text to decide trigger-man or mastermind completion.
7. The mastermind handoff guidance in Student Mode no longer depends on a fixed hard-coded trigger-man name and instead uses confirmed suspect / pinned-fact data.
8. The existing trigger-backed verdict copy remains visible to students and the gameplay loop still works.
9. API startup now verifies schema state through `AppSchemaVersion` and ordered migration files rather than custom object probes.
10. Automatic bootstrap apply requires explicit opt-in and separate elevated credentials.
11. `verify`, `apply`, and `enforce` bootstrap modes behave as documented, and non-production defaults to `apply` automatically when bootstrap credentials are present.
12. `/api/health/full` reports degraded bootstrap as unavailable for readiness checks even when the database connection itself is healthy.
13. Student Mode blocks behind a teacher/admin setup panel whenever bootstrap is degraded or the API/database is unavailable.
14. The teacher/admin setup panel is readable in Student Mode, does not leak the generic first-run guidance underneath it, and provides a visible path into Admin Mode.
15. Admin Mode is diagnostic-only in this WP: it exposes readiness details but does not yet provide an in-app migration/apply action.
16. Focused API and frontend regression coverage was updated for the new structured contract and bootstrap diagnostics.

## Gemini Audit Results

Approved.

Audit confirmed the full WP-126 slice:

- suspect verification now resolves against `CaseAnswerKey` with stable `PersonID` keys and role metadata instead of hard-coded suspect-name byte comparisons
- the backend returns structured verification fields and the frontend progresses from those fields instead of verdict-prose parsing
- `AppSchemaVersion` plus ordered migrations now drive bootstrap readiness, with `verify`, `apply`, and `enforce` behaving as documented
- `/api/health/full` correctly reports degraded bootstrap readiness and Student Mode blocks behind a readable teacher/admin setup panel
- Admin Mode exposes diagnostics only in this WP and does not yet run migrations from inside the UI
- focused API and frontend regression coverage was updated and passed

## Final Decision

Accepted.

