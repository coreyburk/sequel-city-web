# WP-122: strengthen-personid-guidance-and-split-gym-suspect-handoff

## Objective

Tighten the Student Mode handoff around the `PersonsOfInterest` stages so students are less likely to stall after evidence is pinned, while keeping the query-building scaffold tapered.

The immediate concerns are:

- once `Pinned Facts` moved into `Case File`, the witness-name and gym-person lookup steps no longer keep the exact `PersonID` values visibly in front of the student
- the support panels still expose redundant query tokens like `OR` and `=` even though those already exist in the Query Runner toolbar
- the gym-linked `PersonsOfInterest` lookup and the later suspect-theory / `Solution` step are currently blended together
- Samuel's guidance and the active Query Lab support should make the next action obvious before the student is asked to reason about a broader suspect theory

The goal is:

Make the `PersonsOfInterest` stages clearer and more disciplined by emphasizing `Pinned Facts` as the source of exact IDs, removing redundant token noise, and splitting the gym-person identification step from the later suspect-theory step.

---

## Scope

Refine Student Mode guidance, support-panel content, and progression sequencing around witness-name lookup and the post-gym suspect handoff.

This WP may modify:

- student guidance copy and progression state
- Query Lab support-panel content and token sets
- Evidence Board step labeling if needed for alignment
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
- docs/01-work-packages/WP-122-strengthen-personid-guidance-and-split-gym-suspect-handoff.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-ssot-architecture/**
- docs/07-ssot-product/**
- docs/08-ssot-testing/**
- package.json files
- backend build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay behavior
- Preserve spoiler-safe guidance
- Preserve Samuel's mentor role
- Preserve the student's responsibility to build their own SQL
- Keep exact proved values in `Pinned Facts` rather than duplicating them broadly in support tokens
- Do not reintroduce solved or near-solved queries
- Do not collapse the gym-person lookup and suspect-theory phases back into one step

---

## Required Behavior

### 1. Strengthen `Pinned Facts` Reminders At `PersonsOfInterest` Steps

At the witness-name and gym-person lookup steps, the student should be reminded clearly and early that the exact `PersonID` values live in `Case File > Pinned Facts`.

Do:

- make the reminder explicit in the support panel and/or Query Runner instruction
- keep the exact values accessible through `Pinned Facts`

Do not:

- assume students will remember the IDs after the rail was removed
- duplicate exact solved `PersonID` values into generic support tokens unless there is a compelling usability reason

### 2. Remove Redundant Support Tokens

Support panels should not repeat tokens that are already always available in the Query Runner toolbar when those tokens do not add stage-specific value.

Examples to revisit:

- `OR`
- `=`

Keep stage-specific tokens that genuinely help orient the current query.

### 3. Split Gym Person Lookup From Suspect Theory

The student should first identify the gym-linked person's name from `PersonsOfInterest`, then move to a later suspect-theory / `Solution` step.

That means:

- the post-gym lead step should focus on turning the pinned gym lead `PersonID` into a real person
- `Solution` should not appear as if it is part of that first lookup step
- Samuel's `What to Prove`, `What to Do Next`, Query Lab instruction, and support panel should all point at the same current task

### 4. Preserve Tapered Query Support

The product should help the student remember where to look, not silently solve the query for them.

Do:

- use `Pinned Facts` reminders
- keep table and column hints relevant
- keep the next action explicit

Do not:

- queue a solved `WHERE PersonID = ...` draft as the only path forward
- fold exact solved values into every support surface

### 5. Tests

Add or update focused tests for:

- witness-name guidance reminding the student to use `Pinned Facts`
- removal of redundant witness-name support tokens where appropriate
- the separated gym-person lookup phase
- the later suspect-theory phase using `Solution` only after the gym-linked person has been identified

---

## Acceptance Criteria

- witness-name and gym-person lookup steps clearly remind students to use `Case File > Pinned Facts` for exact IDs
- redundant support tokens are removed where they do not add stage-specific value
- gym-person identification is a distinct step before suspect theory / `Solution`
- Samuel's guidance, Query Lab support, and current step labeling stay aligned across those phases
- no solved-query regression is introduced
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-122 for Sequel City Web Detective.

Objective:
Strengthen the `PersonsOfInterest` guidance so students are pointed back to `Pinned Facts` for exact IDs, remove redundant support tokens, and split the gym-person lookup from the later suspect-theory step.

Implement:

1. Make witness-name and gym-person lookup guidance explicitly remind students to use `Case File > Pinned Facts`.
2. Remove redundant support-panel tokens that are already present in the Query Runner when they are not stage-specific.
3. Separate gym-person identification from the later `Solution` / suspect-theory phase.
4. Keep Samuel, Query Lab, and Evidence Board current-step messaging aligned across those phases.
5. Update focused tests.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden beyond student guidance, support panels, and the affected progression logic

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the student's responsibility to build investigative queries

---

## Gemini Audit Prompt

Audit WP-122 `PersonsOfInterest` guidance and gym/suspect phase separation.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Witness-name and gym-person lookup steps now clearly remind students to use `Case File > Pinned Facts` for exact IDs.
6. Redundant support-panel tokens were removed where they duplicated always-visible Query Runner tokens without adding stage-specific value.
7. The gym-linked person lookup is now a distinct step before the later suspect-theory / `Solution` step.
8. Samuel's header, Query Lab instruction, support panel, and current-step labeling stay aligned across the affected phases.
9. No solved-query regression was introduced.
10. Tests were updated where practical.

Flag:

- stale or contradictory step messaging
- over-scaffolded exact-value help outside `Pinned Facts`
- missing progression separation between gym-person identification and suspect theory
- backend, database, or SQL-execution changes
- missing regression coverage

---

## Codex Results

Implemented the guidance and progression split across [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts), [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts), [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx), [StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx), [App.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx), and [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx).

The witness-name support panel now leans harder on `Case File > Pinned Facts` instead of exposing redundant `OR` and `=` tokens, so the exact witness `PersonID` values stay in the proved-evidence surface rather than being duplicated into the panel. After the gym membership row is logged, the case now opens a distinct `Gym Suspect Lookup` step in `PersonsOfInterest`; only after that person row is logged does the later `Suspect Theory` / `Solution` phase become active. Samuel's header, Query Runner instruction, support panels, and Evidence Board current-step card were all aligned to that two-step handoff.

The final polish pass also corrected the shared support-panel helper sentence so it no longer implies the exact values live “above” the panel. It now directs students to use the tokens below for hints and to open `Case File > Pinned Facts` when they need exact proved values.

Verification:

- `npm run test --workspace apps/web` passed with `143/143` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Results

Audit reviewed and accepted.

Confirmed:

- only approved frontend and work-package files changed
- witness-name and gym-person lookup guidance now explicitly points students to `Case File > Pinned Facts` for exact IDs
- redundant support-panel tokens were removed where they duplicated always-visible Query Runner controls without adding stage-specific value
- the gym-linked person lookup is now a distinct `suspect-candidate` phase before the later `Suspect Theory` / `Solution` step
- Samuel's header, Query Lab instructions, support panels, and Evidence Board current-step messaging stay aligned across the new handoff
- tests were updated to cover the new suspect-candidate phase and the accepted guidance wording
- no backend, database, SQL-execution, or runtime AI behavior changes were introduced

## Final Decision

Accepted.

