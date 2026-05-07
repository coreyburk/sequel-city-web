import type { FastifyInstance } from "fastify";
import {
  verifySuspect,
  type SuspectVerifier
} from "../services/caseVerificationService.ts";
import type {
  CaseVerificationFailureResponse,
  CaseVerificationRequest,
  CaseVerificationResponse
} from "../types/caseVerification.ts";

const INVALID_SUSPECT_MESSAGE =
  "Request body must include a non-empty string `suspect` field.";

type CaseVerificationHandler = (
  suspect: string,
  verifyWithDatabase?: SuspectVerifier
) => Promise<CaseVerificationResponse>;

type CaseVerificationHandlerFactory = (
  verifyCaseSuspect?: CaseVerificationHandler
) => (
  request: { body?: Partial<CaseVerificationRequest> | null },
  reply: { code: (statusCode: number) => void }
) => Promise<CaseVerificationResponse | CaseVerificationFailureResponse>;

export function createCaseVerificationHandler(
  verifyCaseSuspect: CaseVerificationHandler = verifySuspect
): (
  request: { body?: Partial<CaseVerificationRequest> | null },
  reply: { code: (statusCode: number) => void }
) => Promise<CaseVerificationResponse | CaseVerificationFailureResponse> {
  return async (request, reply) => {
    const suspect = request.body?.suspect;

    if (typeof suspect !== "string" || suspect.trim().length === 0) {
      reply.code(400);
      return {
        success: false,
        message: INVALID_SUSPECT_MESSAGE
      };
    }

    const response = await verifyCaseSuspect(suspect);

    if (!response.success) {
      reply.code(500);
    }

    return response;
  };
}

export async function registerCaseRoutes(
  fastify: FastifyInstance,
  createHandler: CaseVerificationHandlerFactory = createCaseVerificationHandler
): Promise<void> {
  fastify.post<{ Body: CaseVerificationRequest }>(
    "/api/case/verify-suspect",
    async (request, reply) => createHandler()(request, reply)
  );
}
