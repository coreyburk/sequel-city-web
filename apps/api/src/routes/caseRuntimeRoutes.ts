import type { FastifyInstance, FastifyRequest } from "fastify";
import { CaseAttemptService } from "../services/caseAttemptService.ts";
import { LocalLearnerService, capabilityFromCookie, checkCsrf, runtimeOrigins, runtimeSecret } from "../services/localLearnerService.ts";
import { CaseRuntimeError } from "../types/caseRuntime.ts";
import { isCaseRepositoryConfigured } from "../config/database.ts";

const uuid = { type: "string", pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" };
const revision = { type: "string", pattern: "^(0|[1-9][0-9]{0,18})$" };
const base = { requestId: uuid, expectedRevision: revision };
const mutationSchema = (extra = {}, required: string[] = []) => ({ type: "object", additionalProperties: false, required: ["requestId", "expectedRevision", ...required], properties: { ...base, ...extra } });
export async function registerCaseRuntimeRoutes(app: FastifyInstance, attempts = new CaseAttemptService(), learners = new LocalLearnerService(attempts.repository), enabled = isCaseRepositoryConfigured()): Promise<void> {
  const origins = runtimeOrigins();
  if (enabled) runtimeSecret();
  await app.register(async routes => {
    routes.setErrorHandler(async (error, request, reply) => {
      const clientStatus = typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 503;
      const code = error instanceof CaseRuntimeError ? error.statusCode : typeof error === "object" && error !== null && "validation" in error ? 400 : clientStatus;
      let snapshot;
      if (code === 409 && "attemptId" in (request.params as object)) {
        snapshot = await attempts.snapshot(await learners.owner(request.headers.cookie), (request.params as { attemptId: string }).attemptId).catch(() => undefined);
      }
      return reply.code(code).send({ message: code === 503 ? "Case repository unavailable. Saved work has not been discarded." : error instanceof Error ? error.message : "Invalid case request.", ...(snapshot ? { snapshot } : {}) });
    });
    routes.addHook("preHandler", async (request, reply) => {
      if (!enabled) return reply.code(503).send({ message: "Protected case runtime requires database/account and session configuration. Legacy saved work is preserved." });
      const mutation = request.method !== "GET" || request.url.split("?")[0] === "/api/session";
      if (mutation && (!request.headers.origin || !origins.has(request.headers.origin))) throw new CaseRuntimeError(403, "Open this case from a configured trusted origin.");
      if (request.method !== "GET") {
        if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) throw new CaseRuntimeError(415, "Case changes require JSON.");
        const capability = capabilityFromCookie(request.headers.cookie);
        if (!capability) throw new CaseRuntimeError(401, "Open a case session first.");
        checkCsrf(capability, request.headers["x-csrf-token"]);
      }
    });
    routes.get("/api/session", async (request, reply) => {
      const session = await learners.session(request.headers.cookie);
      const secure = new URL(request.headers.origin!).protocol === "https:";
      reply.header("Set-Cookie", `sequel_owner=${session.capability}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=31536000${secure ? "; Secure" : ""}`);
      reply.header("Cache-Control", "no-store");
      return { csrfToken: session.csrfToken };
    });
    routes.addHook("onSend", async (_request, reply) => { reply.header("Cache-Control", "no-store"); });
    routes.get("/api/cases", async () => ({ cases: await attempts.dossiers() }));
    const caseParams = { type: "object", required: ["caseId"], properties: { caseId: { type: "string", enum: ["case-001"] } } };
    const attemptParams = { type: "object", required: ["attemptId"], properties: { attemptId: uuid } };
    routes.get<{ Params: { caseId: string } }>("/api/cases/:caseId/attempts", { schema: { params: caseParams } }, async request => ({ attempts: await attempts.summaries(await learners.owner(request.headers.cookie), request.params.caseId) }));
    routes.post<{ Params: { caseId: string }; Body: Parameters<CaseAttemptService["fresh"]>[2] }>("/api/cases/:caseId/attempts", { schema: { params: caseParams, body: mutationSchema() } }, async request => attempts.fresh(await learners.owner(request.headers.cookie), request.params.caseId, request.body));
    routes.get<{ Params: { attemptId: string } }>("/api/attempts/:attemptId", { schema: { params: attemptParams } }, async request => attempts.snapshot(await learners.owner(request.headers.cookie), request.params.attemptId));
    for (const kind of ["resume", "archive", "delete"] as const) {
      routes.route<{ Params: { attemptId: string }; Body: Parameters<CaseAttemptService["lifecycle"]>[3] }>({ method: kind === "delete" ? "DELETE" : "POST", url: `/api/attempts/:attemptId${kind === "delete" ? "" : `/${kind}`}`, schema: { params: attemptParams, body: mutationSchema() }, handler: async request => attempts.lifecycle(await learners.owner(request.headers.cookie), request.params.attemptId, kind, request.body) });
    }
    routes.post<{ Params: { attemptId: string }; Body: Parameters<CaseAttemptService["query"]>[2] }>("/api/attempts/:attemptId/query", { schema: { params: attemptParams, body: mutationSchema({ sql: { type: "string", maxLength: 16384 } }, ["sql"]) } }, async (request, reply) => {
      const result = await attempts.query(await learners.owner(request.headers.cookie), request.params.attemptId, request.body);
      if (result.conflict) reply.code(409);
      return result;
    });
    routes.patch<{ Params: { attemptId: string }; Body: Parameters<CaseAttemptService["workspace"]>[2] }>("/api/attempts/:attemptId/workspace", { schema: { params: attemptParams, body: mutationSchema({ workspace: { type: "object", additionalProperties: false, required: ["draftSql", "notes", "selectedView"], properties: { draftSql: { type: "string", maxLength: 16384 }, notes: { type: "array", items: { type: "string" }, maxItems: 2000 }, selectedView: { type: "string", enum: ["briefing", "workbench", "case-board"] } } } }, ["workspace"]) } }, async request => attempts.workspace(await learners.owner(request.headers.cookie), request.params.attemptId, request.body));
    routes.post<{ Params: { attemptId: string }; Body: Parameters<CaseAttemptService["evidence"]>[2] }>("/api/attempts/:attemptId/evidence", { schema: { params: attemptParams, body: mutationSchema({ actionId: uuid, rowIndex: { type: "integer", minimum: 0, maximum: 99 }, annotation: { type: "string", maxLength: 2000 } }, ["actionId", "rowIndex"]) } }, async request => attempts.evidence(await learners.owner(request.headers.cookie), request.params.attemptId, request.body));
    routes.post("/api/attempts/:attemptId/verify", { schema: { params: attemptParams, body: mutationSchema({ suspect: { type: "string", maxLength: 200 } }, ["suspect"]) } }, async (request: FastifyRequest<{ Params: { attemptId: string } }>) => {
      await attempts.context(await learners.owner(request.headers.cookie), request.params.attemptId);
      throw new CaseRuntimeError(422, "Culprit verification is not released for this case. Complete the available evidence review.");
    });
  });
}
