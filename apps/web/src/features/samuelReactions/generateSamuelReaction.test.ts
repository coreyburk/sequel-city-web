import type { MilestoneId } from "../../studentCase";
import type {
  InvestigationStage,
  ReinforcementSignal
} from "../queryReinforcement";
import {
  SAMUEL_REACTION_MIN_GAP,
  advanceMemoryAfterQuery,
  commitReactionToMemory,
  createInitialMemory,
  generateSamuelReaction
} from "./generateSamuelReaction";
import { SAMUEL_REACTION_POOLS } from "./mentorReactionPools";
import type {
  SamuelReactionContext,
  SamuelReactionMemory
} from "./types";

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
  overrides: Partial<SamuelReactionContext> = {}
): SamuelReactionContext {
  return {
    stage: "report-filter",
    reinforcement: null,
    completedMilestones: buildMilestones({ "crime-type": true }),
    notebookEntryCount: 1,
    consecutiveBroadCount: 0,
    hasFreshMilestone: false,
    freshMilestoneId: null,
    hasFreshClueLog: false,
    ...overrides
  };
}

function buildReinforcement(
  overrides: Partial<ReinforcementSignal> = {}
): ReinforcementSignal {
  return {
    id: "reinforcement-fixture",
    category: "productive-narrowing",
    tone: "positive",
    headline: "Report filter stage: productive narrowing",
    message: "You narrowed the result set to 3 rows.",
    ...overrides
  };
}

// Same spoiler-safety guarantees the reinforcement layer enforces. Mentor
// reactions must never name hidden suspect identities or answer-only
// values, never confirm a guess, and never propose the next exact SQL.
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

function expectSpoilerSafe(message: string): void {
  const haystack = message.toLowerCase();
  for (const term of SPOILER_TERMS) {
    expect(haystack).not.toContain(term);
  }
  expect(haystack).not.toMatch(/\bthe suspect is\b/);
  expect(haystack).not.toMatch(/\byou solved\b/);
  expect(haystack).not.toMatch(/\bcorrect answer\b/);
  expect(haystack).not.toMatch(/insert into solution/i);
  // Mentor reactions must not embed runnable SQL fragments. The
  // SELECT-FROM and WHERE-= patterns are the smallest signatures of an
  // actual SQL suggestion; the English prepositions "from" and "where"
  // remain allowed.
  expect(haystack).not.toMatch(/select\s+\*/);
  expect(haystack).not.toMatch(/from\s+\w+\s+where/);
  expect(haystack).not.toMatch(/\binner join\b/);
  expect(haystack).not.toMatch(/\bleft join\b/);
}

function makeReadyMemory(): SamuelReactionMemory {
  // Starts already past the minimum gap so a reaction can fire on the
  // first eligible query when the test expects it.
  return createInitialMemory();
}

describe("generateSamuelReaction triggering", () => {
  it("returns null when no deterministic event is eligible", () => {
    expect(
      generateSamuelReaction(buildContext(), makeReadyMemory())
    ).toBeNull();
  });

  it("returns a productive-narrowing reaction when reinforcement reports productive narrowing", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({ category: "productive-narrowing" })
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("productive-narrowing");
    expect(reaction?.tone).toBe("encouraging");
  });

  it("returns a useful-join reaction when reinforcement reports a positive JOIN", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        stage: "witness-trail",
        reinforcement: buildReinforcement({
          category: "useful-join",
          tone: "positive"
        })
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("useful-join");
    expect(reaction?.tone).toBe("encouraging");
  });

  it("does not return useful-join when the JOIN result was still broad", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({
          category: "useful-join",
          tone: "redirect"
        })
      }),
      makeReadyMemory()
    );

    expect(reaction).toBeNull();
  });

  it("returns a broad-query redirect only after consecutive broad runs", () => {
    const reinforcement = buildReinforcement({
      category: "overly-broad",
      tone: "redirect"
    });

    const firstBroad = generateSamuelReaction(
      buildContext({
        reinforcement,
        consecutiveBroadCount: 1
      }),
      makeReadyMemory()
    );
    expect(firstBroad).toBeNull();

    const secondBroad = generateSamuelReaction(
      buildContext({
        reinforcement,
        consecutiveBroadCount: 2
      }),
      makeReadyMemory()
    );
    expect(secondBroad?.category).toBe("broad-query");
    expect(secondBroad?.tone).toBe("redirecting");
  });

  it("returns investigation-persistence after consecutive empty results", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({
          category: "incomplete-chain",
          tone: "redirect"
        }),
        consecutiveBroadCount: 2
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("investigation-persistence");
    expect(reaction?.tone).toBe("redirecting");
  });

  it("returns evidence-progression when a fresh milestone landed", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        hasFreshMilestone: true,
        freshMilestoneId: "crime-scene-filter"
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("evidence-progression");
    expect(reaction?.tone).toBe("milestone");
  });

  it("returns clue-discovery when a notebook entry was just logged", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        hasFreshClueLog: true,
        notebookEntryCount: 2
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("clue-discovery");
    expect(reaction?.tone).toBe("milestone");
  });

  it("prioritizes milestone-tier events over productive-narrowing", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({ category: "productive-narrowing" }),
        hasFreshMilestone: true,
        freshMilestoneId: "crime-scene-filter"
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("evidence-progression");
  });

  it("prioritizes clue-discovery over evidence-progression when both fire", () => {
    const reaction = generateSamuelReaction(
      buildContext({
        hasFreshMilestone: true,
        freshMilestoneId: "crime-scene-filter",
        hasFreshClueLog: true
      }),
      makeReadyMemory()
    );

    expect(reaction?.category).toBe("clue-discovery");
  });
});

describe("Samuel reaction moderation", () => {
  it("stays silent when too few queries have passed since the last reaction", () => {
    const initialMemory = makeReadyMemory();
    const firstReaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({ category: "productive-narrowing" })
      }),
      initialMemory
    );
    expect(firstReaction).not.toBeNull();

    const memoryAfterFire = commitReactionToMemory(initialMemory, firstReaction!);

    // Simulate the very next query happening immediately afterward.
    const advancedOnce = advanceMemoryAfterQuery(memoryAfterFire);
    const followUp = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({ category: "productive-narrowing" })
      }),
      advancedOnce
    );

    expect(followUp).toBeNull();
  });

  it("bypasses the silence gap for fresh milestone events", () => {
    const initialMemory = makeReadyMemory();
    const firstReaction = generateSamuelReaction(
      buildContext({
        reinforcement: buildReinforcement({ category: "productive-narrowing" })
      }),
      initialMemory
    );
    expect(firstReaction).not.toBeNull();

    const memoryAfterFire = commitReactionToMemory(initialMemory, firstReaction!);
    const advancedOnce = advanceMemoryAfterQuery(memoryAfterFire);

    const milestoneReaction = generateSamuelReaction(
      buildContext({
        hasFreshMilestone: true,
        freshMilestoneId: "crime-scene-filter"
      }),
      advancedOnce
    );

    expect(milestoneReaction?.category).toBe("evidence-progression");
  });

  it("applies a per-category cooldown after a reaction fires", () => {
    let memory = makeReadyMemory();
    const reinforcement = buildReinforcement({ category: "productive-narrowing" });
    const firstReaction = generateSamuelReaction(
      buildContext({ reinforcement }),
      memory
    );
    expect(firstReaction?.category).toBe("productive-narrowing");

    memory = commitReactionToMemory(memory, firstReaction!);

    // Walk just past the global silence gap so only the per-category
    // cooldown can be gating the next attempt.
    for (let index = 0; index < SAMUEL_REACTION_MIN_GAP; index += 1) {
      memory = advanceMemoryAfterQuery(memory);
    }

    const blockedReaction = generateSamuelReaction(
      buildContext({ reinforcement }),
      memory
    );
    expect(blockedReaction).toBeNull();
  });

  it("rotates within a pool so back-to-back same-category reactions are not identical", () => {
    let memory = makeReadyMemory();
    const reactions = [
      generateSamuelReaction(
        buildContext({ hasFreshClueLog: true, notebookEntryCount: 2 }),
        memory
      )
    ];
    memory = commitReactionToMemory(memory, reactions[0]!);

    for (let index = 0; index < 8; index += 1) {
      memory = advanceMemoryAfterQuery(memory);
    }

    reactions.push(
      generateSamuelReaction(
        buildContext({ hasFreshClueLog: true, notebookEntryCount: 3 }),
        memory
      )
    );

    expect(reactions[0]!.id).not.toBe(reactions[1]!.id);
    expect(reactions[0]!.category).toBe(reactions[1]!.category);
  });
});

describe("Samuel reaction spoiler safety", () => {
  it("never echoes hidden suspects or answer-only values in any authored mentor message", () => {
    for (const pool of Object.values(SAMUEL_REACTION_POOLS)) {
      for (const reaction of pool) {
        expectSpoilerSafe(reaction.message);
      }
    }
  });

  it("never returns an answer-disclosing reaction across stage and category combinations", () => {
    const stages: InvestigationStage[] = [
      "crime-catalog",
      "report-filter",
      "witness-trail",
      "gym-trail",
      "trigger-check",
      "mastermind-trail",
      "closed"
    ];
    const reinforcementCategories: ReinforcementSignal["category"][] = [
      "productive-narrowing",
      "useful-filtering",
      "useful-join",
      "investigation-alignment",
      "overly-broad",
      "unrelated-results",
      "incomplete-chain"
    ];

    for (const stage of stages) {
      for (const category of reinforcementCategories) {
        const reinforcement = buildReinforcement({
          category,
          tone: category === "useful-join" ? "positive" : "redirect"
        });

        for (const broadRun of [0, 1, 2, 3]) {
          for (const milestone of [false, true]) {
            for (const clueLog of [false, true]) {
              const reaction = generateSamuelReaction(
                buildContext({
                  stage,
                  reinforcement,
                  consecutiveBroadCount: broadRun,
                  hasFreshMilestone: milestone,
                  freshMilestoneId: milestone ? "crime-scene-filter" : null,
                  hasFreshClueLog: clueLog
                }),
                makeReadyMemory()
              );

              if (!reaction) {
                continue;
              }

              expectSpoilerSafe(reaction.message);
            }
          }
        }
      }
    }
  });
});

describe("memory helpers", () => {
  it("advances the queries-since-last counter", () => {
    const advanced = advanceMemoryAfterQuery(createInitialMemory());

    expect(advanced.queriesSinceLastReaction).toBe(SAMUEL_REACTION_MIN_GAP + 1);
  });

  it("records the last reaction id when a reaction is committed", () => {
    const reaction = generateSamuelReaction(
      buildContext({ hasFreshClueLog: true, notebookEntryCount: 2 }),
      createInitialMemory()
    );
    expect(reaction).not.toBeNull();

    const memory = commitReactionToMemory(createInitialMemory(), reaction!);

    expect(memory.lastReactionId).toBe(reaction!.id);
    expect(memory.lastCategory).toBe(reaction!.category);
    expect(memory.queriesSinceLastReaction).toBe(0);
  });
});
