# Audit Contract

## Audit Roles

Planner:

- creates a scoped work package
- defines allowed and prohibited paths
- chooses audit expectations

Code agent:

- implements within scope
- records changed files, validation, blockers, and deviations
- does not accept the work

Independent audit agent:

- reviews the work package, changed files, SSOT references, and validation evidence
- returns PASS, FAIL, or WARN/BLOCKED findings
- does not accept the work

Human acceptor:

- reviews implementation and audit evidence
- decides accepted, rejected, deferred, or corrective follow-up
- authorizes commits, pushes, destructive actions, dependency adoption, and runtime AI changes

## Preferred Independent Audit

Use AntiGravity as the current local independent audit agent when available and approved.

Audit-only AGY audits should use the clear wrapper command when possible:

- `scripts/audit-work-package.ps1 <work-package> -AllowExternalAudit`
- `scripts/audit-work-package.ps1 <work-package> -AllowExternalAudit -TimeoutMinutes 30`

The wrapper delegates to `scripts/run-work-package.ps1 -Execute Audit -AuditAgent AntiGravity`.

Runner-based AGY audits must use explicit external audit authorization before repository prompt or diff context is sent to AntiGravity:

- `scripts/run-work-package.ps1 <slug> -Execute AntiGravity -AllowExternalAudit`
- `scripts/run-work-package.ps1 <slug> -Execute Audit -AuditAgent AntiGravity -AllowExternalAudit`
- `scripts/run-work-package.ps1 <slug> -Execute Full -AuditAgent AntiGravity -AllowExternalAudit`

Without `-AllowExternalAudit`, the runner must record `BLOCKED` and must not invoke AGY.

An AntiGravity audit record must state:

- that AGY actually ran
- whether external audit data sharing was explicitly authorized
- whether the worktree was isolated to the active work package before audit
- what repository path and work package were audited
- whether it reviewed diffs, changed files, or specific paths
- the verdict and concrete findings
- any limitations such as timeout, missing credentials, inaccessible files, or policy restrictions

Audit result text is inserted inside an existing work-package result section. It must not contain sibling `##` headings inside `## Audit Results`, `## Gemini Audit Results`, or `## AntiGravity Audit Results`. Use a parser-safe verdict label such as `Verdict: PASS` and `###` or deeper subheadings for audit subsections. Runner-recorded external auditor output is expected to normalize unsafe `#` or `##` audit headings before insertion without changing verdict meaning.

Do not describe a planned or attempted AGY run as completed audit evidence.

## Blocked External Audit

If AntiGravity or another independent auditor cannot run, record:

- attempted command or invocation summary, when safe to disclose
- blocker type: approval policy, data-sharing policy, authentication, local tool missing, timeout, network, or other
- whether external audit authorization was withheld, omitted, or provided
- whether mixed-worktree isolation blocked the audit before an auditor was invoked
- whether any workaround was attempted
- why no workaround was attempted, if policy or safety blocked it
- what local checks were performed instead

Blocked audit is not independent audit. It can be acceptable only when the human accepts the limitation or when the work package remains pending.

## Self-Audit Fallback

Self-audit is acceptable only as a labeled fallback.

Use it for:

- low-risk documentation-only packages
- scope checks after an external audit is blocked
- validation of mechanical constraints such as changed-file lists, `git diff --check`, section presence, or no-runtime-change claims

Do not use it as the sole review for:

- runtime behavior changes
- database schema or data mutation changes
- security, restricted-table, spoiler, or answer-key boundaries
- dependency adoption
- script runner changes
- release readiness claims
- destructive local automation

Self-audit verdicts must be labeled as `SELF-AUDIT PASS`, `SELF-AUDIT WARN`, or `SELF-AUDIT FAIL`.

## Result States

Independent PASS:

- an independent auditor ran successfully
- no blocking findings remain
- the human may accept after reviewing evidence
- PASS audit records and generic prompt examples should lead with explicit pass wording and avoid parser-triggering blocked-state tokens unless they are quoting or recording an actual blocked-audit case. Use neutral wording such as "non-ready state" for resolved or hypothetical paths.

Independent FAIL:

- an independent auditor found unmet criteria, scope drift, regression, or boundary risk
- do not accept until fixed or converted to corrective work

Blocked external audit:

- independent audit did not complete
- record the blocker and local fallback checks
- acceptance requires explicit human judgment with the limitation visible

Self-audit fallback:

- local agent checks were performed by the implementing/reviewing Codex context
- useful as evidence, but not independent
- must not be represented as external audit

## Required Checks

Every audit path should check:

- actual changed files against allowed and prohibited paths
- worktree isolation before independent audit or finalization
- acceptance criteria against implementation evidence
- SSOT and workflow boundary preservation
- no unauthorized runtime AI, dependency, database, script, package, lockfile, graph, or generated-output changes
- validation commands and any unrun tests
- whether a corrective WP is needed instead of acceptance

## Hardened Audit Prompt Requirements

Audit prompts must ask the auditor to actively look for reasons the package should fail, not only confirm the intended happy path. Keep this adversarial review scoped to the active work package, changed files, and declared integration points.

### Adversarial Contract-Shape Checks

Auditors must verify the required shape of the work package and any structured outputs produced by the implementation:

- required work-package sections are present and populated for the current lifecycle state
- `Allowed:` and `Do Not Modify:` boundaries are explicit and match actual changed files
- audit/result headings use the expected names or supported legacy names
- structured outputs include required fields, result-state labels, authorization flags, command-preview markers, evidence fields, and blocker fields
- command previews are represented as display text or dry-run data, not executable instructions
- prose-only substitutes are rejected when the work package requires machine-readable output

If a required shape cannot be verified, the audit must report `FAIL` unless the missing context makes an independent verdict impossible, in which case it must report `BLOCKED`.

### Execution-Safety Proof

For workflow tools, dry-run commands, preview commands, SDK prototypes, audit dispatchers, and manager recommendations, auditors must require proof that forbidden actions do not execute without explicit human authorization.

Evidence may include source inspection, fixture tests, wrapper tests, command output, or documented no-automated-validation rationale for documentation-only work. The evidence must address the actual changed surface.

Forbidden actions include:

- implementation dispatch
- external audit invocation or external data sharing
- final acceptance, rejection, or deferral decisions
- handoff refresh
- commit or push
- graph refresh
- dependency installation or package/lockfile mutation
- live SDK or model calls
- network calls or trace export
- destructive filesystem actions
- app startup or browser automation
- database mutation

If execution-safety proof is missing for an executable workflow change, the audit must report `FAIL`. If proof cannot be collected because repository context, tooling, authorization, or clean scope is unavailable, report `BLOCKED`.

When documenting PASS examples, do not include blocked-state labels or all-caps blocked-state tokens except inside an explicit blocked-audit example. The runner may parse recorded audit text before a human reads the nuance, so PASS examples should not look like blocked audit records.

### Negative-Path Probing

Auditors must check negative paths that are relevant to the active package. Workflow-tooling changes require fixture, command-level, or source evidence for representative negative paths.

Relevant negative paths include:

- unauthorized external audit
- invalid or ambiguous work-package identifier
- missing or malformed prompt/result sections
- dirty or mixed worktree
- out-of-scope modified files
- stale or unavailable Understand graph
- timeout, authentication failure, missing local tool, network failure, or policy blocker
- failed audit result
- blocked audit result
- self-audit fallback
- missing validation evidence
- malformed structured output

Documentation-only packages may satisfy this requirement by updating the reusable audit contract and recording why executable tests were unnecessary. Script, runner, fixture, or prototype changes must include automated or fixture evidence unless a limitation is explicitly recorded.

### Explicit Failure Thresholds

Audits must use these thresholds consistently:

- `PASS`: independent or accepted fallback evidence verifies scope, acceptance criteria, contract shape, execution safety, relevant negative paths, validation evidence, and boundary preservation.
- `FAIL`: acceptance criteria, scope isolation, structured contract shape, execution-safety proof, negative-path coverage, validation evidence, or boundary preservation is missing or contradicted.
- `BLOCKED`: an independent verdict cannot be formed because repository context, authorization, tooling, clean worktree scope, readable files, or required environment access is unavailable.
- `SELF-AUDIT PASS`: local fallback checks support a low-risk documentation-only or environment-blocked package and all limitations are visible.
- `SELF-AUDIT WARN`: fallback checks are useful but incomplete, or risk is higher than documentation-only but still suitable for human review.
- `SELF-AUDIT FAIL`: local fallback checks find unmet criteria, scope drift, missing proof, or boundary risk.

Self-audit cannot satisfy independent-audit requirements for runtime behavior, database mutation, security or restricted-data boundaries, dependency adoption, script runner changes, release readiness claims, or destructive automation.
