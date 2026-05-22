const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const readyBootstrap = {
  mode: "verify",
  usedBootstrapCredentials: false,
  migrated: false,
  isReady: true,
  canApplyInApp: false,
  applyActionMessage:
      "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
  message: "The case database is up to date and ready for suspect verification.",
  hasSchemaVersionTable: true,
  expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  pendingMigrationKeys: []
} as const;

const degradedBootstrap = {
  mode: "verify",
  usedBootstrapCredentials: false,
  migrated: false,
  isReady: false,
  canApplyInApp: false,
  applyActionMessage:
      "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
  message:
    "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Open Admin Mode and use Apply Required Upgrade so Sequel City can finish setup on this machine.",
  hasSchemaVersionTable: false,
  expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  currentMigrationKey: null,
  pendingMigrationKeys: [
    "2026-05-21-001-create-case-answer-key-table.sql",
    "2026-05-21-002-seed-case-answer-key-case-004.sql",
    "2026-05-21-003-add-case-answer-key-foreign-key.sql",
    "2026-05-21-004-create-solution-verifier-user.sql",
    "2026-05-21-005-create-case-verification-objects.sql"
  ]
} as const;

const migratedBootstrap = {
  mode: "apply",
  usedBootstrapCredentials: true,
  migrated: true,
  isReady: true,
  canApplyInApp: true,
  applyActionMessage: null,
  message: "The case database was upgraded successfully and is ready for suspect verification.",
  hasSchemaVersionTable: true,
  expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  pendingMigrationKeys: []
} as const;

const testCases: AsyncTestCase[] = [
  {
    name: "getBackendDiagnostics returns success shape when database health and schema metadata succeed",
    run: async () => {
      const databaseMetadataService =
        require("./databaseMetadataService.ts") as typeof import("./databaseMetadataService");

      const result = await databaseMetadataService.getBackendDiagnostics(
        async () => ({
          isConnected: true,
          databaseName: "SequelCityCrimesDB",
          serverName: "SEQUELCITY",
          message: "Database connection successful.",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        async () => ({
          success: true,
          data: {
            tables: [
              {
                schemaName: "dbo",
                tableName: "Cases",
                fullName: "dbo.Cases",
                columns: [],
                primaryKey: null
              },
              {
                schemaName: "dbo",
                tableName: "Suspects",
                fullName: "dbo.Suspects",
                columns: [],
                primaryKey: null
              }
            ],
            relationships: [
              {
                constraintName: "FK_Suspects_Cases",
                sourceSchema: "dbo",
                sourceTable: "Suspects",
                sourceColumn: "CaseId",
                targetSchema: "dbo",
                targetTable: "Cases",
                targetColumn: "CaseId"
              }
            ]
          }
        }),
        async () => readyBootstrap
      );

      assert.deepEqual(result, {
        success: true,
        data: {
          api: "ok",
          database: {
            status: "ok",
            isConnected: true,
            databaseName: "SequelCityCrimesDB",
            serverName: "SEQUELCITY",
            message: "Database connection successful."
          },
          bootstrap: {
            mode: "verify",
            status: "ready",
            migrated: false,
            usedBootstrapCredentials: false,
            canApplyInApp: false,
            applyActionMessage:
      "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
            message:
              "The case database is up to date and ready for suspect verification.",
            hasSchemaVersionTable: true,
            expectedMigrationKey:
              "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey:
              "2026-05-21-005-create-case-verification-objects.sql",
            pendingMigrationKeys: []
          },
          schema: {
            status: "ok",
            tableCount: 2,
            relationshipCount: 1,
            message: "Schema metadata loaded successfully."
          }
        }
      });
    }
  },
  {
    name: "getBackendDiagnostics represents database failure without exposing raw connection details",
    run: async () => {
      const databaseMetadataService =
        require("./databaseMetadataService.ts") as typeof import("./databaseMetadataService");

      const result = await databaseMetadataService.getBackendDiagnostics(
        async () => ({
          isConnected: false,
          databaseName: null,
          serverName: null,
          message: "Failed to connect to 127.0.0.1:1433",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        async () => ({
          success: true,
          data: {
            tables: [],
            relationships: []
          }
        }),
        async () => degradedBootstrap
      );

      assert.deepEqual(result.data.database, {
        status: "failed",
        isConnected: false,
        databaseName: null,
        serverName: null,
        message: "Database connection failed."
      });
      assert.deepEqual(result.data.bootstrap, {
        mode: "verify",
        status: "degraded",
        migrated: false,
        usedBootstrapCredentials: false,
        canApplyInApp: false,
        applyActionMessage:
      "Sequel City cannot complete the classroom upgrade automatically on this machine yet. A local Windows administrator must finish first-run SQL Server setup before Student Mode can continue.",
        message:
          "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Open Admin Mode and use Apply Required Upgrade so Sequel City can finish setup on this machine.",
        hasSchemaVersionTable: false,
        expectedMigrationKey:
          "2026-05-21-005-create-case-verification-objects.sql",
        currentMigrationKey: null,
        pendingMigrationKeys: [
          "2026-05-21-001-create-case-answer-key-table.sql",
          "2026-05-21-002-seed-case-answer-key-case-004.sql",
          "2026-05-21-003-add-case-answer-key-foreign-key.sql",
          "2026-05-21-004-create-solution-verifier-user.sql",
          "2026-05-21-005-create-case-verification-objects.sql"
        ]
      });
      assert.equal(result.data.schema.status, "ok");
    }
  },
  {
    name: "getBackendDiagnostics marks schema as failed when schema loader returns a failure response",
    run: async () => {
      const databaseMetadataService =
        require("./databaseMetadataService.ts") as typeof import("./databaseMetadataService");

      const result = await databaseMetadataService.getBackendDiagnostics(
        async () => ({
          isConnected: true,
          databaseName: "SequelCityCrimesDB",
          serverName: "SEQUELCITY",
          message: "Database connection successful.",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        async () => ({
          success: false,
          message: "unexpected internal detail"
        }),
        async () => migratedBootstrap
      );

      assert.equal(result.data.bootstrap.status, "ready");
      assert.deepEqual(result.data.schema, {
        status: "failed",
        tableCount: 0,
        relationshipCount: 0,
        message: "Schema metadata unavailable."
      });
    }
  },
  {
    name: "getBackendDiagnostics marks schema as failed when schema loader throws",
    run: async () => {
      const databaseMetadataService =
        require("./databaseMetadataService.ts") as typeof import("./databaseMetadataService");

      const result = await databaseMetadataService.getBackendDiagnostics(
        async () => ({
          isConnected: true,
          databaseName: "SequelCityCrimesDB",
          serverName: "SEQUELCITY",
          message: "Database connection successful.",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        async () => {
          throw new Error("driver object leaked");
        },
        async () => migratedBootstrap
      );

      assert.equal(result.data.bootstrap.status, "ready");
      assert.deepEqual(result.data.schema, {
        status: "failed",
        tableCount: 0,
        relationshipCount: 0,
        message: "Schema metadata unavailable."
      });
    }
  }
];

void runTests();

async function runTests(): Promise<void> {
  let failedCount = 0;

  for (const testCase of testCases) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failedCount += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(error);
    }
  }

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

