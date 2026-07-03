# Sequel Detective AI Handoff Brief

## What This Is

`Sequel Detective` is a local-first SQL learning application. It teaches students to investigate a murder case by reading schema, running safe read-only SQL, interpreting evidence, and verifying suspects through deterministic backend and database checks.

The product name shown to users is `Sequel Detective`. `Sequel City` remains the fictional setting inside the case content.

## Current Implemented Runtime

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Fastify + TypeScript
- Database: local SQL Server with `SequelCityCrimesDB`
- Runtime model: local browser app, no required internet access, no runtime AI

The backend is authoritative for SQL safety, query execution, schema metadata, query history, and suspect verification. The frontend is presentation-only.

## What The Live App Currently Shows

- case library entry screen
- Case 004 landing page: `Case 004: The SQL City Murder`
- case briefing / case file entry
- Query Lab
- schema explorer
- evidence board / notebook surfaces
- query results and query history
- first-suspect verification
- mastermind progression and closeout path

## Demo Route In One Sentence

Start at the case library, open Case 004, walk the evidence trail through the core SQL queries, confirm `Jeremy Bowers`, and continue the mastermind path if the recording needs the full chain.

## What To Trust

- SQL query results returned by the backend
- suspect verification returned by the database-backed solution path
- the scripted route in `demo-route-script.md`
- the paced capture order in `demo-shot-by-shot-recording-checklist.md`

## What Not To Claim

- cloud hosting
- production deployment support
- authentication
- gradebook integration
- runtime AI
- unrestricted SQL execution
- browser-side authority over correctness

## Good Input Bundle For Another AI Tool

Provide:

- this brief
- screenshots or image captures from the app
- `demo-route-script.md`
- `demo-shot-by-shot-recording-checklist.md`

That bundle gives another tool the product context, the live path, and the recording order without requiring it to infer the app from raw screenshots alone.
