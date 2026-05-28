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
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: browserChannel,
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  }
});
