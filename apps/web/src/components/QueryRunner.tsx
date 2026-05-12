import { useEffect, useRef, useState, type FormEvent } from "react";
import { executeQuery } from "../api/client";
import type { QueryExecutionResponse, QueryRow } from "../api/types";
import {
  QUERY_SETUP_GUIDANCE,
  SAFE_SELECT_ONLY_GUIDANCE,
  shouldShowQuerySetupGuidance
} from "../guidance";
import { QueryResultsTable } from "./QueryResultsTable";

const DEVELOPER_DEFAULT_QUERY = "SELECT DB_NAME() AS CurrentDatabase";
const STUDENT_STARTER_QUERY = "SELECT * FROM CrimeType";

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

interface QueryRunnerProps {
  onExecutionComplete?: (payload: QueryRunnerExecutionPayload) => void;
  audience?: "student" | "developer";
  draftQuery?: string | null;
  restoredExecution?: QueryRunnerExecutionPayload | null;
  studentEvidencePrompt?: string | null;
  onStudentLogRow?: (row: QueryRow) => void;
}

export function QueryRunner({
  onExecutionComplete,
  audience = "developer",
  draftQuery,
  restoredExecution,
  studentEvidencePrompt,
  onStudentLogRow
}: QueryRunnerProps = {}): JSX.Element {
  const isStudentAudience = audience === "student";
  const [sql, setSql] = useState(
    draftQuery === undefined
      ? isStudentAudience
        ? STUDENT_STARTER_QUERY
        : DEVELOPER_DEFAULT_QUERY
      : draftQuery ?? ""
  );
  const [result, setResult] = useState<QueryExecutionResponse | null>(
    restoredExecution?.response ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(restoredExecution?.error ?? null);
  const responseRef = useRef<HTMLDivElement>(null);
  const sqlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldScrollToResponseRef = useRef(false);

  useEffect(() => {
    if (draftQuery !== undefined) {
      setSql(draftQuery ?? "");
    }
  }, [draftQuery]);

  useEffect(() => {
    if (!restoredExecution) {
      return;
    }

    setResult(restoredExecution.response);
    setError(restoredExecution.error);
  }, [restoredExecution]);

  useEffect(() => {
    const textarea = sqlTextareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [sql]);

  useEffect(() => {
    if (!isStudentAudience || (!result && !error) || !shouldScrollToResponseRef.current) {
      return;
    }

    shouldScrollToResponseRef.current = false;

    if (typeof responseRef.current?.scrollIntoView !== "function") {
      return;
    }

    responseRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [error, isStudentAudience, result]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    shouldScrollToResponseRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await executeQuery(sql);
      setResult(response);
      onExecutionComplete?.({
        sql,
        response,
        error: null
      });
    } catch (submitError) {
      setResult(null);
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Query execution failure.";
      setError(errorMessage);
      onExecutionComplete?.({
        sql,
        response: null,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`panel panel--full ${isStudentAudience ? "query-runner--student" : ""}`}
      aria-labelledby="query-runner-title"
    >
      <div className="section-heading">
        <h2 id="query-runner-title">Query Runner</h2>
        <p className="message-muted">
          {isStudentAudience
            ? "Run Samuel's lead, inspect the evidence, and decide what the next query should prove."
            : "Enter SQL below, submit it to the backend, and review the backend response without any frontend SQL validation."}
        </p>
      </div>
      <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
        {!isStudentAudience ? (
          <div className="callout-list" aria-label="Query runner guidance">
            <p>Enter SQL in the textarea below.</p>
            <p>The backend validates SQL before execution.</p>
            <p>{SAFE_SELECT_ONLY_GUIDANCE}</p>
            <p><strong>Run Query</strong> submits the request to the backend.</p>
          </div>
        ) : null}
        <label className="input-label" htmlFor="query-runner-sql">
          SQL Query
        </label>
        <textarea
          ref={sqlTextareaRef}
          id="query-runner-sql"
          aria-label="SQL query input"
          value={sql}
          onChange={(event) => setSql(event.target.value)}
        />
        <button type="submit" className="query-runner-submit" disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error ? (
        <div ref={responseRef} className="query-response-anchor">
          <p className="message-error">{error}</p>
          {shouldShowQuerySetupGuidance(error) ? (
            <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
          ) : null}
        </div>
      ) : null}
      {result ? (
        <div ref={responseRef} className="query-response">
          {!isStudentAudience ? (
            <dl className="key-value-grid key-value-grid--compact">
              <div className="key-value-card">
                <dt>Safety</dt>
                <dd>{result.safety.message}</dd>
              </div>
              <div className="key-value-card">
                <dt>Backend Message</dt>
                <dd>{result.message}</dd>
              </div>
              <div className="key-value-card">
                <dt>Execution Time</dt>
                <dd>{result.executionTimeMs} ms</dd>
              </div>
            </dl>
          ) : null}
          {!result.success && shouldShowQuerySetupGuidance(result.message) ? (
            <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
          ) : null}
          {result.safety.violations.length > 0 ? (
            <p className="message-error">
              Violations:{" "}
              {result.safety.violations.map((violation) => violation.message).join(", ")}
            </p>
          ) : null}
          {!result.safety.isAllowed ? (
            <p className="message-muted">{SAFE_SELECT_ONLY_GUIDANCE}</p>
          ) : null}
          {result.success ? (
            <QueryResultsTable
              result={result.data}
              audience={audience}
              studentEvidencePrompt={studentEvidencePrompt}
              onStudentLogRow={onStudentLogRow}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
