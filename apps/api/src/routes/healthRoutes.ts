import type { FastifyInstance } from "fastify";
import { checkDatabaseHealth } from "../services/databaseMetadataService";

export async function registerHealthRoutes(
  fastify: FastifyInstance
): Promise<void> {
  fastify.get("/api/health/database", async (_request, reply) => {
    const response = await checkDatabaseHealth();
    const statusCode = response.isConnected ? 200 : 503;

    reply.code(statusCode);
    return response;
  });
}
