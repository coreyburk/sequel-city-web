import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { getSchemaTables } from "./api/client";
import type { QueryRow } from "./api/types";

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
    draftQuery,
    studentEvidencePrompt,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    onStudentLogRow
  }: {
    audience?: "student" | "developer";
    onExecutionComplete?: (payload: { sql: string; response: unknown; error: string | null }) => void;
    draftQuery?: string;
    studentEvidencePrompt?: string | null;
    studentEvidenceFeedback?: string | null;
    studentEvidenceFeedbackTone?: "neutral" | "success" | "error";
    onStudentLogRow?: (row: QueryRow) => void;
  }) => (
    <section>
      <h2>Query Runner</h2>
      {draftQuery ? <p>Draft Query: {draftQuery}</p> : null}
      {studentEvidencePrompt ? <p>Evidence Prompt: {studentEvidencePrompt}</p> : null}
      {studentEvidenceFeedback ? <p>Evidence Feedback: {studentEvidenceFeedback}</p> : null}
      {studentEvidenceFeedbackTone ? <p>Evidence Tone: {studentEvidenceFeedbackTone}</p> : null}
      {audience === "student" ? (
        <div>
          <button
            type="button"
            onClick={() =>
              onExecutionComplete?.({
                sql: "SELECT * FROM CrimeType",
                response: { success: true },
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
                sql: "SELECT * FROM CrimeSceneReport",
                response: { success: true },
                error: null
              })
            }
          >
            Simulate Scene Report Review
          </button>
          <button
            type="button"
            onClick={() =>
              onExecutionComplete?.({
                sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
                response: { success: true },
                error: null
              })
            }
          >
            Simulate Case Filter
          </button>
          <button
            type="button"
            onClick={() =>
              onStudentLogRow?.({
                values: { CrimeID: 1080, Crime: "Murder" },
                displayValues: { CrimeID: "1080", Crime: "Murder" }
              })
            }
          >
            Simulate Crime Evidence Log
          </button>
          <button
            type="button"
            onClick={() =>
              onStudentLogRow?.({
                values: { CrimeID: 1080, ReportID: "10056", ReportDate: "2022-01-21", ReportCity: "SQL City" },
                displayValues: {
                  CrimeID: "1080",
                  ReportID: "10056",
                  ReportDate: "2022-01-21",
                  ReportCity: "SQL City"
                }
              })
            }
          >
            Simulate Incorrect Report Log
          </button>
          <button
            type="button"
            onClick={() =>
              onStudentLogRow?.({
                values: { CrimeID: 1080, ReportID: "10975", ReportDate: "2023-01-15", ReportCity: "SQL City" },
                displayValues: {
                  CrimeID: "1080",
                  ReportID: "10975",
                  ReportDate: "2023-01-15",
                  ReportCity: "SQL City"
                }
              })
            }
          >
            Simulate Filtered Report Log
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
    expect(screen.getByText("Progress: 0 / 6 milestones complete")).toBeInTheDocument();
    expect(screen.getByLabelText("Samuel Tupleton Mentor")).toBeInTheDocument();
    expect(screen.getByText("Samuel Tupleton")).toBeInTheDocument();
    expect(screen.getByText("Start with the briefing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Samuel Tupleton's Briefing" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Samuel Tupleton:/)).toBeInTheDocument();
    expect(screen.getByText("Next Step")).toBeInTheDocument();
    expect(screen.getByText("Why It Matters")).toBeInTheDocument();
    expect(screen.getByText("Success Looks Like")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Briefing" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Workbench" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Case Board" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Open Workbench" })).toBeInTheDocument();
    expect(screen.queryByText("Draft Query: SELECT * FROM CrimeType")).not.toBeInTheDocument();
    expect(screen.queryByText(/Evidence Prompt:/)).not.toBeInTheDocument();
    expect(screen.queryByText("Need Table Help?")).not.toBeInTheDocument();
    expect(screen.queryByText("Evidence Notebook")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Query Runner" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Workbench" }));

    expect(screen.getByText("Do This Next")).toBeInTheDocument();
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByText("Need Table Help?")).toBeInTheDocument();
    expect(screen.getByText("Full Story Recap")).toBeInTheDocument();
    expect(screen.getByText("Evidence Notebook")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Query Runner" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open Case Board" }));

    expect(screen.getAllByText("Detective's Case Notes").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Add your own note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Note" })).toBeInTheDocument();
    expect(screen.getByText("Emerging Leads")).toBeInTheDocument();
    expect(screen.getByText("Witness 1 File")).toBeInTheDocument();
    expect(screen.getByText("Witness 2 File")).toBeInTheDocument();
    expect(screen.getByText("Samuel Check-In")).toBeInTheDocument();
    expect(screen.getByText("Available Leads:")).toBeVisible();
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

    expect(screen.getByText("Crime Ledger")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Samuel opens the city crime ledger. Find the Murder row before the rest of the file means anything."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(CASE_004_DESCRIPTION)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next" })
    ).not.toBeInTheDocument();
  });

  it("progressively reveals new case-note items after student milestones are completed", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Open Workbench" }));

    expect(screen.queryByText("Follow the witness trail")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.getByText("Progress: 0 / 6 milestones complete")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));

    expect(screen.getByText("Progress: 1 / 6 milestones complete")).toBeInTheDocument();
    expect(screen.getByText("Evidence Notebook")).toBeInTheDocument();
    expect(screen.getByText("CrimeID = 1080")).toBeInTheDocument();
    expect(screen.getByText("Follow the witness trail")).toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();
    expect(screen.getByText("Witness 1 File")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Return to Workbench" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Incorrect Report Log" }));

    expect(screen.getByText("Progress: 1 / 6 milestones complete")).toBeInTheDocument();
    expect(
      screen.getByText(/Evidence Feedback: That row is still not the target murder report\./)
    ).toBeInTheDocument();
    expect(screen.queryByText("ReportID = 10056")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    expect(screen.getByText("Completed milestones: 2 / 6")).toBeInTheDocument();
    expect(screen.getByText("ReportCity = SQL City")).toBeInTheDocument();
    expect(screen.getByText("ReportDate = 2023-01-15")).toBeInTheDocument();
    expect(screen.getByText("ReportID = 10975")).toBeInTheDocument();
    expect(screen.getByText("Track the gym lead")).toBeInTheDocument();
    expect(screen.getByText("Witness 1: Northwestern Dr")).toBeInTheDocument();
    expect(screen.getByText("Witness 2: Franklin Ave")).toBeInTheDocument();
  });

  it("lets students add their own manual notes to the notebook", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Review Case Board" }));

    fireEvent.change(screen.getByLabelText("Add your own note"), {
      target: { value: "Witness 1: Last house on Northwestern Dr" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Note" }));

    expect(screen.getByText("Witness 1: Last house on Northwestern Dr")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Remove note Witness 1: Last house on Northwestern Dr" })
    );

    expect(
      screen.queryByText("Witness 1: Last house on Northwestern Dr")
    ).not.toBeInTheDocument();
  });

  it("advances Samuel Tupleton's briefing through the opening breadcrumbs", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open Workbench" }));
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByText("Crime Ledger")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 0 / 3").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Briefing" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Look at the Crime Scene Report" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 1 / 3").length).toBeGreaterThan(0);
    expect(screen.getByText("Clue Confirmed")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Glowing evidence board with a confirmed clue pinned at the center" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Good. That clue is solid enough to go on the board. Keep chaining facts, not guesses."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Workbench" }));
    expect(screen.getByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    expect(screen.getAllByText("Breadcrumbs 2 / 3").length).toBeGreaterThan(0);
    expect(screen.getByText("Clue Confirmed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 2 / 3").length).toBeGreaterThan(0);
    expect(screen.getByText("Murder Board")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Murder board covered in report scraps, red string, and the highlighted crime ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have the right report table now. Pin one row from the murder-only pile so the next lead is grounded in evidence."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Briefing" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Filter down to the murder cases" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 3 / 3").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Case Board" }));
    expect(screen.getByText(/Before you chase the witnesses/)).toBeInTheDocument();
    expect(screen.getByText("Clue Confirmed")).toBeInTheDocument();
  });

  it("shows concise schema details when a table link is selected", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Open Workbench" }));
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
