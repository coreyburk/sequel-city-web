# WP-117: post-witness-gym-lead-handoff-and-scaffold-taper

## Objective

Evaluate and refine the next investigative phase after witness names are pinned so Samuel's guidance, the current step, and the Query Lab scaffold all align with the actual student state.

The immediate concerns are:

- Samuel is still providing too much of the witness-name query by queueing both `WHERE` clauses
- the guidance shown after witness names are already pinned can lag behind the actual step the student is on
- the student-support taper is inconsistent: witness discovery required more student construction, but the next handoff regressed into heavier Samuel solutioning
- the transition from witness identity to gym-lead investigation needs a clearer progression design before implementation continues

The goal is:

Define and implement the next-step UX so the student is gradually weaned off heavy query scaffolding, while Samuel's guidance stays synchronized with the actual progression state and the gym-lead handoff becomes the next coherent investigative phase.

---

## Scope

Refine the Student Mode transition from pinned witness identities into the gym-lead investigation phase.

This WP may modify:

- student progression state in `useStudentCaseState.ts`
- Samuel guidance, objectives, and lead-board logic in `studentCase.ts`
- student workbench and Evidence Board transition behavior
- query-scaffold / query-assist presentation in student components
- related tests
- this work package document

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/**
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/01-work-packages/WP-117-post-witness-gym-lead-handoff-and-scaffold-taper.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
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
- Preserve Samuel's mentor role
- Preserve the existing Student Mode structure
- Preserve visible correct and incorrect clue feedback
- Preserve the expectation that students build their own queries
- Preserve the witness `PersonID` and witness-name clues already earned
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Post-witness constraints:

- once witness names are pinned, Samuel's guidance and the Evidence Board current step must both advance to the same next phase
- Samuel should taper support rather than fully writing the next query path for the student
- query-assist support should help students think through the next move without restoring full answer-like clause handoff
- the next investigative step should feel like a progression from witness-name proof, not a reset into a different tutorial style

---

## Required Behavior

### 1. Align Guidance With Actual Post-Witness State

After both witness names are pinned:

- Samuel's guidance must no longer speak as if the student still needs to identify witness names
- the Evidence Board `Current Step` and the Query Lab guidance must point to the same next investigative phase
- the app must not show "What to prove" and "What to do next" content that belongs to a previous phase

This is a progression-state synchronization requirement.

---

### 2. Taper Samuel's Query Scaffolding For The Next Phase

At the gym-lead handoff:

- Samuel should not provide a near-complete next query by default
- support should be lighter than the witness-name rescue state that queued both `WHERE PersonID` clauses
- the student should need to assemble more of the next query themselves than they did in the recovery-focused witness-name step

Acceptable support patterns include:

- naming the target table
- naming one or two relevant columns or clue values
- providing broad query-builder tokens
- pointing the student back to already pinned facts

Do not default to full multi-clause solved drafts unless a recovery state explicitly justifies it.

---

### 3. Define The Intended Next Investigative Move Clearly

This WP must explicitly define what the student is supposed to do immediately after witness names are known.

Questions to resolve in implementation:

- what exact table or evidence source should the gym lead start with
- what clue from the witness bundles should be the first narrowing anchor
- how much Samuel should say directly versus how much the student should infer from pinned clues

The resulting UI should present one coherent next move, not a vague "gym lead" label with mismatched detailed guidance.

---

### 4. Preserve Scaffold Taper Across The Investigation

The student-support ramp should show a deliberate pattern:

- early steps can be more guided
- mid-case steps should require more student assembly
- recovery states may temporarily increase support
- successful completion should not permanently revert the flow to heavier hand-holding

WP-117 should ensure the post-witness phase follows that taper instead of regressing.

---

### 5. Tests

Add or update tests for:

- witness-name completion advancing Samuel guidance and `Current Step` to the same next phase
- post-witness guidance no longer mentioning unresolved witness-name work
- the next-phase scaffold being lighter than a full clause-by-clause solved query
- the next investigative phase remaining deterministic and tied to pinned clues

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- Samuel's guidance matches the actual step after witness names are pinned
- the Evidence Board `Current Step` and Query Lab guidance stay synchronized
- the next investigative phase is clearly defined and coherent
- Samuel's post-witness support is lighter and more tapered than the witness-name recovery scaffold
- the student is not handed a near-complete solved query by default
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-117 for Sequel City Web Detective.

Objective:
Refine the next investigative handoff after witness names are pinned so Samuel's guidance, the Evidence Board current step, and the Query Lab scaffold all match the actual phase, while tapering support instead of giving students a near-complete next query.

Implement:

1. Realign the post-witness guidance and current-step state so they both advance to the same next phase.
2. Define the intended first gym-lead move clearly in the UI.
3. Reduce Samuel's default query giveaway at this stage and restore a more tapered scaffold.
4. Keep the next move tied to already earned clues instead of introducing unexplained new directions.
5. Update focused tests for the post-witness handoff and scaffold taper.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode post-witness handoff

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build the next query

---

## Gemini Audit Prompt

Audit WP-117 post-witness handoff and scaffold-taper fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. After witness names are pinned, Samuel's guidance no longer talks as if the student still needs to determine those names.
6. The Evidence Board `Current Step` and the Query Lab guidance point to the same next investigative phase.
7. The next investigative move is clearly defined and tied to earned clues.
8. Samuel's post-witness support is lighter than a near-complete solved query.
9. The next-phase scaffold still gives enough support to avoid confusion.
10. Tests were updated or added where practical.

Flag:

- stale witness-name guidance after name completion
- mismatched `Current Step` and header guidance
- over-scaffolded next-query handoff
- vague or contradictory gym-lead setup
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-117 in the Student Mode post-witness handoff.

- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so the witness-name phase now advances into a distinct gym-membership phase with a broad `FitNFlabClub` opening draft, a lighter Samuel handoff, and a narrower `gym-chain` milestone match that no longer treats a broad table scan as phase completion.
- Updated [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so finishing the second witness name moves the student into a `gym-lead` pending step, keeps the Evidence Board and Query Lab synchronized on that phase, and uses the `48Z` / `gold` clues to guide narrowing without queuing a solved filter query.
- Updated [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so the witness-name shortcut panel is replaced by a new `Gym Membership Clues` panel once the names are pinned, with broad clue tokens like `FitNFlabClub`, `FitMemberID`, `FitMembershipStatus`, `LIKE`, `48Z%`, and `gold`.
- Updated [StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx) so the `Current Step` card now shows `Gym Membership Lead` during this post-witness phase instead of drifting out of sync with Samuel's guidance.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) so the student SQL builder includes `LIKE`, which supports the lighter membership-prefix narrowing path without restoring clause-by-clause solutioning.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) to cover the new gym-membership opening move, the synchronized `Current Step`, the broad `FitNFlabClub` draft, and the reduced Samuel scaffold after witness names are pinned.

Verification:

- `npm run test --workspace apps/web` passed with `139/139` tests.
- `npm run build --workspace apps/web` passed.

## Gemini Audit Results

Audit passed.

- Verified frontend-only scope with no backend, database, or SQL execution changes.
- Confirmed the post-witness flow now advances into a distinct gym-membership phase with Samuel guidance, Query Lab helper text, and the Evidence Board `Current Step` aligned on the same next move.
- Confirmed the gym handoff uses a broad `FitNFlabClub` opening draft and clue tokens (`48Z`, `gold`, `LIKE`) instead of a near-complete solved filter.
- Confirmed focused tests cover the synchronized post-witness handoff and lighter scaffold.

## Final Decision

Accepted. WP-117 successfully establishes the post-witness gym-membership phase with synchronized guidance and a lighter scaffold, while preserving deterministic progression and frontend-only scope.

