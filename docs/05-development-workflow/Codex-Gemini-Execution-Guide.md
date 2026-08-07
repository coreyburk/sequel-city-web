# Code Agent And Audit Execution Guide

## Code Agent Purpose

The code agent performs the implementation side of a work package. It follows the package instructions, makes the allowed changes, and reports what it completed, what it could not complete, and any scope or environment concerns.

The project supports two code agents: Codex and Claude. Both read from the `Code Prompt` section and write results to the `Code Results` section.

## Audit Agent Purpose

AntiGravity is the preferred current local independent audit agent when available and approved. Gemini remains supported as a legacy or alternate audit agent. The audit agent reviews changed files, checks compliance with the package, and records pass, fail, blocked, or warning-oriented findings for acceptance review.

Self-audit is not independent audit. Use it only as a labeled fallback for low-risk documentation-only packages or when an external audit is blocked by local policy, access, network, timeout, or tool availability.

Audits must use an adversarial stance. A passing audit needs evidence that the active package survives contract-shape checks, execution-safety checks, relevant negative-path probes, and explicit failure thresholds. The auditor should try to disprove scope compliance, output shape, authorization boundaries, command-preview safety, validation evidence, and no-runtime-change claims before reporting pass evidence.

## Hardened Audit Prompt Requirements

Every new or updated audit prompt should include the following checks when they are relevant to the package:

- adversarial contract-shape checks for required sections, allowed/prohibited file boundaries, structured output fields, result-state labels, authorization flags, command-preview markers, evidence fields, and blocker fields
- execution-safety proof that dry-run, preview, recommendation, fixture, prototype, audit-dispatch, or workflow-tool changes do not execute forbidden actions without explicit human authorization
- negative-path probing for unauthorized external audit, invalid or ambiguous work-package identifiers, missing or malformed sections, dirty or mixed worktrees, stale or unavailable graph evidence, timeout/tool/authentication failures, failed or blocked audit records, self-audit fallback, and missing validation evidence
- explicit thresholds that force `FAIL` when required evidence is absent or contradicted and `BLOCKED` when authorization, repository context, tooling, or clean scope prevents a valid independent verdict

For documentation-only changes, targeted source inspection and `rg` evidence may be enough when the work package records why executable tests are unnecessary. For runner, script, fixture, prototype, SDK manager, or other executable workflow changes, the audit should require automated or fixture evidence for representative negative paths and non-execution boundaries.

## Runner Modes

Use the project runner with one of these modes:

- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Full`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Codex`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Claude`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Gemini`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute AntiGravity`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Audit`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute None`

For audit-only requests, prefer the clearer wrapper:

- `scripts/audit-work-package.ps1` followed by a work package identifier

The wrapper delegates to `scripts/run-work-package.ps1 -Execute Audit` and does not replace the runner.

## Full Mode

`-Execute Full` runs the standard implementation and audit flow. Use this when the work package is ready for code agent execution and audit review in the same cycle.

To select the code agent for Full mode, pass `-CodeAgent Codex` or `-CodeAgent Claude`. The default is Codex for backward compatibility.

To select the audit agent for Full mode, pass `-AuditAgent Gemini` or `-AuditAgent AntiGravity`. The default is Gemini for backward compatibility.

Examples:

- `-Execute Full -CodeAgent Codex` runs Codex then Gemini
- `-Execute Full -CodeAgent Claude` runs Claude then Gemini
- `-Execute Full -CodeAgent Codex -AuditAgent AntiGravity -AllowExternalAudit` runs Codex then AGY after explicit external-audit authorization

## Codex-Only Mode

`-Execute Codex` runs only the Codex implementation step. Use this when:

- you need Codex output before requesting audit results
- the Gemini prompt still needs adjustment
- you are resolving implementation issues first

## Claude-Only Mode

`-Execute Claude` runs only the Claude implementation step. Use this when:

- you prefer Claude Code as the implementation engine
- you need Claude output before requesting audit results
- you are resolving implementation issues first

## Claude Permission Mode

When Claude is the code agent, pass `-ClaudePermissionMode` to control how Claude handles file writes during non-interactive execution.

Supported values:

- `default` — no permission mode argument is passed; Claude uses its default behavior
- `acceptEdits` — Claude accepts file edits without prompting
- `auto` — Claude makes decisions automatically
- `dontAsk` — Claude does not ask for confirmation
- `bypassPermissions` — Claude bypasses all permission checks

Default value is `default`.

### When to use acceptEdits

Use `acceptEdits` when you want Claude to apply file writes but still want it to stop and prompt for any action beyond editing, such as running shell commands.

### When to use bypassPermissions

Use `bypassPermissions` when running Claude in a trusted local repository where you want fully autonomous execution with no approval prompts. This allows Claude to write, create, and modify files without any interactive confirmation.

Only use `bypassPermissions` in repositories you control. Do not use it in shared, remote, or untrusted environments.

### Recommended usage for this project

For local trusted development in this project, the recommended approach when running implementation work packages via Claude is:

    .\scripts\run-work-package.ps1 "work-package-slug" -Execute Claude -ClaudePermissionMode bypassPermissions

    .\scripts\run-work-package.ps1 "work-package-slug" -Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions

Without `-ClaudePermissionMode bypassPermissions`, Claude launched non-interactively from the PowerShell runner will refuse file writes because no approval channel exists.

The `-ClaudePermissionMode` parameter applies only when Claude is the selected code agent. It has no effect on Codex, Gemini, or AntiGravity execution.

## Gemini-Only Mode

`-Execute Gemini` runs only the audit side. Use this when:

- implementation already exists and needs audit
- you are re-running review after prompt or formatting corrections
- you need focused audit feedback on changed files

## AntiGravity-Only Mode

`-Execute AntiGravity` runs only the AntiGravity audit side. AGY is the preferred independent audit agent when it is locally available, authenticated, and explicitly authorized for the repository state being audited.

Because AGY may send work-package prompt and repository context to an external service, the runner requires `-AllowExternalAudit` before it invokes `agy --print`.

Before invoking AGY, the runner checks that the current dirty worktree is isolated to the active work package's `Allowed:` file list. If unrelated modified or untracked files are present, the runner writes a `BLOCKED` audit result and does not invoke AGY. Use `-AllowMixedWorktree` only for an intentional exception after reviewing the listed out-of-scope files.

Examples:

- `.\scripts\audit-work-package.ps1 "work-package-slug" -AllowExternalAudit`
- `.\scripts\audit-work-package.ps1 WP-180 -AllowExternalAudit -TimeoutMinutes 30`
- `.\scripts\run-work-package.ps1 "work-package-slug" -Execute AntiGravity`
- `.\scripts\run-work-package.ps1 "work-package-slug" -Execute AntiGravity -AllowExternalAudit`
- `.\scripts\run-work-package.ps1 "work-package-slug" -Execute Audit -AuditAgent AntiGravity -AllowExternalAudit`

Without `-AllowExternalAudit`, the runner writes a `BLOCKED` audit result explaining that AGY was selected but external audit sharing was not authorized. That blocked result is not an independent audit pass.

If AGY is missing, not authenticated, times out, exits non-zero, or is blocked by approval/data-sharing policy, the runner records the blocker in the audit result section instead of claiming an audit verdict.

## Generic Audit Mode

`-Execute Audit` is the generic alias for the audit-only path. It defaults to Gemini for backward compatibility. Use `-AuditAgent AntiGravity` to select AGY explicitly.

`scripts/audit-work-package.ps1` is the preferred human-facing audit-only command. It defaults to AntiGravity for current project workflow clarity, supports `-Agent Gemini`, and passes through `-AllowExternalAudit`, `-AllowMixedWorktree`, and `-TimeoutMinutes` to the underlying runner.

Generic audit mode uses the same worktree isolation check as the direct Gemini and AntiGravity modes. Resolve unrelated dirty files before audit so the independent auditor reviews only the active work package.

When AGY is used manually or through the runner, record the invocation, scope, verdict, and limitations in `Audit Results`. Do not claim an AntiGravity audit passed unless AGY actually ran and returned a pass.

Audit records live inside an existing work-package result section. Use `Verdict: PASS`, `Verdict: FAIL`, or `Verdict: BLOCKED` as labels and use `###` or deeper subheadings for audit subsections. The runner normalizes external auditor `#` and `##` headings before insertion so AGY or Gemini output cannot create sibling work-package sections inside `## Audit Results`.

## None Mode

`-Execute None` performs no agent execution. Use this when:

- preparing or validating work package structure
- updating prompts before a real run
- documenting the package before execution starts

## How To Interpret Code Results

Review `Code Results` for:

- what changed
- whether the requested behavior was implemented
- any blocked steps or environment limitations
- any scope warnings or deviations

Do not treat `Code Results` as acceptance by themselves. They are implementation evidence, not the final project decision.

## Backward Compatibility

Existing work packages that use `Codex Prompt` and `Codex Results` continue to work. The runner prefers `Code Prompt` and `Code Results` when present and falls back to `Codex Prompt` and `Codex Results` automatically.

## How To Interpret Audit Results

Review `Audit Results` for:

- pass or fail status
- whether the auditor was independent or a labeled self-audit fallback
- concrete defects or missing requirements
- scope compliance warnings
- prompt formatting or runner issues
- adversarial contract-shape findings
- execution-safety proof or missing-proof findings
- negative-path coverage and failure-threshold findings

Audit output informs acceptance, but the project still records the actual decision in `Final Decision`.

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

Treat missing required evidence as a failure, not as an assumption to fill in during acceptance. This includes missing structured-output fields, missing execution-safety proof, missing negative-path coverage for executable workflow changes, or unverified boundary claims.

## What To Do When Independent Audit Is Blocked

- record the blocked audit as `BLOCKED`, not as pass
- state the blocker: approval policy, data-sharing policy, authentication, local tool missing, timeout, network, or other
- record whether AntiGravity, Gemini, or another independent agent was attempted
- record whether `-AllowExternalAudit` was provided for an AGY attempt
- record whether mixed-worktree isolation blocked the audit before the audit agent was invoked
- perform local mechanical checks when useful, such as changed-file scope, `git diff --check`, and acceptance-criteria review
- label local fallback review as self-audit
- require explicit human judgment before accepting with the audit limitation

## What To Do With Self-Audit

- label the result as `SELF-AUDIT PASS`, `SELF-AUDIT WARN`, or `SELF-AUDIT FAIL`
- use it for documentation-only or environment-blocked cases
- do not use it as the sole review for runtime behavior, database mutation, security boundaries, dependency adoption, script runner changes, release readiness claims, or destructive automation
- do not represent self-audit as AntiGravity, Gemini, or independent review
- downgrade to `SELF-AUDIT WARN` or `SELF-AUDIT FAIL` when fallback evidence cannot prove required contract shape, execution safety, or negative-path behavior for the package risk level

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
- rerun the most appropriate mode, usually `-Execute Codex`, `-Execute Claude`, `-Execute Gemini`, or `-Execute Full`
- replace ambiguous or malformed runner input before assuming a tooling defect

For prompt hygiene details, see [Prompt Formatting Guidelines](./Prompt-Formatting-Guidelines.md).
