# WP-171: Supersede Pending Database Bootstrap Plan

## Objective

Use the new corrective work-package workflow to close or supersede `WP-163` as a stale, overly broad pending plan, and replace it with a narrower documented next step for database identity and rebuild safety.

## Scope

### In Scope

- Review `WP-163` against accepted follow-up work in `WP-164` and `WP-165`.
- Record the exact reason `WP-163` should not be implemented as written.
- Update `WP-163` final decision or status to indicate it is superseded, deferred, or narrowed by this package.
- Update the live handoff so `WP-163` is no longer presented as an open pending plan if this package accepts supersession.
- Optionally update release-readiness planning notes that still describe `WP-163` as pending.
- Define the narrower future implementation package, if database identity/rebuild safety still matters.

### Out of Scope

- Implementing database identity validation.
- Implementing destructive rebuild/drop/create behavior.
- Changing API bootstrap code.
- Changing launcher scripts.
- Changing database scripts.
- Changing package generation.
- Running SQL against local databases.
- Regenerating the Understand graph.
- Adding dependencies, runtime AI, external services, or OpenAI Agents SDK orchestration.

## Corrective Finding

Original WP: `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`

Finding type: omission / stale pending plan.

Finding:

- `WP-163` was still pending at the start of this corrective package even though later accepted work already split out part of its prerequisite surface:
  - `WP-164` synced the base database seed scripts to the active database for `EventSchedule` and `EventRegistration`.
  - `WP-165` implemented first-run local SQL account provisioning and preserved destructive rebuild as explicit/instructor-controlled.
- As written, `WP-163` combines database identity validation, health/admin response changes, destructive rebuild orchestration, launcher behavior, frontend health display, docs, tests, and graph regeneration in one large runtime package.
- That breadth is now stale and higher-risk than necessary for the next step. The package should be closed or superseded before implementation so future work starts from the current accepted bootstrap/account-provisioning state.

Why corrective:

- This package corrects project planning state. It does not add a new feature.
- It prevents an old pending package from being mistaken for the current implementation plan.
- It uses the new `$sequel-city-wp-corrective` skill pattern against real project material.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Usable with non-structural drift for this documentation/corrective package. Current `HEAD` is `22efdc95fc6fc65b13eba76915aaf639c759eff6`; later accepted commits are documentation/skill packages (`WP-168`, `WP-169`, `WP-170`) and do not change app bootstrap code, scripts, database structure, or runtime behavior.
- Analysis performed: Used `$sequel-city-wp-corrective` workflow. Reviewed `Work-Package-Lifecycle.md`, `Agentic-Development-Workflow-Evaluation.md`, the corrective checklist, `WP-163`, `WP-164`, `WP-165`, current handoff, release-readiness references to `WP-163`, and targeted source search for bootstrap/rebuild/account provisioning surfaces.

### Affected Architecture

- Layers: Documentation and Governance; Architecture and Operations; Repository Tooling.
- Primary files/components:
  - `docs/01-work-packages/WP-171-supersede-pending-database-bootstrap-plan.md`
  - `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - optionally `docs/09-release-readiness/presentation-day-readiness-plan.md`
- Upstream consumers: human developer, Codex agents, audit agents, future bootstrap/rebuild implementation packages.
- Downstream dependencies: future database identity validation package, future explicitly gated local rebuild package if still needed.

### Regression Surface

- Related tests:
  - documentation review
  - `git diff --check`
  - `rg` checks for stale `WP-163` pending references
  - no app/API/web/database tests required unless implementation scope expands
- User workflows:
  - planning the next database bootstrap work
  - avoiding stale pending work-package implementation
  - resuming from handoff
  - student pilot setup documentation
- Security/data boundaries:
  - No destructive database operation.
  - No SQL execution.
  - No runtime AI or external service.
  - No change to SQL safety, answer-key access, credentials, app behavior, or student package behavior.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package should only update work-package and planning documentation. It does not change application architecture, imports, runtime behavior, database structure, scripts, package manifests, lockfiles, or generated outputs.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-171-supersede-pending-database-bootstrap-plan.md`
- `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/09-release-readiness/presentation-day-readiness-plan.md`

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- package manifests
- dependency lockfiles
- `outputs/**`
- other historical work packages

## Constraints

- Keep this package documentation-only.
- Do not implement any database identity, rebuild, launcher, health, or admin-route behavior.
- Do not mark `WP-163` as implemented.
- Do not erase useful `WP-163` analysis; preserve it as historical planning context.
- Clearly state whether `WP-163` is superseded, deferred, or split into narrower future work.
- Preserve destructive database rebuild as explicitly gated and instructor-controlled.
- Preserve the accepted `WP-164` and `WP-165` outcomes.

## Required Behavior

- Update `WP-163` so future readers do not treat it as the current implementation plan.
- If superseding `WP-163`, state:
  - it was a pending plan only
  - it was not implemented as written
  - `WP-164` and `WP-165` completed separate prerequisite/adjacent work
  - future work should be split into narrower packages
- Update handoff/release-readiness references that still identify `WP-163` as simply pending, so they point to the supersession decision.
- Define the recommended narrower future package:
  - database identity validation and health/admin status only
  - explicitly exclude destructive rebuild orchestration unless separately scoped
  - keep launcher/account provisioning behavior from `WP-165` intact
- Leave runtime behavior unchanged.

## Acceptance Criteria

- [x] `WP-163` is no longer presented as the current implementation plan.
- [x] `WP-163` clearly records whether it is superseded, deferred, or split.
- [x] The reason for supersession references accepted `WP-164` and `WP-165` outcomes.
- [x] The handoff no longer lists `WP-163` as an unresolved pending plan without the supersession context.
- [x] Release-readiness planning notes no longer imply `WP-163` should be implemented as written.
- [x] A narrower future database-bootstrap package recommendation is documented.
- [x] No app, database, script, skill, graph, package-manifest, lockfile, output, dependency, runtime AI, or SQL execution changes occur.

## Code Prompt

Implement `WP-171` as a documentation-only corrective/supersession package.

Scope:

- Only modify the allowed documentation files.
- Do not modify runtime code, scripts, database files, package manifests, lockfiles, skills, graph artifacts, or outputs.

Required changes:

1. Update `WP-163` final decision/status to record that it is superseded or split by current accepted work.
2. Preserve useful `WP-163` analysis as historical context.
3. Update `END-OF-DAY-HANDOFF.md` so `WP-163` is not listed as a simple pending blocker.
4. Update `presentation-day-readiness-plan.md` if it still points to `WP-163` as the pending implementation path.
5. Document the narrower recommended next package for database identity validation, keeping destructive rebuild orchestration separate unless explicitly rescoped.
6. Update this WP with Code Results.

Verification:

- Run `git diff --check` for changed files.
- Run `rg` checks for stale `WP-163` pending-plan language.
- Confirm changed files remain within the allowed list.

Return:

- files changed
- supersession decision summary
- recommended narrower future package
- verification performed

## Audit Prompt

Audit `WP-171`.

Verify:

- `WP-163` is not marked implemented.
- `WP-163` is clearly superseded, deferred, or split.
- The reason references accepted `WP-164` and `WP-165` outcomes accurately.
- Handoff/release-readiness docs no longer present `WP-163` as a current implementation plan without supersession context.
- A narrower future database identity/rebuild-safety package is documented.
- No app, database, script, skill, graph, package-manifest, lockfile, output, dependency, runtime AI, or SQL execution changes occurred.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Stale planning references
- Unsafe database/rebuild implication
- Missing future-package recommendation
- Recommended corrections

## Code Results

Implemented.

Changed files:

- `docs/01-work-packages/WP-171-supersede-pending-database-bootstrap-plan.md`
- `docs/01-work-packages/WP-163-database-identity-verification-and-gated-rebuild-bootstrap.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/09-release-readiness/presentation-day-readiness-plan.md`

Supersession decision summary:

- `WP-163` is superseded as the current implementation plan, not marked implemented.
- `WP-164` is recorded as having completed the narrower seed-data synchronization prerequisite.
- `WP-165` is recorded as having completed the narrower first-run account-provisioning adjacent work.
- Remaining database-bootstrap work should be split into narrower packages instead of implementing the full original `WP-163` scope.

Recommended narrower future package:

- database identity validation and health/admin status only
- no destructive rebuild orchestration
- no launcher/account-provisioning changes
- preserve the `WP-165` account-provisioning path
- keep any future destructive rebuild/reset package separate, explicitly gated, and instructor-controlled

Verification performed:

- `git diff --check` for changed files.
- `rg` checks for stale `WP-163` pending-plan language.
- Scope review confirmed no app, database, script, skill, graph, package-manifest, lockfile, output, dependency, runtime AI, or SQL execution changes.

## Audit Results

External AntiGravity audit was requested but blocked by the approval reviewer because sending repository diffs/document contents to the external audit agent was classified as unacceptable data-exfiltration risk for this run. No workaround was attempted.

Local scope and lifecycle check:

- Verdict: PASS for local documentation/scope review.
- Scope violations: None. Changed files are limited to this WP, `WP-163`, the live handoff, and the presentation readiness plan.
- Stale planning references: No remaining references were found that instruct implementation of `WP-163` as the current plan. Remaining `WP-163` references either preserve historical context or point to `WP-171` supersession.
- Unsafe database/rebuild implication: None. The changed docs continue to state that destructive rebuild orchestration is separate, explicitly gated, and not part of this package.
- Missing future-package recommendation: None. The recommended follow-up is a narrow database identity validation and health/admin status package that excludes destructive rebuild orchestration and launcher/account-provisioning changes.
- Verification: `git diff --check` passed for changed files; `rg` checks were run for stale `WP-163` pending-plan language; scope review found no app, database, script, skill, graph, package-manifest, lockfile, output, dependency, runtime AI, or SQL execution changes.

## Final Decision

Accepted.

Reason: Human acceptance was given after implementation. External AntiGravity audit was blocked by approval policy; local scope and lifecycle checks passed, and the package is documentation-only with no app, database, script, skill, graph, package-manifest, lockfile, output, dependency, runtime AI, or SQL execution changes.
