# student-noir-art-prompt-pack-and-asset-direction

## Objective

Create a production-ready artwork prompt package for Gemini / Nano Banana so Student Mode can move beyond generic placeholder scene art and use stronger, task-appropriate noir imagery.

This WP focuses on:

- defining a reusable visual bible for Student Mode case artwork
- creating scene-specific image generation prompts
- specifying output dimensions, composition, naming, and review criteria
- preparing the next implementation step that will replace the current temporary SVG scenes with generated image assets

The goal is to make artwork generation deliberate and repeatable instead of ad hoc.

---

## Scope

Create documentation and prompts for the external artwork generation workflow.

In scope:

- Student Mode noir art direction
- Gemini / Nano Banana prompt pack
- image output and crop requirements for the current header frame
- scene-by-scene prompt specifications
- asset naming and integration guidance
- work package documentation

Out of scope:

- generating final production images inside this WP
- replacing runtime assets
- frontend code changes
- backend changes
- database changes
- package or build configuration changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-064-student-noir-art-prompt-pack-and-asset-direction.md
- docs/13-art-direction/**
- docs/README.md

Do Not Modify:

- apps/**
- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve the deterministic no-runtime-AI project boundary
- Prompts must not introduce spoilers beyond the already guided opening case facts
- Prompts must produce assets that work in the narrow in-app browser header crop
- Prompts must avoid visible text inside generated images
- Prompt outputs should be easy to review and swap into the existing `student-scenes` asset path in a later WP

---

## Required Behavior

### 1. Visual Bible

Define a consistent Student Mode art direction that is more specific than "dark noir."

### 2. Scene Prompt Pack

Create prompts for the current Student Mode scene states:

- crime ledger
- records vault
- murder board
- open trail / student initiative
- clue confirmed
- false lead

### 3. Future Scene Hooks

Include prompt stubs for likely next states:

- witness lead
- gym lead
- suspect theory
- mastermind trail

### 4. Integration Guidance

Document required dimensions, safe crop zones, file naming, alt text expectations, and replacement workflow.

---

## Acceptance Criteria

- `WP-064` exists
- `docs/13-art-direction/` exists
- prompt pack includes a reusable visual bible
- prompt pack includes scene-specific Gemini / Nano Banana prompts
- prompt pack includes output, naming, and integration guidance
- docs index references the new art-direction folder
- no runtime files are changed

---

## Codex Prompt

Implement WP-064 student noir art prompt pack and asset direction.

Do:

- add the work package
- create an art-direction documentation folder
- write the Student Mode noir visual bible
- write scene-specific Gemini / Nano Banana prompts
- add asset output and integration guidance
- update the docs index

Do not:

- change runtime app code
- replace existing assets
- add dependencies
- change backend, database, package, or build files

Return:

- files changed
- prompt-pack summary
- generation workflow summary
- verification summary

---

## Gemini Audit Prompt

Audit WP-064 student noir art prompt pack and asset direction.

Verify:

1. Only approved documentation files were modified.
2. The visual bible is concrete enough to prevent generic dark artwork.
3. Scene prompts are specific, task-appropriate, and aligned to the Student Mode investigation states.
4. Prompts include crop, dimensions, no-text, consistency, and output guidance.
5. The package preserves the no-runtime-AI project boundary.
6. The docs index references the new art-direction folder.

Flag:

- vague prompts that could generate generic noir stock art
- prompts that reveal spoilers beyond the intended guided state
- missing output or integration constraints
- unauthorized runtime changes

---

## Codex Results

Implemented the Student Mode noir artwork prompt package as documentation-only preparation for a later generated-image replacement WP.

Files changed:

- `docs/01-work-packages/WP-064-student-noir-art-prompt-pack-and-asset-direction.md`
- `docs/13-art-direction/README.md`
- `docs/13-art-direction/STUDENT-NOIR-SCENE-PROMPTS.md`
- `docs/13-art-direction/GEMINI-COPY-PASTE-SCENE-PROMPTS.md`
- `docs/README.md`

Prompt-pack summary:

- added a reusable Student Mode noir visual bible for Gemini / Nano Banana generation
- added a shared negative prompt to reduce generic dark art, stock-photo drift, readable text, modern technology, spoilers, and clutter
- created scene-specific prompts for `crime-ledger`, `records-vault`, `murder-board`, `student-initiative`, `breakthrough`, and `misfire`
- added future scene prompt stubs for witness lead, gym lead, suspect theory, and mastermind trail
- added fully expanded copy-paste-ready Gemini / Nano Banana prompts for the six current Student Mode scene states

Generation workflow summary:

- specified 16:9 source generation, final `1280x720` export, crop safety, lower-left caption safe zone, and no-text image constraints
- documented batch generation, candidate rejection criteria, target file names, alt text guidance, and follow-up integration steps
- preserved the no-runtime-AI project boundary by keeping Gemini / Nano Banana usage in the development workflow only

Verification:

- confirmed `git status --short` shows only the approved documentation files for this WP
- no runtime tests were run because this package is documentation-only and does not modify application code

## Gemini Audit Results

PASS.

1. Verified only approved documentation files (`docs/**`) were modified.
2. The visual bible provides specific palette and lighting constraints that prevent generic results.
3. Scene prompts align with existing Student Mode states and maintain appropriate investigative tone.
4. Output requirements (16:9, crop-safety, no-text) are clearly documented.
5. The package strictly maintains the development-time-only AI boundary.
6. The docs index (`docs/README.md`) correctly references the new art direction package.

## Final Decision

Approved. This prompt pack is ready for use in a follow-up image generation and integration WP.
