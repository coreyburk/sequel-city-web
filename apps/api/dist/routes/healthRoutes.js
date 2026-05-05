"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = registerHealthRoutes;
const databaseMetadataService_1 = require("../services/databaseMetadataService");
async function registerHealthRoutes(fastify) {
    fastify.get("/api/health/database", async (_request, reply) => {
        const response = await (0, databaseMetadataService_1.checkDatabaseHealth)();
        const statusCode = response.isConnected ? 200 : 503;
        reply.code(statusCode);
        return response;
    });
}
