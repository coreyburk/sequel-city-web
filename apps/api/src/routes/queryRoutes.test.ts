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
    name: "route handler returns Case 001 metadata for explicit enabled milestone opt-in",
    run: async () => {
      const queryRoutes =
        require("./queryRoutes.ts") as typeof import("./queryRoutes");
      const queryExecutionService =
        require("../services/queryExecutionService.ts") as typeof import("../services/queryExecutionService");

      const handler = queryRoutes.createQueryExecutionHandler(
        async (sql, _executeQuery, options) =>
          queryExecutionService.executeSafeQuery(
            sql,
            async () => createClocktowerReportRecordset(),
            options
          )
      );

      const response = await handler(
        {
          body: {
            sql: "SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080",
            caseMilestoneEvaluation: {
              caseId: "case-001",
              milestoneId: "case-001-clocktower-report-located",
              isSkeletonGateEnabled: true
            }
          }
        },
        {
          code: () => {
            // keep default status
          }
        }
      );

      assert.equal(response.success, true);
      assert.deepEqual(response.caseMilestoneEvaluation, {
        caseId: "case-001",
        milestoneId: "case-001-clocktower-report-located",
        evidenceTableFamily: "CrimeSceneReport",
        gate: {
          name: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
          enabledValue: "true",
          isEnabled: true
        },
        evaluated: true,
        matched: true,
        matchedRowCount: 1,
        runtimeStatus: "evaluated-no-progression",
        milestoneAdvanced: false
      });
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

function createClocktowerReportRecordset(): import("../services/queryResultNormalizer").QueryRecordset {
  const recordset = [
    {
      CrimeID: 1080,
      ReportDate: "2023-05-02",
      ReportCity: "Sequel City",
      ReportDescription:
        "Public clocktower ceremony report: civic official collapsed after a toast during the bell sequence; medical response noted suspected poisoning and clockroom access records held for timeline review."
    }
  ] as import("../services/queryResultNormalizer").QueryRecordset;

  recordset.columns = {
    CrimeID: { name: "CrimeID" },
    ReportDate: { name: "ReportDate" },
    ReportCity: { name: "ReportCity" },
    ReportDescription: { name: "ReportDescription" }
  };

  return recordset;
}
