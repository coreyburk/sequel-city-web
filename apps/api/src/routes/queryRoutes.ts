import type { FastifyInstance } from "fastify";
import { executeSafeQuery } from "../services/queryExecutionService.ts";
import { validateSqlSafety } from "../services/sqlSafetyService.ts";
import type {
  QueryExecutionRequest,
  QueryExecutionResponse
} from "../types/query.ts";

export async function registerQueryRoutes(
  fastify: FastifyInstance,
  createHandler: () => (
    request: { body: QueryExecutionRequest | unknown },
    reply: { code: (statusCode: number) => void }
  ) => Promise<QueryExecutionResponse> = createQueryExecutionHandler
): Promise<void> {
  const handler = createHandler();

  fastify.post<{ Body: QueryExecutionRequest }>(
    "/api/query/execute",
    async (request, reply) => handler(request, reply)
  );
}

export function createQueryExecutionHandler(
  executeQuery: typeof executeSafeQuery = executeSafeQuery
): (
  request: { body: QueryExecutionRequest | unknown },
  reply: { code: (statusCode: number) => void }
) => Promise<QueryExecutionResponse> {
  return async (request, reply) => {
    const { body } = request;

    if (!isQueryExecutionRequest(body)) {
      const safety = validateSqlSafety("");
      const response: QueryExecutionResponse = {
        success: false,
        safety,
        executionTimeMs: 0,
        message: "Request body must include a string `sql` field."
      };

      reply.code(400);
      return response;
    }

    return executeQuery(body.sql, undefined, {
      caseMilestoneEvaluation: body.caseMilestoneEvaluation
    });
  };
}

function isQueryExecutionRequest(
  body: QueryExecutionRequest | unknown
): body is QueryExecutionRequest {
  return (
    typeof body === "object" &&
    body !== null &&
    "sql" in body &&
    typeof (body as QueryExecutionRequest).sql === "string"
  );
}
