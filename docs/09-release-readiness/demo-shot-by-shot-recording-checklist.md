# Demo Shot-By-Shot Recording Checklist

## Purpose

Use this checklist to record a slow, clean demo video from the drafted faculty route.

The goal is not to show speed. The goal is to show each state clearly enough that a viewer can follow the investigation without guessing what changed.

## Recording Rules

- Record the live browser only. Do not record the desktop if it adds clutter.
- Keep the cursor visible.
- Pause briefly after each navigation and after each query result appears.
- Use one shot per state change when possible.
- Prefer clean cuts over rushed mouse movement.
- Do not improvise new route steps while recording.
- If a shot fails, re-record that shot rather than carrying the mistake forward.

## Suggested Capture Settings

- Resolution: 1080p or higher
- Aspect ratio: 16:9
- Audio: on if narration is recorded live, otherwise mute and add voiceover later
- Pace: slow enough that each action is readable on screen
- Browser zoom: leave at the default unless the UI is too small to read

## Shot List

| Shot | Screen State | Action | Narration Cue | Pace Check |
|---|---|---|---|---|
| 1 | App launch / browser ready | Show the local app opening and landing on the case library | State that this is the local, case-driven entry point | Wait for the page to fully settle before moving on |
| 2 | Case library | Highlight that Case 004 is available | Explain that the demo starts from the case shelf, not a blank dashboard | Hold on the library long enough for the title and case card to be readable |
| 3 | Case 004 landing page | Click `Select Case 004: The SQL City Murder` | Explain that the case has its own landing page and framing | Pause after the landing page loads |
| 4 | Case 004 briefing | Click `Open Case File` | Explain that the investigation begins inside the case file | Leave the briefing on screen long enough to read the case context |
| 5 | Query Lab | Open Query Lab and show the query editor | Explain that the learner writes read-only SQL and gets deterministic feedback | Make sure the editor and results area are both visible |
| 6 | Crime type result | Run `SELECT * FROM CrimeType` | Explain that the investigation starts by identifying the crime category | Pause after the result renders |
| 7 | Crime scene result | Run `SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'` | Explain that the report is narrowed to the correct incident | Keep the returned row visible before typing the next query |
| 8 | Witness trail | Run `SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID` | Explain that the evidence moves from the report into witness testimony | Hold long enough to show the witness rows and names |
| 9 | Case File pinning | Open Case File and pin the witness names `14887` and `16371` | Explain that the evidence is being organized for reuse | Leave the pinned facts visible before advancing |
| 10 | Gym lead | Run `SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'` | Explain that the suspect trail is now constrained by evidence | Pause after the lead appears |
| 11 | First suspect | Run `SELECT * FROM PersonsOfInterest WHERE PersonID = 67318` | State that this identifies `Jeremy Bowers` | Keep the result visible long enough to read the name |
| 12 | Suspect interview | Run `SELECT * FROM InterviewLog WHERE PersonID = 67318` | Explain that the suspect’s own statement becomes the next clue | Pause before moving to the theory check |
| 13 | Theory check | Open Evidence Board, select `Jeremy Bowers`, and click `Test Theory` | Explain that the first suspect is confirmed by the app | Hold on the confirmation state until the success message is clear |
| 14 | Mastermind path, optional | Continue through the deeper queries only if the recording needs the full chain | Explain that the app can follow the remaining evidence trail | Use the expansion route only when it helps the final video |
| 15 | Closeout | Show the confirmed end state and stop recording cleanly | State that the case is solved | End on a stable screen, not mid-navigation |

## Capture Notes

- If narration is live, record a short sentence before each shot and keep it aligned to the visible state.
- If narration is added later, leave a short silent pause between shots to make editing easier.
- Avoid mouse scrubbing, dead air during page loads, and repeated typing errors.
- Do not record incorrect-path detours in the presentation video. Those belong in automation, not the faculty demo cut.

## Assembly Order

1. Start with the app launch and case library.
2. Record the core route through first suspect confirmation.
3. Record the optional mastermind continuation only if the final video needs it.
4. Keep the closing shot short and stable.

## Editing Rule

The final cut should read like a guided walkthrough, not a live troubleshooting session.
