import type { FastifyInstance } from "fastify";
import { getQueryHistoryResponse } from "../services/queryHistoryService.ts";
import type { QueryHistoryResponse } from "../types/queryHistory.ts";

interface QueryHistoryFailureResponse {
  success: false;
  message: string;
}

type QueryHistoryHandler = () => QueryHistoryResponse;
type QueryHistoryHandlerFactory = (
  loadQueryHistory?: QueryHistoryHandler
) => () => Promise<QueryHistoryResponse | QueryHistoryFailureResponse>;

export function createQueryHistoryHandler(
  loadQueryHistory: QueryHistoryHandler = getQueryHistoryResponse
): () => Promise<QueryHistoryResponse | QueryHistoryFailureResponse> {
  return async () => {
    try {
      return loadQueryHistory();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load query history.";

      return {
        success: false,
        message
      };
    }
  };
}

export async function registerQueryHistoryRoutes(
  fastify: FastifyInstance,
  createHandler: QueryHistoryHandlerFactory = createQueryHistoryHandler
): Promise<void> {
  fastify.get("/api/query/history", async (_request, reply) => {
    const response = await createHandler()();

    if (!response.success) {
      reply.code(500);
    }

    return response;
  });
}
