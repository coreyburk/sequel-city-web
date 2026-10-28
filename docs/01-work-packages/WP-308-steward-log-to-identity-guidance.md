# WP-308: Steward logging advances identity guidance

## Objective
Let selection of the canonical steward statement prove that evidence and expose the authored PersonsOfInterest direction/hint.

## Scope
Case 001 v3 current witness-account step accepts its canonical selected row from a broad query as an alternative to existing isolated query proof. Other rows remain notes. Keep the existing authored next-step direction/hint, rather than rewriting SQL metadata. Provide truthful success and query feedback; document the bounded exception.

## Impact Analysis
Required progression/security-boundary analysis. Graph refreshed after WP-307 at HEAD 322e5e0; targeted source confirms evaluateFullCase001 enforces ReportID and exact canonical steward evidence, canonical004 checks live public records, and saveCollection atomically stores facts/step proof. Reuse those boundaries for selected-row proof; no client content authority. No SQL/schema/content-version change: the target direction already says PersonsOfInterest and the hint filters PersonName. No new proof for suspect statement logging. Preserve pending prerequisites. Refresh graph after shared progression change.

## Files Allowed to Change
- docs/01-work-packages/WP-308-steward-log-to-identity-guidance.md
- docs/00-ssot/SSOT-Case-Authoring.md
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/queryAttemptFeedbackService.ts
- apps/api/src/services/queryAttemptFeedbackService.test.ts
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: SQL/data, validators, dependencies or other WPs. Copy only changed application files to existing preview checkout and restart, no reset/clone.

## Constraints
Only current canonical steward row, pinned Case 001 v3, correct report/prerequisites, live canonical equality, stored owned/nonexpired query and revision-checked transaction can create proof. Other statement alone must remain a note. Existing isolated-query proof remains supported. No automatic promotion of previously saved/manual notes, no guessed identity or early verification.

## Required Behavior
Logging the steward row from two statements earns its name fact and advances to identity guidance. Logging suspect row first does not advance; both remain notebook notes. Query/log feedback describes this dual proof path without calling every row a suspect. Existing SQL-authored next guidance/hint becomes visible immediately and survives reload.

## Acceptance Criteria
Live walkthrough logs non-steward first and remains 2/6, then logs steward and reaches 3/6; name token, PersonsOfInterest direction and PersonName hint are present. Both notes persist and normal completion still passes. API/web tests/builds and graph/diff checks pass.

## Code Prompt
Implement authorized correction and validate on existing preview. No audit/acceptance/commit/push.

## Audit Prompt
Challenge selected-row authority, prerequisite/current-step/ownership/expiry/revision guards, canonical evidence, unchanged other steps and truthful feedback. Account for pending prerequisite changes.

## Code Results
Implemented a bounded selected-row steward adapter in the existing evidence transaction. It requires pinned Case 001 v3, current witness-account step matching the stored query step, existing report fact, exact steward evidence, live canonical InterviewLog equality, authored fact validation and the existing owned/revision/expiry checks. The adapter records the same earned name and step proof through saveCollection. Other rows remain notes and cannot complete witness or later steps. Existing isolated-query evaluation is unchanged. Broad valid statement results now explain selected-account proof instead of insisting on one row; logging feedback no longer claims that it can never advance this step.

No content/database adjustment was necessary: the seeded suspect-identity direction already names PersonsOfInterest and its hint says to filter PersonName with the full name proved in the account. Advancing proof now exposes that direction and hint immediately. Shared SSOT documents the bounded exception superseding the earlier query-only rule for this step.

Validation: 229 web tests and API suite passed, API/web builds passed. Focused query-feedback regression passed after its addition. Expanded live full-resolution browser proof passed (outputs/wp308-live-browser.log): broad query returned both accounts; logging non-steward first left progress 2/6, logging steward next moved to 3/6, both per-row confirmations remained, PersonsOfInterest direction/PersonName hint appeared, notes and proof persisted after reload, and full identity/interview/resolution, saved-work, layout and contrast checks passed. Logs outputs/wp308-web-all.log, wp308-api-all.log, wp308-web-build.log, wp308-api-build.log and wp308-feedback.log. Tracked generated API output restored to prior state. Graph refreshed; readiness/diff checks passed.

Updated three application files in existing preview checkout and restarted services, retaining the same registered database and saved work. No clone, reset, direct database edit or classroom change. Existing saved notes are not auto-promoted; rerun the report-linked interview query and log the steward row again to earn the transition.

No independent audit, human acceptance, commit or push. Pending shared-file prerequisite changes must be accounted for during audit.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
