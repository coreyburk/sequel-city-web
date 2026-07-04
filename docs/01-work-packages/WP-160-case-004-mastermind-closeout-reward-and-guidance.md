# WP-160: Case 004 Mastermind Closeout Reward And Guidance

## Status

Accepted retroactive work package.

## Problem

Manual Student Mode testing exposed three connected Case 004 closeout issues:

1. The Employment tie-break query returned the correct two candidate rows, but `Log Clue` rejected the higher-income Miranda Priestly row because Employment evidence had no row-level acceptance branch.
2. After the higher-income row was accepted, Samuel's header, Query Lab guidance, and workbench brief still told the student to keep comparing Employment rows instead of moving to Evidence Board.
3. Confirming Miranda Priestly as the mastermind technically closed the case, but the reward moment felt like an ordinary status card and did not clearly resolve both criminals in the contract chain.

## Goals

- Accept the correct Employment tie-break evidence row for Miranda Priestly.
- Keep the lower-income Dani Rawley row rejected with specific, recoverable feedback.
- Update post-log guidance so the next action is explicit: open Evidence Board and test Miranda Priestly as the mastermind.
- Make the final case-close moment feel like a storyline-appropriate reward.
- Include both the hired killer and mastermind in the final resolution.
- Preserve the existing evidence-board theory check as the authority for final case closure.

## Non-Goals

- Do not change database seed data or backend suspect-verification behavior.
- Do not alter earlier Case 004 progression milestones beyond the affected closeout path.
- Do not add generic celebratory effects that clash with the noir detective tone.
- Do not change locked-case, onboarding, case-library, or admin flows.

## Scope

Allowed files:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/styles.css`
- `docs/01-work-packages/WP-160-case-004-mastermind-closeout-reward-and-guidance.md`

Out of scope:

- SQL Server schema or data scripts
- API service code
- generated build output
- unrelated documentation or asset changes

## Impact Analysis

- Case 004 progression impact: high enough to require focused validation because the change touches late mastermind evidence logging, guidance, and solved-state presentation.
- Frontend state impact: contained to Student Mode state derivation and components already owning Case 004 guidance and evidence-board surfaces.
- Backend/database impact: none. Final suspect verification still uses the existing API and database result.
- UI/UX impact: the final solved-state reward adds a modal-style overlay and requires accessible dismissal, mobile layout support, and reduced-motion handling.
- Test impact: focused component coverage is needed for the closeout splash, and existing App coverage must protect the full late-case path.
- Understand graph regeneration: not required for this retroactive package because no architecture boundaries, imports graph strategy, database structures, or backend contracts changed. Source inspection and focused tests are authoritative for this correction.

## Implementation Plan

1. Add Employment tie-break row handling in `useStudentCaseState`.
2. Derive a logged Employment tie-break state from the notebook entry.
3. Use that state to update Samuel header title/message, Query Runner instruction, evidence prompt, and Evidence Board readiness.
4. Pass Employment readiness into `StudentWorkbenchView` so the case-file brief changes from SQL comparison guidance to final theory-test guidance.
5. Add a final case-close splash to `StudentSuspectTheoryPanel` for mastermind confirmation.
6. Pass the confirmed hired-killer name into the final splash and show both criminals in the final resolution.
7. Add focused tests for row-level Employment behavior, post-log guidance, and the dismissible final splash.
8. Run focused unit tests and production build.

## Acceptance Criteria

- The Miranda Priestly Employment row logs successfully after the two candidate Employment rows are returned.
- The Dani Rawley Employment row is rejected with specific tie-break feedback.
- Once the Employment tie-break is logged, guidance tells the student to open Evidence Board and test Miranda Priestly.
- Evidence Board remains ready for the final mastermind theory after the tie-break is logged.
- Confirming Miranda Priestly as mastermind opens a storyline-appropriate case-close splash.
- The final splash identifies Jeremy Bowers as the hired killer and Miranda Priestly as the mastermind.
- The splash is dismissible and returns the student to the solved-case details.
- Reduced-motion and mobile layout handling are present for the splash.

## Code Results

Implemented.

- Added a mastermind Employment branch in `useStudentCaseState` that accepts SSN `987756388`, rejects the lower-income candidate row, and pins an `Employment Tie-Break` notebook entry.
- Added derived Employment readiness from either the filtered Employment query or the logged tie-break entry.
- Updated Samuel header, Query Runner instruction, evidence prompt, current-step copy, and workbench brief after the tie-break is logged so students are directed to Evidence Board.
- Passed Employment readiness through `App.tsx` into `StudentWorkbenchView`.
- Added a dismissible `Case 004 Closed` splash for confirmed mastermind results in `StudentSuspectTheoryPanel`.
- Added the confirmed hired killer to the final splash via `StudentEvidenceBoardView`, so the final resolution names Jeremy Bowers and Miranda Priestly.
- Added noir evidence-board visual styling, responsive layout, CTA focus, and reduced-motion handling in `styles.css`.
- Added `StudentSuspectTheoryPanel.test.tsx` for the dismissible final splash.
- Extended `App.test.tsx` to cover the Employment tie-break rejection, acceptance, and post-log guidance.

Validation:

- `npm run test --workspace apps/web -- StudentSuspectTheoryPanel.test.tsx`
- `npm run test --workspace apps/web -- App.test.tsx`
- `npm run build --workspace apps/web`

## Audit Results

PASS.

- Scope compliance: PASS. Changes stay within the accepted Student Mode frontend, style, test, and work-package documentation scope.
- Evidence logging: PASS. Miranda's higher-income Employment row is accepted; Dani's lower-income row remains rejected with specific feedback.
- Guidance handoff: PASS. After the tie-break is logged, Samuel and Query Lab guidance move the student to Evidence Board instead of repeating the Employment comparison.
- Final reward: PASS. The final solved-state splash is storyline-appropriate, identifies both criminals, and preserves the underlying solved-case details.
- Accessibility and responsiveness: PASS. The splash is a dialog, has a focused dismiss action, includes mobile styling, and respects reduced-motion preferences.
- Backend/database boundaries: PASS. No API, database, schema, or verification-contract changes were made.
- Remaining risk: visual polish has been validated through code and tests, but not through a fresh browser screenshot in this closeout turn.

## Final Decision

Accepted.

- WP-160 is accepted as the retroactive package for the Case 004 mastermind closeout correction and reward pass.
- The final closeout path now resolves both the hired killer and mastermind.
- The final suspect verification boundary remains unchanged.
