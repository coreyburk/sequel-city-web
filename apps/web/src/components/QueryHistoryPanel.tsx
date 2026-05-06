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
        <div className="section-heading section-heading--compact">
          <h2 id="query-history-title">Query History</h2>
          <p className="message-muted">
            Review the recorded query outcome, text, row count, timing, and any backend error.
          </p>
        </div>
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
              <div className="history-record__header">
                <p className="history-record__timestamp">{record.timestamp}</p>
                <p className="history-record__outcome">
                  <strong>Outcome:</strong> {record.outcome}
                </p>
              </div>
              <p className="history-record__query">{record.queryText}</p>
              <dl className="history-record__details">
                <div>
                  <dt>Row Count</dt>
                  <dd>{record.rowCount ?? "N/A"}</dd>
                </div>
                <div>
                  <dt>Execution Time</dt>
                  <dd>{record.executionTimeMs !== null ? `${record.executionTimeMs} ms` : "N/A"}</dd>
                </div>
                <div>
                  <dt>Error</dt>
                  <dd>{record.errorMessage ?? "None"}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
