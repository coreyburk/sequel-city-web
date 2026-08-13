import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StudentPlayableCaseSkeletonView } from "./StudentPlayableCaseSkeletonView";
import { executeQuery } from "../../api/client";
import { CASE_001_PLAYABLE_SKELETON_MODULE } from "../../studentCaseModule";
import { CASE_001_SKELETON_RELEASE_GATE } from "../../studentCase001";

vi.mock("../../api/client", () => ({
  executeQuery: vi.fn()
}));

describe("StudentPlayableCaseSkeletonView", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("submits the first Case 001 SQL query with explicit gated milestone metadata", async () => {
    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "true");
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [
          {
            name: "ReportDescription",
            ordinal: 0,
            dataType: "string"
          }
        ],
        rows: [
          {
            values: {
              ReportDescription:
                "Spoiler-safe public report text should not be rendered by this slice."
            },
            displayValues: {
              ReportDescription:
                "Spoiler-safe public report text should not be rendered by this slice."
            }
          }
        ],
        rowCount: 1
      },
      caseMilestoneEvaluation: {
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
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "SQL statement is allowed."
      },
      executionTimeMs: 5,
      message: "Query executed successfully."
    });

    render(<StudentPlayableCaseSkeletonView module={CASE_001_PLAYABLE_SKELETON_MODULE} />);

    fireEvent.click(screen.getByRole("button", { name: "Check Report Query" }));

    await waitFor(() => {
      expect(executeQuery).toHaveBeenCalledWith(
        "SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080;",
        {
          caseMilestoneEvaluation: {
            caseId: "case-001",
            milestoneId: "case-001-clocktower-report-located",
            isSkeletonGateEnabled: true
          }
        }
      );
    });

    expect(await screen.findByText(/Public report located/i)).toBeInTheDocument();
    expect(screen.getByText(/does not unlock the archive/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Spoiler-safe public report text should not be rendered/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/matchedRowCount/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/milestoneAdvanced/i)).not.toBeInTheDocument();
  });

  it("shows non-spoiler no-match feedback without rendering query rows", async () => {
    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "true");
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [],
        rows: [],
        rowCount: 0
      },
      caseMilestoneEvaluation: {
        caseId: "case-001",
        milestoneId: "case-001-clocktower-report-located",
        evidenceTableFamily: "CrimeSceneReport",
        gate: {
          name: "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
          enabledValue: "true",
          isEnabled: true
        },
        evaluated: true,
        matched: false,
        matchedRowCount: 0,
        runtimeStatus: "evaluated-no-progression",
        milestoneAdvanced: false
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "SQL statement is allowed."
      },
      executionTimeMs: 4,
      message: "Query executed successfully."
    });

    render(<StudentPlayableCaseSkeletonView module={CASE_001_PLAYABLE_SKELETON_MODULE} />);

    fireEvent.change(screen.getByLabelText("Report query"), {
      target: { value: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 9999;" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Check Report Query" }));

    expect(await screen.findByText(/No milestone match yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("keeps empty query validation local and does not write persistence", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    vi.stubEnv(CASE_001_SKELETON_RELEASE_GATE, "true");

    render(<StudentPlayableCaseSkeletonView module={CASE_001_PLAYABLE_SKELETON_MODULE} />);

    fireEvent.change(screen.getByLabelText("Report query"), {
      target: { value: "   " }
    });
    fireEvent.click(screen.getByRole("button", { name: "Check Report Query" }));

    expect(
      screen.getByText(/Enter a read-only SQL query before checking the report record/i)
    ).toBeInTheDocument();
    expect(executeQuery).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    setItemSpy.mockRestore();
  });
});
