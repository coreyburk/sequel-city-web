# WP-307: Witness note logging and visible outcomes

## Objective
Save returned witness statements as reference notes without silently failing or awarding query proof.

## Scope
Allow selected stored query candidates to be logged even when a Case 001 query task is not yet proved. Retain the separate isolated-query requirements. Catch asynchronous row logging failures, restore button state and show an actionable rejected outcome. Preserve each row's feedback when multiple notes are logged. Use record-neutral isolation wording and document the distinction.

## Impact Analysis
Required cross-module evidence/UI behavior. Graph available at HEAD 322e5e0, current with minor WP-305/306 local presentation/doc drift; source authoritative. Source shows evidence() rejecting unproved query-task notes despite its own query/log separation; QueryResultsTable awaits callback without rejection handling, leaving saving state. Stored action rows are bounded server-executed public candidates; no client row values are accepted. Selected-row log handlers retain their canonical checks and proof behavior. No validator, schema, seed or classroom change. Refresh graph after this shared control-flow correction. Preserve pending prerequisite changes.

## Files Allowed to Change
- docs/01-work-packages/WP-307-witness-note-logging-feedback.md
- docs/00-ssot/SSOT-Case-Authoring.md
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/queryAttemptFeedbackService.ts
- apps/api/src/services/queryAttemptFeedbackService.test.ts
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify: query validators, SQL/seed, dependencies, classroom data or other pending WPs. Update only changed app files in existing preview checkout; reuse the one registered database without reset.

## Constraints
Logging a query-task statement saves a note only; it does not prove identity, change task order or authorize verification. Retain ownership, revision, stored-candidate expiry and row bounds. Catch error feedback without exposing raw internal exceptions. Two interviewees do not mean two supported suspects. Both accounts can be compared; follow the steward's observation to the named person's identity and account through the existing natural chain.

## Required Behavior
1. Each returned statement can be saved as a notebook/reference detail with visible per-row confirmation.
2. Query proof still requires isolating current canonical evidence. Notes cannot bypass prerequisites.
3. Network/server logging rejection visibly explains that saving failed, clears pending state and permits retry.
4. Generic isolation feedback refers to an evidence record rather than calling interviews incidents.

## Acceptance Criteria
Live browser query returns both statements, logs both with green confirmation, shows both in Notebook/Pinned details after reload, and remains 2/6 until the steward query is isolated. Existing full progression still passes. UI rejection/retry regression and API/web tests/builds pass. Graph/diff checks pass.

## Code Prompt
Implement and validate the reported failure, update the existing preview, no audit/acceptance/commit/push.

## Audit Prompt
Check stored-row/ownership/expiry safety, no note-to-proof escalation, per-row success/error feedback and unchanged isolated query proof. Account for pending shared-file prerequisites.

## Code Results
Removed the contradictory Case 001 query-step logging gate: an owned stored returned row can be saved as a reference note before query isolation, while the existing query validators alone award query proof. Selected-row log handlers retain their canonical checks. No client row values, guessed identities or manual notes grant progress. QueryResultsTable catches callback failures, clears pending state, displays safe rejection text and allows retry. Protected Query Lab uses multi-row feedback so logging the second statement preserves the first confirmation. Isolation wording now says evidence record rather than incident. Shared authoring SSOT documents this exploration/log/proof distinction.

Validation: 229 web tests passed including rejection/retry and safe-error coverage; API suite passed including neutral isolation wording; API/web builds passed. Expanded live full-resolution browser proof passed (outputs/wp307-live-browser.log): broad interview query returned two statements, each evidence request succeeded with green per-row confirmation, both notebook and collected reference accounts survived reload, progress stayed 2/6 until isolating the steward query, and the original full six-step resolution/saved-work/layout/contrast checks still passed. Logs outputs/wp307-web-all.log, wp307-api-all.log, wp307-web-build.log, wp307-api-build.log. Generated tracked API build artifacts restored to prior state. Graph refreshed; readiness/diff checks passed.

Updated four application files in the existing preview checkout and restarted existing services. Reused the single registered database without reset or clone. Prior failed logging did not save those notes; the user must rerun the interview query and log the two rows again. Both accounts are useful to compare; the steward's named person supplies the identity lead, and a witness PersonID alone does not establish another suspect.

No independent audit, acceptance, commit or push. Existing pending shared-file prerequisites remain separate for audit scope.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
