# student-query-autonomy-transition

## Objective

Help students transition from Samuel's guided on-ramp query examples to writing their own investigative SQL by replacing post-on-ramp example-query dependence with clear mission prompts, clue-gathering guidance, and notebook documentation expectations.

## Background

Recent work packages significantly reduced Student Mode information overload:

- WP-067 through WP-070 simplified navigation around Samuel, Query Lab, and Evidence Board.
- WP-071 improved query-result visibility after execution.
- WP-072 gated future leads, staged the report-filter sequence, restored prior query results, and converted the witness handoff into a discovery task instead of revealing witness facts.

The current on-ramp now does useful training:

- query `CrimeType` to prove `Murder = CrimeID 1080`
- inspect `CrimeSceneReport`
- filter by `CrimeID = 1080`
- add `ReportCity = 'SQL City'` only after the murder-only result remains too broad
- find and log the January 15th, 2023 report row

That on-ramp should remain unchanged. It teaches the process: inspect data, narrow with evidence, log only proven facts, and use notebook entries to advance.

The next UX problem begins after the report row is proven. Students need to move from "Samuel gives an example query" toward "Samuel gives an investigative objective." The interface should still support students, but the support should shift from complete SQL drafts to:

- what question to answer
- which table or relationship may help
- what evidence should be captured
- what a good notebook entry looks like
- how to recover if the query returns too many, too few, or irrelevant rows

## Highest-ROI Recommendation

Create a post-on-ramp "Query Autonomy Bridge" starting at the Witness Discovery stage.

This is the highest-ROI improvement because it targets the first moment where students should begin practicing independent SQL construction. It avoids disrupting the successful on-ramp while preventing the rest of the case from becoming a sequence of copied example queries.

## Scope

In scope:

- Preserve all existing on-ramp example queries and staged guidance through the target murder report row.
- Add a clear transition state after the report row is proven that tells students they are now expected to write the next query.
- Replace post-on-ramp complete SQL drafts with query goals, table/relationship hints, and evidence-capture expectations.
- Improve Samuel's witness-discovery guidance so it explains how to inspect report details, `InterviewLog`, and person/address data without giving away the full query.
- Improve Evidence Notebook guidance so students know what to document before the next lead unlocks.
- Add UX copy/tests that verify complete example queries stop after the on-ramp and guidance becomes objective-based.
- Keep future leads hidden until earned.
- Work package documentation and audit prompt.

Out of scope:

- Changing the existing CrimeType / CrimeSceneReport / CrimeID / ReportCity on-ramp examples.
- Changing the database schema or seed data.
- Backend/API changes.
- Runtime AI behavior.
- New artwork generation.
- Full redesign of Query Runner, Evidence Board, or notebook layout beyond the autonomy bridge copy and state behavior.

## Files Allowed to Change

- `docs/01-work-packages/WP-073-student-query-autonomy-transition.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/styles.css`

Only change additional frontend files if directly required by verification.

## Requirements

- Do not change the current on-ramp example queries or the staged report-filter sequence.
- After the target report row is logged, the next student task should be framed as an investigation goal, not as a complete copy/paste query.
- Students should still be able to review the restored target report result after returning to Query Lab.
- The Query Lab should distinguish between:
  - "Samuel's draft query" during the on-ramp
  - "Samuel's investigation brief" after the on-ramp
- The witness-discovery brief should provide good hints without giving the full SQL:
  - point students toward `InterviewLog`
  - explain that `ReportID` connects the report to interview records
  - explain that `PersonID` connects interview records to person/address data
  - ask students to identify what they need to prove before logging witness evidence
- The Evidence Notebook should guide students to document earned witness facts, such as:
  - the report row that started the witness trail
  - which table produced each witness clue
  - the witness identifier or address only after it appears in query results
  - any uncertainty that still needs another query
- The UI should not reveal specific witness names or addresses before the student finds them in data.
- The UI should not reveal `Gym Lead` until witness evidence is complete.
- The system should avoid advancing the witness milestone from a single `InterviewLog` lookup unless the student also connects person/address evidence.
- Tests should cover the autonomy transition and future-lead gating.

## Recommended Design

### 1. Keep The On-Ramp As "Training Wheels"

Leave the current Samuel on-ramp unchanged. The first three breadcrumbs can continue to provide complete starter SQL because they teach the investigative loop.

Expected on-ramp behavior remains:

- Samuel gives the first `CrimeType` query.
- Samuel guides the broad `CrimeSceneReport` inspection.
- Samuel guides the murder-only filter.
- Samuel introduces the SQL City filter only after students see the murder-only result is still too broad.
- Students log the target report row only after finding the January 15th, 2023 SQL City murder report.

### 2. Introduce A Clear "Training Wheels Off" Moment

After the target report row is logged, Samuel should explicitly mark the transition:

> "You've learned the pattern. From here, I won't hand you the full query. I'll tell you what the evidence needs to prove, and you write the SQL that proves it."

This should be visible in the mentor strip and/or the Query Lab current-action card.

### 3. Replace The Post-Report Draft Query With An Investigation Brief

Current WP-072 behavior preloads:

```sql
SELECT *
FROM InterviewLog
WHERE ReportID = 10975
```

For WP-073, keep `ReportID = 10975` as a clue in the notebook and guidance, but stop preloading the full query after the on-ramp.

Recommended post-report brief:

- Question: "Which interview records are tied to ReportID 10975?"
- Helpful table: `InterviewLog`
- Relationship clue: "`InterviewLog.ReportID` connects interviews to crime scene reports."
- Evidence to capture: "Log the interview row or PersonID only after it appears in your results."
- If too many rows: "Filter by the proven report ID."
- If you have PersonID: "Use person/address data to prove who the witness is."

### 4. Add Notebook Evidence Contracts

For each post-on-ramp lead, show a concise "Evidence Contract" near the notebook:

- "Before Samuel advances, your notebook needs..."
- "A query result that ties the clue to a table."
- "A specific value copied from data, not from Samuel's hint."
- "A note explaining what the value proves."

For Witness Discovery, the notebook contract should avoid naming the witnesses directly.

Example:

- "ReportID that started the witness trail."
- "InterviewLog row tied to that report."
- "PersonID from the interview row."
- "Person/address fact found through your own query."

### 5. Improve Query Recovery Guidance

Instead of another example query, Samuel should help students debug their own query:

- "Too many rows? Add a filter using a fact in your notebook."
- "No rows? Check spelling, table name, and whether the value belongs in this table."
- "Interesting row? Ask what column connects this row to the next table."
- "Before logging a clue, be able to say: table, column, value, and what it proves."

This supports learning without giving away the answer.

### 6. Update Tests Around The Autonomy Boundary

Add or update tests to verify:

- On-ramp draft queries still appear unchanged.
- After the report row is logged, Query Lab does not preload a complete `SELECT * FROM InterviewLog WHERE ReportID = 10975` query.
- After the report row is logged, Query Lab shows an investigation brief mentioning `InterviewLog`, `ReportID`, and evidence expectations.
- The restored report result still appears when returning to Query Lab.
- Witness names/addresses remain hidden until earned.
- `Gym Lead` remains hidden until witness evidence is complete.

## Acceptance Criteria

- Existing on-ramp query examples remain unchanged.
- The post-report Witness Discovery stage no longer relies on a complete preloaded SQL query.
- Samuel clearly tells students that they are transitioning from guided examples to writing their own queries.
- Query Lab provides objective-based guidance for witness discovery.
- Evidence Notebook provides a concise evidence contract for what students should document.
- Restored report results remain available after returning to Query Lab.
- Specific witness names/addresses remain hidden until discovered through data.
- `Gym Lead` remains hidden until witness evidence is complete.
- Tests cover the on-ramp preservation and post-on-ramp autonomy transition.
- Vite production build passes or unrelated blockers are documented.
- No backend, database, package, build, script, runtime AI, or artwork changes are introduced.

## Codex Prompt

Implement WP-073.

Preserve the current on-ramp examples exactly. Do not alter the staged CrimeType, CrimeSceneReport, murder-only, or SQL City report-filter query flow.

Focus only on the transition after the target report row is logged:

- Stop giving a complete post-report `InterviewLog` draft query.
- Replace it with a clear investigation brief that gives the student a goal, table/relationship hints, and evidence documentation expectations.
- Keep the restored prior report result available when students return to Query Lab.
- Add notebook guidance that tells students what facts they must document before Samuel advances.
- Keep witness names, addresses, and `Gym Lead` hidden until earned.
- Add or update tests for the autonomy transition.
- Run `npm run test --workspace apps/web`.
- Run `npx vite build` from `apps/web`.
- Remove generated Vite build outputs after verification.
- Update this work package with Codex Results and verification.

## Gemini Audit Prompt

Please audit WP-073 for the Sequel City Web student detective experience.

Focus on whether the implementation creates a smooth transition from guided query examples to student-authored SQL without changing the existing on-ramp examples.

Audit questions:

1. Are the existing on-ramp query examples preserved through the target murder report row?
2. After the target report row is logged, does the UI stop providing complete copy/paste SQL and instead provide an investigation brief?
3. Does the brief give enough support without giving away the full query?
4. Does the student still have access to the restored report result when returning to Query Lab?
5. Does the notebook tell students what evidence they need to document before advancing?
6. Are witness names and addresses still hidden until discovered through query results?
7. Does `Gym Lead` remain hidden until witness evidence is complete?
8. Are tests updated to protect both the on-ramp and the autonomy transition?
9. Did the implementation avoid backend, database, runtime AI, package, script, and artwork changes?

Please identify:

- unmet acceptance criteria
- remaining information-overload issues
- places where the UI still gives too much SQL or too much evidence
- places where guidance may be too vague for students
- missing tests or documentation drift

## Codex Results

Implemented the post-on-ramp Query Autonomy Bridge.

- Preserved the existing on-ramp query examples through `CrimeType`, broad `CrimeSceneReport`, murder-only filtering, SQL City filtering, and target report-row logging.
- Removed the complete post-report `InterviewLog` draft query.
- Changed the post-report transition so the query editor is cleared while the prior report result remains restored for review.
- Added Samuel's Investigation Brief in Query Lab after the target report row is logged.
- Added objective-based guidance for the witness stage:
  - question to answer
  - helpful table
  - `ReportID` relationship clue
  - `PersonID` relationship clue
  - evidence standard before logging a clue
- Added a Witness Evidence Contract to the Evidence Notebook after the report row is proven.
- Updated Samuel and Evidence Board copy so students are told to write their own `InterviewLog` query instead of copying a full example.
- Kept witness names, witness addresses, and `Gym Lead` hidden until earned.
- Kept witness milestone gating dependent on connecting `InterviewLog`, `PersonsOfInterest`, and `PersonID`.
- Updated `QueryRunner` so a `null` student draft intentionally clears the SQL editor while preserving restored results.
- Updated tests for:
  - on-ramp preservation
  - no complete post-report `InterviewLog` SQL draft
  - restored report result availability
  - investigation brief content
  - notebook evidence contract
  - future-lead gating through the witness milestone

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 31 tests.
- `npx vite build` from `apps/web` passed; Vite reported existing deprecation warnings for `esbuild` and `optimizeDeps.esbuildOptions`.
- Generated Vite build outputs were removed after verification.

Post-audit updates:

- Defined the missing student-theme CSS variables used by the Investigation Brief so the panel and label colors resolve correctly.
- Tightened witness milestone advancement so `witness-clues` does not unlock from the joined query alone; students must also add a witness-related notebook entry after running the joined witness evidence query.
- Updated the autonomy transition test to verify `Gym Lead` remains hidden after the witness join until a notebook witness fact is logged.

Post-audit verification:

- `npm run test --workspace apps/web` passed: 7 test files, 31 tests.
- `npx vite build` from `apps/web` passed; Vite reported existing deprecation warnings for `esbuild` and `optimizeDeps.esbuildOptions`.
- Generated Vite build outputs were removed after verification.

## Gemini Audit Results

I have completed the audit of WP-073 (Student Query Autonomy Transition).

### Audit Summary

The implementation successfully creates the "Training Wheels Off" moment for students. It preserves the existing on-ramp while shifting the Witness Discovery stage toward objective-based investigation. However, I identified a significant CSS bug regarding undefined variables that should be addressed.

---

### Audit Questions & Findings

1.  **Are the existing on-ramp query examples preserved?**
    *   **YES.** `SAMUEL_TUPLETON_STEPS` and `SQL_CITY_REPORT_DRAFT` remain unchanged in `App.tsx`. `App.test.tsx` verifies that "Step 1" still preloads `SELECT * FROM CrimeType`.
2.  **Does the UI stop providing complete SQL after the report row is logged?**
    *   **YES.** In `handleStudentEvidenceLog`, `setStudentDraftQuery(null)` is called after the target report row is proven. This clears the `QueryRunner` editor, and the `shouldShowAutonomyBridge` state triggers the "Samuel's Investigation Brief."
3.  **Does the brief give enough support without giving away the full query?**
    *   **YES.** The brief provides the "Question To Answer" and identifies `InterviewLog` and the `ReportID` relationship as clues. It requires the student to construct the `WHERE` and `JOIN` clauses independently.
4.  **Does the student still have access to the restored report result?**
    *   **YES.** `studentLastQueryExecution` is passed as `restoredExecution` to `QueryRunner`. A specific test in `QueryRunner.test.tsx` verifies that results are restored even when the draft query is cleared.
5.  **Does the notebook tell students what evidence they need to document?**
    *   **YES.** The `notebook-evidence-contract` appears in the Evidence Board when the autonomy bridge is active, listing the specific facts (ReportID, Interview Row, PersonID) required.
6.  **Are witness names and addresses still hidden?**
    *   **YES.** Guidance text in `App.tsx` and `QueryHistoryPanel` has been sanitized to avoid spoiling names like "Annabel" or "Morty" before discovery.
7.  **Does `Gym Lead` remain hidden until witness evidence is complete?**
    *   **YES.** The `LeadBoardCard` for `gym-lead` is gated by the `witness-clues` milestone in `getLeadBoardCards`.
8.  **Are tests updated to protect both phases?**
    *   **YES.** `App.test.tsx` was updated with 10+ new assertions covering the transition, restored results, and autonomy bridge visibility.
9.  **Did the implementation avoid out-of-scope changes?**
    *   **YES.** Changes were strictly confined to `App.tsx`, `App.test.tsx`, `QueryRunner.tsx`, `QueryRunner.test.tsx`, and `styles.css`.

---

### Identified Issues

#### 1. CSS Variable Regression (Critical Polish)
In `styles.css`, the new classes `.student-investigation-brief` and `.investigation-brief__label` use CSS variables that are **not defined** in the `:root` or anywhere else in the project:
*   `background: ..., var(--panel);` (Line 612)
*   `color: var(--accent);` (Line 635)

This will cause the Investigation Brief to lack its intended base panel color and potentially use an incorrect text color for its labels.

#### 2. Milestone Advancement Sync (Minor UX)
The `witness-clues` milestone advances automatically in `handleQueryExecutionComplete` as soon as the student runs a query matching `InterviewLog`, `PersonsOfInterest`, and `PersonID`. However, the Notebook Evidence Contract says "Before Samuel advances, your notebook needs...".
*   **Result:** A student might see the milestone turn green in "Detective's Case Notes" before they have actually logged the specific facts in the notebook. This creates a slight discrepancy between the "Evidence Contract" and the milestone logic.

#### 3. Guidance Clarity
The brief mentions: *"When an interview gives you PersonID, connect that value to person and address data..."*
*   **Observation:** While it names `InterviewLog`, it does not explicitly name the `PersonsOfInterest` table in the brief text. This is likely intentional to encourage "Schema Snapshot" usage, but it is the first moment where a student must find a table name entirely on their own.

---

### Recommendations

1.  **Define CSS Variables:** Add the following (or similar theme-appropriate values) to `:root` or `.app-shell--student` in `styles.css`:
    ```css
    --panel: rgba(24, 23, 30, 0.88);
    --accent: #f0ca7a;
    ```
2.  **Update Milestone Logic:** Consider making the `witness-clues` milestone advancement dependent on logging at least one witness-related notebook entry, similar to how the `crime-type` milestone is handled.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Accepted.

WP-073 is accepted after review and post-audit corrective updates. The implementation preserves the guided on-ramp, transitions Witness Discovery to objective-based student-authored SQL, keeps future witness and gym leads gated until earned, resolves the audit-identified CSS variable regression, and aligns witness milestone advancement with the notebook evidence contract.

