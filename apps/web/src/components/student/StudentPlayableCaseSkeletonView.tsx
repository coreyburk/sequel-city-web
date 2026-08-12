import { useState } from "react";
import {
  CASE_001_RECORD_COMPARISON_SLICE,
  CASE_001_TIMELINE_SLICE,
  createDefaultCase001SkeletonState,
  type Case001RecordComparisonOptionId,
  type Case001SkeletonState,
  type Case001TimelineOptionId
} from "../../studentCase001";
import type { SkeletonPlayableStudentCaseModule } from "../../studentCaseModule";

type StudentPlayableCaseSkeletonViewProps = {
  module: SkeletonPlayableStudentCaseModule;
};

export function StudentPlayableCaseSkeletonView({
  module
}: StudentPlayableCaseSkeletonViewProps): JSX.Element {
  const [skeletonState, setSkeletonState] = useState<Case001SkeletonState>(
    createDefaultCase001SkeletonState
  );
  const selectedTimelineOption =
    CASE_001_TIMELINE_SLICE.options.find(
      (option) => option.id === skeletonState.selectedTimelineOptionId
    ) ??
    null;
  const selectedRecordComparisonOption =
    CASE_001_RECORD_COMPARISON_SLICE.options.find(
      (option) => option.id === skeletonState.selectedRecordComparisonOptionId
    ) ??
    null;
  function handleTimelineOptionSelect(optionId: Case001TimelineOptionId): void {
    setSkeletonState((currentState) => ({
      ...currentState,
      selectedTimelineOptionId: optionId
    }));
  }
  function handleRecordComparisonOptionSelect(
    optionId: Case001RecordComparisonOptionId
  ): void {
    setSkeletonState((currentState) => ({
      ...currentState,
      selectedRecordComparisonOptionId: optionId
    }));
  }

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
              aria-pressed={skeletonState.selectedTimelineOptionId === option.id}
              onClick={() => handleTimelineOptionSelect(option.id)}
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

      <section
        className="case-001-record-comparison-slice"
        aria-labelledby="case-001-record-comparison-slice-title"
      >
        <div className="section-heading">
          <p className="message-muted">Public claim against records</p>
          <h3 id="case-001-record-comparison-slice-title">
            {CASE_001_RECORD_COMPARISON_SLICE.title}
          </h3>
          <p className="message-muted">{CASE_001_RECORD_COMPARISON_SLICE.prompt}</p>
        </div>

        <ol
          className="case-001-record-comparison-slice__records"
          aria-label="Public claim and record comparison"
        >
          {CASE_001_RECORD_COMPARISON_SLICE.records.map((record) => (
            <li key={`${record.source}-${record.claim}`}>
              <span className="case-001-record-comparison-slice__source">
                {record.source}
              </span>
              <span>{record.claim}</span>
            </li>
          ))}
        </ol>

        <div
          className="case-001-record-comparison-slice__options"
          role="group"
          aria-label="Record comparison options"
        >
          {CASE_001_RECORD_COMPARISON_SLICE.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="case-001-record-comparison-slice__option"
              aria-pressed={skeletonState.selectedRecordComparisonOptionId === option.id}
              onClick={() => handleRecordComparisonOptionSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedRecordComparisonOption ? (
          <p
            className={
              "isCorrect" in selectedRecordComparisonOption &&
              selectedRecordComparisonOption.isCorrect
                ? "case-001-record-comparison-slice__feedback case-001-record-comparison-slice__feedback--success"
                : "case-001-record-comparison-slice__feedback"
            }
            role="status"
          >
            {selectedRecordComparisonOption.feedback}
          </p>
        ) : null}
      </section>
    </section>
  );
}
