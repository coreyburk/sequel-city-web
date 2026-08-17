# WP-261 - Case 001 Gated M2-M3 UI Feedback

## Objective

Add a narrow gated Case 001 frontend feedback slice that can submit the existing M2 and M3 SQL milestone queries through `/api/query/execute` with explicit `caseMilestoneEvaluation` opt-in and render only non-spoiler metadata feedback.

Case 001 must remain locked, unreleased, non-progressing, and skeleton-gated.

## Scope

### In Scope

- Extend the frontend Case 001 API response type contract so M1-M3 metadata from WP-260 can be represented:
  - M1 `case-001-clocktower-report-located` / `CrimeSceneReport`
  - M2 `case-001-report-interviews-located` / `InterviewLog`
  - M3 `case-001-witness-identities-resolved` / `PersonsOfInterest`
- Add Case 001 skeleton-local authored UI constants for M2 and M3 query feedback:
  - starter SQL or prompt text for the existing public M2/M3 milestone boundaries from the Case 001 plan;
  - submit labels;
  - non-spoiler matched/no-match/missing-metadata/error messages.
- Extend the gated `StudentPlayableCaseSkeletonView` SQL feedback surface so it can submit M2 and M3 checks through the existing `executeQuery` opt-in path.
- Render only non-spoiler milestone feedback based on returned metadata:
  - milestone label or evidence table family;
  - matched/not matched state;
  - generic next-step copy;
  - no raw rows, transcript text, PersonName values, SQL answer-key text, culprit/final opportunity content, or hidden validator details.
- Keep the feedback non-progressing:
  - no milestone advancement;
  - no persistence;
  - no clue logging;
  - no guidance/thread progression;
  - no suspect verification.
- Add focused frontend unit tests for:
  - M2 request metadata and non-spoiler feedback;
  - M3 request metadata and non-spoiler feedback;
  - no raw returned rows rendered for M2/M3;
  - no `localStorage` writes;
  - default `executeQuery(sql)` payload shape remains unchanged.
- Refresh Understand graph artifacts after implementation.
- Update this WP's Code Results after implementation.
- Update `docs/00-ssot/END-OF-DAY-HANDOFF.md` only during accepted closeout.

### Out of Scope

- No release unlock.
- No normal Case 004 Query Lab behavior changes.
- No broad reusable Query Lab rewrite.
- No new Case 001 app route, tab, or full workbench.
- No result table rendering for Case 001 M2/M3.
- No frontend clue logging, evidence-board behavior, notebook writes, investigation threads, Samuel guidance progression, persistence, reset, or localStorage.
- No milestone progression or runtime case state advancement.
- No suspect verification.
- No answer-key, culprit, final opportunity, or final solve flow.
- No backend behavior changes.
- No database seed changes.
- No migrations.
- No local database connection, rebuild, drop, or mutation.
- No runtime AI.
- No dependency, package, or lockfile changes.
- No Case 004 behavior changes.
- No M4-M6 UI or metadata behavior.

## Impact Analysis

### Understand Status

- Graph available: yes
- Baseline commit: `32879078118eb4ee4a91c8defcd0915c1aadb4dc`
- Current HEAD at planning time: `ecf1041a6237d8709639147927cd2b7b00753383`
- Freshness assessment: usable with represented WP-260 closeout drift
- Analysis performed:
  - Confirmed `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` exist.
  - Read `.understand-anything/meta.json`; it records the WP-260 pre-closeout commit because the graph was refreshed before the accepted WP-260 commit.
  - Inspected changed paths from graph baseline to HEAD. Drift is the accepted WP-260 backend integration, tests, WP record, handoff, and tracked graph artifacts.
  - Searched the graph for `StudentPlayableCaseSkeletonView`, `executeQuery`, `caseMilestoneEvaluation`, and `studentCase001`; graph nodes exist for the relevant frontend component, API client function, and Case 001 constants.
  - Verified graph findings against source in `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`, `apps/web/src/api/types.ts`, `apps/web/src/api/client.ts`, `apps/web/src/studentCase001.ts`, and related tests.
  - Confirmed current frontend type `Case001GatedMilestoneEvaluationResult` is still M1-only, while backend `apps/api/src/types/query.ts` now imports the M1-M3 evaluator result contract.

### Affected Architecture

- Layers:
  - Frontend API client type contract
  - Gated Case 001 skeleton module constants
  - Gated Case 001 skeleton UI feedback component
  - Frontend unit tests
  - Understand graph artifacts
- Primary files/components:
  - `apps/web/src/api/types.ts`
  - `apps/web/src/api/client.test.ts`
  - `apps/web/src/studentCase001.ts`
  - `apps/web/src/studentCaseModule.ts`
  - `apps/web/src/studentCaseModule.test.ts`
  - `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
  - `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
  - `apps/web/src/styles.css`
- Upstream consumers:
  - Existing Case 001 skeleton gate via `getPlayableStudentCaseModule("case-001")`
  - Existing Case 001 skeleton first SQL feedback slice from WP-253
  - Existing `/api/query/execute` frontend API client
- Downstream dependencies:
  - WP-260 backend gated M1-M3 metadata transport
  - WP-259 M2/M3 deterministic validators
  - Future Case 001 progression, persistence, clue logging, and full Query Lab work

### Regression Surface

- Related tests:
  - `npm run test --workspace apps/web -- StudentPlayableCaseSkeletonView`
  - `npm run test --workspace apps/web -- client`
  - `npm run test --workspace apps/web -- studentCaseModule`
  - `npm run test --workspace apps/web`
  - `npm run build --workspace apps/web`
  - `git diff --check`
  - `scripts/check-understand-refresh-readiness.ps1`
  - `scripts/refresh-understand-graph.ps1`
- User workflows:
  - Normal released Case 004 Query Lab must remain unchanged.
  - Case 001 remains invisible unless the explicit skeleton gate is enabled.
  - Gated Case 001 skeleton users may test M2/M3 SQL metadata feedback, but cannot unlock or advance the case.
- Security/data boundaries:
  - Case 001 feedback must not render raw query rows, transcript text, PersonName values, answer-key data, culprit identity, final opportunity evidence, hidden validator tokens, SQL solution content, or restricted-table content.
  - Metadata remains non-progressing and should not be written to query history, localStorage, notebook, evidence board, or thread state by frontend code.

### Graph Update Decision

- Regeneration required: Yes
- Rationale: planned frontend changes alter the Case 001 skeleton UI/component imports, frontend API metadata type contract, and module constants/tests. Include tracked graph artifacts in this WP and refresh after implementation.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-261-case-001-gated-m2-m3-ui-feedback.md`
- `apps/web/src/api/types.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
- `apps/web/src/styles.css`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/api/**`
- `apps/web/src/App.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/features/investigationThreads/**`
- `apps/web/src/features/queryReinforcement/**`
- `apps/web/tests/browser/**`
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

- Preserve existing M1 feedback behavior.
- Preserve `executeQuery(sql)` default payload shape as `{ sql }`.
- All M2/M3 calls must use explicit `caseMilestoneEvaluation` metadata with:
  - `caseId: "case-001"`
  - supported M2/M3 milestone id
  - `isSkeletonGateEnabled: module.releaseGate.isEnabled()`
- Case 001 remains gated by `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` and remains unreleased by default.
- Do not add any state persistence, milestone progression, clue logging, investigation-thread updates, query-history changes, or suspect verification.
- Do not expose raw query rows or spoiler-bearing row fields in the Case 001 skeleton feedback UI.
- Do not make the Case 001 skeleton part of `PLAYABLE_STUDENT_CASE_MODULES`.
- Do not modify backend validators, backend query execution, database scripts, migrations, packages, or Case 004 behavior.

## Required Behavior

- Frontend API typing must represent M1-M3 Case 001 metadata without weakening the response shape to arbitrary strings for supported Case 001 milestone/evidence pairs.
- The Case 001 skeleton UI must display a gated M2 feedback control that:
  - submits SQL through `executeQuery`;
  - requests `case-001-report-interviews-located`;
  - uses the current skeleton gate state;
  - displays non-spoiler matched/no-match/missing-metadata/error feedback.
- The Case 001 skeleton UI must display a gated M3 feedback control that:
  - submits SQL through `executeQuery`;
  - requests `case-001-witness-identities-resolved`;
  - uses the current skeleton gate state;
  - displays non-spoiler matched/no-match/missing-metadata/error feedback.
- M2/M3 feedback must not render query result tables, row values, transcripts, names, matched row count labels, milestone internals, or `milestoneAdvanced`.
- M2/M3 feedback must not write to `localStorage`.
- The existing M1 first SQL feedback slice must continue to submit the M1 metadata request and render the same non-spoiler messages.
- Normal Query Lab / Case 004 callers must remain unaffected when no metadata opt-in is passed.

## Acceptance Criteria

- [ ] Frontend `Case001GatedMilestoneEvaluationResult` supports exactly the current Case 001 M1-M3 milestone/evidence metadata returned by the backend.
- [ ] M1 skeleton feedback behavior remains unchanged and covered by existing or updated tests.
- [ ] M2 skeleton feedback submits `case-001-report-interviews-located` with the current skeleton gate state and renders non-spoiler matched feedback from metadata.
- [ ] M3 skeleton feedback submits `case-001-witness-identities-resolved` with the current skeleton gate state and renders non-spoiler matched feedback from metadata.
- [ ] M2/M3 no-match and missing-metadata states render non-spoiler feedback.
- [ ] M2/M3 tests prove raw query rows, transcript text, PersonName values, `matchedRowCount`, and `milestoneAdvanced` are not rendered.
- [ ] Tests prove M2/M3 feedback does not write `localStorage`.
- [ ] `executeQuery(sql)` still sends only `{ sql }` when no metadata opt-in is supplied.
- [ ] Case 001 remains locked and unreleased unless the existing skeleton gate is explicitly enabled.
- [ ] `PLAYABLE_STUDENT_CASE_MODULES` still contains only Case 004.
- [ ] No backend, database, migration, package, lockfile, release-gate, persistence, progression, clue-logging, suspect-verification, runtime AI, browser-test, or Case 004 behavior changes are made.
- [ ] Understand graph artifacts are refreshed after implementation.
- [ ] Code Results record validation evidence before audit.

## Code Prompt

Implement WP-261.

Read this WP and the current frontend source before editing. Keep the change frontend-only and scoped to the allowed files.

Required implementation:

- Update `apps/web/src/api/types.ts` so the frontend response type can safely represent Case 001 M1, M2, and M3 gated metadata from the backend.
- Add authored Case 001 M2/M3 skeleton feedback constants in `apps/web/src/studentCase001.ts`.
- If needed, extend the skeleton module contract in `apps/web/src/studentCaseModule.ts` so the skeleton owns the M1-M3 SQL feedback boundaries without making Case 001 a released module.
- Extend `StudentPlayableCaseSkeletonView` to render M2/M3 gated SQL feedback controls through the existing `executeQuery` opt-in path.
- Keep feedback non-spoiler and non-progressing; do not render rows, transcripts, names, matched row count labels, `milestoneAdvanced`, hidden validation tokens, or answer content.
- Add focused tests in `StudentPlayableCaseSkeletonView.test.tsx`, `client.test.ts`, and `studentCaseModule.test.ts`.
- Refresh Understand graph artifacts after implementation.
- Record validation in Code Results.

Do not modify backend files, database files, migrations, packages, lockfiles, browser tests, normal Case 004 Query Lab, persistence, progression, clue logging, suspect verification, answer-key behavior, runtime AI, or Case 004 behavior.

Run and record:

```powershell
npm run test --workspace apps/web -- StudentPlayableCaseSkeletonView
npm run test --workspace apps/web -- client
npm run test --workspace apps/web -- studentCaseModule
npm run test --workspace apps/web
npm run build --workspace apps/web
git diff --check
scripts/check-understand-refresh-readiness.ps1
scripts/refresh-understand-graph.ps1
scripts/check-understand-refresh-readiness.ps1
git diff --name-only
```

## Audit Prompt

Audit WP-261.

Review the work package, changed files, Code Results, validation evidence, and actual frontend behavior. Report findings first, ordered by severity with file/line references.

Required checks:

- changed files are within the allowed scope;
- frontend metadata typing represents M1-M3 without overly broad or spoiler-prone weakening;
- M1 feedback behavior remains unchanged;
- M2 and M3 controls submit explicit `case-001` metadata opt-in with the current skeleton gate state;
- M2/M3 matched, no-match, missing-metadata, and error states render only non-spoiler feedback;
- UI does not render raw query rows, transcript text, PersonName values, answer-key data, culprit identity, final opportunity evidence, SQL solution text, matched row count labels, `milestoneAdvanced`, or hidden validator details;
- M2/M3 feedback does not write localStorage, notebook state, evidence board state, investigation threads, query history, or progression state;
- Case 001 remains locked/unreleased unless the existing skeleton gate is enabled;
- `PLAYABLE_STUDENT_CASE_MODULES` still contains only Case 004;
- normal Case 004 Query Lab / `executeQuery(sql)` behavior is unchanged when no opt-in is passed;
- no backend, database, migration, package, lockfile, browser-test, release-gate, persistence, progression, clue-logging, suspect-verification, runtime AI, or Case 004 behavior changed;
- required tests/build/checks were run and recorded;
- Understand graph artifacts were refreshed and no transient graph trash/temp/log artifacts were added.

Return `Verdict: PASS` only if all checks pass. Return `Verdict: FAIL` for unmet requirements or scope drift. Return `Verdict: BLOCKED` if repository context or validation evidence is insufficient for an independent verdict.

## Code Results

Implemented.

Summary:

- Extended the frontend Case 001 metadata type contract to represent the supported M1-M3 milestone/evidence pairs without accepting arbitrary supported result strings.
- Added skeleton-local Case 001 M2/M3 SQL feedback boundaries and non-spoiler feedback copy in `studentCase001.ts`.
- Extended the skeleton module contract so Case 001 owns M1-M3 feedback slices while `PLAYABLE_STUDENT_CASE_MODULES` remains Case 004-only.
- Reworked `StudentPlayableCaseSkeletonView` to render M1-M3 gated SQL feedback controls through `executeQuery` with explicit metadata opt-in and component-local state.
- Added focused tests for M2/M3 request metadata, matched/no-match/missing-metadata feedback, row/transcript/name suppression, no `localStorage` writes, and default `executeQuery(sql)` payload behavior.
- Kept Case 001 locked/unreleased and non-progressing; no backend, database, migration, package, lockfile, browser-test, persistence, progression, clue-logging, suspect-verification, runtime AI, Case 004, or normal Query Lab changes were made.
- Build output generated during validation did not produce tracked dirty files.

Validation:

- PASS `npm run test --workspace apps/web -- StudentPlayableCaseSkeletonView`
- PASS `npm run test --workspace apps/web -- client`
- PASS `npm run test --workspace apps/web -- studentCaseModule`
- PASS `npm run test --workspace apps/web`
  - Note: first run failed because `CASE_001_AUTHORING_DEFINITION` was widened to M2/M3. That was corrected as out-of-scope for this UI feedback package; rerun passed with 17 files and 220 tests.
- PASS `npm run build --workspace apps/web`
- PASS `git diff --check`
- PASS `scripts/check-understand-refresh-readiness.ps1` before refresh: READY
- PASS `scripts/refresh-understand-graph.ps1`: filesScanned=639, nodes=1035, edges=396, layers=6, tourSteps=7, fingerprints=639
- PASS `scripts/check-understand-refresh-readiness.ps1` after refresh: READY
- PASS `git diff --name-only`: only allowed frontend source/test/WP files and tracked Understand artifacts changed.

## Audit Results

Verdict: PASS
All background tasks have completed. The WP-261 audit is complete with `Verdict: PASS`. Let me know if you would like to proceed with the closeout steps or handoff documentation.

## Final Decision

Accepted on 2026-08-17 after audit PASS and explicit human closeout request.

