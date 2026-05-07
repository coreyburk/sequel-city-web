# Table Reference

## Scope

This reference covers the actual tables created by the checked-in `SequelCityCrimesDB` scripts. Descriptions stay concise and spoiler-safe.

| Table | Purpose | Investigation Role | Notable Relationships | Usage Notes |
|---|---|---|---|---|
| `CrimeType` | Stores crime categories and descriptions | Provides report classification context | Referenced by `CrimeSceneReport.CrimeID` | Useful for understanding the type of report being investigated |
| `CrimeSceneReport` | Stores crime scene report records | Common starting point for timeline and narrative clues | References `CrimeType`; referenced by `InterviewLog` | Connects crime context to later interview evidence |
| `DriversLicense` | Stores physical and vehicle details | Supports person identification and filtering | Referenced by `PersonsOfInterest.LicenseID` | Often used to narrow people by descriptive attributes |
| `PersonsOfInterest` | Stores people relevant to the case | Central person record used across many joins | References `DriversLicense` and `Employment`; referenced by `InterviewLog`, `EventRegistration`, and `FitNFlabClub` | Core table for moving from clues to related evidence |
| `EventSchedule` | Stores scheduled events | Provides event names and dates for timeline comparison | Referenced by `EventRegistration.EventID` | Best used together with registrations rather than alone |
| `EventRegistration` | Stores person-to-event links | Connects people to event participation | References `PersonsOfInterest` and `EventSchedule` | Useful for proving attendance or narrowing event-related candidates |
| `FitNFlabClub` | Stores club membership records | Connects people to membership status and club activity | References `PersonsOfInterest`; referenced by `FitNFlabClubCheckIn` | Serves as a bridge between people and check-in evidence |
| `FitNFlabClubCheckIn` | Stores check-in and check-out records | Adds activity timing evidence | References `FitNFlabClub.FitMemberID` | Useful for date and time filtering without revealing conclusions |
| `Employment` | Stores job and income data | Supports profile comparison and narrowing | Referenced by `PersonsOfInterest.SSN` | Often paired with person records rather than queried in isolation |
| `InterviewLog` | Stores interview transcript records | Holds narrative evidence tied to people and reports | References `PersonsOfInterest` and `CrimeSceneReport` | Important evidence source, but still requires relational cross-checking |
| `Solution` | Stores suspect attempt and verdict records | Supports deterministic verification behavior in the database scripts | No checked-in foreign key relationships | Spoiler-sensitive table; do not treat it as general learner exploration guidance |

## Notes

- all listed tables come from the checked-in create script
- the current scripts place these tables in the default `dbo` schema
- the backend schema endpoint exposes actual metadata rather than this summary text
