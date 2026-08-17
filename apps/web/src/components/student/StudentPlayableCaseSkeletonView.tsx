import { useState, type FormEvent } from "react";
import { executeQuery } from "../../api/client";
import {
  CASE_001_CLUE_NARROWING_SLICE,
  CASE_001_ENTRY_ID,
  CASE_001_RECORD_COMPARISON_SLICE,
  CASE_001_TIMELINE_SLICE,
  buildCase001SkeletonCheckpoint,
  createDefaultCase001SkeletonState,
  type Case001ClueNarrowingOptionId,
  type Case001RecordComparisonOptionId,
  type Case001SkeletonState,
  type Case001SqlFeedbackSlice,
  type Case001SqlMilestoneId,
  type Case001TimelineOptionId
} from "../../studentCase001";
import type { SkeletonPlayableStudentCaseModule } from "../../studentCaseModule";

type StudentPlayableCaseSkeletonViewProps = {
  module: SkeletonPlayableStudentCaseModule;
};

type FirstSqlFeedbackState =
  | {
      status: "idle";
      message: null;
      tone: "neutral";
    }
  | {
      status: "loading";
      message: string;
      tone: "neutral";
    }
  | {
      status: "success" | "no-match" | "error";
      message: string;
      tone: "success" | "warning";
    };

type SqlFeedbackStateByMilestone = Record<Case001SqlMilestoneId, FirstSqlFeedbackState>;
type SqlQueryByMilestone = Record<Case001SqlMilestoneId, string>;

function createInitialSqlQueries(
  slices: readonly Case001SqlFeedbackSlice[]
): SqlQueryByMilestone {
  return Object.fromEntries(
    slices.map((slice) => [slice.milestoneId, slice.starterSql])
  ) as SqlQueryByMilestone;
}

function createInitialSqlFeedback(
  slices: readonly Case001SqlFeedbackSlice[]
): SqlFeedbackStateByMilestone {
  return Object.fromEntries(
    slices.map((slice) => [
      slice.milestoneId,
      {
        status: "idle",
        message: null,
        tone: "neutral"
      }
    ])
  ) as SqlFeedbackStateByMilestone;
}

export function StudentPlayableCaseSkeletonView({
  module
}: StudentPlayableCaseSkeletonViewProps): JSX.Element {
  const [skeletonState, setSkeletonState] = useState<Case001SkeletonState>(
    createDefaultCase001SkeletonState
  );
  const [sqlQueries, setSqlQueries] = useState<SqlQueryByMilestone>(() =>
    createInitialSqlQueries(module.sqlFeedbackSlices)
  );
  const [sqlFeedbackByMilestone, setSqlFeedbackByMilestone] =
    useState<SqlFeedbackStateByMilestone>(() =>
      createInitialSqlFeedback(module.sqlFeedbackSlices)
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
  const selectedClueNarrowingOption =
    CASE_001_CLUE_NARROWING_SLICE.options.find(
      (option) => option.id === skeletonState.selectedClueNarrowingOptionId
    ) ??
    null;
  const checkpoint = buildCase001SkeletonCheckpoint(skeletonState);

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
  function handleClueNarrowingOptionSelect(optionId: Case001ClueNarrowingOptionId): void {
    setSkeletonState((currentState) => ({
      ...currentState,
      selectedClueNarrowingOptionId: optionId
    }));
  }

  function setMilestoneFeedback(
    milestoneId: Case001SqlMilestoneId,
    feedback: FirstSqlFeedbackState
  ): void {
    setSqlFeedbackByMilestone((currentFeedback) => ({
      ...currentFeedback,
      [milestoneId]: feedback
    }));
  }

  function handleSqlQueryChange(milestoneId: Case001SqlMilestoneId, value: string): void {
    setSqlQueries((currentQueries) => ({
      ...currentQueries,
      [milestoneId]: value
    }));
  }

  async function handleSqlFeedbackSubmit(
    event: FormEvent<HTMLFormElement>,
    slice: Case001SqlFeedbackSlice
  ): Promise<void> {
    event.preventDefault();

    const sql = sqlQueries[slice.milestoneId] ?? "";

    if (!sql.trim()) {
      setMilestoneFeedback(slice.milestoneId, {
        status: "error",
        message: slice.emptyQueryMessage,
        tone: "warning"
      });
      return;
    }

    setMilestoneFeedback(slice.milestoneId, {
      status: "loading",
      message: slice.loadingMessage,
      tone: "neutral"
    });

    try {
      const response = await executeQuery(sql, {
        caseMilestoneEvaluation: {
          caseId: CASE_001_ENTRY_ID,
          milestoneId: slice.milestoneId,
          isSkeletonGateEnabled: module.releaseGate.isEnabled()
        }
      });

      if (!response.success) {
        setMilestoneFeedback(slice.milestoneId, {
          status: "error",
          message: response.message,
          tone: "warning"
        });
        return;
      }

      const evaluation = response.caseMilestoneEvaluation;
      if (!evaluation || evaluation.milestoneId !== slice.milestoneId) {
        setMilestoneFeedback(slice.milestoneId, {
          status: "no-match",
          message: slice.missingMetadataMessage,
          tone: "warning"
        });
        return;
      }

      setMilestoneFeedback(slice.milestoneId, {
        status: evaluation.matched ? "success" : "no-match",
        message: evaluation.matched
          ? slice.matchedMessage
          : slice.noMatchMessage,
        tone: evaluation.matched ? "success" : "warning"
      });
    } catch (error) {
      setMilestoneFeedback(slice.milestoneId, {
        status: "error",
        message: error instanceof Error ? error.message : "Query check failed.",
        tone: "warning"
      });
    }
  }

  function renderSqlFeedbackSlice(slice: Case001SqlFeedbackSlice): JSX.Element {
    const feedback = sqlFeedbackByMilestone[slice.milestoneId];
    const inputId = `case-001-${slice.milestoneId}-query`;

    return (
      <section
        key={slice.milestoneId}
        className="case-001-query-feedback-slice"
        aria-labelledby={`${inputId}-title`}
      >
        <div className="section-heading">
          <p className="message-muted">Gated SQL boundary</p>
          <h3 id={`${inputId}-title`}>{slice.title}</h3>
          <p className="message-muted">{slice.prompt}</p>
        </div>

        <form
          className="case-001-query-feedback-slice__form"
          onSubmit={(event) => void handleSqlFeedbackSubmit(event, slice)}
        >
          <label className="input-label" htmlFor={inputId}>
            {slice.inputLabel}
          </label>
          <textarea
            id={inputId}
            value={sqlQueries[slice.milestoneId] ?? slice.starterSql}
            onChange={(event) =>
              handleSqlQueryChange(slice.milestoneId, event.target.value)
            }
            spellCheck={false}
          />
          <div className="student-setup-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={feedback.status === "loading"}
            >
              {slice.submitLabel}
            </button>
            <p className="message-muted">{slice.nonProgressingMessage}</p>
          </div>
        </form>

        {feedback.message ? (
          <p
            className={
              feedback.tone === "success"
                ? "case-001-query-feedback-slice__feedback case-001-query-feedback-slice__feedback--success"
                : "case-001-query-feedback-slice__feedback"
            }
            role="status"
          >
            {feedback.message}
          </p>
        ) : null}
      </section>
    );
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
        className="case-001-checkpoint-summary"
        aria-labelledby="case-001-checkpoint-summary-title"
        aria-label="Case 001 checkpoint summary"
      >
        <div className="section-heading">
          <p className="message-muted">Current checkpoint</p>
          <h3 id="case-001-checkpoint-summary-title">Case 001 Checkpoint</h3>
          <p className="message-muted">
            Review the three early choices together before forming a theory.
          </p>
        </div>

        <dl className="case-001-checkpoint-summary__items">
          {checkpoint.items.map((item) => (
            <div key={item.id} className="case-001-checkpoint-summary__item">
              <dt>{item.label}</dt>
              <dd>{item.selectedLabel ?? "Selection pending"}</dd>
            </div>
          ))}
        </dl>

        {checkpoint.isComplete ? (
          <p className="case-001-checkpoint-summary__complete" role="status">
            {checkpoint.completeMessage}
          </p>
        ) : null}
      </section>

      {module.sqlFeedbackSlices.map((slice) => renderSqlFeedbackSlice(slice))}

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

      <section
        className="case-001-clue-narrowing-slice"
        aria-labelledby="case-001-clue-narrowing-slice-title"
      >
        <div className="section-heading">
          <p className="message-muted">Early clue priority</p>
          <h3 id="case-001-clue-narrowing-slice-title">
            {CASE_001_CLUE_NARROWING_SLICE.title}
          </h3>
          <p className="message-muted">{CASE_001_CLUE_NARROWING_SLICE.prompt}</p>
        </div>

        <ol
          className="case-001-clue-narrowing-slice__records"
          aria-label="Early clue types"
        >
          {CASE_001_CLUE_NARROWING_SLICE.clues.map((clue) => (
            <li key={clue.type}>
              <span className="case-001-clue-narrowing-slice__source">{clue.type}</span>
              <span>{clue.detail}</span>
            </li>
          ))}
        </ol>

        <div
          className="case-001-clue-narrowing-slice__options"
          role="group"
          aria-label="Clue narrowing options"
        >
          {CASE_001_CLUE_NARROWING_SLICE.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="case-001-clue-narrowing-slice__option"
              aria-pressed={skeletonState.selectedClueNarrowingOptionId === option.id}
              onClick={() => handleClueNarrowingOptionSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedClueNarrowingOption ? (
          <p
            className={
              "isCorrect" in selectedClueNarrowingOption &&
              selectedClueNarrowingOption.isCorrect
                ? "case-001-clue-narrowing-slice__feedback case-001-clue-narrowing-slice__feedback--success"
                : "case-001-clue-narrowing-slice__feedback"
            }
            role="status"
          >
            {selectedClueNarrowingOption.feedback}
          </p>
        ) : null}
      </section>
    </section>
  );
}
