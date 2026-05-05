"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryHistoryHandler = createQueryHistoryHandler;
exports.registerQueryHistoryRoutes = registerQueryHistoryRoutes;
const queryHistoryService_ts_1 = require("../services/queryHistoryService.ts");
function createQueryHistoryHandler(loadQueryHistory = queryHistoryService_ts_1.getQueryHistoryResponse) {
    return async () => {
        try {
            return loadQueryHistory();
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Unable to load query history.";
            return {
                success: false,
                message
            };
        }
    };
}
async function registerQueryHistoryRoutes(fastify, createHandler = createQueryHistoryHandler) {
    fastify.get("/api/query/history", async (_request, reply) => {
        const response = await createHandler()();
        if (!response.success) {
            reply.code(500);
        }
        return response;
    });
}
