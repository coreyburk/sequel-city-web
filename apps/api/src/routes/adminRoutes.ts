import type { FastifyInstance } from "fastify";
import {
  applyDatabaseBootstrapUpgrade,
  type DatabaseBootstrapApplyResult
} from "../services/databaseBootstrapService.ts";
import type { AdminBootstrapApplyResponse } from "../types/database.ts";

type DatabaseBootstrapApplyHandler = () => Promise<DatabaseBootstrapApplyResult>;
type DatabaseBootstrapApplyHandlerFactory = (
  runApply?: DatabaseBootstrapApplyHandler
) => () => Promise<AdminBootstrapApplyResponse>;

export function createAdminBootstrapApplyHandler(
  runApply: DatabaseBootstrapApplyHandler = applyDatabaseBootstrapUpgrade
): () => Promise<AdminBootstrapApplyResponse> {
  return async () => {
    const result = await runApply();
    if (!result.success) {
      return {
        success: false,
        message: result.message
      };
    }

    return {
      success: true,
      data: {
        bootstrap: {
          mode: result.bootstrap.mode,
          status: result.bootstrap.isReady ? "ready" : "degraded",
          migrated: result.bootstrap.migrated,
          usedBootstrapCredentials: result.bootstrap.usedBootstrapCredentials,
          canApplyInApp: result.bootstrap.canApplyInApp,
          applyActionMessage: result.bootstrap.applyActionMessage,
          message: result.bootstrap.message,
          hasSchemaVersionTable: result.bootstrap.hasSchemaVersionTable,
          expectedMigrationKey: result.bootstrap.expectedMigrationKey,
          currentMigrationKey: result.bootstrap.currentMigrationKey,
          pendingMigrationKeys: result.bootstrap.pendingMigrationKeys
        }
      },
      message: result.message
    };
  };
}

export async function registerAdminRoutes(
  fastify: FastifyInstance,
  createApplyHandler: DatabaseBootstrapApplyHandlerFactory = createAdminBootstrapApplyHandler
): Promise<void> {
  const applyHandler = createApplyHandler();

  fastify.post("/api/admin/bootstrap/apply", async (_request, reply) => {
    const response = await applyHandler();

    if (!response.success) {
      reply.code(409);
    }

    return response;
  });
}
