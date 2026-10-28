import { getCaseDossiers } from "../../api/client";
import type { CaseDossier } from "../../api/types";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import samuelTupletonAvatar from "../../assets/avatars/avatar-samuel-tupleton.png";
import caseLibraryScene from "../../assets/scenes/case-library.png";
import { INVESTIGATION_OVERVIEW, SAMUEL_MENTOR_INTRO } from "../../studentCase";
import {
  CASE_LIBRARY_ENTRIES,
  getStudentCaseLibraryEntry
} from "./studentCaseLibrary";

type StudentCaseEntryFlowProps = {
  onSelectCase: (caseId: string) => void;
};

export function StudentCaseEntryFlow({
  onSelectCase
}: StudentCaseEntryFlowProps): JSX.Element {
  const [released, setReleased] = useState<CaseDossier[] | null>(null);
  useEffect(() => { let active=true; void getCaseDossiers().then(response=>{if(active)setReleased(response.cases);}).catch(()=>undefined); return ()=>{active=false;}; },[]);
  const entries = useMemo(() => CASE_LIBRARY_ENTRIES.map(entry => {
    const dossier=released?.find(dossier=>dossier.caseId===entry.id);
    return dossier ? {...entry,isUnlocked:true,caseName:dossier.title,description:dossier.dossier,summary:dossier.wholeCaseObjective} : {...entry,isUnlocked:released===null?entry.isUnlocked:false};
  }),[released]);
  const additional = released?.filter(dossier=>!entries.some(entry=>entry.id===dossier.caseId)) ?? [];
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [hoveredCaseId, setHoveredCaseId] = useState<string | null>(null);

  const activeVisualCaseId = hoveredCaseId ?? selectedCaseId;
  const activeDetailCaseId = hoveredCaseId ?? selectedCaseId;
  const activeCase = entries.find(entry=>entry.id===activeDetailCaseId);

  return (
    <section
      className="panel panel--full student-onboarding"
      aria-labelledby="student-onboarding-title"
    >
      <div className="student-onboarding__overview-grid" aria-label="Case library overview">
        <article className="student-onboarding__overview-card student-onboarding__overview-card--mentor">
          <div className="student-onboarding__mentor-portrait">
            <img src={samuelTupletonAvatar} alt="" />
          </div>
          <div className="student-onboarding__mentor-copy">
            <h2 id="student-onboarding-title">I'm Samuel Tupleton.</h2>
            <p>{SAMUEL_MENTOR_INTRO}</p>
            <p>
              I will not hand you answers. I will steady the room, keep the evidence honest, and
              expect you to earn each next lead by proving what the records actually show.
            </p>
          </div>
        </article>

        <article className="student-onboarding__overview-card">
          <p className="student-onboarding__step-kicker">How Cases Work</p>
          <h3>Each case moves one verified clue at a time</h3>
          <p>
            Every case begins broad, then narrows through records the student can actually prove.
            Samuel guides the pace, but the evidence only moves when the query results support it.
          </p>
          <ul className="student-onboarding__bullet-list">
            {INVESTIGATION_OVERVIEW.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </div>

      {additional.length ? <section aria-label="Additional released cases">{additional.map(dossier=><button key={dossier.caseId} type="button" className="samuel-briefing__button" onClick={()=>onSelectCase(dossier.caseId)}>{dossier.title}</button>)}</section> : null}
      <section className="student-onboarding__case-entry" aria-labelledby="case-entry-title">
        <div className="student-onboarding__case-entry-copy">
          <p className="student-onboarding__step-kicker">Case Library</p>
          <h3 id="case-entry-title">Choose a case from the shelf</h3>
          <p>
            Move across the shelf and choose the file that calls for attention. The library should
            feel inviting first, explanatory second.
          </p>
          {activeCase ? (
            <div className="student-case-card student-case-card--active">
              <div className="student-case-card__body">
                <div className="student-case-card__header">
                  <div>
                    <p className="student-case-card__eyebrow">
                      {`Case ${activeCase.caseNumber} - ${activeCase.eraNote}`}
                    </p>
                    <h4>{activeCase.caseName}</h4>
                  </div>
                  <span className="student-case-card__difficulty">{activeCase.statusLabel}</span>
                </div>
                <p className="student-case-card__description">{activeCase.shelfDescription ?? activeCase.description}</p>
                {!activeCase.shelfDescription ? <><p className="student-case-card__summary">{activeCase.summary}</p><p className="student-case-card__detail">{activeCase.detail}</p></> : null}
              </div>
            </div>
          ) : (
            <div
              className="student-case-card student-case-card--placeholder"
              aria-label="Case preview placeholder"
            >
              <div className="student-case-card__body">
                <p className="student-case-card__summary">
                  Hover over a spine to preview the case file here.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="student-case-library" aria-label="Available case files">
          <div className="student-case-library__visual">
            <img
              src={caseLibraryScene}
              alt="A Victorian detective library shelf with case volumes arranged as selectable books."
            />
            <div className="student-case-library__visual-scrim" aria-hidden="true" />
            <div className="student-case-library__hotspots" aria-label="Case selection shelf">
              {entries.map((entry) => {
                const isSelected = entry.id === selectedCaseId;
                const isActive = entry.id === activeVisualCaseId;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={[
                      "student-case-library__hotspot",
                      isSelected ? "student-case-library__hotspot--selected" : "",
                      isActive ? "student-case-library__hotspot--active" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      {
                        ...entry.hotspot,
                        "--hotspot-border": entry.hotspotTheme.border,
                        "--hotspot-fill": entry.hotspotTheme.fill,
                        "--hotspot-glow": entry.hotspotTheme.glow,
                        "--hotspot-label-border": entry.hotspotTheme.labelBorder
                      } as CSSProperties
                    }
                    aria-pressed={isSelected}
                    aria-label={`Select Case ${entry.caseNumber}: ${entry.caseName}`}
                    onMouseEnter={() => setHoveredCaseId(entry.id)}
                    onMouseLeave={() =>
                      setHoveredCaseId((current) => (current === entry.id ? null : current))
                    }
                    onFocus={() => setHoveredCaseId(entry.id)}
                    onBlur={() =>
                      setHoveredCaseId((current) => (current === entry.id ? null : current))
                    }
                    onClick={() => {
                      setSelectedCaseId(entry.id);
                      onSelectCase(entry.id);
                    }}
                  >
                    <span className="student-case-library__hotspot-label">
                      Case {entry.caseNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
