import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";

// Deterministic reinforcement categories. Each category maps to a fixed
// authored copy template selected by deterministic rules. No runtime AI,
// no suspect inference, and no hidden answer disclosure ever feeds into
// the selected category — see generateReinforcement.ts for the rule set.
export type ReinforcementCategory =
  | "productive-narrowing"
  | "useful-filtering"
  | "useful-join"
  | "relevant-evidence"
  | "investigation-alignment"
  | "overly-broad"
  | "unrelated-results"
  | "incomplete-chain";

export type ReinforcementTone = "positive" | "redirect" | "neutral";

export type ReinforcementSignal = {
  id: string;
  category: ReinforcementCategory;
  tone: ReinforcementTone;
  headline: string;
  message: string;
};

// Stage label used only to align reinforcement with the current Samuel-guided
// stage. The label is structural ("crime catalog stage", "witness trail
// stage") so that reinforcement never names hidden answers or future trails.
export type InvestigationStage =
  | "crime-catalog"
  | "report-filter"
  | "witness-trail"
  | "gym-trail"
  | "trigger-check"
  | "mastermind-trail"
  | "closed";

export type ReinforcementContext = {
  sql: string;
  rowCount: number | null;
  isSuccess: boolean;
  stage: InvestigationStage;
  completedMilestones: Record<MilestoneId, boolean>;
  notebookEntries: ReadonlyArray<EvidenceNotebookEntry>;
};
