const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

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
        })
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
        })
      );

      assert.deepEqual(result.data.database, {
        status: "failed",
        isConnected: false,
        databaseName: null,
        serverName: null,
        message: "Database connection failed."
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
        })
      );

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
        }
      );

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
