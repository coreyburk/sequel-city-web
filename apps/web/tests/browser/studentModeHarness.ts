import { expect, type Locator, type Page } from "@playwright/test";

export async function openApplicationMenu(page: Page): Promise<void> {
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.getAttribute("aria-expanded") !== "true") await menu.click();
}

export async function openStudentMode(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sequel Detective" })).toBeVisible();
  await openApplicationMenu(page);
  await expect(page.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const caseEntryButton = page.getByRole("button", {
    name: "Select Case 004: The SQL City Murder"
  });
  if ((await caseEntryButton.count()) > 0) {
    await expect(
      page.getByRole("heading", { name: "I'm Samuel Tupleton." })
    ).toBeVisible();
    await caseEntryButton.click();
    await expect(
      page.getByRole("heading", { name: "Case 004: The SQL City Murder" })
    ).toBeVisible();
    const open = page.getByRole("button", { name: "Open Case File", exact: true });
    await expect(open).toBeEnabled({ timeout: 15000 });
    await open.click();
  }
  await expect(page.getByRole("button", { name: "Samuel's Briefing" })).toBeVisible();
}

export async function goToQueryLab(page: Page): Promise<void> {
  const tab = page.getByRole("button", { name: "Query Lab", exact: true });
  await tab.click(); await expect(tab).toHaveAttribute("aria-current", "page");
}
export async function goToEvidenceBoard(page: Page): Promise<void> {
  const tab = page.getByRole("button", { name: "Evidence Board", exact: true });
  await tab.click(); await expect(tab).toHaveAttribute("aria-current", "page");
}
export async function runQuery(page: Page, sql?: string): Promise<void> {
  const input = page.getByLabel("SQL Query", { exact: true });
  if (sql !== undefined) {
    await input.fill(sql);
  }
  const response = page.waitForResponse(resp => resp.url().includes("/api/attempts/") && resp.url().endsWith("/query") && resp.status() === 200, { timeout: 15000 });
  await page.getByRole("button", { name: "Run Query", exact: true }).click();
  await response;
  await expect(page.getByRole("button", { name: "Run Query", exact: true })).toBeEnabled();
  await expect(page.getByText(/Rows returned:/)).toBeVisible();
}
export async function logClueRow(page: Page, rowNumber: number): Promise<void> {
  const response = page.waitForResponse(r => r.url().includes("/api/attempts/") && r.url().endsWith("/evidence"));
  await page.getByRole("button", { name: `Log row ${rowNumber} as evidence`, exact: true }).click();
  const result = await response; expect(result.status(), await result.text()).toBe(200);
}
export async function logClueForRowContaining(page: Page, text: string): Promise<void> {
  const row = page.locator(".query-results__table tbody tr").filter({ hasText: text }).first();
  await expect(row).toBeVisible();
  const response = page.waitForResponse(r => r.url().includes("/api/attempts/") && r.url().endsWith("/evidence"));
  await row.getByRole("button", { name: /Log row \d+ as evidence/ }).click();
  const result = await response; expect(result.status(), await result.text()).toBe(200);
}
export async function openCaseFile(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Case File" }).click();
  await expect(page.getByRole("heading", { name: "Pinned Facts" })).toBeVisible();
}

export async function closeCaseFile(page: Page): Promise<void> {
  const closeButton = page.getByRole("button", { name: "Close Case File" });
  if ((await closeButton.count()) > 0 && (await closeButton.first().isVisible())) {
    await closeButton.first().click();
  } else {
    await page.getByRole("heading", { name: "Query Runner" }).click();
  }
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
  await logClueForRowContaining(page, "three times last December");
  await expect(page.getByLabel("Clue deferred")).toContainText(
    /does not prove the current suspect step/i
  );
  await expect(
    page
      .locator("table tbody tr")
      .filter({ hasText: "three times last December" })
      .first()
      .locator('[data-student-action="log-clue"]')
  ).toContainText(
    /Not Needed Yet/i
  );
  await logClueForRowContaining(page, "I delivered the hit after the contract came through");

  await goToEvidenceBoard(page);
  await page.getByRole("radio", { name: "Jeremy Bowers" }).click();
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
