import type { ConnectionPool } from "mssql";
import type { DatabaseMigrationStatus } from "./databaseMigrationService.ts";
import { CaseRuntimeRepository } from "../repositories/caseRuntimeRepository.ts";
import { CASE_RUNTIME_SCHEMA_KEY } from "./caseContentValidationService.ts";

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
      IF OBJECT_ID(N'app.GetLegacyCaseRoleCounts', N'P') IS NOT NULL
        EXEC app.GetLegacyCaseRoleCounts;
      ELSE SELECT
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

export interface CaseRuntimeReadiness {
  isReady: boolean;
  schemaKey: string;
  missingFacts: string[];
  message: string;
}

export async function validateCaseRuntimeReadiness(pool: ConnectionPool): Promise<CaseRuntimeReadiness> {
  const missingFacts: string[] = [];
  try {
    const result = await pool.request().query<{ tables: number; checkedForeignKeys: number; columns: number; immutableTriggers: number; marker: number; repositoryRole: number; learnerRole: number }>(`
      SELECT
       (SELECT COUNT(*) FROM sys.tables WHERE schema_id=SCHEMA_ID('app') AND name IN ('CaseDefinition','CaseStep','CaseStepPrerequisite','LocalLearner','LearnerAttempt','AttemptWorkspace','AttemptAction','AttemptStepEvidence','LearnerRequest')) tables,
       (SELECT COUNT(*) FROM sys.foreign_keys WHERE schema_id=SCHEMA_ID('app') AND is_disabled=0 AND is_not_trusted=0 AND name IN ('FK_Step_Definition','FK_Definition_Entry','FK_Prerequisite_Step','FK_Prerequisite_Required','FK_Attempt_Owner','FK_Attempt_Content','FK_Workspace_Attempt','FK_Action_Attempt','FK_Evidence_Attempt','FK_Evidence_Step','FK_Evidence_Action','FK_Request_Owner')) checkedForeignKeys,
       (SELECT COUNT(*) FROM sys.columns c JOIN sys.tables t ON c.object_id=t.object_id WHERE t.schema_id=SCHEMA_ID('app') AND (
        (t.name='CaseDefinition' AND c.name IN ('CaseId','ContentVersion','Title','Dossier','WholeCaseObjective','EntryStepKey','EvidenceVersion','CompletionScope','ReleaseStatus')) OR
        (t.name='CaseStep' AND c.name IN ('CaseId','ContentVersion','StepKey','DisplayOrder','TaskTitle','StepObjective','SamuelDirection','Hint','StarterSql','CompletionMode','ValidatorKey','ValidatorParametersJson')) OR
        (t.name='CaseStepPrerequisite' AND c.name IN ('CaseId','ContentVersion','StepKey','RequiredStepKey')) OR
        (t.name='LocalLearner' AND c.name IN ('OwnerId','CapabilityHash','CreatedAtUtc','LastSeenAtUtc')) OR
        (t.name='LearnerAttempt' AND c.name IN ('AttemptId','OwnerId','CaseId','ContentVersion','EvidenceVersion','Status','ArchivedFromStatus','Revision','CreatedAtUtc','UpdatedAtUtc')) OR
        (t.name='AttemptWorkspace' AND c.name IN ('AttemptId','WorkspaceJson')) OR
        (t.name='LearnerRequest' AND c.name IN ('OwnerId','RequestId','RequestDigest','OutcomeJson','CreatedAtUtc')) OR
        (t.name='AttemptAction' AND c.name IN ('ActionId','AttemptId','RequestId','ActionKind','RequestDigest','PrerequisiteRevision','SqlOrSubmission','ValidatorResult','ProofJson','CreatedAtUtc','ExpiresAtUtc')) OR
        (t.name='AttemptStepEvidence' AND c.name IN ('AttemptId','StepKey','CaseId','ContentVersion','ActionId','ValidatorVersion','ProofJson','EvaluatedAtUtc')))) columns,
       (SELECT COUNT(*) FROM sys.triggers WHERE parent_id IN (OBJECT_ID('app.CaseDefinition'),OBJECT_ID('app.CaseStep'),OBJECT_ID('app.CaseStepPrerequisite')) AND is_disabled=0) immutableTriggers,
       (SELECT COUNT(*) FROM dbo.AppSchemaVersion WHERE MigrationKey='case-runtime-v1') marker,
       CASE WHEN IS_ROLEMEMBER('sequel_repository')=1 AND
        (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_repository') AND state='G' AND minor_id=0 AND permission_name IN ('SELECT','INSERT','UPDATE','DELETE') AND major_id IN
         (OBJECT_ID('app.LocalLearner'),OBJECT_ID('app.LearnerAttempt'),OBJECT_ID('app.AttemptWorkspace'),OBJECT_ID('app.AttemptAction'),OBJECT_ID('app.AttemptStepEvidence'),OBJECT_ID('app.LearnerRequest')))=24 THEN 1 ELSE 0 END repositoryRole,
       CASE WHEN DATABASE_PRINCIPAL_ID('sequel_learner') IS NOT NULL
        AND (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner') AND state='D')=19
        AND (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner') AND class=3 AND major_id=SCHEMA_ID('app') AND state='D')=5
        AND (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner') AND class=0 AND permission_name IN ('VIEW DEFINITION','EXECUTE') AND state='D')=2
        AND (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner') AND state='G' AND permission_name='SELECT' AND minor_id=0 AND major_id IN
         (OBJECT_ID('dbo.CrimeType'),OBJECT_ID('dbo.CrimeSceneReport'),OBJECT_ID('dbo.DriversLicense'),OBJECT_ID('dbo.PersonsOfInterest'),OBJECT_ID('dbo.EventSchedule'),OBJECT_ID('dbo.EventRegistration'),OBJECT_ID('dbo.FitNFlabClub'),OBJECT_ID('dbo.FitNFlabClubCheckIn'),OBJECT_ID('dbo.Employment'),OBJECT_ID('dbo.InterviewLog')))=10
        AND (SELECT COUNT(*) FROM sys.database_permissions WHERE grantee_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner'))=29
        THEN 1 ELSE 0 END learnerRole
    `);
    const row = result.recordset[0];
    if (!row || row.tables !== 9) missingFacts.push("runtime:tables");
    if (!row || row.checkedForeignKeys !== 12) missingFacts.push("runtime:checked-foreign-keys");
    if (!row || row.columns !== 65) missingFacts.push("runtime:columns");
    if (!row || row.immutableTriggers !== 3) missingFacts.push("runtime:immutable-content");
    if (!row || row.marker !== 1) missingFacts.push("runtime:manifest");
    if (!row || row.repositoryRole !== 1 || row.learnerRole !== 1) missingFacts.push("runtime:permissions");
    if (!missingFacts.length) {
      const content = await new CaseRuntimeRepository(async () => pool).loadReleasedContent("case-001", 1);
      if (!content) missingFacts.push("runtime:released-case-001");
      const versions = await pool.request().query<{ CaseId: string; ContentVersion: number }>("SELECT CaseId,ContentVersion FROM app.CaseDefinition WHERE ReleaseStatus='released'");
      for (const version of versions.recordset) {
        await new CaseRuntimeRepository(async () => pool).loadReleasedContent(version.CaseId, version.ContentVersion);
      }
      const evidence = await pool.request().query<{ evidenceMatches: number }>(`
        EXEC app.CheckEvidenceManifest;
      `);
      if (evidence.recordset[0]?.evidenceMatches !== 1) missingFacts.push("runtime:evidence-version");
    }
  } catch { missingFacts.push("runtime:unavailable-or-invalid"); }
  return { isReady: missingFacts.length === 0, schemaKey: CASE_RUNTIME_SCHEMA_KEY, missingFacts,
    message: missingFacts.length ? "Protected case runtime requires explicit database/account setup. Back up before an approved rebuild; automatic migrations cannot install this content." : "Protected case repository is ready; frontend routing remains unchanged." };
}
