import { getStudentCaseLibraryEntry } from "./components/student/studentCaseLibrary";
import type { StudentCaseLibraryEntry } from "./components/student/studentCaseLibrary";
import {
  CASE_001_ENTRY_ID,
  CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY,
  CASE_001_FIRST_SQL_MILESTONE_BOUNDARY,
  CASE_001_SQL_FEEDBACK_SLICES,
  CASE_001_SKELETON_BRIEF,
  CASE_001_SKELETON_RELEASE_GATE,
  CASE_001_SKELETON_STATE_VERSION,
  isCase001PlayableEnabled
} from "./studentCase001";
export type CaseModuleContractReference = {
  owner: string;
  exportName: string;
  responsibility: string;
};

export type SkeletonPlayableStudentCaseModule = {
  moduleKind: "skeleton";
  caseId: string;
  isPlayable: true;
  libraryEntry: StudentCaseLibraryEntry;
  releaseGate: {
    envName: typeof CASE_001_SKELETON_RELEASE_GATE;
    enabledValue: "true";
    isEnabled: () => boolean;
  };
  skeleton: {
    caseNumber: typeof CASE_001_SKELETON_BRIEF.caseNumber;
    caseName: typeof CASE_001_SKELETON_BRIEF.caseName;
    status: typeof CASE_001_SKELETON_BRIEF.skeletonStatus;
    summary: typeof CASE_001_SKELETON_BRIEF.caseShape;
  };
  skeletonState: {
    version: typeof CASE_001_SKELETON_STATE_VERSION;
    persistence: "component-memory-only";
    stateOwner: CaseModuleContractReference;
    defaultStateFactory: CaseModuleContractReference;
    stateNormalizer: CaseModuleContractReference;
  };
  firstSqlMilestoneBoundary: {
    id: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.id;
    title: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.title;
    learnerObjective: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.learnerObjective;
    progressionSource: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.progressionSource;
    initialTableFamily: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.initialTableFamily;
    validationOwner: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.validationOwner;
    invalidProgressionAuthorities: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.invalidProgressionAuthorities;
    releaseGateBehavior: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.releaseGateBehavior;
    runtimeStatus: typeof CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY.runtimeStatus;
  };
  sqlFeedbackSlices: typeof CASE_001_SQL_FEEDBACK_SLICES;
};

// Retained only for the historical skeleton view's type and test fixture.
// Released cases are discovered from SQL dossiers, never a compiled registry.
const case001LibraryEntry = getStudentCaseLibraryEntry(CASE_001_ENTRY_ID);
if (!case001LibraryEntry) throw new Error("Missing historical Case 001 skeleton artwork metadata.");

export const CASE_001_PLAYABLE_SKELETON_MODULE: SkeletonPlayableStudentCaseModule = {
  moduleKind: "skeleton",
  caseId: CASE_001_ENTRY_ID,
  isPlayable: true,
  libraryEntry: case001LibraryEntry,
  releaseGate: {
    envName: CASE_001_SKELETON_RELEASE_GATE,
    enabledValue: "true",
    isEnabled: isCase001PlayableEnabled
  },
  skeleton: {
    caseNumber: CASE_001_SKELETON_BRIEF.caseNumber,
    caseName: CASE_001_SKELETON_BRIEF.caseName,
    status: CASE_001_SKELETON_BRIEF.skeletonStatus,
    summary: CASE_001_SKELETON_BRIEF.caseShape
  },
  skeletonState: {
    version: CASE_001_SKELETON_STATE_VERSION,
    persistence: "component-memory-only",
    stateOwner: {
      owner: "apps/web/src/studentCase001.ts",
      exportName: "Case001SkeletonState",
      responsibility:
        "define the non-spoiler component-local state shape for the gated Case 001 skeleton slices"
    },
    defaultStateFactory: {
      owner: "apps/web/src/studentCase001.ts",
      exportName: "createDefaultCase001SkeletonState",
      responsibility:
        "provide the authored default Case 001 skeleton state without reading browser storage"
    },
    stateNormalizer: {
      owner: "apps/web/src/studentCase001.ts",
      exportName: "normalizeCase001SkeletonState",
      responsibility:
        "accept only known gated Case 001 skeleton interaction option ids and fall back to defaults without side effects"
    }
  },
  firstSqlMilestoneBoundary: CASE_001_CRIME_TYPE_MILESTONE_BOUNDARY,
  sqlFeedbackSlices: CASE_001_SQL_FEEDBACK_SLICES
};
