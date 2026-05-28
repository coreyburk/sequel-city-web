import { spawn, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(currentDir, "..", "..");
const repoRoot = resolve(webRoot, "..", "..");
const viteCliPath = resolve(repoRoot, "node_modules", "vite", "bin", "vite.js");
const playwrightCliPath = resolve(
  repoRoot,
  "node_modules",
  "@playwright",
  "test",
  "cli.js"
);
const serverUrl = "http://127.0.0.1:4173";

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the timeout expires.
    }

    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopServer(serverProcess) {
  if (!serverProcess || serverProcess.exitCode !== null) {
    return;
  }

  if (process.platform === "win32" && serverProcess.pid) {
    spawnSync("taskkill", ["/pid", String(serverProcess.pid), "/t", "/f"], {
      stdio: "ignore"
    });
    return;
  }

  serverProcess.kill("SIGTERM");
}

const serverProcess = spawn(
  process.execPath,
  [viteCliPath, "--host", "127.0.0.1", "--port", "4173"],
  {
    cwd: webRoot,
    stdio: "inherit"
  }
);

const cleanup = () => stopServer(serverProcess);
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

try {
  await waitForServer(serverUrl, 120_000);

  const playwrightArgs = [playwrightCliPath, "test", ...process.argv.slice(2)];
  const testProcess = spawn(process.execPath, playwrightArgs, {
    cwd: webRoot,
    stdio: "inherit"
  });

  const exitCode = await new Promise((resolvePromise, reject) => {
    testProcess.on("error", reject);
    testProcess.on("close", (code) => resolvePromise(code ?? 1));
  });

  cleanup();
  process.exit(exitCode);
} catch (error) {
  cleanup();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
