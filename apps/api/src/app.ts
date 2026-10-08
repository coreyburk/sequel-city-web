import Fastify, { type FastifyInstance } from "fastify";
import { registerAdminRoutes } from "./routes/adminRoutes";
import { ensureDatabaseBootstrap } from "./services/databaseBootstrapService.ts";
import { registerCaseRoutes } from "./routes/caseRoutes";
import { registerQueryHistoryRoutes } from "./routes/queryHistoryRoutes";
import { registerHealthRoutes } from "./routes/healthRoutes";
import { registerQueryRoutes } from "./routes/queryRoutes";
import { registerSchemaRoutes } from "./routes/schemaRoutes";
import { registerCaseRuntimeRoutes } from "./routes/caseRuntimeRoutes.ts";
import { runtimeOrigins } from "./services/localLearnerService.ts";
import { isCaseRepositoryConfigured } from "./config/database.ts";

export async function buildApp(): Promise<FastifyInstance> {
  if (isCaseRepositoryConfigured() && [...runtimeOrigins()].some(origin => origin.startsWith("http:")) && !["127.0.0.1", "localhost", "::1"].includes(process.env.HOST?.trim() || "127.0.0.1")) {
    throw new Error("HTTP case runtime must bind to an explicit loopback host.");
  }
  const app = Fastify({
    logger: { redact: ["req.headers.cookie", "req.headers.authorization", "req.headers.x-csrf-token", "res.headers.set-cookie"] },
    ajv: { customOptions: { removeAdditional: false } }
  });

  const bootstrapResult = await ensureDatabaseBootstrap();

  if (bootstrapResult.migrated) {
    app.log.info({
      mode: bootstrapResult.mode,
      usedBootstrapCredentials: bootstrapResult.usedBootstrapCredentials,
      expectedMigrationKey: bootstrapResult.expectedMigrationKey,
      currentMigrationKey: bootstrapResult.currentMigrationKey,
      pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
    }, bootstrapResult.message);
  } else if (!bootstrapResult.isReady) {
    app.log.warn({
      mode: bootstrapResult.mode,
      expectedMigrationKey: bootstrapResult.expectedMigrationKey,
      currentMigrationKey: bootstrapResult.currentMigrationKey,
      pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
    }, bootstrapResult.message);
  } else {
    app.log.info({
      mode: bootstrapResult.mode,
      expectedMigrationKey: bootstrapResult.expectedMigrationKey,
      currentMigrationKey: bootstrapResult.currentMigrationKey,
      pendingMigrationCount: bootstrapResult.pendingMigrationKeys.length
    }, bootstrapResult.message);
  }

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;
    reply.header("Vary", "Origin");
    if (origin && runtimeOrigins().has(origin)) {
      reply.header("Access-Control-Allow-Origin", origin);
      reply.header("Access-Control-Allow-Credentials", "true");
    }
    reply.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token");

    if (request.method === "OPTIONS") {
      reply.code(204);
      await reply.send();
    }
  });

  await registerHealthRoutes(app);
  await registerAdminRoutes(app);
  await registerSchemaRoutes(app);
  await registerQueryRoutes(app);
  await registerQueryHistoryRoutes(app);
  await registerCaseRoutes(app);
  await registerCaseRuntimeRoutes(app);

  return app;
}
