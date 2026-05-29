import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { installStudentModeApiMocks } from './studentModeApi';
import {
  openStudentMode,
  goToQueryLab,
  runQuery,
  logClueRow,
  openCaseFile,
  closeCaseFile,
  goToEvidenceBoard,
  buildFullMastermindProfile,
  solveThroughTriggerCheck
} from './studentModeHarness';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outPath = path.join(__dirname, 'case-steps.json');

async function pushStep(steps: string[], desc: string) {
  steps.push(desc);
}

test.beforeEach(async ({ page }) => {
  await installStudentModeApiMocks(page);
});

test('generate case progression steps', async ({ page }) => {
  const steps: string[] = [];

  await pushStep(steps, 'Open Student Mode landing page');
  await openStudentMode(page);

  await pushStep(steps, 'Open Query Lab');
  await goToQueryLab(page);

  // Ensure the Query Runner is rendered before interacting
  await page.getByRole('heading', { name: 'Query Runner' }).waitFor({ state: 'visible', timeout: 20000 });

  await pushStep(steps, 'Run initial CrimeType query to find case type');
  await runQuery(page, 'SELECT * FROM CrimeType');

  await pushStep(steps, 'Log CrimeID row 1 as evidence');
  await logClueRow(page, 1);

  await pushStep(steps, 'Follow trigger check transcript flow');
  // Explicit sequence (avoid harness undefined-query behaviors)
  await pushStep(steps, 'Run report lookup for the crime report');
  await runQuery(page, "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'");
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await pushStep(steps, 'Log CrimeSceneReport row 1 as evidence');
  await logClueRow(page, 1);

  await pushStep(steps, 'Run witness interview list for the report');
  await runQuery(page, 'SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID');
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await pushStep(steps, 'Log witness interview row 1 as evidence');
  await logClueRow(page, 1);

  await pushStep(steps, 'Log additional witness interview rows (row 5)');
  await logClueRow(page, 5);

  await pushStep(steps, 'Run PersonsOfInterest lookup for two person IDs');
  await runQuery(page, "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371");
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await pushStep(steps, 'Log both PersonsOfInterest rows as evidence');
  await logClueRow(page, 1);
  await logClueRow(page, 2);

  await pushStep(steps, 'Run FitNFlabClub filtered lookup');
  await runQuery(page, "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'");
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await pushStep(steps, 'Log FitNFlabClub row 1 as evidence');
  await logClueRow(page, 1);

  await pushStep(steps, 'Run PersonsOfInterest for gym-linked person');
  await runQuery(page, 'SELECT * FROM PersonsOfInterest WHERE PersonID = 67318');
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await pushStep(steps, 'Log suspect candidate row 1 as evidence');
  await logClueRow(page, 1);

  await pushStep(steps, 'Run suspect interview rows and log clue');
  await runQuery(page, 'SELECT * FROM InterviewLog WHERE PersonID = 67318');
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  await logClueRow(page, 1);

  await pushStep(steps, 'Build full mastermind profile by logging transcript rows');
  await runQuery(page, 'SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975');
  await page.getByText(/Rows returned:/).first().waitFor({ state: 'visible' });
  for (const rowNumber of [1, 2, 3, 4, 5, 6]) {
    await pushStep(steps, `Log mastermind transcript row ${rowNumber}`);
    await logClueRow(page, rowNumber);
  }

  await pushStep(steps, 'Open Evidence Board and verify shortlist guidance');
  await goToEvidenceBoard(page);

  await pushStep(steps, 'Open Case File to inspect pinned facts');
  await openCaseFile(page);

  await pushStep(steps, 'Close Case File');
  await closeCaseFile(page);

  // Write steps to file
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), steps }, null, 2), 'utf8');
});
