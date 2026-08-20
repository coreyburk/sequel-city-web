import breakthroughScene from "./assets/scenes/scene-breakthrough.png";
import crimeLedgerScene from "./assets/scenes/scene-crime-ledger.png";
import misfireScene from "./assets/scenes/scene-misfire.png";
import murderBoardScene from "./assets/scenes/scene-murder-board.png";
import recordsVaultScene from "./assets/scenes/scene-records-vault.png";
import mastermindTransitionScene from "./assets/scenes/scene-samuel-evidence-board-review.png";
import studentInitiativeScene from "./assets/scenes/scene-student-initiative.png";
import triggerManRevealScene from "./assets/scenes/trigger-man-reveal.png";
import samuelBreakthroughAvatar from "./assets/avatars/avatar-samuel-breakthrough-discovered.png";
import samuelConfirmedAvatar from "./assets/avatars/avatar-samuel-confirmed-clue.png";
import samuelLeadUnlockedAvatar from "./assets/avatars/avatar-samuel-lead-unlocked.png";
import samuelMentorAvatar from "./assets/avatars/avatar-samuel-mentor-neutral.png";
import samuelSkepticalAvatar from "./assets/avatars/avatar-samuel-skeptical-misread.png";

export type StudentView = "briefing" | "workbench" | "case-board";
export const CASE_004_ENTRY_ID = "case-004";
export type MilestoneId =
  | "crime-type"
  | "crime-scene-filter"
  | "witness-clues"
  | "gym-chain"
  | "suspect-interview"
  | "trigger-check"
  | "mastermind-profile"
  | "mastermind-trace";

export type StoryBrief = {
  caseNumber: string;
  caseName: string;
};

export type CaseMilestone = {
  id: string;
  title: string;
  cluePrompt: string;
  matches: (sql: string) => boolean;
};

export type SamuelBriefingStep = {
  id: string;
  label: string;
  title: string;
  guidance: string;
  observationPrompt: string;
  nextStep: string;
  successSignal: string;
  queryDraft: string;
};

export type EvidenceNotebookEntry = {
  id: string;
  detail: string;
  sourceLabel?: string;
  isManual?: boolean;
  notebookPage?: "mastermind";
  clueTags?: string[];
};

export type PendingEvidenceStep =
  | "crime-type"
  | "crime-scene-filter"
  | "witness-names"
  | "gym-lead"
  | "suspect-candidate"
  | "suspect-interview"
  | null;
export type StudentEvidenceFeedbackTone = "neutral" | "success" | "error" | "advisory";
export type StudentClueLogStatus = "logged" | "deferred" | "rejected" | "duplicate";
export type StudentClueLogOutcome = {
  status: StudentClueLogStatus;
  message: string;
};
export type CaseReviewStatus = "idle" | "correct" | "error";
export type SamuelVisualState = "neutral" | "skeptical" | "confirmed" | "breakthrough" | "lead-unlocked";
export type CaseMomentumState =
  | "Briefing"
  | "Query Active"
  | "Clue Pending"
  | "Evidence Pinned"
  | "Lead Unlocked"
  | "Misread";

export type StudentSceneVisual =
  | "crime-ledger"
  | "records-vault"
  | "murder-board"
  | "student-initiative"
  | "breakthrough"
  | "trigger-man-reveal"
  | "mastermind-transition"
  | "misfire";

export type LeadBoardCard = {
  id: string;
  title: string;
  detail: string;
  status: "active" | "ready" | "locked";
};

export type MastermindEndgamePhase =
  | "inactive"
  | "profile"
  | "candidate-narrowing"
  | "identity-lookup"
  | "event-schedule-lookup"
  | "event-registration-cross-check"
  | "employment-cross-check"
  | "confirmed";

export type StudentSceneDescriptor = {
  visual: StudentSceneVisual;
  alt: string;
  imageSrc: string;
};

export type CaseReviewChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type CaseReviewCheck = {
  id: string;
  prompt: string;
  choices: CaseReviewChoice[];
  success: string;
  coaching: string;
};

export const CASE_004_BRIEF: StoryBrief = {
  caseNumber: "004",
  caseName: "The SQL City Murder"
};

export const CASE_004_DIFFICULTY_LABEL = "Guided";

export const SAMUEL_MENTOR_INTRO =
  "I'm Samuel Tupleton, your data detective mentor. I will keep the case honest: no guesses, no spoilers, just one verified database clue at a time.";

export const SAMUEL_HEADER_INTRO =
  "I'll guide the investigation while you do the detective work: inspect the data, prove each clue, and decide what to query next.";

export const CASE_BACKGROUND =
  "A murder was reported in Sequel City on January 15th, 2023. The case file does not hand you suspects. It gives you records, and your job is to prove which records matter.";

export const INVESTIGATION_OVERVIEW = [
  "Start with broad tables, then narrow with facts you can prove.",
  "Run SQL to inspect records, filter carefully, and log only evidence that appears in your results.",
  "Each confirmed clue unlocks the next lead, moving from the crime report to witnesses and then deeper suspect trails."
];

export const KNOWN_CASE_FACTS = [
  "January 15th, 2023: a murder was reported in Sequel City.",
  "The case does not begin with suspects. It begins with verified database facts.",
  "The first move is to prove which CrimeID means Murder before filtering reports.",
  "The target report row should point toward witness information you can verify later."
];

export const CASE_004_MILESTONES: CaseMilestone[] = [
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
      (
        sql.includes("fitnflabclub") &&
        sql.includes("where") &&
        (sql.includes("fitmemberid") || sql.includes("fitmembershipstatus"))
      ) ||
      (
        sql.includes("fitnflabclubcheckin") &&
        sql.includes("where") &&
        (sql.includes("fitmemberid") || sql.includes("fitcheckindate"))
      )
  },
  {
    id: "suspect-interview",
    title: "Review the gym lead interview",
    cluePrompt: "Use InterviewLog to see what the gym-linked suspect actually said, then pin the row that best shows what his own words add to the case.",
    matches: () => false
  },
  {
    id: "trigger-check",
    title: "Test your first suspect theory",
    cluePrompt: "Once the interview review is complete, use Evidence Board to decide whether you are ready to test the theory.",
    matches: () => false
  },
  {
    id: "mastermind-profile",
    title: "Build the mastermind profile",
    cluePrompt:
      "Pull distinct transcript clues together until the hidden client's profile is specific enough to narrow real records.",
    matches: () => false
  },
  {
    id: "mastermind-trace",
    title: "Narrow the mastermind candidates",
    cluePrompt:
      "Use the completed profile to narrow DriversLicense candidates before you make the final mastermind call.",
    matches: () => false
  }
];

export const SAMUEL_TUPLETON_STEPS: SamuelBriefingStep[] = [
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

export const SQL_CITY_REPORT_DRAFT =
  "SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080\n  AND ReportCity = 'SQL City'";
export const TARGET_REPORT_REVIEW_QUERY =
  "SELECT *\nFROM CrimeSceneReport\nWHERE ReportID = 10975";
export const WITNESS_INTERVIEW_DRAFT =
  "SELECT *\nFROM InterviewLog";
export const WITNESS_NAME_LOOKUP_DRAFT = "SELECT *\nFROM PersonsOfInterest";
export const WITNESS_NAME_LOOKUP_GUIDANCE =
  "Both witness PersonIDs are pinned now. Use PersonsOfInterest to identify the two witness names first. Start broad if you need the columns, then narrow the lookup with both pinned PersonIDs from Case File before you log any names.";
export const GYM_LEAD_GUIDANCE =
  "The witness names are pinned now. Build your next query with FitNFlabClub, then use the gym bag clue that the membership starts with 48Z and only gold members have those bags to narrow the list yourself.";
export const GYM_SUSPECT_LOOKUP_GUIDANCE =
  "The gym clue is pinned now. Open Case File, use the pinned gym lead PersonID from Pinned Facts, and identify that person in PersonsOfInterest before you test any suspect theory.";
export const TRIGGER_CHECK_GUIDANCE =
  "Once you pin the strongest interview row from the gym-linked suspect, move to Evidence Board and decide whether the case is strong enough to test your first suspect theory.";

export const EXPECTED_MURDER_REPORT = {
  reportId: "10975",
  reportCity: "sql city",
  reportDate: "20230115"
};

type MastermindPhaseTextInput = {
  phase: MastermindEndgamePhase;
  confirmedTriggerSuspectName?: string | null;
  mastermindSharedEventIds?: string[];
  solvedMastermindName?: string | null;
};

export function getMastermindEndgameTitle({
  phase
}: MastermindPhaseTextInput): string {
  switch (phase) {
    case "profile":
      return "Mastermind Profile";
    case "candidate-narrowing":
      return "Mastermind Candidate Narrowing";
    case "identity-lookup":
      return "Mastermind Identity Lookup";
    case "event-schedule-lookup":
      return "Symphony Hall Event Search";
    case "event-registration-cross-check":
      return "Symphony Hall Registration Cross-Check";
    case "employment-cross-check":
      return "Employment Tie-Break";
    case "confirmed":
      return "Case Closed";
    default:
      return "Samuel's Guidance";
  }
}

export function getMastermindEndgameObjective({
  phase,
  confirmedTriggerSuspectName
}: MastermindPhaseTextInput): string {
  const confirmedTriggerLabel = getConfirmedTriggerLabel(confirmedTriggerSuspectName);
  const possessiveLabel = getPossessiveLabel(confirmedTriggerLabel);

  switch (phase) {
    case "profile":
      return `Build a mastermind profile from ${possessiveLabel} murder-report transcript clues.`;
    case "candidate-narrowing":
      return "Use the completed mastermind profile to narrow DriversLicense to the strongest real candidates.";
    case "identity-lookup":
      return "Identify both shortlisted women in PersonsOfInterest from the pinned LicenseIDs.";
    case "event-schedule-lookup":
      return "Find which EventIDs match the killer's December 2022 Symphony Hall meetings.";
    case "event-registration-cross-check":
      return "Use EventRegistration to check whether the Symphony trail separates the two candidates.";
    case "employment-cross-check":
      return "Use the paid-hit and wealth clue to compare the remaining candidates' Employment records.";
    case "confirmed":
      return "The mastermind is confirmed. The contract chain is solved.";
    default:
      return "";
  }
}

export function getMastermindEndgameGuidance({
  phase,
  confirmedTriggerSuspectName,
  mastermindSharedEventIds,
  solvedMastermindName
}: MastermindPhaseTextInput): string {
  const confirmedTriggerLabel = getConfirmedTriggerLabel(confirmedTriggerSuspectName);
  const possessiveLabel = getPossessiveLabel(confirmedTriggerLabel);
  const solvedLabel = solvedMastermindName?.trim() || "The mastermind";

  switch (phase) {
    case "profile":
      return `${confirmedTriggerLabel} is confirmed. Re-read ${possessiveLabel} murder-report transcript and pin one clue at a time until the hidden client's profile is specific enough to leave InterviewLog.`;
    case "candidate-narrowing":
      return "Query DriversLicense next and start with the BMW M8 clue. Once that base filter is in place, keep layering only the profile details the transcript actually proved.";
    case "identity-lookup":
      return "Use the pinned candidate LicenseIDs in PersonsOfInterest next. Log both identity rows so their returned PersonIDs are ready for the event trail.";
    case "event-schedule-lookup":
      return "Follow the killer's own clue trail next: three meetings last December, next to Symphony Hall, dressed like date night. Query EventSchedule with the December 2022 and Symphony clues, then carry the returned EventIDs into EventRegistration.";
    case "event-registration-cross-check":
      return mastermindSharedEventIds && mastermindSharedEventIds.length > 0
        ? "The Symphony trail does not close the case by itself. If both candidates remain tied to those meetings, use the paid-hit and wealth clue next in Employment."
        : "Use the returned Symphony EventIDs in EventRegistration and compare both women's rows against the same event set before you move to the final tie-break.";
    case "employment-cross-check":
      return "Use Employment with the candidates' pinned SSNs. Compare income and job context to decide which remaining woman fits the wealthy client who paid for the hit.";
    case "confirmed":
      return `${solvedLabel} is confirmed as the mastermind. The verdict holds, the contract chain is complete, and the case can close.`;
    default:
      return "";
  }
}

function getPossessiveLabel(name: string): string {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return "the confirmed suspect's";
  }

  return trimmedName.endsWith("s") ? `${trimmedName}'` : `${trimmedName}'s`;
}

function getConfirmedTriggerLabel(name?: string | null): string {
  const trimmedName = name?.trim();
  return trimmedName && trimmedName.length > 0 ? trimmedName : "the confirmed suspect";
}

export function getMastermindHandoffGuidance(input: {
  confirmedTriggerSuspectName?: string | null;
  hasMastermindClues?: boolean;
  hasCompleteMastermindProfile?: boolean;
  shouldCrossCheckWitnessNotes?: boolean;
  mastermindCandidateCount?: number;
  mastermindSharedEventIds?: string[];
  shouldPivotToSymphonyHallTrail?: boolean;
  hasPinnedMastermindIdentities?: boolean;
  hasStartedMastermindIdentityLookup?: boolean;
  hasResolvedMastermindIdentityLookup?: boolean;
  isMastermindEventRegistrationActive?: boolean;
  hasMastermindEventRegistrationFilters?: boolean;
  isMastermindEmploymentActive?: boolean;
  hasMastermindEmploymentFilters?: boolean;
  isMastermindEventJoinActive?: boolean;
  isMastermindEventScheduleActive?: boolean;
  hasMastermindDecemberEventFilter?: boolean;
  hasMastermindSymphonyEventFilter?: boolean;
}): string {
  const confirmedTriggerLabel = getConfirmedTriggerLabel(
    input.confirmedTriggerSuspectName
  );
  const possessiveLabel = getPossessiveLabel(confirmedTriggerLabel);

  if (input.isMastermindEventJoinActive || input.isMastermindEventScheduleActive) {
    if (!input.hasMastermindDecemberEventFilter) {
      return "Follow the killer's clue trail: they met three times last December near Symphony Hall. Add the December 2022 clue to EventSchedule next.";
    }

    if (!input.hasMastermindSymphonyEventFilter) {
      return "The December filter is in place. Add the Symphony Hall clue next (for example: EventName LIKE '%Symphony%') so you can test the killer's meeting-location clue.";
    }

    return "You found the event rows that fit the killer's December Symphony Hall meeting clue. Use their EventIDs in EventRegistration next.";
  }

  if (input.isMastermindEventRegistrationActive) {
    if (
      input.hasMastermindEventRegistrationFilters &&
      (input.mastermindSharedEventIds?.length ?? 0) > 0
    ) {
      return "The Symphony trail does not separate the candidates. Use Employment with their pinned SSNs next.";
    }

    return input.hasMastermindEventRegistrationFilters
      ? "If both candidates remain tied to the same Symphony event set, use Employment with their pinned SSNs next."
      : "Use the Symphony EventIDs plus both pinned EventPersonIDs in EventRegistration next. If you mix OR with AND, wrap each OR group in parentheses before you combine them.";
  }

  if (input.isMastermindEmploymentActive) {
    return input.hasMastermindEmploymentFilters
      ? "Compare the candidates' income and job context. The wealthy paid-hit clue should break the tie."
      : "Use the candidates' pinned SSNs in Employment next so the paid-hit and wealth clue can break the tie.";
  }

  if (input.hasPinnedMastermindIdentities) {
    return "Follow the killer's clue trail into EventSchedule next: three meetings last December, next to Symphony Hall, dressed up like date night.";
  }

  if (input.hasResolvedMastermindIdentityLookup) {
    return "Log both identity rows first so their returned PersonIDs are ready for EventRegistration.";
  }

  if (input.hasStartedMastermindIdentityLookup) {
    return "Stay with PersonsOfInterest until both candidate LicenseIDs resolve into real women.";
  }

  if (input.shouldPivotToSymphonyHallTrail && (input.mastermindCandidateCount ?? 0) >= 2) {
    return "Use the pinned LicenseIDs in PersonsOfInterest to identify both women.";
  }

  if (input.hasCompleteMastermindProfile) {
    return `Step 1: leave ${possessiveLabel} transcript trail and query DriversLicense. Step 2: add BMW M8. Step 3: add female, red hair, and height between 65 and 67 inches.`;
  }

  if (input.hasMastermindClues) {
    return input.shouldCrossCheckWitnessNotes
      ? `Review the clues you pinned from ${possessiveLabel} murder-report transcript, then compare them against your witness notes. Check whether the BMW, Symphony Hall, and appearance clues could point to the same woman who ordered the hit.`
      : `Review the clues you pinned from ${possessiveLabel} murder-report transcript and decide which details still matter as you build a profile of the person who ordered the hit.`;
  }

  return `${confirmedTriggerLabel} is confirmed. The first layer is solved. Now review ${possessiveLabel} murder-report transcript trail and decide which clues point toward the person who ordered the hit.`;
}

export function getSamuelVisualState(input: {
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
}): SamuelVisualState {
  if (input.studentEvidenceFeedbackTone === "error") {
    return "skeptical";
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    if (input.completedMilestones["mastermind-trace"]) {
      return "breakthrough";
    }

    if (input.completedMilestones["trigger-check"]) {
      return "neutral";
    }

    return input.completedMilestones["crime-scene-filter"] ? "lead-unlocked" : "confirmed";
  }

  if (input.completedMilestones["trigger-check"] && !input.completedMilestones["mastermind-trace"]) {
    return "neutral";
  }

  return "neutral";
}

export function getSamuelAvatarSrc(state: SamuelVisualState): string {
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

export function getCaseMomentum(input: {
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

export function getStudentSceneVisual(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  studentView: StudentView;
  completedMilestones: Partial<Record<MilestoneId, boolean>>;
  hasMastermindClues?: boolean;
  shouldShowTriggerReveal?: boolean;
}): StudentSceneDescriptor {
  if (input.studentEvidenceFeedbackTone === "error") {
    return {
      visual: "misfire",
      alt: "Case board crossed by red lines over the wrong evidence cards",
      imageSrc: misfireScene
    };
  }

  if (input.studentEvidenceFeedbackTone === "success") {
    if (input.shouldShowTriggerReveal) {
      return {
        visual: "trigger-man-reveal",
        alt: "Evidence board converging on the hired killer as the case cracks open into a deeper conspiracy",
        imageSrc: triggerManRevealScene
      };
    }

    if (
      input.completedMilestones["trigger-check"] &&
      !input.completedMilestones["mastermind-trace"] &&
      input.hasMastermindClues
    ) {
      return {
        visual: "mastermind-transition",
        alt: "Samuel reviewing a shadowier second layer of evidence after the hired killer has been identified",
        imageSrc: mastermindTransitionScene
      };
    }

    return {
      visual: "breakthrough",
      alt: "Glowing evidence board with a confirmed clue pinned at the center",
      imageSrc: breakthroughScene
    };
  }

  if (input.shouldShowTriggerReveal) {
    return {
      visual: "trigger-man-reveal",
      alt: "Evidence board converging on the hired killer as the case cracks open into a deeper conspiracy",
      imageSrc: triggerManRevealScene
    };
  }

  if (
    input.completedMilestones["trigger-check"] &&
    !input.completedMilestones["mastermind-trace"] &&
    input.hasMastermindClues
  ) {
    return {
      visual: "mastermind-transition",
      alt: "Samuel reviewing a shadowier second layer of evidence after the hired killer has been identified",
      imageSrc: mastermindTransitionScene
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

export function getSamuelReaction(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
  confirmedTriggerSuspectName?: string | null;
  studentDraftQuery: string | null;
  studentLastQuerySql: string | null;
}): string {
  const normalizedDraftSql = normalizeGuidanceSql(input.studentDraftQuery);
  const normalizedLastQuerySql = normalizeGuidanceSql(input.studentLastQuerySql);
  const hasQueuedReportArchiveScan =
    normalizedDraftSql.includes("from crimescenereport") && !normalizedDraftSql.includes("where");
  const hasQueuedMurderFilter =
    normalizedDraftSql.includes("from crimescenereport") &&
    normalizedDraftSql.includes("crimeid = 1080") &&
    !normalizedDraftSql.includes("reportcity");
  const hasQueuedCityFilter =
    normalizedDraftSql.includes("from crimescenereport") &&
    normalizedDraftSql.includes("crimeid = 1080") &&
    normalizedDraftSql.includes("reportcity = 'sql city'");
  const hasQueuedWitnessNameFilter =
    normalizedDraftSql.includes("from personsofinterest") &&
    normalizedDraftSql.includes("where") &&
    normalizedDraftSql.includes("personid");
  const hasQueuedGymLeadScan =
    normalizedDraftSql.includes("from fitnflabclub") && !normalizedDraftSql.includes("where");
  const justOpenedReportBacklog =
    normalizedLastQuerySql.includes("from crimescenereport") &&
    !normalizedLastQuerySql.includes("where");
  const justIsolatedMurderReports =
    normalizedLastQuerySql.includes("from crimescenereport") &&
    normalizedLastQuerySql.includes("crimeid") &&
    !normalizedLastQuerySql.includes("reportcity");
  const justOpenedWitnessDirectory =
    normalizedLastQuerySql.includes("from personsofinterest") &&
    !normalizedLastQuerySql.includes("where");
  const justOpenedGymMembershipTable =
    normalizedLastQuerySql.includes("from fitnflabclub") &&
    !normalizedLastQuerySql.includes("where");

  if (input.studentEvidenceFeedbackTone === "error" && input.studentEvidenceFeedback) {
    return input.studentEvidenceFeedback;
  }

  if (input.studentEvidenceFeedbackTone === "success" && input.pendingEvidenceStep === null) {
    if (input.completedMilestones["trigger-check"]) {
      return getMastermindHandoffGuidance({
        confirmedTriggerSuspectName: input.confirmedTriggerSuspectName
      });
    }

    if (input.completedMilestones["suspect-interview"]) {
      return "You reviewed the gym-linked suspect's interview. Click the Evidence Board tab now and decide whether the case is strong enough to test your first suspect theory.";
    }

    if (input.completedMilestones["gym-chain"]) {
      return "The gym-linked name is pinned. Review that person's InterviewLog next and decide what his own words actually prove.";
    }

    if (input.studentEvidenceFeedback?.includes("Find the other repeated PersonID")) {
      return "One witness bundle is pinned. Stay with InterviewLog, keep the report tied to 10975, and find the second repeated PersonID before you move on.";
    }

    if (input.completedMilestones["witness-clues"]) {
      return WITNESS_NAME_LOOKUP_GUIDANCE;
    }

    if (input.completedMilestones["crime-scene-filter"]) {
      return "Nice. The key report row is in your notebook. Head back to the Query Lab, pull up the witness records tied to that report, and look for repeated person IDs - those repeats sound like real witnesses at the scene.";
    }

    if (input.studentEvidenceFeedback?.includes("report backlog")) {
      return "Good. You opened the report backlog. I queued the murder-only filter for you next. Run it, then decide whether the report pile still needs one more narrowing clue.";
    }

    if (input.studentEvidenceFeedback?.includes("pile is still too large")) {
      return "That filter caught the murder reports, but there are still too many. I queued the SQL City filter for you next because the briefing puts this case in Sequel City - run it, then look for the January 15th report.";
    }

    return "Good. CrimeID 1080 is locked in. Stay in Query Lab and inspect the report archive next so you can start narrowing the case.";
  }

  if (!input.completedMilestones["crime-type"] && normalizedDraftSql.includes("from crimetype")) {
    return "Start with CrimeType. Find the row labeled Murder, then log its CrimeID before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "The crime ledger should give you one exact code for Murder. Find that code before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "You have the right report table now. Combine the murder code with SQL City, then log the report row that matches the case date.";
  }

  if (input.pendingEvidenceStep === "witness-names") {
    if (hasQueuedWitnessNameFilter || justOpenedWitnessDirectory) {
      return "The people table is still too broad on its own. Open Case File, use both pinned witness PersonIDs to narrow PersonsOfInterest, then log the two matching name rows.";
    }

    return WITNESS_NAME_LOOKUP_GUIDANCE;
  }

  if (input.pendingEvidenceStep === "gym-lead") {
    if (hasQueuedGymLeadScan || justOpenedGymMembershipTable) {
      return "Start with the membership table, then build your own narrowing filters from the witness clues: the gym bag membership starts with 48Z, and only gold members have those bags.";
    }

    return GYM_LEAD_GUIDANCE;
  }

  if (input.pendingEvidenceStep === "suspect-candidate") {
    if (
      normalizedLastQuerySql.includes("from personsofinterest") &&
      !normalizedLastQuerySql.includes("where")
    ) {
      return "That people table is still too broad. Open Case File, use the pinned gym lead PersonID from Pinned Facts to narrow PersonsOfInterest, then log the one matching person row.";
    }

    return GYM_SUSPECT_LOOKUP_GUIDANCE;
  }

  if (input.pendingEvidenceStep === "suspect-interview") {
    if (
      normalizedLastQuerySql.includes("from interviewlog") &&
      !normalizedLastQuerySql.includes("where")
    ) {
      return "That transcript table is still too broad. Stay with InterviewLog, add the pinned gym lead PersonID, and read what the gym-linked suspect actually said before you decide what his own words prove.";
    }

    return "Review the gym-linked suspect's InterviewLog rows and pin the one row that best shows what his own words actually add to the case.";
  }

  if (input.completedMilestones["trigger-check"] && !input.completedMilestones["mastermind-profile"]) {
    return getMastermindHandoffGuidance({
      confirmedTriggerSuspectName: input.confirmedTriggerSuspectName
    });
  }

  if (input.completedMilestones["trigger-check"]) {
    return getMastermindHandoffGuidance({
      confirmedTriggerSuspectName: input.confirmedTriggerSuspectName
    });
  }

  if (input.completedMilestones["suspect-interview"]) {
    return "You pinned the key interview row. Click the Evidence Board tab now, review what the suspect's own words now prove, and decide whether the case is strong enough to test your first theory.";
  }

  if (input.completedMilestones["gym-chain"]) {
    return "You have the gym-linked name. Pull that person's InterviewLog rows next and see what his own words tell you before you commit to a theory.";
  }

  if (input.completedMilestones["witness-clues"]) {
    return GYM_LEAD_GUIDANCE;
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "The witness trail is open. Pull the witness records tied to your pinned report and watch for repeated person IDs - each repeat is one real witness at the scene.";
  }

  if (hasQueuedCityFilter || justIsolatedMurderReports) {
    return "That filter caught the murder reports, but there are still too many. I queued the SQL City filter for you next because the briefing puts this case in Sequel City - run it, then look for the January 15th report.";
  }

  if (hasQueuedMurderFilter) {
    return "Good. You opened the report backlog. I queued the murder-only filter for you next. Run it, then decide whether the report pile still needs one more narrowing clue.";
  }

  if (justOpenedReportBacklog) {
    return "Good. You opened the report backlog. I queued the murder-only filter for you next. Run it, then decide whether the report pile still needs one more narrowing clue.";
  }

  if (hasQueuedReportArchiveScan) {
    return "Good. CrimeID 1080 is locked in. Stay in Query Lab and inspect the report archive next so you can start narrowing the case.";
  }

  if (input.samuelStage === 1) {
    return "You proved the crime code. Widen your view, scan the report archive, and decide which detail deserves your next filter.";
  }

  return "The case only moves when each clue is precise. Let the data tell you what deserves your next query.";
}

function normalizeGuidanceSql(sql: string | null): string {
  return (sql ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function getLeadBoardCards(
  completedMilestones: Record<MilestoneId, boolean>,
  pendingEvidenceStep: PendingEvidenceStep,
  confirmedTriggerSuspectName?: string | null,
  options?: {
    hasPinnedMastermindIdentities?: boolean;
    isMastermindEventRegistrationActive?: boolean;
    isMastermindEventScheduleActive?: boolean;
  }
): LeadBoardCard[] {
  if (completedMilestones["trigger-check"] && !completedMilestones["mastermind-trace"]) {
    const confirmedTriggerLabel = getConfirmedTriggerLabel(confirmedTriggerSuspectName);
    const possessiveLabel = getPossessiveLabel(confirmedTriggerLabel);

    if (!completedMilestones["mastermind-profile"]) {
      return [
        {
          id: "mastermind-profile",
          title: "Mastermind Profile",
          detail:
            `${confirmedTriggerLabel} is confirmed. Re-read ${possessiveLabel} murder-report transcript and pin every clue that describes who hired the hit.`,
          status: "active"
        }
      ];
    }

    if (options?.isMastermindEventScheduleActive) {
      return [
        {
          id: "mastermind-event-schedule",
          title: "Mastermind Event Schedule Cross-Check",
          detail:
            "Use EventSchedule to identify the December 2022 Symphony EventIDs before you go back to EventRegistration.",
          status: "active"
        }
      ];
    }

    if (options?.isMastermindEventRegistrationActive) {
      return [
        {
          id: "mastermind-event-registration",
          title: "Mastermind Event Trail Comparison",
          detail:
            "Use the Symphony EventIDs with both women's PersonIDs in EventRegistration and compare the returned rows. If you mix OR with AND, wrap each OR group in parentheses before you combine them.",
          status: "active"
        }
      ];
    }

    if (options?.hasPinnedMastermindIdentities) {
      return [
        {
          id: "mastermind-identity-trail",
          title: "Mastermind Event Trail Comparison",
          detail:
            "Both women are identified now. Use EventSchedule first to find the December 2022 Symphony EventIDs.",
          status: "active"
        }
      ];
    }

    return [
      {
        id: "mastermind-trail",
        title: "Mastermind Narrowing",
        detail:
          "You have the transcript profile. Start in DriversLicense, add the vehicle clue first, then add the appearance clues.",
        status: "active"
      }
    ];
  }

  if (pendingEvidenceStep === "suspect-candidate") {
    return [
      {
        id: "suspect-candidate-lookup",
        title: "Gym Suspect Lookup",
        detail:
          "Stay with PersonsOfInterest until the pinned gym lead PersonID turns into one identified person.",
        status: "active"
      }
    ];
  }

  if (pendingEvidenceStep === "suspect-interview") {
    return [
        {
          id: "suspect-interview-review",
          title: "Review the Gym Lead Interview",
          detail:
          "Read the gym-linked suspect's InterviewLog rows, then pin the one row that best shows what his own words add to the case.",
          status: "active"
        }
      ];
  }

  if (completedMilestones["suspect-interview"]) {
    return [
      {
        id: "trigger-check",
        title: "First Suspect Theory",
        detail:
          "The key interview row is pinned. Use Evidence Board to decide whether you are ready to test your first suspect theory.",
        status: "ready"
      }
    ];
  }

  if (completedMilestones["gym-chain"]) {
    return [
      {
        id: "suspect-interview",
        title: "Review the Gym Lead Interview",
        detail:
          "Now that the gym-linked suspect is named, review what he said in InterviewLog and pin the row that matters most before you test any theory.",
        status: "active"
      }
    ];
  }

  if (pendingEvidenceStep === "witness-names") {
    return [
      {
        id: "witness-name-lookup",
        title: "Witness Name Lookup",
        detail:
          "Stay with PersonsOfInterest until both witness names are pinned. The gym trail can wait.",
        status: "active"
      }
    ];
  }

  if (pendingEvidenceStep === "gym-lead") {
    return [
      {
        id: "gym-membership-lead",
        title: "Gym Membership Lead",
        detail:
          "Start with FitNFlabClub, then narrow the member list with the 48Z clue and gold-status clue.",
        status: "active"
      }
    ];
  }

  if (completedMilestones["witness-clues"]) {
    return [
      {
        id: "gym-lead",
        title: "Gym Lead",
        detail:
          "First resolve the witness names with PersonsOfInterest, then carry the gym clue into membership and check-in records.",
        status: "active"
      }
    ];
  }

  if (completedMilestones["crime-scene-filter"]) {
    return [
      {
        id: "witness-discovery",
        title: "Witness Discovery",
        detail: "Witness trail.",
        status: "ready"
      }
    ];
  }

  return [];
}

export function getCaseReviewCheck(
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

export function getStudentObjective(input: {
  completedMilestones: Record<MilestoneId, boolean>;
  confirmedTriggerSuspectName?: string | null;
  hasPinnedWitnessNames: boolean;
  hasPinnedMastermindIdentities?: boolean;
  hasResolvedMastermindIdentityLookup?: boolean;
  isMastermindEventRegistrationActive?: boolean;
  isMastermindEventJoinActive?: boolean;
  isMastermindEventScheduleActive?: boolean;
  shouldPivotToSymphonyHallTrail?: boolean;
  pendingEvidenceStep: PendingEvidenceStep;
  studentView: StudentView;
  witnessBundleCount: number;
}): string {
  if (input.studentView === "briefing") {
    return "Prove which CrimeID belongs to Murder.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "Prove which CrimeID belongs to Murder.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "Pin the SQL City murder report from January 15th, 2023.";
  }

  if (input.pendingEvidenceStep === "witness-names") {
    return "Pin the two witness names tied to the PersonIDs you already proved.";
  }

  if (input.pendingEvidenceStep === "gym-lead") {
    return "Use the gym bag clue to narrow the membership records.";
  }

  if (input.pendingEvidenceStep === "suspect-candidate") {
    return "Identify the gym-linked person's name from the pinned PersonID.";
  }

  if (input.pendingEvidenceStep === "suspect-interview") {
    return "Review what the gym-linked suspect said in his interview log and pin the row that best shows what his own words add to the case.";
  }

  if (input.completedMilestones["trigger-check"] && !input.completedMilestones["mastermind-profile"]) {
    const confirmedTriggerLabel = getConfirmedTriggerLabel(
      input.confirmedTriggerSuspectName
    );
    const possessiveLabel = getPossessiveLabel(confirmedTriggerLabel);

    return `Build a mastermind profile from ${possessiveLabel} murder-report transcript clues.`;
  }

  if (input.completedMilestones["trigger-check"] && !input.completedMilestones["mastermind-trace"]) {
    if (input.isMastermindEventJoinActive || input.isMastermindEventScheduleActive) {
      return "Use the killer's December 2022 Symphony Hall meeting clue to find the right EventIDs.";
    }

    if (input.isMastermindEventRegistrationActive) {
      return "Use the Symphony EventIDs to compare both women's EventRegistration rows. If you mix OR with AND, wrap each OR group in parentheses before you combine them.";
    }

    if (input.hasResolvedMastermindIdentityLookup || input.hasPinnedMastermindIdentities) {
      return "Use the killer's December 2022 Symphony Hall meeting clue to find the right EventIDs.";
    }

    if (input.shouldPivotToSymphonyHallTrail) {
      return "Identify both shortlisted women in PersonsOfInterest from the pinned LicenseIDs.";
    }

    return "Use the completed mastermind profile to narrow DriversLicense first.";
  }

  if (input.completedMilestones["suspect-interview"]) {
    return "Review the pinned interview clue and decide whether the gym-linked suspect's own words support your first suspect theory.";
  }

  if (input.completedMilestones["gym-chain"]) {
    return "Review the gym-linked suspect's interview and pin the strongest row before you think about testing a theory.";
  }

  if (input.completedMilestones["witness-clues"] && input.hasPinnedWitnessNames) {
    return "Track the gym lead.";
  }

  if (input.completedMilestones["witness-clues"]) {
    return "Identify the two witness names from the pinned PersonIDs, then follow the gym lead.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    if (input.witnessBundleCount === 1) {
      return "Find the second witness tied to the pinned report.";
    }

    return "Find both witnesses tied to the pinned report.";
  }

  if (input.completedMilestones["crime-type"]) {
    return "Narrow the report archive to the right case.";
  }

  return "Prove which CrimeID belongs to Murder.";
}

export function getCurrentAvailableLeads(
  completedMilestones: Record<MilestoneId, boolean>,
  pendingEvidenceStep: PendingEvidenceStep
): CaseMilestone[] {
  if (pendingEvidenceStep === "suspect-candidate") {
    return [];
  }

  if (pendingEvidenceStep === "suspect-interview") {
    return [];
  }

  if (completedMilestones["trigger-check"] && !completedMilestones["mastermind-profile"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "mastermind-profile");
  }

  if (completedMilestones["trigger-check"] && !completedMilestones["mastermind-trace"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "mastermind-trace");
  }

  if (completedMilestones["suspect-interview"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "trigger-check");
  }

  if (completedMilestones["gym-chain"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "suspect-interview");
  }

  if (pendingEvidenceStep === "witness-names") {
    return [];
  }

  if (pendingEvidenceStep === "gym-lead") {
    return [];
  }

  if (completedMilestones["witness-clues"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "gym-chain");
  }

  if (completedMilestones["crime-scene-filter"]) {
    return CASE_004_MILESTONES.filter((milestone) => milestone.id === "witness-clues");
  }

  return [];
}

export function getVisibleMilestones(
  completedMilestones: Record<MilestoneId, boolean>
): CaseMilestone[] {
  const visibleIds: MilestoneId[] = [];

  for (const milestone of CASE_004_MILESTONES) {
    const milestoneId = milestone.id as MilestoneId;
    if (completedMilestones[milestoneId]) {
      visibleIds.push(milestoneId);
    }
  }

  const nextMilestone = CASE_004_MILESTONES.find(
    (milestone) => !completedMilestones[milestone.id as MilestoneId]
  );

  if (nextMilestone) {
    visibleIds.push(nextMilestone.id as MilestoneId);
  }

  return CASE_004_MILESTONES.filter((milestone) =>
    visibleIds.includes(milestone.id as MilestoneId)
  );
}
