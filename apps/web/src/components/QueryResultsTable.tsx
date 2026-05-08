import { useState } from "react";
import type { QueryExecutionSuccessResponse, QueryRow } from "../api/types";

interface QueryResultsTableProps {
  result: QueryExecutionSuccessResponse["data"];
  audience?: "student" | "developer";
  studentResultSummary?: string | null;
  studentEvidencePrompt?: string | null;
  studentEvidenceFeedback?: string | null;
  studentEvidenceFeedbackTone?: "neutral" | "success" | "error";
  onStudentLogRow?: ((row: QueryRow) => void) | undefined;
}

export function QueryResultsTable({
  result,
  audience = "developer",
  studentResultSummary,
  studentEvidencePrompt,
  studentEvidenceFeedback,
  studentEvidenceFeedbackTone = "neutral",
  onStudentLogRow
}: QueryResultsTableProps): JSX.Element {
  const isStudentAudience = audience === "student";
  const canLogStudentEvidence =
    isStudentAudience && Boolean(studentEvidencePrompt) && typeof onStudentLogRow === "function";
  const initialStudentRows = 25;
  const [visibleRowCount, setVisibleRowCount] = useState(
    isStudentAudience ? initialStudentRows : result.rows.length
  );
  const limitedRows = isStudentAudience
    ? result.rows.slice(0, visibleRowCount)
    : result.rows;
  const hasMoreRows = isStudentAudience && visibleRowCount < result.rows.length;
  const nextVisibleRowCount = Math.min(visibleRowCount + initialStudentRows, result.rows.length);

  return (
    <section className="query-results panel panel--subtle" aria-labelledby="query-results-title">
      <div className="section-heading section-heading--compact">
        <h3 id="query-results-title">Query Results</h3>
        <p className="message-muted">
          Rows returned: {result.rowCount}
          {isStudentAudience && result.rowCount > initialStudentRows
            ? ` (showing ${limitedRows.length})`
            : ""}
        </p>
      </div>
      {result.rowCount === 0 ? (
        <p>No rows returned.</p>
      ) : (
        <>
          {isStudentAudience ? (
            <div className="student-evidence-hud" aria-label="Evidence Desk">
              {studentResultSummary ? (
                <div className="student-evidence-hud__block">
                  <p className="student-evidence-hud__title">Evidence Update</p>
                  <p>{studentResultSummary}</p>
                </div>
              ) : null}
              {studentEvidenceFeedback ? (
                <div
                  className={`student-evidence-hud__block student-evidence-hud__block--${studentEvidenceFeedbackTone}`}
                >
                  <p className="student-evidence-hud__title">Clue Feedback</p>
                  <p>{studentEvidenceFeedback}</p>
                </div>
              ) : null}
              {canLogStudentEvidence ? (
                <div className="student-evidence-hud__block" aria-label="Evidence Notebook Prompt">
                  <p className="student-evidence-hud__title">Notebook Prompt</p>
                  <p>{studentEvidencePrompt}</p>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {canLogStudentEvidence ? <th>Notebook</th> : null}
                  {result.columns.map((column) => (
                    <th key={column.name}>{column.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {limitedRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {canLogStudentEvidence ? (
                      <td>
                        <button
                          type="button"
                          className="student-log-button"
                          onClick={() => onStudentLogRow?.(row)}
                        >
                          Log clue
                        </button>
                      </td>
                    ) : null}
                    {result.columns.map((column) => (
                      <td key={`${rowIndex}-${column.name}`}>
                        {row.displayValues[column.name] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMoreRows ? (
            <div className="results-expander">
              <button type="button" onClick={() => setVisibleRowCount(nextVisibleRowCount)}>
                Show 25 More
              </button>
              <button type="button" onClick={() => setVisibleRowCount(result.rows.length)}>
                Show All
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
