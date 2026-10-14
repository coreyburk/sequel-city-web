import { insertQueryAssist } from "../queryAssistInsertion";
import type { CaseAttemptController } from "../../useCaseAttempt";
import { useImperativeHandle, useRef, useState, type ReactNode, type Ref } from "react";
import type { SchemaResponse } from "../../api/types";
import { StudentSchemaTable } from "./StudentSchemaTable";

type HeaderProps = {
  activeView: "briefing" | "workbench" | "case-board";
  caseStatus: string;
  mentorTitle: string;
  mentorMessage: string;
  studentObjective: string;
  samuelAvatarSrc: string;
  studentScene: { visual: string; imageSrc: string; alt: string };
  children?: ReactNode;
};

// Presentation extracted from the original StudentMentorHeader (7229921).
// No legacy milestone, reward or query authority is passed into this surface.
export function ProtectedCaseHeader({ activeView, caseStatus, mentorTitle, mentorMessage, studentObjective, samuelAvatarSrc, studentScene, children }: HeaderProps): JSX.Element {
  const isBriefingView = activeView === "briefing";
  const guidanceHeading = isBriefingView ? mentorTitle : activeView === "workbench" ? "Samuel's Guidance" : "Samuel's Evidence Review";
  const headerVariant = isBriefingView ? "briefing-full" : activeView === "workbench" ? "workbench-mentor-hero" : "case-board-scene-hero";
  const momentumModifier = "building";
  const samuelVisualState = "neutral";
  const caseBeatLabel = mentorTitle === guidanceHeading ? null : mentorTitle;
  const primaryDirectionLabel = isBriefingView ? "What this case asks you to prove" : "What to prove";
  const secondaryDirectionLabel = isBriefingView ? "Case file" : "What to do next";
  const primaryDirectionValue = studentObjective;
  const secondaryDirectionValue = mentorMessage;
  return (
    <section

      className={`panel panel--full student-case-header student-case-header--view-${activeView} student-case-header--variant-${headerVariant} student-case-header--${momentumModifier}`}
      aria-labelledby="student-case-header-title"
      data-active-view={activeView}
      data-header-variant={headerVariant}
      data-stable-shell="student-case-header"
      data-shared-grid="student-header-grid"
      tabIndex={-1}
    >
      <div className="student-case-header__summary">
        <p className="student-case-header__kicker">Case Status</p>
        <h2 id="student-case-header-title">{caseStatus}</h2>
      </div>
      <div className="student-case-header__grid" data-stable-grid="student-header-grid">
        <div
          className="student-case-header__region student-case-header__region--visual"
          data-stable-region="visual"
        >
          <div className="samuel-avatar-frame">
            <div
              className={`samuel-avatar samuel-avatar--${samuelVisualState}`}
              >
              <img src={samuelAvatarSrc} alt="Samuel Tupleton, your SQL detective mentor" />
            </div>
          </div>
        </div>
        <section
          className="student-case-header__region student-case-header__region--guidance"
          data-stable-region="guidance"
          aria-label={isBriefingView ? "Whole case briefing" : "Samuel's Guidance"}
        >
          <h2
            className="student-case-header__heading"
            data-mentor-strip-role={activeView}
          >
            {guidanceHeading}
          </h2>
          {caseBeatLabel ? (
            <p
              className="student-case-header__beat"
              data-case-beat="case-progression"
            >
              {caseBeatLabel}
            </p>
          ) : null}
          <dl
            className="student-case-header__direction"
            data-direction-role="primary-instruction"
          >
            <dt className="student-case-header__direction-label">{primaryDirectionLabel}</dt>
            <dd className="student-case-header__direction-value">{primaryDirectionValue}</dd>
            <dt className="student-case-header__direction-label">{secondaryDirectionLabel}</dt>
            <dd className="student-case-header__direction-value student-case-header__message">
              {secondaryDirectionValue}
            </dd>
          </dl>

          {children}
        </section>
        <div
          className="student-case-header__region student-case-header__region--scene"
          data-stable-region="scene"
        >
          <div className="student-case-header__visual" aria-label="Noir Scene Visual">
            <div className={`noir-scene-frame noir-scene-frame--${studentScene.visual}`}>
              <img
                className="noir-scene-frame__image"
                src={studentScene.imageSrc}
                alt={studentScene.alt}
              />
              <div className="noir-scene-frame__scrim" aria-hidden="true" />
              <div className="noir-scene-frame__grain" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ReferenceProps = { schema: SchemaResponse | null; schemaError: string | null; facts: ReactNode; knownFacts?: ReactNode; dossier?: string; children: ReactNode };

// Original StudentWorkbenchView reference drawer and workspace shell.
export function ProtectedCaseWorkbench({ schema, schemaError, facts, knownFacts, dossier, children }: ReferenceProps): JSX.Element {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceView, setReferenceView] = useState("tables");
  const [selectedTable, setSelectedTable] = useState("");
  return <section className={`student-workspace student-workspace--focused ${isReferenceOpen ? "student-workspace--reference-open" : ""}`} aria-label="Query Lab">
    <aside className={`student-reference-drawer ${isReferenceOpen ? "student-reference-drawer--open" : ""}`} aria-label="Query Lab Reference Drawer">
      <button type="button" className="student-reference-drawer__toggle" aria-expanded={isReferenceOpen} onClick={() => setIsReferenceOpen(!isReferenceOpen)}>Case File</button>
      {isReferenceOpen ? <div className="student-reference-drawer__panel">
        <div className="student-reference-drawer__header"><div className="student-reference-drawer__heading-row"><p className="samuel-briefing__prompt-title">Query Lab Reference</p><button type="button" className="student-reference-drawer__close" aria-label="Close Case File" onClick={() => setIsReferenceOpen(false)}>Close</button></div>
          <div className="student-reference-drawer__tabs" role="tablist" aria-label="Reference Views">{[["tables", "Quick Table Clues"], ["pinned", "Pinned Facts"], ["facts", "Case Facts"]].map(([view, label]) => <button key={view} type="button" role="tab" aria-selected={referenceView === view} className={referenceView === view ? "is-active" : undefined} onClick={() => setReferenceView(view)}>{label}</button>)}</div>
        </div>
        {referenceView === "tables" ? <section className="student-reference-drawer__content schema-snapshot" aria-label="Quick Table Clues"><p className="message-muted">Open a table when you need a quick reminder about columns or keys.</p>{schemaError ? <p className="message-error" role="alert">{schemaError}</p> : !schema ? <p className="message-muted">Loading schema snapshot…</p> : null}<div className="schema-snapshot__layout"><ul className="schema-pill-list">{schema?.data.tables.map(table => <li key={table.fullName}><button type="button" className="schema-link" aria-pressed={selectedTable === table.fullName} onClick={() => setSelectedTable(table.fullName)}>{table.fullName}</button></li>)}</ul>{schema?.data.tables.find(table => table.fullName === selectedTable) ? <StudentSchemaTable table={schema.data.tables.find(table => table.fullName === selectedTable)!} /> : null}</div></section> : referenceView === "pinned" ? <section className="student-reference-drawer__content student-reference-drawer__content--pinned" aria-label="Pinned Facts"><div className="section-heading section-heading--compact"><h2>Pinned Facts</h2><p className="message-muted">Facts you already proved. Click one to insert it into the query editor.</p></div>{facts}</section> : <section className="student-reference-drawer__content" aria-label="Case Facts"><ul className="known-case-facts-list story-recap__text"><li>{dossier}</li></ul>{knownFacts}</section>}
      </div> : null}
    </aside>
    <div className="student-workspace__main">{children}</div>
  </section>;
}
const STUDENT_SQL_BUILDING_BLOCKS = [
  "SELECT",
  "*",
  "FROM",
  "WHERE",
  "(",
  ")",
  "BETWEEN",
  "=",
  "LIKE",
  "%",
  "INNER JOIN",
  "LEFT OUTER JOIN",
  "ON",
  "AND",
  "OR",
  "AS",
  "GROUP BY",
  "ORDER BY"
] as const;
// Original QueryRunner editor controls; execution is supplied by the protected controller.
export type QueryAssistHandle = { insert: (text: string) => void };
export function ProtectedCaseQueryEditor({ sql, onChange, onRun, disabled, assistRef }: { sql: string; onChange: (sql: string) => void; onRun: () => Promise<void>; disabled: boolean; assistRef: Ref<QueryAssistHandle> }): JSX.Element {
  const sqlTextareaRef = useRef<HTMLTextAreaElement>(null);
  function insertBuildingBlock(text: string) {
    const textarea = sqlTextareaRef.current;
    if (!textarea) return;
    const inserted = insertQueryAssist(sql, text, textarea.selectionStart, textarea.selectionEnd);
    onChange(inserted.sql);
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(inserted.caret, inserted.caret); });
  }
  useImperativeHandle(assistRef, () => ({ insert: insertBuildingBlock }));
  return <form className="query-controls" onSubmit={event => { event.preventDefault(); void onRun(); }}>
    <p className="message-muted query-builder-hint">Click a SQL block, hint token, or Case File fact to insert it.</p>
    <div className="query-builder-blocks" aria-label="SQL building blocks">{STUDENT_SQL_BUILDING_BLOCKS.map(block => <button key={block} type="button" className="query-builder-block" onClick={() => insertBuildingBlock(block)}>{block}</button>)}</div>
    <label className="input-label" htmlFor="current-case-sql">SQL Query</label><textarea ref={sqlTextareaRef} id="current-case-sql" value={sql} onChange={event => onChange(event.target.value)} />
    <button className="query-runner-submit" type="submit" disabled={disabled}>Run Query</button>
  </form>;
}
// Original notebook and Case Progress markup, bound only to the protected snapshot.
export function ProtectedCaseBoard({ controller: c }: { controller: CaseAttemptController }): JSX.Element {
  const [notes, setNotes] = useState("" );
  const s = c.snapshot, w = c.workspace;
  if (!s) return <></>;
  const task = s.task;
  return <section className="student-case-board" aria-label="Evidence Notebook and Case File"><section className="panel evidence-rail-card detective-notebook" aria-label="Evidence Notebook"><div className="section-heading section-heading--compact"><h2>Evidence Notebook</h2><p className="message-muted">Keep the clues you have proved and any notes you want to keep.</p></div><ul className="notebook-entry-list notebook-entry-list--compact">{w.notes.map((note, index) => <li key={index}>{note.length > 180 ? <details className="notebook-note-details"><summary>{(note.includes("; ") ? note.split("; ").slice(0, 2).join("; ") : note.slice(0, 120)).slice(0, 140)} — full note</summary><p>{note}</p></details> : note}</li>)}</ul><div className="manual-note-entry"><label className="input-label" htmlFor="case-note">Add your own note</label><input className="text-input" id="case-note" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Witness note, address, hunch, or cross-reference…" /><button className="student-note-button" onClick={() => { if (notes.trim()) c.updateWorkspace({ ...w, notes: [...w.notes, notes.trim()] }); setNotes(""); }}>Add Note</button></div></section><section className="panel case-file-card" aria-label="Case Progress"><div className="section-heading section-heading--compact"><h2>Case Progress</h2><p className="message-muted">Completed milestones: {s.progress.completed} / {s.progress.total}</p></div>
      <progress aria-label="Proved case progress" max={s.progress.total || 1} value={s.progress.completed} />
      <div className="case-progress__current case-progress__current--primary" aria-label={task ? "Current Step" : "Completed Evidence Review"}><p className="case-progress__current-kicker">{task ? "Current Step" : "Released Scope Complete"}</p><p className="case-progress__current-title">{task?.title ?? (s.completionScope === "full-resolution" ? "Investigation complete" : "Evidence review complete")}</p><p className="message-muted">{task?.objective ?? (s.completionScope === "full-resolution" ? "Your proved investigation is complete." : "The released evidence trail is complete. Culprit verification is not part of this release.")}</p></div>
      <ul className="milestone-list protected-evidence-steps" aria-label="Case evidence steps">{s.evidenceSteps?.map(step => <li key={step.stepKey} data-evidence-status={step.status}><span className="protected-evidence-marker" aria-label={step.status === "proved" ? "Proved" : "Current evidence"}>{step.status === "proved" ? "✓" : "○"}</span><span>{step.title}</span></li>)}</ul>
      {task ? <button className="samuel-briefing__button" onClick={() => c.updateWorkspace({ ...w, selectedView: "workbench" })}>Continue in Query Lab</button> : null}
    </section></section>;
}
