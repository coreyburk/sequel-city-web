import { defineConfig } from "@playwright/test";

const browserChannel =
  process.env.PLAYWRIGHT_BROWSER_CHANNEL ??
  (process.platform === "win32" ? "msedge" : "chrome");
const captureVideo = process.env.PLAYWRIGHT_VIDEO === "on";
const captureScreenshots =
  process.env.PLAYWRIGHT_SCREENSHOT_MODE ?? (captureVideo ? "on" : "only-on-failure");
const captureTrace = process.env.PLAYWRIGHT_TRACE_MODE ?? (captureVideo ? "on" : "retain-on-failure");

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: browserChannel,
    headless: true,
    trace: captureTrace,
    screenshot: captureScreenshots,
    video: captureVideo ? "on" : "off"
  }
});
