# WP-150: API TypeScript Build Stabilization

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Make the API production TypeScript build pass without changing backend runtime behavior.

## Scope

### In Scope

- correct API TypeScript build configuration so production build excludes test files
- fix API source imports that are incompatible with the current CommonJS TypeScript build
- add local type coverage for `mssql` if the installed package does not provide declarations
- preserve existing API test execution through `node --experimental-strip-types`
- document implementation, verification, and audit outcomes in this work package

### Out of Scope

- changing API route behavior
- changing SQL safety rules
- changing restricted-table or answer-key policy
- changing database migrations, seed data, or SQL objects
- changing frontend code, Student Mode, Case 004 progression, or UI copy
- adding new runtime features
- broad module-system migration beyond the minimum needed for the existing build

## Impact Analysis

### Understand Status

- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: Structurally stale for recent API generated output and workflow documentation, but usable only as broad orientation for this narrow build-config task.
- Analysis performed: Recommended-tier build/tooling analysis. Source inspection and current build output were treated as authoritative. `npm run build --workspace apps/api` fails because `tsconfig.json` includes tests in the production build, source imports use `.ts` extensions without `allowImportingTsExtensions`, and the installed `mssql` package has no TypeScript declaration available to the compiler.

### Affected Architecture

- Layers: API build tooling; API routes/services compile boundary
- Primary files/components:
  - `apps/api/tsconfig.json`
  - API source files with `.ts` import specifiers
  - optional API-local type declaration file for `mssql`
  - `docs/01-work-packages/WP-150-api-typescript-build-stabilization.md`
- Upstream consumers:
  - root `npm run build`
  - `npm run build --workspace apps/api`
  - API dev/start scripts after source compilation
- Downstream dependencies:
  - Fastify API routes
  - SQL Server pool and `mssql` client usage
  - API tests executed through strip-types against source files

### Regression Surface

- Related tests:
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - root `npm run build`
- User workflows:
  - local backend startup
  - health diagnostics
  - schema metadata loading
  - read-only query execution
  - query history
  - suspect verification
- Security/data boundaries:
  - no SQL safety or restricted-table behavior changes
  - no database migration or answer-key changes
  - no frontend correctness-authority changes

### Graph Update Decision

- Regeneration required: No
- Rationale: This work should only stabilize build configuration/import compatibility and local type declarations. It must not change architecture, runtime behavior, routes, database structures, or Case 004 progression. The existing graph can be regenerated later during a broader structural update if desired.

## Files Allowed to Change

Allowed:

- `apps/api/tsconfig.json`
- `apps/api/src/**/*.ts`
- `apps/api/src/**/*.d.ts`
- `docs/01-work-packages/WP-150-api-typescript-build-stabilization.md`

Do Not Modify:

- `apps/web/**`
- `database/**`
- `docs/00-ssot/**`
- `apps/api/dist/**`
- `package-lock.json`
- root `package.json`
- `apps/api/package.json` unless a type-only dev dependency is explicitly required and approved

## Constraints

- Preserve existing backend runtime behavior.
- Preserve existing API test command behavior.
- Do not change SQL safety, restricted-table policy, query execution semantics, schema filtering, health behavior, or suspect verification logic.
- Do not add new runtime dependencies.
- Do not commit generated `apps/api/dist/**` worktree noise as part of this WP.
- Prefer configuration/import/type fixes over source refactors.

## Required Behavior

- `npm run build --workspace apps/api` compiles successfully.
- root `npm run build` compiles successfully.
- `npm run test --workspace apps/api` continues to pass.
- Test files are not compiled as part of the production API build.
- Source import specifiers are compatible with the selected TypeScript build mode.
- `mssql` imports compile with local or package-provided type information.

## Acceptance Criteria

- [x] API production build passes.
- [x] Root production build passes.
- [x] API tests pass.
- [x] No frontend files are modified.
- [x] No database, migration, answer-key, SQL safety, or restricted-table behavior changes are introduced.
- [x] Generated `apps/api/dist/**` files are not included in this WP's source changes.
- [x] Work package Code Results, Audit Results, and Final Decision are updated.

## Code Prompt

Implement WP-150 as a narrow API build stabilization.

1. Keep the change focused on API TypeScript build compatibility.
2. Exclude API test files from production compilation without changing the test command.
3. Fix source import specifiers that are incompatible with the current API build configuration.
4. Add local type declaration coverage for `mssql` only if needed to compile.
5. Preserve runtime behavior and all backend safety/data boundaries.
6. Run `npm run test --workspace apps/api`, `npm run build --workspace apps/api`, and root `npm run build`.
7. Update Code Results, Audit Results, and Final Decision.

Do not modify frontend code, database files, generated `apps/api/dist/**`, answer-key policy, or Student Mode progression.

## Audit Prompt

Audit WP-150 for build correctness, scope compliance, and runtime-boundary preservation.

Verify:

1. API production build passes.
2. Root production build passes.
3. API tests pass.
4. Test files are excluded from production compilation but still run under the existing test command.
5. Source import changes do not alter runtime behavior.
6. `mssql` type coverage is local/build-only and does not change database behavior.
7. No frontend, database, dist, SQL safety, restricted-table, or case-progression files changed.
8. Generated `apps/api/dist/**` worktree noise remains outside the WP changes.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Build/test results
- Runtime-boundary risks

## Code Results

Implemented.

- Updated `apps/api/tsconfig.json` so the production API build excludes `*.test.ts` files and rewrites relative `.ts` import extensions during emit.
- Added `apps/api/src/types/mssql.d.ts` with the local `mssql` surface used by the API build.
- Tightened TypeScript-only handling for defensive default-export fallbacks in `caseRoutes` and `caseVerificationService` without changing route/service behavior.
- Added a build-only type assertion for the existing database bootstrap configuration fallback path.
- Replaced the migration directory calculation with a CommonJS-build and source-test compatible API-root calculation.

Verification:

- `npm run test --workspace apps/api` passed.
- `npm run build --workspace apps/api` passed.
- `npm run build` passed.
- `git diff --check -- apps\api\tsconfig.json apps\api\src docs\01-work-packages\WP-150-api-typescript-build-stabilization.md` passed.

Notes:

- `npm run test --workspace apps/api` still emits existing Node `MODULE_TYPELESS_PACKAGE_JSON` warnings under `--experimental-strip-types`; tests pass and no module-system migration was included in this WP.
- Tracked `apps/api/dist/**` files remain modified in the worktree from build/line-ending output and are intentionally outside this WP's source changes.

## Audit Results

Self-audit completed.

- Verdict: PASS
- Scope compliance: PASS. Source changes are limited to API build configuration, API source type/build compatibility, one API-local declaration file, and this WP document. No frontend, database, SSOT, SQL safety, restricted-table, answer-key, or Student Mode progression files were changed.
- Build correctness: PASS. API production build and root build both pass.
- Test preservation: PASS. Existing API test command still passes after production build exclusions.
- Runtime-boundary preservation: PASS. The changes do not alter route contracts, SQL validation, restricted-table behavior, query execution semantics, schema filtering, health routes, or suspect verification logic.
- Dist handling: PASS for WP source scope. Generated `apps/api/dist/**` worktree modifications remain outside the WP source changes and should be handled separately if a generated-output sync commit is desired.

## Final Decision

Accepted.

Reason: WP-150 restores the API production build and root build while preserving existing API test behavior and backend runtime boundaries. Verification passed for API tests, API build, root build, and scoped whitespace checks. Generated `apps/api/dist/**` worktree changes remain outside this source-focused WP and should be handled separately if a generated-output sync is desired.
