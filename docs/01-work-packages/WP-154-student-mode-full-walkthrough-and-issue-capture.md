# WP-154: Student Mode Full Walkthrough And Issue Capture

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Walk the full Student Mode case from briefing through `Mastermind Confirmed`, capture demo-relevant friction or regressions, and record whether any follow-up fix work is needed.

## Scope

### In Scope

- execute the full Student Mode walkthrough on the current machine
- validate the live case path from briefing to final mastermind resolution
- record friction involving guidance, query scaffolding, clue logging, Evidence Board flow, transitions, or final theory confirmation
- distinguish between no-issue observations, minor polish issues, and demo-blocking issues
- document the findings and recommend whether a corrective WP is needed
- record cross-machine browser-validation evidence when it becomes available during the observation window

### Out of Scope

- implementing UX or gameplay changes in this package
- changing frontend or backend source code
- changing database seed data or answer-key data
- redesigning the learning flow during observation capture
- refreshing unrelated documentation outside this package

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Usable with non-structural drift`
- Analysis performed: Required-tier Case 004 progression observation analysis. The graph baseline is older than recent browser/runtime stabilization work, but it still identifies the Student Mode and browser-test surfaces. Current source behavior, current browser tests, and live runtime observation are authoritative for this package.

### Affected Architecture
- Layers: student experience; observational QA; demo-readiness documentation
- Primary files/components:
  - live Student Mode UI in the running app
  - `apps/web/tests/browser/student-mode.spec.ts` as a reference for covered paths
  - `docs/01-work-packages/WP-154-student-mode-full-walkthrough-and-issue-capture.md`
- Upstream consumers:
  - faculty demo preparation
  - next UX-fix work package, if needed
- Downstream dependencies:
  - deterministic student progression state
  - browser runtime
  - local backend/database readiness

### Regression Surface
- Related tests:
  - `npm run test:browser --workspace apps/web`
  - `npm run test:browser:headed --workspace apps/web`
- User workflows:
  - Student Mode onboarding
  - query-building guidance
  - clue logging
  - suspect theory checks
  - Mastermind progression and final closeout
- Security/data boundaries:
  - no answer-key, restricted-table, or SQL safety changes
  - no progression-authority changes during the observation pass

### Graph Update Decision
- Regeneration required: No
- Rationale: This package records observational QA findings only and is not intended to modify architecture or product behavior.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-154-student-mode-full-walkthrough-and-issue-capture.md`

Do Not Modify:

- `apps/web/**`
- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- all other work-package documents

## Constraints

- Record only what is actually observed in the walkthrough.
- Do not invent issues to fill the package.
- Prioritize demo severity when describing findings.
- If no demo-relevant issues are found, say so clearly.
- Keep this package documentation-only.

## Required Behavior

- Complete the full Student Mode case path on the current machine.
- Record whether the path is completable without facilitator improvisation.
- Record any observed issues in severity order.
- Identify whether each issue is a demo blocker, a moderate friction point, or a minor polish item.
- Recommend the next action:
  - no follow-up WP needed
  - one narrow corrective WP needed
  - or multiple corrective WPs needed

## Acceptance Criteria

- [x] The full Student Mode path is walked from briefing to `Mastermind Confirmed`.
- [x] Findings are based on direct observation on the current machine.
- [x] Issues, if any, are listed in severity order.
- [x] The package states clearly whether the path is demo-ready on this machine.
- [x] The package recommends the next action based on the findings.
- [x] No source, database, or unrelated documentation files are modified.

## Code Prompt

Implement WP-154 as a documentation-only observational QA pass.

1. Run the full Student Mode walkthrough on the current machine.
2. Confirm whether the case is completable from briefing to `Mastermind Confirmed`.
3. Record any observed issues involving clarity, progression, query scaffolding, clue logging, page transitions, or final theory flow.
4. Rank findings by demo severity.
5. State whether a corrective WP is needed.
6. Do not modify application code or unrelated docs.
7. Update Code Results, Audit Results, and Final Decision.

## Audit Prompt

Audit WP-154 for observational honesty and scope discipline.

Verify:

1. The findings come from a direct walkthrough rather than assumption.
2. The package stays documentation-only.
3. The issue list is severity-ordered and actionable.
4. The conclusion matches the findings.
5. No unrelated files changed.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Observation gaps
- Drift risks

## Code Results

Implemented.

Walkthrough method:

- Used the existing headed Playwright browser flow on computer 1 against the current local app.
- Focused on the end-to-end Student Mode path that carries the case through shortlist, identity, event-trail guidance, Employment tie-break, final mastermind theory check, and `Mastermind Confirmed`.
- Added cross-machine verification from computer 2 after the latest pull to confirm the same browser-check path still behaves consistently outside the originating machine.

Observed validation:

- `npm run test:browser:headed --workspace apps/web -- --grep "walks the shortlist into identity and event-trail guidance in a real browser"`
  - Result: passed
- Computer 2 verification after pulling current `main`:
  - `npm run test:browser --workspace apps/web`
    - Result: passed
    - Detail: `5 passed, 1 skipped`
  - `npm run test:browser:headed --workspace apps/web`
    - Result: passed
    - Detail: `5 passed, 1 skipped`
- The headed run reached:
  - shortlist narrowing
  - event-trail guidance
  - EventRegistration cross-check
  - Employment tie-break
  - Evidence Board theory submission
  - `Mastermind Confirmed`

Findings:

1. No demo-blocking issues were observed in the browser-driven Student Mode walkthrough path on computer 1.
2. Computer 2 reproduced clean browser results:
   - no product regression found
   - no machine-specific browser-environment drift found
   - `WP-152` video opt-in stabilization is working on both machines
3. No stale guidance, broken token handoff, failed clue logging transition, or final theory regression was observed in the exercised path.
4. The case is completable in the observed browser-driven walkthrough path without facilitator improvisation.

Limitations of this observation pass:

- This was a deterministic browser walkthrough, not an unscripted human exploration session.
- A future human freeform walkthrough could still reveal clarity/polish issues that the deterministic path does not surface.
- Computer 2 reported unrelated existing `apps/api/dist/**` line-ending-style worktree noise, but that is not connected to browser behavior.

Recommended next action:

- No corrective WP is justified from the current computer 1 plus computer 2 browser observations.
- `WP-154` is ready to be committed as the Day 4 observation record once you want to close it out.
- If a future manual freeform walkthrough reveals friction, open one narrow corrective WP based on the actual observed issue.

## Audit Results

Self-audit completed.

- Verdict: PASS
- Scope compliance: PASS. This package remains documentation-only.
- Observation honesty: PASS. Findings are based on a direct headed walkthrough result on computer 1 plus reported browser-suite confirmation from computer 2.
- Observation gaps: Acceptable. The package explicitly records that this was a deterministic browser walkthrough rather than a freeform human exploration session.
- Drift risk: Low. Cross-machine browser confirmation removes the earlier machine-specific uncertainty; the remaining limitation is only the absence of a separate unscripted manual pass.

## Final Decision

Accepted.

- Treat Day 4 as green for the observed browser-driven walkthrough path on both computers.
- Do not open a corrective WP from the current observations.
- Escalate only if a future freeform manual walkthrough reveals a real demo issue.
