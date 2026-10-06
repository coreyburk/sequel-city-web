import { act, renderHook, waitFor } from "@testing-library/react";
import { executeQuery, getSchemaTables } from "./api/client";
import type { QueryExecutionResponse, QueryRow } from "./api/types";
import { useStudentCaseState } from "./useStudentCaseState";
import { CASE_001_M0, CASE_001_M1, CASE_001_M2, CASE_001_PROGRESS_KEY } from "./studentCase001Progress";

vi.mock("./api/client", () => ({ executeQuery: vi.fn(), getSchemaTables: vi.fn(), verifySuspect: vi.fn() }));
const row: QueryRow = { values: { ReportID: 123, LogTranscript: "arbitrary transcript" }, displayValues: { ReportID: "123", LogTranscript: "arbitrary transcript" } };
const crimeTypeRow: QueryRow = { values: { CrimeID: 1080, CrimeType: "Murder" }, displayValues: { CrimeID: "1080", CrimeType: "Murder" } };
function response(id: typeof CASE_001_M0 | typeof CASE_001_M1 | typeof CASE_001_M2): Extract<QueryExecutionResponse, { success: true }> {
  return { success: true, data: { rows: id === CASE_001_M0 ? [crimeTypeRow] : [row], columns: [], rowCount: 1 }, safety: { isAllowed: true, normalizedStatementType: "SELECT", violations: [], message: "Allowed" }, executionTimeMs: 1, message: "OK", caseMilestoneEvaluation: { caseId: "case-001", milestoneId: id, evidenceTableFamily: id === CASE_001_M0 ? "CrimeType" : id === CASE_001_M1 ? "CrimeSceneReport" : "InterviewLog", gate: { name: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON", enabledValue: "true", isEnabled: true }, evaluated: true, matched: true, matchedRowCount: 1, runtimeStatus: "evaluated-no-progression", milestoneAdvanced: false } };
}

beforeEach(() => {
  localStorage.clear(); vi.clearAllMocks(); vi.stubEnv("VITE_ENABLE_CASE_001_PLAYABLE_SKELETON", "true");
  vi.mocked(getSchemaTables).mockResolvedValue({ success: true, data: { tables: [], relationships: [] } } as never);
});
afterEach(() => vi.unstubAllEnvs());

it("starts with the foundation query and rejects later milestones until each prior step is proved", async () => {
  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));
  await act(async () => {});
  act(() => { result.current.handleStudentEvidenceLog(row); });
  expect(result.current.completedCount).toBe(0);
  expect(result.current.mentorTitle).toBe("Case 001 Briefing");
  expect(result.current.mentorMessage).toContain("Run SELECT * FROM CrimeType; first");
  expect(result.current.studentObjective).toContain("Determine who committed the crime");
  act(() => result.current.setStudentView("workbench"));
  expect(result.current.studentObjective).toContain("Prove which CrimeID identifies the case's recorded crime type");
  act(() => result.current.handleQueryExecutionComplete({ sql: "SELECT * FROM InterviewLog", response: response(CASE_001_M2), error: null }));
  expect(result.current.completedCount).toBe(0);
  act(() => result.current.handleQueryExecutionComplete({ sql: "SELECT * FROM CrimeSceneReport", response: response(CASE_001_M1), error: null }));
  expect(result.current.completedCount).toBe(0);
  act(() => result.current.handleQueryExecutionComplete({ sql: "SELECT * FROM CrimeType", response: response(CASE_001_M0), error: null }));
  expect(result.current.completedCount).toBe(1);
  expect(result.current.studentCaseQueryGuide?.tokens).toContain("CrimeID = 1080");
  act(() => result.current.handleQueryExecutionComplete({ sql: "SELECT * FROM CrimeSceneReport", response: response(CASE_001_M1), error: null }));
  expect(result.current.completedCount).toBe(2);
  expect(result.current.studentObjective).toContain("find interviews linked to the clocktower incident report");
  act(() => result.current.handleQueryExecutionComplete({ sql: "SELECT * FROM InterviewLog", response: response(CASE_001_M2), error: null }));
  expect(result.current.completedCount).toBe(3);
  expect(result.current.mentorTitle).toBe("Released evidence review complete.");
  expect(result.current.mentorMessage).toContain("does not identify a culprit");
  for (const view of ["briefing", "workbench", "case-board"] as const) {
    act(() => result.current.setStudentView(view));
    expect(result.current.activeSamuelStep.title).toBe("Released evidence review complete.");
    expect(result.current.studentObjective).toContain(
      view === "briefing"
        ? "Determine who committed the crime"
        : "Review your report and interview notes"
    );
    expect(result.current.studentCaseQueryGuide?.intro).not.toContain("Do not use InterviewLog");
  }
  act(() => result.current.resetStudentCaseProgress());
  expect(result.current.completedCount).toBe(0);
  expect(result.current.mentorTitle).toBe("Case 001 Briefing");
  expect(result.current.activeSamuelStep.title).toBe("Identify the case crime type.");
});

it("does not restore an InterviewLog draft before the foundation milestone", async () => {
  localStorage.setItem(
    CASE_001_PROGRESS_KEY,
    JSON.stringify({
      version: 1,
      caseId: "case-001",
      state: { studentView: "workbench", studentDraftQuery: "SELECT * FROM InterviewLog;" }
    })
  );

  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));

  expect(result.current.studentDraftQuery).toBe("SELECT * FROM CrimeType;");
  await act(async () => {});
  expect(result.current.studentDraftQuery).toBe("SELECT * FROM CrimeType;");
});

it("keeps an intermediate report query in the editor until one row remains", async () => {
  const partialReportResponse = response(CASE_001_M1);
  partialReportResponse.data = {
    ...partialReportResponse.data,
    rows: [row, row],
    rowCount: 2
  };
  partialReportResponse.caseMilestoneEvaluation = {
    ...partialReportResponse.caseMilestoneEvaluation!,
    matched: false,
    matchedRowCount: 1
  };

  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));
  act(() => result.current.handleQueryExecutionComplete({
    sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
    response: partialReportResponse,
    error: null
  }));

  expect(result.current.completedCount).toBe(0);
  expect(result.current.studentDraftQuery).toBe(
    "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080"
  );
  expect(result.current.studentEvidenceFeedback).toContain("2 CrimeSceneReport rows remain");
});

it("revalidates saved query references instead of trusting completion flags", async () => {
  localStorage.setItem(CASE_001_PROGRESS_KEY, JSON.stringify({ version: 1, caseId: "case-001", state: { completedMilestones: { [CASE_001_M1]: true, [CASE_001_M2]: true }, evidenceQueries: { [CASE_001_M1]: "SELECT 1" } } }));
  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));
  expect(result.current.completedCount).toBe(0);
  expect(executeQuery).not.toHaveBeenCalled();
});

it("restores the validated report result when resuming at the interview step", async () => {
  const savedCrimeTypeSql = "SELECT * FROM CrimeType";
  const savedReportSql = "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080";
  localStorage.setItem(
    CASE_001_PROGRESS_KEY,
    JSON.stringify({
      version: 1,
      caseId: "case-001",
      state: { studentView: "workbench", evidenceQueries: { [CASE_001_M0]: savedCrimeTypeSql, [CASE_001_M1]: savedReportSql } }
    })
  );
  vi.mocked(executeQuery)
    .mockResolvedValueOnce(response(CASE_001_M0))
    .mockResolvedValueOnce(response(CASE_001_M1));

  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));

  await waitFor(() => expect(result.current.completedCount).toBe(2));
  expect(result.current.activeSamuelStep.title).toBe("Let’s follow the paper trail.");
  expect(result.current.mentorMessage).toContain("resuming with the report search already saved");
  expect(result.current.mentorMessage).not.toContain("Nice work finding the clocktower report");
  expect(result.current.studentRestoredExecution?.sql).toBe(savedReportSql);
  expect(result.current.studentRestoredExecution?.response?.success).toBe(true);
});

it("ignores an in-flight restore response after reset", async () => {
  localStorage.setItem(CASE_001_PROGRESS_KEY, JSON.stringify({ version: 1, caseId: "case-001", state: { evidenceQueries: { [CASE_001_M0]: "SELECT * FROM CrimeType", [CASE_001_M1]: "SELECT * FROM CrimeSceneReport" } } }));
  let resolve!: (value: QueryExecutionResponse) => void;
  vi.mocked(executeQuery).mockReturnValue(new Promise(done => { resolve = done; }));
  const { result } = renderHook(() => useStudentCaseState("student", "case-001"));
  await waitFor(() => expect(executeQuery).toHaveBeenCalledOnce());
  act(() => result.current.resetStudentCaseProgress());
  await act(async () => resolve(response(CASE_001_M0)));
  expect(result.current.completedCount).toBe(0);
  expect(localStorage.getItem(CASE_001_PROGRESS_KEY)).toBeNull();
});

