# End-of-Day Handoff

## Current State

- Date: 2026-10-28 (America/Denver).
- Repository: D:/GitHub-Repos/SequelCityWeb.
- Branch: codex/wp-311-bootstrap-source-of-truth.
- Base: accepted main 0e8d244; WP-301 and WP-312 are already integrated there.
- Active closeout: accepted WP-311; human authorized commit and push after independent audit PASS. Runtime/schema sources match the tested and audited snapshot. Five unrelated planning files remain local and excluded.

## Completed Work

WP-311 makes the three numbered database scripts the organized origin of the current live database. Fresh seed directly defines Case 001 v3 and Case 004 v2, with no historical releases or test examples. Interviews and protected answers are in their table sections; all existing values and IDs are preserved, including all 6,142 explicit interview IDs. Removed insert-then-delete registration corrections without changing final data.

Supported existing-installation compatibility moved into separate scripts/student-package/migrations files. Package creation includes those files; fresh setup never executes them. Readiness recognizes current-only installs without synthetic historical rows while retaining schema, role, evidence, backup and rollback guards. Historical test assembly is separate and restricted to the registered workspace. The current generic evidence manifest retains the required evidenceMatches result name.

Start future database work with database/README.md. It explains table/case navigation, stable identity allocation, publication, migration boundaries and verification. Database/authoring SSOT and runbook were reconciled with the current workflow.

## Verification and Audit

- Exact pre-cleanup fingerprints match all 11 evidence/answer tables and every value in six current authoring tables; source provenance verified against 0e8d244.
- Complete current-only/historical SQL, actual restricted API readiness and browser matrix passed: outputs/wp311-runtime-browser-settled.log. Includes both Case 004 releases, complete Case 001, 12 reference browser checks and two authored-case browser checks.
- Full supported launcher SQL/package matrix passed: outputs/wp311-launcher-sql-final.log. Includes six browser tests with full Case 001 resolution, healthy repeat launch, backed-up ownership repair, historical upgrades, rollback and preservation.
- Real single-workspace lock/refusal/failure-recovery tests, graph refresh/readiness, local links and whitespace checks passed. Main and preview web/API endpoints returned 200; preview restored. Exactly one registered test database and one recovery backup retained.
- Independent AntiGravity audit ran in .git/wp311-audit with authorized external sharing and exactly 27 implementation files. PASS; no blocking findings or code corrections. Auditor independently checked provenance/current authored hashes and non-SQL safety tests, and reviewed completed SQL/browser logs without rerunning SQL. Full report and limits are in WP-311.

## Boundaries and Remaining Work

The main SequelCityCrimesDB retains its installed older Case 001 story. Preview SequelCityRuntimeTest_Workspace has Case 001 v3. WP-311 reorganized and verified source; it did not migrate or reset the main story. Never rerun the destructive bootstrap preamble on an installed database to bypass migration review. Retain the earlier WP-309 main ownership-repair backup and credentials.

Only one registered SQL test workspace is permitted. Use the exclusive backup/restore runner; do not create per-test clones. Main is http://127.0.0.1:5173/ and preview is http://localhost:27077/. Local settings, secrets, operational snapshots and generated browser output must remain outside source commits.

Unrelated WP-284/WP-285 architecture planning changes and planning-only WP-298/WP-299 remain excluded and preserved with hashes. WP-299 informed the accepted implementation but its planning record must not be silently marked accepted.

## Next Recommended Step

Verify WP-311 branch publication, then integrate the accepted commit into main as a separate repo task. Reconcile the five remaining planning files without inventing acceptance. Any update to an existing classroom story requires its own explicit guarded migration scope; current bootstrap files are the origin for new installations.
