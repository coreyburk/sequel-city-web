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
  const [{ getSqlServerPool }, sql] = await Promise.all([
    import("../db/sqlServerPool.ts"),
    import("mssql")
  ]);
  const pool = await getSqlServerPool();

  await pool
    .request()
    .input("suspect", sql.NVarChar(100), suspect)
    .query("INSERT INTO Solution (Suspect) VALUES (@suspect)");

  const result = await pool
    .request()
    .input("suspect", sql.NVarChar(100), suspect)
    .query<SolutionVerdictRow>(`
      SELECT TOP (1)
        Suspect,
        Verdict
      FROM Solution
      WHERE Suspect = @suspect
        AND Verdict IS NOT NULL
      ORDER BY Attempt DESC
    `);

  return result.recordset[0] ?? null;
}
