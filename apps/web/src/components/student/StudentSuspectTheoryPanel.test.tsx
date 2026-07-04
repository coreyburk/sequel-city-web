import { fireEvent, render, screen, within } from "@testing-library/react";
import type { CaseVerificationSuccessResponse } from "../../api/types";
import { StudentSuspectTheoryPanel } from "./StudentSuspectTheoryPanel";

describe("StudentSuspectTheoryPanel", () => {
  it("shows a dismissible case-close splash for the confirmed mastermind", () => {
    const result: CaseVerificationSuccessResponse = {
      success: true,
      data: {
        suspect: "Miranda Priestly",
        verdict: "Case closed.",
        caseId: "case-004",
        isCorrect: true,
        solvedRole: "mastermind",
        nextRole: "closed",
        suspectPersonId: 99716
      },
      message: "Suspect verification completed."
    };

    render(
      <StudentSuspectTheoryPanel
        confirmedTriggerSuspectName="Jeremy Bowers"
        suspectName="Miranda Priestly"
        onSuspectNameChange={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
        error={null}
        result={result}
        theoryRole="mastermind"
      />
    );

    const splash = screen.getByRole("dialog", { name: "Case 004 Closed" });
    expect(splash).toBeInTheDocument();
    expect(
      within(splash).getByText(/Jeremy Bowers carried out the hit\. Miranda Priestly ordered it\./i)
    ).toBeInTheDocument();
    expect(within(splash).getByText("Hired Killer")).toBeInTheDocument();
    expect(within(splash).getByText("Jeremy Bowers")).toBeInTheDocument();
    expect(within(splash).getByText("Mastermind")).toBeInTheDocument();
    expect(within(splash).getByText("Miranda Priestly")).toBeInTheDocument();
    expect(within(splash).getByText("Case Closed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Review Closed Case" }));

    expect(screen.queryByRole("dialog", { name: "Case 004 Closed" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mastermind Confirmed" })).toBeInTheDocument();
    expect(
      screen.getByText("Miranda Priestly is confirmed as the mastermind.", {
        selector: ".student-suspect-theory-panel__headline"
      })
    ).toBeInTheDocument();
  });
});
