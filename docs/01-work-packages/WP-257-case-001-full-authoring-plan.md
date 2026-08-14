# WP-257 - Case 001 Full Authoring Plan

## Objective

Create a complete, spoiler-controlled Case 001 authoring plan that defines the playable end state, evidence path, required SQL milestones, assessed SQL concepts, fixture/data needs, red herrings, complexity limits, engagement goals, and release-readiness criteria before any further Case 001 implementation slices are added.

## Scope

### In Scope

- Add a new Case 001 planning artifact under `docs/15-case-plans/`.
- Define the full intended Case 001 playable experience from briefing through final solve.
- Define a milestone-by-milestone evidence path for `Case 001: The Clocktower Poisoning`.
- Define expected learner SQL queries or query shapes for each milestone.
- Define the SQL concepts each milestone teaches or assesses.
- Define required database table families, planned fixture/data rows, and validation ownership for each milestone.
- Define database-authoring rules for existing relational seed reuse, story-bearing row updates, fresh-build script ownership, and no case-story migrations.
- Define red herrings, distractors, ambiguity boundaries, and how each remains fair.
- Define case complexity parameters that future implementation WPs must stay within.
- Define playability, engagement, pacing, and release-readiness criteria.
- Define how future implementation WPs should be sequenced from this plan.
- Update `SSOT-Case-Authoring.md` only as needed to reference the full-case plan artifact as the next production planning layer after the reusable authoring contract.
- Refresh tracked Understand graph artifacts after implementation because the package adds a major case-production planning artifact and SSOT authoring reference that future WPs should see.

### Out of Scope

- No Case 001 release unlock.
- No Case 001 runtime gameplay implementation.
- No Case 001 database rows, seed data, migrations, schema changes, answer-key rows, or restricted-table data.
- No backend validators, query execution changes, API transport changes, suspect verification, SQL safety changes, query history changes, or runtime AI.
- No frontend runtime UI, Query Lab rendering, persistence, reset behavior, clue logging, evidence board, investigation threads, Samuel guidance runtime, or app routing changes.
- No changes to Case 004 behavior, data, progression, persistence, reset, guidance, visuals, or tests.
- No new repo-local skill in this package. A future `sequel-city-case-authoring` skill should be created only after this plan format is accepted and useful.
- No dependencies, package changes, lockfile changes, generated art, screenshots, videos, or build outputs.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `9ae0803628b426fdd1b9e486ededbc9339e46553` (`Diagnose Case 001 live metadata blocker`), from `.understand-anything/meta.json`.
- Freshness assessment: Usable with represented structural work and closeout drift. Current `HEAD` is `b400537` (`Seed Case 001 public clocktower fixture`). WP-256 refreshed tracked Understand graph artifacts after adding the Case 001 fixture migration and related docs/tests, then the closeout commit added the accepted WP record and handoff. Source and docs inspection are authoritative for current Case 001 state.
- Analysis performed: Verified clean `main` aligned with `origin/main`, confirmed WP-257 as the next package number, read workflow/lifecycle/Understand planning guidance, read `SSOT-Case-Authoring.md`, `SSOT-Case-Progression.md`, current Case 001 source, current case-authoring contract source, database schema, recent Case 001 WP records, and searched current source/docs/database for Case 001, the clocktower milestone, `CrimeSceneReport`, `InterviewLog`, `PersonsOfInterest`, `DriversLicense`, `EventSchedule`, `EventRegistration`, validators, live smoke coverage, and release-gate boundaries.

### Affected Architecture

- Layers:
  - Product authoring documentation.
  - Case-production workflow guidance.
  - Future Case 001 implementation planning.
  - Understand graph baseline.
- Primary files/components:
  - `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md` (new)
  - `docs/00-ssot/SSOT-Case-Authoring.md`
  - tracked Understand graph artifacts
  - `docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`
- Upstream consumers:
  - Future Case 001 evidence-data, validator, progression, guidance, persistence, suspect-verification, and release WPs.
  - Future reusable case-authoring skill work.
  - Human case-design review.
- Downstream dependencies:
  - Existing `PlayableCaseAuthoringDefinition` contract remains a lower-level metadata contract and is not changed in this package.
  - Existing Case 001 skeleton source remains read-only.
  - Existing database schema/table families constrain the plan unless the plan explicitly marks a future schema/data change as a separate implementation package.

### Regression Surface

- Related tests:
  - Documentation-only package; no runtime tests are expected.
  - `git diff --check`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-257`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-257`
- User workflows:
  - No released student workflow changes.
  - Case 004 remains the only normal released playable/restorable case.
  - Case 001 remains locked by default and dev/test gated only.
  - Future development gains a full plan to prevent unscalable one-slice guessing.
- Security/data boundaries:
  - The plan may include author-only solution design and red-herring strategy, but it must label spoiler-bearing content as author-only documentation.
  - The plan must not add runtime answer-key exposure, restricted-table access, suspect verification behavior, database mutation, or AI progression authority.
  - Student-facing future outputs must remain non-spoiler until a scoped implementation package intentionally exposes approved public evidence.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: The package introduces a major case-production planning artifact and updates SSOT authoring guidance that future Case 001 work packages should discover through the tracked Understand graph. The originating package can safely own the tracked graph refresh.

## Files Allowed to Change

Allowed:

- `docs/15-case-plans/**`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`

`docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout handoff refresh.

Do Not Modify:

- `apps/**`
- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/07-api-contracts/**`
- `docs/10-user-journey/**`
- `docs/11-testing-strategy/**`
- `package.json`
- `package-lock.json`
- generated build outputs, coverage, screenshots, videos, traces, and test-result artifacts

## Constraints

- Preserve existing runtime behavior.
- Keep Case 001 locked and unreleased.
- Keep Case 004 as the only normal released playable/restorable case.
- Do not add or change runtime code.
- Do not add or change database data, schema, migrations, answer-key rows, or restricted-table content.
- Do not create migration-based requirements for future case-story data authoring.
- Do not expose author-only solution details through runtime UI, API contracts, public student docs, or release-facing copy.
- Do not claim the plan is runtime authority. Runtime progression must still come from backend-approved read-only SQL results and deterministic validators.
- Do not create a repo-local skill in this package.
- Keep the plan specific enough to drive implementation WPs, not a vague narrative outline.
- Mark open design assumptions explicitly instead of burying unresolved decisions.

## Required Behavior

- Create `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`.
- The plan must include these sections:
  - purpose and audience
  - spoiler classification and handling rules
  - case identity and public dossier alignment
  - intended learner experience summary
  - final playable end state and solve conditions
  - complexity budget
  - SQL concept coverage matrix
  - full evidence path
  - milestone table with objective, evidence, expected query shape, SQL concept, validator expectation, and implementation package type
  - required database fixture/data plan by table family
  - red herrings and fairness constraints
  - guidance/Samuel pacing plan
  - persistence/reset expectations
  - suspect verification and final-solve expectations
  - automated validation/playthrough expectations
  - future WP sequence
  - unresolved authoring assumptions
- The plan must define a proposed Case 001 path that starts from the existing public `CrimeSceneReport` fixture and stays compatible with the existing database table families:
  - `CrimeSceneReport`
  - `InterviewLog`
  - `PersonsOfInterest`
  - `DriversLicense`
  - `EventSchedule`
  - `EventRegistration`
  - optional `Employment` only if the plan justifies it within the complexity budget
- The plan must define 5-7 SQL milestones total.
- The plan must keep expected learner query complexity inside a Foundations-track budget:
  - read-only `SELECT` queries only
  - `WHERE` filters required
  - `ORDER BY` allowed
  - `JOIN` introduced gradually
  - expected golden-path queries use no more than two joins
  - no required nested queries, CTEs, window functions, aggregation, mutation, temp tables, stored procedures, or restricted tables
- The plan must include at least one red herring and no more than two major red herrings.
- The plan must define what data must be public evidence versus author-only solution/verification data.
- The plan must define that existing relational seed data is scaffolding only, not presumed coherent story content.
- The plan must define that future case data WPs should reuse existing related people/license/employment/event/registration rows when useful, while authoring or modifying `CrimeSceneReport` and `InterviewLog` content as needed.
- The plan must define that future case story/data authoring updates fresh database creation/seed scripts, not case-story migrations.
- The plan must define that mismatched local databases should be blocked from normal play and rebuilt from current scripts through an explicit drop/recreate path before release.
- The plan must explicitly state that any culprit/mastermind/final answer values are author-only until scoped database/verification packages add them behind existing restricted boundaries.
- The plan must include a future implementation sequence that breaks the full case into larger but still auditable WPs, avoiding excessive one-row polish packages.
- Update `SSOT-Case-Authoring.md` narrowly to state that full playable cases require a full case plan artifact after the reusable contract and before broad implementation.
- Run the required validation and graph-refresh commands.

## Acceptance Criteria

- [ ] `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md` exists.
- [ ] The plan defines the intended playable end state and solve conditions for Case 001.
- [ ] The plan defines a full evidence path from the existing public clocktower report fixture through final solve.
- [ ] The plan defines 5-7 SQL milestones.
- [ ] Each milestone includes learner objective, evidence table family, expected query shape, SQL concept assessed, validator expectation, and future implementation package type.
- [ ] The SQL concept matrix covers the intended teaching/assessment targets.
- [ ] The complexity budget is explicit and compatible with a Foundations-track case.
- [ ] The plan defines required database fixture/data needs by table family without adding data in this package.
- [ ] The plan defines existing-data reuse rules that treat current random seed data as relational scaffolding, not coherent story content.
- [ ] The plan defines that future story-bearing `CrimeSceneReport` and `InterviewLog` rows may be authored or modified as needed.
- [ ] The plan defines fresh-build creation/seed scripts as authoritative for future case story/data changes and rejects case-story migrations.
- [ ] The plan defines local database mismatch behavior as block normal play, explicitly rebuild from current scripts, and reset or ignore stale learner browser progress.
- [ ] The plan defines red herrings and fairness constraints.
- [ ] The plan defines guidance pacing, persistence/reset expectations, suspect verification expectations, and automated playthrough criteria.
- [ ] The plan labels author-only spoiler/solution content and preserves runtime spoiler boundaries.
- [ ] The future WP sequence is concrete enough to drive the next several implementation packages without one-off guessing.
- [ ] `SSOT-Case-Authoring.md` references the full-case plan layer without claiming runtime authority.
- [ ] Existing Case 001 remains gated/unreleased and no runtime code changes are made.
- [ ] Existing Case 004 remains unchanged.
- [ ] No app, API, database, script, package, lockfile, generated-output, or skill files are modified.
- [ ] `git diff --check` passes.
- [ ] Understand readiness passes before graph refresh.
- [ ] `scripts/refresh-understand-graph.ps1` completes successfully.
- [ ] Understand readiness passes after graph refresh.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-257 exactly as specified.

Start by reading:
- `docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/caseAuthoring.ts`
- `apps/api/src/services/case001ResultPatternService.ts`
- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/migrations/2026-08-14-001-seed-case-001-clocktower-report.sql`

Scope:
- Only modify the allowed files.

Constraints:
- No runtime implementation.
- No refactors.
- No new dependencies.
- No app, API, database, script, package, lockfile, generated art, or skill changes.
- Do not release Case 001.
- Do not change Case 004.
- Keep author-only spoiler content out of runtime-facing docs and make spoiler classification explicit in the case plan.

Implementation requirements:
- Create `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md` with the required sections and a concrete proposed full Case 001 path.
- Use the existing Case 001 public dossier and existing first milestone as the starting point.
- Stay inside the existing database table families unless the plan explicitly marks a future data/schema need as out of current implementation scope.
- Define 5-7 milestones, expected query shapes, SQL concepts, validators, data needs, red herrings, complexity budget, guidance pacing, persistence/reset expectations, suspect verification expectations, playthrough criteria, and future WP sequence.
- Add the database-authoring correction: existing relational seed reuse where useful, story-bearing report/interview authoring as needed, fresh-build scripts as authoritative, no case-story migrations, and explicit rebuild-on-version/content-mismatch expectations.
- Update `SSOT-Case-Authoring.md` narrowly to reference the full-case plan layer after the reusable authoring contract.
- Run required validation and graph-refresh commands.
- Record Code Results with changed files, validation evidence, graph refresh evidence, and scope check.

Validation commands:
- `git diff --check`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-257`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-257`

Return:
- Summary of changed files and behavior.
- Validation and graph-refresh commands run with results.
- Any unresolved case-design assumptions.

## Audit Prompt

Audit WP-257 against the work package and SSOT.

Verify:
- All acceptance criteria are satisfied.
- Changed files are limited to the `Allowed:` list.
- `Do Not Modify:` boundaries were preserved.
- The new Case 001 plan defines a full playable end state and solve conditions.
- The plan starts from the existing public `CrimeSceneReport` fixture and first SQL milestone.
- The plan defines 5-7 SQL milestones.
- Each milestone includes learner objective, evidence table family, expected query shape, SQL concept assessed, validator expectation, and future implementation package type.
- The plan includes a SQL concept coverage matrix.
- The plan includes required fixture/data needs by table family without adding data.
- The plan includes existing-data reuse rules, random-seed story caveats, fresh-build script authority, no case-story migrations, and local database rebuild expectations.
- The plan includes red herrings and fairness constraints.
- The plan includes explicit complexity parameters compatible with a Foundations-track case.
- The plan includes guidance pacing, persistence/reset expectations, suspect verification expectations, automated validation/playthrough expectations, and future WP sequence.
- Author-only spoiler/solution content is clearly labeled and not exposed as runtime behavior.
- `SSOT-Case-Authoring.md` references the full-case plan layer without making it runtime authority.
- Existing Case 001 remains gated/unreleased.
- Existing Case 004 remains unchanged.
- No runtime UI, backend/API/database behavior, SQL safety behavior, persistence behavior, suspect verification behavior, runtime AI, dependency, package, lockfile, skill, generated art, or unrelated behavior changes were introduced.
- Required validation and Understand refresh/readiness commands were run or blocked evidence is clearly recorded.
- Graph regeneration decision was followed; tracked graph artifacts changed only as expected and no transient `.understand-anything` trash/temp/log artifacts were included.
- Adversarial documentation checks were performed for vague milestones, missing SQL concepts, excessive query complexity, hidden implementation assumptions, unbounded red herrings, spoiler leakage, and future-WP sequence gaps.
- Explicit failure thresholds were applied: missing plan sections, runtime scope drift, spoiler-boundary failure, missing validation evidence, graph-refresh failure, or unreviewed file changes is a FAIL; unavailable repository context, required tooling, or clean worktree is BLOCKED.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Missing tests or validation
- Scope drift risks

## Code Results

Implemented by Codex.

Changed files:
- `docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`

Behavior implemented:
- Added a full author-only Case 001 plan for `The Clocktower Poisoning`.
- Placed the plan under `docs/15-case-plans/` so the documentation tree has only one `02-*` area (`docs/02-runtime`).
- The plan defines Case 001 as a Foundations, single-culprit case with six SQL milestones.
- The plan starts from the existing public `CrimeSceneReport` fixture and first milestone `case-001-clocktower-report-located`.
- The plan defines the intended playable end state, solve conditions, evidence path, SQL concept matrix, milestone table, fixture/data needs, red herrings, fairness constraints, Samuel guidance pacing, persistence/reset expectations, suspect verification expectations, automated playthrough criteria, future WP sequence, and unresolved authoring assumptions.
- The plan keeps expected learner query complexity inside the Foundations budget: read-only `SELECT`, required `WHERE`, optional `ORDER BY`, gradual joins, no more than two joins in golden-path queries, and no required nested queries, CTEs, window functions, aggregation, mutation, temp tables, stored procedures, or restricted tables.
- The plan explicitly labels solution identity, final verification values, fixture identifiers, answer-key values, and red-herring resolution as author-only until future scoped packages add them behind existing restricted boundaries.
- Updated `SSOT-Case-Authoring.md` to require a full case plan layer after the reusable authoring contract and before broad implementation, without making the plan runtime authority.
- Refreshed tracked Understand graph artifacts after adding the major case-production planning artifact and SSOT reference.
- Corrected an initial folder-numbering oversight before audit by moving the case-plan artifact from `docs/02-case-plans/` to `docs/15-case-plans/`, updating all WP/SSOT references, removing the empty duplicate `docs/02-case-plans` directory, and refreshing tracked Understand graph artifacts again.
- Corrected the database-authoring policy before final acceptance: the plan and SSOT now require existing relational seed inventory before case data authoring, treat random seed data as scaffolding rather than coherent story content, allow authored or modified `CrimeSceneReport` and `InterviewLog` story rows, require future case data changes through fresh-build creation/seed scripts, reject case-story migrations and `ALTER`-style data evolution, and require explicit rebuild/block behavior for mismatched local databases before Case 001 release.

Validation:
- PASS: `git diff --check` completed with no whitespace errors; output included only expected Windows line-ending warnings.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=634`, graph assembly `nodes=1013`, `edges=379`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 634 files`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.
- PASS: Corrective path check, `rg -n "docs/02-case-plans|02-case-plans" docs .understand-anything/knowledge-graph.json .understand-anything/intermediate/scan-result.json`, returned no matches after the folder move and second graph refresh.
- PASS: Documentation directory check confirmed the docs tree now has a single `02-*` directory: `docs/02-runtime`; the case plan lives under `docs/15-case-plans/`.
- PASS: Second `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` after the folder move completed with `filesScanned=634`, graph assembly `nodes=1013`, `edges=379`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 634 files`.
- PASS: Second post-move `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` reported `READY`.
- PASS: Post-database-authoring-correction `git diff --check` completed with no whitespace errors; output included only expected Windows line-ending warnings.
- PASS: Post-database-authoring-correction `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before refresh reported `READY`.
- PASS: Post-database-authoring-correction `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` completed with `filesScanned=634`, graph assembly `nodes=1013`, `edges=379`, `layers=6`, `tourSteps=7`, and `Fingerprints baseline: 634 files`.
- PASS: Post-database-authoring-correction `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after refresh reported `READY`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-257` reported `ReadyForImplementation`, no out-of-scope dirty files, and no Code Results recorded before this section was filled.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-257` reported `ValidationPlanReady`, `Blocks audit readiness: False`, and no missing findings before this section was filled.

Scope check:
- Modified files are limited to the WP-257 allowed list.
- `apps/**`, `database/**`, `scripts/**`, `.codex/skills/**`, package files, lockfiles, API contracts, user-journey docs, testing-strategy docs, and generated outputs were not modified.
- No runtime UI, backend/API/database behavior, SQL safety behavior, persistence behavior, suspect verification behavior, runtime AI, dependency, package, lockfile, skill, generated art, or Case 004 behavior was introduced.
- No Case 001 release unlock was introduced.

Unresolved authoring assumptions:
- Exact culprit identity, PersonIDs, LicenseIDs, EventIDs, generated ReportID, final verification values, and answer-key data remain intentionally unassigned until future scoped fixture/verification packages.
- Case 001 is planned as a single-culprit Foundations case without a mastermind branch; adding a mastermind would require a revised complexity budget.
- `Employment` remains optional and outside the core path unless future review finds a fair tie-break is needed.
- The local database rebuild/version enforcement mechanism is intentionally unimplemented in this planning package and must be scoped before Case 001 release.

## Audit Results

### Audit Report: WP-257 ΓÇö Case 001 Full Authoring Plan

### Verdict
**PASS**

---

### Audit Verification Summary

| Check / Requirement | Status | Details & Evidence |
| :--- | :---: | :--- |
| **All Acceptance Criteria Satisfied** | **PASS** | All 20 acceptance criteria from [`WP-257-case-001-full-authoring-plan.md:L186-L213`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-257-case-001-full-authoring-plan.md#L186-L213) are satisfied. |
| **Allowed File Scope** | **PASS** | Modified files strictly adhere to the `Allowed:` list:<br>ΓÇó [`docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md)<br>ΓÇó [`docs/00-ssot/SSOT-Case-Authoring.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md)<br>ΓÇó [`docs/01-work-packages/WP-257-case-001-full-authoring-plan.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-257-case-001-full-authoring-plan.md)<br>ΓÇó Tracked Understand artifacts ([`.understand-anything/knowledge-graph.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/knowledge-graph.json), [`.understand-anything/fingerprints.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/fingerprints.json), [`.understand-anything/meta.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/meta.json), [`.understand-anything/intermediate/scan-result.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/intermediate/scan-result.json)). |
| **`Do Not Modify:` Boundaries** | **PASS** | Preserved with zero edits across `apps/**`, `database/**`, `scripts/**`, `.codex/skills/**`, progression/state/schema SSOTs, API contracts, user-journey docs, testing-strategy docs, package/lockfiles, and build outputs. |
| **Playable End State & Solve Conditions** | **PASS** | Defined in [`Case-001-Clocktower-Poisoning-Plan.md:L54-L77`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L54-L77) across 10 discrete user actions and database-backed suspect solve conditions. |
| **Anchored on Existing Fixture** | **PASS** | Starts from existing seeded public `CrimeSceneReport` fixture (`CrimeID = 1080`, `ReportDate = 20230502`, `ReportCity = 'Sequel City'`) and milestone `case-001-clocktower-report-located`. |
| **SQL Milestones** | **PASS** | Exactly 6 SQL milestones defined ([M1ΓÇôM6](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L128-L138)). Each specifies learner objective, evidence table family, expected query shape, SQL concept assessed, validator expectation, and future implementation package type. |
| **SQL Concept Coverage Matrix** | **PASS** | Mapped in [`Case-001-Clocktower-Poisoning-Plan.md:L101-L114`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L101-L114) covering projection, single-table filtering, foreign-key traversal, sorting, inner joins, compound predicates, date/name filtering, attribute filtering, and evidence confirmation. |
| **Fixture & Data Plan by Table Family** | **PASS** | Detailed across 8 table families in [`Case-001-Clocktower-Poisoning-Plan.md:L139-L177`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L139-L177). 0 database rows or migration scripts were added in this package. |
| **Existing Data Reuse & Rebuild Policy** | **PASS** | Explicitly defines existing seed data as relational scaffolding, permits authoring/updating story-bearing `CrimeSceneReport` and `InterviewLog` content, mandates fresh-build script authority (`02-SequelCityCrimesDB - Insert Data.sql`), prohibits case-story migrations/ALTER packages, and defines mismatch drop/recreate rebuild expectations with stale browser progress reset ([`Case-001-Clocktower-Poisoning-Plan.md:L143-L166`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L143-L166), [`SSOT-Case-Authoring.md:L51-L58`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md#L51-L58)). |
| **Red Herrings & Fairness Constraints** | **PASS** | Specified in [`Case-001-Clocktower-Poisoning-Plan.md:L178-L195`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L178-L195) for Crowd Certainty and Ceremony-Program Timing with clear discovery prerequisites and evidence resolutions. |
| **Foundations Complexity Budget** | **PASS** | Defined in [`Case-001-Clocktower-Poisoning-Plan.md:L78-L100`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L78-L100): read-only `SELECT`, `WHERE` required, max 2 joins on golden path, no subqueries/CTEs/window functions/aggregations/mutations/restricted tables. |
| **Pacing, Persistence, & Playthrough Criteria** | **PASS** | Defined for Samuel guidance (6 beats), case-id keyed storage isolation/reset, backend suspect verification flow, 9 automated test requirements, and a 12-package implementation sequence ([`Case-001-Clocktower-Poisoning-Plan.md:L196-L292`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L196-L292)). |
| **Spoiler Boundaries & Non-Authority** | **PASS** | Author-only classification and handling rules are explicit ([`Case-001-Clocktower-Poisoning-Plan.md:L9-L20`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L9-L20)). Solution IDs and answer-key values remain unassigned and restricted. [`SSOT-Case-Authoring.md:L28-L33`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md#L28-L33) explicitly disclaims runtime authority. |
| **Case Gating & Isolation** | **PASS** | Case 001 remains Archive Locked and dev-gated (`VITE_ENABLE_CASE_001_PLAYABLE_SKELETON`). Released Case 004 is completely unaffected. |
| **Validation & Graph Artifacts** | **PASS** | `git diff --check` passed cleanly. Understand readiness confirmed `READY` (0 temp dirs, 0 trash dirs, 0 log files). Tracked graph refreshed cleanly (`filesScanned=634`, `nodes=1013`, `edges=379`, `layers=6`, `tourSteps=7`). |
| **Adversarial Checks** | **PASS** | No vague milestones, no missing SQL concepts, query complexity strictly inside Foundations limits, open design assumptions explicitly documented in Section `## Unresolved Authoring Assumptions`, no spoiler leakage, and no gaps in the 12-stage future sequence. |

---

### Violations
**None.**
- No out-of-scope dirty files.
- No modifications to protected directories or files (`apps/**`, `database/**`, `scripts/**`, `.codex/**`).
- No runtime code, UI, API, SQL safety, persistence, verification, or AI changes introduced.
- No database rows, seed data, or migrations added.
- No dependencies, skills, lockfiles, or generated art introduced.

---

### Regressions
**None.**
- Documentation-only work package; existing runtime behaviors, test suites, Case 001 gate, and Case 004 mechanics remain completely intact.

---

### Missing Tests or Validation
**None.**
- `git diff --check` completed with 0 whitespace errors.
- `scripts/check-understand-refresh-readiness.ps1` returned `READY`.
- `scripts/get-work-package-validation-plan.ps1 WP-257` reports `ValidationEvidenceRecorded` and `Blocks audit readiness: False`.

---

### Scope Drift Risks
**Low.**
- Future implementation packages must adhere to the 12-step sequence defined in [`Case-001-Clocktower-Poisoning-Plan.md:L274-L292`](file:///D:/GitHub-Repos/SequelCityWeb/docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md#L274-L292) by starting with the relational seed inventory and bundling evidence/validators coherently, ensuring all data changes target the fresh-build scripts rather than introducing ad-hoc migrations.

## Final Decision

Accepted on 2026-08-14 after audit rerun PASS and human closeout request. WP-257 is approved for closeout because it adds the scoped author-only Case 001 full plan, records the full playable path and six SQL milestones, adds the existing-data/fresh-build database-authoring rules, updates SSOT case-authoring guidance without making the plan runtime authority, refreshes Understand artifacts, and preserves Case 001 locked/unreleased behavior with no runtime, database, migration, Case 004, package, lockfile, skill, or generated-output changes.



