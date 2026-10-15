import { CASE_001_PLAYABLE_SKELETON_MODULE } from "./studentCaseModule";
import {
  CASE_001_CLUE_NARROWING_SLICE,
  CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY,
  CASE_001_ENTRY_ID,
  CASE_001_FIRST_SQL_MILESTONE_BOUNDARY,
  CASE_001_REPORT_INTERVIEWS_MILESTONE_BOUNDARY,
  CASE_001_RECORD_COMPARISON_SLICE,
  CASE_001_SQL_FEEDBACK_SLICES,
  CASE_001_SKELETON_RELEASE_GATE,
  CASE_001_SKELETON_STATE_VERSION,
  CASE_001_SKELETON_CHECKPOINT_COMPLETE_MESSAGE,
  CASE_001_TIMELINE_SLICE,
  buildCase001SkeletonCheckpoint,
  createDefaultCase001SkeletonState,
  normalizeCase001SkeletonState,
  isCase001PlayableSkeletonEnabled
} from "./studentCase001";

describe("student case module contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps the historical skeleton flag opt-in and case-sensitive", () => {
    expect(isCase001PlayableSkeletonEnabled()).toBe(false);

    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "false");

    expect(isCase001PlayableSkeletonEnabled()).toBe(false);

    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "TRUE");

    expect(isCase001PlayableSkeletonEnabled()).toBe(false);
  });
  it("retains historical skeleton feedback for legacy backup compatibility", () => {
    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "true");

    const module = CASE_001_PLAYABLE_SKELETON_MODULE;

    if (module?.moduleKind !== "skeleton") {
      throw new Error("Expected the gated Case 001 module to remain a skeleton module.");
    }
    expect(module.firstSqlMilestoneBoundary).toEqual({
      id: "case-001-crime-type-identified",
      title: "Case Crime Type Identified",
      learnerObjective:
        "Prove which CrimeID identifies the case's recorded crime type before you filter the report archive.",
      progressionSource: "backend-approved-read-only-sql-results",
      initialTableFamily: ["CrimeType"],
      validationOwner: "deterministic-backend-result-pattern",
      invalidProgressionAuthorities: [
        "ui-state",
        "skeleton-selections",
        "localStorage",
        "ai",
        "free-text-guesses"
      ],
      releaseGateBehavior:
        "Available for the released Case 001 foundation-first evidence path.",
      runtimeStatus: "evaluated-no-progression"
    });
    expect(module.sqlFeedbackSlices.map((slice) => slice.milestoneId)).toEqual([
      "case-001-crime-type-identified",
      CASE_001_FIRST_SQL_MILESTONE_BOUNDARY.id,
      CASE_001_REPORT_INTERVIEWS_MILESTONE_BOUNDARY.id
    ]);
    expect(module.sqlFeedbackSlices.map((slice) => slice.submitLabel)).toEqual([
      "Check Crime Type Query",
      "Check Report Query",
      "Check Interview Query"
    ]);


    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "false");

  });

  it("keeps Case 001 skeleton state interaction-only and defaulted to no selection", () => {
    expect(createDefaultCase001SkeletonState()).toEqual({
      version: CASE_001_SKELETON_STATE_VERSION,
      selectedTimelineOptionId: null,
      selectedRecordComparisonOptionId: null,
      selectedClueNarrowingOptionId: null
    });

    expect(
      normalizeCase001SkeletonState({
        version: CASE_001_SKELETON_STATE_VERSION,
        selectedTimelineOptionId: "toast-to-access",
        selectedRecordComparisonOptionId: "door-claim-to-ledger",
        selectedClueNarrowingOptionId: "access-log-sequence"
      })
    ).toEqual({
      version: CASE_001_SKELETON_STATE_VERSION,
      selectedTimelineOptionId: "toast-to-access",
      selectedRecordComparisonOptionId: "door-claim-to-ledger",
      selectedClueNarrowingOptionId: "access-log-sequence"
    });

    expect(
      normalizeCase001SkeletonState({
        version: CASE_001_SKELETON_STATE_VERSION,
        selectedTimelineOptionId: "answer-key",
        selectedRecordComparisonOptionId: "culprit",
        selectedClueNarrowingOptionId: "solution"
      })
    ).toEqual(createDefaultCase001SkeletonState());
    expect(normalizeCase001SkeletonState({ version: 2 })).toEqual(
      createDefaultCase001SkeletonState()
    );
    expect(normalizeCase001SkeletonState(null)).toEqual(createDefaultCase001SkeletonState());
    expect(
      CASE_001_RECORD_COMPARISON_SLICE.options.filter(
        (option) => "isCorrect" in option && option.isCorrect
      )
    ).toHaveLength(1);
    expect(
      CASE_001_CLUE_NARROWING_SLICE.options.filter(
        (option) => "isCorrect" in option && option.isCorrect
      )
    ).toHaveLength(1);
    expect(
      normalizeCase001SkeletonState({
        version: CASE_001_SKELETON_STATE_VERSION,
        selectedTimelineOptionId: "toast-to-access",
        selectedRecordComparisonOptionId: "door-claim-to-ledger",
        selectedClueNarrowingOptionId: "culprit"
      })
    ).toEqual(createDefaultCase001SkeletonState());
    expect(
      normalizeCase001SkeletonState({
        version: CASE_001_SKELETON_STATE_VERSION,
        selectedRecordComparisonOptionId: "door-claim-to-ledger",
        selectedClueNarrowingOptionId: "access-log-sequence"
      })
    ).toEqual(
      {
        version: CASE_001_SKELETON_STATE_VERSION,
        selectedTimelineOptionId: null,
        selectedRecordComparisonOptionId: "door-claim-to-ledger",
        selectedClueNarrowingOptionId: "access-log-sequence"
      }
    );
  });

  it("derives the Case 001 checkpoint from existing skeleton selections", () => {
    const defaultCheckpoint = buildCase001SkeletonCheckpoint(
      createDefaultCase001SkeletonState()
    );

    expect(defaultCheckpoint.isComplete).toBe(false);
    expect(defaultCheckpoint.completeMessage).toBe(
      CASE_001_SKELETON_CHECKPOINT_COMPLETE_MESSAGE
    );
    expect(defaultCheckpoint.items).toEqual([
      {
        id: "timeline",
        label: CASE_001_TIMELINE_SLICE.title,
        selectedLabel: null
      },
      {
        id: "record-comparison",
        label: CASE_001_RECORD_COMPARISON_SLICE.title,
        selectedLabel: null
      },
      {
        id: "clue-narrowing",
        label: CASE_001_CLUE_NARROWING_SLICE.title,
        selectedLabel: null
      }
    ]);

    const completeCheckpoint = buildCase001SkeletonCheckpoint({
      version: CASE_001_SKELETON_STATE_VERSION,
      selectedTimelineOptionId: "toast-to-access",
      selectedRecordComparisonOptionId: "door-claim-to-ledger",
      selectedClueNarrowingOptionId: "access-log-sequence"
    });

    expect(completeCheckpoint.isComplete).toBe(true);
    expect(completeCheckpoint.items.map((item) => item.selectedLabel)).toEqual([
      "Compare the public toast with the clockroom access mark.",
      "Compare the closed-door claim with the clockroom access ledger.",
      "Prioritize the access-log sequence around the toast."
    ]);
  });
});
