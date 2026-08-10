import {
  CASE_004_PLAYABLE_MODULE,
  CASE_004_PLAYABLE_STORAGE_KEY,
  getPlayableStudentCaseModule,
  isRegisteredPlayableStudentCase,
  PLAYABLE_STUDENT_CASE_MODULES
} from "./studentCaseModule";
import { CASE_004_ENTRY_ID, CASE_004_MILESTONES } from "./studentCase";
import { STUDENT_CASE_STORAGE_KEY } from "./useStudentCaseState";
import { INVESTIGATION_THREADS_STORAGE_KEY } from "./features/investigationThreads";

describe("student case module contract", () => {
  it("registers Case 004 as the only playable case module", () => {
    expect(PLAYABLE_STUDENT_CASE_MODULES).toHaveLength(1);
    expect(PLAYABLE_STUDENT_CASE_MODULES[0]).toBe(CASE_004_PLAYABLE_MODULE);
    expect(PLAYABLE_STUDENT_CASE_MODULES.map((module) => module.caseId)).toEqual([
      CASE_004_ENTRY_ID
    ]);
  });

  it("returns no playable module for locked, future, unknown, or missing case ids", () => {
    expect(getPlayableStudentCaseModule("case-001")).toBeNull();
    expect(getPlayableStudentCaseModule("case-006")).toBeNull();
    expect(getPlayableStudentCaseModule("case-999")).toBeNull();
    expect(getPlayableStudentCaseModule(null)).toBeNull();
    expect(getPlayableStudentCaseModule(undefined)).toBeNull();
    expect(isRegisteredPlayableStudentCase("case-006")).toBe(false);
  });

  it("exposes the Case 004 identity and storage keys without changing existing keys", () => {
    const module = getPlayableStudentCaseModule(CASE_004_ENTRY_ID);

    expect(module).toBe(CASE_004_PLAYABLE_MODULE);
    expect(module?.caseId).toBe(CASE_004_ENTRY_ID);
    expect(module?.libraryEntry.id).toBe(CASE_004_ENTRY_ID);
    expect(module?.libraryEntry.isUnlocked).toBe(true);
    expect(module?.storage.studentProgressKey).toBe(STUDENT_CASE_STORAGE_KEY);
    expect(CASE_004_PLAYABLE_STORAGE_KEY).toBe(STUDENT_CASE_STORAGE_KEY);
    expect(module?.investigationThreads.storageKey).toBe(INVESTIGATION_THREADS_STORAGE_KEY);
  });

  it("declares contract fields future playable cases must provide", () => {
    expect(CASE_004_PLAYABLE_MODULE.milestoneIds).toEqual(
      CASE_004_MILESTONES.map((milestone) => milestone.id)
    );
    expect(CASE_004_PLAYABLE_MODULE.storage.studentProgressKeyFactory.exportName).toBe(
      "getStudentCaseStorageKey"
    );
    expect(CASE_004_PLAYABLE_MODULE.storage.persistedStateValidator.exportName).toBe(
      "hydrateStudentCaseState"
    );
    expect(CASE_004_PLAYABLE_MODULE.storage.defaultStateFactory.exportName).toBe(
      "createDefaultStudentCasePersistedState"
    );
    expect(CASE_004_PLAYABLE_MODULE.investigationThreads.seedFactory.exportName).toBe(
      "buildCase004InitialThreads"
    );
    expect(CASE_004_PLAYABLE_MODULE.investigationThreads.persistedThreadValidator.exportName).toBe(
      "hydrateThreads"
    );
    expect(CASE_004_PLAYABLE_MODULE.investigationThreads.seedCount).toBeGreaterThan(0);
    expect(CASE_004_PLAYABLE_MODULE.guidance.mentorVoice).toBe("Samuel Tupleton");
    expect(CASE_004_PLAYABLE_MODULE.guidance.authoredContent.owner).toBe(
      "apps/web/src/studentCase.ts"
    );
    expect(CASE_004_PLAYABLE_MODULE.guidance.progressionAuthority).toMatch(
      /learner-driven/i
    );
  });
});
