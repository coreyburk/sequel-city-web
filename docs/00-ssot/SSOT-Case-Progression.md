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

Case 001 (`The Clocktower Poisoning`) begins with the recorded crime foundation boundary `case-001-crime-type-identified`. The learner first runs `CrimeType`, identifies the Murder row and its `CrimeID`, then carries that observed value into `CrimeSceneReport` before following witness records. The report and linked-interview boundaries remain backend-approved read-only SQL milestones after that foundation step.

The base seed data now includes the public `CrimeType` Murder row and the public `CrimeSceneReport` fixture for the clocktower ceremony poisoning report. Deterministic backend result-pattern validators recognize the ordered Case 001 boundaries `case-001-crime-type-identified`, `case-001-clocktower-report-located`, and `case-001-report-interviews-located` from backend-approved read-only SQL results. The validators use public result fields only and return non-spoiler match metadata; frontend state, query text, localStorage, AI output, and prompts do not advance milestones.

Case 001 is released through the shared student shell with ordered foundation, report and interview metadata consumption and case-specific browser persistence. Saved query references are re-executed before visible progress is restored. Durable backend attempt progression is not yet implemented. The released completion boundary is evidence review, with no suspect verification or culprit-resolution claim. UI flags, localStorage and free-text guesses are not database proof.

## Evidence Detection

Valid sources include returned rows from backend-approved read-only SQL queries, deterministic result-pattern checks derived from approved SQL results, explicit suspect submissions, database-backed solution verdicts, and learner notebook entries when used for documentation rather than correctness.

Invalid sources include AI claims, prompt text alone, UI state alone, and unverified free-text guesses.

Database-backed evidence is authoritative. AI must not determine correctness, advance case state, invent schema, invent data, or override database results.

## Initial Implementation Guidance

Full case progression should be added only through scoped work packages after backend SQL safety and query execution boundaries exist. Do not infer progression authority from UI state, prompt text, or future advisory AI concepts.

The initial case experience for Sequel City Web Detective must remain self-contained, locally hosted, and independent from DataQuest or any external runtime service.

## Case runtime transition contract (WP-286)

Status: target contract pending independent design audit and human acceptance; no new runtime behavior is claimed.

Target step eligibility requires actual backend execution proof plus authored query/log/verify completion semantics. Case 001 keeps its released three ordered query milestones and evidence-review boundary. Case 004 migration must cover the complete parity matrix, including witness sets, identity sets, profile categories, event comparison and employment tie-break. SQL text/draft shape is not proof.

Detailed interfaces and bootstrap responsibilities: [Case Runtime Contracts](../15-case-plans/CASE-RUNTIME-CONTRACTS.md). Case 004 gates: [Runtime Parity Matrix](../15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md). Implementation sequence: WP-287 foundation, WP-288 Case 001, WP-289 Case 004, WP-290 authoring/cleanup. This section governs the proposed transition; existing behavior remains identified above until implementation and release verification.
