# clear query history endpoint and frontend action

## Objective

Allow investigators to explicitly clear in-memory query history from the UI and have the backend authoritatively reset the stored history records.

## Scope

### In Scope

- Add a backend endpoint for clearing query history.
- Keep query-history storage and reset authority in backend service code.
- Add a frontend action in the Query History panel that calls the new endpoint and updates visible state.
- Add focused route/service/client/component tests for the new behavior.

### Out of Scope

- Any persistence/database storage change for query history.
- Any redesign of the Query History panel beyond adding the action button and related disabled/loading states.
- Any changes to query execution, SQL safety, schema, or suspect verification behavior.
- Any new dependency additions.

## Files Allowed to Change

- docs/01-work-packages/WP-039-clear-query-history-endpoint-and-frontend-action.md
- apps/api/src/types/queryHistory.ts
- apps/api/src/services/queryHistoryService.ts
- apps/api/src/services/queryHistoryService.test.ts
- apps/api/src/routes/queryHistoryRoutes.ts
- apps/api/src/routes/queryHistoryRoutes.test.ts
- apps/api/src/app.ts
- apps/web/src/api/types.ts
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/components/QueryHistoryPanel.tsx
- apps/web/src/components/QueryHistoryPanel.test.tsx

## Constraints

- Preserve all existing query history read behavior.
- Keep backend as authority for clear/reset behavior.
- Keep change local to existing architecture and patterns.
- No refactors outside direct scope.

## Required Behavior

- Backend exposes `DELETE /api/query/history`.
- Successful clear response shape is deterministic and explicit, including `success: true` and cleared count metadata.
- Failures on clear return `success: false` with message and HTTP 500 from route layer.
- Frontend Query History panel includes a clear-history action that calls backend endpoint and reflects empty-history state without requiring page reload.
- Existing refresh behavior remains functional.

## Acceptance Criteria

- [x] `DELETE /api/query/history` is implemented and routed in backend.
- [x] Query history service supports authoritative clear/reset operation and returns deterministic clear response data.
- [x] Query History panel includes a clear action wired to backend and renders empty-history guidance after successful clear.
- [x] Focused tests cover backend clear route/service behavior and frontend API/client-panel action behavior.
- [x] No unrelated files changed.

## Codex Prompt

Implement the required behavior exactly as specified.

Scope:

- Only modify the allowed files.

Constraints:

- No refactors.
- No new dependencies.
- Preserve existing behavior outside clear-history scope.

Return:

- Exact code changes.
- Short summary of what was implemented.

## Gemini Audit Prompt

Audit this change against the work package.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regressions in existing query history retrieval/refresh behavior.
- Backend remains authority for query history state.

Output:

- Verdict: PASS or FAIL.
- Violations.
- Regressions.
- Drift risks.

## Codex Results

Completed:

- Defined and finalized WP-039 objective, scope, constraints, and acceptance criteria.
- Added backend `DELETE /api/query/history` route with deterministic success shape and 500 failure mapping.
- Added backend query-history clear response typing and service clear operation with cleared-count metadata.
- Added frontend API client clear-history call and Query History panel clear action wiring.
- Preserved existing history retrieval and refresh behavior.
- Added focused backend and frontend tests for clear-history behavior.

Updated Files:

- docs/01-work-packages/WP-039-clear-query-history-endpoint-and-frontend-action.md
- apps/api/src/types/queryHistory.ts
- apps/api/src/services/queryHistoryService.ts
- apps/api/src/services/queryHistoryService.test.ts
- apps/api/src/routes/queryHistoryRoutes.ts
- apps/api/src/routes/queryHistoryRoutes.test.ts
- apps/api/src/app.ts
- apps/web/src/api/types.ts
- apps/web/src/api/client.ts
- apps/web/src/api/client.test.ts
- apps/web/src/components/QueryHistoryPanel.tsx
- apps/web/src/components/QueryHistoryPanel.test.tsx

Validation Performed:

- `npm run test --workspace apps/api` (PASS)
- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [X] `DELETE /api/query/history` is implemented and routed in backend.
- [X] Query history service supports authoritative clear/reset operation and returns deterministic clear response data.
- [X] Query History panel includes a clear action wired to backend and renders empty-history guidance after successful clear.
- [X] Focused tests cover backend clear route/service behavior and frontend API/client-panel action behavior.
- [X] No unrelated files changed.

## Gemini Audit Results

Audit of WP-039 clear query history implementation is complete.

- Verdict: PASS
- Violations: None.
- Regressions: None.
- Drift risks: None.

  Verification Summary

1. Backend Implementation:

   - DELETE /api/query/history is implemented in queryHistoryRoutes.ts and registered in app.ts.
   - queryHistoryService.ts now includes a clearRecords method that resets the in-memory history and returns the count of cleared records.
   - Types were updated in queryHistory.ts to include ClearQueryHistoryResponse.
   - CORS configuration in app.ts was updated to allow the DELETE method.
2. Frontend Implementation:

   - api/client.ts now includes a clearQueryHistory method using the DELETE verb.
   - QueryHistoryPanel.tsx features a new "Clear History" button that triggers the backend clear operation and updates the local state to show the empty
     history guidance.
   - Loading and clearing states are correctly handled to prevent concurrent actions.
3. Testing:

   - Backend tests in queryHistoryRoutes.test.ts and queryHistoryService.test.ts verify the clear functionality and error handling.
   - Frontend tests in QueryHistoryPanel.test.tsx verify that clicking "Clear History" resets the view and displays the appropriate guidance.
   - All workspace tests passed successfully.
4. Integrity:

   - Backend remains the authority for the query history state.
   - Existing history retrieval and refresh logic remains functional and unaffected.
   - No files outside the allowed list were modified.

  Tests Run

  API Tests:

   1 PASS record creation stores success, blocked, and failed outcomes with incrementing ids
   2 PASS clear records returns cleared count, empties history, and resets ids
   3 PASS clear route handler delegates to service and returns deterministic cleared-count shape
   4 PASS clear route handler returns success false failure shape when clear throws

  Web Tests:

   1 Test Files  7 passed (7)
   2 Tests       15 passed (15)
   3 (Includes new tests for clearing records and returning to guidance)

  Strategic Intent: Audit WP-039 clear query history implementation.

  Audit Verdict: PASS

## Final Decision

Approved - Ready to Merge.
