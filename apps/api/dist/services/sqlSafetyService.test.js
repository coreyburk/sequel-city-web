"use strict";
const assert = require("node:assert/strict");
const { validateSqlSafety } = require("./sqlSafetyService.ts");
const testCases = [
    {
        name: "empty SQL is blocked",
        run: () => {
            const result = validateSqlSafety("   ");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "UNKNOWN");
            assert.equal(result.violations[0]?.code, "EMPTY_SQL");
        }
    },
    {
        name: "basic SELECT is allowed",
        run: () => {
            const result = validateSqlSafety("SELECT * FROM CrimeSceneReport");
            assert.equal(result.isAllowed, true);
            assert.equal(result.normalizedStatementType, "SELECT");
            assert.deepEqual(result.violations, []);
        }
    },
    {
        name: "SELECT with JOIN, WHERE, GROUP BY, and ORDER BY is allowed",
        run: () => {
            const result = validateSqlSafety(`
        SELECT p.FullName, COUNT(*) AS MatchCount
        FROM PersonsOfInterest p
        JOIN DriversLicense d ON p.LicenseId = d.LicenseId
        WHERE d.Gender = 'F'
        GROUP BY p.FullName
        ORDER BY p.FullName
      `);
            assert.equal(result.isAllowed, true);
            assert.equal(result.normalizedStatementType, "SELECT");
        }
    },
    {
        name: "WITH CTE followed by SELECT is allowed",
        run: () => {
            const result = validateSqlSafety(`
        WITH Witnesses AS (
          SELECT * FROM InterviewLog
        )
        SELECT * FROM Witnesses
      `);
            assert.equal(result.isAllowed, true);
            assert.equal(result.normalizedStatementType, "SELECT");
        }
    },
    {
        name: "INSERT is blocked",
        run: () => {
            const result = validateSqlSafety("INSERT INTO PersonsOfInterest VALUES (1)");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "INSERT");
            assert.equal(result.violations[0]?.code, "DISALLOWED_STATEMENT");
        }
    },
    {
        name: "UPDATE is blocked",
        run: () => {
            const result = validateSqlSafety("UPDATE PersonsOfInterest SET FullName = 'X'");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "UPDATE");
        }
    },
    {
        name: "DELETE is blocked",
        run: () => {
            const result = validateSqlSafety("DELETE FROM PersonsOfInterest");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "DELETE");
        }
    },
    {
        name: "DROP is blocked",
        run: () => {
            const result = validateSqlSafety("DROP TABLE PersonsOfInterest");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "DROP");
        }
    },
    {
        name: "ALTER is blocked",
        run: () => {
            const result = validateSqlSafety("ALTER TABLE PersonsOfInterest ADD AliasName NVARCHAR(100)");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "ALTER");
        }
    },
    {
        name: "CREATE is blocked",
        run: () => {
            const result = validateSqlSafety("CREATE TABLE PersonsOfInterest (Id INT)");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "CREATE");
        }
    },
    {
        name: "TRUNCATE is blocked",
        run: () => {
            const result = validateSqlSafety("TRUNCATE TABLE PersonsOfInterest");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "TRUNCATE");
        }
    },
    {
        name: "MERGE is blocked",
        run: () => {
            const result = validateSqlSafety("MERGE PersonsOfInterest AS target USING Suspects AS source ON target.Id = source.Id");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "MERGE");
        }
    },
    {
        name: "EXEC is blocked",
        run: () => {
            const result = validateSqlSafety("EXEC dbo.RunMysteryProcedure");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "EXEC");
        }
    },
    {
        name: "EXECUTE is blocked",
        run: () => {
            const result = validateSqlSafety("EXECUTE dbo.RunMysteryProcedure");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "EXECUTE");
        }
    },
    {
        name: "multiple statements are blocked",
        run: () => {
            const result = validateSqlSafety("SELECT * FROM PersonsOfInterest; DROP TABLE PersonsOfInterest;");
            assert.equal(result.isAllowed, false);
            assert.equal(result.violations[0]?.code, "MULTIPLE_STATEMENTS");
        }
    },
    {
        name: "comment-hidden blocked token is blocked",
        run: () => {
            const result = validateSqlSafety("/* hidden */ DROP TABLE PersonsOfInterest");
            assert.equal(result.isAllowed, false);
            assert.equal(result.normalizedStatementType, "DROP");
            assert.equal(result.violations[0]?.code, "DISALLOWED_STATEMENT");
        }
    }
];
let failedCount = 0;
for (const testCase of testCases) {
    try {
        testCase.run();
        console.log(`PASS ${testCase.name}`);
    }
    catch (error) {
        failedCount += 1;
        console.error(`FAIL ${testCase.name}`);
        console.error(error);
    }
}
if (failedCount > 0) {
    process.exitCode = 1;
}
