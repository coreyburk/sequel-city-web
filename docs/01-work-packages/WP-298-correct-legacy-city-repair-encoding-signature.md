# WP-298: correct the legacy city repair encoding signature

## Lifecycle reconciliation (2026-10-28)

Status: Open - planned compatibility correction; unimplemented and awaiting separate implementation authorization.

Source review confirms the installer still recognizes only the current seed's Report 10571 description signature; it contains neither the observed alternate binary signature nor its adversarial tests. WP-309 repaired database ownership, and WP-311 separated fresh bootstrap from historical upgrades; neither implemented this encoding correction. Current fresh builds do not need this legacy-only exception. Keep the fix available for the exact affected legacy dataset if support is required.

The recorded live preflight below occurred on 2026-10-15. No new live database inspection or repair was performed during reconciliation, and no claim is made about today's installed row values. Do not retry a live repair or broaden the signature predicate under this administrative request.

## Objective

Allow the accepted WP-297 city repair to recognize the one exact historical ReportDescription encoding variant found in the configured classroom database, without changing description bytes or weakening rejection of unknown datasets.

## Scope

Corrective planning only, 2026-10-15. Original package: docs/01-work-packages/WP-297-canonical-sequel-city-name.md, accepted and pushed as f79c3c5ba43038b1a7807ff5bd1e64d09478bb4a. Finding: defect/compatibility omission in Get-StudentCityState's description signature. This is not a new data-cleanup feature.

The user authorized applying the accepted backed-up upgrade. Read-only preflight refused the dataset before backup or mutation. Fourteen target reports match the seed exactly. Report 10571 (CrimeID 1005, ReportDate 20220820) has the same description apart from an older dash representation. Its stored varchar description has SHA256 874ecc5de33bf6cb065a62c0b6224fb293033c4c3220a0ec6db6e54c973409eb, with the three bytes E2 80 93 at the dash position. Those bytes are displayed through Windows-1252 as U+00E2 U+20AC U+201C. The current fresh seed instead contains U+FFFD at this location; the installer matches its SQL varchar conversion. Do not rewrite either description in this correction.

Repository history confirms an earlier single-byte dash source (96); later source already contains EF BF BD. The live three-byte variant is observed directly, not inferred to match current source. Retain the exact full-row/full-description signature rather than accepting arbitrary encoding substitutions.

## Impact Analysis

### Understand Status

Required tier: administrative evidence repair and saved-version compatibility. Four graph artifacts available, 715 files, refreshed for the accepted WP-297 source before its closeout commit. Source-confirmed dependencies: Get-StudentCityState, Repair-StudentCity, installer backup/transaction path and launcher SQL fixtures. The new variant changes no schema or application API.

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

- [ ] Both precisely identified signatures work in disposable legacy fixtures; no broad normalization is introduced.
- [ ] Report 10571 description bytes remain unchanged while only the known ReportCity fields change.
- [ ] Unknown/adversarial datasets are still refused, including single-character changes to either known description.
- [ ] Verified backup, atomic rollback, idempotency, preserved v1 content/proofs/workspaces and released-case readiness regressions pass.
- [ ] Independent audit and human acceptance remain separate; implementation tests never mutate the configured database.

## Code Prompt

After separate implementation authorization, implement the smallest exact alternate-signature predicate and disposable tests. Preserve every other guard. Do not change database seed descriptions or accepted WP-297 history. Run real launcher SQL/refusal/rollback/preservation regression and released-case bootstrap/browser checks. Refresh graph artifacts and record exact evidence. Stop for independent audit; do not accept, commit/push or retry the configured live database as a test.

## Audit Prompt

Independently falsify the bounded signature claim: prove the full observed binary sentence and identity restriction, preserve the current seed path, reject nearby variants and unknown datasets, and confirm no normalization or general public writes. Require actual disposable SQL proof of unchanged description bytes, verified backup, rollback, idempotency and preserved content/attempt/proof/workspace hashes. Confirm no live database writes and no changes to accepted WP-297 history. Record PASS, FAIL or BLOCKED; human acceptance remains separate.

## Code Results

Pending implementation.

## Audit Results

Pending audit.

## Final Decision

Pending. Open compatibility correction; separate implementation authorization, independent audit and human acceptance are required. No present-day live inspection or operational repair is authorized by this status reconciliation.
