import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import {
  deriveInvestigationStage,
  generateReinforcement
} from "./generateReinforcement";
import type { InvestigationStage, ReinforcementContext } from "./types";

function buildMilestones(
  overrides: Partial<Record<MilestoneId, boolean>> = {}
): Record<MilestoneId, boolean> {
  return {
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "trigger-check": false,
    "mastermind-trace": false,
    ...overrides
  };
}

function buildContext(
  overrides: Partial<ReinforcementContext> = {}
): ReinforcementContext {
  return {
    sql: "SELECT * FROM CrimeType",
    rowCount: 5,
    isSuccess: true,
    stage: "crime-catalog",
    completedMilestones: buildMilestones(),
    notebookEntries: [],
    ...overrides
  };
}

// Spoiler-safe assertion helper. The reinforcement layer must never echo
// answer-only identity values, hidden answer rows, or answer-confirming
// phrases into student-facing strings. Structural role categories already
// used elsewhere in the UI (for example milestone title "Uncover the
// mastermind") are allowed; concrete identities and answer rows are not.
const SPOILER_TERMS = [
  "jeremy",
  "bowers",
  "miranda",
  "priestly",
  "northwestern dr",
  "annabel",
  "franklin ave",
  "h42w",
  "48z",
  "10975"
];

function expectSpoilerSafe(message: string, headline: string): void {
  const haystack = `${headline} ${message}`.toLowerCase();
  for (const term of SPOILER_TERMS) {
    expect(haystack).not.toContain(term);
  }
  expect(haystack).not.toMatch(/\bthe suspect is\b/);
  expect(haystack).not.toMatch(/\byou solved\b/);
  expect(haystack).not.toMatch(/\bcorrect answer\b/);
  expect(haystack).not.toMatch(/insert into solution/i);
}

describe("deriveInvestigationStage", () => {
  it("returns crime-catalog before the murder code is logged", () => {
    expect(deriveInvestigationStage(buildMilestones())).toBe("crime-catalog");
  });

  it("returns report-filter after the murder code is logged", () => {
    expect(
      deriveInvestigationStage(buildMilestones({ "crime-type": true }))
    ).toBe("report-filter");
  });

  it("returns witness-trail after the report row is pinned", () => {
    expect(
      deriveInvestigationStage(
        buildMilestones({ "crime-type": true, "crime-scene-filter": true })
      )
    ).toBe("witness-trail");
  });

  it("returns gym-trail after the witness bundles are pinned", () => {
    expect(
      deriveInvestigationStage(
        buildMilestones({
          "crime-type": true,
          "crime-scene-filter": true,
          "witness-clues": true
        })
      )
    ).toBe("gym-trail");
  });

  it("returns closed once every milestone is reached", () => {
    expect(
      deriveInvestigationStage(
        buildMilestones({
          "crime-type": true,
          "crime-scene-filter": true,
          "witness-clues": true,
          "gym-chain": true,
          "trigger-check": true,
          "mastermind-trace": true
        })
      )
    ).toBe("closed");
  });
});

describe("generateReinforcement", () => {
  it("returns null when execution did not succeed", () => {
    expect(
      generateReinforcement(buildContext({ isSuccess: false }))
    ).toBeNull();
  });

  it("returns null when the SQL text is empty", () => {
    expect(
      generateReinforcement(buildContext({ sql: "  " }))
    ).toBeNull();
  });

  it("flags an unfiltered scan of a large table as overly broad", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM CrimeSceneReport",
        rowCount: 200,
        stage: "report-filter",
        completedMilestones: buildMilestones({ "crime-type": true })
      })
    );

    expect(signal).not.toBeNull();
    expect(signal?.category).toBe("overly-broad");
    expect(signal?.tone).toBe("redirect");
    expect(signal?.message).toMatch(/narrow/i);
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("rewards productive narrowing when a WHERE filter trims rows to a small set", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'",
        rowCount: 3,
        stage: "report-filter",
        completedMilestones: buildMilestones({ "crime-type": true })
      })
    );

    expect(signal?.category).toBe("productive-narrowing");
    expect(signal?.tone).toBe("positive");
    expect(signal?.message).toMatch(/3 rows?/);
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("rewards useful filtering when rows land in the medium tier", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM InterviewLog WHERE ReportID = 10975",
        rowCount: 12,
        stage: "witness-trail",
        completedMilestones: buildMilestones({
          "crime-type": true,
          "crime-scene-filter": true
        })
      })
    );

    expect(signal?.category).toBe("useful-filtering");
    expect(signal?.tone).toBe("positive");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("rewards JOIN usage when results stay tight", () => {
    const signal = generateReinforcement(
      buildContext({
        sql:
          "SELECT * FROM InterviewLog JOIN CrimeSceneReport ON InterviewLog.ReportID = CrimeSceneReport.ReportID WHERE InterviewLog.ReportID = 10975",
        rowCount: 4,
        stage: "witness-trail",
        completedMilestones: buildMilestones({
          "crime-type": true,
          "crime-scene-filter": true
        })
      })
    );

    expect(signal?.category).toBe("useful-join");
    expect(signal?.tone).toBe("positive");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("redirects a JOIN that still returns a broad pile", () => {
    const signal = generateReinforcement(
      buildContext({
        sql:
          "SELECT * FROM InterviewLog JOIN PersonsOfInterest ON InterviewLog.PersonID = PersonsOfInterest.PersonID",
        rowCount: 400,
        stage: "witness-trail",
        completedMilestones: buildMilestones({
          "crime-type": true,
          "crime-scene-filter": true
        })
      })
    );

    expect(signal?.category).toBe("useful-join");
    expect(signal?.tone).toBe("redirect");
    expect(signal?.message).toMatch(/where/i);
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("flags an out-of-scope table as unrelated to the current focus", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM EventSchedule",
        rowCount: 40,
        stage: "report-filter",
        completedMilestones: buildMilestones({ "crime-type": true })
      })
    );

    expect(signal?.category).toBe("unrelated-results");
    expect(signal?.tone).toBe("redirect");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("flags a successful query with zero rows as an incomplete chain", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'Nowhere'",
        rowCount: 0,
        stage: "report-filter",
        completedMilestones: buildMilestones({ "crime-type": true })
      })
    );

    expect(signal?.category).toBe("incomplete-chain");
    expect(signal?.tone).toBe("redirect");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("redirects a filtered scan that is still very broad", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
        rowCount: 80,
        stage: "report-filter",
        completedMilestones: buildMilestones({ "crime-type": true })
      })
    );

    expect(signal?.category).toBe("overly-broad");
    expect(signal?.tone).toBe("redirect");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("offers neutral alignment messaging for small in-scope queries with no filter", () => {
    const signal = generateReinforcement(
      buildContext({
        sql: "SELECT * FROM CrimeType",
        rowCount: 7,
        stage: "crime-catalog"
      })
    );

    expect(signal?.category).toBe("investigation-alignment");
    expect(signal?.tone).toBe("neutral");
    expectSpoilerSafe(signal!.message, signal!.headline);
  });

  it("never names hidden suspects, mastermind identities, or answer-only values", () => {
    const notebookEntries: EvidenceNotebookEntry[] = [
      { id: "manual-1", detail: "ReportID = 10975" }
    ];
    const stages: InvestigationStage[] = [
      "crime-catalog",
      "report-filter",
      "witness-trail",
      "gym-trail",
      "trigger-check",
      "mastermind-trail",
      "closed"
    ];

    const sqlSamples = [
      "SELECT * FROM CrimeType",
      "SELECT * FROM CrimeSceneReport",
      "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
      "SELECT * FROM InterviewLog WHERE ReportID = 10975",
      "SELECT * FROM InterviewLog JOIN PersonsOfInterest ON InterviewLog.PersonID = PersonsOfInterest.PersonID WHERE InterviewLog.ReportID = 10975",
      "SELECT * FROM EventSchedule",
      "SELECT * FROM Employment WHERE CompanyName = 'Acme'"
    ];

    for (const stage of stages) {
      for (const sql of sqlSamples) {
        for (const rowCount of [0, 1, 3, 12, 80, 400]) {
          const signal = generateReinforcement(
            buildContext({
              sql,
              rowCount,
              stage,
              notebookEntries
            })
          );

          if (!signal) {
            continue;
          }

          expectSpoilerSafe(signal.message, signal.headline);
          expect(signal.message).not.toMatch(/insert into solution/i);
        }
      }
    }
  });
});
