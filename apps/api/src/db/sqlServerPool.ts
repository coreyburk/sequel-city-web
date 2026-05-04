import sql, { ConnectionPool } from "mssql";
import { getSqlServerConfig } from "../config/database";

let poolPromise: Promise<ConnectionPool> | null = null;

export async function getSqlServerPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    const pool = new sql.ConnectionPool(getSqlServerConfig());
    poolPromise = pool.connect();
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
