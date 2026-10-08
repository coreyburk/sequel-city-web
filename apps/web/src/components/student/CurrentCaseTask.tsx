import { useEffect, useState } from "react";
import { getSchemaTables } from "../../api/client";
import type { RuntimeQueryResponse, SchemaResponse } from "../../api/types";
import type { CaseAttemptController } from "../../useCaseAttempt";
import { QueryResultsTable } from "../QueryResultsTable";
import samuelAvatar from "../../assets/avatars/avatar-samuel-tupleton.png";

export function CurrentCaseTask({ controller: c, entered, onEnter }: { controller: CaseAttemptController; entered: boolean; onEnter: () => void }): JSX.Element {
  const [result, setResult] = useState<RuntimeQueryResponse | null>(null);
  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const caseLabel = `Case ${(c.dossier?.caseId ?? c.snapshot?.caseId ?? c.caseId ?? "").replace(/^case-/, "")}`;
  useEffect(() => { setResult(null); setFeedback(null); }, [c.snapshot?.attemptId]);
  useEffect(() => { if (entered) void getSchemaTables().then(setSchema).catch(() => setSchema(null)); }, [entered]);
  async function open(fresh: boolean, id?: string) { await c.open(fresh, id).then(onEnter).catch(() => undefined); }
  if (!entered || !c.snapshot) return <section className="panel panel--full student-case-landing" aria-label="Saved case attempts">
    <h2>{caseLabel}: {c.dossier?.title ?? "Loading case file…"}</h2>
    <p>{c.dossier?.dossier}</p>
    <p>{c.error ?? (c.dossier ? "Saved attempts remain available when you start fresh." : "Loading case repository…")}</p>
    <button disabled={c.busy || !c.dossier} onClick={() => void open(false)}>{c.summaries.some(s => s.compatible && ["active", "completed"].includes(s.status)) ? "Resume Case File" : "Open Case File"}</button>
    <button disabled={c.busy || !c.dossier} onClick={() => void open(true)}>Start Fresh</button>
    <ul aria-label="Saved progress">{c.summaries.map(s => <li key={s.attemptId}>
      {s.status}: {s.progress.completed} of {s.progress.total} tasks proved; saved {new Date(s.progress.savedAtUtc).toLocaleString()}
      <button disabled={c.busy || !s.compatible} onClick={() => void open(false, s.attemptId)}>Resume saved attempt</button>
    </li>)}</ul>
    {c.error ? <p role="alert">{c.error}</p> : null}
  </section>;
  const s = c.snapshot, w = c.workspace, task = s.task;
  function starter() {
    if (!task?.starter) return;
    if (w.draftSql.trim() && w.draftSql !== task.starter.sql && !window.confirm("Replace your current draft with this task's starter?")) return;
    c.updateWorkspace({ ...w, draftSql: task.starter.sql });
  }
  async function run() {
    const id = s.attemptId;
    const response = await c.run(w.draftSql).catch(() => null);
    if (response && response.snapshot?.attemptId === id) setResult(response);
    if (response && !response.progressSaved && response.success) setFeedback(response.message);
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
    setFeedback("Imported notes and draft only. Run each task to prove its evidence; legacy saves remain untouched.");
  }
  function exportWorkspace() {
    const blob = new Blob([JSON.stringify({ draftSql: w.draftSql, notes: w.notes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${s.caseId}-workspace.json`; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="panel panel--full current-case" aria-label="Durable case workspace">
    <p role="status">{s.status === "completed" ? "Released evidence review complete" : s.status === "archived" ? "Archived attempt — resume before editing" : "Saved attempt"} · {s.progress.completed} of {s.progress.total} tasks proved · {c.dirty ? "Unsaved changes" : `Saved ${new Date(s.progress.savedAtUtc).toLocaleString()}`}</p>
    {s.status === "archived" ? <button disabled={c.busy} onClick={() => void open(false, s.attemptId)}>Resume this attempt</button> : null}
    <nav className="student-view-tabs" aria-label="Student Case Actions">{([ ["briefing", "Samuel's Briefing"], ["workbench", "Query Lab"], ["case-board", "Evidence Board"] ] as const).map(([view, label]) => <button key={view} aria-pressed={w.selectedView === view} onClick={() => c.updateWorkspace({ ...w, selectedView: view })}>{label}</button>)}</nav>
    {w.selectedView === "briefing" ? <section aria-label="Whole case briefing">
      <h2>{caseLabel} Briefing</h2><h3>What this case asks you to prove</h3><p>{c.dossier?.wholeCaseObjective}</p><p>{c.dossier?.dossier}</p>
      <button onClick={() => c.updateWorkspace({ ...w, selectedView: "workbench" })}>Open Query Lab</button>
    </section> : null}
    {w.selectedView === "workbench" ? <section aria-label="Query Lab">
      <section className="current-case-task" aria-label="Samuel's Guidance">
        <header className="current-case-task__heading"><img src={samuelAvatar} alt="Samuel Tupleton" /><div><h2>Samuel&apos;s Guidance</h2><h3>{task?.title ?? "Review the evidence you proved."}</h3></div></header>
        <p>{task?.direction ?? "You have completed this release's report and interview trail. Keep your evidence for review; identifying and verifying the culprit belongs to a later release."}</p>
        {task?.hint ? <details><summary>Hint</summary><p>{task.hint}</p></details> : null}
        {task?.starter ? <div><pre>{task.starter.sql}</pre><button onClick={starter} disabled={Object.keys(task.starter.placeholders).length > 0}>Use starter</button>{w.draftSql.trim() && w.draftSql !== task.starter.sql ? <p>Your draft is retained. The offered starter is for the current task.</p> : null}</div> : null}
      </section>
      <details><summary>Case File and proved facts</summary><p>{c.dossier?.dossier}</p><ul>{s.facts.map(f => <li key={`${f.key}-${f.sourceActionId}`}><button onClick={() => c.updateWorkspace({ ...w, draftSql: `${w.draftSql}${w.draftSql.endsWith(" ") ? "" : " "}${f.key.split(":")[0]} = ${/^\d+$/.test(f.value) ? f.value : `'${f.value.replace(/'/g, "''")}'`}` })}>{f.label}: {f.value}</button></li>)}</ul></details>
      <details><summary>Schema tools</summary>{schema?.data.tables.map(t => <details key={t.fullName}><summary>{t.fullName}</summary><p>{t.columns.map(col => col.columnName).join(", ")}</p></details>) ?? <p>Schema unavailable. Check the local database setup.</p>}</details>
      <form className="query-controls" onSubmit={e => { e.preventDefault(); void run(); }}><label htmlFor="current-case-sql">SQL Query</label><textarea id="current-case-sql" value={w.draftSql} onChange={e => c.updateWorkspace({ ...w, draftSql: e.target.value })} /><button className="query-runner-submit" type="submit" disabled={c.busy || s.status === "archived" || !w.draftSql.trim()}>Run Query</button></form>
      {result ? <section aria-label="Query feedback"><p role="status">{result.message}{result.success && !result.progressSaved ? " No task was marked complete from this response." : ""}</p>{result.success ? <QueryResultsTable result={result.data} audience="student" onStudentLogRow={async row => {
        if (!result.actionId) return { status: "rejected", message: "Run again before logging." };
        const index = result.data.rows.indexOf(row);
        await c.log(result.actionId, index); setFeedback("Row logged to your saved notebook.");
        return { status: "logged", message: "Row logged to your saved notebook." };
      }} /> : null}</section> : null}
    </section> : null}
    {w.selectedView === "case-board" ? <section aria-label="Evidence Notebook"><h2>Evidence Notebook</h2><ul>{w.notes.map((note, index) => <li key={index}>{note}</li>)}</ul><label htmlFor="case-note">Add a note</label><textarea id="case-note" value={notes} onChange={e => setNotes(e.target.value)} /><button onClick={() => { if (notes.trim()) c.updateWorkspace({ ...w, notes: [...w.notes, notes.trim()] }); setNotes(""); }}>Save note</button></section> : null}
    {c.error ? <p role="alert">{c.error}</p> : null}{feedback ? <p role="status">{feedback}</p> : null}
    <footer className="current-case-actions"><button disabled={c.busy} onClick={() => void c.save().catch(() => undefined)}>Save workspace</button><button onClick={exportWorkspace}>Export notes and draft</button><button disabled={c.busy} onClick={importLegacy}>Import legacy notes and draft</button><button disabled={c.busy} onClick={() => { if (window.confirm("Start a fresh attempt? This saved attempt will remain available to resume.")) void open(true); }}>Start Fresh</button><button disabled={c.busy} onClick={() => { if (window.confirm("Permanently delete this saved attempt and its proof?")) void c.remove().catch(() => undefined); }}>Delete this attempt</button></footer>
  </section>;
}
