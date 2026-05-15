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

export type ThreadStatusTransition = {
  from: ThreadStatus;
  to: ThreadStatus;
  reason: string;
};

export const THREAD_STATUS_ORDER: ThreadStatus[] = ["New", "Active", "Blocked", "Resolved"];

export const THREAD_STATUS_DESCRIPTIONS: Record<ThreadStatus, string> = {
  New: "Lead identified. You have not started pursuing this trail yet.",
  Active: "You are actively pursuing this trail with queries and evidence.",
  Blocked: "You have ruled out this trail or hit a dead end based on returned evidence.",
  Resolved: "You have confirmed this trail with database-backed evidence you logged."
};
