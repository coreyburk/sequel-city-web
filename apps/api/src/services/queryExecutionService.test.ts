const assert = require("node:assert/strict") as typeof import("node:assert/strict");
const queryExecutionService =
  require("./queryExecutionService.ts") as typeof import("./queryExecutionService");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "empty SQL returns blocked execution result",
    run: async () => {
      const result = await queryExecutionService.executeSafeQuery("   ");

      assert.equal(result.isExecuted, false);
      assert.equal(result.safety.isAllowed, false);
      assert.equal(result.safety.violations[0]?.code, "EMPTY_SQL");
      assert.deepEqual(result.rows, []);
      assert.deepEqual(result.columns, []);
      assert.equal(result.rowCount, 0);
    }
  },
  {
    name: "DELETE statements are blocked without requiring a database connection",
    run: async () => {
      const result = await queryExecutionService.executeSafeQuery(
        "DELETE FROM PersonsOfInterest"
      );

      assert.equal(result.isExecuted, false);
      assert.equal(result.safety.isAllowed, false);
      assert.equal(result.safety.normalizedStatementType, "DELETE");
      assert.equal(result.safety.violations[0]?.code, "DISALLOWED_STATEMENT");
      assert.deepEqual(result.rows, []);
      assert.deepEqual(result.columns, []);
      assert.equal(result.rowCount, 0);
    }
  },
  {
    name: "blocked SQL returns the safety result and blocked message",
    run: async () => {
      const result = await queryExecutionService.executeSafeQuery(
        "DELETE FROM PersonsOfInterest"
      );

      assert.equal(result.isExecuted, false);
      assert.equal(result.safety.isAllowed, false);
      assert.match(result.message, /^Query blocked:/);
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
  } else {
    console.log(
      "NOTE Safe SELECT execution is not covered here; it requires integration testing against a local SQL Server instance."
    );
  }
}
