# WP-279: Specialist Skills Pilot

## Objective

Install and evaluate two focused frontend skills without replacing the existing work-package lifecycle or adding overlapping debugging tooling.

## Scope

Install Vercel React Best Practices and Web Design Guidelines into the personal Codex skill directory. Perform a bounded source-review pilot and assess existing gsd-debug compatibility. Record use boundaries and results here. Application fixes, runtime dependencies, global hooks, broader frameworks, independent audit are outside the implementation scope. The user authorized acceptance, closeout-only handoff refresh, commit, and push on 2026-10-05.

## Impact Analysis

### Understand Status
- Graph available: Yes; metadata, knowledge graph, and fingerprints exist.
- Baseline commit: 3243f12b0a30a6a122a6468afebd3584c3f8beb2.
- Freshness assessment: Application changes since the baseline make graph evidence insufficient for this UI review; current source was used directly. No graph relationships were relied on.
- Analysis performed: Optional tier for a review record and personal tool installation. Read current App navigation and state handling, header CSS, the gated StudentPlayableCaseSkeletonView, investigation-thread hook, WP-276, installed skill instructions, relevant React rules, and upstream interface guidelines. The skeleton is a gated/legacy surface, not evidence of the released Case 001 experience.

### Affected Architecture
- Layers: Development-time skills and review evidence only.
- Primary files/components: This WP; personal skills outside the repository.
- Upstream consumers: User and coding agent selecting scoped frontend review tools.
- Downstream dependencies: Existing work-package planning, implementation, independent audit, and human acceptance remain authoritative.

### Regression Surface
- Related tests: None required for installation and documentation; no application behavior changed.
- User workflows: Frontend code review and debugging tool selection.
- Security/data boundaries: No repository context sent to an external review agent; public guidance was downloaded. No runtime AI or dependencies added.

### Graph Update Decision
- Regeneration required: No for this review-only package.
- Rationale: Only a WP record is added in the repository; personal skill installation does not modify repository architecture. This does not certify the graph as current for application implementation planning.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-279-specialist-skills-pilot.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- scripts/**
- .codex/**
- .understand-anything/**
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/01-work-packages/WP-278-simplicity-planning-review-check.md

External installation destinations authorized by the user and installation permission:

- C:/Users/cburk/.codex/skills/react-best-practices/
- C:/Users/cburk/.codex/skills/web-design-guidelines/

The three dirty WP-278 files predate this package and were preserved. WP-278 was committed separately as 4e09e59 before this closeout, restoring isolated scope.

## Constraints

Use skills as specialist advice under project scope, SSOT, acceptance criteria, and safety rules. Do not infer authority to refactor, add packages, change progression, accept work, or commit. No extra debugging framework.

## Required Behavior

### Pilot use boundaries

- Invoke vercel-react-best-practices for scoped React reviews. Apply React 18/Vite-compatible guidance only; exclude Next.js routing, server components/actions, next/dynamic, and newer APIs such as Activity or useEffectEvent. Dependency suggestions such as SWR are not installation authority. Require evidence before performance refactoring.
- Invoke web-design-guidelines for named UI files and fetch its current public guideline document each review. Separate source findings from browser-confirmed defects. Project narrative, local-first state design, accessibility requirements, and established UI contracts take precedence over generic stylistic preferences.
- Keep using the existing TypeScript/Node Playwright harness. Do not add the Python testing workflow or a full Superpowers framework.
- For gsd-debug, supply reproduction, expected/actual behavior, and existing evidence up front. Use investigation-only scope until implementation is authorized in a WP. Its default find_and_fix flow and .planning/debug output need explicit adjustment: either authorize that artifact path in the WP or record evidence in an allowed project path. Child agents inherit the same file scope and no-acceptance/no-commit restrictions. Do not invoke GSD phase planning or automatic finalization as a substitute for the project lifecycle.

## Acceptance Criteria

- [x] Both upstream skills installed and their SKILL.md files read successfully.
- [x] React 18/Vite compatibility boundaries recorded.
- [x] Bounded source-review findings and limitations recorded.
- [x] Existing debugger evaluated before adding an overlapping tool.
- [x] No application code or existing WP-278 edits changed.

## Code Prompt

Install the two Vercel skills using the system skill-installer helper. Review the stated frontend source scope without changing application code. Record supported findings, rejected generic recommendations, installation evidence, and debugger integration boundaries in this WP.

## Audit Prompt

Verify installation evidence, skill identity, source findings, and compatibility exclusions. Confirm no runtime changes or dependencies, no claim of browser validation or independent audit, and preservation of WP-278. Review the debugger boundaries against the existing lifecycle.

## Code Results

Installed on 2026-10-05 from vercel-labs/agent-skills main using the system install-skill-from-github.py helper. Both skills are available for discovery on the next user turn. No automatic update mechanism was added.

Installed entry-point SHA256 hashes (identify SKILL.md only, not the full upstream revision):

- react-best-practices/SKILL.md: 71ED7794962FA6E803EE83030517B5B93A9F70FBFEB431EC4535C5480A8D8355; declared name vercel-react-best-practices, version 1.0.0.
- web-design-guidelines/SKILL.md: F4647CA866A3ACCF763777F83E7682954F0187CD6BEA7EEA0399796652414E8F; declared name web-design-guidelines, version 1.0.0.

### Validation

- PASS: Installation succeeded; both installed SKILL.md files were read and SHA256 hashes recorded during the pilot.
- PASS: Closeout source review confirmed this package changes only its record and the closeout handoff. No runtime tests are needed for those documentation changes.

### Source-review pilot findings

- apps/web/src/App.tsx:429 - Low-priority accessibility improvement: no skip-to-content link before the shared header; add a keyboard-visible link to the active content region in a separately scoped UI change. Main currently wraps the header, so targeting main alone would not bypass it.
- apps/web/src/App.tsx:436 - Low-priority layout stability candidate: logo lacks intrinsic width/height attributes; styles.css:106 sets width and height:auto without an aspect ratio. Reserve its intrinsic ratio to avoid image-load layout movement. Actual layout shift was not measured.

React review: no actionable performance defect established in the reviewed scope. Existing lazy state initialization, functional updates, effect listener cleanup, and render-time derived checkpoint values already match useful guidance. No benchmark, render-count comparison, or speed improvement is claimed.

Avoided unnecessary changes: did not remove primitive memoization solely to satisfy a generic rule; did not add memoization, URL-state packages, virtualization, SWR, Next.js APIs, or new component abstractions without a demonstrated need. Native buttons already provide keyboard activation; role=status feedback is not automatically missing live-region semantics.

Debugger assessment: gsd-debug already uses root-cause investigation and persistent evidence. Keep it with the scope boundaries above; installing systematic-debugging would duplicate the process.

Limitations: source review only, not a full UI/accessibility audit. No live browser, screen reader, contrast measurement, performance profiling, or independent reviewer. No runtime tests run because application code was unchanged. Findings are follow-up candidates, not implemented fixes. The pilot establishes two concrete UI candidates but does not demonstrate regressions caught or measured productivity gains.

Sources:

- https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
- C:/Users/cburk/.codex/skills/gsd-debug/SKILL.md

## Audit Results

Verdict: PASS (SELF-AUDIT PASS; non-independent)

Auditor: Codex self-audit for low-risk documentation closeout. Reviewed scope, acceptance criteria, installed entry-point identity and recorded hashes, React 18 exclusions, and the limited source-review claims. No application packages, scripts, or runtime behavior changed. This does not constitute a security audit of upstream skill contents. Source findings remain unverified in a browser. Required sections and allowed/prohibited boundaries are intact; executable negative-path tests do not apply to a review record. No independent auditor or external data sharing was used.

## Final Decision

Accepted. Human authorization: the user requested "commit and push then recommend next highest ROI task" on 2026-10-05 after the installation and source-review limitations were reported. Local review is non-independent; browser validation remains follow-up work.

