import { expect, type Page } from "@playwright/test";
import { runQuery } from "./studentModeHarness";

export const DEFAULT_INCORRECT_ATTEMPT_FLOOR = 3;
export const EXTENDED_INCORRECT_ATTEMPT_COUNT = 5;
export const STRESS_INCORRECT_ATTEMPT_COUNT = 7;

type TheoryResponseBody = {
  data: {
    isCorrect: boolean;
    suspect: string;
    solvedRole: string | null;
  };
};

type QueryMistakeRunOptions = {
  correctSql: string;
  incorrectSql: string[];
  minimumIncorrectAttempts?: number;
  responseTimeoutMs?: number;
};

function assertIncorrectAttemptBudget(
  attempts: string[],
  minimumIncorrectAttempts: number,
  options: { requireDistinct: boolean }
): void {
  expect(attempts.length).toBeGreaterThanOrEqual(minimumIncorrectAttempts);
  if (options.requireDistinct) {
    expect(new Set(attempts).size).toBe(attempts.length);
  }
}

export async function runIncorrectQueriesBeforeCorrect(
  page: Page,
  {
    correctSql,
    incorrectSql,
    minimumIncorrectAttempts = DEFAULT_INCORRECT_ATTEMPT_FLOOR,
    responseTimeoutMs = 3_000
  }: QueryMistakeRunOptions
): Promise<void> {
  assertIncorrectAttemptBudget(incorrectSql, minimumIncorrectAttempts, { requireDistinct: true });

  for (const sql of incorrectSql) {
    const responsePromise = page
      .waitForResponse((response) => response.url().includes("/api/query/execute"), {
        timeout: responseTimeoutMs
      })
      .catch(() => null);

    await runQuery(page, sql);
    const response = await responsePromise;

    if (response) {
      expect(response.status()).toBe(400);
      await expect(page.getByText(/No browser-test fixture exists for query:/)).toBeVisible();
    }

    await expect(page.getByRole("button", { name: /Run Query/ })).toBeEnabled();
  }

  await runQuery(page, correctSql);
}

export async function submitTheoryChoice(
  page: Page,
  suspectName: string
): Promise<TheoryResponseBody> {
  const radio = page.getByRole("radio", { name: suspectName });
  if ((await radio.count()) > 0) {
    await radio.check();
  } else {
    await page.getByLabel("Student suspect full name").fill(suspectName);
  }

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/case/verify-suspect") && response.status() === 200,
    { timeout: 15_000 }
  );
  await page.getByRole("button", { name: "Test Theory" }).click();
  return (await responsePromise).json();
}

export async function submitIncorrectTheoryChoices(
  page: Page,
  suspectNames: string[],
  expectedUnconfirmedHeading: string | RegExp,
  afterEachAttempt?: () => Promise<void>
): Promise<void> {
  assertIncorrectAttemptBudget(suspectNames, DEFAULT_INCORRECT_ATTEMPT_FLOOR, {
    requireDistinct: false
  });

  for (const suspectName of suspectNames) {
    const body = await submitTheoryChoice(page, suspectName);
    expect(body.data.isCorrect).toBe(false);
    expect(body.data.solvedRole).toBeNull();
    await expect(page.getByRole("heading", { name: expectedUnconfirmedHeading })).toHaveCount(0);
    await afterEachAttempt?.();
  }
}

export async function clickWrongCheckInChoice(page: Page, label: RegExp): Promise<void> {
  const button = page.getByRole("button", { name: label });
  if ((await button.count()) === 0) {
    return;
  }

  await button.first().click();
  await expect(page.locator(".case-review__result--error")).toBeVisible();
}

export async function expectQueryDraftSurvivesNavigation(
  page: Page,
  draftSql: string,
  navigateAway: () => Promise<void>,
  returnToQueryLab: () => Promise<void>
): Promise<void> {
  await page.getByLabel("SQL query input").fill(draftSql);
  await navigateAway();
  await returnToQueryLab();
  await expect(page.getByLabel("SQL query input")).toHaveValue(draftSql);
}
