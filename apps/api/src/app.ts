import Fastify, { type FastifyInstance } from "fastify";
import { ensureDatabaseBootstrap } from "./services/databaseBootstrapService.ts";
import { registerCaseRoutes } from "./routes/caseRoutes";
import { registerQueryHistoryRoutes } from "./routes/queryHistoryRoutes";
import { registerHealthRoutes } from "./routes/healthRoutes";
import { registerQueryRoutes } from "./routes/queryRoutes";
import { registerSchemaRoutes } from "./routes/schemaRoutes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
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
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      reply.code(204);
      await reply.send();
    }
  });

  await registerHealthRoutes(app);
  await registerSchemaRoutes(app);
  await registerQueryRoutes(app);
  await registerQueryHistoryRoutes(app);
  await registerCaseRoutes(app);

  return app;
}
