import { SAMUEL_REACTION_POOLS } from "./mentorReactionPools";
import type {
  SamuelReaction,
  SamuelReactionCategory,
  SamuelReactionContext,
  SamuelReactionMemory
} from "./types";

// Minimum number of executed queries between Samuel reactions of any
// category. Keeps the mentor quiet most of the time so the reactions feel
// earned and rare, never chatty.
export const SAMUEL_REACTION_MIN_GAP = 2;

// Per-category cooldown applied immediately after a category fires. The
// category will not fire again until this many additional queries have
// been executed. Milestone-style categories use a longer gap so they do
// not stack on top of each other.
const CATEGORY_COOLDOWN_QUERIES: Record<SamuelReactionCategory, number> = {
  "productive-narrowing": 3,
  "broad-query": 3,
  "useful-join": 4,
  "evidence-progression": 5,
  "investigation-persistence": 4,
  "clue-discovery": 5
};

// Higher priority means the trigger wins if multiple categories qualify
// on the same query. Earned-progress and clue-discovery reactions
// outrank stylistic narrowing or broad-query reactions so the mentor
// reacts to the most meaningful event when several are simultaneously
// true.
const CATEGORY_PRIORITY: Record<SamuelReactionCategory, number> = {
  "clue-discovery": 50,
  "evidence-progression": 45,
  "useful-join": 30,
  "productive-narrowing": 25,
  "broad-query": 20,
  "investigation-persistence": 15
};

const BROAD_RUN_THRESHOLD = 2;

export function createInitialMemory(): SamuelReactionMemory {
  return {
    lastReactionId: null,
    lastCategory: null,
    queriesSinceLastReaction: SAMUEL_REACTION_MIN_GAP,
    categoryCooldown: {
      "productive-narrowing": 0,
      "broad-query": 0,
      "useful-join": 0,
      "evidence-progression": 0,
      "investigation-persistence": 0,
      "clue-discovery": 0
    }
  };
}

export function advanceMemoryAfterQuery(
  memory: SamuelReactionMemory
): SamuelReactionMemory {
  const cooldown: Record<SamuelReactionCategory, number> = {
    "productive-narrowing": Math.max(0, memory.categoryCooldown["productive-narrowing"] - 1),
    "broad-query": Math.max(0, memory.categoryCooldown["broad-query"] - 1),
    "useful-join": Math.max(0, memory.categoryCooldown["useful-join"] - 1),
    "evidence-progression": Math.max(0, memory.categoryCooldown["evidence-progression"] - 1),
    "investigation-persistence": Math.max(0, memory.categoryCooldown["investigation-persistence"] - 1),
    "clue-discovery": Math.max(0, memory.categoryCooldown["clue-discovery"] - 1)
  };

  return {
    ...memory,
    queriesSinceLastReaction: memory.queriesSinceLastReaction + 1,
    categoryCooldown: cooldown
  };
}

function selectFromPool(
  category: SamuelReactionCategory,
  memory: SamuelReactionMemory
): SamuelReaction | null {
  const pool = SAMUEL_REACTION_POOLS[category];
  if (pool.length === 0) {
    return null;
  }

  const lastIdInCategory =
    memory.lastCategory === category ? memory.lastReactionId : null;

  // Rotate within the pool so back-to-back triggers in the same category
  // do not produce identical copy. Selection remains deterministic given
  // the same memory snapshot.
  const lastIndex = lastIdInCategory
    ? pool.findIndex((entry) => entry.id === lastIdInCategory)
    : -1;

  if (lastIndex === -1) {
    return pool[0];
  }

  return pool[(lastIndex + 1) % pool.length];
}

function eligibleCategoriesFor(
  context: SamuelReactionContext
): SamuelReactionCategory[] {
  const categories: SamuelReactionCategory[] = [];

  if (context.hasFreshMilestone) {
    categories.push("evidence-progression");
  }

  if (context.hasFreshClueLog) {
    categories.push("clue-discovery");
  }

  const reinforcement = context.reinforcement;
  if (reinforcement) {
    if (reinforcement.category === "productive-narrowing") {
      categories.push("productive-narrowing");
    }

    if (reinforcement.category === "useful-join" && reinforcement.tone === "positive") {
      categories.push("useful-join");
    }

    if (
      reinforcement.category === "overly-broad" &&
      context.consecutiveBroadCount >= BROAD_RUN_THRESHOLD
    ) {
      categories.push("broad-query");
    }

    if (
      reinforcement.category === "incomplete-chain" &&
      context.consecutiveBroadCount >= BROAD_RUN_THRESHOLD
    ) {
      categories.push("investigation-persistence");
    }
  }

  return categories;
}

function pickHighestPriority(
  categories: ReadonlyArray<SamuelReactionCategory>,
  memory: SamuelReactionMemory
): SamuelReactionCategory | null {
  let bestCategory: SamuelReactionCategory | null = null;
  let bestScore = -Infinity;

  for (const category of categories) {
    if (memory.categoryCooldown[category] > 0) {
      continue;
    }

    const score = CATEGORY_PRIORITY[category];
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

// Deterministic Samuel reaction generator. Given the moderation memory and
// a deterministic context snapshot, returns at most one authored mentor
// reaction. Returns null when silence is the right answer — which is the
// common case. The function never invents text, never names hidden
// suspects, and never proposes the next SQL query.
export function generateSamuelReaction(
  context: SamuelReactionContext,
  memory: SamuelReactionMemory
): SamuelReaction | null {
  const categories = eligibleCategoriesFor(context);
  if (categories.length === 0) {
    return null;
  }

  const isMilestoneEligible =
    context.hasFreshMilestone || context.hasFreshClueLog;

  // Cooldown gap is bypassed for genuine milestone-style events so a
  // pinned clue or a milestone advance can still produce a brief reaction
  // even if a stylistic reaction was issued recently.
  if (
    !isMilestoneEligible &&
    memory.queriesSinceLastReaction < SAMUEL_REACTION_MIN_GAP
  ) {
    return null;
  }

  const chosenCategory = pickHighestPriority(categories, memory);
  if (!chosenCategory) {
    return null;
  }

  return selectFromPool(chosenCategory, memory);
}

export function commitReactionToMemory(
  memory: SamuelReactionMemory,
  reaction: SamuelReaction
): SamuelReactionMemory {
  return {
    ...memory,
    lastReactionId: reaction.id,
    lastCategory: reaction.category,
    queriesSinceLastReaction: 0,
    categoryCooldown: {
      ...memory.categoryCooldown,
      [reaction.category]: CATEGORY_COOLDOWN_QUERIES[reaction.category]
    }
  };
}
