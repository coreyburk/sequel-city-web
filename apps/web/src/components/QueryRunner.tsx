import { useEffect, useRef, useState, type FormEvent } from "react";
import { executeQuery } from "../api/client";
import type { QueryExecutionResponse, QueryRow } from "../api/types";
import type { ReinforcementSignal } from "../features/queryReinforcement";
import type { SamuelReaction } from "../features/samuelReactions";
import {
  QUERY_SETUP_GUIDANCE,
  SAFE_SELECT_ONLY_GUIDANCE,
  shouldShowQuerySetupGuidance
} from "../guidance";
import { QueryResultsTable } from "./QueryResultsTable";

const DEVELOPER_DEFAULT_QUERY = "SELECT DB_NAME() AS CurrentDatabase";
const STUDENT_STARTER_QUERY = "SELECT * FROM CrimeType";
const STUDENT_SQL_BUILDING_BLOCKS = [
  "SELECT",
  "*",
  "FROM",
  "WHERE",
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
const BLANK_STUDENT_QUERY_ERROR = "Write the next query before you run it.";
const STUDENT_SELECT_START_ERROR =
  "Start with SELECT so the database knows you are reading rows, not changing them.";
const STUDENT_FROM_MISSING_ERROR =
  "Add FROM after SELECT and name the table you want to inspect.";
const STUDENT_FROM_TARGET_MISSING_ERROR =
  "Name a table after FROM so the database knows where to read from.";
const STUDENT_WHERE_FILTER_ERROR =
  "Finish the WHERE clause with a column, an operator, and a value you can prove.";
const STUDENT_FILTER_CONTEXT_ERROR =
  "Add WHERE before a filter like = or LIKE, unless you are writing an ON clause for a JOIN.";
const STUDENT_AND_OR_ERROR =
  "Complete the filter after AND or OR with another column comparison.";
const STUDENT_ORDER_BY_ERROR =
  "Finish ORDER BY with the column you want to sort.";
const STUDENT_LIKE_ERROR =
  "Finish LIKE with the text pattern you want to match, such as '48Z%'.";
const STUDENT_SYNTAX_RECOVERY_ERROR =
  "SQL could not read that query yet. Recheck the order of SELECT, FROM, WHERE, and each filter value.";

export type QueryAssistRequest = {
  id: string;
  text: string;
  sourceLabel?: string;
};

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

type StudentEvidenceFeedbackTone = "neutral" | "success" | "error";

type StudentFeedbackPresentation = {
  ariaLabel: string;
  kicker: string;
};

interface QueryRunnerProps {
  onExecutionComplete?: (payload: QueryRunnerExecutionPayload) => void;
  audience?: "student" | "developer";
  draftQuery?: string | null;
  restoredExecution?: QueryRunnerExecutionPayload | null;
  resetKey?: number;
  onStudentSqlEdit?: (sql: string) => void;
  studentInstruction?: string | null;
  studentFailureGuidance?: string | null;
  studentEvidencePrompt?: string | null;
  studentReinforcement?: ReinforcementSignal | null;
  studentSamuelReaction?: SamuelReaction | null;
  studentEvidenceFeedback?: string | null;
  studentEvidenceFeedbackTone?: StudentEvidenceFeedbackTone;
  queryAssistRequest?: QueryAssistRequest | null;
  onStudentLogRow?: (row: QueryRow) => void;
}

export function QueryRunner({
  onExecutionComplete,
  audience = "developer",
  draftQuery,
  restoredExecution,
  resetKey,
  onStudentSqlEdit,
  studentInstruction,
  studentFailureGuidance,
  studentEvidencePrompt,
  studentReinforcement,
  studentSamuelReaction,
  studentEvidenceFeedback,
  studentEvidenceFeedbackTone,
  queryAssistRequest,
  onStudentLogRow
}: QueryRunnerProps = {}): JSX.Element {
  const isStudentAudience = audience === "student";
  const isWitnessTransitionReview =
    isStudentAudience &&
    draftQuery === null &&
    restoredExecution?.sql.toLowerCase().includes("from crimescenereport") &&
    restoredExecution.sql.toLowerCase().includes("where reportid = 10975");
  const feedbackPresentation = getStudentFeedbackPresentation(
    studentEvidenceFeedbackTone,
    studentEvidenceFeedback
  );
  const [sql, setSql] = useState(
    draftQuery === undefined
      ? isStudentAudience
        ? STUDENT_STARTER_QUERY
        : DEVELOPER_DEFAULT_QUERY
      : draftQuery ?? ""
  );
  const [result, setResult] = useState<QueryExecutionResponse | null>(
    restoredExecution?.response ?? null
  );
  const [resultSql, setResultSql] = useState<string | null>(restoredExecution?.sql ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(restoredExecution?.error ?? null);
  const queryRunnerRef = useRef<HTMLElement>(null);
  const queryControlsRef = useRef<HTMLFormElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const sqlTextareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldScrollToResponseRef = useRef(false);
  const lastAppliedQueryAssistIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (draftQuery !== undefined) {
      setSql(draftQuery ?? "");
    }
  }, [draftQuery]);

  useEffect(() => {
    if (!restoredExecution) {
      return;
    }

    setResult(restoredExecution.response);
    setResultSql(restoredExecution.sql);
    setError(restoredExecution.error);
  }, [restoredExecution]);

  useEffect(() => {
    if (resetKey === undefined) {
      return;
    }

    setResult(restoredExecution?.response ?? null);
    setResultSql(restoredExecution?.sql ?? null);
    setError(restoredExecution?.error ?? null);
  }, [resetKey, restoredExecution]);

  useEffect(() => {
    const textarea = sqlTextareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [sql]);

  useEffect(() => {
    if (!isStudentAudience || (!result && !error) || !shouldScrollToResponseRef.current) {
      return;
    }

    shouldScrollToResponseRef.current = false;

    const scrollTarget = queryControlsRef.current ?? queryRunnerRef.current;
    if (!scrollTarget || typeof scrollTarget.scrollIntoView !== "function") {
      return;
    }

    sqlTextareaRef.current?.focus({ preventScroll: true });
    scrollTarget.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [error, isStudentAudience, result]);

  useEffect(() => {
    if (!isStudentAudience || !queryAssistRequest) {
      return;
    }

    if (lastAppliedQueryAssistIdRef.current === queryAssistRequest.id) {
      return;
    }

    lastAppliedQueryAssistIdRef.current = queryAssistRequest.id;
    insertText(queryAssistRequest.text);
  }, [isStudentAudience, queryAssistRequest]);

  function insertBuildingBlock(block: string): void {
    if (block === "%") {
      insertText(block, { appendTrailingSpace: false, preserveSpacing: true });
      return;
    }

    insertText(block, { appendTrailingSpace: true });
  }

  function notifyStudentSqlEdit(nextSql: string): void {
    if (isStudentAudience) {
      onStudentSqlEdit?.(nextSql);
    }
  }

  function insertText(
    text: string,
    options: { appendTrailingSpace?: boolean; preserveSpacing?: boolean } = {}
  ): void {
    const textarea = sqlTextareaRef.current;
    if (!textarea) {
      if (options.preserveSpacing) {
        setSql((current) => {
          const nextSql = `${current}${text}`;
          notifyStudentSqlEdit(nextSql);
          return nextSql;
        });
      } else {
        const trailing = options.appendTrailingSpace ? " " : "";
        setSql((current) => {
          const nextSql = `${current}${current.endsWith(" ") || current.length === 0 ? "" : " "}${text}${trailing}`;
          notifyStudentSqlEdit(nextSql);
          return nextSql;
        });
      }
      return;
    }

    const selectionStart = textarea.selectionStart ?? textarea.value.length;
    const selectionEnd = textarea.selectionEnd ?? textarea.value.length;
    const currentValue = textarea.value;
    const prefixNeedsSpace =
      selectionStart > 0 &&
      !/\s/.test(currentValue[selectionStart - 1] ?? "") &&
      currentValue[selectionStart - 1] !== "(";
    const suffixNeedsSpace =
      selectionEnd < currentValue.length &&
      !/\s/.test(currentValue[selectionEnd] ?? "") &&
      currentValue[selectionEnd] !== ")";
    const insertion = options.preserveSpacing
      ? text
      : `${prefixNeedsSpace ? " " : ""}${text}${
          suffixNeedsSpace || options.appendTrailingSpace ? " " : ""
        }`;
    const nextValue =
      currentValue.slice(0, selectionStart) + insertion + currentValue.slice(selectionEnd);
    const caretPosition = selectionStart + insertion.length;

    setSql(nextValue);
    notifyStudentSqlEdit(nextValue);

    requestAnimationFrame(() => {
      sqlTextareaRef.current?.focus();
      sqlTextareaRef.current?.setSelectionRange(caretPosition, caretPosition);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    shouldScrollToResponseRef.current = true;
    setError(null);

    if (isStudentAudience && sql.trim().length === 0) {
      setError(BLANK_STUDENT_QUERY_ERROR);
      return;
    }

    if (isStudentAudience) {
      const studentQueryCoachError = getStudentQueryCoachError(sql);
      if (studentQueryCoachError) {
        setError(studentQueryCoachError);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await executeQuery(sql);
      setResult(response);
      setResultSql(sql);
      onExecutionComplete?.({
        sql,
        response,
        error: null
      });
    } catch (submitError) {
      setResult(null);
      setResultSql(null);
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Query execution failure.";
      setError(
        isStudentAudience ? getStudentRuntimeQueryError(errorMessage) : errorMessage
      );
      onExecutionComplete?.({
        sql,
        response: null,
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }

  const showsQueuedNextFilterContext =
    isStudentAudience &&
    result?.success &&
    resultSql &&
    sql.trim().length > 0 &&
    normalizeSql(resultSql) !== normalizeSql(sql);
  const studentResultError =
    isStudentAudience &&
    result &&
    !result.success &&
    result.safety.isAllowed &&
    result.safety.violations.length === 0
      ? getStudentRuntimeQueryError(result.message)
      : null;

  return (
    <section
      ref={queryRunnerRef}
      className={`panel panel--full ${isStudentAudience ? "query-runner--student" : ""}`}
      aria-labelledby="query-runner-title"
    >
      <div className="section-heading">
        <h2 id="query-runner-title">Query Runner</h2>
        <p className="message-muted">
          {isStudentAudience
            ? studentInstruction ??
              (isWitnessTransitionReview
                ? "Review the restored result, then write your next query."
                : "Write SQL and run it to inspect rows.")
            : "Enter SQL below, submit it to the backend, and review the backend response without any frontend SQL validation."}
        </p>
      </div>
      <form
        ref={queryControlsRef}
        className="query-controls"
        onSubmit={(event) => void handleSubmit(event)}
      >
        {!isStudentAudience ? (
          <div className="callout-list" aria-label="Query runner guidance">
            <p>Enter SQL in the textarea below.</p>
            <p>The backend validates SQL before execution.</p>
            <p>{SAFE_SELECT_ONLY_GUIDANCE}</p>
            <p><strong>Run Query</strong> submits the request to the backend.</p>
          </div>
        ) : null}
        {isStudentAudience ? (
          <>
            <p className="message-muted query-builder-hint">
              Click a block or a Case File fact to insert it.
            </p>
            <div className="query-builder-blocks" aria-label="SQL building blocks">
              {STUDENT_SQL_BUILDING_BLOCKS.map((block) => (
                <button
                  key={block}
                  type="button"
                  className="query-builder-block"
                  onClick={() => insertBuildingBlock(block)}
                >
                  {block}
                </button>
              ))}
            </div>
          </>
        ) : null}
        <label className="input-label" htmlFor="query-runner-sql">
          SQL Query
        </label>
        <textarea
          ref={sqlTextareaRef}
          id="query-runner-sql"
          aria-label="SQL query input"
          value={sql}
          onChange={(event) => {
            setSql(event.target.value);
            notifyStudentSqlEdit(event.target.value);
          }}
        />
        <button type="submit" className="query-runner-submit" disabled={loading}>
          {loading ? "Running..." : "Run Query"}
        </button>
      </form>
      {error ? (
        <div ref={responseRef} className="query-response-anchor">
          <p className="message-error">{error}</p>
          {isStudentAudience && studentFailureGuidance ? (
            <p className="message-muted">{studentFailureGuidance}</p>
          ) : null}
          {shouldShowQuerySetupGuidance(error) ? (
            <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
          ) : null}
        </div>
      ) : null}
      {result ? (
        <div ref={responseRef} className="query-response">
          {!isStudentAudience ? (
            <dl className="key-value-grid key-value-grid--compact">
              <div className="key-value-card">
                <dt>Safety</dt>
                <dd>{result.safety.message}</dd>
              </div>
              <div className="key-value-card">
                <dt>Backend Message</dt>
                <dd>{result.message}</dd>
              </div>
              <div className="key-value-card">
                <dt>Execution Time</dt>
                <dd>{result.executionTimeMs} ms</dd>
              </div>
            </dl>
          ) : null}
          {!result.success && studentResultError ? (
            <p className="message-error">{studentResultError}</p>
          ) : null}
          {!result.success && shouldShowQuerySetupGuidance(result.message) ? (
            <p className="message-muted">{QUERY_SETUP_GUIDANCE}</p>
          ) : null}
          {!result.success && isStudentAudience && studentFailureGuidance ? (
            <p className="message-muted">{studentFailureGuidance}</p>
          ) : null}
          {showsQueuedNextFilterContext ? (
            <p className="message-muted">
              Showing results from the last query you ran while Samuel queues the next filter in the editor.
            </p>
          ) : null}
          {result.safety.violations.length > 0 ? (
            <p className="message-error">
              Violations:{" "}
              {result.safety.violations.map((violation) => violation.message).join(", ")}
            </p>
          ) : null}
          {!result.safety.isAllowed ? (
            <p className="message-muted">{SAFE_SELECT_ONLY_GUIDANCE}</p>
          ) : null}
          {isStudentAudience &&
          result.success &&
          studentEvidenceFeedback &&
          studentEvidenceFeedbackTone &&
          studentEvidenceFeedbackTone !== "neutral" ? (
            <aside
              className={`student-evidence-feedback student-evidence-feedback--${studentEvidenceFeedbackTone}`}
              role={studentEvidenceFeedbackTone === "error" ? "alert" : "status"}
              data-student-feedback={studentEvidenceFeedbackTone}
              aria-label={feedbackPresentation.ariaLabel}
            >
              <p className="student-evidence-feedback__kicker">
                {feedbackPresentation.kicker}
              </p>
              <p className="student-evidence-feedback__message">
                {studentEvidenceFeedback}
              </p>
            </aside>
          ) : null}
          {result.success ? (
            <QueryResultsTable
              result={result.data}
              audience={audience}
              studentEvidencePrompt={studentEvidencePrompt}
              onStudentLogRow={onStudentLogRow}
            />
          ) : null}
          {isStudentAudience && result.success && studentReinforcement ? (
            <aside
              className={`query-reinforcement query-reinforcement--${studentReinforcement.tone}`}
              role="status"
              aria-label="Query reinforcement feedback"
            >
              <p className="query-reinforcement__headline">
                {studentReinforcement.headline}
              </p>
              <p className="query-reinforcement__message">
                {studentReinforcement.message}
              </p>
            </aside>
          ) : null}
          {isStudentAudience && result.success && studentSamuelReaction ? (
            <aside
              className={`samuel-reaction samuel-reaction--${studentSamuelReaction.tone}`}
              role="note"
              aria-label="Samuel's mentor reaction"
            >
              <p className="samuel-reaction__attribution">Samuel</p>
              <p className="samuel-reaction__message">
                {studentSamuelReaction.message}
              </p>
            </aside>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function getStudentFeedbackPresentation(
  tone: StudentEvidenceFeedbackTone | undefined,
  message: string | null | undefined
): StudentFeedbackPresentation {
  if (tone === "error") {
    return {
      ariaLabel: "Clue rejected",
      kicker: "Try Another Row"
    };
  }

  if ((message ?? "").startsWith("Insight Mark")) {
    return {
      ariaLabel: "Insight Mark update",
      kicker: "Insight Mark"
    };
  }

  if ((message ?? "").startsWith("Clue logged") || (message ?? "").startsWith("Witness clue bundle logged")) {
    return {
      ariaLabel: "Clue logged",
      kicker: "Clue Logged"
    };
  }

  return {
    ariaLabel: "Lead update",
    kicker: "Next Lead Ready"
  };
}

function normalizeStudentSql(sql: string): string {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function getStudentQueryCoachError(sql: string): string | null {
  const trimmedSql = sql.trim();
  const normalizedSql = normalizeStudentSql(sql);

  if (!normalizedSql.startsWith("select")) {
    return STUDENT_SELECT_START_ERROR;
  }

  if (!/\bfrom\b/.test(normalizedSql)) {
    return STUDENT_FROM_MISSING_ERROR;
  }

  if (/\bfrom\s*$/i.test(trimmedSql)) {
    return STUDENT_FROM_TARGET_MISSING_ERROR;
  }

  if (/[=]/.test(normalizedSql) && !/\b(where|on)\b/.test(normalizedSql)) {
    return STUDENT_FILTER_CONTEXT_ERROR;
  }

  if (/\bwhere\s*$/i.test(trimmedSql)) {
    return STUDENT_WHERE_FILTER_ERROR;
  }

  if (/\bwhere\b/.test(normalizedSql)) {
    const whereClause = normalizedSql.split(/\bwhere\b/i)[1] ?? "";
    if (!/(=| like | in\s*\(| is )/.test(whereClause)) {
      return STUDENT_WHERE_FILTER_ERROR;
    }
  }

  if (/\b(and|or)\s*$/i.test(trimmedSql)) {
    return STUDENT_AND_OR_ERROR;
  }

  if (/\border by\s*$/i.test(trimmedSql)) {
    return STUDENT_ORDER_BY_ERROR;
  }

  if (/\blike\s*$/i.test(trimmedSql)) {
    return STUDENT_LIKE_ERROR;
  }

  return null;
}

function getStudentRuntimeQueryError(message: string): string {
  if (shouldShowQuerySetupGuidance(message)) {
    return message;
  }

  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("incorrect syntax near") ||
    normalizedMessage.includes("syntax") ||
    normalizedMessage.includes("parse")
  ) {
    return STUDENT_SYNTAX_RECOVERY_ERROR;
  }

  if (
    normalizedMessage.includes("invalid column") ||
    normalizedMessage.includes("could not be bound")
  ) {
    return "One of those column names does not line up yet. Recheck the table, then compare each column name against the result headers or Case File clues.";
  }

  return message;
}

function normalizeSql(sql: string): string {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}
