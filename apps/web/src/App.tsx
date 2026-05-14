import { useEffect, useRef, useState } from "react";
import { getSchemaTables } from "./api/client";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "./api/types";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import breakthroughScene from "./assets/scenes/scene-breakthrough.png";
import crimeLedgerScene from "./assets/scenes/scene-crime-ledger.png";
import misfireScene from "./assets/scenes/scene-misfire.png";
import murderBoardScene from "./assets/scenes/scene-murder-board.png";
import recordsVaultScene from "./assets/scenes/scene-records-vault.png";
import studentInitiativeScene from "./assets/scenes/scene-student-initiative.png";
import samuelBreakthroughAvatar from "./assets/avatars/avatar-samuel-breakthrough-discovered.png";
import samuelConfirmedAvatar from "./assets/avatars/avatar-samuel-confirmed-clue.png";
import samuelLeadUnlockedAvatar from "./assets/avatars/avatar-samuel-lead-unlocked.png";
import samuelMentorAvatar from "./assets/avatars/avatar-samuel-mentor-neutral.png";
import samuelSkepticalAvatar from "./assets/avatars/avatar-samuel-skeptical-misread.png";

type WorkspaceMode = "student" | "developer";
type StudentView = "briefing" | "workbench" | "case-board";
type MilestoneId =
  | "crime-type"
  | "crime-scene-filter"
  | "witness-clues"
  | "gym-chain"
  | "trigger-check"
  | "mastermind-trace";

type StoryBrief = {
  caseNumber: string;
  caseName: string;
};

const CASE_004_BRIEF: StoryBrief = {
  caseNumber: "004",
  caseName: "The SQL City Murder"
};

const SAMUEL_MENTOR_INTRO =
  "I'm Samuel Tupleton, your data detective mentor. I will keep the case honest: no guesses, no spoilers, just one verified database clue at a time.";

const SAMUEL_HEADER_INTRO =
  "I'll guide the investigation while you do the detective work: inspect the data, prove each clue, and decide what to query next.";

const CASE_BACKGROUND =
  "A murder was reported in Sequel City on January 15th, 2023. The case file does not hand you suspects. It gives you records, and your job is to prove which records matter.";

const INVESTIGATION_OVERVIEW = [
  "Start with broad tables, then narrow with facts you can prove.",
  "Run SQL to inspect records, filter carefully, and log only evidence that appears in your results.",
  "Each confirmed clue unlocks the next lead, moving from the crime report to witnesses and then deeper suspect trails."
];

const KNOWN_CASE_FACTS = [
  "January 15th, 2023: a murder was reported in Sequel City.",
  "The case does not begin with suspects. It begins with verified database facts.",
  "The first move is to prove which CrimeID means Murder before filtering reports.",
  "The target report row should point toward witness information you can verify later."
];

type CaseMilestone = {
  id: MilestoneId;
  title: string;
  cluePrompt: string;
  matches: (sql: string) => boolean;
};

type SamuelBriefingStep = {
  id: "crime-type" | "crime-scene-report" | "murder-filter";
  label: string;
  title: string;
  guidance: string;
  observationPrompt: string;
  nextStep: string;
  successSignal: string;
  queryDraft: string;
};

type EvidenceNotebookEntry = {
  id: string;
  detail: string;
  sourceLabel?: string;
  isManual?: boolean;
};

type PendingEvidenceStep = "crime-type" | "crime-scene-filter" | null;
type StudentEvidenceFeedbackTone = "neutral" | "success" | "error";
type CaseReviewStatus = "idle" | "correct" | "error";
type SamuelVisualState = "neutral" | "skeptical" | "confirmed" | "breakthrough" | "lead-unlocked";
type CaseMomentumState =
  | "Briefing"
  | "Query Active"
  | "Clue Pending"
  | "Evidence Pinned"
  | "Lead Unlocked"
  | "Misread";
type StudentSceneVisual =
  | "crime-ledger"
  | "records-vault"
  | "murder-board"
  | "student-initiative"
  | "breakthrough"
  | "misfire";

type LeadBoardCard = {
  id: string;
  title: string;
  detail: string;
  status: "active" | "ready" | "locked";
};

type StudentSceneDescriptor = {
  visual: StudentSceneVisual;
  alt: string;
  imageSrc: string;
};

type CaseReviewChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

type CaseReviewCheck = {
  id: string;
  prompt: string;
  choices: CaseReviewChoice[];
  success: string;
  coaching: string;
};

type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

const CASE_004_MILESTONES: CaseMilestone[] = [
  {
    id: "crime-type",
    title: "Find the right crime records",
    cluePrompt: "Start with crime type and crime scene records to anchor the case.",
    matches: (sql) => sql.includes("from crimetype") || sql.includes("from crimescenereport")
  },
  {
    id: "crime-scene-filter",
    title: "Narrow the exact case report",
    cluePrompt: "Filter by city, date, and crime clues until one key report stands out.",
    matches: (sql) =>
      sql.includes("where") &&
      sql.includes("crimescenereport") &&
      (sql.includes("reportdate") || sql.includes("reportcity") || sql.includes("crimeid"))
  },
  {
    id: "witness-clues",
    title: "Follow the witness trail",
    cluePrompt: "Use interviews and address records to identify both witness leads.",
    matches: (sql) =>
      sql.includes("interviewlog") &&
      sql.includes("personsofinterest") &&
      sql.includes("personid")
  },
  {
    id: "gym-chain",
    title: "Track the gym lead",
    cluePrompt: "Connect membership, check-ins, and identity to advance the suspect trail.",
    matches: (sql) =>
      sql.includes("fitnflabclub") ||
      sql.includes("fitnflabclubcheckin") ||
      sql.includes("fitmemberid")
  },
  {
    id: "trigger-check",
    title: "Test your first suspect theory",
    cluePrompt: "Use the solution check pattern to validate your trigger-man hypothesis.",
    matches: (sql) => sql.includes("insert into solution") && sql.includes("jeremy")
  },
  {
    id: "mastermind-trace",
    title: "Uncover the mastermind",
    cluePrompt:
      "Cross-check events, vehicle clues, and money trail evidence to identify the mastermind.",
    matches: (sql) =>
      sql.includes("eventregistration") ||
      sql.includes("eventschedule") ||
      sql.includes("driverslicense") ||
      sql.includes("employment") ||
      (sql.includes("insert into solution") && sql.includes("miranda"))
  }
];

const SAMUEL_TUPLETON_STEPS: SamuelBriefingStep[] = [
  {
    id: "crime-type",
    label: "Step 1",
    title: "Determine the Crime ID for murder",
    guidance:
      "Start simple. Pull the crime types first so we know which ID we should chase through the reports.",
    observationPrompt:
      "Look for the row that names Murder, then capture its CrimeID before you move on.",
    nextStep: "Run a query against CrimeType to find the Crime ID for murder.",
    successSignal: "You can identify the Murder row and state its CrimeID confidently.",
    queryDraft: "SELECT * FROM CrimeType"
  },
  {
    id: "crime-scene-report",
    label: "Step 2",
    title: "Look at the Crime Scene Report",
    guidance:
      "Now scan the report backlog. Don't solve it all at once yet. We just need to see what kind of report field clues we can work with.",
    observationPrompt:
      "Notice which columns could help you narrow the report list. Date, city, and crime ID matter.",
    nextStep:
      "Run a broad query against CrimeSceneReport so you can inspect the fields you can filter on.",
    successSignal: "You can name the report fields that will help narrow the case.",
    queryDraft: "SELECT *\nFROM CrimeSceneReport"
  },
  {
    id: "murder-filter",
    label: "Step 3",
    title: "Filter down to the murder reports",
    guidance:
      "The full report table is still too large. First use the murder Crime ID to shrink the pile, then decide what filter should come next.",
    observationPrompt:
      "Start with CrimeID 1080. If the result is still too large, use the city clue to tighten the search again.",
    nextStep:
      "Add a murder filter to CrimeSceneReport. Then review whether the result still needs another filter.",
    successSignal:
      "You can explain why another filter is needed before logging a report row.",
    queryDraft: "SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080"
  }
];

const SQL_CITY_REPORT_DRAFT =
  "SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080\n  AND ReportCity = 'SQL City'";
const TARGET_REPORT_REVIEW_QUERY =
  "SELECT *\nFROM CrimeSceneReport\nWHERE ReportID = 10975";

const EXPECTED_MURDER_REPORT = {
  reportId: "10975",
  reportCity: "sql city",
  reportDate: "20230115"
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

function getSamuelVisualState(input: {
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
}): SamuelVisualState {
  if (input.studentEvidenceFeedbackTone === "error") {
    return "skeptical";
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    return input.completedMilestones["crime-scene-filter"] ? "lead-unlocked" : "confirmed";
  }

  return "neutral";
}

function getSamuelAvatarSrc(state: SamuelVisualState): string {
  if (state === "skeptical") {
    return samuelSkepticalAvatar;
  }

  if (state === "confirmed") {
    return samuelConfirmedAvatar;
  }

  if (state === "breakthrough") {
    return samuelBreakthroughAvatar;
  }

  if (state === "lead-unlocked") {
    return samuelLeadUnlockedAvatar;
  }

  return samuelMentorAvatar;
}

function getCaseMomentum(input: {
  studentView: StudentView;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
}): CaseMomentumState {
  if (input.studentEvidenceFeedbackTone === "error") {
    return "Misread";
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    return input.completedMilestones["crime-scene-filter"] ? "Lead Unlocked" : "Evidence Pinned";
  }

  if (input.pendingEvidenceStep) {
    return "Clue Pending";
  }

  if (input.studentView === "workbench") {
    return "Query Active";
  }

  return "Briefing";
}

function getStudentSceneVisual(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
}): StudentSceneDescriptor {
  if (input.studentEvidenceFeedbackTone === "error") {
    return {
      visual: "misfire",
      alt: "Case board crossed by red lines over the wrong evidence cards",
      imageSrc: misfireScene
    };
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    return {
      visual: "breakthrough",
      alt: "Glowing evidence board with a confirmed clue pinned at the center",
      imageSrc: breakthroughScene
    };
  }

  if (input.pendingEvidenceStep === "crime-type" || input.samuelStage === 0) {
    return {
      visual: "crime-ledger",
      alt: "Crime ledger dossier under a desk lamp with the murder row marked",
      imageSrc: crimeLedgerScene
    };
  }

  if (input.pendingEvidenceStep === "crime-scene-filter" || input.samuelStage >= 2) {
    return {
      visual: "murder-board",
      alt: "Murder board covered in report scraps, red string, and the highlighted crime ID",
      imageSrc: murderBoardScene
    };
  }

  if (input.samuelStage === 1) {
    return {
      visual: "records-vault",
      alt: "Records vault with illuminated archive files and a highlighted crime scene report",
      imageSrc: recordsVaultScene
    };
  }

  return {
    visual: "student-initiative",
    alt: "Detective desk with notebook, pinned leads, and an open trail board",
    imageSrc: studentInitiativeScene
  };
}

function getSamuelReaction(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
}): string {
  if (input.studentEvidenceFeedbackTone === "error" && input.studentEvidenceFeedback) {
    return "That clue did not hold up. Re-read the row and only pin the fact that clearly advances the case.";
  }

  if (input.studentEvidenceFeedbackTone === "success" && input.pendingEvidenceStep === null) {
    if (input.completedMilestones["crime-scene-filter"]) {
      return "Good. You found the key report row. Return to the Query Lab, review ReportID 10975, then use InterviewLog to connect those witness clues to the right people.";
    }

    if (input.studentEvidenceFeedback?.includes("report backlog")) {
      return "You ran the broad report scan. I queued the CrimeID filter because we already proved Murder is 1080; now narrow the archive to murder reports.";
    }

    if (input.studentEvidenceFeedback?.includes("pile is still too large")) {
      return "That filter found murder reports, but there are still too many. I queued the SQL City filter because the briefing says this case happened in Sequel City; combine both facts before looking for the January 15th report.";
    }

    return "Good. CrimeID 1080 is pinned. Return to Query Lab next; I have queued the CrimeSceneReport draft so you can inspect the report archive and find the case row.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "The crime ledger should give you one exact code. Find that code before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "You have the right report table now. Use the murder code and SQL City together, then pin the report row that matches the case date.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "Now the witness trail is live. Start with ReportID 10975, review the two witness clues in that report, then use InterviewLog and PersonID to connect each clue to the right witness.";
  }

  if (input.samuelStage === 1) {
    return "You found the crime code. Widen your lens, scan the report archive, and decide which field deserves your next filter.";
  }

  return "The case only moves when each clue is precise. Let the data tell you what deserves your next query.";
}

function getLeadBoardCards(
  completedMilestones: Record<MilestoneId, boolean>
): LeadBoardCard[] {
  if (completedMilestones["witness-clues"]) {
    return [
      {
        id: "gym-lead",
        title: "Gym Lead",
        detail: "The witness trail is complete. Membership and check-in records are now the strongest active path.",
        status: "active"
      }
    ];
  }

  if (completedMilestones["crime-scene-filter"]) {
    return [
      {
          id: "witness-discovery",
          title: "Witness Discovery",
          detail: "Return to Query Lab, review the restored ReportID 10975 result, then use InterviewLog to connect the Northwestern Dr and Annabel clues to the right witness records. Pin names or addresses only after they appear in your data.",
          status: "ready"
      }
    ];
  }

  return [];
}

function getCaseReviewCheck(
  completedMilestones: Record<MilestoneId, boolean>,
  samuelStage: number
): CaseReviewCheck {
  if (completedMilestones["crime-scene-filter"]) {
    return {
      id: "target-report-chain",
      prompt: "Which evidence chain found the target murder report?",
      choices: [
        {
          id: "report-chain-full",
          label: "CrimeID 1080, SQL City, January 15th, 2023, and ReportID 10975.",
          isCorrect: true
        },
        {
          id: "report-chain-crime-only",
          label: "CrimeID 1080 by itself.",
          isCorrect: false
        },
        {
          id: "report-chain-witness-only",
          label: "The Northwestern Dr witness clue by itself.",
          isCorrect: false
        }
      ],
      success: "Correct. That full chain makes the report row reliable.",
      coaching: "Not yet. The report is reliable because the crime type, city, date, and exact report row all line up."
    };
  }

  if (completedMilestones["crime-type"] || samuelStage > 0) {
    return {
      id: "crime-code-meaning",
      prompt: "What did CrimeID 1080 establish?",
      choices: [
        {
          id: "crime-code-filter",
          label: "It identifies Murder as the crime type to filter reports by.",
          isCorrect: true
        },
        {
          id: "crime-code-suspect",
          label: "It identifies the suspect.",
          isCorrect: false
        },
        {
          id: "crime-code-address",
          label: "It gives the witness address.",
          isCorrect: false
        }
      ],
      success: "Correct. That code is the filter key for the report archive.",
      coaching: "Not quite. CrimeID 1080 tells you which report rows count as murder reports."
    };
  }

  return {
    id: "opening-crime-code",
    prompt: "What are you looking for in the first CrimeType query?",
    choices: [
      {
        id: "opening-murder-code",
        label: "Which CrimeID belongs to Murder.",
        isCorrect: true
      },
      {
        id: "opening-whole-case",
        label: "Which report row solves the whole case.",
        isCorrect: false
      },
      {
        id: "opening-witness-address",
        label: "Which witness lives on Northwestern Dr.",
        isCorrect: false
      }
    ],
    success: "Correct. You need the murder code before the report archive can make sense.",
    coaching: "Not yet. The first query only needs to connect Murder to its CrimeID."
  };
}

function getCurrentAvailableLeads(
  completedMilestones: Record<MilestoneId, boolean>
): CaseMilestone[] {
  if (completedMilestones["witness-clues"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "gym-chain");
  }

  if (completedMilestones["crime-scene-filter"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "witness-clues");
  }

  return [];
}

function getVisibleMilestones(
  completedMilestones: Record<MilestoneId, boolean>
): CaseMilestone[] {
  const visibleIds: MilestoneId[] = [];

  for (const milestone of CASE_004_MILESTONES) {
    if (completedMilestones[milestone.id]) {
      visibleIds.push(milestone.id);
    }
  }

  const nextMilestone = CASE_004_MILESTONES.find(
    (milestone) => !completedMilestones[milestone.id]
  );

  if (nextMilestone) {
    visibleIds.push(nextMilestone.id);
  }

  return CASE_004_MILESTONES.filter((milestone) => visibleIds.includes(milestone.id));
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
