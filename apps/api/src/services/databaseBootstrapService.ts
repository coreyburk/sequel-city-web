import sql from "mssql";
import type { ConnectionPool, config as SqlConfig } from "mssql";
import { getDatabaseConfig, getSqlServerConfig } from "../config/database.ts";
import { getSqlServerPool } from "../db/sqlServerPool.ts";
import {
  applyPendingDatabaseMigrations,
  type DatabaseMigrationStatus,
  getDatabaseMigrationStatus
} from "./databaseMigrationService.ts";

export interface DatabaseBootstrapResult {
  mode: DatabaseBootstrapMode;
  usedBootstrapCredentials: boolean;
  migrated: boolean;
  isReady: boolean;
  message: string;
  hasSchemaVersionTable: boolean;
  expectedMigrationKey: string | null;
  currentMigrationKey: string | null;
  pendingMigrationKeys: string[];
}

export type DatabaseBootstrapMode = "verify" | "apply" | "enforce";

export function getDatabaseBootstrapMode(
  value: string | undefined = process.env.SQLSERVER_BOOTSTRAP_MODE
): DatabaseBootstrapMode {
  if (!value) {
    const bootstrapUser = process.env.SQLSERVER_BOOTSTRAP_USER?.trim();
    const bootstrapPassword = process.env.SQLSERVER_BOOTSTRAP_PASSWORD;
    const nodeEnvironment = process.env.NODE_ENV?.trim().toLowerCase() ?? "";
    const isProductionEnvironment = nodeEnvironment === "production";

    if (!isProductionEnvironment && bootstrapUser && bootstrapPassword) {
      return "apply";
    }

    return "verify";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "apply") {
    return "apply";
  }

  if (normalizedValue === "enforce") {
    return "enforce";
  }

  return "verify";
}

function getBootstrapSqlServerConfig(): SqlConfig | null {
  const bootstrapUser = process.env.SQLSERVER_BOOTSTRAP_USER?.trim();
  const bootstrapPassword = process.env.SQLSERVER_BOOTSTRAP_PASSWORD;

  if (bootstrapUser) {
    return {
      ...getSqlServerConfig(),
      user: bootstrapUser,
      password: bootstrapPassword
    };
  }

  const baseConfig = getDatabaseConfig();

  if (!baseConfig.user) {
    return getSqlServerConfig();
  }

  return null;
}

async function withConnection<T>(
  connectionConfig: SqlConfig,
  action: (pool: ConnectionPool) => Promise<T>
): Promise<T> {
  const pool = new sql.ConnectionPool(connectionConfig);
  await pool.connect();

  try {
    return await action(pool);
  } finally {
    await pool.close();
  }
}

export interface DatabaseBootstrapDependencies {
  getApplicationPool: () => Promise<ConnectionPool>;
  getMigrationStatus: (pool: ConnectionPool) => Promise<DatabaseMigrationStatus>;
  getBootstrapConfig: () => SqlConfig | null;
  withBootstrapConnection: <T>(
    connectionConfig: SqlConfig,
    action: (pool: ConnectionPool) => Promise<T>
  ) => Promise<T>;
  applyPendingMigrations: (pool: ConnectionPool) => Promise<DatabaseMigrationStatus>;
}

function createBootstrapResult(
  mode: DatabaseBootstrapMode,
  usedBootstrapCredentials: boolean,
  migrated: boolean,
  isReady: boolean,
  message: string,
  migrationStatus: Awaited<ReturnType<typeof getDatabaseMigrationStatus>>
): DatabaseBootstrapResult {
  return {
    mode,
    usedBootstrapCredentials,
    migrated,
    isReady,
    message,
    hasSchemaVersionTable: migrationStatus.hasSchemaVersionTable,
    expectedMigrationKey: migrationStatus.expectedMigrationKey,
    currentMigrationKey: migrationStatus.currentMigrationKey,
    pendingMigrationKeys: migrationStatus.pendingMigrationKeys
  };
}

const defaultDependencies: DatabaseBootstrapDependencies = {
  getApplicationPool: getSqlServerPool,
  getMigrationStatus: getDatabaseMigrationStatus,
  getBootstrapConfig: getBootstrapSqlServerConfig,
  withBootstrapConnection: withConnection,
  applyPendingMigrations: applyPendingDatabaseMigrations
};

export async function ensureDatabaseBootstrapWithDependencies(
  dependencies: DatabaseBootstrapDependencies
): Promise<DatabaseBootstrapResult> {
  const applicationPool = await dependencies.getApplicationPool();
  const mode = getDatabaseBootstrapMode();
  const migrationStatus = await dependencies.getMigrationStatus(applicationPool);

  if (migrationStatus.pendingMigrationKeys.length === 0) {
    return createBootstrapResult(
      mode,
      false,
      false,
      true,
      "The case database is up to date and ready for suspect verification.",
      migrationStatus
    );
  }

  if (mode === "verify") {
    return createBootstrapResult(
      mode,
      false,
      false,
      false,
      "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
      migrationStatus
    );
  }

  if (mode === "enforce") {
    throw new Error(
      "This server is configured to require the latest case-database version before startup. Apply the latest database scripts, or switch to SQLSERVER_BOOTSTRAP_MODE=apply with bootstrap admin credentials so startup can finish the upgrade automatically."
    );
  }

  const bootstrapConfig = dependencies.getBootstrapConfig();

  if (!bootstrapConfig) {
    throw new Error(
      "Automatic case-database upgrade was requested, but no bootstrap admin credentials were provided. Set SQLSERVER_BOOTSTRAP_USER and SQLSERVER_BOOTSTRAP_PASSWORD, or apply the latest database scripts manually."
    );
  }

  const appliedStatus = await dependencies.withBootstrapConnection(
    bootstrapConfig,
    dependencies.applyPendingMigrations
  );

  if (appliedStatus.pendingMigrationKeys.length > 0) {
    throw new Error(
      "Automatic case-database upgrade ran, but the database is still not at the required version. Review the SQL Server migration output and reapply the latest database scripts before continuing."
    );
  }

  return createBootstrapResult(
    mode,
    true,
    true,
    true,
    "The case database was upgraded successfully and is ready for suspect verification.",
    appliedStatus
  );
}

export async function ensureDatabaseBootstrap(): Promise<DatabaseBootstrapResult> {
  return ensureDatabaseBootstrapWithDependencies(defaultDependencies);
}
