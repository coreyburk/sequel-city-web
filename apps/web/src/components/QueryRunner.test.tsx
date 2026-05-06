import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryRunner } from "./QueryRunner";
import { executeQuery } from "../api/client";
import { SAFE_SELECT_ONLY_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  executeQuery: vi.fn()
}));

describe("QueryRunner", () => {
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

    expect(screen.getAllByText("DELETE statements are not allowed.")).toHaveLength(2);
    expect(screen.getByText(SAFE_SELECT_ONLY_GUIDANCE)).toBeInTheDocument();
  });
});
