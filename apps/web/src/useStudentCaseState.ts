import { useEffect, useMemo, useRef, useState } from "react";
import { getSchemaTables, verifySuspect } from "./api/client";
import type {
  CaseVerificationSuccessResponse,
  QueryExecutionResponse,
  QueryRow,
  SchemaResponse
} from "./api/types";
import {
  deriveInvestigationStage,
  generateReinforcement
} from "./features/queryReinforcement";
import type { ReinforcementSignal } from "./features/queryReinforcement";
import {
  advanceMemoryAfterQuery,
  commitReactionToMemory,
  createInitialMemory,
  generateSamuelReaction
} from "./features/samuelReactions";
import type {
  SamuelReaction,
  SamuelReactionMemory
} from "./features/samuelReactions";
import {
  CASE_004_BRIEF,
  CASE_004_MILESTONES,
  EXPECTED_MURDER_REPORT,
  SAMUEL_HEADER_INTRO,
  SAMUEL_TUPLETON_STEPS,
  SQL_CITY_REPORT_DRAFT,
  TARGET_REPORT_REVIEW_QUERY,
  WITNESS_NAME_LOOKUP_DRAFT,
  getCaseMomentum,
  getCaseReviewCheck,
  getCurrentAvailableLeads,
  getLeadBoardCards,
  getMastermindHandoffGuidance,
  getSamuelAvatarSrc,
  getSamuelReaction,
  getSamuelVisualState,
  getStudentObjective,
  getStudentSceneVisual,
  getVisibleMilestones
} from "./studentCase";
import type {
  CaseMilestone,
  CaseReviewChoice,
  CaseReviewStatus,
  EvidenceNotebookEntry,
  MilestoneId,
  PendingEvidenceStep,
  StudentEvidenceFeedbackTone,
  StudentView
} from "./studentCase";

type WorkspaceMode = "student" | "developer";

export type QueryRunnerExecutionPayload = {
  sql: string;
  response: QueryExecutionResponse | null;
  error: string | null;
};

export type WitnessChecklistItem = {
  label: string;
  detail: string;
};

type MastermindClueCategory =
  | "paid-hit"
  | "female"
  | "money"
  | "december"
  | "symphony"
  | "stilettos"
  | "jewelry"
  | "red-hair"
  | "bmw"
  | "height";

const MASTERMIND_PROFILE_TARGETS: { category: MastermindClueCategory; label: string }[] = [
  { category: "paid-hit", label: "someone else paid for the hit" },
  { category: "female", label: "the person who hired him is a woman" },
  { category: "money", label: "she has serious money" },
  { category: "december", label: "they met three times last December" },
  { category: "symphony", label: "their meetings were next to Symphony Hall" },
  { category: "stilettos", label: "she wore designer stilettos" },
  { category: "jewelry", label: "she wore expensive jewelry" },
  { category: "red-hair", label: "she is redheaded" },
  { category: "bmw", label: "she drives a BMW M8" },
  { category: "height", label: "she is about 5'5\" to 5'8\"" }
];

function formatPossessiveName(name: string | null | undefined): string {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    return "the confirmed suspect's";
  }

  return trimmedName.endsWith("s") ? `${trimmedName}'` : `${trimmedName}'s`;
}

export function useStudentCaseState(mode: WorkspaceMode) {
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
  const [studentPreservedTranscriptExecution, setStudentPreservedTranscriptExecution] =
    useState<QueryRunnerExecutionPayload | null>(null);
  const [studentQueryRunnerResetKey, setStudentQueryRunnerResetKey] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState<Record<MilestoneId, boolean>>({
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "suspect-interview": false,
    "trigger-check": false,
    "mastermind-profile": false,
    "mastermind-trace": false
  });
  const [samuelStage, setSamuelStage] = useState(0);
  const [notebookEntries, setNotebookEntries] = useState<EvidenceNotebookEntry[]>([]);
  const [pendingEvidenceStep, setPendingEvidenceStep] = useState<PendingEvidenceStep>(null);
  const [studentEvidenceFeedback, setStudentEvidenceFeedback] = useState<string | null>(null);
  const [studentEvidenceFeedbackTone, setStudentEvidenceFeedbackTone] =
    useState<StudentEvidenceFeedbackTone>("neutral");
  const [studentSceneFeedbackTone, setStudentSceneFeedbackTone] =
    useState<StudentEvidenceFeedbackTone>("neutral");
  const [highlightedNotebookEntryId, setHighlightedNotebookEntryId] = useState<string | null>(null);
  const [manualNotebookDraft, setManualNotebookDraft] = useState("");
  const [caseReviewStatus, setCaseReviewStatus] = useState<CaseReviewStatus>("idle");
  const [caseReviewStatusId, setCaseReviewStatusId] = useState<string | null>(null);
  const [earnedCaseReviewIds, setEarnedCaseReviewIds] = useState<string[]>([]);
  const [studentSamuelReaction, setStudentSamuelReaction] =
    useState<SamuelReaction | null>(null);
  const [studentSuspectTheoryDraft, setStudentSuspectTheoryDraft] = useState("");
  const [studentSuspectTheoryResult, setStudentSuspectTheoryResult] =
    useState<CaseVerificationSuccessResponse | null>(null);
  const [studentSuspectTheoryError, setStudentSuspectTheoryError] = useState<string | null>(null);
  const [studentSuspectTheoryLoading, setStudentSuspectTheoryLoading] = useState(false);
  const studentCaseHeaderRef = useRef<HTMLElement>(null);
  const samuelReactionMemoryRef = useRef<SamuelReactionMemory>(createInitialMemory());
  const samuelReactionSnapshotRef = useRef<{
    executionId: number;
    milestoneCount: number;
    notebookCount: number;
    broadRun: number;
  }>({
    executionId: 0,
    milestoneCount: 0,
    notebookCount: 0,
    broadRun: 0
  });
  const executionCounterRef = useRef(0);
  const previousExecutionRef = useRef<QueryRunnerExecutionPayload | null>(null);

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
    if (mode !== "student" || !studentEvidenceFeedback) {
      return;
    }

    if (typeof studentCaseHeaderRef.current?.scrollIntoView !== "function") {
      return;
    }

    // Wrong-clue feedback now renders inline next to the Log Clue action
    // (StudentEvidenceFeedback panel in QueryRunner). Only scroll to the
    // mentor header for success events that hand the student off to a new
    // view, where the inline panel is not visible.
    const shouldRevealSamuelFeedback =
      studentEvidenceFeedbackTone === "success" && studentView === "case-board";

    if (!shouldRevealSamuelFeedback) {
      return;
    }

    studentCaseHeaderRef.current.focus({ preventScroll: true });
    studentCaseHeaderRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [mode, studentEvidenceFeedback, studentEvidenceFeedbackTone, studentView]);

  useEffect(() => {
    if (!studentEvidenceFeedback || studentEvidenceFeedbackTone === "neutral") {
      return;
    }

    setStudentSceneFeedbackTone(studentEvidenceFeedbackTone);
  }, [studentEvidenceFeedback, studentEvidenceFeedbackTone]);

  const selectedTableDetails =
    studentSchema?.data.tables.find((table) => table.fullName === selectedStudentTable) ?? null;
  const completedCount = CASE_004_MILESTONES.filter(
    (milestone) => completedMilestones[milestone.id]
  ).length;
  const visibleMilestones = getVisibleMilestones(completedMilestones);
  const activeLeads = getCurrentAvailableLeads(completedMilestones, pendingEvidenceStep);
  const shouldShowCrimeReportHandoff =
    completedMilestones["crime-type"] && !completedMilestones["crime-scene-filter"];
  const activeSamuelStep =
    SAMUEL_TUPLETON_STEPS[Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length - 1)];
  const samuelCompletedCount = Math.min(samuelStage, SAMUEL_TUPLETON_STEPS.length);
  const samuelStatus =
    completedMilestones["mastermind-trace"]
      ? {
          title: "Case Closed",
          detail:
            "The contract chain is complete. The final suspect is pinned, and the full story of the crime now holds together."
        }
      : completedMilestones["trigger-check"]
        ? {
            title: "Mastermind chapter opened",
            detail:
              "The hired killer is confirmed. The next chapter is no longer about proving the shooter - it is about tracing the hidden client behind the hit."
          }
    : samuelStage >= SAMUEL_TUPLETON_STEPS.length
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
  const shouldShowWitnessIdentityGuide = pendingEvidenceStep === "witness-names";
  const shouldShowGymLeadGuide = pendingEvidenceStep === "gym-lead";
  const shouldShowSuspectCandidateGuide = pendingEvidenceStep === "suspect-candidate";
  const shouldShowSuspectInterviewGuide = pendingEvidenceStep === "suspect-interview";
  const shouldShowTriggerCheckGuide =
    completedMilestones["suspect-interview"] &&
    !completedMilestones["trigger-check"] &&
    pendingEvidenceStep === null;
  const shouldShowMastermindHandoffGuide =
    completedMilestones["trigger-check"] &&
    !completedMilestones["mastermind-trace"] &&
    pendingEvidenceStep === null;
  const gymLeadPersonId =
    notebookEntries
      .map((entry) => {
        const match = entry.detail.match(/^Gym Lead PersonID\s*=\s*(.+)$/i);
        return match ? match[1].trim() : null;
      })
      .find((personId): personId is string => Boolean(personId)) ?? null;
  const gymLeadName =
    notebookEntries
      .map((entry) => {
        const match = entry.detail.match(/^Gym Lead Name\s+.+?\s*=\s*(.+)$/i);
        return match ? match[1].trim() : null;
      })
      .find((personName): personName is string => Boolean(personName)) ?? null;
  const pinnedReportId =
    notebookEntries
      .map((entry) => {
        const match = entry.detail.match(/^ReportID\s*=\s*(.+)$/i);
        return match ? match[1].trim() : null;
      })
      .find((reportId): reportId is string => Boolean(reportId)) ??
    EXPECTED_MURDER_REPORT.reportId;
  const confirmedTriggerSuspectName =
    gymLeadName ??
    (studentSuspectTheoryResult?.data.solvedRole === "trigger_man"
      ? studentSuspectTheoryResult.data.suspect
      : null);
  const confirmedTriggerPossessiveLabel = formatPossessiveName(
    confirmedTriggerSuspectName
  );
  const confirmedTriggerSuspectPersonId =
    gymLeadPersonId ??
    (studentSuspectTheoryResult?.data.solvedRole === "trigger_man" &&
    studentSuspectTheoryResult.data.suspectPersonId !== null
      ? String(studentSuspectTheoryResult.data.suspectPersonId)
      : null);
  const normalizedLastStudentSql = studentLastQueryExecution
    ? normalizeSqlForMilestones(studentLastQueryExecution.sql)
    : "";
  const normalizedDraftStudentSql = studentDraftQuery
    ? normalizeSqlForMilestones(studentDraftQuery)
    : "";
  const preferredTranscriptExecution =
    getPreservedTranscriptExecutionForCurrentChapter({
      execution:
        studentLastQueryExecution ?? studentPreservedTranscriptExecution,
      gymLeadPersonId,
      confirmedTriggerSuspectPersonId,
      shouldShowSuspectInterviewGuide,
      shouldShowTriggerCheckGuide,
      shouldShowMastermindHandoffGuide
    }) ?? null;
  const isWitnessInterviewScanActive =
    shouldShowWitnessTrailGuide &&
    normalizedLastStudentSql.includes("from interviewlog");
  const isBroadWitnessNameLookupActive =
    pendingEvidenceStep === "witness-names" &&
    normalizedLastStudentSql.includes("from personsofinterest") &&
    !normalizedLastStudentSql.includes("where");
  const isBroadGymLeadLookupActive =
    pendingEvidenceStep === "gym-lead" &&
    normalizedLastStudentSql.includes("from fitnflabclub") &&
    !normalizedLastStudentSql.includes("where");
  const isNarrowedGymLeadMatchActive =
    pendingEvidenceStep === "gym-lead" &&
    normalizedLastStudentSql.includes("from fitnflabclub") &&
    normalizedLastStudentSql.includes("where") &&
    studentLastQueryExecution?.response?.success === true &&
    studentLastQueryExecution.response.data.rowCount === 1;
  const isSuspectInterviewLookupActive =
    pendingEvidenceStep === "suspect-interview" &&
    studentLastQueryExecution?.response?.success === true &&
    normalizedLastStudentSql.includes("from interviewlog");
  const hasSuspectInterviewPersonIdFilter =
    isSuspectInterviewLookupActive &&
    gymLeadPersonId !== null &&
    normalizedLastStudentSql.includes("personid") &&
    normalizedLastStudentSql.includes(normalizeComparableValue(gymLeadPersonId));
  const suspectInterviewRows =
    isSuspectInterviewLookupActive && studentLastQueryExecution?.response?.success
      ? studentLastQueryExecution.response.data.rows
      : [];
  const suspectInterviewRowsIncludeCaseSupport =
    suspectInterviewRows.length > 0 &&
    suspectInterviewRows.some((row) => {
      const transcript =
        getRowValue(row, "LogTranscript") ??
        getRowValue(row, "logtranscript") ??
        getRowValue(row, "Transcript") ??
        getRowValue(row, "transcript");
      return transcript !== null && isConfessionHeavyTranscript(transcript);
    });
  const isBroadMastermindTranscriptLookupActive =
    shouldShowMastermindHandoffGuide &&
    normalizedLastStudentSql.includes("from interviewlog") &&
    !normalizedLastStudentSql.includes("where");
  const isMastermindTranscriptLookupActive =
    shouldShowMastermindHandoffGuide &&
    studentLastQueryExecution?.response?.success === true &&
    normalizedLastStudentSql.includes("from interviewlog");
  const hasMastermindPersonIdFilter =
    isMastermindTranscriptLookupActive &&
    confirmedTriggerSuspectPersonId !== null &&
    normalizedLastStudentSql.includes("personid") &&
    normalizedLastStudentSql.includes(
      normalizeComparableValue(confirmedTriggerSuspectPersonId)
    );
  const hasMastermindReportIdFilter =
    isMastermindTranscriptLookupActive &&
    normalizedLastStudentSql.includes("reportid") &&
    normalizedLastStudentSql.includes(normalizeComparableValue(pinnedReportId));
  const mastermindRows =
    isMastermindTranscriptLookupActive && studentLastQueryExecution?.response?.success
      ? studentLastQueryExecution.response.data.rows
      : [];
  const mastermindRowsAreReportLinked =
    mastermindRows.length > 0 &&
    mastermindRows.every((row) => {
      const reportId =
        getRowValue(row, "ReportID") ??
        getRowValue(row, "reportid") ??
        getRowValue(row, "ReportId") ??
        getRowValue(row, "reportId");
      return normalizeComparableValue(reportId) === normalizeComparableValue(pinnedReportId);
    });
  const mastermindRowsIncludeLead =
    mastermindRows.length > 0 &&
    mastermindRows.some((row) => {
      const transcript =
        getRowValue(row, "LogTranscript") ??
        getRowValue(row, "logtranscript") ??
        getRowValue(row, "Transcript") ??
        getRowValue(row, "transcript");
      return transcript !== null && isMastermindLeadTranscript(transcript);
    });
  const mastermindTrailReadyForClueLog =
    isMastermindTranscriptLookupActive &&
    hasMastermindPersonIdFilter &&
    (hasMastermindReportIdFilter || mastermindRowsAreReportLinked) &&
    mastermindRowsIncludeLead;
  const mastermindClueEntries = notebookEntries.filter((entry) =>
    entry.id.startsWith("mastermind-clue-")
  );
  const mastermindClueCount = mastermindClueEntries.length;
  const loggedMastermindClueTags = Array.from(
    new Set(mastermindClueEntries.flatMap((entry) => entry.clueTags ?? []))
  );
  const collectedMastermindProfileCount = MASTERMIND_PROFILE_TARGETS.filter((target) =>
    loggedMastermindClueTags.includes(target.category)
  ).length;
  const totalMastermindProfileCount = MASTERMIND_PROFILE_TARGETS.length;
  const mastermindProfileComplete =
    collectedMastermindProfileCount === totalMastermindProfileCount;
  const isMastermindDriversLicenseLookupActive =
    shouldShowMastermindHandoffGuide &&
    mastermindProfileComplete &&
    studentLastQueryExecution?.response?.success === true &&
    normalizedLastStudentSql.includes("from driverslicense");
  const hasMastermindVehicleFilters =
    isMastermindDriversLicenseLookupActive &&
    normalizedLastStudentSql.includes("carmake") &&
    normalizedLastStudentSql.includes("bmw") &&
    normalizedLastStudentSql.includes("carmodel") &&
    normalizedLastStudentSql.includes("m8");
  const hasMastermindGenderFilter =
    isMastermindDriversLicenseLookupActive &&
    normalizedLastStudentSql.includes("gender") &&
    normalizedLastStudentSql.includes("female");
  const hasMastermindHairFilter =
    isMastermindDriversLicenseLookupActive &&
    normalizedLastStudentSql.includes("haircolor") &&
    normalizedLastStudentSql.includes("red");
  const hasMastermindHeightFilter =
    isMastermindDriversLicenseLookupActive &&
    normalizedLastStudentSql.includes("height") &&
    ((normalizedLastStudentSql.includes("between") &&
      normalizedLastStudentSql.includes("65") &&
      normalizedLastStudentSql.includes("67")) ||
      (normalizedLastStudentSql.includes(">=") &&
        normalizedLastStudentSql.includes("65") &&
        normalizedLastStudentSql.includes("<=") &&
        normalizedLastStudentSql.includes("67")));
  const mastermindDriversLicenseRows =
    isMastermindDriversLicenseLookupActive && studentLastQueryExecution?.response?.success
      ? studentLastQueryExecution.response.data.rows
      : [];
  const mastermindCandidateCount = mastermindDriversLicenseRows.length;
  const loggedMastermindCandidateEntries = notebookEntries.filter((entry) =>
    entry.id.startsWith("mastermind-candidate-")
  );
  const loggedMastermindCandidateCount = loggedMastermindCandidateEntries.length;
  const shouldPivotToSymphonyHallTrail =
    mastermindProfileComplete && loggedMastermindCandidateCount >= 2;
  const shouldSuppressMastermindDriversLicenseCarryover =
    shouldPivotToSymphonyHallTrail &&
    ((studentDraftQuery !== null && normalizedDraftStudentSql.includes("from driverslicense")) ||
      (studentLastQueryExecution !== null &&
        normalizedLastStudentSql.includes("from driverslicense")));
  const visibleStudentDraftQuery = shouldSuppressMastermindDriversLicenseCarryover
    ? null
    : studentDraftQuery;
  const defaultRestoredExecution =
    !shouldPivotToSymphonyHallTrail &&
    !shouldSuppressMastermindDriversLicenseCarryover &&
    studentLastQueryExecution &&
    (studentDraftQuery === null || normalizedDraftStudentSql === normalizedLastStudentSql)
      ? studentLastQueryExecution
      : null;
  const studentRestoredExecution =
    shouldPivotToSymphonyHallTrail || shouldSuppressMastermindDriversLicenseCarryover
      ? null
      : defaultRestoredExecution ??
      (preferredTranscriptExecution &&
      (studentDraftQuery === null ||
        normalizeSqlForMilestones(preferredTranscriptExecution.sql) ===
          normalizedDraftStudentSql)
        ? preferredTranscriptExecution
      : null);
  const hasWitnessVehicleClue = notebookEntries.some((entry) =>
    normalizeComparableValue(entry.detail).includes("red bmw")
  );
  const shouldCrossCheckWitnessVehicle =
    hasWitnessVehicleClue &&
    (loggedMastermindClueTags.includes("bmw") ||
      loggedMastermindClueTags.includes("symphony") ||
      loggedMastermindClueTags.includes("red-hair") ||
      loggedMastermindClueTags.includes("stilettos") ||
      loggedMastermindClueTags.includes("jewelry"));
  const loggedWitnessPersonIds = getLoggedWitnessPersonIds(notebookEntries);
  const loggedWitnessNameIds = notebookEntries
    .filter((entry) => entry.id.startsWith("witness-name-"))
    .map((entry) => entry.id.replace("witness-name-", ""));
  const hasPinnedWitnessNames = loggedWitnessNameIds.length >= 2;
  const witnessBundleCount = loggedWitnessPersonIds.length;
  const hasPinnedWitnessReportId = notebookEntries.some(
    (entry) => normalizeComparableValue(entry.detail) === `reportid = ${EXPECTED_MURDER_REPORT.reportId}`
  );
  const witnessChecklistItems: WitnessChecklistItem[] = [];
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
  // WP-111: Query Runner helper text is short and functional. The full
  // next-step instruction lives in Samuel's Guidance (header). This text only
  // names the immediate action so the editor area stays focused on doing.
  const studentQueryRunnerInstruction = isWitnessInterviewScanActive
      ? witnessBundleCount === 0
      ? "Log one strong row from the first repeated PersonID bundle."
      : "Log one strong row from the second repeated PersonID bundle."
    : shouldShowMastermindHandoffGuide
      ? isMastermindDriversLicenseLookupActive
        ? !hasMastermindVehicleFilters
          ? "Good. You left InterviewLog. Start narrowing DriversLicense with the BMW M8 vehicle clue before you add the woman's appearance details."
          : !hasMastermindGenderFilter || !hasMastermindHairFilter
              ? "Good. The vehicle clue is in place. Now add the transcript clues that the mastermind is a woman with red hair."
            : !hasMastermindHeightFilter
              ? "Good. You have the vehicle and redheaded-female filters. Add the transcript height clue and narrow the shortlist again."
              : shouldPivotToSymphonyHallTrail
                ? "BMW shortlist pinned. Use the candidate LicenseIDs from your notebook to identify both women, then compare their December Symphony Hall activity in EventRegistration and EventSchedule."
              : mastermindCandidateCount > 1
                ? `Candidate shortlist ready: ${mastermindCandidateCount} matching DriversLicense row${mastermindCandidateCount === 1 ? "" : "s"}. Compare those candidates against the witness red BMW note and your money, jewelry, and Symphony Hall clues before you decide who deserves the next check.`
                : "You have one remaining candidate in DriversLicense. Compare that record against your notebook, then move to the next identity check with intention."
        : isBroadMastermindTranscriptLookupActive
        ? `Good start. Now narrow InterviewLog with ${confirmedTriggerPossessiveLabel} pinned PersonID and ReportID ${pinnedReportId}, then read for the row that reveals who hired the killer.`
        : mastermindTrailReadyForClueLog
          ? mastermindClueCount === 0
            ? "You have the right transcript set. Read the rows and use Log Clue on the one where the killer reveals who hired him."
            : shouldPivotToSymphonyHallTrail
              ? "Shortlist pinned. Identify both candidates in PersonsOfInterest, then compare their December Symphony Hall trail before you choose the final suspect."
            : mastermindProfileComplete
              ? `Mastermind profile complete: ${collectedMastermindProfileCount}/${totalMastermindProfileCount} clue threads pinned. Leave InterviewLog and narrow DriversLicense to female redheaded BMW M8 owners between 65 and 67 inches tall, then compare the matches against your money, jewelry, stiletto, and Symphony Hall notes.`
            : shouldCrossCheckWitnessVehicle
              ? `Mastermind profile progress: ${collectedMastermindProfileCount}/${totalMastermindProfileCount}. Open Evidence Notebook Page 2, compare those notes against the witness clues on Page 1, and see whether the BMW and Symphony Hall details could point to the same woman. ${getOutstandingMastermindCluePrompt(loggedMastermindClueTags)}`
              : `Mastermind profile progress: ${collectedMastermindProfileCount}/${totalMastermindProfileCount}. Keep reading this narrowed transcript set and pin any row that adds a fresh detail about the person who hired him, their meetings, or their profile. ${getOutstandingMastermindCluePrompt(loggedMastermindClueTags)}`
          : isMastermindTranscriptLookupActive && hasMastermindPersonIdFilter
            ? `Good. You isolated ${confirmedTriggerPossessiveLabel} transcript trail. If the report is still not pinned in the query, add ReportID ${pinnedReportId}; otherwise stay here, compare the rows, and decide which clue deserves to move onto your mastermind page.`
            : `Breakthrough confirmed. Stay with InterviewLog and use ${confirmedTriggerPossessiveLabel} pinned PersonID plus ReportID ${pinnedReportId} to isolate the murder-report transcript before you widen the mastermind search.`
    : shouldShowTriggerCheckGuide
      ? "You reviewed the suspect's interview. Switch to Evidence Board and decide whether the case is strong enough to test your first theory."
    : shouldShowSuspectInterviewGuide
      ? hasSuspectInterviewPersonIdFilter && suspectInterviewRowsIncludeCaseSupport
        ? "You have the right interview rows in view. Read them and use Log Clue on the one row that best shows what the suspect's own words add to the case."
        : `Stay with InterviewLog and use ${gymLeadPersonId ? `PersonID ${gymLeadPersonId}` : "the pinned gym lead PersonID"} to review what the gym-linked suspect said. Read his own words before you decide what they prove.`
    : shouldShowSuspectCandidateGuide
      ? "Use PersonsOfInterest and the pinned gym lead PersonID from Case File > Pinned Facts to identify the gym-linked person before you test any theory."
    : isNarrowedGymLeadMatchActive
      ? "You narrowed the gym lead to one row. Use Log Clue to pin that membership before you move on."
    : isBroadGymLeadLookupActive
      ? "Now narrow FitNFlabClub using the 48Z membership clue and gold-status clue before you log anything new."
    : isBroadWitnessNameLookupActive
      ? "That table is still too broad. Narrow PersonsOfInterest with both pinned witness PersonIDs, then log the two matching names."
    : pendingEvidenceStep === "gym-lead"
      ? "Build your next query with FitNFlabClub, then use the 48Z clue and gold-status clue to narrow the membership records."
    : pendingEvidenceStep === "witness-names"
      ? "Run the broad PersonsOfInterest lookup first, then open Case File > Pinned Facts and narrow it with both witness PersonIDs before you log any names."
    : completedMilestones["witness-clues"]
      ? "Use PersonsOfInterest and the pinned witness PersonIDs from Case File to identify the two witness names first."
    : shouldShowWitnessTrailGuide
      ? "Write your InterviewLog query in the editor using the pinned ReportID, then sort by PersonID."
      : null;
  const studentQueryFailureGuidance = shouldShowWitnessTrailGuide
    ? "If this query fails, simplify it. Stay with InterviewLog, keep the pinned report ID in your filter, and sort by PersonID. Do not GROUP BY or JOIN yet."
    : shouldShowMastermindHandoffGuide
      ? isMastermindDriversLicenseLookupActive
        ? !hasMastermindVehicleFilters
          ? "Stay with DriversLicense and start with the BMW M8 clue before layering on the woman's appearance details."
          : !hasMastermindGenderFilter || !hasMastermindHairFilter
            ? "The vehicle filter is working. Now add the transcript clues that the mastermind is female and redheaded."
            : !hasMastermindHeightFilter
              ? "You still need the height clue. Narrow DriversLicense to people between 65 and 67 inches tall."
            : shouldPivotToSymphonyHallTrail
                ? "The BMW shortlist is ready. Use the candidate LicenseIDs to identify both women, then compare their December Symphony Hall activity in EventRegistration and EventSchedule."
              : "You have the right shortlist. Compare those remaining rows against your notebook and decide who still fits the witness BMW, money, jewelry, and Symphony Hall clues."
        : mastermindProfileComplete
        ? `You have enough transcript clues to widen the search. Use DriversLicense next and narrow it with female, red hair, BMW M8, and height between 65 and 67 inches.`
        : mastermindClueCount > 0
        ? `Keep the logged mastermind clues in view. Re-run ${confirmedTriggerPossessiveLabel} murder-report transcript if needed, then keep collecting details about the woman who hired him.`
        : `Open Case File > Pinned Facts and use ${confirmedTriggerPossessiveLabel} PersonID plus ReportID ${pinnedReportId}. Once the transcript set is right, compare the rows and look for the one where the killer admits someone else ordered the hit.`
    : shouldShowTriggerCheckGuide
      ? "If you still feel uncertain, return to InterviewLog and re-read the suspect's own words before you decide whether to test the theory from Evidence Board."
    : shouldShowSuspectInterviewGuide
      ? hasSuspectInterviewPersonIdFilter
        ? "Stay with the filtered interview rows and pin the one that most clearly shows what the suspect's own words add to the case."
        : `Open Case File > Pinned Facts and use ${gymLeadPersonId ? `PersonID ${gymLeadPersonId}` : "the pinned gym lead PersonID"} in InterviewLog. Read what the suspect said before you decide what his transcript actually proves.`
    : shouldShowSuspectCandidateGuide
      ? "Open Case File > Pinned Facts and use the pinned gym lead PersonID as your next filter. Stay with PersonsOfInterest until the name is pinned."
    : isBroadGymLeadLookupActive
      ? "Use the gym clues you already earned. Stay with FitNFlabClub, then add your own 48Z and gold filters before you jump to other tables."
    : pendingEvidenceStep === "gym-lead"
      ? "If this query stalls, keep it simple. Stay with FitNFlabClub and use the 48Z clue plus gold-status clue as your next filters."
    : isBroadWitnessNameLookupActive
      ? "Open Case File > Pinned Facts and use the two witness PersonIDs as your next filter. Stay with PersonsOfInterest and avoid JOINs until both witness names are pinned."
    : pendingEvidenceStep === "witness-names"
      ? "If this query stalls, keep it simple. Stay with PersonsOfInterest, filter by the pinned PersonIDs, and skip JOINs for now."
    : null;
  const studentEvidencePrompt =
    pendingEvidenceStep === "crime-type"
      ? "Possible clue found. Log the row that proves Murder maps to the correct CrimeID."
      : pendingEvidenceStep === "crime-scene-filter"
        ? "Possible clue found. Review the SQL City murder reports and log the row from January 15th, 2023."
        : shouldShowMastermindHandoffGuide && mastermindTrailReadyForClueLog
          ? mastermindClueCount === 0
            ? "Step 7 target: use Log Clue on the transcript row where the killer reveals who hired him."
            : mastermindProfileComplete
              ? "Step 8 target: switch to DriversLicense and use the completed mastermind profile to narrow the remaining suspects."
            : "Step 7 target: keep logging any transcript row that adds a new mastermind clue about the woman, the meetings, the money, the car, or her appearance."
        : shouldShowMastermindHandoffGuide && isMastermindDriversLicenseLookupActive
          ? hasMastermindVehicleFilters && hasMastermindGenderFilter && hasMastermindHairFilter && hasMastermindHeightFilter
            ? shouldPivotToSymphonyHallTrail
              ? "Step 8 target: use the candidate LicenseIDs to identify both women, then compare their December Symphony Hall trail before you make the final mastermind call."
              : "Step 8 target: compare the remaining DriversLicense candidates against your notebook and decide who still fits the mastermind profile."
            : "Step 8 target: keep narrowing DriversLicense with the full mastermind profile before you compare candidates."
        : isWitnessInterviewScanActive
        ? witnessBundleCount === 0
            ? "Step 2 target: use Log Clue on one strong row from the first repeated PersonID witness bundle."
            : "Step 3 target: use Log Clue on one strong row from the second repeated PersonID witness bundle."
        : pendingEvidenceStep === "witness-names"
          ? "Step 4 target: use Log Clue on both witness-name rows from PersonsOfInterest."
        : pendingEvidenceStep === "suspect-candidate"
          ? "Step 6 target: use Log Clue on the PersonsOfInterest row that matches the pinned gym lead PersonID."
        : pendingEvidenceStep === "suspect-interview"
          ? hasSuspectInterviewPersonIdFilter && suspectInterviewRowsIncludeCaseSupport
            ? "Step 7 target: use Log Clue on the interview row that most clearly shows what the suspect's own words add to the case."
            : "Step 7 target: review the gym-linked suspect's interview log and narrow it with the pinned PersonID before you pin any clue."
        : isNarrowedGymLeadMatchActive
          ? "Step 5 target: use Log Clue on the single FitNFlabClub row that matches both gym clues."
        : null;

  useEffect(() => {
    if (shouldShowTriggerCheckGuide && gymLeadName && !studentSuspectTheoryDraft) {
      setStudentSuspectTheoryDraft(gymLeadName);
    }
  }, [gymLeadName, shouldShowTriggerCheckGuide, studentSuspectTheoryDraft]);

  useEffect(() => {
    if (!shouldShowTriggerCheckGuide && !shouldShowMastermindHandoffGuide) {
      setStudentSuspectTheoryResult(null);
      setStudentSuspectTheoryError(null);
      setStudentSuspectTheoryLoading(false);
    }
  }, [shouldShowMastermindHandoffGuide, shouldShowTriggerCheckGuide]);

  const studentQueryReinforcement = useMemo<ReinforcementSignal | null>(() => {
    if (mode !== "student" || !studentLastQueryExecution) {
      return null;
    }

    const response = studentLastQueryExecution.response;
    if (!response || !response.success) {
      return null;
    }

    const responseData = response.data;
    if (!responseData) {
      return null;
    }

    return generateReinforcement({
      sql: studentLastQueryExecution.sql,
      rowCount: responseData.rowCount,
      isSuccess: true,
      stage: deriveInvestigationStage(completedMilestones),
      completedMilestones,
      notebookEntries
    });
  }, [mode, studentLastQueryExecution, completedMilestones, notebookEntries]);

  // Deterministic Samuel reaction derivation. Reactions fire on query
  // execution events and look at deterministic deltas (fresh milestone,
  // fresh clue log, run of broad results) plus the current reinforcement
  // signal. Reactions never reference suspect identity, never name hidden
  // rows, and never propose the next SQL — see features/samuelReactions.
  useEffect(() => {
    if (mode !== "student") {
      return;
    }

    if (!studentLastQueryExecution) {
      return;
    }

    if (previousExecutionRef.current === studentLastQueryExecution) {
      return;
    }

    previousExecutionRef.current = studentLastQueryExecution;
    executionCounterRef.current += 1;
    const executionId = executionCounterRef.current;
    const snapshot = samuelReactionSnapshotRef.current;
    const milestoneCount = Object.values(completedMilestones).filter(Boolean).length;
    const notebookCount = notebookEntries.length;
    const hasFreshMilestone = milestoneCount > snapshot.milestoneCount;
    const hasFreshClueLog = notebookCount > snapshot.notebookCount;
    const freshMilestoneId = hasFreshMilestone
      ? (Object.entries(completedMilestones).find(
          ([, reached]) => reached
        )?.[0] as MilestoneId | undefined) ?? null
      : null;

    const isBroad =
      studentQueryReinforcement?.category === "overly-broad" ||
      studentQueryReinforcement?.category === "incomplete-chain";
    const nextBroadRun = isBroad ? snapshot.broadRun + 1 : 0;

    const advancedMemory = advanceMemoryAfterQuery(samuelReactionMemoryRef.current);
    const reaction = generateSamuelReaction(
      {
        stage: deriveInvestigationStage(completedMilestones),
        reinforcement: studentQueryReinforcement,
        completedMilestones,
        notebookEntryCount: notebookCount,
        consecutiveBroadCount: nextBroadRun,
        hasFreshMilestone,
        freshMilestoneId,
        hasFreshClueLog
      },
      advancedMemory
    );

    samuelReactionMemoryRef.current = reaction
      ? commitReactionToMemory(advancedMemory, reaction)
      : advancedMemory;
    samuelReactionSnapshotRef.current = {
      executionId,
      milestoneCount,
      notebookCount,
      broadRun: nextBroadRun
    };
    setStudentSamuelReaction(reaction);
  }, [
    mode,
    studentLastQueryExecution,
    studentQueryReinforcement,
    completedMilestones,
    notebookEntries
  ]);

  const studentScene = getStudentSceneVisual({
    samuelStage,
    pendingEvidenceStep,
    studentEvidenceFeedbackTone: studentSceneFeedbackTone,
    studentView,
    completedMilestones,
    hasMastermindClues: mastermindClueCount > 0,
    shouldShowTriggerReveal:
      studentView === "case-board" &&
      studentSuspectTheoryResult?.data.isCorrect === true &&
      studentSuspectTheoryResult.data.solvedRole === "trigger_man"
  });
  const samuelReaction = getSamuelReaction({
    samuelStage,
    pendingEvidenceStep,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    completedMilestones,
    confirmedTriggerSuspectName,
    studentDraftQuery: visibleStudentDraftQuery,
    studentLastQuerySql: studentLastQueryExecution?.sql ?? null
  });
  const mentorTitle =
    studentView === "briefing" && !studentEvidenceFeedback
      ? "Meet Samuel Tupleton"
      : shouldShowMastermindHandoffGuide && shouldPivotToSymphonyHallTrail
        ? "Symphony Hall cross-check"
        : samuelStatus.title;
  const mentorMessage =
    studentView === "briefing" && !studentEvidenceFeedback
      ? SAMUEL_HEADER_INTRO
      : shouldShowMastermindHandoffGuide
        ? getMastermindHandoffGuidance({
            confirmedTriggerSuspectName,
            hasMastermindClues: mastermindClueCount > 0,
            hasCompleteMastermindProfile: mastermindProfileComplete,
            shouldCrossCheckWitnessNotes: shouldCrossCheckWitnessVehicle,
            mastermindCandidateCount: loggedMastermindCandidateCount,
            shouldPivotToSymphonyHallTrail
          })
        : samuelReaction;
  // WP-111: short objective line that answers "what am I trying to prove right
  // now?". The header pairs this with the longer mentorMessage (the "what
  // to do next") so students never need to scan multiple panels.
  const studentObjective = getStudentObjective({
    completedMilestones,
    confirmedTriggerSuspectName,
    hasPinnedWitnessNames,
    pendingEvidenceStep,
    studentView,
    witnessBundleCount
  });
  const mastermindNotebookSummary = shouldShowMastermindHandoffGuide
    ? buildMastermindNotebookSummary(
        loggedMastermindClueTags,
        hasWitnessVehicleClue,
        loggedMastermindCandidateCount
      )
    : null;

  useEffect(() => {
    if (!mastermindProfileComplete || completedMilestones["mastermind-profile"]) {
      return;
    }

    setCompletedMilestones((current) => ({
      ...current,
      "mastermind-profile": true
    }));
  }, [completedMilestones, mastermindProfileComplete]);

  useEffect(() => {
    if (!shouldPivotToSymphonyHallTrail) {
      return;
    }

    const hasDriversLicenseDraft =
      studentDraftQuery !== null &&
      normalizeSqlForMilestones(studentDraftQuery).includes("from driverslicense");
    const hasDriversLicenseExecution =
      studentLastQueryExecution !== null &&
      normalizeSqlForMilestones(studentLastQueryExecution.sql).includes("from driverslicense");

    if (!hasDriversLicenseDraft && !hasDriversLicenseExecution) {
      return;
    }

    setStudentLastQueryExecution(null);
    setStudentDraftQuery(null);
    resetStudentQueryRunner();
  }, [shouldPivotToSymphonyHallTrail, studentDraftQuery, studentLastQueryExecution]);

  const caseReviewCheck = getCaseReviewCheck(completedMilestones, samuelStage);
  const leadBoardCards = getLeadBoardCards(
    completedMilestones,
    pendingEvidenceStep,
    confirmedTriggerSuspectName
  );
  const insightMarks = earnedCaseReviewIds.length;
  const activeCaseReviewStatus =
    caseReviewStatusId === caseReviewCheck.id ? caseReviewStatus : "idle";
  const samuelTrustLabel =
    completedCount + insightMarks >= 5
      ? "Strong"
      : completedCount + insightMarks >= 2
        ? "Steady"
        : "Building";

  function normalizeSqlForMilestones(sql: string): string {
    return sql.toLowerCase().replace(/\s+/g, " ").trim();
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

  function isInterviewLogExecution(
    execution: QueryRunnerExecutionPayload | null
  ): execution is QueryRunnerExecutionPayload {
    return Boolean(
      execution?.response?.success &&
        normalizeSqlForMilestones(execution.sql).includes("from interviewlog")
    );
  }

  function getExecutionRowPersonIds(execution: QueryRunnerExecutionPayload): string[] {
    if (!execution.response?.success) {
      return [];
    }

    return execution.response.data.rows
      .map((row) => {
        const personId =
          getRowValue(row, "PersonID") ??
          getRowValue(row, "personid") ??
          getRowValue(row, "PersonId") ??
          getRowValue(row, "personId");
        return personId ? normalizeComparableValue(personId) : null;
      })
      .filter((personId): personId is string => Boolean(personId));
  }

  function getPreservedTranscriptExecutionForCurrentChapter(input: {
    execution: QueryRunnerExecutionPayload | null;
    gymLeadPersonId: string | null;
    confirmedTriggerSuspectPersonId: string | null;
    shouldShowSuspectInterviewGuide: boolean;
    shouldShowTriggerCheckGuide: boolean;
    shouldShowMastermindHandoffGuide: boolean;
  }): QueryRunnerExecutionPayload | null {
    if (!isInterviewLogExecution(input.execution)) {
      return null;
    }

    const normalizedSql = normalizeSqlForMilestones(input.execution.sql);
    const rowPersonIds = getExecutionRowPersonIds(input.execution);
    const hasSinglePersonTrail = rowPersonIds.length > 0 && new Set(rowPersonIds).size === 1;

    if (input.shouldShowSuspectInterviewGuide && input.gymLeadPersonId) {
      const normalizedPersonId = normalizeComparableValue(input.gymLeadPersonId);
      if (
        (normalizedSql.includes("personid") && normalizedSql.includes(normalizedPersonId)) ||
        (hasSinglePersonTrail && rowPersonIds[0] === normalizedPersonId)
      ) {
        return input.execution;
      }
    }

    if (
      (input.shouldShowTriggerCheckGuide || input.shouldShowMastermindHandoffGuide) &&
      input.confirmedTriggerSuspectPersonId
    ) {
      const normalizedPersonId = normalizeComparableValue(
        input.confirmedTriggerSuspectPersonId
      );
      if (
        (normalizedSql.includes("personid") && normalizedSql.includes(normalizedPersonId)) ||
        (hasSinglePersonTrail && rowPersonIds[0] === normalizedPersonId)
      ) {
        return input.execution;
      }
    }

    return null;
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
      normalizedText.includes("i caught part of the plate") ||
      normalizedText.includes("plate") ||
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

  function isMastermindLeadTranscript(text: string): boolean {
    return extractMastermindTranscriptClueTags(text).length > 0;
  }

  function extractMastermindTranscriptClueTags(text: string): MastermindClueCategory[] {
    const normalizedText = normalizeTranscript(text);
    const clues: MastermindClueCategory[] = [];

    if (
      normalizedText.includes("client") ||
      normalizedText.includes("contract") ||
      normalizedText.includes("wanted that scumbag taken out") ||
      normalizedText.includes("put out a contract") ||
      normalizedText.includes("they called to ice him")
    ) {
      clues.push("paid-hit");
    }

    if (
      normalizedText.includes("the lady") ||
      normalizedText.includes("she said") ||
      normalizedText.includes("dame") ||
      normalizedText.includes("woman who hired") ||
      normalizedText.includes("broad who hired")
    ) {
      clues.push("female");
    }

    if (
      normalizedText.includes("high-roller") ||
      normalizedText.includes("deep pockets") ||
      normalizedText.includes("cream")
    ) {
      clues.push("money");
    }

    if (
      normalizedText.includes("three times last december") ||
      normalizedText.includes("met up three times last december")
    ) {
      clues.push("december");
    }

    if (normalizedText.includes("symphony hall")) {
      clues.push("symphony");
    }

    if (normalizedText.includes("stiletto")) {
      clues.push("stilettos");
    }

    if (
      normalizedText.includes("expensive jewelry") ||
      normalizedText.includes("serious ice") ||
      normalizedText.includes("rocks on her fingers") ||
      normalizedText.includes("rocks on her fingers and toes")
    ) {
      clues.push("jewelry");
    }

    if (normalizedText.includes("redhead") || normalizedText.includes("redheaded")) {
      clues.push("red-hair");
    }

    if (normalizedText.includes("bmw m8")) {
      clues.push("bmw");
    }

    if (
      normalizedText.includes("5 foot 5") ||
      normalizedText.includes("5 foot 8") ||
      normalizedText.includes("5'5") ||
      normalizedText.includes("5'8") ||
      normalizedText.includes("five foot five") ||
      normalizedText.includes("five foot eight")
    ) {
      clues.push("height");
    }

    return Array.from(new Set(clues));
  }

  function summarizeMastermindLeadTranscript(text: string): string {
    const tags = extractMastermindTranscriptClueTags(text);

    if (tags.includes("paid-hit") && tags.includes("female") && tags.includes("money")) {
      return "a wealthy woman paid for the hit";
    }

    if (tags.includes("december")) {
      return "the killer met the woman who hired him three times last December";
    }

    if (tags.includes("symphony")) {
      return "their meetings happened next to Symphony Hall";
    }

    if (tags.includes("bmw")) {
      return "the woman who hired him drives a BMW M8";
    }

    if (tags.includes("red-hair") && tags.includes("jewelry")) {
      return "the woman who hired him has red hair and expensive jewelry";
    }

    if (tags.includes("stilettos")) {
      return "the woman who hired him wore designer stilettos";
    }

    if (tags.includes("jewelry")) {
      return "the woman who hired him wore expensive jewelry";
    }

    if (tags.includes("red-hair")) {
      return "the woman who hired him is redheaded";
    }

    if (tags.includes("money")) {
      return "the woman who hired him has deep pockets";
    }

    if (tags.includes("female") && tags.includes("height")) {
      return "the woman who hired him is about 5'5\" to 5'8\" tall";
    }

    if (tags.includes("female")) {
      return "the killer points to a woman who hired him";
    }

    if (tags.includes("paid-hit")) {
      return "someone else paid for the hit";
    }

    if (tags.includes("height")) {
      return "the woman who hired him is about 5'5\" to 5'8\" tall";
    }

    return "the killer confirms there is a hidden client behind the hit";
  }

  function getOutstandingMastermindCluePrompt(loggedTags: string[]): string {
    const remainingTargets = MASTERMIND_PROFILE_TARGETS.filter(
      (prompt) => !loggedTags.includes(prompt.category)
    );
    const remaining = remainingTargets.map((prompt) => prompt.label);

    if (remaining.length === 0) {
      return "You have the full mastermind profile. The next step is to leave InterviewLog and start narrowing DriversLicense.";
    }

    const remainingThemes = new Set<string>();

    if (remainingTargets.some((target) => ["paid-hit", "female"].includes(target.category))) {
      remainingThemes.add("who hired him");
    }

    if (remainingTargets.some((target) => ["december", "symphony"].includes(target.category))) {
      remainingThemes.add("how and where they met");
    }

    if (remainingTargets.some((target) => ["stilettos", "jewelry"].includes(target.category))) {
      remainingThemes.add("her style and wealth");
    }

    if (remainingTargets.some((target) => ["bmw", "redhead", "height"].includes(target.category))) {
      remainingThemes.add("the details that can identify her in real records");
    }

    return `Still look for ${remaining.length} more clue thread${remaining.length === 1 ? "" : "s"} about ${Array.from(remainingThemes).join(", ")}.`;
  }

  function buildMastermindNotebookSummary(
    loggedTags: string[],
    hasWitnessVehicle: boolean,
    candidateCount: number
  ): string | null {
    if (loggedTags.length === 0) {
      return null;
    }

    const collected = MASTERMIND_PROFILE_TARGETS.filter((target) =>
      loggedTags.includes(target.category)
    ).length;
    const total = MASTERMIND_PROFILE_TARGETS.length;
    if (candidateCount >= 2) {
      return `Mastermind shortlist pinned: ${candidateCount} candidates. Use the candidate LicenseIDs to identify both women, then compare their December Symphony Hall trail before you make the final mastermind call.`;
    }

    if (collected === total) {
      return hasWitnessVehicle && loggedTags.includes("bmw")
        ? `Mastermind profile clues pinned: ${collected}/${total}. Leave InterviewLog and narrow DriversLicense to female redheaded BMW M8 owners between 65 and 67 inches tall. Keep the witness red BMW note in mind as a lead to compare, not a proven match yet.`
        : `Mastermind profile clues pinned: ${collected}/${total}. Leave InterviewLog and narrow DriversLicense to female redheaded BMW M8 owners between 65 and 67 inches tall, then compare the shortlist against your money, jewelry, and Symphony Hall notes.`;
    }

    const remaining = getOutstandingMastermindCluePrompt(loggedTags);
    const crossCheck = hasWitnessVehicle && loggedTags.includes("bmw")
      ? "Now compare the BMW clue against the witness note about the red BMW and decide whether they could describe the same car."
      : "Keep collecting transcript clues until the woman's profile starts to hold together.";

    return `Mastermind profile clues pinned: ${collected}/${total}. ${crossCheck} ${remaining}`;
  }

  function summarizeWitnessTranscript(text: string): string {
    const normalizedText = normalizeTranscript(text);

    if (normalizedText.includes("heard a gunshot")) {
      return "heard a gunshot";
    }

    if (normalizedText.includes("saw a man run out")) {
      return "saw a man run out";
    }

    if (normalizedText.includes("48z")) {
      return "saw a gym bag with membership starting 48Z";
    }

    if (normalizedText.includes("h42w")) {
      return 'saw a plate containing "H42W"';
    }

    if (normalizedText.includes("red bmw") && normalizedText.includes("symphony hall")) {
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
    let sawRedBmw = false;
    let sawPartialPlate = false;

    for (const transcript of transcripts) {
      const normalizedTranscript = normalizeTranscript(transcript);
      const summary = summarizeWitnessTranscript(transcript);

      if (
        normalizedTranscript.includes("red bmw") &&
        normalizedTranscript.includes("symphony hall")
      ) {
        sawRedBmw = true;
      }

      if (normalizedTranscript.includes("h42w")) {
        sawPartialPlate = true;
      }

      if (!summaries.includes(summary)) {
        summaries.push(summary);
      }
    }

    if (sawRedBmw && sawPartialPlate) {
      const bmwSummaryIndex = summaries.indexOf("noticed a red BMW outside Symphony Hall");
      const plateSummaryIndex = summaries.indexOf('saw a plate containing "H42W"');
      const combinedVehicleSummary =
        'noticed a red BMW outside Symphony Hall with plate fragment "H42W"';

      if (bmwSummaryIndex >= 0) {
        summaries[bmwSummaryIndex] = combinedVehicleSummary;
      }

      if (plateSummaryIndex >= 0) {
        summaries.splice(plateSummaryIndex, 1);
      }

      const combinedIndex = summaries.indexOf(combinedVehicleSummary);
      if (combinedIndex > 0) {
        summaries.splice(combinedIndex, 1);
        summaries.unshift(combinedVehicleSummary);
      }
    }

    return summaries.slice(0, 3).join(", ");
  }

  function summarizeSuspectInterviewTranscript(text: string): string {
    const normalizedText = normalizeTranscript(text);

    if (
      normalizedText.includes("client wanted") ||
      normalizedText.includes("put out a contract") ||
      normalizedText.includes("they called to ice him")
    ) {
      return "his own words say someone hired him to kill the victim";
    }

    if (normalizedText.includes("she said the sleazeball had it coming")) {
      return "his own words say a woman wanted the victim dead";
    }

    if (normalizedText.includes("it was just business")) {
      return "his own words tie the murder to a paid hit, not a random act";
    }

    return "his own words strengthen the case against him";
  }

  function removeNotebookEntry(entryId: string): void {
    setNotebookEntries((current) => current.filter((entry) => entry.id !== entryId));
    setHighlightedNotebookEntryId((current) => (current === entryId ? null : current));
  }

  function clearStudentFeedback(): void {
    setStudentEvidenceFeedback(null);
    setStudentEvidenceFeedbackTone("neutral");
  }

  function setNotebookEntryPage(entryId: string, notebookPage: "mastermind" | undefined): void {
    setNotebookEntries((current) =>
      current.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              notebookPage
            }
          : entry
      )
    );
  }

  function resetStudentQueryRunner(): void {
    setStudentQueryRunnerResetKey((current) => current + 1);
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
        `Clue logged: CrimeID ${crimeId} maps to Murder. Stay in Query Lab and inspect CrimeSceneReport next so you can start narrowing the report archive.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(entryId);
      setStudentLastQueryExecution(null);
      setStudentDraftQuery(SAMUEL_TUPLETON_STEPS[1].queryDraft);
      resetStudentQueryRunner();
      setStudentView("workbench");
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
      const witnessTrailCompleted = nextWitnessBundleCount >= 2;
      if (witnessTrailCompleted) {
        setCompletedMilestones((current) => ({ ...current, "witness-clues": true }));
      }
      setStudentEvidenceFeedback(
        witnessTrailCompleted
          ? `Witness clue bundle logged for PersonID ${personId}. Both witness bundles are pinned now. Use PersonsOfInterest and those PersonIDs to identify the witness names first. Stay focused on the names until both witness rows are pinned.`
          : `Witness clue bundle logged for PersonID ${personId}. Find the other repeated PersonID and use Log Clue on one strong witness row for that bundle too.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(`witness-bundle-${personId}`);
      if (witnessTrailCompleted) {
        setPendingEvidenceStep("witness-names");
        setStudentLastQueryExecution(null);
        setStudentDraftQuery(WITNESS_NAME_LOOKUP_DRAFT);
        resetStudentQueryRunner();
        setStudentView("workbench");
        return;
      }

      setStudentView("case-board");
      return;
    }

    if (
      pendingEvidenceStep === "witness-names" &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from personsofinterest")
    ) {
      const personIdValue =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");
      const personId = personIdValue === null ? null : String(personIdValue).trim();
      const personName =
        getRowValue(row, "PersonName") ??
        getRowValue(row, "personname") ??
        getRowValue(row, "Name") ??
        getRowValue(row, "name");

      if (!personId || !loggedWitnessPersonIds.includes(personId)) {
        setStudentEvidenceFeedback(
          "That row is not one of the two witness identities Samuel asked for. Stay with the pinned witness PersonIDs."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (!personName) {
        setStudentEvidenceFeedback(
          "That row does not clearly identify the witness by name yet. Re-run the PersonsOfInterest lookup and use the rows with visible names."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      upsertNotebookEntries([
        {
          id: `witness-name-${personId}`,
          detail: `Witness Name ${personId} = ${personName}`,
          sourceLabel: "PersonsOfInterest"
        }
      ]);

      const nextLoggedNameIds = loggedWitnessNameIds.includes(personId)
        ? loggedWitnessNameIds
        : [...loggedWitnessNameIds, personId];
      const namesComplete = nextLoggedNameIds.length >= 2;

      setStudentEvidenceFeedback(
        namesComplete
          ? `Witness name logged for PersonID ${personId}. Both witness identities are pinned now. The gym lead is ready next.`
          : `Witness name logged for PersonID ${personId}. Pin the other witness name from this lookup too.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(`witness-name-${personId}`);

      if (namesComplete) {
        setPendingEvidenceStep("gym-lead");
        setStudentLastQueryExecution(null);
        setStudentDraftQuery(null);
        resetStudentQueryRunner();
        setStudentView("case-board");
      }

      return;
    }

    if (
      pendingEvidenceStep === "gym-lead" &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from fitnflabclub")
    ) {
      const fitMemberId =
        getRowValue(row, "FitMemberID") ??
        getRowValue(row, "fitmemberid") ??
        getRowValue(row, "FitMemberId") ??
        getRowValue(row, "fitMemberId");
      const fitMembershipStatus =
        getRowValue(row, "FitMembershipStatus") ??
        getRowValue(row, "fitmembershipstatus") ??
        getRowValue(row, "FitMembership") ??
        getRowValue(row, "fitMembership");
      const personId =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");

      const matchesGymClues =
        normalizeComparableValue(fitMembershipStatus) === "gold" &&
        normalizeComparableValue(fitMemberId).startsWith("48z");

      if (!matchesGymClues || !personId || !fitMemberId) {
        setStudentEvidenceFeedback(
          "That row does not lock the gym clue yet. Stay with the single membership row that matches both the 48Z and gold clues."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const gymEntries: EvidenceNotebookEntry[] = [
        {
          id: `gym-fit-member-${fitMemberId}`,
          detail: `FitMemberID = ${fitMemberId}`,
          sourceLabel: "FitNFlabClub"
        },
        {
          id: `gym-lead-person-${personId}`,
          detail: `Gym Lead PersonID = ${personId}`,
          sourceLabel: "FitNFlabClub"
        }
      ];

      upsertNotebookEntries(gymEntries);
      setCompletedMilestones((current) => ({ ...current, "gym-chain": true }));
      setPendingEvidenceStep("suspect-candidate");
      setStudentEvidenceFeedback(
        `Clue logged: the gym membership lead points to PersonID ${personId}. Resolve that PersonID into a real name before you test any suspect theory.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(`gym-lead-person-${personId}`);
      setStudentDraftQuery(null);
      setStudentView("case-board");
      return;
    }

    if (
      pendingEvidenceStep === "suspect-candidate" &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from personsofinterest")
    ) {
      const personIdValue =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");
      const personId = personIdValue === null ? null : String(personIdValue).trim();
      const personName =
        getRowValue(row, "PersonName") ??
        getRowValue(row, "personname") ??
        getRowValue(row, "Name") ??
        getRowValue(row, "name");

      if (!personId || !gymLeadPersonId || personId !== gymLeadPersonId) {
        setStudentEvidenceFeedback(
          "That row is not the gym-linked person Samuel asked for. Open Case File > Pinned Facts and stay with the pinned gym lead PersonID."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (!personName) {
        setStudentEvidenceFeedback(
          "That row does not clearly identify the gym-linked person by name yet. Re-run PersonsOfInterest with the pinned gym lead PersonID and use the row with a visible name."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      upsertNotebookEntries([
        {
          id: `gym-lead-name-${personId}`,
          detail: `Gym Lead Name ${personId} = ${personName}`,
          sourceLabel: "PersonsOfInterest"
        }
      ]);

      setPendingEvidenceStep("suspect-interview");
      setStudentEvidenceFeedback(
        `Gym-linked person logged for PersonID ${personId}. ${personName} is pinned now. Review ${personName}'s InterviewLog before you decide whether to test the theory.`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(`gym-lead-name-${personId}`);
      setStudentLastQueryExecution(null);
      setStudentDraftQuery(null);
      resetStudentQueryRunner();
      setStudentSuspectTheoryResult(null);
      setStudentSuspectTheoryError(null);
      setStudentView("case-board");
      return;
    }

    if (
      pendingEvidenceStep === "suspect-interview" &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from interviewlog")
    ) {
      const personIdValue =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");
      const personId = personIdValue === null ? null : String(personIdValue).trim();
      const logTranscript =
        getRowValue(row, "LogTranscript") ??
        getRowValue(row, "logtranscript") ??
        getRowValue(row, "Transcript") ??
        getRowValue(row, "transcript");
      const logIdValue =
        getRowValue(row, "LogID") ??
        getRowValue(row, "logid") ??
        getRowValue(row, "LogId") ??
        getRowValue(row, "logId");
      const logId = logIdValue === null ? null : String(logIdValue).trim();

      if (
        !personId ||
        !gymLeadPersonId ||
        normalizeComparableValue(personId) !== normalizeComparableValue(gymLeadPersonId)
      ) {
        setStudentEvidenceFeedback(
          "That row is not from the gym-linked suspect's interview trail. Stay with the pinned PersonID in InterviewLog."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (!logTranscript || !isConfessionHeavyTranscript(logTranscript)) {
        setStudentEvidenceFeedback(
          "That row adds color, but it does not yet show what the suspect's own words contribute to the case. Pick the row where he talks about the hit, the client, or the contract."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const suspectInterviewEntryId = logId
        ? `suspect-interview-clue-${logId}`
        : `suspect-interview-clue-${Date.now()}`;

      upsertNotebookEntries([
        {
          id: suspectInterviewEntryId,
          detail: `Suspect Interview Clue: ${summarizeSuspectInterviewTranscript(logTranscript)}`,
          sourceLabel: "InterviewLog"
        }
      ]);
      setCompletedMilestones((current) => ({ ...current, "suspect-interview": true }));
      setPendingEvidenceStep(null);
      setStudentEvidenceFeedback(
        "Interview clue logged. Open Evidence Board, review what the suspect's own words now prove, and decide whether you are ready to test the theory."
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(suspectInterviewEntryId);
      setStudentView("case-board");
      return;
    }

    if (
      completedMilestones["trigger-check"] &&
      !completedMilestones["mastermind-trace"] &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from interviewlog")
    ) {
      const personIdValue =
        getRowValue(row, "PersonID") ??
        getRowValue(row, "personid") ??
        getRowValue(row, "PersonId") ??
        getRowValue(row, "personId");
      const personId = personIdValue === null ? null : String(personIdValue).trim();
      const reportIdValue =
        getRowValue(row, "ReportID") ??
        getRowValue(row, "reportid") ??
        getRowValue(row, "ReportId") ??
        getRowValue(row, "reportId");
      const reportId = reportIdValue === null ? null : String(reportIdValue).trim();
      const logTranscript =
        getRowValue(row, "LogTranscript") ??
        getRowValue(row, "logtranscript") ??
        getRowValue(row, "Transcript") ??
        getRowValue(row, "transcript");
      const logIdValue =
        getRowValue(row, "LogID") ??
        getRowValue(row, "logid") ??
        getRowValue(row, "LogId") ??
        getRowValue(row, "logId");
      const logId = logIdValue === null ? null : String(logIdValue).trim();

      if (
        !personId ||
        !confirmedTriggerSuspectPersonId ||
        normalizeComparableValue(personId) !==
          normalizeComparableValue(confirmedTriggerSuspectPersonId)
      ) {
        setStudentEvidenceFeedback(
          "That row is not from the confirmed killer's transcript trail. Stay with the pinned suspect's InterviewLog rows."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (
        !reportId ||
        normalizeComparableValue(reportId) !== normalizeComparableValue(pinnedReportId)
      ) {
        setStudentEvidenceFeedback(
          `That row is not tied to ReportID ${pinnedReportId}. Keep the murder-report transcript trail in view before you log the mastermind clue.`
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      if (!logTranscript || !isMastermindLeadTranscript(logTranscript)) {
        setStudentEvidenceFeedback(
          "That row keeps the killer in frame, but it does not add a usable mastermind clue yet. Pick a row that reveals who hired him, how they met, or what the hiring person was like."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const clueTags = extractMastermindTranscriptClueTags(logTranscript);
      const newClueTags = clueTags.filter((tag) => !loggedMastermindClueTags.includes(tag));

      if (newClueTags.length === 0) {
        setStudentEvidenceFeedback(
          "That row repeats clue threads you already logged. Keep reading and pick a row that adds a new detail about the woman, the meetings, the money, the car, or her appearance."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const mastermindClueEntryId = logId
        ? `mastermind-clue-${logId}`
        : `mastermind-clue-${Date.now()}`;

      upsertNotebookEntries([
        {
          id: mastermindClueEntryId,
          detail: `Mastermind Clue: ${summarizeMastermindLeadTranscript(logTranscript)}`,
          sourceLabel: "InterviewLog",
          notebookPage: "mastermind",
          clueTags: newClueTags
        }
      ]);
      const updatedClueCount = mastermindClueCount + 1;
      const updatedLoggedTags = Array.from(
        new Set([...loggedMastermindClueTags, ...newClueTags])
      );
      const updatedProfileCount = MASTERMIND_PROFILE_TARGETS.filter((target) =>
        updatedLoggedTags.includes(target.category)
      ).length;
      setStudentEvidenceFeedback(
        updatedProfileCount === MASTERMIND_PROFILE_TARGETS.length
          ? `Mastermind profile complete: ${updatedProfileCount}/${MASTERMIND_PROFILE_TARGETS.length} clue threads pinned. Next, leave InterviewLog and narrow DriversLicense to female redheaded BMW M8 owners between 65 and 67 inches tall.`
          : `Mastermind clue logged. You now have ${updatedClueCount} transcript clue${updatedClueCount === 1 ? "" : "s"} pinned and ${updatedProfileCount}/${MASTERMIND_PROFILE_TARGETS.length} clue threads collected. ${getOutstandingMastermindCluePrompt(updatedLoggedTags)}`
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(mastermindClueEntryId);
      if (updatedProfileCount === MASTERMIND_PROFILE_TARGETS.length) {
        setStudentLastQueryExecution(null);
        setStudentDraftQuery(null);
        resetStudentQueryRunner();
      }
      setStudentView("case-board");
      return;
    }

    if (
      completedMilestones["trigger-check"] &&
      completedMilestones["mastermind-profile"] &&
      !completedMilestones["mastermind-trace"] &&
      studentLastQueryExecution?.response?.success &&
      normalizedLastStudentSql.includes("from driverslicense")
    ) {
      const licenseIdValue =
        getRowValue(row, "LicenseID") ??
        getRowValue(row, "licenseid") ??
        getRowValue(row, "LicenseId") ??
        getRowValue(row, "licenseId");
      const plateNumber =
        getRowValue(row, "PlateNumber") ??
        getRowValue(row, "platenumber") ??
        getRowValue(row, "Plate") ??
        getRowValue(row, "plate");
      const heightValue = getRowValue(row, "Height") ?? getRowValue(row, "height");
      const hairColor =
        getRowValue(row, "HairColor") ??
        getRowValue(row, "haircolor");
      const carMake =
        getRowValue(row, "CarMake") ??
        getRowValue(row, "carmake");
      const carModel =
        getRowValue(row, "CarModel") ??
        getRowValue(row, "carmodel");
      const gender =
        getRowValue(row, "Gender") ??
        getRowValue(row, "gender");
      const licenseId = licenseIdValue === null ? null : String(licenseIdValue).trim();

      if (!licenseId || !plateNumber || !heightValue || !hairColor || !carMake || !carModel || !gender) {
        setStudentEvidenceFeedback(
          "That row is missing key identity details. Keep the narrowed DriversLicense shortlist in view and log rows with visible vehicle, hair, height, and plate details."
        );
        setStudentEvidenceFeedbackTone("error");
        return;
      }

      const candidateEntryId = `mastermind-candidate-${licenseId}`;
      upsertNotebookEntries([
        {
          id: candidateEntryId,
          detail: `Mastermind Candidate: LicenseID ${licenseId}, ${hairColor}-haired ${gender} ${carMake} ${carModel} owner, ${heightValue} inches tall, plate ${plateNumber}`,
          sourceLabel: "DriversLicense",
          notebookPage: "mastermind"
        }
      ]);
      const candidateAlreadyLogged = notebookEntries.some(
        (entry) => entry.id === candidateEntryId
      );
      const nextLoggedMastermindCandidateCount = candidateAlreadyLogged
        ? loggedMastermindCandidateCount
        : loggedMastermindCandidateCount + 1;
      setStudentEvidenceFeedback(
        nextLoggedMastermindCandidateCount >= 2
          ? "Candidate logged. Your two-person shortlist is ready. Use the candidate LicenseIDs to identify both women, then compare their December Symphony Hall trail before you make the final call."
          : "Candidate logged. If another DriversLicense row still fits the profile, log that one too before you move on from the shortlist."
      );
      setStudentEvidenceFeedbackTone("success");
      setHighlightedNotebookEntryId(candidateEntryId);
      if (nextLoggedMastermindCandidateCount >= 2) {
        setStudentLastQueryExecution(null);
        setStudentDraftQuery(null);
        resetStudentQueryRunner();
      }
      setStudentView("case-board");
      return;
    }
  }

  function handleManualNotebookAdd(notebookPage?: "mastermind"): void {
    const trimmedDraft = manualNotebookDraft.trim();

    if (!trimmedDraft) {
      return;
    }

    const entryId = `manual-note-${Date.now()}`;
    upsertNotebookEntries([
      {
        id: entryId,
        detail: trimmedDraft,
        isManual: true,
        notebookPage
      }
    ]);
    setHighlightedNotebookEntryId(entryId);
    setManualNotebookDraft("");
  }

  function handleStudentSqlEdit(nextSql: string): void {
    setStudentDraftQuery(nextSql);

    if (!studentEvidenceFeedback && studentEvidenceFeedbackTone === "neutral") {
      return;
    }

    clearStudentFeedback();
  }

  async function handleStudentSuspectTheorySubmit(): Promise<void> {
    setStudentSuspectTheoryLoading(true);
    setStudentSuspectTheoryError(null);

    try {
      const response = await verifySuspect(studentSuspectTheoryDraft);
      setStudentSuspectTheoryResult(response);

      const isTriggerManSolved =
        response.data.isCorrect && response.data.solvedRole === "trigger_man";
      const isMastermindSolved =
        response.data.isCorrect && response.data.solvedRole === "mastermind";

      if (isTriggerManSolved) {
        setCompletedMilestones((current) => ({ ...current, "trigger-check": true }));
        setStudentEvidenceFeedback(
          `Case cracked. ${response.data.suspect} is confirmed as the hired killer. Take the win, then use that transcript trail to expose the mastermind behind the hit.`
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentLastQueryExecution(null);
        setStudentDraftQuery(null);
        setStudentView("case-board");
      } else if (isMastermindSolved) {
        setCompletedMilestones((current) => ({
          ...current,
          "trigger-check": true,
          "mastermind-trace": true
        }));
        setStudentEvidenceFeedback(
          "Case closed. The mastermind is confirmed and the full contract chain is solved."
        );
        setStudentEvidenceFeedbackTone("success");
      } else {
        setStudentEvidenceFeedback(
          "Theory checked. The verdict says this suspect is not correct yet, so keep searching for stronger evidence."
        );
        setStudentEvidenceFeedbackTone("error");
      }
    } catch (submitError) {
      setStudentSuspectTheoryResult(null);
      setStudentSuspectTheoryError(
        submitError instanceof Error
          ? submitError.message
          : "Suspect theory check failed."
      );
    } finally {
      setStudentSuspectTheoryLoading(false);
    }
  }

  function handleQueryExecutionComplete(payload: QueryRunnerExecutionPayload): void {
    setStudentLastQueryExecution(payload);
    setStudentSceneFeedbackTone("neutral");

    // WP-113: feedback persists until the next meaningful action supersedes
    // it. Running a new query is one of those actions, so clear first and let
    // the latest query state replace the message if needed.
    clearStudentFeedback();

    if (payload.error) {
      return;
    }

    if (!payload.response?.success) {
      return;
    }

    setStudentDraftQuery(payload.sql);

    const normalizedSql = normalizeSqlForMilestones(payload.sql);
    setCompletedMilestones((current) => {
      const updated = { ...current };

      for (const milestone of CASE_004_MILESTONES) {
        const requiresEvidenceLog =
          milestone.id === "crime-type" ||
          milestone.id === "crime-scene-filter" ||
          milestone.id === "witness-clues" ||
          milestone.id === "gym-chain";

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
        "Good. You found the report backlog. I queued the murder-only filter for you. Run it next, then see whether the report pile still needs one more narrowing clue."
      );
      setStudentEvidenceFeedbackTone("success");
      setStudentDraftQuery(SAMUEL_TUPLETON_STEPS[2].queryDraft);
      setStudentView("workbench");
      return;
    }

    if (
      pendingEvidenceStep === "gym-lead" &&
      normalizedSql.includes("from fitnflabclub")
    ) {
      setPendingEvidenceStep("gym-lead");
      setHighlightedNotebookEntryId(null);
      if (!normalizedSql.includes("where")) {
        setStudentEvidenceFeedback(
          "Good. You found the membership table. Now use the witness clues to narrow it: the gym bag membership starts with 48Z, and only gold members have those bags."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      if (payload.response.data.rowCount === 1) {
        setStudentEvidenceFeedback(
          "Good. One gym membership row matches both clues. Use Log Clue to pin it before you move on."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
      return;
    }

    if (
      pendingEvidenceStep === "witness-names" &&
      normalizedSql.includes("from personsofinterest")
    ) {
      const hasWitnessIdFilter =
        normalizedSql.includes("where") &&
        loggedWitnessPersonIds.length > 0 &&
        loggedWitnessPersonIds.every((personId) => normalizedSql.includes(personId.toLowerCase()));

      if (!hasWitnessIdFilter) {
        setPendingEvidenceStep("witness-names");
        setHighlightedNotebookEntryId(null);
        setStudentEvidenceFeedback(
          "That name table is still too broad. Use the two pinned witness PersonIDs from Case File to narrow it yourself, then use Log Clue on both matching name rows."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      setPendingEvidenceStep("witness-names");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
      return;
    }

    if (
      pendingEvidenceStep === "suspect-candidate" &&
      normalizedSql.includes("from personsofinterest")
    ) {
      const hasGymLeadFilter =
        normalizedSql.includes("where") &&
        gymLeadPersonId !== null &&
        normalizedSql.includes(gymLeadPersonId.toLowerCase());

      if (!hasGymLeadFilter) {
        setPendingEvidenceStep("suspect-candidate");
        setHighlightedNotebookEntryId(null);
        setStudentEvidenceFeedback(
          "That people table is still too broad. Open Case File > Pinned Facts, use the pinned gym lead PersonID to narrow PersonsOfInterest, then log the one matching person row."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      setPendingEvidenceStep("suspect-candidate");
      setStudentEvidenceFeedback(null);
      setStudentEvidenceFeedbackTone("neutral");
      setStudentView("workbench");
      return;
    }

    if (
      pendingEvidenceStep === "suspect-interview" &&
      normalizedSql.includes("from interviewlog")
    ) {
      const hasGymLeadInterviewFilter =
        normalizedSql.includes("where") &&
        gymLeadPersonId !== null &&
        normalizedSql.includes(normalizeComparableValue(gymLeadPersonId));

      if (!hasGymLeadInterviewFilter) {
        setPendingEvidenceStep("suspect-interview");
        setHighlightedNotebookEntryId(null);
        setStudentEvidenceFeedback(
          "That transcript table is still too broad. Open Case File > Pinned Facts, use the pinned gym lead PersonID in InterviewLog, and read what the suspect actually said before you test the theory."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      const responseRows = payload.response.data.rows;
      const rowsIncludeCaseSupport =
        responseRows.length > 0 &&
        responseRows.some((row) => {
          const transcript =
            getRowValue(row, "LogTranscript") ??
            getRowValue(row, "logtranscript") ??
            getRowValue(row, "Transcript") ??
            getRowValue(row, "transcript");
          return transcript !== null && isConfessionHeavyTranscript(transcript);
        });

      setPendingEvidenceStep("suspect-interview");
      setHighlightedNotebookEntryId(null);
      setStudentPreservedTranscriptExecution(payload);
      setStudentEvidenceFeedback(
        rowsIncludeCaseSupport
          ? "Good. You have the gym-linked suspect's interview log in view now. Read the rows and use Log Clue on the one that most clearly shows what his own words add to the case."
          : "Good. You have the gym-linked suspect's interview log in view now. Keep reading until you find the row that best shows what his own words add to the case."
      );
      setStudentEvidenceFeedbackTone("success");
      setStudentView("workbench");
      return;
    }

    if (
      completedMilestones["trigger-check"] &&
      completedMilestones["mastermind-profile"] &&
      !completedMilestones["mastermind-trace"] &&
      normalizedSql.includes("from driverslicense")
    ) {
      const hasVehicleFilters =
        normalizedSql.includes("carmake") &&
        normalizedSql.includes("bmw") &&
        normalizedSql.includes("carmodel") &&
        normalizedSql.includes("m8");
      const hasGenderFilter =
        normalizedSql.includes("gender") && normalizedSql.includes("female");
      const hasHairFilter =
        normalizedSql.includes("haircolor") && normalizedSql.includes("red");
      const hasHeightFilter =
        normalizedSql.includes("height") &&
        ((normalizedSql.includes("between") &&
          normalizedSql.includes("65") &&
          normalizedSql.includes("67")) ||
          (normalizedSql.includes(">=") &&
            normalizedSql.includes("65") &&
            normalizedSql.includes("<=") &&
            normalizedSql.includes("67")));
      const rowCount = payload.response.data.rowCount;

      setPendingEvidenceStep(null);
      setHighlightedNotebookEntryId(null);

      if (!hasVehicleFilters) {
        setStudentEvidenceFeedback(
          "Good. You moved into DriversLicense. Start with the vehicle clue first: BMW M8."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      if (!hasGenderFilter || !hasHairFilter) {
        setStudentEvidenceFeedback(
          "Good. The BMW M8 filter is in place. Now add the transcript clues that the mastermind is a woman with red hair."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      if (!hasHeightFilter) {
        setStudentEvidenceFeedback(
          "Good. You narrowed by vehicle, gender, and hair. Add the height clue next: between 65 and 67 inches tall."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      setStudentEvidenceFeedback(
        rowCount > 1
          ? `Good. You are down to ${rowCount} DriversLicense candidate${rowCount === 1 ? "" : "s"}. Use Log Clue on each candidate you want to carry into your notebook. Once both are pinned, compare their LicenseIDs against PersonsOfInterest and then follow the December Symphony Hall trail in EventRegistration and EventSchedule.`
          : "Good. One DriversLicense candidate remains. Use Log Clue to pin that record, then compare it against your notebook before the final mastermind identification."
      );
      setStudentEvidenceFeedbackTone("success");
      setStudentView("workbench");
      return;
    }

    if (
      completedMilestones["trigger-check"] &&
      !completedMilestones["mastermind-trace"] &&
      normalizedSql.includes("from interviewlog")
    ) {
      if (completedMilestones["mastermind-profile"]) {
        setPendingEvidenceStep(null);
        setHighlightedNotebookEntryId(null);
        setStudentEvidenceFeedback(
          "You already have the full mastermind transcript profile. Leave InterviewLog now and use DriversLicense to narrow female redheaded BMW M8 owners between 65 and 67 inches tall."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      const normalizedPersonId =
        confirmedTriggerSuspectPersonId === null
          ? null
          : normalizeComparableValue(confirmedTriggerSuspectPersonId);
      const hasPersonIdFilter =
        normalizedPersonId !== null &&
        normalizedSql.includes("personid") &&
        normalizedSql.includes(normalizedPersonId);
      const hasReportIdFilter =
        normalizedSql.includes("reportid") &&
        normalizedSql.includes(normalizeComparableValue(pinnedReportId));
      const responseRows = payload.response.data.rows;
      const rowsAreReportLinked =
        responseRows.length > 0 &&
        responseRows.every((row) => {
          const reportId =
            getRowValue(row, "ReportID") ??
            getRowValue(row, "reportid") ??
            getRowValue(row, "ReportId") ??
            getRowValue(row, "reportId");
          return normalizeComparableValue(reportId) === normalizeComparableValue(pinnedReportId);
        });
      const rowsIncludeMastermindLead =
        responseRows.length > 0 &&
        responseRows.some((row) => {
          const transcript =
            getRowValue(row, "LogTranscript") ??
            getRowValue(row, "logtranscript") ??
            getRowValue(row, "Transcript") ??
            getRowValue(row, "transcript");
          return transcript !== null && isMastermindLeadTranscript(transcript);
        });

      setHighlightedNotebookEntryId(null);
      setStudentPreservedTranscriptExecution(payload);

      if (!hasPersonIdFilter) {
        setStudentEvidenceFeedback(
          `Good start. Now narrow InterviewLog with ${confirmedTriggerPossessiveLabel} pinned PersonID before you decide which transcript matters.`
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      if (!hasReportIdFilter && !rowsAreReportLinked) {
        setStudentEvidenceFeedback(
          `Good. You isolated ${confirmedTriggerPossessiveLabel} transcript trail. Add ReportID ${pinnedReportId} so you stay on the murder-report transcript before you log anything.`
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      if (rowsIncludeMastermindLead) {
        setStudentEvidenceFeedback(
          "You have the right transcript set. Read the rows and use Log Clue on the one where the killer reveals a client, contract, or employer behind the hit."
        );
        setStudentEvidenceFeedbackTone("success");
        setStudentView("workbench");
        return;
      }

      setStudentEvidenceFeedback(
        "Stay with this narrowed transcript trail and keep reading. The next clue is the row where the killer admits someone else ordered the hit."
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
          "Murder reports isolated, but the pile is still too large. I queued the SQL City filter for you next. Run it, then look for the January 15th, 2023 report."
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
      const alreadyEarned = earnedCaseReviewIds.includes(caseReviewCheck.id);
      setEarnedCaseReviewIds((current) =>
        current.includes(caseReviewCheck.id) ? current : [...current, caseReviewCheck.id]
      );
      setStudentEvidenceFeedback(
        alreadyEarned
          ? `Insight Mark already earned. ${caseReviewCheck.success}`
          : `Insight Mark earned. ${caseReviewCheck.success}`
      );
      setStudentEvidenceFeedbackTone("success");
      return;
    }

    setCaseReviewStatus("error");
    setStudentEvidenceFeedback(caseReviewCheck.coaching);
    setStudentEvidenceFeedbackTone("error");
  }

  return {
    activeCaseReviewStatus,
    activeLeads,
    activeSamuelStep,
    caseMomentum,
    caseReviewCheck,
    caseStatus,
    confirmedTriggerSuspectName,
    confirmedTriggerSuspectPersonId,
    completedCount,
    completedMilestones,
    handleCaseReviewChoice,
    handleManualNotebookAdd,
    handleQueryExecutionComplete,
    setNotebookEntryPage,
    handleStudentEvidenceLog,
    handleStudentSuspectTheorySubmit,
    handleStudentSqlEdit,
    highlightedNotebookEntryId,
    insightMarks,
    leadBoardCards,
    manualNotebookDraft,
    mastermindNotebookSummary,
    mentorMessage,
    mentorTitle,
    notebookEntries,
    pendingEvidenceStep,
    removeNotebookEntry,
    samuelAvatarSrc,
    samuelCompletedCount,
    samuelTrustLabel,
    samuelVisualState,
    selectedStudentTable,
    selectedTableDetails,
    setManualNotebookDraft,
    setSelectedStudentTable,
    setStudentSuspectTheoryDraft,
    setStudentView,
    shouldShowGymLeadGuide,
    shouldShowSuspectCandidateGuide,
    shouldShowSuspectInterviewGuide,
    shouldShowCrimeReportHandoff,
    shouldShowMastermindHandoffGuide,
    shouldShowTriggerCheckGuide,
    shouldShowWitnessIdentityGuide,
    shouldShowWitnessTrailGuide,
    studentCaseHeaderRef,
    studentDraftQuery,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    studentEvidencePrompt,
    studentLastQueryExecution,
    studentQueryRunnerResetKey,
    studentRestoredExecution,
    studentObjective,
    pinnedReportId,
    studentQueryFailureGuidance,
    studentQueryReinforcement,
    studentQueryRunnerInstruction,
    studentSamuelReaction,
    studentScene,
    studentSchema,
    studentSchemaError,
    studentSchemaLoading,
    studentSuspectTheoryDraft,
    studentSuspectTheoryError,
    studentSuspectTheoryLoading,
    studentSuspectTheoryResult,
    studentView,
    visibleMilestones,
    witnessChecklistItems
  };
}
