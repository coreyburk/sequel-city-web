import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ConnectionPool } from "mssql";

export interface DatabaseMigrationDefinition {
  key: string;
  absolutePath: string;
}

export interface DatabaseMigrationStatus {
  hasSchemaVersionTable: boolean;
  expectedMigrationKey: string | null;
  currentMigrationKey: string | null;
  appliedMigrationKeys: string[];
  pendingMigrationKeys: string[];
}

const migrationsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../database/migrations"
);

function sortMigrationDefinitions(
  left: DatabaseMigrationDefinition,
  right: DatabaseMigrationDefinition
): number {
  return left.key.localeCompare(right.key);
}

async function loadMigrationDefinitions(): Promise<DatabaseMigrationDefinition[]> {
  const entries = await readdir(migrationsDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".sql"))
    .map((entry) => ({
      key: entry.name,
      absolutePath: path.join(migrationsDirectory, entry.name)
    }))
    .sort(sortMigrationDefinitions);
}

async function readMigrationSql(absolutePath: string): Promise<string> {
  return readFile(absolutePath, "utf8");
}

export async function ensureSchemaVersionTable(pool: ConnectionPool): Promise<void> {
  await pool.request().batch(`
    IF OBJECT_ID(N'dbo.AppSchemaVersion', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.AppSchemaVersion
      (
        [MigrationKey] NVARCHAR(255) NOT NULL,
        [AppliedAtUtc] DATETIME2(0) NOT NULL
          CONSTRAINT DF_AppSchemaVersion_AppliedAtUtc DEFAULT SYSUTCDATETIME(),
        [AppliedBy] NVARCHAR(255) NOT NULL,
        [Notes] NVARCHAR(500) NULL,
        CONSTRAINT PK_AppSchemaVersion PRIMARY KEY ([MigrationKey])
      );
    END;
  `);
}

export async function getDatabaseMigrationStatus(
  pool: ConnectionPool
): Promise<DatabaseMigrationStatus> {
  const definitions = await loadMigrationDefinitions();
  const expectedMigrationKey = definitions.at(-1)?.key ?? null;

  const schemaVersionTableResult = await pool.request().query<{ hasSchemaVersionTable: number }>(`
    SELECT CASE
      WHEN OBJECT_ID(N'dbo.AppSchemaVersion', N'U') IS NOT NULL THEN 1
      ELSE 0
    END AS hasSchemaVersionTable
  `);

  const hasSchemaVersionTable =
    schemaVersionTableResult.recordset[0]?.hasSchemaVersionTable === 1;

  if (!hasSchemaVersionTable) {
    return {
      hasSchemaVersionTable: false,
      expectedMigrationKey,
      currentMigrationKey: null,
      appliedMigrationKeys: [],
      pendingMigrationKeys: definitions.map((definition) => definition.key)
    };
  }

  const appliedResult = await pool.request().query<{ MigrationKey: string }>(`
    SELECT MigrationKey
    FROM dbo.AppSchemaVersion
    ORDER BY MigrationKey
  `);

  const appliedMigrationKeys = appliedResult.recordset.map((row) => row.MigrationKey);
  const appliedMigrationKeySet = new Set(appliedMigrationKeys);
  const pendingMigrationKeys = definitions
    .map((definition) => definition.key)
    .filter((key) => !appliedMigrationKeySet.has(key));

  return {
    hasSchemaVersionTable: true,
    expectedMigrationKey,
    currentMigrationKey: appliedMigrationKeys.at(-1) ?? null,
    appliedMigrationKeys,
    pendingMigrationKeys
  };
}

export async function applyPendingDatabaseMigrations(
  pool: ConnectionPool
): Promise<DatabaseMigrationStatus> {
  await ensureSchemaVersionTable(pool);

  const definitions = await loadMigrationDefinitions();
  const initialStatus = await getDatabaseMigrationStatus(pool);
  const pendingKeys = new Set(initialStatus.pendingMigrationKeys);

  for (const definition of definitions) {
    if (!pendingKeys.has(definition.key)) {
      continue;
    }

    const sqlText = await readMigrationSql(definition.absolutePath);

    await pool.request().batch(sqlText);
    await pool.request().query(`
      INSERT INTO dbo.AppSchemaVersion (MigrationKey, AppliedBy, Notes)
      VALUES (
        N'${definition.key.replace(/'/g, "''")}',
        COALESCE(SUSER_SNAME(), USER_NAME()),
        N'Applied by API bootstrap migration runner.'
      )
    `);
  }

  return getDatabaseMigrationStatus(pool);
}
