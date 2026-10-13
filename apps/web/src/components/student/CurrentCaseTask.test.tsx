import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CurrentCaseTask } from "./CurrentCaseTask";
import type { CaseAttemptController } from "../../useCaseAttempt";
it("renders one current direction and asks before replacing a custom draft", () => {
  const updateWorkspace = vi.fn(); const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const c = { dossier: { wholeCaseObjective: "Determine who committed the crime", dossier: "The case dossier" }, snapshot: { attemptId: "a", progress: { completed: 1, total: 3, savedAtUtc: "2026-10-08" }, facts: [], task: { title: "Locate report", direction: "Refine until one report remains.", hint: "Read the city column.", starter: { sql: "SELECT * FROM CrimeSceneReport;", placeholders: {} } } }, workspace: { draftSql: "my custom SQL", selectedView: "workbench", notes: [] }, updateWorkspace, error: null, dirty: false, busy: false } as unknown as CaseAttemptController;
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  expect(screen.getAllByText("Refine until one report remains.")).toHaveLength(1);
  expect(screen.getByText("Read the city column.").closest("details")).not.toHaveAttribute("open");
  expect(screen.getByText("What to do next")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Use starter" }));
  expect(confirm).toHaveBeenCalled(); expect(updateWorkspace).not.toHaveBeenCalled();
  expect(screen.getByLabelText("SQL Query")).toHaveValue("my custom SQL"); confirm.mockRestore();
});

function reviewController(view = "workbench", caseId = "case-001"): CaseAttemptController {
  return { caseId, dossier: { caseId, title: "Database-authored case", wholeCaseObjective: "Prove the whole investigation", dossier: "Authored public dossier" }, summaries: [], snapshot: { caseId, completionScope: "evidence-review", attemptId: "owned-attempt", status: "active", progress: { completed: 0, total: 3, savedAtUtc: "2026-10-13" }, evidenceSteps: [{ stepKey: "current", title: "Current task", status: "current" }], facts: [], task: { title: "Current task", direction: "Only this database direction.", starter: { sql: "SELECT * FROM CrimeType;", placeholders: {} } } }, workspace: { draftSql: "SELECT * FROM CrimeType;", selectedView: view, notes: [] }, updateWorkspace: vi.fn(), run: vi.fn(), error: null, dirty: false, busy: false } as unknown as CaseAttemptController;
}
it("uses the shared mentor surface for a second case and keeps tools collapsed", () => {
  render(<CurrentCaseTask controller={reviewController("workbench", "case-004")} entered onEnter={vi.fn()} />);
  expect(screen.getAllByText("Only this database direction.")).toHaveLength(1);
  expect(screen.getByRole("img", { name: /Samuel Tupleton, your SQL detective mentor/ })).toBeVisible();
  expect(screen.getByText("Case tools").closest("details")).not.toHaveAttribute("open");
  expect(screen.getByRole("button", { name: "Save workspace" })).toBeVisible();
});
it("does not carry a query error onto the whole-case briefing", async () => {
  const c = reviewController(); c.run = vi.fn().mockRejectedValue(new Error("Query failed here"));
  const view = render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Run Query" })); });
  view.rerender(<CurrentCaseTask controller={{ ...c, error: "Query failed here" }} entered onEnter={vi.fn()} />);
  expect(screen.getByRole("alert")).toHaveTextContent("Query failed here");
  view.rerender(<CurrentCaseTask controller={{ ...c, error: "Query failed here", workspace: { ...c.workspace, selectedView: "briefing" } }} entered onEnter={vi.fn()} />);
  expect(screen.queryByText("Query failed here")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Whole case briefing")).toHaveTextContent("Prove the whole investigation");
});
it("restores the original header regions without inventing legacy rewards", () => {
  render(<CurrentCaseTask controller={reviewController()} entered onEnter={vi.fn()} />);
  expect(document.querySelector('[data-stable-grid="student-header-grid"]')).toBeInTheDocument();
  expect(document.querySelectorAll('[data-stable-region]')).toHaveLength(3);
  expect(screen.getByRole("img", { name: /Crime ledger/ })).toBeVisible();
  expect(screen.queryByText(/Samuel's Trust/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Insight Marks/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Case File" }));
  expect(screen.getByRole("tab", { name: "Quick Table Clues" })).toHaveAttribute("aria-selected", "true");
  fireEvent.click(screen.getByRole("tab", { name: "Case Facts" }));
  expect(screen.getByLabelText("Case Facts")).toHaveTextContent("Authored public dossier");
});
it("keeps notebook notes separate from backend progress", () => {
  const c = reviewController("case-board");
  c.workspace.notes = ["I think the case is solved"];
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  expect(screen.getByLabelText("Evidence Notebook", { exact: true })).toHaveTextContent("I think the case is solved");
  expect(screen.getByRole("progressbar", { name: "Proved case progress" })).toHaveAttribute("value", "0");
  expect(screen.getByLabelText("Case Progress", { exact: true })).toHaveTextContent("Completed milestones: 0 / 3");
});it("restored SQL blocks edit the selection without executing or replacing the draft", () => {
  const c = reviewController();
  c.workspace.draftSql = "SELECT CrimeID FROM CrimeType";
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  const editor = screen.getByLabelText("SQL Query") as HTMLTextAreaElement;
  editor.setSelectionRange(7, 14);
  fireEvent.click(screen.getByRole("button", { name: "*" }));
  expect(c.updateWorkspace).toHaveBeenCalledWith({ ...c.workspace, draftSql: "SELECT * FROM CrimeType" });
  expect(c.run).not.toHaveBeenCalled();
});
it("renders database evidence titles and removes the duplicate Query Lab sidebar", () => {
  const c = reviewController("case-board");
  c.snapshot!.evidenceSteps = [
    { stepKey: "found", title: "Catalogue evidence from the database", status: "proved" },
    { stepKey: "next", title: "Incident evidence from the database", status: "current" }
  ];
  const view = render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  const path = screen.getByLabelText("Case evidence steps");
  expect(path).toHaveTextContent("Catalogue evidence from the database");
  expect(path).toHaveTextContent("Incident evidence from the database");
  expect(path.querySelector('[data-evidence-status="proved"]')).toHaveTextContent("Catalogue evidence from the database");
  expect(screen.queryByText(/Evidence step \d/)).not.toBeInTheDocument();
  view.rerender(<CurrentCaseTask controller={{ ...c, workspace: { ...c.workspace, selectedView: "workbench" } }} entered onEnter={vi.fn()} />);
  expect(screen.queryByRole("complementary", { name: "Pinned Case Notes" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Case File" }));
  expect(screen.getByRole("tab", { name: "Pinned Facts" })).toBeVisible();
});
it("confirms deletion of the saved attempt selected in the list", async () => {
  const c = reviewController(); c.remove = vi.fn().mockResolvedValue(undefined);
  c.summaries = [{ attemptId: "old-attempt", revision: "3", status: "archived", compatible: true, progress: c.snapshot!.progress }];
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  render(<CurrentCaseTask controller={c} entered={false} onEnter={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Delete saved attempt" }));
  expect(c.remove).not.toHaveBeenCalled();
  confirm.mockReturnValue(true);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Delete saved attempt" })); });
  expect(c.remove).toHaveBeenCalledWith("old-attempt");
  confirm.mockRestore();
});
it("collapses verbose notebook rows without discarding their text", () => {
  const c = reviewController("case-board");
  const definition = "Long crime definition. ".repeat(20);
  c.workspace.notes = [`CrimeID: 1080; CrimeType: Murder; CrimeDescription: ${definition}`];
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  const summary = screen.getByText("CrimeID: 1080; CrimeType: Murder — full note");
  expect(summary.closest("details")).not.toHaveAttribute("open");
  expect(summary).not.toHaveTextContent("CrimeDescription");
  expect(summary.closest("details")).toHaveTextContent(definition.trim());
  expect(screen.queryByText(/Proved evidence \(/)).not.toBeInTheDocument();
});
it("connects the authored hint to observed evidence instead of hardcoded values", () => {
  const c = reviewController("workbench", "case-004");
  c.snapshot!.task!.hint = "Inspect the next table and narrow the records.";
  c.snapshot!.facts = [{ key: "CrimeID", label: "Observed crime type", value: "9876", sourceActionId: "proved-action" }];
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  const context = screen.getByLabelText("Proved facts for this query");
  expect(context).toHaveTextContent("Observed crime type");
  expect(context).toHaveTextContent("CrimeID = 9876");
  expect(context).not.toHaveTextContent("1080");
  expect(screen.getByLabelText("SQL Query")).toHaveValue(c.workspace.draftSql);
});
it("builds a terminated query using a clickable proved-fact hint", async () => {
  const c = reviewController();
  c.workspace.draftSql = "SELECT * FROM CrimeSceneReport;";
  c.snapshot!.task!.hint = "Narrow the incident archive.";
  c.snapshot!.facts = [{ key: "CrimeID", label: "Murder CrimeID", value: "1080", sourceActionId: "proof" }];
  function ControlledCase() {
    const [workspace, updateWorkspace] = useState(c.workspace);
    return <CurrentCaseTask controller={{ ...c, workspace, updateWorkspace }} entered onEnter={vi.fn()} />;
  }
  render(<ControlledCase />);
  fireEvent.click(screen.getByText("Hint", { exact: true }));
  const editor = screen.getByLabelText("SQL Query") as HTMLTextAreaElement;
  editor.setSelectionRange(editor.value.length, editor.value.length);
  fireEvent.click(screen.getByRole("button", { name: "WHERE" }));
  await vi.waitFor(() => expect(document.activeElement).toBe(editor));
  fireEvent.click(screen.getByRole("button", { name: /Murder CrimeID/ }));
  await vi.waitFor(() => expect(editor).toHaveValue("SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;"));
  expect(c.run).not.toHaveBeenCalled();
});