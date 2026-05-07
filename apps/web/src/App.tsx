import { useEffect, useState } from "react";
import { getSchemaTables } from "./api/client";
import type { SchemaResponse, SchemaTable } from "./api/types";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";

type WorkspaceMode = "student" | "developer";

const STORY_BEATS = [
  "January 15th, 2023. A murder in Sequel City. The trail went cold.",
  "A fresh audit surfaced missing rows, strange witness gaps, and conflicting records.",
  "Your job: query the database, follow relationships, and build evidence-backed conclusions.",
  "When you are ready, interrogate your suspect in the solution table and confirm the verdict."
];

export default function App(): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const [storyBeatIndex, setStoryBeatIndex] = useState(0);
  const [studentSchema, setStudentSchema] = useState<SchemaResponse | null>(null);
  const [studentSchemaLoading, setStudentSchemaLoading] = useState(false);
  const [studentSchemaError, setStudentSchemaError] = useState<string | null>(null);
  const [selectedStudentTable, setSelectedStudentTable] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "student") {
      return;
    }

    let active = true;
    setStudentSchemaLoading(true);

    async function loadSchema(): Promise<void> {
      try {
        const response = await getSchemaTables();

        if (!active) {
          return;
        }

        setStudentSchema(response);
        setSelectedStudentTable((current) => current ?? response.data.tables[0]?.fullName ?? null);
        setStudentSchemaError(null);
      } catch {
        if (!active) {
          return;
        }

        setStudentSchema(null);
        setSelectedStudentTable(null);
        setStudentSchemaError("Schema is unavailable right now.");
      } finally {
        if (active) {
          setStudentSchemaLoading(false);
        }
      }
    }

    void loadSchema();

    return () => {
      active = false;
    };
  }, [mode]);

  const selectedTableDetails =
    studentSchema?.data.tables.find((table) => table.fullName === selectedStudentTable) ?? null;

  return (
    <main className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}>
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
        <>
          <section className="panel panel--full student-stage" aria-labelledby="student-stage-title">
            <div className="student-stage__story">
              <h2 id="student-stage-title">Story Narration</h2>
              <p className="student-story-text">{STORY_BEATS[storyBeatIndex]}</p>
              <div className="story-controls">
                <button
                  type="button"
                  onClick={() => setStoryBeatIndex((index) => Math.max(0, index - 1))}
                  disabled={storyBeatIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStoryBeatIndex((index) => Math.min(STORY_BEATS.length - 1, index + 1))
                  }
                  disabled={storyBeatIndex === STORY_BEATS.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="student-stage__visual" aria-label="Noir Scene Visual">
              <div className="noir-visual">
                <div className="noir-visual__moon" />
                <div className="noir-visual__detective" />
                <p>Sequel City never sleeps. Neither does the evidence.</p>
              </div>
            </div>
          </section>
          <QueryRunner />
          <section className="panel panel--full schema-snapshot" aria-labelledby="schema-snapshot-title">
            <h2 id="schema-snapshot-title">Schema Snapshot</h2>
            <p className="message-muted">
              Select a table name to view compact schema details.
            </p>
            {studentSchemaLoading ? <p className="message-muted">Loading schema snapshot...</p> : null}
            {studentSchemaError ? <p className="message-error">{studentSchemaError}</p> : null}
            {studentSchema ? (
              <div className="schema-snapshot__layout">
                <ul className="schema-pill-list">
                  {studentSchema.data.tables.map((table) => (
                    <li key={table.fullName}>
                      <button
                        type="button"
                        className="schema-link"
                        aria-pressed={selectedStudentTable === table.fullName}
                        onClick={() => setSelectedStudentTable(table.fullName)}
                      >
                        {table.fullName}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedTableDetails ? (
                  <StudentSchemaTable table={selectedTableDetails} />
                ) : null}
              </div>
            ) : null}
          </section>
        </>
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
      {mode === "developer" ? (
        <div className="app-grid">
          <HealthStatus />
          <SchemaExplorer />
          <SuspectVerificationPanel />
          <QueryRunner />
          <QueryHistoryPanel />
        </div>
      ) : null}
    </main>
  );
}

function StudentSchemaTable({ table }: { table: SchemaTable }): JSX.Element {
  return (
    <div className="schema-compact" aria-label="Selected Table Schema">
      <p className="schema-compact__name">{table.fullName}</p>
      <div className="table-scroll">
        <table className="schema-compact__table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>PK</th>
              <th>FK</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={`${table.fullName}.${column.columnName}`}>
                <td>{column.columnName}</td>
                <td>{column.dataType}</td>
                <td>{column.isPrimaryKey ? "Y" : "-"}</td>
                <td>{column.isForeignKey ? "Y" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
