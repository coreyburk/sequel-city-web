"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseHealthHandler = createDatabaseHealthHandler;
exports.createFullHealthHandler = createFullHealthHandler;
exports.registerHealthRoutes = registerHealthRoutes;
const databaseMetadataService_ts_1 = require("../services/databaseMetadataService.ts");
function createDatabaseHealthHandler(checkHealth = databaseMetadataService_ts_1.checkDatabaseHealth) {
    return async () => checkHealth();
}
function createFullHealthHandler(loadDiagnostics = databaseMetadataService_ts_1.getBackendDiagnostics) {
    return async () => loadDiagnostics();
}
async function registerHealthRoutes(fastify, createDatabaseHandler = createDatabaseHealthHandler, createDiagnosticHandler = createFullHealthHandler) {
    const databaseHandler = createDatabaseHandler();
    const fullHealthHandler = createDiagnosticHandler();
    fastify.get("/api/health/database", async (_request, reply) => {
        const response = await databaseHandler();
        const statusCode = response.isConnected ? 200 : 503;
        reply.code(statusCode);
        return response;
    });
    fastify.get("/api/health/full", async (_request, reply) => {
        const response = await fullHealthHandler();
        const statusCode = response.data.database.isConnected && response.data.bootstrap.status === "ready"
            ? 200
            : 503;
        reply.code(statusCode);
        return response;
    });
}
