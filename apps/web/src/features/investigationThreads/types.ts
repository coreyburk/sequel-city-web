// Legacy manual status. Retained only for persistence backwards compatibility
// and for non-authoritative developer tooling. The student-facing Investigation
// Threads panel does not surface or rely on this value — see
// `DerivedThreadStatus` for the deterministic student-facing model.
export type ThreadStatus = "New" | "Active" | "Blocked" | "Resolved";

export type ThreadCategory =
  | "Crime Scene"
  | "Witness"
  | "Person"
  | "Vehicle"
  | "Timeline"
  | "Organization"
  | "Financial"
  | "Communication"
  | "Physical Evidence";

export type ThreadEvidenceLink = {
  notebookEntryId: string;
  detail: string;
  attachedAt: number;
};

export type InvestigationThread = {
  id: string;
  title: string;
  category: ThreadCategory;
  status: ThreadStatus;
  mentorGuidance: string;
  summary: string;
  evidenceLinks: ThreadEvidenceLink[];
  learnerNotes: string;
  createdAt: number;
  updatedAt: number;
};

// Deterministic student-facing status. Derived from completed milestones, the
// current Samuel-guided step, notebook signal, and learner-attached evidence.
// Students do not set this directly — the system tracks it.
export type DerivedThreadStatus =
  | "Current"
  | "Completed"
  | "Later"
  | "Needs Evidence";

export const DERIVED_THREAD_STATUS_LABELS: Record<DerivedThreadStatus, string> = {
  Current: "Current focus",
  Completed: "Guided step complete",
  Later: "Later trail",
  "Needs Evidence": "Needs evidence"
};

export const DERIVED_THREAD_STATUS_DESCRIPTIONS: Record<
  DerivedThreadStatus,
  string
> = {
  Current:
    "Samuel is guiding you through this trail right now. Stay on it before opening others.",
  Completed:
    "Case progress has already closed this trail. Open it only if you want to review what you proved.",
  Later:
    "This trail is not in play yet. It opens automatically when Samuel's guidance reaches it.",
  "Needs Evidence":
    "This trail is in scope but you have not logged supporting evidence yet."
};

// Retained for non-student developer tooling. Not part of the standard student
// workflow.
export const THREAD_STATUS_ORDER: ThreadStatus[] = [
  "New",
  "Active",
  "Blocked",
  "Resolved"
];

export const THREAD_STATUS_DESCRIPTIONS: Record<ThreadStatus, string> = {
  New: "Lead identified. You have not started pursuing this trail yet.",
  Active: "You are actively pursuing this trail with queries and evidence.",
  Blocked:
    "You have ruled out this trail or hit a dead end based on returned evidence.",
  Resolved:
    "You have confirmed this trail with database-backed evidence you logged."
};
