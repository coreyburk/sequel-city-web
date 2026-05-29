WP-140 — Mastermind Clue Progression: gaps and recommendations

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
- No explicit progress indicator or checklist for the Mastermind 10/10 pinned clues — students can miss which clues remain.
- Tests pass but there's limited coverage for edge-cases: partial profile flow, re-running transcript after new pinned facts, and candidate cross-check flows.

Recommendations (work package tasks)
1) Add an explicit "Re-run Transcript" hint and lightweight CTA
   - When a pinned identity or EventID is added, show a transient hint inside the InvestigationBrief: "You added X — re-run the transcript to uncover more mastermind clues." Add an optional button that triggers `runQuery` with the last-saved transcript filter.
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
   - New tests: (a) Partial mastermind profile — pin 4/10 then re-run transcript and ensure additional clues appear; (b) Candidate cross-check — pin two candidates and follow EventSchedule → EventRegistration flow; (c) Re-run transcript CTA triggers additional Log row options.
   - Priority: High. Estimated: 1d.
   - Acceptance: New tests pass in headed and CI headless runs.

6) UX polish: reduce transform/positioning regressions
   - Ensure the Case File toggle remains visible across layouts without absolute transforms that create containing-block issues. Prefer layout using `right` or non-transformed stacking for overlay containers.
   - Priority: Low. Estimated: 0.25d.
   - Acceptance: No visual regressions and toggle remains visible in Playwright screenshots.

Files to touch
- `apps/web/src/components/student/StudentWorkbenchView.tsx` — add hint, progress indicator, copy affordance, normalize aria labels.
- `apps/web/src/components/CompactPinnedTray.tsx` — ensure concise rendering of tokens.
- `apps/web/tests/browser/*` — add new Playwright specs and harness extensions (`studentModeHarness.ts`).
- `apps/web/src/styles.css` — small CSS for counter and hint, avoid transforms on ancestor containers.

Acceptance criteria
- New UI elements are accessible (roles/labels) and covered by Playwright tests.
- Existing tests continue to pass (no regressions in Student Mode). Newly added tests cover the recommended flows.

Next steps
- If you approve, I'll implement tasks 1, 2, and 3 first on a new branch `wp-140/new` and open a PR with the changes and tests.

References
- Student Workbench: `apps/web/src/components/student/StudentWorkbenchView.tsx`
- Test harness: `apps/web/tests/browser/studentModeHarness.ts`

## Final Decision

Draft: Awaiting review

- Status: Draft — not yet Approved/Accepted.
- Reviewer: TBD
- Notes: Once the audit is complete, replace this section with a single-line decision containing the word "Approved" or "Accepted" (the `scripts/commit-work-package.ps1` script requires that exact text to allow committing).

When ready to commit via the project's work-package script, ensure this section contains `Approved` or `Accepted` and then run the script to create the canonical commit message.

