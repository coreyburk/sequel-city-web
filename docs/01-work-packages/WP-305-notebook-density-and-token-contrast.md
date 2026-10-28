# WP-305: Notebook density and token contrast

## Objective
Fix dark-on-dark pinned token text and reduce unnecessary notebook line breaks.

## Scope
CSS-only product correction: consistent pinned token colors across normal, hover and keyboard focus; inline field labels/values, tighter record spacing and naturally wrapping full narratives. Add visual browser assertions to the existing live walkthrough.

## Impact Analysis
Optional Understand analysis: isolated presentation polish, no imports, architecture, schema or progression changes. Graph available/current at HEAD 322e5e0, refreshed October 17 with pending source. Source identifies .evidence-snapshot-detail hardcoded brown overriding the token's cream text, and block dt/dd plus large gaps causing excessive notebook height. No graph refresh required for this local CSS/test change; preserve existing graph artifacts and pending WP-303/304 changes. Verify the actual preview at wide/narrow widths.

## Files Allowed to Change
- docs/01-work-packages/WP-305-notebook-density-and-token-contrast.md
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-full-resolution.spec.ts

Do Not Modify: API, SQL/data, progression, dependencies, other pending WPs. Copy only CSS to the existing preview checkout; no new database or reset.

## Constraints
Retain all text and clickable behavior, wrapping, keyboard focus visibility and record relationships. Preserve existing notebook grouping/duplicate handling. No new UI abstraction.

## Required Behavior
1. Pinned tokens and nested labels have readable light text on solid dark backgrounds in all interaction states.
2. Notebook displays Label: value on one line when space permits, wrapping long narrative without horizontal overflow.
3. Reduce excess inter-field and record spacing without merging distinct records.

## Acceptance Criteria
Live browser proof checks computed token contrast (at least 4.5:1) and nested-label inheritance, normal/hover/focus, inline notebook layout and no overflow at widths 1044/375. Capture and inspect screenshots. Existing full Case 001 walkthrough passes. Diff checks pass.

## Code Prompt
Implement the requested visual correction, verify it and update the existing preview. No audit, acceptance, commit or push.

## Audit Prompt
Review contrast, focus, density, wrapping and preservation of full evidence text and token behavior. Account for pending prerequisite changes.

## Code Results
Implemented inline Label: value notebook fields, reduced field/record gaps and kept full wrapping narratives. Pinned token buttons now use solid dark backgrounds and cream foreground text; nested proved-fact labels inherit that color. Hover and keyboard focus preserve contrast with a visible focus outline.

Validation: expanded existing live Case 001 browser proof passed (outputs/wp305-live-browser.log), including computed contrast >=4.5:1 and nested text inheritance in normal/hover/focus, actual SQL token insertion, inline label/value geometry and no notebook overflow at 1044/375 widths. Screenshots test-results/wp305-pinned-facts.png and wp305-notebook-1044.png were visually inspected; wp305-notebook-375.png also captured. Full live mystery progression and saved draft checks remain in that proof. Diff check passed. No build/unit rerun for this CSS-only product change; browser proof exercises the rendered result. No graph refresh for isolated presentation polish.

Copied only CSS into existing preview checkout; Vite applied the update. Existing single database and saved work retained. No independent audit, acceptance, commit or push.

## Audit Results
Pending independent audit.


### Integrated catch-up review (2026-10-28)

Reviewed together with the overlapping implementation under WP-312. Independent AntiGravity integration and supplemental reviews returned PASS; full combined verification is recorded in [WP-312](WP-312-integrated-runtime-backlog-closeout.md). This is an integrated audit, not a separate audit of this WP in isolation. Earlier development and failed-run records remain historical evidence. Human acceptance is recorded in Final Decision below through the accepted WP-312 batch; commit/push follows the project helper.

## Final Decision
Accepted. On 2026-10-28 the human selected option 1, "Accept WP-312; commit and push", after reviewing the integrated and supplemental independent AntiGravity PASS results and completed validation. Accepted as part of the WP-312 integrated batch; no separate individual audit is claimed.
