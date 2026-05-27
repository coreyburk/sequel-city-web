# WP-136: Mastermind Identity Pinning and Event-Trail Guidance

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-27

## Objective

Fix the mastermind flow after the two shortlisted women are identified so those identity rows become usable evidence, appear in the student's pinned clue surfaces, and drive a clear step-by-step handoff through `EventRegistration` and `EventSchedule`.

## Scope

### In Scope

- allow the two resolved mastermind identity rows to be logged as notebook evidence
- surface those logged mastermind identity rows on the Evidence Board and in `Case File > Pinned Facts`
- turn the logged identity rows into usable query assists for the next event-trail queries
- replace stale fallback mastermind guidance with stage-specific event-trail guidance
- guide the student step-by-step through:
  - `PersonsOfInterest` identity resolution
  - `EventRegistration` event-trail comparison
  - `EventSchedule` December Symphony Hall cross-check
- add regression coverage for the new post-identity mastermind flow

### Out of Scope

- changing the accepted killer or mastermind answers
- backend API or database schema work
- Admin Mode editing mechanics
- redesigning earlier witness, gym, suspect, or transcript phases beyond what is required for this handoff
- final mastermind verdict UX beyond the cross-check guidance stage

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-136-mastermind-identity-pinning-and-event-trail-guidance.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `package-lock.json`

## Constraints

- do not hard-code killer or mastermind names into the new late-stage guidance path
- keep suspect-name references driven by the existing resolved case data and notebook state
- do not leave the identity rows as transient query output only; they must become evidence the student can reuse
- do not jump directly from identity resolution to the final mastermind answer
- make the next event-table steps explicit enough that the student knows what to query next without removing all reasoning

## Required Behavior

- when the student logs the two `PersonsOfInterest` identity rows, those rows must appear in the mastermind notebook and in `Case File > Pinned Facts`
- pinned mastermind identity rows must insert usable query fragments for the next event-trail stage
- once both identities are pinned, Samuel's guidance and Query Lab must stop speaking as if the student is still in the identity-resolution or transcript-mining phase
- the next student step must explicitly move to `EventRegistration` using both returned `PersonID` values as `EventPersonID` filters
- after the event-trail comparison, the next student step must explicitly move to `EventSchedule` using the strongest `EventID` values plus the December and Symphony Hall clues

## Acceptance Criteria

- [x] The two mastermind identity rows can be logged and become notebook evidence
- [x] Logged mastermind identities appear in `Case File > Pinned Facts` with usable query-assist insertion
- [x] Samuel's Guidance and Query Lab instruction no longer fall back to older killer/transcript wording after the identities are pinned
- [x] The event-trail flow is staged clearly across `EventRegistration` and `EventSchedule`
- [x] Regression coverage exists for identity pinning, pinned-fact visibility, and the event-trail handoff

## Code Prompt

Implement WP-136 exactly as scoped.

Requirements:

- promote the resolved mastermind identity rows into reusable evidence
- keep late-stage suspect references data-driven instead of name-hard-coded
- provide concrete step-by-step guidance for the event-trail comparison path
- add focused regression coverage for the new identity and event-trail flow

Return:

- exact files changed
- summary of the new identity-to-event progression
- verification performed

## Audit Prompt

Audit WP-136 for mastermind evidence continuity and event-trail guidance accuracy.

Verify:

1. The two resolved mastermind identity rows can be logged and then appear on the mastermind Evidence Board page.
2. Those logged identity rows also appear in `Case File > Pinned Facts` and insert usable event-trail query fragments.
3. Samuel's Guidance and Query Lab no longer regress to older killer/transcript prompts after the identity rows are pinned.
4. The student is guided explicitly through `EventRegistration` first and `EventSchedule` second.
5. The implementation stays within the accepted frontend scope and does not introduce new hard-coded killer/mastermind names.

## Code Results

- Updated [apps/web/src/useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) to add a real post-identity mastermind state path: logged identity rows are now tracked separately, the app detects when the student moves into `EventRegistration` and `EventSchedule`, and Samuel's guidance, objective, failure guidance, notebook summary, and evidence prompt all advance across those stages instead of falling back to older transcript-era copy.
- Extended [apps/web/src/useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so SQL editing no longer clears student feedback or resets the scene before `Run Query`, premature event-table attempts get identity-step coaching instead of stale fallback text, and logging both mastermind identities resets the query runner cleanly for the next stage.
- Updated [apps/web/src/components/student/StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so mastermind identity rows are promoted into `Case File > Pinned Facts` with `EventPersonID = ...` query assist, and so the Query Lab investigation brief and token rail change from identity resolution to `EventRegistration` and then to `EventSchedule`.
- Extended [apps/web/src/components/student/StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so compound mastermind notes now expose individual token buttons instead of collapsing to one default value. Candidate and identity notes emit separate assists such as `LicenseID`, `EventPersonID`, `CarMake`, `CarModel`, `Height`, `PlateNumber`, and `PersonName`.
- Updated [apps/web/src/studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so mastermind handoff messaging and lead-board cards reflect the identity-pinned stage, the event-registration comparison stage, and the event-schedule cross-check stage.
- Updated [apps/web/src/App.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx) to pass the new mastermind event-stage state into the student workbench.
- Added regression coverage in [apps/web/src/App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) for identity logging, pinned-fact visibility, `EventRegistration` guidance, `EventSchedule` guidance, stable feedback and scene behavior during SQL edits, and removal sync between Evidence Board notes and `Pinned Facts`.

## Audit Results

The audit of **WP-136: Mastermind Identity Pinning and Event-Trail Guidance** is complete. The implementation successfully addresses all requirements for mastermind identity continuity and guidance accuracy.

### Audit Findings

1.  **Mastermind Identity Logging:**
    *   Verified that `useStudentCaseState.ts` handles the logging of mastermind identity rows (PersonID, Name, LicenseID) when the student is in the shortlist phase.
    *   These rows are correctly categorized as `mastermind` notebook entries and appear on the specialized Evidence Board page.

2.  **Pinned Facts & Query Fragments:**
    *   Verified in `StudentWorkbenchView.tsx` that the `getPinnedFactAssistTokens` function extracts usable SQL fragments from mastermind identities.
    *   Supported tokens include `EventPersonID`, `PersonID`, `PersonName`, and `LicenseID`, allowing the student to easily build the next phase of queries.

3.  **Guidance Continuity & Regression Prevention:**
    *   The `getMastermindHandoffGuidance` function in `studentCase.ts` provides state-aware messaging that advances the investigation based on pinned evidence.
    *   Logic in `useStudentCaseState.ts` ensures that once mastermind identities are pinned, Samuel's guidance focuses on the event trail and does not regress to earlier killer/transcript prompts.

4.  **Sequential Event-Trail Guidance:**
    *   The implementation explicitly guides the student through `EventRegistration` (to find shared EventIDs) followed by `EventSchedule` (to verify the December Symphony Hall meeting).
    *   Specific `InvestigationBrief` updates in the UI provide the necessary tokens and instructions for each step of this cross-check.

5.  **Scope & Integrity:**
    *   The implementation remains strictly within the frontend scope as requested.
    *   No hard-coded suspect or mastermind names were introduced; the system continues to use data-driven identity labels.

### Verification Results
- **Automated Tests:** `npm run test --workspace apps/web -- --run src/App.test.tsx` passed, specifically confirming the test case *"pins the two mastermind identities and advances guidance into the event-trail cross-check"*.
- **Manual Review:** Code inspection of `useStudentCaseState.ts`, `StudentWorkbenchView.tsx`, and `studentCase.ts` confirms the logic is robust and follows the established patterns.

**WP-136 is verified and ready for closure.**

## Verification

- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryRunner.test.tsx`
- Result: `87 passed`

## Final Decision

Accepted


