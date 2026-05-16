import type { MilestoneId } from "../../studentCase";
import type { InvestigationStage, ReinforcementSignal } from "../queryReinforcement";

// Deterministic Samuel reaction categories. Each category is bound to a
// short authored mentor pool in mentorReactionPools.ts. Categories are
// selected from deterministic investigation state — never from runtime
// AI inference, suspect identity, or hidden answer rows.
export type SamuelReactionCategory =
  | "productive-narrowing"
  | "broad-query"
  | "useful-join"
  | "evidence-progression"
  | "investigation-persistence"
  | "clue-discovery";

export type SamuelReactionTone = "encouraging" | "redirecting" | "milestone";

export type SamuelReaction = {
  id: string;
  category: SamuelReactionCategory;
  tone: SamuelReactionTone;
  message: string;
};

// Snapshot of the learner-visible deterministic state required to decide
// whether a Samuel reaction should fire. The snapshot is built by the
// student case hook and is identical between repeated calls when inputs
// are unchanged.
export type SamuelReactionContext = {
  stage: InvestigationStage;
  reinforcement: ReinforcementSignal | null;
  completedMilestones: Record<MilestoneId, boolean>;
  notebookEntryCount: number;
  consecutiveBroadCount: number;
  hasFreshMilestone: boolean;
  freshMilestoneId: MilestoneId | null;
  hasFreshClueLog: boolean;
};

// Moderation memory carried in component state. Tracks the most recent
// reaction, queries since the last reaction, and category cooldown so the
// generator can suppress chatter without referencing case answers.
export type SamuelReactionMemory = {
  lastReactionId: string | null;
  lastCategory: SamuelReactionCategory | null;
  queriesSinceLastReaction: number;
  categoryCooldown: Record<SamuelReactionCategory, number>;
};
