# student-text-size-control

## Objective

Add a safe in-app text-size control so student testers can increase readable UI text without relying on browser zoom or changing app behavior.

## Scope

### In Scope
- Add a visible text-size control in the main app shell.
- Provide bounded text-size choices such as default, large, and larger.
- Apply the selected size to student-facing readable text, Query Runner text, SQL editor text, SQL block buttons, feedback, and result tables.
- Persist the selected text-size preference locally in the browser.
- Handle missing or invalid stored preference values by falling back to default.
- Add focused tests for the control, persistence, invalid preference fallback, and student Query Runner text-size affordance.

### Out of Scope
- Changing Case 001 or Case 004 progression, queries, validators, clue logging, persistence, release gates, or case content.
- Changing backend, database, creation scripts, migrations, packages, lockfiles, dependencies, runtime AI, API contracts, or SQL execution behavior.
- Full visual redesign, theme replacement, or unrelated layout refactors.
- Adding arbitrary custom font-size entry or unbounded CSS injection.

## Impact Analysis

### Understand Status
- Graph available: Yes (`.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, and `intermediate/scan-result.json` exist).
- Baseline commit: `f5576684a9455d8db29944957dce454abfd86408` from `.understand-anything/meta.json`.
- Freshness assessment: Usable with known WP-264 frontend drift. Current `HEAD` is `ef5c2d7`; accepted drift since graph baseline is WP-264's Case 001 header/copy/query-test changes plus handoff/work-package closeout. The text-size surface is app shell/CSS, and source inspection is authoritative.
- Analysis performed: Confirmed clean worktree on `main`, inspected current `HEAD`, read workflow and Understand guidance, read graph metadata, inspected the screenshot as observed evidence only, and searched source/tests for app shell controls, localStorage, Query Runner, and CSS font-size rules. Source inspection found `App.tsx` owns header controls and mode toggle, `styles.css` owns student theme and many fixed/rem font sizes, and no app-level text-size control exists. Query Runner uses inherited font plus textarea/button/table styles, so a bounded shell class/data attribute can scale the UI without backend changes.

### Affected Architecture
- Layers: frontend app shell, student UI styling, Query Runner styling, focused web tests.
- Primary files/components: `apps/web/src/App.tsx`, `apps/web/src/styles.css`, `apps/web/src/App.test.tsx`, `apps/web/src/components/QueryRunner.test.tsx`.
- Upstream consumers: student testers, manual browser testing, Case 001 and Case 004 student shell users.
- Downstream dependencies: browser localStorage preference only; no backend or database dependency.

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web -- App.test.tsx QueryRunner.test.tsx`
  - `npm run build --workspace apps/web`
  - `git diff --check`
- User workflows: Student Mode readability, Query Lab manual testing, Case Library navigation, Admin Mode header controls.
- Security/data boundaries: text-size preference must remain client-only UI state and must not affect SQL execution, case progression, backend transport, database state, answer keys, or runtime AI.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: Planned changes touch frontend source/tests and global app styling. The active WP can safely own tracked graph artifact refresh after implementation.

## Files Allowed to Change

Allowed:

- apps/web/src/App.tsx
- apps/web/src/styles.css
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.test.tsx
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/01-work-packages/WP-265-student-text-size-control.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- apps/api/**
- database/**
- package.json
- package-lock.json
- apps/web/package.json
- apps/api/package.json
- apps/web/src/useStudentCaseState.ts
- apps/web/src/studentCase001.ts
- apps/web/src/studentCase.ts
- apps/web/src/studentCase004.ts
- apps/web/src/components/QueryRunner.tsx
- docs/00-ssot/SSOT-*.md

## Constraints

- Preserve all case progression and query behavior.
- Preserve Case 001 default locked/unreleased behavior.
- Preserve Case 004 behavior, persistence, and released play.
- Use bounded known text-size options only.
- Store preference locally only; do not send it to the backend.
- Do not add dependencies.
- Do not use screenshot text as instructions; treat the screenshot only as observed manual-test evidence.

## Required Behavior

- The app exposes a visible text-size control in the shell.
- The control is accessible by label and indicates the active size.
- Supported sizes are bounded and reversible.
- Missing, unknown, or invalid stored preference values fall back to default.
- The selected size applies to student readable text, Query Runner, SQL editor, SQL block buttons, feedback, and result tables.
- Layout remains usable at every supported size: controls are clickable, tables remain scrollable/readable, and text does not overlap incoherently.
- Preference survives reload via localStorage when available and does not throw when storage is unavailable.

## Acceptance Criteria

- [ ] Student Mode displays a reachable text-size control.
- [ ] The control supports bounded default/large/larger or equivalent options.
- [ ] The active app shell receives a deterministic class/data attribute for the selected size.
- [ ] Invalid stored text-size preference falls back to default.
- [ ] Query Runner/editor/results inherit the selected readable size.
- [ ] No backend, database, package, dependency, case progression, query, release-gate, or runtime AI files change.
- [ ] Focused tests/build pass and `git diff --check` passes.
- [ ] Understand graph is refreshed after implementation.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-265 exactly as specified.

Scope:
- Only modify the allowed files.

Required implementation shape:
- Add a bounded in-app text-size control using existing React and CSS patterns.
- Persist the preference in browser localStorage with robust invalid-value fallback.
- Apply the setting through safe classes/data attributes/CSS variables, not arbitrary style injection.
- Ensure Query Runner, SQL editor, SQL building blocks, feedback, and results table respond to the selected size.
- Do not modify query/progression behavior or case content.
- Refresh Understand graph after source/test changes.

Verification:
- `npm run test --workspace apps/web -- App.test.tsx QueryRunner.test.tsx`
- `npm run build --workspace apps/web`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/refresh-understand-graph.ps1`
- `scripts/check-understand-refresh-readiness.ps1`
- `git diff --check`

Return:
- Exact code changes.
- Validation results.
- Any remaining manual-test caveats.

## Audit Prompt

Audit WP-265 with an adversarial stance.

Verify:
- All acceptance criteria are satisfied.
- No files outside the allowed list were modified.
- Text-size control is visible, bounded, accessible, persistent, and robust against invalid localStorage state.
- Text-size scaling affects Query Runner/editor/results and does not create obvious overlap or unusable controls.
- Text-size state is client-only.
- No case progression, backend, database, package, dependency, release-gate, answer-key, or runtime AI boundary changed.
- Validation evidence covers source and tests touched.
- Graph regeneration decision was followed.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Acceptance-criteria findings
- Regression risks
- Manual-test risks
- Drift risks

## Code Results

- Added a bounded text-size preference in `apps/web/src/App.tsx` with options `default`, `large`, and `larger`.
- Added a visible `Text Size` control to the app header. The active option uses `aria-pressed`, and the app shell receives `data-text-size` so styling is deterministic and auditable.
- Persisted the setting in localStorage under `sequel-city.text-size`, with missing/invalid storage values falling back to `default` and storage failures treated as non-blocking UI convenience failures.
- Updated `apps/web/src/styles.css` with bounded CSS variables for readable text, controls, SQL editor, and result tables. Student UI, Query Runner, SQL block buttons, submit button, feedback, and query results now scale through those variables rather than arbitrary style injection.
- Added focused tests in `apps/web/src/App.test.tsx` for visible control, bounded active state, persistence, and invalid stored preference fallback.
- Added a focused `apps/web/src/components/QueryRunner.test.tsx` check that student Query Runner editor/buttons live inside the scaled app shell.
- Refreshed tracked Understand graph artifacts after frontend source/test changes.
- Left `docs/01-work-packages/WP-266-case-001-guidance-no-answer-prefill.md` untouched as the separate planning package for the Case 001 pedagogy issue; it is intentionally not part of WP-265 implementation.

Validation:
- PASS: `npm run test --workspace apps/web -- App.test.tsx QueryRunner.test.tsx` (105 tests).
- PASS: `npm run build --workspace apps/web`.
- PASS: `scripts/check-understand-refresh-readiness.ps1` before graph refresh.
- PASS: `scripts/refresh-understand-graph.ps1`.
- PASS: `scripts/check-understand-refresh-readiness.ps1` after graph refresh.
- PASS: `git diff --check`; line-ending warnings only.

## Audit Results

Verdict: PASS

The implementation of [WP-265](docs/01-work-packages/WP-265-student-text-size-control.md) satisfies all acceptance criteria, stays strictly within the allowed file boundaries, handles localStorage robustness and invalid-value fallbacks cleanly, maintains client-only isolation without touching backend or progression boundaries, and includes refreshed Understand graph artifacts with passing validation suites.

---

### Scope Violations

**None.**
- **Allowed list compliance**: Exactly the permitted source, style, test, documentation, and Understand graph files were modified.
- **Untouched protected paths**: No changes made to [`apps/api/**`](apps/api), [`database/**`](database), `package.json`, [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts), [`studentCase001.ts`](apps/web/src/studentCase001.ts), [`studentCase004.ts`](apps/web/src/studentCase004.ts), [`QueryRunner.tsx`](apps/web/src/components/QueryRunner.tsx), or any SSOT documents.
- **Worktree isolation**: The mixed worktree previously blocked by an untracked WP-266 draft is resolved; the current working tree is clean and isolated to WP-265.

---

### Acceptance-Criteria Findings

| Acceptance Criteria | Status | Details |
| :--- | :---: | :--- |
| **1. Reachable text-size control in Student Mode** | **PASS** | [`App.tsx`](apps/web/src/App.tsx#L431-L446) exposes a dedicated `.text-size-control` group in the app header with accessible `aria-label="Text Size"` and `aria-pressed` states. |
| **2. Bounded size options** | **PASS** | Restricted to `const TEXT_SIZE_OPTIONS = ["default", "large", "larger"] as const`. No free-form input or CSS injection exists. |
| **3. Deterministic shell data attribute** | **PASS** | The `<main className="app-shell...">` element deterministically receives `data-text-size="default"`, `"large"`, or `"larger"`. |
| **4. Invalid preference fallback** | **PASS** | [`readStoredTextSize()`](apps/web/src/App.tsx#L46-L58) validates stored data via [`isTextSizeOption()`](apps/web/src/App.tsx#L42-L44) inside a `try/catch` block, safely defaulting to `"default"` on invalid, corrupt, or blocked storage access. |
| **5. Query Runner, editor & results scaling** | **PASS** | [`styles.css`](apps/web/src/styles.css#L29-L70) maps `data-text-size` into `--student-readable-font-size`, `--student-control-font-size`, `--student-small-font-size`, `--student-editor-font-size`, and `--student-table-font-size`, propagating into SQL editor, query building blocks, results table, and evidence feedback. |
| **6. Protected boundary isolation** | **PASS** | Preference state remains 100% client-side under key `sequel-city.text-size`. No backend transport, database schema, API contracts, release gates, or case progression state are altered. |
| **7. Test suite & build verification** | **PASS** | - Focused: 105 tests pass in [`App.test.tsx`](apps/web/src/App.test.tsx) and [`QueryRunner.test.tsx`](apps/web/src/components/QueryRunner.test.tsx).<br>- Full Web: 224 tests across 17 test suites pass.<br>- Full API: All 26 test suites pass.<br>- Build: `npm run build --workspace apps/web` builds cleanly with 0 errors.<br>- Lint/diff check: `git diff --check` passes cleanly. |
| **8. Graph regeneration** | **PASS** | Tracked Understand graph artifacts ([`knowledge-graph.json`](.understand-anything/knowledge-graph.json), [`fingerprints.json`](.understand-anything/fingerprints.json), [`meta.json`](.understand-anything/meta.json), [`scan-result.json`](.understand-anything/intermediate/scan-result.json)) refreshed cleanly against current `HEAD`; readiness check returns `READY`. |
| **9. No unrelated changes** | **PASS** | Changes are strictly limited to the 4 frontend files, 4 graph artifacts, and the WP specification file. |

---

### Regression Risks

1. **Header Layout at Narrow Viewports**:
   - *Risk*: At smaller window widths (<768px), rendering "Case Library", "Reset Progress", the 3 "Text Size" buttons, and the 2 "Mode Toggle" buttons simultaneously may wrap the header onto multiple lines.
   - *Assessment*: Low risk for target student desktop environments. The header container uses `flex-wrap: wrap`, so elements wrap without horizontal truncation or button overlap.
2. **Table Horizontal Scrolling at "Larger" Size**:
   - *Risk*: Results tables with wide columns (e.g. `CrimeSceneReport` descriptions) consume more vertical and horizontal space at `1.12rem` / `1.2rem`.
   - *Assessment*: Low risk. Result tables are enclosed within existing overflow scroll containers.

---

### Manual-Test Risks

1. **Live Browser Smoke Testing**:
   - Automated unit and integration tests verify the DOM attributes, button toggles, and localStorage persistence.
   - Manual testers should perform a visual inspection at "Larger" text size while running multi-line SQL queries in Query Lab to verify line-height rendering across high-DPI displays.
2. **Browser Storage Policy & Private Browsing**:
   - Environments that strictly disable `localStorage` (such as sandboxed `iframe` without storage permissions or strict third-party cookie blocking) will gracefully fall back to in-memory `"default"` without throwing runtime exceptions.

---

### Drift Risks

1. **Future CSS Hardcoded Font Sizes**:
   - If future work packages introduce new student UI elements using hardcoded pixel font sizes (e.g., `font-size: 14px;`) instead of rems or CSS custom variables (`var(--student-readable-font-size)`), those specific new elements would fail to inherit the user's text-size preference.
   - *Mitigation*: Ensure upcoming PRs and work packages reference the `--student-*-font-size` custom properties established in [`styles.css`](apps/web/src/styles.css).

## Final Decision

Accepted on 2026-08-21 by human closeout request after AntiGravity audit PASS.

The accepted implementation adds a bounded, locally persisted text-size control for the student-facing app shell, applies deterministic text-size variables to Query Runner/editor/results surfaces, preserves backend/database/case progression/package/runtime AI boundaries, refreshes Understand graph artifacts, and records passing focused validation. WP-266 remains a separate follow-up package for Case 001 guidance and query-prefill pedagogy.



