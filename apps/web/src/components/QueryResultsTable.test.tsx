import { fireEvent, render, screen } from "@testing-library/react";
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
});
