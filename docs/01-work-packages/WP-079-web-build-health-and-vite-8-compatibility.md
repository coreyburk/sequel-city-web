# WP-079: Web Build Health And Vite 8 Compatibility

## Objective

Restore the web workspace build as a normal closeout gate by fixing the Vitest/Vite config typing issue and aligning the React Vite plugin with Vite 8.

## Scope

### In Scope
- Fix `apps/web/vite.config.ts` so Vitest `test` config is typed correctly.
- Update the web Node-side TypeScript config so Vite plugin package exports resolve correctly.
- Update the web Vite React plugin dependency to a Vite 8-compatible version.
- Refresh package lock metadata for the dependency update.
- Verify the web test and build scripts.
- Document the implementation, verification, and final decision in this work package.

### Out of Scope
- Student experience, Samuel guidance, Evidence Board, Query Lab, or styling changes.
- Backend, API, database, route, runtime AI, or artwork changes.
- Changing the guided SQL sequence or case progression.
- Adding new test frameworks or build tools.

## Files Allowed to Change

- `docs/01-work-packages/WP-079-web-build-health-and-vite-8-compatibility.md`
- `apps/web/vite.config.ts`
- `apps/web/tsconfig.node.json`
- `apps/web/package.json`
- `package-lock.json`

## Constraints

- Keep the change focused on build/test tooling compatibility.
- Do not modify application runtime behavior.
- Do not mask TypeScript errors by disabling checks.
- Preserve the existing web test environment: jsdom, globals, and `src/vitest.setup.ts`.
- No student UX changes.

## Required Behavior

- `npm run test --workspace apps/web` must pass.
- `npm run build --workspace apps/web` must pass.
- `npm run dev` should no longer emit the Vite 8 React plugin deprecation warnings caused by the old plugin version.
- The Vitest `test` config must remain in `vite.config.ts` and be typed safely.
- TypeScript must resolve the Vite 8-compatible React plugin from `vite.config.ts`.

## Acceptance Criteria

- [x] `vite.config.ts` uses the appropriate config helper for Vitest-aware typing.
- [x] `tsconfig.node.json` uses module resolution compatible with Vite plugin package exports.
- [x] `@vitejs/plugin-react` is updated to a Vite 8-compatible version.
- [x] `package-lock.json` reflects the dependency update.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No application code or student UX files are modified.

## Codex Prompt

Implement WP-079.

Scope:
- Only modify the allowed files.

Constraints:
- Restore build health without changing application behavior.
- Keep the existing Vitest jsdom setup.
- Do not modify Student Mode UX or backend code.

Return:
- Exact code/package changes.
- Test and build results.

## Gemini Audit Prompt

Audit WP-079 against the build-health objective.

Verify:
- All acceptance criteria are satisfied.
- Changed files stay within the allowed list.
- `vite.config.ts` is typed correctly for Vitest.
- Dependency updates are limited to Vite 8 React plugin compatibility.
- Web tests and build pass.
- No runtime UX behavior was changed.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-079.

Changes made:

- Updated `apps/web/vite.config.ts` to import `defineConfig` from `vitest/config` so the shared Vite/Vitest config accepts the `test` property with proper typing.
- Updated `apps/web/tsconfig.node.json` to use `moduleResolution: "Bundler"` so TypeScript can resolve the Vite 8-compatible React plugin package exports.
- Updated `@vitejs/plugin-react` from `^4.3.4` to `^6.0.1` in `apps/web/package.json`.
- Refreshed `package-lock.json` with the Vite 8-compatible React plugin dependency tree.
- Ran `npm dedupe --workspace apps/web` so Vitest, the React plugin, and the web workspace share one Vite 8 instance.
- Removed generated verification artifacts after test/build/dev checks.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` passed.
- `npm ls vite @vitejs/plugin-react vitest --all` shows:
  - `@vitejs/plugin-react@6.0.1`
  - `vite@8.0.13` shared/deduped by the web workspace, React plugin, and Vitest
  - `vitest@4.1.5`
- Short `npm run dev --workspace apps/web` smoke check started Vite 8.0.13 without the previous React plugin deprecation warnings:
  - no `esbuild` option deprecation warning
  - no `optimizeDeps.esbuildOptions` deprecation warning
  - port 5174 was used only because port 5173 was already occupied by the existing dev server

## Gemini Audit Results

Audit of **WP-079: Web Build Health and Vite 8 Compatibility** is complete.

### Verdict: **PASS**

#### Analysis
The work package successfully addresses the build health and compatibility issues identified. The transition to Vite 8 and the alignment of the React plugin and Vitest configurations have been implemented following best practices for modern TypeScript and Vite environments.

#### Acceptance Criteria Verification
- **[PASS] `vite.config.ts` typing:** The file correctly imports `defineConfig` from `vitest/config`, ensuring the `test` block is safely typed without requiring separate `@types/vitest` global overrides.
- **[PASS] `tsconfig.node.json` resolution:** `moduleResolution` was updated to `"Bundler"`. This is the required setting for resolving the modern package exports used by the Vite 8-compatible React plugin.
- **[PASS] Dependency Update:** `@vitejs/plugin-react` was updated to `^6.0.1` and `vite` to `^8.0.10` (resolving to `8.0.13` in the lockfile). This resolves the deprecation warnings observed in older plugin versions when running against Vite 8.
- **[PASS] Package Lock Integrity:** `package-lock.json` has been updated and reflects the correctly deduped dependency tree, with `vite@8.0.13` being shared across the workspace.
- **[PASS] Verification Results:** Per the implementation report, the web test suite (7 files, 34 tests) and the production build both pass successfully.
- **[PASS] Scope Adherence:** Modifications were strictly limited to the allowed configuration and documentation files. No changes were found in the `src` directories or backend code.

#### Audit Details
- **Violations:** None.
- **Regressions:** None. The build process is now more stable and warning-free.
- **Drift risks:** Low. The move to `moduleResolution: "Bundler"` is the current standard for Vite 6+ and helps prevent future resolution issues with ESM-first plugins.

The implementation is clean, surgical, and fulfills the objective of restoring the web workspace build health.

Additional user verification:

- `npm run dev` no longer emits warnings after the Vite 8 React plugin update.

## Final Decision

Accepted.

WP-079 is accepted based on the passing audit and verification. The implementation may be committed and pushed as one cohesive build-health work package.

