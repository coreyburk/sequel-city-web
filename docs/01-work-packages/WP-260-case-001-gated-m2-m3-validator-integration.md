# WP-260 - Case 001 Gated M2-M3 Validator Integration

## Objective

Wire the WP-259 Case 001 M2-M3 result-pattern validators into the existing backend gated milestone evaluation path so `/api/query/execute` can return non-progressing M2/M3 evaluation metadata only when explicitly requested and skeleton-gated.

Case 001 must remain locked and unreleased. This work package is backend integration only.

## Scope

### In Scope

- Extend the existing Case 001 gated evaluator to dispatch among the three currently implemented Case 001 milestone validators:
  - M1 `case-001-clocktower-report-located`
  - M2 `case-001-report-interviews-located`
  - M3 `case-001-witness-identities-resolved`
- Preserve the same skeleton gate requirement:
  - `caseId` must be `case-001`
  - `isSkeletonGateEnabled` must be `true`
  - requested `milestoneId` must be one of the explicitly supported Case 001 milestone ids
- Return only non-spoiler metadata:
  - `caseId`
  - `milestoneId`
  - `evidenceTableFamily`
  - `gate`
  - `evaluated`
  - `matched`
  - `matchedRowCount`
  - `runtimeStatus`
  - `milestoneAdvanced: false`
- Extend query execution transport filtering so the explicit metadata opt-in can reach M2 and M3.
- Add focused backend service and route tests for M2/M3 positive and negative opt-in behavior.
- Refresh Understand graph artifacts after implementation.
- Update this WP's Code Results after implementation.
- Update `docs/00-ssot/END-OF-DAY-HANDOFF.md` only during accepted closeout.

### Out of Scope

- No release unlock.
- No frontend or Query Lab rendering.
- No broad UI/client changes.
- No runtime progression.
- No milestone advancement.
- No persistence, reset, or localStorage work.
- No guidance, thread, clue logging, or evidence-board behavior.
- No suspect verification.
- No answer-key or `CaseAnswerKey` behavior.
- No culprit identity or final opportunity content.
- No database seed changes.
- No migrations.
- No schema changes.
- No local database connection, rebuild, drop, or mutation.
- No runtime AI.
- No dependency, package, or lockfile changes.
- No Case 004 behavior changes.
- No new validators for M4-M6.

## Impact Analysis

### Understand Status

- Graph available: yes
- Baseline commit: `1295f652c8cfd9e2ac04f916a8571c11467d3137`
- Current HEAD at planning time: `32879078118eb4ee4a91c8defcd0915c1aadb4dc`
- Freshness assessment: usable with represented WP-259 closeout drift
- Analysis performed:
  - Confirmed `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/intermediate/scan-result.json` exist.
  - Read `.understand-anything/meta.json`; it records the WP-259 pre-closeout commit because the graph was refreshed before the accepted WP-259 commit.
  - Inspected changed paths from graph baseline to HEAD. The drift is the accepted WP-259 evidence bundle, validators/tests, docs, handoff, WP record, and tracked graph artifacts.
  - Verified relevant relationships against source files rather than relying only on graph metadata.

### Affected Architecture

- Layers:
  - Backend query execution service
  - Backend Case 001 gated milestone evaluation service
  - Backend query route tests
  - Query response type contract
  - Understand graph artifacts
- Primary files/components:
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
  - `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
  - `apps/api/src/services/queryExecutionService.ts`
  - `apps/api/src/services/queryExecutionService.test.ts`
  - `apps/api/src/routes/queryRoutes.test.ts`
  - `apps/api/src/types/query.ts`
- Upstream consumers:
  - Existing `/api/query/execute` route request body forwarding
  - Existing Case 001 skeleton UI/client metadata opt-in path
  - Existing M1 gated metadata behavior
- Downstream dependencies:
  - WP-259 validators in `case001ResultPatternService.ts`
  - Query result normalization
  - SQL safety and restricted-table guards
  - Future Case 001 Query Lab/UI integration and playthrough smoke tests

### Regression Surface

- Related tests:
  - `node --experimental-strip-types apps/api/src/services/case001ResultPatternService.test.ts`
  - `node --experimental-strip-types apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
  - `node --experimental-strip-types apps/api/src/services/queryExecutionService.test.ts`
  - `node --experimental-strip-types apps/api/src/routes/queryRoutes.test.ts`
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - `git diff --check`
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
- User workflows:
  - No normal released user workflow changes.
  - Dev/test Case 001 skeleton backend metadata path can request M2/M3 evaluation explicitly.
- Security/data boundaries:
  - Restricted-table blocking must remain unchanged.
  - Query history must not persist milestone evaluation metadata unless already designed elsewhere.
  - Metadata must not include result rows, SQL text, answer-key data, culprit identity, or transcript contents.
  - Case 001 remains skeleton-gated and non-progressing.

### Graph Update Decision

- Regeneration required: Yes
- Rationale: planned changes alter backend service imports/contracts and query transport behavior. Include tracked graph artifacts in this WP and refresh after implementation.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-260-case-001-gated-m2-m3-validator-integration.md`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.ts`
- `apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- `apps/api/src/services/queryExecutionService.ts`
- `apps/api/src/services/queryExecutionService.test.ts`
- `apps/api/src/routes/queryRoutes.test.ts`
- `apps/api/src/types/query.ts`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/api/src/services/case001ResultPatternService.ts`
- `apps/api/src/services/case001ResultPatternService.test.ts`
- `apps/api/src/routes/queryRoutes.ts`
- `apps/api/src/services/sqlSafetyService.ts`
- `apps/api/src/services/studentRestrictedTables.ts`
- `apps/api/src/services/queryHistoryService.ts`
- `apps/web/**`
- `database/**`
- `database/migrations/**`
- `docs/15-case-plans/**`
- `scripts/**`
- `.codex/skills/**`
- package files
- lock files
- build output
- test output

## Constraints

- Preserve existing M1 metadata behavior.
- Preserve disabled-gate, wrong-case, wrong-milestone, blocked-SQL, restricted-table, and execution-failure behavior.
- Keep all Case 001 evaluations non-progressing: `milestoneAdvanced` must remain `false`.
- Do not expose row contents, SQL text, transcript text, answer keys, culprit identity, or restricted-table data in milestone metadata.
- Do not modify WP-259 validators unless a blocking compile issue proves the existing contract is impossible to consume; if that happens, stop and create a corrective WP instead of widening scope.
- Do not change runtime release gates or frontend behavior.

## Required Behavior

- The gated evaluator must accept a `milestoneId` in its request.
- For `case-001` plus enabled skeleton gate:
  - M1 dispatches to `validateCase001ClocktowerReportLocated`.
  - M2 dispatches to `validateCase001ClocktowerReportInterviewsLocated`.
  - M3 dispatches to `validateCase001ClocktowerWitnessIdentitiesResolved`.
- For unsupported Case 001 milestone ids:
  - no validator should run;
  - no `caseMilestoneEvaluation` should be emitted by query execution.
- For non-Case 001 requests:
  - no validator should run;
  - no metadata should be emitted by query execution.
- For disabled skeleton gate:
  - no validator should run;
  - no metadata should be emitted by query execution.
- Query execution must pass the requested `milestoneId` into the evaluator for supported M1-M3 ids.
- Route handler behavior must remain thin and continue forwarding the explicit `caseMilestoneEvaluation` payload without interpreting result rows.
- Tests must prove M2/M3 metadata appears only for explicit supported gated opt-in and remains absent for wrong milestone, disabled gate, blocked/restricted SQL, and execution failures.

## Acceptance Criteria

- [ ] M1 behavior remains unchanged and covered by existing or updated tests.
- [ ] M2 explicit gated opt-in returns `case-001-report-interviews-located` metadata with `evidenceTableFamily: "InterviewLog"`, matched state, matched row count, and `milestoneAdvanced: false`.
- [ ] M3 explicit gated opt-in returns `case-001-witness-identities-resolved` metadata with `evidenceTableFamily: "PersonsOfInterest"`, matched state, matched row count, and `milestoneAdvanced: false`.
- [ ] Unsupported Case 001 milestone ids do not call a validator and do not emit `caseMilestoneEvaluation`.
- [ ] Disabled gate and non-Case 001 requests do not call validators and do not emit metadata.
- [ ] Blocked SQL, restricted-table SQL, and execution failures do not call validators and do not emit metadata.
- [ ] Metadata does not include returned rows, SQL text, transcript text, answer-key data, culprit identity, or restricted-table content.
- [ ] Query history remains free of milestone evaluation metadata.
- [ ] No frontend, database, migration, package, lockfile, release-gate, persistence, progression, suspect-verification, runtime AI, or Case 004 behavior changes are made.
- [ ] Understand graph artifacts are refreshed after implementation.
- [ ] Code Results record validation evidence before audit.

## Code Prompt

Implement WP-260.

Read this WP and the current source before editing. Keep the change backend-only and scoped to the allowed files.

Required implementation:

- Extend `case001GatedMilestoneEvaluationService` so requests include a `milestoneId` and dispatch only among the existing M1, M2, and M3 Case 001 validators.
- Update the query response type contract if needed so M1-M3 metadata can be represented without weakening the metadata shape.
- Update `queryExecutionService` so explicit Case 001 metadata opt-in supports M1-M3 milestone ids and still suppresses metadata for unsupported milestone ids, disabled gate, wrong case, blocked/restricted SQL, and execution failures.
- Add focused tests in the gated evaluator, query execution service, and route tests for M2/M3 positive and negative paths.
- Preserve M1 behavior and all existing safety/restricted-table/query-history behavior.
- Refresh Understand graph artifacts after implementation.
- Record validation in Code Results.

Do not modify WP-259 validators, frontend files, database files, migrations, packages, lockfiles, release gates, persistence, progression, suspect verification, answer-key behavior, runtime AI, or Case 004 behavior.

Run and record:

```powershell
node --experimental-strip-types apps/api/src/services/case001ResultPatternService.test.ts
node --experimental-strip-types apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts
node --experimental-strip-types apps/api/src/services/queryExecutionService.test.ts
node --experimental-strip-types apps/api/src/routes/queryRoutes.test.ts
npm run test --workspace apps/api
npm run build --workspace apps/api
git diff --check
scripts/check-understand-refresh-readiness.ps1
scripts/refresh-understand-graph.ps1
scripts/check-understand-refresh-readiness.ps1
git diff --name-only
```

## Audit Prompt

Audit WP-260.

Review the work package, changed files, Code Results, and validation evidence. Report findings first, ordered by severity with file/line references.

Required checks:

- changed files are within the allowed scope;
- M1 behavior remains unchanged;
- M2 and M3 metadata are returned only for explicit `case-001` requests with enabled skeleton gate and supported milestone ids;
- unsupported milestone ids, disabled gate, non-Case 001 requests, blocked SQL, restricted-table SQL, and execution failures do not run validators or emit metadata;
- `milestoneAdvanced` remains `false` for all Case 001 evaluations;
- metadata contains no rows, SQL text, transcript text, answer-key data, culprit identity, or restricted-table content;
- query history remains free of milestone evaluation metadata;
- route handler remains thin and does not implement validation logic;
- no frontend, database, migration, package, lockfile, release-gate, persistence, progression, suspect-verification, runtime AI, or Case 004 behavior changed;
- required tests/build/checks were run and recorded;
- Understand graph artifacts were refreshed and no transient graph trash/temp/log artifacts were added.

Return `Verdict: PASS` only if all checks pass. Return `Verdict: FAIL` for unmet requirements or scope drift. Return `Verdict: BLOCKED` if repository context or validation evidence is insufficient for an independent verdict.

## Code Results

Implemented.

Summary:

- Extended `case001GatedMilestoneEvaluationService` to dispatch only the supported Case 001 M1-M3 milestone ids to the existing WP-259 validators.
- Preserved non-progressing metadata for all Case 001 evaluations; `milestoneAdvanced` remains `false`.
- Updated query execution filtering so explicit gated Case 001 opt-in supports M1-M3 while suppressing unsupported milestone ids, disabled gates, non-Case 001 requests, blocked/restricted SQL, and execution failures.
- Kept route handling thin; route tests cover forwarding and returned M2/M3 metadata without adding route-level validation logic.
- No frontend, database, migration, package, lockfile, release-gate, persistence, progression, suspect-verification, runtime AI, Case 004, or WP-259 validator changes were made.
- Build output generated by validation was restored and is not included in the WP diff.

Validation:

- PASS `node --experimental-strip-types apps/api/src/services/case001ResultPatternService.test.ts`
- PASS `node --experimental-strip-types apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts`
- PASS `node --experimental-strip-types apps/api/src/services/queryExecutionService.test.ts`
- PASS `node --experimental-strip-types apps/api/src/routes/queryRoutes.test.ts`
- PASS `npm run test --workspace apps/api`
- PASS `npm run build --workspace apps/api`
- PASS `git diff --check`
- PASS `scripts/check-understand-refresh-readiness.ps1` before refresh: READY
- PASS `scripts/refresh-understand-graph.ps1`: filesScanned=638, nodes=1030, edges=392, layers=6, tourSteps=7, fingerprints=638
- PASS `scripts/check-understand-refresh-readiness.ps1` after refresh: READY
- PASS `git diff --name-only`: only allowed source/test/WP files and tracked Understand artifacts changed.

## Audit Results

Verdict: PASS

## Final Decision

Accepted on 2026-08-14 after audit PASS and explicit human closeout request.

