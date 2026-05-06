# Commit Message Guide

## Standard Commit Style

Use the project’s established commit structure:

1. An imperative title line
2. A blank line
3. A bullet list of concrete changes
4. A final architecture or scope preservation bullet when appropriate

This format keeps accepted work packages readable in history and makes review easier.

## Expectations

- Commit only after the work package `Final Decision` is accepted.
- Create one cohesive commit per accepted work package.
- Include the work package documentation in the same commit as the accepted work.
- Do not commit unresolved failed work unless you are intentionally documenting a blocked state.

## Example 1

```text
Document contributor workflow for work package execution

- add the contributor workflow guide for branch, review, and acceptance flow
- add lifecycle, execution, commit, and prompt formatting reference guides
- link setup and startup documentation to the contributor workflow entry point
- preserve documentation-only scope with no application code changes
```

## Example 2

```text
Refine installation guidance for validated developer handoff

- clarify the post-installation validation path for contributors
- add the next-step reference to the contributor workflow guide
- keep runtime and setup guidance aligned with the documented work package process
```

## Commit Content Guidance

- Keep the title action-oriented and specific.
- Use bullets to describe what actually changed, not what you intended to change.
- Add a final preservation bullet when the commit intentionally protects architecture, scope, or documentation-only boundaries.
