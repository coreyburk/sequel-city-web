# Contributor Workflow Guide

## Purpose

This guide explains the standard contributor workflow for continuing development on Sequel City Web after the application is already installed, runnable, and validated. It defines how to use work packages, Codex, Gemini, Final Decisions, and disciplined commits so project changes stay reviewable and safe.

## Audience

- Contributors continuing feature, bug fix, documentation, or corrective work
- Reviewers validating work package outputs
- Maintainers who need consistent project history and acceptance records

## Prerequisites

- The project is already installed and runnable
- You can pull from the repository and push to your branch
- You understand the relevant project constraints before starting work
- You are prepared to work through a documented work package before making changes

## High-Level Development Loop

Use this loop for each accepted unit of work:

1. Pull the latest changes from the remote branch you are working from.
2. Check `git status` and confirm you understand any existing local changes before starting.
3. Create a new work package for the task you are about to perform.
4. Execute Codex and Gemini using the work package prompts and the appropriate runner mode.
5. Review the results, changed files, and any warnings or failures.
6. Update the `Final Decision` section in the work package with the accepted outcome.
7. Commit the accepted work as one cohesive change set.
8. Push the branch so the accepted work package and its implementation are available for review.

## Branch And Pull Guidance

- Start from the correct branch and pull before creating a new work package.
- Confirm `git remote -v` still shows the canonical `origin` URL before normal branch work on a machine-transition clone.
- If the clone still points at the previous GitHub repository path, run `git remote set-url origin https://github.com/coreyburk/sequel-city-web.git` before the next pull or push.
- Do not begin new work on stale local history.
- Keep each accepted work package cohesive so the resulting branch history is understandable.
- If a branch contains unrelated unfinished work, resolve that state before starting another accepted work package.
- At machine-switch time, refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` from `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md` so the live handoff reflects current state instead of older completed WPs.

## Work Package Overview

A work package is the project’s required unit of planned and reviewed development work. It defines scope, allowed files, constraints, acceptance criteria, execution prompts, tool results, and the final acceptance record. Every meaningful change should be grounded in a work package so the project can distinguish requested work from rejected or deferred work.

For the full lifecycle, see [Work Package Lifecycle](./Work-Package-Lifecycle.md).

## Codex Role

Codex is the implementation agent for the work package. Its role is to:

- read the work package instructions carefully
- make only the allowed changes
- report concrete implementation results
- surface blockers, limitations, or scope concerns when they occur

Codex output belongs in the `Codex Results` section of the work package record.

For execution modes and result handling, see [Codex And Gemini Execution Guide](./Codex-Gemini-Execution-Guide.md).

## Gemini Role

Gemini is the audit and review agent for the work package. Its role is to:

- inspect the accepted or proposed changes
- validate scope compliance
- identify regressions, omissions, or prompt issues
- provide a pass, fail, or warning-oriented review record

Gemini output belongs in the `Gemini Audit Results` section of the work package record.

## Review And Acceptance Expectations

- Review both implementation output and audit output before accepting work.
- Verify that changed files remain within the allowed scope.
- Confirm that acceptance criteria are actually satisfied, not just partially addressed.
- Record the project decision in `Final Decision`, including whether the work was accepted, deferred, rejected, or requires follow-up.
- If tool output is incomplete or environment-limited, do not treat that as accepted completion without an explicit decision.

## Commit And Push Expectations

- Commit only after the `Final Decision` reflects accepted work.
- Create one cohesive commit per accepted work package.
- Include the work package documentation updates in the same commit as the accepted implementation when applicable.
- Do not push ambiguous or partially accepted work as if it were complete.
- If work is intentionally blocked or deferred, document that state clearly before deciding whether a commit is appropriate.
- Use the repo's multi-line commit format: imperative title, blank line, then concrete change bullets.
- Do not use one-line Conventional Commit headers for accepted work package closeout in this repo.
- Prefer `scripts/commit-work-package.ps1` to preview and create the final accepted-WP commit.

For commit format expectations, see [Commit Message Guide](./Commit-Message-Guide.md).

## Related Workflow Documents

- [Work Package Lifecycle](./Work-Package-Lifecycle.md)
- [Codex And Gemini Execution Guide](./Codex-Gemini-Execution-Guide.md)
- [Commit Message Guide](./Commit-Message-Guide.md)
- [Prompt Formatting Guidelines](./Prompt-Formatting-Guidelines.md)
