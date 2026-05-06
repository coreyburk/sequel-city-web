import { useState, type FormEvent } from "react";
import { executeQuery } from "../api/client";
import type { QueryExecutionResponse } from "../api/types";
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
      <h2 id="query-runner-title">Query Runner</h2>
      <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
        <p className="message-muted">
          SQL is sent to the backend for validation and execution. The frontend does
          not run SQL locally.
        </p>
        <textarea
          aria-label="SQL query input"
          value={sql}
          onChange={(event) => setSql(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error ? <p className="message-error">{error}</p> : null}
      {result ? (
        <div>
          <p>
            <strong>Safety:</strong> {result.safety.message}
          </p>
          <p>
            <strong>Message:</strong> {result.message}
          </p>
          <p>
            <strong>Execution Time:</strong> {result.executionTimeMs} ms
          </p>
          {result.safety.violations.length > 0 ? (
            <p className="message-error">
              Violations:{" "}
              {result.safety.violations.map((violation) => violation.message).join(", ")}
            </p>
          ) : null}
          {result.success ? <QueryResultsTable result={result.data} /> : null}
        </div>
      ) : null}
    </section>
  );
}
