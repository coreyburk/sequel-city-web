# WP-304: Collected evidence and fact tokens

## Objective
Correct missing/non-clickable pinned details and merge overlapping notebook records without losing their relationships.

## Scope
Keep proved facts clickable beyond their current task, project details from owned logged-row and proved query actions separately from progression facts, and combine compatible partial/full notebook entries by primary record ID. Clearly label each evidence record; repeated foreign keys remain to explain links.

## Impact Analysis
Required cross-module API/repository/web change. Graph refreshed at HEAD 322e5e0 with pending WP-300/302/303 changes, usable for navigation; source is authority. Snapshot currently nulls columns when no current input binding exists, and only projects progression facts. ownedSnapshotData already reads owned evidence transactionally; extend it with logged actions and query actions tied to owned proved steps only after ownership check. Never derive authoritative details from user-editable notes. Preserve existing progress facts and validators; new collectedDetails are reference-only and never used in progression. No SQL schema/seed or classroom changes. Graph regeneration included.

## Files Allowed to Change
- docs/01-work-packages/WP-304-collected-evidence-fact-tokens.md
- apps/api/src/repositories/caseRuntimeRepository.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/types/caseRuntime.ts
- apps/web/src/api/types.ts
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do not modify schema, seeds, validators, other WPs, dependencies or classroom data. Preserve pending WP-300/303 changes in shared files. Existing preview checkout may receive only changed application files and restart without reset or clone.

## Constraints
Collected details are not proof, do not advance tasks and never derive from imported/manual notes. Legacy log summaries remain readable. Narrative and conflicting record versions remain intact. No spoilers or future evidence.

## Required Behavior
1. Earlier proved facts remain clickable when their SQL column is known; current helper recommendations remain task-bound.
2. Pinned Facts shows owned logged identifiers, names, dates, city and full narrative separately from proved facts, without duplicate field/value tokens.
3. Tokens insert escaped typed conditions at editor selection without running SQL.
4. Compatible partial/full notebook records merge by table-specific primary identifier; conflicting narratives remain separate. Shared foreign keys retain their record context.

## Acceptance Criteria
Focused tests cover old and new logged summaries, repeat details, narrative/manual-note retention, partial record merging and token insertion without progress changes. Builds, web suite and live Case 001 walkthrough pass; one existing database only. Refresh graph and check diff.

## Code Prompt
Implement the user's defect corrections, validate and update the existing preview. No audit, acceptance, commit or push.

## Audit Prompt
Check owned action projection, reference/progression separation, SQL quoting/types, old saved attempts, record merging and unchanged validators. Account for prerequisite pending work.

## Code Results
Implemented typed collectedDetails from owned log actions and query actions joined to owned proved-step evidence, read in the existing ownership-checked snapshot transaction. New log actions preserve raw/display row values; older summaries are parsed without annotations becoming authority. Manual/imported workspace notes never feed this projection. Existing progression facts/validators remain unchanged. Authored evidence columns remain available for previously earned tokens while eligibleForTask continues to scope current helper recommendations. Pinned Facts deduplicates field/value overlap and retains narrative as readable text; identifiers, names, dates and city use escaped typed insertion.

Notebook now labels record types and merges compatible partial/full entries by LogID, ReportID, PersonID or CrimeID, preserving conflicting text and personal notes. CrimeID remains under both classification and report because it is their foreign-key relationship, not duplicate evidence. This was explained to the user rather than deleting context.

Verification: 228 web tests passed; API suite passed; API/web builds passed. Expanded live Case 001 browser proof passed against the existing localhost:27077 preview, checking old fact token insertion, report city/date/description retention before manual logging, six-step resolution, saved draft and notebook layout at widths 1044 and 375. Screenshots test-results/wp304-notebook-1044.png and wp304-notebook-375.png were captured; the narrow screenshot was visually inspected. Logs outputs/wp304-web-all.log, wp304-api-all.log, wp304-api-focused.log, wp304-api-build.log, wp304-web-build.log and wp304-live-browser.log. Graph refresh/readiness and diff checks passed. Tracked generated API build output restored to its prior state.

Updated only this WP's application files in the existing preview checkout and restarted its services. Used the existing single registered database without reset, new clone or classroom changes. Existing saved log summaries and preserved proved-query actions are projected on reload. If an older proof no longer retains returned rows, rerunning/logging that evidence is needed to recover additional detail; no values are invented.

Pending independent audit and human acceptance; no commit or push. Mixed prerequisite WP-300/303 changes remain in shared files and the preview checkout and must be accounted for during audit.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
