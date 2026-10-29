# WP-314: retire stale work-package records

## Objective

Remove ancient unresolved records from the active backlog without reopening their implementation, inventing acceptance, or deleting project history.

## Scope

Administrative documentation cleanup of WP-001, WP-003, WP-004, WP-008, WP-023, WP-025, WP-028, WP-030, WP-032, WP-042, WP-046 and WP-069. The human requested cleanup on 2026-10-29 because these records are too old to justify renewed delivery effort.

For each record, make a bounded source/history check, then write a concise retirement disposition and date. Use leading `Superseded.` only when named successor records or current authoritative documentation demonstrably replace the original intent. Where no successor exists and the work is no longer requested, use leading `Rejected.` with an explicit administrative-retirement explanation, preserving any original deferred/rejected decision as historical text. Do not reinterpret completed-but-unaccepted work as accepted. Keep the original objectives, code results and audits intact.

Candidate succession anchors to verify, not assume: WP-002 for early SSOT; WP-004/WP-005 for the abandoned ASP.NET branch; WP-008A for query execution; current developer/architecture/release/journey documentation for old documentation proposals; WP-043 and later shared runtime work for old student UI proposals. Retire the old additional-testing request and art prompt proposal unless an explicit current requirement can be cited. Do not add speculative replacements to the backlog.

Simplicity: reuse WP-313's existing Superseded handling and current Rejected handling. No new status category, archive system, script changes or bulk re-audit of obsolete runtime implementations.

## Impact Analysis

### Understand Status

Optional tier: isolated historical decision/copy cleanup. All four graph artifacts are available; metadata baseline 2fce050, current HEAD 66632cb. Cumulative changed paths are WP-298 installer/test signature changes, graph artifacts and handoff/WP records. The graph is usable with non-structural drift for this lifecycle-document surface; installer drift is unrelated. Targeted graph inspection located Work-Package-Lifecycle.md and both status-wrapper/implementation nodes. Source confirms leading Superseded decisions are classified before successor-acceptance prose.

### Affected Architecture

Documentation/lifecycle records only. Primary files are the twelve named historical WPs and this record. Consumers are get-work-package-status, closeout checks and commit preview; no runtime or database consumers change.

### Regression Surface

Check the twelve records through existing status helpers and independently inspect leading decisions to avoid legacy misleading prose such as 'Not Approved' being parsed as acceptance. Verify closed dispositions, retained historic failures and valid successor references. Run scoped diff/link/whitespace checks. No application, browser or SQL tests are needed because executable sources and product data remain untouched.

### Graph Update Decision

No regeneration: bounded status/copy edits do not change lifecycle behavior, document organization, imports or runtime architecture. Do not modify graph artifacts.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-314-retire-stale-work-package-records.md
- docs/01-work-packages/WP-001-ssot-foundation.md
- docs/01-work-packages/WP-003-backend-skeleton-and-database-connection-endpoint.md
- docs/01-work-packages/WP-004-correct-backend-stack-decision-and-remove-off-track-aspnet-work.md
- docs/01-work-packages/WP-008-safe-query-execution-endpoint.md
- docs/01-work-packages/WP-023-developer-installation-runtime-setup-and-troubleshooting-guide.md
- docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md
- docs/01-work-packages/WP-028-create-architecture-and-runtime-flow-documentation.md
- docs/01-work-packages/WP-030-create-release-readiness-and-operational-assumptions-documentation.md
- docs/01-work-packages/WP-032-create-user-journey-and-investigation-flow-documentation.md
- docs/01-work-packages/WP-042-guided-student-investigation-flow-happy-path.md
- docs/01-work-packages/WP-046-student-query-runner-density-and-diagnostics-split.md
- docs/01-work-packages/WP-069-samuel-expression-state-art-prompt-pack.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Handoff is accepted-closeout only.

Do Not Modify:
- apps/**
- database/**
- scripts/**
- tools/**
- .codex/**
- .understand-anything/**
- package manifests, lockfiles, dependencies, local settings and databases
- any historical code/audit results or acceptance decisions outside the named retirement annotations

## Constraints

Do not delete/move historical WPs, resurrect obsolete features, fabricate delivery/acceptance, rerun old audits against today's runtime, or expand cleanup into product improvements. Preserve original failures and chronology. Findings outside this scope are reported, not silently repaired. No external audit without scoped human data-sharing authorization; no commit/push before human acceptance of this cleanup package.

## Required Behavior

1. Give all twelve named records a clear closed disposition with date and factual rationale.
2. Preserve old objectives, results and decisions as historical evidence.
3. Link concrete successors when using Superseded; otherwise explicitly retire unneeded work without implying delivery.
4. Confirm existing lifecycle tools classify the records as closed, and leave no newly invented feature backlog.
5. Record a concise before/after disposition table in Code Results, including evidence and validation.

## Acceptance Criteria

- [x] All twelve records are closed administratively, with no fabricated acceptance.
- [x] Supersession references resolve and substantiate the disposition.
- [x] Original implementation/audit history and negative outcomes remain intact.
- [x] Existing status checks confirm closed dispositions; scoped link and whitespace checks pass.
- [x] No runtime, database, tooling, dependency or graph changes occur.

## Code Prompt

After separate implementation authorization, perform the bounded historical retirement above. Inspect only enough source/history to justify each disposition; do not spend effort reviving obsolete implementations. Preserve original records and use existing closed states. Record before/after evidence and stop for review without accepting, committing or pushing this WP.

## Audit Prompt

Review documentation retirement only, not the obsolete runtime requirements. Falsify successor claims, check that history was preserved and no acceptance was invented, and verify current helpers classify all twelve records as closed. Confirm paths stay in scope and no runtime/database/tooling/graph changes occurred. Report a clear verdict and limitations; human acceptance remains separate.

## Code Results

Implemented on `codex/wp-314-retire-stale-records` after explicit human instruction on 2026-10-29.

| Record | Previous decision | Current disposition and evidence |
|---|---|---|
| WP-001 | Pending draft | Superseded: WP-002 SSOT alignment and WP-005 selected backend |
| WP-003 | Blank | Superseded: WP-004 removes abandoned ASP.NET scaffold; WP-005 supplies the selected backend |
| WP-004 | Blank | Superseded: WP-005 and current architecture SSOT own the selected stack |
| WP-008 | Blank | Superseded: WP-008A explicitly delivers the missing endpoint |
| WP-023 | Pending | Superseded: maintained installation/configuration and troubleshooting references |
| WP-025 | Rejected / Deferred | Rejected: retire obsolete session request; preserve missing-evidence failure |
| WP-028 | Pending review | Superseded: maintained architecture reference and architecture SSOT |
| WP-030 | Pending review | Superseded: maintained release-readiness reference, without new release certification |
| WP-032 | Pending review | Superseded: maintained user-journey reference, without current UI equivalence claims |
| WP-042 | Not Approved | Superseded: WP-043 simplification and WP-312 shared runtime; failed audit retained |
| WP-046 | Not Approved | Rejected: retire obsolete diagnostics proposal; failed continuity audit retained |
| WP-069 | Pending | Rejected: retire unrequested expression-art production; prompts retained as history |

No historical record was marked accepted. Original objectives, prompts, code results, audit results and final-decision bodies remain intact. Original decisions are in a separate `Historical Final Decision` section so legacy phrases such as 'Not Approved' or 'not accepted' cannot override the current disposition. WP-001's original Draft status remains quoted alongside retirement status. Added explicit archival impact notes and, where absent, retirement-only lifecycle fields; these do not authorize old feature implementation. Original UTF-8 BOMs were retained.

Validation:

- Twelve source/history preservation checks against HEAD passed: original content before Final Decision is unchanged except WP-001's explicitly labeled status annotation, and each original decision body is retained verbatim (blank decisions are identified explicitly).
- All newly added retirement/successor links resolve. Successor claims were checked against WP-002, WP-004/WP-005, WP-008A, WP-043/WP-312 and the current documentation reference headings.
- The existing `Get-FinalDecisionKind` function was loaded directly from the unchanged status helper's AST and asserted for all twelve current decision sections: nine Superseded, three Rejected. Existing source maps those to ClosedSuperseded/ClosedRejected. Full per-record dirty-worktree preflight would correctly reject this multi-record batch against each old WP's original feature scope; WP-314 owns the batch and its scope preflight is authoritative during implementation.
- `scripts/tests/test-work-package-status.ps1` printed `PASS work-package status checks`, with no assertion exception and all owned temporary fixtures cleaned. The process retained exit code 2 from its final intentional mixed-worktree negative probe; this is disclosed rather than represented as exit 0. Test source confirms that final probe explicitly expects exit 2 and only then prints PASS.
- `git diff --check` passed. Only the twelve named historical documents and this WP changed. Handoff is untouched until accepted closeout. No runtime, database, tool, dependency, graph or generated source changes; no SQL/browser checks required.

Independent audit and human acceptance of WP-314 remain pending. No external audit, handoff refresh, source commit or push performed.

## Audit Results

Verdict: PASS

Auditor: AntiGravity

### Independent Audit Report: WP-314 Documentation Retirement

### Audit Verdict: **PASS**

Independent audit of [WP-314-retire-stale-work-package-records.md](../../docs/01-work-packages/WP-314-retire-stale-work-package-records.md) has completed. All twelve historical records have been reviewed exclusively for documentation retirement. All successor claims were rigorously evaluated and substantiated, history was preserved verbatim without inventing acceptance, current helpers classify all twelve records as closed, and all touched files stay strictly within scope with zero runtime, database, tooling, or graph changes.

---

### 1. Scope & Boundary Conformance

- **File Scope Boundaries:** Confirmed via `git status --porcelain` and `git diff --stat`. Only the twelve named historical records and the WP-314 definition file were touched:
  - Modified:
    - [WP-001-ssot-foundation.md](../../docs/01-work-packages/WP-001-ssot-foundation.md)
    - [WP-003-backend-skeleton-and-database-connection-endpoint.md](../../docs/01-work-packages/WP-003-backend-skeleton-and-database-connection-endpoint.md)
    - [WP-004-correct-backend-stack-decision-and-remove-off-track-aspnet-work.md](../../docs/01-work-packages/WP-004-correct-backend-stack-decision-and-remove-off-track-aspnet-work.md)
    - [WP-008-safe-query-execution-endpoint.md](../../docs/01-work-packages/WP-008-safe-query-execution-endpoint.md)
    - [WP-023-developer-installation-runtime-setup-and-troubleshooting-guide.md](../../docs/01-work-packages/WP-023-developer-installation-runtime-setup-and-troubleshooting-guide.md)
    - [WP-025-additional-user-testing-sessions-and-cross-session-analysis.md](../../docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md)
    - [WP-028-create-architecture-and-runtime-flow-documentation.md](../../docs/01-work-packages/WP-028-create-architecture-and-runtime-flow-documentation.md)
    - [WP-030-create-release-readiness-and-operational-assumptions-documentation.md](../../docs/01-work-packages/WP-030-create-release-readiness-and-operational-assumptions-documentation.md)
    - [WP-032-create-user-journey-and-investigation-flow-documentation.md](../../docs/01-work-packages/WP-032-create-user-journey-and-investigation-flow-documentation.md)
    - [WP-042-guided-student-investigation-flow-happy-path.md](../../docs/01-work-packages/WP-042-guided-student-investigation-flow-happy-path.md)
    - [WP-046-student-query-runner-density-and-diagnostics-split.md](../../docs/01-work-packages/WP-046-student-query-runner-density-and-diagnostics-split.md)
    - [WP-069-samuel-expression-state-art-prompt-pack.md](../../docs/01-work-packages/WP-069-samuel-expression-state-art-prompt-pack.md)
  - Untracked:
    - [WP-314-retire-stale-work-package-records.md](../../docs/01-work-packages/WP-314-retire-stale-work-package-records.md)
- **Zero Runtime / Database / Tooling / Graph Changes:** Zero changes occurred in `apps/**`, `database/**`, `scripts/**`, `tools/**`, `.codex/**`, `.understand-anything/**`, package manifests (`package.json`), lockfiles, or environment configurations.
- **Diff Hygiene:** `git diff --check` passed cleanly with no trailing whitespace or whitespace errors.

---

### 2. Successor Claim Verification & Falsification

Each successor claim was evaluated against repository evidence:

| Work Package | Disposition | Successor Anchors Checked | Verification Findings |
|---|---|---|---|
| **WP-001** | `Superseded` | [WP-002](../../docs/01-work-packages/WP-002-ssot-alignment.md), [WP-005](../../docs/01-work-packages/WP-005-node-fastify-backend-skeleton-and-database-health-endpoint.md) | **Substantiated.** WP-002 delivered standalone deterministic SSOT alignment; WP-005 delivered the selected Fastify backend. ASP.NET layout obsolete. |
| **WP-003** | `Superseded` | [WP-004](../../docs/01-work-packages/WP-004-correct-backend-stack-decision-and-remove-off-track-aspnet-work.md), [WP-005](../../docs/01-work-packages/WP-005-node-fastify-backend-skeleton-and-database-health-endpoint.md) | **Substantiated.** WP-004 removed ASP.NET scaffolding; WP-005 delivered the selected Fastify stack. |
| **WP-004** | `Superseded` | [WP-005](../../docs/01-work-packages/WP-005-node-fastify-backend-skeleton-and-database-health-endpoint.md), [SSOT-Architecture](../../docs/00-ssot/SSOT-Architecture.md) | **Substantiated.** Interim stack cleanup superseded by delivered WP-005 and active SSOT architecture. |
| **WP-008** | `Superseded` | [WP-008A](../../docs/01-work-packages/WP-008A-implement-missing-safe-query-execution-endpoint.md) | **Substantiated.** Original query endpoint was missing/unimplemented in WP-008; WP-008A explicitly implemented and verified `POST /api/query/execute`. |
| **WP-023** | `Superseded` | [Developer Installation Guide](../../docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md), [Troubleshooting Reference](../../docs/04-developer-setup/Troubleshooting-Reference.md) | **Substantiated.** Maintained master guides exist and govern developer setup. Old documentation proposal safely retired. |
| **WP-025** | `Rejected` | *(None claimed)* | **Substantiated.** Administratively retired obsolete user testing request. Historical missing-evidence audit failure and deferred decision preserved verbatim. |
| **WP-028** | `Superseded` | [Architecture README](../../docs/06-architecture/README.md), [SSOT-Architecture](../../docs/00-ssot/SSOT-Architecture.md) | **Substantiated.** Maintained architecture documentation and SSOT supersede old proposal without retroactive acceptance. |
| **WP-030** | `Superseded` | [Release Readiness README](../../docs/09-release-readiness/README.md) | **Substantiated.** Maintained operational documentation supersedes old production request; no new release certification implied. |
| **WP-032** | `Superseded` | [User Journey README](../../docs/10-user-journey/README.md) | **Substantiated.** Maintained journey reference supersedes old proposal; no UI equivalence to historical drafts claimed. |
| **WP-042** | `Superseded` | [WP-043](../../docs/01-work-packages/WP-043-student-mode-density-and-schema-drilldown-refinement.md), [WP-312](../../docs/01-work-packages/WP-312-integrated-runtime-backlog-closeout.md) | **Substantiated.** Failed four-step navigator was superseded by student mode single-page layout (WP-043) and integrated runtime progression (WP-312). Failed audit retained. |
| **WP-046** | `Rejected` | *(None claimed)* | **Substantiated.** Administratively retired obsolete diagnostics split. Failed Developer Mode continuity audit and original non-approval preserved verbatim. |
| **WP-069** | `Rejected` | *(None claimed)* | **Substantiated.** Administratively retired expression art prompt proposal. Draft prompts preserved as historical text without claiming artwork production or UI adoption. |

All 27 Markdown links added across the twelve retired records resolve to existing files.

---

### 3. Preservation of History & Non-Invention of Acceptance

- **Text Preservation:** An automated line-by-line diff against `HEAD` confirmed that 100% of the content preceding the added retirement annotations remains identical across all twelve records (with only the explicit status annotation in WP-001 updating `Draft` to `Superseded; retired under WP-314 on 2026-10-29. Original status: Draft`).
- **Verbatim Historical Final Decisions:** Every prior final decision was preserved verbatim under `## Historical Final Decision (preserved verbatim)`. Blank historical decisions (WP-003, WP-004, WP-008) are explicitly documented as originally blank. Negative audit results (WP-042, WP-046), missing evidence notes (WP-025), and pending states were preserved.
- **No Acceptance Invented:** Zero records contain "Accepted" or "Approved" as their active decision. Each leading decision explicitly states:
  > *"This disposition closes the historical request; it does not certify its original implementation or grant new execution scope."*
- **BOM Preservation:** Checked byte signatures against `HEAD`. UTF-8 BOMs were preserved on the exact 5 files that originally had them (WP-004, WP-008, WP-028, WP-030, WP-032); the other 7 files correctly remain BOM-less.

---

### 4. Lifecycle Helper Classification

- **AST Evaluation of [`Get-FinalDecisionKind`](../../scripts/work-package/get-work-package-status.ps1#L260):** Loaded and evaluated the AST function directly against all twelve files:
  - WP-001, WP-003, WP-004, WP-008, WP-023, WP-028, WP-030, WP-032, WP-042 $\rightarrow$ `Superseded` (`ClosedSuperseded`)
  - WP-025, WP-046, WP-069 $\rightarrow$ `Rejected` (`ClosedRejected`)
- **Status Test Suite:** Executed [`scripts/tests/test-work-package-status.ps1`](../../scripts/tests/test-work-package-status.ps1) and confirmed it passes cleanly (`PASS work-package status checks`).
- **Closeout Gate Enforcement:** Confirmed that [`check-work-package-closeout.ps1`](../../scripts/work-package/check-work-package-closeout.ps1) recognizes `ClosedSuperseded` and `ClosedRejected` records and blocks them from acceptance finalization (`"Final decision is superseded."` / `"Final decision is rejected or deferred."`).
- **WP-314 Package Status:** Ran [`scripts/check-work-package-closeout.ps1 WP-314`](../../scripts/work-package/check-work-package-closeout.ps1); closeout state is `ReadyForAcceptance` with 0 blocking findings.

---

### 5. Audit Limitations

- This audit strictly reviews administrative documentation retirement and historical preservation.
- Obsolete runtime requirements, abandoned ASP.NET architecture, obsolete diagnostic designs, and unproduced art assets were not re-tested or validated against current executable application behavior.
- Human acceptance of WP-314 remains separate and is not inferred or granted by this audit.

### Invocation and maintainer review (2026-10-29)

The human explicitly authorized sharing the isolated WP-314 documentation and audit context with AntiGravity. AGY actually completed through `scripts/audit-work-package.ps1 WP-314 -AllowExternalAudit -TimeoutMinutes 10` in `D:/GitHub-Repos/SequelCityWeb/.git/wp314-independent-audit`, returning this review after 00:07:52. The isolated snapshot contained the twelve modified historical records and the new WP-314; credentials, local settings and SQL registration were excluded. Byte comparisons confirmed the twelve retirement documents were unchanged by the auditor. No source changes were imported; only this completed audit report was recorded. Repository-root citation paths were mechanically made relative to this WP without changing findings.

The auditor independently executed the non-SQL status suite and preservation/classification probes, confirmed nine Superseded and three Rejected decisions, and reported no blocking findings. The inherited exit-2 behavior of the status test's final expected negative probe remains disclosed in Code Results. Runtime, browser and database revalidation were intentionally excluded because this is historical-document retirement; the audit does not certify obsolete features or current release readiness. Handoff, runtime, dependencies, graph, database, commit and push remain untouched. Human acceptance of WP-314 remains pending.

## Final Decision

Accepted by the human on 2026-10-29: "accepted. commit and push". Independent AntiGravity audit passed with no blocking findings; preservation, successor references, classification and scope checks support the administrative retirement. Commit and push this documentation-only cleanup and refreshed handoff. This accepts WP-314's retirement work, not the old implementations or their historical failures.
