import { expect, request as playwrightRequest, test, type APIRequestContext } from "@playwright/test";

const CASE_001_LIVE_SMOKE_ENV = "CASE_001_LIVE_SMOKE";
const API_BASE_URL = process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3001";
const EXPLORATORY_STARTER_SQL = "SELECT * FROM CrimeType;";
const M0_TARGET_SQL = "SELECT * FROM CrimeType;";
const M1_TARGET_SQL =
  "SELECT ReportID, CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City';";
const M2_TARGET_SQL =
  "SELECT PersonID, ReportID, LogTranscript FROM InterviewLog WHERE ReportID IN (SELECT ReportID FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = 20230502 AND ReportCity = 'Sequel City') ORDER BY PersonID;";

type PreflightResult =
  | {
      status: "ready";
    }
  | {
      status: "blocked";
      message: string;
    };

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getResponseJson(response: { json: () => Promise<unknown> }): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function formatBlocker(message: string): string {
  return `WP-274 live smoke blocker: ${message}`;
}

async function classifyLiveStackReadiness(
  apiRequest: APIRequestContext
): Promise<PreflightResult> {
  const healthUrl = `${API_BASE_URL}/api/health/full`;
  let healthResponse;

  try {
    healthResponse = await apiRequest.get(healthUrl, { timeout: 5000 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "request failed";
    return {
      status: "blocked",
      message: formatBlocker(`API unavailable at ${healthUrl}. ${detail}`)
    };
  }

  const healthJson = await getResponseJson(healthResponse);
  if (!healthResponse.ok()) {
    const databaseMessage = isJsonObject(healthJson)
      ? isJsonObject(healthJson.data) && isJsonObject(healthJson.data.database)
        ? healthJson.data.database.message
        : healthJson.message
      : null;
    return {
      status: "blocked",
      message: formatBlocker(
        `API health check returned ${healthResponse.status()} at ${healthUrl}. ${
          typeof databaseMessage === "string" ? databaseMessage : "Database/bootstrap readiness is not confirmed."
        }`
      )
    };
  }

  const queryUrl = `${API_BASE_URL}/api/query/execute`;
  let queryResponse;

  try {
    queryResponse = await apiRequest.post(queryUrl, {
      timeout: 10000,
      data: {
        sql: M2_TARGET_SQL,
        caseMilestoneEvaluation: {
          caseId: "case-001",
          milestoneId: "case-001-report-interviews-located",
          isSkeletonGateEnabled: true
        }
      }
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "request failed";
    return {
      status: "blocked",
      message: formatBlocker(`Query execution unavailable at ${queryUrl}. ${detail}`)
    };
  }

  const queryJson = await getResponseJson(queryResponse);
  if (!queryResponse.ok() || !isJsonObject(queryJson) || queryJson.success !== true) {
    return {
      status: "blocked",
      message: formatBlocker(
        `Case 001 fixture query did not execute cleanly. HTTP ${queryResponse.status()}; response message: ${
          isJsonObject(queryJson) && typeof queryJson.message === "string"
            ? queryJson.message
            : "none"
        }`
      )
    };
  }

  const evaluation = queryJson.caseMilestoneEvaluation;
  if (!isJsonObject(evaluation)) {
    return {
      status: "blocked",
      message: formatBlocker(
        "Case 001 milestone metadata was not returned for the fixture query. Restart the local API from current source and rerun; if it still reproduces, the query route is dropping the caseMilestoneEvaluation transport."
      )
    };
  }

  if (evaluation.matched !== true) {
    return {
      status: "blocked",
      message: formatBlocker(
        "Case 001 public clocktower InterviewLog fixture was not detected by the milestone validator. Apply pending database migrations or rebuild the local database from the current base scripts, then rerun."
      )
    };
  }

  if (evaluation.milestoneAdvanced !== false) {
    return {
      status: "blocked",
      message: formatBlocker(
        "Case 001 milestone evaluation advanced progress; this smoke expects non-progressing metadata only."
      )
    };
  }

  return { status: "ready" };
}

test.describe("Case 001 released live-stack smoke", () => {
  test("enters the released shared shell and completes the foundation-to-interviews SQL path with non-progressing feedback", async ({
    page
  }) => {
    test.skip(
      process.env[CASE_001_LIVE_SMOKE_ENV] !== "1",
      `Set ${CASE_001_LIVE_SMOKE_ENV}=1 to run the opt-in Case 001 live-stack smoke.`
    );


    const apiRequest = await playwrightRequest.newContext();
    const preflight = await classifyLiveStackReadiness(apiRequest);
    await apiRequest.dispose();

    if (preflight.status === "blocked") {
      test.info().annotations.push({
        type: "WP-274 blocker",
        description: preflight.message
      });
      console.warn(preflight.message);
      throw new Error(preflight.message);
    }

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sequel Detective" })).toBeVisible();
    await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).click();
    await expect(
      page.getByRole("heading", { name: "Case 001: The Clocktower Poisoning" })
    ).toBeVisible();
    await expect(page.getByRole("status")).toContainText("New attempt");
    await expect(page.getByRole("status")).toContainText("No saved attempt exists on this browser yet.");
    await expect(page.getByRole("button", { name: "Start Fresh" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open Case File" })).toBeEnabled();
    await page.getByRole("button", { name: "Open Case File" }).click();

    await expect(page.getByText("Case 001 Briefing")).toBeVisible();
    await expect(page.getByRole("button", { name: "Query Lab" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Evidence Board" })).toBeVisible();
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Case Library", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await menu.click();
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Reset Progress", exact: true }).click();
    await expect(page.getByText("Case 001 Briefing", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText(
      "Determine who committed the crime"
    );
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText(
      "Run SELECT * FROM CrimeType; first"
    );
    await expect(page.getByText("Development skeleton")).toHaveCount(0);

    await page.getByRole("button", { name: "Query Lab" }).click();

    await expect(page.getByRole("heading", { name: "Query Runner" })).toBeVisible();
    await expect(page.getByLabel("Clocktower Evidence Path")).toBeVisible();
    await expect(page.getByLabel("SQL query input")).toHaveValue(EXPLORATORY_STARTER_SQL);
    await expect(page.getByText("What to prove")).toBeVisible();
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText(
      "Prove which CrimeID identifies the case's recorded crime type"
    );
    await expect(page.getByLabel("SQL query input")).not.toHaveValue(M1_TARGET_SQL);
    for (const [sql, success] of [
      ["SELECT * FROM CrimeType WHERE CrimeID = -1;", true],
      ["SELECT NotARealColumn FROM CrimeType;", false]
    ] as const) {
      await page.getByLabel("SQL query input").fill(sql);
      const response = page.waitForResponse(response => response.url().includes("/api/query/execute"));
      await page.getByRole("button", { name: "Run Query", exact: true }).click();
      const body = await (await response).json();
      expect(body.success).toBe(success);
      if (success) expect(body.caseMilestoneEvaluation.matched).toBe(false);
      await expect(page.getByLabel("Samuel Tupleton Mentor")).not.toContainText("Released evidence review complete.");
    }
    await page.getByLabel("SQL query input").fill(M0_TARGET_SQL);

    const foundationResponsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/query/execute") && response.status() === 200
    );
    await page.getByRole("button", { name: "Run Query" }).click();
    const foundationQueryResponse = await foundationResponsePromise;
    const foundationResponseBody = await foundationQueryResponse.json();

    expect(foundationResponseBody.caseMilestoneEvaluation).toMatchObject({
      caseId: "case-001",
      milestoneId: "case-001-crime-type-identified",
      matched: true,
      runtimeStatus: "evaluated-no-progression",
      milestoneAdvanced: false
    });
    await expect(page.getByText(/CrimeID 1080 identifies Murder/i)).toBeVisible();
    await expect(page.getByLabel("SQL query input")).toHaveValue(EXPLORATORY_STARTER_SQL.replace("CrimeType", "CrimeSceneReport"));
    await expect(page.getByLabel("Clocktower Evidence Path")).toContainText("CrimeID 1080");

    const intermediateReportSql = "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;";
    await page.getByLabel("SQL query input").fill(intermediateReportSql);
    const intermediateResponsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/query/execute") && response.status() === 200
    );
    await page.getByRole("button", { name: "Run Query" }).click();
    const intermediateResponse = await intermediateResponsePromise;
    const intermediateResponseBody = await intermediateResponse.json();
    expect(intermediateResponseBody.caseMilestoneEvaluation).toMatchObject({
      caseId: "case-001",
      milestoneId: "case-001-clocktower-report-located",
      matched: false,
      runtimeStatus: "evaluated-no-progression",
      milestoneAdvanced: false
    });
    await expect(page.getByLabel("SQL query input")).toHaveValue(intermediateReportSql);
    await expect(page.getByLabel("SQL query input")).not.toHaveValue("SELECT * FROM InterviewLog;");
    await expect(page.getByText(/CrimeSceneReport rows remain/i)).toBeVisible();

    await page.getByLabel("SQL query input").fill(M1_TARGET_SQL);

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/query/execute") && response.status() === 200
    );
    await page.getByRole("button", { name: "Run Query" }).click();
    const queryResponse = await responsePromise;
    const responseBody = await queryResponse.json();

    expect(responseBody.caseMilestoneEvaluation).toMatchObject({
      caseId: "case-001",
      milestoneId: "case-001-clocktower-report-located",
      matched: true,
      runtimeStatus: "evaluated-no-progression",
      milestoneAdvanced: false
    });
    await expect(page.getByText(/The clocktower report is in this result set/i)).toBeVisible();
    await expect(page.getByLabel("SQL query input")).toHaveValue("SELECT * FROM InterviewLog;");
    await expect(page.getByLabel("SQL query input")).not.toHaveValue(M2_TARGET_SQL);
    await expect(page.getByLabel("Clocktower Evidence Path")).toContainText("ReportID");
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText("Nice work finding the clocktower report");
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText(
      "find interviews linked to the clocktower incident report"
    );
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText(/Public clocktower ceremony report/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Log row 1 as evidence/i })).toBeVisible();
    await page.getByRole("button", { name: /Log row 1 as evidence/i }).click();
    await expect(page.getByRole("button", { name: "Test Theory" })).toHaveCount(0);
    await expect(page.getByText(/matchedRowCount/i)).toHaveCount(0);
    await expect(page.getByText(/milestoneAdvanced/i)).toHaveCount(0);

    const reportId = responseBody.data.rows[0].values.ReportID;
    expect(String(reportId)).toMatch(/^\d+$/);
    await expect.poll(async () =>
      page.evaluate(() => window.localStorage.getItem("sequel-city.case-001.student-state.v1") ?? "")
    ).toContain("case-001-clocktower-report-located");
    await page.reload();
    await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" })
      .or(page.getByRole("button", { name: "Query Lab", exact: true }))
      .waitFor();
    if (await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).isVisible()) {
      await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).click();
      await expect(page.getByRole("status")).toContainText("Saved attempt found");
      await expect(page.getByRole("status")).toContainText("Progress: 2 of 3 clues logged.");
      await expect(page.getByRole("button", { name: "Resume Case File" })).toBeEnabled();
      await expect(page.getByRole("button", { name: "Start Fresh" })).toBeEnabled();
      await page.getByRole("button", { name: /^(Open|Resume) Case File$/ }).click();
    }
    await expect(page.getByRole("button", { name: "Query Lab", exact: true })).toBeVisible();
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText(
      "resuming with the report search already saved"
    );
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText(/Public clocktower ceremony report/i)).toBeVisible();

    const learnerM2Sql = `SELECT PersonID, ReportID, LogTranscript FROM InterviewLog WHERE ReportID = ${reportId} ORDER BY PersonID;`;
    await page.getByLabel("SQL query input").fill(learnerM2Sql);
    const interviewResponsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/query/execute") && response.status() === 200
    );
    await page.getByRole("button", { name: "Run Query" }).click();
    const interviewQueryResponse = await interviewResponsePromise;
    const interviewResponseBody = await interviewQueryResponse.json();

    expect(interviewResponseBody.caseMilestoneEvaluation).toMatchObject({
      caseId: "case-001",
      milestoneId: "case-001-report-interviews-located",
      matched: true,
      runtimeStatus: "evaluated-no-progression",
      milestoneAdvanced: false
    });
    await expect(page.getByText(/Report-linked interviews located/i)).toBeVisible();
    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText("Released evidence review complete.");
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByText(/clocktower/i).first()).toBeVisible();
    await expect(page.getByLabel("SQL query input")).toHaveValue(learnerM2Sql);
    await expect(page.getByLabel("SQL query input")).not.toHaveValue("SELECT * FROM PersonsOfInterest;");
    await expect(page.getByText(/matchedRowCount/i)).toHaveCount(0);
    await expect(page.getByText(/milestoneAdvanced/i)).toHaveCount(0);

    await expect(page.getByLabel("Samuel Tupleton Mentor")).toContainText("Released evidence review complete.");
    await expect(page.getByLabel("Clocktower Evidence Path")).not.toContainText("First finish narrowing");
    await page.getByRole("button", { name: /Log row 1 as evidence/i }).click();
    const interviewPersonId = interviewResponseBody.data.rows[0].values.PersonID;
    await page.getByRole("button", { name: "Evidence Board", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Evidence Notebook" })).toBeVisible();
    await expect(page.getByText("Completed milestones: 3 / 3")).toBeVisible();
    await expect(page.getByLabel("Completed Evidence Review")).toContainText("Released evidence review complete.");
    await expect(page.getByText("Follow Samuel's current instruction.", { exact: true })).toHaveCount(0);
    await expect(
      page.getByRole("listitem").filter({ hasText: "Clocktower incident report located" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("listitem").filter({ hasText: "Report-linked interviews located" }).first()
    ).toBeVisible();

    const case001StorageKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.includes("case-001"))
    );
    expect(case001StorageKeys).toEqual(["sequel-city.case-001.student-state.v1"]);
    await page.evaluate(() => { localStorage.setItem("wp274-unrelated", "keep"); localStorage.setItem("sequel-city.case-004.student-state.v1", "case004-sentinel"); });
    await page.reload();
    // Wait for the shell before inspecting entry state, then await restored content.
    await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" })
      .or(page.getByRole("button", { name: "Evidence Board", exact: true })).waitFor();
    if (await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).isVisible()) {
      await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).click();
      await page.getByRole("button", { name: /^(Open|Resume) Case File$/ }).click();
    }
    await expect(page.getByRole("heading", { name: "Evidence Notebook", exact: true })).toBeVisible();
    await expect(page.getByText("Completed milestones: 3 / 3")).toBeVisible();
    await expect(page.getByLabel("Completed Evidence Review")).toBeVisible();
    await expect(page.getByText(`ReportID: ${reportId}`, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(`PersonID: ${interviewPersonId}`, { exact: false }).first()).toBeVisible();
    await page.getByRole("button", { name: "Samuel's Briefing", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Released evidence review complete.", exact: true }).first()).toBeVisible();
    await expect(page.getByLabel("Samuel Tupleton Mentor")).not.toContainText("First finish narrowing");
    await menu.click();
    page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Reset Progress" }).click();
    await expect(page.getByText("Case 001 Briefing", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Evidence Board", exact: true }).click();
    await expect(page.getByText("Completed milestones: 0 / 3")).toBeVisible();
    await expect(page.getByLabel("Completed Evidence Review")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("wp274-unrelated"))).toBe("keep");
    expect(await page.evaluate(() => localStorage.getItem("sequel-city.case-004.student-state.v1"))).toBe("case004-sentinel");
  });
});
