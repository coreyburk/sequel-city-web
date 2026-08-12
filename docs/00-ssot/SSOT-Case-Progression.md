# SSOT Case Progression

## Principle

Case progression must be deterministic and database-backed. Verified SQL query results and deterministic result-pattern checks are the only valid progression triggers. AI is not part of the initial runtime, and any future advisory AI must not decide whether the learner has solved the case.

## Document Scope

This document owns investigation milestones, valid progression triggers, evidence detection rules, and suspect verification authority. SQL validation rules are owned by `SSOT-SQL-Safety-Rules.md`. Runtime layering is owned by `SSOT-Architecture.md`.

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

## Case-Specific Planned Boundaries

Future SQL milestone definitions must follow the case-authoring contract in `SSOT-Case-Authoring.md` before they are released or wired into runtime progression. That contract requires declared evidence table families, non-spoiler learner objectives, deterministic backend/result-pattern validation ownership, and explicit rejection of UI-only or AI-driven progression authority.

Case 001 (`The Clocktower Poisoning`) declares its first SQL-backed milestone boundary as `case-001-clocktower-report-located`. The learner-facing objective is to locate the public clocktower incident report through backend-approved read-only SQL query results before following witness or access records. The current schema-backed starting table family for this boundary is `CrimeSceneReport`. Case 001 also has a filled pre-release authoring definition that records this planned boundary without implementing runtime progression.

The base seed data now includes one public `CrimeSceneReport` fixture for the clocktower ceremony poisoning report. That row gives a future deterministic result-pattern validator a database-backed target for `case-001-clocktower-report-located`, but the validator and runtime milestone completion remain unimplemented.

This boundary is not implemented runtime progression. It does not release Case 001, render Query Lab for Case 001, persist Case 001 state, log Case 001 clues, or authorize suspect verification. Future completion of this boundary must be owned by deterministic backend/result-pattern logic over approved SQL results. UI state, skeleton selections, localStorage, AI output, prompt text, and free-text guesses are not valid progression authority.

## Evidence Detection

Valid sources include returned rows from backend-approved read-only SQL queries, deterministic result-pattern checks derived from approved SQL results, explicit suspect submissions, database-backed solution verdicts, and learner notebook entries when used for documentation rather than correctness.

Invalid sources include AI claims, prompt text alone, UI state alone, and unverified free-text guesses.

Database-backed evidence is authoritative. AI must not determine correctness, advance case state, invent schema, invent data, or override database results.

## Initial Implementation Guidance

Full case progression should be added only through scoped work packages after backend SQL safety and query execution boundaries exist. Do not infer progression authority from UI state, prompt text, or future advisory AI concepts.

The initial case experience for Sequel City Web Detective must remain self-contained, locally hosted, and independent from DataQuest or any external runtime service.
