import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import type {
  InvestigationStage,
  ReinforcementContext,
  ReinforcementSignal
} from "./types";

const STAGE_TITLE: Record<InvestigationStage, string> = {
  "crime-catalog": "Crime catalog stage",
  "report-filter": "Report filter stage",
  "witness-trail": "Witness trail stage",
  "gym-trail": "Gym trail stage",
  "trigger-check": "Trigger check stage",
  "mastermind-trail": "Mastermind trail stage",
  closed: "Case wrap-up stage"
};

// Tables that are in scope for each deterministic investigation stage. Used
// to decide whether the queried tables align with what Samuel is currently
// guiding toward. Tables not in any in-scope set are not blocked from being
// queried — they only trigger a structural "this is outside the current
// trail" redirection, never an answer-key disclosure.
const STAGE_IN_SCOPE_TABLES: Record<InvestigationStage, ReadonlyArray<string>> = {
  "crime-catalog": ["crimetype", "crimescenereport"],
  "report-filter": ["crimescenereport", "crimetype"],
  "witness-trail": ["interviewlog", "crimescenereport", "personsofinterest"],
  "gym-trail": [
    "fitnflabclub",
    "fitnflabclubcheckin",
    "personsofinterest",
    "driverslicense"
  ],
  "trigger-check": [
    "fitnflabclub",
    "fitnflabclubcheckin",
    "personsofinterest",
    "interviewlog",
    "solution"
  ],
  "mastermind-trail": [
    "eventschedule",
    "eventregistration",
    "employment",
    "driverslicense",
    "personsofinterest",
    "solution"
  ],
  closed: []
};

const STAGE_FOCUS_HINT: Record<InvestigationStage, string> = {
  "crime-catalog":
    "Stay with the crime catalog and the report archive while you anchor the case.",
  "report-filter":
    "Keep tightening the report archive with filters until one report row stands out.",
  "witness-trail":
    "Stay with the interview records tied to the report you just confirmed.",
  "gym-trail":
    "Stay with the membership and check-in records the witness trail unlocked.",
  "trigger-check":
    "Use the verification pattern to test your current theory.",
  "mastermind-trail":
    "Cross-reference event, vehicle, and employment trails to widen the picture.",
  closed: "You can revisit any earlier trail to review what you already proved."
};

// Tables known to return large result sets unfiltered. Used to suggest
// narrowing when a learner runs an unbounded scan, without naming the
// answer rows hidden in those tables.
const LARGE_UNFILTERED_TABLES: ReadonlySet<string> = new Set([
  "crimescenereport",
  "interviewlog",
  "personsofinterest",
  "driverslicense",
  "employment",
  "fitnflabclubcheckin",
  "eventregistration",
  "eventschedule"
]);

export function deriveInvestigationStage(
  completedMilestones: Record<MilestoneId, boolean>
): InvestigationStage {
  if (!completedMilestones["crime-type"]) {
    return "crime-catalog";
  }

  if (!completedMilestones["crime-scene-filter"]) {
    return "report-filter";
  }

  if (!completedMilestones["witness-clues"]) {
    return "witness-trail";
  }

  if (!completedMilestones["gym-chain"]) {
    return "gym-trail";
  }

  if (!completedMilestones["trigger-check"]) {
    return "trigger-check";
  }

  if (!completedMilestones["mastermind-trace"]) {
    return "mastermind-trail";
  }

  return "closed";
}

function normalizeSql(sql: string): string {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function extractTableReferences(normalizedSql: string): string[] {
  const tables: string[] = [];
  const pattern = /\b(?:from|join)\s+([a-z0-9_]+)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalizedSql)) !== null) {
    tables.push(match[1]);
  }

  return tables;
}

function hasWhereClause(normalizedSql: string): boolean {
  return /\bwhere\b/.test(normalizedSql);
}

function hasJoinClause(normalizedSql: string): boolean {
  return /\bjoin\b/.test(normalizedSql);
}

function isInScope(
  stage: InvestigationStage,
  tableReferences: ReadonlyArray<string>
): boolean {
  const scope = STAGE_IN_SCOPE_TABLES[stage];
  if (scope.length === 0 || tableReferences.length === 0) {
    return true;
  }

  return tableReferences.some((table) => scope.includes(table));
}

function isLargeUnfilteredScan(
  tableReferences: ReadonlyArray<string>,
  rowCount: number | null,
  hasWhere: boolean
): boolean {
  if (hasWhere) {
    return false;
  }

  if (rowCount !== null && rowCount > 25) {
    return true;
  }

  return tableReferences.some((table) => LARGE_UNFILTERED_TABLES.has(table));
}

function evidenceCoversReport(
  notebookEntries: ReadonlyArray<EvidenceNotebookEntry>
): boolean {
  return notebookEntries.some((entry) => {
    const detail = entry.detail.toLowerCase();
    return (
      detail.includes("reportid") ||
      detail.includes("reportcity") ||
      detail.includes("reportdate")
    );
  });
}

// Deterministic reinforcement generator. Inputs come only from learner-visible
// state (the SQL the learner typed, the backend row count, the deterministic
// milestone map, the deterministic stage, and the learner's own notebook).
// The function never names suspects, never names hidden answer rows, never
// generates SQL, and never confirms a solution. It produces one short
// structural signal that supports iteration without solving the case.
export function generateReinforcement(
  context: ReinforcementContext
): ReinforcementSignal | null {
  if (!context.isSuccess) {
    return null;
  }

  const normalizedSql = normalizeSql(context.sql);
  if (normalizedSql.length === 0) {
    return null;
  }

  const stageLabel = STAGE_TITLE[context.stage];
  const stageHint = STAGE_FOCUS_HINT[context.stage];
  const tableReferences = extractTableReferences(normalizedSql);
  const hasWhere = hasWhereClause(normalizedSql);
  const hasJoin = hasJoinClause(normalizedSql);
  const rowCount = context.rowCount ?? 0;
  const inScope = isInScope(context.stage, tableReferences);

  if (!inScope) {
    return {
      id: "unrelated-results",
      category: "unrelated-results",
      tone: "redirect",
      headline: `${stageLabel}: outside the current trail`,
      message: `These records do not appear connected to the current investigation focus yet. ${stageHint}`
    };
  }

  if (rowCount === 0) {
    return {
      id: "incomplete-chain",
      category: "incomplete-chain",
      tone: "redirect",
      headline: `${stageLabel}: evidence chain incomplete`,
      message:
        "The query executed correctly, but no rows came back. Loosen one filter or recheck a value against your pinned facts before trying again."
    };
  }

  if (hasJoin) {
    if (hasWhere && rowCount > 0 && rowCount <= 25) {
      return {
        id: "useful-join",
        category: "useful-join",
        tone: "positive",
        headline: `${stageLabel}: JOIN connected related records`,
        message: `Good. Your JOIN tied related rows together and the filter kept the result tight (${rowCount} rows). Decide which row deserves a pinned fact next.`
      };
    }

    return {
      id: "useful-join-broad",
      category: "useful-join",
      tone: "redirect",
      headline: `${stageLabel}: JOIN ran, result still broad`,
      message: `Your JOIN connected the tables, but ${rowCount} rows is still wide. Add a WHERE on a column tied to the current focus before logging anything.`
    };
  }

  if (hasWhere) {
    if (rowCount <= 5) {
      return {
        id: "productive-narrowing",
        category: "productive-narrowing",
        tone: "positive",
        headline: `${stageLabel}: productive narrowing`,
        message: `You narrowed the result set to ${rowCount} row${rowCount === 1 ? "" : "s"}. Inspect what you can prove from those rows before pinning anything new.`
      };
    }

    if (rowCount <= 25) {
      return {
        id: "useful-filtering",
        category: "useful-filtering",
        tone: "positive",
        headline: `${stageLabel}: good use of filtering`,
        message: `Filtering trimmed the result to ${rowCount} rows. If the right record is still buried, layer another filter from a fact you have already pinned.`
      };
    }

    return {
      id: "filtering-still-broad",
      category: "overly-broad",
      tone: "redirect",
      headline: `${stageLabel}: filtered, but still broad`,
      message: `Your filter cut the rows down to ${rowCount}, but the pile is still large. Combine another filter from your pinned facts before reviewing rows.`
    };
  }

  if (isLargeUnfilteredScan(tableReferences, context.rowCount, hasWhere)) {
    return {
      id: "overly-broad",
      category: "overly-broad",
      tone: "redirect",
      headline: `${stageLabel}: result set is still broad`,
      message: `${rowCount} rows came back. Try narrowing with a WHERE filter on a column you can prove, such as a city, date, or identifier from your pinned facts.`
    };
  }

  if (
    context.stage === "report-filter" &&
    !evidenceCoversReport(context.notebookEntries) &&
    tableReferences.includes("crimescenereport")
  ) {
    return {
      id: "alignment-report-filter",
      category: "investigation-alignment",
      tone: "redirect",
      headline: `${stageLabel}: stay on the report trail`,
      message: `You are on the right trail. ${stageHint}`
    };
  }

  return {
    id: "investigation-alignment",
    category: "investigation-alignment",
    tone: "neutral",
    headline: `${stageLabel}: aligned with the current focus`,
    message: `This query touches the records the current trail expects. ${stageHint}`
  };
}
