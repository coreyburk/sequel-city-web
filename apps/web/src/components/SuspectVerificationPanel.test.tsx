import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { verifySuspect } from "../api/client";
import { SuspectVerificationPanel } from "./SuspectVerificationPanel";

vi.mock("../api/client", () => ({
  verifySuspect: vi.fn()
}));

describe("SuspectVerificationPanel", () => {
  it("submits a suspect name and renders backend verdict data", async () => {
    vi.mocked(verifySuspect).mockResolvedValue({
      success: true,
      data: {
        suspect: "Ada Lovelace",
        verdict: "Database verdict"
      },
      message: "Suspect verification completed."
    });

    render(<SuspectVerificationPanel />);

    fireEvent.change(screen.getByLabelText("Suspect full name"), {
      target: { value: "Ada Lovelace" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Verify Suspect" }));

    await waitFor(() => {
      expect(verifySuspect).toHaveBeenCalledWith("Ada Lovelace");
    });

    expect(screen.getByText("Database verdict")).toBeInTheDocument();
    expect(screen.getByText("Suspect verification completed.")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("renders backend failure message from the client", async () => {
    vi.mocked(verifySuspect).mockRejectedValue(
      new Error("Request body must include a non-empty string `suspect` field.")
    );

    render(<SuspectVerificationPanel />);

    fireEvent.change(screen.getByLabelText("Suspect full name"), {
      target: { value: "   " }
    });
    fireEvent.click(screen.getByRole("button", { name: "Verify Suspect" }));

    await waitFor(() => {
      expect(
        screen.getByText("Request body must include a non-empty string `suspect` field.")
      ).toBeInTheDocument();
    });
  });
});
