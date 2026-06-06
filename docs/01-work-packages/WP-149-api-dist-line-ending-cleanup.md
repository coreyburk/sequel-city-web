# WP-149: API Dist Line Ending Cleanup

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-06

## Objective

Resolve the last dirty tracked `apps/api/dist` files by confirming they are line-ending-only worktree noise and restoring them to the committed state.

## Why This WP Exists

After WP-148 closed the real generated-output drift, `git status` still showed additional tracked `apps/api/dist` files as modified. Inspection established that:

- `git status` reported 17 remaining tracked `dist` files
- `git diff`, `git diff --stat`, and `git diff --numstat` produced no content changes for those files
- `git config --get core.autocrlf` returned `true`
- Git emitted `LF will be replaced by CRLF` warnings for the same file set

This indicates worktree normalization noise rather than meaningful source or generated-output drift. The repository should be returned to a clean state without committing those false modifications.

## Scope

### In Scope

- verify the remaining tracked `apps/api/dist` files have no substantive diffs
- document the line-ending-only cleanup decision
- restore those files to the committed state
- leave the repository clean after the WP-148 and WP-149 closeout

### Out of Scope

- new API source or `dist` behavior changes
- rebuilding `apps/api/dist`
- changing `.gitattributes`, `.editorconfig`, or repo-wide line-ending policy
- frontend, Case 004, or Understand workflow changes

## Review Summary

- Remaining dirty files were limited to:
  - `apps/api/dist/routes/queryHistoryRoutes.js`
  - `apps/api/dist/routes/queryHistoryRoutes.test.js`
  - `apps/api/dist/routes/queryRoutes.js`
  - `apps/api/dist/routes/schemaRoutes.js`
  - `apps/api/dist/routes/schemaRoutes.test.js`
  - `apps/api/dist/server.js`
  - `apps/api/dist/services/queryHistoryService.js`
  - `apps/api/dist/services/queryHistoryService.test.js`
  - `apps/api/dist/services/queryResultNormalizer.js`
  - `apps/api/dist/services/queryResultNormalizer.test.js`
  - `apps/api/dist/services/sqlSafetyService.js`
  - `apps/api/dist/services/sqlSafetyService.test.js`
  - `apps/api/dist/types/database.js`
  - `apps/api/dist/types/query.js`
  - `apps/api/dist/types/queryHistory.js`
  - `apps/api/dist/types/schema.js`
  - `apps/api/dist/types/sqlSafety.js`
- Content-oriented diff commands returned no textual or numeric changes for the file set.
- The only observable signal was line-ending normalization warnings under the current Git configuration.

## Files Allowed To Change

- this work-package document

## Verification

- reviewed `git status --short`
- reviewed `git diff --stat -- apps/api/dist`
- reviewed `git diff --name-only -- apps/api/dist`
- reviewed `git diff --numstat -- apps/api/dist`
- reviewed `git diff -- apps/api/dist/server.js`
- reviewed `git diff-index --raw HEAD -- apps/api/dist`
- reviewed `git config --get core.autocrlf`

## Code Results

No code or generated outputs required committing. The remaining tracked `dist` entries were restored to the committed state instead of being recorded as new repository changes.

## Audit Results

Verdict: PASS

- no hidden functional diffs remained in the tracked `dist` files
- no source, database, or frontend files were touched
- cleanup is limited to removing line-ending-only worktree noise

## Final Decision

Accepted.

- restore the remaining tracked `apps/api/dist` files from `HEAD`
- commit only this cleanup record
