import {
  CASE_004_BRIEF,
  CASE_004_DIFFICULTY_LABEL,
  CASE_BACKGROUND,
  INVESTIGATION_OVERVIEW,
  SAMUEL_MENTOR_INTRO
} from "../../studentCase";

type StudentCaseEntryFlowProps = {
  onEnterCase: () => void;
};

type OnboardingStep = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  bullets?: string[];
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    kicker: "Welcome",
    title: "Welcome to Sequel Detective",
    body:
      "This workspace is a guided case file. You are not here to guess the answer. You are here to prove each clue with SQL before Samuel lets the next lead move."
  },
  {
    id: "samuel",
    kicker: "Meet Samuel",
    title: "Samuel Tupleton runs the case discipline",
    body: SAMUEL_MENTOR_INTRO
  },
  {
    id: "workflow",
    kicker: "How Cases Work",
    title: "Each case moves one verified clue at a time",
    body: CASE_BACKGROUND,
    bullets: INVESTIGATION_OVERVIEW
  }
] as const;

export function StudentCaseEntryFlow({
  onEnterCase
}: StudentCaseEntryFlowProps): JSX.Element {
  return (
    <section
      className="panel panel--full student-onboarding"
      aria-labelledby="student-onboarding-title"
    >
      <div className="student-onboarding__hero">
        <p className="student-onboarding__kicker">Student Intake</p>
        <h2 id="student-onboarding-title">Start with the case, not the noise</h2>
        <p className="student-onboarding__lede">
          Case 004 is live now. Future case files can slot into this same entry flow with their
          own difficulty and mentor setup.
        </p>
      </div>

      <div className="student-onboarding__steps" aria-label="Onboarding steps">
        {ONBOARDING_STEPS.map((step, index) => (
          <article key={step.id} className="student-onboarding__step">
            <p className="student-onboarding__step-index">Step {index + 1}</p>
            <p className="student-onboarding__step-kicker">{step.kicker}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.bullets ? (
              <ul className="student-onboarding__bullet-list">
                {step.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <section className="student-onboarding__case-entry" aria-labelledby="case-entry-title">
        <div className="student-onboarding__case-entry-copy">
          <p className="student-onboarding__step-kicker">Choose Case</p>
          <h3 id="case-entry-title">Available case file</h3>
          <p>
            Start with the guided file below. Additional cases can be added here later without
            changing the rest of the student workspace.
          </p>
        </div>
        <div className="student-case-card student-case-card--active">
          <div className="student-case-card__header">
            <div>
              <p className="student-case-card__eyebrow">Case {CASE_004_BRIEF.caseNumber}</p>
              <h4>{CASE_004_BRIEF.caseName}</h4>
            </div>
            <span className="student-case-card__difficulty">{CASE_004_DIFFICULTY_LABEL}</span>
          </div>
          <p className="student-case-card__summary">
            Guided onboarding, Samuel-led progression, and a full clue-to-query training path.
          </p>
          <div className="student-case-card__footer">
            <button
              type="button"
              className="samuel-briefing__button"
              onClick={() => onEnterCase()}
            >
              Open Case 004
            </button>
            <p className="student-case-card__status">Only Case 004 is unlocked on this build.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
