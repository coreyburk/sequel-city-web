import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "../../api/types";
import type { ReinforcementSignal } from "../../features/queryReinforcement";
import type { SamuelReaction } from "../../features/samuelReactions";
import { QueryRunner, type QueryAssistRequest } from "../QueryRunner";
import { KNOWN_CASE_FACTS } from "../../studentCase";
import type { EvidenceNotebookEntry, StudentEvidenceFeedbackTone } from "../../studentCase";
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
  onStudentSqlEdit: () => void;
  selectedStudentTable: string | null;
  selectedTableDetails: SchemaTable | null;
  setSelectedStudentTable: Dispatch<SetStateAction<string | null>>;
  shouldShowWitnessTrailGuide: boolean;
  studentDraftQuery: string | null;
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  studentEvidencePrompt: string | null;
  studentFailureGuidance: string | null;
  studentInstruction: string | null;
  studentLastQueryExecution: QueryRunnerExecutionPayload | null;
  studentReinforcement: ReinforcementSignal | null;
  studentSamuelReaction: SamuelReaction | null;
  studentSchema: SchemaResponse | null;
  studentSchemaError: string | null;
  studentSchemaLoading: boolean;
};

type QueryAssistTokenProps = {
  label: string;
  insertion: string;
  onInsert: (text: string, label: string) => void;
};

function QueryAssistToken({
  label,
  insertion,
  onInsert
}: QueryAssistTokenProps): JSX.Element {
  return (
    <button
      type="button"
      className="investigation-brief__token investigation-brief__token--interactive"
      aria-label={`Add ${label} to query editor`}
      onClick={() => onInsert(insertion, label)}
    >
      {label}
    </button>
  );
}

function getPinnedFactAssistText(entry: EvidenceNotebookEntry): string | null {
  const crimeIdMatch = entry.detail.match(/^CrimeID\s*=\s*(.+)$/i);
  if (crimeIdMatch) {
    return `CrimeID = ${crimeIdMatch[1]}`;
  }

  const reportIdMatch = entry.detail.match(/^ReportID\s*=\s*(.+)$/i);
  if (reportIdMatch) {
    return `ReportID = ${reportIdMatch[1]}`;
  }

  const reportCityMatch = entry.detail.match(/^ReportCity\s*=\s*(.+)$/i);
  if (reportCityMatch) {
    const city = reportCityMatch[1].trim().replace(/^['"]|['"]$/g, "");
    return `ReportCity = '${city}'`;
  }

  const reportDateMatch = entry.detail.match(/^ReportDate\s*=\s*(.+)$/i);
  if (reportDateMatch) {
    return `ReportDate = '${reportDateMatch[1].trim()}'`;
  }

  const witnessPersonMatch = entry.detail.match(/^Witness PersonID\s*=\s*(.+)$/i);
  if (witnessPersonMatch) {
    return `PersonID = ${witnessPersonMatch[1]}`;
  }

  return null;
}

export function StudentWorkbenchView({
  highlightedNotebookEntryId,
  notebookEntries,
  onQueryExecutionComplete,
  onStudentEvidenceLog,
  onStudentSqlEdit,
  selectedStudentTable,
  selectedTableDetails,
  setSelectedStudentTable,
  shouldShowWitnessTrailGuide,
  studentDraftQuery,
  studentEvidenceFeedback,
  studentEvidenceFeedbackTone,
  studentEvidencePrompt,
  studentFailureGuidance,
  studentInstruction,
  studentLastQueryExecution,
  studentReinforcement,
  studentSamuelReaction,
  studentSchema,
  studentSchemaError,
  studentSchemaLoading
}: StudentWorkbenchViewProps): JSX.Element {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceView, setReferenceView] = useState<"tables" | "facts">("tables");
  const [queryAssistRequest, setQueryAssistRequest] = useState<QueryAssistRequest | null>(null);
  const queryAssistCounterRef = useRef(0);

  function queueQueryAssist(text: string, label: string): void {
    queryAssistCounterRef.current += 1;
    setQueryAssistRequest({
      id: `query-assist-${queryAssistCounterRef.current}`,
      text,
      sourceLabel: label
    });
  }

  return (
    <section
      className={`student-workspace student-workspace--focused ${
        isReferenceOpen ? "student-workspace--reference-open" : ""
      }`}
      aria-label="Student Workbench"
    >
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
              <div className="student-reference-drawer__heading-row">
                <p className="samuel-briefing__prompt-title">Query Lab Reference</p>
                <button
                  type="button"
                  className="student-reference-drawer__close"
                  aria-label="Close Case File"
                  onClick={() => setIsReferenceOpen(false)}
                >
                  Close
                </button>
              </div>
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
          <section
            className="panel student-investigation-brief"
            aria-label="Witness Clue Shortcuts"
          >
            <p className="samuel-briefing__prompt-title">Witness Clue Shortcuts</p>
            <p className="message-muted">
              Quick-insert tokens that support Samuel&apos;s direction above. Click any token to add it to the editor.
            </p>
            <div className="investigation-brief-compact">
              <p className="investigation-brief__label">Report Clues</p>
              <p>
                Two witness leads from the report — one at the last house on{" "}
                <QueryAssistToken
                  label="Northwestern Dr"
                  insertion="'Northwestern Dr'"
                  onInsert={queueQueryAssist}
                />, and{" "}
                <QueryAssistToken
                  label="Annabel"
                  insertion="'Annabel'"
                  onInsert={queueQueryAssist}
                />,
                somewhere on{" "}
                <QueryAssistToken
                  label="Franklin Ave"
                  insertion="'Franklin Ave'"
                  onInsert={queueQueryAssist}
                />.
              </p>
              <p className="investigation-brief__label">Query Tokens</p>
              <p>
                <QueryAssistToken
                  label="InterviewLog"
                  insertion="InterviewLog"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="ReportID"
                  insertion="ReportID"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="ORDER BY PersonID"
                  insertion="ORDER BY PersonID"
                  onInsert={queueQueryAssist}
                />{" "}
                <QueryAssistToken
                  label="PersonID"
                  insertion="PersonID"
                  onInsert={queueQueryAssist}
                />
              </p>
            </div>
          </section>
        ) : null}
        <QueryRunner
          audience="student"
          onExecutionComplete={onQueryExecutionComplete}
          onStudentSqlEdit={onStudentSqlEdit}
          draftQuery={studentDraftQuery}
          queryAssistRequest={queryAssistRequest}
          restoredExecution={studentLastQueryExecution}
          studentInstruction={studentInstruction}
          studentFailureGuidance={studentFailureGuidance}
          studentEvidencePrompt={studentEvidencePrompt}
          studentReinforcement={studentReinforcement}
          studentSamuelReaction={studentSamuelReaction}
          studentEvidenceFeedback={studentEvidenceFeedback}
          studentEvidenceFeedbackTone={studentEvidenceFeedbackTone}
          onStudentLogRow={onStudentEvidenceLog}
        />
      </div>
      <aside className="student-workspace__rail" aria-label="Pinned Facts Snapshot">
        <section className="panel evidence-snapshot-card" aria-labelledby="evidence-snapshot-title">
          <div className="section-heading section-heading--compact">
            <h2 id="evidence-snapshot-title">Pinned Facts</h2>
            <p className="message-muted">Facts you already proved. Click one to insert it.</p>
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
                  {getPinnedFactAssistText(entry) ? (
                    <button
                      type="button"
                      className="evidence-snapshot-button"
                      aria-label={`Add ${entry.detail} to query editor`}
                      onClick={() =>
                        queueQueryAssist(getPinnedFactAssistText(entry) ?? entry.detail, entry.detail)
                      }
                    >
                      <span>{entry.detail}</span>
                    </button>
                  ) : (
                    <span>{entry.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="message-muted">No facts pinned yet.</p>
          )}
        </section>
      </aside>
    </section>
  );
}
