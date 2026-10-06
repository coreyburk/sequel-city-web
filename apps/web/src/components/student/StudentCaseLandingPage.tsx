import type { StudentCaseLibraryEntry } from "./studentCaseLibrary";

type StudentCaseLandingPageProps = {
  caseEntry: StudentCaseLibraryEntry;
  canEnterCase?: boolean;
  hasSavedProgress?: boolean;
  savedProgressDetail?: string;
  onBackToLibrary: () => void;
  onEnterCase: () => void;
  onStartFresh: () => void;
};

export function StudentCaseLandingPage({
  caseEntry,
  canEnterCase = caseEntry.isUnlocked,
  hasSavedProgress = false,
  savedProgressDetail = "",
  onBackToLibrary,
  onEnterCase,
  onStartFresh
}: StudentCaseLandingPageProps): JSX.Element {
  return (
    <section
      className={`panel panel--full student-case-landing student-case-landing--${caseEntry.themeKey}`}
      aria-labelledby="student-case-landing-title"
    >
      <div className="student-case-landing__hero">
        <img
          className="student-case-landing__hero-image"
          src={caseEntry.landingSceneSrc}
          alt={caseEntry.landingSceneAlt}
        />
        <div className="student-case-landing__hero-scrim" aria-hidden="true" />
        <div className="student-case-landing__hero-copy">
          <p className="student-case-landing__eyebrow">{caseEntry.landingEyebrow}</p>
          <h2 id="student-case-landing-title">
            {`Case ${caseEntry.caseNumber}: ${caseEntry.caseName}`}
          </h2>
          <p className="student-case-landing__tagline">{caseEntry.landingTagline}</p>
        </div>
      </div>

      <div className="student-case-landing__content">
        <section className="student-case-landing__panel student-case-landing__panel--story">
          <p className="student-case-landing__section-kicker">Case Description</p>
          <p className="student-case-landing__story">{caseEntry.description}</p>
          <p className="student-case-landing__atmosphere">{caseEntry.landingAtmosphere}</p>
        </section>

        <section className="student-case-landing__panel">
          <p className="student-case-landing__section-kicker">Inside This File</p>
          <ul className="student-case-landing__thread-list">
            {caseEntry.landingThreads.map((thread) => (
              <li key={thread}>{thread}</li>
            ))}
          </ul>
        </section>

        <section className="student-case-landing__panel student-case-landing__panel--dossier">
          <p className="student-case-landing__section-kicker">Case Dossier</p>
          <dl className="student-case-landing__facts">
            <div>
              <dt>Track</dt>
              <dd>{caseEntry.eraNote}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{caseEntry.statusLabel}</dd>
            </div>
            <div>
              <dt>Case Shape</dt>
              <dd>{caseEntry.summary}</dd>
            </div>
          </dl>
          <p className="student-case-landing__access-note">{caseEntry.landingAccessNote}</p>
          {canEnterCase ? (
            <div className="student-case-landing__progress-status" role="status">
              <strong>{hasSavedProgress ? "Saved attempt found" : "New attempt"}</strong>
              <span>
                {hasSavedProgress
                  ? `${savedProgressDetail} Resume the saved case or start a fresh attempt on this browser.`
                  : "No saved attempt exists on this browser yet."}
              </span>
            </div>
          ) : null}
          <div className="student-case-landing__actions">
            <button
              type="button"
              className="student-case-landing__button student-case-landing__button--secondary"
              onClick={onBackToLibrary}
            >
              Back To Library
            </button>
            <button
              type="button"
              className="student-case-landing__button"
              onClick={onEnterCase}
              disabled={!canEnterCase}
            >
              {canEnterCase ? (hasSavedProgress ? "Resume Case File" : "Open Case File") : "Archive Locked"}
            </button>
            {canEnterCase && hasSavedProgress ? (
              <button
                type="button"
                className="student-case-landing__button student-case-landing__button--secondary"
                onClick={onStartFresh}
              >
                Start Fresh
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
