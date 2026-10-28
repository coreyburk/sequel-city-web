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
export interface CaseFactDefinitionRecord { CaseId: string; ContentVersion: number; FactKey: string; Label: string; EvidenceColumn: string | null; ValueType: "text" | "integer" | "decimal" | "date"; Cardinality: "single" | "collection" }
export interface CaseBriefingFactRecord { CaseId: string; ContentVersion: number; FactKey: string; ItemKey: string; ValueType: CaseFactDefinitionRecord["ValueType"]; TextValue: string | null; IntegerValue: number | string | null; DecimalValue: number | string | null; DateValue: Date | string | null; DisplayValue: string }
export interface CaseStepFactBindingRecord { CaseId: string; ContentVersion: number; StepKey: string; FactKey: string; BindingUse: "input" | "output"; SourceStepKey: string | null; InsertOperator: "equals" | "prefix" | "contains" | null }
export interface BriefingFact { key: string; label: string; value: string; displayValue: string; eligibleForTask?: boolean; column: string; valueType: CaseFactDefinitionRecord["ValueType"]; operator: "equals" | "prefix" | "contains" }
export interface CaseContent {
  factDefinitions?: CaseFactDefinitionRecord[];
  briefingFacts?: CaseBriefingFactRecord[];
  factBindings?: CaseStepFactBindingRecord[];
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

export interface CaseWorkspace {
  draftSql: string;
  notes: string[];
  selectedView: "briefing" | "workbench" | "case-board";
}
export interface ProvenFact { key: string; label: string; value: string; sourceActionId: string; eligibleForTask?: boolean; column?: string | null; valueType?: "text" | "integer" | "decimal" | "date"; operator?: "equals" | "prefix" | "contains" }
export interface StepProof { StepKey: string; ActionId: string; ProofJson: string }
export interface AttemptSnapshot {
  caseId: string; contentVersion: number; evidenceVersion: string;
  attemptId: string; revision: string; status: AttemptRecord["Status"];
  completionScope: CaseDefinitionRecord["CompletionScope"];
  progress: { completed: number; total: number; savedAtUtc: string };
  evidenceSteps: { stepKey: string; title: string; status: "proved" | "current" }[];
  task: null | { stepKey: string; title: string; objective: string; direction: string; hint?: string; completionMode?: CompletionMode; theoryChoices?: string[]; collection?: { accepted: number; required: number };
    starter?: { sql: string; placeholders: Record<string, string> } };
  briefingFacts?: BriefingFact[];
  collectedDetails?: ProvenFact[]; facts: ProvenFact[]; workspace: CaseWorkspace;
}
export interface RuntimeMutation { requestId: string; expectedRevision: string }
export class CaseRuntimeError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, message: string) { super(message); this.statusCode = statusCode; }
}
