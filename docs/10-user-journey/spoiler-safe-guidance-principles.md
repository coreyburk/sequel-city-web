# Spoiler-Safe Guidance Principles

## Purpose

This document defines how learner-facing guidance should preserve discovery while still supporting SQL learning.

## Guidance Principles

### Preserve Discovery

Guidance should help the learner decide what kind of evidence to inspect next without naming hidden suspects, hidden answer rows, or answer-only query paths.

### Encourage Relational Reasoning

Guidance should direct attention toward tables, joins, filters, and relationship-following rather than toward solution disclosure.

### Keep The Learner In Control

The learner owns the final conclusion. Guidance may clarify structure or process, but it must not become a hidden answer channel.

### Use Deterministic Facts Only

Guidance should rely on:

- known schema structure
- backend safety rules
- backend response shapes
- already returned learner-visible evidence

Guidance must not rely on hidden answer keys or invented runtime interpretation.

### Keep Feedback Constructive

Blocked and failed query messages should explain the next safe direction when possible, such as reminding the learner that only read-only `SELECT` queries are allowed.

## Safe Guidance Examples

- suggest reviewing the schema before writing a join
- remind the learner that the backend accepts read-only queries only
- encourage narrowing a broad result set with filters
- encourage comparing results across related tables

## Unsafe Guidance Examples

- naming the hidden murderer or mastermind
- providing answer-only SQL that bypasses learner reasoning
- implying the frontend knows correctness on its own
- inventing clues that do not come from the database
- presenting runtime AI as an implemented helper

## Current Runtime Position

The current frontend includes deterministic setup and query guidance text. It does not include runtime tutoring, narrative hint generation, or AI-assisted investigation. Any future guidance additions must preserve the same spoiler-safe and backend-authoritative rules.
