# Progress Reports

This package defines reusable project progress-report templates for Sequel City Web Detective.

Its purpose is to make daily handoff reporting and weekly summary reporting consistent across machines and work sessions.

## Package Rules

- reflect only work that actually happened
- use current work package and audit terminology
- keep report entries concise and scannable
- record commits and pushes in human-readable form
- separate verified facts from future priorities

## File Naming

- `DAILY-YYYY-MM-DD.md`
  - one report for a specific calendar day
  - use for machine handoff, end-of-day wrap-up, or session continuity
- `WEEKLY-YYYY-WW.md`
  - one report for an ISO-style reporting week
  - use for multi-WP summaries and carried-forward planning

## Minimum Required Sections

Every progress report should explicitly capture:

- reporting context
- work packages completed or advanced
- audit outcomes and final decisions
- commits and pushes
- verification performed
- open risks or blockers
- next priorities

## Package Contents

| Document | Purpose |
|---|---|
| `DAILY-YYYY-MM-DD.md` | Daily execution and handoff template |
| `WEEKLY-YYYY-WW.md` | Weekly summary and forward-planning template |

## Usage Notes

- Daily reports are operational and session-oriented.
- Weekly reports are summary-oriented and should compress repeated detail.
- If a WP is only partially completed, report it as advanced rather than completed.
- If an audit is still pending, state that explicitly instead of implying approval.
- For machine-switch handoffs, refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` from `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md` so the live handoff does not retain stale state.
