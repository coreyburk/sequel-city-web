# WP-134: Phase Transcript Access and Reduce Repeated Query Churn

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-26

## Objective

Improve case pacing by preventing students from seeing incriminating suspect interview rows too early, while also reducing the need to re-enter the same `InterviewLog` query multiple times across closely related investigation phases.

## Scope

### In Scope

- redesign the witness-to-suspect-to-mastermind transcript progression in the app
- prevent early witness-review steps from exposing the killer's later-stage interview evidence
- keep a valid `InterviewLog` result set alive across related clue-review phases instead of forcing repeated query re-entry
- clarify the chapter boundaries between:
  - witness statements
  - gym lead review
  - suspect interview review
  - mastermind transcript mining
- update Samuel's guidance and Query Lab behavior so the student understands when they are reviewing witness evidence versus suspect evidence

### Out of Scope

- changing the underlying SQL database schema
- altering the accepted murderer/mastermind answers
- Admin Mode or bootstrap work
- packaging/distribution work
- major redesign of the notebook visuals

## Files Allowed to Change

Allowed:

- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/features/queryReinforcement/**`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-134-phase-transcript-access-and-reduce-repeated-query-churn.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `package-lock.json`

## Constraints

- do not reveal Jeremy Bowers' incriminating interview rows during the early witness-review phase
- do not rely on raw text redaction hacks if phased progression logic can solve the problem more cleanly
- preserve student freedom to explore, but do not reward phase-skipping by surfacing later-stage confessions too early
- reduce repeated-query re-entry only when the student is still working from the same data source and same earned context
- keep the case-config-driven naming behavior intact

## Required Behavior

- witness-review guidance must focus on witness testimony first, without effectively giving away the killer confession trail
- Jeremy's `InterviewLog` rows should become the active review target only after the gym lead is established
- mastermind transcript mining should become the active review target only after Jeremy is confirmed
- if the student is still working from the same earned `InterviewLog` result set, the app should preserve that review context instead of making them rebuild the same query from scratch
- Samuel's guidance must clearly distinguish between:
  - witness statements that create leads
  - suspect interview rows that confirm or deepen a lead
  - mastermind transcript rows that build the hidden-client profile

## Acceptance Criteria

- [x] The early witness-review phase no longer exposes the killer's later confession trail in a way that undercuts the narrative
- [x] The student does not need to re-enter the same `InterviewLog` query multiple times just to collect different clues from the same earned row set
- [x] Samuel's guidance clearly signals when the investigation has shifted from witness evidence to suspect interview review
- [x] Samuel's guidance clearly signals when the investigation has shifted from suspect confirmation to mastermind transcript mining
- [x] The change stays within the allowed frontend files and does not modify unrelated infrastructure

## Code Prompt

Implement WP-134 exactly as scoped.

Requirements:

- restructure transcript progression so the app respects narrative pacing
- reduce repeated-query churn when the student is still working from the same valid transcript set
- preserve student agency while preventing premature reveal of later-stage evidence
- keep guidance explicit about what type of evidence the student is reviewing at each phase

Return:

- exact files changed
- summary of the new transcript progression model
- verification performed

## Audit Prompt

Audit WP-134 for narrative pacing, scaffold discipline, and transcript-phase separation.

Verify:

1. Early witness-review steps no longer expose suspect confession evidence too soon.
2. The app clearly separates witness statements, suspect interview review, and mastermind transcript mining.
3. The student no longer has to re-enter the same `InterviewLog` query repeatedly when working from the same earned result set.
4. Samuel's guidance reflects the current evidence chapter instead of foreshadowing later phases.
5. The implementation stays within the accepted frontend scope.

## Code Results

- Implemented phase-based `InterviewLog` access in the student Query Lab so early witness review only shows witness-statement rows, suspect review stays focused on the gym-linked suspect's own interview trail, and mastermind review stays focused on the confirmed killer's transcript trail.
- Preserved a valid suspect `InterviewLog` execution across the suspect-theory handoff so the student can return to the same earned transcript set after confirming Jeremy Bowers instead of rebuilding that query from scratch.
- Kept Samuel's guidance chapter-specific while removing explicit hints that transcript rows are being hidden, and while preserving the reveal-scene handoff after suspect confirmation.
- Added `BETWEEN` to the student Query Runner blocks and added `PlateNumber` to the mastermind-stage query tokens.
- Corrected the mastermind candidate handoff so the old shortlist query does not auto-restore after the Symphony Hall cross-check chapter opens, while still preserving an in-progress student draft when they switch between `Query Lab` and `Evidence Board`.
- Promoted actionable mastermind notebook clues into `Case File > Pinned Facts`, including candidate `LicenseID` and `PlateNumber` values and direct query fragments for December, Symphony Hall, BMW M8, red hair, height, and gender clues.
- Added focused coverage for transcript chapter filtering in `QueryRunner`, transcript carryover after suspect confirmation, shortlist handoff behavior, stable scene behavior, and pinned mastermind clue insertion in `App`.

## Audit Results

- Audit completed and accepted for merge/completion.
- Verified that `QueryRunner.tsx` filters `InterviewLog` results by active chapter so witness-stage review only shows witness-observation rows and does not expose Jeremy Bowers' confession trail early.
- Verified that `StudentWorkbenchView.tsx` and `useStudentCaseState.ts` keep witness, suspect, and mastermind transcript chapters separated and carry the relevant earned `InterviewLog` context forward without unnecessary re-entry.
- Verified that Samuel's guidance remains chapter-specific and does not explicitly disclose hidden-row filtering while the student is progressing through the narrative.
- Verified that the implementation remains within the allowed React frontend scope and does not modify backend or database files.
- Verified UI support changes for the mastermind chapter, including `BETWEEN`, `PlateNumber`, shortlist handoff behavior, preserved cross-check drafts, and actionable mastermind clues in `Case File > Pinned Facts`.
- Verified with targeted frontend tests:
  - `npm run test --workspace apps/web -- --run src/components/QueryRunner.test.tsx src/App.test.tsx`
  - Result: `85 passed`

## Final Decision

Accepted

