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

- Date: 2026-05-13
- Machine: Computer 2 (`C2`)
- Peer Machine: Computer 1 (`C1`)
- Branch: `main`
- Repo status: clean after `WP-078` accepted, committed, and pushed
- Current HEAD before this handoff commit: `8eeaf8c`
- Remote: `origin` points to `https://github.com/coreyburk/sequel-city-web.git`

## Active Work Package

- Current WP: none
- Status: ready for the next scoped work package on Computer 1
- Final Decision: not applicable

## Completed This Session

- Accepted and pushed `WP-076` in commit `be9466f`.
- Accepted and pushed `WP-077` in commit `55de0c8`.
- Accepted and pushed `WP-078` in commit `8eeaf8c`.
- Confirmed the repository remote path is the current canonical repo:
  - `https://github.com/coreyburk/sequel-city-web.git`
- Refined the post-report witness stage:
  - Samuel remains an active guide after the target report is proven.
  - The post-report flow no longer implies "training wheels off" too early.
  - Witness-stage support was renamed and simplified so it reads as guidance, not a second case briefing.
  - Quick support panels now use lighter labels such as `Quick Table Clues` and `Case Facts`.
- Refined witness-stage footprint and state awareness:
  - Witness guidance is shorter and changes as students log witness bundles.
  - Notebook support text avoids repeating tasks that are already complete.
  - Visible witness-stage wording uses active detective verbs such as `found`, `use`, `follow`, `log`, `lookup`, `review`, and `connect`.
- Simplified the Evidence Board:
  - `Detective's Case Notes` became `Case Progress`.
  - `Emerging Leads`, `Samuel Check-In`, and `Available Leads` no longer render as competing guidance labels.
  - The right column now uses one `Current Action` surface.
  - First-clue `Return to Query Lab`, Witness Discovery, and Gym Lead gating remain intact.
  - Comprehension checks were preserved as `Case Review`, separated from guidance and paired with `Insight Marks`.
  - `Insight Marks` reward correct check-for-understanding answers without unlocking progression or changing case state.
- Preserved the core progression rules:
  - guided SQL sequence stays intact
  - witness bundle logging remains gated
  - later witness, gym, suspect, and solution details remain hidden until earned

## Verification Summary

- `WP-076` verification before acceptance:
  - `npm run test --workspace apps/web` passed: 7 test files, 34 tests
  - `npm run build --workspace apps/web` remained blocked by the existing `vite.config.ts` typing issue
  - Gemini audit: PASS
- `WP-077` verification before acceptance:
  - `npm run test --workspace apps/web` passed: 7 test files, 34 tests
  - build was not used as the closeout gate because the same existing `vite.config.ts` typing issue remained outside WP-077 scope
  - Gemini audit: PASS
- `WP-078` verification before acceptance:
  - `npm run test --workspace apps/web` passed: 7 test files, 34 tests
  - `npm run build --workspace apps/web` remained blocked by the existing `vite.config.ts` typing issue
  - Gemini audit: PASS
- Final C2 closeout check after `WP-078`:
  - `git status --short` was clean before this handoff update

## Open Issues / Risks

- `npm run build --workspace apps/web` is still blocked by the existing `vite.config.ts` type issue:
  - `Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'`
- This build issue predates `WP-076` through `WP-078` and should be handled in a separate scoped work package.
- `WP-078` audit noted a minor drift risk: the Evidence Board `Current Action` card can be more specific than Samuel's header advice for the witness stage.
- `WP-078` audit also noted a broader simplification risk: Student Mode still has several instruction-adjacent surfaces across Samuel's header, Query Lab witness guide, Evidence Board current action, support panels, and Case Review.

## Top Recommendations

1. Consolidate student guidance around Samuel's avatar/header.
   - Samuel should remain the single source for advice, feedback, queued-query reasoning, and next-step framing.
   - Other surfaces should either show data, actions, evidence, or assessment.

2. Keep `Current Action` short and action-only.
   - Evidence Board should tell students the one next move, not re-teach the case.
   - If a `Current Action` needs context, consider moving that context into Samuel's header copy instead.

3. Preserve `Case Review`, but treat it as assessment and reward.
   - Keep comprehension checks because they help students understand the database and analysis process.
   - Continue separating them from guidance with labels like `Case Review` and rewards like `Insight Marks`.
   - Do not let correct answers unlock hidden clues unless a future WP intentionally designs that game system.

4. Tighten the witness-stage instruction model next.
   - Review whether Samuel's header, the Query Lab witness guide, and Evidence Board `Current Action` can be made more complementary.
   - Reduce repeated mentions of the same witness facts.
   - Keep the flow strongly guided until students have enough evidence to make meaningful independent choices.

5. Design a small value/reward system deliberately.
   - `Insight Marks` are now a first step.
   - A future WP should decide whether rewards are just motivational feedback or whether they support progress summaries, badges, or end-of-case scoring.

6. Fix the web build configuration in its own WP.
   - The Vitest `test` property in `vite.config.ts` needs a typing-safe configuration.
   - Keep this separate from UX work so build health can return as a normal closeout gate.

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
   - `docs/01-work-packages/WP-076-guided-witness-support-and-post-report-simplification.md`
   - `docs/01-work-packages/WP-077-witness-stage-guidance-state-and-footprint-refinement.md`
   - `docs/01-work-packages/WP-078-evidence-board-simplification-and-current-action-alignment.md`

4. Start the next scoped work package from clean `main`.

5. Recommended next WP theme:
   - refine the witness-stage instruction model so Samuel's header, Query Lab, Evidence Board `Current Action`, and `Case Review` each have one clear role without repeating each other.

## Resume Prompt (Copy/Paste)

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`.
Pull latest `main`, verify the remote path, review accepted `WP-076` through `WP-078`, and start the next scoped work package focused on simplifying the witness-stage student experience. Preserve Samuel's avatar/header as the single source of mentor guidance, keep `Case Review` as assessment rather than advice, and keep later clues hidden until earned.

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
