import type { QueryAttemptFeedback, QueryExecutionResponse } from "../types/query.ts";
import type { SchemaData } from "../types/schema.ts";
import type { AttemptSnapshot } from "../types/caseRuntime.ts";
import { isStudentEvidenceTable } from "./studentRestrictedTables.ts";

const reference = "Open Case File → Quick Table Clues and compare the table and column names with your query.";
const make = (category: QueryAttemptFeedback["category"], title: string, explanation: string, nextAction: string, execution: QueryAttemptFeedback["execution"] = "succeeded", evidence: QueryAttemptFeedback["evidence"] = "unchanged", severity: QueryAttemptFeedback["severity"] = "info"): QueryAttemptFeedback => ({ category, execution, evidence, severity, title, explanation, nextAction });

// Only structured driver codes select a category. Raw error text is never sent.
export async function executionFailureFeedback(error: unknown, sql: string, loadSchema: () => Promise<SchemaData>): Promise<QueryAttemptFeedback> {
  const diagnostic = error as { number?: number; code?: string; originalError?: { info?: { number?: number } }; precedingErrors?: { number?: number; message?: string }[]; message?: string } | null;
  const number = diagnostic?.number ?? diagnostic?.originalError?.info?.number;
  const code = diagnostic?.code;
  let feedback: QueryAttemptFeedback;
  if (number === 207) feedback = make("invalid-column", "Check the column names", "A column used in this query is not available in that query context. It may belong to another table or be spelled differently.", reference, "failed", "unchanged", "error");
  else if (number === 208) feedback = make("invalid-table", "Check the table name", "The table or object in this query could not be used. Check the public table names and spelling.", reference, "failed", "unchanged", "error");
  else if (number === 209) feedback = make("ambiguous-column", "Make the column reference clear", "More than one joined source has a column with this name.", "Prefix the column with its table name or alias, and check the JOIN conditions.", "failed", "unchanged", "error");
  else if ([102,105,156,170,4145].includes(number ?? -1)) feedback = make("syntax", "Check the SQL structure", "SQL Server could not read the statement as written.", "Check the SELECT, FROM and WHERE order, quotation marks, parentheses and operators; compare with the current starter.", "failed", "unchanged", "error");
  else if ([245,241,242,248,8114,8115].includes(number ?? -1)) feedback = make("conversion", "Check the value types", "A value could not be converted to the type needed by the query.", "Check the column type in Quick Table Clues; use quotes for text and compare numbers and dates in the expected format.", "failed", "unchanged", "error");
  else if (code === "ETIMEOUT" || number === -2) feedback = make("timeout", "The query took too long", "The query did not finish within the time limit. This does not prove the SQL is incorrect.", "Try a smaller result or simpler JOIN. If a broad starter also times out, ask your instructor to check the database.", "failed", "unchanged", "warning");
  else if (["ELOGIN","ESOCKET","ECONNCLOSED","ENOTOPEN","ECONNRESET","ECONNREFUSED","EINSTLOOKUP"].includes(code ?? "") || [18456,4060,40613,40197].includes(number ?? -1)) feedback = make("unavailable", "The database is unavailable", "The application could not complete this database request. Your SQL draft has been kept.", "Retry when the connection is restored; if it continues, ask your instructor to check the app setup.", "failed", "unchanged", "warning");
  else feedback = make("execution-error", "The query could not finish", "No evidence was proved by this attempt. The cause could not be identified safely.", "Compare the query with Quick Table Clues and the starter; if the starter also fails, ask your instructor for help.", "failed", "unchanged", "error");

  if (number === 207) {
    try {
      const schema = await loadSchema();
      const publicTables = schema.tables.filter(table => table.schemaName.toLowerCase() === "dbo" && isStudentEvidenceTable(table.tableName));
      const errors = [diagnostic, ...(diagnostic?.precedingErrors ?? [])];
      const names = [...new Set(errors.flatMap(e => e?.number === 207 || e === diagnostic ? [...(e?.message ?? "").matchAll(/Invalid column name '([A-Za-z_][A-Za-z0-9_]{0,127})'/gi)].map(m => m[1]) : []))]
        .filter(name => publicTables.some(table => table.columns.some(c => c.columnName.toLowerCase() === name.toLowerCase())));
      // Deliberately conservative: joins/CTEs/comments/strings containing FROM use the generic diagnostic.
      const simple = !/\b(?:JOIN|WITH|UNION|INTERSECT|EXCEPT)\b|--|\/\*|\bFROM\b[\s\S]*\bFROM\b/i.test(sql);
      const tableName = simple ? /\bFROM\s+(?:\[?dbo\]?\s*\.\s*)?\[?([A-Za-z_][A-Za-z0-9_]*)\]?(?=\s|;|$)/i.exec(sql)?.[1] : undefined;
      const table = publicTables.find(t => t.tableName.toLowerCase() === tableName?.toLowerCase());
      if (names.length && table && names.every(name => !table.columns.some(c => c.columnName.toLowerCase() === name.toLowerCase()))) feedback.explanation = `${names.join(" and ")} ${names.length === 1 ? "is not a column" : "are not columns"} in ${table.tableName}. The conditions must use columns from the query's table.`;
    } catch { /* Metadata failure must never hide the original safe diagnostic. */ }
  }
  return feedback;
}

export interface LearningOutcome {
  before: AttemptSnapshot;
  after?: AttemptSnapshot;
  saved: boolean;
  matched?: boolean;
  sourcePresent?: boolean;
  readyToLog?: boolean;
  isolationNeeded?: boolean;
  candidateLimit?: boolean;
  starter?: string | null;
}
export function queryLearningFeedback(response: QueryExecutionResponse, outcome: LearningOutcome): QueryAttemptFeedback {
  if (!response.success) {
    const feedback = response.feedback ?? make(response.safety.isAllowed ? "execution-error" : "blocked", response.safety.isAllowed ? "The query could not finish" : "Query blocked", response.message, response.safety.isAllowed ? reference : "Use a read-only SELECT against the public evidence tables.", response.safety.isAllowed ? "failed" : "blocked", "unchanged", "error");
    // Append only the current public authored scaffold, never future task data.
    return outcome.starter && ["invalid-column","invalid-table"].includes(feedback.category) ? { ...feedback, nextAction: `${feedback.nextAction} This task's starter is ${outcome.starter.trim().replace(/;$/, "")}.` } : feedback;
  }
  const count = response.data.rowCount;
  const limited = !!response.data.isTruncated;
  const countText = `The query ran and returned ${limited ? "at least " : ""}${count} ${count === 1 ? "row" : "rows"}${limited ? " (limited display)" : ""}.`;
  let result: QueryAttemptFeedback;
  if (!outcome.saved) result = make("progress-not-saved", "Results returned; progress not saved", `${countText} ${response.message}`, "Keep your draft and retry once the saved case is available. These results have not advanced your case.", "succeeded", "not-saved", "warning");
  else if (!outcome.before.task) result = make(outcome.before.completionScope === "full-resolution" ? "investigation-complete" : "review-complete", "Exploring a completed evidence trail", countText, outcome.before.completionScope === "full-resolution" ? "Review the saved case resolution and your notebook." : "Review your notebook. This release ends at evidence review; it does not verify a culprit.", "succeeded", "complete");
  else if (outcome.matched) {
    const completed = outcome.after?.status === "completed";
    const full = outcome.after?.completionScope === "full-resolution";
    result = make(completed ? (full ? "investigation-complete" : "review-complete") : "task-proved", completed ? (full ? "Investigation complete" : "Released evidence review complete") : "Current task proved", `${countText} The saved results prove the current task.`, completed ? (full ? "Review the saved resolution and notebook." : "Review your notebook. Culprit verification is not included in this release.") : "Follow Samuel's updated direction for the next task. Your draft is retained.", "succeeded", completed ? "complete" : "proved", "success");
  } else if (count === 0) result = make("no-matches", "No matching rows", "The SQL ran successfully.", "Compare your conditions with the briefing and proved facts. Remove one condition and run again.");
  else if (outcome.sourcePresent === false) result = make("unrelated-results", "Results do not prove the current task", `${countText} These results have not been accepted as current-task evidence.`, "Compare the FROM table with the current starter, then inspect the columns needed for Samuel's current task.");
  else if (outcome.isolationNeeded || outcome.candidateLimit) result = make("narrow-results", "Narrow this evidence search", `${countText} ${outcome.candidateLimit ? "This result exceeds the current evidence logging limit." : "This task needs one isolated evidence record before it can be proved."}`, "Use your briefing facts and proved values to refine the conditions, then run the query again.");
  else if (outcome.readyToLog && outcome.before.task?.completionMode === "query") {
    result = make("evidence-ready", "Read and select the relevant account", `${countText} The current account can be proved by logging its matching statement.`, "Read the statements and log the account Samuel asked you to find. Other returned statements can be saved as notes without proving this task.", "succeeded", "ready-to-log");
  } else if (outcome.readyToLog) {
    const collection = outcome.before.task?.collection;
    const partial = !!collection && collection.accepted > 0 && collection.accepted < collection.required;
    result = make(partial ? "partial-collection" : "evidence-ready", partial ? "Continue the evidence collection" : "Evidence available to inspect and log", `${countText}${partial ? ` Saved collection: ${collection!.accepted} of ${collection!.required} distinct observations.` : ""} Logging an eligible row lets the server check and save the clue.`, "Read the returned rows and log a relevant clue. Query execution alone does not complete this logging task.", "succeeded", partial ? "partial" : "ready-to-log");
  } else result = make("results", "Inspect the returned evidence", `${countText} The current task has not been proved by these results.`, "Compare the returned columns and values with Samuel's current direction and hint. Refine the query or inspect the current starter.");
  return { ...result, rowCount: count, countIsLimited: limited };
}
