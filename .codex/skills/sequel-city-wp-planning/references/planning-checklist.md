# Planning Checklist

Before reporting a new WP:

- confirm the next WP number
- confirm the requested outcome is one coherent package
- classify Understand usage as Required, Recommended, or Optional
- record graph availability, baseline commit, and freshness
- inspect cumulative changed paths since the baseline, not only the current WP
- flag regeneration when accepted changes since the baseline touch `.codex/skills/**`, `scripts/**`, `tools/**`, major workflow docs, app architecture/imports, database structure, restricted data boundaries, or Case 004 progression
- verify graph findings against source
- list affected layers, primary files, upstream consumers, and downstream dependencies
- list related tests, user workflows, and security/data boundaries
- use the smallest practical `Allowed` set
- add explicit `Do Not Modify` boundaries
- decide whether graph regeneration is required after implementation
- keep Code Results, Audit Results, and Final Decision pending
- stop before implementation, acceptance, commit, or push
