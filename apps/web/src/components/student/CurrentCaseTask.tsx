import { useEffect, useRef, useState } from "react";
import { getSchemaTables } from "../../api/client";
import type { RuntimeQueryResponse, SchemaResponse } from "../../api/types";
import type { CaseAttemptController } from "../../useCaseAttempt";
import { QueryResultsTable } from "../QueryResultsTable";
import { ProtectedCaseHeader, ProtectedCaseWorkbench, ProtectedCaseQueryEditor, ProtectedCaseBoard, type QueryAssistHandle } from "./ProtectedCasePresentation";
import queryScene from "../../assets/scenes/scene-crime-ledger.png";
import reviewScene from "../../assets/scenes/scene-crime-ledger.png";
import { getStudentCaseLibraryEntry } from "./studentCaseLibrary";
import webPackage from "../../../package.json";
import samuelAvatar from "../../assets/avatars/avatar-samuel-mentor-neutral.png";

export function CurrentCaseTask({ controller: c, entered, onEnter }: { controller: CaseAttemptController; entered: boolean; onEnter: () => void }): JSX.Element {
  const editorAssist = useRef<QueryAssistHandle>(null);
  const [result, setResult] = useState<RuntimeQueryResponse | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"success" | "advisory">("advisory");
  const [selectedTable, setSelectedTable] = useState("");
  const activeAttempt = useRef(c.snapshot?.attemptId); activeAttempt.current = c.snapshot?.attemptId;
  const [feedbackView, setFeedbackView] = useState<string | null>(null);
  const errorView = useRef<string | null>(null);
  const caseArt = getStudentCaseLibraryEntry(c.caseId ?? c.snapshot?.caseId);
  const caseLabel = `Case ${(c.dossier?.caseId ?? c.snapshot?.caseId ?? c.caseId ?? "").replace(/^case-/, "")}`;
  useEffect(() => { setResult(null); setFeedback(null); }, [c.snapshot?.attemptId]);
  useEffect(() => { if (!entered) return; let active = true; setSchemaError(null); void getSchemaTables().then(response => { if (active) setSchema(response); }).catch(() => { if (active) { setSchema(null); setSchemaError("Table references are unavailable. You can still run your query."); } }); return () => { active = false; }; }, [entered]);
  async function open(fresh: boolean, id?: string) { await c.open(fresh, id).then(onEnter).catch(() => undefined); }
  if (!entered || !c.snapshot) return <section className="panel panel--full student-case-landing current-case" aria-label="Saved case attempts">
    <div className="student-case-landing__hero">
      {caseArt ? <img className="student-case-landing__hero-image" src={caseArt.landingSceneSrc} alt={caseArt.landingSceneAlt} onError={event => { event.currentTarget.style.display = "none"; }} /> : null}
      <div className="student-case-landing__hero-scrim" aria-hidden="true" />
      <div className="student-case-landing__hero-copy"><p className="student-case-landing__eyebrow">{caseArt?.landingEyebrow ?? "Your next investigation"}</p><h2>{caseLabel}: {c.dossier?.title ?? (c.error ? "Case file unavailable" : "Loading case file…")}</h2></div>
    </div>
    <div className="student-case-landing__content"><section className="student-case-landing__panel student-case-landing__panel--story"><p className="student-case-landing__section-kicker">Case Description</p><p className="student-case-landing__story">{c.dossier?.dossier}</p></section><section className="student-case-landing__panel"><p className="student-case-landing__section-kicker">Inside This File</p><p>{c.dossier?.wholeCaseObjective}</p></section><section className="student-case-landing__panel student-case-landing__panel--dossier"><p className="student-case-landing__section-kicker">Case Dossier</p>
    {c.error ? <div role="alert"><p>{c.error}</p><p>Close this app and double-click Start-SequelDetective.cmd to set up and launch it. If startup fails, send the launcher message to your instructor. Your saved work remains preserved.</p></div> : <p>{c.dossier ? "Saved attempts remain available when you start fresh." : "Loading case repository…"}</p>}
    <div className="student-case-landing__actions"><button className="student-case-landing__button" disabled={c.busy || !c.dossier} onClick={() => void open(false)}>{c.summaries.some(s => s.compatible && ["active", "completed"].includes(s.status)) ? "Resume Case File" : "Open Case File"}</button>
    <button className="student-case-landing__button student-case-landing__button--secondary" disabled={c.busy || !c.dossier} onClick={() => { if (!c.summaries.length || window.confirm("Start a fresh attempt? Your saved attempt will remain available to resume.")) void open(true); }}>Start Fresh</button></div>
    {c.summaries.length ? <details><summary>Saved attempts ({c.summaries.length})</summary><ul aria-label="Saved progress">{c.summaries.map(s => <li key={s.attemptId}>
      {s.status}: {s.progress.completed} of {s.progress.total} tasks proved; saved {new Date(s.progress.savedAtUtc).toLocaleString()}
      <div className="saved-attempt-actions"><button className="samuel-briefing__button" disabled={c.busy || !s.compatible} onClick={() => void open(false, s.attemptId)}>Resume saved attempt</button><button className="samuel-briefing__button" disabled={c.busy} onClick={() => { if (window.confirm(`Permanently delete this ${s.status} attempt (${s.progress.completed} of ${s.progress.total} tasks proved)? Its saved notes and proof will be removed. Other attempts will remain.`)) void c.remove(s.attemptId).catch(() => undefined); }}>Delete saved attempt</button></div>
    </li>)}</ul></details> : null}
    </section></div>
  </section>;
  const s = c.snapshot, w = c.workspace, task = s.task;
  function factCondition(fact: { key: string; value: string }): string {
    return `${fact.key.split(":")[0]} = ${/^\d+$/.test(fact.value) ? fact.value : `'${fact.value.replace(/'/g, "''")}'`}`;
  }
  function starter() {
    if (!task?.starter) return;
    if (w.draftSql.trim() && w.draftSql !== task.starter.sql && !window.confirm("Replace your current draft with this task's starter?")) return;
    c.updateWorkspace({ ...w, draftSql: task.starter.sql });
  }
  async function run() {
    setFeedback(null);
    const id = s.attemptId; errorView.current = "workbench"; setFeedbackView("workbench");
    const response = await c.run(w.draftSql).catch(() => null);
    if (activeAttempt.current !== id) return;
    if (response && response.snapshot?.attemptId === id) setResult(response);
    if (response && !response.progressSaved && response.success) { setFeedbackTone("advisory"); setFeedback(response.message); }
  }
  function importLegacy() {
    // Read legacy envelopes without deleting or promoting their milestone flags.
    const keys = Object.keys(localStorage).filter(k => k.includes(s.caseId));
    let draft = ""; const importedNotes: string[] = [];
    for (const key of keys) {
      try {
        const envelope = JSON.parse(localStorage.getItem(key) ?? "{}");
        const state = envelope.state ?? envelope;
        if (typeof state.studentDraftQuery === "string") draft = state.studentDraftQuery;
        if (typeof state.draftSql === "string") draft = state.draftSql;
        if (Array.isArray(state.notebookEntries)) for (const entry of state.notebookEntries) if (typeof entry.detail === "string") importedNotes.push(`Imported note (unverified): ${entry.detail}`);
      } catch { /* Preserve malformed legacy backups. */ }
    }
    if (draft && w.draftSql.trim() && !window.confirm("Replace your draft with the legacy draft? Progress will not be imported.")) return;
    c.updateWorkspace({ ...w, draftSql: draft || w.draftSql, notes: [...w.notes, ...importedNotes] });
    setFeedbackView(null);
    setFeedback("Imported notes and draft only. Run each task to prove its evidence; legacy saves remain untouched.");
  }
  function exportWorkspace() {
    const blob = new Blob([JSON.stringify({ draftSql: w.draftSql, notes: w.notes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${s.caseId}-workspace.json`; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="protected-case" aria-label="Durable case workspace">
    <div className="current-case-file-heading"><strong>{caseLabel}: {c.dossier?.title}</strong><small>Preview {webPackage.version}</small></div>
    <p role="status">{s.status === "completed" ? (s.completionScope === "full-resolution" ? "Investigation complete" : "Released evidence review complete") : s.status === "archived" ? "Archived attempt — resume before editing" : "Saved attempt"} · {s.progress.completed} of {s.progress.total} tasks proved · {c.dirty ? "Unsaved changes" : `Saved ${new Date(s.progress.savedAtUtc).toLocaleString()}`}</p>
    {s.status === "archived" ? <button disabled={c.busy} onClick={() => void open(false, s.attemptId)}>Resume this attempt</button> : null}
    <ProtectedCaseHeader activeView={w.selectedView} caseStatus={`${caseLabel} · ${c.dossier?.title ?? ""} · ${s.progress.completed}/${s.progress.total} tasks proved`} mentorTitle={w.selectedView === "briefing" ? `${caseLabel} Briefing` : task?.title ?? "Review the evidence you proved."} studentObjective={w.selectedView === "briefing" ? c.dossier?.wholeCaseObjective ?? "" : task?.objective ?? (s.completionScope === "full-resolution" ? "Your proved investigation is complete." : "The released evidence trail is complete. Culprit verification is not part of this release.")} mentorMessage={w.selectedView === "briefing" ? c.dossier?.dossier ?? "" : task?.direction ?? (s.completionScope === "full-resolution" ? "Review your notes and the confirmed case resolution." : "You have completed this release's report and interview trail. Keep your evidence for review; identifying and verifying the culprit belongs to a later release.")} samuelAvatarSrc={samuelAvatar} studentScene={{ visual: "crime-ledger", imageSrc: w.selectedView === "case-board" ? reviewScene : queryScene, alt: w.selectedView === "workbench" ? "Crime ledger dossier under a desk lamp" : w.selectedView === "case-board" ? "Case notes laid out for evidence review" : caseArt?.landingSceneAlt ?? "Detective case records" }}>
    </ProtectedCaseHeader>
    <nav className="student-view-tabs" aria-label="Student Case Actions">{([ ["briefing", "Samuel's Briefing"], ["workbench", "Query Lab"], ["case-board", "Evidence Board"] ] as const).map(([view, label]) => <button key={view} aria-pressed={w.selectedView === view} onClick={() => c.updateWorkspace({ ...w, selectedView: view })}>{label}</button>)}</nav>
    {w.selectedView === "briefing" ? <section className="panel panel--full samuel-briefing samuel-briefing--primary" aria-label="Case briefing details">
      <div className="samuel-briefing__header"><div><p className="samuel-briefing__kicker">{caseLabel}</p><h2>{c.dossier?.title}</h2></div><p className="samuel-briefing__badge">Breadcrumbs {s.progress.completed} / {s.progress.total}</p></div>
      <div className="samuel-briefing__layout samuel-briefing__layout--single"><section className="samuel-briefing__mission"><div className="samuel-briefing__prompt samuel-briefing__case-file"><p className="samuel-briefing__prompt-title">Case File Snapshot</p><ul className="known-case-facts-list"><li>{c.dossier?.dossier}</li></ul></div><button className="samuel-briefing__button" onClick={() => c.updateWorkspace({ ...w, selectedView: "workbench" })}>Open Query Lab</button></section></div>
    </section> : null}
    {w.selectedView === "workbench" ? <ProtectedCaseWorkbench schema={schema} schemaError={schemaError} dossier={c.dossier?.dossier} facts={<ul className="evidence-snapshot-list">{s.facts.map(f => <li key={`${f.key}-${f.sourceActionId}`}><button className="evidence-snapshot-detail-button" onClick={() => editorAssist.current?.insert(factCondition(f))}><span className="evidence-snapshot-detail">{f.label}: {f.value}</span></button></li>)}</ul>}>
      {w.selectedView === "workbench" && task ? <>{task.hint ? <details><summary>Hint</summary><p>{task.hint}</p>{s.facts.length ? <section aria-label="Proved facts for this query"><p>Build your WHERE conditions from the evidence you have already proved:</p><ul>{s.facts.map(fact => <li key={`${fact.key}-${fact.sourceActionId}`}><button type="button" className="query-builder-block" onClick={() => editorAssist.current?.insert(factCondition(fact))}><strong>{fact.label}</strong>: <code>{factCondition(fact)}</code></button></li>)}</ul></section> : null}</details> : null}{task.starter ? <div className="protected-case-starter"><pre>{task.starter.sql}</pre><button onClick={starter} disabled={Object.keys(task.starter.placeholders).length > 0}>Use starter</button>{w.draftSql.trim() && w.draftSql !== task.starter.sql ? <p className="message-muted">Your draft is retained.</p> : null}</div> : null}</> : null}
      <ProtectedCaseQueryEditor assistRef={editorAssist} sql={w.draftSql} onChange={draftSql => c.updateWorkspace({ ...w, draftSql })} onRun={run} disabled={c.busy || s.status === "archived" || !w.draftSql.trim()} />
      {result ? <section aria-label="Query feedback"><p role="status">{result.message}{result.success && !result.progressSaved ? " No task was marked complete from this response." : ""}</p>{result.success ? <QueryResultsTable result={result.data} audience="student" onStudentLogRow={async row => {
        setFeedback(null);
        if (!result.actionId) return { status: "rejected", message: "Run again before logging." };
        const index = result.data.rows.indexOf(row);
        errorView.current = "workbench"; setFeedbackView("workbench"); await c.log(result.actionId, index); if (activeAttempt.current === s.attemptId) { setFeedbackTone("success"); setFeedback("Row logged to your saved notebook."); }
        return { status: "logged", message: "Row logged to your saved notebook." };
      }} /> : null}</section> : null}
      {feedback && feedbackView === "workbench" ? <div className={`student-evidence-feedback student-evidence-feedback--${feedbackTone}`} role="status"><p className="student-evidence-feedback__kicker">{feedbackTone === "success" ? "Clue logged" : "Query feedback"}</p><p>{feedback}</p></div> : null}
    </ProtectedCaseWorkbench> : null}
    {w.selectedView === "case-board" ? <ProtectedCaseBoard controller={c} /> : null}
    {c.error && (errorView.current === null || errorView.current === w.selectedView) ? <p role="alert">{c.error}</p> : null}{feedback && feedbackView === null ? <p role="status">{feedback}</p> : null}
    <footer className="current-case-actions"><button className="samuel-briefing__button" disabled={c.busy} onClick={() => { errorView.current = null; void c.save().catch(() => undefined); }}>Save workspace</button><details className="current-case-tools"><summary>Case tools</summary><div className="current-case-actions"><button onClick={exportWorkspace}>Export notes and draft</button><button disabled={c.busy} onClick={importLegacy}>Import legacy notes and draft</button><button disabled={c.busy} onClick={() => { if (window.confirm("Start a fresh attempt? This saved attempt will remain available to resume.")) void open(true); }}>Start Fresh</button><button disabled={c.busy} onClick={() => { if (window.confirm("Permanently delete this saved attempt and its proof?")) void c.remove().catch(() => undefined); }}>Delete this attempt</button></div></details></footer>
  </section>;
}
