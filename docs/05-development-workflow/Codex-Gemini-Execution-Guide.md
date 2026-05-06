# Codex And Gemini Execution Guide

## Codex Purpose

Codex performs the implementation side of a work package. It follows the package instructions, makes the allowed changes, and reports what it completed, what it could not complete, and any scope or environment concerns.

## Gemini Purpose

Gemini performs the audit side of a work package. It reviews changed files, checks compliance with the package, and records pass, fail, or warning-oriented findings for acceptance review.

## Runner Modes

Use the project runner with one of these modes:

- `scripts/run-work-package.ps1` followed by a work package slug and `Execute Full`
- `scripts/run-work-package.ps1` followed by a work package slug and `Execute Codex`
- `scripts/run-work-package.ps1` followed by a work package slug and `Execute Gemini`
- `scripts/run-work-package.ps1` followed by a work package slug and `Execute None`

## Full Mode

`Execute Full` runs the standard implementation and audit flow. Use this when the work package is ready for Codex execution and Gemini review in the same cycle.

## Codex-Only Mode

`Execute Codex` runs only the implementation side. Use this when:

- you need Codex output before requesting audit results
- the Gemini prompt still needs adjustment
- you are resolving implementation issues first

## Gemini-Only Mode

`Execute Gemini` runs only the audit side. Use this when:

- implementation already exists and needs audit
- you are re-running review after prompt or formatting corrections
- you need focused audit feedback on changed files

## None Mode

`Execute None` performs no agent execution. Use this when:

- preparing or validating work package structure
- updating prompts before a real run
- documenting the package before execution starts

## How To Interpret Codex Results

Review `Codex Results` for:

- what changed
- whether the requested behavior was implemented
- any blocked steps or environment limitations
- any scope warnings or deviations

Do not treat `Codex Results` as acceptance by themselves. They are implementation evidence, not the final project decision.

## How To Interpret Gemini Audit Results

Review `Gemini Audit Results` for:

- pass or fail status
- concrete defects or missing requirements
- scope compliance warnings
- prompt formatting or runner issues

Gemini audit output informs acceptance, but the project still records the actual decision in `Final Decision`.

## What To Do On PASS

- confirm the changed files remain within allowed scope
- confirm acceptance criteria are satisfied
- update `Final Decision` to reflect acceptance
- commit the accepted work package and related changes

## What To Do On FAIL

- do not mark the work package accepted
- review the specific failure details
- decide whether to fix within scope or open a corrective work package
- rerun the appropriate execution mode after addressing the problem

## What To Do With Scope Warnings

- inspect whether the warning reflects real out-of-scope change risk
- reject or correct accidental scope expansion before acceptance
- if additional work is truly required, document it and open a follow-up or corrective work package

## What To Do When Environment Limitations Occur

- record the limitation clearly in the result sections
- distinguish environment failure from implementation failure
- decide in `Final Decision` whether the work is accepted, blocked, or needs rerun
- rerun only after the limitation or prompt issue is addressed

## How To Rerun After Prompt Formatting Fixes

- clean up the work package prompt formatting first
- preserve the original work package intent and scope
- rerun the most appropriate mode, usually `Execute Codex`, `Execute Gemini`, or `Execute Full`
- replace ambiguous or malformed runner input before assuming a tooling defect

For prompt hygiene details, see [Prompt Formatting Guidelines](./Prompt-Formatting-Guidelines.md).
