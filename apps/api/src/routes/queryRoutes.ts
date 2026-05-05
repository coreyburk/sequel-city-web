import type { FastifyInstance } from "fastify";
import { executeSafeQuery } from "../services/queryExecutionService";
import { validateSqlSafety } from "../services/sqlSafetyService";
import type {
  QueryExecutionRequest,
  QueryExecutionResponse
} from "../types/query";

export async function registerQueryRoutes(
  fastify: FastifyInstance
): Promise<void> {
  fastify.post<{ Body: QueryExecutionRequest }>(
    "/api/query/execute",
    async (request, reply) => {
      const { body } = request;

      if (!body || typeof body.sql !== "string") {
        const safety = validateSqlSafety("");
        const response: QueryExecutionResponse = {
          isExecuted: false,
          safety,
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 0,
          message: "Request body must include a string `sql` field."
        };

        reply.code(400);
        return response;
      }

      return executeSafeQuery(body.sql);
    }
  );
}
