const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "empty SQL returns blocked execution result",
    run: async () => {
      const queryExecutionService =
        require("./queryExecutionService.ts") as typeof import("./queryExecutionService");
      const result = await queryExecutionService.executeSafeQuery("   ");

      assert.equal(result.success, false);
      assert.equal(result.safety.isAllowed, false);
      assert.equal(result.safety.violations[0]?.code, "EMPTY_SQL");
      assert.equal("data" in result, false);
      assert.equal("rows" in result, false);
      assert.equal("columns" in result, false);
      assert.equal("rowCount" in result, false);
    }
  },
  {
    name: "DELETE statements are blocked without requiring a database connection",
    run: async () => {
      const queryExecutionService =
        require("./queryExecutionService.ts") as typeof import("./queryExecutionService");
      const result = await queryExecutionService.executeSafeQuery(
        "DELETE FROM PersonsOfInterest"
      );

      assert.equal(result.success, false);
      assert.equal(result.safety.isAllowed, false);
      assert.equal(result.safety.normalizedStatementType, "DELETE");
      assert.equal(result.safety.violations[0]?.code, "DISALLOWED_STATEMENT");
      assert.equal("data" in result, false);
      assert.equal("rows" in result, false);
      assert.equal("columns" in result, false);
      assert.equal("rowCount" in result, false);
    }
  },
  {
    name: "blocked SQL returns the safety result and blocked message",
    run: async () => {
      const queryExecutionService =
        require("./queryExecutionService.ts") as typeof import("./queryExecutionService");
      const result = await queryExecutionService.executeSafeQuery(
        "DELETE FROM PersonsOfInterest"
      );

      assert.equal(result.success, false);
      assert.equal(result.safety.isAllowed, false);
      assert.match(result.message, /^Query blocked:/);
    }
  },
  {
    name: "successful execution returns the normalized response shape under data",
    run: async () => {
      const queryExecutionService =
        require("./queryExecutionService.ts") as typeof import("./queryExecutionService");
      const occurredAt = new Date("2024-01-02T03:04:05.678Z");
      const recordset = [
        {
          suspectName: "Ada",
          clueCount: 3,
          isSolved: true,
          occurredAt,
          notes: null,
          payload: { area: "North Pier" }
        }
      ] as import("./queryResultNormalizer").QueryRecordset;

      recordset.columns = {
        suspectName: { name: "suspectName" },
        clueCount: { name: "clueCount" },
        isSolved: { name: "isSolved" },
        occurredAt: { name: "occurredAt" },
        notes: { name: "notes" },
        payload: { name: "payload" }
      };

      const result = await queryExecutionService.executeSafeQuery(
        "SELECT suspectName, clueCount, isSolved, occurredAt, notes, payload FROM CaseFiles",
        async () => recordset
      );

      assert.equal(result.success, true);
      assert.equal(result.safety.isAllowed, true);
      assert.ok("data" in result);
      assert.equal("columns" in result, false);
      assert.equal("rows" in result, false);
      assert.equal("rowCount" in result, false);
      assert.equal(result.data.rowCount, 1);
      assert.deepEqual(result.data.columns, [
        { name: "suspectName", ordinal: 0, dataType: "string" },
        { name: "clueCount", ordinal: 1, dataType: "number" },
        { name: "isSolved", ordinal: 2, dataType: "boolean" },
        { name: "occurredAt", ordinal: 3, dataType: "date" },
        { name: "notes", ordinal: 4, dataType: "null" },
        { name: "payload", ordinal: 5, dataType: "unknown" }
      ]);
      assert.deepEqual(result.data.rows, [
        {
          values: {
            suspectName: "Ada",
            clueCount: 3,
            isSolved: true,
            occurredAt: occurredAt.toISOString(),
            notes: null,
            payload: null
          },
          displayValues: {
            suspectName: "Ada",
            clueCount: "3",
            isSolved: "true",
            occurredAt: occurredAt.toISOString(),
            notes: "",
            payload: "[object Object]"
          }
        }
      ]);
      assert.equal(result.message, "Query executed successfully.");
    }
  },
  {
    name: "execution failures return success false",
    run: async () => {
      const queryExecutionService =
        require("./queryExecutionService.ts") as typeof import("./queryExecutionService");
      const result = await queryExecutionService.executeSafeQuery(
        "SELECT 1",
        async () => {
          throw new Error("boom");
        }
      );

      assert.equal(result.success, false);
      assert.equal(result.safety.isAllowed, true);
      assert.equal("data" in result, false);
      assert.equal("rows" in result, false);
      assert.equal("columns" in result, false);
      assert.equal("rowCount" in result, false);
      assert.equal(
        result.message,
        "Query execution failed. Verify the SQL and database connection."
      );
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
