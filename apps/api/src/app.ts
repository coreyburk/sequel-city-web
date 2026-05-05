import Fastify, { type FastifyInstance } from "fastify";
import { registerQueryHistoryRoutes } from "./routes/queryHistoryRoutes";
import { registerHealthRoutes } from "./routes/healthRoutes";
import { registerQueryRoutes } from "./routes/queryRoutes";
import { registerSchemaRoutes } from "./routes/schemaRoutes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  await registerHealthRoutes(app);
  await registerSchemaRoutes(app);
  await registerQueryRoutes(app);
  await registerQueryHistoryRoutes(app);

  return app;
}
