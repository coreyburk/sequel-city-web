import { useState, type FormEvent } from "react";
import { verifySuspect } from "../api/client";
import type { CaseVerificationSuccessResponse } from "../api/types";
import { QUERY_SETUP_GUIDANCE, shouldShowQuerySetupGuidance } from "../guidance";

export function SuspectVerificationPanel(): JSX.Element {
  const [suspect, setSuspect] = useState("");
  const [result, setResult] = useState<CaseVerificationSuccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await verifySuspect(suspect);
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Suspect verification request failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="suspect-verification-title">
      <div className="section-heading">
        <h2 id="suspect-verification-title">Suspect Verification</h2>
        <p className="message-muted">
          Submit a suspect name to the backend verification endpoint and review the deterministic
          database-backed verdict.
        </p>
      </div>
      <form className="query-controls" onSubmit={(event) => void handleSubmit(event)}>
        <label className="input-label" htmlFor="suspect-name-input">
          Suspect Full Name
        </label>
        <input
          id="suspect-name-input"
          aria-label="Suspect full name"
          className="text-input"
          value={suspect}
          onChange={(event) => setSuspect(event.target.value)}
          placeholder="Enter suspect full name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Suspect"}
        </button>
      </form>
      {error ? <p className="message-error">{error}</p> : null}
      {error && shouldShowQuerySetupGuidance(error) ? (
        <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
      ) : null}
      {result ? (
        <dl className="key-value-grid key-value-grid--compact suspect-verdict">
          <div className="key-value-card">
            <dt>Suspect</dt>
            <dd>{result.data.suspect}</dd>
          </div>
          <div className="key-value-card">
            <dt>Verification Message</dt>
            <dd>{result.message}</dd>
          </div>
          <div className="key-value-card key-value-card--full">
            <dt>Verdict</dt>
            <dd>{result.data.verdict}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
