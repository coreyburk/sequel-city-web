import { render, screen, waitFor } from "@testing-library/react";
import { HealthStatus } from "./HealthStatus";
import { getFullHealth } from "../api/client";
import { BACKEND_UNAVAILABLE_GUIDANCE } from "../guidance";

vi.mock("../api/client", () => ({
  getFullHealth: vi.fn()
}));

describe("HealthStatus", () => {
  it("renders actionable backend unavailable guidance", async () => {
    vi.mocked(getFullHealth).mockRejectedValue(new Error(BACKEND_UNAVAILABLE_GUIDANCE));

    render(<HealthStatus />);

    await waitFor(() => {
      expect(screen.getByText(BACKEND_UNAVAILABLE_GUIDANCE)).toBeInTheDocument();
    });
  });
});
