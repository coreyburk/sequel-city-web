import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import { buildCase004InitialThreads } from "./case004Threads";
import { deriveThreadVisibilityModel } from "./threadVisibility";
import type { InvestigationThread } from "./types";

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
    expect(model.currentThreads.map((thread) => thread.id)).toEqual([
      "thread-crime-scene-report"
    ]);
    expect(model.laterThreads.map((thread) => thread.id)).toContain(
      "thread-witness-trail"
    );
    expect(model.derivedStatusById["thread-crime-scene-report"]).toBe("Current");
    expect(model.derivedStatusById["thread-witness-trail"]).toBe("Later");
  });

  it("promotes the witness trail after the crime-scene filter milestone and marks the prior thread Completed", () => {
    const model = deriveThreadVisibilityModel({
      threads: buildCase004InitialThreads(() => 1),
      completedMilestones: buildCompletedMilestones({
        "crime-scene-filter": true
      }),
      notebookEntries: []
    });

    expect(model.primaryThreadId).toBe("thread-witness-trail");
    expect(model.currentThreads.map((thread) => thread.id)).toEqual([
      "thread-witness-trail"
    ]);
    expect(model.completedThreads.map((thread) => thread.id)).toEqual([
      "thread-crime-scene-report"
    ]);
    expect(model.derivedStatusById["thread-crime-scene-report"]).toBe("Completed");
    expect(model.derivedStatusById["thread-witness-trail"]).toBe("Current");
  });

  it("marks learner-engaged later trails as Needs Evidence without revealing every future trail", () => {
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
    expect(model.laterThreads.map((thread) => thread.id)).toContain(
      "thread-event-and-employment"
    );
    expect(model.derivedStatusById["thread-vehicle-trace"]).toBe("Needs Evidence");
    expect(model.derivedStatusById["thread-event-and-employment"]).toBe("Later");
  });

  it("ignores legacy manual ThreadStatus when deriving student-facing status", () => {
    const baseThreads = buildCase004InitialThreads(() => 1);
    const threadsWithLegacyStatus: InvestigationThread[] = baseThreads.map(
      (thread) => {
        if (thread.id === "thread-event-and-employment") {
          return { ...thread, status: "Active" as const };
        }

        if (thread.id === "thread-vehicle-trace") {
          return { ...thread, status: "Resolved" as const };
        }

        return thread;
      }
    );

    const model = deriveThreadVisibilityModel({
      threads: threadsWithLegacyStatus,
      completedMilestones: buildCompletedMilestones(),
      notebookEntries: []
    });

    // Legacy Active should not promote a future trail into the current set.
    expect(model.derivedStatusById["thread-event-and-employment"]).toBe("Later");
    // Legacy Resolved must not auto-complete a thread the deterministic
    // milestone has not closed.
    expect(model.derivedStatusById["thread-vehicle-trace"]).toBe("Later");
    expect(model.completedThreads).toHaveLength(0);
    expect(model.progressResolvedIds.size).toBe(0);
  });

  it("promotes a non-primary in-stage trail to Needs Evidence when its milestone is open", () => {
    const model = deriveThreadVisibilityModel({
      threads: buildCase004InitialThreads(() => 1),
      completedMilestones: buildCompletedMilestones({
        "crime-scene-filter": true,
        "witness-clues": true
      }),
      notebookEntries: []
    });

    expect(model.primaryThreadId).toBe("thread-gym-membership");
    expect(model.derivedStatusById["thread-gym-membership"]).toBe("Current");
    expect(model.derivedStatusById["thread-person-lookup"]).toBe("Needs Evidence");
    expect(model.completedThreads.map((thread) => thread.id)).toEqual(
      expect.arrayContaining([
        "thread-crime-scene-report",
        "thread-witness-trail"
      ])
    );
  });
});
