import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { getSchemaTables } from "./api/client";

const CASE_004_DESCRIPTION =
  "January 15th, 2023. A murder in Sequel City. Follow the evidence trail, test your leads, and identify both suspects.";

vi.mock("./api/client", () => ({
  getSchemaTables: vi.fn()
}));

vi.mock("./components/HealthStatus", () => ({
  HealthStatus: () => <section><h2>Health Status</h2></section>
}));

vi.mock("./components/SchemaExplorer", () => ({
  SchemaExplorer: () => <section><h2>Schema Explorer</h2></section>
}));

vi.mock("./components/QueryRunner", () => ({
  QueryRunner: ({
    audience,
    onExecutionComplete,
    draftQuery
  }: {
    audience?: "student" | "developer";
    onExecutionComplete?: (payload: { sql: string; response: unknown; error: string | null }) => void;
    draftQuery?: string;
  }) => (
    <section>
      <h2>Query Runner</h2>
      {draftQuery ? <p>Draft Query: {draftQuery}</p> : null}
      {audience === "student" ? (
        <div>
          <button
            type="button"
            onClick={() =>
              onExecutionComplete?.({
                sql: "SELECT * FROM CrimeType",
                response: {},
                error: null
              })
            }
          >
            Simulate First Lead
          </button>
          <button
            type="button"
            onClick={() =>
              onExecutionComplete?.({
                sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
                response: {},
                error: null
              })
            }
          >
            Simulate Case Filter
          </button>
        </div>
      ) : null}
    </section>
  )
}));

vi.mock("./components/QueryHistoryPanel", () => ({
  QueryHistoryPanel: () => <section><h2>Query History</h2></section>
}));

vi.mock("./components/SuspectVerificationPanel", () => ({
  SuspectVerificationPanel: () => <section><h2>Suspect Verification</h2></section>
}));

describe("App", () => {
  beforeEach(() => {
    vi.mocked(getSchemaTables).mockResolvedValue({
      success: true,
      data: {
        tables: [
          {
            schemaName: "dbo",
            tableName: "crime_scene_report",
            fullName: "dbo.crime_scene_report",
            columns: [
              {
                columnName: "id",
                ordinal: 1,
                dataType: "int",
                isNullable: false,
                maxLength: null,
                numericPrecision: 10,
                numericScale: 0,
                isPrimaryKey: true,
                isForeignKey: false
              },
              {
                columnName: "date",
                ordinal: 2,
                dataType: "date",
                isNullable: false,
                maxLength: null,
                numericPrecision: null,
                numericScale: null,
                isPrimaryKey: false,
                isForeignKey: false
              }
            ],
            primaryKey: {
              name: "PK_crime_scene_report",
              columns: ["id"]
            }
          },
          {
            schemaName: "dbo",
            tableName: "person",
            fullName: "dbo.person",
            columns: [
              {
                columnName: "id",
                ordinal: 1,
                dataType: "int",
                isNullable: false,
                maxLength: null,
                numericPrecision: 10,
                numericScale: 0,
                isPrimaryKey: true,
                isForeignKey: false
              }
            ],
            primaryKey: {
              name: "PK_person",
              columns: ["id"]
            }
          }
        ],
        relationships: []
      }
    });
  });

  it("defaults to student mode with minimal story, schema snapshot, and query lab", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Sequel City Case Files" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Case 004: SELECT * FROM Suspects" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Current Objective:/)
    ).toBeInTheDocument();
    expect(screen.getByText("Progress: 0 / 6 milestones complete")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Samuel Tupleton's Briefing" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Samuel Tupleton:/)).toBeInTheDocument();
    expect(screen.getByText("Next Step")).toBeInTheDocument();
    expect(screen.getByText("Why It Matters")).toBeInTheDocument();
    expect(screen.getByText("Success Looks Like")).toBeInTheDocument();
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByText("Detective's Case Notes")).toBeInTheDocument();
    expect(screen.getByText("Need Table Help?")).toBeInTheDocument();
    expect(screen.getByText("Full Story Recap")).toBeInTheDocument();
    expect(screen.getByText("Available Leads:")).not.toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Query Runner" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(screen.queryByText("Story Narration")).not.toBeInTheDocument();
    expect(screen.queryByText("Schema Snapshot")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Developer Mode" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(
      screen.queryByRole("heading", { name: "Workspace Context" })
    ).not.toBeInTheDocument();
  });

  it("switches to developer mode shell content", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Developer Mode" }));

    expect(
      screen.getByRole("heading", { name: "First-Run Guidance" })
    ).toBeInTheDocument();
    expect(screen.getByText("Startup Command")).toBeInTheDocument();
    expect(screen.getByText("Frontend URL")).toBeInTheDocument();
    expect(screen.getByText("Backend API URL")).toBeInTheDocument();
    expect(screen.getByText("First Test Query")).toBeInTheDocument();
    expect(screen.getByText("npm run dev")).toBeInTheDocument();
    expect(screen.getByText("http://127.0.0.1:5173")).toBeInTheDocument();
    expect(screen.getByText("http://127.0.0.1:3001")).toBeInTheDocument();
    expect(screen.getByText("SELECT DB_NAME() AS CurrentDatabase")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Story Narration" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Health Status" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Schema Explorer" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Query Runner" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Suspect Verification" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Query History" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Schema Snapshot" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Developer Mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("keeps a fixed story brief with query-driven scene caption", () => {
    render(<App />);

    expect(screen.getByText("Midnight fog over Sequel City. The first clues are still hidden.")).toBeInTheDocument();
    expect(screen.getByText(CASE_004_DESCRIPTION)).not.toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Next" })
    ).not.toBeInTheDocument();
  });

  it("progressively reveals new case-note items after student milestones are completed", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Detective's Case Notes"));
    expect(screen.queryByText("Follow the witness trail")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(screen.getByText("Completed milestones: 1 / 6")).toBeInTheDocument();
    expect(screen.getByText("Follow the witness trail")).toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));

    expect(screen.getByText("Completed milestones: 2 / 6")).toBeInTheDocument();
    expect(screen.getByText("Track the gym lead")).toBeInTheDocument();
  });

  it("advances Samuel Tupleton's briefing through the opening breadcrumbs", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Look at the Crime Scene Report" })
    ).toBeInTheDocument();
    expect(screen.getByText("Breadcrumbs 1 / 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Load Query Draft" }));
    expect(screen.getByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Filter down to the murder cases" })
    ).toBeInTheDocument();
    expect(screen.getByText("Breadcrumbs 3 / 3")).toBeInTheDocument();
    expect(screen.getByText("Samuel's hand-off")).toBeInTheDocument();
  });

  it("shows concise schema details when a table link is selected", async () => {
    render(<App />);

    fireEvent.click(screen.getByText("Need Table Help?"));
    expect(await screen.findByRole("button", { name: "dbo.person" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "dbo.person" }));

    expect(screen.getAllByText("dbo.person").length).toBeGreaterThan(0);
    expect(screen.getByText("Column")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("PK")).toBeInTheDocument();
    expect(screen.getByText("FK")).toBeInTheDocument();
  });
});
