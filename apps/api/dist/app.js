"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const queryHistoryRoutes_1 = require("./routes/queryHistoryRoutes");
const healthRoutes_1 = require("./routes/healthRoutes");
const queryRoutes_1 = require("./routes/queryRoutes");
const schemaRoutes_1 = require("./routes/schemaRoutes");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: true
    });
    await (0, healthRoutes_1.registerHealthRoutes)(app);
    await (0, schemaRoutes_1.registerSchemaRoutes)(app);
    await (0, queryRoutes_1.registerQueryRoutes)(app);
    await (0, queryHistoryRoutes_1.registerQueryHistoryRoutes)(app);
    return app;
}
