export type CompletionMode = "query" | "log" | "verify";
export interface CaseDefinitionRecord {
  CaseId: string;
  ContentVersion: number;
  Title: string;
  Dossier: string;
  WholeCaseObjective: string;
  EntryStepKey: string;
  EvidenceVersion: string;
  CompletionScope: "evidence-review" | "full-resolution";
  ReleaseStatus: "draft" | "released" | "retired";
}
export interface CaseStepRecord {
  CaseId: string;
  ContentVersion: number;
  StepKey: string;
  DisplayOrder: number;
  TaskTitle: string;
  StepObjective: string;
  SamuelDirection: string;
  Hint: string | null;
  StarterSql: string | null;
  CompletionMode: CompletionMode;
  ValidatorKey: string;
  ValidatorParametersJson: string;
}
export interface CasePrerequisiteRecord {
  CaseId: string;
  ContentVersion: number;
  StepKey: string;
  RequiredStepKey: string;
}
export interface CaseContent {
  definition: CaseDefinitionRecord;
  steps: CaseStepRecord[];
  prerequisites: CasePrerequisiteRecord[];
}
export interface AttemptRecord {
  AttemptId: string;
  OwnerId: string;
  CaseId: string;
  ContentVersion: number;
  EvidenceVersion: string;
  Status: "active" | "completed" | "archived" | "incompatible";
  Revision: string;
  UpdatedAtUtc: Date;
  WorkspaceJson: string;
}
