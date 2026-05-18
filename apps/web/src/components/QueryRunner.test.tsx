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

  it("switches student guidance to query-writing mode during the witness transition review", () => {
    render(
      <QueryRunner
        audience="student"
        draftQuery={null}
        restoredExecution={{
          sql: "SELECT * FROM CrimeSceneReport WHERE ReportID = 10975",
          response: {
            success: true,
            data: {
              columns: [{ name: "ReportID", ordinal: 0, dataType: "number" }],
              rows: [{ values: { ReportID: 10975 }, displayValues: { ReportID: "10975" } }],
              rowCount: 1
            },
            safety: {
              isAllowed: true,
              normalizedStatementType: "SELECT",
              violations: [],
              message: "Safe."
            },
            executionTimeMs: 1,
            message: "Executed."
          },
          error: null
        }}
      />
    );

    expect(
      screen.getByText(
        "Review the restored result, then write your next query."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("SQL query input")).toHaveValue("");
  });

  it("uses an explicit student instruction override when provided", () => {
    render(
      <QueryRunner
        audience="student"
        studentInstruction="Write your InterviewLog query now, then sort the rows by PersonID."
      />
    );

    expect(
      screen.getByText("Write your InterviewLog query now, then sort the rows by PersonID.")
    ).toBeInTheDocument();
  });

  it("inserts SQL building blocks into the student query editor", () => {
    render(<QueryRunner audience="student" />);

    const textarea = screen.getByLabelText("SQL query input") as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole("button", { name: "WHERE" }));

    expect(textarea.value).toContain("WHERE");
  });

  it("inserts external query-assist text into the student query editor without duplicating the same request", () => {
    const { rerender } = render(
      <QueryRunner
        audience="student"
        draftQuery=""
        queryAssistRequest={{ id: "assist-1", text: "CrimeID = 1080" }}
      />
    );

    const textarea = screen.getByLabelText("SQL query input");
    expect(textarea).toHaveValue("CrimeID = 1080");

    rerender(
      <QueryRunner
        audience="student"
        draftQuery=""
        queryAssistRequest={{ id: "assist-1", text: "CrimeID = 1080" }}
      />
    );
    expect(textarea).toHaveValue("CrimeID = 1080");

    rerender(
      <QueryRunner
        audience="student"
        draftQuery=""
        queryAssistRequest={{ id: "assist-2", text: "AND ReportCity = 'SQL City'" }}
      />
    );
    expect(textarea).toHaveValue("CrimeID = 1080 AND ReportCity = 'SQL City'");
  });

  it("notifies student SQL edits for typing and quick-insert actions", () => {
    const onStudentSqlEdit = vi.fn();

    render(<QueryRunner audience="student" draftQuery="" onStudentSqlEdit={onStudentSqlEdit} />);

    fireEvent.change(screen.getByLabelText("SQL query input"), {
      target: { value: "SELECT" }
    });
    fireEvent.click(screen.getByRole("button", { name: "WHERE" }));

    expect(onStudentSqlEdit).toHaveBeenCalledTimes(2);
  });

  it("keeps keyboard focus on the query editor after running a student query", async () => {
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

    const scrollIntoViewSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy;

    render(<QueryRunner audience="student" />);

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(screen.getByText("No rows returned.")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("SQL query input")).toHaveFocus();
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it("shows student failure guidance when a witness-stage query errors", async () => {
    vi.mocked(executeQuery).mockRejectedValue(new Error("Column is invalid in the select list."));

    render(
      <QueryRunner
        audience="student"
        studentFailureGuidance="If this query fails, simplify it. Do not GROUP BY or JOIN yet."
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    expect(await screen.findByText("Column is invalid in the select list.")).toBeInTheDocument();
    expect(
      screen.getByText("If this query fails, simplify it. Do not GROUP BY or JOIN yet.")
    ).toBeInTheDocument();
  });

  it("renders deterministic reinforcement feedback after a successful student query", async () => {
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
      executionTimeMs: 1,
      message: "Executed."
    });

    render(
      <QueryRunner
        audience="student"
        studentReinforcement={{
          id: "productive-narrowing",
          category: "productive-narrowing",
          tone: "positive",
          headline: "Crime catalog stage: productive narrowing",
          message: "You narrowed the result set to 1 row."
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(
        screen.getByLabelText("Query reinforcement feedback")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Crime catalog stage: productive narrowing")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You narrowed the result set to 1 row.")
    ).toBeInTheDocument();
  });

  it("renders the Samuel reaction note alongside reinforcement for student audience", async () => {
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
      executionTimeMs: 1,
      message: "Executed."
    });

    render(
      <QueryRunner
        audience="student"
        studentSamuelReaction={{
          id: "productive-narrowing-1",
          category: "productive-narrowing",
          tone: "encouraging",
          message: "Now you're thinking like a detective."
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(
        screen.getByLabelText("Samuel's mentor reaction")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Now you're thinking like a detective.")
    ).toBeInTheDocument();
  });

  it("hides the Samuel reaction note for developer audience", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: { columns: [], rows: [], rowCount: 0 },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 1,
      message: "Executed."
    });

    render(
      <QueryRunner
        studentSamuelReaction={{
          id: "productive-narrowing-1",
          category: "productive-narrowing",
          tone: "encouraging",
          message: "Should not appear in developer mode."
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(screen.getByText("No rows returned.")).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText("Samuel's mentor reaction")
    ).not.toBeInTheDocument();
  });

  it("does not render reinforcement feedback for developer audience", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: { columns: [], rows: [], rowCount: 0 },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 1,
      message: "Executed."
    });

    render(
      <QueryRunner
        studentReinforcement={{
          id: "productive-narrowing",
          category: "productive-narrowing",
          tone: "positive",
          headline: "Should not appear in developer mode",
          message: "Should not appear in developer mode"
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(screen.getByText("No rows returned.")).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText("Query reinforcement feedback")
    ).not.toBeInTheDocument();
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

    const logButton = await screen.findByRole("button", { name: "Log row 1 as evidence" });
    expect(logButton).toBeInTheDocument();
    expect(screen.queryByLabelText("Samuel's Notebook Prompt")).not.toBeInTheDocument();
    fireEvent.click(logButton);

    expect(onStudentLogRow).toHaveBeenCalledTimes(1);
  });

  it("renders an inline wrong-clue feedback callout above the results table (WP-110)", async () => {
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
      executionTimeMs: 2,
      message: "Executed."
    });

    render(
      <QueryRunner
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        studentEvidenceFeedback="That row is still not the target murder report. Re-check the date, city, and report ID before you log it."
        studentEvidenceFeedbackTone="error"
        onStudentLogRow={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    const feedback = await screen.findByLabelText("Clue rejected");
    expect(feedback).toHaveAttribute("role", "alert");
    expect(feedback).toHaveAttribute("data-student-feedback", "error");
    expect(feedback.className).toContain("student-evidence-feedback");
    expect(feedback.className).toContain("student-evidence-feedback--error");
    expect(feedback).toHaveTextContent("Try Another Row");
    expect(feedback).toHaveTextContent(
      "That row is still not the target murder report. Re-check the date, city, and report ID before you log it."
    );
    // Spoiler-safe: no hidden suspect identity, no exact target row id is generated by this callout.
    expect(feedback.textContent ?? "").not.toMatch(/SELECT |WHERE |Annabel/i);
  });

  it("renders an inline success feedback callout for positive clue logging (WP-110)", async () => {
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
      executionTimeMs: 1,
      message: "Executed."
    });

    render(
      <QueryRunner
        audience="student"
        studentEvidenceFeedback="Clue logged: CrimeID 1080 maps to Murder."
        studentEvidenceFeedbackTone="success"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    const feedback = await screen.findByLabelText("Clue logged");
    expect(feedback).toHaveAttribute("data-student-feedback", "success");
    expect(feedback).toHaveTextContent("Clue Logged");
    expect(feedback).toHaveTextContent("Clue logged: CrimeID 1080 maps to Murder.");
  });

  it("does not render an inline feedback callout when there is no student feedback (WP-110)", async () => {
    vi.mocked(executeQuery).mockResolvedValue({
      success: true,
      data: { columns: [], rows: [], rowCount: 0 },
      safety: {
        isAllowed: true,
        normalizedStatementType: "SELECT",
        violations: [],
        message: "Safe."
      },
      executionTimeMs: 1,
      message: "Executed."
    });

    render(<QueryRunner audience="student" studentEvidenceFeedbackTone="neutral" />);

    fireEvent.click(screen.getByRole("button", { name: "Run Query" }));

    await waitFor(() => {
      expect(screen.getByText("No rows returned.")).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("Clue rejected")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Clue logged")).not.toBeInTheDocument();
  });
});
