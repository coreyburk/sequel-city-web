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
            Log the clue Samuel asks for at each guided step before he advances the case.
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
            Your notebook is empty. Run Samuel&apos;s opening query and log the clue that matters.
          </p>
        )}
        {completedMilestones["crime-scene-filter"] && !completedMilestones["witness-clues"] ? (
          <div className="notebook-evidence-contract" aria-label="Witness Evidence Checklist">
            <p className="samuel-briefing__prompt-title">Samuel&apos;s Evidence Check</p>
            <p>Still needed before Samuel opens the next lead:</p>
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
          <div className="case-progress__next case-progress__next--primary" aria-label="Current Action">
            <p>
              <strong>Do This Next:</strong> Samuel has created a query for you.
              Use Query Lab to inspect the queued CrimeSceneReport query and find
              the entry for this crime in the database.
            </p>
          </div>
        ) : leadBoardCards.length > 0 ? (
          <div className="lead-board__cards lead-board__cards--primary" aria-label="Current Action">
            {leadBoardCards.map((card) => (
              <article
                key={card.id}
                className={`lead-board__card lead-board__card--${card.status}`}
              >
                <p className="lead-board__card-title">Do This Next</p>
                <p className="lead-board__card-kicker">{card.title}</p>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        ) : activeLeads.length > 0 ? (
          <div className="case-progress__next case-progress__next--primary">
            <p><strong>Do This Next:</strong></p>
            <ul>
              {activeLeads.map((lead) => (
                <li key={lead.id}>{lead.cluePrompt}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="case-progress__next case-progress__next--primary">
            <strong>Do This Next:</strong> Stay with Samuel&apos;s current instruction before opening new leads.
          </p>
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
        <section className="case-review" aria-labelledby="case-review-title">
          <div className="case-review__header">
            <p className="samuel-briefing__prompt-title" id="case-review-title">
              Optional Samuel&apos;s Check-In
            </p>
            <p className="case-review__score">Insight Marks: {insightMarks}</p>
          </div>
          <p className="message-muted">
            Optional now. Use this quick reasoning check if you want to confirm why the clue matters.
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
