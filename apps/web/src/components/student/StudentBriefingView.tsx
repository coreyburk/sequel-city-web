import {
  CASE_BACKGROUND,
  INVESTIGATION_OVERVIEW,
  KNOWN_CASE_FACTS,
  SAMUEL_MENTOR_INTRO,
  SAMUEL_TUPLETON_STEPS
} from "../../studentCase";
import type { SamuelBriefingStep } from "../../studentCase";

type StudentBriefingViewProps = {
  activeSamuelStep: SamuelBriefingStep;
  samuelCompletedCount: number;
};

export function StudentBriefingView({
  activeSamuelStep,
  samuelCompletedCount
}: StudentBriefingViewProps): JSX.Element {
  return (
    <section
      className="panel panel--full samuel-briefing samuel-briefing--primary"
      aria-labelledby="samuel-briefing-title"
    >
      <div className="samuel-briefing__header">
        <div>
          <p className="samuel-briefing__kicker">Data Detective On-Ramp</p>
          <h2 id="samuel-briefing-title">Case Briefing</h2>
        </div>
        <p className="samuel-briefing__badge">
          Breadcrumbs {samuelCompletedCount} / {SAMUEL_TUPLETON_STEPS.length}
        </p>
      </div>
      <div className="samuel-briefing__layout samuel-briefing__layout--single">
        <section className="samuel-briefing__mission" aria-label="Current Mission">
          <div className="samuel-briefing__intro-grid">
            <div className="samuel-briefing__prompt samuel-briefing__prompt--primary">
              <p className="samuel-briefing__prompt-title">Samuel&apos;s Role</p>
              <p>{SAMUEL_MENTOR_INTRO}</p>
            </div>
            <div className="samuel-briefing__prompt">
              <p className="samuel-briefing__prompt-title">Case Background</p>
              <p>{CASE_BACKGROUND}</p>
            </div>
          </div>
          <div className="samuel-briefing__prompt">
            <p className="samuel-briefing__prompt-title">How You&apos;ll Find Clues</p>
            <ul className="known-case-facts-list">
              {INVESTIGATION_OVERVIEW.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="samuel-briefing__prompt samuel-briefing__case-file">
            <p className="samuel-briefing__prompt-title">Known Case Facts</p>
            <ul className="known-case-facts-list">
              {KNOWN_CASE_FACTS.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <p className="samuel-briefing__prompt-title">First Lead</p>
          <p className="samuel-briefing__label">{activeSamuelStep.label}</p>
          <h3>{activeSamuelStep.title}</h3>
          <div className="samuel-objective-grid">
            <div className="samuel-briefing__prompt samuel-briefing__prompt--primary">
              <p className="samuel-briefing__prompt-title">Next Step</p>
              <p>{activeSamuelStep.nextStep}</p>
            </div>
            <div className="samuel-briefing__support-grid">
              <div className="samuel-briefing__prompt">
                <p className="samuel-briefing__prompt-title">Why It Matters</p>
                <p>{activeSamuelStep.observationPrompt}</p>
              </div>
              <div className="samuel-briefing__prompt">
                <p className="samuel-briefing__prompt-title">Success Looks Like</p>
                <p>{activeSamuelStep.successSignal}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
