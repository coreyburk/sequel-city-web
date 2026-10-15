import { queryLearningFeedback, type LearningOutcome } from "./queryAttemptFeedbackService.ts";
import { CASE004_HANDLERS, collectCase004, evidenceField, type Case004Step, type CollectionProof } from "./case004ProgressionService.ts";
import { verifySuspect } from "./caseVerificationService.ts";
import { createHash, randomUUID } from "node:crypto";
import { CaseRuntimeRepository } from "../repositories/caseRuntimeRepository.ts";
import { executeSafeQuery, readCase001ProofRows, readCase004ProofRows } from "./queryExecutionService.ts";
import { validateCase001CrimeTypeIdentified, validateCase001ClocktowerReportLocated, validateCase001ClocktowerReportInterviewsLocated } from "./case001ResultPatternService.ts";
import { CaseRuntimeError, type AttemptSnapshot, type AttemptRecord, type CaseContent, type CaseWorkspace, type ProvenFact, type RuntimeMutation } from "../types/caseRuntime.ts";
import type { QueryExecutionResponse, QueryRow } from "../types/query.ts";
import type { Transaction } from "mssql";
import { validateSqlSafety } from "./sqlSafetyService.ts";

type Proof = { stepKey: string; facts: ProvenFact[]; rowCount: number; columns: string[]; rows?: QueryRow[]; summary: string; completed?: boolean; items?: string[] };
type Outcome = { attemptId: string; actionId?: string; matched?: boolean; deleted?: boolean };
export type RuntimeQueryResponse = QueryExecutionResponse & { snapshot?: AttemptSnapshot; actionId?: string; progressSaved: boolean; conflict?: boolean };
export function validateWorkspace(workspace: unknown): asserts workspace is CaseWorkspace {
  if (!workspace || typeof workspace !== "object" || Array.isArray(workspace)) throw new CaseRuntimeError(422, "Invalid workspace.");
  const w = workspace as CaseWorkspace;
  if (Object.keys(w).some(k => !["draftSql", "notes", "selectedView"].includes(k)) || typeof w.draftSql !== "string" || Buffer.byteLength(w.draftSql, "utf16le") > 32768 || !Array.isArray(w.notes) || w.notes.some(n => typeof n !== "string") || !["briefing", "workbench", "case-board"].includes(w.selectedView) || Buffer.byteLength(JSON.stringify(w), "utf16le") > 262144) throw new CaseRuntimeError(422, "Workspace exceeds its limit or contains unsupported fields. Your previous save is retained.");
}
function requestDigest(value: unknown): string {
  function canonical(v: unknown): unknown {
    if (Array.isArray(v)) return v.map(canonical);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, canonical(x)]));
    return v;
  }
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}
function fieldKey(name: string): string { return name.toLowerCase().replace(/[^a-z0-9]/g, ""); }
function field(row: QueryRow | undefined, name: string): string { return String(Object.entries(row?.values ?? {}).find(([k]) => fieldKey(k) === fieldKey(name))?.[1] ?? ""); }
function proofValue(column: string, value: string): string {
  if (fieldKey(column) === "reportdate") return value.replace(/[^0-9]/g, "").slice(0, 8);
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function validateAuthoredFacts(content: CaseContent, stepKey: string, facts: ProvenFact[]): void {
  if (!content.factDefinitions?.length) return; // Existing immutable v1 content.
  for (const fact of facts) {
    const definition = content.factDefinitions.filter(d => fact.key === d.FactKey || fact.key.startsWith(`${d.FactKey}:`)).sort((a,b) => b.FactKey.length-a.FactKey.length)[0];
    const output = definition && content.factBindings?.some(binding => binding.StepKey === stepKey && binding.FactKey === definition.FactKey && binding.BindingUse === "output");
    if (!definition || !output || definition.ValueType === "integer" && !/^-?\d+$/.test(fact.value) || definition.ValueType === "decimal" && !Number.isFinite(Number(fact.value)) || definition.ValueType === "date" && !Number.isFinite(new Date(fact.value).getTime())) throw new CaseRuntimeError(503,"Authored fact output does not match its registered evidence handler. Saved proof is retained.");
  }
}
function editable(a: AttemptRecord): void {
  if (!["active", "completed"].includes(a.Status)) throw new CaseRuntimeError(409, "Resume this compatible attempt before changing it.");
}
export class CaseAttemptService {
  readonly repository: CaseRuntimeRepository;
  private readonly execute: typeof executeSafeQuery;
  constructor(repository = new CaseRuntimeRepository(), execute = executeSafeQuery) { this.repository = repository; this.execute = execute; }

  async dossiers() {
    return (await this.repository.listReleasedCases()).filter((d, index, all) => all.findIndex(other => other.CaseId === d.CaseId) === index).map(d => ({ caseId: d.CaseId, contentVersion: d.ContentVersion, title: d.Title, dossier: d.Dossier, wholeCaseObjective: d.WholeCaseObjective, completionScope: d.CompletionScope }));
  }
  async context(ownerId: string, attemptId: string): Promise<{ attempt: AttemptRecord; content: CaseContent }> {
    const attempt = await this.repository.loadOwnedAttempt(ownerId, attemptId);
    if (!attempt) throw new CaseRuntimeError(404, "Attempt unavailable.");
    const content = await this.repository.loadReleasedContent(attempt.CaseId, attempt.ContentVersion);
    if (!content || content.definition.EvidenceVersion !== attempt.EvidenceVersion || attempt.Status === "incompatible") throw new CaseRuntimeError(409, "This attempt's pinned content or evidence version is unavailable. The saved work is preserved.");
    return { attempt, content };
  }
  async snapshot(ownerId: string, attemptId: string): Promise<AttemptSnapshot> {
    const { content } = await this.context(ownerId, attemptId);
    const { attempt: a, proofs, items: storedItems } = await this.repository.ownedSnapshotData(ownerId, attemptId);
    const complete = new Set(proofs.map(p => p.StepKey));
    const step = [...content.steps].sort((a,b) => a.DisplayOrder-b.DisplayOrder).find(s => !complete.has(s.StepKey) && content.prerequisites.filter(p => p.StepKey === s.StepKey).every(p => complete.has(p.RequiredStepKey)));
    const items = storedItems ?? [];
    const facts = [...new Map([...items.flatMap(item => (JSON.parse(item.ProofJson) as CollectionProof).facts ?? []), ...proofs.flatMap(p => (JSON.parse(p.ProofJson) as Proof).facts ?? [])].map(fact => [fact.key, fact])).values()];
        const briefingFacts = (content.briefingFacts ?? []).flatMap(value => {
      const definition = content.factDefinitions?.find(fact => fact.FactKey === value.FactKey);
      const binding = content.factBindings?.find(binding => binding.StepKey === step?.StepKey && binding.FactKey === value.FactKey && binding.BindingUse === "input" && !binding.SourceStepKey);
      if (!definition?.EvidenceColumn) return [];
      const typedValue = value.ValueType === "text" ? value.TextValue : value.ValueType === "integer" ? value.IntegerValue : value.ValueType === "decimal" ? value.DecimalValue : new Date(value.DateValue!).toISOString().slice(0,10);
      return [{ key: `${value.FactKey}:${value.ItemKey}`, label: definition.Label, value: String(typedValue), displayValue: value.DisplayValue, column: definition.EvidenceColumn, valueType: value.ValueType, operator: binding?.InsertOperator ?? "equals" as const, eligibleForTask: !!binding }];
    });
        const projectedFacts = facts.map(fact => {
      const definition = content.factDefinitions?.filter(d => fact.key === d.FactKey || fact.key.startsWith(`${d.FactKey}:`)).sort((a,b) => b.FactKey.length-a.FactKey.length)[0];
      if (!definition) return fact;
      const binding = content.factBindings?.find(b => b.StepKey === step?.StepKey && b.FactKey === definition.FactKey && b.BindingUse === "input" && b.SourceStepKey && complete.has(b.SourceStepKey));
      return { ...fact, label: definition.Label, valueType: definition.ValueType, column: binding?.InsertOperator ? definition.EvidenceColumn : null, ...(binding?.InsertOperator ? { operator: binding?.InsertOperator ?? "equals" as const, eligibleForTask: !!binding } : {}) };
    });
    return { briefingFacts, caseId: a.CaseId, contentVersion: a.ContentVersion, evidenceVersion: a.EvidenceVersion, attemptId: a.AttemptId.toLowerCase(), revision: a.Revision, status: a.Status, completionScope: content.definition.CompletionScope,
      progress: { completed: complete.size, total: content.steps.length, savedAtUtc: new Date(a.UpdatedAtUtc).toISOString() },
      evidenceSteps: content.steps.filter(s => complete.has(s.StepKey) || s.StepKey === step?.StepKey).sort((a, b) => a.DisplayOrder - b.DisplayOrder).map(s => ({ stepKey: s.StepKey, title: s.TaskTitle, status: complete.has(s.StepKey) ? "proved" : "current" })),
      task: step ? { stepKey: step.StepKey, title: step.TaskTitle, objective: step.StepObjective, completionMode: step.CompletionMode, ...(step.CompletionMode === "verify" ? { theoryChoices: [...new Set(facts.filter(fact => content.factBindings?.some(binding => binding.StepKey === step.StepKey && binding.BindingUse === "input" && binding.SourceStepKey && complete.has(binding.SourceStepKey) && (fact.key === binding.FactKey || fact.key.startsWith(`${binding.FactKey}:`)))).map(fact => fact.value))] } : {}), ...(a.CaseId === "case-004" ? { collection: { accepted: items.filter(item => item.StepKey === step.StepKey).length, required: CASE004_HANDLERS[step.ValidatorKey.slice(8) as Case004Step]?.required ?? 1 } } : {}), direction: step.SamuelDirection, ...(step.Hint ? { hint: step.Hint } : {}), ...(step.StarterSql ? { starter: { sql: step.StarterSql, placeholders: {} } } : {}) } : null,
      facts: projectedFacts, workspace: JSON.parse(a.WorkspaceJson) as CaseWorkspace };
  }
  async summaries(ownerId: string, caseId: string) {
    const attempts = await this.repository.listAttempts(ownerId, caseId);
    return Promise.all(attempts.map(async a => {
      try { const s = await this.snapshot(ownerId, a.AttemptId); return { attemptId: s.attemptId, revision: s.revision, status: s.status, progress: s.progress, compatible: true }; }
      catch (error) { if (error instanceof CaseRuntimeError && error.statusCode === 409) return { attemptId: a.AttemptId.toLowerCase(), revision: a.Revision, status: "incompatible", progress: { completed: 0, total: 0, savedAtUtc: new Date(a.UpdatedAtUtc).toISOString() }, compatible: false }; throw error; }
    }));
  }
  async fresh(ownerId: string, caseId: string, input: RuntimeMutation): Promise<AttemptSnapshot> {
    if (input.expectedRevision !== "0") throw new CaseRuntimeError(422, "A fresh attempt uses revision zero.");
    const d = (await this.dossiers()).find(d => d.caseId === caseId);
    if (!d) throw new CaseRuntimeError(404, "Released case unavailable.");
    const id = randomUUID();
    const { outcome } = await this.repository.mutate<Outcome>(ownerId, input.requestId, requestDigest({ kind: "fresh", caseId, ...input }), async tx => {
      await this.repository.command(tx, { ownerId, id, caseId, version: d.contentVersion }, `
        UPDATE app.LearnerAttempt SET ArchivedFromStatus=Status,Status='archived',Revision=Revision+1,UpdatedAtUtc=SYSUTCDATETIME() WHERE OwnerId=@ownerId AND CaseId=@caseId AND Status='active';
        INSERT app.LearnerAttempt(AttemptId,OwnerId,CaseId,ContentVersion,EvidenceVersion,Status) SELECT @id,@ownerId,@caseId,@version,EvidenceVersion,'active' FROM app.CaseDefinition WHERE CaseId=@caseId AND ContentVersion=@version AND ReleaseStatus='released';
        INSERT app.AttemptWorkspace(AttemptId,WorkspaceJson) VALUES (@id,N'{"draftSql":"","notes":[],"selectedView":"briefing"}');`);
      return { attemptId: id };
    });
    return this.snapshot(ownerId, outcome.attemptId);
  }
  async workspace(ownerId: string, attemptId: string, input: RuntimeMutation & { workspace: CaseWorkspace }): Promise<AttemptSnapshot> {
    validateWorkspace(input.workspace);
    await this.context(ownerId, attemptId);
    await this.repository.mutate(ownerId, input.requestId, requestDigest({ kind: "workspace", attemptId, ...input }), async tx => {
      editable(await this.repository.checkedAttempt(tx, ownerId, attemptId, input.expectedRevision));
      await this.repository.command(tx, { attemptId, workspace: JSON.stringify(input.workspace) }, "UPDATE app.AttemptWorkspace SET WorkspaceJson=@workspace WHERE AttemptId=@attemptId;");
      await this.bump(tx, attemptId);
      return { attemptId };
    });
    return this.snapshot(ownerId, attemptId);
  }
  async lifecycle(ownerId: string, attemptId: string, kind: "resume" | "archive" | "delete", input: RuntimeMutation): Promise<AttemptSnapshot | { deleted: true }> {
    if (kind === "resume") await this.context(ownerId, attemptId);
    const { outcome } = await this.repository.mutate<Outcome>(ownerId, input.requestId, requestDigest({ kind, attemptId, ...input }), async tx => {
      const a = await this.repository.checkedAttempt(tx, ownerId, attemptId, input.expectedRevision);
      if (kind === "delete") {
        await this.repository.command(tx, { attemptId }, "DELETE app.AttemptEvidenceItem WHERE AttemptId=@attemptId; DELETE app.AttemptStepEvidence WHERE AttemptId=@attemptId; DELETE app.AttemptAction WHERE AttemptId=@attemptId; DELETE app.AttemptWorkspace WHERE AttemptId=@attemptId; DELETE app.LearnerAttempt WHERE AttemptId=@attemptId;");
        return { attemptId, deleted: true };
      }
      if (kind === "resume") {
        if (a.Status === "incompatible") throw new CaseRuntimeError(409, "Attempt incompatible.");
        await this.repository.command(tx, { ownerId, attemptId, caseId: a.CaseId }, `
          UPDATE app.LearnerAttempt SET ArchivedFromStatus=Status,Status='archived',Revision=Revision+1,UpdatedAtUtc=SYSUTCDATETIME() WHERE OwnerId=@ownerId AND CaseId=@caseId AND Status='active' AND AttemptId<>@attemptId;
          UPDATE app.LearnerAttempt SET Status=COALESCE(ArchivedFromStatus,Status),ArchivedFromStatus=NULL WHERE AttemptId=@attemptId;`);
      } else {
        editable(a);
        await this.repository.command(tx, { attemptId }, "UPDATE app.LearnerAttempt SET ArchivedFromStatus=Status,Status='archived' WHERE AttemptId=@attemptId;");
      }
      await this.bump(tx, attemptId); return { attemptId };
    });
    return outcome.deleted ? { deleted: true } : this.snapshot(ownerId, attemptId);
  }
  private async bump(tx: Transaction, attemptId: string) {
    await this.repository.command(tx, { attemptId }, "UPDATE app.LearnerAttempt SET Revision=Revision+1,UpdatedAtUtc=SYSUTCDATETIME() WHERE AttemptId=@attemptId;");
  }

  private async canonical004(table: string, key: string, rows: QueryRow[], sourceSql?: string): Promise<boolean> {
    const readKey = table === "InterviewLog" ? "ReportID" : key;
    const groups = new Map<string, Awaited<ReturnType<typeof readCase004ProofRows>>>();
    for (const row of rows) {
      const value = evidenceField(row, readKey);
      if (!value || !evidenceField(row, key)) return false;
      if (!groups.has(value)) groups.set(value, await readCase004ProofRows(table, readKey, value));
      const canonical = groups.get(value)!;
      if (sourceSql) {
        const projection = /(?:\bSELECT\s+(?:DISTINCT\s+)?(?:TOP\s+\(?\d+\)?\s+)?|,)\s*(?:N?'(?:''|[^'])*'|[-+]?\d+(?:\.\d+)?|NULL)\s+(?:AS\s+)?(?:\[([^\]]+)\]|"([^"]+)"|([A-Za-z_][A-Za-z0-9_]*))/gi;
        for (const match of sourceSql.replace(/--[^\r\n]*|\/\*[\s\S]*?\*\//g," ").matchAll(projection)) {
          if (canonical.columns.some(column=>fieldKey(column.name)===fieldKey(match[1]??match[2]??match[3]))) return false;
        }
      }
      if (!canonical.rows.some(actual => evidenceField(actual, key) === evidenceField(row, key) && Object.entries(row.values).every(([column, value]) => !canonical.columns.some(c => fieldKey(c.name) === fieldKey(column)) || proofValue(column, field(actual, column)) === proofValue(column, String(value ?? ""))))) return false;
    }
    return rows.length > 0;
  }
  private async saveCollection(tx: Transaction, attemptId: string, before: AttemptSnapshot, stepKey: string, actionId: string, collection: CollectionProof) {
    for (const itemKey of collection.items) {
      await this.repository.command(tx, { attemptId, stepKey, caseId: before.caseId, version: before.contentVersion, itemKey, actionId, proof: JSON.stringify(collection) }, `
        IF NOT EXISTS (SELECT 1 FROM app.AttemptEvidenceItem WHERE AttemptId=@attemptId AND StepKey=@stepKey AND ItemKey=@itemKey)
        INSERT app.AttemptEvidenceItem(AttemptId,StepKey,CaseId,ContentVersion,ItemKey,ActionId,ValidatorVersion,ProofJson) VALUES (@attemptId,@stepKey,@caseId,@version,@itemKey,@actionId,1,@proof);`);
    }
    if (collection.completed) await this.repository.command(tx, { attemptId, stepKey, caseId: before.caseId, version: before.contentVersion, actionId, proof: JSON.stringify(collection) }, `
      IF NOT EXISTS (SELECT 1 FROM app.AttemptStepEvidence WHERE AttemptId=@attemptId AND StepKey=@stepKey)
      INSERT app.AttemptStepEvidence(AttemptId,StepKey,CaseId,ContentVersion,ActionId,ValidatorVersion,ProofJson) VALUES (@attemptId,@stepKey,@caseId,@version,@actionId,1,@proof);
      IF (SELECT COUNT(*) FROM app.AttemptStepEvidence WHERE AttemptId=@attemptId)=(SELECT COUNT(*) FROM app.CaseStep WHERE CaseId=@caseId AND ContentVersion=@version) UPDATE app.LearnerAttempt SET Status='completed' WHERE AttemptId=@attemptId;`);
  }
  async verify(ownerId: string, attemptId: string, input: RuntimeMutation & { suspect: string }): Promise<AttemptSnapshot> {
    if (!input.suspect.trim() || input.suspect.trim().length > 100) throw new CaseRuntimeError(422, "Enter a suspect name of 1 to 100 characters.");
    const digest = requestDigest({ kind: "verify", attemptId, ...input });
    if (await this.repository.replay(ownerId, input.requestId, digest)) return this.snapshot(ownerId, attemptId);
    const before = await this.snapshot(ownerId, attemptId);
    if (before.revision !== input.expectedRevision) throw new CaseRuntimeError(409, "Saved progress changed.");
    const { content } = await this.context(ownerId, attemptId);
    const step = content.steps.find(step => step.StepKey === before.task?.stepKey);
    if (before.caseId !== "case-004" || step?.CompletionMode !== "verify") throw new CaseRuntimeError(422, "Complete the current evidence task before testing a theory.");
    const role = step.ValidatorKey === "case004.murderer-verification" ? "trigger_man" : "mastermind";
    const result = await verifySuspect(input.suspect);
    if (!result.success) throw new CaseRuntimeError(503, result.message);
    if (!result.data.isCorrect || result.data.caseId !== before.caseId || result.data.solvedRole !== role) throw new CaseRuntimeError(422, "That theory does not resolve the current evidence trail. Review your proved evidence.");
    const supportedIds = role === "trigger_man" ? before.facts.filter(f => f.key === "PersonID:suspect").map(f => f.value) : before.facts.filter(f => f.key.startsWith("SSN:candidate:") && f.value === before.facts.find(f => f.key === "SSN:wealth")?.value).map(f => f.key.split(":").at(-1));
    if (!supportedIds.includes(String(result.data.suspectPersonId))) throw new CaseRuntimeError(422, "That theory is not linked to your proved identity and evidence.");
    await this.repository.mutate(ownerId, input.requestId, digest, async tx => {
      editable(await this.repository.checkedAttempt(tx, ownerId, attemptId, input.expectedRevision));
      const actionId = randomUUID();
      await this.repository.command(tx, { actionId, attemptId, requestId: input.requestId, digest, revision: input.expectedRevision, suspect: input.suspect, proof: JSON.stringify({ role, personId: result.data.suspectPersonId }) }, `INSERT app.AttemptAction(ActionId,AttemptId,RequestId,ActionKind,RequestDigest,PrerequisiteRevision,SqlOrSubmission,ValidatorResult,ProofJson) VALUES (@actionId,@attemptId,@requestId,'verify',CONVERT(BINARY(32),@digest,2),@revision,@suspect,N'Theory confirmed',@proof);`);
      await this.saveCollection(tx, attemptId, before, step.StepKey, actionId, { completed: true, items: [String(result.data.suspectPersonId)], facts: [] });
      await this.bump(tx, attemptId); return { attemptId };
    });
    return this.snapshot(ownerId, attemptId);
  }
  async query(ownerId: string, attemptId: string, input: RuntimeMutation & { sql: string }): Promise<RuntimeQueryResponse> {
    if (Buffer.byteLength(input.sql, "utf16le") > 32768) throw new CaseRuntimeError(422, "SQL exceeds the draft limit.");
    const digest = requestDigest({ kind: "query", attemptId, ...input });
    const replay = await this.repository.replay<Outcome>(ownerId, input.requestId, digest);
    const before = await this.snapshot(ownerId, attemptId);
    const finish = (response: Awaited<ReturnType<typeof executeSafeQuery>>, saved: boolean, after = before, learning: Partial<LearningOutcome> = {}): RuntimeQueryResponse => ({ ...response, progressSaved: saved, snapshot: after, feedback: queryLearningFeedback(response, { before, after, saved, starter: before.task?.starter?.sql, ...learning }) });
    if (replay) {
      // Progress/action outcome is durable; unrestricted results are not stored.
      return { success: false, safety: validateSqlSafety(input.sql), executionTimeMs: 0, message: "This execution was already saved. Run a new query to display its rows again.", progressSaved: true, snapshot: before, actionId: replay.actionId, feedback: { category: "replayed", execution: "not-repeated", evidence: "unchanged", severity: "info", title: "This attempt was already recorded", explanation: "The request was not executed a second time.", nextAction: "Run a new query to display its rows again." } };
    }
    if (before.revision !== input.expectedRevision) throw new CaseRuntimeError(409, "Saved progress changed. Review the latest attempt before running again.");
    if (before.status !== "active" && before.status !== "completed") throw new CaseRuntimeError(409, "Resume this attempt before executing SQL.");
    const response = await this.execute(input.sql);
    if (!response.success) return finish(response, false);
    const actionId = randomUUID();
    const { content } = await this.context(ownerId, attemptId);
    const step = content.steps.find(s => s.StepKey === before.task?.stepKey);
    const data = response.data;
    const handler004 = step?.ValidatorKey.startsWith("case004.") ? CASE004_HANDLERS[step.ValidatorKey.slice(8) as Case004Step] : undefined;
    const expectedTable = handler004?.table ?? (step?.ValidatorKey === "case001.crime-type" ? "CrimeType" : step?.ValidatorKey === "case001.report" ? "CrimeSceneReport" : "InterviewLog");
    // A successful statement returning literal lookalikes alone is not evidence.
    const sourceSql = input.sql.replace(/'(?:''|[^'])*'/g, "''").replace(/--[^\r\n]*|\/\*[\s\S]*?\*\//g, "").replace(/[\[\]"]/g, "");
    const sourcePresent = new RegExp(`\\b(?:FROM|JOIN)\\s+(?:dbo\\s*\\.\\s*)?${expectedTable}\\b`, "i").test(sourceSql);
    const validation = step?.ValidatorKey === "case001.crime-type" ? validateCase001CrimeTypeIdentified(data) : step?.ValidatorKey === "case001.report" ? validateCase001ClocktowerReportLocated(data) : step?.ValidatorKey === "case001.interviews" ? validateCase001ClocktowerReportInterviewsLocated(data) : null;
    const reportId = before.facts.find(f => f.key === "ReportID")?.value;
    const linked = step?.ValidatorKey !== "case001.interviews" || (!!reportId && data.rows.every(r => field(r, "ReportID") === reportId));
    let matched = !!step && sourcePresent && !!validation?.matched && linked && (step.ValidatorKey !== "case001.report" || !!field(data.rows[0], "ReportID"));
    if (matched) {
      try {
        const identifier = expectedTable === "CrimeType" ? "1080" : expectedTable === "CrimeSceneReport" ? field(data.rows[0], "ReportID") : reportId!;
        const canonical = await readCase001ProofRows(expectedTable as "CrimeType" | "CrimeSceneReport" | "InterviewLog", identifier);
        const key = expectedTable === "CrimeType" ? "CrimeID" : expectedTable === "CrimeSceneReport" ? "ReportID" : "PersonID";
        const candidates = expectedTable === "CrimeType" ? data.rows.filter(r => field(r, "CrimeID") === "1080") : data.rows;
        matched = candidates.length > 0 && candidates.every(candidate => canonical.rows.some(actual => field(actual, key) === field(candidate, key) && Object.entries(candidate.values).every(([column, value]) => !canonical.columns.some(c => fieldKey(c.name) === fieldKey(column)) || proofValue(column, field(actual, column)) === proofValue(column, String(value ?? "")))));
      } catch { return finish({ ...response, message: "Query ran, but its evidence could not be checked. Retry when the database is available." }, false); }
    }
    let collection: CollectionProof | null = null;
    let eligibleCandidates = sourcePresent;
    if (handler004 && step && sourcePresent && (data.rows.length <= 100 || step.ValidatorKey === "case004.report-inspection")) {
      try {
        const checked = await this.canonical004(handler004.table, handler004.key, step.ValidatorKey === "case004.report-inspection" ? data.rows.slice(0,1) : data.rows, input.sql);
        eligibleCandidates = checked;
        if (checked && handler004.mode === "query") collection = collectCase004(step.ValidatorKey.slice(8) as Case004Step, data.rows, undefined, before.facts, undefined, actionId, Object.fromEntries((before.briefingFacts ?? []).filter(fact => fact.eligibleForTask !== false).map(fact => [fact.column, fact.value])));
        matched = !!collection?.completed;
      } catch { return finish({ ...response, message: "Query ran, but its evidence could not be checked. Retry when the database is available." }, false); }
    }
    const facts: ProvenFact[] = matched && step ? step.ValidatorKey === "case001.crime-type" ? [{ key: "CrimeID", label: "Murder CrimeID", value: field(data.rows.find(r => field(r, "CrimeID") === "1080")!, "CrimeID"), sourceActionId: actionId }] : step.ValidatorKey === "case001.report" ? ["ReportID", "ReportCity", "ReportDate"].map(key => ({ key, label: key, value: field(data.rows[0], key), sourceActionId: actionId })) : data.rows.map(r => ({ key: `PersonID:${field(r, "PersonID")}`, label: "Interview PersonID", value: field(r, "PersonID"), sourceActionId: actionId })) : [];
    try { if (matched && step) validateAuthoredFacts(content, step.StepKey, collection?.facts ?? facts); }
    catch { return finish({ ...response, message: "Query ran, but its authored evidence output could not be saved. Ask the instructor to review the case content." }, false); }
    const proof: Proof = { ...(collection ?? {}), stepKey: step?.StepKey ?? "released-review", facts: collection?.facts ?? facts, rowCount: data.rowCount, columns: data.columns.map(c => c.name), summary: matched ? "Task proved from executed results." : "Refine the query to prove the current task." };
    // Candidates are only returned rows from the relevant current evidence source.
    if (eligibleCandidates && data.rows.length <= 100) proof.rows = data.rows;
    if (Buffer.byteLength(JSON.stringify(proof), "utf16le") > 65536) delete proof.rows;
    try {
      const { outcome } = await this.repository.mutate<Outcome>(ownerId, input.requestId, digest, async tx => {
        editable(await this.repository.checkedAttempt(tx, ownerId, attemptId, input.expectedRevision));
        await this.repository.command(tx, { attemptId }, `DELETE a FROM app.AttemptAction a WHERE a.AttemptId=@attemptId AND a.ExpiresAtUtc<SYSUTCDATETIME() AND NOT EXISTS (SELECT 1 FROM app.AttemptStepEvidence e WHERE e.ActionId=a.ActionId);
          IF (SELECT COUNT(*) FROM app.AttemptAction WHERE AttemptId=@attemptId AND ExpiresAtUtc IS NOT NULL)>=100 THROW 51004,'Execution candidate limit reached; wait for expiry or start a fresh attempt.',1;`);
        await this.repository.command(tx, { actionId, attemptId, requestId: input.requestId, digest, revision: input.expectedRevision, sql: input.sql, result: proof.summary, proof: JSON.stringify(proof), matched: matched ? 1 : 0 }, `
          INSERT app.AttemptAction(ActionId,AttemptId,RequestId,ActionKind,RequestDigest,PrerequisiteRevision,SqlOrSubmission,ValidatorResult,ProofJson,ExpiresAtUtc)
          VALUES (@actionId,@attemptId,@requestId,'query',CONVERT(BINARY(32),@digest,2),@revision,@sql,@result,@proof,CASE WHEN @matched=1 THEN NULL ELSE DATEADD(hour,24,SYSUTCDATETIME()) END);`);
        if (matched && step) {
          const durable = { ...proof }; delete durable.rows;
          await this.repository.command(tx, { attemptId, stepKey: step.StepKey, caseId: before.caseId, version: before.contentVersion, actionId, proof: JSON.stringify(durable) }, `
            INSERT app.AttemptStepEvidence(AttemptId,StepKey,CaseId,ContentVersion,ActionId,ValidatorVersion,ProofJson) VALUES (@attemptId,@stepKey,@caseId,@version,@actionId,1,@proof);
            IF (SELECT COUNT(*) FROM app.AttemptStepEvidence WHERE AttemptId=@attemptId)=(SELECT COUNT(*) FROM app.CaseStep WHERE CaseId=@caseId AND ContentVersion=@version) UPDATE app.LearnerAttempt SET Status='completed' WHERE AttemptId=@attemptId;`);
        }
        await this.bump(tx, attemptId); return { attemptId, actionId, matched };
      });
      const snapshot = await this.snapshot(ownerId, attemptId);
      const readyToLog = !!(handler004?.mode === "log" && step && proof.rows?.some(row => collectCase004(step.ValidatorKey.slice(8) as Case004Step, proof.rows!, row, before.facts, undefined, actionId, Object.fromEntries((before.briefingFacts ?? []).filter(f => f.eligibleForTask !== false).map(f => [f.column, f.value])))));
      const isolatedEvidence = !!(handler004?.mode === "log" && step && !readyToLog && proof.rows && proof.rows.length > 1 && proof.rows.some(row => collectCase004(step.ValidatorKey.slice(8) as Case004Step, [row], row, before.facts, undefined, actionId, Object.fromEntries((before.briefingFacts ?? []).filter(f => f.eligibleForTask !== false).map(f => [f.column, f.value])))?.completed));
      return { ...finish(response, true, snapshot, { matched: outcome.matched, sourcePresent, readyToLog, isolationNeeded: isolatedEvidence || (!!validation?.matchedRowCount && !matched && data.rowCount > 1), candidateLimit: !!handler004 && handler004.mode === "log" && sourcePresent && (!proof.rows || data.rows.length > 100) }), actionId: outcome.actionId };
    } catch (error) {
      // SQL rows remain useful even when concurrency or storage prevents proof saving.
      return { ...finish({ ...response, message: error instanceof CaseRuntimeError ? error.message : (error as { number?: number }).number === 51004 ? "Execution candidate limit reached. Refine or wait for candidate expiry; existing proof is retained." : "Query ran, but progress could not be saved. Retry after restoring the case repository." }, false, await this.snapshot(ownerId, attemptId).catch(() => before)), ...(error instanceof CaseRuntimeError && error.statusCode === 409 ? { conflict: true } : {}) };
    }
  }

  async evidence(ownerId: string, attemptId: string, input: RuntimeMutation & { actionId: string; rowIndex: number; annotation?: string }): Promise<AttemptSnapshot> {
    const digest = requestDigest({ kind: "log", attemptId, ...input });
    if (await this.repository.replay<Outcome>(ownerId, input.requestId, digest)) return this.snapshot(ownerId, attemptId);
    const before = await this.snapshot(ownerId, attemptId);
    const action = await this.repository.action(attemptId, input.actionId);
    if (!action || (action.ExpiresAtUtc && new Date(action.ExpiresAtUtc).getTime() < Date.now())) throw new CaseRuntimeError(422, "Run the query again before logging this row.");
    const proof = JSON.parse(action.ProofJson) as Proof;
    const row = proof.rows?.[input.rowIndex];
    if (!row) throw new CaseRuntimeError(422, "Refine and re-execute before logging a selectable row.");
    let collection: CollectionProof | null = null;
    let duplicate = false;
    const content = (await this.context(ownerId, attemptId)).content;
    const evidenceStep = content.steps.find(step => step.StepKey === proof.stepKey);
    const handlerKey = evidenceStep?.ValidatorKey.slice(8) as Case004Step;
    const handler = evidenceStep?.ValidatorKey.startsWith("case004.") ? CASE004_HANDLERS[handlerKey] : undefined;
    if (before.caseId === "case-004") {
      if (proof.rows?.some(candidate => field(candidate, "ReportCity") === "SQL City")) throw new CaseRuntimeError(422, "City records now use Sequel City. Edit old SQL City filters and rerun the query before logging; saved notes and proved evidence are unchanged.");
      if (proof.stepKey !== before.task?.stepKey || handler?.mode !== "log" || !await this.canonical004(handler.table, handler.key, proof.rows!)) throw new CaseRuntimeError(422, "Run the current task's evidence query before logging this row.");
      const existing = await this.repository.evidenceItems(attemptId);
      const previous = existing.filter(item => item.StepKey === proof.stepKey).map(item => JSON.parse(item.ProofJson) as CollectionProof);
      collection = collectCase004(handlerKey, proof.rows!, row, before.facts, { completed: false, items: existing.filter(item => item.StepKey === proof.stepKey).map(item => item.ItemKey), facts: previous.flatMap(item => item.facts) }, input.actionId, Object.fromEntries((before.briefingFacts ?? []).filter(fact => fact.eligibleForTask !== false).map(fact => [fact.column, fact.value])));
      if (!collection) throw new CaseRuntimeError(422, "That row does not prove the current evidence task. Keep refining and reading the relevant records.");
      validateAuthoredFacts(content, proof.stepKey, collection.facts);
      duplicate = collection.items.every(key => existing.some(item => item.StepKey === proof.stepKey && item.ItemKey === key));
    }
    await this.repository.mutate(ownerId, input.requestId, digest, async tx => {
      const a = await this.repository.checkedAttempt(tx, ownerId, attemptId, input.expectedRevision); editable(a);
      if (duplicate) return { attemptId };
      await this.repository.command(tx, { attemptId, actionId: input.actionId }, "IF NOT EXISTS (SELECT 1 FROM app.AttemptAction WHERE AttemptId=@attemptId AND ActionId=@actionId AND (ExpiresAtUtc IS NULL OR ExpiresAtUtc>SYSUTCDATETIME())) THROW 51005,'Execution expired; run the query again before logging.',1;");
      const workspace = JSON.parse(a.WorkspaceJson) as CaseWorkspace;
      const summary = Object.entries(row.displayValues).map(([key, value]) => `${key}: ${value}`).join("; ");
      workspace.notes.push(`${summary}${input.annotation ? ` — ${input.annotation}` : ""}`);
      validateWorkspace(workspace);
      const id = randomUUID();
      await this.repository.command(tx, { id, attemptId, requestId: input.requestId, digest: requestDigest(input), revision: input.expectedRevision, reference: input.actionId, proof: JSON.stringify({ sourceActionId: input.actionId, rowIndex: input.rowIndex, summary }) }, `INSERT app.AttemptAction(ActionId,AttemptId,RequestId,ActionKind,RequestDigest,PrerequisiteRevision,SqlOrSubmission,ValidatorResult,ProofJson) VALUES (@id,@attemptId,@requestId,'log',CONVERT(BINARY(32),@digest,2),@revision,@reference,N'Notebook row logged',@proof);`);
      if (collection) await this.repository.command(tx, { attemptId, actionId: input.actionId }, "UPDATE app.AttemptAction SET ExpiresAtUtc=NULL WHERE AttemptId=@attemptId AND ActionId=@actionId;");
      if (collection) await this.saveCollection(tx, attemptId, before, proof.stepKey, id, collection);
      await this.repository.command(tx, { attemptId, workspace: JSON.stringify(workspace) }, "UPDATE app.AttemptWorkspace SET WorkspaceJson=@workspace WHERE AttemptId=@attemptId;");
      await this.bump(tx, attemptId); return { attemptId };
    });
    return this.snapshot(ownerId, attemptId);
  }
}
