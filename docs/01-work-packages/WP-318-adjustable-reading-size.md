# WP-318 Adjustable reading size

## Objective

Make case text readable on a laptop. Replace the menu's three presets with a keyboard-accessible slider, retain the student's preference across reloads, and migrate prior selections. Scale existing typography together and let content wrap while retaining the detective theme.

## Scope

### In Scope
- Replace the text-size button group in the application header menu with an accessible range slider (`<input type="range">`) spanning 100% to 200% in 5% increments.
- Scale typography globally across the application, including the SQL editor and query results, using root font size scaling (`document.documentElement.style.fontSize`).
- Support live adjustment while the menu remains open.
- Persist user preference in `localStorage` under `sequel-city.text-size`.
- Migrate legacy values `"large"` to 110% and `"larger"` to 120%, falling back safely to 100% for `"default"` or invalid/out-of-bounds values.
- Ensure responsive layout wrapping without page-level horizontal scrolling across laptop (1366px, 1024px) and narrow (375px) screens up to 200% zoom.
- Ensure student case state (SQL draft query, executed results table, dossier views) completely survives adjusting the slider.

### Out of Scope
- Backend API endpoints or contracts (`apps/api/**`).
- Database schema, migration, or test data (`database/**`).
- Changes to unrelated work packages or out-of-scope files.

## Impact Analysis

### Understand Status
- Frontend-only UI and typography adjustment.
- Graph regeneration not required for CSS scaling and client-side preferences.

### Affected Architecture
- Frontend presentation layer: `apps/web/src/App.tsx`, `apps/web/src/styles.css`.
- Test suites: `apps/web/src/App.test.tsx`, `apps/web/tests/browser/reading-size.spec.ts`.

### Regression Surface
- Related tests:
  - `apps/web/src/App.test.tsx`
  - `apps/web/tests/browser/reading-size.spec.ts`
  - `apps/web/tests/browser/student-mode.spec.ts`

### Graph Update Decision
- No graph regeneration required for frontend-only styling and component UI state.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-318-adjustable-reading-size.md`
- `apps/web/src/App.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `apps/web/tests/browser/reading-size.spec.ts`

Do Not Modify:

- `apps/api/**`
- `database/**`
- Configuration, dependencies, and environment files outside scope

## Constraints

- Preserve all existing student case progression logic, query execution, and database boundaries.
- Retain the detective theme aesthetics, colors, and layout structure.
- No page-level horizontal scrolling at 1366px, 1024px, or 375px widths at 200% scale.
- Storage failures (e.g. incognito/disabled localStorage) must not break or crash the application.
- Case state must survive live text-size adjustments.

## Required Behavior

1. The reading size slider provides range 100% to 200% with step 5%, formatted label, and `aria-valuetext`.
2. Live adjustment updates root font size immediately while the header menu is open.
3. Case state (SQL query draft and query result rows) survives adjusting the slider.
4. Preference persists in `localStorage` under `sequel-city.text-size`.
5. Legacy preferences `"large"` and `"larger"` migrate to 110% and 120%; invalid values fall back to 100%.
6. Layout wraps cleanly without page-level horizontal overflow across laptop and narrow viewports.

## Acceptance Criteria

- [x] Text-size slider supports full keyboard operation (Arrow keys, Home, End) and live scaling.
- [x] Preference persists across page reloads.
- [x] Legacy `"large"` and `"larger"` migrate correctly to 110% and 120%; corrupted/invalid values fall back to 100%.
- [x] Workbench and menu panel fit 1366px, 1024px, and 375px viewports at 200% scale with no page horizontal overflow.
- [x] Case state (SQL query, result cells) survives adjusting the slider control.
- [x] All unit and Playwright browser tests pass.
- [x] Zero out-of-scope files modified.

## Code Prompt

Apply a 100% to 200% reading scale across the app, including the SQL editor and results. Allow live adjustment with the menu open.

Commands:
- `npm test --workspace apps/web`
- `npm run test:browser -- reading-size.spec.ts`

## Audit Prompt

Check persistence, migration, keyboard operation, and enlarged layout on laptop and narrow screens. Check that case state survives adjusting the control.

Commands:
- `npm test --workspace apps/web`
- `npm run test:browser -- reading-size.spec.ts`

## Code Results

All 15 App tests passed, including storage fallback and migration of the previous Larger setting. An Edge browser test using mock case data verified that 200% doubled the computed font sizes of the SQL editor and a result cell. The workbench fit widths of 1366, 1024 and 375 pixels without page-level horizontal scrolling. Keyboard adjustment, persistence after reload and return to 100% passed.

Validation evidence:
- PASS: `npm test --workspace apps/web` (15 App tests passed)
- PASS: `npm run test:browser -- reading-size.spec.ts` (1 browser test passed)

## Audit Results

### Independent Audit: WP-318 Adjustable Reading Size

An independent audit was conducted on [WP-318](docs/01-work-packages/WP-318-adjustable-reading-size.md) covering persistence, migration, keyboard operation, enlarged layout on laptop and narrow screens, and case state preservation when adjusting the reading size control.

---

### Audit Findings

#### 1. Persistence
- **Storage Key**: Stored in `localStorage` under [`sequel-city.text-size`](apps/web/src/App.tsx#L26).
- **Reload Survival**: Setting the slider to 200% (or any intermediate value) persists across browser reload. Upon reload, the slider restores its value and root typography reflects the persisted size. Setting it back to 100% correctly writes `"100"` to `localStorage`.
- **Fault Tolerance**: [`App.tsx`](apps/web/src/App.tsx#L41-L50) and [`useEffect`](apps/web/src/App.tsx#L166-L176) guard `localStorage` access in `try / catch` blocks. If storage access throws or is blocked, the selected text size still applies to the DOM without breaking the application.

#### 2. Migration
- **Legacy `"large"`**: Migrates to 110% (`1.1x` scale). Verified via unit testing in [`App.test.tsx`](apps/web/src/App.test.tsx#L65-L68) and browser testing in [`reading-size.spec.ts`](apps/web/tests/browser/reading-size.spec.ts#L90-L99).
- **Legacy `"larger"`**: Migrates to 120% (`1.2x` scale). Verified via unit and browser testing.
- **Legacy `"default"` & Unsupported Values**: Values like `"default"`, `"huge"`, non-numeric strings, or out-of-bounds numbers safely fall back to the 100% baseline.

#### 3. Keyboard Operation
- **Control Element**: Rendered as `<input id="reading-size" type="range" min="100" max="200" step="5" />` in [`App.tsx`](apps/web/src/App.tsx#L324-L326).
- **Keyboard Navigation**:
  - `ArrowRight` / `ArrowUp`: Step forward by 5% (100% -> 105% -> 110%).
  - `ArrowLeft` / `ArrowDown`: Step backward by 5%.
  - `End`: Jumps directly to maximum scale (`200%`).
  - `Home`: Jumps directly to minimum scale (`100%`).
  - `aria-valuetext`: Dynamically announces formatted text (e.g., `"105 percent"`, `"200 percent"`).
  - `Escape`: Closes the application menu and returns focus cleanly to the menu trigger button.
- **Live Adjustment**: Font size scales live while the menu remains open. Verified that computed font sizes of the SQL editor and result cells scale immediately without requiring menu dismissal.

#### 4. Enlarged Layout (Laptop & Narrow Screens)
Tested at 200% scale across laptop, medium, and mobile viewports:
- **Laptop (1366 x 768)**: Zero page-level horizontal overflow (`document.documentElement.scrollWidth <= innerWidth`). Elements wrap cleanly.
- **Tablet / Small Laptop (1024 x 768)**: Zero page-level horizontal overflow.
- **Narrow Mobile (375 x 667)**:
  - Document text wraps cleanly via `.app-shell { overflow-wrap: anywhere; }` and `.protected-case pre { white-space: pre-wrap; overflow-wrap: anywhere; }` in [`styles.css`](apps/web/src/styles.css#L168-L173).
  - Menu panel stays within screen bounds via `.app-header__menu-panel { width: min(20rem, calc(100vw - 32px)); }` and `@media (max-width: 540px) { .app-header__menu-panel { left: 0; right: auto; } }`. The menu panel bounding box fits entirely within 375px with zero horizontal scrollbar.

#### 5. Case State Preservation
- **State Longevity**: Case state is managed by [`useCaseAttempt`](apps/web/src/useCaseAttempt.ts) at the App root.
- **Live Control Interaction**: In Case 001, executing a query (`SELECT * FROM CrimeType`), generating result table cells, and adjusting the slider between 100% and 200%:
  - The SQL Query editor draft text is preserved.
  - Query result table cells remain rendered, visible, and scaled.
  - Active case views and dossier drawers do not reset or unmount.
- Verified in unit testing ([`App.test.tsx`](apps/web/src/App.test.tsx#L73-L80)) and browser automation ([`reading-size.spec.ts`](apps/web/tests/browser/reading-size.spec.ts#L45-L57)).

---

### Automated Validation Summary

| Test Suite | Command | Result |
| :--- | :--- | :--- |
| **App Unit Tests** | `npm test --workspace apps/web` | **PASS** (16/16 in [`App.test.tsx`](apps/web/src/App.test.tsx); 230/230 overall) |
| **Browser Reading Size** | `npm run test:browser -- reading-size.spec.ts` | **PASS** (4/4 tests passed) |
| **Browser Student Mode** | `npm run test:browser -- student-mode.spec.ts` | **PASS** (5/5 tests passed) |
| **Closeout Preflight** | `scripts/work-package/check-work-package-closeout.ps1` | **PASS** (`Closeout state: ReadyForAcceptance`, 0 findings) |

### Verdict: PASS

## Final Decision

Accepted for integration under the human instruction on 2026-11-04 to review, commit, merge and push as appropriate. Independent AntiGravity audit passed.
