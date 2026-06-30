"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.getBackendDiagnostics = getBackendDiagnostics;
exports.getSchemaTables = getSchemaTables;
const databaseBootstrapService_ts_1 = require("./databaseBootstrapService.js");
const schemaService_ts_1 = require("./schemaService.js");
async function checkDatabaseHealth() {
    const checkedAtUtc = new Date().toISOString();
    try {
        const { getSqlServerPool } = await Promise.resolve().then(() => __importStar(require("../db/sqlServerPool.js")));
        const pool = await getSqlServerPool();
        const result = await pool.request().query(`
      SELECT
        DB_NAME() AS databaseName,
        @@SERVERNAME AS serverName
    `);
        const record = result.recordset[0];
        return {
            isConnected: true,
            databaseName: record?.databaseName ?? null,
            serverName: record?.serverName ?? null,
            message: "Database connection successful.",
            checkedAtUtc
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Database connection failed.";
        return {
            isConnected: false,
            databaseName: null,
            serverName: null,
            message,
            checkedAtUtc
        };
    }
}
async function getBackendDiagnostics(checkHealth = checkDatabaseHealth, loadSchemaMetadata = schemaService_ts_1.getSchemaMetadata, checkBootstrap = databaseBootstrapService_ts_1.ensureDatabaseBootstrap) {
    const databaseHealth = await checkHealth();
    const bootstrapResult = await checkBootstrap();
    const databaseStatus = {
        status: databaseHealth.isConnected ? "ok" : "failed",
        isConnected: databaseHealth.isConnected,
        databaseName: databaseHealth.databaseName,
        serverName: databaseHealth.serverName,
        message: databaseHealth.isConnected
            ? databaseHealth.message
            : "Database connection failed."
    };
    try {
        const schemaResponse = await loadSchemaMetadata();
        if (!schemaResponse.success) {
            return {
                success: true,
                data: {
                    api: "ok",
                    database: databaseStatus,
                    bootstrap: mapBootstrapStatus(bootstrapResult),
                    schema: {
                        status: "failed",
                        tableCount: 0,
                        relationshipCount: 0,
                        message: "Schema metadata unavailable."
                    }
                }
            };
        }
        return {
            success: true,
            data: {
                api: "ok",
                database: databaseStatus,
                bootstrap: mapBootstrapStatus(bootstrapResult),
                schema: {
                    status: "ok",
                    tableCount: schemaResponse.data.tables.length,
                    relationshipCount: schemaResponse.data.relationships.length,
                    message: "Schema metadata loaded successfully."
                }
            }
        };
    }
    catch {
        return {
            success: true,
            data: {
                api: "ok",
                database: databaseStatus,
                bootstrap: mapBootstrapStatus(bootstrapResult),
                schema: {
                    status: "failed",
                    tableCount: 0,
                    relationshipCount: 0,
                    message: "Schema metadata unavailable."
                }
            }
        };
    }
}
async function getSchemaTables() {
    const { getSqlServerPool } = await Promise.resolve().then(() => __importStar(require("../db/sqlServerPool.js")));
    const pool = await getSqlServerPool();
    const result = await pool.request().query(`
    SELECT
      TABLE_NAME AS tableName,
      COLUMN_NAME AS columnName,
      DATA_TYPE AS dataType,
      IS_NULLABLE AS isNullable
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_CATALOG = DB_NAME()
      AND TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `);
    return mapSchemaRowsToTables(result.recordset);
}
function mapSchemaRowsToTables(rows) {
    const tableMap = new Map();
    for (const row of rows) {
        const existingColumns = tableMap.get(row.tableName) ?? [];
        existingColumns.push({
            columnName: row.columnName,
            dataType: row.dataType,
            isNullable: row.isNullable === "YES"
        });
        tableMap.set(row.tableName, existingColumns);
    }
    return Array.from(tableMap.entries()).map(([tableName, columns]) => ({
        tableName,
        columns
    }));
}
function mapBootstrapStatus(bootstrapResult) {
    return {
        mode: bootstrapResult.mode,
        status: bootstrapResult.isReady ? "ready" : "degraded",
        migrated: bootstrapResult.migrated,
        usedBootstrapCredentials: bootstrapResult.usedBootstrapCredentials,
        canApplyInApp: bootstrapResult.canApplyInApp,
        applyActionMessage: bootstrapResult.applyActionMessage,
        message: bootstrapResult.message,
        hasSchemaVersionTable: bootstrapResult.hasSchemaVersionTable,
        expectedMigrationKey: bootstrapResult.expectedMigrationKey,
        currentMigrationKey: bootstrapResult.currentMigrationKey,
        pendingMigrationKeys: bootstrapResult.pendingMigrationKeys
    };
}
