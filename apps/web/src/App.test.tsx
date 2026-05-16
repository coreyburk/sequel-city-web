import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { getSchemaTables } from "./api/client";
import type { QueryRow } from "./api/types";

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
    studentInstruction,
    studentFailureGuidance,
    queryAssistRequest,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    onStudentLogRow
  }: {
    audience?: "student" | "developer";
    onExecutionComplete?: (payload: { sql: string; response: unknown; error: string | null }) => void;
    draftQuery?: string | null;
    restoredExecution?: { sql: string; response: unknown; error: string | null } | null;
    studentEvidencePrompt?: string | null;
    studentInstruction?: string | null;
    studentFailureGuidance?: string | null;
    queryAssistRequest?: { id: string; text: string; sourceLabel?: string } | null;
    studentEvidenceFeedback?: string | null;
    studentEvidenceFeedbackTone?: "neutral" | "success" | "error";
    onStudentLogRow?: (row: QueryRow) => void;
  }) => (
    <section>
      <h2>Query Runner</h2>
      {draftQuery ? <p>Draft Query: {draftQuery}</p> : null}
      {restoredExecution?.response ? <p>Restored Previous Results</p> : null}
      {studentInstruction ? <p>Student Instruction: {studentInstruction}</p> : null}
      {studentFailureGuidance ? <p>Student Failure Guidance: {studentFailureGuidance}</p> : null}
      {studentEvidencePrompt ? <p>Evidence Prompt: {studentEvidencePrompt}</p> : null}
      {queryAssistRequest ? <p>Query Assist: {queryAssistRequest.text}</p> : null}
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
                sql: "SELECT PersonID, ReportID, LogTranscript FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID",
                response: {
                  success: true,
                  data: {
                    columns: [
                      { name: "PersonID", ordinal: 0, dataType: "number" },
                      { name: "ReportID", ordinal: 1, dataType: "number" },
                      { name: "LogTranscript", ordinal: 2, dataType: "string" }
                    ],
                    rows: [
                      {
                        values: {
                          PersonID: 14887,
                          ReportID: 10975,
                          LogTranscript:
                            "There was a suspicious-looking red BMW parked outside the Symphony Hall."
                        },
                        displayValues: {
                          PersonID: "14887",
                          ReportID: "10975",
                          LogTranscript:
                            "There was a suspicious-looking red BMW parked outside the Symphony Hall."
                        }
                      },
                      {
                        values: {
                          PersonID: 14887,
                          ReportID: 10975,
                          LogTranscript: "I heard a gunshot and then saw a man run out."
                        },
                        displayValues: {
                          PersonID: "14887",
                          ReportID: "10975",
                          LogTranscript: "I heard a gunshot and then saw a man run out."
                        }
                      },
                      {
                        values: {
                          PersonID: 14887,
                          ReportID: 10975,
                          LogTranscript:
                            'He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags.'
                        },
                        displayValues: {
                          PersonID: "14887",
                          ReportID: "10975",
                          LogTranscript:
                            'He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags.'
                        }
                      },
                      {
                        values: {
                          PersonID: 16371,
                          ReportID: 10975,
                          LogTranscript: "I saw the murder happen right outside Symphony Hall."
                        },
                        displayValues: {
                          PersonID: "16371",
                          ReportID: "10975",
                          LogTranscript: "I saw the murder happen right outside Symphony Hall."
                        }
                      },
                      {
                        values: {
                          PersonID: 16371,
                          ReportID: 10975,
                          LogTranscript:
                            "I recognized the killer from my gym when I was working out last week on January the 9th."
                        },
                        displayValues: {
                          PersonID: "16371",
                          ReportID: "10975",
                          LogTranscript:
                            "I recognized the killer from my gym when I was working out last week on January the 9th."
                        }
                      },
                      {
                        values: {
                          PersonID: 67318,
                          ReportID: 10975,
                          LogTranscript:
                            "A high-roller dame with deep pockets put out a contract on this guy, and I was the one they called to ice him."
                        },
                        displayValues: {
                          PersonID: "67318",
                          ReportID: "10975",
                          LogTranscript:
                            "A high-roller dame with deep pockets put out a contract on this guy, and I was the one they called to ice him."
                        }
                      }
                    ],
                    rowCount: 6
                  },
                  safety: {
                    isAllowed: true,
                    normalizedStatementType: "SELECT",
                    violations: [],
                    message: "Safe."
                  },
                  executionTimeMs: 1,
                  message: "Executed."
                },
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
                values: {
                  LogID: 5108,
                  PersonID: 14887,
                  ReportID: 10975,
                  LogTranscript:
                    'He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags.'
                },
                displayValues: {
                  LogID: "5108",
                  PersonID: "14887",
                  ReportID: "10975",
                  LogTranscript:
                    'He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags.'
                }
              })
            }
          >
            Simulate Witness Row Log 14887
          </button>
          <button
            type="button"
            onClick={() =>
              onStudentLogRow?.({
                values: {
                  LogID: 4782,
                  PersonID: 16371,
                  ReportID: 10975,
                  LogTranscript:
                    "I recognized the killer from my gym when I was working out last week on January the 9th."
                },
                displayValues: {
                  LogID: "4782",
                  PersonID: "16371",
                  ReportID: "10975",
                  LogTranscript:
                    "I recognized the killer from my gym when I was working out last week on January the 9th."
                }
              })
            }
          >
            Simulate Witness Row Log 16371
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
                values: {
                  LogID: 5155,
                  PersonID: 67318,
                  ReportID: 10975,
                  LogTranscript:
                    "A high-roller dame with deep pockets put out a contract on this guy, and I was the one they called to ice him."
                },
                displayValues: {
                  LogID: "5155",
                  PersonID: "67318",
                  ReportID: "10975",
                  LogTranscript:
                    "A high-roller dame with deep pockets put out a contract on this guy, and I was the one they called to ice him."
                }
              })
            }
          >
            Simulate Confession Row Log
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
    expect(screen.queryByText("Mentor")).not.toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar--neutral img")?.getAttribute("src")).toContain(
      "avatar-samuel-mentor-neutral"
    );
    expect(screen.getByText("Meet Samuel Tupleton")).toBeInTheDocument();
    expect(screen.getByText(/your data detective mentor/)).toBeInTheDocument();
    expect(screen.getByText("Samuel's Trust: Building")).toBeInTheDocument();
    expect(screen.getByText("Insight Marks: 0")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Case Briefing" })).toBeInTheDocument();
    expect(screen.getByText("Samuel's Role")).toBeInTheDocument();
    expect(screen.getByText("Case Background")).toBeInTheDocument();
    expect(screen.getByText(/The case file does not hand you suspects/)).toBeInTheDocument();
    expect(screen.getByText("How You'll Find Clues")).toBeInTheDocument();
    expect(screen.getByText(/Run SQL to inspect records/)).toBeInTheDocument();
    expect(screen.getByText("First Lead")).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 0 / 3")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 3, name: "Determine the Crime ID for murder" })
    ).toBeInTheDocument();
    expect(screen.getByText("Next Step")).toBeInTheDocument();
    expect(screen.getByText("Why It Matters")).toBeInTheDocument();
    expect(screen.getByText("Success Looks Like")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Samuel's Briefing" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Samuel's Briefing" })).toBeDisabled();
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
    expect(screen.queryByText("Quick Table Clues")).not.toBeInTheDocument();
    expect(screen.queryByText("Evidence Notebook")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Query Runner" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    expect(screen.queryByText("Samuel's Next Move")).not.toBeInTheDocument();
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Case File" })).toBeInTheDocument();
    expect(screen.queryByText("Quick Table Clues")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Case File" }));
    expect(screen.getByText("Quick Table Clues")).toBeInTheDocument();
    expect(screen.getByText("Case Facts")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Case Facts" }));
    expect(screen.getByText("January 15th, 2023: a murder was reported in Sequel City.")).toBeInTheDocument();
    expect(screen.getByText(/The case does not begin with suspects/)).toBeInTheDocument();
    expect(screen.getByText("Pinned Facts")).toBeInTheDocument();
    expect(screen.getByText(/No facts pinned yet/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Query Runner" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Query Lab" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Review Evidence" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue Querying" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

    expect(screen.getAllByText("Case Progress").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Add your own note")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Note" })).toBeInTheDocument();
    expect(screen.getByText(/Do This Next:/)).toBeInTheDocument();
    expect(screen.getByText(/Stay with Samuel's current instruction/)).toBeInTheDocument();
    expect(screen.queryByText("Current Investigation Focus")).not.toBeInTheDocument();
    expect(screen.queryByText("Anchor the crime scene report")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Review investigation trails/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Later trails \(5\)/)).not.toBeInTheDocument();
    expect(screen.getByText("Optional Samuel's Check-In")).toBeInTheDocument();
    expect(
      screen.getByText(/Optional now\. Use this quick reasoning check if you want to confirm why the clue matters\./)
    ).toBeInTheDocument();
    expect(screen.getAllByText("Insight Marks: 0").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Which CrimeID belongs to Murder." }));
    expect(screen.getAllByText(/Insight Mark earned/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Insight Marks: 1").length).toBeGreaterThan(0);
    expect(screen.queryByText("Emerging Leads")).not.toBeInTheDocument();
    expect(screen.queryByText(/No outside leads yet/)).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 1 File")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 2 File")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym Lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Case Review")).not.toBeInTheDocument();
    expect(screen.queryByText("Available Leads:")).not.toBeInTheDocument();
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

  it("never renders investigation trail UI in Student Mode after milestone progression", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));
    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

    expect(screen.queryByText("Current Investigation Focus")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Review investigation trails/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Anchor the crime scene report")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness statement trail")).not.toBeInTheDocument();
    expect(screen.queryByText(/Investigation Trail Diagnostics/i)).not.toBeInTheDocument();
    expect(screen.getByText("Evidence Notebook")).toBeInTheDocument();
    expect(screen.getAllByText("Case Progress").length).toBeGreaterThan(0);
  });

  it("exposes the investigation trail diagnostics panel in Developer Mode", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Developer Mode" }));

    expect(
      screen.getByRole("heading", { name: "Investigation Trail Diagnostics" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Developer-only view of the deterministic trail visibility model/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Primary thread: thread-crime-scene-report/)
    ).toBeInTheDocument();
    expect(screen.getByText("thread-crime-scene-report")).toBeInTheDocument();
    expect(screen.getByText("thread-event-and-employment")).toBeInTheDocument();
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

  it("keeps scene art visual while moving instructions out of the image overlay", () => {
    render(<App />);

    expect(
      screen.getByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Samuel opens the city crime ledger. Find the Murder row before the rest of the file means anything."
      )
    ).not.toBeInTheDocument();
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
    expect(screen.queryByText("Evidence Pinned")).not.toBeInTheDocument();
    expect(screen.getByText(/Good\. CrimeID 1080 is pinned/)).toBeInTheDocument();
    expect(screen.getAllByText(/inspect the queued CrimeSceneReport query/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Return to Query Lab" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Do This Next");
    expect(screen.queryByText("Confirmed")).not.toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar")).not.toBeInTheDocument();
    expect(screen.getByText("Evidence Notebook")).toBeInTheDocument();
    expect(screen.getByText("CrimeID = 1080")).toBeInTheDocument();
    expect(screen.getByText("Narrow the exact case report")).toBeInTheDocument();
    expect(screen.queryByText("Follow the witness trail")).not.toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Witness 1 File")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    expect(
      screen.getByText(/I queued the CrimeID filter because we already proved Murder is 1080/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    expect(
      screen.getByText(/That filter found murder reports, but there are still too many/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Evidence Prompt:/)).not.toBeInTheDocument();
    expect(screen.getByText(/AND ReportCity = 'SQL City'/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate City Filter" }));
    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Incorrect Report Log" }));

    expect(
      screen.getByRole("heading", { name: "Case 004 · The SQL City Murder · 1/6 clues logged" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Misread")).not.toBeInTheDocument();
    expect(screen.queryByText("Samuel's Check")).not.toBeInTheDocument();
    expect(screen.queryByText("Skeptical")).not.toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar--skeptical img")?.getAttribute("src")).toContain(
      "avatar-samuel-skeptical-misread"
    );
    expect(
      screen.getByText(/That row is still not the target murder report/)
    ).toBeInTheDocument();
    expect(screen.queryByText("ReportID = 10056")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    expect(screen.getByText("Completed milestones: 2 / 6")).toBeInTheDocument();
    expect(screen.queryByText("Lead Unlocked")).not.toBeInTheDocument();
    expect(screen.getByText("Witness trail unlocked")).toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar")).not.toBeInTheDocument();
    expect(screen.getByText("ReportCity = SQL City")).toBeInTheDocument();
    expect(screen.getByText("ReportDate = 2023-01-15")).toBeInTheDocument();
    expect(screen.getByText("ReportID = 10975")).toBeInTheDocument();
    expect(screen.queryByText("Track the gym lead")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym Lead")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Do This Next");
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Witness Discovery");
    expect(screen.getByText(/review the restored ReportID 10975 result/i)).toBeInTheDocument();
    expect(screen.getByText(/Northwestern Dr and Annabel clues/)).toBeInTheDocument();
    expect(screen.getByText(/You found the key report row/)).toBeInTheDocument();
    expect(
      screen.getByText(/Optional now\. Use this quick reasoning check if you want to confirm why the clue matters\./)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText("Restored Previous Results")).toBeInTheDocument();
    expect(screen.queryByText(/Draft Query: SELECT \* FROM InterviewLog/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).not.toBeInTheDocument();
    expect(screen.getByText("Samuel's Field Note")).toBeInTheDocument();
    expect(screen.getByText("Witness trail")).toBeInTheDocument();
    expect(screen.queryByText("Training wheels off")).not.toBeInTheDocument();
    expect(
      screen.getByText("The report row gives two witness clues. Use them in this order before Samuel advances.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Student Instruction: Step 1: Review the restored report result below, then write your own InterviewLog query in the editor."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Student Failure Guidance: If this query fails, simplify it. Do not GROUP BY or JOIN yet. Try: SELECT PersonID, LogTranscript FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID. Once the witness rows are clear, then decide what PersonID facts belong in your notebook."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Use These Report Clues")).toBeInTheDocument();
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      'The report says there were two witnesses: one lives at the last house on Northwestern Dr, and the second witness, Annabel, lives somewhere on Franklin Ave.'
    );
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      "Query InterviewLog with the ReportID from the report row."
    );
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      "Sort with ORDER BY PersonID and find repeated PersonID witness rows."
    );
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      "Use Log Clue once for each repeated PersonID bundle."
    );
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      "Add one short Evidence Board note"
    );
    expect(screen.getByText("InterviewLog")).toBeInTheDocument();
    expect(screen.getByText("ReportID")).toBeInTheDocument();
    expect(screen.getAllByText("PersonID").length).toBeGreaterThan(0);
    expect(screen.queryByText(/SELECT \*\s*FROM InterviewLog\s*WHERE ReportID = 10975/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Witness Join" }));
    expect(
      screen.getByText(
        "Student Instruction: Step 2: Sort the InterviewLog rows by PersonID. Find one repeated PersonID with witness-style transcripts, then start Step 3 by clicking Log Clue on one strong row from that bundle. Ignore the confession-heavy rows for now."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Evidence Prompt: Step 2 target: use Log Clue on one strong row from the first repeated PersonID witness bundle."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Confession Row Log" }));
    expect(
      screen.getByText(/That row sounds like confession or contract detail/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Witness Row Log 14887" }));

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.getByText("Samuel's Evidence Check")).toBeInTheDocument();
    expect(screen.getByText(/Still needed before Samuel opens the next lead:/)).toBeInTheDocument();
    expect(screen.getByText(/1\. Log the second witness bundle:/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Add the next lookup note:/)).toBeInTheDocument();
    expect(screen.queryByText(/Keep ReportID pinned:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Log the first witness bundle:/)).not.toBeInTheDocument();
    expect(screen.getByText("Witness PersonID = 14887")).toBeInTheDocument();
    expect(
      screen.getByText(/Witness bundle 14887: noticed a red BMW outside Symphony Hall, heard a gunshot, saw a gym bag with membership starting 48Z/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(
      screen.getByText(
        "Evidence Prompt: Step 3 target: use Log Clue on one strong row from the second repeated PersonID witness bundle."
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate Witness Row Log 16371" }));

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.getByText("Completed milestones: 2 / 6")).toBeInTheDocument();
    expect(screen.queryByText("Gym Lead")).not.toBeInTheDocument();
    expect(screen.getByText("Witness PersonID = 16371")).toBeInTheDocument();
    expect(
      screen.getByText(/Witness bundle 16371: saw the murder happen, recognized the killer from the gym/)
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. Add the next lookup note:/)).toBeInTheDocument();
    expect(screen.getByText(/which person or address lookup those PersonIDs should be used for next/)).toBeInTheDocument();
    expect(screen.queryByText(/Log the second witness bundle:/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText(/Samuel needs one notebook note before opening the next lead/)).toBeInTheDocument();
    expect(screen.getByText("One Step Left")).toBeInTheDocument();
    expect(screen.getByLabelText("Samuel's Witness Notes")).toHaveTextContent(
      "Open Evidence Board and add one short note saying those PersonID values should be used for the next person or address lookup."
    );
    expect(screen.queryByText("Use These Report Clues")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    fireEvent.change(screen.getByLabelText("Add your own note"), {
      target: { value: "These witness PersonIDs should drive the next person lookup so I can prove names or addresses." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Note" }));

    expect(screen.getByText("Completed milestones: 3 / 6")).toBeInTheDocument();
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Do This Next");
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Gym Lead");
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
    expect(screen.getByText("January 15th, 2023: a murder was reported in Sequel City.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText("Draft Query: SELECT * FROM CrimeType")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).not.toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar img")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.queryByText("Breadcrumbs 0 / 3")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Samuel's Briefing" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Look at the Crime Scene Report" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 1 / 3")).toHaveLength(1);
    expect(
      screen.getByRole("img", { name: "Glowing evidence board with a confirmed clue pinned at the center" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Good. CrimeID 1080 is pinned. I created a query for you. Use Query Lab next to inspect the queued CrimeSceneReport query and find the entry for this crime in the database."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    expect(screen.getByText(/Draft Query: SELECT \* FROM CrimeSceneReport/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    expect(screen.queryByText("Breadcrumbs 2 / 3")).not.toBeInTheDocument();
    expect(screen.queryByText(/AND ReportCity = 'SQL City'/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/I queued the CrimeID filter because we already proved Murder is 1080/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    expect(
      screen.getByText(/That filter found murder reports, but there are still too many/)
    ).toBeInTheDocument();
    expect(screen.getByText(/AND ReportCity = 'SQL City'/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate City Filter" }));

    expect(await screen.findByText(/Evidence Prompt:/)).toBeInTheDocument();
    expect(screen.queryByText("Breadcrumbs 2 / 3")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Murder board covered in report scraps, red string, and the highlighted crime ID" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "You have the right report table now. Use the murder code and SQL City together, then pin the report row that matches the case date."
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));

    fireEvent.click(screen.getByRole("button", { name: "Samuel's Briefing" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Filter down to the murder reports" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Breadcrumbs 3 / 3")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));
    expect(screen.queryByText("Which evidence chain proves you found the target murder report?")).not.toBeInTheDocument();
    expect(screen.queryByText(/Samuel unlocks the witness trail/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Current Action")).toHaveTextContent("Witness Discovery");
    expect(screen.queryByText("Lead Unlocked")).not.toBeInTheDocument();
    expect(screen.getByText("Witness trail unlocked")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Glowing evidence board with a confirmed clue pinned at the center" })
    ).toBeInTheDocument();
  });

  it("shows concise schema details when a table link is selected", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Case File" }));
    expect(await screen.findByRole("button", { name: "dbo.person" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "dbo.person" }));

    expect(screen.getAllByText("dbo.person").length).toBeGreaterThan(0);
    expect(screen.getByText("Column")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("PK")).toBeInTheDocument();
    expect(screen.getByText("FK")).toBeInTheDocument();
  });

  it("lets students click a pinned fact to send a query assist into the editor", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));
    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    fireEvent.click(screen.getByRole("button", { name: "Add CrimeID = 1080 to query editor" }));

    expect(screen.getByText("Query Assist: CrimeID = 1080")).toBeInTheDocument();
  });

  it("lets students click Samuel's witness clue tokens to send query assist text into the editor", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate First Lead" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Crime Evidence Log" }));
    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Scene Report Review" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Case Filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate City Filter" }));
    fireEvent.click(screen.getByRole("button", { name: "Simulate Filtered Report Log" }));
    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    fireEvent.click(screen.getByRole("button", { name: "Add Northwestern Dr to query editor" }));
    expect(screen.getByText("Query Assist: 'Northwestern Dr'")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add ORDER BY PersonID to query editor" }));
    expect(screen.getByText("Query Assist: ORDER BY PersonID")).toBeInTheDocument();
  });

  it("renders Samuel avatar and scene image in Briefing view", () => {
    render(<App />);

    const header = document.querySelector(".student-case-header");
    expect(document.querySelector(".samuel-avatar img")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).toBeInTheDocument();
    expect(header?.getAttribute("data-active-view")).toBe("briefing");
    expect(header?.getAttribute("data-header-variant")).toBe("briefing-full");
    expect(header?.classList.contains("student-case-header--variant-briefing-full")).toBe(true);
  });

  it("renders Samuel avatar only in Query Lab header with mentor-hero variant", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Query Lab" }));

    const header = document.querySelector(".student-case-header");
    expect(document.querySelector(".samuel-avatar img")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).not.toBeInTheDocument();
    expect(document.querySelector(".student-case-header__visual")).not.toBeInTheDocument();
    expect(document.querySelector(".noir-scene-frame")).not.toBeInTheDocument();
    expect(header?.getAttribute("data-active-view")).toBe("workbench");
    expect(header?.getAttribute("data-header-variant")).toBe("workbench-mentor-hero");
    expect(
      header?.classList.contains("student-case-header--variant-workbench-mentor-hero")
    ).toBe(true);
    expect(
      header?.classList.contains("student-case-header--view-workbench")
    ).toBe(true);
    const mentorStrip = header?.querySelector(".student-mentor-strip--embedded");
    expect(mentorStrip).not.toBeNull();
    expect(mentorStrip?.querySelector(".samuel-avatar-frame")).not.toBeNull();
    expect(mentorStrip?.querySelector(".student-mentor-strip__copy")).not.toBeNull();
  });

  it("renders scene image only in Evidence Board header with scene-hero variant", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

    const header = document.querySelector(".student-case-header");
    expect(
      screen.getByRole("img", { name: "Crime ledger dossier under a desk lamp with the murder row marked" })
    ).toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar")).not.toBeInTheDocument();
    expect(document.querySelector(".samuel-avatar-frame")).not.toBeInTheDocument();
    expect(header?.getAttribute("data-active-view")).toBe("case-board");
    expect(header?.getAttribute("data-header-variant")).toBe("case-board-scene-hero");
    expect(
      header?.classList.contains("student-case-header--variant-case-board-scene-hero")
    ).toBe(true);
    expect(
      header?.classList.contains("student-case-header--view-case-board")
    ).toBe(true);
    const visual = header?.querySelector(".student-case-header__visual");
    expect(visual).not.toBeNull();
    expect(visual?.querySelector(".noir-scene-frame")).not.toBeNull();
    expect(visual?.querySelector(".noir-scene-frame__image")).not.toBeNull();
  });

  it("labels required next-step callouts and Optional Samuel's check-in distinctly on the Evidence Board", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Evidence Board" }));

    const requiredCallout = document.querySelector(".student-required-callout");
    expect(requiredCallout).not.toBeNull();
    expect(requiredCallout).toHaveTextContent("Required Next Step");
    expect(requiredCallout).toHaveTextContent("Do This Next");

    const optionalSection = screen
      .getByText("Optional Samuel's Check-In")
      .closest("section");
    expect(optionalSection).not.toBeNull();
    expect(optionalSection).toHaveClass("student-optional-callout");
    expect(optionalSection).toHaveTextContent("Optional");
  });
});
