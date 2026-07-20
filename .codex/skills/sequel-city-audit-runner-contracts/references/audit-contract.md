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
