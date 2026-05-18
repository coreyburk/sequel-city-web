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

export type StudentView = "briefing" | "workbench" | "case-board";
export type MilestoneId =
  | "crime-type"
  | "crime-scene-filter"
  | "witness-clues"
  | "gym-chain"
  | "trigger-check"
  | "mastermind-trace";

export type StoryBrief = {
  caseNumber: string;
  caseName: string;
};

export type CaseMilestone = {
  id: MilestoneId;
  title: string;
  cluePrompt: string;
  matches: (sql: string) => boolean;
};

export type SamuelBriefingStep = {
  id: "crime-type" | "crime-scene-report" | "murder-filter";
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
};

export type PendingEvidenceStep = "crime-type" | "crime-scene-filter" | null;
export type StudentEvidenceFeedbackTone = "neutral" | "success" | "error";
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
  | "misfire";

export type LeadBoardCard = {
  id: string;
  title: string;
  detail: string;
  status: "active" | "ready" | "locked";
};

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

export const EXPECTED_MURDER_REPORT = {
  reportId: "10975",
  reportCity: "sql city",
  reportDate: "20230115"
};

export function getSamuelVisualState(input: {
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

export function getSamuelReaction(input: {
  samuelStage: number;
  pendingEvidenceStep: PendingEvidenceStep;
  studentEvidenceFeedback: string | null;
  studentEvidenceFeedbackTone: StudentEvidenceFeedbackTone;
  completedMilestones: Record<MilestoneId, boolean>;
}): string {
  if (input.studentEvidenceFeedbackTone === "error" && input.studentEvidenceFeedback) {
    return input.studentEvidenceFeedback;
  }

  if (input.studentEvidenceFeedbackTone === "success" && input.pendingEvidenceStep === null) {
    if (input.studentEvidenceFeedback?.includes("Insight Mark")) {
      return input.studentEvidenceFeedback;
    }

    if (input.completedMilestones["crime-scene-filter"]) {
      return "Nice. The key report row is in your notebook. Head back to the Query Lab, pull up the witness records tied to that report, and look for repeated person IDs — those repeats sound like real witnesses at the scene.";
    }

    if (input.studentEvidenceFeedback?.includes("report backlog")) {
      return "Good. You opened the report backlog. I queued a filter for you that uses the murder code you already proved — narrow the archive to murder reports before you keep going.";
    }

    if (input.studentEvidenceFeedback?.includes("pile is still too large")) {
      return "That filter caught the murder reports, but there are still too many. I queued the city filter for you because the briefing puts this case in Sequel City — combine both before looking for the January 15th report.";
    }

    return "Good. CrimeID 1080 is locked in. I queued the next query for you — open the Query Lab and inspect the report archive to find the entry for this crime.";
  }

  if (input.pendingEvidenceStep === "crime-type") {
    return "The crime ledger should give you one exact code for Murder. Find that code before you touch the report archive.";
  }

  if (input.pendingEvidenceStep === "crime-scene-filter") {
    return "You have the right report table now. Combine the murder code with SQL City, then log the report row that matches the case date.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "The witness trail is open. Pull the witness records tied to your pinned report and watch for repeated person IDs — each repeat is one real witness at the scene.";
  }

  if (input.samuelStage === 1) {
    return "You proved the crime code. Widen your view, scan the report archive, and decide which detail deserves your next filter.";
  }

  return "The case only moves when each clue is precise. Let the data tell you what deserves your next query.";
}

export function getLeadBoardCards(
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
  pendingEvidenceStep: PendingEvidenceStep;
  studentView: StudentView;
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

  if (input.completedMilestones["witness-clues"]) {
    return "Trace the gym lead from the witness clues.";
  }

  if (input.completedMilestones["crime-scene-filter"]) {
    return "Find both witnesses tied to the pinned report.";
  }

  if (input.completedMilestones["crime-type"]) {
    return "Narrow the report archive to the right case.";
  }

  return "Prove which CrimeID belongs to Murder.";
}

export function getCurrentAvailableLeads(
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

export function getVisibleMilestones(
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
