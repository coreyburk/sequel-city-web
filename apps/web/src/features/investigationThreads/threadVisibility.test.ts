import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import { buildCase004InitialThreads } from "./case004Threads";
import { deriveThreadVisibilityModel } from "./threadVisibility";

function buildCompletedMilestones(
  overrides: Partial<Record<MilestoneId, boolean>> = {}
): Record<MilestoneId, boolean> {
  return {
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "trigger-check": false,
    "mastermind-trace": false,
    ...overrides
  };
}

describe("deriveThreadVisibilityModel", () => {
  it("keeps only the first guided thread in the default current set at the start", () => {
    const model = deriveThreadVisibilityModel({
      threads: buildCase004InitialThreads(() => 1),
      completedMilestones: buildCompletedMilestones(),
      notebookEntries: []
    });

    expect(model.primaryThreadId).toBe("thread-crime-scene-report");
    expect(model.currentThreads.map((thread) => thread.id)).toEqual(["thread-crime-scene-report"]);
    expect(model.laterThreads.map((thread) => thread.id)).toContain("thread-witness-trail");
  });

  it("promotes the witness trail after the crime-scene filter milestone and resolves the prior thread by progress", () => {
    const model = deriveThreadVisibilityModel({
      threads: buildCase004InitialThreads(() => 1),
      completedMilestones: buildCompletedMilestones({
        "crime-scene-filter": true
      }),
      notebookEntries: []
    });

    expect(model.primaryThreadId).toBe("thread-witness-trail");
    expect(model.currentThreads.map((thread) => thread.id)).toEqual(["thread-witness-trail"]);
    expect(model.completedThreads.map((thread) => thread.id)).toEqual(["thread-crime-scene-report"]);
    expect(model.effectiveStatusById["thread-crime-scene-report"]).toBe("Resolved");
  });

  it("keeps learner-engaged later trails visible without revealing every future trail", () => {
    const notebookEntries: EvidenceNotebookEntry[] = [
      {
        id: "manual-note-1",
        detail: 'Need to check the red BMW and the plate fragment "H42W" next.'
      }
    ];

    const model = deriveThreadVisibilityModel({
      threads: buildCase004InitialThreads(() => 1),
      completedMilestones: buildCompletedMilestones(),
      notebookEntries
    });

    expect(model.currentThreads.map((thread) => thread.id)).toEqual([
      "thread-crime-scene-report",
      "thread-vehicle-trace"
    ]);
    expect(model.laterThreads.map((thread) => thread.id)).toContain("thread-event-and-employment");
  });
});
