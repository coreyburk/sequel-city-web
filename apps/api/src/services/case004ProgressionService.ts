import type { QueryRow } from "../types/query.ts";
import type { ProvenFact } from "../types/caseRuntime.ts";

export const CASE004_HANDLERS = {
  "crime-type": { mode: "log", table: "CrimeType", key: "CrimeID", required: 1 },
  "report-inspection": { mode: "query", table: "CrimeSceneReport", key: "ReportID", required: 1 },
  "report-isolation": { mode: "log", table: "CrimeSceneReport", key: "ReportID", required: 1 },
  "witness-observations": { mode: "log", table: "InterviewLog", key: "LogID", required: 2 },
  "witness-identities": { mode: "log", table: "PersonsOfInterest", key: "PersonID", required: 2 },
  "gym-lead": { mode: "log", table: "FitNFlabClub", key: "FitMemberID", required: 1 },
  "suspect-identity": { mode: "log", table: "PersonsOfInterest", key: "PersonID", required: 1 },
  "suspect-confession": { mode: "log", table: "InterviewLog", key: "LogID", required: 1 },
  "murderer-verification": { mode: "verify", table: "", key: "", required: 1 },
  "mastermind-profile": { mode: "log", table: "InterviewLog", key: "LogID", required: 10 },
  "mastermind-candidates": { mode: "log", table: "DriversLicense", key: "LicenseID", required: 2 },
  "mastermind-identities": { mode: "log", table: "PersonsOfInterest", key: "PersonID", required: 2 },
  "symphony-events": { mode: "log", table: "EventSchedule", key: "EventID", required: 3 },
  "attendance-comparison": { mode: "query", table: "EventRegistration", key: "EventID", required: 1 },
  "employment-comparison": { mode: "log", table: "Employment", key: "SSN", required: 1 },
  "mastermind-verification": { mode: "verify", table: "", key: "", required: 1 }
} as const;
export type Case004Step = keyof typeof CASE004_HANDLERS;
export interface CollectionProof { completed: boolean; items: string[]; facts: ProvenFact[] }
export function evidenceField(row: QueryRow, name: string): string {
  return String(Object.entries(row.values).find(([key]) => key.toLowerCase().replace(/[^a-z0-9]/g, "") === name.toLowerCase().replace(/[^a-z0-9]/g, ""))?.[1] ?? "");
}
const normalized = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
export function profileCategories(text: string): string[] {
  const t = normalized(text);
  const terms: Record<string, string[]> = {
    "paid-hit": ["client", "contract", "wanted that scumbag taken out", "they called to ice him"],
    female: ["the lady", "she said", "dame", "woman who hired", "broad who hired"],
    money: ["high-roller", "deep pockets", "cream"], december: ["three times last december"],
    symphony: ["symphony"], stilettos: ["stiletto"], jewelry: ["expensive jewelry", "serious ice", "rocks on her fingers"],
    "red-hair": ["redhead"], bmw: ["bmw m8"], height: ["5 foot 5", "5 foot 8", "5'5", "5'8", "five foot five", "five foot eight"]
  };
  return Object.entries(terms).filter(([, words]) => words.some(word => t.includes(word))).map(([key]) => key);
}
// These handlers evaluate already canonical-checked rows. SQL text and notes never prove a step.
export function collectCase004(step: Case004Step, rows: QueryRow[], selected: QueryRow | undefined,
  earned: ProvenFact[], previous: CollectionProof | undefined, actionId: string, briefing: Record<string, string> = {}): CollectionProof | null {
  const f = (name: string) => selected ? evidenceField(selected, name) : "";
  const values = (prefix: string) => earned.filter(fact => fact.key.startsWith(prefix)).map(fact => fact.value);
  const fact = (key: string, label: string, value: string): ProvenFact => ({ key, label, value, sourceActionId: actionId });
  let items: string[] = [], facts: ProvenFact[] = [];
  const transcript = normalized(f("LogTranscript"));
  const report = values("ReportID")[0];
  const linked = f("ReportID") === report && !!report;
  switch (step) {
    case "crime-type":
      if (normalized(f("CrimeType")) !== "murder" || !f("CrimeID")) return null;
      items = [f("CrimeID")]; facts = [fact("CrimeID", "Murder CrimeID", f("CrimeID"))]; break;
    case "report-inspection":
      if (!rows.length || !["ReportID", "CrimeID", "ReportCity", "ReportDate"].every(key => evidenceField(rows[0], key))) return null;
      items = ["inspected"]; break;
    case "report-isolation":
      if (rows.length !== 1 || f("CrimeID") !== values("CrimeID")[0] || normalized(f("ReportCity")) !== normalized(briefing.ReportCity ?? "") || f("ReportDate").replace(/[^0-9]/g, "").slice(0, 8) !== briefing.ReportDate || !f("ReportID")) return null;
      items = [f("ReportID")]; facts = [fact("ReportID", "Murder report", f("ReportID"))]; break;
    case "witness-observations": {
      if (!linked || !f("PersonID") || /i whacked|i delivered|contract|client wanted|she said the sleazeball|they called to ice him/.test(transcript)) return null;
      const bundle = rows.filter(row => evidenceField(row, "PersonID") === f("PersonID") && evidenceField(row, "ReportID") === report && /i saw|i heard|i recognized|plate|he had|he got into|there was/.test(normalized(evidenceField(row, "LogTranscript"))));
      if (!bundle.length) return null;
      items = [f("PersonID")]; facts = [fact(`PersonID:witness:${f("PersonID")}`, "Witness PersonID", f("PersonID"))];
      const text = bundle.map(row => normalized(evidenceField(row, "LogTranscript"))).join(" ");
      if (text.includes("48z")) facts.push(fact("FitMemberID:prefix", "Membership prefix", "48Z"));
      if (text.includes("gold")) facts.push(fact("FitMembershipStatus", "Membership status", "gold"));
      break;
    }
    case "witness-identities":
      if (!values("PersonID:witness:").includes(f("PersonID")) || !f("PersonName")) return null;
      items = [f("PersonID")]; facts = [fact(`PersonName:witness:${f("PersonID")}`, "Witness name", f("PersonName"))]; break;
    case "gym-lead":
      if (!values("FitMemberID:prefix").length || !values("FitMembershipStatus").length || normalized(f("FitMembershipStatus")) !== "gold" || !f("FitMemberID").toUpperCase().startsWith("48Z") || !f("PersonID")) return null;
      items = [f("FitMemberID")]; facts = [fact("FitMemberID", "Gym membership", f("FitMemberID")), fact("PersonID:suspect", "Gym-linked PersonID", f("PersonID"))]; break;
    case "suspect-identity":
      if (f("PersonID") !== values("PersonID:suspect")[0] || !f("PersonName")) return null;
      items = [f("PersonID")]; facts = [fact("PersonName:suspect", "Suspect name", f("PersonName"))]; break;
    case "suspect-confession":
      if (!linked || f("PersonID") !== values("PersonID:suspect")[0] || !/i whacked|so i delivered|i delivered the hit|i delivered\./.test(transcript)) return null;
      items = [f("LogID")]; break;
    case "mastermind-profile":
      if (!linked || f("PersonID") !== values("PersonID:suspect")[0]) return null;
      items = profileCategories(transcript);
      facts = items.map(category => fact(`Profile:${category}`, "Mastermind clue", category)); break;
    case "mastermind-candidates":
      if (!f("LicenseID") || !f("PlateNumber") || normalized(f("Gender")) !== "female" || normalized(f("HairColor")) !== "red" || normalized(f("CarMake")) !== "bmw" || normalized(f("CarModel")) !== "m8" || Number(f("Height")) < 65 || Number(f("Height")) > 68) return null;
      items = [f("LicenseID")]; facts = [fact(`LicenseID:candidate:${f("LicenseID")}`, "Candidate LicenseID", f("LicenseID"))]; break;
    case "mastermind-identities":
      if (!values("LicenseID:candidate:").includes(f("LicenseID")) || !f("PersonID") || !f("PersonName") || !f("SSN")) return null;
      items = [f("LicenseID")]; facts = [fact(`EventPersonID:candidate:${f("PersonID")}`, "Candidate PersonID", f("PersonID")), fact(`SSN:candidate:${f("PersonID")}`, "Candidate SSN", f("SSN")), fact(`PersonName:candidate:${f("PersonID")}`, "Candidate name", f("PersonName"))]; break;
    case "symphony-events":
      if (!f("EventID") || !normalized(f("EventName")).includes("symphony") || !f("EventDate").startsWith("2022-12")) return null;
      items = [f("EventID")]; facts = [fact(`EventID:${f("EventID")}`, "December Symphony event", f("EventID"))]; break;
    case "attendance-comparison": {
      const people = values("EventPersonID:candidate:"), events = values("EventID:");
      if (people.length < 2 || events.length < 3 || rows.some(row => !people.includes(evidenceField(row, "EventPersonID")) || !events.includes(evidenceField(row, "EventID"))) || !people.every(person => events.every(event => rows.some(row => evidenceField(row, "EventPersonID") === person && evidenceField(row, "EventID") === event)))) return null;
      items = ["both-candidates-attended"]; break;
    }
    case "employment-comparison": {
      const ssns = values("SSN:candidate:");
      const comparison = rows.filter(row => ssns.includes(evidenceField(row, "SSN")));
      const income = (row: QueryRow) => Number(evidenceField(row, "AnnualIncome") || evidenceField(row, "Salary"));
      if (ssns.length < 2 || !ssns.every(ssn => comparison.some(row => evidenceField(row, "SSN") === ssn)) || !ssns.includes(f("SSN")) || !selected || comparison.some(row => evidenceField(row, "SSN") !== f("SSN") && income(row) >= income(selected)) || income(selected) <= 0) return null;
      items = [f("SSN")]; facts = [fact("SSN:wealth", "Wealth evidence SSN", f("SSN"))]; break;
    }
    default: return null;
  }
  if (!items.length || items.some(item => !item)) return null;
  const collected = [...new Set([...(previous?.items ?? []), ...items])];
  const byKey = new Map([...(previous?.facts ?? []), ...facts].map(fact => [fact.key, fact]));
  return { completed: collected.length >= CASE004_HANDLERS[step].required, items: collected, facts: [...byKey.values()] };
}
