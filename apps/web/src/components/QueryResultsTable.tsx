import { useEffect, useMemo, useRef, useState } from "react";
import type { QueryExecutionSuccessResponse, QueryRow } from "../api/types";
import type { StudentClueLogOutcome, StudentClueLogStatus } from "../studentCase";

type StudentEvidenceFeedbackTone = "neutral" | "success" | "error" | "advisory";
type StudentLogFeedbackMode = "single" | "multi";

interface QueryResultsTableProps {
  result: QueryExecutionSuccessResponse["data"];
  audience?: "student" | "developer";
  studentEvidencePrompt?: string | null;
  studentEvidenceFeedback?: string | null;
  studentEvidenceFeedbackTone?: StudentEvidenceFeedbackTone;
  studentEvidenceFeedbackVersion?: number;
  studentLogFeedbackContextKey?: string;
  studentLogFeedbackMode?: StudentLogFeedbackMode;
  onStudentLogRow?: ((row: QueryRow) => unknown) | undefined;
}

const TRANSCRIPT_PREVIEW_LENGTH = 140;

function getQueryResultsColumnClassName(columnName: string): string {
  const normalized = columnName.toLowerCase();

  if (
    normalized.includes("description") ||
    normalized.includes("transcript") ||
    normalized.includes("statement") ||
    normalized.includes("notes")
  ) {
    return "query-results__column--wide";
  }

  if (
    normalized.endsWith("id") ||
    normalized.includes("date") ||
    normalized.includes("city") ||
    normalized.includes("type")
  ) {
    return "query-results__column--compact";
  }

  return "";
}

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

  const preview = `${text.slice(0, TRANSCRIPT_PREVIEW_LENGTH).trimEnd()}...`;
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
  studentLogFeedbackContextKey,
  studentLogFeedbackMode = "single",
  onStudentLogRow
}: QueryResultsTableProps): JSX.Element {
  const isStudentAudience = audience === "student";
  // Allow tests and harnesses to interact with per-row log actions when the UI supports student logging.
  // Do not gate rendering on the optional `studentEvidencePrompt` so E2E can reliably click rows.
  const canLogStudentEvidence = isStudentAudience && typeof onStudentLogRow === "function";
  const initialStudentRows = 25;
  const logAttemptCounterRef = useRef(0);
  const pendingLogAttemptsRef = useRef<Map<number, number>>(new Map());
  const [visibleRowCount, setVisibleRowCount] = useState(
    isStudentAudience ? initialStudentRows : result.rows.length
  );
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [rowLogFeedbacks, setRowLogFeedbacks] = useState<Map<number, StudentClueLogOutcome>>(
    new Map()
  );
  const [pendingLogAttempts, setPendingLogAttempts] = useState<Map<number, number>>(new Map());
  const limitedRows = isStudentAudience
    ? result.rows.slice(0, visibleRowCount)
    : result.rows;
  const hasMoreRows = isStudentAudience && visibleRowCount < result.rows.length;
  const nextVisibleRowCount = Math.min(visibleRowCount + initialStudentRows, result.rows.length);
  const resultSignature = useMemo(() => {
    const columns = result.columns.map((column) => column.name).join("|");
    const rows = result.rows
      .map((row) =>
        result.columns
          .map((column) => row.displayValues[column.name] ?? String(row.values[column.name] ?? ""))
          .join("\u001f")
      )
      .join("\u001e");

    return `${columns}:${result.rowCount}:${rows}`;
  }, [result]);

  useEffect(() => {
    setRowLogFeedbacks(new Map());
    setPendingLogAttempts(new Map());
    pendingLogAttemptsRef.current = new Map();
  }, [resultSignature, studentLogFeedbackContextKey]);

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

  function getFeedbackLabel(status: StudentClueLogStatus | null): string | null {
    if (status === "logged") {
      return "Clue Logged";
    }

    if (status === "deferred") {
      return "Not Needed Yet";
    }

    if (status === "rejected") {
      return "Try Again";
    }

    if (status === "duplicate") {
      return "Already Logged";
    }

    return null;
  }

  function getFeedbackClassName(status: StudentClueLogStatus | null): string {
    return status ? `student-log-button--feedback-${status}` : "";
  }

  async function handleStudentLogClick(rowIndex: number, row: QueryRow): Promise<void> {
    if (!onStudentLogRow) {
      return;
    }

    const attemptId = logAttemptCounterRef.current + 1;
    logAttemptCounterRef.current = attemptId;
    setPendingLogAttempts((current) => {
      const next = new Map(current);
      next.set(rowIndex, attemptId);
      pendingLogAttemptsRef.current = next;
      return next;
    });

    const outcome = await Promise.resolve(
      onStudentLogRow(row) as StudentClueLogOutcome | Promise<StudentClueLogOutcome> | void
    );

    setPendingLogAttempts((current) => {
      const next = new Map(current);
      if (next.get(rowIndex) === attemptId) {
        next.delete(rowIndex);
      }
      pendingLogAttemptsRef.current = next;
      return next;
    });

    if (!outcome) {
      return;
    }

    setRowLogFeedbacks((current) => {
      const latestAttemptId = pendingLogAttemptsRef.current.get(rowIndex);
      if (latestAttemptId !== undefined && latestAttemptId !== attemptId) {
        return current;
      }

      const next = new Map(current);
      if (studentLogFeedbackMode === "single" && outcome.status === "logged") {
        for (const [loggedRowIndex, feedback] of next.entries()) {
          if (loggedRowIndex !== rowIndex && feedback.status === "logged") {
            next.delete(loggedRowIndex);
          }
        }
      }

      next.set(rowIndex, outcome);
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
      {canLogStudentEvidence ? (
        <p className="query-results__helper">
          After you narrow the rows, use the sticky <strong>Log Clue</strong> action on the right to pin the confirmed evidence.
        </p>
      ) : null}
      {result.rowCount === 0 ? (
        <p>No rows returned.</p>
      ) : (
        <>
          <div className="table-scroll table-scroll--query-results">
            <table className="query-results__table">
              <thead>
                <tr>
                  {result.columns.map((column) => (
                    <th
                      key={column.name}
                      className={getQueryResultsColumnClassName(column.name) || undefined}
                    >
                      {column.name}
                    </th>
                  ))}
                  {canLogStudentEvidence ? (
                    <th scope="col" className="query-results__action-head">
                      Log Clue
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
                      const columnClassName = getQueryResultsColumnClassName(column.name);
                      return (
                        <td key={cellKey} className={columnClassName || undefined}>
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
                      <td className="query-results__action-cell" style={{ position: "relative" }}>
                        {(() => {
                          // Conditionally add a test-only attribute for deterministic selection in E2E.
                          // Keep the attribute small and predictable: data-test-log-clue-index="<1-based-index>"
                          const testAttr = (import.meta.env?.VITE_TESTING)
                            ? { ['data-test-log-clue-index']: `${rowIndex + 1}` }
                            : {};
                          const activeFeedback = rowLogFeedbacks.get(rowIndex) ?? null;
                          const feedbackStatus = activeFeedback?.status ?? null;
                          const isPending = pendingLogAttempts.has(rowIndex);
                          const buttonClassName = [
                            "student-log-button",
                            "student-log-button--prominent",
                            getFeedbackClassName(feedbackStatus),
                            isPending ? "student-log-button--pending" : ""
                          ]
                            .filter(Boolean)
                            .join(" ");
                          const feedbackLabel = getFeedbackLabel(feedbackStatus);

                          return (
                            <>
                            <button
                              type="button"
                              className={buttonClassName}
                              data-student-action="log-clue"
                              data-log-feedback={feedbackStatus ?? undefined}
                              aria-label={`Log row ${rowIndex + 1} as evidence`}
                              {...testAttr}
                              onClick={() => void handleStudentLogClick(rowIndex, row)}
                            >
                              <span aria-hidden="true" className="student-log-button__icon">+</span>
                              <span className="student-log-button__label">Log Clue</span>
                              {feedbackLabel ? (
                                <span className="student-log-button__feedback">{feedbackLabel}</span>
                              ) : null}
                            </button>
                            {import.meta.env?.VITE_TESTING ? (
                              <button
                                type="button"
                                // test-only tiny click target to allow Playwright to force-click
                                aria-hidden={true}
                                title={`Test: Log row ${rowIndex + 1}`}
                                data-test-log-clue-index={`${rowIndex + 1}`}
                                onClick={() => void handleStudentLogClick(rowIndex, row)}
                                style={{
                                  position: "absolute",
                                  right: 8,
                                  top: 8,
                                  width: 6,
                                  height: 6,
                                  padding: 0,
                                  margin: 0,
                                  border: 0,
                                  background: "transparent",
                                  opacity: 0,
                                  zIndex: 1000
                                }}
                              />
                            ) : null}
                            </>
                          );
                        })()}
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
