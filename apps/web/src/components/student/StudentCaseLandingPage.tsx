import type { StudentCaseLibraryEntry } from "./studentCaseLibrary";

type StudentCaseLandingPageProps = {
  caseEntry: StudentCaseLibraryEntry;
  onBackToLibrary: () => void;
  onEnterCase: () => void;
};

export function StudentCaseLandingPage({
  caseEntry,
  onBackToLibrary,
  onEnterCase
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
              disabled={!caseEntry.isUnlocked}
            >
              {caseEntry.isUnlocked ? "Open Case File" : "Archive Locked"}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
