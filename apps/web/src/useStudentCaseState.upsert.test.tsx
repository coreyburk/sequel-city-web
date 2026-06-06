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
    studentEvidenceFeedback,
    studentView,
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
                  },
                  {
                    values: { EventID: 3005, EventDate: "2022-12-09", EventName: "Skyline Symphony Showcase" },
                    displayValues: { EventID: "3005", EventDate: "2022-12-09", EventName: "Skyline Symphony Showcase" }
                  },
                  {
                    values: { EventID: 3257, EventDate: "2022-12-19", EventName: "Winter Wonderland Symphony" },
                    displayValues: { EventID: "3257", EventDate: "2022-12-19", EventName: "Winter Wonderland Symphony" }
                  }
                ],
                rowCount: 3
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

      <button
        type="button"
        onClick={() =>
          handleStudentEvidenceLog({
            values: { EventID: 3005, EventDate: "2022-12-09", EventName: "Skyline Symphony Showcase" },
            displayValues: { EventID: "3005", EventDate: "2022-12-09", EventName: "Skyline Symphony Showcase" }
          } as any)
        }
      >
        Log Second EventSchedule Row
      </button>

      <button
        type="button"
        onClick={() =>
          handleStudentEvidenceLog({
            values: { EventID: 3257, EventDate: "2022-12-19", EventName: "Winter Wonderland Symphony" },
            displayValues: { EventID: "3257", EventDate: "2022-12-19", EventName: "Winter Wonderland Symphony" }
          } as any)
        }
      >
        Log Third EventSchedule Row
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
      <div aria-label="student-view">{studentView}</div>
      <div aria-label="student-feedback">{studentEvidenceFeedback}</div>
    </div>
  );
}

describe("useStudentCaseState upsert behavior", () => {
  beforeEach(() => {
    vi.mocked(getFullHealth).mockResolvedValue({
      success: true,
      data: {
        api: "ok",
        database: {
          status: "ok",
          isConnected: true,
          databaseName: "SequelCity",
          serverName: "Localhost",
          message: "Connected."
        },
        bootstrap: {
          mode: "verify",
          status: "ready",
          migrated: true,
          usedBootstrapCredentials: false,
          canApplyInApp: false,
          applyActionMessage: null,
          message: "Ready.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-sequel-city",
          currentMigrationKey: "2026-05-sequel-city",
          pendingMigrationKeys: []
        },
        schema: {
          status: "ok",
          tableCount: 1,
          relationshipCount: 0,
          message: "Loaded."
        }
      }
    });
    vi.mocked(getSchemaTables).mockResolvedValue({
      success: true,
      data: {
        tables: [
          {
            schemaName: "dbo",
            tableName: "CrimeSceneReport",
            fullName: "dbo.CrimeSceneReport",
            columns: [],
            primaryKey: null
          }
        ],
        relationships: []
      }
    });
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
      expect(screen.getByLabelText("student-view")).toHaveTextContent("workbench");
      expect(screen.getByLabelText("student-feedback")).toHaveTextContent(
        /Keep these EventSchedule results open until all three Symphony rows are pinned/i
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Log Second EventSchedule Row" }));
    fireEvent.click(screen.getByRole("button", { name: "Log Third EventSchedule Row" }));

    await waitFor(() => {
      expect(screen.getByTestId("entry-mastermind-event-2669")).toBeInTheDocument();
      expect(screen.getByTestId("entry-mastermind-event-3005")).toBeInTheDocument();
      expect(screen.getByTestId("entry-mastermind-event-3257")).toBeInTheDocument();
      expect(screen.getByLabelText("student-view")).toHaveTextContent("workbench");
    });
  });
});
