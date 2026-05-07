const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const testCases: AsyncTestCase[] = [
  {
    name: "record creation stores success, blocked, and failed outcomes with incrementing ids",
    run: async () => {
      const queryHistoryService =
        require("./queryHistoryService.ts") as typeof import("./queryHistoryService");

      const timestamps = [
        "2026-05-05T10:00:00.000Z",
        "2026-05-05T10:00:01.000Z",
        "2026-05-05T10:00:02.000Z"
      ];
      let timestampIndex = 0;

      const history = queryHistoryService.createQueryHistoryService(
        () => timestamps[timestampIndex++] as string
      );

      const successRecord = history.addRecord({
        queryText: "SELECT 1",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 12,
        errorMessage: null
      });
      const blockedRecord = history.addRecord({
        queryText: "DELETE FROM Cases",
        outcome: "blocked",
        rowCount: null,
        executionTimeMs: 2,
        errorMessage: "DELETE statements are not allowed."
      });
      const failedRecord = history.addRecord({
        queryText: "SELECT * FROM MissingTable",
        outcome: "failed",
        rowCount: null,
        executionTimeMs: null,
        errorMessage: "Invalid object name."
      });

      assert.deepEqual(successRecord, {
        id: 1,
        timestamp: "2026-05-05T10:00:00.000Z",
        queryText: "SELECT 1",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 12,
        errorMessage: null
      });
      assert.deepEqual(blockedRecord, {
        id: 2,
        timestamp: "2026-05-05T10:00:01.000Z",
        queryText: "DELETE FROM Cases",
        outcome: "blocked",
        rowCount: null,
        executionTimeMs: 2,
        errorMessage: "DELETE statements are not allowed."
      });
      assert.deepEqual(failedRecord, {
        id: 3,
        timestamp: "2026-05-05T10:00:02.000Z",
        queryText: "SELECT * FROM MissingTable",
        outcome: "failed",
        rowCount: null,
        executionTimeMs: null,
        errorMessage: "Invalid object name."
      });
    }
  },
  {
    name: "timestamps use ISO-8601 UTC strings by default",
    run: async () => {
      const queryHistoryService =
        require("./queryHistoryService.ts") as typeof import("./queryHistoryService");
      const history = queryHistoryService.createQueryHistoryService();

      const record = history.addRecord({
        queryText: "SELECT TOP 1 * FROM Cases",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 8,
        errorMessage: null
      });

      assert.match(
        record.timestamp,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    }
  },
  {
    name: "descending order retrieval returns newest records first without mutating stored records",
    run: async () => {
      const queryHistoryService =
        require("./queryHistoryService.ts") as typeof import("./queryHistoryService");

      const timestamps = [
        "2026-05-05T10:00:00.000Z",
        "2026-05-05T10:00:01.000Z",
        "2026-05-05T10:00:02.000Z"
      ];
      let timestampIndex = 0;

      const history = queryHistoryService.createQueryHistoryService(
        () => timestamps[timestampIndex++] as string
      );

      history.addRecord({
        queryText: "SELECT 1",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 10,
        errorMessage: null
      });
      history.addRecord({
        queryText: "SELECT 2",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 11,
        errorMessage: null
      });
      history.addRecord({
        queryText: "SELECT 3",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 12,
        errorMessage: null
      });

      const records = history.getRecords();

      assert.deepEqual(
        records.map((record: import("../types/queryHistory").QueryHistoryRecord) => record.id),
        [3, 2, 1]
      );

      records.shift();

      assert.deepEqual(
        history
          .getRecords()
          .map((record: import("../types/queryHistory").QueryHistoryRecord) => record.id),
        [3, 2, 1]
      );
    }
  },
  {
    name: "clear records returns cleared count, empties history, and resets ids",
    run: async () => {
      const queryHistoryService =
        require("./queryHistoryService.ts") as typeof import("./queryHistoryService");

      const history = queryHistoryService.createQueryHistoryService();
      history.addRecord({
        queryText: "SELECT 1",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 1,
        errorMessage: null
      });
      history.addRecord({
        queryText: "SELECT 2",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 1,
        errorMessage: null
      });

      const clearedCount = history.clearRecords();
      const firstAfterClear = history.addRecord({
        queryText: "SELECT 3",
        outcome: "success",
        rowCount: 1,
        executionTimeMs: 1,
        errorMessage: null
      });

      assert.equal(clearedCount, 2);
      assert.equal(firstAfterClear.id, 1);
      assert.deepEqual(
        history.getRecords().map((record: import("../types/queryHistory").QueryHistoryRecord) => record.id),
        [1]
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
  }
}
