# student-on-ramp-and-samuel-tupleton-briefing

## Objective

Create a clearer, more engaging Student Mode on-ramp that helps learners start the investigation without overwhelming them.

This WP establishes:

- a guided "Start Here" briefing led by Data Detective Samuel Tupleton
- explicit first-query breadcrumbs for the first few investigative moves
- a more interactive query-draft loading flow so students can follow the case opening before choosing their own path

The goal is to get students moving quickly with a few strong opening hints, then hand agency back to them once the first evidence trail is established.

---

## Scope

Improve the Student Mode investigation on-ramp and related frontend tests.

In scope:

- Samuel Tupleton briefing UI
- starter breadcrumb sequencing
- student query draft loading behavior
- app and query-runner tests for the on-ramp flow
- student-mode styling required for the new briefing panel

Out of scope:

- backend changes
- schema snapshot logic changes
- developer mode changes
- suspect verification logic changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-054-student-on-ramp-and-samuel-tupleton-briefing.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/styles.css

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve backend-authoritative query execution
- Keep the on-ramp spoiler-safe
- Keep the experience lightweight and deterministic
- Do not add dependencies
- Preserve Developer Mode behavior

---

## Required Behavior

### 1. Samuel Tupleton Briefing

Student Mode should include a clear investigation on-ramp presented through Data Detective Samuel Tupleton.

### 2. Guided Opening Breadcrumbs

The opening guidance should explicitly cover:

- determine the Crime ID for Murder
- inspect the Crime Scene Report
- narrow the result set by filtering to murder cases

### 3. Interactive Query Loading

Students should be able to load the current guided query draft directly from the briefing instead of only reading static instructions.

### 4. Progressive Hand-Off

After the first guided breadcrumbs, the briefing should step back and encourage students to choose their next path based on the clues they have uncovered.

### 5. Test Coverage

Add or update tests to verify:

- Samuel Tupleton briefing renders in Student Mode
- the initial guided query is the CrimeType query
- query drafts can be updated from the on-ramp flow
- the briefing advances as early investigation steps are completed

---

## Acceptance Criteria

- `WP-054` exists
- Student Mode includes a Samuel Tupleton on-ramp
- the first three guided breadcrumbs are explicit
- the initial query draft is the CrimeType query
- the on-ramp can load/update guided query drafts
- the briefing becomes less prescriptive after the opening steps
- app/query-runner tests cover the new interaction flow
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-054 Student Mode on-ramp and Samuel Tupleton briefing.

Do:

- add the work package
- build a student on-ramp with Samuel Tupleton
- provide the first few investigative breadcrumbs clearly
- let students load the guided query drafts directly
- update tests and styling as needed

Do not:

- change backend behavior
- change Developer Mode
- add dependencies

Return:

- files changed
- student on-ramp behavior summary
- test summary

---

## Gemini Audit Prompt

Audit WP-054 Student Mode on-ramp and Samuel Tupleton briefing.

Verify:

1. Only approved files were modified.
2. Student Mode includes a Samuel Tupleton briefing/on-ramp.
3. The opening breadcrumbs explicitly guide CrimeType, CrimeSceneReport, and murder-case filtering.
4. The initial query draft is the CrimeType query.
5. Query drafts can be updated from the on-ramp flow.
6. The experience becomes less prescriptive after the opening steps.
7. Developer Mode remains unchanged.
8. Tests cover the new on-ramp interaction flow.

Flag:

- early spoiler leakage
- over-direction after the opening steps
- unauthorized file changes
- missing test coverage

---

## Codex Results

Implemented a Student Mode on-ramp centered on Samuel Tupleton.

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Added a dedicated Samuel Tupleton briefing panel in Student Mode.
- Staged the opening investigation into three explicit breadcrumbs:
  - determine the Crime ID for murder
  - inspect the Crime Scene Report
  - filter to murder cases
- Added interactive query-draft loading from the active Samuel mission and from each breadcrumb step.
- Added Samuel guidance that shifts from direct prompts to a hand-off message after the opening queries are complete.
- Kept Detective Case Notes lighter so the initial momentum comes from the Samuel on-ramp instead of a large checklist.
- Updated the student Query Runner copy to reinforce evidence-driven investigation.

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `27` tests passed

## Gemini Audit Results

PASS.

Confirmed by audit:

- only approved files were modified
- Student Mode includes a Samuel Tupleton briefing with mission guidance and a "What to Notice" prompt
- the opening breadcrumbs explicitly guide `CrimeType`, `CrimeSceneReport`, and murder-case filtering
- the initial student draft is `SELECT * FROM CrimeType`
- both the mission card and breadcrumb list can load guided queries into the Query Runner
- the experience hands off after the opening steps with Samuel's less-prescriptive follow-up
- Developer Mode remains unchanged
- test coverage verifies the guided flow and Developer Mode regression safety

Audit observation:

- Step 3 reveals `WHERE CrimeID = 1080` explicitly. Audit accepted this as intentional because the WP required a clear starter on-ramp and the sequencing still encourages students to follow the prior breadcrumbs first.

## Final Decision

Approved.

