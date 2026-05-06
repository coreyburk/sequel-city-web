import { useEffect, useState } from "react";
import { getFullHealth } from "../api/client";
import type { HealthFullResponse } from "../api/types";
import { DATABASE_UNAVAILABLE_GUIDANCE } from "../guidance";

export function HealthStatus(): JSX.Element {
  const [health, setHealth] = useState<HealthFullResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHealth(): Promise<void> {
      try {
        const response = await getFullHealth();

        if (!active) {
          return;
        }

        setHealth(response);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Backend unavailable."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="panel" aria-labelledby="health-status-title">
      <div className="section-heading">
        <h2 id="health-status-title">Health Status</h2>
        <p className="message-muted">
          Current backend, database, and schema readiness from the existing health API.
        </p>
      </div>
      {loading ? <p className="message-muted">Loading health status...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {health ? (
        <>
          <ul className="status-list status-list--cards">
            <li>
              <span className="status-label">API Status</span>
              <strong>{health.data.api}</strong>
            </li>
            <li>
              <span className="status-label">Database Status</span>
              <strong>{health.data.database.status}</strong>
              <span className="message-muted">{health.data.database.message}</span>
            </li>
            <li>
              <span className="status-label">Schema Status</span>
              <strong>{health.data.schema.status}</strong>
              <span className="message-muted">{health.data.schema.message}</span>
            </li>
          </ul>
          {health.data.database.status === "failed" ? (
            <p className="message-error">{DATABASE_UNAVAILABLE_GUIDANCE}</p>
          ) : null}
          <dl className="metadata-list metadata-list--grid">
            <div className="metadata-card">
              <dt>Database Name</dt>
              <dd>{health.data.database.databaseName ?? "Unavailable"}</dd>
            </div>
            <div className="metadata-card">
              <dt>Server Name</dt>
              <dd>{health.data.database.serverName ?? "Unavailable"}</dd>
            </div>
            <div className="metadata-card">
              <dt>Table Count</dt>
              <dd>{health.data.schema.tableCount}</dd>
            </div>
            <div className="metadata-card">
              <dt>Relationship Count</dt>
              <dd>{health.data.schema.relationshipCount}</dd>
            </div>
          </dl>
        </>
      ) : null}
    </section>
  );
}
