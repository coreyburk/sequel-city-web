const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "route handler forwards SQL and explicit milestone evaluation payload",
    run: async () => {
      const queryRoutes =
        require("./queryRoutes.ts") as typeof import("./queryRoutes");

      let receivedSql = "";
      let receivedOptions:
        | import("../services/queryExecutionService").QueryExecutionOptions
        | undefined;
      let replyStatusCode = 200;

      const handler = queryRoutes.createQueryExecutionHandler(
        async (sql, _executeQuery, options) => {
          receivedSql = sql;
          receivedOptions = options;

          return {
            success: true,
            data: {
              columns: [],
              rows: [],
              rowCount: 0
            },
            safety: {
              isAllowed: true,
              normalizedStatementType: "SELECT",
              violations: [],
              message: "SQL statement is allowed."
            },
            executionTimeMs: 1,
            message: "Query executed successfully."
          };
        }
      );

      const response = await handler(
        {
          body: {
            sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
            caseMilestoneEvaluation: {
              caseId: "case-001",
              milestoneId: "case-001-clocktower-report-located",
              isSkeletonGateEnabled: true
            }
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(replyStatusCode, 200);
      assert.equal(receivedSql, "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080");
      assert.deepEqual(receivedOptions, {
        caseMilestoneEvaluation: {
          caseId: "case-001",
          milestoneId: "case-001-clocktower-report-located",
          isSkeletonGateEnabled: true
        }
      });
      assert.equal(response.success, true);
    }
  },
  {
    name: "route handler preserves malformed request behavior without forwarding payload",
    run: async () => {
      const queryRoutes =
        require("./queryRoutes.ts") as typeof import("./queryRoutes");

      let callCount = 0;
      let replyStatusCode = 200;
      const handler = queryRoutes.createQueryExecutionHandler(async () => {
        callCount += 1;
        throw new Error("executeSafeQuery should not be called");
      });

      const response = await handler(
        {
          body: {
            caseMilestoneEvaluation: {
              caseId: "case-001",
              milestoneId: "case-001-clocktower-report-located",
              isSkeletonGateEnabled: true
            }
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(callCount, 0);
      assert.equal(replyStatusCode, 400);
      assert.equal(response.success, false);
      assert.equal("caseMilestoneEvaluation" in response, false);
      assert.equal(
        response.message,
        "Request body must include a string `sql` field."
      );
    }
  },
  {
    name: "registered query route uses expected path and method",
    run: async () => {
      const queryRoutes =
        require("./queryRoutes.ts") as typeof import("./queryRoutes");

      let routePath = "";

      await queryRoutes.registerQueryRoutes(
        {
          post: (path: string) => {
            routePath = path;
          }
        } as never,
        () => async () => ({
          success: true,
          data: {
            columns: [],
            rows: [],
            rowCount: 0
          },
          safety: {
            isAllowed: true,
            normalizedStatementType: "SELECT",
            violations: [],
            message: "SQL statement is allowed."
          },
          executionTimeMs: 1,
          message: "Query executed successfully."
        })
      );

      assert.equal(routePath, "/api/query/execute");
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
