import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { getSchemaTables } from "./api/client";
import type { QueryRow } from "./api/types";

const SAMUEL_CASE_BRIEFING =
  "Samuel Tupleton's case briefing: January 15th, 2023. A murder was reported in Sequel City, but the case file does not start with suspects. Start small. Prove which CrimeID means Murder, inspect the crime scene report fields, then narrow the report pile one filter at a time.";

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
    restoredExecution,
    studentEvidencePrompt,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    onStudentLogRow
  }: {
    audience?: "student" | "developer";
    onExecutionComplete?: (payload: { sql: string; response: unknown; error: string | null }) => void;
    draftQuery?: string | null;
    restoredExecution?: { sql: string; response: unknown; error: string | null } | null;
    studentEvidencePrompt?: string | null;
    studentEvidenceFeedback?: string | null;
    studentEvidenceFeedbackTone?: "neutral" | "success" | "error";
    onStudentLogRow?: (row: QueryRow) => void;
  }) => (
    <section>
      <h2>Query Runner</h2>
      {draftQuery ? <p>Draft Query: {draftQuery}</p> : null}
      {restoredExecution?.response ? <p>Restored Previous Results</p> : null}
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
              onExecutionComplete?.({
                sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'",
                response: { success: true },
                error: null
              })
            }
          >
            Simulate City Filter
          </button>
          <button
            type="button"
            onClick={() =>
              onExecutionComplete?.({
                sql: "SELECT * FROM InterviewLog JOIN PersonsOfInterest ON InterviewLog.PersonID = PersonsOfInterest.PersonID",
                response: { success: true },
                error: null
              })
            }
          >
            Simulate Witness Join
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
      screen.getByRole("heading", { name: "Case 004 · The SQL City Murder · 0/6 clues logged" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Samuel Tupleton Mentor")).toBeInTheDocument();
    expect(screen.getByText("Samuel Tupleton")).toBeInTheDocument();
    expect(screen.getByText("Mentor")).toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar--neutral img")?.getAttribute("src")).toContain(
      "avatar-samuel-mentor-neutral"
    );
    expect(screen.getByText("Start with the briefing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Samuel's Current Lead" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    expect(screen.getByText("Next Step")).toBeInTheDocument();
    expect(screen.getByText("Why It Matters")).toBeInTheDocument();
    expect(screen.getByText("Success Looks Like")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Samuel Briefing" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Samuel Briefing" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Query Lab" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByRole("button", { name: "Evidence Board" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.queryByRole("button", { name: "Start Query" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open Query Lab" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open Evidence Board" })).not.toBeInTheDocument();
    expect(screen.queryByText("Draft Query: SELECT * FROM CrimeType")).not.toBeInTheDocument();
    expect(screen.queryByText(/Evidence Prompt:/)).not.toBeInTheDocument();
    expect(screen.queryByText("Need Table Help?")).not.toBeInTheDocument();
    expect(screen.queryByText("Evidence Notebook")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Query Runner" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    expect(screen.getByText("Do This Next")).toBeInTheDocument();
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByText("Need Table Help?")).toBeInTheDocument();
    expect(screen.getByText("Samuel's Case Briefing")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Samuel's Case Briefing"));
    expect(screen.getByText(new RegExp(SAMUEL_CASE_BRIEFING))).toBeInTheDocument();
    expect(screen.getByText("Pinned Facts")).toBeInTheDocument();
    expect(screen.getByText(/No facts pinned yet/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Query Runner" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Query Lab" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Review Evidence" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue Querying" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

    expect(screen.getAllByText("Detective's Case Notes").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Add your own note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Note" })).toBeInTheDocument();
    expect(screen.getByText("Emerging Leads")).toBeInTheDocument();
    expect(screen.getByText(/No outside leads yet/)).toBeInTheDocument();
    expect(screen.queryByText("Witness 1 File")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 2 File")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym Lead")).not.toBeInTheDocument();
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
    expect(
      screen.queryByText(
        "January 15th, 2023. A murder in Sequel City. Follow the evidence trail, test your leads, and identify both suspects."
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next" })
    ).not.toBeInTheDocument();
  });

  it("progressively reveals new case-note items after student milestones are completed", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    expect(screen.queryByText("Follow the witness trail")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Case 004 · The SQL City Murder · 0/6 clues logged" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));

    expect(
      screen.getByRole("heading", { name: "Case 004 · The SQL City Murder · 1/6 clues logged" })
    ).toBeInTheDocument();
    expect(screen.getByText("Evidence Pinned")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar--confirmed img")?.getAttribute("src")).toContain(
      "avatar-samuel-confirmed-clue"
    );
    expect(screen.getByText("Evidence Notebook")).toBeInTheDocument();
    expect(screen.getByText("CrimeID = 1080")).toBeInTheDocument();
    expect(screen.getByText("Narrow the exact case report")).toBeInTheDocument();
    expect(screen.queryByText("Follow the witness trail")).not.toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 1 File")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    expect(
      screen.getAllByText(/Murder reports isolated, but the pile is still too large/).length
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/Evidence Prompt:/)).not.toBeInTheDocument();
    expect(screen.getByText(/AND ReportCity = 'SQL City'/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate City Filter" }));
    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Incorrect Report Log" }));

    expect(
      screen.getByRole("heading", { name: "Case 004 · The SQL City Murder · 1/6 clues logged" })
    ).toBeInTheDocument();
    expect(screen.getByText("Misread")).toBeInTheDocument();
    expect(screen.getByText("Skeptical")).toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar--skeptical img")?.getAttribute("src")).toContain(
      "avatar-samuel-skeptical-misread"
    );
    expect(
      screen.getByText(/Evidence Feedback: That row is still not the target murder report\./)
    ).toBeInTheDocument();
    expect(screen.queryByText("ReportID = 10056")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    expect(screen.getByText("Completed milestones: 2 / 6")).toBeInTheDocument();
    expect(screen.getAllByText("Lead Unlocked").length).toBeGreaterThan(0);
    expect(document.querySelector(".samuel-avatar--lead-unlocked img")?.getAttribute("src")).toContain(
      "avatar-samuel-lead-unlocked"
    );
    expect(screen.getByText("ReportCity = SQL City")).toBeInTheDocument();
    expect(screen.getByText("ReportDate = 2023-01-15")).toBeInTheDocument();
    expect(screen.getByText("ReportID = 10975")).toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym Lead")).not.toBeInTheDocument();
    expect(screen.getByText("Witness Discovery")).toBeInTheDocument();
    expect(screen.getByText(/write your own InterviewLog query/)).toBeInTheDocument();
    expect(screen.getByText(/Pin witness names or addresses only after you find them in the data/)).toBeInTheDocument();
    expect(screen.queryByText("Witness 1: Northwestern Dr")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 2: Franklin Ave")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText("Restored Previous Results")).toBeInTheDocument();
    expect(screen.queryByText(/Draft Query: SELECT \* FROM InterviewLog/)).not.toBeInTheDocument();
    expect(screen.getByText("Samuel's Investigation Brief")).toBeInTheDocument();
    expect(screen.getByText("Training wheels off")).toBeInTheDocument();
    expect(screen.getByText(/you write the SQL that proves the next fact/)).toBeInTheDocument();
    expect(screen.getByText("Question To Answer")).toBeInTheDocument();
    expect(screen.getByText(/Which interview records are tied to the proven murder report/)).toBeInTheDocument();
    expect(screen.getByText("Helpful Table")).toBeInTheDocument();
    expect(screen.getByText("InterviewLog")).toBeInTheDocument();
    expect(screen.getByText("ReportID")).toBeInTheDocument();
    expect(screen.getByText("PersonID")).toBeInTheDocument();
    expect(screen.queryByText(/SELECT \*\s*FROM InterviewLog\s*WHERE ReportID = 10975/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.getByText("Witness Evidence Contract")).toBeInTheDocument();
    expect(screen.getByText(/An interview row tied to that report/)).toBeInTheDocument();
    expect(screen.getByText(/A person or address fact from your own follow-up query/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Witness Join" }));
    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.getByText("Completed milestones: 3 / 6")).toBeInTheDocument();
    expect(screen.getByText("Gym Lead")).toBeInTheDocument();
    expect(screen.getByText(/membership and check-in records/i)).toBeInTheDocument();
  });

  it("lets students add their own manual notes to the notebook", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

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
    expect(screen.getByText(/January 15th, 2023\. A murder was reported in Sequel City/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByText("Crime Ledger")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 0 / 3").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Samuel Briefing" }));
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

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    expect(screen.getAllByText("Breadcrumbs 2 / 3").length).toBeGreaterThan(0);
    expect(screen.getByText("Clue Confirmed")).toBeInTheDocument();
    expect(screen.queryByText(/AND ReportCity = 'SQL City'/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    expect(
      screen.getAllByText(/Murder reports isolated, but the pile is still too large/).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/AND ReportCity = 'SQL City'/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate City Filter" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 2 / 3").length).toBeGreaterThan(0);
    expect(screen.getByText("Murder Board")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Murder board covered in report scraps, red string, and the highlighted crime ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have the right report table now. Use the murder code and SQL City together, then pin the report row that matches the case date."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Samuel Briefing" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Filter down to the murder reports" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 3 / 3").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.getByText("Which evidence chain proves you found the target murder report?")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: "CrimeID 1080, SQL City, 2023-01-15, and ReportID 10975 identify the case row."
      })
    );
    expect(screen.getByText(/Samuel unlocks the witness trail/)).toBeInTheDocument();
    expect(screen.getAllByText("Lead Unlocked").length).toBeGreaterThan(0);
    expect(screen.getByText("Clue Confirmed")).toBeInTheDocument();
  });

  it("shows concise schema details when a table link is selected", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
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
