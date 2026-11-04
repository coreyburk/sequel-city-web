# WP-316 SQL startup feedback

## Objective

Give students an actionable explanation when the local SQL connection fails before installation. The November 3 incident reproduced a pre-login timeout on a listening instance. Windows Application events recorded SQL Server memory allocation failures. The installer reported missing administrator access for every connection-open exception.

## Scope

### In Scope
- Classify connection failures from opening the Windows-integrated SQL connection.
- Distinguish handshake, timeout, refused connection, authentication, and unknown failures.
- Include the configured endpoint and an actionable recovery check in diagnostic messages.
- Redact raw exception details and credentials from student messages.
- Update non-SQL launcher fixtures in `scripts/tests/test-student-launcher.ps1`.
- Preserve existing database safeguards, transactions, and installer entry points.

### Out of Scope
- Service administration and Windows service management.
- Database case changes, story data alterations, or SQL schema migrations.
- Runtime credential generation changes or login password alterations.

## Impact Analysis

### Understand Status
- Graph available: Usable with direct source inspection authoritative. Narrow diagnostic change on connection-open exception path.

### Affected Architecture
- Student package database installation (`scripts/student-package/install-student-database.ps1`)
- Student package startup wrapper (`scripts/student-package/start-student-package.ps1`)
- Launcher tests (`scripts/tests/test-student-launcher.ps1`)

### Regression Surface
- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-launcher.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-package-script-shims.ps1`

### Graph Update Decision
- Regeneration required: No (narrow launcher diagnostic and test changes only).

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-316-sql-startup-feedback.md`
- `scripts/student-package/install-student-database.ps1`
- `scripts/student-package/start-student-package.ps1`
- `scripts/tests/test-student-launcher.ps1`

## Constraints

- The packaged launcher delegates to the same installer as the repository launcher.
- Limit changes to connection failure reporting and its non-SQL launcher fixtures.
- Keep exception text and credentials out of student messages.
- Preserve the existing setup guards and transactions.
- Service administration and case changes are outside implementation scope.

## Required Behavior

1. Distinguish pre-login handshake, timeout, refused connection, authentication, and unknown failures when opening the SQL connection.
2. Formulate student-facing messages containing the configured endpoint ($HostName,$Port) and an actionable recovery check.
3. Remove generic administrator prompt in the outer launcher catch block to preserve the specific diagnosis.
4. Redact raw exception details and credentials from all diagnostic reporting.
5. Retain all existing target assertions, permission checks, rollback handling, and database safeguards.

## Acceptance Criteria

- [x] Pre-login handshake, timeout, refused connection, authentication, and unknown failures distinguished.
- [x] Configured endpoint and recovery check included in messages.
- [x] Exception text and credentials kept out of student messages.
- [x] Existing setup guards and safeguards preserved across entry points.
- [x] Non-SQL launcher test fixtures pass and verify diagnostic classification, endpoint inclusion, and redaction.

## Code Prompt

Classify the exception chain from opening the Windows-integrated SQL connection and preserve the diagnosis through the launcher.

## Audit Prompt

Check message accuracy, credential safety, package entry points and preservation of existing database safeguards.

## Code Results

Implemented connection diagnosis and removed the generic administrator instruction from the outer launcher.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-launcher.ps1`: PASS (launcher/configuration/safety fixtures passed, including five diagnostic paths, nested exceptions, custom endpoint and redaction)
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-package-script-shims.ps1`: PASS (package and script shims intact)
- `git diff --check`: PASS (clean diff, no whitespace errors)

## Audit Results

### Independent Audit: WP-316 SQL Startup Feedback

**Verdict**: **PASS**  
**Auditor**: AntiGravity (Independent Audit)  
**Status**: `AuditedNeedsFinalDecision` (Pending human review)

---

### Audit Findings

#### 1. Message Accuracy
- **Classification Order & Handshake Resolution**: In [`Get-StudentConnectionFailure`](scripts/student-package/install-student-database.ps1#L259-L284), the pattern `'pre[- ]login|handshake'` is evaluated before general timeout checks. This accurately isolates the pre-login timeout condition observed during the November 3 incident rather than masking it as a generic connection timeout.
- **Error Codes & Patterns**:
  - **Handshake failure**: Matches `pre[- ]login|handshake`, directs student to SSMS check, SQL Server error log, and Windows Application log.
  - **Authentication failure**: Evaluates error code `18456` or `'login failed'`, advising verification of Windows SQL access.
  - **Connection refused**: Evaluates `10061` (`WSAECONNREFUSED`) or `'actively refused'`, checking that SQL Server is running and listening on the port.
  - **Timeout**: Evaluates `-2` (SQL timeout), `258` (`WAIT_TIMEOUT`), or `'timed out|timeout'`.
  - **Unknown fallback**: Points to testing the endpoint in SSMS using Windows Authentication and inspecting the SQL Server error log.
- **Configured Endpoint & Recovery Checks**: Every diagnostic path formats `$endpoint = "$HostName,$Port"` into the message and includes an actionable recovery step.

#### 2. Credential Safety
- **Exception Text Redaction**: Raw exception strings (`$cause.Message`, `$detail`) are strictly used as regex inputs for branching; neither exception message text nor stack traces are concatenated into the student-facing message.
- **Credential Protection**: The Windows-integrated connection builder (`Integrated Security = true`) does not interpolate credentials. Fixture and credential tokens (verified via `'private-fixture'` in [`test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1#L107-L117)) do not leak into returned messages.

#### 3. Package Entry Points
- **Delegation Consistency**: Both repository-root [`start-student-package.ps1`](scripts/start-student-package.ps1#L19-L26) and the packaged launcher ([`Start-SequelDetective.cmd`](Start-SequelDetective.cmd#L7) via [`scripts/student-package/start-student-package.ps1`](scripts/student-package/start-student-package.ps1#L237-L238)) delegate to [`Install-StudentDatabase`](scripts/student-package/install-student-database.ps1#L286-L423).
- **Preserved Diagnosis**: In [`Invoke-StudentLaunch`](scripts/student-package/start-student-package.ps1#L237-L238), removing the blanket administrator prompt allows specific diagnostic messages from [`Get-StudentConnectionFailure`](scripts/student-package/install-student-database.ps1#L259-L284) to bubble up cleanly (`Local database setup could not finish. <diagnostic message>`).
- **Packaging Integrity**: [`build-student-tester-package.ps1`](scripts/student-package/build-student-tester-package.ps1#L94-L111) packages all necessary scripts, entry points, and migration files without including `.env` secrets or Git metadata.

#### 4. Preservation of Existing Database Safeguards
- **Pre-connection Checks**: Host/port validation via [`Assert-StudentSqlTarget`](scripts/student-package/install-student-database.ps1#L11-L17) (restricting to localhost/127.0.0.1 and blocking system databases) and SQL script section boundary validations run before `$connection.Open()`.
- **Concurrency & Locking**: Exclusive session application locking (`sys.sp_getapplock`) and non-pooled connection settings (`Pooling = false`) remain intact.
- **Database & Evidence Safeguards**:
  - Stable owner verification (`sid=0x01` via [`Get-StudentStableSqlOwner`](scripts/student-package/install-student-database.ps1#L219-L224)).
  - Verified pre-mutation backup with checksum verification ([`Backup-StudentDatabase`](scripts/student-package/install-student-database.ps1#L230-L238)).
  - Strict evidence, schema, and owner repair targets ([`Assert-StudentEvidence`](scripts/student-package/install-student-database.ps1#L154-L166), [`Assert-StudentRuntimeShape`](scripts/student-package/install-student-database.ps1#L168-L217), [`Assert-StudentOwnerRepairTarget`](scripts/student-package/install-student-database.ps1#L239-L257)).
  - Transaction rollbacks (`SET XACT_ABORT ON;`) and retention of claimed databases without dropping them.
  - Setup permission checks (`229, 262, 15151, 15247`) in [`Install-StudentDatabase`](scripts/student-package/install-student-database.ps1#L415-L417) continue to report local administrator requirements when authorization fails post-connection.

---

### Automated Validation Summary

- [`scripts/tests/test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1): **PASS** (all 5 failure routes, custom endpoint formatting, and redaction assertions verified).
- [`scripts/tests/test-student-package-script-shims.ps1`](scripts/tests/test-student-package-script-shims.ps1): **PASS** (package build and script shims verified).
- `git diff --check`: **PASS** (no whitespace errors or scope violations).
- [`scripts/check-work-package-closeout.ps1`](scripts/check-work-package-closeout.ps1): **PASS** (`Closeout state: ReadyForAcceptance`).
- Work package record [`WP-316-sql-startup-feedback.md`](docs/01-work-packages/WP-316-sql-startup-feedback.md) updated with audit verdict and verification evidence.

## Final Decision

Accepted for integration under the human instruction on 2026-11-04 to review, commit, merge and push as appropriate. Independent AntiGravity audit passed.
