import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";

export default function App(): JSX.Element {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Sequel City Web Detective</h1>
        <p className="message-muted">
          First functional frontend shell for backend diagnostics, schema browsing,
          safe query execution, and query history.
        </p>
      </header>
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
