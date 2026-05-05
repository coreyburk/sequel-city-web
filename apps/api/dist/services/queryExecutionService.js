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
exports.executeSafeQuery = executeSafeQuery;
const queryHistoryService_ts_1 = require("./queryHistoryService.ts");
const queryResultNormalizer_ts_1 = require("./queryResultNormalizer.ts");
const sqlSafetyService_ts_1 = require("./sqlSafetyService.ts");
async function executeSafeQuery(sql, executeQuery = runQuery) {
    const startedAt = Date.now();
    const safety = (0, sqlSafetyService_ts_1.validateSqlSafety)(sql);
    if (!safety.isAllowed) {
        const executionTimeMs = Date.now() - startedAt;
        const response = {
            success: false,
            safety,
            executionTimeMs,
            message: `Query blocked: ${safety.message}`
        };
        (0, queryHistoryService_ts_1.addQueryHistoryRecord)({
            queryText: sql,
            outcome: "blocked",
            rowCount: null,
            executionTimeMs,
            errorMessage: safety.message
        });
        return response;
    }
    try {
        const rawRows = await executeQuery(sql);
        const normalizedResult = (0, queryResultNormalizer_ts_1.normalizeQueryResult)(rawRows);
        const executionTimeMs = Date.now() - startedAt;
        const response = {
            success: true,
            data: {
                columns: normalizedResult.columns,
                rows: normalizedResult.rows,
                rowCount: normalizedResult.rowCount
            },
            safety,
            executionTimeMs,
            message: "Query executed successfully."
        };
        (0, queryHistoryService_ts_1.addQueryHistoryRecord)({
            queryText: sql,
            outcome: "success",
            rowCount: normalizedResult.rowCount,
            executionTimeMs,
            errorMessage: null
        });
        return response;
    }
    catch (error) {
        const executionTimeMs = Date.now() - startedAt;
        const response = {
            success: false,
            safety,
            executionTimeMs,
            message: "Query execution failed. Verify the SQL and database connection."
        };
        (0, queryHistoryService_ts_1.addQueryHistoryRecord)({
            queryText: sql,
            outcome: "failed",
            rowCount: null,
            executionTimeMs,
            errorMessage: error instanceof Error ? error.message : response.message
        });
        return response;
    }
}
async function runQuery(sql) {
    const { getSqlServerPool } = await Promise.resolve().then(() => __importStar(require("../db/sqlServerPool.ts")));
    const pool = await getSqlServerPool();
    const result = await pool.request().query(sql);
    return result.recordset;
}
