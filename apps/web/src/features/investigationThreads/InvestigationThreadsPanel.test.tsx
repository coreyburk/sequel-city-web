import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { InvestigationThreadsPanel } from "./InvestigationThreadsPanel";
import { buildCase004InitialThreads } from "./case004Threads";
import {
  attachEvidenceToThread,
  detachEvidenceFromThread,
  updateThreadNotes,
  updateThreadStatus
} from "./threadState";
import type { InvestigationThread, ThreadStatus } from "./types";
import type { EvidenceNotebookEntry } from "../../studentCase";

function TestHarness({
  initialNotebookEntries = []
}: {
  initialNotebookEntries?: EvidenceNotebookEntry[];
}): JSX.Element {
  const [threads, setThreads] = useState<InvestigationThread[]>(() =>
    buildCase004InitialThreads(() => 1)
  );
  const [notebookEntries] = useState<EvidenceNotebookEntry[]>(initialNotebookEntries);

  return (
    <InvestigationThreadsPanel
      notebookEntries={notebookEntries}
      threadsApi={{
        threads,
        setThreadStatus: (threadId: string, status: ThreadStatus) =>
          setThreads((current) => updateThreadStatus(current, threadId, status, () => 2)),
        setThreadNotes: (threadId: string, notes: string) =>
          setThreads((current) => updateThreadNotes(current, threadId, notes, () => 2)),
        attachEvidence: (threadId, link) =>
          setThreads((current) =>
            attachEvidenceToThread(current, threadId, link, () => 2)
          ),
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
  it("renders authored threads with a New status by default", () => {
    render(<TestHarness />);

    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(screen.getByText("Witness statement trail")).toBeInTheDocument();
    const newBadges = screen.getAllByText("New");
    expect(newBadges.length).toBeGreaterThan(0);
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

  it("filters resolved trails when the resolved filter is selected", () => {
    render(<TestHarness />);

    const toggle = screen.getByRole("button", { name: /Anchor the crime scene report/i });
    fireEvent.click(toggle);
    const detail = screen.getByRole("group", { name: /Set thread status/i });
    fireEvent.click(within(detail).getByRole("button", { name: "Resolved" }));

    fireEvent.click(screen.getByRole("button", { name: "Resolved trails" }));
    expect(screen.getByText("Anchor the crime scene report")).toBeInTheDocument();
    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
  });
});
