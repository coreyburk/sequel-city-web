import type { FastifyInstance } from "fastify";
import { getSchemaMetadata } from "../services/schemaService.ts";
import type {
  SchemaFailureResponse,
  SchemaResponse
} from "../types/schema.ts";

type SchemaHandler = () => Promise<SchemaResponse>;
type SchemaHandlerFactory = (
  loadSchemaMetadata?: SchemaHandler
) => () => Promise<SchemaResponse | SchemaFailureResponse>;

export function createSchemaTablesHandler(
  loadSchemaMetadata: SchemaHandler = getSchemaMetadata
): () => Promise<SchemaResponse | SchemaFailureResponse> {
  return async () => {
    try {
      return await loadSchemaMetadata();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load schema metadata.";

      return {
        success: false,
        message
      };
    }
  };
}

export async function registerSchemaRoutes(
  fastify: FastifyInstance,
  createHandler: SchemaHandlerFactory = createSchemaTablesHandler
): Promise<void> {
  fastify.get("/api/schema/tables", async (_request, reply) => {
    const response = await createHandler()();

    if (!response.success) {
      reply.code(500);
    }

    return response;
  });
}
