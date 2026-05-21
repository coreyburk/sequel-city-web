export interface CaseVerificationRequest {
  suspect: string;
}

export type CaseAnswerRole = "trigger_man" | "mastermind";
export type CaseVerificationNextRole = "mastermind" | "closed" | null;

export interface CaseVerificationData {
  suspect: string;
  verdict: string;
  caseId: string;
  isCorrect: boolean;
  solvedRole: CaseAnswerRole | null;
  nextRole: CaseVerificationNextRole;
  suspectPersonId: number | null;
}

export interface CaseVerificationSuccessResponse {
  success: true;
  data: CaseVerificationData;
  message: string;
}

export interface CaseVerificationFailureResponse {
  success: false;
  message: string;
}

export type CaseVerificationResponse =
  | CaseVerificationSuccessResponse
  | CaseVerificationFailureResponse;
