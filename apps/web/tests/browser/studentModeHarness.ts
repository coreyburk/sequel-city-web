import { expect, type Locator, type Page } from "@playwright/test";

export async function openStudentMode(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sequel City Case Files" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
}

export async function goToQueryLab(page: Page): Promise<void> {
  const tab = page.getByRole("button", { name: "Query Lab" });
  if ((await tab.getAttribute("aria-current")) !== "page") {
    await tab.click();
  }
  await expect(tab).toHaveAttribute("aria-current", "page");
}

export async function goToEvidenceBoard(page: Page): Promise<void> {
  const tab = page.getByRole("button", { name: "Evidence Board" });
  if ((await tab.getAttribute("aria-current")) !== "page") {
    await tab.click();
  }
  await expect(tab).toHaveAttribute("aria-current", "page");
}

export async function runQuery(page: Page, sql?: string): Promise<void> {
  const input = page.getByLabel("SQL query input");
  if (sql !== undefined) {
    await input.fill(sql);
  }
  await page.getByRole("button", { name: "Run Query" }).click();
}

export async function logClueRow(page: Page, rowNumber: number): Promise<void> {
  await page.getByRole("button", { name: `Log row ${rowNumber} as evidence` }).click();
}

export async function openCaseFile(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Case File" }).click();
  await expect(page.getByRole("heading", { name: "Pinned Facts" })).toBeVisible();
}

export async function closeCaseFile(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Close Case File" }).click();
  await expect(page.getByRole("heading", { name: "Pinned Facts" })).toHaveCount(0);
}

export function getSceneImage(page: Page): Locator {
  return page.getByLabel("Noir Scene Visual").locator("img");
}

export async function solveThroughTriggerCheck(page: Page): Promise<void> {
  await goToQueryLab(page);
  await runQuery(page);
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'"
  );
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runQuery(page, "SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID");
  await logClueRow(page, 1);
  await goToQueryLab(page);
  await expect(page.getByText("Rows returned: 6")).toBeVisible();
  await logClueRow(page, 5);

  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371"
  );
  await logClueRow(page, 1);
  await logClueRow(page, 2);

  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'"
  );
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runQuery(page, "SELECT * FROM PersonsOfInterest WHERE PersonID = 67318");
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runQuery(page, "SELECT * FROM InterviewLog WHERE PersonID = 67318");
  await logClueRow(page, 1);

  await goToEvidenceBoard(page);
  await page.getByLabel("Student suspect full name").fill("Jeremy Bowers");
  await page.getByRole("button", { name: "Test Theory" }).click();
  await expect(
    page.getByRole("heading", { name: "First Suspect Confirmed" })
  ).toBeVisible();
}

export async function buildFullMastermindProfile(page: Page): Promise<void> {
  await solveThroughTriggerCheck(page);
  await goToQueryLab(page);
  await runQuery(page, "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975");
  for (const rowNumber of [1, 2, 3, 4, 5, 6]) {
    await logClueRow(page, rowNumber);
  }
  await expect(page.getByText(/Mastermind profile clues pinned: 10\/10\./i)).toBeVisible();
}
