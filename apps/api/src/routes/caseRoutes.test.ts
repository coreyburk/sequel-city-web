const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "route handler delegates valid suspect submissions to the service",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let receivedSuspect = "";
      let replyStatusCode = 200;
      const handler = caseRoutes.createCaseVerificationHandler(async (suspect) => {
        receivedSuspect = suspect;
        return {
          success: true,
          data: {
            suspect,
            verdict: "Database verdict"
          },
          message: "Suspect verification completed."
        };
      });

      const response = await handler(
        {
          body: {
            suspect: "Ada Lovelace"
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(receivedSuspect, "Ada Lovelace");
      assert.equal(replyStatusCode, 200);
      assert.deepEqual(response, {
        success: true,
        data: {
          suspect: "Ada Lovelace",
          verdict: "Database verdict"
        },
        message: "Suspect verification completed."
      });
    }
  },
  {
    name: "route handler rejects missing suspect field with HTTP 400",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let callCount = 0;
      let replyStatusCode = 200;
      const handler = caseRoutes.createCaseVerificationHandler(async () => {
        callCount += 1;
        return {
          success: false,
          message: "unused"
        };
      });

      const response = await handler(
        {
          body: {}
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(callCount, 0);
      assert.equal(replyStatusCode, 400);
      assert.deepEqual(response, {
        success: false,
        message: "Request body must include a non-empty string `suspect` field."
      });
    }
  },
  {
    name: "route handler rejects empty suspect field with HTTP 400",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let replyStatusCode = 200;
      const handler = caseRoutes.createCaseVerificationHandler();

      const response = await handler(
        {
          body: {
            suspect: "   "
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(replyStatusCode, 400);
      assert.deepEqual(response, {
        success: false,
        message: "Request body must include a non-empty string `suspect` field."
      });
    }
  },
  {
    name: "route handler rejects non-string suspect field with HTTP 400",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let replyStatusCode = 200;
      const handler = caseRoutes.createCaseVerificationHandler();

      const response = await handler(
        {
          body: {
            suspect: 42 as unknown as string
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(replyStatusCode, 400);
      assert.deepEqual(response, {
        success: false,
        message: "Request body must include a non-empty string `suspect` field."
      });
    }
  },
  {
    name: "route handler maps service failure to HTTP 500",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let replyStatusCode = 200;
      const handler = caseRoutes.createCaseVerificationHandler(async () => ({
        success: false,
        message:
          "Suspect verification failed. Verify the suspect name and database connection."
      }));

      const response = await handler(
        {
          body: {
            suspect: "Ada Lovelace"
          }
        },
        {
          code: (statusCode: number) => {
            replyStatusCode = statusCode;
          }
        }
      );

      assert.equal(replyStatusCode, 500);
      assert.deepEqual(response, {
        success: false,
        message:
          "Suspect verification failed. Verify the suspect name and database connection."
      });
    }
  },
  {
    name: "registered route uses the expected path and method",
    run: async () => {
      const caseRoutes = require("./caseRoutes.ts") as typeof import("./caseRoutes");

      let routePath = "";

      await caseRoutes.registerCaseRoutes(
        {
          post: (path: string) => {
            routePath = path;
          }
        } as never,
        () => async () => ({
          success: true,
          data: {
            suspect: "Ada Lovelace",
            verdict: "Database verdict"
          },
          message: "Suspect verification completed."
        })
      );

      assert.equal(routePath, "/api/case/verify-suspect");
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
