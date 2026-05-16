import { useState } from "react";
import type { QueryExecutionSuccessResponse, QueryRow } from "../api/types";

interface QueryResultsTableProps {
  result: QueryExecutionSuccessResponse["data"];
  audience?: "student" | "developer";
  studentEvidencePrompt?: string | null;
  onStudentLogRow?: ((row: QueryRow) => void) | undefined;
}

const TRANSCRIPT_PREVIEW_LENGTH = 140;

interface TranscriptCellProps {
  text: string;
  cellKey: string;
  isExpanded: boolean;
  onToggle: (cellKey: string) => void;
}

function TranscriptCell({
  text,
  cellKey,
  isExpanded,
  onToggle
}: TranscriptCellProps): JSX.Element {
  if (text.length <= TRANSCRIPT_PREVIEW_LENGTH) {
    return <span className="transcript-cell__text">{text}</span>;
  }

  const preview = `${text.slice(0, TRANSCRIPT_PREVIEW_LENGTH).trimEnd()}…`;
  const regionId = `transcript-${cellKey}`;

  return (
    <div className="transcript-cell">
      <span
        id={regionId}
        className="transcript-cell__text"
      >
        {isExpanded ? text : preview}
      </span>
      <button
        type="button"
        className="transcript-cell__toggle"
        aria-expanded={isExpanded}
        aria-controls={regionId}
        onClick={() => onToggle(cellKey)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

export function QueryResultsTable({
  result,
  audience = "developer",
  studentEvidencePrompt,
  onStudentLogRow
}: QueryResultsTableProps): JSX.Element {
  const isStudentAudience = audience === "student";
  const canLogStudentEvidence =
    isStudentAudience && Boolean(studentEvidencePrompt) && typeof onStudentLogRow === "function";
  const initialStudentRows = 25;
  const [visibleRowCount, setVisibleRowCount] = useState(
    isStudentAudience ? initialStudentRows : result.rows.length
  );
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const limitedRows = isStudentAudience
    ? result.rows.slice(0, visibleRowCount)
    : result.rows;
  const hasMoreRows = isStudentAudience && visibleRowCount < result.rows.length;
  const nextVisibleRowCount = Math.min(visibleRowCount + initialStudentRows, result.rows.length);

  function toggleCell(cellKey: string): void {
    setExpandedCells((current) => {
      const next = new Set(current);
      if (next.has(cellKey)) {
        next.delete(cellKey);
      } else {
        next.add(cellKey);
      }
      return next;
    });
  }

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
          <div className="table-scroll">
            <table className="query-results__table">
              <thead>
                <tr>
                  {result.columns.map((column) => (
                    <th key={column.name}>{column.name}</th>
                  ))}
                  {canLogStudentEvidence ? (
                    <th scope="col" className="query-results__action-head">
                      <span className="visually-hidden">Log clue</span>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {limitedRows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {result.columns.map((column) => {
                      const cellKey = `${rowIndex}-${column.name}`;
                      const value = row.displayValues[column.name] ?? "";
                      return (
                        <td key={cellKey}>
                          <TranscriptCell
                            text={value}
                            cellKey={cellKey}
                            isExpanded={expandedCells.has(cellKey)}
                            onToggle={toggleCell}
                          />
                        </td>
                      );
                    })}
                    {canLogStudentEvidence ? (
                      <td className="query-results__action-cell">
                        <button
                          type="button"
                          className="student-log-button student-log-button--compact"
                          aria-label={`Log row ${rowIndex + 1} as evidence`}
                          onClick={() => {
                            onStudentLogRow?.(row);
                          }}
                        >
                          <span aria-hidden="true" className="student-log-button__icon">+</span>
                          <span className="student-log-button__label">Log Clue</span>
                        </button>
                      </td>
                    ) : null}
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
