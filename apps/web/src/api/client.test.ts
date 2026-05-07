import {
  API_BASE_URL,
  executeQuery,
  getFullHealth,
  getQueryHistory,
  getSchemaTables,
  verifySuspect
} from "./client";

describe("api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds the full health request path", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), { status: 200 })
    );

    await getFullHealth();

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/health/full`,
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  it("builds the schema request path", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, data: { tables: [], relationships: [] } }),
        { status: 200 }
      )
    );

    await getSchemaTables();

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/schema/tables`,
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  it("builds the query execution request path and body", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { columns: [], rows: [], rowCount: 0 },
          safety: {
            isAllowed: true,
            normalizedStatementType: "SELECT",
            violations: [],
            message: "Safe."
          },
          executionTimeMs: 1,
          message: "Executed."
        }),
        { status: 200 }
      )
    );

    await executeQuery("SELECT 1");

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/query/execute`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ sql: "SELECT 1" })
      })
    );
  });

  it("builds the query history request path", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, data: { records: [] } }),
        { status: 200 }
      )
    );

    await getQueryHistory();

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/query/history`,
      expect.objectContaining({ headers: { "Content-Type": "application/json" } })
    );
  });

  it("builds the case verification request path and body", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            suspect: "Ada Lovelace",
            verdict: "Database verdict"
          },
          message: "Suspect verification completed."
        }),
        { status: 200 }
      )
    );

    await verifySuspect("Ada Lovelace");

    expect(fetchSpy).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/case/verify-suspect`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ suspect: "Ada Lovelace" })
      })
    );
  });
});
