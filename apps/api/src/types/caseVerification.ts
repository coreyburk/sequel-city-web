export interface CaseVerificationRequest {
  suspect: string;
}

export interface CaseVerificationData {
  suspect: string;
  verdict: string;
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
