const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "database health handler delegates to the database health service and returns the result unchanged",
    run: async () => {
      const healthRoutes =
        require("./healthRoutes.ts") as typeof import("./healthRoutes");

      let callCount = 0;
      const handler = healthRoutes.createDatabaseHealthHandler(async () => {
        callCount += 1;
        return {
          isConnected: true,
          databaseName: "SequelCityCrimesDB",
          serverName: "SEQUELCITY",
          message: "Database connection successful.",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        };
      });

      const response = await handler();

      assert.equal(callCount, 1);
      assert.deepEqual(response, {
        isConnected: true,
        databaseName: "SequelCityCrimesDB",
        serverName: "SEQUELCITY",
        message: "Database connection successful.",
        checkedAtUtc: "2026-05-05T00:00:00.000Z"
      });
    }
  },
  {
    name: "full health handler delegates to the diagnostic service and returns the expected response shape",
    run: async () => {
      const healthRoutes =
        require("./healthRoutes.ts") as typeof import("./healthRoutes");

      let callCount = 0;
      const handler = healthRoutes.createFullHealthHandler(async () => {
        callCount += 1;
        return {
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
              tableCount: 3,
              relationshipCount: 2,
              message: "Schema metadata loaded successfully."
            }
          }
        };
      });

      const response = await handler();

      assert.equal(callCount, 1);
      assert.deepEqual(response, {
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
            tableCount: 3,
            relationshipCount: 2,
            message: "Schema metadata loaded successfully."
          }
        }
      });
    }
  },
  {
    name: "registered health routes stay thin and preserve database route status behavior",
    run: async () => {
      const healthRoutes =
        require("./healthRoutes.ts") as typeof import("./healthRoutes");

      const registeredRoutes = new Map<
        string,
        (
          request: unknown,
          reply: { code: (statusCode: number) => void }
        ) => Promise<unknown>
      >();
      let databaseReplyStatusCode = 200;
      let fullReplyStatusCode = 200;

      await healthRoutes.registerHealthRoutes(
        {
          get: (
            path: string,
            handler: (
              request: unknown,
              reply: { code: (statusCode: number) => void }
            ) => Promise<unknown>
          ) => {
            registeredRoutes.set(path, handler);
          }
        } as never,
        () => async () => ({
          isConnected: false,
          databaseName: null,
          serverName: null,
          message: "Login failed for user",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        () => async () => ({
          success: true,
          data: {
            api: "ok",
            database: {
              status: "failed",
              isConnected: false,
              databaseName: null,
              serverName: null,
              message: "Database connection failed."
            },
            bootstrap: {
              mode: "verify",
              status: "degraded",
              migrated: false,
              usedBootstrapCredentials: false,
              message:
                "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
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
            },
            schema: {
              status: "ok",
              tableCount: 0,
              relationshipCount: 0,
              message: "Schema metadata loaded successfully."
            }
          }
        })
      );

      assert.deepEqual([...registeredRoutes.keys()], [
        "/api/health/database",
        "/api/health/full"
      ]);

      const databaseResponse = await registeredRoutes.get("/api/health/database")?.(
        {},
        {
          code: (statusCode: number) => {
            databaseReplyStatusCode = statusCode;
          }
        }
      );

      assert.equal(databaseReplyStatusCode, 503);
      assert.deepEqual(databaseResponse, {
        isConnected: false,
        databaseName: null,
        serverName: null,
        message: "Login failed for user",
        checkedAtUtc: "2026-05-05T00:00:00.000Z"
      });

      const fullResponse = await registeredRoutes.get("/api/health/full")?.(
        {},
        {
          code: (statusCode: number) => {
            fullReplyStatusCode = statusCode;
          }
        }
      );

      assert.equal(fullReplyStatusCode, 503);
      assert.deepEqual(fullResponse, {
        success: true,
        data: {
          api: "ok",
          database: {
            status: "failed",
            isConnected: false,
            databaseName: null,
            serverName: null,
            message: "Database connection failed."
          },
          bootstrap: {
            mode: "verify",
            status: "degraded",
            migrated: false,
            usedBootstrapCredentials: false,
            message:
              "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
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
          },
          schema: {
            status: "ok",
            tableCount: 0,
            relationshipCount: 0,
            message: "Schema metadata loaded successfully."
          }
        }
      });
    }
  },
  {
    name: "full health route returns 503 when bootstrap is degraded even if the database connection is healthy",
    run: async () => {
      const healthRoutes =
        require("./healthRoutes.ts") as typeof import("./healthRoutes");

      const registeredRoutes = new Map<
        string,
        (
          request: unknown,
          reply: { code: (statusCode: number) => void }
        ) => Promise<unknown>
      >();
      let fullReplyStatusCode = 200;

      await healthRoutes.registerHealthRoutes(
        {
          get: (
            path: string,
            handler: (
              request: unknown,
              reply: { code: (statusCode: number) => void }
            ) => Promise<unknown>
          ) => {
            registeredRoutes.set(path, handler);
          }
        } as never,
        () => async () => ({
          isConnected: true,
          databaseName: "SequelCityCrimesDB",
          serverName: "SEQUELCITY",
          message: "Database connection successful.",
          checkedAtUtc: "2026-05-05T00:00:00.000Z"
        }),
        () => async () => ({
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
              status: "degraded",
              migrated: false,
              usedBootstrapCredentials: false,
              message:
                "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
              hasSchemaVersionTable: false,
              expectedMigrationKey:
                "2026-05-21-005-create-case-verification-objects.sql",
              currentMigrationKey: null,
              pendingMigrationKeys: [
                "2026-05-21-001-create-case-answer-key-table.sql"
              ]
            },
            schema: {
              status: "ok",
              tableCount: 0,
              relationshipCount: 0,
              message: "Schema metadata loaded successfully."
            }
          }
        })
      );

      const fullResponse = await registeredRoutes.get("/api/health/full")?.(
        {},
        {
          code: (statusCode: number) => {
            fullReplyStatusCode = statusCode;
          }
        }
      );

      assert.equal(fullReplyStatusCode, 503);
      assert.deepEqual(fullResponse, {
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
            status: "degraded",
            migrated: false,
            usedBootstrapCredentials: false,
            message:
              "The case database needs a one-time upgrade before suspect checks and the latest guided case flow are available. Apply the latest database scripts, or restart with SQLSERVER_BOOTSTRAP_MODE=apply plus bootstrap admin credentials to finish setup automatically.",
            hasSchemaVersionTable: false,
            expectedMigrationKey:
              "2026-05-21-005-create-case-verification-objects.sql",
            currentMigrationKey: null,
            pendingMigrationKeys: [
              "2026-05-21-001-create-case-answer-key-table.sql"
            ]
          },
          schema: {
            status: "ok",
            tableCount: 0,
            relationshipCount: 0,
            message: "Schema metadata loaded successfully."
          }
        }
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

