export const INVALID_SQL_PROGRESSION_AUTHORITIES = [
  "ui-state",
  "skeleton-selections",
  "localStorage",
  "ai",
  "prompt-text",
  "free-text-guesses"
] as const;

export type InvalidSqlProgressionAuthority =
  (typeof INVALID_SQL_PROGRESSION_AUTHORITIES)[number];

export type CaseAuthoringReleaseStatus = "released" | "gated" | "locked";

export type CaseAuthoringValidationSeverity = "error";

export type CaseAuthoringValidationFinding = {
  severity: CaseAuthoringValidationSeverity;
  code: string;
  message: string;
  path: string;
};

export type CaseAuthoringDossier = {
  caseNumber: string;
  caseName: string;
  track: string;
  publicStatus: string;
  caseShape: string;
};

export type CaseAuthoringRelease = {
  status: CaseAuthoringReleaseStatus;
  defaultPlayable: boolean;
  releaseGate: {
    behavior: string;
    envName: string | null;
    enabledValue: string | null;
  } | null;
};

export type CaseAuthoringEvidenceRequirement = {
  tableFamily: string;
  source: "database";
  requiredForMilestoneIds: readonly string[];
};

export type CaseAuthoringSqlMilestone = {
  id: string;
  title: string;
  learnerObjective: string;
  referencedTableFamilies: readonly string[];
  progressionAuthority: string;
  validationOwner: string;
  runtimeStatus: "planned" | "implemented";
};

export type CaseAuthoringStateContract = {
  commonStateCategories: readonly string[];
  caseSpecificStateCategories: readonly string[];
};

export type CaseAuthoringPersistenceContract = {
  strategy: "none" | "component-memory-only" | "case-id-keyed-local-storage";
  version: number | null;
  resetSemantics: string;
};

export type CaseAuthoringContractReference = {
  owner: string;
  exportName: string;
  responsibility: string;
};

export type CaseAuthoringSpoilerBoundary = {
  publicMetadataContainsSpoilers: boolean;
  restrictedDataExposed: boolean;
  answerKeyExposure: "none";
  prohibitedPublicFields: readonly string[];
};

export type PlayableCaseAuthoringDefinition = {
  caseId: string;
  release: CaseAuthoringRelease;
  dossier: CaseAuthoringDossier;
  evidenceRequirements: readonly CaseAuthoringEvidenceRequirement[];
  sqlMilestones: readonly CaseAuthoringSqlMilestone[];
  stateContract: CaseAuthoringStateContract;
  persistence: CaseAuthoringPersistenceContract;
  investigationThreads: CaseAuthoringContractReference;
  guidance: CaseAuthoringContractReference;
  spoilerBoundary: CaseAuthoringSpoilerBoundary;
};

function addFinding(
  findings: CaseAuthoringValidationFinding[],
  code: string,
  path: string,
  message: string
): void {
  findings.push({
    severity: "error",
    code,
    path,
    message
  });
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems(value: readonly unknown[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function validatePlayableCaseAuthoringDefinition(
  definition: Partial<PlayableCaseAuthoringDefinition>
): CaseAuthoringValidationFinding[] {
  const findings: CaseAuthoringValidationFinding[] = [];

  if (!hasText(definition.caseId)) {
    addFinding(findings, "missing-case-id", "caseId", "Case authoring requires a case id.");
  }

  if (!definition.dossier) {
    addFinding(
      findings,
      "missing-public-metadata",
      "dossier",
      "Case authoring requires public dossier metadata."
    );
  } else {
    if (!hasText(definition.dossier.caseNumber)) {
      addFinding(findings, "missing-public-metadata", "dossier.caseNumber", "Missing case number.");
    }
    if (!hasText(definition.dossier.caseName)) {
      addFinding(findings, "missing-public-metadata", "dossier.caseName", "Missing case name.");
    }
    if (!hasText(definition.dossier.caseShape)) {
      addFinding(findings, "missing-public-metadata", "dossier.caseShape", "Missing case shape.");
    }
  }

  if (!definition.release) {
    addFinding(
      findings,
      "missing-release-status",
      "release",
      "Case authoring requires release status and gate semantics."
    );
  } else {
    const isKnownStatus = ["released", "gated", "locked"].includes(definition.release.status);
    if (!isKnownStatus) {
      addFinding(findings, "invalid-release-status", "release.status", "Release status is invalid.");
    }

    if (definition.release.status === "released" && definition.release.defaultPlayable !== true) {
      addFinding(
        findings,
        "invalid-release-semantics",
        "release.defaultPlayable",
        "Released cases must be explicitly playable by default."
      );
    }

    if (definition.release.status !== "released") {
      if (definition.release.defaultPlayable !== false) {
        addFinding(
          findings,
          "invalid-release-semantics",
          "release.defaultPlayable",
          "Unreleased or gated cases must not be playable by default."
        );
      }
      if (!definition.release.releaseGate || !hasText(definition.release.releaseGate.behavior)) {
        addFinding(
          findings,
          "missing-release-gate",
          "release.releaseGate",
          "Unreleased or gated cases require explicit release-gate behavior."
        );
      }
    }
  }

  if (!hasItems(definition.evidenceRequirements)) {
    addFinding(
      findings,
      "missing-evidence-requirements",
      "evidenceRequirements",
      "Case authoring requires at least one database evidence requirement."
    );
  }

  if (!hasItems(definition.sqlMilestones)) {
    addFinding(
      findings,
      "missing-sql-milestones",
      "sqlMilestones",
      "Case authoring requires at least one SQL milestone."
    );
  }

  const declaredTableFamilies = new Set(
    (definition.evidenceRequirements ?? [])
      .map((requirement) => requirement.tableFamily)
      .filter(hasText)
  );
  const milestoneIds = new Set<string>();
  const duplicateMilestoneIds = new Set<string>();

  for (const [index, milestone] of (definition.sqlMilestones ?? []).entries()) {
    const milestonePath = `sqlMilestones[${index}]`;

    if (!hasText(milestone.id)) {
      addFinding(findings, "missing-milestone-id", `${milestonePath}.id`, "SQL milestone requires an id.");
    } else if (milestoneIds.has(milestone.id)) {
      duplicateMilestoneIds.add(milestone.id);
      addFinding(
        findings,
        "duplicate-milestone-id",
        `${milestonePath}.id`,
        `Duplicate SQL milestone id: ${milestone.id}.`
      );
    } else {
      milestoneIds.add(milestone.id);
    }

    if (!hasItems(milestone.referencedTableFamilies)) {
      addFinding(
        findings,
        "missing-milestone-table-reference",
        `${milestonePath}.referencedTableFamilies`,
        "SQL milestone requires at least one referenced evidence table family."
      );
    }

    for (const tableFamily of milestone.referencedTableFamilies ?? []) {
      if (!declaredTableFamilies.has(tableFamily)) {
        addFinding(
          findings,
          "undeclared-evidence-table-reference",
          `${milestonePath}.referencedTableFamilies`,
          `SQL milestone references undeclared evidence table family: ${tableFamily}.`
        );
      }
    }

    if (
      !hasText(milestone.validationOwner) ||
      !milestone.validationOwner.includes("deterministic")
    ) {
      addFinding(
        findings,
        "missing-deterministic-validation-owner",
        `${milestonePath}.validationOwner`,
        "SQL milestone validation must be owned by deterministic backend/result-pattern logic."
      );
    }

    if (
      !hasText(milestone.progressionAuthority) ||
      milestone.progressionAuthority !== "backend-approved-read-only-sql-results" ||
      INVALID_SQL_PROGRESSION_AUTHORITIES.some(
        (authority) => milestone.progressionAuthority === authority
      )
    ) {
      addFinding(
        findings,
        "invalid-progression-authority",
        `${milestonePath}.progressionAuthority`,
        "SQL milestone progression must come from backend-approved read-only SQL results."
      );
    }
  }

  if (!definition.stateContract) {
    addFinding(
      findings,
      "missing-state-contract",
      "stateContract",
      "Case authoring requires common and case-specific learner state declarations."
    );
  } else {
    if (!hasItems(definition.stateContract.commonStateCategories)) {
      addFinding(
        findings,
        "missing-common-state-categories",
        "stateContract.commonStateCategories",
        "State contract must declare common learner-owned state categories."
      );
    }
    if (!hasItems(definition.stateContract.caseSpecificStateCategories)) {
      addFinding(
        findings,
        "missing-case-specific-state-categories",
        "stateContract.caseSpecificStateCategories",
        "State contract must declare case-specific learner-owned state categories."
      );
    }
  }

  if (!definition.persistence) {
    addFinding(
      findings,
      "missing-persistence-semantics",
      "persistence",
      "Case authoring requires persistence and reset semantics."
    );
  } else {
    if (!hasText(definition.persistence.resetSemantics)) {
      addFinding(
        findings,
        "missing-persistence-semantics",
        "persistence.resetSemantics",
        "Persistence contract must declare reset semantics."
      );
    }
  }

  if (!definition.investigationThreads) {
    addFinding(
      findings,
      "missing-thread-ownership",
      "investigationThreads",
      "Case authoring requires investigation-thread ownership."
    );
  }

  if (!definition.guidance) {
    addFinding(
      findings,
      "missing-guidance-ownership",
      "guidance",
      "Case authoring requires guidance ownership."
    );
  }

  if (!definition.spoilerBoundary) {
    addFinding(
      findings,
      "missing-spoiler-boundary",
      "spoilerBoundary",
      "Case authoring requires an explicit spoiler-boundary declaration."
    );
  } else {
    if (definition.spoilerBoundary.publicMetadataContainsSpoilers !== false) {
      addFinding(
        findings,
        "spoiler-boundary-violation",
        "spoilerBoundary.publicMetadataContainsSpoilers",
        "Public metadata must not contain spoilers."
      );
    }
    if (definition.spoilerBoundary.restrictedDataExposed !== false) {
      addFinding(
        findings,
        "spoiler-boundary-violation",
        "spoilerBoundary.restrictedDataExposed",
        "Restricted data must not be exposed through public case authoring."
      );
    }
    if (definition.spoilerBoundary.answerKeyExposure !== "none") {
      addFinding(
        findings,
        "spoiler-boundary-violation",
        "spoilerBoundary.answerKeyExposure",
        "Answer-key exposure must be none."
      );
    }
  }

  if (duplicateMilestoneIds.size > 0) {
    return findings;
  }

  return findings;
}
