# Investigation Steps (internal)

NOTE: This document is internal only — not exposed to the UI or students. It documents the investigative workflow and exact queries/tokens developers should use to reproduce Student Mode paths and tests.

Date: 2026-05-29

Each step below follows this compact format:
- Preconditions: what must be pinned or known
- Query / Token: exact SQL fragment or QueryAssist token(s) to run
- Expected output: what rows/notebook entries should appear
- Acceptance criteria: how to know the step succeeded
- Notes / common pitfalls

1. Gather transcript for the murder report
- Preconditions: known `ReportID` (from the confirmed trigger)
- Query / Token: `SELECT * FROM InterviewLog WHERE ReportID = <ReportID> ORDER BY PersonID` (Token: `LogTranscript`)
- Expected output: InterviewLog rows for the report, grouped by PersonID
- Acceptance: a row contains the mastermind-style clue text (contains `symphony`, `BMW`, `redheaded`, or precise time clues)
- Notes: use `Log Clue` to pin the exact transcript row when found.

2. Pin the witness/clue row(s)
- Preconditions: transcript row(s) identified in step 1
- Query / Token: use the UI `Log Clue` action on the target row
- Expected output: a notebook entry with an id like `mastermind-clue-<n>` or `witness-<id>` containing the row detail
- Acceptance: notebook contains the pinned entry and `Case File > Pinned Facts` shows it
- Notes: pinned facts yield Query Assist tokens (PersonID, EventDate, EventID, LicenseID)

3. Extract quick tokens from pinned facts
- Preconditions: pinned notebook entry present
- Query / Token: use generated Pinned Fact tokens (`PersonID`, `EventID`, `EventDate`, `LicenseID`, `PersonName`)
- Expected output: tokens ready to insert into QueryRunner
- Acceptance: tokens insert correct SQL fragments into the editor
- Notes: Pinned token mapping uses `EventName LIKE '%Symphony%'` for any symphony clue (no literal venue required)

4. Locate the December symphony event(s)
- Preconditions: mastermind clue mentions December and symphony (or `symphony` found in transcript)
- Query / Token: `SELECT * FROM EventSchedule WHERE EventDate LIKE '2023-12%' AND EventName LIKE '%Symphony%'` (Tokens: `EventSchedule`, `EventDate`, `EventName`, `Symphony`)
- Expected output: one or more EventSchedule rows with `EventID` and `EventDate`
- Acceptance: at least one EventID matches the killer's meeting pattern (three meetings in December or matching date clues)
- Notes: prefer `EventName LIKE '%Symphony%'` to avoid brittle exact-name matches

5. Cross-check EventRegistration with candidate persons
- Preconditions: `EventID` identified and candidate `PersonID`(s) pinned
- Query / Token: `SELECT * FROM EventRegistration WHERE EventID = <EventID> AND EventPersonID IN (<PersonIDs>)` (Tokens: `EventRegistration`, `EventID`, `EventPersonID`)
- Expected output: EventRegistration rows tying pinned candidates to the event
- Acceptance: you can map which candidate(s) attended the event
- Notes: If no matches, re-evaluate EventSchedule selection or candidate PersonIDs

6. Verify vehicle and appearance via DriversLicense
- Preconditions: candidate `PersonID`(s) identified from EventRegistration or PersonsOfInterest
- Query / Token: `SELECT * FROM DriversLicense WHERE PersonID IN (<PersonIDs>) AND CarMake = 'BMW' AND CarModel = 'M8'` (Tokens: `DriversLicense`, `CarMake`, `CarModel`)
- Expected output: DriversLicense rows showing vehicle details for candidate(s)
- Acceptance: at least one candidate matches the BMW M8 clue and other appearance attributes
- Notes: normalize casing and model variants in tests if necessary

7. Resolve Person identities (names, licenses)
- Preconditions: PersonID(s) from prior steps
- Query / Token: `SELECT * FROM PersonsOfInterest WHERE PersonID IN (<PersonIDs>)` (Tokens: `PersonsOfInterest`, `PersonID`, `PersonName`)
- Expected output: names and other identifying fields for candidate(s)
- Acceptance: candidate identity is resolvable to a real person record
- Notes: pin final identity rows into the notebook for auditability

8. Form hypothesis and document findings
- Preconditions: evidence rows from EventSchedule, EventRegistration, DriversLicense, InterviewLog pinned
- Query / Token: N/A (developer writes hypothesis in notebook or WP-140)
- Expected output: notebook entry summarizing the candidate and linked evidence (IDs, dates, tokens used)
- Acceptance: hypothesis lists the exact queries and pinned entries that support it
- Notes: include acceptance criteria for later QA/tests

9. Notebook upsert behavior (developer verification step)
- Preconditions: `Log Clue` on EventSchedule row performed
- Query / Token: `onStudentEvidenceLog` should create `mastermind-event-<EventID>` with `EventID`, `EventName`, `EventDate` in detail
- Expected output: new notebook entry `mastermind-event-<EventID>` present in `notebookEntries`
- Acceptance: function `upsertNotebookEntries` is called with event details and UI shows success feedback
- Notes: tests should assert notebook entry id and content; use `console.debug` on Log Clue clicks while debugging

10. Tests & dev checklist
- Preconditions: repository branch with these changes
- Query / Token: Update tests that asserted literal `EventName = 'Symphony Hall'` to use `EventName LIKE '%Symphony%'` or expect `Symphony` token in UI
- Expected output: unit and Playwright tests pass for Student Mode flows
- Acceptance: `npm test` / `npm run test:browser` pass locally (or CI) for student flows
- Notes: update fixtures in `apps/web/src/App.test.tsx` and any Playwright fixtures referencing literal venue names

Developer mapping: UI token -> SQL insertion
- `Symphony` (UI token) -> `EventName LIKE '%Symphony%'` (SQL)
- `EventID` -> `EventID`
- `EventDate` -> `EventDate LIKE 'YYYY-MM%'` (example: `'2023-12'`)

File location & exposure
- File: `docs/00-ssot/INVESTIGATION-STEPS.md`
- Visibility: internal developer doc only. Do not import or render this file in the application UI.

If you want, I can also:
- Add a short checklist entry per step with exact test assertions to update `apps/web/src/App.test.tsx`.
- Seed a few fixture rows (or update tests) to match the new `LIKE '%Symphony%'` usage.

---
Generated by developer assistant for WP-140 work.
