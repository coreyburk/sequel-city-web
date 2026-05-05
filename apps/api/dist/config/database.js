"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = getDatabaseConfig;
exports.getSqlServerConfig = getSqlServerConfig;
function parseBoolean(value, fallback) {
    if (value === undefined) {
        return fallback;
    }
    return value.trim().toLowerCase() === "true";
}
function getDatabaseConfig() {
    return {
        host: process.env.SQLSERVER_HOST?.trim() || "127.0.0.1",
        port: Number(process.env.SQLSERVER_PORT || 1433),
        database: process.env.SQLSERVER_DATABASE?.trim() || "SequelCityCrimesDB",
        user: process.env.SQLSERVER_USER?.trim() || undefined,
        password: process.env.SQLSERVER_PASSWORD || undefined,
        trustServerCertificate: parseBoolean(process.env.SQLSERVER_TRUST_SERVER_CERTIFICATE, true)
    };
}
function getSqlServerConfig() {
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
