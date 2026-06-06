import { defineConfig } from "@playwright/test";

const browserChannel =
  process.env.PLAYWRIGHT_BROWSER_CHANNEL ??
  (process.platform === "win32" ? "msedge" : "chrome");

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
    // Temporarily enable full tracing, screenshots and video to capture a recording
    // of the headed run. Will be reverted after artifacts are collected.
    trace: "on",
    screenshot: "on",
    video: "on"
  }
});
