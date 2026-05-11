# samuel-expression-state-art-prompt-pack

## Objective

Create a production-ready prompt pack for Gemini / Nano Banana that generates Samuel Tupleton artwork for the gameplay states introduced in WP-068.

This WP focuses on:

- neutral Samuel mentor artwork
- skeptical Samuel misread artwork
- confirmed Samuel clue-validation artwork
- breakthrough Samuel lead-unlocked artwork
- supporting Samuel storytelling images that can make the student experience feel more guided, cinematic, and interactive

The goal is to give the team copy/paste-ready prompts that create consistent Samuel artwork without adding runtime image generation to the application.

---

## Background

WP-068 added deterministic Samuel visual states in the UI:

- `Mentor`
- `Skeptical`
- `Confirmed`
- `Breakthrough`

That implementation uses the current single Samuel avatar asset with CSS treatment, label, glow, and color grading. It does not yet provide true facial-expression or pose changes.

The next art task is to create a consistent set of Samuel images so the student can see Samuel react as the investigation progresses.

---

## Scope

Create prompt documentation only.

In scope:

- Gemini / Nano Banana prompts for Samuel expression/state images
- prompts for additional supporting Samuel storytelling images
- shared visual bible
- shared negative prompt
- output requirements
- file naming recommendations
- selection criteria
- future implementation notes

Out of scope:

- generating images directly inside the app
- adding runtime AI or runtime image generation
- replacing app assets
- modifying React, CSS, tests, backend, database, packages, or build configuration
- final selection, compression, and integration of generated assets

---

## Files Allowed to Change

- `docs/01-work-packages/WP-069-samuel-expression-state-art-prompt-pack.md`
- optionally `docs/13-art-direction/**` if this prompt pack is later promoted into a reusable art-direction document

Do Not Modify:

- `apps/**`
- `database/**`
- `package.json` files
- build configuration
- scripts

---

## Constraints

- Use static generated assets only.
- Do not introduce runtime AI behavior.
- Keep Samuel classroom appropriate and non-threatening.
- Preserve the same recognizable Samuel Tupleton identity across all images.
- Avoid celebrity likenesses or real-person resemblance.
- Avoid readable text in generated images.
- Avoid UI panels, SQL code, table names, numbers, labels, or spoilers inside the art.
- Avoid malformed hands, impossible wrists, crossed-up shoulder/arm anatomy, detached limbs, or inconsistent left/right orientation.
- Keep the images usable in a narrow web-app header and in larger desktop layouts.
- Make the state changes visible at small sizes.

---

## Output Requirements

- Source generation size: square `1536x1536` or larger for avatar/state portraits.
- Optional supporting scenes: `1792x1024` or larger, 16:9.
- Final avatar crop target: optimized PNG or WebP, approximately `1024x1024`.
- Final supporting image crop target: optimized PNG or WebP, approximately `1280x720`.
- Background: preserve enough noir atmosphere to feel authored, but keep Samuel readable.
- Text in image: no readable text. Blurred notebook marks, ledger marks, indistinct forms, and unreadable case textures are allowed.
- Composition: Samuel should remain recognizable when cropped inside the existing app avatar frame.
- Consistency: each generated image should look like the same character in the same illustrated world.

---

## Shared Visual Bible

Use this visual bible at the top of every prompt.

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. Keep Samuel's face and expression readable at small app-avatar size. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.
```

## Shared Negative Prompt

Use this negative prompt with every image.

```text
generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses
```

---

## Individual Copy/Paste Prompts

Each prompt in this section is self-contained for Gemini / Nano Banana. Copy one complete block at a time.

### Copy/Paste Prompt 1: Samuel Neutral Mentor

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. Keep Samuel's face and expression readable at small app-avatar size. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a square portrait of Samuel Tupleton in his neutral mentor state. Samuel faces slightly toward the viewer, calm and attentive, with a steady teaching expression that says "start with the evidence." He holds a small case notebook or clipboard at chest height, but the page contents must be blurred and unreadable. His posture is upright and patient. The background suggests a noir detective office with a case board and filing cabinets softly out of focus. The lighting should be warm brass desk-lamp light on one side of his face with cool blue window light on the other side.

The expression should feel composed, helpful, and observant. This is the state before the student has made a move.

Composition: Samuel centered, head and shoulders visible, hat and glasses clear, hands anatomically correct, face readable at small avatar size, no readable text.

Generate a square high-resolution illustrated portrait, 1536x1536 or larger. Recommended filename: avatar-samuel-mentor-neutral.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 2: Samuel Skeptical Misread

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. Keep Samuel's face and expression readable at small app-avatar size. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a square portrait of Samuel Tupleton in a skeptical detective state. Samuel has one eyebrow slightly raised and a focused, questioning look, as if the student just tried to pin a clue that does not quite hold up. His expression should be corrective but supportive, never angry or punitive. He lightly taps a pencil against an unreadable case card or holds a small evidence slip at an angle, implying "check that row again." The background includes a soft out-of-focus evidence board with one sideways rejected card and red pencil mark, but no readable text or numbers.

The mood should communicate careful skepticism, recoverability, and precision. Samuel is helping the student re-check evidence, not scolding them.

Composition: Samuel centered, face and raised eyebrow readable, pencil/evidence card visible but secondary, hands anatomically correct, no readable text.

Generate a square high-resolution illustrated portrait, 1536x1536 or larger. Recommended filename: avatar-samuel-skeptical-misread.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 3: Samuel Confirmed Clue

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. Keep Samuel's face and expression readable at small app-avatar size. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a square portrait of Samuel Tupleton in a confirmed clue state. Samuel shows a restrained satisfied expression, like a detective who has just seen the student prove a fact correctly. He is placing or presenting a small pinned clue card toward a cork evidence board, with a subtle warm glow catching the pin and card edge. The card must contain only blurred marks, no readable text, no numbers, and no SQL. His posture is confident but not celebratory or exaggerated.

The mood should communicate "that clue is solid enough to go on the board." It should feel precise, earned, and satisfying.

Composition: Samuel centered, face readable, one hand placing or presenting the clue with correct anatomy, warm clue light near center-right, no readable text.

Generate a square high-resolution illustrated portrait, 1536x1536 or larger. Recommended filename: avatar-samuel-confirmed-clue.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 4: Samuel Breakthrough Lead Unlocked

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. Keep Samuel's face and expression readable at small app-avatar size. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a square portrait of Samuel Tupleton in a breakthrough state. Samuel looks energized and intent, with a subtle "now we have the trail" expression. He leans slightly toward a case board where red thread connects a newly confirmed clue to two blurred witness lead cards. His eyes should be alert behind round glasses, and the lighting should become more dramatic: warm brass light from the evidence board and cool rainy city light behind him. No readable text, names, dates, addresses, SQL, or numbers.

The mood should communicate that a new lead has unlocked and the investigation is opening up. Samuel should feel more animated than confirmed, but still grounded and professional.

Composition: Samuel centered and slightly forward, breakthrough glow and red thread visible, witness cards blurred and anonymous, hands and shoulders anatomically correct, face readable at small avatar size.

Generate a square high-resolution illustrated portrait, 1536x1536 or larger. Recommended filename: avatar-samuel-breakthrough-lead-unlocked.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 5: Samuel Briefing At The Desk

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a 16:9 cinematic illustration of Samuel Tupleton seated or standing beside a detective desk at the start of a case briefing. He gestures toward an open case notebook and a city crime ledger, both filled with blurred marks only. A brass desk lamp lights the papers, rain streaks the office window, and a case board sits softly in the background. Samuel's expression is calm and instructive, inviting the student to begin with the first evidence query.

The scene should feel like Samuel is personally briefing the student before the SQL investigation begins.

Composition: Samuel on the left or center-left, case desk and ledger in center-right, lower-left or lower-right should have enough dark negative space for app overlay if needed, hands anatomically correct, no readable text.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger. Recommended filename: scene-samuel-briefing-desk.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 6: Samuel Points To The Query Trail

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a 16:9 cinematic illustration of Samuel Tupleton pointing with a pencil from an unreadable case notebook toward a trail of evidence folders and blurred ledger pages. The visual metaphor should suggest "follow the data trail with your next query" without showing a computer screen, UI, SQL, table names, readable words, or numbers. Samuel's expression is focused and encouraging. The background includes a noir office, filing cabinets, and a rainy window glow.

The scene should help students understand that Samuel is guiding the next investigative move, not solving it for them.

Composition: Samuel in the foreground, pencil gesture leading the eye toward evidence in center-right, enough dark negative space for overlay, hands anatomically correct, no readable text.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger. Recommended filename: scene-samuel-query-trail-nudge.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 7: Samuel Reviews The Evidence Board

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a 16:9 cinematic illustration of Samuel Tupleton standing beside a cork evidence board, reviewing pinned clue cards, red thread, anonymous photos turned partly away, and blurred report fragments. Samuel holds his clipboard close and studies the board with a thoughtful expression. The board should feel active and investigative but not cluttered. No readable text, names, dates, numbers, SQL, or final suspect reveal.

The scene should communicate "review only the facts you have proven."

Composition: Samuel on one side, evidence board in center-right, strongest light on the pinned clue cluster, dark negative space for overlay, hands anatomically correct, no readable text.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger. Recommended filename: scene-samuel-evidence-board-review.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 8: Samuel Hands The Case Back To The Student

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a 16:9 cinematic illustration of Samuel Tupleton handing an open but unreadable case notebook toward the viewer, as if giving the investigation back to the student. Behind him, a noir evidence board shows several unresolved anonymous leads connected by red thread, with no readable text, names, dates, SQL, or numbers. Samuel's expression is confident and encouraging: he has guided the opening, now the student must decide the next query.

The scene should communicate agency, responsibility, and momentum.

Composition: Samuel centered or center-left, notebook gesture toward viewer, unresolved evidence trail in center-right background, hands anatomically correct, no readable text.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger. Recommended filename: scene-samuel-handoff-student-agency.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

### Copy/Paste Prompt 9: Samuel At The Rainy Window

```text
Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The character is Samuel Tupleton, an experienced SQL Data Detective mentor. He is a thoughtful middle-aged detective wearing a charcoal fedora, tan trench coat, white shirt, dark tie, round glasses, and a subtle brass data-detective lapel pin. He carries a small clipboard or case notebook when appropriate. He should look intelligent, precise, approachable, and classroom appropriate, not scary and not cartoonish. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cool streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, dust, smoke haze, and tactile case-file materials. Editorial illustrated style, detailed and eye-catching, not stock photography, not a mascot, not a generic detective. No readable text anywhere in the image. No logos. No UI. No modern devices. No celebrity likeness. No final suspect reveal.

Create a 16:9 cinematic illustration of Samuel Tupleton standing by a rain-streaked office window at night, holding a closed case notebook while city lights blur behind the glass. His expression is reflective and analytical, suggesting the case has become deeper and the evidence must be reconsidered carefully. The office desk and case files sit in soft shadow, with blurred marks only and no readable text.

The scene should support quieter story beats without feeling static or generic.

Composition: Samuel in profile or three-quarter view, rainy city glow behind him, desk files in foreground shadow, hands anatomically correct, no readable text.

Generate a 16:9 cinematic noir illustration, 1792x1024 or larger. Recommended filename: scene-samuel-rainy-window-reflection.png.

Negative prompt: generic detective, generic dark background, blank sterile paper, stock photo, photorealistic celebrity, cute mascot, childish cartoon, anime, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, weapon pointed at viewer, threatening pose, readable text, readable labels, readable handwriting, legible numbers, SQL code, database table names, UI panels, computer screens, modern smartphone, speech bubbles, final culprit reveal, suspect face reveal, explicit violence, cluttered unreadable composition, washed out contrast, oversaturated colors, blurry low detail, malformed hands, extra fingers, impossible wrist position, detached limbs, crossed-up left/right anatomy, right hand attached to left shoulder, inconsistent face, inconsistent hat, inconsistent glasses.
```

---

## Batch Generation Instructions

Generate at least four candidates per prompt.

For the four expression/state portraits:

- use the same model style, wardrobe, hat shape, glasses, face structure, and age
- keep framing close enough for the existing app avatar crop
- reject any candidate where Samuel looks like a different person
- reject any candidate where the expression is not readable at small size

For supporting storytelling images:

- keep Samuel recognizable but allow more environmental storytelling
- leave enough negative space for app captions if the image is used in a card or header
- avoid readable text even when showing ledgers, forms, or notebooks

---

## Selection Criteria

Accept candidates when:

- Samuel is clearly the same character across the full set
- each expression/state is immediately distinguishable
- the image supports the student gameplay state
- anatomy is correct, especially hands, wrists, shoulders, and clipboard/notebook gestures
- the image remains readable in narrow browser layouts
- the art feels authored, specific, noir, and classroom appropriate

Reject candidates when:

- Samuel's face, hat, glasses, or age drift between states
- the expression is too subtle to read in the app
- the art contains readable text, numbers, SQL, table names, labels, or spoilers
- hands or arms have anatomical problems
- the image looks generic, blank, overly sanitized, or like stock noir wallpaper
- the image shows a weapon, culprit, final suspect, explicit violence, or threatening posture

---

## Recommended Asset Names

Place final reviewed portrait candidates in:

```text
apps/web/src/assets/avatars/
```

Recommended portrait asset names:

| State | Target File |
|---|---|
| neutral mentor | `avatar-samuel-mentor-neutral.png` |
| skeptical misread | `avatar-samuel-skeptical-misread.png` |
| confirmed clue | `avatar-samuel-confirmed-clue.png` |
| breakthrough lead unlocked | `avatar-samuel-breakthrough-lead-unlocked.png` |

Recommended supporting storytelling asset names:

Place final reviewed supporting scene candidates in:

```text
apps/web/src/assets/scenes/
```

| Purpose | Target File |
|---|---|
| opening briefing | `scene-samuel-briefing-desk.png` |
| query nudge | `scene-samuel-query-trail-nudge.png` |
| evidence review | `scene-samuel-evidence-board-review.png` |
| student agency handoff | `scene-samuel-handoff-student-agency.png` |
| reflective transition | `scene-samuel-rainy-window-reflection.png` |

---

## Future Implementation Notes

A later implementation WP should:

- add selected portrait assets to `apps/web/src/assets/avatars/`
- add selected supporting scene assets to `apps/web/src/assets/scenes/`
- replace the CSS-only Samuel visual state treatment with state-specific image imports
- map `neutral`, `skeptical`, `confirmed`, and `breakthrough` to the selected portrait files
- preserve the existing state labels unless visual review proves they are redundant
- update tests only for changed alt text, labels, or image-state contracts
- verify `npm run test --workspace apps/web`
- verify `npx vite build`
- visually inspect the four states in the in-app browser at narrow and desktop widths

---

## Acceptance Criteria

- WP-069 exists as a documentation-only art prompt package.
- The WP includes self-contained Gemini / Nano Banana prompts for Samuel neutral, skeptical, confirmed, and breakthrough states.
- The WP includes supporting Samuel storytelling prompts for future experience improvements.
- Prompts include shared visual direction, negative prompt, output requirements, selection criteria, and file naming.
- The WP explicitly preserves static-asset-only scope and excludes runtime AI.

---

## Codex Results

Created WP-069 as a documentation-only art prompt package.

Included:

- shared visual bible and shared negative prompt
- output requirements and constraints
- a dedicated `Individual Copy/Paste Prompts` section with nine fully self-contained Gemini / Nano Banana prompts
- independent prompts for Samuel neutral mentor, skeptical misread, confirmed clue, and breakthrough lead-unlocked states
- independent prompts for Samuel briefing desk, query trail nudge, evidence board review, student agency handoff, and rainy window reflection storytelling images
- updated recommended filenames so square portraits use the `avatar-` prefix and landscape storytelling images use the `scene-` prefix
- recommended filenames and future implementation notes

No app code, assets, backend, database, package, build, or script files were modified.

## Gemini Audit Results

Pending.

## Final Decision

Pending.
