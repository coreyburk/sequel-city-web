import type { config as SqlConfig } from "mssql";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user?: string;
  password?: string;
  trustServerCertificate: boolean;
}

function normalizeSqlServerHost(host: string): string {
  const normalizedHost = host.trim().toLowerCase();

  if (normalizedHost === "127.0.0.1" || normalizedHost === "::1") {
    return "localhost";
  }

  return host;
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
    server: normalizeSqlServerHost(databaseConfig.host),
    port: databaseConfig.port,
    database: databaseConfig.database,
    user: databaseConfig.user,
    password: databaseConfig.password,
    options: {
      trustServerCertificate: databaseConfig.trustServerCertificate
    }
  };
}

export function isCaseRepositoryConfigured(): boolean {
  return Boolean(process.env.SQLSERVER_APP_USER || process.env.SQLSERVER_APP_PASSWORD);
}

export function getCaseRepositoryConfig(): SqlConfig {
  const user = process.env.SQLSERVER_APP_USER?.trim();
  const password = process.env.SQLSERVER_APP_PASSWORD;
  const learnerUser = getDatabaseConfig().user;
  const bootstrapUser = process.env.SQLSERVER_BOOTSTRAP_USER?.trim() || "sequel_bootstrap_user";
  if (!user || !password || !learnerUser || user.toLowerCase() === learnerUser.toLowerCase() ||
      user.toLowerCase() === bootstrapUser.toLowerCase()) {
    throw new Error("Configure separate SQLSERVER_APP_USER/PASSWORD repository credentials and a bounded learner login.");
  }
  return { ...getSqlServerConfig(), user, password };
}
