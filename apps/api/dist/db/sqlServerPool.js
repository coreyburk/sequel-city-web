"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSqlServerPool = getSqlServerPool;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../config/database");
let poolPromise = null;
async function getSqlServerPool() {
    if (!poolPromise) {
        const pool = new mssql_1.default.ConnectionPool((0, database_1.getSqlServerConfig)());
        poolPromise = pool.connect();
        pool.on("error", () => {
            poolPromise = null;
        });
    }
    try {
        return await poolPromise;
    }
    catch (error) {
        poolPromise = null;
        throw error;
    }
}
