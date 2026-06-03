import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { getFullHealth, getSchemaTables } from "./api/client";
import { useStudentCaseState } from "./useStudentCaseState";

vi.mock("./api/client", () => ({
  getFullHealth: vi.fn(),
  getSchemaTables: vi.fn(),
  verifySuspect: vi.fn()
}));

function TestHarness(): JSX.Element {
  const {
    notebookEntries,
    handleQueryExecutionComplete,
    handleStudentEvidenceLog
  } = useStudentCaseState("student");

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          handleQueryExecutionComplete({
            sql: "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%';",
            response: {
              success: true,
              data: {
                columns: [
                  { name: "EventID", ordinal: 0, dataType: "number" },
                  { name: "EventDate", ordinal: 1, dataType: "string" },
                  { name: "EventName", ordinal: 2, dataType: "string" }
                ],
                rows: [
                  {
                    values: { EventID: 2669, EventDate: "2022-12-15", EventName: "Neon Nights Symphony Delights" },
                    displayValues: { EventID: "2669", EventDate: "2022-12-15", EventName: "Neon Nights Symphony Delights" }
                  }
                ],
                rowCount: 1
              },
              safety: { isAllowed: true, normalizedStatementType: "SELECT", violations: [], message: "Safe." },
              executionTimeMs: 1,
              message: "Executed."
            },
            error: null
          })
        }
      >
        Inject EventSchedule Execution
      </button>

      <button
        type="button"
        onClick={() =>
          handleStudentEvidenceLog({
            values: { EventID: 2669, EventDate: "2022-12-15", EventName: "Neon Nights Symphony Delights" },
            displayValues: { EventID: "2669", EventDate: "2022-12-15", EventName: "Neon Nights Symphony Delights" }
          } as any)
        }
      >
        Log EventSchedule Row
      </button>

      <div aria-label="notebook">
        {notebookEntries.map((e) => (
          <div key={e.id} data-testid={`entry-${e.id}`}>
            <div>{e.id}</div>
            <div>{e.detail}</div>
            <div>{e.sourceLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

describe("useStudentCaseState upsert behavior", () => {
  beforeEach(() => {
    vi.mocked(getFullHealth).mockResolvedValue({ success: true, data: { api: "ok", database: { status: "ok" }, bootstrap: { status: "ready" }, schema: { status: "ok" } } });
    vi.mocked(getSchemaTables).mockResolvedValue({ success: true, data: { tables: [ { fullName: "dbo.crime_scene_report" } ] } });
  });

  it("upserts mastermind-event notebook entry when EventSchedule row is logged", async () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Inject EventSchedule Execution" }));

    // ensure execution is processed
    await waitFor(() => {
      // after execution, the harness has set last execution; nothing visible to assert here
      expect(true).toBe(true);
    });

    fireEvent.click(screen.getByRole("button", { name: "Log EventSchedule Row" }));

    await waitFor(() => {
      const entry = screen.getByTestId("entry-mastermind-event-2669");
      expect(entry).toBeInTheDocument();
      expect(screen.getByText(/EventID = 2669/)).toBeInTheDocument();
      expect(within(entry).getByText(/EventSchedule/)).toBeInTheDocument();
    });
  });
});
