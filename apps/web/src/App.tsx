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
      <div className="app-grid">
        <HealthStatus />
        <SchemaExplorer />
        <QueryRunner />
        <QueryHistoryPanel />
      </div>
    </main>
  );
}
