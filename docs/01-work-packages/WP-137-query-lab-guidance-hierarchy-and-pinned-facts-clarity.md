# WP-137: Query Lab Guidance Hierarchy and Pinned Facts Clarity

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-27

## Objective

Tighten the student Query Lab UX so the current next step is visually unambiguous, the `Case File > Pinned Facts` drawer behaves like a dependable reference tool, and token insertion cues are easier to understand during multi-step mastermind work.

## Why This WP Exists

A code-driven walkthrough of the current student flow surfaced a cluster of UI/UX inconsistencies in the same interaction area:

- the Query Lab can show too many guidance surfaces at once (`studentInstruction`, `studentFailureGuidance`, evidence feedback, reinforcement, and Samuel reaction), which makes the current action hierarchy feel unstable
- the `Case File` drawer auto-closes on focus or click in the main work area, which makes cross-referencing facts while editing SQL feel brittle instead of supportive
- the mastermind transcript clue-harvesting loop still breaks flow when students are forced away from the active `InterviewLog` result or have to rebuild the same transcript query just to keep using `Log Clue`
- `Pinned Facts` now expose better token granularity, but the visual presentation still compresses complex clues into pill-shaped rows that do not scale cleanly for multi-line evidence or multi-token entries
- token buttons in `Pinned Facts` expose only field labels, so repeated labels like `PersonID`, `LicenseID`, or `EventID` can feel ambiguous when several clues are pinned
- at least one token-source label path shows mojibake (`Ã‚Â·`) instead of a clean separator, which weakens perceived quality in a high-use surface

This should be handled as one coherent Query Lab UX pass rather than as scattered micro-fixes.

## Scope

### In Scope

- simplify Query Lab message hierarchy so students can always tell:
  - what the current step is
  - what went wrong, if anything
  - what concrete follow-up action to take next
- keep active clue-harvesting results usable when the student needs to log several clues from the same query result
- refine `Case File` drawer behavior so reference material stays available long enough to be useful during query construction
- redesign `Pinned Facts` row layout for multi-line notes and multi-token evidence
- make token actions clearer by showing both field meaning and inserted value context where needed
- remove visible text encoding artifacts from query-assist labels
- add regression coverage for drawer behavior, token labeling, guidance precedence, and repeated clue collection from the same result set

### Out of Scope

- changing the core investigation progression logic or accepted case answers
- adding new database tables, backend endpoints, or schema metadata
- redesigning Samuel's overall visual identity or the full Evidence Board notebook system
- rewriting the entire Query Runner interaction model

## Files Allowed to Change

Allowed:

- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-137-query-lab-guidance-hierarchy-and-pinned-facts-clarity.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `package-lock.json`

## Constraints

- preserve the current noir visual language and existing student progression structure
- do not regress the recent fixes that keep scene changes tied to query execution rather than SQL drafting
- keep mastermind and suspect references data-driven; do not introduce fresh hard-coded answer names
- improve clarity without turning the Query Lab into a dense developer console
- prefer one primary next-step message over multiple competing guidance blocks whenever the student is in the main happy path

## Required Behavior

- the Query Lab must present a clear message hierarchy with one primary instructional message and only the minimum supporting feedback needed for the current state
- when a student is collecting multiple mastermind clues from the same transcript result, the app must keep that result usable until the intended chapter handoff actually occurs
- the `Case File` drawer must not feel like it disappears accidentally while the student is still referencing pinned evidence to build a query
- `Pinned Facts` entries with multiple usable values must present those values in a way that makes the inserted query fragment obvious before the student clicks
- repeated token types such as `PersonID`, `LicenseID`, `EventPersonID`, and `EventID` must be distinguishable in context
- token-source labels and UI separators must render cleanly with no mojibake or malformed punctuation

## Acceptance Criteria

- [x] Query Lab no longer stacks stale or competing guidance in a way that obscures the current next step
- [x] Repeated mastermind clue collection does not force the student to bounce between views or rerun the same transcript query just to keep `Log Clue` available
- [x] `Case File` behaves like a stable reference drawer during query construction
- [x] `Pinned Facts` remain readable for multi-line and multi-token evidence entries
- [x] Token actions communicate enough value context that students can tell which fragment will be inserted
- [x] UI text and token-source labels render cleanly with no encoding artifacts
- [x] Regression coverage exists for the updated Query Lab guidance and pinned-fact interactions

## Recommended Implementation Direction

- establish an explicit precedence model for Query Lab support copy:
  - primary step instruction
  - transient error or correction feedback
  - optional reinforcement, only when it adds information that the primary instruction does not already cover
- preserve active transcript and result context during repeated clue harvesting unless a true chapter transition requires a reset
- review whether `studentFailureGuidance`, reinforcement, and Samuel reaction should all render simultaneously, or whether some should collapse into one shared support panel
- change the `Case File` close behavior from implicit blur-style dismissal to a more deliberate close rule
- restyle `Pinned Facts` entries from single pill rows into compact stacked evidence cards or split rows that can handle:
  - long note text
  - multiple token chips
  - highlighted state
  - clear separation between evidence summary and insertable query fragments
- adjust token button labels so ambiguous fields include enough nearby value context to be understandable at a glance
- normalize query-assist source labels to use clean ASCII separators

## Code Prompt

Implement WP-137 exactly as scoped.

Requirements:

- improve Query Lab message hierarchy instead of adding more parallel guidance copy
- keep repeated mastermind clue harvesting inside a stable working loop
- make `Case File > Pinned Facts` feel dependable during query editing
- increase clarity of multi-token evidence actions without regressing the existing clue-to-query workflow
- preserve recent progression and scene-state fixes

Return:

- exact files changed
- summary of the Query Lab UX improvements
- verification performed

## Audit Prompt

Audit WP-137 for Query Lab clarity, pinned-fact usability, and interaction consistency.

Verify:

1. The current next step is visually clear without multiple competing guidance blocks.
2. Repeated mastermind clue collection stays in a stable working loop without forcing the student to rerun the same transcript query.
3. The `Case File` drawer behaves predictably while the student references facts during SQL editing.
4. Multi-token pinned facts are readable and their token actions are understandable before insertion.
5. No mojibake or malformed separators remain in token-source or assist labels.
6. The implementation stays within frontend scope and does not regress recent student-flow fixes.

## Code Results

Implemented a focused Query Lab UX pass across the student workbench:

- `QueryRunner.tsx` now applies a stricter support-copy precedence so evidence feedback wins over reinforcement, and reinforcement wins over Samuel reaction. This reduces stacked, competing guidance in the happy path.
- `useStudentCaseState.ts` now keeps the student in `Query Lab` while they are still harvesting mastermind transcript clues from the same `InterviewLog` result. The result stays reusable until the full mastermind profile is complete, at which point the intentional chapter handoff still occurs.
- `StudentWorkbenchView.tsx` no longer auto-closes `Case File` when the student clicks or refocuses the main workspace. The drawer stays open until the student explicitly closes it.
- `StudentWorkbenchView.tsx` also now exposes clearer pinned-fact token actions by showing both the token label and a value preview, and normalizes query-assist source labels to clean ASCII separators.
- `styles.css` restyles pinned-fact rows into compact stacked evidence cards that hold multi-line clue detail and multiple insertable token actions more cleanly than the prior pill-row layout.
- `App.test.tsx` covers the updated drawer behavior, token preview/source labeling, and the repeated mastermind-clue collection loop that stays active without rerunning the transcript query.

## Audit Results

I have completed the audit of **WP-137: Query Lab Guidance Hierarchy and Pinned Facts Clarity**. My investigation confirms that all objectives have been successfully implemented according to the work package specifications.

### Audit Summary: **PASS**

1.  **Guidance Hierarchy Clarity**: The precedence logic in `QueryRunner.tsx` ensures that the most relevant message (Evidence Feedback) takes priority over reinforcement or Samuel's reactions, preventing visual noise and competing instructions.
2.  **Mastermind Clue Stability**: The mastermind clue collection loop in `useStudentCaseState.ts` correctly keeps the student in the Query Lab and preserves active results until the entire profile is logged, allowing for a stable "harvesting" workflow.
3.  **Predictable Case File Drawer**: The drawer in `StudentWorkbenchView.tsx` has been refactored to be `sticky` on desktop and no longer auto-closes on focus changes, making it a dependable reference during SQL editing.
4.  **Pinned-Fact Usability**: `getPinnedFactAssistTokens` now correctly decomposes complex facts (like mastermind candidates) into discrete, understandable tokens. Labels and values are clearly presented before insertion.
5.  **Label Normalization**: Mojibake (encoding artifacts like `├é┬╖`) has been removed and separators have been normalized to clean ASCII ` - ` in both the view and state management layers.
6.  **Implementation Integrity**: All changes remain within the frontend scope as defined in the work package and do not regress existing student-flow or scene-management fixes.

**Verification Results:**
- All manual code inspections passed.
- Regression coverage for drawer behavior, token labeling, and mastermind collection was verified via project test records (88 tests passed).

WP-137 is verified and ready for final decision.

## Verification

- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryRunner.test.tsx`
- Result: `88 passed`

## Final Decision

Accepted

