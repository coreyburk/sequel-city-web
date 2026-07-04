import { useEffect, useState, type FormEvent } from "react";
import type { CaseVerificationSuccessResponse } from "../../api/types";

type StudentSuspectTheoryPanelProps = {
  candidateNames?: string[];
  confirmedTriggerSuspectName?: string | null;
  suspectName: string;
  onSuspectNameChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string | null;
  result: CaseVerificationSuccessResponse | null;
  theoryRole?: "trigger_man" | "mastermind";
};

export function StudentSuspectTheoryPanel({
  candidateNames = [],
  confirmedTriggerSuspectName,
  suspectName,
  onSuspectNameChange,
  onSubmit,
  loading,
  error,
  result,
  theoryRole = "trigger_man"
}: StudentSuspectTheoryPanelProps): JSX.Element {
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await onSubmit();
  }

  const displayResult = result?.data.solvedRole === theoryRole ? result : null;
  const solvedRole = displayResult?.data.solvedRole ?? null;
  const isTriggerManConfirmed = solvedRole === "trigger_man";
  const isMastermindConfirmed = solvedRole === "mastermind";
  const isAwaitingTheoryTest = !isTriggerManConfirmed && !isMastermindConfirmed;
  const uniqueCandidateNames = Array.from(
    new Set(candidateNames.map((name) => name.trim()).filter(Boolean))
  );
  const shouldShowCandidateChoices = uniqueCandidateNames.length > 1;
  const verdictBriefing = isTriggerManConfirmed
    ? `${displayResult?.data.suspect} is confirmed as the hired killer. Samuel's next move: use the pinned PersonID and report-linked InterviewLog trail to expose who ordered the hit.`
    : isMastermindConfirmed
      ? `${displayResult?.data.suspect} is confirmed as the mastermind. The contract chain is solved and the case can close.`
      : displayResult?.data.verdict ?? null;
  const caseClosedSplashKey = isMastermindConfirmed
    ? `${displayResult?.data.caseId ?? "case"}-${displayResult?.data.suspect ?? "mastermind"}`
    : null;
  const hiredKillerLabel = confirmedTriggerSuspectName?.trim() || "The hired killer";
  const [isCaseCloseSplashVisible, setIsCaseCloseSplashVisible] = useState(false);

  useEffect(() => {
    if (caseClosedSplashKey) {
      setIsCaseCloseSplashVisible(true);
    }
  }, [caseClosedSplashKey]);

  return (
    <section
      className={`panel student-suspect-theory-panel${
        isAwaitingTheoryTest ? " student-suspect-theory-panel--ready" : ""
      }`}
      aria-labelledby="student-suspect-theory-title"
    >
      <div className="section-heading section-heading--compact">
        <h2 id="student-suspect-theory-title">
          {isTriggerManConfirmed
            ? "First Suspect Confirmed"
            : isMastermindConfirmed
              ? "Mastermind Confirmed"
              : "Suspect Theory Check"}
        </h2>
        <p className="message-muted">
          {isTriggerManConfirmed
            ? "You nailed the first suspect. Samuel's board just lit up, and the verdict below opens the mastermind trail."
            : isMastermindConfirmed
            ? "You solved the final layer. Read the verdict below and enjoy the closeout."
              : theoryRole === "mastermind"
                ? "Choose which collected name the Employment tie-break evidence supports, then run the controlled Solution check."
                : shouldShowCandidateChoices
                  ? "Choose which collected name the evidence supports, then run the controlled Solution check."
                  : "Use the pinned gym-linked name to run the controlled Solution check. The verdict comes back after the database trigger evaluates your suspect."}
        </p>
      </div>
      {isMastermindConfirmed && isCaseCloseSplashVisible ? (
        <div
          className="case-close-splash"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-close-splash-title"
          aria-describedby="case-close-splash-summary"
        >
          <div className="case-close-splash__backdrop" aria-hidden="true" />
          <section className="case-close-splash__panel">
            <div className="case-close-splash__evidence-board" aria-hidden="true">
              <span className="case-close-splash__thread case-close-splash__thread--one" />
              <span className="case-close-splash__thread case-close-splash__thread--two" />
              <span className="case-close-splash__thread case-close-splash__thread--three" />
              <span className="case-close-splash__pin case-close-splash__pin--one" />
              <span className="case-close-splash__pin case-close-splash__pin--two" />
              <span className="case-close-splash__pin case-close-splash__pin--three" />
            </div>
            <p className="case-close-splash__kicker">Final Verdict</p>
            <h2 id="case-close-splash-title">Case 004 Closed</h2>
            <p id="case-close-splash-summary" className="case-close-splash__summary">
              {hiredKillerLabel} carried out the hit. {displayResult?.data.suspect}
              {" "}ordered it. The money trail, the Symphony meetings, and the
              Employment tie-break all lock into one solved contract chain.
            </p>
            <div className="case-close-splash__seal" aria-hidden="true">
              Case Closed
            </div>
            <dl className="case-close-splash__facts">
              <div>
                <dt>Hired Killer</dt>
                <dd>{hiredKillerLabel}</dd>
              </div>
              <div>
                <dt>Mastermind</dt>
                <dd>{displayResult?.data.suspect}</dd>
              </div>
              <div>
                <dt>Case Chain</dt>
                <dd>Complete</dd>
              </div>
            </dl>
            <button
              type="button"
              className="case-close-splash__dismiss"
              autoFocus
              onClick={() => setIsCaseCloseSplashVisible(false)}
            >
              Review Closed Case
            </button>
          </section>
        </div>
      ) : null}
      {isTriggerManConfirmed || isMastermindConfirmed ? (
        <section
          className={`student-suspect-theory-panel__celebration ${
            isMastermindConfirmed
              ? "student-suspect-theory-panel__celebration--mastermind"
              : "student-suspect-theory-panel__celebration--breakthrough"
          }`}
          aria-label="Suspect theory result"
        >
          <p className="student-optional-callout__badge">
            {isMastermindConfirmed ? "Case Closed" : "Major Breakthrough"}
          </p>
          <p className="student-suspect-theory-panel__headline">
            {isMastermindConfirmed
              ? `${displayResult?.data.suspect} is confirmed as the mastermind.`
              : `${displayResult?.data.suspect} is confirmed as the hired killer.`}
          </p>
          <p className="student-suspect-theory-panel__subhead">
            {isMastermindConfirmed
              ? "The full chain holds. Samuel's verdict closes the case."
              : "That cracks the first layer of the case. Take the breakthrough, then use the killer's transcript trail to uncover who ordered the hit."}
          </p>
        </section>
      ) : (
        <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
          {shouldShowCandidateChoices ? (
            <fieldset className="student-theory-candidates">
              <legend>Collected Names</legend>
              {uniqueCandidateNames.map((candidateName) => (
                <label
                  key={candidateName}
                  className={`student-theory-candidate${
                    suspectName.trim() === candidateName ? " is-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="student-suspect-theory-candidate"
                    value={candidateName}
                    checked={suspectName.trim() === candidateName}
                    onChange={() => onSuspectNameChange(candidateName)}
                  />
                  <span>{candidateName}</span>
                </label>
              ))}
            </fieldset>
          ) : (
            <>
              <label className="input-label" htmlFor="student-suspect-name-input">
                Suspect Full Name
              </label>
              <input
                id="student-suspect-name-input"
                aria-label="Student suspect full name"
                className="text-input"
                value={suspectName}
                onChange={(event) => onSuspectNameChange(event.target.value)}
                placeholder="Enter the full suspect name from Pinned Facts"
              />
            </>
          )}
          <button
            type="submit"
            className="student-suspect-theory-panel__submit"
            disabled={loading || suspectName.trim().length === 0}
          >
            {loading ? "Testing Theory..." : "Test Theory"}
          </button>
        </form>
      )}
      {error ? <p className="message-error">{error}</p> : null}
      {displayResult ? (
        <dl className="key-value-grid key-value-grid--compact suspect-verdict suspect-verdict--story">
          <div className="key-value-card suspect-verdict__card">
            <dt>{isTriggerManConfirmed || isMastermindConfirmed ? "Confirmed Suspect" : "Suspect"}</dt>
            <dd>{displayResult.data.suspect}</dd>
          </div>
          <div className="key-value-card suspect-verdict__card">
            <dt>{isTriggerManConfirmed || isMastermindConfirmed ? "Samuel's Read" : "Verification Message"}</dt>
            <dd>
              {isTriggerManConfirmed
                ? "First suspect cracked. The mastermind trail is now open."
                : isMastermindConfirmed
                  ? "Final suspect confirmed. The full case is solved."
                  : displayResult.message}
            </dd>
          </div>
          <div className="key-value-card key-value-card--full suspect-verdict__card suspect-verdict__card--verdict">
            <dt>
              {isTriggerManConfirmed
                ? "Breakthrough Briefing"
                : isMastermindConfirmed
                  ? "Case Close Briefing"
                  : "Verdict"}
            </dt>
            <dd>{verdictBriefing}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
