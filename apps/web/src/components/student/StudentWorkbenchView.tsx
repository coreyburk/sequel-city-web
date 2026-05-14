import { useState, type Dispatch, type SetStateAction } from "react";
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
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceView, setReferenceView] = useState<"tables" | "facts">("tables");

  return (
    <section className="student-workspace student-workspace--focused" aria-label="Student Workbench">
      <aside
        className={`student-reference-drawer ${isReferenceOpen ? "student-reference-drawer--open" : ""}`}
        aria-label="Query Lab Reference Drawer"
      >
        <button
          type="button"
          className="student-reference-drawer__toggle"
          aria-expanded={isReferenceOpen}
          onClick={() => setIsReferenceOpen((current) => !current)}
      >
          Case File
        </button>
        {isReferenceOpen ? (
          <div className="student-reference-drawer__panel">
            <div className="student-reference-drawer__header">
              <p className="samuel-briefing__prompt-title">Query Lab Reference</p>
              <div className="student-reference-drawer__tabs" role="tablist" aria-label="Reference Views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={referenceView === "tables"}
                  className={referenceView === "tables" ? "is-active" : undefined}
                  onClick={() => setReferenceView("tables")}
                >
                  Quick Table Clues
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={referenceView === "facts"}
                  className={referenceView === "facts" ? "is-active" : undefined}
                  onClick={() => setReferenceView("facts")}
                >
                  Case Facts
                </button>
              </div>
            </div>
            {referenceView === "tables" ? (
              <section className="student-reference-drawer__content schema-snapshot" aria-label="Quick Table Clues">
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
              </section>
            ) : (
              <section className="student-reference-drawer__content" aria-label="Case Facts">
                <ul className="known-case-facts-list story-recap__text">
                  {KNOWN_CASE_FACTS.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : null}
      </aside>
      <div className="student-workspace__main">
        {shouldShowWitnessTrailGuide ? (
          <section className="panel student-investigation-brief" aria-label="Samuel's Witness Notes">
            <p className="samuel-briefing__prompt-title">Samuel&apos;s Field Note</p>
            <h2>Witness trail</h2>
            {witnessBundleCount >= 2 ? (
              <>
                <p>
                  You logged both witness bundles. Samuel needs one notebook note before opening the next lead.
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
                  The report row gives two witness clues. Use them in this order before Samuel advances.
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
                      Use <code className="investigation-brief__token">Log Clue</code> once for
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
