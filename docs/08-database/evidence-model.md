# Evidence Model

## Purpose

This document describes the current evidence-oriented shape of `SequelCityCrimesDB` without exposing hidden answers.

## Evidence Principle

Evidence in this project is relational. Learners are expected to move between tables, compare attributes, and connect people, reports, events, and activity records through actual database relationships.

## Main Evidence Groups

### People Evidence

`PersonsOfInterest` is the central person-reference table.

It connects people to:

- driver and vehicle details through `DriversLicense`
- employment details through `Employment`
- interview records through `InterviewLog`
- club membership through `FitNFlabClub`
- event participation through `EventRegistration`

### Crime And Report Evidence

`CrimeType` and `CrimeSceneReport` establish the investigation context.

They support questions such as:

- what kind of crime was recorded
- when a report was logged
- which city the report references
- which later evidence items connect back to a report

### Witness And Interview Evidence

`InterviewLog` links a person to a specific crime scene report and stores transcript text.

This table acts as a bridge between:

- report-level evidence
- person-level evidence
- follow-up investigation paths

### Activity And Location Signals

The current schema includes activity-style evidence rather than a single dedicated location table.

Examples include:

- club check-in records in `FitNFlabClubCheckIn`
- address fields in `PersonsOfInterest`
- event dates and names in `EventSchedule`

These records help learners narrow people and timelines through cross-reference rather than direct answer lookup.

### Event Evidence

`EventSchedule` and `EventRegistration` show which people are associated with scheduled events.

This supports relational investigation patterns such as:

- matching people to events
- comparing dates across evidence sources
- narrowing candidate sets through participation records

## Investigation Flow

The current evidence model encourages a repeatable pattern:

1. start from a report, person, or activity clue
2. follow actual foreign key links
3. compare attributes across related tables
4. form a narrower evidence-backed hypothesis

## Spoiler Boundary

The schema includes spoiler-sensitive verification support, but that support is not restated here as a solution path. This document is limited to safe structural guidance.
