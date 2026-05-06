import type {
  HealthFullResponse,
  QueryExecutionResponse,
  QueryHistoryApiResponse,
  QueryHistoryResponse,
  SchemaApiResponse,
  SchemaResponse
} from "./types";
import { BACKEND_UNAVAILABLE_GUIDANCE } from "../guidance";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3001";

interface RequestJsonOptions {
  init?: RequestInit;
  acceptStatus?: (status: number) => boolean;
}

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

export async function getSchemaTables(): Promise<SchemaResponse> {
  const response = await requestJson<SchemaApiResponse>("/api/schema/tables");

  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
}

export async function executeQuery(sql: string): Promise<QueryExecutionResponse> {
  return requestJson<QueryExecutionResponse>("/api/query/execute", {
    init: {
      method: "POST",
      body: JSON.stringify({ sql })
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
