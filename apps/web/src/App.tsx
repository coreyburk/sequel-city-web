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

const SAMUEL_CASE_BRIEFING =
  "Samuel Tupleton's case briefing: January 15th, 2023. A murder was reported in Sequel City, but the case file does not start with suspects. Start small. Prove which CrimeID means Murder, inspect the crime scene report fields, then narrow the report pile one filter at a time. Once the murder reports are isolated, add SQL City and review the remaining rows for the January 15th, 2023 case record. The correct report row should point you toward witness information you can verify in the database.";

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
type ComprehensionStatus = "idle" | "correct" | "error";
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
  badge: string;
  caption: string;
  alt: string;
  imageSrc: string;
};

type EvidenceEventDescriptor = {
  tone: "success" | "error";
  label: string;
  title: string;
  detail: string;
  entryDetail?: string;
};

type ComprehensionChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

type ComprehensionCheck = {
  prompt: string;
  choices: ComprehensionChoice[];
  success: string;
  coaching: string;
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
  const [studentLastQueryExecution, setStudentLastQueryExecution] = useState<{
    sql: string;
    response: QueryExecutionResponse | null;
    error: string | null;
  } | null>(null);
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
  const [comprehensionStatus, setComprehensionStatus] = useState<ComprehensionStatus>("idle");
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
  const activeSamuelStep =
    SAMUEL_TUPLETON_STEPS[Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length - 1)];
  const samuelCompletedCount = Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length);
  const samuelStatus =
    samuelStage >= SAMUEL_TUPLETON_STEPS.length
      ? {
          title: "Witness trail unlocked",
          detail:
            "The report row is proven. Use it to inspect the report details and witness records next; the rest of the case can wait until those facts are earned."
        }
      : samuelStage === 0
        ? {
            title: "Samuel's nudge",
            detail:
              "Run the first draft exactly as written. This opening move is about finding the code word the rest of the case depends on."
          }
        : samuelStage === 1
          ? {
              title: "Samuel's read",
              detail:
                "Good. You found the crime catalog. Now broaden your view and inspect the scene reports before you start filtering."
            }
          : {
              title: "Samuel's read",
              detail:
                "Now tighten the evidence. Add the murder filter and city filter together so the right report row moves into view."
            };
  const currentObjective =
    samuelStage >= SAMUEL_TUPLETON_STEPS.length
      ? "Choose the strongest clue from the filtered reports and pursue it independently."
      : activeSamuelStep.nextStep;
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
  const samuelVisualLabel = getSamuelVisualLabel(samuelVisualState);
  const caseStatus = `Case ${CASE_004_BRIEF.caseNumber} · ${CASE_004_BRIEF.caseName} · ${completedCount}/${CASE_004_MILESTONES.length} clues logged`;
  const shouldShowAutonomyBridge =
    completedMilestones["crime-scene-filter"] && !completedMilestones["witness-clues"];
  const studentEvidencePrompt =
    pendingEvidenceStep === "crime-type"
      ? "Possible clue found. Log the row that proves Murder maps to the correct CrimeID."
      : pendingEvidenceStep === "crime-scene-filter"
        ? "Possible clue found. Review the SQL City murder reports and log the row from January 15th, 2023."
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
      ? "Start with the briefing"
      : samuelStatus.title;
  const mentorMessage =
    studentView === "briefing" && !studentEvidenceFeedback
      ? activeSamuelStep.guidance
      : samuelReaction;
  const evidenceEvent = getEvidenceEvent({
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    highlightedNotebookEntryId,
    notebookEntries
  });
  const comprehensionCheck = getComprehensionCheck(completedMilestones, samuelStage);
  const leadBoardCards = getLeadBoardCards(completedMilestones);

  function normalizeSqlForMilestones(sql: string): string {
    return sql.toLowerCase().replace(/\s+/g, " ").trim();
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
        setComprehensionStatus("idle");
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
      setStudentEvidenceFeedback(`Clue logged: CrimeID ${crimeId} maps to Murder.`);
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(entryId);
      setComprehensionStatus("idle");
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
        setComprehensionStatus("idle");
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
      setStudentEvidenceFeedback(
        "Clue logged: you isolated the murder report row. Return to the Query Lab to review the report details, then write the next query from Samuel's investigation brief."
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(reportEntries[reportEntries.length - 1]?.id ?? entryId);
      setStudentDraftQuery(null);
      setComprehensionStatus("idle");
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
          milestone.id === "crime-type" || milestone.id === "crime-scene-filter";

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
      setComprehensionStatus("idle");
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
      setComprehensionStatus("idle");
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
        setComprehensionStatus("idle");
        setStudentView("workbench");
        return;
      }

      setPendingEvidenceStep("crime-scene-filter");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setComprehensionStatus("idle");
      setStudentView("workbench");
    }
  }

  function handleComprehensionChoice(choice: ComprehensionChoice): void {
    setComprehensionStatus(choice.isCorrect ? "correct" : "error");
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
            className={`panel panel--full student-case-header student-case-header--${caseMomentum.toLowerCase().replace(/\s+/g, "-")} ${studentView === "workbench" ? "student-case-header--compact" : ""}`}
            aria-labelledby="student-case-header-title"
            tabIndex={-1}
          >
            <div className="student-case-header__content">
              <div className="student-case-header__summary">
                <p className="student-case-header__kicker">Case Status</p>
                <h2 id="student-case-header-title">{caseStatus}</h2>
                <p className={`case-momentum case-momentum--${caseMomentum.toLowerCase().replace(/\s+/g, "-")}`}>
                  {caseMomentum}
                </p>
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
                  <p className={`samuel-avatar-state samuel-avatar-state--${samuelVisualState}`}>
                    {samuelVisualLabel}
                  </p>
                </div>
                <div className="student-mentor-strip__copy">
                  <p className="samuel-briefing__kicker">Samuel Tupleton</p>
                  <h2>{mentorTitle}</h2>
                  <p>{mentorMessage}</p>
                </div>
                <p className="samuel-briefing__badge">
                  Breadcrumbs {samuelCompletedCount} / {SAMUEL_TUPLETON_STEPS.length}
                </p>
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
                <div className="noir-scene-frame__copy">
                  <p className="noir-scene-frame__badge">{studentScene.badge}</p>
                  <p className="noir-scene-frame__caption">{studentScene.caption}</p>
                </div>
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
              Samuel Briefing
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
                  <h2 id="samuel-briefing-title">Samuel&apos;s Current Lead</h2>
                </div>
                <p className="samuel-briefing__badge">
                  Breadcrumbs {samuelCompletedCount} / {SAMUEL_TUPLETON_STEPS.length}
                </p>
              </div>
              <div className="samuel-briefing__layout samuel-briefing__layout--single">
                <section className="samuel-briefing__mission" aria-label="Current Mission">
                  <div className="samuel-briefing__prompt samuel-briefing__case-file">
                    <p className="samuel-briefing__prompt-title">Known Case Facts</p>
                    <p>{SAMUEL_CASE_BRIEFING}</p>
                  </div>
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
                <section className="panel student-next-action" aria-label="Current Student Action">
                  <p className="samuel-briefing__prompt-title">Do This Next</p>
                  <p>{currentObjective}</p>
                </section>
                {shouldShowAutonomyBridge ? (
                  <section className="panel student-investigation-brief" aria-label="Samuel's Investigation Brief">
                    <p className="samuel-briefing__prompt-title">Samuel&apos;s Investigation Brief</p>
                    <h2>Training wheels off</h2>
                    <p>
                      You&apos;ve learned the pattern. From here, Samuel gives you the evidence
                      question and relationship clues; you write the SQL that proves the next fact.
                    </p>
                    <div className="investigation-brief-grid">
                      <div>
                        <p className="investigation-brief__label">Question To Answer</p>
                        <p>Which interview records are tied to the proven murder report?</p>
                      </div>
                      <div>
                        <p className="investigation-brief__label">Helpful Table</p>
                        <p>
                          Start with <code>InterviewLog</code>. The proven <code>ReportID</code>{" "}
                          connects the report row to interview records.
                        </p>
                      </div>
                      <div>
                        <p className="investigation-brief__label">Next Relationship</p>
                        <p>
                          When an interview gives you <code>PersonID</code>, connect that value to
                          person and address data before logging a witness fact.
                        </p>
                      </div>
                      <div>
                        <p className="investigation-brief__label">Evidence Standard</p>
                        <p>
                          Before logging a clue, be able to name the table, column, value, and what
                          that value proves.
                        </p>
                      </div>
                    </div>
                  </section>
                ) : null}
                {evidenceEvent ? (
                  <section
                    className={`panel evidence-event evidence-event--${evidenceEvent.tone}`}
                    aria-label="Evidence Event"
                  >
                    <p className="evidence-event__eyebrow">{evidenceEvent.label}</p>
                    <h2>{evidenceEvent.title}</h2>
                    <p>{evidenceEvent.detail}</p>
                    {evidenceEvent.entryDetail ? (
                      <p className="evidence-event__pin">Pinned clue: {evidenceEvent.entryDetail}</p>
                    ) : null}
                  </section>
                ) : null}
                <QueryRunner
                  audience="student"
                  onExecutionComplete={handleQueryExecutionComplete}
                  draftQuery={studentDraftQuery}
                  restoredExecution={studentLastQueryExecution}
                  studentEvidencePrompt={studentEvidencePrompt}
                  studentEvidenceFeedback={studentEvidenceFeedback}
                  studentEvidenceFeedbackTone={studentEvidenceFeedbackTone}
                  onStudentLogRow={handleStudentEvidenceLog}
                />
                <section className="student-support" aria-label="Student Support Sections">
                  <details className="panel support-panel">
                    <summary>Need Table Help?</summary>
                    <div className="support-panel__content schema-snapshot">
                      <p className="message-muted">
                        Select a table name to view compact schema details.
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
                    <summary>Samuel&apos;s Case Briefing</summary>
                    <div className="support-panel__content">
                      <p className="story-recap__text">{SAMUEL_CASE_BRIEFING}</p>
                    </div>
                  </details>
                </section>
              </div>
              <aside className="student-workspace__rail" aria-label="Pinned Facts Snapshot">
                <section className="panel evidence-snapshot-card" aria-labelledby="evidence-snapshot-title">
                  <div className="section-heading section-heading--compact">
                    <h2 id="evidence-snapshot-title">Pinned Facts</h2>
                    <p className="message-muted">
                      A quick glance at proven clues while you query. Use Evidence Board for notes and review.
                    </p>
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
                    Log the clue that proves each guided step before Samuel advances.
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
                  <div className="notebook-evidence-contract" aria-label="Witness Evidence Contract">
                    <p className="samuel-briefing__prompt-title">Witness Evidence Contract</p>
                    <p>Before Samuel advances, your notebook needs facts found in your results:</p>
                    <ul>
                      <li>The proven report ID that started the witness trail.</li>
                      <li>An interview row tied to that report.</li>
                      <li>A PersonID from the interview result.</li>
                      <li>A person or address fact from your own follow-up query.</li>
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
                  <h2 id="case-file-title">Detective&apos;s Case Notes</h2>
                  <p className="message-muted">
                    Completed milestones: {completedCount} / {CASE_004_MILESTONES.length}
                  </p>
                </div>
                <div className="lead-board" aria-label="Emerging Leads">
                  <p className="lead-board__title">Emerging Leads</p>
                  <div className="lead-board__cards">
                    {leadBoardCards.length > 0 ? (
                      leadBoardCards.map((card) => (
                        <article
                          key={card.id}
                          className={`lead-board__card lead-board__card--${card.status}`}
                        >
                          <p className="lead-board__card-title">{card.title}</p>
                          <p>{card.detail}</p>
                        </article>
                      ))
                    ) : (
                      <p className="message-muted">
                        No outside leads yet. Prove the current report facts before Samuel opens the next file.
                      </p>
                    )}
                  </div>
                </div>
                <section className="samuel-check-in" aria-labelledby="samuel-check-in-title">
                  <p className="samuel-reaction__title" id="samuel-check-in-title">
                    Samuel Check-In
                  </p>
                  <p>{comprehensionCheck.prompt}</p>
                  <div className="samuel-check-in__choices">
                    {comprehensionCheck.choices.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleComprehensionChoice(choice)}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                  {comprehensionStatus === "correct" ? (
                    <p className="samuel-check-in__result samuel-check-in__result--correct">
                      {comprehensionCheck.success}
                    </p>
                  ) : null}
                  {comprehensionStatus === "error" ? (
                    <p className="samuel-check-in__result samuel-check-in__result--error">
                      {comprehensionCheck.coaching}
                    </p>
                  ) : null}
                </section>
                {activeLeads.length > 0 ? (
                  <div className="case-progress__next">
                    <p><strong>Available Leads:</strong></p>
                    <ul>
                      {activeLeads.map((lead) => (
                        <li key={lead.id}>{lead.cluePrompt}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="case-progress__next">
                    <strong>Available Leads:</strong> Stay with Samuel&apos;s current instruction before opening new leads.
                  </p>
                )}
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

function getSamuelVisualLabel(state: SamuelVisualState): string {
  if (state === "skeptical") {
    return "Skeptical";
  }

  if (state === "confirmed") {
    return "Confirmed";
  }

  if (state === "breakthrough") {
    return "Breakthrough";
  }

  if (state === "lead-unlocked") {
    return "Lead Unlocked";
  }

  return "Mentor";
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

function getEvidenceEvent(input: {
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  highlightedNotebookEntryId: string | null;
  notebookEntries: EvidenceNotebookEntry[];
}): EvidenceEventDescriptor | null {
  if (!input.studentEvidenceFeedback || input.studentEvidenceFeedbackTone === "neutral") {
    return null;
  }

  const entryDetail =
    input.highlightedNotebookEntryId === null
      ? undefined
      : input.notebookEntries.find((entry) => entry.id === input.highlightedNotebookEntryId)?.detail;

  if (input.studentEvidenceFeedbackTone === "error") {
    return {
      tone: "error",
      label: "Detective Misread",
      title: "Do not pin this clue yet",
      detail: input.studentEvidenceFeedback
    };
  }

  return {
    tone: "success",
    label: entryDetail ? "Evidence Pinned" : "Samuel's Filter Note",
    title: entryDetail ? "Clue added to the board" : "Tighten the filter",
    detail: input.studentEvidenceFeedback,
    entryDetail
  };
}

function getComprehensionCheck(
  completedMilestones: Record<MilestoneId, boolean>,
  samuelStage: number
): ComprehensionCheck {
  if (completedMilestones["crime-scene-filter"]) {
    return {
      prompt: "Which evidence chain proves you found the target murder report?",
      choices: [
        {
          id: "case-row",
          label: "CrimeID 1080, SQL City, 2023-01-15, and ReportID 10975 identify the case row.",
          isCorrect: true
        },
        {
          id: "crime-only",
          label: "Any row with CrimeID 1080 is enough to identify the target report.",
          isCorrect: false
        },
        {
          id: "suspect",
          label: "The report row already identifies the suspect.",
          isCorrect: false
        }
      ],
      success: "Correct. Samuel unlocks the witness trail because your report row is grounded in multiple fields.",
      coaching: "Not yet. Samuel wants the full chain: crime type, city, date, and exact report ID."
    };
  }

  if (completedMilestones["crime-type"] || samuelStage > 0) {
    return {
      prompt: "What did CrimeID 1080 prove?",
      choices: [
        {
          id: "murder-filter",
          label: "It identifies Murder as the crime type to filter reports by.",
          isCorrect: true
        },
        {
          id: "suspect-id",
          label: "It identifies the suspect.",
          isCorrect: false
        },
        {
          id: "witness-address",
          label: "It gives the witness address.",
          isCorrect: false
        }
      ],
      success: "Correct. That code is the filter key for the report archive.",
      coaching: "Not quite. CrimeID 1080 is not a person or address. It is the murder filter key."
    };
  }

  return {
    prompt: "What are you trying to prove with the first CrimeType query?",
    choices: [
      {
        id: "find-code",
        label: "Which CrimeID belongs to Murder.",
        isCorrect: true
      },
      {
        id: "find-report",
        label: "Which report row solves the whole case.",
        isCorrect: false
      },
      {
        id: "find-witness",
        label: "Which witness lives on Northwestern Dr.",
        isCorrect: false
      }
    ],
    success: "Correct. Start with the code, then use it to narrow the report archive.",
    coaching: "Samuel is starting smaller: prove the murder CrimeID first."
  };
}

function getStudentSceneVisual(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
}): StudentSceneDescriptor {
  if (input.studentEvidenceFeedbackTone === "error") {
    return {
      visual: "misfire",
      badge: "False Lead",
      caption: "Samuel circles the weak clue in red. Re-check the record before you pin it to the board.",
      alt: "Case board crossed by red lines over the wrong evidence cards",
      imageSrc: misfireScene
    };
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    return {
      visual: "breakthrough",
      badge: "Clue Confirmed",
      caption: "A fresh clue lands on the murder board. The case desk sharpens as the trail becomes real.",
      alt: "Glowing evidence board with a confirmed clue pinned at the center",
      imageSrc: breakthroughScene
    };
  }

  if (input.pendingEvidenceStep === "crime-type" || input.samuelStage === 0) {
    return {
      visual: "crime-ledger",
      badge: "Crime Ledger",
      caption: "Samuel opens the city crime ledger. Find the Murder row before the rest of the file means anything.",
      alt: "Crime ledger dossier under a desk lamp with the murder row marked",
      imageSrc: crimeLedgerScene
    };
  }

  if (input.pendingEvidenceStep === "crime-scene-filter" || input.samuelStage >= 2) {
    return {
      visual: "murder-board",
      badge: "Murder Board",
      caption: "Report scraps, red thread, and pinned notes crowd the desk. Tighten the case until one report row sticks.",
      alt: "Murder board covered in report scraps, red string, and the highlighted crime ID",
      imageSrc: murderBoardScene
    };
  }

  if (input.samuelStage === 1) {
    return {
      visual: "records-vault",
      badge: "Records Vault",
      caption: "Archive drawers slide open across the precinct basement. Scan the report backlog and spot the fields that matter.",
      alt: "Records vault with illuminated archive files and a highlighted crime scene report",
      imageSrc: recordsVaultScene
    };
  }

  return {
    visual: "student-initiative",
    badge: "Open Trail",
    caption: "The first breadcrumbs are set. Pick the strongest lead and work the case like a detective, not a script.",
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
      return "Good. The report row is proven. Return to the Query Lab, review the report row, then write the next query from the investigation brief.";
    }

    return "Good. That clue is solid enough to go on the board. Keep chaining facts, not guesses.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "The crime ledger should give you one exact code. Find that code before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "You have the right report table now. Use the murder code and SQL City together, then pin the report row that matches the case date.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "Now the witness trail is live, but Samuel has not given you the full query or names. Use the proven ReportID, InterviewLog, and PersonID relationships to write the next step yourself.";
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
          detail: "Return to Query Lab, review the restored report result, then use Samuel's investigation brief to write your own InterviewLog query. Pin witness names or addresses only after you find them in the data.",
          status: "ready"
      }
    ];
  }

  return [];
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
