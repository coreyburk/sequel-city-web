import { buildCase004InitialThreads } from "./case004Threads";
import {
  attachEvidenceToThread,
  detachEvidenceFromThread,
  pruneStaleEvidenceLinks,
  updateThreadNotes,
  updateThreadStatus
} from "./threadState";

const FIXED_NOW = () => 1700000000000;

describe("threadState transitions", () => {
  it("updates a thread status and bumps updatedAt", () => {
    const threads = buildCase004InitialThreads(() => 1);
    const targetId = threads[0].id;

    const next = updateThreadStatus(threads, targetId, "Active", FIXED_NOW);

    const updated = next.find((thread) => thread.id === targetId);
    expect(updated?.status).toBe("Active");
    expect(updated?.updatedAt).toBe(FIXED_NOW());

    const untouched = next.find((thread) => thread.id !== targetId);
    expect(untouched?.updatedAt).toBe(1);
  });

  it("returns the same reference when status does not change", () => {
    const threads = buildCase004InitialThreads(() => 1);
    const targetId = threads[0].id;

    const next = updateThreadStatus(threads, targetId, "New", FIXED_NOW);

    expect(next.find((thread) => thread.id === targetId)).toBe(
      threads.find((thread) => thread.id === targetId)
    );
  });

  it("attaches and detaches notebook evidence without duplicates", () => {
    const threads = buildCase004InitialThreads(() => 1);
    const targetId = threads[0].id;

    const withAttached = attachEvidenceToThread(
      threads,
      targetId,
      { notebookEntryId: "note-1", detail: "CrimeID = 1080" },
      FIXED_NOW
    );
    const afterDuplicate = attachEvidenceToThread(
      withAttached,
      targetId,
      { notebookEntryId: "note-1", detail: "CrimeID = 1080" },
      FIXED_NOW
    );

    const attached = afterDuplicate.find((thread) => thread.id === targetId);
    expect(attached?.evidenceLinks).toHaveLength(1);
    expect(attached?.evidenceLinks[0].notebookEntryId).toBe("note-1");

    const detached = detachEvidenceFromThread(afterDuplicate, targetId, "note-1", FIXED_NOW);
    expect(detached.find((thread) => thread.id === targetId)?.evidenceLinks).toHaveLength(0);
  });

  it("updates learner notes only when the value changes", () => {
    const threads = buildCase004InitialThreads(() => 1);
    const targetId = threads[0].id;

    const next = updateThreadNotes(threads, targetId, "checking the city filter", FIXED_NOW);
    const updated = next.find((thread) => thread.id === targetId);
    expect(updated?.learnerNotes).toBe("checking the city filter");
    expect(updated?.updatedAt).toBe(FIXED_NOW());

    const sameAgain = updateThreadNotes(next, targetId, "checking the city filter", FIXED_NOW);
    expect(sameAgain.find((thread) => thread.id === targetId)).toBe(updated);
  });

  it("prunes stale evidence links when notebook entries are removed", () => {
    const threads = buildCase004InitialThreads(() => 1);
    const targetId = threads[0].id;

    const withAttached = attachEvidenceToThread(
      threads,
      targetId,
      { notebookEntryId: "note-1", detail: "CrimeID = 1080" },
      FIXED_NOW
    );

    const pruned = pruneStaleEvidenceLinks(withAttached, new Set(["note-2"]), FIXED_NOW);
    expect(pruned.find((thread) => thread.id === targetId)?.evidenceLinks).toHaveLength(0);
  });
});
