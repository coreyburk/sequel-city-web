# WP-133: Mastermind Candidate Narrowing After Profile Completion

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-24

## Objective

Guide the student cleanly from a completed mastermind clue profile into the `DriversLicense` narrowing step, candidate shortlist review, and final mastermind identification path.

## Scope

### In Scope

- detect when the student has collected the required mastermind profile clues
- shift Samuel's guidance and Query Lab out of transcript-mining mode and into candidate-narrowing mode
- explicitly guide the student to query `DriversLicense` using the earned mastermind profile clues
- help the student compare the witness BMW clue with the killer's BMW clue as a hypothesis, not a confirmed fact
- surface the candidate shortlist and prepare the handoff into final mastermind confirmation

### Out of Scope

- admin editing of killer/mastermind identities
- additional bootstrap or Admin Mode work
- changing the underlying case answer-key architecture
- packaging/distribution work
- new suspect-theory trigger mechanics

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
- `docs/01-work-packages/WP-133-mastermind-candidate-narrowing-after-profile-completion.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `package-lock.json`

## Constraints

- do not auto-confirm that the witness BMW and mastermind BMW are the same car
- do not auto-write the final mastermind answer for the student
- keep the narrowing flow query-guided rather than fully solved
- preserve dynamic suspect-name behavior from the case-config foundation
- avoid collapsing the mastermind phase into a single generic milestone if the student still needs intermediate guidance

## Required Behavior

- once the mastermind clue profile is complete, the app must stop telling the student to keep mining transcript rows
- Samuel must clearly direct the student to test the profile against `DriversLicense`
- the narrowing guidance must explicitly reflect earned clues such as:
  - `CarMake = BMW`
  - `CarModel = M8`
  - `Gender = female`
  - `HairColor = red`
  - `Height BETWEEN 65 AND 67`
- the witness red BMW clue must be framed as something to compare against the mastermind profile, not a proven match
- when the candidate list shrinks, the app must explain what the student should do next instead of leaving them at a dead end

## Acceptance Criteria

- [x] Completing the mastermind clue profile changes the current step from transcript-mining to candidate-narrowing
- [x] Query Lab guidance points the student toward `DriversLicense` with earned clue dimensions instead of repeating transcript prompts
- [x] The app treats the red BMW clue as a cross-check hypothesis, not an established fact
- [x] The student receives a clear next step after the candidate list is narrowed
- [x] No unrelated files are changed

## Code Prompt

Implement WP-133 exactly as scoped.

Requirements:

- convert the completed mastermind profile into a deliberate `DriversLicense` narrowing phase
- keep the guidance explicit but not fully solved
- make the post-shortlist handoff clear enough that students know how to proceed to final mastermind identification
- preserve all existing dynamic suspect-name behavior

Return:

- exact files changed
- summary of the new narrowing flow
- verification performed

## Audit Prompt

Audit WP-133 for mastermind narrowing clarity and scaffold discipline.

Verify:

1. The app stops transcript-mining guidance once the mastermind profile is complete.
2. The next student step clearly pivots into `DriversLicense`.
3. The narrowing guidance uses the earned clue profile without simply handing over the final answer.
4. The red BMW witness clue is treated as a comparison hypothesis, not as an auto-confirmed fact.
5. The student is told what to do after the candidate list is narrowed.
6. The change stays within the allowed files and preserves existing behavior outside this phase.

## Code Results

- Added a distinct post-profile `DriversLicense` narrowing phase in [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts).
- Updated [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so the mastermind workbench brief switches from `Mastermind Transcript Trail` to `Mastermind Candidate Narrowing`, then into a dedicated candidate cross-check brief once the shortlist is pinned.
- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so Samuel's guidance, the current objective, and the mastermind milestone wording now reflect a real `DriversLicense` narrowing phase instead of continuing to speak as if the student is still transcript-mining.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to preserve long in-progress narrowing queries while the student switches between Query Lab and Evidence Board.
- The notebook summary now keeps the clue counter visible after profile completion, preserves the witness BMW plate fragment, and reframes that clue as unresolved evidence rather than a settled tie-break.
- After two mastermind candidates are pinned, the guidance now pivots out of pure BMW comparison and toward the next real branch: identifying both women and comparing their December Symphony Hall trail.

### Verification

- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`

## Audit Results

Audit passed. The implementation now:

1. shifts clearly from transcript-mining to `DriversLicense` narrowing when the mastermind profile is complete
2. keeps the narrowing guidance explicit without writing the final answer for the student
3. preserves the witness red BMW clue as a comparison lead rather than a proven match
4. gives the student a concrete next move after the shortlist is formed by pivoting to candidate identity plus December Symphony Hall cross-checking
5. stays within the accepted frontend/tooling scope for this WP

## Final Decision

Accepted

