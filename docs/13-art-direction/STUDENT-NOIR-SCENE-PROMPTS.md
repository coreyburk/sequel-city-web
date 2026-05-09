# Student Noir Scene Prompt Pack

## Purpose

Use this prompt pack to generate production candidate artwork for the Student Mode case header. The current SVG scenes are acceptable placeholders, but the target artwork should feel more like authored case illustrations: specific, cinematic, and tied to the student's current investigative task.

Use Gemini / Nano Banana during development to generate static assets. Do not add runtime image generation to the application.

## Output Requirements

- Format: PNG or WebP preferred for final app assets.
- Source generation size: `1792x1024` or larger, 16:9.
- Final app size: export optimized `1280x720` assets.
- Crop behavior: must work with `object-fit: cover` inside the existing Student Mode header frame.
- Safe zone: keep the most important subject in the center and right-center of the frame.
- Overlay zone: leave darker, lower-detail space in the lower-left third for the app's badge and caption overlay.
- Text in image: no readable text. Blurred handwriting-like marks, ruled ledger rows, indistinct form fields, and out-of-focus photo evidence are encouraged when they add case texture, but they must not contain legible words, dates, names, table names, SQL, or spoiler facts.
- Style consistency: all scenes must look like one illustrated case world.
- Accessibility: each image must have a short descriptive alt text in the app.
- Spoiler control: do not show culprit faces, final suspects, solution names, or final mastermind imagery.

## Shared Visual Bible

Use this shared direction at the top of every generation prompt.

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The scene should feel like a handcrafted case-file illustration, not stock photography and not a generic dark interface background. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cold streetlight blue. Strong chiaroscuro lighting, rain-streaked glass, desk-lamp glow, paper texture, dust, smoke haze, and tactile evidence materials. The composition must be readable in a narrow web-app header crop. Keep the focal action in the center or right-center. Leave the lower-left third darker and less detailed for an overlaid app caption. Include convincing case-file texture such as blurred handwriting-like marks, ruled paper, smudged forms, and out-of-focus photo evidence, but no readable text anywhere in the image. No logos. No UI. No modern devices. No photorealistic celebrity likeness. No final suspect reveal. High-quality editorial illustration, cinematic, moody, specific, classroom appropriate.
```

## Negative Prompt

Use this negative prompt with every scene.

```text
generic dark background, plain gradient, blank sterile paper, stock photo, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapons pointed at viewer, readable text, readable labels, legible handwriting, legible numbers, UI panels, computer screens, modern smartphone, comic speech bubbles, cute mascot, cartoonish child style, final culprit reveal, explicit violence, cluttered unreadable composition, washed out contrast, blurry low detail, oversaturated colors, malformed hands, impossible wrist position, detached limbs, crossed-up left/right anatomy
```

## Scene Prompts

### 1. Crime Ledger

Use for `crime-ledger`.

```text
[Shared Visual Bible]

Scene: A detective's wooden desk under a single brass lamp. An old city crime ledger lies open, with ruled columns, blurred handwriting-like marks, smudged row patterns, and one row subtly indicated by a brass magnifying glass and a red thread marker. A gloved right hand rests near the ledger as if Samuel Tupleton has just opened the first clue; the right hand, wrist, arm, and shoulder must align anatomically. Around the ledger are a fountain pen, clipped report corners, coffee ring stains, and a folded city precinct envelope. The mood should signal "start here, identify the crime type" without showing any readable text.

Composition: ledger and magnifying glass in the center-right, lamp glow from upper-left, lower-left third kept dark and calm for app caption overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir detective desk with an open crime ledger under a brass lamp
```

### 2. Records Vault

Use for `records-vault`.

```text
[Shared Visual Bible]

Scene: A basement police records vault with tall metal archive drawers stretching into shadow. Several drawers are half-open, spilling manila folders and report sheets onto a rolling evidence cart. A cone of light from a hanging lamp cuts through dust in the air. The scene should feel like the student has opened a large backlog of crime scene reports and now needs to understand which fields matter. No readable labels or text.

Composition: archive drawers recede into the background, evidence cart and folders in center-right, deep shadow lower-left for app caption overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir police records vault with open archive drawers and case folders
```

### 3. Murder Board

Use for `murder-board`.

```text
[Shared Visual Bible]

Scene: A cork evidence board and desk surface covered with crime scene report fragments, city map corners, pinned photographs turned partly away, and red thread connecting a few clues. The board should feel focused and investigative, not chaotic. A single report card is visually emphasized with light and a pin, but contains no readable text. The scene should signal "the student has narrowed the report set and must identify the exact case row."

Composition: emphasized report card in center-right, red thread leads toward it, lower-left remains darker and uncluttered for app caption overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir evidence board with pinned report fragments and red thread
```

### 4. Open Trail

Use for `student-initiative`.

```text
[Shared Visual Bible]

Scene: A detective case desk after the guided opening clues are complete. The desk holds a notebook, two partially revealed witness index cards, a city street map, a trail of red string, and several unpinned evidence pieces waiting for the student to choose the next direction. The feeling should be agency and possibility: the detective has enough clues to decide what to investigate next. No readable text, no suspect reveal.

Composition: open notebook and unpinned leads in center-right, subtle path of string moving toward the upper-right, lower-left shadow reserved for app overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir case desk with notebook, map, and unresolved witness leads
```

### 5. Clue Confirmed

Use for `breakthrough`.

```text
[Shared Visual Bible]

Scene: A confirmed clue being pinned to a cork evidence board. A warm desk lamp catches the pin, a red thread tightens from that clue to a small cluster of related evidence, and the rest of the room falls into cool shadow. The image should feel like a successful discovery moment: not celebratory, but precise and satisfying. No readable text.

Composition: newly pinned clue in center-right with the brightest light, strong diagonal red thread, lower-left remains dark for app caption overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir evidence board with a newly confirmed clue pinned under warm light
```

### 6. False Lead

Use for `misfire`.

```text
[Shared Visual Bible]

Scene: A rejected clue on the evidence board. One pinned card is turned sideways with a red pencil slash across it, while nearby clues remain intact and waiting. The image should communicate "this evidence did not hold up, re-check the row" without feeling punitive or scary. Keep the tone investigative and recoverable. No readable text.

Composition: rejected clue in center-right, red pencil and crossed string visible, lower-left dark and calm for app caption overlay.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

Suggested alt text:

```text
Noir evidence board with one rejected clue marked by a red pencil
```

## Future Scene Prompt Stubs

Use these when Student Mode expands beyond the opening breadcrumbs.

### Witness Lead

```text
[Shared Visual Bible]

Scene: Two witness lead cards on a rainy city map, one connected to a quiet residential street and one connected to an apartment block. Show addresses as visual marks only, with no readable text. The scene should imply that two people need to be identified through careful SQL joins and interview evidence.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

### Gym Lead

```text
[Shared Visual Bible]

Scene: A noir-style fitness club record desk after hours, with membership cards, check-in slips, a locker key, and a dim fluorescent reflection on polished floor. No readable names or numbers. The scene should imply that membership and check-in records are now the active lead.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

### Suspect Theory

```text
[Shared Visual Bible]

Scene: A detective desk with two suspect silhouettes represented only as anonymous profile cards turned partly away, plus evidence strings and a verification stamp pad. No faces, no names, no readable text. The scene should imply that the student is testing a suspect hypothesis without revealing the answer.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

### Mastermind Trail

```text
[Shared Visual Bible]

Scene: A deeper case board with event tickets, a vehicle clue, a money trail envelope, and a final locked folder under shadow. No readable text or identifiable culprit. The scene should feel like the investigation has moved from the first suspect to the hidden organizer.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger.

[Negative Prompt]
```

## Batch Generation Instructions

Generate at least four candidates per scene.

Selection criteria:

- the scene is immediately distinguishable from the other states
- it supports the student task without revealing the answer
- it has enough negative space for the app caption
- it remains legible when cropped to a narrow browser pane
- it looks like part of the same case world as the other selected scenes

Reject candidates when:

- they contain readable text
- they look like generic noir wallpaper
- they introduce modern technology or unrelated fantasy elements
- they are too cluttered behind the caption overlay
- they show final suspects, culprit faces, or solution spoilers

## File Naming

Use these final asset names when replacing the current placeholders:

| State | Target File |
|---|---|
| `crime-ledger` | `crime-ledger.png` |
| `records-vault` | `records-vault.png` |
| `murder-board` | `murder-board.png` |
| `student-initiative` | `student-initiative.png` |
| `breakthrough` | `breakthrough.png` |
| `misfire` | `misfire.png` |

Place final reviewed images in:

```text
apps/web/src/assets/student-scenes/
```

## Integration Checklist

For the follow-up implementation WP:

- replace SVG imports in `apps/web/src/App.tsx` with the reviewed generated image files
- keep the existing `getStudentSceneVisual` state mapping unless the scene list changes
- update tests only if alt text or scene names change
- verify `npm run test --workspace apps/web`
- verify the in-app browser header crop at the current narrow pane width
- do a visual pass after logging a correct clue and after logging a wrong clue
