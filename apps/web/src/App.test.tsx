import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./components/HealthStatus", () => ({
  HealthStatus: () => <section><h2>Health Status</h2></section>
}));

vi.mock("./components/SchemaExplorer", () => ({
  SchemaExplorer: () => <section><h2>Schema Explorer</h2></section>
}));

vi.mock("./components/QueryRunner", () => ({
  QueryRunner: () => <section><h2>Query Runner</h2></section>
}));

vi.mock("./components/QueryHistoryPanel", () => ({
  QueryHistoryPanel: () => <section><h2>Query History</h2></section>
}));

describe("App", () => {
  it("renders the core application sections", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Sequel City Web Detective" })
    ).toBeInTheDocument();
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
      screen.getByRole("heading", { name: "Query History" })
    ).toBeInTheDocument();
  });
});
