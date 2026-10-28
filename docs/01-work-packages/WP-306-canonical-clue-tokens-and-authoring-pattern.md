# WP-306: Canonical clue tokens and authoring pattern

## Objective
Remove the redundant CrimeType insertion and capture reusable evidence presentation and clue-authoring rules.

## Scope
One canonical Murder CrimeID token; retain descriptive classification in the notebook. Collected detail insertion is limited to link/filter field families (ID, Name, City, Date); other values remain reference text. Suppress CrimeType from the drawer once CrimeID is proved, preserving the full notebook. Document shared layout, evidence authority, clue logic and review checks for future cases.

## Impact Analysis
Recommended lightweight source analysis. Graph available at HEAD 322e5e0, refreshed October 17 including pending shared API/web changes; usable with non-structural CSS/test drift from WP-305. Source confirms collectedDetails currently makes every non-narrative column clickable, which exposes CrimeType as a misleading report filter. No schema, API authority, imports or progression changes. This local UI predicate and additive authoring documentation do not require graph regeneration. Preserve pending WP-300/303/304/305 changes and their test assertions.

## Files Allowed to Change
- docs/01-work-packages/WP-306-canonical-clue-tokens-and-authoring-pattern.md
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/tests/browser/case-001-full-resolution.spec.ts
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md

Do Not Modify: API, SQL, data, proof validators, dependencies, other WPs or existing graph artifacts. Copy only updated application source to the existing preview checkout; no database reset/clone.

## Constraints
CrimeType = 'Murder' is valid against CrimeType, but is not the foreign-key filter for CrimeSceneReport. Never substitute CrimeType = 1080. Keep CrimeID = 1080. Keep useful existing link/name/city/date tokens, correct typing/escaping, full narrative, compact accessible styling and reference/proof separation.

## Required Behavior
1. Suppress redundant collected CrimeType in Pinned Facts when CrimeID is earned; notebook keeps the label.
2. Descriptive columns remain reference text rather than automatically becoming SQL buttons.
3. Document natural backward-planned clue chains, consistent non-spoiler background, short current guidance, typed canonical tokens, notebook grouping and accessibility/review requirements.

## Acceptance Criteria
Web regressions and live walkthrough demonstrate a single crime token with correct insertion, retained notebook classification and narrative reference, useful city/date tokens and no automatic SQL execution/progress. Authoring SSOT owns the rule and guide links to it with an actionable review checklist. Build and diff checks pass.

## Code Prompt
Implement the authorized correction and reusable documentation, validate and update preview. No audit, acceptance, commit or push.

## Audit Prompt
Check semantic token identity, column/value correctness, retained information, future-case documentation consistency and unchanged progression. Account for existing pending prerequisites.

## Code Results
Implemented canonical crime-token suppression and reference-default behavior for collected detail fields outside ID/Name/City/Date families. CrimeID remains typed and clickable; CrimeType is suppressed in the drawer after its ID is earned and retained in the compact notebook. No API, database or proof changes.

Added the canonical Shared clue, token and notebook pattern to SSOT-Case-Authoring, with a linked actionable review checklist in CASE-RUNTIME-AUTHORING-GUIDE. Covers backward clue design, plausible statements, natural step counts, consistent accessible background, current guidance, typed column-specific canonical tokens, retained old facts, reference/proof separation, notebook merging/relationships and contrast/resizing checks. Documentation distinguishes supported runtime behavior from authoring review requirements and does not claim automatic table-aware SQL insertion.

Validation: 228 web tests passed (outputs/wp306-web-all.log); web build passed (outputs/wp306-web-build.log). Expanded live full-resolution browser proof passed against the existing localhost:27077 preview (outputs/wp306-live-browser.log), confirming no second CrimeType token, correct CrimeID insertion, retained notebook classification, existing city/date tokens, saved work, six-step progression, contrast and narrow layouts. The first browser attempt exposed a test assertion relying on CSS-generated colon text; changed it to assert the actual label/value elements, then reran successfully. Diff check passed. No SQL reset or new clone; copied only StudentQueryLab application source to the existing preview checkout. Graph refresh deferred for this local predicate and additive documentation, with no architecture/import changes.

No independent audit, human acceptance, commit or push. Existing pending WPs remain separate; audit scope must account for prerequisite shared-file changes.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
