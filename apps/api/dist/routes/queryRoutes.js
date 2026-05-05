"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerQueryRoutes = registerQueryRoutes;
const queryExecutionService_1 = require("../services/queryExecutionService");
const sqlSafetyService_1 = require("../services/sqlSafetyService");
async function registerQueryRoutes(fastify) {
    fastify.post("/api/query/execute", async (request, reply) => {
        const { body } = request;
        if (!body || typeof body.sql !== "string") {
            const safety = (0, sqlSafetyService_1.validateSqlSafety)("");
            const response = {
                success: false,
                safety,
                executionTimeMs: 0,
                message: "Request body must include a string `sql` field."
            };
            reply.code(400);
            return response;
        }
        return (0, queryExecutionService_1.executeSafeQuery)(body.sql);
    });
}
