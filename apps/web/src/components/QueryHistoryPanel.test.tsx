import { render, screen, waitFor } from "@testing-library/react";
import { QueryHistoryPanel } from "./QueryHistoryPanel";
import { getQueryHistory } from "../api/client";
import { EMPTY_QUERY_HISTORY_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  getQueryHistory: vi.fn()
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
});
