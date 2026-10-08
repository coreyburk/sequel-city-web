import { useEffect, useRef, useState } from "react";
import { createCaseAttempt, executeAttemptQuery, getCaseAttempts, getCaseDossiers, getCaseAttempt, logAttemptRow, resumeCaseAttempt, RuntimeRequestError, saveCaseWorkspace, caseRequest } from "./api/client";
import type { AttemptSnapshot, AttemptSummary, CaseDossier, CaseWorkspace, RuntimeQueryResponse } from "./api/types";

export function useCaseAttempt(caseId: string | null) {
  const [dossier, setDossier] = useState<CaseDossier | null>(null);
  const [summaries, setSummaries] = useState<AttemptSummary[]>([]);
  const [snapshot, setSnapshot] = useState<AttemptSnapshot | null>(null);
  const [workspace, setWorkspace] = useState<CaseWorkspace>({ draftSql: "", notes: [], selectedView: "briefing" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const current = useRef<AttemptSnapshot | null>(null);
  const local = useRef(workspace);
  const edits = useRef(0);
  const identity = useRef(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const pending = useRef(0);
  const selectedCase = useRef(caseId); selectedCase.current = caseId;

  function accept(s: AttemptSnapshot, dispatchedEdits: number, replace = false, requestIdentity = identity.current): void {
    if (requestIdentity !== identity.current || s.caseId !== selectedCase.current) return;
    if (!replace && current.current && (current.current.attemptId !== s.attemptId || current.current.contentVersion !== s.contentVersion || current.current.evidenceVersion !== s.evidenceVersion || BigInt(s.revision) < BigInt(current.current.revision))) return;
    current.current = s; setSnapshot(s);
    if (replace || edits.current === dispatchedEdits) { local.current = s.workspace; setWorkspace(s.workspace); setDirty(false); }
  }
  function updateWorkspace(w: CaseWorkspace): void { edits.current++; local.current = w; setWorkspace(w); setDirty(true); }
  async function refreshSummaries() { const active = identity.current; if (caseId) { const result = await getCaseAttempts(caseId); if (active === identity.current) setSummaries(result.attempts); } }
  async function serialized<T>(operation: (active: number) => Promise<T>): Promise<T> {
    const activeIdentity = identity.current;
    pending.current++; setBusy(true);
    const run = queue.current.catch(() => undefined).then(async () => {
      if (activeIdentity !== identity.current) throw new Error("Case selection changed.");
      return operation(activeIdentity);
    });
    queue.current = run;
    try { setError(null); return await run; }
    catch (e) {
      if (activeIdentity === identity.current) {
        setError(e instanceof Error ? e.message : "Case could not be saved.");
        if (e instanceof RuntimeRequestError && e.snapshot) accept(e.snapshot, -1);
      }
      throw e;
    } finally { pending.current--; if (activeIdentity === identity.current) setBusy(pending.current > 0); }
  }
  useEffect(() => {
    identity.current++; const active = identity.current; current.current = null; setSnapshot(null); setDossier(null); setSummaries([]); setError(null); setDirty(false); setBusy(false);
    if (!caseId) return;
    void Promise.all([getCaseDossiers(), getCaseAttempts(caseId)]).then(([cases, attempts]) => {
      if (identity.current !== active) return;
      setDossier(cases.cases.find(d => d.caseId === caseId) ?? null); setSummaries(attempts.attempts);
    }).catch(e => { if (identity.current === active) setError(e instanceof Error ? e.message : "Case unavailable."); });
    return () => { identity.current++; };
  }, [caseId]);
  async function save(): Promise<void> {
    await serialized(async active => {
      const s = current.current; if (!s) return;
      const dispatched = edits.current;
      const updated = await saveCaseWorkspace(s, local.current);
      accept(updated, dispatched, false, active);
    });
  }
  useEffect(() => {
    if (!dirty || !snapshot || busy || error) return;
    const timer = window.setTimeout(() => { void save().catch(() => undefined); }, 700);
    return () => window.clearTimeout(timer);
  }, [dirty, workspace, snapshot?.attemptId, busy, error]);
  async function open(fresh = false, attemptId?: string): Promise<void> {
    await serialized(async active => {
      if (!caseId) return;
      if (current.current && dirty && ["active", "completed"].includes(current.current.status)) { const dispatched = edits.current; const saved = await saveCaseWorkspace(current.current, local.current); accept(saved, dispatched, false, active); }
      const chosen = attemptId ? summaries.find(s => s.attemptId === attemptId) : summaries.find(s => s.compatible && (s.status === "active" || s.status === "completed"));
      let result = fresh || !chosen ? await createCaseAttempt(caseId) : await getCaseAttempt(chosen.attemptId);
      if (!fresh && result.status === "archived") result = await resumeCaseAttempt(result);
      const retainUnsaved = current.current?.attemptId === result.attemptId && local.current.draftSql !== current.current.workspace.draftSql;
      if (active !== identity.current) return;
      edits.current++; accept(result, retainUnsaved ? -1 : edits.current, !retainUnsaved, active); await refreshSummaries();
    });
  }
  async function run(sql: string): Promise<RuntimeQueryResponse> {
    return serialized(async active => {
      let s = current.current; if (!s) throw new Error("Open an attempt first.");
      const dispatched = edits.current;
      // Save draft before execution; later typing is guarded by local edit generation.
      s = await saveCaseWorkspace(s, local.current); accept(s, dispatched, false, active);
      if (active !== identity.current) throw new Error("Case selection changed.");
      const result = await executeAttemptQuery(s, sql);
      if (result.snapshot) accept(result.snapshot, dispatched, false, active);
      return result;
    });
  }
  async function log(actionId: string, rowIndex: number): Promise<void> {
    await serialized(async active => {
      let s = current.current; if (!s) return;
      const dispatched = edits.current;
      const savedNotes = [...local.current.notes];
      s = await saveCaseWorkspace(s, local.current); accept(s, dispatched, false, active);
      if (active !== identity.current) return;
      const updated = await logAttemptRow(s, actionId, rowIndex);
      if (active !== identity.current) return;
      if (edits.current !== dispatched) { local.current = { ...local.current, notes: [...updated.workspace.notes, ...local.current.notes.slice(savedNotes.length)] }; setWorkspace(local.current); }
      accept(updated, dispatched, false, active);
    });
  }
  async function remove(): Promise<void> {
    await serialized(async active => {
      const s = current.current; if (!s) return;
      await caseRequest(`/api/attempts/${s.attemptId}`, "DELETE", { requestId: crypto.randomUUID(), expectedRevision: s.revision });
      if (active !== identity.current) return;
      current.current = null; setSnapshot(null); setDirty(false); await refreshSummaries();
    });
  }
  return { caseId, dossier, summaries, snapshot, workspace, error, busy, dirty, open, save, run, log, remove, updateWorkspace };
}
export type CaseAttemptController = ReturnType<typeof useCaseAttempt>;
