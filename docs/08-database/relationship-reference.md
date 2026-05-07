# Relationship Reference

## Scope

This reference covers the actual checked-in foreign key relationships for `SequelCityCrimesDB`.

## Actual Relationships

| Source | Target | Purpose |
|---|---|---|
| `CrimeSceneReport.CrimeID` | `CrimeType.CrimeID` | Connects each report to a crime category |
| `PersonsOfInterest.LicenseID` | `DriversLicense.LicenseID` | Connects a person to driver and vehicle details |
| `PersonsOfInterest.SSN` | `Employment.SSN` | Connects a person to employment details |
| `InterviewLog.PersonID` | `PersonsOfInterest.PersonID` | Connects an interview to a person |
| `InterviewLog.ReportID` | `CrimeSceneReport.ReportID` | Connects an interview to a report |
| `EventRegistration.EventPersonID` | `PersonsOfInterest.PersonID` | Connects an event registration to a person |
| `EventRegistration.EventID` | `EventSchedule.EventID` | Connects an event registration to an event |
| `FitNFlabClub.PersonID` | `PersonsOfInterest.PersonID` | Connects a club membership record to a person |
| `FitNFlabClubCheckIn.FitMemberID` | `FitNFlabClub.FitMemberID` | Connects a check-in record to a membership record |

## Investigation Patterns

These relationships support safe evidence traversal patterns such as:

- report to interview to person
- person to license details
- person to employment details
- person to club membership to check-in activity
- person to event registration to event schedule

## Safe Traversal Examples

These are structural examples, not case-solving instructions:

- start with `CrimeSceneReport`, then join to `InterviewLog` to see which people are tied to a report
- start with `PersonsOfInterest`, then join to `DriversLicense` or `Employment` to compare identifying attributes
- start with `FitNFlabClub`, then join to `FitNFlabClubCheckIn` to inspect activity records
- start with `EventRegistration`, then join to `EventSchedule` to inspect event participation timing

## Relationship Boundaries

- only checked-in foreign key relationships are documented here
- no inferred relationship is treated as authoritative unless it exists in the schema
- the absence of a foreign key in this document should not be replaced with guessed linkage
