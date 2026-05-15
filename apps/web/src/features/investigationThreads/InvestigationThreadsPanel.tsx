import { useMemo, useState } from "react";
import type { EvidenceNotebookEntry } from "../../studentCase";
import type { InvestigationThreadsApi } from "./useInvestigationThreads";
import {
  THREAD_STATUS_DESCRIPTIONS,
  THREAD_STATUS_ORDER
} from "./types";
import type { InvestigationThread, ThreadStatus } from "./types";

type InvestigationThreadsPanelProps = {
  threadsApi: InvestigationThreadsApi;
  notebookEntries: EvidenceNotebookEntry[];
};

type ThreadFilter = "open" | "resolved" | "all";

const FILTER_LABELS: Record<ThreadFilter, string> = {
  open: "Open trails",
  resolved: "Resolved trails",
  all: "All trails"
};

function isOpenStatus(status: ThreadStatus): boolean {
  return status === "New" || status === "Active" || status === "Blocked";
}

function statusBadgeClass(status: ThreadStatus): string {
  return `investigation-thread__status-badge investigation-thread__status-badge--${status.toLowerCase()}`;
}

function statusButtonClass(status: ThreadStatus, isCurrent: boolean): string {
  const base = `investigation-thread__status-button investigation-thread__status-button--${status.toLowerCase()}`;
  return isCurrent ? `${base} is-current` : base;
}

function formatThreadCount(threads: InvestigationThread[]): string {
  const open = threads.filter((thread) => isOpenStatus(thread.status)).length;
  const resolved = threads.filter((thread) => thread.status === "Resolved").length;
  return `${open} open · ${resolved} resolved`;
}

export function InvestigationThreadsPanel({
  threadsApi,
  notebookEntries
}: InvestigationThreadsPanelProps): JSX.Element {
  const { threads, setThreadStatus, setThreadNotes, attachEvidence, detachEvidence } = threadsApi;
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ThreadFilter>("open");
  const [attachSelections, setAttachSelections] = useState<Record<string, string>>({});

  const filteredThreads = useMemo(() => {
    if (filter === "all") {
      return threads;
    }

    if (filter === "resolved") {
      return threads.filter((thread) => thread.status === "Resolved");
    }

    return threads.filter((thread) => isOpenStatus(thread.status));
  }, [filter, threads]);

  const notebookEntryById = useMemo(() => {
    const map = new Map<string, EvidenceNotebookEntry>();
    for (const entry of notebookEntries) {
      map.set(entry.id, entry);
    }
    return map;
  }, [notebookEntries]);

  function toggleExpanded(threadId: string): void {
    setExpandedThreadId((current) => (current === threadId ? null : threadId));
  }

  function handleAttachSelected(threadId: string): void {
    const selectedId = attachSelections[threadId];
    if (!selectedId) {
      return;
    }

    const entry = notebookEntryById.get(selectedId);
    if (!entry) {
      return;
    }

    attachEvidence(threadId, {
      notebookEntryId: entry.id,
      detail: entry.detail
    });

    setAttachSelections((current) => {
      const next = { ...current };
      delete next[threadId];
      return next;
    });
  }

  return (
    <section
      className="panel investigation-threads-panel"
      aria-labelledby="investigation-threads-title"
    >
      <div className="section-heading section-heading--compact investigation-threads-panel__heading">
        <div>
          <h2 id="investigation-threads-title">Investigation Threads</h2>
          <p className="message-muted">
            Track every lead Samuel raises. You decide when each trail moves from New to Active,
            Blocked, or Resolved.
          </p>
        </div>
        <p className="investigation-threads-panel__summary" aria-live="polite">
          {formatThreadCount(threads)}
        </p>
      </div>

      <div
        className="investigation-threads-panel__filters"
        role="group"
        aria-label="Filter threads"
      >
        {(Object.keys(FILTER_LABELS) as ThreadFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            className="investigation-threads-panel__filter"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {FILTER_LABELS[value]}
          </button>
        ))}
      </div>

      {filteredThreads.length === 0 ? (
        <p className="message-muted">
          No threads match this filter yet. Switch filters or come back after logging new evidence.
        </p>
      ) : (
        <ul className="investigation-thread-list">
          {filteredThreads.map((thread) => {
            const isExpanded = expandedThreadId === thread.id;
            const availableEntries = notebookEntries.filter(
              (entry) =>
                !thread.evidenceLinks.some((link) => link.notebookEntryId === entry.id)
            );

            return (
              <li
                key={thread.id}
                className={`investigation-thread investigation-thread--${thread.status.toLowerCase()}`}
              >
                <div className="investigation-thread__header">
                  <button
                    type="button"
                    className="investigation-thread__toggle"
                    aria-expanded={isExpanded}
                    aria-controls={`thread-detail-${thread.id}`}
                    onClick={() => toggleExpanded(thread.id)}
                  >
                    <span className="investigation-thread__category" aria-hidden="true">
                      {thread.category}
                    </span>
                    <span className="investigation-thread__title">{thread.title}</span>
                  </button>
                  <span className={statusBadgeClass(thread.status)}>{thread.status}</span>
                </div>

                <p className="investigation-thread__summary">{thread.summary}</p>

                {isExpanded ? (
                  <div className="investigation-thread__detail" id={`thread-detail-${thread.id}`}>
                    <p className="investigation-thread__mentor" aria-label="Samuel's note">
                      <span className="investigation-thread__mentor-tag">Samuel says:</span>{" "}
                      {thread.mentorGuidance}
                    </p>

                    <fieldset className="investigation-thread__status-controls">
                      <legend className="investigation-thread__status-legend">
                        Set thread status
                      </legend>
                      <p className="message-muted investigation-thread__status-hint">
                        {THREAD_STATUS_DESCRIPTIONS[thread.status]}
                      </p>
                      <div className="investigation-thread__status-buttons">
                        {THREAD_STATUS_ORDER.map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={statusButtonClass(status, status === thread.status)}
                            aria-pressed={status === thread.status}
                            onClick={() => setThreadStatus(thread.id, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="investigation-thread__evidence">
                      <p className="investigation-thread__section-title">Linked evidence</p>
                      {thread.evidenceLinks.length === 0 ? (
                        <p className="message-muted">
                          No notebook entries are linked yet. Attach an entry below once you have
                          logged a real query result for this trail.
                        </p>
                      ) : (
                        <ul className="investigation-thread__evidence-list">
                          {thread.evidenceLinks.map((link) => {
                            const stillExists = notebookEntryById.has(link.notebookEntryId);

                            return (
                              <li key={link.notebookEntryId}>
                                <span>
                                  {link.detail}
                                  {stillExists ? null : (
                                    <em className="investigation-thread__evidence-missing">
                                      {" "}(notebook entry removed)
                                    </em>
                                  )}
                                </span>
                                <button
                                  type="button"
                                  className="investigation-thread__evidence-remove"
                                  aria-label={`Unlink ${link.detail}`}
                                  onClick={() => detachEvidence(thread.id, link.notebookEntryId)}
                                >
                                  Unlink
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {availableEntries.length > 0 ? (
                        <div className="investigation-thread__attach">
                          <label
                            className="input-label"
                            htmlFor={`thread-attach-${thread.id}`}
                          >
                            Attach a notebook entry
                          </label>
                          <select
                            id={`thread-attach-${thread.id}`}
                            className="investigation-thread__attach-select"
                            value={attachSelections[thread.id] ?? ""}
                            onChange={(event) =>
                              setAttachSelections((current) => ({
                                ...current,
                                [thread.id]: event.target.value
                              }))
                            }
                          >
                            <option value="">Select an entry...</option>
                            {availableEntries.map((entry) => (
                              <option key={entry.id} value={entry.id}>
                                {entry.detail}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="investigation-thread__attach-button"
                            onClick={() => handleAttachSelected(thread.id)}
                            disabled={!attachSelections[thread.id]}
                          >
                            Link to thread
                          </button>
                        </div>
                      ) : notebookEntries.length === 0 ? (
                        <p className="message-muted">
                          Log a clue in the Evidence Notebook first, then come back to link it here.
                        </p>
                      ) : null}
                    </div>

                    <div className="investigation-thread__notes">
                      <label
                        className="input-label"
                        htmlFor={`thread-notes-${thread.id}`}
                      >
                        Your notes on this thread
                      </label>
                      <textarea
                        id={`thread-notes-${thread.id}`}
                        className="investigation-thread__notes-input"
                        value={thread.learnerNotes}
                        rows={3}
                        onChange={(event) => setThreadNotes(thread.id, event.target.value)}
                        placeholder="Write what you proved, what you still need, or why you blocked this trail."
                      />
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
