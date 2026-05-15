import type { InvestigationThread, ThreadCategory } from "./types";

export type AuthoredThreadSeed = {
  id: string;
  title: string;
  category: ThreadCategory;
  summary: string;
  mentorGuidance: string;
};

export const CASE_004_THREAD_SEEDS: AuthoredThreadSeed[] = [
  {
    id: "thread-crime-scene-report",
    title: "Anchor the crime scene report",
    category: "Crime Scene",
    summary:
      "Confirm the CrimeType code for murder and isolate the matching CrimeSceneReport row by city and date.",
    mentorGuidance:
      "Start with CrimeType to map the murder code, then filter CrimeSceneReport on that code plus the city and date in your briefing. Don't move on until the report row is logged."
  },
  {
    id: "thread-witness-trail",
    title: "Witness statement trail",
    category: "Witness",
    summary:
      "Read the InterviewLog rows tied to the anchored report and capture the repeated PersonID witness bundles.",
    mentorGuidance:
      "Filter InterviewLog on the report you already proved. Sort by PersonID so repeated witnesses cluster together. Pin the strongest scene-observation row from each repeated PersonID, and skip rows that read like confessions."
  },
  {
    id: "thread-person-lookup",
    title: "Resolve witness identities",
    category: "Person",
    summary:
      "Carry the witness PersonIDs into PersonsOfInterest and address records to identify who Samuel keeps referencing.",
    mentorGuidance:
      "Use the PersonIDs you logged with PersonsOfInterest. Cross-check name and address columns instead of guessing. Each new fact is only valid if it came back from a query you ran."
  },
  {
    id: "thread-gym-membership",
    title: "Trace the gym membership lead",
    category: "Organization",
    summary:
      "Use FitNFlabClub and FitNFlabClubCheckIn to test gym-related clues surfaced by the witness statements.",
    mentorGuidance:
      "If a witness statement points at a gym detail, follow that clue with a query against FitNFlabClub or its check-in table. Membership numbers and check-in dates are facts you can verify; hunches are not."
  },
  {
    id: "thread-vehicle-trace",
    title: "Trace the vehicle lead",
    category: "Vehicle",
    summary:
      "Match plate or vehicle fragments from interviews against DriversLicense and related identity records.",
    mentorGuidance:
      "A partial plate or color is a filter, not an answer. Query DriversLicense with the fragments you actually have. Treat the result set as candidates to narrow, not as a final pick."
  },
  {
    id: "thread-event-and-employment",
    title: "Cross-check events and employment",
    category: "Timeline",
    summary:
      "When the witness and gym leads converge, compare EventSchedule, EventRegistration, and Employment for overlap with your candidate set.",
    mentorGuidance:
      "This trail only matters after the earlier ones are logged. Use the IDs you already proved to filter event and employment tables. The goal is to see whether one person shows up across the records, not to guess a name."
  }
];

export function buildCase004InitialThreads(now: () => number = Date.now): InvestigationThread[] {
  const timestamp = now();

  return CASE_004_THREAD_SEEDS.map((seed) => ({
    id: seed.id,
    title: seed.title,
    category: seed.category,
    status: "New",
    summary: seed.summary,
    mentorGuidance: seed.mentorGuidance,
    evidenceLinks: [],
    learnerNotes: "",
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}
