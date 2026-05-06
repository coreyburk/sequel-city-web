# First-Launch Issue Triage

## Purpose

This document captures observed first-launch behavior and issues after the first successful browser-based application run.

## First-Launch Context

The application successfully launched with the following runtime context:

- Frontend on `http://127.0.0.1:5173`
- Backend on `http://127.0.0.1:3001`
- Database connected to `SequelCityCrimesDB`
- Schema loaded with 12 tables and 9 relationships

## Validation Summary

The following first-launch flow worked:

- Frontend rendered
- Backend health loaded
- Schema explorer loaded real database tables
- Query runner executed `SELECT DB_NAME() AS CurrentDatabase`
- Query runner executed `SELECT * from FitNFlabClub`
- Query history recorded both successful executions

## Confirmed Working Behavior

- Health panel
- Schema explorer
- Query runner
- Query results
- Query history
- Backend connectivity
- Database connectivity

## Severity Definitions

- Blocker: prevents first usable flow
- High: interrupts or significantly confuses first usable flow
- Medium: causes friction but does not block usage
- Low: cosmetic or clarity issue
- Deferred: valid future enhancement but not required for first usable flow

## Issue Area Definitions

- Runtime setup
- API connectivity
- Health panel
- Schema explorer
- Query runner
- Query results
- Query history
- Error messaging
- Documentation
- Other

## Issue Log

| Issue ID | Observed Behavior | Expected Behavior | Severity | Area | Evidence | Recommended Follow-Up | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ISSUE-001 | The frontend ran successfully on `http://127.0.0.1:5173`, but the backend API at `http://127.0.0.1:3001` was not available until the backend was started in a separate terminal. | Developer understands that frontend and backend are separate processes and must both be running. | Medium | Runtime setup | Frontend launch succeeded before backend availability; backend functionality became available only after starting the API process separately. | Improve setup documentation and consider a future combined dev startup script. | Open |
| ISSUE-002 | The frontend rendered correctly but displayed backend unavailable messages in the health, schema, and history sections when the backend was not running. | The UI should continue to fail safely, but the guidance could be clearer for first-time launchers. | Medium | API connectivity / Error messaging | Observed backend unavailable states in health, schema, and history before the backend process was started. | Consider clearer user-facing messaging in a later frontend triage or usability WP. | Open |
| ISSUE-003 | Frontend launch and frontend tests were blocked before `npm install` because `vite` and `vitest` were not available locally. | Developer runs `npm install` from the repo root before launching frontend. | Deferred | Runtime setup / Documentation | Initial frontend runtime and test commands were unavailable until repository dependencies were installed. | Ensure setup docs clearly state `npm install` must be run from the repo root. | Resolved by npm install; keep documented |

## Non-Issues And Deferred Items

Plain visual styling is not classified as an issue yet because no formal usability evaluation has been conducted.

Docker setup, Windows Authentication support, and advanced UX refinement are deferred future considerations.

## Recommended Follow-Up Work Packages

- `WP-017` developer startup script and local launch simplification
- `WP-018` frontend error-message clarity and first-run guidance
- `WP-019` observed UI usability refinement after further use

## Final Triage Decision

First launch is accepted and the system is usable, with non-blocking setup and guidance issues documented for follow-up.
