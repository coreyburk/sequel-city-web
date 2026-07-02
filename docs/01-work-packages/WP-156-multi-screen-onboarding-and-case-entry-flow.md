# WP-156: Multi-Screen Onboarding And Case-Entry Flow

**Status:** Ready
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Introduce a multi-screen student onboarding and case-entry flow that reduces first-load information overload, gives Samuel Tupleton a dedicated introduction, and establishes a future-compatible structure for multiple cases and difficulty tiers while launching only Case 004 today.

## Scope

### In Scope

- add a dedicated pre-investigation onboarding flow in Student Mode before the current case shell appears
- separate product introduction, Samuel introduction, gameplay explanation, and case entry into distinct progression screens
- provide a case-entry screen that currently exposes only Case 004 while structurally accommodating future multiple cases and difficulty labels
- transition from onboarding into the existing Case 004 student flow without losing the current deterministic case progression behavior
- reduce duplication by shortening or reshaping the current first-load briefing where the new onboarding covers the same orientation content
- update relevant unit and browser coverage for the new entry flow
- regenerate Understand artifacts after implementation because the student experience structure and entry-state flow will materially change

### Out of Scope

- implementing additional playable cases beyond Case 004
- changing backend routes, database schema, seed data, or answer-key behavior
- introducing accounts, persistence, cloud features, or profile save systems
- redesigning the full Query Lab / Evidence Board / progression logic beyond the onboarding-to-case handoff
- changing case correctness, clue logic, or suspect verification rules
- adding difficulty mechanics beyond visible metadata scaffolding

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Structurally stale; regenerate before relying on scope`
- Analysis performed: Required-tier student-flow analysis. The graph still identifies the relevant shell files (`App.tsx`, `StudentBriefingView.tsx`, `StudentMentorHeader.tsx`, `studentCase.ts`, `useStudentCaseState.ts`) and their relationships, but the baseline predates substantial student-shell, browser-harness, and progression refinements. Current source inspection is authoritative. This feature changes the entry structure of Student Mode and therefore materially affects shared progression UI and browser expectations.

### Affected Architecture
- Layers: student experience; deterministic case-entry presentation; frontend onboarding state
- Primary files/components:
  - `apps/web/src/App.tsx`
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/studentCase.ts`
  - `apps/web/src/components/student/StudentMentorHeader.tsx`
  - `apps/web/src/components/student/StudentBriefingView.tsx`
  - `apps/web/src/components/student/StudentWorkbenchView.tsx`
  - `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
  - likely one or more new student onboarding/case-entry components under `apps/web/src/components/student/`
  - `apps/web/src/styles.css`
- Upstream consumers:
  - Student Mode initial load
  - visible product orientation
  - future multi-case entry structure
- Downstream dependencies:
  - current `studentView` and case-shell rendering
  - case briefing content and Samuel header messaging
  - browser and unit tests that assume Student Mode opens directly into the current case shell

### Regression Surface
- Related tests:
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/components/QueryRunner.test.tsx` only if onboarding affects early shell assumptions
  - `apps/web/tests/browser/student-mode.spec.ts`
  - `apps/web/tests/browser/studentModeHarness.ts`
- User workflows:
  - first entering Student Mode
  - meeting Samuel
  - understanding how the product works
  - selecting or entering Case 004
  - transitioning from onboarding into the live investigation
- Security/data boundaries:
  - no SQL safety, answer-key, restricted-table, or suspect-verification authority changes
  - no database-backed case catalog yet; case-entry remains frontend-authored structure

### Graph Update Decision
- Regeneration required: Yes
- Rationale: This work changes the entry-state architecture and shared student-flow composition. The Understand baseline should be refreshed after implementation and audit so future WPs reason about the updated onboarding/case-entry structure accurately.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/components/student/StudentBriefingView.tsx`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/**`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-156-multi-screen-onboarding-and-case-entry-flow.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `apps/web/src/api/**`
- `apps/web/tests/browser/studentModeApi.ts`
- other work-package documents

## Constraints

- The onboarding flow must feel like product orientation, not a marketing landing page.
- Case 004 remains the only playable case for now.
- Future multi-case structure can be visible, but it must not imply unimplemented gameplay is available now.
- `Sequel Detective` remains the product name; `Sequel City` remains the fictional setting.
- The handoff from onboarding into Case 004 must preserve the current investigation state machine once the case begins.
- Repeat information should be reduced, not multiplied.
- Do not introduce backend dependencies for onboarding or case selection in this WP.

## Required Behavior

- Student Mode first opens into a multi-screen onboarding/case-entry sequence instead of dropping directly into the dense case shell.
- The onboarding sequence should include, at minimum:
  - a product welcome screen
  - a Samuel Tupleton introduction screen
  - a concise "how cases work" screen
  - a case-entry screen that launches Case 004 and can visually accommodate future cases/difficulty levels
- Launching Case 004 should then enter the current investigation flow with a slimmer, non-duplicative case briefing.
- The onboarding should make sense for a future library of cases without requiring those future cases to exist now.
- Browser and unit tests should verify the new entry flow and the ability to reach the active case shell deterministically.

## Acceptance Criteria

- [ ] Student Mode opens into a dedicated onboarding/case-entry flow.
- [ ] Samuel has a dedicated introduction step before the active case shell.
- [ ] The learning loop is explained across concise progression screens rather than one dense initial screen.
- [ ] A case-entry screen exists and clearly launches Case 004.
- [ ] The structure visibly supports future multiple cases and difficulty labels without exposing unimplemented playable cases.
- [ ] The current Case 004 investigation still works after entering through the new onboarding path.
- [ ] The current case briefing is shortened or adjusted to avoid repeating onboarding content.
- [ ] Relevant web unit tests pass.
- [ ] Relevant browser tests pass.
- [ ] Understand artifacts are regenerated after implementation.
- [ ] No API, database, or SSOT files change.

## Code Prompt

Implement WP-156 as a future-compatible Student Mode onboarding and case-entry flow.

1. Add a multi-screen onboarding flow that introduces:
   - `Sequel Detective`
   - Samuel Tupleton
   - how the student will work cases
   - the current available case entry
2. Build the case-entry surface so it launches only Case 004 now, while clearly leaving room for future additional cases and difficulty labels.
3. Transition from onboarding into the current Case 004 student experience without breaking the existing deterministic gameplay once the case starts.
4. Reduce duplicate orientation content in the current first briefing so the new onboarding is useful rather than repetitive.
5. Keep the change frontend-only.
6. Update unit and browser coverage for the new initial flow.
7. Regenerate the Understand artifacts after implementation and validation.
8. Update Code Results, Audit Results, and Final Decision.

## Audit Prompt

Audit WP-156 for onboarding usefulness, scope compliance, and future-case compatibility.

Verify:

1. The new onboarding flow reduces initial information overload rather than adding repetitive friction.
2. Samuel receives a dedicated introduction step.
3. The case-entry screen is future-compatible but only enables Case 004 today.
4. The handoff into the live case preserves the current deterministic investigation flow.
5. Unit and browser tests cover the new entry path.
6. Understand artifacts were regenerated as required.
7. No API, database, or SSOT files changed.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Remaining onboarding friction
- Regression risks

## Code Results

Implemented.

- Added a dedicated Student Mode onboarding and case-entry surface in `apps/web/src/components/student/StudentCaseEntryFlow.tsx` and wired it into `apps/web/src/App.tsx` ahead of the existing Case 004 shell.
- Added `CASE_004_ENTRY_ID` in `apps/web/src/studentCase.ts` to keep Case 004 entry explicit while leaving room for future case-library expansion.
- Slimmed the in-case briefing in `apps/web/src/components/student/StudentBriefingView.tsx` so onboarding carries the product/Samuel/process orientation while the live case shell focuses on Case 004 facts and the opening query lead.
- Updated `apps/web/src/components/student/StudentMentorHeader.tsx` and `apps/web/src/useStudentCaseState.ts` so the briefing header now reads as a case briefing instead of repeating the pre-case Samuel introduction.
- Added onboarding/case-entry styling in `apps/web/src/styles.css`.
- Set Student Mode to return to the intake screen on refresh and added a current in-app return path back to the intake surface so students are not trapped inside the active case shell.
- Updated unit coverage in `apps/web/src/App.test.tsx` to:
  - default most student tests into an already-entered Case 004 shell through a test-only prop
  - add explicit onboarding coverage for first entry
  - cover the current return-to-intake behavior
  - align briefing expectations with the slimmer case shell
- Updated browser coverage in `apps/web/tests/browser/studentModeHarness.ts` and `apps/web/tests/browser/student-mode.spec.ts` to:
  - click through onboarding before existing walkthrough tests
  - add a dedicated browser check for the new onboarding path
  - verify return-to-intake behavior through both the in-app action and refresh
- Refreshed tracked Understand artifacts:
  - `.understand-anything/fingerprints.json`
  - `.understand-anything/intermediate/scan-result.json`
  - `.understand-anything/knowledge-graph.json`
  - `.understand-anything/meta.json`

## Audit Results

PASS

- Scope compliance: PASS. No API, database, or SSOT files changed.
- Onboarding usefulness: PASS. Product welcome, Samuel introduction, case-work explanation, and case entry are separated into distinct steps before the case shell appears.
- Future-case compatibility: PASS. The entry surface exposes only Case 004 but now has a dedicated case-card pattern and visible difficulty metadata for future expansion.
- Handoff integrity: PASS. Existing Case 004 unit and browser walkthroughs still pass after entering through the new gate.
- Validation:
  - `npm run test --workspace apps/web`
  - `npm run test:browser --workspace apps/web`
- Understand artifacts: PASS with a narrow refresh approach. The deterministic scan and fingerprint baselines were rebuilt, and the tracked graph was updated for the new onboarding component and entry imports so the repository baseline reflects the new student entry structure.

## Final Decision

Accepted.

- WP-156 is accepted as the functional onboarding and case-entry baseline for Student Mode.
- Follow-up visual and navigation hierarchy refinement is intentionally deferred to WP-157 rather than expanding this package further.
