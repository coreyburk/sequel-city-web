# student-relevant-leads-only

## Objective

Reduce Student Mode information overload by only showing leads and Samuel state information that are currently relevant to the student's earned evidence.

## Background

After the student logs the target murder report, the Evidence Board currently shows future leads such as `Gym Lead` before the student has any witness context. The Samuel avatar/state can also read as a breakthrough while the text describes a hand-off, which makes the moment feel inconsistent.

The intended behavior is:

- no locked future lead cards before they are earned
- after the report row is proven, unlock witness discovery without revealing specific witness facts before the student finds them
- do not show the gym lead until witness work is complete
- align Samuel's avatar label, image, and message with the same gameplay state

## Scope

In scope:

- Student Mode Samuel avatar/state alignment after clue logging
- Evidence Board lead card visibility rules
- available-lead messaging
- staged report-filter guidance for the murder-only filter before the SQL City filter
- Samuel case briefing copy in the support accordion
- query-result restoration when students return from Evidence Board to Query Lab
- post-report `InterviewLog` query hinting
- frontend test/build verification
- work package documentation

Out of scope:

- backend/API changes
- database changes
- package/build configuration changes
- new gameplay stages
- runtime AI behavior
- image generation or asset replacement

## Files Allowed to Change

- `docs/01-work-packages/WP-072-student-relevant-leads-only.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/styles.css`

Only change additional frontend files if directly required by verification.

## Requirements

- Samuel's visual label, avatar image, and message must describe the same state.
- After the report row is logged, Samuel should communicate that witness discovery is unlocked.
- Future leads must not be displayed as locked previews before the student has context for them.
- `Gym Lead` must remain hidden until witness evidence is complete.
- Specific witness names, addresses, or lead details must not be revealed before the student discovers them in database results.
- Empty lead-board states should guide the student back to the current task instead of exposing future work.
- The guided report query should first filter by `CrimeID = 1080`, then use feedback to introduce `AND ReportCity = 'SQL City'`.
- The student should only be prompted to log the target report after the SQL City filter is applied, then review the remaining rows for the January 15th, 2023 report.
- The support accordion should present Samuel's case briefing rather than a generic full-story recap.
- Samuel's visible current lead should include the same known case setup from the briefing.
- Returning to Query Lab after logging the report row should preserve/re-display the prior report result so students can inspect it again.
- The next draft query should point students to `InterviewLog` with the proven `ReportID = 10975`.
- Querying `InterviewLog` by report ID alone must not automatically complete the witness milestone before students connect people/address evidence.
- Existing evidence validation and query behavior must remain deterministic.

## Acceptance Criteria

- The Evidence Board does not show `Gym Lead` immediately after the target murder report is logged.
- The Evidence Board shows a witness-discovery lead after the target murder report is logged without revealing specific witness facts.
- The Evidence Board does not show locked witness placeholders before the report row is proven.
- Samuel's post-report visual state uses the lead-unlocked avatar/label and witness-trail copy.
- Samuel's third guided SQL draft starts with the murder-only filter.
- The ReportCity filter is introduced by post-query feedback after the murder-only query returns too many rows.
- The support accordion reads as Samuel's case briefing.
- Samuel's Current Lead includes the known starting case facts.
- Returning to Query Lab after the report row is logged restores the last report result and preloads an `InterviewLog` query using `ReportID = 10975`.
- Querying `InterviewLog` by report ID alone does not automatically complete the witness milestone.
- Existing tests pass.
- Vite production build passes or unrelated blockers are documented.
- No backend, database, package, build, script, or runtime AI changes are introduced.

## Codex Results

Implemented relevant-leads-only behavior.

- Added the `avatar-samuel-lead-unlocked.png` state to Samuel's visual state mapping.
- Changed the post-report state from `Breakthrough`/hand-off language to `Lead Unlocked`/witness-trail language.
- Removed locked future lead cards from the Evidence Board.
- Limited the milestone checklist to completed milestones plus the single current next milestone.
- Limited lead-board cards to:
  - no cards before the report row is proven
  - a witness-discovery lead after the report row is proven
  - gym lead only after witness evidence is complete
- Added an empty lead-board message that redirects attention to the current instruction.
- Restored the third guided SQL draft to `WHERE CrimeID = 1080` so the ReportCity filter is not introduced before the student sees the need.
- Added post-query feedback after the murder-only report filter to guide students to add `AND ReportCity = 'SQL City'`.
- Delayed the report-row evidence prompt until the SQL City filter has been applied, then asks students to find the January 15th, 2023 report.
- Treated murder-only and broad report feedback as Samuel filter guidance rather than logged evidence, so students do not see a false "pinned clue" signal before the actual report row is proven.
- Replaced the generic `Full Story Recap` support section with `Samuel's Case Briefing` content and added that same known case setup to Samuel's visible current-lead briefing.
- Removed the automatic reveal of specific witness lead details after the report row is logged; the board now directs students to discover witness names and addresses from report/interview data before pinning them.
- Preserved the last student query result when moving between Query Lab and Evidence Board so students can return and re-read the proven report row.
- Added a post-report draft query for `InterviewLog` using `ReportID = 10975` so the witness trail has a concrete next investigation path.
- Tightened automatic witness milestone detection so simply querying `InterviewLog` by report ID does not complete the witness step before students connect people/address evidence.
- Addressed Gemini audit recommendations by changing the case header to `The SQL City Murder`, removing the unused case description field, and expanding test coverage for `Gym Lead` appearing after witness evidence is complete.
- Updated tests to assert that future gym information is withheld until relevant.
- Updated tests for the two-step report filter sequence and Samuel case briefing support copy.
- Updated tests for restored query results and the post-report `InterviewLog` hint.
- Preserved deterministic evidence validation and frontend-only scope.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 31 tests.
- `npx vite build` from `apps/web` passed; Vite reported existing deprecation warnings for `esbuild` and `optimizeDeps.esbuildOptions`.
- Generated Vite build outputs were removed after verification.

## Gemini Audit Prompt

Please audit WP-072 for the Sequel City Web student detective experience.

Focus on whether the implementation satisfies the intended learning and UX flow:

1. The opening Samuel briefing should include the known case setup: a murder occurred in Sequel City on January 15th, 2023, and students must build from known case facts rather than receive suspects or later leads.
2. The guided SQL progression should be staged:
   - start with `CrimeType` to prove Murder maps to `CrimeID = 1080`
   - inspect `CrimeSceneReport`
   - filter first by `CrimeID = 1080`
   - only after that result is still too broad, introduce `AND ReportCity = 'SQL City'`
   - then have students find/log the January 15th, 2023 report row
3. Intermediate query feedback should not look like a logged/pinned evidence clue unless the student actually logs a valid evidence row.
4. After the target report row is logged, the UI should not reveal specific witness names or addresses automatically. It should unlock a witness-discovery task that tells students to inspect report details and interview records.
5. Returning to Query Lab after the report row is logged should preserve/re-display the prior report result and preload an `InterviewLog` query using `ReportID = 10975`.
6. Querying `InterviewLog` by report ID alone should not automatically complete the witness milestone; students should still need to connect the interview/person/address evidence.
7. Future leads, especially `Gym Lead`, should stay hidden until relevant.
8. Samuel's visual state, label, and copy should remain consistent with the current gameplay state.

Please identify:

- Any acceptance criteria that are not met.
- Any UX regressions or remaining information-overload issues.
- Any places where the student still receives unearned evidence.
- Any tests that should be added or adjusted.
- Whether the WP documentation accurately reflects the implemented behavior.

## Gemini Audit Results

The audit of **WP-072: Student Relevant Leads Only** is complete. The implementation successfully addresses the goal of reducing information overload and aligning the student detective experience with the intended learning flow.

### Audit Findings

1.  **Opening Samuel Briefing:** **Satisfied.**
    The implementation uses `SAMUEL_CASE_BRIEFING` which explicitly includes the case setup: a murder in Sequel City on January 15th, 2023. This briefing is correctly displayed in both the initial "Samuel's Current Lead" view and the "Samuel's Case Briefing" support accordion.

2.  **Guided SQL Progression:** **Satisfied.**
    The progression is strictly staged through `SAMUEL_TUPLETON_STEPS`:
    *   **Step 1:** Prove Murder maps to `CrimeID = 1080`.
    *   **Step 2:** Inspect `CrimeSceneReport` fields.
    *   **Step 3:** Filter by `CrimeID = 1080`.
    *   **Stage 3b (Feedback-driven):** Guidance introduces `AND ReportCity = 'SQL City'` only after the broad murder query returns too many results.
    *   **Final Step:** Students find and log the specific report row for January 15th, 2023.

3.  **Clue Feedback vs. Pinned Evidence:** **Satisfied.**
    Intermediate query feedback (e.g., "Murder reports isolated, but the pile is still too large") is displayed as "Clue Feedback" in the HUD. It does not trigger the "Log Clue" prompt and is not added to the pinned facts, maintaining a clear distinction between guidance and earned evidence.

4.  **Witness Discovery Task:** **Satisfied.**
    After the report row is logged, the UI does not reveal witness names or addresses. Instead, it unlocks a "Witness Discovery" lead on the board that directs students to inspect `InterviewLog` with `ReportID = 10975`.

5.  **State Preservation & Preloading:** **Satisfied.**
    Returning to the Query Lab from the Evidence Board successfully restores the last query result (via `restoredExecution`). The draft query is correctly preloaded with the `InterviewLog` hint using the proven report ID.

6.  **Milestone Detection:** **Satisfied.**
    The `witness-clues` milestone `matches` logic requires the presence of `interviewlog`, `personsofinterest`, and `personid`. This ensures that simply querying the interview log by ID does not complete the milestone until the student performs the necessary joins/connections.

7.  **Future Lead Gating:** **Satisfied.**
    The `Gym Lead` is programmatically hidden in `getLeadBoardCards` until the `witness-clues` milestone is completed. No "locked" previews of future leads are shown.

8.  **Samuel UI Consistency:** **Satisfied.**
    Samuel's visual state transitions to `lead-unlocked` (using the new avatar and "Lead Unlocked" label) as soon as the report is proven, and his reaction copy correctly describes the transition to the witness trail.

### Observations & Recommendations

*   **Case Name Immersion:** `CASE_004_BRIEF.caseName` is currently set to `"SELECT * FROM Suspects"`. While it matches the technical theme, changing it to `"The SQL City Murder"` (as suggested in some documentation) would improve narrative immersion.
*   **Unused Data:** `CASE_004_BRIEF.description` is defined but unused. This should be cleaned up or merged into the briefing data to avoid confusion.
*   **Test Expansion:** While `App.test.tsx` successfully verifies that `Gym Lead` is hidden initially, adding a positive test case to verify its appearance after the witness milestone is met would further strengthen the suite.

### Final Assessment
**WP-072 documentation accurately reflects the implemented behavior.** The implementation meets all acceptance criteria and effectively removes information-overload issues present in earlier versions.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.
(node:10280) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)

## Final Decision

Accepted.

Gemini audit found all acceptance criteria satisfied. The three non-blocking recommendations were addressed before commit: narrative case naming, unused case description cleanup, and positive `Gym Lead` reveal test coverage. Verification passed after those updates.

