import { expect, request as playwrightRequest, test, type APIRequestContext } from "@playwright/test";

const CASE_001_LIVE_SMOKE_ENV = "CASE_001_LIVE_SMOKE";
const CASE_001_GATE_ENV = "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON";
const CASE_001_GATE_VALUE = "true";
const API_BASE_URL = process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3001";
const STARTER_SQL =
  "SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080;";

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
  return `WP-254 live smoke blocker: ${message}`;
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
        sql: STARTER_SQL,
        caseMilestoneEvaluation: {
          caseId: "case-001",
          milestoneId: "case-001-clocktower-report-located",
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
        "Case 001 public clocktower CrimeSceneReport fixture was not detected by the milestone validator."
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

test.describe("Case 001 gated live-stack smoke", () => {
  test("enters the gated skeleton and displays first SQL feedback without progression", async ({
    page
  }) => {
    test.skip(
      process.env[CASE_001_LIVE_SMOKE_ENV] !== "1",
      `Set ${CASE_001_LIVE_SMOKE_ENV}=1 to run the opt-in Case 001 live-stack smoke.`
    );
    test.skip(
      process.env[CASE_001_GATE_ENV] !== CASE_001_GATE_VALUE,
      `Set ${CASE_001_GATE_ENV}=${CASE_001_GATE_VALUE} for the gated Case 001 skeleton smoke.`
    );

    const apiRequest = await playwrightRequest.newContext();
    const preflight = await classifyLiveStackReadiness(apiRequest);
    await apiRequest.dispose();

    if (preflight.status === "blocked") {
      test.info().annotations.push({
        type: "WP-254 blocker",
        description: preflight.message
      });
      console.warn(preflight.message);
      test.skip(true, preflight.message);
    }

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sequel Detective" })).toBeVisible();
    await page.getByRole("button", { name: "Select Case 001: The Clocktower Poisoning" }).click();
    await expect(
      page.getByRole("heading", { name: "Case 001: The Clocktower Poisoning" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Open Case File" })).toBeEnabled();
    await page.getByRole("button", { name: "Open Case File" }).click();

    await expect(
      page.getByRole("heading", { name: "First SQL Evidence Check" })
    ).toBeVisible();
    await expect(page.getByLabel("Report query")).toHaveValue(STARTER_SQL);

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/query/execute") && response.status() === 200
    );
    await page.getByRole("button", { name: "Check Report Query" }).click();
    const queryResponse = await responsePromise;
    const responseBody = await queryResponse.json();

    expect(responseBody.caseMilestoneEvaluation).toMatchObject({
      caseId: "case-001",
      milestoneId: "case-001-clocktower-report-located",
      matched: true,
      runtimeStatus: "evaluated-no-progression",
      milestoneAdvanced: false
    });
    await expect(page.getByText(/Public report located/i)).toBeVisible();
    await expect(page.getByRole("table")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Query Lab" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Evidence Board" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Test Theory" })).toHaveCount(0);
    await expect(page.getByText(/matchedRowCount/i)).toHaveCount(0);
    await expect(page.getByText(/milestoneAdvanced/i)).toHaveCount(0);

    const case001StorageKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.includes("case-001"))
    );
    expect(case001StorageKeys).toEqual([]);
  });
});
