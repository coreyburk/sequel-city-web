"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaTablesHandler = createSchemaTablesHandler;
exports.registerSchemaRoutes = registerSchemaRoutes;
const schemaService_ts_1 = require("../services/schemaService.ts");
function createSchemaTablesHandler(loadSchemaMetadata = schemaService_ts_1.getSchemaMetadata) {
    return async () => {
        try {
            return await loadSchemaMetadata();
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Unable to load schema metadata.";
            return {
                success: false,
                message
            };
        }
    };
}
async function registerSchemaRoutes(fastify, createHandler = createSchemaTablesHandler) {
    fastify.get("/api/schema/tables", async (_request, reply) => {
        const response = await createHandler()();
        if (!response.success) {
            reply.code(500);
        }
        return response;
    });
}
