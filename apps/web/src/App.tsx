import { useState } from "react";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";

type WorkspaceMode = "student" | "developer";

export default function App(): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Sequel City Web Detective</h1>
        <div className="mode-toggle" role="group" aria-label="Workspace Mode">
          <button
            type="button"
            aria-pressed={mode === "student"}
            onClick={() => setMode("student")}
          >
            Student Mode
          </button>
          <button
            type="button"
            aria-pressed={mode === "developer"}
            onClick={() => setMode("developer")}
          >
            Developer Mode
          </button>
        </div>
      </header>
      {mode === "student" ? (
        <section className="panel panel--full guidance-panel" aria-labelledby="student-quickstart-title">
          <div className="section-heading">
            <h2 id="student-quickstart-title">Student Investigation Quickstart</h2>
            <p className="message-muted">
              Follow this flow to orient, gather evidence, and verify a suspect using backend-backed results.
            </p>
          </div>
          <ol className="student-flow-list">
            <li>Confirm the workspace is ready using the health panel.</li>
            <li>Use schema explorer to choose a table and relationship direction.</li>
            <li>Run a safe read-only query and interpret backend feedback.</li>
            <li>Verify a suspect and explain the verdict from returned evidence.</li>
          </ol>
        </section>
      ) : (
        <section className="panel panel--full guidance-panel" aria-labelledby="first-run-guidance-title">
          <div className="section-heading">
            <h2 id="first-run-guidance-title">First-Run Guidance</h2>
            <p className="message-muted">
              Keep this visible during first launch so the required command, URLs, and smoke-test query
              are easy to reference.
            </p>
          </div>
          <dl className="key-value-grid">
            <div className="key-value-card">
              <dt>Startup Command</dt>
              <dd><code>npm run dev</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Frontend URL</dt>
              <dd><code>http://127.0.0.1:5173</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Backend API URL</dt>
              <dd><code>http://127.0.0.1:3001</code></dd>
            </div>
            <div className="key-value-card">
              <dt>First Test Query</dt>
              <dd><code>SELECT DB_NAME() AS CurrentDatabase</code></dd>
            </div>
          </dl>
        </section>
      )}
      <section className="panel panel--full workspace-context" aria-labelledby="workspace-context-title">
        <div className="section-heading">
          <h2 id="workspace-context-title">Workspace Context</h2>
          <p className="message-muted">
            {mode === "student"
              ? "Student mode keeps the investigation flow front-and-center while preserving deterministic backend authority."
              : "Developer mode emphasizes startup and environment validation while preserving the same investigation flow."}
          </p>
        </div>
        <p className="message-muted">
          All panels below remain backend-integrated and presentation-only in both modes.
        </p>
      </section>
      <div className="app-grid">
        <HealthStatus />
        <SchemaExplorer />
        <SuspectVerificationPanel />
        <QueryRunner />
        <QueryHistoryPanel />
      </div>
    </main>
  );
}
