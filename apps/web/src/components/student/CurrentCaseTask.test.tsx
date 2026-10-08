import { fireEvent, render, screen } from "@testing-library/react";
import { CurrentCaseTask } from "./CurrentCaseTask";
import type { CaseAttemptController } from "../../useCaseAttempt";
it("renders one current direction and asks before replacing a custom draft", () => {
  const updateWorkspace = vi.fn(); const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const c = { dossier: { wholeCaseObjective: "Determine who committed the crime", dossier: "The case dossier" }, snapshot: { attemptId: "a", progress: { completed: 1, total: 3, savedAtUtc: "2026-10-08" }, facts: [], task: { title: "Locate report", direction: "Refine until one report remains.", hint: "Read the city column.", starter: { sql: "SELECT * FROM CrimeSceneReport;", placeholders: {} } } }, workspace: { draftSql: "my custom SQL", selectedView: "workbench", notes: [] }, updateWorkspace, error: null, dirty: false, busy: false } as unknown as CaseAttemptController;
  render(<CurrentCaseTask controller={c} entered onEnter={vi.fn()} />);
  expect(screen.getAllByText("Refine until one report remains.")).toHaveLength(1);
  expect(screen.getByText("Read the city column.").closest("details")).not.toHaveAttribute("open");
  expect(screen.queryByText("What to do next")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Use starter" }));
  expect(confirm).toHaveBeenCalled(); expect(updateWorkspace).not.toHaveBeenCalled();
  expect(screen.getByLabelText("SQL Query")).toHaveValue("my custom SQL"); confirm.mockRestore();
});
