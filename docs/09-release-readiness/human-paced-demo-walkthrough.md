# Human-Paced Demo Walkthrough

## Purpose

Use this route when you need a repeatable browser walkthrough for screen capture. It opens a headed browser, walks the Case 004 happy path at human pace, shows a recording-only cursor, types each SQL query, and holds on the final `Case 004 Closed` splash.

The walkthrough uses the existing deterministic Student Mode API mocks, so it does not depend on the live SQL Server database during recording.

## Run From Repository Root

```powershell
npm run demo:walkthrough
```

The runner starts the local Vite web server, opens the browser, performs the walkthrough, and leaves the final closeout splash visible.

## Timing Controls

Optional environment variables:

- `DEMO_STEP_MS`: normal pause between visible actions. Default: `1800`.
- `DEMO_SHORT_STEP_MS`: shorter pause for small selection actions. Default: `900`.
- `DEMO_FINAL_HOLD_MS`: final hold on the case-close splash. Default: `120000`.
- `DEMO_TYPE_DELAY_MS`: delay between typed SQL characters. Default: `18`.
- `DEMO_CURSOR_MOVE_MS`: cursor travel animation duration before clicks. Default: `420`.

Example:

```powershell
$env:DEMO_STEP_MS = "2500"
$env:DEMO_SHORT_STEP_MS = "1200"
$env:DEMO_TYPE_DELAY_MS = "28"
$env:DEMO_CURSOR_MOVE_MS = "520"
$env:DEMO_FINAL_HOLD_MS = "300000"
npm run demo:walkthrough
```

Use `Ctrl+C` to stop the runner early.

## Screen Capture Notes

- Start recording after the browser opens on the case library.
- The visible cursor is injected only for this walkthrough and does not affect the app itself.
- Keep the default final hold if you only need a short ending shot.
- Increase `DEMO_FINAL_HOLD_MS` if you want time to narrate the final resolution screen.
