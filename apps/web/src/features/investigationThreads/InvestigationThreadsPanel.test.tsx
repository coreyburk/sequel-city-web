import { fireEvent, render, screen } from "@testing-library/react";
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
  completedMilestones = buildCompletedMilestones(),
  initialThreads
}: {
  initialNotebookEntries?: EvidenceNotebookEntry[];
  completedMilestones?: Record<MilestoneId, boolean>;
  initialThreads?: InvestigationThread[];
}): JSX.Element {
  const [threads, setThreads] = useState<InvestigationThread[]>(
    () => initialThreads ?? buildCase004InitialThreads(() => 1)
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
    expect(screen.getAllByText("Current focus").length).toBeGreaterThan(0);
    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
    expect(screen.getByText("Later trails (5)")).toBeInTheDocument();
  });

  it("does not render the legacy manual status controls in the student view", () => {
    render(<TestHarness />);

    const toggle = screen.getByRole("button", { name: /Anchor the crime scene report/i });
    fireEvent.click(toggle);

    expect(
      screen.queryByRole("group", { name: /Set thread status/i })
    ).not.toBeInTheDocument();

    for (const label of ["New", "Active", "Blocked", "Resolved"]) {
      expect(screen.queryByRole("button", { name: label })).not.toBeInTheDocument();
    }
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

  it("persists learner-owned notes through the threads API", () => {
    render(<TestHarness />);

    const toggle = screen.getByRole("button", { name: /Anchor the crime scene report/i });
    fireEvent.click(toggle);

    const notesField = screen.getByLabelText("Your notes on this thread") as HTMLTextAreaElement;
    fireEvent.change(notesField, {
      target: { value: "Logged CrimeID 1080, still need to confirm city filter." }
    });

    expect(notesField.value).toBe(
      "Logged CrimeID 1080, still need to confirm city filter."
    );
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
    expect(screen.getAllByText("Guided step complete").length).toBeGreaterThan(0);
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

  it("ignores legacy persisted manual status for the student-facing view", () => {
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

    render(<TestHarness initialThreads={threadsWithLegacyStatus} />);

    // A legacy "Active" should not promote a far-future trail.
    expect(
      screen.queryByText("Cross-check events and employment")
    ).not.toBeInTheDocument();
    // A legacy "Resolved" should not auto-complete a trail whose milestone is open.
    expect(screen.queryByText("Completed trails (1)")).not.toBeInTheDocument();
    expect(screen.getByText("Later trails (5)")).toBeInTheDocument();
  });
});
