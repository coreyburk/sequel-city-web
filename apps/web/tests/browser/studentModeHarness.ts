import { expect, type Locator, type Page } from "@playwright/test";

export async function openStudentMode(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.locator("header.app-header h1")).toHaveText("Sequel Detective");
  await expect(page.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  const caseEntryButton = page.getByRole("button", { name: "Open Case 004" });
  if ((await caseEntryButton.count()) > 0) {
    await expect(
      page.getByRole("heading", { name: "Start with the case, not the noise" })
    ).toBeVisible();
    await caseEntryButton.click();
  }
  await expect(page.getByRole("button", { name: "Samuel's Briefing" })).toBeVisible();
}

export async function goToQueryLab(page: Page): Promise<void> {
  const tab = page.getByRole("button", { name: "Query Lab" });
  try {
    const attr = await tab.getAttribute("aria-current");
    if (attr !== "page") {
      await tab.click();
    }
  } catch {
    // Attribute access or click may fail if the tab is transiently disabled/removed.
    // Attempt a best-effort click and proceed; tests should assert state after navigation.
    try {
      await tab.click();
    } catch {
      // ignore click failures — the calling test will assert the expected state
    }
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
  // Start a background wait for the server response to the query execution.
  // This helps avoid races where the UI still shows "Running..." but the request has completed.
  const responsePromise = page
    .waitForResponse((resp) => resp.url().includes("/api/query/execute") && resp.status() === 200, {
      timeout: 15000,
    })
    .catch(() => null);

  await page.getByRole("button", { name: /Run Query|Running\.{3}/ }).click();

  // Wait for either the rows summary to appear, the Run Query button to become enabled,
  // or for the /api/query/execute response to arrive. Give a longer overall timeout.
  const deadline = Date.now() + 15000;
  const rowsLocator = page.getByText(/Rows returned:/);
  const testMarker = page.locator('[data-test-query-complete]');
  const runBtn = page.getByRole("button", { name: /Run Query|Running\.{3}/ });

  while (Date.now() < deadline) {
    try {
      if ((await rowsLocator.count()) > 0) return;
      if ((await testMarker.count()) > 0) return;
    } catch {
      // ignore intermittent errors
    }
    try {
      if (await runBtn.isEnabled()) return;
    } catch {
      // ignore — locator may not match transient state
    }

    // If the network response resolved, allow a short grace for the UI to render rows.
    if (responsePromise && (await Promise.race([responsePromise.then(() => true), Promise.resolve(false)]))) {
      // give the UI a brief moment after the response
      try {
        await rowsLocator.waitFor({ timeout: 1200 });
        return;
      } catch {
        // if rows still didn't appear, proceed to the next loop iteration until deadline
      }
    }

    await page.waitForTimeout(200);
  }

  // timed out waiting for result; proceed and let caller handle missing rows
  return;
}

export async function logClueRow(page: Page, rowNumber: number): Promise<void> {
  // The UI labels buttons with "+ Log Clue" rather than "Log row N as evidence".
  // Find the visible Log Clue buttons (by text) and click the one matching the requested row index.
    const rows = page.locator('table tbody tr');
    const idx = Math.max(0, rowNumber - 1);
    // Allow a longer wait for the UI to render per-row controls in slower environments.
    const deadline = Date.now() + 5000;
    let available = await rows.count();
    while (available <= idx && Date.now() < deadline) {
      await page.waitForTimeout(200);
      available = await rows.count();
    }
    if (available <= idx) {
      throw new Error(`Expected at least ${idx + 1} table rows, found ${available}`);
    }
    const row = rows.nth(idx);
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    // If the app exposes a test-only completion marker, wait briefly for it so overlays can render.
    try {
      const testMarker = page.locator('[data-test-query-complete]');
      if ((await testMarker.count()) > 0) {
        await testMarker.first().waitFor({ timeout: 1200 }).catch(() => null);
      }
    } catch {
      // ignore
    }
    // The Log Clue action is sometimes rendered in a sticky overlay outside the row.
    // Prefer test-only attribute when present for deterministic selection in CI.
    const testSelector = `[data-test-log-clue-index="${rowNumber}"]`;
    const perRowTestBtn = row.locator(testSelector);
    let perRowTestCount = await perRowTestBtn.count();
    if (perRowTestCount === 0) {
      // Also attempt to find it anywhere on the page (sticky overlays may render outside the row)
      const pageLevelTestBtn = page.locator(testSelector);
      perRowTestCount = await pageLevelTestBtn.count();
      if (perRowTestCount > 0) {
        await pageLevelTestBtn.first().click({ force: true });
        return;
      }
    } else {
      await perRowTestBtn.first().click({ force: true });
      return;
    }

    // The Log Clue action is sometimes rendered in a sticky overlay outside the row.
    const btn = row.locator('button:has-text("Log Clue")');
    // Wait for the per-row button to appear up to the deadline.
    let btnCount = await btn.count();
    while (btnCount === 0 && Date.now() < deadline) {
      await page.waitForTimeout(200);
      btnCount = await btn.count();
    }
    if (btnCount > 0) {
      await btn.first().click({ force: true });
      return;
    }

    // Fallback: try any Log Clue button on the page and click it forcibly
    const globalBtns = page.locator('button:has-text("Log Clue")');
    const deadline2 = Date.now() + 1500;
    let gcount = await globalBtns.count();
    while (gcount === 0 && Date.now() < deadline2) {
      await page.waitForTimeout(150);
      gcount = await globalBtns.count();
    }
    if (gcount === 0) {
      // As a last-resort fallback try to find any log-clue action by attribute and click the nth one.
      const actionBtns = page.locator('[data-student-action="log-clue"]');
      const actionCount = await actionBtns.count();
      if (actionCount > idx) {
        await actionBtns.nth(idx).click({ force: true });
        return;
      }

      // Try moving the mouse to the row center to trigger overlays that don't appear on hover.
      try {
        const box = await row.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.waitForTimeout(200);
          const globalBtns2 = page.locator('button:has-text("Log Clue")');
          if ((await globalBtns2.count()) > 0) {
            await globalBtns2.first().click({ force: true });
            return;
          }
        }
      } catch {
        // ignore
      }

      throw new Error("No Log Clue button appeared after hovering the row");
    }
    await globalBtns.first().click({ force: true });
}

export async function logClueForRowContaining(page: Page, text: string): Promise<void> {
  const row = page.locator("table tbody tr").filter({ hasText: text }).first();
  await expect(row).toBeVisible();
  await row.scrollIntoViewIfNeeded();
  await row.hover();

  const testButton = row.locator('[data-student-action="log-clue"]');
  if ((await testButton.count()) > 0) {
    await testButton.first().click({ force: true });
    return;
  }

  const button = row.locator('button:has-text("Log Clue")');
  await expect(button.first()).toBeVisible();
  await button.first().click({ force: true });
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
