import type { SamuelReaction, SamuelReactionCategory } from "./types";

// Authored Samuel reaction pools. Every entry is hand-written, noir-toned,
// spoiler-safe mentor copy. The pools are intentionally short and never
// reference hidden suspect identities, hidden answer rows, exact SQL
// continuations, or future trail content. Selection inside a pool is
// deterministic — see selectFromPool in generateSamuelReaction.ts.
export const SAMUEL_REACTION_POOLS: Record<
  SamuelReactionCategory,
  ReadonlyArray<SamuelReaction>
> = {
  "productive-narrowing": [
    {
      id: "productive-narrowing-1",
      category: "productive-narrowing",
      tone: "encouraging",
      message:
        "Now you're thinking like a detective. A tighter result set is a cleaner trail — keep working from what's in front of you."
    },
    {
      id: "productive-narrowing-2",
      category: "productive-narrowing",
      tone: "encouraging",
      message:
        "Good. You cut through the noise and isolated something workable. Inspect what those rows actually prove before you reach for the next query."
    },
    {
      id: "productive-narrowing-3",
      category: "productive-narrowing",
      tone: "encouraging",
      message:
        "That's a detective's instinct: narrow first, interpret second. Don't rush past what you just earned."
    }
  ],
  "broad-query": [
    {
      id: "broad-query-1",
      category: "broad-query",
      tone: "redirecting",
      message:
        "Too many records to chase at once. Tighten the trail before you take the next step."
    },
    {
      id: "broad-query-2",
      category: "broad-query",
      tone: "redirecting",
      message:
        "You're pulling in noise. Pick a fact you can already prove and lean on it as your next filter."
    },
    {
      id: "broad-query-3",
      category: "broad-query",
      tone: "redirecting",
      message:
        "Wide nets don't catch witnesses. Cut this down with something you've already pinned."
    }
  ],
  "useful-join": [
    {
      id: "useful-join-1",
      category: "useful-join",
      tone: "encouraging",
      message:
        "That connection matters. You linked the right records — cross-reference what they tell you before the trail goes cold."
    },
    {
      id: "useful-join-2",
      category: "useful-join",
      tone: "encouraging",
      message:
        "Good. You're starting to thread the records together. Stay with the relationship you just opened up."
    }
  ],
  "evidence-progression": [
    {
      id: "evidence-progression-1",
      category: "evidence-progression",
      tone: "milestone",
      message:
        "That's real progress. Hold the thread you just earned — the next move builds on it, not around it."
    },
    {
      id: "evidence-progression-2",
      category: "evidence-progression",
      tone: "milestone",
      message:
        "Step earned. Take a breath, look at what your notebook proves, and let the next direction follow from that."
    }
  ],
  "investigation-persistence": [
    {
      id: "investigation-persistence-1",
      category: "investigation-persistence",
      tone: "redirecting",
      message:
        "The clue is still here. Refine the trail instead of starting over."
    },
    {
      id: "investigation-persistence-2",
      category: "investigation-persistence",
      tone: "redirecting",
      message:
        "You're closer than the silence suggests. Re-check the relationships in front of you before you change direction."
    }
  ],
  "clue-discovery": [
    {
      id: "clue-discovery-1",
      category: "clue-discovery",
      tone: "milestone",
      message:
        "You pinned something that matters. That's how cases get built — one earned fact at a time."
    },
    {
      id: "clue-discovery-2",
      category: "clue-discovery",
      tone: "milestone",
      message:
        "Logged. Your notebook is starting to carry weight — keep your reasoning anchored to what's in it."
    }
  ]
};
