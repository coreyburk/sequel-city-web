# Deterministic Learning Model

## Purpose

This document explains why the investigation experience is deterministic and why that matters for learning.

## Deterministic Principles

- the backend validates every learner query
- only backend-approved read-only SQL can run
- the database is the authority for evidence
- response shapes are normalized consistently
- the frontend displays results but does not decide correctness

## Why Determinism Matters

### Reproducibility

Learners can repeat the same safe query and receive the same evidence shape from the same local dataset.

### Fairness

All learners work against the same safety boundary and the same database-backed evidence authority rather than variable runtime guidance.

### Predictable Feedback

Blocked queries, execution failures, and successful result shapes follow stable backend rules. This makes SQL learning clearer than a system that changes behavior from run to run.

### Evidence-Based Reasoning

The learner must support conclusions with actual query results. The system does not reward guessing, hidden mechanics, or frontend-only state changes.

## Backend Authority In Learning

The backend is not only a transport layer. It is the deterministic enforcement point for:

- SQL safety
- read-only execution
- error shaping
- result normalization
- history recording
- suspect verification through the database-backed case verification endpoint

This keeps the educational loop stable and prevents the frontend from becoming an accidental source of truth.

## No Runtime AI Dependency

The current investigation model does not depend on runtime AI. That boundary matters because:

- the project remains local-first
- the learning loop stays predictable
- hidden answers are less likely to leak through advisory behavior
- correctness remains database-backed rather than model-generated

## Current Limits

The current runtime does not yet implement full deterministic case progression. Even so, the learning loop follows the same deterministic structure: backend authority, read-only SQL, database-backed evidence, database-backed suspect verification, and frontend presentation only.
