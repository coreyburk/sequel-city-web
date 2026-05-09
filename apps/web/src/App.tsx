import { useEffect, useState } from "react";
import { getSchemaTables } from "./api/client";
import type { QueryExecutionResponse, QueryRow, SchemaResponse, SchemaTable } from "./api/types";
import { HealthStatus } from "./components/HealthStatus";
import { QueryHistoryPanel } from "./components/QueryHistoryPanel";
import { QueryRunner } from "./components/QueryRunner";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { SuspectVerificationPanel } from "./components/SuspectVerificationPanel";
import breakthroughScene from "./assets/student-scenes/breakthrough.png";
import crimeLedgerScene from "./assets/student-scenes/crime-ledger.png";
import misfireScene from "./assets/student-scenes/misfire.png";
import murderBoardScene from "./assets/student-scenes/murder-board.png";
import recordsVaultScene from "./assets/student-scenes/records-vault.png";
import studentInitiativeScene from "./assets/student-scenes/student-initiative.png";
import samuelTupletonAvatar from "./assets/avatars/samuel-tupleton-avatar.png";

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
  description: string;
};

const CASE_004_BRIEF: StoryBrief = {
  caseNumber: "004",
  caseName: "SELECT * FROM Suspects",
  description:
    "January 15th, 2023. A murder in Sequel City. Follow the evidence trail, test your leads, and identify both suspects."
};

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
      (sql.includes("personid") || sql.includes("reportid"))
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
    title: "Filter down to the murder cases",
    guidance:
      "The report table is too large raw. Use the murder Crime ID and shrink the evidence pile until the real trail starts to emerge.",
    observationPrompt:
      "Once the pile is smaller, decide which clue from the reports should drive your next independent query.",
    nextStep: "Add a murder filter to CrimeSceneReport so the case trail becomes manageable.",
    successSignal:
      "The report list is smaller and you know which clue should drive your next query.",
    queryDraft: "SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080"
  }
];

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
  const [studentDraftQuery, setStudentDraftQuery] = useState<string>(
    SAMUEL_TUPLETON_STEPS[0].queryDraft
  );
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

  const selectedTableDetails =
    studentSchema?.data.tables.find((table) => table.fullName === selectedStudentTable) ?? null;
  const completedCount = CASE_004_MILESTONES.filter(
    (milestone) => completedMilestones[milestone.id]
  ).length;
  const revealedMilestones = CASE_004_MILESTONES.slice(
    0,
    Math.min(CASE_004_MILESTONES.length, completedCount + 2)
  );
  const remainingMilestones = revealedMilestones.filter(
    (milestone) => !completedMilestones[milestone.id]
  );
  const activeLeads = remainingMilestones.slice(0, 2);
  const activeSamuelStep =
    SAMUEL_TUPLETON_STEPS[Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length - 1)];
  const samuelCompletedCount = Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length);
  const samuelStatus =
    samuelStage >= SAMUEL_TUPLETON_STEPS.length
      ? {
          title: "Samuel's hand-off",
          detail:
            "You have the opening breadcrumbs. From here, choose the strongest lead from your notes and pursue it your way."
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
                "Now tighten the evidence. Add the murder filter, then decide for yourself which clue trail feels strongest next."
            };
  const currentObjective =
    samuelStage >= SAMUEL_TUPLETON_STEPS.length
      ? "Choose the strongest clue from the filtered reports and pursue it independently."
      : activeSamuelStep.nextStep;
  const studentEvidencePrompt =
    pendingEvidenceStep === "crime-type"
      ? "Possible clue found. Log the row that proves Murder maps to the correct CrimeID."
      : pendingEvidenceStep === "crime-scene-filter"
        ? "Possible clue found. Log one filtered murder report row to prove you isolated the right case records."
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
      setStudentEvidenceFeedback(
        "Clue logged: you isolated a murder report row. Samuel is handing the next lead back to you."
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(reportEntries[reportEntries.length - 1]?.id ?? entryId);
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
      setStudentView("workbench");
      return;
    }

    if (normalizedSql.includes("from crimescenereport") && !normalizedSql.includes("where")) {
      setSamuelStage((current) => Math.max(current, 2));
      setPendingEvidenceStep(null);
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
      setPendingEvidenceStep("crime-scene-filter");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
    }
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
            className="panel panel--full student-case-header"
            aria-labelledby="student-case-header-title"
          >
            <div className="student-case-header__content">
              <div className="student-case-header__summary">
                <p className="student-case-header__kicker">Active Case</p>
                <h2 id="student-case-header-title">
                  Case {CASE_004_BRIEF.caseNumber}: {CASE_004_BRIEF.caseName}
                </h2>
                <p className="student-case-header__progress">
                  Progress: {completedCount} / {CASE_004_MILESTONES.length} milestones complete
                </p>
              </div>
              <section
                className="student-mentor-strip student-mentor-strip--embedded"
                aria-label="Samuel Tupleton Mentor"
              >
                <div
                  className={`samuel-avatar samuel-avatar--${studentEvidenceFeedbackTone}`}
                  aria-hidden="true"
                >
                  <img src={samuelTupletonAvatar} alt="" />
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
          <nav className="student-view-tabs" aria-label="Student Case Views">
            <button
              type="button"
              aria-pressed={studentView === "briefing"}
              onClick={() => setStudentView("briefing")}
            >
              Briefing
            </button>
            <button
              type="button"
              aria-pressed={studentView === "workbench"}
              onClick={() => setStudentView("workbench")}
            >
              Workbench
            </button>
            <button
              type="button"
              aria-pressed={studentView === "case-board"}
              onClick={() => setStudentView("case-board")}
            >
              Case Board
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
                  <h2 id="samuel-briefing-title">Samuel Tupleton&apos;s Briefing</h2>
                </div>
                <p className="samuel-briefing__badge">
                  Breadcrumbs {samuelCompletedCount} / {SAMUEL_TUPLETON_STEPS.length}
                </p>
              </div>
              <div className="samuel-briefing__layout">
                <section className="samuel-briefing__mission" aria-label="Current Mission">
                  <p className="samuel-briefing__label">{activeSamuelStep.label}</p>
                  <h3>{activeSamuelStep.title}</h3>
                  <p>
                    <strong>Samuel Tupleton:</strong> {activeSamuelStep.guidance}
                  </p>
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
                  <div className="student-briefing-actions">
                    <button
                      type="button"
                      className="samuel-briefing__button"
                      onClick={() => setStudentView("workbench")}
                    >
                      Open Workbench
                    </button>
                    <button
                      type="button"
                      className="samuel-briefing__button samuel-briefing__button--secondary"
                      onClick={() => setStudentView("case-board")}
                    >
                      Review Case Board
                    </button>
                  </div>
                </section>
                <ol className="samuel-steps samuel-steps--compact" aria-label="Opening Breadcrumbs">
                  {SAMUEL_TUPLETON_STEPS.map((step, index) => {
                    const isCompleted = samuelStage > index;
                    const isCurrent = samuelStage === index;

                    return (
                      <li
                        key={step.id}
                        className={`samuel-step ${isCompleted ? "samuel-step--done" : ""} ${isCurrent ? "samuel-step--current" : ""}`}
                      >
                        <div className="samuel-step__index" aria-hidden="true">
                          {isCompleted ? "Done" : index + 1}
                        </div>
                        <div>
                          <p className="samuel-step__label">{step.label}</p>
                          <p className="samuel-step__title">{step.title}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
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
                <QueryRunner
                  audience="student"
                  onExecutionComplete={handleQueryExecutionComplete}
                  draftQuery={studentDraftQuery}
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
                    <summary>Full Story Recap</summary>
                    <div className="support-panel__content">
                      <p className="story-recap__text">{CASE_004_BRIEF.description}</p>
                    </div>
                  </details>
                </section>
              </div>
              <aside className="student-workspace__rail" aria-label="Evidence Notebook">
                <section className="panel evidence-rail-card" aria-labelledby="evidence-notebook-title">
                  <div className="section-heading section-heading--compact">
                    <h2 id="evidence-notebook-title">Evidence Notebook</h2>
                    <p className="message-muted">
                      Only the facts you have proven belong here.
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
                  <div className="student-rail-actions">
                    <button type="button" className="student-note-button" onClick={() => setStudentView("case-board")}>
                      Open Case Board
                    </button>
                  </div>
                </section>
              </aside>
            </section>
          ) : null}
          {studentView === "case-board" ? (
            <section className="student-case-board" aria-label="Evidence Notebook and Case File">
              <section className="panel evidence-rail-card" aria-labelledby="evidence-notebook-title">
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
                    {leadBoardCards.map((card) => (
                      <article
                        key={card.id}
                        className={`lead-board__card lead-board__card--${card.status}`}
                      >
                        <p className="lead-board__card-title">{card.title}</p>
                        <p>{card.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <section className="samuel-check-in" aria-labelledby="samuel-check-in-title">
                  <p className="samuel-reaction__title" id="samuel-check-in-title">
                    Samuel Check-In
                  </p>
                  <p>{getComprehensionPrompt(completedMilestones, samuelStage)}</p>
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
                    <strong>Available Leads:</strong> All milestones complete. Validate suspects in the solution table.
                  </p>
                )}
                <ul className="milestone-list">
                  {revealedMilestones.map((milestone) => (
                    <li key={milestone.id}>
                      <span aria-hidden="true">
                        {completedMilestones[milestone.id] ? "[x]" : "[ ]"}
                      </span>
                      <span>{milestone.title}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="student-note-button"
                  onClick={() => setStudentView("workbench")}
                >
                  Return to Workbench
                </button>
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
    return "Good. That clue is solid enough to go on the board. Keep chaining facts, not guesses.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "The crime ledger should give you one exact code. Find that code before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "You have the right report table now. Pin one row from the murder-only pile so the next lead is grounded in evidence.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "Now the witness trail is live. Work the addresses, names, and interview clues until two real people step out of the fog.";
  }

  if (input.samuelStage === 1) {
    return "You found the crime code. Widen your lens, scan the report archive, and decide which field deserves your next filter.";
  }

  return "The case only moves when each clue is precise. Let the data tell you what deserves your next query.";
}

function getComprehensionPrompt(
  completedMilestones: Record<MilestoneId, boolean>,
  samuelStage: number
): string {
  if (completedMilestones["crime-scene-filter"]) {
    return "Before you chase the witnesses, explain the evidence chain: which CrimeID, city, date, and ReportID prove this is the case row?";
  }

  if (completedMilestones["crime-type"]) {
    return "Before you filter reports, explain why CrimeID 1080 matters. What does that number let you do next?";
  }

  if (samuelStage > 0) {
    return "Name the fact you just proved before you move on. Samuel only trusts clues you can explain.";
  }

  return "First check-in: what fact are you trying to prove with the CrimeType query?";
}

function getLeadBoardCards(
  completedMilestones: Record<MilestoneId, boolean>
): LeadBoardCard[] {
  return [
    completedMilestones["crime-scene-filter"]
      ? {
          id: "northwestern-witness",
          title: "Witness 1: Northwestern Dr",
          detail: "Last house on Northwestern Dr. Confirm the resident and cross-check the interview trail.",
          status: "ready"
        }
      : {
          id: "northwestern-witness",
          title: "Witness 1 File",
          detail: "Unlocks after you isolate the murder report records.",
          status: "locked"
        },
    completedMilestones["crime-scene-filter"]
      ? {
          id: "franklin-witness",
          title: "Witness 2: Franklin Ave",
          detail: "Annabel on Franklin Ave. Use the spelling clue and the other identifiers to prove the match.",
          status: "ready"
        }
      : {
          id: "franklin-witness",
          title: "Witness 2 File",
          detail: "Unlocks after you isolate the murder report records.",
          status: "locked"
        },
    completedMilestones["witness-clues"]
      ? {
          id: "gym-lead",
          title: "Gym Lead",
          detail: "The witness trail is complete. Membership and check-in records are now the strongest active path.",
          status: "active"
        }
      : {
          id: "gym-lead",
          title: "Gym Lead",
          detail: "This lead sharpens after you finish working the witnesses.",
          status: "locked"
        }
  ];
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
