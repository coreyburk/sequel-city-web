# End-of-Day Handoff Template

## Purpose

Use this file as the reusable starting structure when preparing `docs/00-ssot/END-OF-DAY-HANDOFF.md` for a machine switch.

This file is the template.
The live handoff file must be refreshed with current project state before each handoff commit.

Workflow:

1. Copy this structure into `docs/00-ssot/END-OF-DAY-HANDOFF.md` or refresh the live file from it.
2. Replace all state fields with current information.
3. Commit and push the refreshed live handoff.
4. Pull on the other machine and continue from the refreshed live handoff.

If the local clone still points at the old GitHub repository path, update it before the next push:

```powershell
git remote set-url origin https://github.com/coreyburk/sequel-city-web.git
git remote -v
```

When recording commit activity for accepted work packages, use the project multi-line commit format:

- imperative title line
- blank line
- bullet list of concrete changes

## Current State

- Date:
- Machine:
- Peer Machine:
- Branch:
- Repo status:
- Current HEAD:

## Active Work Package

- Current WP:
- Status:
- Final Decision:

## Completed This Session

- Completed WPs:
- Notable implementation/doc themes:
- Important process changes:

## Verification Summary

- Verification performed:
- Relevant test or audit results:

## Open Issues / Risks

- Risk:
- Impact or note:

## Next Recommended Step

1. Pull latest `main`.
2. Update any machine-specific clone/remote details if needed.
3. Proceed with the next scoped work package.

## Resume Prompt (Copy/Paste)

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`.
Read current state and proceed with the next recommended work package using the established workflow style.

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
