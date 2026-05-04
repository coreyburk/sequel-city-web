import type { FastifyInstance } from "fastify";
import { getSchemaTables } from "../services/databaseMetadataService";

export async function registerSchemaRoutes(
  fastify: FastifyInstance
): Promise<void> {
  fastify.get("/api/schema/tables", async (_request, reply) => {
    try {
      return await getSchemaTables();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load schema metadata.";

      reply.code(500);
      return {
        message
      };
    }
  });
}
