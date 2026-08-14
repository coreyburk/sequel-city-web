# Case 001: The Clocktower Poisoning - Full Authoring Plan

## Purpose And Audience

This is the authoring plan for turning Case 001 into a released playable Sequel Detective case. It is for case authors, implementers, auditors, and reviewers. It is not learner-facing copy and is not runtime authority.

The plan exists to prevent Case 001 from growing through disconnected implementation slices. Future work packages should use this document to decide which data, validators, guidance, persistence, verification, and UI slices belong together.

## Spoiler Classification

Classification: author-only planning document.

Handling rules:

- Public dossier, milestone titles, table-family names, and SQL concepts may be reused in implementation WPs.
- Culprit identity, final-solve rationale, fixture identifiers, exact answer-key values, and red-herring resolution are author-only until a scoped database or verification WP adds them behind existing restricted boundaries.
- This document does not expose solution data at runtime.
- This document does not authorize frontend correctness, localStorage progression, prompt-text progression, runtime AI, restricted-table reads, or answer-key exposure.
- Student-facing copy derived from this plan must avoid naming hidden suspects, exact identifiers, or final solution paths before the learner earns them through SQL evidence.

## Case Identity

| Field | Value |
|---|---|
| Case id | `case-001` |
| Case number | `001` |
| Case name | `The Clocktower Poisoning` |
| Public eyebrow | `Public Spectacle` |
| Track | `Foundations` |
| Release status | Archive Locked until a release WP explicitly enables it |
| Existing gate | `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` for dev/test skeleton only |
| Existing first milestone | `case-001-clocktower-report-located` |

Public dossier alignment:

- One public death. Too many witnesses. Not enough clean timing.
- A civic celebration turns lethal when a public clocktower ceremony ends with a poisoning in full view of the crowd.
- The case is built for early timeline checks, record-vs-witness comparison, and clean clue narrowing.

## Intended Learner Experience

The learner begins with a public event that appears over-witnessed. The case teaches that public visibility is not the same as reliable evidence. The learner should move from broad public records to linked interviews, then compare witness claims against event and identity records until one person has both access and opportunity.

The case should feel like an early detective exercise:

- start with a clear public report
- follow a small number of table relationships
- compare crowd claims to records
- narrow a suspect without brute-force searching
- verify a single culprit through the database-backed verification path

Case 001 should not require a mastermind branch. That keeps it aligned with `Foundations` and makes it a useful onboarding case before Case 004.

## Playable End State

Case 001 is playable when a learner can:

1. Open the released case from the case library.
2. Read the briefing and inspect schema metadata.
3. Use Query Lab to run the six planned SQL milestones.
4. Receive deterministic, non-spoiler feedback after each milestone.
5. Log or pin the relevant evidence for each milestone.
6. Follow authored Samuel guidance without receiving hidden answer values.
7. Submit the final culprit through the backend verification flow.
8. Receive a database-backed correct verdict and close the case.
9. Reset/clear only learner-owned Case 001 progress.
10. Replay the case from a clean state with deterministic results.

Solve condition:

- The learner identifies the single culprit who had clockroom access after the toast, appears in the ceremony access trail, has a matching identity/vehicle record, and is tied by interview evidence to the poisoning opportunity.
- The final suspect is verified only through the backend/database verification path for `case-001`.

Author-only final-solve note:

- The exact culprit person row, final verification answer, and any answer-key values are intentionally not assigned in this planning package. They must be assigned in a future fixture/answer-key WP that updates this plan or records a linked implementation note.

## Complexity Budget

| Parameter | Limit |
|---|---|
| Track | Foundations |
| SQL milestones | 6 |
| Required table families | 6 |
| Optional table families | `Employment` only if future review decides the culprit needs a civic-role tie-break |
| Query type | Read-only `SELECT` only |
| Required filters | `WHERE` on every evidence milestone |
| Sorting | `ORDER BY` allowed and expected once |
| Joins | Introduced after initial single-table milestones |
| Golden-path join limit | No more than two joins in a learner query |
| Nested queries | Not required |
| CTEs/window functions | Not required |
| Aggregation | Not required |
| Mutation/temp/stored procedure SQL | Prohibited |
| Restricted tables | Prohibited |
| Major red herrings | 2 maximum |
| Final suspects before verification | 1 primary culprit plus at most 1 plausible distractor |

The case should be shorter and cleaner than Case 004. It should assess early relational reasoning, not advanced SQL.

## SQL Concept Coverage

| Concept | Milestone Coverage | Assessment Target |
|---|---|---|
| Basic projection | M1, M2 | Select useful columns instead of relying on hidden UI hints |
| Single-table filtering | M1, M2 | Use known date, crime, city, and report identifiers |
| Foreign-key following | M2, M3 | Move from `CrimeSceneReport.ReportID` to linked interviews and people |
| Sorting | M2 | Stabilize transcript review order by `PersonID` or `LogID` |
| Inner joins | M3, M4, M5 | Combine linked records across existing relationships |
| Compound predicates | M4, M5 | Narrow with more than one condition |
| Date/name filtering | M4 | Locate the ceremony event without scanning every event |
| Attribute filtering | M5 | Use physical/vehicle details as evidence, not guesses |
| Evidence confirmation | M6 | Retrieve final transcript support before suspect submission |

## Full Evidence Path

1. Public report identifies the clocktower poisoning record in `CrimeSceneReport`.
2. Linked `InterviewLog` rows for that report reveal the key witness claims:
   - crowd believed the clockroom door stayed closed
   - one record-backed access mark exists after the toast began
   - the useful next step is to identify people connected to that access window
3. `PersonsOfInterest` resolves witness and access-related PersonIDs into people records.
4. `EventSchedule` and `EventRegistration` connect the civic ceremony to registered participants or staff.
5. `DriversLicense` ties the narrowed person to a learner-visible descriptive clue from the transcript.
6. A final `InterviewLog` query for the candidate supplies the opportunity statement needed before suspect verification.
7. The learner submits the culprit through the backend verification endpoint.

## SQL Milestones

| # | Milestone id | Learner objective | Evidence table family | Expected query shape | SQL concept | Validator expectation | Future package type |
|---|---|---|---|---|---|---|---|
| 1 | `case-001-clocktower-report-located` | Locate the public clocktower incident report. | `CrimeSceneReport` | `SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City';` | Projection plus filtered lookup | Match existing public report row using `CrimeID`, `ReportDate`, `ReportCity`, and non-spoiler description tokens. | Already started; later progression wiring package |
| 2 | `case-001-report-interviews-located` | Find interviews linked to the clocktower report. | `InterviewLog` | `SELECT PersonID, ReportID, LogTranscript FROM InterviewLog WHERE ReportID = <clocktower ReportID> ORDER BY PersonID;` | Foreign-key follow plus sorting | Match 2-4 public interview rows tied to the clocktower `ReportID`, including non-spoiler transcript tokens about the door claim and access timing. | Evidence-data plus validator package |
| 3 | `case-001-witness-identities-resolved` | Resolve relevant interview PersonIDs into people records. | `PersonsOfInterest`, `InterviewLog` | `SELECT p.PersonID, p.PersonName FROM PersonsOfInterest p JOIN InterviewLog i ON i.PersonID = p.PersonID WHERE i.ReportID = <clocktower ReportID>;` | First join | Match witness/access-related people without requiring final culprit identification. | Validator plus clue-logging package |
| 4 | `case-001-ceremony-roster-narrowed` | Compare the clocktower ceremony roster with the access-window lead. | `EventSchedule`, `EventRegistration`, `PersonsOfInterest` | `SELECT e.EventID, e.EventName, r.EventPersonID, p.PersonName FROM EventSchedule e JOIN EventRegistration r ON r.EventID = e.EventID JOIN PersonsOfInterest p ON p.PersonID = r.EventPersonID WHERE e.EventDate = '<ceremony date>' AND e.EventName LIKE '%Clocktower%';` | Two joins plus compound event filter | Match the ceremony roster rows that include the eventual culprit and at least one plausible distractor. | Data bundle plus multi-table validator package |
| 5 | `case-001-access-candidate-narrowed` | Use identity or vehicle details from evidence to narrow the access candidate. | `PersonsOfInterest`, `DriversLicense` | `SELECT p.PersonID, p.PersonName, d.* FROM PersonsOfInterest p JOIN DriversLicense d ON d.LicenseID = p.LicenseID WHERE <learner-visible attribute filters>;` | Attribute filtering after join | Match the candidate row or a two-person shortlist using only attributes previously exposed in interview/roster evidence. | Data bundle plus validator package |
| 6 | `case-001-final-opportunity-confirmed` | Retrieve the candidate interview evidence needed before suspect submission. | `InterviewLog`, `PersonsOfInterest` | `SELECT i.PersonID, p.PersonName, i.LogTranscript FROM InterviewLog i JOIN PersonsOfInterest p ON p.PersonID = i.PersonID WHERE i.PersonID = <candidate PersonID> AND i.ReportID = <clocktower ReportID>;` | Evidence confirmation join | Match the candidate transcript containing non-spoiler opportunity tokens; validator must not reveal the final answer in feedback. | Final evidence, guidance, and verification-prep package |

## Database Fixture And Data Plan

No data is added by this package. Future data WPs should add coherent bundles rather than isolated one-row polish.

### Existing Data And Rebuild Policy

Case 001 data work must use the existing database as relational scaffolding, not as a presumed story source. The current seed data contains many random rows with useful relationships across people, licenses, employment, events, and registrations, but it should not be treated as already containing coherent mystery threads.

The current existing-data inventory is recorded in `docs/15-case-plans/Case-001-Existing-Data-Inventory.md`. Future Case 001 data WPs should consult that inventory before modifying fresh-build seed data.

Future Case 001 data WPs must follow these rules:

- Inventory existing `PersonsOfInterest`, `DriversLicense`, `Employment`, `EventSchedule`, and `EventRegistration` rows first.
- Reuse existing related people, places, events, driver-license, and employment records when they support a fair evidence path.
- Expect to author, replace, or modify `CrimeSceneReport` and `InterviewLog` content because those tables carry the story thread.
- Document which rows are reused unchanged, modified for story fit, newly inserted, or intentionally avoided.
- Preserve referential integrity and avoid breaking Case 004 data, tests, or answer paths.
- Avoid relying on random coincidental data as mystery logic.
- Prefer the smallest coherent story bundle that supports a milestone group.

Case story/data authoring must update fresh database creation scripts, not migration scripts:

- The authoritative path for authored case data is a fresh build from the current SQL creation/seed/foreign-key scripts.
- Future Case 001 story data WPs should update `database/02-SequelCityCrimesDB - Insert Data.sql` and any related base creation-script expectations needed for a clean rebuild.
- Do not add case-story migrations for Case 001 content.
- Do not use `ALTER`-style evolution packages to patch authored case content forward.
- Existing local databases that do not match the expected authored case data version should be blocked from normal play and rebuilt from the current scripts.
- A future scoped runtime/admin WP should define the explicit mismatch behavior before release: detect the database identity/content version, block normal play when it does not match, warn that rebuild resets local database state, then drop/recreate `SequelCityCrimesDB` from the current scripts only after explicit user action.
- Learner browser progress remains separate and should be reset or ignored when its case/database version no longer matches the rebuilt database.

| Table family | Public evidence needed | Author-only/verification data | Notes |
|---|---|---|---|
| `CrimeSceneReport` | Existing or modified public report row for the clocktower poisoning. | None for M1. | Story-bearing table. Future WPs may modify the base seed report text and must keep validator expectations aligned with the fresh-build script. Record generated `ReportID` expectations through tests rather than hard-coding a fragile identity value. |
| `InterviewLog` | Clocktower report interviews: crowd claim, access timing lead, candidate opportunity transcript. | Final transcript tokens that support culprit verification. | Story-bearing table. Expect authored or modified transcript rows. Transcript wording must be fair: it can point to access/opportunity, but should not say "this person is guilty." |
| `PersonsOfInterest` | Witness rows, access-related participant rows, final candidate row, one distractor row. | Final culprit PersonID used by verification. | Prefer reusing existing related people when names/relationships work; add or modify only when the existing row set cannot support a fair path. |
| `DriversLicense` | Candidate/distractor descriptive details used for narrowing. | None unless final verification depends on LicenseID. | Prefer existing license rows linked to reused people. Attribute clues must be introduced in interview evidence before they are required in SQL. |
| `EventSchedule` | Clocktower ceremony event row with date/name. | None. | Prefer an existing event row if it can be renamed or reused cleanly in the base seed script; otherwise author a small ceremony row. Event name should be discoverable with a simple date and `LIKE '%Clocktower%'` or equivalent filter. |
| `EventRegistration` | Ceremony registrations connecting people to the event. | Culprit's registration row is solution-supporting but still ordinary evidence. | Prefer existing registration relationships when coherent; keep event roster small enough that the learner is narrowing, not paging through noise. |
| `Employment` | Not planned for the core path. | Optional future tie-break only. | Reuse existing employment relationship only if review finds the candidate/distractor distinction too weak. |
| `CaseAnswerKey` | None. | `case-001` final culprit verification row. | Must remain restricted and added only by a scoped verification/answer-key WP through the fresh-build data path, not a case-story migration. |

## Red Herrings And Fairness

Major red herring 1: crowd certainty.

- Claim: many witnesses believe the clockroom door stayed closed.
- Purpose: teach that repeated witness claims are not the same as record evidence.
- Fairness rule: the access-timing record must be discoverable before the learner is asked to distrust the crowd claim.
- Resolution: interview and event/access evidence show the public view missed a private movement window.

Major red herring 2: ceremony-program timing.

- Claim: the bell test and ceremony program may look suspicious because they frame the public spectacle.
- Purpose: keep the clocktower setting engaging without making every mechanical detail meaningful.
- Fairness rule: the bell test must have a clean record; it can establish timing but cannot be necessary for final suspect verification.
- Resolution: the useful conflict is toast-to-access timing, not the routine bell test.

Minor distractors may exist in roster or identity results, but they must be ruled out by a visible evidence mismatch. The case should not rely on random extra rows or broad database noise as a difficulty substitute.

## Guidance And Samuel Pacing

Samuel guidance should move in six beats:

1. Start with the public report, not the crowd rumor.
2. Use the report identifier to find linked interviews.
3. Turn PersonIDs into people only after reading the transcript lead.
4. Compare the ceremony roster against the access-window clue.
5. Use attribute evidence to narrow the candidate without guessing.
6. Confirm opportunity in transcript evidence before suspect verification.

Guidance may reference:

- table names
- column names
- already returned ReportID, PersonID, EventID, and LicenseID values
- general SQL shape
- the difference between public sightlines and record-backed evidence

Guidance must not reference:

- final culprit name before the learner retrieves it
- answer-key rows
- direct final submit text
- hidden fixture ids not already returned by the learner's SQL
- runtime AI output

## Persistence And Reset Expectations

Case 001 should use the case-id keyed persistence model before release.

Future persistence scope must include:

- Case 001 storage key with a versioned envelope.
- Common learner-owned fields: notebook entries, pinned facts, draft query, current view, visible progress.
- Case-specific fields: Case 001 milestone ids, Case 001 thread ids, Case 001 clue ids, and Case 001 validation payload summaries.
- Locked/future behavior: Case 001 storage must not hydrate unless Case 001 is released or explicitly dev-gated.
- Reset behavior: clear only learner-owned Case 001 browser progress and thread storage.
- Reset must not clear backend query history, database state, case-library metadata, browser history, Case 004 storage, locked/future case data, or unrelated localStorage keys.

Persistence remains presentation convenience. It is not evidence authority and cannot verify the case.

## Suspect Verification And Final Solve

Case 001 should use backend/database-backed suspect verification before release.

Expected final flow:

1. Learner retrieves final candidate opportunity evidence through M6.
2. UI enables or emphasizes suspect submission.
3. Learner submits the candidate's person/name value.
4. Backend verifies against `case-001` answer data.
5. UI shows a verdict and final case closeout copy.

Verification package requirements:

- Add `case-001` answer-key data behind existing restricted boundaries.
- Preserve `Solution` and `CaseAnswerKey` spoiler-control rules.
- Do not expose answer-key content through Query Lab, schema docs, milestone metadata, or frontend state.
- Add positive and negative verification tests.
- Include at least one wrong but plausible distractor submission test.

## Automated Validation And Playthrough Expectations

Before release, Case 001 should have:

- Unit tests for each deterministic result-pattern validator.
- Route/service tests proving gated and later released metadata transport behavior.
- Negative validator tests for broad/no-match/wrong-row queries.
- Restricted-table tests proving answer-key and solution tables remain blocked.
- Browser tests for default locked behavior.
- Browser tests for released Case 001 entry when the release WP enables it.
- A golden-path playthrough test that runs all six milestone query shapes against local API/database setup.
- A reset/restore browser test after persistence is implemented.
- A final suspect verification positive/negative test.

Golden-path validation should assert progression metadata, not brittle raw row rendering, unless the scoped UI package intentionally renders rows.

## Future Work Package Sequence

Future WPs should be larger than one-row polish but still auditable:

1. Case 001 existing-data inventory package: inspect current relational scaffolding and choose which people, license, employment, event, and registration rows can be reused, modified, or avoided without relying on random story coincidences.
2. Case 001 evidence bundle 1: update the fresh-build seed script with linked `InterviewLog` and `PersonsOfInterest` story data for M2-M3 plus validators and tests; do not add migrations.
3. Case 001 evidence bundle 2: update the fresh-build seed script with ceremony `EventSchedule`/`EventRegistration` story data for M4 plus validator and tests; do not add migrations.
4. Case 001 evidence bundle 3: update the fresh-build seed script with candidate/distractor `DriversLicense` links and final transcript data for M5-M6 plus validators and tests; do not add migrations.
5. Case 001 database rebuild/version package: define the expected fresh-build database content/version check and block normal Case 001 play when the local database does not match; provide an explicit drop/recreate path before release.
6. Case 001 backend progression integration: wire validators into deterministic milestone state for Case 001, still gated.
7. Case 001 Query Lab/UI integration: render normal query/results/progression surfaces behind the existing gate.
8. Case 001 guidance/thread/evidence-board package: add Samuel pacing, authored threads, and learner clue logging.
9. Case 001 persistence/reset package: add case-id keyed restore and clear-progress behavior, including reset/ignore behavior when browser progress is stale against the database version.
10. Case 001 verification package: add restricted answer-key data and final suspect verification through the fresh-build data path.
11. Case 001 release-readiness smoke package: run full live-stack golden-path playthrough against a freshly rebuilt database and fix blockers.
12. Case 001 release unlock package: enable released entry only after the preceding criteria pass.

If this sequence proves too coarse during implementation, split by milestone pair rather than by single row.

## Unresolved Authoring Assumptions

- Exact culprit identity is intentionally unassigned in this package.
- Exact PersonIDs, LicenseIDs, EventIDs, and ReportID should be assigned by future data WPs after existing relational rows are inventoried, then reflected in validator tests.
- The plan assumes Case 001 is a single-culprit Foundations case without a mastermind branch. Adding a mastermind would require a revised complexity budget and should be treated as a separate product decision.
- The existing schema is sufficient for the planned path. If future review requires a dedicated access-log table, that would be a schema-changing WP and should not be smuggled into an evidence fixture package.
- `Employment` is not part of the core path unless future playtesting shows the candidate/distractor distinction needs one more fair tie-break.
- The local database rebuild/version enforcement mechanism is intentionally unimplemented in this planning package and must be scoped before Case 001 release.
