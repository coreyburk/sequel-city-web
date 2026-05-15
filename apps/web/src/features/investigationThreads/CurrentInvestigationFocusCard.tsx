import { useMemo, useState } from "react";
import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import { deriveThreadVisibilityModel } from "./threadVisibility";
import {
  DERIVED_THREAD_STATUS_DESCRIPTIONS,
  DERIVED_THREAD_STATUS_LABELS
} from "./types";
import type { DerivedThreadStatus, InvestigationThread } from "./types";

type CurrentInvestigationFocusCardProps = {
  completedMilestones: Record<MilestoneId, boolean>;
  threads: InvestigationThread[];
  notebookEntries: EvidenceNotebookEntry[];
};

function derivedStatusBadgeClass(status: DerivedThreadStatus): string {
  const slug = status.toLowerCase().replace(/\s+/g, "-");
  return `current-focus-card__status-badge current-focus-card__status-badge--${slug}`;
}

export function CurrentInvestigationFocusCard({
  completedMilestones,
  threads,
  notebookEntries
}: CurrentInvestigationFocusCardProps): JSX.Element {
  const [showTrailReview, setShowTrailReview] = useState(false);

  const visibilityModel = useMemo(
    () =>
      deriveThreadVisibilityModel({
        threads,
        completedMilestones,
        notebookEntries
      }),
    [completedMilestones, notebookEntries, threads]
  );

  const focusThread =
    visibilityModel.currentThreads.find(
      (thread) => thread.id === visibilityModel.primaryThreadId
    ) ?? visibilityModel.currentThreads[0] ?? null;

  const focusStatus: DerivedThreadStatus | null = focusThread
    ? visibilityModel.derivedStatusById[focusThread.id] ?? "Current"
    : null;

  const hasReviewableTrails =
    visibilityModel.completedThreads.length > 0 ||
    visibilityModel.laterThreads.length > 0;

  return (
    <section
      className="panel current-focus-card"
      aria-labelledby="current-focus-card-title"
    >
      <div className="section-heading section-heading--compact current-focus-card__heading">
        <h2 id="current-focus-card-title">Current Investigation Focus</h2>
        <p className="message-muted">
          Samuel keeps you on one trail at a time. The notebook is where evidence
          lives. This card just explains the trail you are on right now.
        </p>
      </div>

      {focusThread && focusStatus ? (
        <article
          className="current-focus-card__body"
          aria-label="Current trail context"
        >
          <header className="current-focus-card__row">
            <span
              className="current-focus-card__category"
              aria-label={`Trail category: ${focusThread.category}`}
            >
              {focusThread.category}
            </span>
            <span
              className={derivedStatusBadgeClass(focusStatus)}
              aria-label={`Trail status: ${DERIVED_THREAD_STATUS_LABELS[focusStatus]}`}
            >
              {DERIVED_THREAD_STATUS_LABELS[focusStatus]}
            </span>
          </header>

          <h3 className="current-focus-card__title">{focusThread.title}</h3>

          <p className="current-focus-card__purpose">{focusThread.summary}</p>

          <p className="current-focus-card__mentor" aria-label="Samuel's guidance">
            <span className="current-focus-card__mentor-tag">Samuel says:</span>{" "}
            {focusThread.mentorGuidance}
          </p>

          <p className="message-muted current-focus-card__status-hint">
            {DERIVED_THREAD_STATUS_DESCRIPTIONS[focusStatus]}
          </p>
        </article>
      ) : (
        <p className="message-muted current-focus-card__empty">
          No trail is in play yet. Log the clue Samuel is asking for and the next
          trail will surface here.
        </p>
      )}

      {hasReviewableTrails ? (
        <section
          className="current-focus-card__review"
          aria-labelledby="current-focus-card-review-toggle"
        >
          <button
            type="button"
            id="current-focus-card-review-toggle"
            className="current-focus-card__review-toggle"
            aria-expanded={showTrailReview}
            aria-controls="current-focus-card-review-panel"
            onClick={() => setShowTrailReview((current) => !current)}
          >
            Review investigation trails
          </button>
          {showTrailReview ? (
            <div
              id="current-focus-card-review-panel"
              className="current-focus-card__review-panel"
            >
              <p className="message-muted">
                Optional context. Keep working from Samuel&apos;s guidance and the
                notebook — this panel is just for reviewing trails you have already
                closed or trails that are not yet in play.
              </p>
              {visibilityModel.completedThreads.length > 0 ? (
                <div className="current-focus-card__review-group">
                  <p className="current-focus-card__review-group-title">
                    Closed trails
                  </p>
                  <ul className="current-focus-card__review-list">
                    {visibilityModel.completedThreads.map((thread) => (
                      <li key={thread.id}>
                        <span className="current-focus-card__category current-focus-card__category--inline">
                          {thread.category}
                        </span>
                        <span className="current-focus-card__review-title">
                          {thread.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {visibilityModel.laterThreads.length > 0 ? (
                <div className="current-focus-card__review-group">
                  <p className="current-focus-card__review-group-title">
                    Not in play yet
                  </p>
                  <ul className="current-focus-card__review-list">
                    {visibilityModel.laterThreads.map((thread) => (
                      <li key={thread.id}>
                        <span className="current-focus-card__category current-focus-card__category--inline">
                          {thread.category}
                        </span>
                        <span className="current-focus-card__review-title">
                          {thread.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
