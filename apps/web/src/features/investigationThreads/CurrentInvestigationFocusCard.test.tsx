import { fireEvent, render, screen } from "@testing-library/react";
import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import { CurrentInvestigationFocusCard } from "./CurrentInvestigationFocusCard";
import { buildCase004InitialThreads } from "./case004Threads";
import type { InvestigationThread, ThreadStatus } from "./types";

function buildCompletedMilestones(
  overrides: Partial<Record<MilestoneId, boolean>> = {}
): Record<MilestoneId, boolean> {
  return {
    "crime-type": false,
    "crime-scene-filter": false,
    "witness-clues": false,
    "gym-chain": false,
    "trigger-check": false,
    "mastermind-trace": false,
    ...overrides
  };
}

function renderCard({
  notebookEntries = [],
  completedMilestones = buildCompletedMilestones(),
  threads = buildCase004InitialThreads(() => 1)
}: {
  notebookEntries?: EvidenceNotebookEntry[];
  completedMilestones?: Record<MilestoneId, boolean>;
  threads?: InvestigationThread[];
} = {}): void {
  render(
    <CurrentInvestigationFocusCard
      completedMilestones={completedMilestones}
      threads={threads}
      notebookEntries={notebookEntries}
    />
  );
}

describe("CurrentInvestigationFocusCard", () => {
  it("shows only the current deterministic trail by default", () => {
    renderCard();

    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(screen.getByText("Current focus")).toBeInTheDocument();
    expect(screen.getByLabelText("Samuel's guidance")).toHaveTextContent(
      /Start with CrimeType/
    );
  });

  it("hides later trails from the default view", () => {
    renderCard();

    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cross-check events and employment")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Trace the vehicle lead")).not.toBeInTheDocument();
  });

  it("does not render evidence attachment controls in the primary view", () => {
    renderCard({
      notebookEntries: [
        { id: "note-1", detail: "CrimeID = 1080", sourceLabel: "Samuel Step 1" }
      ]
    });

    expect(screen.queryByLabelText(/Attach a notebook entry/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Link to thread/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Unlink/i })
    ).not.toBeInTheDocument();
  });

  it("does not render a thread-specific notes textarea in the primary view", () => {
    renderCard();

    expect(
      screen.queryByLabelText(/Your notes on this thread/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("keeps optional trail review collapsed by default and reveals compact summaries on demand", () => {
    renderCard();

    const reviewToggle = screen.getByRole("button", {
      name: /Review investigation trails/i
    });
    expect(reviewToggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Not in play yet")).not.toBeInTheDocument();

    fireEvent.click(reviewToggle);

    expect(reviewToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Not in play yet")).toBeInTheDocument();
    expect(screen.getByText("Witness statement trail")).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Your notes on this thread/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Link to thread/i })
    ).not.toBeInTheDocument();
  });

  it("derives current focus deterministically from completed milestones", () => {
    renderCard({
      completedMilestones: buildCompletedMilestones({
        "crime-scene-filter": true
      })
    });

    expect(screen.getByText("Witness statement trail")).toBeInTheDocument();
    expect(
      screen.queryByText("Anchor the crime scene report")
    ).not.toBeInTheDocument();
  });

  it("ignores legacy persisted manual status when picking the current focus", () => {
    const baseThreads = buildCase004InitialThreads(() => 1);
    const threadsWithLegacyStatus = baseThreads.map((thread) => {
      if (thread.id === "thread-event-and-employment") {
        return { ...thread, status: "Active" as ThreadStatus };
      }

      if (thread.id === "thread-vehicle-trace") {
        return { ...thread, status: "Resolved" as ThreadStatus };
      }

      return thread;
    });

    renderCard({ threads: threadsWithLegacyStatus });

    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(
      screen.queryByText("Cross-check events and employment")
    ).not.toBeInTheDocument();
  });

  it("shows an empty-state message when no thread data is available", () => {
    renderCard({ threads: [] });

    expect(
      screen.getByText(/No trail is in play yet/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Review investigation trails/i })
    ).not.toBeInTheDocument();
  });
});
