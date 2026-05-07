import { useEffect, useState } from "react";
import { getSchemaTables } from "./api/client";
import type { QueryExecutionResponse, SchemaResponse, SchemaTable } from "./api/types";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";

type WorkspaceMode = "student" | "developer";
type MilestoneId =
  | "crime-type"
  | "crime-scene-filter"
  | "witness-clues"
  | "gym-chain"
  | "trigger-check"
  | "mastermind-trace";

type StoryBrief = {
  caseNumber: string;
  caseName: string;
  description: string;
};

const CASE_004_BRIEF: StoryBrief = {
  caseNumber: "004",
  caseName: "SELECT * FROM Suspects",
  description:
    "January 15th, 2023. A murder in Sequel City. Follow the evidence trail, test your leads, and identify both suspects."
};

type CaseMilestone = {
  id: MilestoneId;
  title: string;
  cluePrompt: string;
  matches: (sql: string) => boolean;
};

const CASE_004_MILESTONES: CaseMilestone[] = [
  {
    id: "crime-type",
    title: "Find the right crime records",
    cluePrompt: "Start with crime type and crime scene records to anchor the case.",
    matches: (sql) => sql.includes("from crimetype") || sql.includes("from crimescenereport")
  },
  {
    id: "crime-scene-filter",
    title: "Narrow the exact case report",
    cluePrompt: "Filter by city, date, and crime clues until one key report stands out.",
    matches: (sql) =>
      sql.includes("where") &&
      sql.includes("crimescenereport") &&
      (sql.includes("reportdate") || sql.includes("reportcity") || sql.includes("crimeid"))
  },
  {
    id: "witness-clues",
    title: "Follow the witness trail",
    cluePrompt: "Use interviews and address records to identify both witness leads.",
    matches: (sql) =>
      sql.includes("interviewlog") &&
      (sql.includes("personid") || sql.includes("reportid"))
  },
  {
    id: "gym-chain",
    title: "Track the gym lead",
    cluePrompt: "Connect membership, check-ins, and identity to advance the suspect trail.",
    matches: (sql) =>
      sql.includes("fitnflabclub") ||
      sql.includes("fitnflabclubcheckin") ||
      sql.includes("fitmemberid")
  },
  {
    id: "trigger-check",
    title: "Test your first suspect theory",
    cluePrompt: "Use the solution check pattern to validate your trigger-man hypothesis.",
    matches: (sql) => sql.includes("insert into solution") && sql.includes("jeremy")
  },
  {
    id: "mastermind-trace",
    title: "Uncover the mastermind",
    cluePrompt: "Cross-check events, vehicle clues, and money trail evidence to identify the mastermind.",
    matches: (sql) =>
      sql.includes("eventregistration") ||
      sql.includes("eventschedule") ||
      sql.includes("driverslicense") ||
      sql.includes("employment") ||
      (sql.includes("insert into solution") && sql.includes("miranda"))
  }
];

export default function App(): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const [studentSchema, setStudentSchema] = useState<SchemaResponse | null>(null);
  const [studentSchemaLoading, setStudentSchemaLoading] = useState(false);
  const [studentSchemaError, setStudentSchemaError] = useState<string | null>(null);
  const [selectedStudentTable, setSelectedStudentTable] = useState<string | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Record<MilestoneId, boolean>>({
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "trigger-check": false,
    "mastermind-trace": false
  });

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
  const remainingMilestones = CASE_004_MILESTONES.filter(
    (milestone) => !completedMilestones[milestone.id]
  );
  const activeLeads = remainingMilestones.slice(0, 3);
  const completedCount = CASE_004_MILESTONES.filter(
    (milestone) => completedMilestones[milestone.id]
  ).length;
  const progressRatio = completedCount / CASE_004_MILESTONES.length;
  const sceneClassName =
    progressRatio >= 1
      ? "noir-visual--final"
      : progressRatio >= 0.66
        ? "noir-visual--evidence"
        : progressRatio >= 0.33
          ? "noir-visual--audit"
          : "noir-visual--intro";
  const sceneCaption =
    progressRatio >= 1
      ? "Case closed. Evidence and suspect confirmations align."
      : progressRatio >= 0.66
        ? "The trail is narrowing. Cross-reference final evidence paths."
        : progressRatio >= 0.33
          ? "New leads unlocked. Keep following witness, gym, and vehicle clues."
          : "Midnight fog over Sequel City. The first clues are still hidden.";

  function normalizeSqlForMilestones(sql: string): string {
    return sql.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function handleQueryExecutionComplete(payload: {
    sql: string;
    response: QueryExecutionResponse | null;
    error: string | null;
  }): void {
    if (payload.error) {
      return;
    }

    const normalizedSql = normalizeSqlForMilestones(payload.sql);
    setCompletedMilestones((current) => {
      const updated = { ...current };

      for (const milestone of CASE_004_MILESTONES) {
        if (!updated[milestone.id] && milestone.matches(normalizedSql)) {
          updated[milestone.id] = true;
        }
      }

      return updated;
    });
  }

  return (
    <main className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}>
      <header className="app-header">
        <h1>Sequel City Case Files</h1>
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
              <dl className="story-card">
                <div>
                  <dt>Case #</dt>
                  <dd>{CASE_004_BRIEF.caseNumber}</dd>
                </div>
                <div>
                  <dt>Case Name</dt>
                  <dd>{CASE_004_BRIEF.caseName}</dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd className="story-card__description">{CASE_004_BRIEF.description}</dd>
                </div>
              </dl>
            </div>
            <div className="student-stage__visual" aria-label="Noir Scene Visual">
              <div className={`noir-visual ${sceneClassName}`}>
                <div className="noir-visual__moon" />
                <div className="noir-visual__detective" />
                <div className="noir-visual__scene" />
                <p>{sceneCaption}</p>
              </div>
            </div>
          </section>
          <section className="student-workbench" aria-label="Student Workbench">
            <QueryRunner
              audience="student"
              onExecutionComplete={handleQueryExecutionComplete}
            />
            <section className="panel case-progress" aria-labelledby="case-progress-title">
              <h2 id="case-progress-title">Detective&apos;s Case Notes</h2>
              <p className="message-muted">
                Completed milestones: {completedCount} / {CASE_004_MILESTONES.length}
              </p>
              {activeLeads.length > 0 ? (
                <div className="case-progress__next">
                  <p><strong>Available Leads:</strong></p>
                  <ul>
                    {activeLeads.map((lead) => (
                      <li key={lead.id}>{lead.cluePrompt}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="case-progress__next">
                  <strong>Available Leads:</strong> All milestones complete. Validate suspects in the solution table.
                </p>
              )}
              <ul className="milestone-list">
                {CASE_004_MILESTONES.map((milestone) => (
                  <li key={milestone.id}>
                    <span aria-hidden="true">
                      {completedMilestones[milestone.id] ? "✓" : "○"}
                    </span>
                    <span>{milestone.title}</span>
                  </li>
                ))}
              </ul>
            </section>
          </section>
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
