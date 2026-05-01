# SSOT Database Schema

## Database Name

`SequelCityCrimesDB`

## Database Source Scripts

- `01-SequelCityCrimesDB - Create DB.sql`
- `02-SequelCityCrimesDB - Insert Data.sql`
- `03-SequelCityCrimesDB - ForeignKeys.sql`
- `SequelCityCrimesDB - AnswerKey.sql`

## Tables

| Table | Purpose |
|---|---|
| CrimeType | Defines crime categories used by crime scene reports |
| CrimeSceneReport | Stores crime report entries |
| DriversLicense | Stores physical and vehicle details |
| PersonsOfInterest | Stores people who may be suspects, witnesses, or other relevant persons |
| InterviewLog | Stores interview transcripts linked to people and reports |
| FitNFlabClub | Stores fitness club membership records |
| FitNFlabClubCheckIn | Stores fitness club check-in and check-out records |
| Employment | Stores employment and income records |
| EventSchedule | Stores scheduled events |
| EventRegistration | Links people to events |
| Solution | Supports deterministic suspect verification |

## Key Relationships

- `CrimeSceneReport.CrimeID` to `CrimeType.CrimeID`
- `PersonsOfInterest.LicenseID` to `DriversLicense.LicenseID`
- `PersonsOfInterest.SSN` to `Employment.SSN`
- `InterviewLog.PersonID` to `PersonsOfInterest.PersonID`
- `InterviewLog.ReportID` to `CrimeSceneReport.ReportID`
- `EventRegistration.EventPersonID` to `PersonsOfInterest.PersonID`
- `EventRegistration.EventID` to `EventSchedule.EventID`
- `FitNFlabClub.PersonID` to `PersonsOfInterest.PersonID`
- `FitNFlabClubCheckIn.FitMemberID` to `FitNFlabClub.FitMemberID`

## Schema Access Rules

The application may expose schema metadata to learners, but must expose only actual database tables and columns. AI agents must use schema metadata retrieved from the backend or SSOT. They must not invent tables, columns, or relationships.

## Spoiler Control

The answer key must not be exposed in the learner interface. Suspect verification should return the database-backed verdict without exposing the full answer key source script.
