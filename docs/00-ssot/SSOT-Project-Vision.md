# SSOT Project Vision

## Project Name

Sequel City Web Detective

## Product Goal

Create a modern local browser-based SQL investigation experience that helps students learn relational investigation, SQL querying, evidence interpretation, and hypothesis testing using the existing SequelCityCrimesDB database.

Sequel City Web Detective is a new, standalone project. It is not DataQuest, not a DataQuest extension, and not a DataQuest Phase II. It does not depend on DataQuest code, architecture, MCP services, agents, or runtime components.

## Source Inspiration

The experience combines the existing SequelCityCrimesDB murder mystery assignment, the guided interactive learning model demonstrated by SQL Island, and deterministic SSOT governance. General governance patterns may be reused, but runtime coupling to prior projects or external AI systems is not allowed.

## Document Scope

This document owns product purpose, learner experience, initial scope, non-goals, and success criteria. Runtime layering is owned by `SSOT-Architecture.md`. Query safety is owned by `SSOT-SQL-Safety-Rules.md`. UI responsibilities are owned by `SSOT-UI-UX-Experience.md`.

## Learner Experience

The learner plays the role of Sam Byte, a data detective reopening a cold murder case in Sequel City. The learner explores the database through SQL queries, follows evidence across related tables, identifies suspects, and verifies conclusions using the database.

The application should feel like a modern investigation experience in a local browser, not a plain worksheet.

The initial version must be self-contained, locally hosted, and runnable from a fresh setup. A student must be able to launch the local web app and play in a browser against the local SequelCityCrimesDB database without internet access or external services.

## Educational Goals

Students should practice reading a database schema, writing `SELECT` queries, filtering with `WHERE`, joining related tables, following evidence across multiple tables, forming and testing hypotheses, explaining what each query reveals, and reaching a defensible conclusion from data.

## Initial Scope

In scope:

- Local web application.
- Student-launchable local browser app served from `localhost`.
- Self-contained local-first runtime with no required internet connectivity.
- Database connection to SequelCityCrimesDB.
- Safe SQL query execution.
- Case briefing interface.
- Query results display.
- Evidence notebook.
- Deterministic suspect verification.
- Static or deterministic case narrative and progress feedback.
- Future Optional Enhancement - Advisory Only - Not Required for Initial Version: SSOT-governed AI advisory layer in a later phase.

Out of scope for the first version:

- Public cloud hosting.
- Multi-user classroom management.
- Authentication.
- Gradebook integration.
- DataQuest integration or reuse of DataQuest runtime components.
- AI, LLM, MCP, Ollama, cloud AI services, or external APIs as initial runtime requirements.
- AI-generated SQL answers.
- AI-driven correctness claims.
- Automatic mutation of the case database.

## Success Criteria

The project is successful when a student can complete the mystery through the website by querying the local database, recording evidence, and verifying the murderer and mastermind through deterministic database-backed logic.

Database-backed query results and verification results are authoritative for learner correctness and case outcome.
