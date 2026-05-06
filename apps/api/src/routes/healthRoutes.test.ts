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
