import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryHistoryPanel } from "./QueryHistoryPanel";
import { clearQueryHistory, getQueryHistory } from "../api/client";
import { EMPTY_QUERY_HISTORY_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  getQueryHistory: vi.fn(),
  clearQueryHistory: vi.fn()
}));

describe("QueryHistoryPanel", () => {
  it("renders the first history guidance when no records exist", async () => {
    vi.mocked(getQueryHistory).mockResolvedValue({
      success: true,
      data: {
        records: []
      }
    });

    render(<QueryHistoryPanel />);

    await waitFor(() => {
      expect(screen.getByText(EMPTY_QUERY_HISTORY_GUIDANCE)).toBeInTheDocument();
    });
  });

  it("clears existing records and returns to first history guidance", async () => {
    vi.mocked(getQueryHistory).mockResolvedValue({
      success: true,
      data: {
        records: [
          {
            id: 1,
            timestamp: "2026-05-07T20:00:00.000Z",
            queryText: "SELECT 1",
            outcome: "success",
            rowCount: 1,
            executionTimeMs: 1,
            errorMessage: null
          }
        ]
      }
    });
    vi.mocked(clearQueryHistory).mockResolvedValue({
      success: true,
      data: {
        clearedCount: 1
      }
    });

    render(<QueryHistoryPanel />);

    await waitFor(() => {
      expect(screen.getByText("SELECT 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Clear History" }));

    await waitFor(() => {
      expect(screen.getByText(EMPTY_QUERY_HISTORY_GUIDANCE)).toBeInTheDocument();
    });
    expect(clearQueryHistory).toHaveBeenCalledTimes(1);
  });
});
