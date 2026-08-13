import type {
  QueryExecutionCaseMilestoneEvaluationRequest,
  QueryExecutionResponse,
  QueryExecutionSuccessData,
  RawQueryRow
} from "../types/query";
import {
  CASE_001_CLOCKTOWER_CASE_ID,
  CASE_001_CLOCKTOWER_REPORT_MILESTONE_ID
} from "./case001ResultPatternService.ts";
import {
  type Case001GatedMilestoneEvaluationRequest,
  type Case001GatedMilestoneEvaluationResult,
  evaluateCase001GatedMilestone
} from "./case001GatedMilestoneEvaluationService.ts";
import { addQueryHistoryRecord } from "./queryHistoryService.ts";
import { normalizeQueryResult } from "./queryResultNormalizer.ts";
import { validateSqlSafety } from "./sqlSafetyService.ts";
import {
  createRestrictedTableMessage,
  findStudentRestrictedTableReferences
} from "./studentRestrictedTables.ts";

type QueryExecutor = (sql: string) => Promise<RawQueryRow[]>;
type Case001MilestoneEvaluator = (
  request: Case001GatedMilestoneEvaluationRequest
) => Case001GatedMilestoneEvaluationResult;

export interface QueryExecutionOptions {
  caseMilestoneEvaluation?: QueryExecutionCaseMilestoneEvaluationRequest;
  evaluateCase001Milestone?: Case001MilestoneEvaluator;
}

export async function executeSafeQuery(
  sql: string,
  executeQuery: QueryExecutor = runQuery,
  options: QueryExecutionOptions = {}
): Promise<QueryExecutionResponse> {
  const startedAt = Date.now();
  const safety = validateSqlSafety(sql);

  if (!safety.isAllowed) {
    const executionTimeMs = Date.now() - startedAt;
    const response: QueryExecutionResponse = {
      success: false,
      safety,
      executionTimeMs,
      message: `Query blocked: ${safety.message}`
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "blocked",
      rowCount: null,
      executionTimeMs,
      errorMessage: safety.message
    });

    return response;
  }

  const restrictedTableReferences = findStudentRestrictedTableReferences(sql);

  if (restrictedTableReferences.length > 0) {
    const executionTimeMs = Date.now() - startedAt;
    const message = createRestrictedTableMessage(restrictedTableReferences);
    const restrictedSafety = {
      ...safety,
      isAllowed: false,
      violations: [
        {
          code: "RESTRICTED_TABLE" as const,
          message,
          token: restrictedTableReferences[0]?.tableName
        }
      ],
      message
    };
    const response: QueryExecutionResponse = {
      success: false,
      safety: restrictedSafety,
      executionTimeMs,
      message: `Query blocked: ${message}`
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "blocked",
      rowCount: null,
      executionTimeMs,
      errorMessage: message
    });

    return response;
  }

  try {
    const rawRows = await executeQuery(sql);
    const normalizedResult = normalizeQueryResult(rawRows);
    const successData: QueryExecutionSuccessData = {
      columns: normalizedResult.columns,
      rows: normalizedResult.rows,
      rowCount: normalizedResult.rowCount
    };
    const executionTimeMs = Date.now() - startedAt;

    const response: QueryExecutionResponse = {
      success: true,
      data: successData,
      safety,
      executionTimeMs,
      message: "Query executed successfully."
    };

    const milestoneEvaluation = createCase001MilestoneEvaluation(
      options.caseMilestoneEvaluation,
      successData,
      options.evaluateCase001Milestone ?? evaluateCase001GatedMilestone
    );

    if (milestoneEvaluation) {
      response.caseMilestoneEvaluation = milestoneEvaluation;
    }

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "success",
      rowCount: normalizedResult.rowCount,
      executionTimeMs,
      errorMessage: null
    });

    return response;
  } catch (error) {
    const executionTimeMs = Date.now() - startedAt;
    const response: QueryExecutionResponse = {
      success: false,
      safety,
      executionTimeMs,
      message: "Query execution failed. Verify the SQL and database connection."
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "failed",
      rowCount: null,
      executionTimeMs,
      errorMessage:
        error instanceof Error ? error.message : response.message
    });

    return response;
  }
}

async function runQuery(sql: string): Promise<RawQueryRow[]> {
  const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
  const pool = await getSqlServerPool();
  const result = await pool.request().query<RawQueryRow>(sql);
  return result.recordset;
}

function createCase001MilestoneEvaluation(
  request: QueryExecutionCaseMilestoneEvaluationRequest | undefined,
  queryResult: QueryExecutionSuccessData,
  evaluateMilestone: Case001MilestoneEvaluator
): Case001GatedMilestoneEvaluationResult | undefined {
  if (!request) {
    return undefined;
  }

  if (request.caseId !== CASE_001_CLOCKTOWER_CASE_ID) {
    return undefined;
  }

  if (request.milestoneId !== CASE_001_CLOCKTOWER_REPORT_MILESTONE_ID) {
    return undefined;
  }

  if (!request.isSkeletonGateEnabled) {
    return undefined;
  }

  return evaluateMilestone({
    caseId: request.caseId,
    isSkeletonGateEnabled: request.isSkeletonGateEnabled,
    queryResult
  });
}
