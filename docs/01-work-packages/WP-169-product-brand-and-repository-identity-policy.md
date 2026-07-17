# WP-169: Product Brand And Repository Identity Policy

## Objective

Document the distinction between the user-facing `Sequel Detective` product brand, the `SequelCityWeb` repository/project identity, and the `Sequel City` fictional/database setting without renaming the repository, local directories, package identifiers, or historical records.

## Scope

### In Scope

- Add explicit naming policy to the project vision SSOT.
- Update the SSOT index language so it reflects `Sequel Detective` as the product brand while preserving `Sequel City Web Detective` as historical/repository identity context.
- Update the live handoff if needed to reflect the naming decision.
- Confirm in-progress agentic workflow documents do not hardcode this WP number for the future audit-to-corrective skill package.
- Record this documentation-only policy package.

### Out of Scope

- Renaming the GitHub repository.
- Renaming the local repository directory.
- Renaming package names, workspace names, scripts, database names, or remotes.
- Rewriting historical work packages.
- Rebranding every internal document in this package.
- Runtime app changes.
- Database changes.
- Dependency, script, graph, or generated artifact changes.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`.
- Freshness assessment: Graph metadata was refreshed during `WP-168` closeout to `418990872a72e034197857ff383f74dfa575a90f`. Current `HEAD` is `91be0628fe60b7bc4e6feef50a8ce2a0f60db120`; the gap is documentation-only `WP-168` work, so the graph is adequate as background for this narrow naming-governance documentation package.
- Analysis performed: Reviewed current Git status, SSOT project vision, SSOT index, work-package lifecycle guidance, Understand guide, and current in-progress `WP-168` references that reserved the next WP number.

### Affected Architecture

- Layers: Documentation and Governance; Architecture and Operations.
- Primary files/components:
  - `docs/01-work-packages/WP-169-product-brand-and-repository-identity-policy.md`
  - `docs/00-ssot/SSOT-Project-Vision.md`
  - `docs/00-ssot/SSOT-Index.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- Upstream consumers: human developer, future agents reading SSOT, student/faculty-facing documentation authors.
- Downstream dependencies: future documentation naming, public-sharing decisions, package/docs wording, future repository rename decision if needed.

### Regression Surface

- Related tests: documentation review, `git diff --check`, search for conflicting hardcoded `WP-169` audit-skill references.
- User workflows: resuming work, writing student/faculty docs, deciding whether a repo rename is needed.
- Security/data boundaries: No runtime, SQL safety, database, spoiler, student-data, credential, package, or AI boundary changes.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package changes naming/governance documentation only. It does not change application architecture, imports, runtime behavior, database structure, Case 004 progression, scripts, skills, or dependency metadata.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-169-product-brand-and-repository-identity-policy.md`
- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Index.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

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
- historical work-package records other than this active `WP-169`

## Constraints

- Do not rename repository, directory, package, script, database, or remote identifiers.
- Do not rewrite historical work packages.
- Preserve `Sequel Detective` as the current user-facing product brand.
- Preserve `SequelCityWeb` / `Sequel City Web Detective` as repository/project identity where useful.
- Preserve `Sequel City` as the fictional/database setting.
- Do not imply runtime AI, production deployment, cloud hosting, grading, authentication, or classroom-scale support.
- Keep this package documentation-only.

## Required Behavior

- SSOT must clearly state the naming distinction:
  - Product brand: `Sequel Detective`
  - Repository/project identity: `SequelCityWeb` / `Sequel City Web Detective`
  - Setting/database context: `Sequel City` / `SequelCityCrimesDB`
- SSOT must state that repository/directory/package renames are deferred unless naming confusion creates a concrete maintenance or sharing problem.
- User/faculty/student-facing docs should prefer `Sequel Detective`.
- Internal repo paths, historical WPs, scripts, and package identifiers may continue using existing names.
- In-progress docs must not hardcode `WP-169` as the future audit-to-corrective skill package after this package takes that number.

## Acceptance Criteria

- [x] Project vision SSOT defines the naming policy.
- [x] SSOT index uses product-brand language without requiring repo/path renames.
- [x] Live handoff records the naming decision.
- [x] In-progress agentic workflow docs do not hardcode `WP-169` for the audit-to-corrective skill.
- [x] No runtime, app, database, script, skill, graph, package-manifest, lockfile, or output files are modified.

## Code Prompt

Implement `WP-169` as a documentation-only naming policy package.

Scope:

- Only modify allowed files.
- Do not rename repository, directory, package, script, database, or remote identifiers.
- Do not rewrite historical WPs.

Return:

- files changed
- naming policy summary
- verification performed

## Audit Prompt

Audit `WP-169`.

Verify:

- Product brand, repository/project identity, and setting/database identity are clearly distinguished.
- No repo/directory/package/script/database/remote rename is performed.
- Student/faculty-facing naming guidance prefers `Sequel Detective`.
- Internal/historical naming can continue using `SequelCityWeb` or `Sequel City Web Detective`.
- Active agentic workflow docs do not reserve `WP-169` for the audit-to-corrective skill.
- No runtime, app, database, script, skill, graph, manifest, lockfile, or output files changed.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Naming ambiguity
- Scope violations
- Unsupported rename or product-scope implications

## Code Results

Implemented.

Changed files:

- `docs/01-work-packages/WP-169-product-brand-and-repository-identity-policy.md`
- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Index.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Summary:

- Added a naming policy to the project vision SSOT.
- Updated SSOT index wording to distinguish product brand from repository identity.
- Recorded the decision in the live handoff.
- Confirmed the agentic workflow docs describe the audit-to-corrective skill as a future package rather than hardcoding `WP-169`.

Verification:

- `git diff --check`: PASS for the changed documentation files; only normal Windows line-ending warnings appeared.
- `rg` search for conflicting `WP-169` audit-to-corrective references: PASS; in-progress agentic workflow docs do not hardcode `WP-169` for that future package.
- Scope review: PASS; changed files are documentation/work-package files only.

## Audit Results

AntiGravity audit completed.

### Verdict

PASS.

### Naming Ambiguity

Resolved. AntiGravity confirmed the policy clearly distinguishes:

- Product brand: `Sequel Detective`
- Repository/project identity: `SequelCityWeb` / `Sequel City Web Detective`
- Setting/database context: `Sequel City` / `SequelCityCrimesDB`

### Scope Violations

None. AntiGravity confirmed the changed files are limited to the allowed documentation set:

- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/00-ssot/SSOT-Index.md`
- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/01-work-packages/WP-169-product-brand-and-repository-identity-policy.md`

### Unsupported Renames

None. AntiGravity confirmed no GitHub repository, local directory, package configuration, script, database name, remote URL, or historical work-package rename was performed.

### Product-Scope Implications

None. AntiGravity confirmed:

- Student/faculty-facing naming now prefers `Sequel Detective`.
- Internal, engineering, and historical naming can continue using `SequelCityWeb` or `Sequel City Web Detective`.
- `WP-168` and the agentic workflow evaluation guide do not reserve `WP-169` for the audit-to-corrective skill.
- No runtime, application, database, manifest, lockfile, output, graph, script, or skill files changed.
- The graph regeneration decision was followed.

## Final Decision

Accepted.

Reason: The naming policy is documented in SSOT, the handoff records the decision, AntiGravity audit passed, no rename was performed, and the change remains documentation-only.
