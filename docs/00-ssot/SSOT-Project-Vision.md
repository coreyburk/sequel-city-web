# SSOT Project Vision

## Project Name

Sequel City Web Detective

## Product Goal

Create a locally hosted interactive SQL murder mystery website that helps students learn relational investigation, SQL querying, evidence interpretation, and hypothesis testing using the existing SequelCityCrimesDB database.

## Source Inspiration

The experience combines the existing SequelCityCrimesDB murder mystery assignment, the guided interactive learning model demonstrated by SQL Island, and the user's AI Agent development methodology with deterministic SSOT governance.

## Learner Experience

The learner plays the role of Sam Byte, a data detective reopening a cold murder case in Sequel City. The learner explores the database through SQL queries, follows evidence across related tables, identifies suspects, and verifies conclusions using the database.

The website should feel like an investigation, not a plain worksheet.

## Educational Goals

Students should practice reading a database schema, writing `SELECT` queries, filtering with `WHERE`, joining related tables, following evidence across multiple tables, forming and testing hypotheses, explaining what each query reveals, and reaching a defensible conclusion from data.

## Initial Scope

In scope:

- Local web application.
- Database connection to SequelCityCrimesDB.
- Safe SQL query execution.
- Case briefing interface.
- Query results display.
- Evidence notebook.
- Deterministic suspect verification.
- SSOT-governed AI advisory layer in a later phase.

Out of scope for the first version:

- Public cloud hosting.
- Multi-user classroom management.
- Authentication.
- Gradebook integration.
- AI-generated SQL answers.
- AI-driven correctness claims.
- Automatic mutation of the case database.

## Success Criteria

The project is successful when a student can complete the mystery through the website by querying the local database, recording evidence, and verifying the murderer and mastermind through deterministic database-backed logic.
