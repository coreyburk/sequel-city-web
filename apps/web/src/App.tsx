import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";

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
      <section className="panel panel--full" aria-labelledby="first-run-guidance-title">
        <h2 id="first-run-guidance-title">First-Run Guidance</h2>
        <p>Start both services with <code>npm run dev</code> from the repository root.</p>
        <p>Frontend URL: <code>http://127.0.0.1:5173</code></p>
        <p>Backend API URL: <code>http://127.0.0.1:3001</code></p>
        <p>First test query: <code>SELECT DB_NAME() AS CurrentDatabase</code></p>
      </section>
      <div className="app-grid">
        <HealthStatus />
        <SchemaExplorer />
        <QueryRunner />
        <QueryHistoryPanel />
      </div>
    </main>
  );
}
