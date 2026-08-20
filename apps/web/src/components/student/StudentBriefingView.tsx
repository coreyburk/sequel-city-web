import {
  CASE_004_BRIEF,
  KNOWN_CASE_FACTS,
  SAMUEL_TUPLETON_STEPS
} from "../../studentCase";
import type { SamuelBriefingStep, StoryBrief } from "../../studentCase";

type StudentBriefingViewProps = {
  activeSamuelStep: SamuelBriefingStep;
  samuelCompletedCount: number;
  brief?: StoryBrief;
  knownCaseFacts?: readonly string[];
  totalStepCount?: number;
};

export function StudentBriefingView({
  activeSamuelStep,
  samuelCompletedCount,
  brief = CASE_004_BRIEF,
  knownCaseFacts = KNOWN_CASE_FACTS,
  totalStepCount = SAMUEL_TUPLETON_STEPS.length
}: StudentBriefingViewProps): JSX.Element {
  return (
    <section
      className="panel panel--full samuel-briefing samuel-briefing--primary"
      aria-labelledby="samuel-briefing-title"
    >
      <div className="samuel-briefing__header">
        <div>
          <p className="samuel-briefing__kicker">Case {brief.caseNumber}</p>
          <h2 id="samuel-briefing-title">{brief.caseName}</h2>
        </div>
        <p className="samuel-briefing__badge">
          Breadcrumbs {samuelCompletedCount} / {totalStepCount}
        </p>
      </div>
      <div className="samuel-briefing__layout samuel-briefing__layout--single">
        <section className="samuel-briefing__mission" aria-label="Current Mission">
          <div className="samuel-briefing__prompt samuel-briefing__case-file">
            <p className="samuel-briefing__prompt-title">Case File Snapshot</p>
            <ul className="known-case-facts-list">
              {knownCaseFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <p className="samuel-briefing__prompt-title">Opening Query Lead</p>
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
