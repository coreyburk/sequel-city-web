const assert = require("node:assert/strict") as typeof import("node:assert/strict");
const queryResultNormalizer =
  require("./queryResultNormalizer.ts") as typeof import("./queryResultNormalizer");

type TestCase = {
  name: string;
  run: () => void;
};

const testCases: TestCase[] = [
  {
    name: "preserves column order and uses zero-based ordinals",
    run: () => {
      const recordset = [
        {
          suspectName: "Ada",
          caseNumber: 7,
          isActive: true
        }
      ] as import("./queryResultNormalizer").QueryRecordset;

      recordset.columns = {
        suspectName: { name: "suspectName" },
        caseNumber: { name: "caseNumber" },
        isActive: { name: "isActive" }
      };

      const result = queryResultNormalizer.normalizeQueryResult(recordset);

      assert.deepEqual(result.columns, [
        { name: "suspectName", ordinal: 0, dataType: "string" },
        { name: "caseNumber", ordinal: 1, dataType: "number" },
        { name: "isActive", ordinal: 2, dataType: "boolean" }
      ]);
    }
  },
  {
    name: "reports rowCount from normalized rows",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        { suspectName: "Ada" },
        { suspectName: "Basil" }
      ]);

      assert.equal(result.rowCount, 2);
    }
  },
  {
    name: "normalizes string number and boolean values",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        {
          suspectName: "Ada",
          caseNumber: 7,
          isActive: false
        }
      ]);

      assert.deepEqual(result.rows[0], {
        values: {
          suspectName: "Ada",
          caseNumber: 7,
          isActive: false
        },
        displayValues: {
          suspectName: "Ada",
          caseNumber: "7",
          isActive: "false"
        }
      });
    }
  },
  {
    name: "normalizes date values to ISO strings",
    run: () => {
      const date = new Date("2024-01-02T03:04:05.678Z");
      const result = queryResultNormalizer.normalizeQueryResult([
        { occurredAt: date }
      ]);

      assert.deepEqual(result.columns, [
        { name: "occurredAt", ordinal: 0, dataType: "date" }
      ]);
      assert.equal(result.rows[0]?.values.occurredAt, date.toISOString());
      assert.equal(result.rows[0]?.displayValues.occurredAt, date.toISOString());
    }
  },
  {
    name: "normalizes null and undefined values to null and empty display strings",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        {
          nullableField: null,
          optionalField: undefined
        }
      ]);

      assert.deepEqual(result.rows[0], {
        values: {
          nullableField: null,
          optionalField: null
        },
        displayValues: {
          nullableField: "",
          optionalField: ""
        }
      });
    }
  },
  {
    name: "marks null-only columns as null type",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        { nullableField: null },
        { nullableField: undefined }
      ]);

      assert.deepEqual(result.columns, [
        { name: "nullableField", ordinal: 0, dataType: "null" }
      ]);
    }
  },
  {
    name: "marks unknown values as unknown type and uses safe display strings",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        { payload: { location: "Dock 9" } }
      ]);

      assert.deepEqual(result.columns, [
        { name: "payload", ordinal: 0, dataType: "unknown" }
      ]);
      assert.equal(result.rows[0]?.values.payload, null);
      assert.equal(result.rows[0]?.displayValues.payload, "[object Object]");
    }
  },
  {
    name: "uses the first non-null value to determine mixed-type columns",
    run: () => {
      const result = queryResultNormalizer.normalizeQueryResult([
        { mixedField: null },
        { mixedField: 42 },
        { mixedField: "later string" }
      ]);

      assert.deepEqual(result.columns, [
        { name: "mixedField", ordinal: 0, dataType: "number" }
      ]);
      assert.equal(result.rows[2]?.values.mixedField, "later string");
      assert.equal(result.rows[2]?.displayValues.mixedField, "later string");
    }
  }
];

runTests();

function runTests(): void {
  let failedCount = 0;

  for (const testCase of testCases) {
    try {
      testCase.run();
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
