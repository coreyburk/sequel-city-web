# Example Corrective WP Shape

This is a compact shape example, not a template to copy verbatim.

## Input

Original WP: `docs/01-work-packages/WP-123-example-feature.md`

Audit finding:

```text
FAIL: The implementation updated apps/web/src/example.tsx but did not update the matching browser test required by acceptance criterion 3.
```

## Corrective WP Direction

Objective:

```text
Correct WP-123 by adding the missing browser-test coverage required by acceptance criterion 3.
```

Scope:

```text
In scope:
- Add or update only the browser test that verifies the behavior implemented by WP-123.

Out of scope:
- Changing production app behavior.
- Refactoring the feature.
- Adding new dependencies.
```

Allowed files:

```text
Allowed:
- apps/web/tests/browser/example.spec.ts

Do Not Modify:
- apps/web/src/**
- apps/api/**
- database/**
- package manifests
- dependency lockfiles
```

Acceptance criteria:

```text
- [ ] The missing browser assertion from WP-123 acceptance criterion 3 is covered.
- [ ] The test fails against the missing behavior and passes against the accepted implementation.
- [ ] No production code changes are made.
```

The generated WP would leave `Code Results`, `Audit Results`, and `Final Decision` pending.
