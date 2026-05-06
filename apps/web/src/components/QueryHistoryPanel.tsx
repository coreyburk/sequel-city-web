import { useEffect, useState } from "react";
import { getQueryHistory } from "../api/client";
import type { QueryHistoryRecord } from "../api/types";
import { EMPTY_QUERY_HISTORY_GUIDANCE } from "../guidance";

export function QueryHistoryPanel(): JSX.Element {
  const [records, setRecords] = useState<QueryHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory(isRefresh = false): Promise<void> {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getQueryHistory();
      setRecords(response.data.records);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "History load failure."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <section className="panel panel--full" aria-labelledby="query-history-title">
      <div className="history-toolbar">
        <h2 id="query-history-title">Query History</h2>
        <button type="button" onClick={() => void loadHistory(true)} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh History"}
        </button>
      </div>
      {loading ? <p className="message-muted">Loading query history...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {!loading && !error && records.length === 0 ? (
        <p>{EMPTY_QUERY_HISTORY_GUIDANCE}</p>
      ) : null}
      {records.length > 0 ? (
        <ul className="history-list">
          {records.map((record) => (
            <li key={record.id} className="history-record">
              <p>
                <strong>Timestamp:</strong> {record.timestamp}
              </p>
              <p>
                <strong>Outcome:</strong> {record.outcome}
              </p>
              <p>
                <strong>Query:</strong> {record.queryText}
              </p>
              <p>
                <strong>Row Count:</strong> {record.rowCount ?? "N/A"}
              </p>
              <p>
                <strong>Execution Time:</strong>{" "}
                {record.executionTimeMs !== null ? `${record.executionTimeMs} ms` : "N/A"}
              </p>
              <p>
                <strong>Error:</strong> {record.errorMessage ?? "None"}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
