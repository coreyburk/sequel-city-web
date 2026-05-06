import type { FastifyInstance } from "fastify";
import {
  checkDatabaseHealth,
  getBackendDiagnostics
} from "../services/databaseMetadataService.ts";
import type {
  BackendDiagnosticResponse,
  DatabaseHealthResponse
} from "../types/database";

type DatabaseHealthHandler = () => Promise<DatabaseHealthResponse>;
type DatabaseHealthHandlerFactory = (
  checkHealth?: DatabaseHealthHandler
) => () => Promise<DatabaseHealthResponse>;
type BackendDiagnosticHandler = () => Promise<BackendDiagnosticResponse>;
type BackendDiagnosticHandlerFactory = (
  loadDiagnostics?: BackendDiagnosticHandler
) => () => Promise<BackendDiagnosticResponse>;

export function createDatabaseHealthHandler(
  checkHealth: DatabaseHealthHandler = checkDatabaseHealth
): () => Promise<DatabaseHealthResponse> {
  return async () => checkHealth();
}

export function createFullHealthHandler(
  loadDiagnostics: BackendDiagnosticHandler = getBackendDiagnostics
): () => Promise<BackendDiagnosticResponse> {
  return async () => loadDiagnostics();
}

export async function registerHealthRoutes(
  fastify: FastifyInstance,
  createDatabaseHandler: DatabaseHealthHandlerFactory = createDatabaseHealthHandler,
  createDiagnosticHandler: BackendDiagnosticHandlerFactory = createFullHealthHandler
): Promise<void> {
  const databaseHandler = createDatabaseHandler();
  const fullHealthHandler = createDiagnosticHandler();

  fastify.get("/api/health/database", async (_request, reply) => {
    const response = await databaseHandler();
    const statusCode = response.isConnected ? 200 : 503;

    reply.code(statusCode);
    return response;
  });

  fastify.get("/api/health/full", async (_request, reply) => {
    const response = await fullHealthHandler();
    const statusCode = response.data.database.isConnected ? 200 : 503;

    reply.code(statusCode);
    return response;
  });
}
