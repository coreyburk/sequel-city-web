import {
  CASE_001_PLAYABLE_SKELETON_MODULE,
  CASE_004_PLAYABLE_MODULE,
  CASE_004_PLAYABLE_STORAGE_KEY,
  getPlayableStudentCaseModule,
  isRegisteredPlayableStudentCase,
  PLAYABLE_STUDENT_CASE_MODULES
} from "./studentCaseModule";
import {
  CASE_001_ENTRY_ID,
  CASE_001_SKELETON_RELEASE_GATE,
  isCase001PlayableSkeletonEnabled
} from "./studentCase001";
import { CASE_004_ENTRY_ID, CASE_004_MILESTONES } from "./studentCase";
import { STUDENT_CASE_STORAGE_KEY } from "./useStudentCaseState";
import { INVESTIGATION_THREADS_STORAGE_KEY } from "./features/investigationThreads";

describe("student case module contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("registers Case 004 as the only playable case module", () => {
    expect(PLAYABLE_STUDENT_CASE_MODULES).toHaveLength(1);
    expect(PLAYABLE_STUDENT_CASE_MODULES[0]).toBe(CASE_004_PLAYABLE_MODULE);
    expect(PLAYABLE_STUDENT_CASE_MODULES.map((module) => module.caseId)).toEqual([
      CASE_004_ENTRY_ID
    ]);
  });

  it("returns no playable module for locked, future, unknown, or missing case ids", () => {
    expect(getPlayableStudentCaseModule(CASE_001_ENTRY_ID)).toBeNull();
    expect(getPlayableStudentCaseModule("case-006")).toBeNull();
    expect(getPlayableStudentCaseModule("case-999")).toBeNull();
    expect(getPlayableStudentCaseModule(null)).toBeNull();
    expect(getPlayableStudentCaseModule(undefined)).toBeNull();
    expect(isRegisteredPlayableStudentCase("case-006")).toBe(false);
  });

  it("keeps the Case 001 skeleton release gate closed unless explicitly enabled", () => {
    expect(isCase001PlayableSkeletonEnabled()).toBe(false);
    expect(getPlayableStudentCaseModule(CASE_001_ENTRY_ID)).toBeNull();

    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "false");

    expect(isCase001PlayableSkeletonEnabled()).toBe(false);
    expect(getPlayableStudentCaseModule(CASE_001_ENTRY_ID)).toBeNull();

    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "TRUE");

    expect(isCase001PlayableSkeletonEnabled()).toBe(false);
    expect(getPlayableStudentCaseModule(CASE_001_ENTRY_ID)).toBeNull();
  });

  it("returns the Case 001 skeleton module only when the release gate is enabled", () => {
    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "true");

    const module = getPlayableStudentCaseModule(CASE_001_ENTRY_ID);

    expect(isCase001PlayableSkeletonEnabled()).toBe(true);
    expect(module).toBe(CASE_001_PLAYABLE_SKELETON_MODULE);
    expect(module?.moduleKind).toBe("skeleton");
    expect(module?.caseId).toBe(CASE_001_ENTRY_ID);
    expect(module?.libraryEntry.isUnlocked).toBe(false);
    expect(module?.libraryEntry.statusLabel).toBe("Archive Locked");
    expect(module?.libraryEntry.landingEyebrow).toBe("Public Spectacle");
    if (module?.moduleKind !== "skeleton") {
      throw new Error("Expected the gated Case 001 module to be a skeleton module.");
    }
    expect(module.releaseGate.envName).toBe(CASE_001_SKELETON_RELEASE_GATE);
    expect(module.releaseGate.enabledValue).toBe("true");
  });

  it("exposes the Case 004 identity and storage keys without changing existing keys", () => {
    const module = getPlayableStudentCaseModule(CASE_004_ENTRY_ID);

    expect(module).toBe(CASE_004_PLAYABLE_MODULE);
    expect(module?.moduleKind).toBe("full");
    expect(module?.caseId).toBe(CASE_004_ENTRY_ID);
    expect(module?.libraryEntry.id).toBe(CASE_004_ENTRY_ID);
    expect(module?.libraryEntry.isUnlocked).toBe(true);
    if (module?.moduleKind !== "full") {
      throw new Error("Expected Case 004 to remain a full playable module.");
    }
    expect(module.storage.studentProgressKey).toBe(STUDENT_CASE_STORAGE_KEY);
    expect(CASE_004_PLAYABLE_STORAGE_KEY).toBe(STUDENT_CASE_STORAGE_KEY);
    expect(module.investigationThreads.storageKey).toBe(INVESTIGATION_THREADS_STORAGE_KEY);
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
