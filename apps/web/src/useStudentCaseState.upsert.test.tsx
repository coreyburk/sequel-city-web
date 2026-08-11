import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getFullHealth, getSchemaTables, verifySuspect } from "./api/client";
import type { QueryColumn, QueryExecutionResponse, QueryRow } from "./api/types";
import {
  STUDENT_CASE_STORAGE_KEY,
  getStudentCaseStorageKey,
  useStudentCaseState
} from "./useStudentCaseState";

vi.mock("./api/client", () => ({
  getFullHealth: vi.fn(),
  getSchemaTables: vi.fn(),
  verifySuspect: vi.fn()
}));

function buildRow(values: Record<string, string | number>): QueryRow {
  return {
    values,
    displayValues: Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, String(value)])
    )
  };
}

function buildSuccessResponse(
  columns: QueryColumn[],
  rows: QueryRow[]
): QueryExecutionResponse {
  return {
    success: true,
    data: {
      columns,
      rows,
      rowCount: rows.length
    },
    safety: {
      isAllowed: true,
      normalizedStatementType: "SELECT",
      violations: [],
      message: "Safe."
    },
    executionTimeMs: 1,
    message: "Executed."
  };
}

function TestHarness({
  activeCaseId = "case-004"
}: {
  activeCaseId?: string | null;
}): JSX.Element {
  const {
    notebookEntries,
    pendingEvidenceStep,
    completedMilestones,
    studentDraftQuery,
    studentEvidenceFeedback,
    studentEvidenceFeedbackTone,
    studentView,
    handleQueryExecutionComplete,
    handleStudentEvidenceLog,
    resetStudentCaseProgress
  } = useStudentCaseState("student", activeCaseId);
  const [progressionStep, setProgressionStep] = React.useState(0);

  function advanceProgression(): void {
    switch (progressionStep) {
      case 0:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM CrimeType",
          response: buildSuccessResponse(
            [
              { name: "CrimeID", ordinal: 0, dataType: "number" },
              { name: "Crime", ordinal: 1, dataType: "string" }
            ],
            [buildRow({ CrimeID: 1080, Crime: "Murder" })]
          ),
          error: null
        });
        break;
      case 1:
        handleStudentEvidenceLog(buildRow({ CrimeID: 1080, Crime: "Murder" }));
        break;
      case 2:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM CrimeSceneReport",
          response: buildSuccessResponse(
            [
              { name: "CrimeID", ordinal: 0, dataType: "number" },
              { name: "ReportID", ordinal: 1, dataType: "number" },
              { name: "ReportDate", ordinal: 2, dataType: "string" },
              { name: "ReportCity", ordinal: 3, dataType: "string" }
            ],
            [
              buildRow({
                CrimeID: 1080,
                ReportID: 10975,
                ReportDate: "20230115",
                ReportCity: "SQL City"
              })
            ]
          ),
          error: null
        });
        break;
      case 3:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080",
          response: buildSuccessResponse(
            [
              { name: "CrimeID", ordinal: 0, dataType: "number" },
              { name: "ReportID", ordinal: 1, dataType: "number" },
              { name: "ReportDate", ordinal: 2, dataType: "string" },
              { name: "ReportCity", ordinal: 3, dataType: "string" }
            ],
            [
              buildRow({
                CrimeID: 1080,
                ReportID: 10975,
                ReportDate: "20230115",
                ReportCity: "SQL City"
              })
            ]
          ),
          error: null
        });
        break;
      case 4:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'",
          response: buildSuccessResponse(
            [
              { name: "CrimeID", ordinal: 0, dataType: "number" },
              { name: "ReportID", ordinal: 1, dataType: "number" },
              { name: "ReportDate", ordinal: 2, dataType: "string" },
              { name: "ReportCity", ordinal: 3, dataType: "string" }
            ],
            [
              buildRow({
                CrimeID: 1080,
                ReportID: 10975,
                ReportDate: "20230115",
                ReportCity: "SQL City"
              })
            ]
          ),
          error: null
        });
        break;
      case 5:
        handleStudentEvidenceLog(
          buildRow({
            CrimeID: 1080,
            ReportID: 10975,
            ReportDate: "20230115",
            ReportCity: "SQL City"
          })
        );
        break;
      case 6:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID",
          response: buildSuccessResponse(
            [
              { name: "LogID", ordinal: 0, dataType: "number" },
              { name: "PersonID", ordinal: 1, dataType: "number" },
              { name: "ReportID", ordinal: 2, dataType: "number" },
              { name: "LogTranscript", ordinal: 3, dataType: "string" }
            ],
            [
              buildRow({
                LogID: 4559,
                PersonID: 14887,
                ReportID: 10975,
                LogTranscript: "There was a suspicious-looking red BMW parked outside the Symphony Hall."
              }),
              buildRow({
                LogID: 4742,
                PersonID: 16371,
                ReportID: 10975,
                LogTranscript: "I saw the murder happen right outside Symphony Hall."
              })
            ]
          ),
          error: null
        });
        break;
      case 7:
        handleStudentEvidenceLog(
          buildRow({
            LogID: 4559,
            PersonID: 14887,
            ReportID: 10975,
            LogTranscript: "There was a suspicious-looking red BMW parked outside the Symphony Hall."
          })
        );
        break;
      case 8:
        handleStudentEvidenceLog(
          buildRow({
            LogID: 4742,
            PersonID: 16371,
            ReportID: 10975,
            LogTranscript: "I saw the murder happen right outside Symphony Hall."
          })
        );
        break;
      case 9:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371",
          response: buildSuccessResponse(
            [
              { name: "PersonID", ordinal: 0, dataType: "number" },
              { name: "PersonName", ordinal: 1, dataType: "string" }
            ],
            [
              buildRow({ PersonID: 14887, PersonName: "Morty Schapiro" }),
              buildRow({ PersonID: 16371, PersonName: "Annabel Miller" })
            ]
          ),
          error: null
        });
        break;
      case 10:
        handleStudentEvidenceLog(buildRow({ PersonID: 14887, PersonName: "Morty Schapiro" }));
        break;
      case 11:
        handleStudentEvidenceLog(buildRow({ PersonID: 16371, PersonName: "Annabel Miller" }));
        break;
      case 12:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'",
          response: buildSuccessResponse(
            [
              { name: "FitMemberID", ordinal: 0, dataType: "string" },
              { name: "PersonID", ordinal: 1, dataType: "number" },
              { name: "FitMembershipStatus", ordinal: 2, dataType: "string" }
            ],
            [
              buildRow({
                FitMemberID: "48Z55",
                PersonID: 67318,
                FitMembershipStatus: "gold"
              })
            ]
          ),
          error: null
        });
        break;
      case 13:
        handleStudentEvidenceLog(
          buildRow({
            FitMemberID: "48Z55",
            PersonID: 67318,
            FitMembershipStatus: "gold"
          })
        );
        break;
      case 14:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM PersonsOfInterest WHERE PersonID = 67318",
          response: buildSuccessResponse(
            [
              { name: "PersonID", ordinal: 0, dataType: "number" },
              { name: "PersonName", ordinal: 1, dataType: "string" }
            ],
            [buildRow({ PersonID: 67318, PersonName: "Jeremy Bowers" })]
          ),
          error: null
        });
        break;
      case 15:
        handleStudentEvidenceLog(buildRow({ PersonID: 67318, PersonName: "Jeremy Bowers" }));
        break;
      case 16:
        handleQueryExecutionComplete({
          sql: "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975",
          response: buildSuccessResponse(
            [
              { name: "LogID", ordinal: 0, dataType: "number" },
              { name: "PersonID", ordinal: 1, dataType: "number" },
              { name: "ReportID", ordinal: 2, dataType: "number" },
              { name: "LogTranscript", ordinal: 3, dataType: "string" }
            ],
            [
              buildRow({
                LogID: 8801,
                PersonID: 67318,
                ReportID: 10975,
                LogTranscript: "I delivered the hit after the contract came through."
              }),
              buildRow({
                LogID: 8802,
                PersonID: 67318,
                ReportID: 10975,
                LogTranscript: "The client wanted that scumbag taken out fast."
              })
            ]
          ),
          error: null
        });
        break;
      default:
        break;
    }

    setProgressionStep((current) => current + 1);
  }

  return (
    <div>
      <button type="button" onClick={advanceProgression}>
        Advance Progression
      </button>
      <button
        type="button"
        onClick={() =>
          handleStudentEvidenceLog(
            buildRow({
              LogID: 8802,
              PersonID: 67318,
              ReportID: 10975,
              LogTranscript: "The client wanted that scumbag taken out fast."
            })
          )
        }
      >
        Log Deferred Suspect Row
      </button>
      <button type="button" onClick={resetStudentCaseProgress}>
        Reset Student Case Progress
      </button>
      <div aria-label="pending-step">{pendingEvidenceStep ?? "none"}</div>
      <div aria-label="student-view">{studentView}</div>
      <div aria-label="student-draft">{studentDraftQuery ?? ""}</div>
      <div aria-label="crime-type-completed">
        {completedMilestones["crime-type"] ? "yes" : "no"}
      </div>
      <div aria-label="feedback-tone">{studentEvidenceFeedbackTone}</div>
      <div aria-label="feedback-message">{studentEvidenceFeedback ?? ""}</div>
      <div aria-label="notebook">
        {notebookEntries.map((entry) => (
          <div key={entry.id} data-testid={`entry-${entry.id}`}>
            {entry.detail}
          </div>
        ))}
      </div>
    </div>
  );
}

describe("useStudentCaseState clue logging outcomes", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
          identity: {
            status: "ready",
            message: "Database identity is ready.",
            missingFacts: []
          },
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

  it("derives the Case 004 key from the case id while preserving the legacy key", () => {
    expect(getStudentCaseStorageKey("case-004")).toBe(STUDENT_CASE_STORAGE_KEY);
    expect(getStudentCaseStorageKey("case-006")).toBe(
      "sequel-city.case-006.student-state.v1"
    );
  });

  it("restores valid learner-owned student case state from local storage", async () => {
    window.localStorage.setItem(
      STUDENT_CASE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        caseId: "case-004",
        state: {
          studentView: "workbench",
          selectedStudentTable: "dbo.CrimeSceneReport",
          studentDraftQuery: "SELECT *\nFROM CrimeSceneReport",
          completedMilestones: {
            "crime-type": true
          },
          samuelStage: 2,
          notebookEntries: [
            {
              id: "crime-type-murder",
              detail: "CrimeID = 1080",
              sourceLabel: "Samuel Step 1"
            }
          ],
          pendingEvidenceStep: "crime-scene-filter",
          studentEvidenceFeedback: "Resume from the report filter.",
          studentEvidenceFeedbackTone: "success",
          studentEvidenceFeedbackVersion: 3,
          manualNotebookDraft: "Check report city.",
          caseReviewStatus: "idle",
          caseReviewStatusId: null,
          earnedCaseReviewIds: [],
          studentSuspectTheoryDraft: "Jeremy Bowers",
          studentSuspectTheoryResult: null,
          studentSuspectTheoryError: null
        }
      })
    );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText("student-view")).toHaveTextContent("workbench");
    });
    expect(screen.getByLabelText("student-draft")).toHaveTextContent("SELECT *");
    expect(screen.getByLabelText("crime-type-completed")).toHaveTextContent("yes");
    expect(screen.getByLabelText("pending-step")).toHaveTextContent("crime-scene-filter");
    expect(screen.getByLabelText("feedback-tone")).toHaveTextContent("success");
    expect(screen.getByText("CrimeID = 1080")).toBeInTheDocument();
    expect(verifySuspect).not.toHaveBeenCalled();
  });

  it("ignores a persisted envelope for a different case id", async () => {
    window.localStorage.setItem(
      STUDENT_CASE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        caseId: "case-006",
        state: {
          studentView: "workbench",
          completedMilestones: {
            "crime-type": true
          },
          notebookEntries: [
            {
              id: "wrong-case-entry",
              detail: "This belongs to another case."
            }
          ],
          pendingEvidenceStep: "crime-scene-filter",
          studentEvidenceFeedbackTone: "success"
        }
      })
    );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText("student-view")).toHaveTextContent("briefing");
    });
    expect(screen.getByLabelText("crime-type-completed")).toHaveTextContent("no");
    expect(screen.getByLabelText("pending-step")).toHaveTextContent("none");
    expect(screen.queryByText("This belongs to another case.")).not.toBeInTheDocument();
  });

  it("ignores unsupported storage versions and missing case ids", async () => {
    window.localStorage.setItem(
      STUDENT_CASE_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        state: {
          studentView: "workbench",
          completedMilestones: {
            "crime-type": true
          }
        }
      })
    );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText("student-view")).toHaveTextContent("briefing");
    });
    expect(screen.getByLabelText("crime-type-completed")).toHaveTextContent("no");
  });

  it("ignores malformed local storage and keeps authored defaults", async () => {
    window.localStorage.setItem(
      STUDENT_CASE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        caseId: "case-004",
        state: {
          studentView: "solved",
          completedMilestones: {
            "crime-type": "yes"
          },
          notebookEntries: [
            {
              id: "missing detail"
            }
          ],
          pendingEvidenceStep: "answer-key",
          studentEvidenceFeedbackTone: "loud"
        }
      })
    );

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText("student-view")).toHaveTextContent("briefing");
    });
    expect(screen.getByLabelText("crime-type-completed")).toHaveTextContent("no");
    expect(screen.getByLabelText("pending-step")).toHaveTextContent("none");
    expect(screen.getByLabelText("feedback-tone")).toHaveTextContent("neutral");
    expect(screen.queryByText("missing detail")).not.toBeInTheDocument();
    expect(verifySuspect).not.toHaveBeenCalled();
  });

  it("does not write investigation progress for locked or future case ids", async () => {
    render(<TestHarness activeCaseId="case-006" />);

    fireEvent.click(screen.getByRole("button", { name: "Advance Progression" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset Student Case Progress" }));
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(window.localStorage.getItem(getStudentCaseStorageKey("case-006"))).toBeNull();
    expect(window.localStorage.getItem(STUDENT_CASE_STORAGE_KEY)).toBeNull();
  });

  it("clears Case 004 persisted state and resets in-memory progress to authored defaults", async () => {
    window.localStorage.setItem(
      STUDENT_CASE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        caseId: "case-004",
        state: {
          studentView: "workbench",
          selectedStudentTable: "dbo.CrimeSceneReport",
          studentDraftQuery: "SELECT *\nFROM CrimeSceneReport",
          completedMilestones: {
            "crime-type": true
          },
          samuelStage: 2,
          notebookEntries: [
            {
              id: "crime-type-murder",
              detail: "CrimeID = 1080",
              sourceLabel: "Samuel Step 1"
            }
          ],
          pendingEvidenceStep: "crime-scene-filter",
          studentEvidenceFeedback: "Resume from the report filter.",
          studentEvidenceFeedbackTone: "success",
          studentEvidenceFeedbackVersion: 3,
          manualNotebookDraft: "Check report city.",
          caseReviewStatus: "idle",
          caseReviewStatusId: null,
          earnedCaseReviewIds: [],
          studentSuspectTheoryDraft: "Jeremy Bowers",
          studentSuspectTheoryResult: null,
          studentSuspectTheoryError: null
        }
      })
    );
    window.localStorage.setItem(getStudentCaseStorageKey("case-006"), "future-case-progress");

    render(<TestHarness />);

    await waitFor(() => {
      expect(screen.getByLabelText("student-view")).toHaveTextContent("workbench");
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Student Case Progress" }));

    expect(window.localStorage.getItem(STUDENT_CASE_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(getStudentCaseStorageKey("case-006"))).toBe(
      "future-case-progress"
    );
    expect(screen.getByLabelText("student-view")).toHaveTextContent("briefing");
    expect(screen.getByLabelText("student-draft")).toHaveTextContent("SELECT * FROM CrimeType");
    expect(screen.getByLabelText("crime-type-completed")).toHaveTextContent("no");
    expect(screen.getByLabelText("pending-step")).toHaveTextContent("none");
    expect(screen.getByLabelText("feedback-tone")).toHaveTextContent("neutral");
    expect(screen.queryByText("CrimeID = 1080")).not.toBeInTheDocument();

    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(window.localStorage.getItem(STUDENT_CASE_STORAGE_KEY)).toBeNull();
  });

  it("defers mastermind-only suspect interview rows until the confession is pinned", async () => {
    render(<TestHarness />);

    for (let index = 0; index < 17; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Advance Progression" }));
    }
    await waitFor(() => {
      expect(screen.getByLabelText("pending-step")).toHaveTextContent("suspect-interview");
    });

    fireEvent.click(screen.getByRole("button", { name: "Log Deferred Suspect Row" }));

    await waitFor(() => {
      expect(screen.getByLabelText("feedback-tone")).toHaveTextContent("advisory");
    });
    expect(screen.getByLabelText("feedback-message")).toHaveTextContent(
      /does not prove the current suspect step/i
    );
    expect(screen.queryByText(/Suspect Interview Clue:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mastermind Clue:/i)).not.toBeInTheDocument();
  });
});
