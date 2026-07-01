import { useEffect, useState } from "react";
import { applyDatabaseUpgrade, getFullHealth } from "../api/client";
import type { HealthFullResponse } from "../api/types";
import { DATABASE_UNAVAILABLE_GUIDANCE } from "../guidance";

interface HealthStatusProps {
  onUpgradeApplied?: () => Promise<void> | void;
}

export function HealthStatus({ onUpgradeApplied }: HealthStatusProps): JSX.Element {
  const [health, setHealth] = useState<HealthFullResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  async function loadHealth(active = true): Promise<void> {
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

  useEffect(() => {
    let active = true;

    void loadHealth();

    return () => {
      active = false;
    };
  }, []);

  async function handleApplyUpgrade(): Promise<void> {
    setUpgradeLoading(true);
    setUpgradeError(null);
    setUpgradeMessage(null);

    try {
      const response = await applyDatabaseUpgrade();
      setUpgradeMessage(response.message);
      await loadHealth(true);
      await onUpgradeApplied?.();
    } catch (applyError) {
      setUpgradeError(
        applyError instanceof Error
          ? applyError.message
          : "The classroom database upgrade could not be completed."
      );
    } finally {
      setUpgradeLoading(false);
    }
  }

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
              <span className="status-label">Bootstrap Status</span>
              <strong>{health.data.bootstrap.status}</strong>
              <span className="message-muted">{health.data.bootstrap.message}</span>
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
          {upgradeMessage ? (
            <p className="admin-upgrade-panel__success">{upgradeMessage}</p>
          ) : null}
          {upgradeError ? <p className="message-error">{upgradeError}</p> : null}
          {health.data.bootstrap.status === "degraded" ? (
            <section className="admin-upgrade-panel" aria-labelledby="admin-upgrade-title">
              <div className="section-heading section-heading--compact">
                <h3 id="admin-upgrade-title">Classroom Upgrade</h3>
                <p className="message-muted">
                  Bring the classroom database to the required version before students return to
                  Student Mode.
                </p>
              </div>
              {health.data.bootstrap.canApplyInApp ? (
                <>
                  <p className="admin-upgrade-panel__message">
                    Sequel Detective can finish the classroom upgrade from inside Admin Mode.
                    On first run, it will use the local Windows administrator authority on
                    this machine to create its own SQL accounts before applying the update.
                  </p>
                  <button
                    type="button"
                    className="samuel-briefing__button"
                    onClick={() => void handleApplyUpgrade()}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? "Applying Upgrade..." : "Apply Required Upgrade"}
                  </button>
                </>
              ) : (
                <p className="message-error">
                  {health.data.bootstrap.applyActionMessage ??
                    "This machine cannot complete the classroom upgrade automatically yet."}
                </p>
              )}
            </section>
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
              <dt>Bootstrap Mode</dt>
              <dd>{health.data.bootstrap.mode}</dd>
            </div>
            <div className="metadata-card">
              <dt>Expected Version</dt>
              <dd>{health.data.bootstrap.expectedMigrationKey ?? "Unavailable"}</dd>
            </div>
            <div className="metadata-card">
              <dt>Current Version</dt>
              <dd>{health.data.bootstrap.currentMigrationKey ?? "Not Applied"}</dd>
            </div>
            <div className="metadata-card">
              <dt>Pending Updates</dt>
              <dd>{health.data.bootstrap.pendingMigrationKeys.length}</dd>
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
