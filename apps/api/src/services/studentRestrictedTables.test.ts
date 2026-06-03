const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type TestCase = {
  name: string;
  run: () => void;
};

const testCases: TestCase[] = [
  {
    name: "identifies restricted table names case-insensitively",
    run: () => {
      const restrictedTables =
        require("./studentRestrictedTables.ts") as typeof import("./studentRestrictedTables");

      assert.equal(restrictedTables.isStudentRestrictedTable("Solution"), true);
      assert.equal(restrictedTables.isStudentRestrictedTable("caseanswerkey"), true);
      assert.equal(restrictedTables.isStudentRestrictedTable("PersonsOfInterest"), false);
    }
  },
  {
    name: "detects direct unqualified restricted table references",
    run: () => {
      const restrictedTables =
        require("./studentRestrictedTables.ts") as typeof import("./studentRestrictedTables");

      const references = restrictedTables.findStudentRestrictedTableReferences(
        "SELECT * FROM Solution"
      );

      assert.deepEqual(references, [{ tableName: "Solution" }]);
    }
  },
  {
    name: "detects schema-qualified and bracketed restricted table references",
    run: () => {
      const restrictedTables =
        require("./studentRestrictedTables.ts") as typeof import("./studentRestrictedTables");

      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "SELECT * FROM dbo.CaseAnswerKey"
        ),
        [{ tableName: "CaseAnswerKey" }]
      );
      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "SELECT * FROM [dbo].[Solution]"
        ),
        [{ tableName: "Solution" }]
      );
    }
  },
  {
    name: "detects restricted tables in joins subqueries and CTEs",
    run: () => {
      const restrictedTables =
        require("./studentRestrictedTables.ts") as typeof import("./studentRestrictedTables");

      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "SELECT p.PersonName FROM PersonsOfInterest p JOIN Solution s ON s.Suspect = p.PersonName"
        ),
        [{ tableName: "Solution" }]
      );
      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "SELECT * FROM PersonsOfInterest WHERE PersonID IN (SELECT SuspectPersonID FROM CaseAnswerKey)"
        ),
        [{ tableName: "CaseAnswerKey" }]
      );
      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "WITH answers AS (SELECT * FROM dbo.Solution) SELECT * FROM answers"
        ),
        [{ tableName: "Solution" }]
      );
    }
  },
  {
    name: "ignores restricted table names inside string literals and comments",
    run: () => {
      const restrictedTables =
        require("./studentRestrictedTables.ts") as typeof import("./studentRestrictedTables");

      assert.deepEqual(
        restrictedTables.findStudentRestrictedTableReferences(
          "SELECT 'Solution' AS Label FROM PersonsOfInterest -- FROM CaseAnswerKey"
        ),
        []
      );
    }
  }
];

void runTests();

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
