const assert = require("node:assert/strict") as typeof import("node:assert/strict");

type AsyncTestCase = {
  name: string;
  run: () => Promise<void>;
};

const readyMigrationStatus = {
  hasSchemaVersionTable: true,
  expectedMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  currentMigrationKey: "2026-05-21-005-create-case-verification-objects.sql",
  appliedMigrationKeys: [
    "2026-05-21-001-create-case-answer-key-table.sql",
    "2026-05-21-002-seed-case-answer-key-case-004.sql",
    "2026-05-21-003-add-case-answer-key-foreign-key.sql",
    "2026-05-21-004-create-solution-verifier-user.sql",
    "2026-05-21-005-create-case-verification-objects.sql"
  ],
  pendingMigrationKeys: []
} as const;

const staleMigrationStatus = {
  ...readyMigrationStatus,
  currentMigrationKey: "2026-05-21-004-create-solution-verifier-user.sql",
  pendingMigrationKeys: ["2026-05-21-005-create-case-verification-objects.sql"]
} as const;

const validObjectRow = {
  PersonsOfInterestTable: 1,
  CrimeSceneReportTable: 1,
  CrimeTypeTable: 1,
  DriversLicenseTable: 1,
  EventScheduleTable: 1,
  EventRegistrationTable: 1,
  SolutionTable: 1,
  CaseAnswerKeyTable: 1,
  VerifySuspectSubmissionProcedure: 1
};

function createPoolForIdentity(
  objectRow: typeof validObjectRow,
  answerAggregate = { expectedRoleCount: 2, unexpectedRoleCount: 0 }
) {
  const responses = [
    { recordset: [objectRow] },
    { recordset: [answerAggregate] }
  ];

  return {
    request: () => ({
      query: async () => {
        const response = responses.shift();
        if (!response) {
          throw new Error("unexpected query");
        }

        return response;
      }
    })
  } as never;
}

const testCases: AsyncTestCase[] = [
  {
    name: "valid identity with no pending migrations reports ready",
    run: async () => {
      const identityService =
        require("./databaseIdentityService.ts") as typeof import("./databaseIdentityService");

      const result = await identityService.validateDatabaseIdentity(
        createPoolForIdentity(validObjectRow),
        readyMigrationStatus
      );

      assert.equal(result.status, "ready");
      assert.deepEqual(result.missingFacts, []);
    }
  },
  {
    name: "valid identity with pending migrations reports stale",
    run: async () => {
      const identityService =
        require("./databaseIdentityService.ts") as typeof import("./databaseIdentityService");

      const result = await identityService.validateDatabaseIdentity(
        createPoolForIdentity({
          ...validObjectRow,
          VerifySuspectSubmissionProcedure: 0
        }),
        staleMigrationStatus
      );

      assert.equal(result.status, "stale");
      assert.deepEqual(result.missingFacts, []);
    }
  },
  {
    name: "missing required table reports invalid",
    run: async () => {
      const identityService =
        require("./databaseIdentityService.ts") as typeof import("./databaseIdentityService");

      const result = await identityService.validateDatabaseIdentity(
        createPoolForIdentity({
          ...validObjectRow,
          PersonsOfInterestTable: 0
        }),
        readyMigrationStatus
      );

      assert.equal(result.status, "invalid");
      assert.deepEqual(result.missingFacts, ["table:dbo.PersonsOfInterest"]);
    }
  },
  {
    name: "missing answer-key role aggregate reports invalid without exposing spoiler values",
    run: async () => {
      const identityService =
        require("./databaseIdentityService.ts") as typeof import("./databaseIdentityService");

      const result = await identityService.validateDatabaseIdentity(
        createPoolForIdentity(validObjectRow, {
          expectedRoleCount: 1,
          unexpectedRoleCount: 0
        }),
        readyMigrationStatus
      );

      assert.equal(result.status, "invalid");
      assert.deepEqual(result.missingFacts, ["aggregate:case-004-answer-roles"]);
      assert.equal(result.message.includes("67318"), false);
      assert.equal(result.message.includes("99716"), false);
    }
  },
  {
    name: "missing identity result labels an unreachable database",
    run: async () => {
      const identityService =
        require("./databaseIdentityService.ts") as typeof import("./databaseIdentityService");

      const result = identityService.createMissingDatabaseIdentityResult("Login failed");

      assert.deepEqual(result, {
        status: "missing",
        message: "Login failed",
        missingFacts: ["connection:SequelCityCrimesDB"],
        checkedFacts: []
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
