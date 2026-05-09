# student-generated-noir-artwork-integration

## Objective

Replace the temporary Student Mode SVG scene placeholders with regenerated noir PNG artwork created from the WP-064 prompt direction.

This WP focuses on:

- promoting reviewed generated PNGs into stable runtime asset names
- wiring Student Mode scene states to the new PNG artwork
- preserving the deterministic no-runtime-AI boundary
- keeping the implementation narrow enough for direct visual audit

---

## Scope

In scope:

- Student Mode scene artwork assets
- Student Mode scene imports
- generated PNG asset review
- work package documentation

Out of scope:

- additional image generation after this reviewed batch
- layout redesign
- query progression changes
- backend changes
- database changes
- package or build configuration changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-065-student-generated-noir-artwork-integration.md
- apps/web/src/App.tsx
- apps/web/src/assets/student-scenes/*.png

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve deterministic bundled assets only; no runtime AI image generation
- Use stable file names that match existing scene state names
- Avoid artwork with visible watermarks, signatures, readable text, logos, or spoiler content
- Preserve existing alt text and scene-state logic unless a visual mismatch requires correction

---

## Required Behavior

### 1. Runtime Asset Replacement

Student Mode must load PNG scene artwork from `apps/web/src/assets/student-scenes/` instead of the temporary SVG placeholders.

### 2. Scene-State Coverage

The following scene states must have generated PNG assets:

- `crime-ledger`
- `records-vault`
- `murder-board`
- `student-initiative`
- `breakthrough`
- `misfire`

### 3. Visual Review

The replacement assets should be checked for:

- no visible text
- no watermark or generated corner mark
- no modern technology
- distinct enough scene composition for state changes
- noir lighting consistent with WP-064

---

## Acceptance Criteria

- Six generated PNG scene assets exist with stable names
- `App.tsx` imports the PNG scene assets
- Student Mode scene-state logic remains deterministic
- no runtime AI dependency is introduced
- frontend tests pass

---

## Codex Prompt

Implement WP-065 student generated noir artwork integration.

Do:

- review the regenerated PNG candidate assets
- promote the selected candidates to stable scene asset names
- update Student Mode imports from SVG placeholders to PNG assets
- verify tests
- document the implementation results

Do not:

- redesign the Student Mode layout
- introduce runtime AI generation
- change backend, database, package, or build files

Return:

- files changed
- asset review summary
- verification summary

---

## Gemini Audit Prompt

Audit WP-065 student generated noir artwork integration.

Verify:

1. Six generated PNG scene assets exist with stable names.
2. `App.tsx` imports PNG artwork instead of SVG placeholders.
3. The image replacement does not introduce runtime AI, new dependencies, or build configuration changes.
4. The generated artwork has no obvious visible text, watermark, signature, logo, or spoiler content.
5. Scene-state behavior remains deterministic.
6. Frontend tests pass or failures are clearly documented.

Flag:

- stale references to SVG placeholder assets
- generated artwork that contains readable text or watermark-like marks
- missing scene states
- unauthorized runtime or configuration changes

---

## Codex Results

Implemented the generated noir artwork integration for Student Mode.

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/assets/student-scenes/breakthrough.png`
- `apps/web/src/assets/student-scenes/crime-ledger.png`
- `apps/web/src/assets/student-scenes/misfire.png`
- `apps/web/src/assets/student-scenes/murder-board.png`
- `apps/web/src/assets/student-scenes/records-vault.png`
- `apps/web/src/assets/student-scenes/student-initiative.png`
- `docs/01-work-packages/WP-065-student-generated-noir-artwork-integration.md`

Asset review summary:

- reviewed the regenerated PNGs before integration
- replaced the initial `crime-ledger.png` integration candidate after review found an anatomical hand/shoulder mismatch
- restored richer ledger texture in `crime-ledger.png` using ruled rows and blurred handwriting-like marks while avoiding intentionally readable case text
- confirmed the selected assets do not show obvious logos, signatures, or watermark-like corner marks
- confirmed the scenes are more specific and task-appropriate than the temporary SVG placeholders, while noting that future image review should prefer illegible case-file texture over sterile blank paper
- retained deterministic local asset loading only

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 30 tests
- `npx vite build` from `apps/web` passed and emitted all six PNG scene assets
- `npm run build` is still blocked by pre-existing API TypeScript errors before the web bundle runs
- `npm run build --workspace apps/web` is still blocked by pre-existing web TypeScript errors in `vite.config.ts` and `QueryRunner.test.tsx`
- in-app browser automation could not attach to the visible Codex browser pane in this session, so visual runtime verification remains manual

## Gemini Audit Results

Pending.

## Final Decision

Approved by user for commit and push. Gemini audit remains pending for follow-up review.
