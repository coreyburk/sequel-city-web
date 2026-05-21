import { type FormEvent } from "react";
import type { CaseVerificationSuccessResponse } from "../../api/types";

type StudentSuspectTheoryPanelProps = {
  suspectName: string;
  onSuspectNameChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string | null;
  result: CaseVerificationSuccessResponse | null;
};

export function StudentSuspectTheoryPanel({
  suspectName,
  onSuspectNameChange,
  onSubmit,
  loading,
  error,
  result
}: StudentSuspectTheoryPanelProps): JSX.Element {
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await onSubmit();
  }

  const solvedRole = result?.data.solvedRole ?? null;
  const isTriggerManConfirmed = solvedRole === "trigger_man";
  const isMastermindConfirmed = solvedRole === "mastermind";

  return (
    <section className="panel" aria-labelledby="student-suspect-theory-title">
      <div className="section-heading section-heading--compact">
        <h2 id="student-suspect-theory-title">
          {isTriggerManConfirmed
            ? "Trigger Man Confirmed"
            : isMastermindConfirmed
              ? "Mastermind Confirmed"
              : "Suspect Theory Check"}
        </h2>
        <p className="message-muted">
          {isTriggerManConfirmed
            ? "You nailed the first suspect. Samuel's board just lit up, and the verdict below opens the mastermind trail."
            : isMastermindConfirmed
              ? "You solved the final layer. Read the verdict below and enjoy the closeout."
              : "Use the pinned gym-linked name to run the controlled Solution check. The verdict comes back after the database trigger evaluates your suspect."}
        </p>
      </div>
      {isTriggerManConfirmed || isMastermindConfirmed ? (
        <section className="student-suspect-theory-panel__celebration" aria-label="Suspect theory result">
          <p className="student-optional-callout__badge">
            {isMastermindConfirmed ? "Case Closed" : "Breakthrough"}
          </p>
          <p className="student-suspect-theory-panel__headline">
            {isMastermindConfirmed
              ? `${result?.data.suspect} is confirmed as the mastermind.`
              : `${result?.data.suspect} is confirmed as the trigger man.`}
          </p>
          <p className="student-suspect-theory-panel__subhead">
            {isMastermindConfirmed
              ? "The full chain holds. Samuel's verdict closes the case."
              : "That is your first major win. Take the verdict below, then use the murderer's transcript to hunt the mastermind."}
          </p>
        </section>
      ) : (
        <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
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
          <button type="submit" disabled={loading}>
            {loading ? "Testing Theory..." : "Test Theory"}
          </button>
        </form>
      )}
      {error ? <p className="message-error">{error}</p> : null}
      {result ? (
        <dl className="key-value-grid key-value-grid--compact suspect-verdict suspect-verdict--story">
          <div className="key-value-card suspect-verdict__card">
            <dt>{isTriggerManConfirmed || isMastermindConfirmed ? "Confirmed Suspect" : "Suspect"}</dt>
            <dd>{result.data.suspect}</dd>
          </div>
          <div className="key-value-card suspect-verdict__card">
            <dt>{isTriggerManConfirmed || isMastermindConfirmed ? "Samuel's Read" : "Verification Message"}</dt>
            <dd>{isTriggerManConfirmed ? "First suspect theory confirmed." : result.message}</dd>
          </div>
          <div className="key-value-card key-value-card--full suspect-verdict__card suspect-verdict__card--verdict">
            <dt>{isTriggerManConfirmed || isMastermindConfirmed ? "Trigger Verdict" : "Verdict"}</dt>
            <dd>{result.data.verdict}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
