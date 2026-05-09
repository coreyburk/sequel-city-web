# Art Direction

This folder contains visual direction and asset-production guidance for Sequel City Web Detective.

The current package is focused on Student Mode case artwork. These documents support development-time image generation only; the application must not call Gemini, Nano Banana, or any other image model at runtime.

## Documents

| Document | Purpose |
|---|---|
| `STUDENT-NOIR-SCENE-PROMPTS.md` | Visual bible, Gemini / Nano Banana prompts, output rules, and integration guidance for Student Mode scene assets |
| `GEMINI-COPY-PASTE-SCENE-PROMPTS.md` | Fully expanded standalone prompts that can be pasted directly into Gemini / Nano Banana |

## Runtime Boundary

- Image generation is a development workflow only.
- Generated images should be reviewed, selected, optimized, and checked into the repo as static assets.
- Student Mode should continue to render deterministic local assets.
