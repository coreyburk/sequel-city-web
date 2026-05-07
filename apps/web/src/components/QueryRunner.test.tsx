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
});
