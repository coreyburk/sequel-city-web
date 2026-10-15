import { CASE004_HANDLERS } from "./case004ProgressionService.ts";
import type { CaseContent } from "../types/caseRuntime.ts";
import { validateSqlSafety } from "./sqlSafetyService.ts";
import { findStudentRestrictedTableReferences } from "./studentRestrictedTables.ts";

export const CASE_RUNTIME_SCHEMA_KEY = "case-runtime-v2";
export const CASE_RUNTIME_EVIDENCE_VERSION = "sequel-evidence-v1";
export const SUPPORTED_CASE_VALIDATORS: Readonly<Record<string, { mode: string; table: string }>> = {
  "case001.crime-type": { mode: "query", table: "CrimeType" },
  "case001.report": { mode: "query", table: "CrimeSceneReport" },
  "case001.interviews": { mode: "query", table: "InterviewLog" },
  ...Object.fromEntries(Object.entries(CASE004_HANDLERS).map(([key, handler]) => [`case004.${key}`, handler]))
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
  if (d.ReleaseStatus === "released" && d.CaseId === "case-001" && (d.CompletionScope !== "evidence-review" || steps.map(s => s.ValidatorKey).sort().join(",") !== Object.keys(SUPPORTED_CASE_VALIDATORS).filter(key => key.startsWith("case001.")).sort().join(","))) fail("Incomplete Case 001 release or unsupported culprit scope.");
  if (d.ReleaseStatus === "released" && d.CaseId === "case-001") {
    const ordered = [...steps].sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    if (ordered.map(s => s.ValidatorKey).join(",") !== "case001.crime-type,case001.report,case001.interviews" ||
        ordered.some((s, index) => index > 0 && !(parents.get(s.StepKey) ?? []).includes(ordered[index - 1].StepKey))) fail("Case 001 must preserve its ordered foundation/report/interview prerequisites.");
  }
  if (d.ReleaseStatus === "released" && d.CaseId === "case-004" && [...steps].sort((a,b) => a.DisplayOrder-b.DisplayOrder).map(s => s.ValidatorKey).join(",") !== Object.keys(CASE004_HANDLERS).map(key => `case004.${key}`).join(",")) fail("Incomplete Case 004 progression.");
  if (d.CompletionScope === "full-resolution" && !steps.some(s => s.CompletionMode === "verify")) fail("Full resolution requires controlled verification.");
  const definitions = content.factDefinitions ?? [];
  const bindings = content.factBindings ?? [];
  const factKeys = new Set(definitions.map(f => f.FactKey));
  if (factKeys.size !== definitions.length) fail("Duplicate authored fact key.");
  for (const fact of definitions) {
    if (fact.CaseId !== d.CaseId || fact.ContentVersion !== d.ContentVersion || !fact.Label?.trim() || !/^[A-Za-z][A-Za-z0-9:_-]{0,79}$/.test(fact.FactKey) || !["text","integer","decimal","date"].includes(fact.ValueType) || !["single","collection"].includes(fact.Cardinality) || fact.EvidenceColumn && !/^[A-Za-z][A-Za-z0-9_]{0,79}$/.test(fact.EvidenceColumn)) fail("Invalid authored fact definition.");
  }
  const ancestors = (key: string, visited = new Set<string>()): Set<string> => {
    if (visited.has(key)) return visited;
    visited.add(key); for (const parent of parents.get(key) ?? []) ancestors(parent, visited); return visited;
  };
  for (const binding of bindings) {
    if (binding.CaseId !== d.CaseId || binding.ContentVersion !== d.ContentVersion || !keys.has(binding.StepKey) || !factKeys.has(binding.FactKey) || !["input","output"].includes(binding.BindingUse) || binding.InsertOperator && !["equals","prefix","contains"].includes(binding.InsertOperator)) fail("Invalid fact binding.");
    if (binding.SourceStepKey && (binding.BindingUse !== "input" || binding.SourceStepKey === binding.StepKey || !ancestors(binding.StepKey).has(binding.SourceStepKey) || !bindings.some(source => source.StepKey === binding.SourceStepKey && source.FactKey === binding.FactKey && source.BindingUse === "output"))) fail("Fact binding source is not a proved prerequisite output.");
  }
  if (definitions.some(definition => definition.Cardinality === "single" && (content.briefingFacts ?? []).filter(value => value.FactKey === definition.FactKey).length > 1)) fail("Single briefing fact contains multiple items.");
  for (const value of content.briefingFacts ?? []) {
    const definition = definitions.find(f => f.FactKey === value.FactKey);
    const supplied = [value.TextValue,value.IntegerValue,value.DecimalValue,value.DateValue].filter(v => v !== null && v !== undefined);
    const selected = value.ValueType === "text" ? value.TextValue : value.ValueType === "integer" ? value.IntegerValue : value.ValueType === "decimal" ? value.DecimalValue : value.DateValue;
    if (value.CaseId !== d.CaseId || value.ContentVersion !== d.ContentVersion || !definition || value.ValueType !== definition.ValueType || supplied.length !== 1 || selected === null || selected === undefined || !value.ItemKey?.trim() || !value.DisplayValue?.trim() || value.ValueType === "integer" && !/^-?\d+$/.test(String(selected)) || value.ValueType === "decimal" && !Number.isFinite(Number(selected)) || value.ValueType === "date" && !Number.isFinite(new Date(String(selected)).getTime())) fail("Invalid typed briefing fact.");
  }
  if (d.ReleaseStatus === "released" && (d.CaseId === "case-004" || d.CaseId === "case-001" && d.ContentVersion >= 2)) {
    for (const column of ["ReportCity","ReportDate"]) {
      if (!content.briefingFacts?.some(value => definitions.some(definition => definition.FactKey === value.FactKey && definition.EvidenceColumn === column))) fail(`Missing typed briefing value for ${column}.`);
    }
  }
  if (d.ReleaseStatus === "released" && d.CaseId === "case-004") {
    const city = content.briefingFacts?.find(value => value.FactKey === "briefing-city" && value.ItemKey === "city");
    const expected = d.ContentVersion === 1 ? "SQL City" : "Sequel City";
    if (city?.ValueType !== "text" || city.TextValue !== expected || city.DisplayValue !== expected) fail("Case 004 city does not match its immutable content version.");
  }
  return [...new Set(errors)];
}
