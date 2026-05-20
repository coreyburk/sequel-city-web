# WP-123: controlled-solution-trigger-submission-for-student-theory-checks

## Objective

Restore the original murder-mystery suspect-verification loop in Student Mode without weakening the SQL safety model.

The immediate concerns are:

- the original game required students to `INSERT` a suspect name into the `Solution` table and let a trigger write the verdict
- the current student SQL sandbox is intentionally `SELECT`-only, so that direct `INSERT INTO Solution ...` workflow is not currently available
- current Student Mode guidance points students toward `Solution`, but the UX does not yet provide a safe, clear way to test a suspect theory
- we want to preserve the spirit of the original trigger-backed mechanic without broadening the Query Runner into general write access

The goal is:

Add a controlled Student Mode theory-submission flow that uses the backend to perform the `Solution` insert and verdict lookup safely, while keeping student SQL read-only.

---

## Scope

Implement a dedicated suspect-theory verification flow for Student Mode that wraps the existing `Solution` trigger behavior in a controlled UI and backend path.

This WP may modify:

- Student Mode theory-testing UI and progression
- relevant backend verification endpoint/service wiring
- narrowly scoped database verification procedure wiring
- frontend state and result display for suspect checks
- focused tests across frontend and backend where practical
- this work package document

No general SQL write access.
No unrestricted `INSERT`, `UPDATE`, or `DELETE` in Query Runner.
No database schema changes unless strictly required and explicitly justified.

---

## Files Allowed to Change

Allowed:

- apps/web/src/**
- apps/api/src/**
- database/01-SequelCityCrimesDB - Create DB.sql
- docs/01-work-packages/WP-123-controlled-solution-trigger-submission-for-student-theory-checks.md

Do Not Modify:

- database/02-SequelCityCrimesDB - Insert Data.sql
- database/03-SequelCityCrimesDB - ForeignKeys.sql
- docs/00-ssot/**
- package.json files
- unrelated build configuration

---

## Constraints

- Preserve deterministic gameplay behavior
- Preserve spoiler-safe guidance
- Preserve Samuel's mentor role
- Preserve the `SELECT`-only student SQL sandbox
- Do not allow arbitrary non-`SELECT` statements in Query Runner
- Prefer controlled backend submission over widening SQL permissions
- Preserve compatibility with the existing `Solution` trigger pattern
- Prefer a stored procedure boundary over direct table insert permissions for the web user

---

## Required Behavior

### 1. Keep Student SQL Read-Only

Student Mode Query Runner must remain `SELECT`-only.

Do not:

- allow arbitrary `INSERT`
- allow broad write access to `Solution`
- weaken the existing SQL safety service just to recreate the original syntax literally

### 2. Add A Controlled Theory Submission Flow

Student Mode needs a dedicated way to test a suspect theory once the relevant suspect candidate is pinned.

The flow should:

- let the student submit a suspect theory in a controlled UI
- use a backend path that performs the `INSERT INTO Solution (Suspect)` operation safely
- allow the database trigger to determine the verdict
- return the verdict to the frontend in a clear student-facing result

### 3. Preserve The Original Trigger Mechanic

The verification flow should rely on the original `Solution`-table trigger behavior whenever practical.

That means:

- the backend should submit the suspect name to `Solution`
- a stored procedure boundary is acceptable and preferred if it still relies on the original `Solution` insert + trigger flow internally
- the trigger should write or influence the verdict result
- the student should receive feedback derived from the same underlying mystery-check mechanism as the original game

### 4. Make The Student UX Clear

The suspect-theory step should not imply that the student must type raw `INSERT` SQL unless that exact path is intentionally and safely supported.

The UI should make the next action obvious, such as:

- using a pinned suspect name
- testing that suspect through a dedicated action
- reviewing the verdict/result

### 5. Preserve Future Mastermind Compatibility

The chosen approach should be reusable for the later mastermind suspect as well, not just the first suspect theory.

Avoid a design that only works for one one-off suspect-check step.

### 6. Tests

Add or update focused tests for:

- backend theory submission / verdict retrieval path
- student-facing suspect-theory flow
- continued blocking of arbitrary `INSERT` in Query Runner
- correct handling of right/wrong suspect verdicts where practical

---

## Acceptance Criteria

- Student Mode has a clear controlled suspect-theory submission flow
- the flow uses a backend-controlled `Solution` submission path rather than general Query Runner write access
- Query Runner remains `SELECT`-only for students
- the original trigger-backed verification behavior is preserved or faithfully wrapped
- the UX clearly distinguishes theory submission from general SQL querying
- the approach is reusable for the mastermind suspect later
- tests updated where practical
- no unrelated backend or database changes introduced

---

## Codex Prompt

Implement WP-123 for Sequel City Web Detective.

Objective:
Restore the original `Solution` trigger suspect-verification loop in Student Mode through a controlled backend-backed theory submission flow, without allowing general `INSERT` in student SQL.

Implement:

1. Keep student Query Runner SQL read-only.
2. Add a controlled suspect-theory submission path in Student Mode.
3. Use the backend to insert the submitted suspect into `Solution` and retrieve the verdict.
4. Surface the verdict clearly in the student UX.
5. Keep the design reusable for the later mastermind suspect.
6. Update focused tests.

Do not:

- allow arbitrary `INSERT`, `UPDATE`, or `DELETE` in Query Runner
- broaden SQL safety rules for general writes
- modify unrelated database setup scripts unless absolutely necessary
- introduce runtime AI behavior

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the original trigger-backed suspect verification concept

---

## Gemini Audit Prompt

Audit WP-123 controlled suspect-theory submission.

Verify:

1. Only approved frontend, backend, and work-package files changed.
2. Student Query Runner remains `SELECT`-only.
3. No arbitrary general SQL write access was introduced.
4. Student Mode now has a dedicated controlled suspect-theory submission flow.
5. The backend path safely performs the `Solution` insert and retrieves the verdict.
6. The backend now uses the stored procedure boundary `dbo.VerifySuspectSubmission` rather than direct table-write permissions for the web user.
7. The database script change is narrowly scoped to the verification procedure plus the required `EXECUTE` grant for `sequel_web_user`.
8. The trigger-backed verification concept is preserved or faithfully wrapped.
9. The UX clearly distinguishes theory submission from ordinary SQL querying.
10. The approach is reusable for later mastermind verification.
11. Tests were updated where practical.
12. The work package correctly documents the one-time local database migration prerequisite for already-running developer databases.

Flag:

- any widening of general SQL write permissions
- any direct `INSERT INTO Solution` path remaining in the app-facing backend service
- any database change broader than the verification procedure and `EXECUTE` permission needed by the web user
- any mismatch between the student UX and the actual verification mechanism
- treating the current live browser failure as a product bug when it is actually caused by the local DB not yet having the new procedure deployed
- any implementation that bypasses the intended `Solution` trigger concept without justification
- missing right/wrong verdict handling
- missing regression coverage

---

## Codex Results

Implemented a controlled suspect-theory submission flow for Student Mode without widening the SQL sandbox.

Frontend changes:

- added a dedicated `Suspect Theory Check` panel in Student Mode with a full-name input, explicit `Test Theory` action, and verdict/result display
- updated the suspect-theory support panel so it points students to the pinned gym-linked suspect name instead of telling them to query `Solution`
- prefills the theory-check input from the pinned gym-linked suspect name when available
- treats a successful theory check as a progression event and surfaces student-facing success/failure feedback

Backend reuse:

- replaced the direct table-write verification path with a stored procedure boundary: `dbo.VerifySuspectSubmission`
- the procedure still inserts into `Solution` and reads back the trigger verdict, but now runs under a dedicated no-login database user (`solution_verifier`) rather than `OWNER`
- kept Student Mode Query Runner `SELECT`-only with no new general write access

Database deployment note:

- the local database must have `dbo.VerifySuspectSubmission` created, `solution_verifier` provisioned as a no-login database user, `INSERT`/`SELECT` on `dbo.Solution` granted to that user, and `EXECUTE` on the proc granted to `sequel_web_user`
- the current repo includes that change in `database/01-SequelCityCrimesDB - Create DB.sql`
- applying that proc to an already-running local database still requires a login with database DDL rights; the configured web login does not have permission to create procedures

Tests and verification:

- updated focused Student Mode regression coverage for the new suspect-theory flow
- `npm run test --workspace apps/web` passed with `143/143` tests
- `npm run build --workspace apps/web` passed
- `npm run test --workspace apps/api` passed

## Gemini Audit Results

I have completed the audit of Work Package 123 (WP-123), "Controlled Suspect-Theory Submission." The implementation successfully restores the original trigger-backed verification loop in Student Mode while strictly maintaining the project's SQL safety model.

Summary:

- Student Query Runner remains `SELECT`-only; no general write access was introduced
- suspect checks now run through `dbo.VerifySuspectSubmission` instead of a direct app-facing `INSERT INTO Solution` path
- the database change stays narrowly scoped to the verification procedure, the `solution_verifier` no-login user, and the `EXECUTE` grant for `sequel_web_user`
- the original `Solution` trigger remains the source of truth for trigger-man and mastermind verdicts
- Student Mode now uses a dedicated suspect-theory panel that is distinct from ordinary SQL querying
- focused frontend and backend verification passed

Final determination:

The implementation is compliant with the WP-123 objective and constraints. Approve and close WP-123.

## Final Decision

Accepted.

