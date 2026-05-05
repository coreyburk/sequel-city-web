"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.getSchemaTables = getSchemaTables;
const sqlServerPool_1 = require("../db/sqlServerPool");
async function checkDatabaseHealth() {
    const checkedAtUtc = new Date().toISOString();
    try {
        const pool = await (0, sqlServerPool_1.getSqlServerPool)();
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
async function getSchemaTables() {
    const pool = await (0, sqlServerPool_1.getSqlServerPool)();
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
