import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import type { EvidenceNotebookEntry, MilestoneId } from "../../studentCase";
import { InvestigationThreadsPanel } from "./InvestigationThreadsPanel";
import { buildCase004InitialThreads } from "./case004Threads";
import {
  attachEvidenceToThread,
  detachEvidenceFromThread,
  updateThreadNotes,
  updateThreadStatus
} from "./threadState";
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

function TestHarness({
  initialNotebookEntries = [],
  completedMilestones = buildCompletedMilestones()
}: {
  initialNotebookEntries?: EvidenceNotebookEntry[];
  completedMilestones?: Record<MilestoneId, boolean>;
}): JSX.Element {
  const [threads, setThreads] = useState<InvestigationThread[]>(() =>
    buildCase004InitialThreads(() => 1)
  );
  const [notebookEntries] = useState<EvidenceNotebookEntry[]>(initialNotebookEntries);

  return (
    <InvestigationThreadsPanel
      completedMilestones={completedMilestones}
      notebookEntries={notebookEntries}
      threadsApi={{
        threads,
        setThreadStatus: (threadId: string, status: ThreadStatus) =>
          setThreads((current) => updateThreadStatus(current, threadId, status, () => 2)),
        setThreadNotes: (threadId: string, notes: string) =>
          setThreads((current) => updateThreadNotes(current, threadId, notes, () => 2)),
        attachEvidence: (threadId, link) =>
          setThreads((current) => attachEvidenceToThread(current, threadId, link, () => 2)),
        detachEvidence: (threadId, notebookEntryId) =>
          setThreads((current) =>
            detachEvidenceFromThread(current, threadId, notebookEntryId, () => 2)
          ),
        resetThreads: () => setThreads(buildCase004InitialThreads(() => 1))
      }}
    />
  );
}

describe("InvestigationThreadsPanel", () => {
  it("shows only the current guided trail by default and hides later trails", () => {
    render(<TestHarness />);

    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(screen.getByText("Current focus")).toBeInTheDocument();
    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
    expect(screen.getByText("Later trails (5)")).toBeInTheDocument();
    expect(screen.getAllByText("New").length).toBeGreaterThan(0);
  });

  it("lets the learner transition a thread status", () => {
    render(<TestHarness />);

    const toggle = screen.getByRole("button", { name: /Anchor the crime scene report/i });
    fireEvent.click(toggle);

    const detail = screen.getByRole("group", { name: /Set thread status/i });
    const activeButton = within(detail).getByRole("button", { name: "Active" });
    fireEvent.click(activeButton);

    expect(within(detail).getByRole("button", { name: "Active" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("attaches a notebook entry to a thread and removes it when unlinked", () => {
    render(
      <TestHarness
        initialNotebookEntries={[
          { id: "note-1", detail: "CrimeID = 1080", sourceLabel: "Samuel Step 1" }
        ]}
      />
    );

    const toggle = screen.getByRole("button", { name: /Anchor the crime scene report/i });
    fireEvent.click(toggle);

    const select = screen.getByLabelText("Attach a notebook entry") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "note-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Link to thread" }));

    expect(screen.getByRole("button", { name: /Unlink CrimeID = 1080/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Unlink CrimeID = 1080/ }));
    expect(
      screen.queryByRole("button", { name: /Unlink CrimeID = 1080/ })
    ).not.toBeInTheDocument();
  });

  it("moves completed guided trails into a collapsed completed section", () => {
    render(
      <TestHarness
        completedMilestones={buildCompletedMilestones({
          "crime-scene-filter": true
        })}
      />
    );

    expect(screen.getByText("Witness statement trail")).toBeInTheDocument();
    expect(screen.queryByText("Anchor the crime scene report")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Completed trails (1)"));

    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(screen.getByText("Guided step complete")).toBeInTheDocument();
  });

  it("reveals a learner-engaged future trail in the current set without opening all later trails", () => {
    render(
      <TestHarness
        initialNotebookEntries={[
          {
            id: "note-vehicle",
            detail: 'Witness bundle note: possible plate fragment "H42W" from the red BMW.'
          }
        ]}
      />
    );

    expect(screen.getByText("Trace the vehicle lead")).toBeInTheDocument();
    expect(screen.queryByText("Cross-check events and employment")).not.toBeInTheDocument();
  });
});
