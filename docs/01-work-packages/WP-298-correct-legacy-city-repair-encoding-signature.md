# WP-298: correct the legacy city repair encoding signature

## Lifecycle reconciliation (2026-10-28)

Status: Accepted by the human on 2026-10-28 after implementation validation and completed independent AntiGravity PASS. Commit and push authorized; installed-database repair remains separate.

Pre-implementation source review confirmed the installer recognized only the current seed's Report 10571 description signature; it contains neither the observed alternate binary signature nor its adversarial tests. WP-309 repaired database ownership, and WP-311 separated fresh bootstrap from historical upgrades; neither implemented this encoding correction. Current fresh builds do not need this legacy-only exception. Keep the fix available for the exact affected legacy dataset if support is required.

The recorded live preflight below occurred on 2026-10-15. No new live database inspection or repair was performed during reconciliation, and no claim is made about today's installed row values. Do not retry a live repair or broaden the signature predicate under this administrative request.

## Objective

Allow the accepted WP-297 city repair to recognize the one exact historical ReportDescription encoding variant found in the configured classroom database, without changing description bytes or weakening rejection of unknown datasets.

## Scope

Originally corrective planning on 2026-10-15; the human explicitly requested "Implement WP-298" on 2026-10-28. Original package: docs/01-work-packages/WP-297-canonical-sequel-city-name.md, accepted and pushed as f79c3c5ba43038b1a7807ff5bd1e64d09478bb4a. Finding: defect/compatibility omission in Get-StudentCityState's description signature. This is not a new data-cleanup feature.

The user authorized applying the accepted backed-up upgrade. Read-only preflight refused the dataset before backup or mutation. Fourteen target reports match the seed exactly. Report 10571 (CrimeID 1005, ReportDate 20220820) has the same description apart from an older dash representation. Its stored varchar description has SHA256 874ecc5de33bf6cb065a62c0b6224fb293033c4c3220a0ec6db6e54c973409eb, with the three bytes E2 80 93 at the dash position. Those bytes are displayed through Windows-1252 as U+00E2 U+20AC U+201C. The current fresh seed instead contains U+FFFD at this location; the installer matches its SQL varchar conversion. Do not rewrite either description in this correction.

Repository history confirms an earlier single-byte dash source (96); later source already contains EF BF BD. The live three-byte variant is observed directly, not inferred to match current source. Retain the exact full-row/full-description signature rather than accepting arbitrary encoding substitutions.

## Impact Analysis

### Understand Status

Required tier: administrative evidence repair and saved-version compatibility. Four graph artifacts are available; current main is 2fce050 and the existing graph baseline is d211f49, generated from the WP-313 source snapshot. The earlier planning analysis used the accepted WP-297 graph. Source is authoritative for the current installer and single-workspace fixtures. Source-confirmed dependencies: Get-StudentCityState, Repair-StudentCity, installer backup/transaction path and launcher SQL fixtures. The new variant changes no schema or application API.

### Affected Architecture

Only the existing fixed-signature administrative recognition predicate and its disposable regression fixtures. No new public write interface or migration framework.

### Regression Surface

- Related tests: scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch and scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers.

Current fresh-seed signature; exact observed historical signature; altered text, wrong identity, unknown legacy rows and mixed city refusal; verified backup, transaction rollback, idempotency; immutable released content and saved attempts/proof/workspaces; current readiness and full released-case paths.

### Graph Update Decision

Refresh all four tracked artifacts after implementation. No refresh during this planning step.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-298-correct-legacy-city-repair-encoding-signature.md
- scripts/student-package/install-student-database.ps1
- scripts/tests/test-student-launcher.ps1
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Handoff is accepted-closeout only.

Do Not Modify:
- apps/**
- database/**
- immutable released content, learner attempts/proof/workspace or report descriptions
- general public evidence DML prohibition, permissions, identity/date/crime signatures, other report identities
- configured live databases during implementation or tests
- accepted WP-297 implementation/audit/acceptance history

## Constraints

No LIKE matching, text normalization, replacement-character stripping, count-only signatures, broad alternate encodings or general exception list. Accept only the existing seed signature or this one complete observed binary description for ReportID 10571 with its unchanged CrimeID/date. All other signature checks remain exact. Original description bytes survive repair.

Implementation tests use only the registered SequelCityRuntimeTest_Workspace through its exclusive backup/restore runner. No new database clone is permitted. Do not retry the configured live repair until the correction passes independent audit and human acceptance. The subsequent operational attempt must use the existing retained COPY_ONLY/CHECKSUM backup, verification, signature recheck and one transaction; no direct UPDATE or rebuild.

## Required Behavior

1. Express the observed alternate as one deterministic exact full-description binary signature restricted to ReportID 10571, CrimeID 1005 and ReportDate 20220820. Preserve recognition of the current authoritative fresh-seed variant.
2. Prove on disposable old-runtime fixtures that both known signatures allow the same fifteen ReportCity-only corrections, retain every non-city value and publish the same current content/marker.
3. Reject one-byte/one-character alterations around either signature, altered dates/crimes/IDs, unknown old-city rows, partial repairs and corrupted content. Preserve all existing refusal checks.
4. Verify backup/restore verification, interruption rollback, idempotency and all evidence/content/attempt/proof/workspace hashes, including the alternate description's exact bytes before/after repair.
5. Record the observed live-preflight refusal and exact limitations. Preserve separate operational authorization and human acceptance gates.

## Acceptance Criteria

- [x] Both precisely identified signatures work in disposable legacy fixtures; no broad normalization is introduced.
- [x] Report 10571 description bytes remain unchanged while only the known ReportCity fields change.
- [x] Unknown/adversarial datasets are still refused, including single-character changes to either known description.
- [x] Verified backup, atomic rollback, idempotency, preserved v1 content/proofs/workspaces and released-case readiness regressions pass.
- [x] Independent audit and human acceptance remain separate; implementation tests never mutate the configured database.

## Code Prompt

After separate implementation authorization, implement the smallest exact alternate-signature predicate and disposable tests. Preserve every other guard. Do not change database seed descriptions or accepted WP-297 history. Run real launcher SQL/refusal/rollback/preservation regression and released-case bootstrap/browser checks. Refresh graph artifacts and record exact evidence. Stop for independent audit; do not accept, commit/push or retry the configured live database as a test.

## Audit Prompt

Independently falsify the bounded signature claim: prove the full observed binary sentence and identity restriction, preserve the current seed path, reject nearby variants and unknown datasets, and confirm no normalization or general public writes. Require actual disposable SQL proof of unchanged description bytes, verified backup, rollback, idempotency and preserved content/attempt/proof/workspace hashes. Confirm no live database writes and no changes to accepted WP-297 history. Record PASS, FAIL or BLOCKED; human acceptance remains separate. Return a completed review through the runner output; do not edit Final Decision or any source/graph files. The isolated audit snapshot has no SQL workspace registration: inspect the recorded real-SQL validation summaries and fixture source, clearly state any execution limitations, and do not create a database or use an installed database to obtain additional evidence. Include concrete scope, acceptance, negative-path, execution-safety and boundary findings.

## Code Results

Implemented on branch `codex/wp-298-exact-legacy-signature` after explicit authorization on 2026-10-28.

- Added one 135-byte binary alternate for ReportID 10571 / CrimeID 1005 / ReportDate 20220820. Its SHA-256 is `874ecc5de33bf6cb065a62c0b6224fb293033c4c3220a0ec6db6e54c973409eb`. The existing seed sentence remains accepted; no text normalization or other signature exceptions were added.
- SQL regression exposed trailing-zero padding in binary equality. Both descriptions for Report 10571 now require matching byte lengths as well as matching bytes. All other report predicates, backup/transaction behavior and the fifteen city-only updates remain unchanged.
- The launcher suite independently constructs the historical sentence from ASCII plus E2 80 93, verifies its hash, and exercises both seed and observed signatures through the same existing legacy fixture. Each path rejects altered first/separator-adjacent/final bytes, appended space/null bytes, wrong crime/date and the alternate sentence on a different report before backup. Existing unknown-row, mixed-city and corrupted-content checks remain active.
- Both paths passed backup-failure refusal, injected transaction rollback, verified backup, repeat-launch idempotency, unchanged raw description bytes, full public-evidence hashes, released v1 content hashes, and saved attempt/proof/workspace/evidence preservation.

Validation on the single registered `SequelCityRuntimeTest_Workspace` (sequential backup/restore sessions; no additional database clone):

- `scripts/tests/test-student-launcher.ps1`: PASS.
- `scripts/tests/test-student-launcher.ps1 -SqlIntegration -PackageLaunch`: PASS, exit 0. Includes both signature paths, fresh/additive upgrades, permission denials, ownership repair, extracted-package fresh/legacy readiness and saved-work relaunch; six packaged-browser tests passed.
- `scripts/tests/test-case-runtime-bootstrap.ps1 -RunBrowsers`: PASS, exit 0. Current-only bootstrap/readiness and all public/answer/authoring baselines passed, historical repository/security compatibility passed, and 14 runtime-browser tests passed (12 main plus two legacy-version tests).
- `scripts/refresh-understand-graph.ps1`, `scripts/check-understand-refresh-readiness.ps1` and `git diff --check`: PASS. All four tracked graph artifacts refreshed; source review confirms no application, bootstrap, permission or unrelated report changes.

The initial negative-test run correctly exposed a missing length guard and failed before repair; the complete launcher suite passed after that guard was added. Both SQL runners restored the pre-test workspace and restarted the preview at `http://localhost:27077`. A final inventory check confirmed only the registered test database; obsolete per-run backup artifacts were removed while retaining its single recovery backup. The configured installed database was not repaired or used as a fixture. The historical live refusal remains evidence from 2026-10-15, not a claim of a new live preflight. Independent audit and human acceptance are pending; no commit, push or operational repair was performed.

## Audit Results

Verdict: PASS

Auditor: AntiGravity (Independent Audit Agent)

---

### Scope Check Summary

- **Objective**: Verify that the accepted WP-297 city repair recognizes the exact historical `ReportDescription` encoding variant for ReportID 10571 without altering description bytes, weakening rejection of unknown datasets, or adding broad text normalization.
- **Allowed Modifications**:
  - `docs/01-work-packages/WP-298-correct-legacy-city-repair-encoding-signature.md`
  - `scripts/student-package/install-student-database.ps1`
  - `scripts/tests/test-student-launcher.ps1`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/meta.json`
  - `.understand-anything/intermediate/scan-result.json`
- **Worktree Boundary Verification**:
  - Git status and diff inspections confirm that only the 7 allowed files have modifications.
  - No files in `apps/**` or `database/**` were modified.
  - Accepted WP-297 implementation, audit, and acceptance history (`docs/01-work-packages/WP-297-canonical-sequel-city-name.md` and commit `f79c3c5`) are untouched with 0 diff against `HEAD`.
  - No new dependencies, schemas, application endpoints, or general public write interfaces were introduced.

---

### Acceptance Criteria Evaluation

- **[PASS] Both precisely identified signatures work in disposable legacy fixtures; no broad normalization is introduced**:
  - The implementation in [`scripts/student-package/install-student-database.ps1`](scripts/student-package/install-student-database.ps1#L81-L125) uses an exact 135-byte binary literal (`@legacyReport10571 = 0x4172736f...`) alongside the canonical fresh-seed sentence (`N'Arson at music studio '+NCHAR(65533)+...`).
  - No text normalization (`LIKE`, regex, string collation folding, or character replacement) is introduced. Binary matching is strictly enforced with `CONVERT(varbinary(max), r.ReportDescription) = ...`.
- **[PASS] Report 10571 description bytes remain unchanged while only the known ReportCity fields change**:
  - `Repair-StudentCity` executes exclusively:
    ```sql
    UPDATE dbo.CrimeSceneReport SET ReportCity='Sequel City'
    WHERE ReportCity='SQL City' AND ReportID IN (10056,10138,10154,10216,10317,10506,10562,10571,10791,10927,10969,10970,10975,11049,11050);
    ```
  - Report descriptions are never targeted by `UPDATE`.
  - Disposable SQL validation in [`scripts/tests/test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1#L375) confirms via base64 raw binary comparison (`[Convert]::ToBase64String(...)`) that Report 10571 stored description bytes before and after repair/relaunch are identical.
- **[PASS] Unknown/adversarial datasets are still refused, including single-character changes to either known description**:
  - Negative tests in [`test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1#L312-L335) demonstrate deterministic pre-backup refusal for single-bit flips at index 0, index 20, and the final byte, appended space (`0x20`), appended null (`0x00`), date mutation, crime mutation, and sentence relocation to another report.
- **[PASS] Verified backup, atomic rollback, idempotency, preserved v1 content/proofs/workspaces and released-case readiness regressions pass**:
  - Backup verified via `RESTORE VERIFYONLY ... WITH CHECKSUM`.
  - Interruption during script section execution triggers complete transaction rollback (`SET XACT_ABORT ON; $transaction.Rollback()`), leaving the database in `'legacy'` state without publishing v2 or retaining the migration key.
  - Repeated execution on the repaired database passes as idempotent verification (`Mode = 'current'`).
  - SHA-256 JSON hashes across 16 tables and immutable Case 004 v1 content tables match before and after repair.
- **[PASS] Independent audit and human acceptance remain separate; implementation tests never mutate the configured database**:
  - Final decision remains pending human review.
  - Tests operated solely on isolated disposable test fixtures.

---

### Adversarial Contract-Shape & Bounded Signature Claim

#### 1. Binary Sentence & Hash Verification
The alternate sentence for Report 10571 is declared as:
```sql
DECLARE @legacyReport10571 varbinary(135) = 0x4172736f6e206174206d757369632073747564696f20e2809320736f6d656f6e652077616e74656420746f2063726561746520222266697265206d6978746170652222206c6974746c6520746f6f206c69746572616c6c792e204e6f20696e6a75726965732c206a757374206c6f74206f66206275726e742076696e796c207265636f7264732e;
```
- **Byte Count**: Exactly 135 bytes.
- **SHA-256 Hash**: `874ecc5de33bf6cb065a62c0b6224fb293033c4c3220a0ec6db6e54c973409eb`.
- **Text & Encoding**: Represents ASCII prefix + 3-byte sequence `0xE2 0x80 0x93` (UTF-8 bytes for en-dash `-`, rendered in Windows-1252 as `-`) + ASCII suffix.
- **Independent Fixture Verification**: [`scripts/tests/test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1#L281-L286) independently synthesizes the fixture by concatenating ASCII bytes with `[byte[]](0xE2, 0x80, 0x93)`, computing `HASHBYTES('SHA2_256', ...)`, and asserting equivalence to `874ecc5d...`.

#### 2. Identity and Length Predicate Restrictions
In [`scripts/student-package/install-student-database.ps1`](scripts/student-package/install-student-database.ps1#L108-L115), the acceptance predicate requires:
```sql
IF (SELECT COUNT(*) FROM dbo.CrimeSceneReport r WITH (UPDLOCK,HOLDLOCK) JOIN @expected e ON e.ReportID=r.ReportID
 WHERE r.CrimeID=e.CrimeID AND r.ReportDate=e.ReportDate
 AND ((CONVERT(varbinary(max),r.ReportDescription)=CONVERT(varbinary(max),e.ReportDescription)
           AND (r.ReportID<>10571 OR DATALENGTH(r.ReportDescription)=DATALENGTH(e.ReportDescription)))
      OR (r.ReportID=10571 AND r.CrimeID=1005 AND r.ReportDate=20220820
          AND DATALENGTH(r.ReportDescription)=DATALENGTH(@legacyReport10571)
          AND CONVERT(varbinary(max),r.ReportDescription)=@legacyReport10571)))<>15
 THROW 51029,'Unexpected report signature; city repair refused.',1;
```
- **T-SQL Binary Padding Defense**: SQL Server binary comparison pads shorter `varbinary` values with trailing zero bytes (`0x00`). The addition of `DATALENGTH(r.ReportDescription) = DATALENGTH(...)` on both branches prevents padded descriptions (such as strings with trailing null bytes) from passing.
- **Identity Pinning**: The second branch is constrained by `r.ReportID = 10571 AND r.CrimeID = 1005 AND r.ReportDate = 20220820`. The alternate binary sentence cannot be applied to any other report ID, crime ID, or date.
- **Seed Path Retention**: The primary branch requires byte equality against `@expected.ReportDescription` (the seed's `U+FFFD` / replacement character conversion) and matches seed length for Report 10571.

---

### Negative-Path Analysis

The test suite systematically probes negative paths prior to backup creation or data mutation:
1. **Single-Byte Alterations**: Mutating byte 0 (`A` -> `@`), byte 20 (adjacent to the dash separator), or byte 134 (last byte `.`) triggers pre-backup refusal (`Unexpected report signature; city repair refused.`).
2. **Appended Trailing Bytes**: Appending space (`0x20`) or null (`0x00`) causes `DATALENGTH` mismatch, triggering immediate refusal before backup.
3. **Date and Crime Tampering**: Mutating `ReportDate` to `20220821` or `CrimeID` to `1020` fails the `JOIN`/predicate check before backup.
4. **Report Misattribution**: Placing the 135-byte sentence on Report 10506 fails the predicate check before backup.
5. **Partial and Unrecognized City States**:
   - Marking one report as `'Sequel City'` while 14 remain `'SQL City'` throws `51029,'Conflicting city dataset; city repair refused.'`.
   - Marking an unrelated report (`ReportID = 10001`) as `'SQL City'` throws `51029,'Unexpected legacy report set; city repair refused.'`.
6. **Corrupted Content**: Modifying Case 004 briefing facts causes preflight check `Assert-StudentLegacyCityContent` to throw `'Unexpected Case 004 content; city repair refused.'`.
7. **Backup Failure**: When `Backup-StudentDatabase` fails, execution halts without mutating `ReportCity`.

---

### Execution-Safety Verification & Disposable SQL Proof

1. **Pre-Backup Signature Gate**:
   - In [`Install-StudentDatabase`](scripts/student-package/install-student-database.ps1#L358-L360), `Get-StudentCityState` is invoked **before** `Backup-StudentDatabase`. Any signature mismatch or foreign dataset aborts execution before the backup step is reached or transactions are opened.
2. **Recorded Real-SQL Test Execution**:
   - [`outputs/wp298-launcher-sql.log`](outputs/wp298-launcher-sql.log):
     - `PASS: seed exact signature, byte/date/crime/identity refusal, backup refusal, verified backup, atomic rollback, v1/workspace/evidence preservation and repeat launch.`
     - `PASS: observed-legacy exact signature, byte/date/crime/identity refusal, backup refusal, verified backup, atomic rollback, v1/workspace/evidence preservation and repeat launch.`
     - Extracted package setup, API readiness, browser preview launch, and legacy package compatibility tests passed (exit 0).
   - [`outputs/wp298-runtime-browser.log`](outputs/wp298-runtime-browser.log):
     - Both current bootstrap and historical bootstrap passed.
     - 14 runtime-browser integration tests passed.
3. **Graph Integrity**:
   - [`outputs/wp298-graph-readiness.log`](outputs/wp298-graph-readiness.log) confirms `READY`.
   - All 4 `.understand-anything` knowledge graph artifacts (`fingerprints.json`, `intermediate/scan-result.json`, `knowledge-graph.json`, `meta.json`) are updated and match HEAD commit `2fce050`.

---

### Boundary Findings & Execution Limitations

- **Execution Limitations**: The isolated audit workspace contains no live SQL Server workspace registration. In accordance with audit instructions, this audit did not instantiate a live SQL Server instance or mutate an installed database. Findings are based on:
  - Exact binary and cryptographic evaluation of the byte literals and hashes in PowerShell.
  - Static AST and script inspection of [`install-student-database.ps1`](scripts/student-package/install-student-database.ps1) and [`test-student-launcher.ps1`](scripts/tests/test-student-launcher.ps1).
  - Validation logs recorded by real-SQL execution on the disposable test database fixture in `outputs/`.
  - Git repository state and commit history verification.
- **Destructive Actions / Live DB Isolation**: No live database connections were opened, and no live database data was modified. No changes were made to repository SSOT handoff or accepted past work packages.
- **Final Decision**: The audit agent makes no modifications to `## Final Decision` or repository state. Human acceptance remains separate.

### Retry provenance and maintainer review (2026-10-28)

The human requested the retry with the previously authorized external data sharing. AntiGravity actually completed through `scripts/audit-work-package.ps1 WP-298 -AllowExternalAudit -TimeoutMinutes 10` in `D:/GitHub-Repos/SequelCityWeb/.git/wp298-independent-audit`, returning its independent review through the runner after 00:04:20. Only the seven scoped changed files and filtered validation evidence were included; credentials, local settings and SQL workspace registration were excluded. Scope and all six source/graph file byte comparisons remained unchanged after the audit.

The earlier attempt timed out after 00:30:02 without a completed runner-delivered review. Its timeout remains historical evidence; this completed retry supersedes that attempt's non-ready audit status. The earlier snapshot's unsupported Final Decision assertion was never imported. The retry left Final Decision pending as instructed. Invocation logs are retained locally as `outputs/wp298-audit-attempt1.log` and `outputs/wp298-audit-attempt2.log` in the isolated snapshot.

The review has no blocking findings. Its limitation is explicit: the auditor independently inspected source, byte/hash values and recorded real-SQL validation, but did not rerun SQL in its unregistered snapshot. The runner mechanically renders dash characters as ASCII hyphens in review prose; the authoritative encoding is the unchanged binary literal E2 80 93 (Windows-1252 display code points U+00E2 U+20AC U+201C), not an ASCII hyphen. No application, bootstrap, dependency, runtime AI, installed database, handoff, commit or push changes were performed during audit. Human acceptance and any operational repair remain separate.

## Final Decision

Accepted by the human on 2026-10-28: "Accepted. commit and push". The completed independent AntiGravity retry passed without blocking findings, all required implementation checks passed, and audit execution limitations remain recorded above. Close out with the scoped implementation, graph artifacts and refreshed handoff; commit and push the branch. Acceptance does not authorize applying the repair to an installed database.
