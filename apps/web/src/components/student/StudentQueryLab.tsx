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

export function StudentQueryLab({ controller: c, entered, onEnter }: { controller: CaseAttemptController; entered: boolean; onEnter: () => void }): JSX.Element {
  const [theory, setTheory] = useState("");
  const [starterUndo, setStarterUndo] = useState<{ attemptId: string; draft: string; starter: string } | null>(null);
  const mounted = useRef(true);
  const activeCase = useRef(c.caseId); activeCase.current = c.caseId;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const editorAssist = useRef<QueryAssistHandle>(null);
  const [result, setResult] = useState<RuntimeQueryResponse | null>(null);
  const [resultSql, setResultSql] = useState("");
  const runSequence = useRef(0);
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
  useEffect(() => { runSequence.current++; setResult(null); setFeedback(null); }, [c.snapshot?.attemptId]);
  useEffect(() => { if (!entered) return; let active = true; setSchemaError(null); void getSchemaTables().then(response => { if (active) setSchema(response); }).catch(() => { if (active) { setSchema(null); setSchemaError("Table references are unavailable. You can still run your query."); } }); return () => { active = false; }; }, [entered]);
  async function open(fresh: boolean, id?: string) { const caseId = c.caseId; await c.open(fresh, id).then(() => { if (mounted.current && activeCase.current === caseId) onEnter(); }).catch(() => undefined); }
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
  function factCondition(fact: typeof s.facts[number]): string {
    const column = fact.column ?? fact.key.split(":")[0];
    const numeric = fact.valueType ? ["integer","decimal"].includes(fact.valueType) : /^\d+$/.test(fact.value);
    const escaped = fact.value.replace(/'/g, "''");
    if (fact.operator === "prefix" || fact.operator === "contains") return `${column} LIKE '${fact.operator === "contains" ? "%" : ""}${escaped}%'`;
    return `${column} = ${numeric ? fact.value : `'${escaped}'`}`;
  }
  function briefingCondition(fact: NonNullable<typeof s.briefingFacts>[number]): string {
    const value = fact.valueType === "integer" || fact.valueType === "decimal" ? fact.value : `'${fact.value.replace(/'/g, "''")}'`;
    return `${fact.column} = ${value}`;
  }
  function briefingTokens() {
    const facts = s.briefingFacts ?? [];
    return facts.length ? <section aria-label="Facts from case briefing"><p>From your case briefing:</p><ul>{facts.map(fact => <li key={fact.key}><button type="button" className="query-builder-block" onClick={() => editorAssist.current?.insert(briefingCondition(fact))}>{fact.label}: <code>{briefingCondition(fact)}</code></button></li>)}</ul></section> : null;
  }
  function starter() {
    if (!task?.starter) return;
    if (w.draftSql === task.starter.sql) return;
    setStarterUndo({ attemptId: s.attemptId, draft: w.draftSql, starter: task.starter.sql });
    c.updateWorkspace({ ...w, draftSql: task.starter.sql });
  }
  async function run() {
    setFeedback(null); setResult(null);
    const sequence = ++runSequence.current;
    const sql = w.draftSql;
    const id = s.attemptId; errorView.current = "workbench"; setFeedbackView("workbench");
    const response = await c.run(sql).catch(() => null);
    if (!mounted.current || activeAttempt.current !== id || runSequence.current !== sequence) return;
    if (response && response.snapshot?.attemptId === id) { setResultSql(sql); setResult(response); }
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
    {c.dossier && c.dossier.contentVersion > s.contentVersion ? <p role="status">This saved attempt uses case version {s.contentVersion}. Start Fresh to use version {c.dossier.contentVersion} and its updated guidance and query tokens. This attempt will remain available.</p> : null}
    <p role="status">{s.status === "completed" ? (s.completionScope === "full-resolution" ? "Investigation complete" : "Released evidence review complete") : s.status === "archived" ? "Archived attempt — resume before editing" : "Saved attempt"} · {s.progress.completed} of {s.progress.total} tasks proved · {c.dirty ? "Unsaved changes" : `Saved ${new Date(s.progress.savedAtUtc).toLocaleString()}`}</p>
    {s.status === "archived" ? <button disabled={c.busy} onClick={() => void open(false, s.attemptId)}>Resume this attempt</button> : null}
    <ProtectedCaseHeader activeView={w.selectedView} caseStatus={`${caseLabel} · ${c.dossier?.title ?? ""} · ${s.progress.completed}/${s.progress.total} tasks proved`} mentorTitle={w.selectedView === "briefing" ? `${caseLabel} Briefing` : task?.title ?? "Review the evidence you proved."} studentObjective={w.selectedView === "briefing" ? c.dossier?.wholeCaseObjective ?? "" : task?.objective ?? (s.completionScope === "full-resolution" ? "Your proved investigation is complete." : "The released evidence trail is complete. Culprit verification is not part of this release.")} mentorMessage={w.selectedView === "briefing" ? c.dossier?.dossier ?? "" : task?.direction ?? (s.completionScope === "full-resolution" ? "Review your notes and the confirmed case resolution." : "You have completed this release's report and interview trail. Keep your evidence for review; identifying and verifying the culprit belongs to a later release.")} samuelAvatarSrc={samuelAvatar} studentScene={{ visual: "crime-ledger", imageSrc: w.selectedView === "case-board" ? reviewScene : queryScene, alt: w.selectedView === "workbench" ? "Crime ledger dossier under a desk lamp" : w.selectedView === "case-board" ? "Case notes laid out for evidence review" : caseArt?.landingSceneAlt ?? "Detective case records" }}>
    </ProtectedCaseHeader>
    <nav className="student-view-tabs" aria-label="Student Case Actions">{([ ["briefing", "Samuel's Briefing"], ["workbench", "Query Lab"], ["case-board", "Evidence Board"] ] as const).map(([view, label]) => <button key={view} aria-pressed={w.selectedView === view} aria-current={w.selectedView === view ? "page" : undefined} onClick={() => c.updateWorkspace({ ...w, selectedView: view })}>{label}</button>)}</nav>
    {w.selectedView === "briefing" ? <div className="protected-case-briefing-action"><button className="samuel-briefing__button" onClick={() => c.updateWorkspace({ ...w, selectedView: "workbench" })}>Open Query Lab</button></div> : null}
    {w.selectedView === "workbench" ? <ProtectedCaseWorkbench schema={schema} schemaError={schemaError} dossier={c.dossier?.dossier} knownFacts={briefingTokens()} facts={<><ul className="evidence-snapshot-list">{s.facts.map(f => <li key={`${f.key}-${f.sourceActionId}`}>{f.column === null ? <span className="evidence-snapshot-detail">{f.label}: {f.value}</span> : <button type="button" className="query-builder-block" onClick={() => editorAssist.current?.insert(factCondition(f))}><span className="evidence-snapshot-detail">{f.label}: {f.value}</span></button>}</li>)}</ul>{s.collectedDetails?.length ? <section aria-label="Collected evidence details"><h3>Collected evidence details</h3><p>Values from proved query results and rows you logged. These details do not prove additional tasks.</p><ul className="evidence-snapshot-list">{s.collectedDetails.filter(detail => !(detail.column === "CrimeType" && s.facts.some(fact => (fact.column ?? fact.key.split(":")[0]) === "CrimeID")) && !s.facts.some(fact => (fact.column ?? fact.key.split(":")[0]) === detail.column && fact.value === detail.value)).map(detail => <li key={detail.key}>{detail.column && /(?:ID|Name|City|Date)$/.test(detail.column) ? <button type="button" className="query-builder-block" onClick={() => editorAssist.current?.insert(factCondition(detail))}>{detail.label}: {detail.value}</button> : <p><strong>{detail.label}</strong>: {detail.value}</p>}</li>)}</ul></section> : null}</>}>
      {w.selectedView === "workbench" && task ? <>{task.hint ? <details><summary>Hint</summary><p>{task.hint}</p></details> : null}<section aria-label="Current query helper tokens">{briefingTokens()}{s.facts.some(fact => fact.column !== null && fact.eligibleForTask !== false) ? <section aria-label="Proved facts for this query"><p>Build your WHERE conditions from the evidence you have already proved:</p><ul>{s.facts.filter(fact => fact.column !== null && fact.eligibleForTask !== false).map(fact => <li key={`${fact.key}-${fact.sourceActionId}`}><button type="button" className="query-builder-block" onClick={() => editorAssist.current?.insert(factCondition(fact))}><strong>{fact.label}</strong>: <code>{factCondition(fact)}</code></button></li>)}</ul></section> : null}</section>{task.starter ? <div className="protected-case-starter"><pre>{task.starter.sql}</pre><button onClick={starter} disabled={Object.keys(task.starter.placeholders).length > 0}>Use starter</button>{starterUndo?.attemptId === s.attemptId && w.draftSql === starterUndo.starter ? <button type="button" onClick={() => { c.updateWorkspace({ ...w, draftSql: starterUndo.draft }); setStarterUndo(null); }}>Undo starter</button> : null}{w.draftSql.trim() && w.draftSql !== task.starter.sql ? <p className="message-muted">Your draft is retained.</p> : null}</div> : null}</> : null}
      {task?.collection && task.collection.required > 1 ? <p role="status">Collected evidence: {task.collection.accepted} / {task.collection.required}</p> : null}<ProtectedCaseQueryEditor assistRef={editorAssist} sql={w.draftSql} onChange={draftSql => c.updateWorkspace({ ...w, draftSql })} onRun={run} disabled={c.busy || s.status === "archived" || !w.draftSql.trim()} />
      {result ? <section aria-label="Query feedback"><div role="status" aria-live="polite" aria-atomic="true" className={feedback && feedbackView === "workbench" ? `student-evidence-feedback student-evidence-feedback--${feedbackTone}` : undefined}>
          {feedback && feedbackView === "workbench" ? <><p className="student-evidence-feedback__kicker">{feedbackTone === "success" ? "Clue logged" : "Query feedback"}</p><p>{feedback}</p>{feedbackTone === "success" ? <p>{s.status === "completed" ? (s.completionScope === "full-resolution" ? "Investigation complete. Review your saved notebook." : "Released evidence review complete. Culprit verification is not included in this release.") : task?.collection && task.collection.accepted > 0 && task.collection.accepted < task.collection.required ? `Saved collection: ${task.collection.accepted} of ${task.collection.required} distinct observations. Keep collecting the remaining evidence.` : "Follow Samuel's current direction; your draft is retained."}</p> : null}</> : result.feedback ? <><p><strong>{result.feedback.title}</strong></p><p>{result.feedback.explanation}</p><p>{result.feedback.nextAction}</p></> : <p>{result.message}{result.success && !result.progressSaved ? " No task was marked complete from this response." : ""}</p>}
          {w.draftSql !== resultSql ? <p className="message-muted">This feedback is for the last executed query. Run your edited draft to check it.</p> : null}
        </div>{result.success && result.data.rows.length > 0 ? <QueryResultsTable result={result.data} audience="student" studentLogFeedbackMode="multi" onStudentLogRow={async row => {
        setFeedback(null);
        if (!result.actionId) return { status: "rejected", message: "Run again before logging." };
        const index = result.data.rows.indexOf(row);
        const logSequence = runSequence.current;
        errorView.current = "workbench"; setFeedbackView("workbench"); const logged = await c.log(result.actionId, index); if (mounted.current && activeAttempt.current === s.attemptId && runSequence.current === logSequence) { setFeedbackTone(logged === false ? "advisory" : "success"); setFeedback(logged === false ? "This clue is already logged." : (s.caseId === "case-001" && s.contentVersion === 3 && result.data.columns.some(column => column.name === "CrimeType") ? "Murder clue saved and pinned. Follow Samuel's updated direction." : s.caseId === "case-001" && s.contentVersion === 3 ? "Saved to your notebook. A matching steward statement also proves that account; follow Samuel's current direction." : "Row logged to your saved notebook.")); }
        return { status: logged === false ? "duplicate" : "logged", message: logged === false ? "This clue is already logged." : (s.caseId === "case-001" && s.contentVersion === 3 && result.data.columns.some(column => column.name === "CrimeType") ? "Murder clue saved and pinned. Follow Samuel's updated direction." : s.caseId === "case-001" && s.contentVersion === 3 ? "Saved to your notebook. A matching steward statement also proves that account; follow Samuel's current direction." : "Row logged to your saved notebook.") };
      }} /> : null}</section> : null}

    </ProtectedCaseWorkbench> : null}
        {w.selectedView === "case-board" ? <><ProtectedCaseBoard controller={c} />{task?.completionMode === "verify" ? <section className="panel student-suspect-theory-panel" aria-label="Suspect Theory Check"><h2>Suspect Theory Check</h2><p>{task.objective}</p><fieldset className="student-theory-options"><legend>Names from your proved identities</legend>{task.theoryChoices?.map(name => <label key={name} className="student-theory-candidate"><input type="radio" name="suspect-choice" value={name} checked={theory === name} onChange={() => setTheory(name)} /><span>{name}</span></label>)}</fieldset><label htmlFor="suspect-theory">Suspect name</label><input className="text-input" id="suspect-theory" value={theory} onChange={event => setTheory(event.target.value)} /><button className="samuel-briefing__button" disabled={c.busy || !theory.trim()} onClick={() => { errorView.current = "case-board"; void c.verify(theory).then(() => setTheory("")).catch(() => undefined); }}>Test Theory</button></section> : null}</> : null}
    {c.error && (errorView.current === null || errorView.current === w.selectedView) ? <p role="alert">{c.error}</p> : null}{feedback && feedbackView === null ? <p role="status">{feedback}</p> : null}
    <footer className="current-case-actions"><button className="samuel-briefing__button" disabled={c.busy} onClick={() => { errorView.current = null; void c.save().catch(() => undefined); }}>Save workspace</button><details className="current-case-tools"><summary>Case tools</summary><div className="current-case-actions"><button onClick={exportWorkspace}>Export notes and draft</button><button disabled={c.busy} onClick={importLegacy}>Import legacy notes and draft</button><button disabled={c.busy} onClick={() => { if (window.confirm("Start a fresh attempt? This saved attempt will remain available to resume.")) void open(true); }}>Start Fresh</button><button disabled={c.busy} onClick={() => { if (window.confirm("Permanently delete this saved attempt and its proof?")) void c.remove().catch(() => undefined); }}>Delete this attempt</button></div></details></footer>
  </section>;
}
