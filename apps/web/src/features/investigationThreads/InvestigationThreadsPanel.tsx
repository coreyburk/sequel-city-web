import { useMemo, useState } from "react";
import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import type { InvestigationThreadsApi } from "./useInvestigationThreads";
import { deriveThreadVisibilityModel } from "./threadVisibility";
import {
  DERIVED_THREAD_STATUS_DESCRIPTIONS,
  DERIVED_THREAD_STATUS_LABELS
} from "./types";
import type { DerivedThreadStatus, InvestigationThread } from "./types";

type InvestigationThreadsPanelProps = {
  completedMilestones: Record<MilestoneId, boolean>;
  threadsApi: InvestigationThreadsApi;
  notebookEntries: EvidenceNotebookEntry[];
};

function derivedStatusBadgeClass(status: DerivedThreadStatus): string {
  const slug = status.toLowerCase().replace(/\s+/g, "-");
  return `investigation-thread__status-badge investigation-thread__status-badge--${slug}`;
}

function derivedStatusModifierClass(status: DerivedThreadStatus): string {
  const slug = status.toLowerCase().replace(/\s+/g, "-");
  return `investigation-thread--${slug}`;
}

export function InvestigationThreadsPanel({
  completedMilestones,
  threadsApi,
  notebookEntries
}: InvestigationThreadsPanelProps): JSX.Element {
  const { threads, setThreadNotes, attachEvidence, detachEvidence } = threadsApi;
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

  const countSummary = `${visibilityModel.currentThreads.length} in play · ${visibilityModel.completedThreads.length} complete`;

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
    options: { isPrimary?: boolean } = {}
  ): JSX.Element {
    const isExpanded = expandedThreadId === thread.id;
    const availableEntries = notebookEntries.filter(
      (entry) =>
        !thread.evidenceLinks.some((link) => link.notebookEntryId === entry.id)
    );
    const derivedStatus =
      visibilityModel.derivedStatusById[thread.id] ?? "Later";
    const isCompleted = derivedStatus === "Completed";

    return (
      <li
        key={thread.id}
        className={[
          "investigation-thread",
          derivedStatusModifierClass(derivedStatus),
          options.isPrimary ? "investigation-thread--primary" : ""
        ]
          .filter(Boolean)
          .join(" ")}
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
          <span
            className={derivedStatusBadgeClass(derivedStatus)}
            aria-label={`Thread status: ${DERIVED_THREAD_STATUS_LABELS[derivedStatus]}`}
          >
            {DERIVED_THREAD_STATUS_LABELS[derivedStatus]}
          </span>
        </div>

        <p className="investigation-thread__summary">{thread.summary}</p>

        {isExpanded ? (
          <div className="investigation-thread__detail" id={`thread-detail-${thread.id}`}>
            <p className="investigation-thread__mentor" aria-label="Samuel's note">
              <span className="investigation-thread__mentor-tag">Samuel says:</span>{" "}
              {thread.mentorGuidance}
            </p>

            <p className="message-muted investigation-thread__status-hint">
              {DERIVED_THREAD_STATUS_DESCRIPTIONS[derivedStatus]}
            </p>

            <div className="investigation-thread__evidence">
              <p className="investigation-thread__section-title">Linked evidence</p>
              {thread.evidenceLinks.length === 0 ? (
                <p className="message-muted">
                  {isCompleted
                    ? "No notebook entries are linked to this completed trail. You can still attach later evidence for review."
                    : "No notebook entries are linked yet. Attach an entry below once you have logged a real query result for this trail."}
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
                placeholder="Write what you proved, what you still need, or what you want to come back to."
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
            Samuel keeps the next trail in front of you. The system tracks which
            trails are current, complete, or later — focus on logging evidence and
            reasoning through the case.
          </p>
        </div>
        <p
          className="investigation-threads-panel__summary"
          aria-live="polite"
        >
          {countSummary}
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
              Stay with the current Samuel-guided trail. Trails marked "Needs evidence" are open
              because the trail is in scope or you have already touched it.
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
            <>
              <p className="message-muted">
                Case progress closed these trails automatically. Review them if you want to revisit
                what you proved.
              </p>
              <ul className="investigation-thread-list investigation-thread-list--secondary">
                {visibilityModel.completedThreads.map((thread) => renderThread(thread))}
              </ul>
            </>
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
