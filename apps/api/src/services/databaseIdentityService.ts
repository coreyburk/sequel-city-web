import type { ConnectionPool } from "mssql";
import type { DatabaseMigrationStatus } from "./databaseMigrationService.ts";

export type DatabaseIdentityStatus = "ready" | "stale" | "missing" | "invalid";

export interface DatabaseIdentityResult {
  status: DatabaseIdentityStatus;
  message: string;
  missingFacts: string[];
  checkedFacts: string[];
}

interface RequiredObjectRow {
  PersonsOfInterestTable: number;
  CrimeSceneReportTable: number;
  CrimeTypeTable: number;
  DriversLicenseTable: number;
  EventScheduleTable: number;
  EventRegistrationTable: number;
  SolutionTable: number;
  CaseAnswerKeyTable: number;
  VerifySuspectSubmissionProcedure: number;
}

interface CaseAnswerKeyAggregateRow {
  expectedRoleCount: number;
  unexpectedRoleCount: number;
}

const REQUIRED_TABLE_FACTS: Array<{
  key: keyof RequiredObjectRow;
  fact: string;
}> = [
  { key: "PersonsOfInterestTable", fact: "table:dbo.PersonsOfInterest" },
  { key: "CrimeSceneReportTable", fact: "table:dbo.CrimeSceneReport" },
  { key: "CrimeTypeTable", fact: "table:dbo.CrimeType" },
  { key: "DriversLicenseTable", fact: "table:dbo.DriversLicense" },
  { key: "EventScheduleTable", fact: "table:dbo.EventSchedule" },
  { key: "EventRegistrationTable", fact: "table:dbo.EventRegistration" },
  { key: "SolutionTable", fact: "table:dbo.Solution" },
  { key: "CaseAnswerKeyTable", fact: "table:dbo.CaseAnswerKey" }
];

const MIGRATION_OWNED_OBJECT_FACTS: Array<{
  key: keyof RequiredObjectRow;
  fact: string;
}> = [
  {
    key: "VerifySuspectSubmissionProcedure",
    fact: "procedure:dbo.VerifySuspectSubmission"
  }
];

export function createMissingDatabaseIdentityResult(message?: string): DatabaseIdentityResult {
  return {
    status: "missing",
    message:
      message ??
      "The case database is missing or unreachable. Confirm SQL Server is running and SequelCityCrimesDB is restored before applying upgrades.",
    missingFacts: ["connection:SequelCityCrimesDB"],
    checkedFacts: []
  };
}

export async function validateDatabaseIdentity(
  pool: ConnectionPool,
  migrationStatus: DatabaseMigrationStatus
): Promise<DatabaseIdentityResult> {
  const objectResult = await pool.request().query<RequiredObjectRow>(`
    SELECT
      CASE WHEN OBJECT_ID(N'dbo.PersonsOfInterest', N'U') IS NOT NULL THEN 1 ELSE 0 END AS PersonsOfInterestTable,
      CASE WHEN OBJECT_ID(N'dbo.CrimeSceneReport', N'U') IS NOT NULL THEN 1 ELSE 0 END AS CrimeSceneReportTable,
      CASE WHEN OBJECT_ID(N'dbo.CrimeType', N'U') IS NOT NULL THEN 1 ELSE 0 END AS CrimeTypeTable,
      CASE WHEN OBJECT_ID(N'dbo.DriversLicense', N'U') IS NOT NULL THEN 1 ELSE 0 END AS DriversLicenseTable,
      CASE WHEN OBJECT_ID(N'dbo.EventSchedule', N'U') IS NOT NULL THEN 1 ELSE 0 END AS EventScheduleTable,
      CASE WHEN OBJECT_ID(N'dbo.EventRegistration', N'U') IS NOT NULL THEN 1 ELSE 0 END AS EventRegistrationTable,
      CASE WHEN OBJECT_ID(N'dbo.Solution', N'U') IS NOT NULL THEN 1 ELSE 0 END AS SolutionTable,
      CASE WHEN OBJECT_ID(N'dbo.CaseAnswerKey', N'U') IS NOT NULL THEN 1 ELSE 0 END AS CaseAnswerKeyTable,
      CASE WHEN OBJECT_ID(N'dbo.VerifySuspectSubmission', N'P') IS NOT NULL THEN 1 ELSE 0 END AS VerifySuspectSubmissionProcedure
  `);

  const objectRow = objectResult.recordset[0];
  const checkedFacts = [
    ...REQUIRED_TABLE_FACTS.map((item) => item.fact),
    ...MIGRATION_OWNED_OBJECT_FACTS.map((item) => item.fact),
    "aggregate:case-004-answer-roles"
  ];

  if (!objectRow) {
    return {
      status: "invalid",
      message:
        "The connected database could not be verified as a Sequel Detective case database.",
      missingFacts: checkedFacts,
      checkedFacts
    };
  }

  const missingFacts = REQUIRED_TABLE_FACTS
    .filter((item) => objectRow[item.key] !== 1)
    .map((item) => item.fact);

  const pendingMigrationCount = migrationStatus.pendingMigrationKeys.length;

  if (pendingMigrationCount === 0) {
    missingFacts.push(
      ...MIGRATION_OWNED_OBJECT_FACTS
        .filter((item) => objectRow[item.key] !== 1)
        .map((item) => item.fact)
    );
  }

  if (missingFacts.length > 0) {
    return {
      status: "invalid",
      message:
        "The connected database is not a valid Sequel Detective case database. Required schema or verification objects are missing.",
      missingFacts,
      checkedFacts
    };
  }

  const answerKeyResult = await pool
    .request()
    .query<CaseAnswerKeyAggregateRow>(`
      SELECT
        SUM(CASE WHEN AnswerRole IN (N'trigger_man', N'mastermind') THEN 1 ELSE 0 END) AS expectedRoleCount,
        SUM(CASE WHEN AnswerRole NOT IN (N'trigger_man', N'mastermind') THEN 1 ELSE 0 END) AS unexpectedRoleCount
      FROM dbo.CaseAnswerKey
      WHERE CaseId = N'case-004'
    `);

  const aggregate = answerKeyResult.recordset[0];
  const hasExpectedCase004Roles =
    aggregate?.expectedRoleCount === 2 && aggregate.unexpectedRoleCount === 0;

  if (!hasExpectedCase004Roles) {
    return {
      status: "invalid",
      message:
        "The connected database is missing the expected Case 004 answer-key role aggregate. Restore the Sequel Detective classroom database before applying upgrades.",
      missingFacts: ["aggregate:case-004-answer-roles"],
      checkedFacts
    };
  }

  if (pendingMigrationCount > 0) {
    return {
      status: "stale",
      message:
        "The case database identity is valid, but required non-destructive migrations are pending.",
      missingFacts: [],
      checkedFacts
    };
  }

  return {
    status: "ready",
    message: "The case database identity is valid and up to date.",
    missingFacts: [],
    checkedFacts
  };
}
