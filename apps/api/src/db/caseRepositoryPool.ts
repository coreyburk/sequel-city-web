import sql from "mssql";
import type { ConnectionPool } from "mssql";
import { getCaseRepositoryConfig, getDatabaseConfig, isCaseRepositoryConfigured } from "../config/database.ts";
import { getSqlServerPool } from "./sqlServerPool.ts";

let repositoryPromise: Promise<ConnectionPool> | null = null;

export async function getCaseRepositoryPool(): Promise<ConnectionPool> {
  if (!repositoryPromise) {
    const pool = new sql.ConnectionPool(getCaseRepositoryConfig());
    repositoryPromise = pool.connect().then(async connected => {
      try {
        const result = await connected.request().input("learner", sql.NVarChar, getDatabaseConfig().user).query<{ bounded: number }>(`
          SELECT CASE WHEN IS_ROLEMEMBER('sequel_repository')=1 AND IS_ROLEMEMBER('db_owner')=0
          AND IS_ROLEMEMBER('db_datareader')=0 AND IS_ROLEMEMBER('db_datawriter')=0 AND IS_SRVROLEMEMBER('sysadmin')=0
          AND EXISTS (SELECT 1 FROM sys.database_role_members WHERE role_principal_id=DATABASE_PRINCIPAL_ID('sequel_learner') AND member_principal_id=DATABASE_PRINCIPAL_ID(@learner))
          AND NOT EXISTS (SELECT 1 FROM sys.database_role_members r JOIN sys.database_principals p ON r.role_principal_id=p.principal_id
           WHERE r.member_principal_id IN (USER_ID(),DATABASE_PRINCIPAL_ID(@learner)) AND p.name NOT IN ('sequel_learner','sequel_repository'))
          THEN 1 ELSE 0 END bounded`);
        if (result.recordset[0]?.bounded !== 1) throw new Error("Protected repository requires bounded learner/repository roles; finish explicit account setup.");
        const { validateCaseRuntimeReadiness } = await import("../services/databaseIdentityService.ts");
        if (!(await validateCaseRuntimeReadiness(connected)).isReady) throw new Error("Protected case runtime requires explicit complete schema, content and permission setup.");
        return connected;
      } catch (error) { await connected.close(); throw error; }
    });
    pool.on("error", () => { repositoryPromise = null; });
  }
  try { return await repositoryPromise; }
  catch (error) { repositoryPromise = null; throw error; }
}

// Legacy installs stay on their existing path until configured. New runtime calls
// getCaseRepositoryPool directly and cannot fall back to learner credentials.
export async function getTrustedMetadataPool(): Promise<ConnectionPool> {
  return isCaseRepositoryConfigured() ? getCaseRepositoryPool() : getSqlServerPool();
}
