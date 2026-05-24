import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
import type { PendingEvidenceStep } from "../../studentCase";

type WitnessChecklistItem = {
  label: string;
  detail: string;
};

type NotebookPage = "murderer" | "mastermind";

type StudentEvidenceBoardViewProps = {
  activeCaseReviewStatus: CaseReviewStatus;
  activeLeads: CaseMilestone[];
  caseReviewCheck: CaseReviewCheck;
  completedCount: number;
  completedMilestones: Record<MilestoneId, boolean>;
  confirmedTriggerSuspectName: string | null;
  handleCaseReviewChoice: (choice: CaseReviewChoice) => void;
  handleManualNotebookAdd: (notebookPage?: "mastermind") => void;
  highlightedNotebookEntryId: string | null;
  insightMarks: number;
  leadBoardCards: LeadBoardCard[];
  manualNotebookDraft: string;
  notebookEntries: EvidenceNotebookEntry[];
  pendingEvidenceStep: PendingEvidenceStep;
  removeNotebookEntry: (entryId: string) => void;
  setNotebookEntryPage: (entryId: string, notebookPage: "mastermind" | undefined) => void;
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
  confirmedTriggerSuspectName,
  handleCaseReviewChoice,
  handleManualNotebookAdd,
  highlightedNotebookEntryId,
  insightMarks,
  leadBoardCards,
  manualNotebookDraft,
  notebookEntries,
  pendingEvidenceStep,
  removeNotebookEntry,
  setNotebookEntryPage,
  setManualNotebookDraft,
  shouldShowCrimeReportHandoff,
  visibleMilestones,
  witnessChecklistItems
}: StudentEvidenceBoardViewProps): JSX.Element {
  const shouldUseMastermindNotebookPages =
    completedMilestones["trigger-check"] &&
    !completedMilestones["mastermind-trace"] &&
    Boolean(confirmedTriggerSuspectName);
  const [notebookPage, setNotebookPage] = useState<NotebookPage>("murderer");

  useEffect(() => {
    if (!shouldUseMastermindNotebookPages) {
      setNotebookPage("murderer");
      return;
    }

    if (highlightedNotebookEntryId?.startsWith("mastermind-")) {
      setNotebookPage("mastermind");
    }
  }, [highlightedNotebookEntryId, shouldUseMastermindNotebookPages]);

  const confirmedKillerDisplayEntry: EvidenceNotebookEntry | null =
    shouldUseMastermindNotebookPages && confirmedTriggerSuspectName
      ? {
          id: "confirmed-killer-display",
          detail: `Confirmed Hired Killer: ${confirmedTriggerSuspectName}`
        }
      : null;

  const displayNotebookEntries: EvidenceNotebookEntry[] = shouldUseMastermindNotebookPages
    ? notebookPage === "murderer"
      ? [
          ...(confirmedKillerDisplayEntry ? [confirmedKillerDisplayEntry] : []),
          ...notebookEntries.filter(
            (entry) => !entry.id.startsWith("mastermind-") && entry.notebookPage !== "mastermind"
          )
        ]
      : [
          ...(confirmedKillerDisplayEntry ? [confirmedKillerDisplayEntry] : []),
          ...notebookEntries.filter(
            (entry) => entry.id.startsWith("mastermind-") || entry.notebookPage === "mastermind"
          )
        ]
    : notebookEntries;

  const isMastermindNotebookPage = shouldUseMastermindNotebookPages && notebookPage === "mastermind";

  return (
    <section className="student-case-board" aria-label="Evidence Notebook and Case File">
      <section className="panel evidence-rail-card detective-notebook" aria-labelledby="evidence-notebook-title">
        <div className="section-heading section-heading--compact">
          <h2 id="evidence-notebook-title">Evidence Notebook</h2>
          {shouldUseMastermindNotebookPages ? (
            <div className="detective-notebook__page-tabs" aria-label="Notebook Pages">
              <button
                type="button"
                className={notebookPage === "murderer" ? "is-active" : undefined}
                aria-pressed={notebookPage === "murderer"}
                onClick={() => setNotebookPage("murderer")}
              >
                Page 1
              </button>
              <button
                type="button"
                className={notebookPage === "mastermind" ? "is-active" : undefined}
                aria-pressed={notebookPage === "mastermind"}
                onClick={() => setNotebookPage("mastermind")}
              >
                Page 2
              </button>
            </div>
          ) : null}
          <p className="message-muted">
            {shouldUseMastermindNotebookPages
              ? notebookPage === "murderer"
                ? "Page 1 preserves the full hired-killer notebook. Review these clues, then move any note you want to investigate further onto Page 2."
                : "Page 2 is your mastermind working page. Move over only the clues you want to pursue and build the next trail from there."
              : "Keep the clues you have proved and any notes you want to keep."}
          </p>
        </div>
        {displayNotebookEntries.length > 0 ? (
          <ul className="notebook-entry-list notebook-entry-list--compact">
            {displayNotebookEntries.map((entry) => (
              <li
                key={entry.id}
                className={[
                  entry.id === highlightedNotebookEntryId ? "notebook-entry--highlighted" : "",
                  entry.id === "confirmed-killer-display" ? "notebook-entry--circled-breakthrough" : ""
                ]
                  .filter(Boolean)
                  .join(" ") || undefined}
              >
                <span>{entry.detail}</span>
                <span className="notebook-entry__actions">
                  {shouldUseMastermindNotebookPages &&
                  notebookPage === "murderer" &&
                  entry.id !== "confirmed-killer-display" &&
                  !entry.id.startsWith("mastermind-") ? (
                    <button
                      type="button"
                      className="notebook-entry-page-action"
                      aria-label={`Move note ${entry.detail} to Page 2`}
                      onClick={() => {
                        setNotebookEntryPage(entry.id, "mastermind");
                        setNotebookPage("mastermind");
                      }}
                    >
                      Move to Page 2
                    </button>
                  ) : null}
                  {shouldUseMastermindNotebookPages &&
                  notebookPage === "mastermind" &&
                  entry.id !== "confirmed-killer-display" &&
                  !entry.id.startsWith("mastermind-") ? (
                    <button
                      type="button"
                      className="notebook-entry-page-action"
                      aria-label={`Move note ${entry.detail} back to Page 1`}
                      onClick={() => setNotebookEntryPage(entry.id, undefined)}
                    >
                      Back to Page 1
                    </button>
                  ) : null}
                  {entry.id !== "confirmed-killer-display" ? (
                    <button
                      type="button"
                      className="notebook-entry-remove"
                      aria-label={`Remove note ${entry.detail}`}
                      onClick={() => removeNotebookEntry(entry.id)}
                    >
                      Remove
                    </button>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="message-muted">
            No clues pinned yet.
          </p>
        )}
        {shouldUseMastermindNotebookPages ? (
          <p className="detective-notebook__mastermind-focus">
            {isMastermindNotebookPage
              ? "Page 1 still keeps the full murderer trail safe. Use this page for the clues you decide deserve a second look while you work out who ordered the hit."
              : "Samuel's next move is to review the murderer notes and decide which clues deserve deeper attention. When a clue feels promising, move it to Page 2 and test it there."}
          </p>
        ) : null}
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
          <button
            type="button"
            className="student-note-button"
            onClick={() => handleManualNotebookAdd(isMastermindNotebookPage ? "mastermind" : undefined)}
          >
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
        ) : pendingEvidenceStep === "witness-names" ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="witness-name-lookup"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            <p className="case-progress__current-title">Witness Name Lookup.</p>
            <p className="message-muted">Stay with the two witness names first. Samuel&apos;s Guidance above has the full direction.</p>
          </div>
        ) : pendingEvidenceStep === "gym-lead" ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="gym-membership-lead"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            <p className="case-progress__current-title">Gym Membership Lead.</p>
            <p className="message-muted">Start with the membership table, then narrow it with the 48Z and gold clues Samuel highlighted above.</p>
          </div>
        ) : pendingEvidenceStep === "suspect-candidate" ? (
          <div
            className="case-progress__current case-progress__current--primary"
            aria-label="Current Step"
            data-current-step="gym-suspect-lookup"
          >
            <p className="case-progress__current-kicker">Current Step</p>
            <p className="case-progress__current-title">Gym Suspect Lookup.</p>
            <p className="message-muted">Open Case File &gt; Pinned Facts, use the gym lead PersonID, and identify that person before you test any suspect theory.</p>
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
