const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "verifySuspect trims suspect names and returns database verdict text",
    run: async () => {
      const caseVerificationService =
        require("./caseVerificationService.ts") as typeof import("./caseVerificationService");

      let receivedSuspect = "";

      const result = await caseVerificationService.verifySuspect(
        "  Ada Lovelace  ",
        async (suspect) => {
          receivedSuspect = suspect;
          return {
            Suspect: suspect,
            Verdict: "Database verdict"
          };
        }
      );

      assert.equal(receivedSuspect, "Ada Lovelace");
      assert.deepEqual(result, {
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
    name: "verifySuspect rejects empty suspect names before database verification",
    run: async () => {
      const caseVerificationService =
        require("./caseVerificationService.ts") as typeof import("./caseVerificationService");

      let callCount = 0;

      const result = await caseVerificationService.verifySuspect(
        "   ",
        async () => {
          callCount += 1;
          return {
            Suspect: "unused",
            Verdict: "unused"
          };
        }
      );

      assert.equal(callCount, 0);
      assert.deepEqual(result, {
        success: false,
        message: "Request body must include a non-empty string `suspect` field."
      });
    }
  },
  {
    name: "verifySuspect returns deterministic failure when no verdict is found",
    run: async () => {
      const caseVerificationService =
        require("./caseVerificationService.ts") as typeof import("./caseVerificationService");

      const result = await caseVerificationService.verifySuspect(
        "Ada Lovelace",
        async () => null
      );

      assert.deepEqual(result, {
        success: false,
        message:
          "Suspect verification failed. Verify the suspect name and database connection."
      });
    }
  },
  {
    name: "verifySuspect returns deterministic failure when database verification throws",
    run: async () => {
      const caseVerificationService =
        require("./caseVerificationService.ts") as typeof import("./caseVerificationService");

      const result = await caseVerificationService.verifySuspect(
        "Ada Lovelace",
        async () => {
          throw new Error("database unavailable");
        }
      );

      assert.deepEqual(result, {
        success: false,
        message:
          "Suspect verification failed. Verify the suspect name and database connection."
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
