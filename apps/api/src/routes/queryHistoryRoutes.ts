import type { FastifyInstance } from "fastify";
import {
  clearQueryHistoryResponse,
  getQueryHistoryResponse
} from "../services/queryHistoryService.ts";
import type {
  ClearQueryHistoryResponse,
  QueryHistoryResponse
} from "../types/queryHistory.ts";

interface QueryHistoryFailureResponse {
  success: false;
  message: string;
}

type QueryHistoryHandler = () => QueryHistoryResponse;
type ClearQueryHistoryHandler = () => ClearQueryHistoryResponse;
type QueryHistoryHandlerFactory = (
  loadQueryHistory?: QueryHistoryHandler
) => () => Promise<QueryHistoryResponse | QueryHistoryFailureResponse>;
type ClearQueryHistoryHandlerFactory = (
  clearQueryHistory?: ClearQueryHistoryHandler
) => () => Promise<ClearQueryHistoryResponse | QueryHistoryFailureResponse>;

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

export function createClearQueryHistoryHandler(
  clearQueryHistory: ClearQueryHistoryHandler = clearQueryHistoryResponse
): () => Promise<ClearQueryHistoryResponse | QueryHistoryFailureResponse> {
  return async () => {
    try {
      return clearQueryHistory();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to clear query history.";

      return {
        success: false,
        message
      };
    }
  };
}

export async function registerQueryHistoryRoutes(
  fastify: FastifyInstance,
  createHandler: QueryHistoryHandlerFactory = createQueryHistoryHandler,
  createClearHandler: ClearQueryHistoryHandlerFactory = createClearQueryHistoryHandler
): Promise<void> {
  fastify.get("/api/query/history", async (_request, reply) => {
    const response = await createHandler()();

    if (!response.success) {
      reply.code(500);
    }

    return response;
  });

  fastify.delete("/api/query/history", async (_request, reply) => {
    const response = await createClearHandler()();

    if (!response.success) {
      reply.code(500);
    }

    return response;
  });
}
