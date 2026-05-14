# End-of-Day Handoff

## Purpose

Use this file to transfer current working context between development machines at end of day.

This is the live handoff artifact.
Refresh it from `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md` before each handoff commit so older state does not remain in place.

Workflow:

1. Update this file before switching machines.
2. Commit and push.
3. Pull on the other machine.
4. Continue from this handoff.

If the local clone still points at the old GitHub repository path, update it before the next pull or push:

```powershell
git remote set-url origin https://github.com/coreyburk/sequel-city-web.git
git remote -v
```

When recording commit activity for accepted work packages, use the project multi-line commit format:

- imperative title line
- blank line
- bullet list of concrete changes

## Current State

- Date: 2026-05-14
- Machine: Computer 2 (`C2`)
- Peer Machine: Computer 1 (`C1`)
- Branch: `main`
- Repo status: clean before this handoff update; latest accepted work through `WP-086` is committed and pushed
- Current HEAD before this handoff commit: `877cedf`
- Remote: `origin` points to `https://github.com/coreyburk/sequel-city-web.git`

## Active Work Package

- Current WP: none
- Status: ready for the next scoped work package on Computer 1
- Final Decision: not applicable

## Completed This Session

- Accepted and pushed `WP-084` in commit `8646e10`.
- Accepted and pushed `WP-085` in commit `0f31d2a`.
- Accepted and pushed `WP-086` in commit `877cedf`.

- `WP-084` Query Lab usability and feedback refinement:
  - wrong `Log Clue` interactions now produce visible mentor feedback
  - `Log Clue` capitalization is consistent
  - the Query Lab uses more of the browser width
  - `Quick Table Clues` and `Case Facts` moved into the left `Case File` drawer
  - SQL building blocks were added above the Query Editor
  - post-query behavior keeps focus in the Query Editor while bringing the runner/results back into view

- `WP-085` detective rank and reward system design:
  - added `docs/14-progression-design/`
  - created the official detective rank and reward design guide
  - defined the five career tiers, progression rules, badge language, case design standards, and UI terminology standards
  - recommended replacing `Insight Marks` with `Commendations` for long-term progression
  - reframed `Samuel's Trust` as a case-local mentor concept rather than a persistent reward system
  - provisionally placed `Case 004: The SQL City Murder` in `Tier 3: Data Inspector`

- `WP-086` clickable evidence-assisted query building:
  - added a shared query-assist insertion path to the student Query Runner
  - made selected Samuel witness-guide tokens clickable query helpers
  - made suitable `Pinned Facts` entries clickable when they map cleanly to query fragments
  - kept non-query-friendly notebook entries as plain text so the feature remains assistive rather than auto-solving
  - added focused tests for query-assist insertion and Student Mode wiring

## Verification Summary

- `WP-084` verification before acceptance:
  - `npm run test --workspace apps/web` passed: 7 test files, 36 tests
  - `npm run build --workspace apps/web` passed
  - Gemini audit: PASS

- `WP-085` verification before acceptance:
  - documentation-only package
  - scope verified as docs-only
  - Gemini audit: PASS

- `WP-086` verification before acceptance:
  - `npm run test --workspace apps/web` passed: 7 test files, 39 tests
  - `npm run build --workspace apps/web` passed
  - Gemini audit: PASS

- Final C2 closeout check after `WP-086`:
  - `git status --short --branch` was clean before this handoff update

## Open Issues / Risks

- Student Mode is materially stronger, but it still has a growing systems-design question around progression:
  - the runtime UI still uses temporary reward labels such as `Insight Marks` and `Samuel's Trust`
  - `WP-085` defines the preferred future model, but that model is not yet implemented in the app

- Query assistance is now more tactile, but there is still a balance risk:
  - future query-helper work should stay selective
  - avoid drifting into full canned-query assembly or one-click solving

- The murder case flow still needs an end-to-end gameplay validation pass:
  - especially from witness trail through later gym/suspect/mastermind stages
  - the current work has heavily improved the opening and mid-case experience, but the full case loop should still be verified as one coherent student journey

## Top Recommendations

1. Implement the thin runtime layer from `WP-085`.
   - Rename visible reward language to match the accepted progression guide.
   - Separate case-local progress from long-term career progression in the UI.
   - Add a compact detective-rank summary surface without building a full save/profile system yet.

2. Keep Samuel as the single guide and keep query assistance selective.
   - Samuel should remain the one voice for mentor framing, correction, and next-step meaning.
   - Query helpers should insert useful fragments, not whole answers.

3. Run an end-to-end student gameplay audit of the full murder case.
   - Verify the witness, gym, suspect, and mastermind chain as one complete learning arc.
   - Identify where the later stages still feel more developer-like than student-like.

4. Use `WP-085` as the content and UI standard before adding more progression features.
   - Any new rank, badge, or reward surface should follow the official guide rather than inventing new terms ad hoc.

## Next Recommended Step

1. On Computer 1, run:

   ```powershell
   git pull --ff-only origin main
   git status --short
   git remote -v
   ```

2. Confirm `origin` is:

   ```text
   https://github.com/coreyburk/sequel-city-web.git
   ```

3. Review the latest accepted WP records:
   - `docs/01-work-packages/WP-084-query-lab-usability-and-feedback-refinement.md`
   - `docs/01-work-packages/WP-085-detective-rank-and-reward-system-design.md`
   - `docs/01-work-packages/WP-086-clickable-evidence-assisted-query-building.md`

4. Review the progression guide before the next implementation WP:
   - `docs/14-progression-design/Detective-Rank-and-Reward-System-Guide.md`

5. Recommended next WP theme:
   - implement the first thin runtime pass of the accepted progression model from `WP-085`
   - specifically rename temporary reward language, separate case progress from career progress, and add a compact detective-rank summary without introducing persistence

## Resume Prompt (Copy/Paste)

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`.
Pull latest `main`, verify the remote path, review accepted `WP-084` through `WP-086`, and read `docs/14-progression-design/Detective-Rank-and-Reward-System-Guide.md` before starting the next WP. The recommended next step is a thin runtime implementation of the accepted progression model: replace temporary reward labels, separate case-local progress from career progression, and add a compact detective-rank summary UI without introducing persistence or weakening Samuel's role as the single mentor voice.

## Update Checklist

Before committing the live handoff, replace:

- Date
- Machine
- Peer Machine
- Branch
- Repo status
- Current HEAD
- Current WP and status
- Completed work
- Verification summary
- Open issues / risks
- Next recommended step

Also confirm:

- the live handoff reflects current state rather than older completed WPs
- the local `origin` remote already points at `https://github.com/coreyburk/sequel-city-web.git`
