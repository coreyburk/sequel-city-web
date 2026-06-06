"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const adminRoutes_1 = require("./routes/adminRoutes");
const databaseBootstrapService_ts_1 = require("./services/databaseBootstrapService.ts");
const caseRoutes_1 = require("./routes/caseRoutes");
const queryHistoryRoutes_1 = require("./routes/queryHistoryRoutes");
const healthRoutes_1 = require("./routes/healthRoutes");
const queryRoutes_1 = require("./routes/queryRoutes");
const schemaRoutes_1 = require("./routes/schemaRoutes");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true
    });
    const bootstrapResult = await (0, databaseBootstrapService_ts_1.ensureDatabaseBootstrap)();
    if (bootstrapResult.migrated) {
        app.log.info({
            mode: bootstrapResult.mode,
            usedBootstrapCredentials: bootstrapResult.usedBootstrapCredentials,
            expectedMigrationKey: bootstrapResult.expectedMigrationKey,
            currentMigrationKey: bootstrapResult.currentMigrationKey,
            pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
        }, bootstrapResult.message);
    }
    else if (!bootstrapResult.isReady) {
        app.log.warn({
            mode: bootstrapResult.mode,
            expectedMigrationKey: bootstrapResult.expectedMigrationKey,
            currentMigrationKey: bootstrapResult.currentMigrationKey,
            pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
        }, bootstrapResult.message);
    }
    else {
        app.log.info({
            mode: bootstrapResult.mode,
            expectedMigrationKey: bootstrapResult.expectedMigrationKey,
            currentMigrationKey: bootstrapResult.currentMigrationKey,
            pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
        }, bootstrapResult.message);
    }
    app.addHook("onRequest", async (request, reply) => {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type");
        if (request.method === "OPTIONS") {
            reply.code(204);
            await reply.send();
        }
    });
    await (0, healthRoutes_1.registerHealthRoutes)(app);
    await (0, adminRoutes_1.registerAdminRoutes)(app);
    await (0, schemaRoutes_1.registerSchemaRoutes)(app);
    await (0, queryRoutes_1.registerQueryRoutes)(app);
    await (0, queryHistoryRoutes_1.registerQueryHistoryRoutes)(app);
    await (0, caseRoutes_1.registerCaseRoutes)(app);
    return app;
}
