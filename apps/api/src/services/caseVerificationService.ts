import type { CaseVerificationResponse } from "../types/caseVerification.ts";

interface SolutionVerdictRow {
  Suspect: string;
  Verdict: string | null;
}

export type SuspectVerifier = (
  suspect: string
) => Promise<SolutionVerdictRow | null>;

const INVALID_SUSPECT_MESSAGE =
  "Request body must include a non-empty string `suspect` field.";

const VERIFICATION_FAILURE_MESSAGE =
  "Suspect verification failed. Verify the suspect name and database connection.";

export async function verifySuspect(
  suspect: string,
  verifyWithDatabase: SuspectVerifier = verifySuspectWithDatabase
): Promise<CaseVerificationResponse> {
  const trimmedSuspect = suspect.trim();

  if (trimmedSuspect.length === 0) {
    return {
      success: false,
      message: INVALID_SUSPECT_MESSAGE
    };
  }

  try {
    const verdictRow = await verifyWithDatabase(trimmedSuspect);

    if (verdictRow === null || verdictRow.Verdict === null) {
      return {
        success: false,
        message: VERIFICATION_FAILURE_MESSAGE
      };
    }

    return {
      success: true,
      data: {
        suspect: verdictRow.Suspect,
        verdict: verdictRow.Verdict
      },
      message: "Suspect verification completed."
    };
  } catch {
    return {
      success: false,
      message: VERIFICATION_FAILURE_MESSAGE
    };
  }
}

async function verifySuspectWithDatabase(
  suspect: string
): Promise<SolutionVerdictRow | null> {
  const [sqlServerPoolModule, sqlModule] = await Promise.all([
    import("../db/sqlServerPool.ts"),
    import("mssql")
  ]);
  const getSqlServerPool =
    sqlServerPoolModule.getSqlServerPool ??
    (sqlServerPoolModule.default as { getSqlServerPool?: typeof import("../db/sqlServerPool.ts")["getSqlServerPool"] } | undefined)
      ?.getSqlServerPool;

  if (typeof getSqlServerPool !== "function") {
    throw new Error("sqlServerPool.getSqlServerPool is not available.");
  }

  const sql =
    (sqlModule.default as typeof import("mssql") | undefined) ?? sqlModule;

  const pool = await getSqlServerPool();

  const result = await pool
    .request()
    .input("suspect", sql.NVarChar(100), suspect)
    .execute<SolutionVerdictRow>("VerifySuspectSubmission");

  return result.recordset[0] ?? null;
}
