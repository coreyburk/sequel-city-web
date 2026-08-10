import { getStudentCaseLibraryEntry } from "./components/student/studentCaseLibrary";
import type { StudentCaseLibraryEntry } from "./components/student/studentCaseLibrary";
import {
  CASE_004_BRIEF,
  CASE_004_ENTRY_ID,
  CASE_004_MILESTONES,
  type MilestoneId
} from "./studentCase";
import {
  getStudentCaseStorageKey,
  STUDENT_CASE_STORAGE_KEY
} from "./useStudentCaseState";
import {
  INVESTIGATION_THREAD_COUNT,
  INVESTIGATION_THREADS_STORAGE_KEY
} from "./features/investigationThreads";

export type CaseModuleContractReference = {
  owner: string;
  exportName: string;
  responsibility: string;
};

export type PlayableStudentCaseModule = {
  caseId: string;
  isPlayable: true;
  libraryEntry: StudentCaseLibraryEntry;
  milestoneIds: readonly MilestoneId[];
  storage: {
    studentProgressKey: string;
    studentProgressKeyFactory: CaseModuleContractReference;
    persistedStateValidator: CaseModuleContractReference;
    defaultStateFactory: CaseModuleContractReference;
  };
  investigationThreads: {
    storageKey: string;
    seedCount: number;
    seedFactory: CaseModuleContractReference;
    persistedThreadValidator: CaseModuleContractReference;
  };
  guidance: {
    mentorVoice: "Samuel Tupleton";
    authoredContent: CaseModuleContractReference;
    progressionAuthority: string;
  };
};

const case004LibraryEntry = getStudentCaseLibraryEntry(CASE_004_ENTRY_ID);

if (!case004LibraryEntry) {
  throw new Error(`Missing library entry for playable case ${CASE_004_ENTRY_ID}.`);
}

export const CASE_004_PLAYABLE_MODULE: PlayableStudentCaseModule = {
  caseId: CASE_004_ENTRY_ID,
  isPlayable: true,
  libraryEntry: case004LibraryEntry,
  milestoneIds: CASE_004_MILESTONES.map((milestone) => milestone.id),
  storage: {
    studentProgressKey: getStudentCaseStorageKey(CASE_004_ENTRY_ID),
    studentProgressKeyFactory: {
      owner: "apps/web/src/useStudentCaseState.ts",
      exportName: "getStudentCaseStorageKey",
      responsibility: "derive the browser localStorage key for learner-owned student progress"
    },
    persistedStateValidator: {
      owner: "apps/web/src/useStudentCaseState.ts",
      exportName: "hydrateStudentCaseState",
      responsibility: "validate persisted progress against the active playable case contract"
    },
    defaultStateFactory: {
      owner: "apps/web/src/useStudentCaseState.ts",
      exportName: "createDefaultStudentCasePersistedState",
      responsibility: "provide authored default frontend progress for a new investigation session"
    }
  },
  investigationThreads: {
    storageKey: INVESTIGATION_THREADS_STORAGE_KEY,
    seedCount: INVESTIGATION_THREAD_COUNT,
    seedFactory: {
      owner: "apps/web/src/features/investigationThreads/case004Threads.ts",
      exportName: "buildCase004InitialThreads",
      responsibility: "provide authored investigation-thread seeds for the playable case"
    },
    persistedThreadValidator: {
      owner: "apps/web/src/features/investigationThreads/useInvestigationThreads.ts",
      exportName: "hydrateThreads",
      responsibility: "merge persisted thread notes and evidence links onto authored thread seeds"
    }
  },
  guidance: {
    mentorVoice: "Samuel Tupleton",
    authoredContent: {
      owner: "apps/web/src/studentCase.ts",
      exportName: "CASE_004_* authored constants",
      responsibility: `provide authored guidance, milestones, and presentation content for ${CASE_004_BRIEF.caseNumber}: ${CASE_004_BRIEF.caseName}`
    },
    progressionAuthority:
      "Frontend display state remains Case 004-specific and learner-driven until a scoped backend progression service exists."
  }
};

export const PLAYABLE_STUDENT_CASE_MODULES = [CASE_004_PLAYABLE_MODULE] as const;

export function getPlayableStudentCaseModule(
  caseId: string | null | undefined
): PlayableStudentCaseModule | null {
  if (!caseId) {
    return null;
  }

  return PLAYABLE_STUDENT_CASE_MODULES.find((module) => module.caseId === caseId) ?? null;
}

export function isRegisteredPlayableStudentCase(caseId: string | null | undefined): boolean {
  return getPlayableStudentCaseModule(caseId) !== null;
}

export const CASE_004_PLAYABLE_STORAGE_KEY = STUDENT_CASE_STORAGE_KEY;
