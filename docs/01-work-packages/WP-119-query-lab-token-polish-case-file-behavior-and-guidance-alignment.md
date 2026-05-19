# WP-119: query-lab-token-polish-case-file-behavior-and-guidance-alignment

## Objective

Refine the next round of Student Mode Query Lab and guidance UX after WP-117 and WP-118 so the scaffold taper stays consistent, the Case File interaction feels lighter, and Samuel's witness/gym guidance remains tightly aligned to the real investigation state.

The immediate concerns are:

- the witness query-token set is helpful, but some tokens are too specific or redundant with the Query Runner SQL builder
- `Case File` currently stays open until explicitly closed, even when the student resumes work in the Query Runner, which adds friction
- `Pinned Facts` should become the default Case File view now that it is the primary query-building reference surface
- Samuel's `What to Prove` copy after the first witness is logged should acknowledge that one witness is already found and the second still needs to be pinned
- the gym query support still needs better taper discipline: useful tokens should improve, but Samuel should not be queuing a solved or near-solved query at that phase
- the local test environment had a sandbox-only Vitest path-remap failure around `apps/web/src/vitest.setup.ts` that should be documented and, if practical, hardened

The goal is:

Polish the Query Lab support surfaces so they better match the student's actual next move, reduce redundant assistance, improve Case File interaction flow, and keep the gym phase on a student-built query path.

---

## Scope

Refine Student Mode token guidance, Case File behavior, witness-phase guidance messaging, and gym-phase scaffold taper.

This WP may modify:

- student workbench and Case File interaction behavior
- query-token presentation in student support panels
- Query Runner SQL builder token set
- Samuel guidance, objectives, and witness/gym-phase state messaging
- related frontend tests
- this work package document

This WP may also add a small developer-facing note if needed to record the Vitest sandbox path-remap limitation, but must not broaden into build-tool rewrites unless clearly necessary.

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
- apps/web/src/vite.config.*
- apps/web/src/vitest.setup.ts
- apps/web/vite.config.*
- docs/01-work-packages/WP-119-query-lab-token-polish-case-file-behavior-and-guidance-alignment.md
- docs/04-developer-setup/**

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files unless strictly required for a Vitest path-resolution fix
- backend build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuel's mentor role
- Preserve the existing Student Mode structure
- Preserve visible correct and incorrect clue feedback
- Preserve the student's responsibility to build their own queries
- Preserve the Query Lab / Case File relationship introduced in WP-118
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Taper and interaction constraints:

- do not reintroduce clause-by-clause solved witness or gym queries by default
- use tokens and guidance to support student construction without over-answering
- prefer broad reusable tokens over long solved fragments when the Query Runner already supplies the SQL keywords
- make Case File feel like a lightweight reference surface, not a panel the student has to manually dismiss every time
- keep guidance synchronized with the exact witness-count / milestone state
- if the Vitest issue is addressed, fix it narrowly and only if it can be done safely without destabilizing normal test runs

---

## Required Behavior

### 1. Tighten Query Tokens For Witness Discovery

The witness-phase shortcut tokens should be adjusted so they help without duplicating solved SQL.

Refinements to consider:

- remove long composite tokens such as `ORDER BY PersonID` when the SQL builder already provides `ORDER BY`
- add more useful fact-value tokens such as `10975` if they improve student assembly
- keep the token surface oriented toward construction, not answer-copying

The resulting token set should better match the weaning direction.

---

### 2. Make `Pinned Facts` The Default Case File View

When the student opens `Case File` from Query Lab:

- `Pinned Facts` should be the default visible tab or pane
- students should be able to reach the exact values they just earned with minimal friction

This is now the primary query-building reference surface and should open accordingly.

---

### 3. Close Case File More Naturally When The Student Returns To Work

If the student resumes direct work in Query Lab after opening `Case File`:

- the product should consider closing the drawer automatically when that interaction clearly signals a return to writing/running SQL
- the behavior should feel intentional and not fight the user

This should reduce unnecessary manual close actions.

---

### 4. Align Witness Guidance With Partial Progress

After one witness bundle is logged but before the second is found:

- `What to Prove` should reflect that one witness has been found and one still remains
- Samuel's guidance should stay focused on finishing the witness-discovery step
- the current step and helper text should remain consistent with that state

This is a progression-clarity requirement.

---

### 5. Improve Gym Query Support Without Re-Solving The Query

The gym-phase scaffold should be improved, but still remain student-built.

Desired refinements:

- add `%` to the Query Runner SQL builder if it helps this phase
- remove `%` from clue tokens so students still place it intentionally
- keep useful gym tokens broad and reusable
- do not default to a queued solved or near-solved gym query at this stage

The product should support construction without sliding back into heavier hand-holding.

---

### 6. Document Or Narrowly Fix The Vitest Path-Remap Issue

The observed issue was:

- sandboxed test runs failed because Vitest could not resolve `apps/web/src/vitest.setup.ts` through the workspace path remap
- non-sandboxed runs succeeded

WP-119 should either:

- document this limitation clearly for future Codex runs, or
- narrowly harden the Vitest path resolution if a safe fix is available

Do not broaden into tooling churn without a clear need.

---

### 7. Tests

Add or update tests for:

- `Pinned Facts` opening as the default Case File tab
- Case File closing behavior when the student returns to Query Lab work, if implemented
- witness partial-progress guidance after the first witness is logged
- adjusted witness and gym token presentation
- gym support remaining non-solved by default

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- witness tokens are more construction-oriented and less redundant
- `Pinned Facts` opens as the default Case File view
- Case File behavior feels lighter and less sticky during Query Lab work
- witness partial-progress guidance acknowledges one found / one remaining when applicable
- gym token support is improved without reverting to solved-query handoff
- deterministic progression remains intact
- guidance, current step, and helper content stay synchronized
- tests updated where practical
- any Vitest note or fix remains narrow and justified
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-119 for Sequel City Web Detective.

Objective:
Polish Query Lab token guidance, Case File interaction behavior, and witness/gym guidance alignment so support remains helpful but tapered, and the main query-building flow feels lighter.

Implement:

1. Refine witness tokens so they avoid unnecessary solved fragments and better support student construction.
2. Make `Pinned Facts` the default Case File view.
3. Improve Case File close behavior when the student clearly returns to query work, if that interaction can be made predictable.
4. Update witness guidance so `What to Prove` reflects partial progress after one witness is found.
5. Improve gym query support with better token choices while keeping the query student-built by default.
6. Add a narrow Vitest note or safe fix for the sandbox path-remap issue if justified.
7. Update focused tests.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode UX and narrow test-tooling concern

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build investigative queries

---

## Gemini Audit Prompt

Audit WP-119 Query Lab token, Case File, and guidance-alignment fixes.

Verify:

1. Only approved frontend, narrow test-config, and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. `Pinned Facts` is the default Case File view.
6. Query Lab tokens are less answer-like and less redundant than before.
7. Witness partial-progress guidance reflects the correct state after one witness is logged.
8. Gym support remains student-built and does not default to a solved query.
9. Any Case File auto-close behavior is predictable and not disruptive.
10. Any Vitest fix or note is narrow and justified.
11. Tests were updated or added where practical.

Flag:

- over-scaffolded token regressions
- stale witness/gym guidance
- awkward Case File behavior
- broad tooling churn for a narrow test-path issue
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-119 across the student Query Lab, guidance state, focused tests, and a narrow Vitest config hardening.

Key outcomes:

- `Pinned Facts` is now the default Case File tab when the drawer opens, so the primary query-building reference appears first.
- The Case File drawer now closes automatically when the student clearly returns to Query Lab work by clicking or focusing back into the main workbench area.
- Witness clue tokens were tapered:
  - removed the overly solved `ORDER BY PersonID` token
  - added `10975` as a direct value token
  - kept the witness-name shortcut panel broad with `PersonsOfInterest`, `PersonID`, and `OR`
- Witness guidance now reflects partial progress after the first witness bundle is pinned:
  - Samuel's objective shifts from "find both witnesses" to "find the second witness"
  - the mentor reaction stays focused on finishing the witness-discovery step
- Gym query support was tightened without re-solving the phase:
  - `%` was added to the Query Runner SQL builder
  - `48Z%` was replaced with a lighter `48Z` clue token
  - the gym phase no longer opens with a pre-queued broad `FitNFlabClub` draft; the student must start the query themselves
- The Vitest `setupFiles` entry in `apps/web/vite.config.ts` now resolves via `fileURLToPath(new URL(..., import.meta.url))`, which hardens path resolution for the workspace-remap sandbox issue without broader tooling churn.

Files updated:

- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/vite.config.ts`
- `docs/01-work-packages/WP-119-query-lab-token-polish-case-file-behavior-and-guidance-alignment.md`

Verification:

- `npm run test --workspace apps/web` passed with `142/142` tests.
- `npm run build --workspace apps/web` passed.

---

## Gemini Audit Results

Accepted after audit.

Audit closeout notes:

- confirm the accepted scope stays limited to Query Lab token cleanup, Case File interaction refinement, witness partial-progress guidance, gym-token taper, and the narrow Vitest setup-path hardening
- preserve the student-built gym query approach without extending this work package into a new gym evidence-closeout phase
- preserve backend, database, and SQL-execution boundaries with no runtime AI changes

## Final Decision

Accepted.

