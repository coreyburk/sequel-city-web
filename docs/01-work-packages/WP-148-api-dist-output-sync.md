# WP-148: API Dist Output Sync

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-06

## Objective

Document and commit the remaining tracked `apps/api/dist` changes that mirror already-committed API source behavior.

## Why This WP Exists

After closing WP-147, the only remaining dirty files in the repository were tracked JavaScript outputs under `apps/api/dist`. Source inspection showed the corresponding TypeScript source changes already exist under `apps/api/src`, including:

- app bootstrap and admin route registration
- student restricted-table query blocking
- schema filtering for student-visible tables

This WP exists to close out that generated-output drift explicitly instead of mixing it into unrelated student-web work.

## Scope

### In Scope

- review the remaining `apps/api/dist` diffs
- confirm they mirror existing committed API source
- document the generated-output sync decision
- commit the tracked `dist` updates

### Out of Scope

- new API source changes
- database or migration changes
- fixing the broader API TypeScript build debt
- frontend or Case 004 progression work

## Review Summary

- Remaining dirty files were limited to tracked `apps/api/dist/**` outputs.
- Source inspection confirmed the outputs correspond to already-present source behavior in:
  - `apps/api/src/app.ts`
  - `apps/api/src/services/queryExecutionService.ts`
  - `apps/api/src/services/schemaService.ts`
  - related bootstrap/admin/student-restricted-table source modules
- No new source-only logic was introduced in this closeout.

## Files Allowed To Change

- `apps/api/dist/**`
- this work-package document

## Verification

- reviewed `git diff --stat -- apps/api/dist`
- reviewed representative diffs in `apps/api/dist/app.js`, `apps/api/dist/services/queryExecutionService.js`, and `apps/api/dist/services/schemaService.js`
- confirmed corresponding source symbols exist in `apps/api/src/**`

## Code Results

Accepted the remaining tracked API build-output drift as generated-output synchronization work.

## Audit Results

Verdict: PASS

- no remaining web or case-progression source files were included
- output drift matches already-committed API source behavior
- broader API build reproducibility remains a separate concern outside this WP

## Final Decision

Accepted.

- commit the remaining tracked `apps/api/dist` synchronization changes
- preserve source, database, and frontend boundaries with no new runtime design changes in this WP
