import type { Dispatch, SetStateAction } from "react";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "../../api/types";
import { QueryRunner } from "../QueryRunner";
import { KNOWN_CASE_FACTS } from "../../studentCase";
import type { EvidenceNotebookEntry } from "../../studentCase";
import { StudentSchemaTable } from "./StudentSchemaTable";

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

type StudentWorkbenchViewProps = {
  highlightedNotebookEntryId: string | null;
  notebookEntries: EvidenceNotebookEntry[];
  onQueryExecutionComplete: (payload: QueryRunnerExecutionPayload) => void;
  onStudentEvidenceLog: (row: QueryRow) => void;
  selectedStudentTable: string | null;
  selectedTableDetails: SchemaTable | null;
  setSelectedStudentTable: Dispatch<SetStateAction<string | null>>;
  shouldShowWitnessTrailGuide: boolean;
  studentDraftQuery: string | null;
  studentEvidencePrompt: string | null;
  studentFailureGuidance: string | null;
  studentInstruction: string | null;
  studentLastQueryExecution: QueryRunnerExecutionPayload | null;
  studentSchema: SchemaResponse | null;
  studentSchemaError: string | null;
  studentSchemaLoading: boolean;
  witnessBundleCount: number;
};

export function StudentWorkbenchView({
  highlightedNotebookEntryId,
  notebookEntries,
  onQueryExecutionComplete,
  onStudentEvidenceLog,
  selectedStudentTable,
  selectedTableDetails,
  setSelectedStudentTable,
  shouldShowWitnessTrailGuide,
  studentDraftQuery,
  studentEvidencePrompt,
  studentFailureGuidance,
  studentInstruction,
  studentLastQueryExecution,
  studentSchema,
  studentSchemaError,
  studentSchemaLoading,
  witnessBundleCount
}: StudentWorkbenchViewProps): JSX.Element {
  return (
    <section className="student-workspace student-workspace--focused" aria-label="Student Workbench">
      <div className="student-workspace__main">
        {shouldShowWitnessTrailGuide ? (
          <section className="panel student-investigation-brief" aria-label="Witness Trail Guide">
            <p className="samuel-briefing__prompt-title">Samuel&apos;s Next Lead</p>
            <h2>Witness trail guide</h2>
            {witnessBundleCount >= 2 ? (
              <>
                <p>
                  You have already logged both witness bundles. One step is left before Samuel advances.
                </p>
                <div className="investigation-brief-compact">
                  <p className="investigation-brief__label">One Step Left</p>
                  <p>
                    Open Evidence Board and add one short note saying those{" "}
                    <code className="investigation-brief__token">PersonID</code> values
                    should be used for the next person or address lookup.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p>
                  You found the key report row. Follow this order before Samuel advances.
                </p>
                <div className="investigation-brief-compact">
                  <p className="investigation-brief__label">Use These Report Clues</p>
                  <p>
                    The report says there were two witnesses: one lives at the last house on{" "}
                    <code className="investigation-brief__token">Northwestern Dr</code>, and
                    the second witness, <code className="investigation-brief__token">Annabel</code>,
                    lives somewhere on{" "}
                    <code className="investigation-brief__token">Franklin Ave</code>.
                  </p>
                  <ol className="investigation-brief-steps">
                    <li>
                      Query <code className="investigation-brief__token">InterviewLog</code>{" "}
                      with the <code className="investigation-brief__token">ReportID</code> from the report row.
                    </li>
                    <li>
                      Sort with <code className="investigation-brief__token">ORDER BY PersonID</code>{" "}
                      and find repeated <code className="investigation-brief__token">PersonID</code> witness rows.
                    </li>
                    <li>
                      Use <code className="investigation-brief__token">Log clue</code> once for
                      each repeated <code className="investigation-brief__token">PersonID</code> bundle.
                    </li>
                    <li>
                      Add one short Evidence Board note saying those{" "}
                      <code className="investigation-brief__token">PersonID</code> values should be used
                      for the next person or address lookup.
                    </li>
                  </ol>
                </div>
              </>
            )}
          </section>
        ) : null}
        <QueryRunner
          audience="student"
          onExecutionComplete={onQueryExecutionComplete}
          draftQuery={studentDraftQuery}
          restoredExecution={studentLastQueryExecution}
          studentInstruction={studentInstruction}
          studentFailureGuidance={studentFailureGuidance}
          studentEvidencePrompt={studentEvidencePrompt}
          onStudentLogRow={onStudentEvidenceLog}
        />
        <section className="student-support" aria-label="Student Support Sections">
          <details className="panel support-panel">
            <summary>Quick Table Clues</summary>
            <div className="support-panel__content schema-snapshot">
              <p className="message-muted">
                Open a table when you need a quick reminder about columns or keys.
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
                  {selectedTableDetails ? <StudentSchemaTable table={selectedTableDetails} /> : null}
                </div>
              ) : null}
            </div>
          </details>
          <details className="panel support-panel">
            <summary>Case Facts</summary>
            <div className="support-panel__content">
              <ul className="known-case-facts-list story-recap__text">
                {KNOWN_CASE_FACTS.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
          </details>
        </section>
      </div>
      <aside className="student-workspace__rail" aria-label="Pinned Facts Snapshot">
        <section className="panel evidence-snapshot-card" aria-labelledby="evidence-snapshot-title">
          <div className="section-heading section-heading--compact">
            <h2 id="evidence-snapshot-title">Pinned Facts</h2>
          </div>
          {notebookEntries.length > 0 ? (
            <ul className="evidence-snapshot-list">
              {notebookEntries.map((entry) => (
                <li
                  key={entry.id}
                  className={
                    entry.id === highlightedNotebookEntryId
                      ? "notebook-entry--highlighted"
                      : undefined
                  }
                >
                  <span>{entry.detail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="message-muted">
              No facts pinned yet. Run Samuel&apos;s opening query and log the clue that matters.
            </p>
          )}
        </section>
      </aside>
    </section>
  );
}
