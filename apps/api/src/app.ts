import Fastify, { type FastifyInstance } from "fastify";
import { registerQueryHistoryRoutes } from "./routes/queryHistoryRoutes";
import { registerHealthRoutes } from "./routes/healthRoutes";
import { registerQueryRoutes } from "./routes/queryRoutes";
import { registerSchemaRoutes } from "./routes/schemaRoutes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
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

  return app;
}
