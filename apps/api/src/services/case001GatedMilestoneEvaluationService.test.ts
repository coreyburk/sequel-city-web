const assert = require("node:assert/strict") as typeof import("node:assert/strict");
const case001GatedMilestoneEvaluationService =
  require("./case001GatedMilestoneEvaluationService.ts") as typeof import("./case001GatedMilestoneEvaluationService");

import type { QueryExecutionSuccessData, QueryRow } from "../types/query";

type TestCase = {
  name: string;
  run: () => void;
};

const publicClocktowerReportRow = createRow({
  ReportDate: "20230502",
  CrimeID: 1080,
  ReportDescription:
    "Public clocktower ceremony report: civic official collapsed after a toast during the bell sequence; medical response noted suspected poisoning and clockroom access records held for timeline review.",
  ReportCity: "Sequel City"
});

const testCases: TestCase[] = [
  {
    name: "evaluates the Case 001 clocktower validator when the skeleton gate is enabled",
    run: () => {
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone({
          caseId: "case-001",
          isSkeletonGateEnabled: true,
          queryResult: createQueryResult([publicClocktowerReportRow])
        });

      assert.deepEqual(result, {
        caseId: "case-001",
        milestoneId: "case-001-clocktower-report-located",
        evidenceTableFamily: "CrimeSceneReport",
        gate: {
          name: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
          enabledValue: "true",
          isEnabled: true
        },
        evaluated: true,
        matched: true,
        matchedRowCount: 1,
        runtimeStatus: "evaluated-no-progression",
        milestoneAdvanced: false
      });
    }
  },
  {
    name: "reports gate-enabled no-match results without advancing progression",
    run: () => {
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone({
          caseId: "case-001",
          isSkeletonGateEnabled: true,
          queryResult: createQueryResult([
            createRow({
              ReportDate: "20230502",
              CrimeID: 1080,
              ReportDescription: "Public theater report after a toast.",
              ReportCity: "Sequel City"
            })
          ])
        });

      assert.equal(result.evaluated, true);
      assert.equal(result.matched, false);
      assert.equal(result.matchedRowCount, 0);
      assert.equal(result.runtimeStatus, "evaluated-no-progression");
      assert.equal(result.milestoneAdvanced, false);
    }
  },
  {
    name: "does not call the validator when the skeleton gate is disabled",
    run: () => {
      let validatorCallCount = 0;
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone(
          {
            caseId: "case-001",
            isSkeletonGateEnabled: false,
            queryResult: createQueryResult([publicClocktowerReportRow])
          },
          () => {
            validatorCallCount += 1;
            throw new Error("validator should not be called");
          }
        );

      assert.equal(validatorCallCount, 0);
      assert.deepEqual(result, {
        caseId: "case-001",
        milestoneId: "case-001-clocktower-report-located",
        evidenceTableFamily: "CrimeSceneReport",
        gate: {
          name: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
          enabledValue: "true",
          isEnabled: false
        },
        evaluated: false,
        matched: false,
        matchedRowCount: 0,
        runtimeStatus: "gate-disabled",
        milestoneAdvanced: false
      });
    }
  },
  {
    name: "does not call the validator for non-Case 001 ids",
    run: () => {
      let validatorCallCount = 0;
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone(
          {
            caseId: "case-004",
            isSkeletonGateEnabled: true,
            queryResult: createQueryResult([publicClocktowerReportRow])
          },
          () => {
            validatorCallCount += 1;
            throw new Error("validator should not be called");
          }
        );

      assert.equal(validatorCallCount, 0);
      assert.equal(result.caseId, "case-004");
      assert.equal(result.gate.isEnabled, true);
      assert.equal(result.evaluated, false);
      assert.equal(result.matched, false);
      assert.equal(result.matchedRowCount, 0);
      assert.equal(result.runtimeStatus, "not-case-001");
      assert.equal(result.milestoneAdvanced, false);
    }
  },
  {
    name: "returns non-spoiler metadata without row contents or query text",
    run: () => {
      const queryResult = createQueryResult([publicClocktowerReportRow]);
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone({
          caseId: "case-001",
          isSkeletonGateEnabled: true,
          queryResult
        });

      const serialized = JSON.stringify(result);

      assert.equal(serialized.includes("rows"), false);
      assert.equal(serialized.includes("columns"), false);
      assert.equal(serialized.includes("sql"), false);
      assert.equal(serialized.includes("Public clocktower ceremony report"), false);
      assert.equal(serialized.includes("suspected poisoning"), false);
      assert.equal(serialized.includes("CaseAnswerKey"), false);
      assert.equal(serialized.includes("Solution"), false);
    }
  },
  {
    name: "keeps duplicate matches as metadata only and never advances milestone state",
    run: () => {
      const result =
        case001GatedMilestoneEvaluationService.evaluateCase001GatedMilestone({
          caseId: "case-001",
          isSkeletonGateEnabled: true,
          queryResult: createQueryResult([
            publicClocktowerReportRow,
            publicClocktowerReportRow
          ])
        });

      assert.equal(result.matched, true);
      assert.equal(result.matchedRowCount, 2);
      assert.equal(result.runtimeStatus, "evaluated-no-progression");
      assert.equal(result.milestoneAdvanced, false);
    }
  }
];

runTests();

function createQueryResult(rows: QueryRow[]): QueryExecutionSuccessData {
  return {
    columns: [],
    rows,
    rowCount: rows.length
  };
}

function createRow(
  values: Record<string, string | number | boolean | null>
): QueryRow {
  return {
    values,
    displayValues: Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === null ? "" : String(value)
      ])
    )
  };
}

function runTests(): void {
  let failedCount = 0;

  for (const testCase of testCases) {
    try {
      testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failedCount += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(error);
    }
  }

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}
