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
      <h2 id="health-status-title">Health Status</h2>
      {loading ? <p className="message-muted">Loading health status...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {health ? (
        <>
          <ul className="status-list">
            <li>
              <strong>API:</strong> {health.data.api}
            </li>
            <li>
              <strong>Database:</strong> {health.data.database.status} (
              {health.data.database.message})
            </li>
            <li>
              <strong>Schema:</strong> {health.data.schema.status} (
              {health.data.schema.message})
            </li>
          </ul>
          {health.data.database.status === "failed" ? (
            <p className="message-error">{DATABASE_UNAVAILABLE_GUIDANCE}</p>
          ) : null}
          <dl className="metadata-list">
            <div>
              <strong>Database Name:</strong>{" "}
              <span>{health.data.database.databaseName ?? "Unavailable"}</span>
            </div>
            <div>
              <strong>Server Name:</strong>{" "}
              <span>{health.data.database.serverName ?? "Unavailable"}</span>
            </div>
            <div>
              <strong>Table Count:</strong>{" "}
              <span>{health.data.schema.tableCount}</span>
            </div>
            <div>
              <strong>Relationship Count:</strong>{" "}
              <span>{health.data.schema.relationshipCount}</span>
            </div>
          </dl>
        </>
      ) : null}
    </section>
  );
}
