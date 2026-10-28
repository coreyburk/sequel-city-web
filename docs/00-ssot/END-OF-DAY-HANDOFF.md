# End-of-Day Handoff

## Current State

- Date: 2026-10-28 (America/Denver).
- Repository: D:/GitHub-Repos/SequelCityWeb.
- Branch: codex/wp-313-planning-reconciliation.
- Base: main d211f49, with accepted WP-311 integrated.
- Active closeout: WP-313 accepted by the human after independent AntiGravity PASS; commit and push authorized. The formerly outstanding five planning files are reconciled in this package, not abandoned as unexplained local changes.

## WP-313 Reconciliation

WP-284, WP-285 and WP-299 are closed as superseded proposals. Their successor records own implementation, audit and acceptance evidence; none is retrospectively accepted as standalone delivered work. The architecture improvement plan is a historical reference. WP-298 remains open and unimplemented: the exact Report 10571 alternate encoding signature and its tests are absent. No new live SQL inspection or repair occurred, and implementation requires separate authorization.

Development tooling recognizes leading plain/bold Superseded decisions as ClosedSuperseded. Closeout and commit-preview gates refuse those records even when they cite accepted successors. Genuine Accepted decisions mentioning supersession remain accepted. Focused status and closeout suites passed in the isolated test checkout, including negative paths and an empty Git index. Graph refresh/readiness, evidence links and whitespace checks passed.

Independent AntiGravity reviewed exactly 17 scoped files against d211f49, independently exercised the non-SQL suites/probes and returned PASS with no blocking findings. Citation corrections and verification limits are recorded in WP-313. Human accepted the package on 2026-10-28. No application, database, dependency or installer behavior changed.

The requested forensic-lab two-table proposal and other playability ideas are saved in docs/15-case-plans/FUTURE-GAMEPLAY-IDEAS.md. They are an idea backlog only, not approved schema, case content or release work.

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

The prior five local planning files are now reconciled under WP-313. Supersession preserves their historical intent without fabricating delivery or acceptance. WP-298 remains the one open implementation item among those records.

## Next Recommended Step

Verify WP-313 branch publication, then integrate its accepted commit into main as a separate repo task. Choose the next product work explicitly: WP-298 is a narrow legacy-compatibility fix if that dataset needs support; forensic/playability ideas require their own case design and scoped work package. Do not infer either implementation from backlog capture. Any live classroom story update requires a separately authorized guarded migration; bootstrap remains the origin for new installations.
