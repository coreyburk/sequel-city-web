import sql from "mssql";
import type { ConnectionPool, config as SqlConfig } from "mssql";
import { spawn } from "node:child_process";
import { getDatabaseConfig, getSqlServerConfig } from "../config/database.ts";
import { getSqlServerPool } from "../db/sqlServerPool.ts";
import {
  applyPendingDatabaseMigrations,
  type DatabaseMigrationStatus,
  getDatabaseMigrationStatus
} from "./databaseMigrationService.ts";
import {
  createMissingDatabaseIdentityResult,
  type DatabaseIdentityResult,
  validateDatabaseIdentity
} from "./databaseIdentityService.ts";

export interface DatabaseBootstrapResult {
  mode: DatabaseBootstrapMode;
  usedBootstrapCredentials: boolean;
  migrated: boolean;
  isReady: boolean;
  canApplyInApp: boolean;
  applyActionMessage: string | null;
  message: string;
  hasSchemaVersionTable: boolean;
  expectedMigrationKey: string | null;
  currentMigrationKey: string | null;
  pendingMigrationKeys: string[];
  identity: DatabaseIdentityResult;
}

export type DatabaseBootstrapMode = "verify" | "apply" | "enforce";

function isProductionEnvironment(): boolean {
  return (process.env.NODE_ENV?.trim().toLowerCase() ?? "") === "production";
}

export function getDatabaseBootstrapMode(
  value: string | undefined = process.env.SQLSERVER_BOOTSTRAP_MODE
): DatabaseBootstrapMode {
  if (!value) {
    const bootstrapUser = process.env.SQLSERVER_BOOTSTRAP_USER?.trim();
    const bootstrapPassword = process.env.SQLSERVER_BOOTSTRAP_PASSWORD;

    if (!isProductionEnvironment() && bootstrapUser && bootstrapPassword) {
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

function resolveEffectiveBootstrapMode(
  requestedMode: DatabaseBootstrapMode,
  bootstrapConfig: SqlConfig | null,
  wasModeExplicitlyConfigured: boolean
): DatabaseBootstrapMode {
  if (
    requestedMode === "verify" &&
    !wasModeExplicitlyConfigured &&
    !isProductionEnvironment() &&
    bootstrapConfig
  ) {
    return "apply";
  }

  return requestedMode;
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
  canUseIntegratedBootstrap: () => boolean;
  runIntegratedBootstrapProvisioning: () => Promise<void>;
  withBootstrapConnection: <T>(
    connectionConfig: SqlConfig,
    action: (pool: ConnectionPool) => Promise<T>
  ) => Promise<T>;
  applyPendingMigrations: (pool: ConnectionPool) => Promise<DatabaseMigrationStatus>;
  validateIdentity: (
    pool: ConnectionPool,
    migrationStatus: DatabaseMigrationStatus
  ) => Promise<DatabaseIdentityResult>;
}

export interface DatabaseBootstrapApplyResult {
  success: boolean;
  message: string;
  bootstrap: DatabaseBootstrapResult;
}

const DEFAULT_MANAGED_BOOTSTRAP_LOGIN = "sequel_bootstrap_user";
const DEFAULT_MANAGED_BOOTSTRAP_PASSWORD = "SQL-Bootstrap-PasSW0rd!";

function getManagedBootstrapLoginName(): string {
  return process.env.SQLSERVER_BOOTSTRAP_USER?.trim() || DEFAULT_MANAGED_BOOTSTRAP_LOGIN;
}

function getManagedBootstrapPassword(): string {
  return process.env.SQLSERVER_BOOTSTRAP_PASSWORD || DEFAULT_MANAGED_BOOTSTRAP_PASSWORD;
}

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

async function doesSqlLoginExist(pool: ConnectionPool, loginName: string): Promise<boolean> {
  const result = await pool
    .request()
    .input("loginName", sql.NVarChar, loginName)
    .query<{ loginExists: number }>(`
      SELECT CASE
        WHEN SUSER_ID(@loginName) IS NULL THEN 0
        ELSE 1
      END AS loginExists
    `);

  return result.recordset[0]?.loginExists === 1;
}

async function getManagedBootstrapConfigIfProvisioned(
  pool: ConnectionPool
): Promise<SqlConfig | null> {
  const managedBootstrapLogin = getManagedBootstrapLoginName();
  const managedBootstrapExists = await doesSqlLoginExist(pool, managedBootstrapLogin);

  if (!managedBootstrapExists) {
    return null;
  }

  return {
    ...getSqlServerConfig(),
    user: managedBootstrapLogin,
    password: getManagedBootstrapPassword()
  };
}

function buildManagedApplicationAccountsSql(): string {
  const databaseConfig = getDatabaseConfig();
  const runtimeLogin = databaseConfig.user?.trim() || "sequel_web_user";
  const runtimePassword = databaseConfig.password || "SQL-Web-PasSW0rd!";
  const managedBootstrapLogin = getManagedBootstrapLoginName();
  const managedBootstrapPassword = getManagedBootstrapPassword();
  const databaseName = databaseConfig.database;

  return `
    USE [master];

    IF NOT EXISTS (
      SELECT 1
      FROM sys.sql_logins
      WHERE name = N'${escapeSqlLiteral(runtimeLogin)}'
    )
    BEGIN
      CREATE LOGIN [${runtimeLogin}]
      WITH PASSWORD = N'${escapeSqlLiteral(runtimePassword)}';
    END;

    IF NOT EXISTS (
      SELECT 1
      FROM sys.sql_logins
      WHERE name = N'${escapeSqlLiteral(managedBootstrapLogin)}'
    )
    BEGIN
      CREATE LOGIN [${managedBootstrapLogin}]
      WITH PASSWORD = N'${escapeSqlLiteral(managedBootstrapPassword)}';
    END;

    USE [${databaseName}];

    IF DATABASE_PRINCIPAL_ID(N'${escapeSqlLiteral(runtimeLogin)}') IS NULL
    BEGIN
      CREATE USER [${runtimeLogin}]
      FOR LOGIN [${runtimeLogin}];
    END;

    IF NOT EXISTS (
      SELECT 1
      FROM sys.database_role_members AS drm
      INNER JOIN sys.database_principals AS rolePrincipal
        ON rolePrincipal.principal_id = drm.role_principal_id
      INNER JOIN sys.database_principals AS memberPrincipal
        ON memberPrincipal.principal_id = drm.member_principal_id
      WHERE rolePrincipal.name = N'db_datareader'
        AND memberPrincipal.name = N'${escapeSqlLiteral(runtimeLogin)}'
    )
    BEGIN
      ALTER ROLE [db_datareader]
      ADD MEMBER [${runtimeLogin}];
    END;

    IF DATABASE_PRINCIPAL_ID(N'${escapeSqlLiteral(managedBootstrapLogin)}') IS NULL
    BEGIN
      CREATE USER [${managedBootstrapLogin}]
      FOR LOGIN [${managedBootstrapLogin}];
    END;

    IF NOT EXISTS (
      SELECT 1
      FROM sys.database_role_members AS drm
      INNER JOIN sys.database_principals AS rolePrincipal
        ON rolePrincipal.principal_id = drm.role_principal_id
      INNER JOIN sys.database_principals AS memberPrincipal
        ON memberPrincipal.principal_id = drm.member_principal_id
      WHERE rolePrincipal.name = N'db_owner'
        AND memberPrincipal.name = N'${escapeSqlLiteral(managedBootstrapLogin)}'
    )
    BEGIN
      ALTER ROLE [db_owner]
      ADD MEMBER [${managedBootstrapLogin}];
    END;
  `;
}

async function ensureManagedApplicationAccounts(pool: ConnectionPool): Promise<void> {
  await pool.request().batch(buildManagedApplicationAccountsSql());
}

function canUseIntegratedBootstrap(): boolean {
  return process.platform === "win32";
}

function runPowerShellSqlBatch(sqlBatch: string): Promise<void> {
  if (!canUseIntegratedBootstrap()) {
    return Promise.reject(
      new Error(
        "Windows-integrated classroom bootstrap is only available on Windows hosts."
      )
    );
  }

  const databaseConfig = getDatabaseConfig();
  const trustServerCertificate = databaseConfig.trustServerCertificate ? "True" : "False";
  const command = `
$sql = [Console]::In.ReadToEnd()
$connectionString = "Server=${databaseConfig.host},${databaseConfig.port};Database=${databaseConfig.database};Integrated Security=True;TrustServerCertificate=${trustServerCertificate};"
$connection = New-Object System.Data.SqlClient.SqlConnection $connectionString
try {
  $connection.Open()
  $command = $connection.CreateCommand()
  $command.CommandTimeout = 120
  $command.CommandText = $sql
  $null = $command.ExecuteNonQuery()
}
finally {
  $connection.Dispose()
}
`.trim();

  return new Promise((resolve, reject) => {
    const child = spawn(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", command],
      {
        stdio: ["pipe", "pipe", "pipe"]
      }
    );

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          stderr.trim() ||
            "Windows-integrated classroom bootstrap failed while executing SQL Server setup."
        )
      );
    });

    child.stdin.write(sqlBatch);
    child.stdin.end();
  });
}

async function runIntegratedBootstrapProvisioning(): Promise<void> {
  await runPowerShellSqlBatch(buildManagedApplicationAccountsSql());
}

function createBootstrapResult(
  mode: DatabaseBootstrapMode,
  usedBootstrapCredentials: boolean,
  migrated: boolean,
  isReady: boolean,
  canApplyInApp: boolean,
  applyActionMessage: string | null,
  message: string,
  migrationStatus: Awaited<ReturnType<typeof getDatabaseMigrationStatus>>,
  identity: DatabaseIdentityResult
): DatabaseBootstrapResult {
  return {
    mode,
    usedBootstrapCredentials,
    migrated,
    isReady,
    canApplyInApp,
    applyActionMessage,
    message,
    hasSchemaVersionTable: migrationStatus.hasSchemaVersionTable,
    expectedMigrationKey: migrationStatus.expectedMigrationKey,
    currentMigrationKey: migrationStatus.currentMigrationKey,
    pendingMigrationKeys: migrationStatus.pendingMigrationKeys,
    identity
  };
}

const defaultDependencies: DatabaseBootstrapDependencies = {
  getApplicationPool: getSqlServerPool,
  getMigrationStatus: getDatabaseMigrationStatus,
  getBootstrapConfig: getBootstrapSqlServerConfig,
  canUseIntegratedBootstrap,
  runIntegratedBootstrapProvisioning,
  withBootstrapConnection: withConnection,
  applyPendingMigrations: applyPendingDatabaseMigrations,
  validateIdentity: validateDatabaseIdentity
};

function getApplyBlockedReason(
  bootstrapConfig: SqlConfig | null,
  integratedBootstrapAvailable: boolean,
  identity?: DatabaseIdentityResult
): string | null {
  if (identity?.status === "missing" || identity?.status === "invalid") {
    return identity.message;
  }

  if (bootstrapConfig || integratedBootstrapAvailable) {
    return null;
  }

  return "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.";
}

export async function ensureDatabaseBootstrapWithDependencies(
  dependencies: DatabaseBootstrapDependencies
): Promise<DatabaseBootstrapResult> {
  const wasModeExplicitlyConfigured = Boolean(process.env.SQLSERVER_BOOTSTRAP_MODE?.trim());
  const requestedMode = getDatabaseBootstrapMode();
  const integratedBootstrapAvailable = dependencies.canUseIntegratedBootstrap();
  let applicationPool: ConnectionPool;
  let automaticProvisioningFailure: string | null = null;

  try {
    applicationPool = await dependencies.getApplicationPool();
  } catch (error) {
    if (!integratedBootstrapAvailable || isProductionEnvironment()) {
      const identity = createMissingDatabaseIdentityResult(
        error instanceof Error ? error.message : undefined
      );
      return createBootstrapResult(
        requestedMode,
        false,
        false,
        false,
        false,
        identity.message,
        identity.message,
        {
          hasSchemaVersionTable: false,
          expectedMigrationKey: null,
          currentMigrationKey: null,
          appliedMigrationKeys: [],
          pendingMigrationKeys: []
        },
        identity
      );
    }

    try {
      await dependencies.runIntegratedBootstrapProvisioning();
      applicationPool = await dependencies.getApplicationPool();
    } catch (bootstrapError) {
      automaticProvisioningFailure =
        bootstrapError instanceof Error
          ? bootstrapError.message
          : "Windows-integrated classroom bootstrap failed before Sequel City could create its required SQL accounts.";
      try {
        applicationPool = await dependencies.getApplicationPool();
      } catch (connectionError) {
        const identity = createMissingDatabaseIdentityResult(
          connectionError instanceof Error
            ? connectionError.message
            : automaticProvisioningFailure
        );
        return createBootstrapResult(
          requestedMode,
          false,
          false,
          false,
          false,
          identity.message,
          identity.message,
          {
            hasSchemaVersionTable: false,
            expectedMigrationKey: null,
            currentMigrationKey: null,
            appliedMigrationKeys: [],
            pendingMigrationKeys: []
          },
          identity
        );
      }
    }
  }

  let migrationStatus = await dependencies.getMigrationStatus(applicationPool);
  let identity = await dependencies.validateIdentity(applicationPool, migrationStatus);
  let bootstrapConfig =
    dependencies.getBootstrapConfig() ??
    (await getManagedBootstrapConfigIfProvisioned(applicationPool));

  const shouldAutoProvisionManagedAccount =
    !bootstrapConfig &&
    integratedBootstrapAvailable &&
    !isProductionEnvironment() &&
    (requestedMode === "apply" || !wasModeExplicitlyConfigured);

  if (shouldAutoProvisionManagedAccount) {
    try {
      await dependencies.runIntegratedBootstrapProvisioning();
      bootstrapConfig =
        dependencies.getBootstrapConfig() ??
        (await getManagedBootstrapConfigIfProvisioned(applicationPool));
      migrationStatus = await dependencies.getMigrationStatus(applicationPool);
      identity = await dependencies.validateIdentity(applicationPool, migrationStatus);
    } catch (bootstrapError) {
      automaticProvisioningFailure =
        bootstrapError instanceof Error
          ? bootstrapError.message
          : "Windows-integrated classroom bootstrap failed before Sequel City could create its required SQL accounts.";
    }
  }

  const mode = resolveEffectiveBootstrapMode(
    requestedMode,
    bootstrapConfig,
    wasModeExplicitlyConfigured
  );
  const applyActionMessage =
    automaticProvisioningFailure ??
    getApplyBlockedReason(bootstrapConfig, integratedBootstrapAvailable, identity);
  const canApplyInApp = applyActionMessage === null;

  if (identity.status === "missing" || identity.status === "invalid") {
    return createBootstrapResult(
      mode,
      false,
      false,
      false,
      false,
      applyActionMessage,
      identity.message,
      migrationStatus,
      identity
    );
  }

  if (migrationStatus.pendingMigrationKeys.length === 0) {
    return createBootstrapResult(
      mode,
      false,
      false,
      true,
      canApplyInApp,
      applyActionMessage,
      "The case database is up to date and ready for suspect verification.",
      migrationStatus,
      identity
    );
  }

  if (mode === "verify") {
    const verifyModeMessage = canApplyInApp
      ? "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Open Admin Mode and use Apply Required Upgrade so Sequel City can finish setup on this machine."
      : "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.";

    return createBootstrapResult(
      mode,
      false,
      false,
      false,
      canApplyInApp,
      applyActionMessage,
      verifyModeMessage,
      migrationStatus,
      identity
    );
  }

  if (mode === "enforce") {
    throw new Error(
      "This server is configured to require the latest case-database version before startup. Apply the latest database scripts, or switch to SQLSERVER_BOOTSTRAP_MODE=apply with bootstrap admin credentials so startup can finish the upgrade automatically."
    );
  }

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
    true,
    null,
    "The case database was upgraded successfully and is ready for suspect verification.",
    appliedStatus,
    await dependencies.validateIdentity(applicationPool, appliedStatus)
  );
}

export async function ensureDatabaseBootstrap(): Promise<DatabaseBootstrapResult> {
  return ensureDatabaseBootstrapWithDependencies(defaultDependencies);
}

export async function applyDatabaseBootstrapUpgradeWithDependencies(
  dependencies: DatabaseBootstrapDependencies
): Promise<DatabaseBootstrapApplyResult> {
  let applicationPool: ConnectionPool;

  try {
    applicationPool = await dependencies.getApplicationPool();
  } catch (error) {
    const identity = createMissingDatabaseIdentityResult(
      error instanceof Error ? error.message : undefined
    );

    return {
      success: false,
      message: identity.message,
      bootstrap: createBootstrapResult(
        "apply",
        false,
        false,
        false,
        false,
        identity.message,
        identity.message,
        {
          hasSchemaVersionTable: false,
          expectedMigrationKey: null,
          currentMigrationKey: null,
          appliedMigrationKeys: [],
          pendingMigrationKeys: []
        },
        identity
      )
    };
  }

  const migrationStatus = await dependencies.getMigrationStatus(applicationPool);
  const identity = await dependencies.validateIdentity(applicationPool, migrationStatus);
  const configuredBootstrapConfig = dependencies.getBootstrapConfig();
  const integratedBootstrapAvailable = dependencies.canUseIntegratedBootstrap();
  const managedBootstrapConfig = configuredBootstrapConfig ??
    (await getManagedBootstrapConfigIfProvisioned(applicationPool));
  const bootstrapConfig = managedBootstrapConfig;
  const applyActionMessage = getApplyBlockedReason(
    bootstrapConfig,
    integratedBootstrapAvailable,
    identity
  );
  const canApplyInApp = applyActionMessage === null;

  if (identity.status === "missing" || identity.status === "invalid") {
    return {
      success: false,
      message: identity.message,
      bootstrap: createBootstrapResult(
        "apply",
        false,
        false,
        false,
        false,
        identity.message,
        identity.message,
        migrationStatus,
        identity
      )
    };
  }

  if (migrationStatus.pendingMigrationKeys.length === 0) {
    return {
      success: true,
      message: "The classroom database is already up to date.",
      bootstrap: createBootstrapResult(
        "apply",
        false,
        false,
        true,
        canApplyInApp,
        applyActionMessage,
        "The case database is up to date and ready for suspect verification.",
        migrationStatus,
        identity
      )
    };
  }

  if (!bootstrapConfig) {
    if (!integratedBootstrapAvailable) {
      return {
        success: false,
        message:
          applyActionMessage ??
          "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
        bootstrap: createBootstrapResult(
          "apply",
          false,
          false,
          false,
          false,
          applyActionMessage,
          "The case database still needs a one-time upgrade before suspect checks and the latest guided case flow are available.",
          migrationStatus,
          identity
        )
      };
    }
  }

  try {
    if (!bootstrapConfig) {
      await dependencies.runIntegratedBootstrapProvisioning();
    }

    const managedOrConfiguredBootstrapConfig =
      configuredBootstrapConfig ??
      (await getManagedBootstrapConfigIfProvisioned(applicationPool)) ??
      bootstrapConfig as SqlConfig;

    const appliedStatus = await dependencies.withBootstrapConnection(
      managedOrConfiguredBootstrapConfig,
      dependencies.applyPendingMigrations
    );
    const appliedIdentity = await dependencies.validateIdentity(applicationPool, appliedStatus);

    if (appliedStatus.pendingMigrationKeys.length > 0) {
      return {
        success: false,
        message:
          "The in-app classroom database upgrade ran, but required updates are still pending. Review SQL Server access and try again.",
        bootstrap: createBootstrapResult(
          "apply",
          true,
          true,
          false,
          true,
          null,
          "The case database still needs additional upgrades before Student Mode can continue.",
          appliedStatus,
          appliedIdentity
        )
      };
    }

    return {
      success: true,
      message:
        "Classroom database upgrade completed. Student Mode is ready for the latest guided case flow.",
      bootstrap: createBootstrapResult(
        "apply",
        true,
        true,
        true,
        true,
        null,
        "The case database was upgraded successfully and is ready for suspect verification.",
        appliedStatus,
        appliedIdentity
      )
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The in-app classroom database upgrade failed before the required migrations completed.",
      bootstrap: createBootstrapResult(
        "apply",
        true,
        false,
        false,
        true,
        null,
        "The case database still needs required upgrades before Student Mode can continue.",
        migrationStatus,
        identity
      )
    };
  }
}

export async function applyDatabaseBootstrapUpgrade(
): Promise<DatabaseBootstrapApplyResult> {
  return applyDatabaseBootstrapUpgradeWithDependencies(defaultDependencies);
}
