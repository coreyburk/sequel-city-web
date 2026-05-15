import { useMemo, useState } from "react";
import type { EvidenceNotebookEntry } from "../../studentCase";
import type { MilestoneId } from "../../studentCase";
import type { InvestigationThreadsApi } from "./useInvestigationThreads";
import { deriveThreadVisibilityModel } from "./threadVisibility";
import {
  THREAD_STATUS_DESCRIPTIONS,
  THREAD_STATUS_ORDER
} from "./types";
import type { InvestigationThread, ThreadStatus } from "./types";

type InvestigationThreadsPanelProps = {
  completedMilestones: Record<MilestoneId, boolean>;
  threadsApi: InvestigationThreadsApi;
  notebookEntries: EvidenceNotebookEntry[];
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
  completedMilestones,
  threadsApi,
  notebookEntries
}: InvestigationThreadsPanelProps): JSX.Element {
  const { threads, setThreadStatus, setThreadNotes, attachEvidence, detachEvidence } = threadsApi;
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [attachSelections, setAttachSelections] = useState<Record<string, string>>({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [showLater, setShowLater] = useState(false);

  const visibilityModel = useMemo(
    () =>
      deriveThreadVisibilityModel({
        threads,
        completedMilestones,
        notebookEntries
      }),
    [completedMilestones, notebookEntries, threads]
  );

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

  function renderThread(
    thread: InvestigationThread,
    options: {
      isPrimary?: boolean;
      completedByProgress?: boolean;
    } = {}
  ): JSX.Element {
    const isExpanded = expandedThreadId === thread.id;
    const availableEntries = notebookEntries.filter(
      (entry) =>
        !thread.evidenceLinks.some((link) => link.notebookEntryId === entry.id)
    );
    const effectiveStatus = visibilityModel.effectiveStatusById[thread.id] ?? thread.status;
    const completedByProgress = options.completedByProgress ?? false;

    return (
      <li
        key={thread.id}
        className={[
          `investigation-thread investigation-thread--${effectiveStatus.toLowerCase()}`,
          options.isPrimary ? "investigation-thread--primary" : "",
          completedByProgress ? "investigation-thread--progress-complete" : ""
        ].filter(Boolean).join(" ")}
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
            {options.isPrimary ? (
              <span className="investigation-thread__priority-tag">Current focus</span>
            ) : null}
          </button>
          <span className={statusBadgeClass(effectiveStatus)}>
            {completedByProgress ? "Guided step complete" : effectiveStatus}
          </span>
        </div>

        <p className="investigation-thread__summary">{thread.summary}</p>

        {isExpanded ? (
          <div className="investigation-thread__detail" id={`thread-detail-${thread.id}`}>
            <p className="investigation-thread__mentor" aria-label="Samuel's note">
              <span className="investigation-thread__mentor-tag">Samuel says:</span>{" "}
              {thread.mentorGuidance}
            </p>

            <fieldset className="investigation-thread__status-controls" disabled={completedByProgress}>
              <legend className="investigation-thread__status-legend">
                Set thread status
              </legend>
              <p className="message-muted investigation-thread__status-hint">
                {completedByProgress
                  ? "Samuel's guided progression already completed this trail, so it is de-emphasized by default."
                  : THREAD_STATUS_DESCRIPTIONS[effectiveStatus]}
              </p>
              <div className="investigation-thread__status-buttons">
                {THREAD_STATUS_ORDER.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={statusButtonClass(status, status === effectiveStatus)}
                    aria-pressed={status === effectiveStatus}
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
            Samuel keeps the next trail in front of you. Completed and later trails stay tucked
            away unless you choose to review them.
          </p>
        </div>
        <p className="investigation-threads-panel__summary" aria-live="polite">
          {formatThreadCount(threads)}
        </p>
      </div>

      {visibilityModel.currentThreads.length === 0 ? (
        <p className="message-muted">
          No current trail is visible yet. Log a clue or advance Samuel's guided step to reveal the
          next investigation thread.
        </p>
      ) : (
        <>
          <div className="investigation-threads-panel__section-header">
            <p className="investigation-threads-panel__section-title">Current trails</p>
            <p className="message-muted">
              Focus on the current Samuel-guided step first. Other active work stays visible only if
              you already touched it.
            </p>
          </div>
          <ul className="investigation-thread-list">
            {visibilityModel.currentThreads.map((thread) =>
              renderThread(thread, { isPrimary: thread.id === visibilityModel.primaryThreadId })
            )}
          </ul>
        </>
      )}

      {visibilityModel.completedThreads.length > 0 ? (
        <section className="investigation-threads-panel__group">
          <button
            type="button"
            className="investigation-threads-panel__group-toggle"
            aria-expanded={showCompleted}
            onClick={() => setShowCompleted((current) => !current)}
          >
            Completed trails ({visibilityModel.completedThreads.length})
          </button>
          {showCompleted ? (
            <ul className="investigation-thread-list investigation-thread-list--secondary">
              {visibilityModel.completedThreads.map((thread) =>
                renderThread(thread, {
                  completedByProgress: visibilityModel.progressResolvedIds.has(thread.id)
                })
              )}
            </ul>
          ) : null}
        </section>
      ) : null}

      {visibilityModel.laterThreads.length > 0 ? (
        <section className="investigation-threads-panel__group">
          <button
            type="button"
            className="investigation-threads-panel__group-toggle"
            aria-expanded={showLater}
            onClick={() => setShowLater((current) => !current)}
          >
            Later trails ({visibilityModel.laterThreads.length})
          </button>
          {showLater ? (
            <>
              <p className="message-muted">
                These authored trails stay collapsed until Samuel reaches them or you intentionally
                review the broader board.
              </p>
              <ul className="investigation-thread-list investigation-thread-list--secondary">
                {visibilityModel.laterThreads.map((thread) => renderThread(thread))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
