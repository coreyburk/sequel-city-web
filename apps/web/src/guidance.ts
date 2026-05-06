export const BACKEND_UNAVAILABLE_GUIDANCE =
  "Backend unavailable. Confirm the API is running at http://127.0.0.1:3001 or start both services with npm run dev from the repository root.";

export const DATABASE_UNAVAILABLE_GUIDANCE =
  "Database unavailable. Confirm SQL Server is running, TCP/IP is enabled, port 1433 is listening, and apps/api/.env is configured.";

export const SCHEMA_UNAVAILABLE_GUIDANCE =
  "Schema could not be loaded. Confirm the backend is running and the database connection is healthy.";

export const EMPTY_QUERY_HISTORY_GUIDANCE =
  "No query history yet. Run a safe SELECT query to create the first history entry.";

export const SAFE_SELECT_ONLY_GUIDANCE =
  "Only safe read-only SELECT queries are allowed.";

export const QUERY_SETUP_GUIDANCE =
  "If the backend or database is unavailable, start both services with npm run dev from the repository root and confirm SQL Server plus apps/api/.env are configured.";

export function isBackendUnavailableMessage(message: string): boolean {
  return message.toLowerCase().includes("backend unavailable");
}

export function shouldShowQuerySetupGuidance(message: string): boolean {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("backend unavailable") ||
    normalizedMessage.includes("database connection") ||
    normalizedMessage.includes("failed to connect to 127.0.0.1:1433")
  );
}
