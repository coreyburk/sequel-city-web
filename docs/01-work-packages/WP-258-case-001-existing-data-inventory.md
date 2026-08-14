# WP-258 - Case 001 Existing Data Inventory

## Objective

Create an author-only Case 001 existing-data inventory that identifies which current relational scaffold rows should be reused unchanged, modified for story fit, newly authored later, or avoided before any Case 001 data changes are made.

## Scope

### In Scope

- Add a narrow author-only inventory artifact for Case 001 under `docs/15-case-plans/`.
- Inventory current fresh-build seed/script data as read-only source evidence for the Case 001 relational scaffolding.
- Cover these table families explicitly:
  - `CrimeSceneReport`
  - `InterviewLog`
  - `PersonsOfInterest`
  - `DriversLicense`
  - `Employment`
  - `EventSchedule`
  - `EventRegistration`
- Identify candidate row/relationship decisions for Case 001:
  - reuse unchanged
  - modify for story fit
  - newly author in a future data WP
  - avoid
- Map findings to the six milestones in `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`.
- Document relationship-chain candidates such as `PersonsOfInterest -> DriversLicense`, `PersonsOfInterest -> Employment`, and `EventSchedule -> EventRegistration -> PersonsOfInterest`.
- Document story-bearing rewrite targets for `CrimeSceneReport` and `InterviewLog`.
- Document Case 004 conflict checks, uncertainty, and unresolved assumptions.
- Add a narrow cross-reference from the Case 001 full authoring plan to the new inventory artifact if useful.
- Refresh the tracked Understand graph after the documentation change so future planning can discover the inventory artifact.

### Out of Scope

- Do not change database creation, seed, migration, or local rebuild scripts.
- Do not insert, update, delete, or migrate any database rows.
- Do not connect to or mutate a local SQL Server database.
- Do not add runtime application, backend, API, UI, Query Lab, persistence, or suspect-verification behavior.
- Do not release or unlock Case 001.
- Do not expose culprit identity, answer-key values, restricted-table data, final solve rationale, or hidden fixture identifiers.
- Do not broaden the Case 001 evidence path beyond inventory and next-WP recommendations.
- Do not refactor unrelated documentation or reorganize folders.
- Do not add dependencies.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` exist.
- Baseline commit: `b40053770a4e56d9e37447021d8b3d3943e417f3`.
- Freshness assessment: Usable with represented WP-257 planning drift. The current HEAD is `66a72e8 Define Case 001 full authoring plan`; changed paths since the baseline are WP-257 graph artifacts, `docs/00-ssot/END-OF-DAY-HANDOFF.md`, `docs/00-ssot/SSOT-Case-Authoring.md`, `docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`, and `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`. The graph search already locates the Case 001 plan, but the baseline metadata trails the closeout commit. Treat the graph as usable for navigation, then verify against source.
- Analysis performed: Read the WP planning skill, workflow docs, Case 001 full authoring plan, SSOT Case Authoring, graph metadata, changed paths since graph baseline, targeted graph entries for Case 001/table-family names, and seed/schema locations for the relevant table families.

### Affected Architecture

- Layers: Authoring documentation, development workflow records, generated Understand graph.
- Primary files/components: `docs/15-case-plans/Case-001-Existing-Data-Inventory.md`, `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`, and tracked `.understand-anything/**` graph artifacts.
- Upstream consumers: Case 001 future data WPs, case-authoring reviewers, audit agents, closeout handoff readers.
- Downstream dependencies: Future fresh-build data packages that may later edit `database/02-SequelCityCrimesDB - Insert Data.sql`; future validators and playthrough tests that depend on selected scaffold rows.

### Regression Surface

- Related tests: Documentation-only package. Use `git diff --check`, `scripts/check-understand-refresh-readiness.ps1`, `scripts/refresh-understand-graph.ps1`, `scripts/check-understand-refresh-readiness.ps1`, `scripts/get-work-package-status.ps1 WP-258`, and `scripts/get-work-package-validation-plan.ps1 WP-258`.
- User workflows: None at runtime. This affects the authoring workflow for building Case 001 in coherent evidence bundles.
- Security/data boundaries: Must preserve spoiler boundaries, restricted answer-key boundaries, Case 004 behavior, and the rule that fresh-build SQL scripts are authoritative for future authored case data. This WP must not change database content.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: The package will add a new authoring artifact that future planning should discover, and the graph baseline metadata already trails the accepted WP-257 planning documentation commit. Include the tracked graph artifacts in this WP and refresh after the inventory document is complete.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-258-case-001-existing-data-inventory.md`
- `docs/15-case-plans/Case-001-Existing-Data-Inventory.md`
- `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `database/**`
- `apps/**`
- `scripts/**`
- `.codex/skills/**`
- `docs/00-ssot/**` except `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout only
- `docs/02-runtime/**`
- `docs/03-api-contracts/**`
- `docs/04-database/**`
- `docs/05-development-workflow/**`
- `docs/10-user-journey/**`
- `docs/11-testing-strategy/**`
- `package.json`
- `package-lock.json`
- generated build/test output directories

## Constraints

- Preserve existing behavior unless explicitly changing it.
- No architectural changes.
- No renaming outside scope.
- No speculative improvements.
- No "while we're here" changes.
- Source-script evidence is authoritative for the inventory. Use the current SQL creation/seed scripts as read-only inputs.
- Existing seed data is random scaffolding, not pre-authored mystery logic.
- Future data changes must update fresh-build creation/seed scripts, not migrations, but this WP must not make those data changes.
- Do not rely on coincidental random data as clue logic.
- Avoid answer-key exposure and final culprit assignment.
- If a table has no clear reusable candidates, record that explicitly rather than inventing a fit.

## Required Behavior

- Create `docs/15-case-plans/Case-001-Existing-Data-Inventory.md`.
- Mark the inventory as author-only and non-runtime authority.
- State that no database rows, scripts, migrations, or local database state are changed by the package.
- Identify the seed/script source basis used for inventory, including relevant schema and seed-script locations.
- Provide a milestone-alignment table for all six Case 001 SQL milestones.
- Provide a table-family inventory for all required table families named in scope.
- For each relevant table family, record:
  - likely reuse candidates or why none are currently safe to reuse
  - modify-for-story candidates or required modification class
  - new rows likely needed later
  - avoid rows/patterns and why
- Capture candidate relationship chains with enough identifiers or source anchors for a future implementation WP to verify them before editing data.
- Record Case 004 conflict risks and how future data WPs should avoid breaking released behavior.
- Add next-WP recommendations for coherent evidence-data bundles, not one-row polish.
- Add a narrow cross-reference from `Case-001-Clocktower-Poisoning-Plan.md` to the inventory artifact if it improves discoverability.
- Refresh Understand after edits and record validation evidence in `Code Results`.

## Acceptance Criteria

- [ ] `docs/15-case-plans/Case-001-Existing-Data-Inventory.md` exists and is author-only.
- [ ] The inventory explicitly covers `CrimeSceneReport`, `InterviewLog`, `PersonsOfInterest`, `DriversLicense`, `Employment`, `EventSchedule`, and `EventRegistration`.
- [ ] The inventory classifies row/data decisions as reuse unchanged, modify for story fit, newly author later, or avoid.
- [ ] The inventory maps findings to the six Case 001 milestones from the full authoring plan.
- [ ] The inventory documents relationship-chain candidates and uncertainty without assigning a culprit or exposing answer-key data.
- [ ] The inventory states that no database scripts, migrations, runtime code, UI, persistence, release unlock, or local database mutation is included.
- [ ] Any Case 001 plan update is limited to a discoverability cross-reference.
- [ ] Tracked Understand graph artifacts are refreshed after the inventory doc is created.
- [ ] Validation evidence is recorded in `Code Results`, including `git diff --check` and Understand readiness/refresh checks.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-258 exactly as specified.

Scope:

- Only modify the allowed files.
- Use `database/01-SequelCityCrimesDB - Create DB.sql` and `database/02-SequelCityCrimesDB - Insert Data.sql` as read-only evidence for the inventory.
- Use the Case 001 full authoring plan and SSOT Case Authoring as read-only authority.

Constraints:

- No refactors.
- No new dependencies.
- Preserve all existing behavior.
- Do not change any `database/**` file.
- Do not connect to, drop, rebuild, or mutate a local database.
- Do not add runtime behavior.
- Do not release or unlock Case 001.
- Do not expose answer-key data or assign the final culprit.

Implementation steps:

1. Inspect the schema and seed-script sections for `CrimeSceneReport`, `InterviewLog`, `PersonsOfInterest`, `DriversLicense`, `Employment`, `EventSchedule`, and `EventRegistration`.
2. Create the Case 001 existing-data inventory artifact with author-only handling, source basis, milestone alignment, table-family inventory, relationship-chain candidates, Case 004 conflict notes, and next-WP recommendations.
3. Add only a narrow cross-reference in the Case 001 full authoring plan if it improves discoverability.
4. Run `git diff --check`.
5. Run `scripts/check-understand-refresh-readiness.ps1`.
6. Run `scripts/refresh-understand-graph.ps1`.
7. Run `scripts/check-understand-refresh-readiness.ps1` again.
8. Run `scripts/get-work-package-status.ps1 WP-258`.
9. Run `scripts/get-work-package-validation-plan.ps1 WP-258`.
10. Record the exact validation evidence and any limitations in `Code Results`.

Return:

- Exact files changed.
- Inventory summary.
- Validation evidence.
- Any unresolved assumptions.

## Audit Prompt

Audit this change against the work package.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regression.
- Behavior remains consistent outside scope.
- Impact analysis matches the actual changed files.
- Dependencies and related tests were not omitted.
- Graph regeneration decision was followed.
- Understand output did not override SSOT or source evidence.
- No `database/**`, `apps/**`, `scripts/**`, package, or runtime files were modified.
- The inventory uses seed/script evidence and does not treat random seed data as already-authored mystery logic.
- The inventory does not expose culprit identity, answer-key values, restricted data, or final solve rationale.
- The inventory gives future data WPs enough row/relationship direction to avoid one-row polish while preserving scope.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

Implemented.

Changed files:

- `docs/15-case-plans/Case-001-Existing-Data-Inventory.md`
- `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-258-case-001-existing-data-inventory.md`

Summary:

- Added the author-only Case 001 existing-data inventory artifact.
- Documented the read-only source basis from the schema and fresh-build seed script.
- Covered `CrimeSceneReport`, `InterviewLog`, `PersonsOfInterest`, `DriversLicense`, `Employment`, `EventSchedule`, and `EventRegistration`.
- Classified reuse/modify/new/avoid decisions before any data changes.
- Mapped inventory findings to all six Case 001 SQL milestones.
- Identified the existing public clocktower report row as the M1 reuse anchor.
- Identified `EventID 2993` as the strongest current event/registration roster scaffold candidate, with explicit caution that it must be modified or rejected by a future data WP rather than treated as existing story logic.
- Recorded Case 004 protected anchors to avoid, including the `ReportID 10975` path and known Case 004 person rows.
- Added a narrow discoverability cross-reference from the full Case 001 authoring plan to the inventory artifact.
- Refreshed Understand graph artifacts after the new inventory artifact was created.

Validation:

- `git diff --check` passed before graph refresh. Git reported CRLF normalization warnings for touched files but no whitespace errors.
- `scripts/check-understand-refresh-readiness.ps1` passed before graph refresh:
  - `Understand refresh readiness: READY`
  - `Dry run succeeded: True`
  - `Tracked artifacts changed: 0`
  - `Temporary directory present: False`
  - `Trash directories present: 0`
  - `Log files present: 0`
- `scripts/refresh-understand-graph.ps1` passed:
  - `filesScanned=636`
  - graph assembly reported `nodes=1015`, `edges=379`, `layers=6`, `tourSteps=7`, `files=636`
  - fingerprints baseline reported `636 files`
  - `Understand graph refresh completed.`
- Post-refresh `.understand-anything/meta.json` records:
  - `gitCommitHash`: `66a72e8ea8a4351bf3ddc11b906a3412ff1fdda8`
  - `analyzedFiles`: `636`
- `scripts/check-understand-refresh-readiness.ps1` passed after graph refresh:
  - `Understand refresh readiness: READY`
  - `Dry run succeeded: True`
  - `Tracked artifacts changed: 0`
  - `Temporary directory present: False`
  - `Trash directories present: 0`
  - `Log files present: 0`
- `git diff --check` passed after graph refresh. Git reported CRLF normalization warnings for touched files but no whitespace errors.
- `scripts/get-work-package-status.ps1 WP-258` reports:
  - `State: ImplementedNeedsAudit`
  - `Code results recorded: True`
  - `Audit results recorded: False`
  - `Final decision: Pending`
  - `Out-of-scope dirty files: none`
- `scripts/get-work-package-validation-plan.ps1 WP-258` reports:
  - `State: ValidationEvidenceRecorded`
  - `Recommendation: review_recorded_evidence`
  - `Blocks audit readiness: False`
  - `Missing findings: none`

Scope notes:

- No `database/**` files were modified.
- No `apps/**`, `scripts/**`, package, lockfile, runtime, API, UI, persistence, release-gate, migration, or local database changes were made.
- No culprit identity, answer-key row, restricted-table content, final solve rationale, or suspect-verification behavior was added.

## Audit Results

Verdict: PASS

---

### Audit Checklist & Verification

| Requirement / Check | Status | Evidence & Notes |
|---|---|---|
| **All acceptance criteria satisfied** | **PASS** | Verified against all 10 acceptance criteria in [WP-258](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-258-case-001-existing-data-inventory.md). [Case-001-Existing-Data-Inventory.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Existing-Data-Inventory.md) is created, clearly marked author-only, and fully covers all required table families. |
| **No files outside allowed list modified** | **PASS** | `git status` confirms modifications and additions are strictly within the `Allowed:` list (`WP-258`, `Case-001-Existing-Data-Inventory.md`, `Case-001-Clocktower-Poisoning-Plan.md`, and `.understand-anything/**`). |
| **No functional regression** | **PASS** | All unit tests in `apps/api` and `apps/web` pass without failures. No runtime code was touched. |
| **Behavior remains consistent outside scope** | **PASS** | Existing Case 004 logic, SQL safety rules, API routes, database schemas, and client modules remain unmodified. |
| **Impact analysis matches actual changed files** | **PASS** | Changes are strictly documentation and graph metadata artifacts as defined in the work package. |
| **Dependencies and related tests not omitted** | **PASS** | Documentation checks passed (`git diff --check`, `check-understand-refresh-readiness.ps1`, `get-work-package-status.ps1`, `get-work-package-validation-plan.ps1`). |
| **Graph regeneration decision followed** | **PASS** | Understand graph artifacts were refreshed and verified; readiness check reports `READY` with zero transient or untracked trash artifacts. |
| **Understand output did not override SSOT / source evidence** | **PASS** | Seed scripts (`database/01-SequelCityCrimesDB - Create DB.sql` and `database/02-SequelCityCrimesDB - Insert Data.sql`) were used directly as read-only source authority. |
| **No `database/**`, `apps/**`, `scripts/**`, package, or runtime files modified** | **PASS** | Verified via repository status. No database mutations, migrations, or application code changes occurred. |
| **Uses seed/script evidence without treating random seed data as authored mystery logic** | **PASS** | Clearly identifies random scaffolding (such as `EventID 2993` registration clusters and unrelated `InterviewLog` transcripts) and documents that coherent story threads must be explicitly authored or modified in future data WPs. |
| **Does not expose culprit identity, answer-key values, restricted data, or final solve rationale** | **PASS** | Culprit and answer-key values are explicitly marked unassigned; spoiler boundaries and restricted tables are preserved. |
| **Provides future data WPs enough row/relationship direction to avoid one-row polish while preserving scope** | **PASS** | Structured into coherent evidence bundle recommendations (M1 report + M2-M3 interview linkage, M4 ceremony/roster, M5 license clues + M6 opportunity statement, and database rebuild/versioning). |

---

### Violations

- **None**. All package constraints, boundaries, and acceptance criteria were observed.

---

### Regressions

- **None**. No runtime code, schema definitions, or test expectations were modified.

---

### Drift Risks

- **Local Database Drift vs Fresh-Build Scripts**: Future data WPs modifying seed scripts must ensure local database instances are rebuilt from clean scripts rather than migrated ad-hoc, as highlighted in the inventory recommendations.
- **Roster Sizing for Foundations Complexity**: When implementing the M4 ceremony roster in future data packages, authors must narrow `EventID 2993` (or any new event) from 16 registered rows down to a focused 3-5 person roster to avoid introducing noise unsuited for a Foundations-level case.

## Final Decision

Accepted on 2026-08-14 after audit PASS and human closeout request. WP-258 is accepted because it adds the scoped author-only Case 001 existing-data inventory, documents reusable/modify/new/avoid decisions from current fresh-build relational scaffolding, records Case 004 avoid boundaries, refreshes Understand artifacts, removes audit-result mojibake during closeout, and preserves the required no-database, no-runtime, no-migration, no-release-unlock, no-persistence, no-suspect-verification, and no-answer-key boundaries.

