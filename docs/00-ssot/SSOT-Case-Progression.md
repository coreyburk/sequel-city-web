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

## Case 001 progression authority after WP-288

The protected backend owns the three query-mode steps: identify Murder in CrimeType, isolate one matching clocktower CrimeSceneReport row, then retrieve the linked InterviewLog accounts for its proved ReportID. Existing Case 001 result patterns are retained and compared against canonical database records. Merely including a target report in a multi-row result does not complete the report task. Broad/unlinked interview results, literal lookalikes, wrong report identifiers, frontend completion flags and imported workspace cannot establish proof.

Each accepted proof/action is durable, pins case/content/evidence versions and checks the current owned attempt revision in a transaction. Resolve the lowest incomplete step whose prerequisites all have proof. Notebook logging references a backend action/row and does not add another progression gate to query-mode steps. Repository failure or an execution race leaves returned rows visible with progressSaved=false and no new proof. Completion is released evidence review, not solved culprit verification. WP-289 migrates Case 004 to the protected runtime and the same student page; independent audit and acceptance remain pending.
## Case 004 progression implementation (WP-289)

The authored sixteen-step path and prerequisites are in app.CaseStep and app.CaseStepPrerequisite. Safe query execution, explicit selected-row logging and controlled verification have distinct completion modes. AttemptEvidenceItem persists distinct observations while collections are incomplete; only AttemptStepEvidence establishes completed prerequisites. Witness bundles/identities, profile categories, license candidates/identities and event collections survive reload. Duplicate logs do not add notes or observations. Attendance compares both candidates against all three proved events; employment keeps the ambiguity lesson and requires both earned SSNs before the wealth tie-break. The trigger-man verdict opens the hiring-person trail; only the final mastermind verdict completes the full investigation.

Canonical learner-pool re-reads verify evidence identity and returned values. Literal projections, unrelated sources/identifiers, incomplete collections, unearned roles, wrong owners and stale revisions cannot create proof. Report matching uses database-authored briefing city/date and the earned crime identifier. Typed fact definitions and task bindings control token labels, columns and provenance. Hints, token clicks, imported legacy progress flags, notebook prose and drafts never advance the path.
## Query feedback and progression authority

Structured query feedback explains execution separately from evidence progress. Safe technical error codes, public schema, actual result counts and existing current-task validator outcomes determine the explanation. A successful statement, a single row or a token click never establishes proof by itself. Empty results suggest checking observed values without supplying unseen answers; broad inspection results are not automatically errors. Logging, distinct collections, prerequisites and completion continue to use the protected runtime's canonical evidence and saved revision checks.

One shared Query Lab status area presents the outcome and a next action. Partial/duplicate evidence, progress-save failure and released-review completion are distinguished. No runtime AI, automatic query rewriting, extra proof engine or case-specific frontend feedback rule is introduced. Detailed response and privacy boundaries are defined in CASE-RUNTIME-CONTRACTS.md under Query attempt feedback.
