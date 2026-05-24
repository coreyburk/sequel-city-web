# WP-131: Suspect Interview Pacing and Theory Check Placement

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-05-24

## Goal

Fix the suspect-identification-to-theory flow so students review the gym-linked suspect's interview evidence before the application invites them to test a theory, while also making the scaffolding more consistent and less over-solved.

## Problem Statement

The progression became too eager once the gym-linked person was identified:

- the application introduced theory-testing language before the student had reviewed the suspect's own interview statements
- the Query Runner sometimes auto-drafted full queries even when lighter guidance would be more appropriate
- the suspect-interview phase, theory-check phase, and early mastermind transition were not cleanly separated
- the theory check appeared in Query Lab too early and risked revealing the answer path before the student had earned it
- the scaffolding pattern was inconsistent: full queries, partial queries, and clue-only hints were mixed in ways that weakened the learning progression

## Desired Outcomes

- the student identifies the gym-linked person first, then intentionally reviews that person's `InterviewLog`
- Samuel's guidance does not mention theory testing until the suspect interview has actually been reviewed
- Query Runner guidance for the suspect interview uses light scaffolding, not a fully drafted query
- the theory check is withheld until the student has completed the suspect-interview step
- the theory-check UI reads as an Evidence Board commitment rather than an always-present Query Lab widget

## Scope

### 1. Suspect interview pacing

- add an explicit step between `suspect candidate identified` and `test theory`
- treat that step as: review the suspect's interview transcript before deciding whether the case still supports suspicion
- ensure Case Progress and Samuel's guidance reflect that new order

### 2. Scaffolding consistency

- remove unnecessary full-query drafting in the suspect interview phase
- keep Query Runner guidance to table / column / pinned-value hints where possible
- reserve full query drafts for onboarding recovery or clearly exceptional situations

### 3. Theory-check placement

- stop surfacing `Suspect Theory Check` before the suspect interview review is complete
- move the theory-check interaction to the Evidence Board so it reads as a deliberate commitment rather than an always-present next widget

### 4. UI cleanup

- normalize the visual weight of the suspect clue heading and related labels
- ensure `What to Do Next` contains forward guidance, not reactionary status text

## Out of Scope

- mastermind clue extraction / profile-building after the hired-killer theory has been confirmed
- new mastermind-transition scene artwork
- bootstrap / admin upgrade behavior
- admin editing of suspect identities

## Acceptance Criteria

- after the gym-linked suspect is identified, Samuel directs the student to review the suspect's interview first
- the student is not prompted to test a theory until the interview-review step is complete
- the suspect interview phase uses light guidance rather than a fully drafted query
- the theory-check surface no longer appears prematurely in Query Lab
- Case Progress shows the suspect interview review as a distinct step before theory testing

## Verification

- walkthrough from gym lead identification to suspect theory check
- confirm Samuel's `What to Prove` / `What to Do Next` stay phase-appropriate
- confirm Query Runner does not auto-fill a full suspect interview query
- confirm theory-check UI only appears after interview review
- confirm web tests and build remain green

## Codex Results

Implemented the suspect-interview pacing correction in the live app rather than trying to peel the flow backward.

Summary:

- added an explicit `suspect-interview` milestone between gym-linked suspect identification and `trigger-check`
- removed the premature theory-check panel from Query Lab
- moved `Suspect Theory Check` onto the Evidence Board so it reads as a deliberate commitment after evidence review
- cleared the old auto-filled suspect interview query after the gym-linked person is logged, returning the student to light guidance instead of a solved draft
- rewrote the post-gym Query Runner instruction so it tells the student to stay with `InterviewLog`, use the pinned `PersonID`, and read what the suspect actually said before deciding what it proves
- rewrote Samuel's suspect-interview guidance and current-step cards so `What to Do Next` is forward guidance instead of a response
- updated the suspect-interview completion handoff so students are told to switch to Evidence Board only if the transcript still supports the case against him
- expanded Case Progress so suspect interview review is a distinct step before theory testing

Changed files:

- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-131-suspect-interview-pacing-and-theory-check-placement.md`

Verification:

- `npm run test --workspace apps/web` passed with `152/152` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Prompt

Audit the suspect-interview pacing and theory-check placement flow.

Verify all of the following:

1. After the gym-linked suspect is identified, the next required step is reviewing that suspect's `InterviewLog`, not immediately testing a theory.
2. Query Runner guidance in the suspect-interview phase uses light scaffolding instead of auto-filling a full query.
3. `What to Do Next` language is genuine forward guidance, not reactive status text.
4. `Suspect Theory Check` no longer appears prematurely in Query Lab.
5. The theory-check interaction now lives on the Evidence Board and feels like a deliberate commitment after evidence review.
6. Case Progress shows the suspect interview review as a distinct step before theory testing.

## Gemini Audit Results

Audit passed.

Confirmed points:

- the flow inserts a real suspect-interview phase between gym-linked suspect identification and theory testing
- Query Runner guidance during suspect interview review uses light scaffolding rather than auto-filling a solved query
- `What to Do Next` language stays phase-appropriate and forward-looking
- `Suspect Theory Check` is withheld from Query Lab during interview review
- the theory-check interaction now lives on Evidence Board and reads as a deliberate detective commitment
- Case Progress shows the suspect interview review as a distinct step before theory testing

## Final Decision

Accepted.

The suspect-interview phase now cleanly separates evidence review from theory commitment, and the scaffolding is more disciplined than the earlier over-solved flow.
