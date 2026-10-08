import type {
  AdminBootstrapApplyApiResponse,
  AdminBootstrapApplySuccessResponse,
  CaseVerificationApiResponse,
  CaseVerificationSuccessResponse,
  ClearQueryHistoryApiResponse,
  ClearQueryHistoryResponse,
  HealthFullResponse,
  QueryExecutionCaseMilestoneEvaluationRequest,
  QueryExecutionResponse,
  QueryHistoryApiResponse,
  QueryHistoryResponse,
  SchemaApiResponse,
  SchemaResponse
} from "./types";
import { BACKEND_UNAVAILABLE_GUIDANCE } from "../guidance";
import type { AttemptSnapshot, AttemptSummary, CaseDossier, CaseWorkspace, RuntimeQueryResponse } from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? `http://${typeof window === "undefined" ? "127.0.0.1" : window.location.hostname}:3001`;

interface RequestJsonOptions {
  init?: RequestInit;
  acceptStatus?: (status: number) => boolean;
}

let sessionPromise: Promise<{ csrfToken: string }> | null = null;
export function caseSession(): Promise<{ csrfToken: string }> {
  sessionPromise ??= requestJson<{ csrfToken: string }>("/api/session", { init: { credentials: "include" } }).catch(error => { sessionPromise = null; throw error; });
  return sessionPromise;
}
export class RuntimeRequestError extends Error {
  readonly status: number; readonly snapshot?: AttemptSnapshot;
  constructor(message: string, status: number, snapshot?: AttemptSnapshot) { super(message); this.status = status; this.snapshot = snapshot; }
}
export async function caseRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const session = await caseSession();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method, credentials: "include", headers: { "Content-Type": "application/json", ...(method !== "GET" ? { "X-CSRF-Token": session.csrfToken } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  } catch { throw new Error(BACKEND_UNAVAILABLE_GUIDANCE); }
  const result = await response.json() as T & { message?: string; snapshot?: AttemptSnapshot };
  if (!response.ok && !(response.status === 409 && path.endsWith("/query") && (result as { success?: boolean; progressSaved?: boolean }).success === true && (result as { progressSaved?: boolean }).progressSaved === false)) {
    if (response.status === 401 || response.status === 403) sessionPromise = null;
    throw new RuntimeRequestError(result.message ?? "Case request failed.", response.status, result.snapshot);
  }
  return result;
}
export const getCaseDossiers = () => caseRequest<{ cases: CaseDossier[] }>("/api/cases");
export const getCaseAttempts = (caseId: string) => caseRequest<{ attempts: AttemptSummary[] }>(`/api/cases/${encodeURIComponent(caseId)}/attempts`);
export const getCaseAttempt = (id: string) => caseRequest<AttemptSnapshot>(`/api/attempts/${id}`);
export const createCaseAttempt = (caseId: string, requestId = crypto.randomUUID()) => caseRequest<AttemptSnapshot>(`/api/cases/${caseId}/attempts`, "POST", { requestId, expectedRevision: "0" });
export const resumeCaseAttempt = (s: Pick<AttemptSnapshot, "attemptId" | "revision">) => caseRequest<AttemptSnapshot>(`/api/attempts/${s.attemptId}/resume`, "POST", { requestId: crypto.randomUUID(), expectedRevision: s.revision });
export const saveCaseWorkspace = (s: AttemptSnapshot, workspace: CaseWorkspace, requestId = crypto.randomUUID()) => caseRequest<AttemptSnapshot>(`/api/attempts/${s.attemptId}/workspace`, "PATCH", { requestId, expectedRevision: s.revision, workspace });
export const executeAttemptQuery = (s: AttemptSnapshot, sql: string, requestId = crypto.randomUUID()) => caseRequest<RuntimeQueryResponse>(`/api/attempts/${s.attemptId}/query`, "POST", { requestId, expectedRevision: s.revision, sql });
export const logAttemptRow = (s: AttemptSnapshot, actionId: string, rowIndex: number) => caseRequest<AttemptSnapshot>(`/api/attempts/${s.attemptId}/evidence`, "POST", { requestId: crypto.randomUUID(), expectedRevision: s.revision, actionId, rowIndex });

async function requestJson<T>(
  path: string,
  options: RequestJsonOptions = {}
): Promise<T> {
  let response: Response;
  const { init, acceptStatus } = options;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      ...init
    });
  } catch {
    throw new Error(BACKEND_UNAVAILABLE_GUIDANCE);
  }

  const body = (await response.json()) as T;
  const isAcceptedStatus = acceptStatus?.(response.status) ?? false;

  if (!response.ok && !isAcceptedStatus) {
    const maybeFailure = body as { message?: string };
    throw new Error(
      maybeFailure.message ?? `Request failed with status ${response.status}.`
    );
  }

  return body;
}

export async function getFullHealth(): Promise<HealthFullResponse> {
  return requestJson<HealthFullResponse>("/api/health/full", {
    acceptStatus: (status) => status === 503
  });
}

export async function applyDatabaseUpgrade(): Promise<AdminBootstrapApplySuccessResponse> {
  const response = await requestJson<AdminBootstrapApplyApiResponse>(
    "/api/admin/bootstrap/apply",
    {
      init: {
        method: "POST",
        body: JSON.stringify({})
      },
      acceptStatus: (status) => status === 400 || status === 409
    }
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}

export async function getSchemaTables(): Promise<SchemaResponse> {
  const response = await requestJson<SchemaApiResponse>("/api/schema/tables");

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}

export interface ExecuteQueryOptions {
  caseMilestoneEvaluation?: QueryExecutionCaseMilestoneEvaluationRequest;
}

export async function executeQuery(
  sql: string,
  options: ExecuteQueryOptions = {}
): Promise<QueryExecutionResponse> {
  const body = options.caseMilestoneEvaluation
    ? { sql, caseMilestoneEvaluation: options.caseMilestoneEvaluation }
    : { sql };

  return requestJson<QueryExecutionResponse>("/api/query/execute", {
    init: {
      method: "POST",
      body: JSON.stringify(body)
    }
  });
}

export async function getQueryHistory(): Promise<QueryHistoryResponse> {
  const response = await requestJson<QueryHistoryApiResponse>("/api/query/history");

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}

export async function clearQueryHistory(): Promise<ClearQueryHistoryResponse> {
  const response = await requestJson<ClearQueryHistoryApiResponse>(
    "/api/query/history",
    {
      init: {
        method: "DELETE"
      }
    }
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}

export async function verifySuspect(
  suspect: string
): Promise<CaseVerificationSuccessResponse> {
  const response = await requestJson<CaseVerificationApiResponse>(
    "/api/case/verify-suspect",
    {
      init: {
        method: "POST",
        body: JSON.stringify({ suspect })
      }
    }
  );

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}
