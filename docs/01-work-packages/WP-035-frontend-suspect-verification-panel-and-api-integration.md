# frontend suspect verification panel and api integration

## Objective

Implement the first frontend suspect verification experience by wiring the web app to the existing backend endpoint `POST /api/case/verify-suspect`.

The frontend must remain presentation-only while allowing the learner to submit a suspect name and view deterministic backend verification responses.

## Scope

### In Scope

- Add frontend API types and API client support for suspect verification.
- Add a new frontend panel for suspect verification input and response rendering.
- Integrate the panel into the existing app layout.
- Add frontend tests for API client request shape and panel behavior.
- Update user-journey and architecture docs that currently state frontend suspect verification UI is not implemented.
- Create WP-035 record and update its result sections.

### Out of Scope

- Backend route or service changes.
- Database changes.
- Full deterministic case progression UI.
- Notebook persistence.
- Authentication or authorization.
- Runtime AI behavior.
- Broad style refactors unrelated to the new panel.

## Files Allowed to Change

- apps/web/src/api/types.ts
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/components/SuspectVerificationPanel.tsx
- apps/web/src/components/SuspectVerificationPanel.test.tsx
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- apps/web/src/vitest.setup.ts
- docs/06-architecture/frontend-backend-boundaries.md
- docs/10-user-journey/README.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/deterministic-learning-model.md
- docs/11-testing-strategy/frontend-rendering-testing.md
- docs/11-testing-strategy/api-contract-verification.md
- docs/01-work-packages/WP-035-frontend-suspect-verification-panel-and-api-integration.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- package files outside `apps/web`
- build configuration

## Constraints

- Frontend remains presentation-only.
- Backend remains the authority for suspect correctness and verdict text.
- No hidden suspect names in frontend code.
- Preserve current query runner read-only SQL guidance.
- No new dependencies.
- Keep the panel style aligned with current app UI patterns.
- Keep documentation aligned to implemented behavior only.

## Required Behavior

### Frontend API Client

- Add `verifySuspect(suspect: string)` in `apps/web/src/api/client.ts`.
- Request must call `POST /api/case/verify-suspect` with JSON body `{ suspect }`.
- Use existing request helper and error handling behavior.

### Frontend Types

- Add request/response types for case verification in `apps/web/src/api/types.ts`.
- Include success response with `data.suspect` and `data.verdict`.
- Include failure response with `message`.

### New Panel

Add `SuspectVerificationPanel` with:

- input field for suspect full name
- submit button
- loading state
- backend success rendering for suspect and verdict
- backend failure rendering for message
- network error rendering via existing API client behavior
- no frontend correctness logic

### App Integration

- Render `SuspectVerificationPanel` in the app grid.
- Keep existing panels intact.

### Tests

- Add API client test for `verifySuspect` request method and body.
- Add component tests for:
  - successful verification rendering
  - malformed/failed response rendering
  - request submission behavior
- Apply minimal Vitest setup compatibility fix if required for local test execution.

### Documentation

- Update docs to reflect:
  - frontend verification UI is now implemented
  - backend remains correctness authority
  - case progression remains future scope

## Acceptance Criteria

- [ ] Frontend can submit suspect names to `POST /api/case/verify-suspect`.
- [ ] Frontend renders backend success verdict text without local correctness logic.
- [ ] Frontend renders backend failure and network error messages.
- [ ] API client includes typed `verifySuspect` helper.
- [ ] New panel is integrated into `App.tsx`.
- [ ] Web tests pass for updated API client and new panel.
- [ ] Documentation updates are consistent with implemented behavior.
- [ ] No backend files changed.
- [ ] No database files changed.
- [ ] No unrelated files changed.

## Codex Prompt

Implement WP-035 for Sequel City Web Detective.

Goal:
Add a frontend suspect verification panel that calls the existing backend endpoint and presents deterministic backend responses.

Rules:

- Frontend-only implementation.
- No backend or database changes.
- No new dependencies.
- No hidden suspect names in frontend code.
- Preserve presentation-only frontend boundaries.

Implement:

- frontend types and API helper for case verification
- new `SuspectVerificationPanel` component + tests
- app integration and minimal style updates
- docs updates listed in allowed files

Verify:

- run `npm run test --workspace apps/web`
- report any limitations

Return:

- files changed
- test results
- final scope check

## Gemini Audit Prompt

Audit WP-035 frontend suspect verification panel implementation.

Verify:

1. Only allowed files changed.
2. No backend files changed.
3. No database files changed.
4. Frontend calls `POST /api/case/verify-suspect` with expected body.
5. Frontend renders backend verdict text and messages without local correctness logic.
6. Frontend remains presentation-only.
7. No hidden suspect names are hard-coded.
8. Tests cover API client request and panel behavior.
9. Docs now reflect that frontend verification UI is implemented.
10. Docs still keep case progression as future scope.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-035.

Created:

- apps/web/src/components/SuspectVerificationPanel.tsx
- apps/web/src/components/SuspectVerificationPanel.test.tsx

Updated:

- apps/web/src/api/types.ts
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- apps/web/src/vitest.setup.ts
- docs/06-architecture/frontend-backend-boundaries.md
- docs/10-user-journey/README.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/deterministic-learning-model.md
- docs/11-testing-strategy/frontend-rendering-testing.md
- docs/11-testing-strategy/api-contract-verification.md

Implementation summary:

- Added typed frontend case-verification response models.
- Added `verifySuspect(suspect)` API client helper for `POST /api/case/verify-suspect`.
- Added `SuspectVerificationPanel` with suspect input, submit/loading states, backend error rendering, and backend verdict rendering.
- Integrated the panel into `App.tsx`.
- Added API client test coverage for request method/path/body and component tests for submission, success rendering, and failure rendering.
- Updated architecture/user-journey/testing docs to reflect that frontend verification UI is now implemented while preserving backend authority and future case progression boundaries.

Verification performed:

- Full suite attempt:
  - `npm run test --workspace apps/web` failed due existing repo test configuration (`describe`/`it` globals unavailable by default).
- Compatibility attempt:
  - `npm run test --workspace apps/web -- --globals` ran with globals but surfaced one existing out-of-scope failure in `QueryRunner.test.tsx` (text-count assertion).
- Focused WP-035 verification:
  - `npm run test --workspace apps/web -- --globals src/api/client.test.ts src/App.test.tsx src/components/SuspectVerificationPanel.test.tsx`
  - Result: PASS (`3` files, `8` tests).

Scope check:

- No backend files changed.
- No database files changed.
- All changes are within WP-035 allowed files.

## Gemini Audit Results

Audit of WP-035 frontend suspect verification panel implementation is complete.

- Verdict: PASS
- Violations: None.
- Regressions: None.
- Drift risks: None.

  Verification Summary

1. Scope Control: Only allowed frontend files were modified. No backend (apps/api/**) or database (database/**) files were changed.
2. API Integration: The frontend api/client.ts now includes a verifySuspect(suspect) helper that correctly calls POST /api/case/verify-suspect with the expected
   JSON payload.
3. Presentation-Only Boundary: SuspectVerificationPanel.tsx is purely presentation-focused. It delegates verification to the backend and renders the returned
   verdict and message without any local correctness logic or hard-coded secrets.
4. UI Integration: The SuspectVerificationPanel is successfully integrated into the main App.tsx layout alongside existing panels.
5. Answer Privacy: No hidden suspect names or solution-related strings were found in the frontend code or documentation.
6. Tests: Focused Vitest runs for the API client, App.tsx, and the new SuspectVerificationPanel all pass (8 tests passed).
7. Documentation: Architecture, user-journey, and testing docs were updated to reflect that the frontend verification UI is now implemented while maintaining
   the boundary that full case progression is future scope.

  Tests Run

   1 Test Files  3 passed (3)
   2 Tests       8 passed (8)
   3
   4 src/api/client.test.ts (2 passed)
   5 src/App.test.tsx (4 passed)
   6 src/components/SuspectVerificationPanel.test.tsx (2 passed)

  Files Modified

- apps/web/src/api/client.ts
- apps/web/src/api/types.ts
- apps/web/src/components/SuspectVerificationPanel.tsx (new)
- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/vitest.setup.ts
- docs/06-architecture/frontend-backend-boundaries.md
- docs/10-user-journey/learner-workflow.md (and other user-journey/testing docs)

  Strategic Intent: Audit WP-035 frontend suspect verification panel implementation.

  Audit Verdict: PASS

## Final Decision

Approved.

Reason:
Codex implementation completed within scope, focused frontend verification tests passed for changed areas, and Gemini audit returned PASS with no violations, regressions, or drift risks. The frontend suspect verification UI is now implemented while backend authority and future case progression boundaries remain intact.

Commit is approved for this work package.
