# Case 001: Existing Data Inventory

## Purpose And Authority

This is an author-only inventory for Case 001 data planning. It identifies reusable relational scaffolding in the current fresh-build SQL scripts before any Case 001 data changes are made.

This document is not runtime authority, does not release Case 001, and does not expose an answer key. It records candidate rows and relationship chains for future scoped data work to verify before editing the fresh-build scripts.

No database rows, database scripts, migrations, runtime code, UI, persistence, release gates, suspect verification, or local database state are changed by this inventory.

## Source Basis

Read-only sources inspected:

- `database/01-SequelCityCrimesDB - Create DB.sql`
  - `CrimeSceneReport` schema near line 64.
  - `DriversLicense` schema near line 75.
  - `PersonsOfInterest` schema near line 91.
  - `EventSchedule` schema near line 104.
  - `EventRegistration` schema near line 112.
  - `Employment` schema near line 143.
  - `InterviewLog` schema near line 154.
- `database/02-SequelCityCrimesDB - Insert Data.sql`
  - Existing Case 001 public report row near line 11592.
  - `EventSchedule` rows near lines 11610-11800.
  - `EventRegistration` rows across the full registration section.
  - `PersonsOfInterest`, `DriversLicense`, `Employment`, and `InterviewLog` rows by identifier search.
- Runtime Case 004 references were inspected only to identify protected rows that future Case 001 data work should avoid.

## Inventory Decision Summary

| Decision class | Current finding | Case 001 recommendation |
|---|---|---|
| Reuse unchanged | The existing public clocktower `CrimeSceneReport` row has the correct starter date, crime type, city, and non-spoiler incident framing. | Keep the row as the M1 public evidence anchor unless future copy review finds wording defects. |
| Modify for story fit | `EventID 2993` has a full `EventSchedule -> EventRegistration -> PersonsOfInterest -> DriversLicense` scaffold and is close to the Case 001 date, but its current event name is unrelated. | Consider modifying that event row to become the clocktower ceremony and reusing a small subset of its roster relationships. |
| Modify for story fit | Existing `InterviewLog` rows are random unrelated transcript content and are not tied to the clocktower report. | Author or replace clocktower-specific interview rows in a future evidence bundle. |
| Newly author later | Case 001 still needs coherent report-linked interviews, final opportunity transcript, and eventually restricted verification data. | Add through scoped future fresh-build data WPs only; do not use migrations. |
| Avoid | Case 004 report/person/fitness rows and random unrelated story rows are already meaningful to released gameplay or incoherent for Case 001. | Do not reuse as Case 001 clue logic. Preserve Case 004 behavior and avoid random coincidence. |

## Milestone Alignment

| Milestone | Evidence need | Current data status | Inventory decision |
|---|---|---|---|
| M1 `case-001-clocktower-report-located` | Public clocktower poisoning report in `CrimeSceneReport`. | Present near `database/02-SequelCityCrimesDB - Insert Data.sql:11592` with `ReportDate = 20230502`, `CrimeID = 1080`, `ReportCity = 'Sequel City'`, and non-spoiler clocktower poisoning text. | Reuse unchanged unless future copy review requires a text-only edit. Do not hard-code generated `ReportID`; validators should resolve through stable fields. |
| M2 `case-001-report-interviews-located` | 2-4 clocktower interviews tied to the public report. | WP-259 authors a 3-row clocktower `InterviewLog` bundle tied to the public report by stable report lookup. | Reuse the authored bundle for M2 validation; do not use generated `ReportID` as an authoring anchor. |
| M3 `case-001-witness-identities-resolved` | `InterviewLog.PersonID -> PersonsOfInterest.PersonID` witness/access identities. | WP-259 reuses existing `PersonsOfInterest` rows `62764`, `27590`, and `50417` unchanged. | Use these three identities for the first M3 join validator; future packages may add roster or candidate roles without assigning a culprit here. |
| M4 `case-001-ceremony-roster-narrowed` | Clocktower ceremony in `EventSchedule` plus roster in `EventRegistration`. | No clocktower event exists. `EventID 2993` is a nearby dated event with a usable 16-person registration cluster. | Modify `EventID 2993` or author a new event later; prefer reusing the 2993 roster subset if future story review accepts the row set. |
| M5 `case-001-access-candidate-narrowed` | `PersonsOfInterest -> DriversLicense` descriptive narrowing details. | Roster candidates linked from `EventID 2993` have valid `LicenseID` values and driver attributes. | Reuse driver-license links where fair; introduce every required attribute clue in interview evidence before a validator expects it. |
| M6 `case-001-final-opportunity-confirmed` | Candidate-specific report interview that supports opportunity before suspect verification. | No coherent final opportunity transcript exists. | Newly author later. Do not assign final culprit or answer-key values in this inventory. |

## Table-Family Inventory

### CrimeSceneReport

Current source finding:

- Existing row near `database/02-SequelCityCrimesDB - Insert Data.sql:11592`:
  - `ReportDate = 20230502`
  - `CrimeID = 1080`
  - `ReportCity = 'Sequel City'`
  - Description starts with a public clocktower ceremony report and references a collapse after a toast, suspected poisoning, and clockroom access records.

Decision:

- Reuse unchanged for M1 if possible.
- Modify for story fit only if later copy review needs tighter non-spoiler language.
- Do not use generated `ReportID` as the authoring anchor in prose; future validators should locate the row by stable public fields and then use the returned `ReportID`.

Avoid:

- Do not reuse Case 004's SQL City murder report path, especially runtime references to `ReportID 10975`, `CrimeID 1080`, `ReportCity = 'SQL City'`, and `ReportDate = 20230115`.
- Do not treat other random `CrimeID 1080` reports as Case 001 clues.

### InterviewLog

Current source finding:

- WP-259 adds a 3-row clocktower-specific interview bundle tied to the public Case 001 report through a stable `CrimeSceneReport` lookup.
- The selected interview people are existing `PersonsOfInterest` rows `62764`, `27590`, and `50417`.
- Other existing transcript rows include random unrelated genre/story fragments and released Case 004 transcript content.
- Known Case 004 transcript anchors include `ReportID 10975` with PersonIDs including `14887`, `16371`, and `67318`.

Decision:

- Reuse the WP-259 M2 transcript bundle for early report-linked interview discovery.
- Newly author M6 transcript content in a future data WP.
- Future modifications should target coherent report-linked rows only after the scoped WP resolves the generated clocktower `ReportID` strategy for fresh builds.
- Implemented M2 bundle: crowd-door claim, access-timing lead, and one neutral record cue.
- Expected M6 bundle: candidate opportunity statement that supports verification without saying the person is guilty.

Avoid:

- Do not reuse Case 004 `ReportID 10975` transcripts.
- Do not reuse random unrelated transcript text as clue logic.
- Do not expose final-solve rationale or culprit identity through transcript wording.

### PersonsOfInterest

Current source finding:

- The table already provides many rows with stable `PersonID`, `LicenseID`, address, city, and `SSN` values.
- The strongest current roster scaffold is the `EventID 2993` registration cluster.

Candidate `EventID 2993` roster rows:

| PersonID | Name | LicenseID | Address city | Inventory note |
|---|---|---:|---|---|
| `62764` | Herschel Tanious | `826500` | American Fork | Registered to `EventID 2993`; usable roster candidate. |
| `27590` | Taryn Swoboda | `846506` | Draper | Registered to `EventID 2993`; usable roster candidate. |
| `50417` | Shayla Kehl | `430996` | Manti | Registered to `EventID 2993`; usable roster candidate. |
| `27412` | Les Eskridge | `358019` | Vernal | Registered to `EventID 2993`; usable roster candidate. |
| `95009` | Margeret Bywater | `871962` | Layton | Registered to `EventID 2993`; usable roster candidate. |
| `33441` | Giovanni Bost | `833736` | Salt Lake City | Registered to `EventID 2993`; usable roster candidate. |
| `60060` | Cliff Deedrick | `942527` | Green River | Registered to `EventID 2993`; usable roster candidate. |
| `48614` | Hubert Hilts | `985009` | Richfield | Registered to `EventID 2993`; usable roster candidate. |
| `35352` | Buck Riveroll | `376750` | Holladay | Registered to `EventID 2993`; usable roster candidate. |
| `43744` | Kareem Skidgel | `185077` | Brigham City | Registered to `EventID 2993`; usable roster candidate. |
| `35603` | Rosamond Peltzer | `168157` | Snowbird | Registered to `EventID 2993`; usable roster candidate. |
| `18486` | Cleta Boho | `635466` | Manti | Registered to `EventID 2993`; usable roster candidate. |
| `56453` | Zandra Broadstreet | `755274` | Saratoga Springs | Registered to `EventID 2993`; usable roster candidate. |
| `27652` | Sherell Morre | `145029` | Saratoga Springs | Registered to `EventID 2993`; usable roster candidate. |
| `89226` | Katherin Bakeley | `507560` | Centerville | Registered to `EventID 2993`; usable roster candidate. |
| `52796` | Argelia Tiegs | `240519` | Green River | Registered to `EventID 2993`; usable roster candidate. |

WP-259 reuse decision:

- Reuse `62764` Herschel Tanious unchanged for the crowd/door-claim interview.
- Reuse `27590` Taryn Swoboda unchanged for the access-timing lead interview.
- Reuse `50417` Shayla Kehl unchanged for the neutral records cue interview.
- Do not assign culprit, final opportunity, or answer-key meaning to these rows in WP-259.

Decision:

- Reuse a 3-5 person subset from this cluster if future evidence design can make their names/attributes fair and non-distracting.
- Modify story roles through `InterviewLog` and event context rather than changing unrelated personal attributes first.
- Add new `PersonsOfInterest` rows only if this roster cannot support one primary candidate and one plausible distractor without awkward clues.

Avoid:

- Do not reuse Case 004 known rows as Case 001 witnesses or suspects: `14887`, `16371` Annabel Miller, and `67318` Jeremy Bowers.
- Do not use broad unrelated people solely because a name or address sounds thematic.

### DriversLicense

Current source finding:

- Every listed `EventID 2993` roster candidate has a linked `LicenseID`.
- The linked rows provide age, height, eye color, hair color, gender, plate, make, and model.

Decision:

- Reuse linked license rows for M5 only after interview evidence introduces the exact descriptive clue.
- Prefer a narrowing clue that returns either one candidate or a two-person shortlist from the chosen roster subset.
- Do not change license attributes until a future data WP validates that the chosen roster lacks a fair clue.

Avoid:

- Do not make learners guess from unintroduced driver attributes.
- Do not use vehicle details that overlap with Case 004's existing gym/murder clue path unless a future audit proves no confusion risk.

### Employment

Current source finding:

- `PersonsOfInterest.SSN` can join to `Employment.SSN`.
- Some roster candidates have matching employment rows and some do not, based on source-script lookup.
- Employment is not part of the planned core path.

Decision:

- Keep `Employment` optional.
- Reuse employment only if future playtesting shows the roster/driver-license distinction is too weak.
- If used, make it a tie-break after M5 rather than a required early clue.

Avoid:

- Do not introduce employment as a seventh required milestone.
- Do not use job/company labels that create unsupported motive claims.

### EventSchedule

Current source finding:

- No event name currently contains `Clocktower`.
- Nearby valid event candidates:
  - `EventID 2993`, `EventDate = 20230504`, `EventName = 'Street Style Fashion Expo'`, with 16 registrations.
  - `EventID 3053`, `EventDate = 20230513`, `EventName = 'Urban Artisan Market'`, with 15 registrations.
  - `EventID 2789`, `EventDate = 20230126`, `EventName = 'Symphony of Sweets Dessert Festival'`, with 16 registrations.
- `EventID 1200` appears in registrations but no matching `EventSchedule` row was found in the valid event scan; it should not be treated as a safe relational anchor.

Decision:

- Preferred modify candidate: `EventID 2993`.
- A future data WP may modify `EventID 2993` to `EventDate = 20230502` and a clocktower ceremony name, then keep a small coherent roster subset.
- Alternative: author a new event row if preserving existing event text is safer or if identity-insert expectations make modification undesirable.

Avoid:

- Do not use registrations pointing to missing event rows as evidence.
- Do not use distant 2021/2022 events for Case 001 unless a future data WP intentionally rewrites them.

### EventRegistration

Current source finding:

- `EventID 2993` has enough registrations for a ceremony roster, but 16 rows is too many for a Foundations case if exposed directly.
- Existing rows are relational scaffolding only; they do not imply a clocktower ceremony.

Decision:

- Reuse a subset of `EventID 2993` registrations or prune/replace through a future fresh-build data WP.
- Keep the learner-facing M4 result small enough to narrow, not page through random noise.
- Target roster size for the playable case should be 3-5 visible participants, including one primary candidate and at most one plausible distractor.

Avoid:

- Do not leave a 16-person noisy roster as the expected golden-path result.
- Do not rely on unregistered people as ceremony participants unless future data WPs add rows explicitly.

## Relationship-Chain Candidates

| Chain | Current viability | Future verification need |
|---|---|---|
| `CrimeSceneReport -> InterviewLog` | Public report exists; WP-259 adds linked M2 interviews. | Future data WPs may add later milestone interviews, but should preserve the M2 stable report lookup pattern. |
| `InterviewLog -> PersonsOfInterest` | WP-259 links the first three clocktower interviews to existing people. | Future data WPs must choose final candidate/distractor roles without treating these M2 witness identities as an answer key. |
| `EventSchedule -> EventRegistration -> PersonsOfInterest` | `EventID 2993` is the best current scaffold candidate. | Future data WP must either modify `EventID 2993` into the clocktower ceremony or author a new event/registration bundle. |
| `PersonsOfInterest -> DriversLicense` | Strong for all `EventID 2993` roster candidates. | Future data WP must choose learner-visible attributes and validator expectations without forcing guesses. |
| `PersonsOfInterest -> Employment` | Available for some candidates but uneven. | Keep optional unless candidate/distractor resolution needs a fair tie-break. |

## Case 004 Conflict Checks

Do not modify or reuse these known Case 004 anchors for Case 001:

- Runtime `ReportID 10975` path.
- SQL City murder report filters: `CrimeID 1080`, `ReportCity = 'SQL City'`, and `ReportDate = 20230115`.
- PersonIDs used by Case 004 tests/guidance, especially `14887`, `16371`, and `67318`.
- Case 004 named suspects/witnesses such as Annabel Miller and Jeremy Bowers.
- FitNFlabClub and FitNFlabClubCheckIn clue rows used by Case 004.
- Restricted `Solution` and `CaseAnswerKey` behavior.

Future Case 001 data WPs should run targeted searches for any selected PersonID, ReportID, EventID, LicenseID, SSN, and transcript phrase before editing the seed script.

## Next Data-Package Recommendations

1. Evidence bundle 2 should decide whether `EventID 2993` becomes the clocktower ceremony or whether a new ceremony event is cleaner. It should keep the roster small and validator-friendly.
2. Evidence bundle 3 should choose the driver-license clue and final opportunity transcript only after the roster is fixed. It should still avoid assigning or exposing answer-key data until the verification WP.
3. Before release, a database rebuild/version WP should define how mismatched local databases are blocked and explicitly rebuilt from fresh scripts.

## Unresolved Assumptions

- The final culprit is intentionally unassigned.
- The final answer-key row is intentionally unassigned.
- The generated clocktower `ReportID` should be resolved through fresh-build validation, not assumed from authoring prose.
- `EventID 2993` is the best current scaffold candidate, but future data work may reject it if a smaller authored event is cleaner.
- Employment remains optional unless playtesting shows the planned roster and license clues are insufficient.
