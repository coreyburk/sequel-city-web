import {
  type PlayableCaseAuthoringDefinition,
  validatePlayableCaseAuthoringDefinition
} from "./caseAuthoring";

function buildValidDefinition(): PlayableCaseAuthoringDefinition {
  return {
    caseId: "case-001",
    release: {
      status: "gated",
      defaultPlayable: false,
      releaseGate: {
        behavior:
          "Available only when VITE_ENABLE_CASE_001_PLAYABLE_SKELETON is exactly true.",
        envName: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
        enabledValue: "true"
      }
    },
    dossier: {
      caseNumber: "001",
      caseName: "The Clocktower Poisoning",
      track: "Foundations",
      publicStatus: "Archive Locked",
      caseShape: "A public poisoning case built for early timeline checks."
    },
    evidenceRequirements: [
      {
        tableFamily: "CrimeSceneReport",
        source: "database",
        requiredForMilestoneIds: ["case-001-clocktower-report-located"]
      }
    ],
    sqlMilestones: [
      {
        id: "case-001-clocktower-report-located",
        title: "Clocktower Incident Report Located",
        learnerObjective:
          "Use a read-only SQL query to locate the public clocktower incident report.",
        referencedTableFamilies: ["CrimeSceneReport"],
        progressionAuthority: "backend-approved-read-only-sql-results",
        validationOwner: "future-deterministic-backend-result-pattern",
        runtimeStatus: "planned"
      }
    ],
    stateContract: {
      commonStateCategories: ["notebook", "pinned-facts", "query-draft"],
      caseSpecificStateCategories: ["case-001-sql-milestones"]
    },
    persistence: {
      strategy: "case-id-keyed-local-storage",
      version: 1,
      resetSemantics: "Clear only learner-owned progress for this case id."
    },
    investigationThreads: {
      owner: "future Case 001 thread module",
      exportName: "buildCase001InitialThreads",
      responsibility: "provide authored non-spoiler thread seeds for Case 001"
    },
    guidance: {
      owner: "future Case 001 guidance module",
      exportName: "CASE_001_GUIDANCE",
      responsibility: "provide authored Samuel Tupleton guidance for Case 001"
    },
    spoilerBoundary: {
      publicMetadataContainsSpoilers: false,
      restrictedDataExposed: false,
      answerKeyExposure: "none",
      prohibitedPublicFields: ["culprit", "mastermind", "solutionQuery", "answerKeyRow"]
    }
  };
}

describe("case authoring validation", () => {
  it("accepts a minimal valid first-SQL case definition", () => {
    expect(validatePlayableCaseAuthoringDefinition(buildValidDefinition())).toEqual([]);
  });

  it("rejects incomplete definitions with structured findings", () => {
    const findings = validatePlayableCaseAuthoringDefinition({});

    expect(findings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining([
        "missing-case-id",
        "missing-public-metadata",
        "missing-release-status",
        "missing-evidence-requirements",
        "missing-sql-milestones",
        "missing-state-contract",
        "missing-persistence-semantics",
        "missing-thread-ownership",
        "missing-guidance-ownership",
        "missing-spoiler-boundary"
      ])
    );
    expect(findings.every((finding) => finding.severity === "error")).toBe(true);
    expect(findings.every((finding) => typeof finding.path === "string")).toBe(true);
  });

  it("rejects invalid SQL progression authorities", () => {
    const invalidAuthorities = [
      "ui-state",
      "skeleton-selections",
      "localStorage",
      "ai",
      "prompt-text",
      "free-text-guesses"
    ];

    for (const authority of invalidAuthorities) {
      const definition = buildValidDefinition();
      definition.sqlMilestones = [
        {
          ...definition.sqlMilestones[0],
          progressionAuthority: authority
        }
      ];

      expect(validatePlayableCaseAuthoringDefinition(definition)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "invalid-progression-authority",
            path: "sqlMilestones[0].progressionAuthority"
          })
        ])
      );
    }
  });

  it("rejects duplicate milestone ids", () => {
    const definition = buildValidDefinition();
    definition.sqlMilestones = [
      definition.sqlMilestones[0],
      {
        ...definition.sqlMilestones[0],
        title: "Duplicate Boundary"
      }
    ];

    expect(validatePlayableCaseAuthoringDefinition(definition)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate-milestone-id",
          path: "sqlMilestones[1].id"
        })
      ])
    );
  });

  it("rejects milestone table references outside declared evidence requirements", () => {
    const definition = buildValidDefinition();
    definition.sqlMilestones = [
      {
        ...definition.sqlMilestones[0],
        referencedTableFamilies: ["InterviewLog"]
      }
    ];

    expect(validatePlayableCaseAuthoringDefinition(definition)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "undeclared-evidence-table-reference",
          path: "sqlMilestones[0].referencedTableFamilies"
        })
      ])
    );
  });

  it("requires gated or unreleased cases to declare release-gate behavior without release unlock", () => {
    const definition = buildValidDefinition();
    definition.release = {
      status: "gated",
      defaultPlayable: true,
      releaseGate: null
    };

    expect(validatePlayableCaseAuthoringDefinition(definition)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-release-semantics",
          path: "release.defaultPlayable"
        }),
        expect.objectContaining({
          code: "missing-release-gate",
          path: "release.releaseGate"
        })
      ])
    );
  });
});
