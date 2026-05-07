# Non-Goals And Unsupported Configurations

## Purpose

This document states what the current release-readiness package does not support and does not promise.

## Current Non-Goals

The current implementation does not target:

- production deployment
- internet-facing hosting
- cloud deployment
- distributed runtime architecture
- multi-user operations
- runtime AI behavior
- direct learner SQL mutation
- frontend database authority

These are outside the current local-first runtime goal.

## Unsupported Deployment Configurations

The current project does not document or support:

- production web hosting
- cloud application hosting
- cloud-managed SQL Server
- load-balanced or replicated services
- container or Docker deployment
- reverse-proxy deployment
- hosted API environments

## Unsupported Database Configurations

The current project does not document or support:

- direct frontend access to SQL Server
- non-read-only learner SQL execution
- backend bypass of SQL safety validation
- operational assumptions that exclude a restored local `SequelCityCrimesDB`

Remote SQL Server usage is not a documented supported configuration for this release-readiness package.

## Unsupported Application Capabilities

The current project does not document or support:

- authentication
- authorization
- user accounts
- shared multi-user state
- persistent notebook storage
- persistent query history
- suspect verification endpoints
- deterministic case progression endpoints

## Unsupported AI Configurations

The current project does not document or support:

- runtime LLM calls
- runtime AI orchestration
- runtime MCP dependencies
- cloud AI services
- local AI runtimes as required infrastructure

Runtime AI is not part of the implemented release target.

## Boundary Rule

If a configuration requires invented infrastructure, invented operational dependencies, or runtime behavior that is not present in `apps/api` and `apps/web`, it should be treated as unsupported for this package.
