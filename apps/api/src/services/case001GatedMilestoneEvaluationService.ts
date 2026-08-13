import type { QueryExecutionSuccessData } from "../types/query";
import {
  CASE_001_CLOCKTOWER_CASE_ID,
  CASE_001_CLOCKTOWER_EVIDENCE_TABLE_FAMILY,
  CASE_001_CLOCKTOWER_REPORT_MILESTONE_ID,
  type Case001ClocktowerReportValidationResult,
  validateCase001ClocktowerReportLocated
} from "./case001ResultPatternService.ts";

export const CASE_001_SKELETON_GATE_NAME =
  "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON";
export const CASE_001_SKELETON_GATE_ENABLED_VALUE = "true";

export type Case001GatedMilestoneEvaluationStatus =
  | "not-case-001"
  | "gate-disabled"
  | "evaluated-no-progression";

export interface Case001GatedMilestoneEvaluationRequest {
  caseId: string;
  isSkeletonGateEnabled: boolean;
  queryResult: QueryExecutionSuccessData;
}

export interface Case001GatedMilestoneEvaluationResult {
  caseId: string;
  milestoneId: typeof CASE_001_CLOCKTOWER_REPORT_MILESTONE_ID;
  evidenceTableFamily: typeof CASE_001_CLOCKTOWER_EVIDENCE_TABLE_FAMILY;
  gate: {
    name: typeof CASE_001_SKELETON_GATE_NAME;
    enabledValue: typeof CASE_001_SKELETON_GATE_ENABLED_VALUE;
    isEnabled: boolean;
  };
  evaluated: boolean;
  matched: boolean;
  matchedRowCount: number;
  runtimeStatus: Case001GatedMilestoneEvaluationStatus;
  milestoneAdvanced: false;
}

export type Case001ClocktowerReportValidator = (
  queryResult: QueryExecutionSuccessData
) => Case001ClocktowerReportValidationResult;

export function evaluateCase001GatedMilestone(
  request: Case001GatedMilestoneEvaluationRequest,
  validateClocktowerReport: Case001ClocktowerReportValidator =
    validateCase001ClocktowerReportLocated
): Case001GatedMilestoneEvaluationResult {
  if (request.caseId !== CASE_001_CLOCKTOWER_CASE_ID) {
    return createResult({
      caseId: request.caseId,
      isGateEnabled: request.isSkeletonGateEnabled,
      evaluated: false,
      matched: false,
      matchedRowCount: 0,
      runtimeStatus: "not-case-001"
    });
  }

  if (!request.isSkeletonGateEnabled) {
    return createResult({
      caseId: request.caseId,
      isGateEnabled: false,
      evaluated: false,
      matched: false,
      matchedRowCount: 0,
      runtimeStatus: "gate-disabled"
    });
  }

  const validatorResult = validateClocktowerReport(request.queryResult);

  return createResult({
    caseId: request.caseId,
    isGateEnabled: true,
    evaluated: true,
    matched: validatorResult.matched,
    matchedRowCount: validatorResult.matchedRowCount,
    runtimeStatus: "evaluated-no-progression"
  });
}

function createResult({
  caseId,
  isGateEnabled,
  evaluated,
  matched,
  matchedRowCount,
  runtimeStatus
}: {
  caseId: string;
  isGateEnabled: boolean;
  evaluated: boolean;
  matched: boolean;
  matchedRowCount: number;
  runtimeStatus: Case001GatedMilestoneEvaluationStatus;
}): Case001GatedMilestoneEvaluationResult {
  return {
    caseId,
    milestoneId: CASE_001_CLOCKTOWER_REPORT_MILESTONE_ID,
    evidenceTableFamily: CASE_001_CLOCKTOWER_EVIDENCE_TABLE_FAMILY,
    gate: {
      name: CASE_001_SKELETON_GATE_NAME,
      enabledValue: CASE_001_SKELETON_GATE_ENABLED_VALUE,
      isEnabled: isGateEnabled
    },
    evaluated,
    matched,
    matchedRowCount,
    runtimeStatus,
    milestoneAdvanced: false
  };
}
