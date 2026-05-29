import { expect, test } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
import {
  buildFullMastermindProfile,
  closeCaseFile,
  getSceneImage,
  goToEvidenceBoard,
  goToQueryLab,
  openCaseFile,
  openStudentMode,
  runQuery,
  solveThroughTriggerCheck,
  logClueRow
} from "./studentModeHarness";

test.beforeEach(async ({ page }) => {
  await installStudentModeApiMocks(page);
});

test("keeps the scene stable while drafting, renders compact single-value facts, and closes Case File on outside click", async ({
  page
}) => {
  await openStudentMode(page);
  await goToQueryLab(page);

  const sceneImage = getSceneImage(page);
  const initialSceneSrc = await sceneImage.getAttribute("src");

  await page.getByLabel("SQL query input").fill("SELECT * FROM CrimeType WHERE");
  await expect(sceneImage).toHaveAttribute("src", initialSceneSrc ?? "");

  await runQuery(page, "SELECT * FROM CrimeType");
  await logClueRow(page, 1);

  await expect(
    page.getByText(/Good\. CrimeID 1080 is locked in\. Stay in Query Lab and inspect the report archive next/i)
  ).toBeVisible();
  await expect(sceneImage).not.toHaveAttribute("src", initialSceneSrc ?? "");

  await openCaseFile(page);
  await expect(page.getByText("CrimeID = 1080")).toBeVisible();
  const crimeIdFact = page.getByRole("button", {
    name: "Add CrimeID = 1080 to query editor"
  });
  await expect(crimeIdFact.getByText("CrimeID = 1080")).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Add CrimeID from CrimeID = 1080 to query editor"
    })
  ).toHaveCount(0);

  await crimeIdFact.click();
  await expect(page.getByLabel("SQL query input")).toHaveValue(/CrimeID = 1080/);
  await page.getByRole("heading", { name: "Query Runner" }).click();
  await expect(page.getByRole("heading", { name: "Pinned Facts" })).toHaveCount(0);
});

test("lets students log multiple mastermind transcript clues without rerunning the transcript query", async ({
  page
}) => {
  await openStudentMode(page);
  await solveThroughTriggerCheck(page);

  await goToQueryLab(page);
  await runQuery(page, "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975");
  await expect(page.getByText("Rows returned: 6")).toBeVisible();

  await logClueRow(page, 1);
  await expect(page.getByRole("button", { name: "Query Lab" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(page.getByText(/Mastermind clue logged\./i)).toBeVisible();
  await expect(
    page.getByText(/Keep this transcript open and keep logging any row that adds a new clue thread\./i)
  ).toBeVisible();
  await expect(page.getByText("Rows returned: 6")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log row 2 as evidence" })).toBeVisible();

  await logClueRow(page, 2);
  await expect(page.getByText(/You now have 2 transcript clues pinned/i)).toBeVisible();
  await expect(page.getByLabel("SQL query input")).toHaveValue(
    "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975"
  );
});

test("walks the shortlist into identity and event-trail guidance in a real browser", async ({
  page
}) => {
  await openStudentMode(page);
  await buildFullMastermindProfile(page);

  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM DriversLicense WHERE CarMake = 'BMW' AND CarModel = 'M8' AND Gender = 'female' AND HairColor = 'red' AND Height BETWEEN 65 AND 67"
  );
  await logClueRow(page, 1);
  await goToQueryLab(page);
  await expect(page.getByText("Rows returned: 2")).toBeVisible();
  await logClueRow(page, 2);

  await goToEvidenceBoard(page);
  await page.getByRole("button", { name: "Page 2" }).click();
  await expect(
    page.getByText(
      /Mastermind shortlist pinned: 2 candidates\. Use the candidate LicenseIDs to identify both women/i
    )
  ).toBeVisible();

  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298 OR LicenseID = 857212"
  );
  await logClueRow(page, 1);
  await goToQueryLab(page);
  await runQuery(
    page,
    "SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298 OR LicenseID = 857212"
  );
  await expect(page.getByText("Rows returned: 2")).toBeVisible();
  await logClueRow(page, 2);
  await expect(
    page.locator(".student-case-header__message").getByText(
      /Follow the killer's clue trail into EventSchedule next: three meetings last December, next to Symphony Hall, dressed up like date night\./i
    )
  ).toBeVisible();

  await goToQueryLab(page);
  await openCaseFile(page);
  await expect(
    page.getByRole("button", {
      name: /Add Mastermind Clue: the killer met the woman who hired him three times last December to query editor/i
    })
  ).toBeVisible();
  await closeCaseFile(page);

  await runQuery(
    page,
    "SELECT * FROM EventSchedule WHERE EventDate LIKE '2023-12%' AND EventName = 'Symphony Hall'"
  );
  await expect(
    page.getByText(
      "Good. You found the event row that fits the killer's meeting clue. Use its EventID in EventRegistration with both returned PersonIDs next."
    )
  ).toBeVisible();
});
