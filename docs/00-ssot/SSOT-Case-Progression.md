# SSOT Case Progression

## Principle

Case progression must be deterministic and database-backed. Verified SQL query results and deterministic result-pattern checks are the only valid progression triggers. AI is not part of the initial runtime, and any future advisory AI must not decide whether the learner has solved the case.

## Learner Flow

1. Read the case briefing.
2. Inspect the schema.
3. Query crime scene records.
4. Identify relevant witnesses.
5. Read interview evidence.
6. Follow membership, license, event, employment, or other evidence trails.
7. Identify the murderer.
8. Use the murderer's interview evidence to identify the mastermind.
9. Verify suspects using the database-backed verification flow.
10. Submit final conclusion.

## Milestone Model

| Milestone | Meaning |
|---|---|
| CaseStarted | Learner opened the case |
| SchemaViewed | Learner viewed schema metadata |
| CrimeSceneQueried | Learner queried crime scene records |
| RelevantCrimeFound | Learner retrieved the murder report for the target date and city |
| WitnessTrailFound | Learner retrieved evidence pointing to witnesses |
| WitnessInterviewViewed | Learner retrieved relevant interview transcript evidence |
| MurdererCandidateFound | Learner retrieved evidence identifying a likely murderer |
| MurdererVerified | Learner verified the murderer through the solution flow |
| MastermindTrailFound | Learner retrieved evidence pointing beyond the murderer |
| MastermindVerified | Learner verified the mastermind through the solution flow |
| CaseClosed | Learner completed final conclusion |

## Evidence Detection

Valid sources include returned rows from approved SQL queries, deterministic result-pattern checks derived from approved SQL results, explicit suspect submissions, database-backed solution verdicts, and learner notebook entries when used for documentation rather than correctness.

Invalid sources include AI claims, prompt text alone, UI state alone, and unverified free-text guesses.

Database-backed evidence is authoritative. AI must not determine correctness, advance case state, invent schema, invent data, or override database results.

## Initial Implementation Guidance

For WP-001, implement only database connectivity and schema access. Do not implement full case progression yet.

The initial case experience for Sequel City Web Detective must remain self-contained, locally hosted, and independent from DataQuest or any external runtime service.
