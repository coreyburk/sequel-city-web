import { useState, type FormEvent } from "react";
import { executeQuery } from "../api/client";
import type { QueryExecutionResponse } from "../api/types";
import {
  QUERY_SETUP_GUIDANCE,
  SAFE_SELECT_ONLY_GUIDANCE,
  shouldShowQuerySetupGuidance
} from "../guidance";
import { QueryResultsTable } from "./QueryResultsTable";

const DEFAULT_QUERY = "SELECT DB_NAME() AS CurrentDatabase";

export function QueryRunner(): JSX.Element {
  const [sql, setSql] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState<QueryExecutionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await executeQuery(sql);
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Query execution failure."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel panel--full" aria-labelledby="query-runner-title">
      <div className="section-heading">
        <h2 id="query-runner-title">Query Runner</h2>
        <p className="message-muted">
          Enter SQL below, submit it to the backend, and review the backend response without any
          frontend SQL validation.
        </p>
      </div>
      <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
        <div className="callout-list" aria-label="Query runner guidance">
          <p>Enter SQL in the textarea below.</p>
          <p>The backend validates SQL before execution.</p>
          <p>{SAFE_SELECT_ONLY_GUIDANCE}</p>
          <p><strong>Run Query</strong> submits the request to the backend.</p>
        </div>
        <label className="input-label" htmlFor="query-runner-sql">
          SQL Query
        </label>
        <textarea
          id="query-runner-sql"
          aria-label="SQL query input"
          value={sql}
          onChange={(event) => setSql(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error ? <p className="message-error">{error}</p> : null}
      {error && shouldShowQuerySetupGuidance(error) ? (
        <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
      ) : null}
      {result ? (
        <div className="query-response">
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
          {result.success ? <QueryResultsTable result={result.data} /> : null}
        </div>
      ) : null}
    </section>
  );
}
