import { useEffect, useRef, useState } from "react";
import { getSchemaTables } from "./api/client";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "./api/types";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import {
  CASE_004_BRIEF,
  CASE_004_MILESTONES,
  CASE_BACKGROUND,
  EXPECTED_MURDER_REPORT,
  INVESTIGATION_OVERVIEW,
  KNOWN_CASE_FACTS,
  SAMUEL_HEADER_INTRO,
  SAMUEL_MENTOR_INTRO,
  SAMUEL_TUPLETON_STEPS,
  SQL_CITY_REPORT_DRAFT,
  TARGET_REPORT_REVIEW_QUERY,
  getCaseMomentum,
  getCaseReviewCheck,
  getCurrentAvailableLeads,
  getLeadBoardCards,
  getSamuelAvatarSrc,
  getSamuelReaction,
  getSamuelVisualState,
  getStudentSceneVisual,
  getVisibleMilestones
} from "./studentCase";
import type {
  CaseReviewChoice,
  CaseReviewStatus,
  EvidenceNotebookEntry,
  MilestoneId,
  PendingEvidenceStep,
  StudentEvidenceFeedbackTone,
  StudentView
} from "./studentCase";

type WorkspaceMode = "student" | "developer";

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

export default function App(): JSX.Element {
  const [mode, setMode] = useState<WorkspaceMode>("student");
  const [studentView, setStudentView] = useState<StudentView>("briefing");
  const [studentSchema, setStudentSchema] = useState<SchemaResponse | null>(null);
  const [studentSchemaLoading, setStudentSchemaLoading] = useState(false);
  const [studentSchemaError, setStudentSchemaError] = useState<string | null>(null);
  const [selectedStudentTable, setSelectedStudentTable] = useState<string | null>(null);
  const [studentDraftQuery, setStudentDraftQuery] = useState<string | null>(
    SAMUEL_TUPLETON_STEPS[0].queryDraft
  );
  const [studentLastQueryExecution, setStudentLastQueryExecution] =
    useState<QueryRunnerExecutionPayload | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Record<MilestoneId, boolean>>({
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "trigger-check": false,
    "mastermind-trace": false
  });
  const [samuelStage, setSamuelStage] = useState(0);
  const [notebookEntries, setNotebookEntries] = useState<EvidenceNotebookEntry[]>([]);
  const [pendingEvidenceStep, setPendingEvidenceStep] = useState<PendingEvidenceStep>(null);
  const [studentEvidenceFeedback, setStudentEvidenceFeedback] = useState<string | null>(null);
  const [studentEvidenceFeedbackTone, setStudentEvidenceFeedbackTone] =
    useState<StudentEvidenceFeedbackTone>("neutral");
  const [highlightedNotebookEntryId, setHighlightedNotebookEntryId] = useState<string | null>(null);
  const [manualNotebookDraft, setManualNotebookDraft] = useState("");
  const [caseReviewStatus, setCaseReviewStatus] = useState<CaseReviewStatus>("idle");
  const [caseReviewStatusId, setCaseReviewStatusId] = useState<string | null>(null);
  const [earnedCaseReviewIds, setEarnedCaseReviewIds] = useState<string[]>([]);
  const studentCaseHeaderRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mode !== "student") {
      return;
    }

    let active = true;
    setStudentSchemaLoading(true);

    async function loadSchema(): Promise<void> {
      try {
        const response = await getSchemaTables();

        if (!active) {
          return;
        }

        setStudentSchema(response);
        setSelectedStudentTable((current) => current ?? response.data.tables[0]?.fullName ?? null);
        setStudentSchemaError(null);
      } catch {
        if (!active) {
          return;
        }

        setStudentSchema(null);
        setSelectedStudentTable(null);
        setStudentSchemaError("Schema is unavailable right now.");
      } finally {
        if (active) {
          setStudentSchemaLoading(false);
        }
      }
    }

    void loadSchema();

    return () => {
      active = false;
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "student" || samuelStage >= SAMUEL_TUPLETON_STEPS.length) {
      return;
    }

    setStudentDraftQuery(SAMUEL_TUPLETON_STEPS[samuelStage].queryDraft);
  }, [mode, samuelStage]);

  useEffect(() => {
    if (
      mode !== "student" ||
      studentView !== "case-board" ||
      studentEvidenceFeedbackTone !== "success" ||
      !studentEvidenceFeedback
    ) {
      return;
    }

    if (typeof studentCaseHeaderRef.current?.scrollIntoView !== "function") {
      return;
    }

    studentCaseHeaderRef.current.focus({ preventScroll: true });
    studentCaseHeaderRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [mode, studentEvidenceFeedback, studentEvidenceFeedbackTone, studentView]);

  const selectedTableDetails =
    studentSchema?.data.tables.find((table) => table.fullName === selectedStudentTable) ?? null;
  const completedCount = CASE_004_MILESTONES.filter(
    (milestone) => completedMilestones[milestone.id]
  ).length;
  const visibleMilestones = getVisibleMilestones(completedMilestones);
  const activeLeads = getCurrentAvailableLeads(completedMilestones);
  const shouldShowCrimeReportHandoff =
    completedMilestones["crime-type"] && !completedMilestones["crime-scene-filter"];
  const activeSamuelStep =
    SAMUEL_TUPLETON_STEPS[Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length - 1)];
  const samuelCompletedCount = Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length);
  const samuelStatus =
    samuelStage >= SAMUEL_TUPLETON_STEPS.length
      ? {
          title: "Witness trail unlocked",
          detail:
            "You found the key report row. Use it to inspect the witness records next; the rest of the case can wait until those facts are earned."
        }
      : samuelStage === 0
        ? {
            title: "Samuel's nudge",
            detail:
              "Run the first draft exactly as written. This opening move is about finding the code word the rest of the case depends on."
          }
        : samuelStage === 1
          ? {
              title: "Samuel's advice",
              detail:
                "Good. You found the crime catalog. Now broaden your view and inspect the scene reports before you start filtering."
            }
          : {
              title: "Samuel's advice",
              detail:
                "Now tighten the evidence. Add the murder filter and city filter together so the right report row moves into view."
            };
  const caseMomentum = getCaseMomentum({
    studentView,
    pendingEvidenceStep,
    studentEvidenceFeedbackTone,
    completedMilestones
  });
  const samuelVisualState = getSamuelVisualState({
    studentEvidenceFeedbackTone,
    completedMilestones
  });
  const samuelAvatarSrc = getSamuelAvatarSrc(samuelVisualState);
  const caseStatus = `Case ${CASE_004_BRIEF.caseNumber} · ${CASE_004_BRIEF.caseName} · ${completedCount}/${CASE_004_MILESTONES.length} clues logged`;
  const shouldShowWitnessTrailGuide =
    completedMilestones["crime-scene-filter"] && !completedMilestones["witness-clues"];
  const normalizedLastStudentSql = studentLastQueryExecution
    ? normalizeSqlForMilestones(studentLastQueryExecution.sql)
    : "";
  const isWitnessInterviewScanActive =
    shouldShowWitnessTrailGuide &&
    normalizedLastStudentSql.includes("from interviewlog");
  const loggedWitnessPersonIds = getLoggedWitnessPersonIds(notebookEntries);
  const witnessBundleCount = loggedWitnessPersonIds.length;
  const hasPinnedWitnessReportId = notebookEntries.some(
    (entry) => normalizeComparableValue(entry.detail) === `reportid = ${EXPECTED_MURDER_REPORT.reportId}`
  );
  const witnessChecklistItems: Array<{ label: string; detail: string }> = [];
  if (!hasPinnedWitnessReportId) {
    witnessChecklistItems.push({
      label: "Keep ReportID pinned",
      detail: "stay tied to the report row that started the trail."
    });
  }
  if (witnessBundleCount === 0) {
    witnessChecklistItems.push(
      {
        label: "Log the first witness bundle",
        detail: "one repeated PersonID and its strongest clue snippet."
      },
      {
        label: "Log the second witness bundle",
        detail: "the other repeated PersonID and its strongest clue snippet."
      }
    );
  } else if (witnessBundleCount === 1) {
    witnessChecklistItems.push({
      label: "Log the second witness bundle",
      detail: "the other repeated PersonID and its strongest clue snippet."
    });
  }
  witnessChecklistItems.push({
    label: "Add the next lookup note",
    detail: "write which person or address lookup those PersonIDs should be used for next."
  });
  const studentQueryRunnerInstruction = isWitnessInterviewScanActive
    ? witnessBundleCount === 0
      ? "Step 2: Sort the InterviewLog rows by PersonID. Find one repeated PersonID with witness-style transcripts, then start Step 3 by clicking Log clue on one strong row from that bundle. Ignore the confession-heavy rows for now."
      : witnessBundleCount === 1
        ? "Step 3: Find the other repeated PersonID with witness-style transcripts, then click Log clue on one strong row from that second bundle."
        : "Step 4: Both witness bundles are pinned. Open Evidence Board and add one short note saying those PersonIDs should be used in person or address data next."
    : shouldShowWitnessTrailGuide
      ? "Step 1: Review the restored report result below, then write your own InterviewLog query in the editor."
      : null;
  const studentQueryFailureGuidance = shouldShowWitnessTrailGuide
    ? "If this query fails, simplify it. Do not GROUP BY or JOIN yet. Try: SELECT PersonID, LogTranscript FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID. Once the witness rows are clear, then decide what PersonID facts belong in your notebook."
    : null;
  const studentEvidencePrompt =
    pendingEvidenceStep === "crime-type"
      ? "Possible clue found. Log the row that proves Murder maps to the correct CrimeID."
      : pendingEvidenceStep === "crime-scene-filter"
        ? "Possible clue found. Review the SQL City murder reports and log the row from January 15th, 2023."
        : isWitnessInterviewScanActive
        ? witnessBundleCount === 0
            ? "Step 2 target: use Log clue on one strong row from the first repeated PersonID witness bundle."
            : witnessBundleCount === 1
              ? "Step 3 target: use Log clue on one strong row from the second repeated PersonID witness bundle."
              : "Step 4 target: add one short notebook note saying which person or address lookup those PersonIDs should be used for next."
        : null;

  const studentScene = getStudentSceneVisual({
    samuelStage,
    pendingEvidenceStep,
    studentEvidenceFeedbackTone
  });
  const samuelReaction = getSamuelReaction({
    samuelStage,
    pendingEvidenceStep,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    completedMilestones
  });
  const mentorTitle =
    studentView === "briefing" && !studentEvidenceFeedback
      ? "Meet Samuel Tupleton"
      : samuelStatus.title;
  const mentorMessage =
    studentView === "briefing" && !studentEvidenceFeedback
      ? SAMUEL_HEADER_INTRO
      : samuelReaction;
  const caseReviewCheck = getCaseReviewCheck(completedMilestones, samuelStage);
  const leadBoardCards = getLeadBoardCards(completedMilestones);
  const insightMarks = earnedCaseReviewIds.length;
  const activeCaseReviewStatus =
    caseReviewStatusId === caseReviewCheck.id ? caseReviewStatus : "idle";

  function normalizeSqlForMilestones(sql: string): string {
    return sql.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function isWitnessNotebookFact(note: string): boolean {
    const normalizedNote = note.toLowerCase();

    return (
      normalizedNote.includes("personid") ||
      normalizedNote.includes("person") ||
      normalizedNote.includes("interview") ||
      normalizedNote.includes("witness") ||
      normalizedNote.includes("address") ||
      normalizedNote.includes("lookup") ||
      normalizedNote.includes("name")
    );
  }

  function getLoggedWitnessPersonIds(entries: EvidenceNotebookEntry[]): string[] {
    return entries
      .filter((entry) => entry.id.startsWith("witness-person-"))
      .map((entry) => entry.id.replace("witness-person-", ""));
  }

  function upsertNotebookEntries(entries: EvidenceNotebookEntry[]): void {
    setNotebookEntries((current) => {
      const updated = [...current];

      for (const entry of entries) {
        const existingIndex = updated.findIndex((item) => item.id === entry.id);

        if (existingIndex === -1) {
          updated.push(entry);
          continue;
        }

        updated[existingIndex] = entry;
      }

      return updated;
    });
  }

  function rowContainsValue(row: QueryRow, expected: string): boolean {
    const normalizedExpected = expected.toLowerCase();

    return Object.values(row.displayValues).some((value) =>
      value.toLowerCase().includes(normalizedExpected)
    );
  }

  function getRowValue(row: QueryRow, key: string): string | null {
    const displayMatch = row.displayValues[key];
    if (displayMatch) {
      return displayMatch;
    }

    const rawMatch = row.values[key];
    return rawMatch === null || rawMatch === undefined ? null : String(rawMatch);
  }

  function normalizeComparableValue(value: string | null): string {
    return (value ?? "").trim().toLowerCase();
  }

  function normalizeCompactDate(value: string | null): string {
    return normalizeComparableValue(value).replace(/[^0-9]/g, "");
  }

  function buildSingleRowReviewExecution(row: QueryRow, sql: string): QueryRunnerExecutionPayload {
    const columnNames = Object.keys(row.displayValues);

    return {
      sql,
      error: null,
      response: {
        success: true,
        data: {
          columns: columnNames.map((name, index) => ({
            name,
            ordinal: index + 1,
            dataType: "string" as const
          })),
          rows: [row],
          rowCount: 1
        },
        safety: {
          isAllowed: true,
          normalizedStatementType: "select",
          violations: [],
          message: "Allowed SELECT query."
        },
        executionTimeMs: 0,
        message: "Focused report review ready."
      }
    };
  }

  function normalizeTranscript(text: string | null): string {
    return normalizeComparableValue(text);
  }

  function isWitnessObservationTranscript(text: string): boolean {
    const normalizedText = normalizeTranscript(text);

    return (
      normalizedText.includes("i saw") ||
      normalizedText.includes("i heard") ||
      normalizedText.includes("i recognized") ||
      normalizedText.includes("he had") ||
      normalizedText.includes("he got into") ||
      normalizedText.includes("there was")
    );
  }

  function isConfessionHeavyTranscript(text: string): boolean {
    const normalizedText = normalizeTranscript(text);

    return (
      normalizedText.includes("i whacked") ||
      normalizedText.includes("i delivered") ||
      normalizedText.includes("contract") ||
      normalizedText.includes("client wanted") ||
      normalizedText.includes("she said the sleazeball") ||
      normalizedText.includes("they called to ice him")
    );
  }

  function summarizeWitnessTranscript(text: string): string {
    const normalizedText = normalizeTranscript(text);

    if (normalizedText.includes("heard a gunshot")) {
      return "heard a gunshot";
    }

    if (normalizedText.includes("saw a man run out")) {
      return "saw a man run out";
    }

    if (normalizedText.includes("membership number on the bag started with \"48z\"")) {
      return "saw a gym bag with membership starting 48Z";
    }

    if (normalizedText.includes("plate that included \"h42w\"")) {
      return 'saw a plate containing "H42W"';
    }

    if (normalizedText.includes("red bmw parked outside the symphony hall")) {
      return "noticed a red BMW outside Symphony Hall";
    }

    if (normalizedText.includes("saw the murder happen")) {
      return "saw the murder happen";
    }

    if (normalizedText.includes("recognized the killer from my gym")) {
      return "recognized the killer from the gym";
    }

    if (normalizedText.includes("well-groomed mustache")) {
      return "described a mustache and fancy vest";
    }

    return text.trim();
  }

  function buildWitnessBundleSummary(transcripts: string[]): string {
    const summaries: string[] = [];

    for (const transcript of transcripts) {
      const summary = summarizeWitnessTranscript(transcript);

      if (!summaries.includes(summary)) {
        summaries.push(summary);
      }

      if (summaries.length === 3) {
        break;
      }
    }

    return summaries.join(", ");
  }

  function removeNotebookEntry(entryId: string): void {
    setNotebookEntries((current) => current.filter((entry) => entry.id !== entryId));
    setHighlightedNotebookEntryId((current) => (current === entryId ? null : current));
  }

  function handleStudentEvidenceLog(row: QueryRow): void {
    if (pendingEvidenceStep === "crime-type") {
      const isMurderRow = rowContainsValue(row, "murder");
      const crimeId = getRowValue(row, "CrimeID") ?? getRowValue(row, "crimeid") ?? "1080";

      if (!isMurderRow) {
        setStudentEvidenceFeedback(
          "That row does not prove the crime we are investigating yet. Find the Murder entry and log that clue."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const entryId = "crime-type-murder";
      upsertNotebookEntries([
        {
          id: entryId,
          detail: `CrimeID = ${crimeId}`,
          sourceLabel: "Samuel Step 1"
        }
      ]);
      setCompletedMilestones((current) => ({ ...current, "crime-type": true }));
      setSamuelStage((current) => Math.max(current, 1));
      setPendingEvidenceStep(null);
      setStudentEvidenceFeedback(
        `Clue logged: CrimeID ${crimeId} maps to Murder. Return to Query Lab; Samuel has queued the CrimeSceneReport draft for the next clue.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(entryId);
      setStudentView("case-board");
      return;
    }

    if (pendingEvidenceStep === "crime-scene-filter") {
      const crimeId = getRowValue(row, "CrimeID") ?? getRowValue(row, "crimeid");
      const reportDate =
        getRowValue(row, "ReportDate") ??
        getRowValue(row, "reportdate") ??
        getRowValue(row, "Date") ??
        getRowValue(row, "date") ??
        "unknown date";
      const reportCity =
        getRowValue(row, "ReportCity") ??
        getRowValue(row, "reportcity") ??
        getRowValue(row, "City") ??
        getRowValue(row, "city") ??
        "unknown city";
      const reportId =
        getRowValue(row, "ReportID") ??
        getRowValue(row, "reportid") ??
        getRowValue(row, "ReportId") ??
        getRowValue(row, "reportId");

      const matchesExpectedReport =
        (reportId ? normalizeComparableValue(reportId) === EXPECTED_MURDER_REPORT.reportId : false) &&
        normalizeComparableValue(reportCity) === EXPECTED_MURDER_REPORT.reportCity &&
        normalizeCompactDate(reportDate) === EXPECTED_MURDER_REPORT.reportDate;

      if ((crimeId !== "1080" && !rowContainsValue(row, "1080")) || !matchesExpectedReport) {
        setStudentEvidenceFeedback(
          "That row is still not the target murder report. Re-check the date, city, and report ID before you log it."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const entryId = "crime-scene-filter-murder-report";
      const reportEntries: EvidenceNotebookEntry[] = [
        {
          id: `${entryId}-city`,
          detail: `ReportCity = ${reportCity}`,
          sourceLabel: "Samuel Step 3"
        },
        {
          id: `${entryId}-date`,
          detail: `ReportDate = ${reportDate}`,
          sourceLabel: "Samuel Step 3"
        }
      ];

      if (reportId) {
        reportEntries.push({
          id: `${entryId}-id`,
          detail: `ReportID = ${reportId}`,
          sourceLabel: "Samuel Step 3"
        });
      }

      upsertNotebookEntries(reportEntries);
      setCompletedMilestones((current) => ({ ...current, "crime-scene-filter": true }));
      setSamuelStage((current) => Math.max(current, 3));
      setPendingEvidenceStep(null);
      setStudentLastQueryExecution(buildSingleRowReviewExecution(row, TARGET_REPORT_REVIEW_QUERY));
      setStudentEvidenceFeedback(
        "Clue logged: you isolated the murder report row. Return to the Query Lab to review ReportID 10975, then follow Samuel's next lead into InterviewLog."
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(reportEntries[reportEntries.length - 1]?.id ?? entryId);
      setStudentDraftQuery(null);
      setStudentView("case-board");
      return;
    }

    if (
      completedMilestones["crime-scene-filter"] &&
      !completedMilestones["witness-clues"] &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from interviewlog")
    ) {
      const personId =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");
      const reportId =
        getRowValue(row, "ReportID") ??
        getRowValue(row, "reportid") ??
        getRowValue(row, "ReportId") ??
        getRowValue(row, "reportId");
      const logTranscript =
        getRowValue(row, "LogTranscript") ??
        getRowValue(row, "logtranscript") ??
        getRowValue(row, "Transcript") ??
        getRowValue(row, "transcript");

      if (!personId || normalizeComparableValue(reportId) !== EXPECTED_MURDER_REPORT.reportId) {
        setStudentEvidenceFeedback(
          "That row is not part of the witness trail Samuel wants. Stay with the InterviewLog rows tied to ReportID 10975."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (!logTranscript || isConfessionHeavyTranscript(logTranscript)) {
        setStudentEvidenceFeedback(
          "That row sounds like confession or contract detail, not the witness bundle Samuel wants first. Pick a row that sounds like someone saw, heard, recognized, or described something at the scene."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const witnessRows = studentLastQueryExecution.response.data.rows.filter((candidateRow) => {
        const candidatePersonId =
          getRowValue(candidateRow, "PersonID") ??
          getRowValue(candidateRow, "personid") ??
          getRowValue(candidateRow, "PersonId") ??
          getRowValue(candidateRow, "personId");
        const candidateTranscript =
          getRowValue(candidateRow, "LogTranscript") ??
          getRowValue(candidateRow, "logtranscript") ??
          getRowValue(candidateRow, "Transcript") ??
          getRowValue(candidateRow, "transcript");

        return (
          normalizeComparableValue(candidatePersonId) === normalizeComparableValue(personId) &&
          candidateTranscript !== null &&
          isWitnessObservationTranscript(candidateTranscript)
        );
      });

      if (witnessRows.length === 0) {
        setStudentEvidenceFeedback(
          "Samuel still needs a witness bundle here. Try another row tied to a repeated PersonID that sounds like a scene observation."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const witnessSummary = buildWitnessBundleSummary(
        witnessRows
          .map((witnessRow) =>
            getRowValue(witnessRow, "LogTranscript") ??
            getRowValue(witnessRow, "logtranscript") ??
            getRowValue(witnessRow, "Transcript") ??
            getRowValue(witnessRow, "transcript") ??
            ""
          )
          .filter(Boolean)
      );

      const witnessEntries: EvidenceNotebookEntry[] = [
        {
          id: `witness-person-${personId}`,
          detail: `Witness PersonID = ${personId}`,
          sourceLabel: "InterviewLog"
        },
        {
          id: `witness-bundle-${personId}`,
          detail: `Witness bundle ${personId}: ${witnessSummary}`,
          sourceLabel: "InterviewLog"
        }
      ];

      const alreadyLoggedWitness = notebookEntries.some(
        (entry) => entry.id === `witness-person-${personId}`
      );
      const nextWitnessBundleCount = alreadyLoggedWitness ? witnessBundleCount : witnessBundleCount + 1;
      upsertNotebookEntries(witnessEntries);
      setStudentEvidenceFeedback(
        nextWitnessBundleCount >= 2
          ? `Witness clue bundle logged for PersonID ${personId}. Both repeated witness PersonIDs are now pinned. Add one short notebook note about using those PersonIDs in the next person or address lookup.`
          : `Witness clue bundle logged for PersonID ${personId}. Find the other repeated PersonID and use Log clue on one strong witness row for that bundle too.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(`witness-bundle-${personId}`);
      setStudentView("case-board");
    }
  }

  function handleManualNotebookAdd(): void {
    const trimmedDraft = manualNotebookDraft.trim();

    if (!trimmedDraft) {
      return;
    }

    const entryId = `manual-note-${Date.now()}`;
    upsertNotebookEntries([
      {
        id: entryId,
        detail: trimmedDraft,
        isManual: true
      }
    ]);
    setHighlightedNotebookEntryId(entryId);
    setManualNotebookDraft("");

    if (
      completedMilestones["crime-scene-filter"] &&
      !completedMilestones["witness-clues"] &&
      loggedWitnessPersonIds.length >= 2 &&
      isWitnessNotebookFact(trimmedDraft)
    ) {
      setCompletedMilestones((current) => ({ ...current, "witness-clues": true }));
      setStudentEvidenceFeedback(
        "Witness trail logged: both witness bundles are pinned, and your notebook now names the next lookup those PersonIDs should drive."
      );
      setStudentEvidenceFeedbackTone("success");
    }
  }

  function handleQueryExecutionComplete(payload: {
    sql: string;
    response: QueryExecutionResponse | null;
    error: string | null;
  }): void {
    setStudentLastQueryExecution(payload);

    if (payload.error) {
      return;
    }

    if (!payload.response?.success) {
      return;
    }

    const normalizedSql = normalizeSqlForMilestones(payload.sql);
    setCompletedMilestones((current) => {
      const updated = { ...current };

      for (const milestone of CASE_004_MILESTONES) {
        const requiresEvidenceLog =
          milestone.id === "crime-type" ||
          milestone.id === "crime-scene-filter" ||
          milestone.id === "witness-clues";

        if (requiresEvidenceLog) {
          continue;
        }

        if (!updated[milestone.id] && milestone.matches(normalizedSql)) {
          updated[milestone.id] = true;
        }
      }

      return updated;
    });

    if (normalizedSql.includes("from crimetype")) {
      setPendingEvidenceStep("crime-type");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
      return;
    }

    if (normalizedSql.includes("from crimescenereport") && !normalizedSql.includes("where")) {
      setSamuelStage((current) => Math.max(current, 2));
      setPendingEvidenceStep(null);
      setHighlightedNotebookEntryId(null);
      setStudentEvidenceFeedback(
        "Good. You found the report backlog. Now tighten the evidence until only the murder case rows remain."
      );
      setStudentEvidenceFeedbackTone("success");
      setStudentView("workbench");
      return;
    }

    if (
      normalizedSql.includes("from crimescenereport") &&
      normalizedSql.includes("where") &&
      (normalizedSql.includes("crimeid") || normalizedSql.includes("1080"))
    ) {
      if (!normalizedSql.includes("reportcity")) {
        setPendingEvidenceStep(null);
        setHighlightedNotebookEntryId(null);
        setStudentEvidenceFeedback(
          "Murder reports isolated, but the pile is still too large. Add another filter: use AND with ReportCity = 'SQL City', then look for the January 15th, 2023 report."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentDraftQuery(SQL_CITY_REPORT_DRAFT);
        setStudentView("workbench");
        return;
      }

      setPendingEvidenceStep("crime-scene-filter");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
    }
  }

  function handleCaseReviewChoice(choice: CaseReviewChoice): void {
    setCaseReviewStatusId(caseReviewCheck.id);

    if (choice.isCorrect) {
      setCaseReviewStatus("correct");
      setEarnedCaseReviewIds((current) =>
        current.includes(caseReviewCheck.id) ? current : [...current, caseReviewCheck.id]
      );
      return;
    }

    setCaseReviewStatus("error");
  }

  return (
    <main className={`app-shell ${mode === "student" ? "app-shell--student" : ""}`}>
      <header className="app-header">
        <h1>Sequel City Case Files</h1>
        <div className="mode-toggle" role="group" aria-label="Workspace Mode">
          <button
            type="button"
            aria-pressed={mode === "student"}
            onClick={() => setMode("student")}
          >
            Student Mode
          </button>
          <button
            type="button"
            aria-pressed={mode === "developer"}
            onClick={() => setMode("developer")}
          >
            Developer Mode
          </button>
        </div>
      </header>
      {mode === "student" ? (
        <>
          <section
            ref={studentCaseHeaderRef}
            className={`panel panel--full student-case-header student-case-header--${caseMomentum.toLowerCase().replace(/\s+/g, "-")}`}
            aria-labelledby="student-case-header-title"
            tabIndex={-1}
          >
            <div className="student-case-header__content">
              <div className="student-case-header__summary">
                <p className="student-case-header__kicker">Case Status</p>
                <h2 id="student-case-header-title">{caseStatus}</h2>
              </div>
              <section
                className="student-mentor-strip student-mentor-strip--embedded"
                aria-label="Samuel Tupleton Mentor"
              >
                <div className="samuel-avatar-frame">
                  <div
                    className={`samuel-avatar samuel-avatar--${samuelVisualState}`}
                    aria-hidden="true"
                  >
                    <img src={samuelAvatarSrc} alt="" />
                  </div>
                  <p className="samuel-avatar-name">Samuel Tupleton</p>
                </div>
                <div className="student-mentor-strip__copy">
                  <h2>{mentorTitle}</h2>
                  <p>{mentorMessage}</p>
                </div>
              </section>
            </div>
            <div className="student-case-header__visual" aria-label="Noir Scene Visual">
              <div className={`noir-scene-frame noir-scene-frame--${studentScene.visual}`}>
                <img
                  className="noir-scene-frame__image"
                  src={studentScene.imageSrc}
                  alt={studentScene.alt}
                />
                <div className="noir-scene-frame__scrim" aria-hidden="true" />
                <div className="noir-scene-frame__grain" aria-hidden="true" />
              </div>
            </div>
          </section>
          <nav
            className="student-view-tabs student-action-nav"
            aria-label="Student Case Actions"
          >
            <button
              type="button"
              aria-pressed={studentView === "briefing"}
              aria-current={studentView === "briefing" ? "page" : undefined}
              disabled={studentView === "briefing"}
              onClick={() => setStudentView("briefing")}
            >
              Samuel&apos;s Briefing
            </button>
            <button
              type="button"
              aria-pressed={studentView === "workbench"}
              aria-current={studentView === "workbench" ? "page" : undefined}
              disabled={studentView === "workbench"}
              onClick={() => setStudentView("workbench")}
            >
              Query Lab
            </button>
            <button
              type="button"
              aria-pressed={studentView === "case-board"}
              aria-current={studentView === "case-board" ? "page" : undefined}
              disabled={studentView === "case-board"}
              onClick={() => setStudentView("case-board")}
            >
              Evidence Board
            </button>
          </nav>
          {studentView === "briefing" ? (
            <section
              className="panel panel--full samuel-briefing samuel-briefing--primary"
              aria-labelledby="samuel-briefing-title"
            >
              <div className="samuel-briefing__header">
                <div>
                  <p className="samuel-briefing__kicker">Data Detective On-Ramp</p>
                  <h2 id="samuel-briefing-title">Case Briefing</h2>
                </div>
                <p className="samuel-briefing__badge">
                  Breadcrumbs {samuelCompletedCount} / {SAMUEL_TUPLETON_STEPS.length}
                </p>
              </div>
              <div className="samuel-briefing__layout samuel-briefing__layout--single">
                <section className="samuel-briefing__mission" aria-label="Current Mission">
                  <div className="samuel-briefing__intro-grid">
                    <div className="samuel-briefing__prompt samuel-briefing__prompt--primary">
                      <p className="samuel-briefing__prompt-title">Samuel&apos;s Role</p>
                      <p>{SAMUEL_MENTOR_INTRO}</p>
                    </div>
                    <div className="samuel-briefing__prompt">
                      <p className="samuel-briefing__prompt-title">Case Background</p>
                      <p>{CASE_BACKGROUND}</p>
                    </div>
                  </div>
                  <div className="samuel-briefing__prompt">
                    <p className="samuel-briefing__prompt-title">How You&apos;ll Find Clues</p>
                    <ul className="known-case-facts-list">
                      {INVESTIGATION_OVERVIEW.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="samuel-briefing__prompt samuel-briefing__case-file">
                    <p className="samuel-briefing__prompt-title">Known Case Facts</p>
                    <ul className="known-case-facts-list">
                      {KNOWN_CASE_FACTS.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="samuel-briefing__prompt-title">First Lead</p>
                  <p className="samuel-briefing__label">{activeSamuelStep.label}</p>
                  <h3>{activeSamuelStep.title}</h3>
                  <div className="samuel-objective-grid">
                    <div className="samuel-briefing__prompt samuel-briefing__prompt--primary">
                      <p className="samuel-briefing__prompt-title">Next Step</p>
                      <p>{activeSamuelStep.nextStep}</p>
                    </div>
                    <div className="samuel-briefing__support-grid">
                      <div className="samuel-briefing__prompt">
                        <p className="samuel-briefing__prompt-title">Why It Matters</p>
                        <p>{activeSamuelStep.observationPrompt}</p>
                      </div>
                      <div className="samuel-briefing__prompt">
                        <p className="samuel-briefing__prompt-title">Success Looks Like</p>
                        <p>{activeSamuelStep.successSignal}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          ) : null}
          {studentView === "workbench" ? (
            <section className="student-workspace student-workspace--focused" aria-label="Student Workbench">
              <div className="student-workspace__main">
                {shouldShowWitnessTrailGuide ? (
                  <section className="panel student-investigation-brief" aria-label="Witness Trail Guide">
                    <p className="samuel-briefing__prompt-title">Samuel&apos;s Next Lead</p>
                    <h2>Witness trail guide</h2>
                    {witnessBundleCount >= 2 ? (
                      <>
                        <p>
                          You have already logged both witness bundles. One step is left before Samuel advances.
                        </p>
                        <div className="investigation-brief-compact">
                          <p className="investigation-brief__label">One Step Left</p>
                          <p>
                            Open Evidence Board and add one short note saying those{" "}
                            <code className="investigation-brief__token">PersonID</code> values
                            should be used for the next person or address lookup.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          You found the key report row. Follow this order before Samuel advances.
                        </p>
                        <div className="investigation-brief-compact">
                          <p className="investigation-brief__label">Use These Report Clues</p>
                          <p>
                            The report says there were two witnesses: one lives at the last house on{" "}
                            <code className="investigation-brief__token">Northwestern Dr</code>, and
                            the second witness, <code className="investigation-brief__token">Annabel</code>,
                            lives somewhere on{" "}
                            <code className="investigation-brief__token">Franklin Ave</code>.
                          </p>
                          <ol className="investigation-brief-steps">
                            <li>
                              Query <code className="investigation-brief__token">InterviewLog</code>{" "}
                              with the <code className="investigation-brief__token">ReportID</code> from the report row.
                            </li>
                            <li>
                              Sort with <code className="investigation-brief__token">ORDER BY PersonID</code>{" "}
                              and find repeated <code className="investigation-brief__token">PersonID</code> witness rows.
                            </li>
                            <li>
                              Use <code className="investigation-brief__token">Log clue</code> once for
                              each repeated <code className="investigation-brief__token">PersonID</code> bundle.
                            </li>
                            <li>
                              Add one short Evidence Board note saying those{" "}
                              <code className="investigation-brief__token">PersonID</code> values should be used
                              for the next person or address lookup.
                            </li>
                          </ol>
                        </div>
                      </>
                    )}
                  </section>
                ) : null}
                <QueryRunner
                  audience="student"
                  onExecutionComplete={handleQueryExecutionComplete}
                  draftQuery={studentDraftQuery}
                  restoredExecution={studentLastQueryExecution}
                  studentInstruction={studentQueryRunnerInstruction}
                  studentFailureGuidance={studentQueryFailureGuidance}
                  studentEvidencePrompt={studentEvidencePrompt}
                  onStudentLogRow={handleStudentEvidenceLog}
                />
                <section className="student-support" aria-label="Student Support Sections">
                  <details className="panel support-panel">
                    <summary>Quick Table Clues</summary>
                    <div className="support-panel__content schema-snapshot">
                      <p className="message-muted">
                        Open a table when you need a quick reminder about columns or keys.
                      </p>
                      {studentSchemaLoading ? <p className="message-muted">Loading schema snapshot...</p> : null}
                      {studentSchemaError ? <p className="message-error">{studentSchemaError}</p> : null}
                      {studentSchema ? (
                        <div className="schema-snapshot__layout">
                          <ul className="schema-pill-list">
                            {studentSchema.data.tables.map((table) => (
                              <li key={table.fullName}>
                                <button
                                  type="button"
                                  className="schema-link"
                                  aria-pressed={selectedStudentTable === table.fullName}
                                  onClick={() => setSelectedStudentTable(table.fullName)}
                                >
                                  {table.fullName}
                                </button>
                              </li>
                            ))}
                          </ul>
                          {selectedTableDetails ? <StudentSchemaTable table={selectedTableDetails} /> : null}
                        </div>
                      ) : null}
                    </div>
                  </details>
                  <details className="panel support-panel">
                    <summary>Case Facts</summary>
                    <div className="support-panel__content">
                      <ul className="known-case-facts-list story-recap__text">
                        {KNOWN_CASE_FACTS.map((fact) => (
                          <li key={fact}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </section>
              </div>
              <aside className="student-workspace__rail" aria-label="Pinned Facts Snapshot">
                <section className="panel evidence-snapshot-card" aria-labelledby="evidence-snapshot-title">
                  <div className="section-heading section-heading--compact">
                    <h2 id="evidence-snapshot-title">Pinned Facts</h2>
                  </div>
                  {notebookEntries.length > 0 ? (
                    <ul className="evidence-snapshot-list">
                      {notebookEntries.map((entry) => (
                        <li
                          key={entry.id}
                          className={
                            entry.id === highlightedNotebookEntryId
                              ? "notebook-entry--highlighted"
                              : undefined
                          }
                        >
                          <span>{entry.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="message-muted">
                      No facts pinned yet. Run Samuel&apos;s opening query and log the clue that matters.
                    </p>
                  )}
                </section>
              </aside>
            </section>
          ) : null}
          {studentView === "case-board" ? (
            <section className="student-case-board" aria-label="Evidence Notebook and Case File">
              <section className="panel evidence-rail-card detective-notebook" aria-labelledby="evidence-notebook-title">
                <div className="section-heading section-heading--compact">
                  <h2 id="evidence-notebook-title">Evidence Notebook</h2>
                  <p className="message-muted">
                    Log the clue Samuel asks for at each guided step before he advances the case.
                  </p>
                </div>
                {notebookEntries.length > 0 ? (
                  <ul className="notebook-entry-list notebook-entry-list--compact">
                    {notebookEntries.map((entry) => (
                      <li
                        key={entry.id}
                        className={
                          entry.id === highlightedNotebookEntryId
                            ? "notebook-entry--highlighted"
                            : undefined
                        }
                      >
                        <span>{entry.detail}</span>
                        <button
                          type="button"
                          className="notebook-entry-remove"
                          aria-label={`Remove note ${entry.detail}`}
                          onClick={() => removeNotebookEntry(entry.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="message-muted">
                    Your notebook is empty. Run Samuel&apos;s opening query and log the clue that matters.
                  </p>
                )}
                {completedMilestones["crime-scene-filter"] && !completedMilestones["witness-clues"] ? (
                  <div className="notebook-evidence-contract" aria-label="Witness Evidence Checklist">
                    <p className="samuel-briefing__prompt-title">Witness Evidence Checklist</p>
                    <p>Still needed before Samuel advances:</p>
                    <ul>
                      {witnessChecklistItems.map((item, index) => (
                        <li key={item.label}>
                          <strong>{index + 1}. {item.label}:</strong> {item.detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="manual-note-entry">
                  <label className="input-label" htmlFor="student-manual-note">
                    Add your own note
                  </label>
                  <input
                    id="student-manual-note"
                    className="text-input"
                    type="text"
                    value={manualNotebookDraft}
                    onChange={(event) => setManualNotebookDraft(event.target.value)}
                    placeholder="Witness note, address, hunch, or cross-reference..."
                  />
                  <button type="button" className="student-note-button" onClick={handleManualNotebookAdd}>
                    Add Note
                  </button>
                </div>
              </section>
              <section className="panel case-file-card" aria-labelledby="case-file-title">
                <div className="section-heading section-heading--compact">
                  <h2 id="case-file-title">Case Progress</h2>
                  <p className="message-muted">
                    Completed milestones: {completedCount} / {CASE_004_MILESTONES.length}
                  </p>
                </div>
                {shouldShowCrimeReportHandoff ? (
                  <div className="case-progress__next case-progress__next--handoff">
                    <p>
                      <strong>Current Action:</strong> Return to Query Lab. Samuel has queued
                      the CrimeSceneReport draft so you can inspect the report archive.
                    </p>
                    <button
                      type="button"
                      className="student-note-button"
                      onClick={() => setStudentView("workbench")}
                    >
                      Return to Query Lab
                    </button>
                  </div>
                ) : leadBoardCards.length > 0 ? (
                  <div className="lead-board__cards" aria-label="Current Action">
                    {leadBoardCards.map((card) => (
                      <article
                        key={card.id}
                        className={`lead-board__card lead-board__card--${card.status}`}
                      >
                        <p className="lead-board__card-title">Current Action: {card.title}</p>
                        <p>{card.detail}</p>
                      </article>
                    ))}
                  </div>
                ) : activeLeads.length > 0 ? (
                  <div className="case-progress__next">
                    <p><strong>Current Action:</strong></p>
                    <ul>
                      {activeLeads.map((lead) => (
                        <li key={lead.id}>{lead.cluePrompt}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="case-progress__next">
                    <strong>Current Action:</strong> Stay with Samuel&apos;s current instruction before opening new leads.
                  </p>
                )}
                <section className="case-review" aria-labelledby="case-review-title">
                  <div className="case-review__header">
                    <p className="samuel-briefing__prompt-title" id="case-review-title">
                      Case Review
                    </p>
                    <p className="case-review__score">Insight Marks {insightMarks}</p>
                  </div>
                  <p>{caseReviewCheck.prompt}</p>
                  <div className="case-review__choices">
                    {caseReviewCheck.choices.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleCaseReviewChoice(choice)}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                  {activeCaseReviewStatus === "correct" ? (
                    <p className="case-review__result case-review__result--correct">
                      Insight +1. {caseReviewCheck.success}
                    </p>
                  ) : null}
                  {activeCaseReviewStatus === "error" ? (
                    <p className="case-review__result case-review__result--error">
                      {caseReviewCheck.coaching}
                    </p>
                  ) : null}
                </section>
                <ul className="milestone-list">
                  {visibleMilestones.map((milestone) => (
                    <li key={milestone.id}>
                      <span aria-hidden="true">
                        {completedMilestones[milestone.id] ? "[x]" : "[ ]"}
                      </span>
                      <span>{milestone.title}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </section>
          ) : null}
        </>
      ) : (
        <section className="panel panel--full guidance-panel" aria-labelledby="first-run-guidance-title">
          <div className="section-heading">
            <h2 id="first-run-guidance-title">First-Run Guidance</h2>
            <p className="message-muted">
              Keep this visible during first launch so the required command, URLs, and smoke-test
              query are easy to reference.
            </p>
          </div>
          <dl className="key-value-grid">
            <div className="key-value-card">
              <dt>Startup Command</dt>
              <dd><code>npm run dev</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Frontend URL</dt>
              <dd><code>http://127.0.0.1:5173</code></dd>
            </div>
            <div className="key-value-card">
              <dt>Backend API URL</dt>
              <dd><code>http://127.0.0.1:3001</code></dd>
            </div>
            <div className="key-value-card">
              <dt>First Test Query</dt>
              <dd><code>SELECT DB_NAME() AS CurrentDatabase</code></dd>
            </div>
          </dl>
        </section>
      )}
      {mode === "developer" ? (
        <div className="app-grid">
          <HealthStatus />
          <SchemaExplorer />
          <SuspectVerificationPanel />
          <QueryRunner />
          <QueryHistoryPanel />
        </div>
      ) : null}
    </main>
  );
}

function StudentSchemaTable({ table }: { table: SchemaTable }): JSX.Element {
  return (
    <div className="schema-compact" aria-label="Selected Table Schema">
      <p className="schema-compact__name">{table.fullName}</p>
      <div className="table-scroll">
        <table className="schema-compact__table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>PK</th>
              <th>FK</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={`${table.fullName}.${column.columnName}`}>
                <td>{column.columnName}</td>
                <td>{column.dataType}</td>
                <td>{column.isPrimaryKey ? "Y" : "-"}</td>
                <td>{column.isForeignKey ? "Y" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
