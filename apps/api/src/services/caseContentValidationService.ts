import type { CaseContent } from "../types/caseRuntime.ts";
import { validateSqlSafety } from "./sqlSafetyService.ts";
import { findStudentRestrictedTableReferences } from "./studentRestrictedTables.ts";

export const CASE_RUNTIME_SCHEMA_KEY = "case-runtime-v1";
export const CASE_RUNTIME_EVIDENCE_VERSION = "sequel-evidence-v1";
export const SUPPORTED_CASE_VALIDATORS: Readonly<Record<string, { mode: string; table: string }>> = {
  "case001.crime-type": { mode: "query", table: "CrimeType" },
  "case001.report": { mode: "query", table: "CrimeSceneReport" },
  "case001.interviews": { mode: "query", table: "InterviewLog" }
};

// Authoring validation, not evidence evaluation or a general rules interpreter.
export function validateCaseContent(content: CaseContent): string[] {
  const errors: string[] = [];
  const { definition: d, steps, prerequisites } = content;
  const fail = (message: string) => { errors.push(message); };
  if (!/^[a-z][a-z0-9-]{0,49}$/.test(d.CaseId) || !Number.isInteger(d.ContentVersion) || d.ContentVersion < 1) fail("Invalid case/version key.");
  if (!d.Title?.trim() || !d.Dossier?.trim() || !d.WholeCaseObjective?.trim()) fail("Missing case dossier/objective.");
  if (!["draft", "released", "retired"].includes(d.ReleaseStatus) || !["evidence-review", "full-resolution"].includes(d.CompletionScope)) fail("Unsupported release/completion scope.");
  if (d.EvidenceVersion !== CASE_RUNTIME_EVIDENCE_VERSION) fail("Incompatible evidence version.");
  const keys = new Set(steps.map(s => s.StepKey));
  if (!steps.length || keys.size !== steps.length || !keys.has(d.EntryStepKey)) fail("Missing/duplicate steps or entry.");
  if (new Set(steps.map(s => s.DisplayOrder)).size !== steps.length) fail("Duplicate step display order.");
  const parents = new Map(steps.map(s => [s.StepKey, [] as string[]]));
  const edges = new Set<string>();
  for (const p of prerequisites) {
    const edge = `${p.StepKey}:${p.RequiredStepKey}`;
    if (p.CaseId !== d.CaseId || p.ContentVersion !== d.ContentVersion || !keys.has(p.StepKey) || !keys.has(p.RequiredStepKey) || p.StepKey === p.RequiredStepKey || edges.has(edge)) fail("Invalid/duplicate prerequisite.");
    else parents.get(p.StepKey)!.push(p.RequiredStepKey);
    edges.add(edge);
  }
  for (const s of steps) {
    if (s.CaseId !== d.CaseId || s.ContentVersion !== d.ContentVersion || !/^[a-z][a-z0-9-]{0,79}$/.test(s.StepKey)) fail("Step belongs to another version or has invalid key.");
    if (!Number.isInteger(s.DisplayOrder) || s.DisplayOrder < 0 || !s.TaskTitle?.trim() || !s.StepObjective?.trim() || !s.SamuelDirection?.trim()) fail("Missing/invalid task fields.");
    const handler = SUPPORTED_CASE_VALIDATORS[s.ValidatorKey];
    if (!handler || handler.mode !== s.CompletionMode) fail(`Unsupported validator/mode: ${s.ValidatorKey}.`);
    try {
      const parameters = JSON.parse(s.ValidatorParametersJson);
      if (!parameters || Array.isArray(parameters) || typeof parameters !== "object" || Object.keys(parameters).length) fail("Validator parameters do not match handler schema.");
    } catch { fail("Invalid validator parameter JSON."); }
    if (/\b(?:CrimeID|ReportID|PersonID|LicenseID|SSN)\s*(?:=|:)\s*\d+/i.test([s.SamuelDirection, s.Hint, s.StepObjective].join(" "))) fail("Hidden literal identifier in instruction.");
    if (s.StarterSql) {
      if (!validateSqlSafety(s.StarterSql).isAllowed || findStudentRestrictedTableReferences(s.StarterSql).length) fail("Unsafe starter SQL.");
      // Foundation handlers offer broad scaffolds, never embedded answer filters.
      if (!handler || !new RegExp(`^SELECT\\s+\\*\\s+FROM\\s+(?:dbo\\.)?${handler.table}\\s*;?$`, "i").test(s.StarterSql.trim())) fail("Starter must be broad public evidence scaffold for this handler.");
    }
  }
  const visiting = new Set<string>();
  const done = new Set<string>();
  function visit(key: string): void {
    if (visiting.has(key)) { fail("Prerequisite cycle."); return; }
    if (done.has(key)) return;
    visiting.add(key);
    for (const parent of parents.get(key) ?? []) visit(parent);
    visiting.delete(key); done.add(key);
  }
  for (const key of keys) visit(key);
  if ((parents.get(d.EntryStepKey)?.length ?? 0) !== 0) fail("Entry cannot require another step.");
  for (const s of steps) {
    if (s.StepKey !== d.EntryStepKey && !(parents.get(s.StepKey)?.length)) fail("Unreachable root outside entry.");
    for (const parent of parents.get(s.StepKey) ?? []) {
      const predecessor = steps.find(other => other.StepKey === parent);
      if (predecessor && predecessor.DisplayOrder >= s.DisplayOrder) fail("Prerequisite must precede step.");
    }
  }
  if (steps.length && steps.find(s => s.StepKey === d.EntryStepKey)?.DisplayOrder !== Math.min(...steps.map(s => s.DisplayOrder))) fail("Entry must be first step.");
  if (d.ReleaseStatus === "released" && d.CaseId === "case-001" && (d.CompletionScope !== "evidence-review" || steps.map(s => s.ValidatorKey).sort().join(",") !== Object.keys(SUPPORTED_CASE_VALIDATORS).sort().join(","))) fail("Incomplete Case 001 release or unsupported culprit scope.");
  if (d.ReleaseStatus === "released" && d.CaseId === "case-001") {
    const ordered = [...steps].sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    if (ordered.map(s => s.ValidatorKey).join(",") !== "case001.crime-type,case001.report,case001.interviews" ||
        ordered.some((s, index) => index > 0 && !(parents.get(s.StepKey) ?? []).includes(ordered[index - 1].StepKey))) fail("Case 001 must preserve its ordered foundation/report/interview prerequisites.");
  }
  if (d.CompletionScope === "full-resolution" && !steps.some(s => s.CompletionMode === "verify")) fail("Full resolution requires controlled verification.");
  return [...new Set(errors)];
}
