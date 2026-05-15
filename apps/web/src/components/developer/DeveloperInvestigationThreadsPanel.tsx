import { useMemo } from "react";
import {
  DERIVED_THREAD_STATUS_LABELS,
  deriveThreadVisibilityModel
} from "../../features/investigationThreads";
import type {
  DerivedThreadStatus,
  InvestigationThread
} from "../../features/investigationThreads";
import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";

type DeveloperInvestigationThreadsPanelProps = {
  threads: InvestigationThread[];
  completedMilestones: Record<MilestoneId, boolean>;
  notebookEntries: EvidenceNotebookEntry[];
};

const STATUS_DISPLAY_ORDER: DerivedThreadStatus[] = [
  "Current",
  "Needs Evidence",
  "Completed",
  "Later"
];

export function DeveloperInvestigationThreadsPanel({
  threads,
  completedMilestones,
  notebookEntries
}: DeveloperInvestigationThreadsPanelProps): JSX.Element {
  const visibilityModel = useMemo(
    () =>
      deriveThreadVisibilityModel({
        threads,
        completedMilestones,
        notebookEntries
      }),
    [completedMilestones, notebookEntries, threads]
  );

  const grouped: Record<DerivedThreadStatus, InvestigationThread[]> = useMemo(() => {
    const buckets: Record<DerivedThreadStatus, InvestigationThread[]> = {
      Current: [],
      "Needs Evidence": [],
      Completed: [],
      Later: []
    };

    for (const thread of threads) {
      const status = visibilityModel.derivedStatusById[thread.id] ?? "Later";
      buckets[status].push(thread);
    }

    return buckets;
  }, [threads, visibilityModel]);

  return (
    <section
      className="panel"
      aria-labelledby="developer-investigation-threads-title"
    >
      <div className="section-heading">
        <h2 id="developer-investigation-threads-title">
          Investigation Trail Diagnostics
        </h2>
        <p className="message-muted">
          Developer-only view of the deterministic trail visibility model.
          Students do not see this surface; trails are not part of the standard
          student workflow.
        </p>
      </div>
      <p className="message-muted">
        Primary thread: {visibilityModel.primaryThreadId ?? "None"}
      </p>
      {threads.length === 0 ? (
        <p className="message-muted">No trail data loaded.</p>
      ) : (
        <ul className="status-list">
          {STATUS_DISPLAY_ORDER.map((status) => {
            const bucket = grouped[status];
            if (bucket.length === 0) {
              return null;
            }

            return (
              <li key={status}>
                <strong>{DERIVED_THREAD_STATUS_LABELS[status]}</strong>
                <ul>
                  {bucket.map((thread) => (
                    <li key={thread.id}>
                      <code>{thread.id}</code> — {thread.title}
                      <span aria-hidden="true"> · </span>
                      <span>{thread.category}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
