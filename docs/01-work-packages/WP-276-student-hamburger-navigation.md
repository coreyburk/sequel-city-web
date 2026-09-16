# Global Header Hamburger Navigation

## Objective

Replace the cluttered persistent header controls with one accessible hamburger menu while preserving all existing header actions.

## Scope

### In Scope

- Add a compact Menu trigger in the global application header.
- Place Case Library, Reset Progress, text-size controls, and Student/Admin mode controls inside its panel.
- Support keyboard focus on open, Escape and outside-pointer dismissal, and focus return to the trigger.
- Update App tests and the UI/UX SSOT.

### Out of Scope

- The playable-case Briefing, Query Lab, and Evidence Board tabs.
- Case progression, database, API, dependencies, and Case 001 content.

## Impact Analysis

### Understand Status
- Graph available: Yes; usable with non-structural drift.
- Analysis: `App.tsx` owns header control state and actions; `styles.css` owns header layout; `App.test.tsx` covers those controls.

### Affected Architecture
- Layers: React header interaction state, CSS, App tests, UI/UX SSOT.
- Consumers: student and admin users on every screen.
- Dependencies: existing action handlers and state remain unchanged.

### Regression Surface
- Tests: `apps/web/src/App.test.tsx`, web build, diff check.
- Workflow: open Menu, use a control, close by Escape or outside pointer, continue work.
- Security: no data, API, or progression boundary changes.

### Graph Update Decision
- Regeneration required: No; this is a local UI interaction change.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-276-student-hamburger-navigation.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:
- apps/web/src/components/student/**
- apps/web/src/studentCase001.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/tests/browser/**
- apps/api/**
- database/**
- package.json
- package-lock.json

## Constraints

- Use existing React and CSS only.
- Retain the existing in-case view tabs.
- Do not add dependencies or change application actions, persistence, or progression.

## Required Behavior

- The header presents one Menu trigger instead of a persistent strip of utility controls.
- The panel contains the same applicable actions and reflects current text size and mode.
- Opening focuses the first available control; Escape and outside interaction close it and return focus to Menu.

## Acceptance Criteria

- [x] Header controls are consolidated into an accessible hamburger menu.
- [x] Existing utility actions and in-case tabs are preserved.
- [x] Header menu interaction is covered by App tests.
- [x] Focused App tests and production build pass.
- [x] UI/UX SSOT describes the global header menu.
- [x] Independent audit and human acceptance are recorded.

## Code Prompt

Implement the global header menu only within the allowed files. Preserve existing action handlers and in-case navigation.

## Audit Prompt

Verify global-header scope, keyboard and pointer dismissal behavior, action preservation, test coverage, and no Case 001/Case 004 or dependency drift.

## Code Results

Implemented the global Menu trigger and panel. The panel contains the existing applicable utility, text-size, and mode controls; it focuses the first action on open and closes on Escape or outside pointer interaction with focus returned to the trigger. The original in-case tabs remain unchanged.

- `npm run test --workspace apps/web -- --run src/App.test.tsx --reporter=dot` — 66 passed.
- `npm run build --workspace apps/web` — passed.
- `git diff --check` — passed.

## Audit Results

Verdict: PASS

Auditor: independent audit completed; post-audit corrections restored the original in-case tabs and isolated the accepted global-header scope. No dependency, API, database, or progression changes were made.

## Final Decision

Accepted by the human reviewer after audit and visual review. Close out the global header hamburger menu.
