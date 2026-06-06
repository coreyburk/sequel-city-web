import { fireEvent, render, screen } from "@testing-library/react";
import type { QueryExecutionSuccessResponse } from "../api/types";
import { QueryResultsTable } from "./QueryResultsTable";

describe("QueryResultsTable", () => {
  it("renders columns and display values", () => {
    render(
      <QueryResultsTable
        result={{
          columns: [
            { name: "CurrentDatabase", ordinal: 0, dataType: "string" },
            { name: "IsOnline", ordinal: 1, dataType: "boolean" }
          ],
          rows: [
            {
              values: {
                CurrentDatabase: "SequelCityCrimesDB",
                IsOnline: true
              },
              displayValues: {
                CurrentDatabase: "SequelCityCrimesDB",
                IsOnline: "true"
              }
            }
          ],
          rowCount: 1
        }}
      />
    );

    expect(screen.getByText("CurrentDatabase")).toBeInTheDocument();
    expect(screen.getByText("IsOnline")).toBeInTheDocument();
    expect(screen.getByText("SequelCityCrimesDB")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
    expect(screen.getByText("Rows returned: 1")).toBeInTheDocument();
  });

  it("limits large student result sets and allows expanding", () => {
    const rows = Array.from({ length: 30 }, (_, index) => ({
      values: { id: index + 1, label: `row-${index + 1}` },
      displayValues: { id: String(index + 1), label: `row-${index + 1}` }
    }));

    render(
      <QueryResultsTable
        audience="student"
        result={{
          columns: [
            { name: "id", ordinal: 0, dataType: "number" },
            { name: "label", ordinal: 1, dataType: "string" }
          ],
          rows,
          rowCount: rows.length
        }}
      />
    );

    expect(screen.getByText("Rows returned: 30 (showing 25)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show 25 More" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show All" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show All" }));

    expect(screen.getByText("Rows returned: 30 (showing 30)")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show All" })).not.toBeInTheDocument();
  });

  it("shows row logging controls when student evidence capture is active", () => {
    const onStudentLogRow = vi.fn();

    render(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        onStudentLogRow={onStudentLogRow}
        result={{
          columns: [
            { name: "CrimeID", ordinal: 0, dataType: "number" },
            { name: "Crime", ordinal: 1, dataType: "string" }
          ],
          rows: [
            {
              values: { CrimeID: 1080, Crime: "Murder" },
              displayValues: { CrimeID: "1080", Crime: "Murder" }
            }
          ],
          rowCount: 1
        }}
      />
    );

    expect(screen.queryByLabelText("Samuel's Results Guidance")).not.toBeInTheDocument();
    expect(screen.queryByText("Evidence Update")).not.toBeInTheDocument();
    expect(screen.queryByText("Samuel's Feedback")).not.toBeInTheDocument();
    expect(screen.queryByText("Samuel's Notebook Prompt")).not.toBeInTheDocument();
    const logButton = screen.getByRole("button", { name: "Log row 1 as evidence" });
    fireEvent.click(logButton);

    expect(onStudentLogRow).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("That row does not prove the clue yet.")).not.toBeInTheDocument();
  });

  it("renders Log Clue buttons with always-visible prominence hooks and a visible column header (WP-110)", () => {
    render(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        onStudentLogRow={vi.fn()}
        result={{
          columns: [
            { name: "CrimeID", ordinal: 0, dataType: "number" },
            { name: "Crime", ordinal: 1, dataType: "string" }
          ],
          rows: [
            {
              values: { CrimeID: 1080, Crime: "Murder" },
              displayValues: { CrimeID: "1080", Crime: "Murder" }
            },
            {
              values: { CrimeID: 1180, Crime: "Robbery" },
              displayValues: { CrimeID: "1180", Crime: "Robbery" }
            }
          ],
          rowCount: 2
        }}
      />
    );

    // Visible column header replaces the hover-only visually-hidden label.
    const actionHead = document.querySelector("th.query-results__action-head");
    expect(actionHead?.textContent).toBe("Log Clue");
    expect(actionHead?.querySelector(".visually-hidden")).toBeNull();

    // Each row has its own prominent button with a stable data hook.
    const buttons = screen.getAllByRole("button", { name: /Log row \d+ as evidence/ });
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).toHaveClass("student-log-button");
      expect(button).toHaveClass("student-log-button--prominent");
      expect(button).toHaveAttribute("data-student-action", "log-clue");
      expect(button).not.toHaveClass("student-log-button--compact");
      expect(button.textContent).toContain("Log Clue");
    }
  });

  it("marks the clicked Log Clue button with success or error feedback", () => {
    const onStudentLogRow = vi.fn();
    const result: QueryExecutionSuccessResponse["data"] = {
      columns: [
        { name: "CrimeID", ordinal: 0, dataType: "number" },
        { name: "Crime", ordinal: 1, dataType: "string" }
      ],
      rows: [
        {
          values: { CrimeID: 1080, Crime: "Murder" },
          displayValues: { CrimeID: "1080", Crime: "Murder" }
        },
        {
          values: { CrimeID: 1180, Crime: "Robbery" },
          displayValues: { CrimeID: "1180", Crime: "Robbery" }
        }
      ],
      rowCount: 2
    };

    const { rerender } = render(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        studentEvidenceFeedback={null}
        studentEvidenceFeedbackTone="neutral"
        studentEvidenceFeedbackVersion={0}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    const firstButton = screen.getByRole("button", { name: "Log row 1 as evidence" });
    const secondButton = screen.getByRole("button", { name: "Log row 2 as evidence" });

    fireEvent.click(secondButton);
    rerender(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        studentEvidenceFeedback="That row does not prove the clue yet."
        studentEvidenceFeedbackTone="error"
        studentEvidenceFeedbackVersion={1}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    expect(secondButton).toHaveClass("student-log-button--feedback-error");
    expect(secondButton).toHaveAttribute("data-log-feedback", "error");
    expect(secondButton).toHaveTextContent("Try Again");
    expect(firstButton).not.toHaveClass("student-log-button--feedback-error");

    fireEvent.click(firstButton);
    rerender(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log the row that proves the clue."
        studentEvidenceFeedback="Clue logged: CrimeID 1080 maps to Murder."
        studentEvidenceFeedbackTone="success"
        studentEvidenceFeedbackVersion={2}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    expect(firstButton).toHaveClass("student-log-button--feedback-success");
    expect(firstButton).toHaveAttribute("data-log-feedback", "success");
    expect(secondButton).not.toHaveClass("student-log-button--feedback-error");
  });

  it("keeps success feedback on multiple rows when repeated logs reuse the same message", () => {
    const onStudentLogRow = vi.fn();
    const result: QueryExecutionSuccessResponse["data"] = {
      columns: [
        { name: "EventID", ordinal: 0, dataType: "number" },
        { name: "EventName", ordinal: 1, dataType: "string" }
      ],
      rows: [
        {
          values: { EventID: 2669, EventName: "Neon Nights Symphony Delights" },
          displayValues: { EventID: "2669", EventName: "Neon Nights Symphony Delights" }
        },
        {
          values: { EventID: 3005, EventName: "Skyline Symphony Showcase" },
          displayValues: { EventID: "3005", EventName: "Skyline Symphony Showcase" }
        },
        {
          values: { EventID: 3257, EventName: "Winter Wonderland Symphony" },
          displayValues: { EventID: "3257", EventName: "Winter Wonderland Symphony" }
        }
      ],
      rowCount: 3
    };

    const { rerender } = render(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log all matching rows."
        studentEvidenceFeedback={null}
        studentEvidenceFeedbackTone="neutral"
        studentEvidenceFeedbackVersion={0}
        studentLogFeedbackMode="multi"
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    for (const [index, version] of [1, 2, 3].entries()) {
      fireEvent.click(screen.getByRole("button", { name: `Log row ${index + 1} as evidence` }));
      rerender(
        <QueryResultsTable
          audience="student"
          studentEvidencePrompt="Log all matching rows."
          studentEvidenceFeedback="Event logged. Keep these EventSchedule results open until all three Symphony rows are pinned."
          studentEvidenceFeedbackTone="success"
          studentEvidenceFeedbackVersion={version + 1}
          studentLogFeedbackMode="multi"
          onStudentLogRow={onStudentLogRow}
          result={result}
        />
      );
    }

    for (const rowNumber of [1, 2, 3]) {
      const button = screen.getByRole("button", { name: `Log row ${rowNumber} as evidence` });
      expect(button).toHaveClass("student-log-button--feedback-success");
      expect(button).toHaveAttribute("data-log-feedback", "success");
    }
  });

  it("defaults repeated success feedback to only the latest clicked row", () => {
    const onStudentLogRow = vi.fn();
    const result: QueryExecutionSuccessResponse["data"] = {
      columns: [
        { name: "LogID", ordinal: 0, dataType: "number" },
        { name: "LogTranscript", ordinal: 1, dataType: "string" }
      ],
      rows: [
        {
          values: { LogID: 4559, LogTranscript: "There was a suspicious-looking red BMW." },
          displayValues: { LogID: "4559", LogTranscript: "There was a suspicious-looking red BMW." }
        },
        {
          values: { LogID: 4742, LogTranscript: "I saw the murder happen right outside Symphony Hall." },
          displayValues: { LogID: "4742", LogTranscript: "I saw the murder happen right outside Symphony Hall." }
        }
      ],
      rowCount: 2
    };

    const { rerender } = render(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log one row from each witness bundle."
        studentEvidenceFeedback={null}
        studentEvidenceFeedbackTone="neutral"
        studentEvidenceFeedbackVersion={0}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Log row 1 as evidence" }));
    rerender(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log one row from each witness bundle."
        studentEvidenceFeedback="Witness clue bundle logged."
        studentEvidenceFeedbackTone="success"
        studentEvidenceFeedbackVersion={1}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Log row 2 as evidence" }));
    rerender(
      <QueryResultsTable
        audience="student"
        studentEvidencePrompt="Log one row from each witness bundle."
        studentEvidenceFeedback="Witness clue bundle logged."
        studentEvidenceFeedbackTone="success"
        studentEvidenceFeedbackVersion={2}
        onStudentLogRow={onStudentLogRow}
        result={result}
      />
    );

    expect(screen.getByRole("button", { name: "Log row 1 as evidence" })).not.toHaveClass(
      "student-log-button--feedback-success"
    );
    expect(screen.getByRole("button", { name: "Log row 2 as evidence" })).toHaveClass(
      "student-log-button--feedback-success"
    );
  });

  it("does not render clue logging affordance when student evidence capture is inactive", () => {
    render(
      <QueryResultsTable
        audience="student"
        result={{
          columns: [{ name: "CrimeID", ordinal: 0, dataType: "number" }],
          rows: [
            {
              values: { CrimeID: 1080 },
              displayValues: { CrimeID: "1080" }
            }
          ],
          rowCount: 1
        }}
      />
    );

    expect(screen.queryByRole("button", { name: /Log row \d+ as evidence/ })).not.toBeInTheDocument();
  });

  it("renders short transcript fields without an expand affordance", () => {
    const shortTranscript = "Witness saw a person leave the scene.";
    render(
      <QueryResultsTable
        result={{
          columns: [{ name: "LogTranscript", ordinal: 0, dataType: "string" }],
          rows: [
            {
              values: { LogTranscript: shortTranscript },
              displayValues: { LogTranscript: shortTranscript }
            }
          ],
          rowCount: 1
        }}
      />
    );

    expect(screen.getByText(shortTranscript)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
  });

  it("truncates long transcript fields and lets the student expand them via a click affordance", () => {
    const longTranscript = `${"The witness described the suspect at length. ".repeat(6)}They mentioned a long coat and a quiet voice.`;

    render(
      <QueryResultsTable
        result={{
          columns: [{ name: "LogTranscript", ordinal: 0, dataType: "string" }],
          rows: [
            {
              values: { LogTranscript: longTranscript },
              displayValues: { LogTranscript: longTranscript }
            }
          ],
          rowCount: 1
        }}
      />
    );

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(longTranscript)).not.toBeInTheDocument();

    fireEvent.click(toggle);

    expect(screen.getByText(longTranscript)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    fireEvent.click(screen.getByRole("button", { name: "Show less" }));
    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("transcript expansion does not rely on hover-only interaction (uses real buttons)", () => {
    const longTranscript = `${"This statement keeps going for many words. ".repeat(8)}End.`;

    render(
      <QueryResultsTable
        result={{
          columns: [{ name: "LogTranscript", ordinal: 0, dataType: "string" }],
          rows: [
            {
              values: { LogTranscript: longTranscript },
              displayValues: { LogTranscript: longTranscript }
            }
          ],
          rowCount: 1
        }}
      />
    );

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-controls");
  });

  it("expands transcript cells independently per row", () => {
    const longA = `${"Statement A continues across many words. ".repeat(6)}A.`;
    const longB = `${"Statement B continues across many words. ".repeat(6)}B.`;

    render(
      <QueryResultsTable
        result={{
          columns: [{ name: "LogTranscript", ordinal: 0, dataType: "string" }],
          rows: [
            {
              values: { LogTranscript: longA },
              displayValues: { LogTranscript: longA }
            },
            {
              values: { LogTranscript: longB },
              displayValues: { LogTranscript: longB }
            }
          ],
          rowCount: 2
        }}
      />
    );

    const toggles = screen.getAllByRole("button", { name: "Show more" });
    expect(toggles).toHaveLength(2);

    fireEvent.click(toggles[0]);

    expect(screen.getByText(longA)).toBeInTheDocument();
    expect(screen.queryByText(longB)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Show more" })).toHaveLength(1);
  });
});
