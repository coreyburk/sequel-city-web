import Fastify, { type FastifyInstance } from "fastify";
import { registerHealthRoutes } from "./routes/healthRoutes";
import { registerSchemaRoutes } from "./routes/schemaRoutes";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  await registerHealthRoutes(app);
  await registerSchemaRoutes(app);

  return app;
}
