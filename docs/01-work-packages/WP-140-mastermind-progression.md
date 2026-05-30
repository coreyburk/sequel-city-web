WP-140: Mastermind Clue Progression - gaps and recommendations

Goal

- Ensure the Student Workbench guides students through a clear, testable Mastermind-clue progression so learners can reliably build the full mastermind profile.

Background

- Playwright headed tests exercise the Student Mode flows and currently pass (3 tests).
- The UI supports pinned facts, query-assist tokens, and a set of Mastermind-focused InvestigationBriefs in `StudentWorkbenchView.tsx`.
- Tests exercise `buildFullMastermindProfile()` which expects 10/10 "Mastermind profile clues pinned".

Observed gaps

- Implicit step: students must sometimes re-run a transcript or event query after pinning identities; the UI does not force or clearly suggest re-running queries when pinned facts change.
- Pinned-fact insert/assist labels use the full `entry.detail` in some aria-labels and token text; long labels can be noisy and make quick insertion less discoverable.
- Mastermind guidance relies on the student to carry EventID/LicenseID values across queries; there is no small clipboard-like affordance to copy proven values into the query editor beyond inserting tokens.
- No explicit progress indicator or checklist for the Mastermind 10/10 pinned clues â€” students can miss which clues remain.
- Tests pass but there's limited coverage for edge-cases: partial profile flow, re-running transcript after new pinned facts, and candidate cross-check flows.

Recommendations (work package tasks)

1) Add an explicit "Re-run Transcript" hint and lightweight CTA

   - When a pinned identity or EventID is added, show a transient hint inside the InvestigationBrief: "You added X â€” re-run the transcript to uncover more mastermind clues." Add an optional button that triggers `runQuery` with the last-saved transcript filter.
   - Priority: High. Estimated: 1d.
   - Acceptance: Manual test where pinning an identity shows the hint and clicking it runs the expected query and enables logging additional rows.
2) Normalize pinned-fact assist tokens and ARIA labels

   - Use short safe labels for assist buttons (e.g. `CrimeID = 1080`) for visible text but keep aria labels descriptive (e.g. `Add CrimeID = 1080 to query editor`). Avoid using entire `entry.detail` in aria/button names.
   - Priority: Medium. Estimated: 0.5d.
   - Acceptance: Playwright assertions still find tokens by accessible name; visual tokens are concise.
3) Add a Mastermind Clue Progress indicator

   - Show "Mastermind clues: N/10" prominently in the Mastermind InvestigationBrief and make it keyboard-focusable. Clicking it reveals the Case File > Pinned Facts filtered to only mastermind clues.
   - Priority: High. Estimated: 1d.
   - Acceptance: Page shows the counter; tests can query for the text and click to open the filtered Pinned Facts.
4) Provide a small value-copy affordance for pinned facts

   - Add a copy-to-editor or copy-to-clipboard action next to pinned values (small icon). Copy-to-editor inserts the exact token into the query runner; copy-to-clipboard lets students paste elsewhere.
   - Priority: Medium. Estimated: 0.75d.
   - Acceptance: Token insertion and clipboard copy actions work in Playwright and manual tests.
5) Test coverage: add edge-case Playwright tests

   - New tests: (a) Partial mastermind profile â€” pin 4/10 then re-run transcript and ensure additional clues appear; (b) Candidate cross-check â€” pin two candidates and follow EventSchedule â†’ EventRegistration flow; (c) Re-run transcript CTA triggers additional Log row options.
   - Priority: High. Estimated: 1d.
   - Acceptance: New tests pass in headed and CI headless runs.
6) UX polish: reduce transform/positioning regressions

   - Ensure the Case File toggle remains visible across layouts without absolute transforms that create containing-block issues. Prefer layout using `right` or non-transformed stacking for overlay containers.
   - Priority: Low. Estimated: 0.25d.
   - Acceptance: No visual regressions and toggle remains visible in Playwright screenshots.

Files to touch

- `apps/web/src/components/student/StudentWorkbenchView.tsx` â€” add hint, progress indicator, copy affordance, normalize aria labels.
- `apps/web/src/components/CompactPinnedTray.tsx` â€” ensure concise rendering of tokens.
- `apps/web/tests/browser/*` â€” add new Playwright specs and harness extensions (`studentModeHarness.ts`).
- `apps/web/src/styles.css` â€” small CSS for counter and hint, avoid transforms on ancestor containers.

Acceptance criteria

- New UI elements are accessible (roles/labels) and covered by Playwright tests.
- Existing tests continue to pass (no regressions in Student Mode). Newly added tests cover the recommended flows.

Next steps

- If you approve, I'll implement tasks 1, 2, and 3 first on a new branch `wp-140/new` and open a PR with the changes and tests.

References

- Student Workbench: `apps/web/src/components/student/StudentWorkbenchView.tsx`
- Test harness: `apps/web/tests/browser/studentModeHarness.ts`

## Code Prompt

- Implement the prioritized WP tasks (1, 2, 3) on a feature branch:
  - Add a transient "Re-run Transcript" hint and optional CTA inside the InvestigationBrief that triggers `runQuery` with the last-used transcript filter when a relevant pinned fact is added.
  - Normalize pinned-fact assist token visible labels while keeping descriptive ARIA labels for accessibility and test stability.
  - Add a Mastermind clues progress indicator `Mastermind clues: N/10` that is keyboard-focusable and opens the Case File filtered view when activated.
  - Add a small copy affordance (copy-to-editor / copy-to-clipboard) next to pinned values.

Files to modify (primary):

- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/CompactPinnedTray.tsx`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/*` (new/updated Playwright specs)
- `apps/web/src/styles.css`

Implementation notes:

- Preserve existing ARIA names used by Playwright tests or update tests concurrently.
- Avoid CSS `transform` on ancestors that must contain overlays; prefer non-transform positioning for Case File toggle.
- Keep changes small and covered by Playwright headed tests; add edge-case tests for partial profile flows.

## Code Results

- Implemented on branch `wp-140/draft` and supporting WIP branch `wp-140/draft-wip`.
- Files changed in this work (high-level):
  - `apps/web/src/components/student/StudentWorkbenchView.tsx` â€” added Mastermind clues counter, re-run hint, assist normalization and primary full-clue assist.
  - `apps/web/tests/browser/studentModeHarness.ts` â€” added waits/retries and helpers used by tests.
  - `apps/web/tests/browser/generate-case-steps.spec.ts` and `apps/web/tests/browser/case-steps.json` â€” test generation helpers and produced checklist.
  - `tools/generate_case_steps_from_tests.mjs` â€” extraction tool used to produce `case-steps.json`.
  - `apps/web/tsconfig.json` â€” whitespace/config updates (non-functional change to silence deprecation warnings).

Notes on runtime/test status:

- Playwright headed runs previously reported 3 passing Student Mode tests in local runs (see `apps/web/test-results/`). These results are a snapshot; please run CI or local headed tests to verify in your environment before merging.

## Audit Prompt

Please use the following checklist when auditing WP-140 before final acceptance:

1. Acceptance completeness

   - [ ] The `Re-run Transcript` hint appears when a pinned identity/EventID is added and triggers the expected query when clicked.
   - [ ] Mastermind clues counter displays correct `N/10` and clicking it opens the Case File filtered to mastermind clues.
   - [ ] Copy-to-editor inserts the exact token text into the query editor; copy-to-clipboard places value on clipboard.
2. Accessibility and ARIA

   - [ ] All new interactive elements are keyboard-focusable and have descriptive accessible names.
   - [ ] Assist token aria-labels are stable and match Playwright selectors, or tests have been updated accordingly.
3. Tests and non-regression

   - [ ] Playwright headed tests pass locally (student mode specs).
   - [ ] New edge-case tests (partial profile, re-run transcript CTA) were added and pass.
4. UX/visual checks

   - [ ] Case File drawer toggle remains visible across common layouts (verify via Playwright screenshots).
   - [ ] No layout regressions introduced by the new counter/hint CSS.

Reviewer guidance: when all items are checked, change the `## Final Decision` section to a single-line `Accepted` or `Approved` and return to the committer to run `scripts/commit-work-package.ps1` for canonical commit creation.

## Audit Results

The audit of **WP-140: Mastermind Clue Progression** is currently **Blocked**. 

### Investigation Findings
1.  **Branch Mismatch**: My research confirms that the implementation of WP-140 resides on the `wp-140/draft` branch. However, the current environment is on a different branch (likely `main`), and I do not have the `run_shell_command` tool required to perform a `git checkout`.
2.  **Missing Features**: A surgical inspection of `apps/web/src/components/student/StudentWorkbenchView.tsx` reveals that the core features of WP-140 (the "Re-run Transcript" hint, interactive Mastermind counter, and copy affordances) are absent. The current counter is a pre-existing static element that does not meet the interactivity requirements of Task 3.
3.  **Missing Files**: New files defined in the work package, such as `apps/web/src/components/CompactPinnedTray.tsx`, do not exist in the current worktree.
4.  **Tool Limitations**: In this session, I lack the necessary tools (`run_shell_command`, `replace`, `write_file`) to either switch branches or record the audit findings directly into the work package document.

### Audit Checklist Status
- [ ] **Acceptance completeness**: **FAIL** (Features missing from current worktree).
- [ ] **Accessibility and ARIA**: **FAIL** (New elements missing; pre-existing tokens are not normalized).
- [ ] **Tests and non-regression**: **UNVERIFIED** (Tests missing from worktree; no shell access to execute them).
- [ ] **UX/visual checks**: **UNVERIFIED** (Layout changes not present).

### Recommended Action
The Gemini audit session must be re-launched within the context of the `wp-140/draft` branch (e.g., using `--worktree wp-140/draft`) to allow for a successful verification of the implementation.
Ripgrep is not available. Falling back to GrepTool.

## Verdict
Blocked - The audit cannot be completed because the implementation branch (`wp-140/draft`) is not checked out in the current environment.

## Violations
- **Missing Features**: The "Re-run Transcript" hint (Task 1) and copy affordances (Task 4) are absent from `StudentWorkbenchView.tsx`.
- **Incomplete Requirements**: Pre-existing `mastermind-clues-counter` logic in `main` does not meet the focusability and interactive requirements defined in Task 3.
- **Action Required**: The Gemini audit session must be launched with the correct branch context (e.g., using `--worktree wp-140/draft`) to verify the implementation.

## Final Decision

Draft: Awaiting review

- Status: Draft â€” not yet Approved/Accepted.
- Reviewer: TBD
- Notes: Once the audit is complete, replace this section with a single-line decision containing the word "Approved" or "Accepted" (the `scripts/commit-work-package.ps1` script requires that exact text to allow committing).

When ready to commit via the project's work-package script, ensure this section contains `Approved` or `Accepted` and then run the script to create the canonical commit message.


