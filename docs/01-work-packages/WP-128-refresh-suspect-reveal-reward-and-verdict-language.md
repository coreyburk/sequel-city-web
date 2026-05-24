# WP-128: refresh-suspect-reveal-reward-and-verdict-language

## Objective

Improve the student-facing suspect-confirmation moment so it feels rewarding, readable, and aligned with the current theory-check flow.

The goal is:

When a student confirms the hired killer or the mastermind, the app should celebrate the breakthrough clearly, remove leftover trigger/INSERT jargon, and point them to the next step with language that fits Student Mode instead of backend implementation details.

---

## Scope

Plan and implement a focused suspect-reveal polish pass:

- replace student-facing labels like `Trigger Verdict` with language that means something inside the case
- remove stale copy that still references the old raw SQL suspect-testing path
- make the first correct suspect reveal feel more rewarding and dramatic
- add a focused visual celebration treatment so the reveal feels alive without breaking the noir tone
- keep the mastermind handoff clear and current after the first suspect is confirmed
- replace the stale single-note notebook collapse with a more intentional evidence-board transition into the mastermind phase
- support a clear page-to-page handoff in the Evidence Notebook so students can preserve the murderer trail while starting a fresh mastermind working page
- keep post-confirmation suspect naming dynamic so future admin-side answer-key changes do not require app-text rewrites
- update the student-facing confirmation feedback in state handling
- update focused frontend regression coverage
- update this work package document

This WP is limited to the student-facing reveal and follow-up guidance. It does not change the bootstrap or migration architecture from WP-127.

---

## Files Allowed to Change

Allowed:

- apps/web/src/**
- docs/01-work-packages/WP-128-refresh-suspect-reveal-reward-and-verdict-language.md

Do Not Modify:

- apps/api/src/**
- database/**
- docs/00-ssot/**

---

## Acceptance Criteria

- the first suspect confirmation no longer labels the reveal block as `Trigger Verdict`
- the reveal copy no longer references the old `INSERT`-based suspect workflow
- the student receives a clearer reward moment when the first suspect is confirmed
- the next-step guidance after the first suspect confirm still points cleanly into the mastermind trail
- the breakthrough moment includes a focused dynamic visual flourish and stronger breakthrough visual state
- the Evidence Notebook preserves the murderer accomplishment while still supporting a clean pivot into the mastermind trail
- the mastermind transcript stage gives students a clear next move after the first narrowed `InterviewLog` query
- runtime reveal and handoff copy uses the confirmed suspect name dynamically rather than a hard-coded murderer name
- mastermind confirmation keeps a strong closeout message
- focused frontend tests are updated

---

## Codex Results

Implemented a focused suspect-reveal polish pass in Student Mode.

Summary:

- Replaced the stale `Trigger Verdict` label with a student-facing `Breakthrough Briefing`.
- Renamed the first-success panel heading from `Trigger Man Confirmed` to `First Suspect Confirmed`.
- Rewrote the first-suspect celebration copy so it reads like a major case breakthrough rather than a technical verification result.
- Removed stale student-facing wording that referenced the old raw-INSERT suspect workflow.
- Updated the success feedback after the first suspect confirm so the surrounding workbench guidance matches the new reward moment and the mastermind handoff uses the confirmed suspect dynamically.
- Upgraded the breakthrough visual state so Samuel now switches into the dedicated breakthrough avatar when the first suspect theory lands.
- Added an animated light sweep and richer glow treatment behind the celebration card so the reward moment feels more alive while staying in the noir visual language.
- Added a stronger breakthrough pulse to the scene frame and Samuel avatar so the reward moment is easier to notice at a glance, while removing the rejected sweep from the scene image itself.
- Wired the new `trigger-man-reveal.png` scene so the first hired-killer confirmation gets its own dedicated header image.
- Reworked the Evidence Notebook transition so Page 1 preserves the full murderer trail, Page 2 becomes the studentâ€™s mastermind working page, and notes can be moved between pages intentionally.
- Preserved the circled hired-killer accomplishment note while removing the duplicate ring artifact.
- Added mastermind-stage transcript coaching so students are told when to add the pinned `ReportID`, when they have the right narrowed transcript set, and when to `Log Clue` the contract/client row.
- Added a dedicated `Mastermind Lead` notebook note when the student logs the transcript row that proves someone else ordered the hit.
- Updated focused frontend regression coverage.

Changed files:

- `apps/web/src/App.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/styles.css`
- `apps/web/src/App.test.tsx`
- `apps/web/src/assets/scenes/trigger-man-reveal.png`

Verification:

- `npm run test --workspace apps/web` passed with `152/152` tests
- `npm run build --workspace apps/web` passed

Illustration prompt prepared for the next dedicated murderer-identification scene:

`Trigger Man Reveal`

Create a cinematic 1940s detective noir illustration for an educational SQL mystery game called Sequel City. The scene should feel like a handcrafted case-file illustration, not stock photography and not a generic dark interface background. Use a rich noir palette with charcoal black, tobacco brown, faded brass, deep oxblood red, and cold streetlight blue. Strong chiaroscuro lighting, desk-lamp glow, rain-streaked glass, paper texture, smoke haze, dust, and tactile evidence-board materials. The composition must remain readable in a narrow web-app header crop. Keep the focal action centered or right-centered. Leave the lower-left third darker and less detailed for an overlaid app caption. No readable text anywhere in the image. No logos. No UI. No modern devices. No photorealistic celebrity likeness. No final mastermind reveal. High-quality editorial illustration, cinematic, moody, specific, classroom appropriate.

Scene: the moment the hired killer is confirmed. A suspect photograph or dossier card for a male murderer has just become the clear focal point on Samuel Tupletonâ€™s evidence board. Brass pins and taut red string converge on that one suspect card from witness notes, a gym-membership clue, and crime-scene evidence. Nearby, an interview transcript folder lies open under a brass desk lamp, hinting that the case is not over and that the trail now leads upward toward whoever ordered the hit. The mood should feel like a breakthrough, not final closure: triumph, clarity, momentum, and a new layer of danger still waiting behind the board.

Composition: suspect card and converging evidence web in the center-right, desk-lamp glow raking across folders and pinned materials, rainy window light or cool city spill in the background, lower-left kept darker and quieter for app overlay use. The image should communicate that the first killer has been identified, but the larger mastermind trail is still open.

Output: 16:9 cinematic noir illustration, 1792x1024 or larger. Final asset will be cropped to 1280x720 in a web app using object-fit: cover.

Negative prompt: generic dark background, plain gradient, stock photo, cyberpunk, neon sci-fi, purple glow, fantasy, horror gore, readable text, readable labels, readable handwriting, readable numbers, UI panels, computer screens, modern smartphone, comic speech bubbles, cute mascot, cartoonish child style, photorealistic celebrity likeness, final mastermind reveal, explicit violence, cluttered unreadable composition, washed out contrast, blurry low detail, oversaturated colors.

Suggested filename: `trigger-man-reveal.png`

Suggested alt text: `Noir evidence board converging on a confirmed male hired killer with interview files and brass-lit case materials`

---

## Gemini Audit Prompt

Audit WP-128 for student-facing suspect-reveal quality and correctness.

Focus on:

- after the first correct suspect theory, the reveal uses student-facing language like `First Suspect Confirmed` and `Breakthrough Briefing` instead of `Trigger Verdict`
- the reveal no longer references the old `INSERT`-based suspect-testing workflow
- the first-suspect success state feels rewarding and clearly celebratory
- the reveal uses a focused dynamic visual treatment and the header upgrades into the breakthrough visual state
- the next-step guidance still points cleanly into the mastermind transcript trail and gives students useful narrowing feedback after the first post-breakthrough `InterviewLog` query
- the Evidence Notebook preserves the murderer trail on Page 1 while allowing students to begin a separate mastermind working page without losing the confirmed-killer accomplishment
- the confirmed suspect name used in the handoff/reveal text comes from runtime state rather than a hard-coded murderer name in app logic
- mastermind closeout behavior is not regressed by this copy refresh
- no other Student Mode suspect-theory flow is broken by the wording changes

---

## Gemini Audit Results

Audit completed and accepted.

Verified:

- the first suspect reveal uses student-facing labels like `First Suspect Confirmed` and `Breakthrough Briefing`
- old `INSERT` workflow language is removed from the reveal and follow-up guidance
- the breakthrough state is more rewarding, with dedicated scene/visual treatment and stronger Samuel breakthrough presentation
- the mastermind handoff now gives useful narrowing guidance after the first `InterviewLog` query
- the Evidence Notebook preserves the murderer trail while supporting a separate mastermind working page
- the confirmed suspect name used in reveal and handoff text is dynamic in runtime app logic
- mastermind closeout behavior was not regressed by the reveal refresh
- focused frontend coverage verifies the suspect reveal, notebook paging, and mastermind transcript handoff behavior

## Final Decision

Accepted.

