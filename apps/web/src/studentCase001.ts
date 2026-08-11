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

export function isCase001PlayableSkeletonEnabled(): boolean {
  return import.meta.env?.VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true";
}
