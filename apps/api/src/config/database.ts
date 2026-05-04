import type { config as SqlConfig } from "mssql";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user?: string;
  password?: string;
  trustServerCertificate: boolean;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === "true";
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.SQLSERVER_HOST?.trim() || "127.0.0.1",
    port: Number(process.env.SQLSERVER_PORT || 1433),
    database: process.env.SQLSERVER_DATABASE?.trim() || "SequelCityCrimesDB",
    user: process.env.SQLSERVER_USER?.trim() || undefined,
    password: process.env.SQLSERVER_PASSWORD || undefined,
    trustServerCertificate: parseBoolean(
      process.env.SQLSERVER_TRUST_SERVER_CERTIFICATE,
      true
    )
  };
}

export function getSqlServerConfig(): SqlConfig {
  const databaseConfig = getDatabaseConfig();

  return {
    server: databaseConfig.host,
    port: databaseConfig.port,
    database: databaseConfig.database,
    user: databaseConfig.user,
    password: databaseConfig.password,
    options: {
      trustServerCertificate: databaseConfig.trustServerCertificate
    }
  };
}
