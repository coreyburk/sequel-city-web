# Developer Startup Workflow

## Purpose

This document defines the preferred single-command startup workflow for Sequel City Web Detective. It reduces developer friction by starting the backend and frontend workspaces together from the repository root.

## Prerequisites

- Node installed
- `npm install` run at the repository root

## Startup

Preferred command from the repository root:

```powershell
npm run dev
```

This root script starts both existing workspace dev commands at the same time:

- `npm run dev --workspace apps/api`
- `npm run dev --workspace apps/web`

## Expected Behavior

- Backend runs on `http://127.0.0.1:3001`
- Frontend runs on `http://127.0.0.1:5173`

## Browser Step

Open:

`http://127.0.0.1:5173`

## Validation Checklist

- Health panel shows API, database, and schema OK
- Schema explorer loads tables
- Query runner works
- Query history updates
