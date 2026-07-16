import { expect, test } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
import {
  clickWrongCheckInChoice,
  expectQueryDraftSurvivesNavigation,
  runIncorrectQueriesBeforeCorrect,
  submitIncorrectTheoryChoices,
  submitTheoryChoice
} from "./studentOutlierHarness";
import {
  goToEvidenceBoard,
  goToQueryLab,
  logClueForRowContaining,
  logClueRow,
  openStudentMode
} from "./studentModeHarness";

test.beforeEach(async ({ page }) => {
  await installStudentModeApiMocks(page);
});

test.setTimeout(210_000);

test("recovers from varied wrong SQL, wrong theory trials, and wrong mouse clicks", async ({
  page
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Select Case 006: The Widow of Cinder Lane" }).click();
  await expect(page.getByRole("button", { name: "Archive Locked" })).toBeDisabled();
  await page.getByRole("button", { name: "Back To Library" }).click();
  await expect(page.getByRole("heading", { name: "I'm Samuel Tupleton." })).toBeVisible();

  await page.getByRole("button", { name: "Admin Mode" }).click();
  await expect(page.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  await page.getByRole("button", { name: "Student Mode" }).click();

  await openStudentMode(page);
  await goToEvidenceBoard(page);
  await expect(page.getByText("No clues pinned yet.")).toBeVisible();
  await goToQueryLab(page);

  await expectQueryDraftSurvivesNavigation(
    page,
    "SELECT * FROM CrimeType WHERE CrimeLabel = 'Murder'",
    async () => {
      await page.getByRole("button", { name: "Evidence Board" }).click();
    },
    async () => {
      await goToQueryLab(page);
    }
  );

  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM People",
        "SELECT * FROM CrimeType WHERE CrimeLabel = 'Robbery'",
        "SELECT CrimeID FROM CrimeType WHERE CrimeID = 9999"
      ],
      correctSql: "SELECT * FROM CrimeType"
    }
  );
  await expect(page.getByText("Rows returned: 1")).toBeVisible();
  await logClueRow(page, 1);

  await goToEvidenceBoard(page);
  await clickWrongCheckInChoice(page, /CrimeID 1080 by itself/i);
  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM CrimeSceneReport WHERE ReportCity = 'Sequel City'",
        "SELECT * FROM CrimeSceneReport WHERE ReportDate = '2023-01-16'",
        "SELECT ReportID FROM CrimeSceneReport WHERE CrimeID = 1080"
      ],
      correctSql: "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'"
    }
  );
  await logClueRow(page, 1);

  await goToEvidenceBoard(page);
  await clickWrongCheckInChoice(page, /The Northwestern Dr witness clue by itself/i);
  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM InterviewLog WHERE ReportID = 1080",
        "SELECT * FROM InterviewLog WHERE PersonID = 10975",
        "SELECT * FROM InterviewLog WHERE ReportID = 10975 AND PersonID = 99999"
      ],
      correctSql: "SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID"
    }
  );
  await expect(page.getByText("Rows returned: 6")).toBeVisible();
  await logClueRow(page, 1);
  await logClueRow(page, 5);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM PersonsOfInterest WHERE PersonID = 14888 OR PersonID = 16372",
        "SELECT * FROM PersonsOfInterest WHERE AddressStreetName = 'Franklin'",
        "SELECT PersonName FROM PersonsOfInterest WHERE PersonID IN (14887, 16371)"
      ],
      correctSql: "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371"
    }
  );
  await logClueRow(page, 1);
  await logClueRow(page, 2);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'silver'",
        "SELECT * FROM FitNFlabClub WHERE FitMemberID LIKE 'H42W%'",
        "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold'"
      ],
      correctSql:
        "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'"
    }
  );
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM PersonsOfInterest WHERE PersonID = 48",
        "SELECT * FROM PersonsOfInterest WHERE LicenseID = 67318",
        "SELECT * FROM PersonsOfInterest WHERE PersonName LIKE '%Bower'"
      ],
      correctSql: "SELECT * FROM PersonsOfInterest WHERE PersonID = 67318"
    }
  );
  await logClueRow(page, 1);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 1",
        "SELECT * FROM InterviewLog WHERE PersonID = 14887",
        "SELECT * FROM InterviewLog WHERE LogTranscript LIKE '%confession%'"
      ],
      correctSql: "SELECT * FROM InterviewLog WHERE PersonID = 67318"
    }
  );
  await logClueForRowContaining(page, "three times last December");
  await expect(page.getByLabel("Clue deferred")).toContainText(
    /does not prove the current suspect step/i
  );
  await logClueForRowContaining(page, "I delivered the hit after the contract came through");

  await goToEvidenceBoard(page);
  await submitIncorrectTheoryChoices(
    page,
    ["Morty Schapiro", "Annabel Miller", "Morty Schapiro"],
    "First Suspect Confirmed",
    async () => {
      await page.getByRole("button", { name: "Query Lab" }).click();
      await expect(page.getByRole("button", { name: "Query Lab" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      await goToEvidenceBoard(page);
    }
  );

  const triggerBody = await submitTheoryChoice(page, "Jeremy Bowers");
  expect(triggerBody.data.isCorrect).toBe(true);
  expect(triggerBody.data.solvedRole).toBe("trigger_man");
  await expect(page.getByRole("heading", { name: "First Suspect Confirmed" })).toBeVisible();

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 12345",
        "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND LogID = 8801",
        "SELECT * FROM InterviewLog WHERE ReportID = 10975 AND LogTranscript LIKE '%BMW%'"
      ],
      correctSql: "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975"
    }
  );
  for (const rowNumber of [2, 3, 4, 5, 6, 7, 8]) {
    await logClueRow(page, rowNumber);
  }
  await expect(page.getByLabel("Lead update")).toContainText(
    /Mastermind profile complete: 10\/10 clue threads pinned\./i
  );

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM DriversLicense WHERE CarMake = 'Audi' AND CarModel = 'M8'",
        "SELECT * FROM DriversLicense WHERE Gender = 'male' AND HairColor = 'red'",
        "SELECT * FROM DriversLicense WHERE Height BETWEEN 70 AND 72"
      ],
      correctSql:
        "SELECT * FROM DriversLicense WHERE CarMake = 'BMW' AND CarModel = 'M8' AND Gender = 'female' AND HairColor = 'red' AND Height BETWEEN 65 AND 67"
    }
  );
  await logClueRow(page, 1);
  await logClueRow(page, 2);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM PersonsOfInterest WHERE LicenseID = 423327",
        "SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298",
        "SELECT * FROM PersonsOfInterest WHERE LicenseID = 857212"
      ],
      correctSql: "SELECT * FROM PersonsOfInterest WHERE LicenseID = 202298 OR LicenseID = 857212"
    }
  );
  await logClueRow(page, 1);
  await logClueRow(page, 2);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2023-12%'",
        "SELECT * FROM EventSchedule WHERE EventName LIKE '%Opera%'",
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-11%'"
      ],
      correctSql: "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%'"
    }
  );
  await expect(page.getByText("Rows returned: 10")).toBeVisible();

  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Gym%'",
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Jazz%'",
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Fashion%'"
      ],
      correctSql:
        "SELECT * FROM EventSchedule WHERE EventDate LIKE '2022-12%' AND EventName LIKE '%Symphony%'"
    }
  );
  await logClueRow(page, 1);
  await logClueRow(page, 2);
  await logClueRow(page, 3);

  await goToQueryLab(page);
  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM EventRegistration WHERE EventID IN (2669, 3005, 3257)",
        "SELECT * FROM EventRegistration WHERE EventPersonID = 67318",
        "SELECT * FROM EventRegistration WHERE EventID = 2669 AND EventPersonID = 14307"
      ],
      correctSql:
        "SELECT * FROM EventRegistration WHERE EventID IN (2669, 3005, 3257) AND EventPersonID IN (14307, 99716) ORDER BY EventID, EventPersonID"
    }
  );
  await expect(page.getByText("Rows returned: 6")).toBeVisible();

  await runIncorrectQueriesBeforeCorrect(
    page,
    {
      incorrectSql: [
        "SELECT * FROM Employment WHERE SSN = 67318",
        "SELECT * FROM Employment WHERE CompanyName LIKE '%Gym%'",
        "SELECT * FROM Employment WHERE Salary > 1000000"
      ],
      correctSql: "SELECT * FROM Employment WHERE SSN = 987756388 OR SSN = 362878596"
    }
  );
  await expect(page.getByText("Rows returned: 2")).toBeVisible();

  await goToEvidenceBoard(page);
  await submitIncorrectTheoryChoices(
    page,
    ["Dani Rawley", "Dani Rawley", "Dani Rawley"],
    "Mastermind Confirmed",
    async () => {
      await page.getByRole("button", { name: "Samuel's Briefing" }).click();
      await page.getByRole("button", { name: "Evidence Board" }).click();
    }
  );

  const finalBody = await submitTheoryChoice(page, "Miranda Priestly");
  expect(finalBody.data.isCorrect).toBe(true);
  expect(finalBody.data.solvedRole).toBe("mastermind");
  await expect(page.getByRole("heading", { name: "Mastermind Confirmed" })).toBeVisible({
    timeout: 10_000
  });
  await expect(page.getByLabel("Current Step")).toContainText("Case Closed.");
});
