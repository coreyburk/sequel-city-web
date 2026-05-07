# Evidence Discovery Model

## Purpose

This document explains how learners discover evidence without exposing hidden answers.

## Evidence Rule

Evidence must come from actual query results returned from the authoritative database. Learners discover patterns by traversing relationships, filtering candidate sets, and comparing records across tables.

## Core Discovery Patterns

### Schema-Led Discovery

The learner starts by understanding table roles, key columns, and relationship hints. This creates a safe map of where relevant evidence may exist.

### Relational Traversal

The learner moves from one evidence source to another through actual joins and key links, such as:

- report to interview
- person to license
- person to employment
- person to club membership
- event to event registration

### Filtering And Narrowing

The learner reduces noise through date filters, city filters, name filters, identifier matching, and other read-only query techniques supported by the backend safety model.

### Cross-Table Correlation

The learner compares details from multiple tables to check whether separate clues point toward the same small set of people, events, or activity records.

### Hypothesis Refinement

The learner uses each result set to refine the next question. The system supports this reasoning loop, but it does not generate the conclusion for the learner.

## Safe Evidence Sources

Current safe sources include:

- schema metadata returned by the backend
- query result rows returned by the backend
- deterministic backend safety and execution feedback
- backend query history for reviewing prior attempts

## Unsafe Or Non-Authoritative Sources

These are not valid evidence authorities:

- frontend-only assumptions
- hidden answer keys
- speculative narrative claims
- runtime AI output
- free-text guesses without supporting query results

## Spoiler Boundary

This model is intentionally structural. It explains how learners move through the evidence space without naming hidden suspects, revealing answer-only paths, or restating the solution script.
