import { expect, test, type Locator, type Page } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
import {
  logClueForRowContaining,
  logClueRow
} from "./studentModeHarness";

const STEP_MS = readDelay("DEMO_STEP_MS", 1800);
const SHORT_STEP_MS = readDelay("DEMO_SHORT_STEP_MS", 900);
const FINAL_HOLD_MS = readDelay("DEMO_FINAL_HOLD_MS", 120_000);
const TYPE_DELAY_MS = readDelay("DEMO_TYPE_DELAY_MS", 18);
const CURSOR_MOVE_MS = readDelay("DEMO_CURSOR_MOVE_MS", 420);

function readDelay(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

async function pause(label: string, page: Page, ms = STEP_MS): Promise<void> {
  console.log(`[demo] ${label}`);
  await page.waitForTimeout(ms);
}

async function installDemoCursor(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      #demo-recording-cursor {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        width: 26px;
        height: 26px;
        border: 2px solid #fff1b8;
        border-radius: 999px;
        background: rgba(164, 68, 55, 0.72);
        box-shadow:
          0 0 0 4px rgba(164, 68, 55, 0.2),
          0 0 18px rgba(255, 230, 154, 0.72);
        pointer-events: none;
        transform: translate3d(28px, 28px, 0);
        transition: transform ${CURSOR_MOVE_MS}ms ease-out, box-shadow 160ms ease-out, background 160ms ease-out;
      }

      #demo-recording-cursor::after {
        content: "";
        position: absolute;
        left: 9px;
        top: 9px;
        width: 4px;
        height: 4px;
        border-radius: 999px;
        background: #fff8d6;
      }

      #demo-recording-cursor.demo-recording-cursor--click {
        background: rgba(210, 150, 58, 0.9);
        box-shadow:
          0 0 0 10px rgba(210, 150, 58, 0.24),
          0 0 26px rgba(255, 230, 154, 0.9);
      }
    `
  });
  await page.evaluate(() => {
    document.getElementById("demo-recording-cursor")?.remove();
    const cursor = document.createElement("div");
    cursor.id = "demo-recording-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
  });
}

async function moveCursorToLocator(page: Page, locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) {
    return;
  }

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.evaluate(
    ({ nextX, nextY }) => {
      const cursor = document.getElementById("demo-recording-cursor");
      if (cursor) {
        cursor.style.transform = `translate3d(${nextX - 13}px, ${nextY - 13}px, 0)`;
      }
    },
    { nextX: x, nextY: y }
  );
  await page.mouse.move(x, y, { steps: 16 });
  await page.waitForTimeout(CURSOR_MOVE_MS);
}

async function pulseCursor(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.getElementById("demo-recording-cursor")?.classList.add("demo-recording-cursor--click");
  });
  await page.waitForTimeout(170);
  await page.evaluate(() => {
    document.getElementById("demo-recording-cursor")?.classList.remove("demo-recording-cursor--click");
  });
}

async function clickWithCursor(page: Page, locator: Locator): Promise<void> {
  await moveCursorToLocator(page, locator);
  await pulseCursor(page);
  await locator.click();
}

async function clickAndPause(
  label: string,
  page: Page,
  target: Locator | (() => Promise<unknown>),
  ms = STEP_MS
): Promise<void> {
  if (typeof target === "function") {
    await target();
  } else {
    await clickWithCursor(page, target);
  }
  await pause(label, page, ms);
}

async function goToTabWithCursor(page: Page, tabName: "Query Lab" | "Evidence Board"): Promise<void> {
  const tab = page.getByRole("button", { name: tabName });
  if ((await tab.getAttribute("aria-current")) !== "page") {
    await clickWithCursor(page, tab);
  }
  await expect(tab).toHaveAttribute("aria-current", "page");
}

async function typeSql(page: Page, sql: string): Promise<void> {
  const input = page.getByLabel("SQL query input");
  await moveCursorToLocator(page, input);
  await pulseCursor(page);
  await input.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(sql, { delay: TYPE_DELAY_MS });
}

async function runTypedQueryAndPause(page: Page, label: string, sql: string): Promise<void> {
  await typeSql(page, sql);
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/query/execute") && response.status() === 200,
    { timeout: 15_000 }
  );
  await clickWithCursor(page, page.getByRole("button", { name: /Run Query|Running\.{3}/ }));
  await responsePromise;
  await page.waitForTimeout(300);
  await pause(label, page);
}

async function logRowAndPause(page: Page, label: string, rowNumber: number): Promise<void> {
  const row = page.locator("table tbody tr").nth(Math.max(0, rowNumber - 1));
  const action = row.locator('[data-student-action="log-clue"]').first();
  if ((await action.count()) > 0) {
    await moveCursorToLocator(page, action);
    await pulseCursor(page);
  }
  await logClueRow(page, rowNumber);
  await pause(label, page);
}

async function logRowContainingAndPause(page: Page, label: string, text: string): Promise<void> {
  const row = page.locator("table tbody tr").filter({ hasText: text }).first();
  const action = row.locator('[data-student-action="log-clue"]').first();
  if ((await action.count()) > 0) {
    await moveCursorToLocator(page, action);
    await pulseCursor(page);
  }
  await logClueForRowContaining(page, text);
  await pause(label, page);
}

test.beforeEach(async ({ page }) => {
  await installStudentModeApiMocks(page);
});

test("human-paced Case 004 full walkthrough for screen capture", async ({ page }) => {
  test.setTimeout(15 * 60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  page.setDefaultTimeout(15_000);

  await page.goto("/");
  await installDemoCursor(page);
  await pause("case library opened", page, 2500);

  await clickAndPause(
    "selected Case 004",
    page,
    page.getByRole("button", { name: "Select Case 004: The SQL City Murder" })
  );
  await clickAndPause(
    "opened live case file",
    page,
    page.getByRole("button", { name: "Open Case File" })
  );

  await goToTabWithCursor(page, "Query Lab");
  await pause("query lab ready", page);

  await runTypedQueryAndPause(page, "crime type query returned", "SELECT * FROM CrimeType");
  await logRowAndPause(page, "murder crime type logged", 1);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "crime scene report narrowed",
    "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'"
  );
  await logRowAndPause(page, "target report logged", 1);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "witness trail grouped by PersonID",
    "SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID"
  );
  await logRowAndPause(page, "first witness bundle logged", 1);
  await logRowAndPause(page, "second witness bundle logged", 5);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "witness names resolved",
    "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371"
  );
  await logRowAndPause(page, "Morty Schapiro pinned", 1);
  await logRowAndPause(page, "Annabel Miller pinned", 2);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "gym lead isolated",
    "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'"
  );
  await logRowAndPause(page, "gym lead logged", 1);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "gym lead identified in PersonsOfInterest",
    "SELECT * FROM PersonsOfInterest WHERE PersonID = 67318"
  );
  await logRowAndPause(page, "Jeremy Bowers identified", 1);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "Jeremy Bowers interview reviewed",
    "SELECT * FROM InterviewLog WHERE PersonID = 67318"
  );
  await logRowContainingAndPause(
    page,
    "hired killer interview clue logged",
    "I delivered the hit after the contract came through"
  );

  await goToTabWithCursor(page, "Evidence Board");
  await pause("first suspect theory ready", page);
  await clickAndPause("Jeremy Bowers selected", page, page.getByRole("radio", { name: "Jeremy Bowers" }), SHORT_STEP_MS);
  await clickAndPause("first suspect theory tested", page, page.getByRole("button", { name: "Test Theory" }));
  await expect(page.getByRole("heading", { name: "First Suspect Confirmed" })).toBeVisible();
  await pause("first suspect confirmed", page, 2500);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "mastermind transcript trail isolated",
    "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975"
  );
  for (const rowNumber of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await logRowAndPause(page, `mastermind transcript clue ${rowNumber} logged`, rowNumber);
  }
  await expect(page.getByText(/Mastermind profile complete: 10\/10 clue threads pinned\./i)).toBeVisible();
  await pause("full mastermind transcript profile pinned", page);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "red-haired BMW shortlist returned",
    "SELECT * FROM DriversLicense WHERE CarMake = 'BMW' AND CarModel = 'M8' AND Gender = 'female' AND HairColor = 'red' AND Height BETWEEN 65 AND 67"
  );
  await logRowAndPause(page, "Miranda license candidate logged", 1);
  await logRowAndPause(page, "Dani license candidate logged", 2);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "candidate identities resolved",
    "SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298 OR LicenseID = 857212"
  );
  await logRowAndPause(page, "Miranda identity logged", 1);
  await logRowAndPause(page, "Dani identity logged", 2);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "December Symphony events found",
    "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%'"
  );
  await logRowAndPause(page, "first Symphony event logged", 1);
  await logRowAndPause(page, "second Symphony event logged", 2);
  await logRowAndPause(page, "third Symphony event logged", 3);

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "EventRegistration keeps both candidates in play",
    "SELECT * FROM EventRegistration WHERE EventID IN (2669, 3005, 3257) AND EventPersonID IN (14307, 99716) ORDER BY EventID, EventPersonID"
  );

  await goToTabWithCursor(page, "Query Lab");
  await runTypedQueryAndPause(
    page,
    "Employment tie-break returned",
    "SELECT * FROM Employment WHERE SSN = 987756388 OR SSN = 362878596"
  );
  await logRowContainingAndPause(page, "Miranda Employment tie-break logged", "Urban Policy Advisor");

  await goToTabWithCursor(page, "Evidence Board");
  await pause("final mastermind theory ready", page);
  const mastermindChoice = page.getByRole("radio", { name: "Miranda Priestly" });
  await mastermindChoice.scrollIntoViewIfNeeded();
  await clickAndPause("Miranda Priestly selected", page, mastermindChoice, SHORT_STEP_MS);
  await clickAndPause("mastermind theory tested", page, page.getByRole("button", { name: "Test Theory" }));

  await expect(page.getByRole("dialog", { name: "Case 004 Closed" })).toBeVisible({
    timeout: 10_000
  });
  await pause("case-close splash is ready for screen capture", page, FINAL_HOLD_MS);
});
