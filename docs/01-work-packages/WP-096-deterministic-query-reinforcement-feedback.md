# WP-096: deterministic-query-reinforcement-feedback

## Objective

Introduce deterministic student reinforcement feedback that helps learners understand whether their SQL queries are moving the investigation forward without solving the mystery for them.

This WP improves educational signal quality by providing lightweight deterministic guidance tied to query structure, evidence progression, and current investigation focus.

The goal is to help students answer:

- Did this query help?
- Did I narrow correctly?
- Did I identify relevant evidence?
- Am I still too broad?
- Did I connect the right records?
- What kind of refinement should I try next?

This system must remain deterministic, spoiler-safe, and learner-supportive.

The guiding principle is:

The system reinforces productive investigation behavior without solving the case.

---

## Scope

Add deterministic reinforcement feedback to the frontend query workflow using existing backend query results and deterministic investigation state.

This WP may modify:

- query execution response handling
- frontend investigation state derivation
- query feedback UI components
- student query workflow presentation
- deterministic feedback utilities
- tests
- user journey documentation

This WP may add small non-breaking backend metadata support only if absolutely necessary for deterministic feedback generation.

No runtime AI behavior.
No automatic suspect deduction.
No automatic case solving.

---

## Files Allowed to Change

Allowed:

- apps/web/src/features/**
- apps/web/src/components/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/api/src/routes/**
- apps/api/src/services/**
- apps/api/src/types/**
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/WP-096-deterministic-query-reinforcement-feedback.md

Do Not Modify:

- database/**
- docs/00-ssot/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- Reinforce learning without solving the case
- No runtime AI behavior
- No automatic suspect deduction
- No hidden automatic case completion
- No speculative gameplay systems
- No broad UI redesign

Architecture constraints:

- Backend remains authoritative for SQL validation and execution
- Frontend remains presentation-oriented
- Reinforcement logic must remain deterministic
- Feedback must derive from query metadata, deterministic clue state, and investigation progression
- Feedback must never reveal hidden suspect identities or direct solution paths
- Reinforcement must support SQL learning, not replace reasoning

Educational constraints:

- Feedback should guide reasoning quality
- Feedback should reinforce productive narrowing
- Feedback should avoid answer disclosure
- Feedback should encourage iteration
- Feedback should avoid becoming a hint engine
- Feedback should remain concise and actionable

UX constraints:

- Feedback should feel supportive, not punitive
- Feedback should be visually lightweight
- Feedback should not overwhelm the learner
- Feedback should integrate naturally into the query workflow
- Feedback should reinforce confidence and momentum

---

## Required Behavior

### 1. Deterministic Query Reinforcement Layer

Add a deterministic reinforcement layer that evaluates query usefulness based on existing deterministic state.

Possible inputs include:

- row count
- filtered vs unfiltered queries
- query structure
- table usage
- JOIN usage
- WHERE usage
- currently relevant case stage
- expected clue category
- milestone progression
- evidence alignment
- current investigation focus

Feedback must remain deterministic and explainable.

---

### 2. Reinforcement Categories

Support lightweight reinforcement categories such as:

- productive narrowing
- relevant evidence discovery
- overly broad results
- unrelated results
- incomplete evidence chain
- useful JOIN usage
- useful filtering
- investigation progress alignment

Do not implement:

- direct answer validation
- suspect confirmation
- automatic solution detection
- hidden mastermind inference
- AI-generated hints

---

### 3. Student-Facing Feedback Examples

Examples of acceptable reinforcement direction:

Positive reinforcement:

- You narrowed the result set successfully.
- This query identified relevant case records.
- Good use of filtering.
- This query connected related records correctly.
- You isolated a useful witness clue.

Productive redirection:

- This result set is still broad.
- Try narrowing by city, date, or report identifiers.
- These records do not appear connected to the current investigation focus yet.
- The query executed correctly, but the evidence chain is incomplete.

Do not provide:

- exact next SQL
- hidden table names not yet encountered
- direct solution paths
- suspect identity confirmation
- â€œcorrect answerâ€ language

---

### 4. Feedback Timing

Feedback should appear after query execution in a lightweight and readable way.

Feedback should:

- support iteration
- encourage reasoning
- reinforce momentum
- remain concise

Feedback must not interrupt query flow.

---

### 5. Alignment With Current Investigation Focus

Feedback should align with the current deterministic investigation stage.

Examples:

- early-stage guidance should reinforce narrowing and anchoring
- witness-stage guidance should reinforce relationship discovery
- later-stage guidance may reinforce cross-referencing and verification

Feedback must not prematurely reveal future clue chains.

---

### 6. Preserve Student Agency

Students must still:

- decide what to query
- decide how to refine
- interpret evidence
- connect clues
- determine investigative direction

The system must not become:

- an auto-solver
- an answer engine
- a step-by-step SQL generator

---

### 7. Visual Hierarchy

Feedback should visually support the existing workflow.

Priority order should remain:

1. Samuel guidance
2. Querying
3. Query results
4. Evidence notebook
5. Reinforcement feedback

Feedback should feel like supportive coaching, not the dominant UI element.

Preserve existing noir visual identity.

---

### 8. Tests

Add or update tests for:

- deterministic reinforcement generation
- broad-result feedback
- productive narrowing feedback
- relevant evidence feedback
- unrelated-result feedback
- current-focus alignment
- spoiler-safe behavior
- absence of direct-answer disclosure

Preserve existing tests.

---

### 9. Documentation

Update documentation to explain:

- deterministic reinforcement philosophy
- spoiler-safe reinforcement boundaries
- educational purpose of feedback
- learner agency preservation
- non-AI deterministic feedback model

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- deterministic query reinforcement feedback appears after query execution
- feedback remains concise and lightweight
- reinforcement aligns with current investigation focus
- productive narrowing receives positive reinforcement
- overly broad or unrelated queries receive constructive redirection
- no direct answers or suspect confirmation are revealed
- no runtime AI behavior introduced
- learner agency remains preserved
- SQL reasoning remains learner-owned
- feedback supports iteration without solving the case
- tests cover deterministic reinforcement behavior
- user journey documentation updated

---

## Code Prompt

You are implementing WP-096 for the Sequel City Web Detective project.

Objective:
Introduce deterministic reinforcement feedback that helps students understand whether their SQL queries are productive without solving the case for them.

Problem:
The application currently helps students understand what to investigate, but it does not provide enough reinforcement about whether their queries are effectively moving the investigation forward. Students need lightweight deterministic support that reinforces productive reasoning and query refinement while preserving learner agency.

Guiding principle:
The system reinforces productive investigation behavior without solving the case.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- No runtime AI behavior
- No automatic suspect deduction
- No automatic case solving
- No broad UI redesign

Before editing:

1. Read docs/00-ssot/SSOT-Investigation-State-Architecture.md
2. Review current query execution flow
3. Review current milestone and investigation focus derivation
4. Review current Evidence Notebook and Case Progress flow
5. Review query result rendering
6. Review investigation thread/current focus logic
7. Review existing tests for query execution and progression

Implement:

1. Deterministic reinforcement layer:

   - derive lightweight reinforcement from query metadata, row counts, query structure, milestone state, evidence alignment, and investigation focus
   - keep all logic deterministic and explainable
2. Reinforcement categories:

   - productive narrowing
   - useful filtering
   - useful JOIN usage
   - relevant evidence discovery
   - overly broad results
   - unrelated results
   - incomplete evidence chain
   - investigation alignment
3. Student-facing feedback:

   - concise
   - supportive
   - spoiler-safe
   - actionable without revealing answers
4. Query workflow integration:

   - display reinforcement after query execution
   - keep it visually lightweight
   - do not interrupt query flow
   - preserve existing noir visual identity
5. Investigation alignment:

   - align reinforcement with the current investigation stage
   - avoid revealing future clue chains
6. Tests:

   - add or update tests for reinforcement generation and spoiler safety
7. Documentation:

   - update docs/10-user-journey and any relevant architecture docs

Do not:

- generate SQL automatically
- reveal exact next queries
- confirm suspect identities
- reveal direct solution paths
- implement runtime AI systems
- introduce speculative gameplay systems
- convert reinforcement into a hint engine

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- learner agency
- mentor-guided investigation tone
- local-first architecture

Keep the implementation focused, deterministic, educational, spoiler-safe, and lightweight.

---

## Gemini Audit Prompt

Audit WP-096 deterministic query reinforcement feedback implementation.

Verify:

1. Only approved files were modified.
2. No database scripts changed.
3. No runtime AI behavior was introduced.
4. No automatic suspect deduction was introduced.
5. No automatic case solving was introduced.
6. Reinforcement feedback is deterministic and explainable.
7. Reinforcement appears after query execution.
8. Feedback remains concise and lightweight.
9. Productive narrowing receives positive reinforcement.
10. Overly broad or unrelated queries receive constructive redirection.
11. Feedback aligns with current investigation focus.
12. Feedback does not reveal direct answers or future clue chains.
13. Learner agency remains preserved.
14. SQL reasoning remains learner-owned.
15. Tests were added or updated for reinforcement behavior.
16. Documentation was updated.

Specifically validate:

- reinforcement generation logic
- spoiler-safe behavior
- current-focus alignment
- broad-result handling
- relevant-evidence handling
- query workflow integration
- frontend/backend boundaries
- deterministic implementation
- visual hierarchy
- test coverage

Flag:

- direct-answer disclosure
- suspect confirmation
- hidden solution inference
- AI-like behavior
- hint-engine behavior
- excessive feedback verbosity
- reinforcement overwhelming the workflow
- frontend/backend boundary violations
- spoiler disclosure risks
- missing tests

---

## Code Results

WP-096 complete and committed as `5ae1233` on `main`.

**Summary of what changed:**

- New feature module `apps/web/src/features/queryReinforcement/` with a deterministic generator that maps milestone state to a structural investigation stage and produces one short, spoiler-safe signal per executed query.
- Categories supported: productive-narrowing, useful-filtering, useful-join (positive and broad-redirect variants), overly-broad, unrelated-results, incomplete-chain, investigation-alignment.
- Wiring through `useStudentCaseState` ΓåÆ `App.tsx` ΓåÆ `StudentWorkbenchView.tsx` ΓåÆ `QueryRunner.tsx`, where the panel renders below the result table for the student audience only, using a lightweight noir-themed `.query-reinforcement` style.
- Tests: 76 total passing. New `generateReinforcement.test.ts` covers each category, the stage-derivation rules, and a spoiler-safety sweep across stages ├ù representative SQL ├ù row-count tiers. `QueryRunner.test.tsx` adds render/non-render smoke tests.
- Docs: new `docs/10-user-journey/query-reinforcement-feedback.md` plus cross-references from `README.md`, `query-feedback-loop.md`, and `docs/06-architecture/frontend-backend-boundaries.md`.
- WP-096 Code Results section filled in with implementation and verification notes.

No backend changes, no schema changes, no new dependencies, no runtime AI, no automatic suspect deduction.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/features/**
- apps/web/src/components/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/app.tsx
- apps/web/src/styles.css
- apps/api/src/routes/**
- apps/api/src/services/**
- apps/api/src/types/**
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/wp-096-deterministic-query-reinforcement-feedback.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- database/**
- docs/00-ssot/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**

Modified files
--------------
- None

Out-of-scope files
------------------
- None

## Gemini Audit Results

WP-096: Deterministic Query Reinforcement Feedback - Audit Results

The audit of WP-096 is **complete**. The implementation is fully compliant with the project's deterministic architecture and educational goals.

### Audit Summary

- **Determinism:** The reinforcement layer is strictly deterministic. Logic in `generateReinforcement.ts` uses hardcoded rules based on query metadata, row counts, and milestone state. **No AI was introduced.**
- **Spoiler Safety:** Feedback messages are structural and generic (e.g., "Stay with the crime catalog"). They avoid naming suspects, revealing hidden answer rows, or suggesting the next exact SQL. Unit tests explicitly sweep for spoiler terms.
- **Visual Hierarchy:** Feedback is correctly positioned below the query results and styled with a lightweight noir theme (`.query-reinforcement`). It is supportive and subordinate to Samuel's primary guidance.
- **Architecture:** The implementation respects frontend/backend boundaries. Reinforcement is a presentation concern and does not affect authoritative case state or SQL validation.
- **Educational Quality:** The system effectively rewards productive narrowing (positive tone) and redirects overly broad or unrelated queries (redirect tone) without solving the case for the student.

### Verified Checklist

1.  [x] **Only approved files modified:** Changes confined to `apps/web/src/features/**`, `hooks`, `components`, `App.tsx`, `styles.css`, and `docs`.
2.  [x] **No database scripts changed:** Database folder untouched.
3.  [x] **No AI behavior:** Logic is entirely rule-based and deterministic.
4.  [x] **No auto-deduction/solving:** Signals do not confirm suspects or solve milestones.
5.  [x] **Timing:** Feedback appears immediately after successful query execution.
6.  [x] **Tone & Alignment:** Signals align with the current investigation stage (`deriveInvestigationStage`).
7.  [x] **Tests:** Comprehensive coverage in `generateReinforcement.test.ts`, including spoiler-safety checks.
8.  [x] **Documentation:** Fully updated in `docs/10-user-journey/query-reinforcement-feedback.md` and `docs/06-architecture/frontend-backend-boundaries.md`.

### Final Verdict: **PASS**

## Final Decision

Approved. Deterministic query reinforcement feedback is implemented as a self-contained frontend feature module. The `generateReinforcement` function maps milestone state to a structural investigation stage and emits one concise, spoiler-safe signal per executed query across seven categories: productive-narrowing, useful-filtering, useful-join, overly-broad, unrelated-results, incomplete-chain, and investigation-alignment. The signal renders as a lightweight `role=status` panel below the result table in `QueryRunner` for the student audience only. No backend changes, no schema changes, no new dependencies, no runtime AI, no automatic suspect deduction. Scope check PASS. Gemini audit: PASS with all 8 checklist items verified, no flags.


