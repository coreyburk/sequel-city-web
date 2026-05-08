import { useEffect, useState, type FormEvent } from "react";
import { executeQuery } from "../api/client";
import type { QueryExecutionResponse } from "../api/types";
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
  draftQuery?: string;
}

type StudentResultVisual = {
  className: string;
  caption: string;
};

export function QueryRunner({
  onExecutionComplete,
  audience = "developer",
  draftQuery
}: QueryRunnerProps = {}): JSX.Element {
  const isStudentAudience = audience === "student";
  const [sql, setSql] = useState(
    isStudentAudience ? STUDENT_STARTER_QUERY : DEVELOPER_DEFAULT_QUERY
  );
  const [result, setResult] = useState<QueryExecutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (draftQuery) {
      setSql(draftQuery);
    }
  }, [draftQuery]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
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

  const studentResultVisual = isStudentAudience && result ? getStudentResultVisual(result) : null;

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
          id="query-runner-sql"
          aria-label="SQL query input"
          value={sql}
          onChange={(event) => setSql(event.target.value)}
        />
        <button type="submit" className="query-runner-submit" disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error ? <p className="message-error">{error}</p> : null}
      {error && shouldShowQuerySetupGuidance(error) ? (
        <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
      ) : null}
      {result ? (
        <div className="query-response">
          {studentResultVisual ? (
            <div className={`result-visual-strip ${studentResultVisual.className}`} aria-label="Evidence Scene Visual">
              <span className="result-visual-strip__badge">Evidence Update</span>
              <p>{studentResultVisual.caption}</p>
            </div>
          ) : null}
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
          {result.success ? <QueryResultsTable result={result.data} audience={audience} /> : null}
        </div>
      ) : null}
    </section>
  );
}

function getStudentResultVisual(result: QueryExecutionResponse): StudentResultVisual {
  if (!result.success || !result.safety.isAllowed) {
    return {
      className: "result-visual-strip--blocked",
      caption: "Lead rejected. Re-check your statement and pursue a safer evidence trail."
    };
  }

  if (result.data.rowCount >= 250) {
    return {
      className: "result-visual-strip--archive",
      caption: "Archive vault unlocked. You pulled a high-volume dossier of records."
    };
  }

  if (result.data.rowCount >= 25) {
    return {
      className: "result-visual-strip--street",
      caption: "City grid expanded. New witness and movement patterns are surfacing."
    };
  }

  if (result.data.rowCount > 0) {
    return {
      className: "result-visual-strip--clue",
      caption: "Fresh clue logged. Cross-reference this lead with your case notes."
    };
  }

  return {
    className: "result-visual-strip--quiet",
    caption: "No trace found. Try a tighter filter or a different lead."
  };
}
