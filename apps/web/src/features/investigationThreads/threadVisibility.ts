import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import type { DerivedThreadStatus, InvestigationThread } from "./types";

type ThreadVisibilityRule = {
  id: InvestigationThread["id"];
  unlockStage: number;
  completesOn?: MilestoneId;
};

export type ThreadVisibilityModel = {
  primaryThreadId: string | null;
  currentThreads: InvestigationThread[];
  completedThreads: InvestigationThread[];
  laterThreads: InvestigationThread[];
  derivedStatusById: Record<string, DerivedThreadStatus>;
  progressResolvedIds: ReadonlySet<string>;
};

const THREAD_VISIBILITY_RULES: ThreadVisibilityRule[] = [
  {
    id: "thread-crime-scene-report",
    unlockStage: 0,
    completesOn: "crime-scene-filter"
  },
  {
    id: "thread-witness-trail",
    unlockStage: 1,
    completesOn: "witness-clues"
  },
  {
    id: "thread-person-lookup",
    unlockStage: 2
  },
  {
    id: "thread-gym-membership",
    unlockStage: 2,
    completesOn: "gym-chain"
  },
  {
    id: "thread-vehicle-trace",
    unlockStage: 3
  },
  {
    id: "thread-event-and-employment",
    unlockStage: 4,
    completesOn: "mastermind-trace"
  }
];

function getCurrentStage(completedMilestones: Record<MilestoneId, boolean>): number {
  if (!completedMilestones["crime-scene-filter"]) {
    return 0;
  }

  if (!completedMilestones["witness-clues"]) {
    return 1;
  }

  if (!completedMilestones["gym-chain"]) {
    return 2;
  }

  if (!completedMilestones["trigger-check"]) {
    return 3;
  }

  if (!completedMilestones["mastermind-trace"]) {
    return 4;
  }

  return 5;
}

function getPrimaryThreadId(stage: number): string | null {
  if (stage === 0) {
    return "thread-crime-scene-report";
  }

  if (stage === 1) {
    return "thread-witness-trail";
  }

  if (stage === 2) {
    return "thread-gym-membership";
  }

  if (stage === 3) {
    return "thread-vehicle-trace";
  }

  if (stage === 4) {
    return "thread-event-and-employment";
  }

  return null;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function threadHasNotebookSignal(
  threadId: InvestigationThread["id"],
  notebookEntries: EvidenceNotebookEntry[]
): boolean {
  return notebookEntries.some((entry) => {
    const detail = normalize(entry.detail);

    if (threadId === "thread-crime-scene-report") {
      return (
        detail.includes("crimeid") ||
        detail.includes("reportid") ||
        detail.includes("reportcity") ||
        detail.includes("reportdate")
      );
    }

    if (threadId === "thread-witness-trail") {
      return (
        detail.includes("witness") ||
        detail.includes("interview") ||
        detail.includes("personid") ||
        detail.includes("annabel") ||
        detail.includes("northwestern") ||
        detail.includes("franklin")
      );
    }

    if (threadId === "thread-person-lookup") {
      return (
        detail.includes("personid") ||
        detail.includes("person lookup") ||
        detail.includes("address lookup") ||
        detail.includes("address") ||
        detail.includes("name")
      );
    }

    if (threadId === "thread-gym-membership") {
      return (
        detail.includes("gym") ||
        detail.includes("membership") ||
        detail.includes("48z") ||
        detail.includes("check-in") ||
        detail.includes("checkin")
      );
    }

    if (threadId === "thread-vehicle-trace") {
      return (
        detail.includes("bmw") ||
        detail.includes("plate") ||
        detail.includes("vehicle") ||
        detail.includes("h42w")
      );
    }

    if (threadId === "thread-event-and-employment") {
      return (
        detail.includes("event") ||
        detail.includes("employment") ||
        detail.includes("symphony") ||
        detail.includes("hall")
      );
    }

    return false;
  });
}

// Deterministic engagement signal. Looks only at learner-owned reasoning
// artifacts and notebook signal — never at the legacy manual ThreadStatus.
function isLearnerEngaged(
  thread: InvestigationThread,
  notebookEntries: EvidenceNotebookEntry[]
): boolean {
  return (
    thread.evidenceLinks.length > 0 ||
    thread.learnerNotes.trim().length > 0 ||
    threadHasNotebookSignal(thread.id, notebookEntries)
  );
}

export function deriveThreadVisibilityModel(input: {
  threads: InvestigationThread[];
  completedMilestones: Record<MilestoneId, boolean>;
  notebookEntries: EvidenceNotebookEntry[];
}): ThreadVisibilityModel {
  const currentStage = getCurrentStage(input.completedMilestones);
  const primaryThreadId = getPrimaryThreadId(currentStage);
  const rulesById = new Map(THREAD_VISIBILITY_RULES.map((rule) => [rule.id, rule]));
  const derivedStatusById: Record<string, DerivedThreadStatus> = {};
  const progressResolvedIds = new Set<string>();
  const currentThreads: InvestigationThread[] = [];
  const completedThreads: InvestigationThread[] = [];
  const laterThreads: InvestigationThread[] = [];

  for (const thread of input.threads) {
    const rule = rulesById.get(thread.id);
    const progressResolved = rule?.completesOn
      ? input.completedMilestones[rule.completesOn]
      : false;
    const engaged = isLearnerEngaged(thread, input.notebookEntries);
    const isPrimary = thread.id === primaryThreadId;
    const unlocked = rule ? rule.unlockStage <= currentStage : false;

    if (progressResolved) {
      progressResolvedIds.add(thread.id);
      derivedStatusById[thread.id] = "Completed";
      completedThreads.push(thread);
      continue;
    }

    if (isPrimary) {
      derivedStatusById[thread.id] = "Current";
      currentThreads.push(thread);
      continue;
    }

    if (unlocked || engaged) {
      derivedStatusById[thread.id] = "Needs Evidence";
      currentThreads.push(thread);
      continue;
    }

    derivedStatusById[thread.id] = "Later";
    laterThreads.push(thread);
  }

  const dedupedCurrentThreads = currentThreads.filter(
    (thread, index) =>
      currentThreads.findIndex((candidate) => candidate.id === thread.id) === index
  );

  return {
    primaryThreadId,
    currentThreads: dedupedCurrentThreads,
    completedThreads,
    laterThreads,
    derivedStatusById,
    progressResolvedIds
  };
}
