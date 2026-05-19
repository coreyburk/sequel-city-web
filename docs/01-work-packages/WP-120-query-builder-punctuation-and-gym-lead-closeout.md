# WP-120: query-builder-punctuation-and-gym-lead-closeout

## Objective

Tighten the student Query Runner builder around the new tapered witness and gym flows, and finish the gym-membership lead so a correctly narrowed single-row result becomes a real clue-logging step instead of a dead end.

The immediate issues are:

- the SQL builder is missing `=`, even though students now need it repeatedly during witness and gym filtering
- `%` insertion currently breaks string assembly when students click builder tokens in sequence
- once the student narrows `FitNFlabClub` to one matching row, the product does not clearly tell them what to do next and does not surface a usable clue-logging target
- post-gym guidance should advance into the next suspect-theory phase instead of leaving the case framed as if the gym lead were still unresolved

The goal is:

Keep the builder lightweight but usable, preserve learner-owned query construction, and make the gym lead close out cleanly into the next investigation phase.

---

## Scope

Refine the student SQL builder punctuation support and complete the gym-lead evidence handoff.

This WP may modify:

- student query-runner builder behavior
- student gym-lead guidance, prompts, and progression state
- related frontend tests
- this work package document

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/**
- apps/web/src/components/student/**
- apps/web/src/features/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/01-work-packages/WP-120-query-builder-punctuation-and-gym-lead-closeout.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- backend build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay behavior
- Preserve spoiler-safe guidance
- Preserve Samuel's mentor role
- Preserve the student's responsibility to build their own SQL
- Preserve the tapered witness and gym scaffolding introduced in WP-119
- Do not reintroduce a prewritten gym query
- Do not broaden into later suspect-resolution work beyond a clean gym-lead closeout handoff

---

## Required Behavior

### 1. Add `=` To The SQL Builder

The student SQL builder should include `=` as a clickable token because it is now a common part of the intended query construction path.

### 2. Make `%` Insertion Safe For String Assembly

Clicking `%` should not inject surrounding spaces that break strings such as:

`WHERE FitMemberID LIKE '48Z%'`

The builder should still feel simple, but `%` must insert tightly enough to support valid string construction.

### 3. Keep Witness PersonID Values In Pinned Facts, Not Useful Clues

Do not duplicate the solved witness PersonID values into the shortcut tokens. Students should still retrieve those exact values from `Pinned Facts`.

### 4. Turn The Narrowed Gym Result Into A Clue Step

When the student narrows `FitNFlabClub` to a single matching row:

- Samuel should clearly tell the student to log that row
- the Query Runner should surface a clue prompt for that row
- the row should be loggable through the existing `Log Clue` interaction

### 5. Advance Cleanly After The Gym Clue Is Logged

After the correct gym row is logged:

- the `gym-chain` milestone should complete
- guidance and current-step messaging should move on to the next suspect-theory phase
- the product should not continue acting as if the gym lead is still unresolved

### 6. Tests

Add or update tests for:

- `=` in the builder
- `%` insertion without broken spacing
- gym narrow-to-one guidance
- gym clue logging and post-gym handoff

---

## Acceptance Criteria

- `=` appears in the student SQL builder
- `%` insertion no longer creates broken string spacing
- witness PersonID values remain sourced from `Pinned Facts`, not duplicated into clue tokens
- a narrowed single-row gym result becomes a clear `Log Clue` step
- logging the correct gym row completes the gym lead and advances guidance
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-120 for Sequel City Web Detective.

Objective:
Tighten the student SQL builder punctuation support and complete the gym-lead closeout so a narrowed single-row gym match becomes a real clue step instead of a dead end.

Implement:

1. Add `=` to the student SQL builder.
2. Make `%` insertion safe for string assembly without surrounding-space breakage.
3. Keep witness PersonID values in `Pinned Facts`, not duplicated into shortcut tokens.
4. When `FitNFlabClub` is narrowed to one matching row, surface clear guidance and a row-level `Log Clue` prompt.
5. Logging the correct gym row should complete the gym-chain milestone and move the case into the next suspect-theory handoff.
6. Update focused tests.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode UX and tests

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the student's responsibility to build investigative queries

---

## Codex Results

Implemented WP-120 across the student query builder, gym-lead progression, focused tests, and this work package record.

Key outcomes:

- added `=` to the student SQL builder so the witness and gym filtering phases no longer rely on manual punctuation typing for every comparison
- made `%` insertion a raw cursor insertion with no automatic spacing, so students can place wildcard markers exactly where they want them without the builder breaking the string
- kept witness PersonID values in `Pinned Facts` rather than duplicating solved values into the shortcut tokens
- turned the narrowed single-row gym result into a real clue step:
  - the Query Runner now tells the student to use `Log Clue`
  - the single matching row becomes loggable through the existing row action
  - logging the correct row completes the `gym-chain` milestone
- advanced post-gym guidance into a real suspect-candidate handoff so Samuel, `What to Prove`, the Query Lab instruction, and the support panel now all tell the student to resolve the pinned gym lead PersonID in `PersonsOfInterest` before testing the first suspect theory

Files updated:

- `apps/web/src/App.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-120-query-builder-punctuation-and-gym-lead-closeout.md`

Verification:

- `npm run test --workspace apps/web` passed with `143/143` tests.
- `npm run build --workspace apps/web` passed.

## Gemini Audit Prompt

Audit WP-120 query-builder punctuation and gym-lead closeout fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. `=` is present in the student SQL builder.
6. `%` insertion is now a raw cursor insertion with no automatic spacing, so students can place wildcard markers exactly where they intend.
7. Witness PersonID values remain sourced from `Pinned Facts` rather than duplicated into shortcut tokens.
8. A single narrowed `FitNFlabClub` match becomes a visible `Log Clue` step.
9. Logging the correct gym row completes the gym-chain milestone and advances guidance into the suspect-candidate handoff rather than falling back to witness-name guidance.
10. Post-gym Query Lab support is aligned:
    - Samuel's header guidance
    - `What to Prove`
    - Query Runner instruction
    - the support panel shown in Query Lab
    all point to using the pinned gym lead `PersonID` in `PersonsOfInterest` before testing the first suspect theory.
11. Tests were updated where practical.

Flag:

- punctuation-token regressions that make query assembly less reliable
- any reintroduction of a prewritten gym query
- stale post-gym guidance that still behaves as if the gym lead is unresolved or that falls back to witness-name instructions
- backend, database, or SQL-execution changes
- missing or weak regression coverage

## Gemini Audit Results

Accepted after audit.

Audit closeout notes:

- confirm the accepted scope stays limited to the student query-builder punctuation support, gym-lead closeout, suspect-candidate handoff, focused tests, and the WP record
- preserve the student-built query approach by keeping `%` as a raw cursor insertion and avoiding any return to prewritten gym or suspect queries
- preserve backend, database, and SQL-execution boundaries with no runtime AI changes

## Final Decision

Accepted.


