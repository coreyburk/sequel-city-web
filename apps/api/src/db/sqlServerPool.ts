import sql from "mssql";
import type { ConnectionPool } from "mssql";
import { getSqlServerConfig, isCaseRepositoryConfigured } from "../config/database.ts";

let poolPromise: Promise<ConnectionPool> | null = null;

export async function getSqlServerPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    const pool = new sql.ConnectionPool(getSqlServerConfig());
    poolPromise = pool.connect().then(async connected => {
      if (isCaseRepositoryConfigured()) {
        try {
          const result = await connected.request().query<{ bounded: number }>(`
            SELECT CASE WHEN IS_ROLEMEMBER('sequel_learner')=1 AND IS_ROLEMEMBER('db_owner')=0
            AND IS_ROLEMEMBER('db_datareader')=0 AND IS_ROLEMEMBER('db_datawriter')=0
            AND IS_SRVROLEMEMBER('sysadmin')=0 THEN 1 ELSE 0 END bounded`);
          if (result.recordset[0]?.bounded !== 1) throw new Error("Learner execution requires bounded evidence permissions.");
        } catch (error) { await connected.close(); throw error; }
      }
      return connected;
    });
    pool.on("error", () => {
      poolPromise = null;
    });
  }

  try {
    return await poolPromise;
  } catch (error) {
    poolPromise = null;
    throw error;
  }
}
