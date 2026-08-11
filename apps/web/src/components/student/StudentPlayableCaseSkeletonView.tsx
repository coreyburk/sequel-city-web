import { useState } from "react";
import {
  CASE_001_TIMELINE_SLICE,
  type Case001TimelineOptionId
} from "../../studentCase001";
import type { SkeletonPlayableStudentCaseModule } from "../../studentCaseModule";

type StudentPlayableCaseSkeletonViewProps = {
  module: SkeletonPlayableStudentCaseModule;
};

export function StudentPlayableCaseSkeletonView({
  module
}: StudentPlayableCaseSkeletonViewProps): JSX.Element {
  const [selectedTimelineOptionId, setSelectedTimelineOptionId] =
    useState<Case001TimelineOptionId | null>(null);
  const selectedTimelineOption =
    CASE_001_TIMELINE_SLICE.options.find((option) => option.id === selectedTimelineOptionId) ??
    null;

  return (
    <section
      className="panel panel--full guidance-panel"
      aria-labelledby="student-playable-skeleton-title"
    >
      <div className="section-heading">
        <p className="message-muted">{module.libraryEntry.landingEyebrow}</p>
        <h2 id="student-playable-skeleton-title">
          {`Case ${module.skeleton.caseNumber}: ${module.skeleton.caseName}`}
        </h2>
        <p className="message-muted">{module.libraryEntry.landingTagline}</p>
      </div>

      <div className="student-setup-card" aria-label="Case 001 skeleton status">
        <p>{module.skeleton.status}</p>
        <p>{module.skeleton.summary}</p>
        <p>
          This gated skeleton proves Case 001 can enter through the playable-case module
          boundary. Full gameplay, persistence, SQL progression, evidence logging, and suspect
          verification are not implemented in this build path.
        </p>
      </div>

      <section
        className="case-001-timeline-slice"
        aria-labelledby="case-001-timeline-slice-title"
      >
        <div className="section-heading">
          <p className="message-muted">Record-backed timing</p>
          <h3 id="case-001-timeline-slice-title">{CASE_001_TIMELINE_SLICE.title}</h3>
          <p className="message-muted">{CASE_001_TIMELINE_SLICE.prompt}</p>
        </div>

        <ol className="case-001-timeline-slice__records" aria-label="Ceremony timing records">
          {CASE_001_TIMELINE_SLICE.records.map((record) => (
            <li key={`${record.time}-${record.label}`}>
              <span className="case-001-timeline-slice__time">{record.time}</span>
              <span>
                <strong>{record.label}</strong>{" "}
                {record.detail}
              </span>
            </li>
          ))}
        </ol>

        <div className="case-001-timeline-slice__options" role="group" aria-label="Timing gap options">
          {CASE_001_TIMELINE_SLICE.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="case-001-timeline-slice__option"
              aria-pressed={selectedTimelineOptionId === option.id}
              onClick={() => setSelectedTimelineOptionId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedTimelineOption ? (
          <p
            className={
              "isCorrect" in selectedTimelineOption && selectedTimelineOption.isCorrect
                ? "case-001-timeline-slice__feedback case-001-timeline-slice__feedback--success"
                : "case-001-timeline-slice__feedback"
            }
            role="status"
          >
            {selectedTimelineOption.feedback}
          </p>
        ) : null}
      </section>
    </section>
  );
}
