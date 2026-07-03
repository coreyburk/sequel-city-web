# Faculty Demo Route Script

## Purpose

This is the presentation-day route for `Sequel Detective`.

Use it for the faculty demo, not for ordinary exploratory walkthroughs. The live route should stay on the positive path. Incorrect-path behavior is already covered by browser automation and should remain offstage unless the live environment fails and you are explaining robustness.

Use `demo-shot-by-shot-recording-checklist.md` when turning this route into a paced recording.

## Starting Conditions

- App launched with `npm run dev`
- Browser open to the local web app
- Student Mode active
- No case is open yet

If the app is not already running, do not begin the demo until `http://127.0.0.1:3001` and `http://127.0.0.1:5173` are both healthy.

## Route Overview

This route starts at the case library, opens Case 004, shows the landing page and briefing, walks the core evidence trail, confirms the first suspect, then finishes the mastermind path if time allows.

Do not intentionally take wrong turns live.

## Core Route

### 1. Open The Case Library

Action:

- Show the case library screen.
- Point out that no case is selected by default.

Talk track:

- This is the entry shelf for the current student flow.
- The app is not pretending to be a generic database tool; it is presenting a case-driven learning path.

Expected result:

- The library shows visible case entries.
- Case 004 is available as the playable case.

### 2. Open Case 004

Action:

- Click `Select Case 004: The SQL City Murder`.

Talk track:

- Case 004 opens into its own landing page instead of dropping straight into the investigation.
- Locked cases are present, but they stay archived.

Expected result:

- The Case 004 landing page appears.
- The page title reads `Case 004: The SQL City Murder`.

### 3. Enter The Case File

Action:

- Click `Open Case File`.

Talk track:

- This is the controlled entry into the live investigation.
- The app now moves from case framing into the actual detective work.

Expected result:

- The Case 004 briefing appears.
- `Query Lab` is available.

### 4. Crime Type Query

Action:

- Switch to `Query Lab`.
- Run:

```sql
SELECT * FROM CrimeType
```

Talk track:

- The investigation starts by identifying the kind of crime, not by guessing at suspects.
- The point is to show the system rewards disciplined query order.

Expected result:

- One row returns.
- The next clue is available for logging.

### 5. Crime Scene Report Query

Action:

- Run:

```sql
SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'
```

Talk track:

- This narrows the investigation to the correct report.
- The app helps the learner connect the crime code to the actual incident record.

Expected result:

- The report row returns with the correct crime and city.
- The next witness trail becomes meaningful.

### 6. Witness Trail Query

Action:

- Run:

```sql
SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID
```

Talk track:

- The app uses the witness trail to move from the report into human testimony.
- This is where the evidence starts to connect across tables.

Expected result:

- Six rows return.
- The relevant witness clues can be pinned.

### 7. Pin The Witness Names

Action:

- Open `Case File` if needed.
- Highlight the witness IDs and names that now matter:
  - `14887` and `16371`

Talk track:

- The Case File makes the evidence reusable instead of forcing the audience to remember every token.
- This is the point where the learning model shifts from search to reasoning.

Expected result:

- The pinned facts show the two witness names.

### 8. Gym Lead Query

Action:

- Run:

```sql
SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'
```

Talk track:

- This is the shift from witness evidence to the suspect trail.
- The app is teaching how to use a constrained filter chain instead of jumping to assumptions.

Expected result:

- One gym lead row returns.
- The lead points to `PersonID 67318`.

### 9. Identify The Gym-Linked Suspect

Action:

- Run:

```sql
SELECT * FROM PersonsOfInterest WHERE PersonID = 67318
```

Talk track:

- The app now has a named suspect, but the investigation is still evidence-led.
- The goal is to verify, not to guess.

Expected result:

- `Jeremy Bowers` is identified.

### 10. Review The Suspect Interview

Action:

- Run:

```sql
SELECT * FROM InterviewLog WHERE PersonID = 67318
```

Talk track:

- This confirms the first suspect’s own words.
- It also sets up the first suspect theory check.

Expected result:

- The suspect interview rows return.
- `Evidence Board` has enough context for the first theory check.

### 11. Confirm The First Suspect

Action:

- Go to `Evidence Board`.
- Select `Jeremy Bowers`.
- Click `Test Theory`.

Talk track:

- The first theory check is controlled and deterministic.
- The app confirms the hired killer and opens the deeper trail.

Expected result:

- `First Suspect Confirmed` appears.
- The app transitions into the mastermind trail.

## Expansion Route

Use this section only if the audience wants the full case chain after the first suspect is confirmed.

### 12. Full Mastermind Profile

Action:

- Return to `Query Lab`.
- Run:

```sql
SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975
```

Talk track:

- The deeper transcript becomes the profile that drives the rest of the case.

Expected result:

- The transcript rows return for the mastermind trail.

### 13. Mastermind Identity Filters

Action:

- Run:

```sql
SELECT * FROM DriversLicense WHERE CarMake = 'BMW' AND CarModel = 'M8' AND Gender = 'female' AND HairColor = 'red' AND Height BETWEEN 65 AND 67
```

Talk track:

- The app shows how multiple constraints narrow a suspicious field to a small set of people.

Expected result:

- Two candidate license rows return.

### 14. Candidate Identity Resolution

Action:

- Run:

```sql
SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298 OR LicenseID = 857212
```

Talk track:

- The audience can see the app move from a filtered physical description to real people.

Expected result:

- `Miranda Priestly` and `Dani Rawley` appear as the remaining candidate identities.

### 15. Event Trail

Action:

- Run:

```sql
SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%'
```

Talk track:

- The investigation now follows the client trail through December events.

Expected result:

- December event rows return.

Action:

- Run:

```sql
SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%'
```

Talk track:

- This narrows the event trail to the meeting pattern.

Expected result:

- The Symphony event rows return.

Action:

- Run:

```sql
SELECT * FROM EventRegistration WHERE EventID IN (2669, 3005, 3257) AND EventPersonID IN (14307, 99716) ORDER BY EventID, EventPersonID
```

Talk track:

- This shows the shared event trail across both candidate identities.

Expected result:

- Six registration rows return.

### 16. Employment Tie-Break

Action:

- Run:

```sql
SELECT * FROM Employment WHERE SSN = 987756388 OR SSN = 362878596
```

Talk track:

- This is the final tie-break that separates the remaining candidates.
- The demo is showing how the app keeps the evidence chain deterministic.

Expected result:

- Two employment rows return with distinct salary and company details.

### 17. Confirm The Mastermind

Action:

- Return to `Evidence Board`.
- Select `Miranda Priestly`.
- Click `Test Theory`.

Talk track:

- The final theory check closes the case.
- The demo ends with the full chain of evidence holding together.

Expected result:

- `Mastermind Confirmed` appears.
- The case is closed.

## Backup Talking Points

- The backend owns query safety and execution.
- The frontend presents the learning flow and visual guidance.
- The app is local-first and intentionally read-only for learner SQL.
- Incorrect-path behavior is covered in automation, so the live presentation can stay focused on the intended learning path.

## Fallback Path

If the live runtime fails during the presentation:

- stop the live route early
- explain that the application is a local-first SQL learning environment and the failure is environmental, not part of the designed lesson
- switch to captured screenshots or clips only if they have already been prepared
- avoid improvising alternate product claims or showing unsupported features

If the browser fails but the backend is healthy, use the browser checks as evidence and stay focused on the documented demo route.
