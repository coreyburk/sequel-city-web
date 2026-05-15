import type { InvestigationThread, ThreadEvidenceLink, ThreadStatus } from "./types";

export function updateThreadStatus(
  threads: InvestigationThread[],
  threadId: string,
  nextStatus: ThreadStatus,
  now: () => number = Date.now
): InvestigationThread[] {
  return threads.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    if (thread.status === nextStatus) {
      return thread;
    }

    return {
      ...thread,
      status: nextStatus,
      updatedAt: now()
    };
  });
}

export function updateThreadNotes(
  threads: InvestigationThread[],
  threadId: string,
  nextNotes: string,
  now: () => number = Date.now
): InvestigationThread[] {
  return threads.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    if (thread.learnerNotes === nextNotes) {
      return thread;
    }

    return {
      ...thread,
      learnerNotes: nextNotes,
      updatedAt: now()
    };
  });
}

export function attachEvidenceToThread(
  threads: InvestigationThread[],
  threadId: string,
  link: Omit<ThreadEvidenceLink, "attachedAt">,
  now: () => number = Date.now
): InvestigationThread[] {
  return threads.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    if (thread.evidenceLinks.some((existing) => existing.notebookEntryId === link.notebookEntryId)) {
      return thread;
    }

    return {
      ...thread,
      evidenceLinks: [
        ...thread.evidenceLinks,
        { ...link, attachedAt: now() }
      ],
      updatedAt: now()
    };
  });
}

export function detachEvidenceFromThread(
  threads: InvestigationThread[],
  threadId: string,
  notebookEntryId: string,
  now: () => number = Date.now
): InvestigationThread[] {
  return threads.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    const nextLinks = thread.evidenceLinks.filter(
      (link) => link.notebookEntryId !== notebookEntryId
    );

    if (nextLinks.length === thread.evidenceLinks.length) {
      return thread;
    }

    return {
      ...thread,
      evidenceLinks: nextLinks,
      updatedAt: now()
    };
  });
}

export function pruneStaleEvidenceLinks(
  threads: InvestigationThread[],
  knownNotebookEntryIds: ReadonlySet<string>,
  now: () => number = Date.now
): InvestigationThread[] {
  return threads.map((thread) => {
    const nextLinks = thread.evidenceLinks.filter((link) =>
      knownNotebookEntryIds.has(link.notebookEntryId)
    );

    if (nextLinks.length === thread.evidenceLinks.length) {
      return thread;
    }

    return {
      ...thread,
      evidenceLinks: nextLinks,
      updatedAt: now()
    };
  });
}
