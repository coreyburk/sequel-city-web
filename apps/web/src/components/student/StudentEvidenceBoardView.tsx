import type { Dispatch, SetStateAction } from "react";
import { CASE_004_MILESTONES } from "../../studentCase";
import type {
  CaseMilestone,
  CaseReviewCheck,
  CaseReviewChoice,
  CaseReviewStatus,
  EvidenceNotebookEntry,
  LeadBoardCard,
  MilestoneId
} from "../../studentCase";

type WitnessChecklistItem = {
  label: string;
  detail: string;
};

type StudentEvidenceBoardViewProps = {
  activeCaseReviewStatus: CaseReviewStatus;
  activeLeads: CaseMilestone[];
  caseReviewCheck: CaseReviewCheck;
  completedCount: number;
  completedMilestones: Record<MilestoneId, boolean>;
  handleCaseReviewChoice: (choice: CaseReviewChoice) => void;
  handleManualNotebookAdd: () => void;
  highlightedNotebookEntryId: string | null;
  insightMarks: number;
  leadBoardCards: LeadBoardCard[];
  manualNotebookDraft: string;
  notebookEntries: EvidenceNotebookEntry[];
  removeNotebookEntry: (entryId: string) => void;
  setManualNotebookDraft: Dispatch<SetStateAction<string>>;
  shouldShowCrimeReportHandoff: boolean;
  visibleMilestones: CaseMilestone[];
  witnessChecklistItems: WitnessChecklistItem[];
};

export function StudentEvidenceBoardView({
  activeCaseReviewStatus,
  activeLeads,
  caseReviewCheck,
  completedCount,
  completedMilestones,
  handleCaseReviewChoice,
  handleManualNotebookAdd,
  highlightedNotebookEntryId,
  insightMarks,
  leadBoardCards,
  manualNotebookDraft,
  notebookEntries,
  removeNotebookEntry,
  setManualNotebookDraft,
  shouldShowCrimeReportHandoff,
  visibleMilestones,
  witnessChecklistItems
}: StudentEvidenceBoardViewProps): JSX.Element {
  return (
    <section className="student-case-board" aria-label="Evidence Notebook and Case File">
      <section className="panel evidence-rail-card detective-notebook" aria-labelledby="evidence-notebook-title">
        <div className="section-heading section-heading--compact">
          <h2 id="evidence-notebook-title">Evidence Notebook</h2>
          <p className="message-muted">
            Keep the clues you have proved and any notes you want to keep.
          </p>
        </div>
        {notebookEntries.length > 0 ? (
          <ul className="notebook-entry-list notebook-entry-list--compact">
            {notebookEntries.map((entry) => (
              <li
                key={entry.id}
                className={
                  entry.id === highlightedNotebookEntryId
                    ? "notebook-entry--highlighted"
                    : undefined
                }
              >
                <span>{entry.detail}</span>
                <button
                  type="button"
                  className="notebook-entry-remove"
                  aria-label={`Remove note ${entry.detail}`}
                  onClick={() => removeNotebookEntry(entry.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="message-muted">
            No clues pinned yet.
          </p>
        )}
        {completedMilestones["crime-scene-filter"] && !completedMilestones["witness-clues"] ? (
          <div
            className="notebook-evidence-contract"
            aria-label="Witness Evidence Checklist"
          >
            <p className="samuel-briefing__prompt-title">Witness Checklist</p>
            <p className="message-muted">Items still needed:</p>
            <ul>
              {witnessChecklistItems.map((item, index) => (
                <li key={item.label}>
                  <strong>{index + 1}. {item.label}:</strong> {item.detail}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="manual-note-entry">
          <label className="input-label" htmlFor="student-manual-note">
            Add your own note
          </label>
          <input
            id="student-manual-note"
            className="text-input"
            type="text"
            value={manualNotebookDraft}
            onChange={(event) => setManualNotebookDraft(event.target.value)}
            placeholder="Witness note, address, hunch, or cross-reference..."
          />
          <button type="button" className="student-note-button" onClick={handleManualNotebookAdd}>
            Add Note
          </button>
        </div>
      </section>
      <section className="panel case-file-card" aria-labelledby="case-file-title">
        <div className="section-heading section-heading--compact">
          <h2 id="case-file-title">Case Progress</h2>
          <p className="message-muted">
            Completed milestones: {completedCount} / {CASE_004_MILESTONES.length}
          </p>
        </div>
        {shouldShowCrimeReportHandoff ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="crime-report-handoff"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            <p className="case-progress__current-title">Inspect the queued crime scene report.</p>
            <p className="message-muted">See Samuel&apos;s Guidance above for the full direction.</p>
          </div>
        ) : leadBoardCards.length > 0 ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="lead-board"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            {leadBoardCards.map((card) => (
              <p key={card.id} className="case-progress__current-title">
                {card.title}.
              </p>
            ))}
            <p className="message-muted">See Samuel&apos;s Guidance above for the full direction.</p>
          </div>
        ) : activeLeads.length > 0 ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="active-lead"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            {activeLeads.map((lead) => (
              <p key={lead.id} className="case-progress__current-title">
                {lead.title}.
              </p>
            ))}
            <p className="message-muted">See Samuel&apos;s Guidance above for the full direction.</p>
          </div>
        ) : (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="follow-samuel"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            <p className="case-progress__current-title">Follow Samuel&apos;s current instruction.</p>
            <p className="message-muted">See Samuel&apos;s Guidance above for the full direction.</p>
          </div>
        )}
        <ul className="milestone-list">
          {visibleMilestones.map((milestone) => (
            <li key={milestone.id}>
              <span aria-hidden="true">
                {completedMilestones[milestone.id] ? "[x]" : "[ ]"}
              </span>
              <span>{milestone.title}</span>
            </li>
          ))}
        </ul>
        <section
          className="case-review student-optional-callout"
          aria-labelledby="case-review-title"
        >
          <div className="case-review__header">
            <p className="samuel-briefing__prompt-title" id="case-review-title">
              Samuel&apos;s Check-In
            </p>
            <p className="case-review__score">Insight Marks: {insightMarks}</p>
          </div>
          <p className="message-muted">
            Optional reasoning check.
          </p>
          <p>{caseReviewCheck.prompt}</p>
          <div className="case-review__choices">
            {caseReviewCheck.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleCaseReviewChoice(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
          {activeCaseReviewStatus === "correct" ? (
            <p className="case-review__result case-review__result--correct">
              Insight Mark earned. {caseReviewCheck.success}
            </p>
          ) : null}
          {activeCaseReviewStatus === "error" ? (
            <p className="case-review__result case-review__result--error">
              {caseReviewCheck.coaching}
            </p>
          ) : null}
        </section>
      </section>
    </section>
  );
}
