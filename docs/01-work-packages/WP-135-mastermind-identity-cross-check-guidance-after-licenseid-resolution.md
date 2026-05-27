# WP-135: Mastermind Identity Cross-Check Guidance After LicenseID Resolution

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-27

## Objective

Fix the mastermind cross-check handoff after the candidate `LicenseID` clues are used so Samuel's Guidance, the student objective, and Query Lab instructions reflect the next real task: comparing the resolved candidate identities through the December Symphony Hall event trail.

## Scope

### In Scope

- detect when the student has moved from shortlisted `DriversLicense` rows into `PersonsOfInterest`
- detect when both pinned candidate `LicenseID` values have been resolved into named people with returned `PersonID` values
- update Samuel's guidance so it no longer falls back to transcript-mining language after the identity lookup succeeds
- update the student objective and Query Lab support copy so the next step points into `EventRegistration` and `EventSchedule`
- add regression coverage for the post-`LicenseID` mastermind handoff

### Out of Scope

- changing the underlying case answers
- altering database schema or backend query execution
- changing earlier witness, suspect, or shortlist phases except where needed to preserve the handoff
- final mastermind answer validation behavior
- packaging or deployment work

## Files Allowed to Change

Allowed:

- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-135-mastermind-identity-cross-check-guidance-after-licenseid-resolution.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- `package-lock.json`

## Constraints

- do not skip directly to the final mastermind answer
- do not keep showing `InterviewLog` transcript guidance once the student has already used the pinned `LicenseID` clues to identify real people
- keep the guidance explicit enough for the student to know the next table path without writing the final answer for them
- preserve the existing shortlist and notebook-driven flow
- avoid broad state rewrites outside the mastermind identity handoff

## Required Behavior

- once the student uses the pinned candidate `LicenseID` clues in `PersonsOfInterest`, the app must stop speaking as if they are still working in `InterviewLog`
- once both women are identified, Samuel's guidance must tell the student to compare the returned `PersonID` values through `EventRegistration` and `EventSchedule`
- the current objective must reflect the identity-resolution step before the event cross-check is complete
- Query Lab instruction, failure guidance, and evidence prompt must all align to the current handoff stage
- the change must remain limited to the accepted frontend state/guidance layer

## Acceptance Criteria

- [x] A distinct mastermind identity-lookup phase exists after the BMW shortlist is pinned
- [x] Samuel's Guidance no longer falls back to transcript-mining language after the `LicenseID` lookup succeeds
- [x] The student objective updates from shortlist identification to December Symphony Hall cross-checking once both identities are resolved
- [x] Query Lab support copy matches the current post-`LicenseID` step
- [x] Regression coverage exists for the resolved-identity handoff

## Code Prompt

Implement WP-135 exactly as scoped.

Requirements:

- introduce a clear post-shortlist mastermind identity phase
- keep the guidance staged across:
  - pinned shortlist
  - `PersonsOfInterest` identity resolution
  - December Symphony Hall cross-check
- preserve the existing notebook-driven student flow
- add targeted regression coverage for the resolved-identity handoff

Return:

- exact files changed
- summary of the new identity-to-event handoff
- verification performed

## Audit Prompt

Audit WP-135 for mastermind handoff accuracy after `LicenseID` resolution.

Verify:

1. After the candidate `LicenseID` clues are used, the app no longer tells the student to keep mining `InterviewLog`.
2. The app recognizes the intermediate `PersonsOfInterest` identity-lookup phase instead of collapsing straight back to older guidance.
3. Once both women are identified, Samuel's Guidance and the student objective point to comparing the returned `PersonID` values through `EventRegistration` and `EventSchedule`.
4. Query Lab instruction, failure guidance, and evidence prompt all match the same handoff stage.
5. The implementation stays within the accepted frontend scope.

## Code Results

- Added a distinct mastermind identity-lookup state in [apps/web/src/useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) to detect when the student has pivoted from the BMW shortlist into `PersonsOfInterest`, whether the pinned candidate `LicenseID` filters are present, and whether both candidate identities have been fully resolved.
- Updated [apps/web/src/studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so Samuel's guidance and the student objective now progress through the correct post-shortlist sequence: identify both women first, then compare their returned `PersonID` values against the December Symphony Hall event trail.
- Updated [apps/web/src/useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so Query Lab instruction, failure guidance, and evidence prompt all align to the identity-resolution stage and the later event cross-check stage instead of falling back to old `InterviewLog` messaging.
- Added regression coverage in [apps/web/src/App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) for the resolved `LicenseID` handoff, including the shift in Samuel's guidance, current objective, Query Lab instruction, failure guidance, and evidence prompt after both shortlisted women are identified in `PersonsOfInterest`.

## Audit Results

WP-135 Audit complete. The mastermind handoff logic correctly manages the transition from `InterviewLog` to `PersonsOfInterest` and then to the Symphony Hall cross-check.

### Audit Results: PASS

1.  **InterviewLog Taper**: Verified. Once the mastermind profile is complete and candidates are pinned, Samuel's guidance and the Query Lab support copy pivot to the BMW shortlist and identity lookup, effectively ending the `InterviewLog` mining phase.
2.  **Identity Lookup Phase**: Verified. `isMastermindIdentityLookupActive` correctly detects when a student is using `PersonsOfInterest` to resolve the pinned `LicenseID` values. The application provides specific guidance to stay with this table until both women are identified.
3.  **Cross-Check Handoff**: Verified. Once the query returns resolved names and `PersonID` values, `mastermindIdentityRowsAreResolved` triggers the final handoff guidance: "Good. You identified both women. Now use the returned PersonIDs to compare their December Symphony Hall trail in EventRegistration and EventSchedule."
4.  **Handoff Alignment**: Verified. `studentQueryRunnerInstruction`, `studentQueryFailureGuidance`, and `studentEvidencePrompt` all correctly reflect the same stage-specific logic in `useStudentCaseState.ts`.
5.  **Frontend Scope**: Verified. Changes are restricted to `apps/web/src/studentCase.ts`, `apps/web/src/useStudentCaseState.ts`, and `apps/web/src/App.test.tsx`.

### Observations
- **Transient State**: The "resolved identity" state depends on the current query results. If a student runs the next query (`EventRegistration`), the guidance may flip back to "Identify both shortlisted women" because the `PersonsOfInterest` results are no longer in the runner. This is consistent with the project's transient state architecture for intermediate lookups.
- **Lead Board Cards**: `getLeadBoardCards` in `studentCase.ts` still refers to "narrowing real person... in DriversLicense" during this phase. While this doesn't block progression, it is slightly less precise than the primary Samuel guidance.
- **Regression Coverage**: `App.test.tsx` includes a comprehensive test case (`Simulate Mastermind Identity Lookup`) that validates the objective, instruction, failure guidance, and mentor message updates for this specific handoff.

The implementation accurately fulfills the WP-135 requirements.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.
(node:72380) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)

## Verification

- `npm run test --workspace apps/web -- --run src/App.test.tsx`
- `npm run test --workspace apps/web -- --run src/components/QueryRunner.test.tsx src/App.test.tsx`
- Result: `86 passed`

## Final Decision

Accepted

