const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const sampleRecords: import("../types/queryHistory").QueryHistoryRecord[] = [
  {
    id: 2,
    timestamp: "2026-05-05T10:00:01.000Z",
    queryText: "SELECT 2",
    outcome: "success",
    rowCount: 1,
    executionTimeMs: 11,
    errorMessage: null
  },
  {
    id: 1,
    timestamp: "2026-05-05T10:00:00.000Z",
    queryText: "DELETE FROM Cases",
    outcome: "blocked",
    rowCount: null,
    executionTimeMs: 2,
    errorMessage: "DELETE statements are not allowed."
  }
];

const testCases: AsyncTestCase[] = [
  {
    name: "route handler delegates to query history service and returns the expected response shape",
    run: async () => {
      const queryHistoryRoutes =
        require("./queryHistoryRoutes.ts") as typeof import("./queryHistoryRoutes");

      let callCount = 0;
      const handler = queryHistoryRoutes.createQueryHistoryHandler(() => {
        callCount += 1;
        return {
          success: true,
          data: {
            records: sampleRecords
          }
        };
      });

      const response = await handler();

      assert.equal(callCount, 1);
      assert.deepEqual(response, {
        success: true,
        data: {
          records: sampleRecords
        }
      });
    }
  },
  {
    name: "route handler returns success false failure shape when history loading throws",
    run: async () => {
      const queryHistoryRoutes =
        require("./queryHistoryRoutes.ts") as typeof import("./queryHistoryRoutes");

      const handler = queryHistoryRoutes.createQueryHistoryHandler(() => {
        throw new Error("history unavailable");
      });

      const response = await handler();

      assert.deepEqual(response, {
        success: false,
        message: "history unavailable"
      });
    }
  },
  {
    name: "clear route handler delegates to service and returns deterministic cleared-count shape",
    run: async () => {
      const queryHistoryRoutes =
        require("./queryHistoryRoutes.ts") as typeof import("./queryHistoryRoutes");

      let callCount = 0;
      const handler = queryHistoryRoutes.createClearQueryHistoryHandler(() => {
        callCount += 1;
        return {
          success: true,
          data: {
            clearedCount: 2
          }
        };
      });

      const response = await handler();

      assert.equal(callCount, 1);
      assert.deepEqual(response, {
        success: true,
        data: {
          clearedCount: 2
        }
      });
    }
  },
  {
    name: "clear route handler returns success false failure shape when clear throws",
    run: async () => {
      const queryHistoryRoutes =
        require("./queryHistoryRoutes.ts") as typeof import("./queryHistoryRoutes");

      const handler = queryHistoryRoutes.createClearQueryHistoryHandler(() => {
        throw new Error("clear unavailable");
      });

      const response = await handler();

      assert.deepEqual(response, {
        success: false,
        message: "clear unavailable"
      });
    }
  },
  {
    name: "registered routes stay thin and set HTTP 500 for failures",
    run: async () => {
      const queryHistoryRoutes =
        require("./queryHistoryRoutes.ts") as typeof import("./queryHistoryRoutes");

      let getRoutePath = "";
      let deleteRoutePath = "";
      let capturedGetHandler:
        | ((request: unknown, reply: { code: (statusCode: number) => void }) => Promise<unknown>)
        | null = null;
      let capturedDeleteHandler:
        | ((request: unknown, reply: { code: (statusCode: number) => void }) => Promise<unknown>)
        | null = null;
      let getReplyStatusCode = 200;
      let deleteReplyStatusCode = 200;

      await queryHistoryRoutes.registerQueryHistoryRoutes(
        {
          get: (
            path: string,
            handler: (
              request: unknown,
            reply: { code: (statusCode: number) => void }
          ) => Promise<unknown>
          ) => {
            getRoutePath = path;
            capturedGetHandler = handler;
          },
          delete: (
            path: string,
            handler: (
              request: unknown,
              reply: { code: (statusCode: number) => void }
            ) => Promise<unknown>
          ) => {
            deleteRoutePath = path;
            capturedDeleteHandler = handler;
          }
        } as never,
        () => async () => ({
          success: false,
          message: "boom"
        }),
        () => async () => ({
          success: false,
          message: "clear boom"
        })
      );

      assert.equal(getRoutePath, "/api/query/history");
      assert.equal(deleteRoutePath, "/api/query/history");
      assert.notEqual(capturedGetHandler, null);
      assert.notEqual(capturedDeleteHandler, null);

      const getResponse = await capturedGetHandler?.({}, {
        code: (statusCode: number) => {
          getReplyStatusCode = statusCode;
        }
      });
      const deleteResponse = await capturedDeleteHandler?.({}, {
        code: (statusCode: number) => {
          deleteReplyStatusCode = statusCode;
        }
      });

      assert.equal(getReplyStatusCode, 500);
      assert.equal(deleteReplyStatusCode, 500);
      assert.deepEqual(getResponse, {
        success: false,
        message: "boom"
      });
      assert.deepEqual(deleteResponse, {
        success: false,
        message: "clear boom"
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
