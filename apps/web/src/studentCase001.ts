export const CASE_001_ENTRY_ID = "case-001";

export const CASE_001_SKELETON_RELEASE_GATE = "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON";

export const CASE_001_SKELETON_BRIEF = {
  caseNumber: "001",
  caseName: "The Clocktower Poisoning",
  landingEyebrow: "Public Spectacle",
  tagline: "One public death. Too many witnesses. Not enough clean timing.",
  description:
    "A civic celebration turns lethal when a public clocktower ceremony ends with a poisoning in full view of the crowd.",
  atmosphere:
    "Brass mechanisms, civic ceremony, and a killing committed where everyone thought they could see everything.",
  caseShape:
    "A public poisoning case built for early timeline checks and clean clue narrowing.",
  skeletonStatus: "Development skeleton"
} as const;

export const CASE_001_TIMELINE_SLICE = {
  title: "Ceremony Timeline Check",
  prompt: "Which record-backed timing gap should be inspected first?",
  records: [
    {
      time: "10:00",
      label: "Clocktower bell test",
      detail: "Maintenance log records a normal chime test before the ceremony began."
    },
    {
      time: "10:12",
      label: "Mayor raises the toast",
      detail: "Program notes place the toast in full public view at the east platform."
    },
    {
      time: "10:14",
      label: "Mechanism access logged",
      detail: "A clockroom access mark appears between the public toast and the collapse."
    },
    {
      time: "10:16",
      label: "Collapse reported",
      detail: "Crowd statements agree the victim fell before the final bell sequence ended."
    }
  ],
  options: [
    {
      id: "crowd-size",
      label: "Count how many spectators were in the square.",
      feedback:
        "Crowd size matters later, but it does not explain the record gap between ceremony events."
    },
    {
      id: "toast-to-access",
      label: "Compare the public toast with the clockroom access mark.",
      isCorrect: true,
      feedback:
        "Correct. The useful first gap is where public visibility and the access record stop lining up."
    },
    {
      id: "bell-test",
      label: "Treat the bell test as the first suspicious movement.",
      feedback:
        "The bell test has a clean maintenance record. It is not the first timing gap to inspect."
    },
    {
      id: "collapse-only",
      label: "Start only from the collapse report.",
      feedback:
        "The collapse fixes the endpoint, but the better first check is the gap immediately before it."
    }
  ]
} as const;

export type Case001TimelineOptionId = (typeof CASE_001_TIMELINE_SLICE.options)[number]["id"];

export const CASE_001_SKELETON_STATE_VERSION = 1;

export type Case001SkeletonState = {
  version: typeof CASE_001_SKELETON_STATE_VERSION;
  selectedTimelineOptionId: Case001TimelineOptionId | null;
};

export function createDefaultCase001SkeletonState(): Case001SkeletonState {
  return {
    version: CASE_001_SKELETON_STATE_VERSION,
    selectedTimelineOptionId: null
  };
}

function isCase001TimelineOptionId(value: unknown): value is Case001TimelineOptionId {
  return (
    typeof value === "string" &&
    CASE_001_TIMELINE_SLICE.options.some((option) => option.id === value)
  );
}

export function normalizeCase001SkeletonState(value: unknown): Case001SkeletonState {
  const defaultState = createDefaultCase001SkeletonState();

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return defaultState;
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.version !== CASE_001_SKELETON_STATE_VERSION) {
    return defaultState;
  }

  return {
    version: CASE_001_SKELETON_STATE_VERSION,
    selectedTimelineOptionId: isCase001TimelineOptionId(candidate.selectedTimelineOptionId)
      ? candidate.selectedTimelineOptionId
      : null
  };
}

export function isCase001PlayableSkeletonEnabled(): boolean {
  return import.meta.env?.VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true";
}
