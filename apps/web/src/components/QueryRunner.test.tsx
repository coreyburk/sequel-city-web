import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryRunner } from "./QueryRunner";
import { executeQuery } from "../api/client";
import { SAFE_SELECT_ONLY_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  executeQuery: vi.fn()
}));

describe("QueryRunner", () => {
  it("keeps safe SELECT guidance visible before submission", () => {
    render(<QueryRunner />);

    expect(screen.getByText(SAFE_SELECT_ONLY_GUIDANCE)).toBeInTheDocument();
    expect(screen.getByLabelText("SQL query input")).toBeInTheDocument();
  });

  it("starts students with the original investigation query guidance instead of the developer default", () => {
    render(<QueryRunner audience="student" />);

    const studentQuery = (screen.getByLabelText("SQL query input") as HTMLTextAreaElement).value;
    expect(studentQuery).toBe("SELECT * FROM CrimeType");
    expect(studentQuery).not.toBe("SELECT DB_NAME() AS CurrentDatabase");
  });

  it("updates the student query draft when the on-ramp loads a new breadcrumb query", () => {
    const { rerender } = render(<QueryRunner audience="student" draftQuery="SELECT * FROM CrimeType" />);

    expect(screen.getByLabelText("SQL query input")).toHaveValue("SELECT * FROM CrimeType");

    rerender(
      <QueryRunner
        audience="student"
        draftQuery={"SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080"}
      />
    );

    expect(screen.getByLabelText("SQL query input")).toHaveValue(
      "SELECT *\nFROM CrimeSceneReport\nWHERE CrimeID = 1080"
    );
  });

  it("hides callout guidance in student audience mode", () => {
    render(<QueryRunner audience="student" />);

    expect(screen.queryByLabelText("Query runner guidance")).not.toBeInTheDocument();
  });

  it("renders blocked SQL guidance with backend safety details", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: false,
      safety: {
        isAllowed: false,
        normalizedStatementType: "DELETE",
        violations: [
          {
            code: "DISALLOWED_STATEMENT",
            message: "DELETE statements are not allowed."
          }
        ],
        message: "DELETE statements are not allowed."
      },
      executionTimeMs: 2,
      message: "Query blocked: DELETE statements are not allowed."
    });

    render(<QueryRunner />);

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(
        screen.getByText("Query blocked: DELETE statements are not allowed.")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("DELETE statements are not allowed.")).toBeInTheDocument();
    expect(screen.getAllByText(SAFE_SELECT_ONLY_GUIDANCE)).toHaveLength(2);
  });

  it("emits execution callback payload on successful query", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [],
        rows: [],
        rowCount: 0
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 1,
      message: "Executed."
    });
    const onExecutionComplete = vi.fn();

    render(<QueryRunner onExecutionComplete={onExecutionComplete} />);

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(onExecutionComplete).toHaveBeenCalledTimes(1);
    });
    expect(onExecutionComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "SELECT DB_NAME() AS CurrentDatabase",
        error: null
      })
    );
  });

  it("hides developer diagnostics summary cards in student audience mode", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [],
        rows: [],
        rowCount: 0
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 1,
      message: "Executed."
    });

    render(<QueryRunner audience="student" />);
    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(screen.queryByText("Safety")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Backend Message")).not.toBeInTheDocument();
    expect(screen.queryByText("Execution Time")).not.toBeInTheDocument();
  });

  it("keeps student results factual when Samuel has not given a prompt or feedback", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [{ name: "CrimeID", ordinal: 0, dataType: "number" }],
        rows: [{ values: { CrimeID: 1080 }, displayValues: { CrimeID: "1080" } }],
        rowCount: 1
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 3,
      message: "Executed."
    });

    render(<QueryRunner audience="student" />);
    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    expect(await screen.findByText("1080")).toBeInTheDocument();
    expect(screen.queryByLabelText("Samuel's Results Guidance")).not.toBeInTheDocument();
    expect(screen.queryByText("Evidence Update")).not.toBeInTheDocument();
  });

  it("restores the previous student result when returning to the query lab", () => {
    render(
      <QueryRunner
        audience="student"
        draftQuery={null}
        restoredExecution={{
          sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'",
          response: {
            success: true,
            data: {
              columns: [
                { name: "ReportID", ordinal: 0, dataType: "number" },
                { name: "ReportDescription", ordinal: 1, dataType: "string" }
              ],
              rows: [
                {
                  values: {
                    ReportID: 10975,
                    ReportDescription: "Witness details are listed in the report."
                  },
                  displayValues: {
                    ReportID: "10975",
                    ReportDescription: "Witness details are listed in the report."
                  }
                }
              ],
              rowCount: 1
            },
            safety: {
              isAllowed: true,
              normalizedStatementType: "SELECT",
              violations: [],
              message: "Safe."
            },
            executionTimeMs: 3,
            message: "Executed."
          },
          error: null
        }}
      />
    );

    expect(screen.getByLabelText("SQL query input")).toHaveValue("");
    expect(screen.getByText("ReportID")).toBeInTheDocument();
    expect(screen.getByText("10975")).toBeInTheDocument();
    expect(screen.getByText("Witness details are listed in the report.")).toBeInTheDocument();
  });

  it("shows notebook guidance and row logging actions when Student Mode requires evidence logging", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: {
        columns: [
          { name: "CrimeID", ordinal: 0, dataType: "number" },
          { name: "Crime", ordinal: 1, dataType: "string" }
        ],
        rows: [
          {
            values: { CrimeID: 1080, Crime: "Murder" },
            displayValues: { CrimeID: "1080", Crime: "Murder" }
          }
        ],
        rowCount: 1
      },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 3,
      message: "Executed."
    });

    const onStudentLogRow = vi.fn();

    render(
      <QueryRunner
        audience="student"
        studentEvidencePrompt="Possible clue found. Log the row that proves Murder maps to the correct CrimeID."
        onStudentLogRow={onStudentLogRow}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    expect(await screen.findByRole("button", { name: "Log clue" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Samuel's Notebook Prompt")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Log clue" }));

    expect(onStudentLogRow).toHaveBeenCalledTimes(1);
  });
});
