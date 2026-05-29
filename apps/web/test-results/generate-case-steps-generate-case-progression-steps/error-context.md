# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generate-case-steps.spec.ts >> generate case progression steps
- Location: tests\browser\generate-case-steps.spec.ts:30:1

# Error details

```
TimeoutError: page.waitForSelector: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('textarea[aria-label="SQL query input"]')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - heading "Sequel City Case Files" [level=1] [ref=e5]
    - group "Workspace Mode" [ref=e6]:
      - button "Student Mode" [pressed] [ref=e7] [cursor=pointer]
      - button "Admin Mode" [ref=e8] [cursor=pointer]
  - region "Case 004 · The SQL City Murder · 2/8 clues logged" [active] [ref=e9]:
    - generic [ref=e10]:
      - paragraph [ref=e11]: Case Status
      - heading "Case 004 · The SQL City Murder · 2/8 clues logged" [level=2] [ref=e12]
    - generic [ref=e13]:
      - region "Samuel Tupleton Mentor" [ref=e17]:
        - heading "Samuel's Evidence Review" [level=2] [ref=e18]
        - paragraph [ref=e19]: Witness trail unlocked
        - generic [ref=e20]:
          - term [ref=e21]: What to prove
          - definition [ref=e22]: Find both witnesses tied to the pinned report.
          - term [ref=e23]: What to do next
          - definition [ref=e24]: Nice. The key report row is in your notebook. Head back to the Query Lab, pull up the witness records tied to that report, and look for repeated person IDs - those repeats sound like real witnesses at the scene.
        - list "Samuel reward status" [ref=e25]:
          - listitem [ref=e26]: "Samuel's Trust: Steady"
          - listitem [ref=e27]: "Insight Marks: 0"
      - generic "Noir Scene Visual" [ref=e29]:
        - img "Glowing evidence board with a confirmed clue pinned at the center" [ref=e31]
  - navigation "Student Case Actions" [ref=e33]:
    - button "Samuel's Briefing" [ref=e34] [cursor=pointer]
    - button "Query Lab" [ref=e35] [cursor=pointer]
    - button "Evidence Board" [disabled] [pressed] [ref=e36]
  - region "Evidence Notebook and Case File" [ref=e37]:
    - region "Evidence Notebook" [ref=e38]:
      - generic [ref=e39]:
        - heading "Evidence Notebook" [level=2] [ref=e40]
        - paragraph [ref=e41]: Keep the clues you have proved and any notes you want to keep.
      - list [ref=e42]:
        - listitem [ref=e43]:
          - generic [ref=e44]: CrimeID = 1080
          - button "Remove note CrimeID = 1080" [ref=e46] [cursor=pointer]: Remove
        - listitem [ref=e47]:
          - generic [ref=e48]: ReportCity = SQL City
          - button "Remove note ReportCity = SQL City" [ref=e50] [cursor=pointer]: Remove
        - listitem [ref=e51]:
          - generic [ref=e52]: ReportDate = 2023-01-15
          - button "Remove note ReportDate = 2023-01-15" [ref=e54] [cursor=pointer]: Remove
        - listitem [ref=e55]:
          - generic [ref=e56]: ReportID = 10975
          - button "Remove note ReportID = 10975" [ref=e58] [cursor=pointer]: Remove
      - generic "Witness Evidence Checklist" [ref=e59]:
        - paragraph [ref=e60]: Witness Checklist
        - paragraph [ref=e61]: "Items still needed:"
        - list [ref=e62]:
          - listitem [ref=e63]:
            - strong [ref=e64]: "1. Log the first witness bundle:"
            - text: one repeated PersonID and its strongest clue snippet.
          - listitem [ref=e65]:
            - strong [ref=e66]: "2. Log the second witness bundle:"
            - text: the other repeated PersonID and its strongest clue snippet.
      - generic [ref=e67]:
        - generic [ref=e68]: Add your own note
        - textbox "Add your own note" [ref=e69]:
          - /placeholder: Witness note, address, hunch, or cross-reference...
        - button "Add Note" [ref=e70] [cursor=pointer]
      - text: case notes
    - region "Case Progress" [ref=e71]:
      - generic [ref=e72]:
        - heading "Case Progress" [level=2] [ref=e73]
        - paragraph [ref=e74]: "Completed milestones: 2 / 8"
      - generic "Current Step" [ref=e75]:
        - paragraph [ref=e76]: Current Step
        - paragraph [ref=e77]: Witness Discovery.
        - paragraph [ref=e78]: See Samuel's Guidance above for the full direction.
      - list [ref=e79]:
        - listitem [ref=e80]:
          - generic [ref=e81]: "[x]"
          - generic [ref=e82]: Find the right crime records
        - listitem [ref=e83]:
          - generic [ref=e84]: "[x]"
          - generic [ref=e85]: Narrow the exact case report
        - listitem [ref=e86]:
          - generic [ref=e87]: "[ ]"
          - generic [ref=e88]: Follow the witness trail
      - region "Samuel's Check-In" [ref=e89]:
        - generic [ref=e90]:
          - paragraph [ref=e91]: Samuel's Check-In
          - paragraph [ref=e92]: "Insight Marks: 0"
        - paragraph [ref=e93]: Optional reasoning check.
        - paragraph [ref=e94]: Which evidence chain found the target murder report?
        - generic [ref=e95]:
          - button "CrimeID 1080, SQL City, January 15th, 2023, and ReportID 10975." [ref=e96] [cursor=pointer]
          - button "CrimeID 1080 by itself." [ref=e97] [cursor=pointer]
          - button "The Northwestern Dr witness clue by itself." [ref=e98] [cursor=pointer]
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from "@playwright/test";
  2   | 
  3   | export async function openStudentMode(page: Page): Promise<void> {
  4   |   await page.goto("/");
  5   |   await expect(page.getByRole("heading", { name: "Sequel City Case Files" })).toBeVisible();
  6   |   await expect(page.getByRole("button", { name: "Student Mode" })).toHaveAttribute(
  7   |     "aria-pressed",
  8   |     "true"
  9   |   );
  10  | }
  11  | 
  12  | export async function goToQueryLab(page: Page): Promise<void> {
  13  |   const tab = page.getByRole("button", { name: "Query Lab" });
  14  |   const attr = await tab.getAttribute("aria-current");
  15  |   if (attr !== "page") {
  16  |     // Retry click up to 3 times if the tab doesn't become active
  17  |     for (let i = 0; i < 3; i++) {
  18  |       await tab.click();
  19  |       // small pause to allow UI to update
  20  |       try {
  21  |         await expect(tab).toHaveAttribute("aria-current", "page");
  22  |         break;
  23  |       } catch (e) {
  24  |         await page.waitForTimeout(500);
  25  |       }
  26  |     }
  27  |   }
  28  |   await expect(tab).toHaveAttribute("aria-current", "page");
  29  | }
  30  | 
  31  | export async function goToEvidenceBoard(page: Page): Promise<void> {
  32  |   const tab = page.getByRole("button", { name: "Evidence Board" });
  33  |   if ((await tab.getAttribute("aria-current")) !== "page") {
  34  |     await tab.click();
  35  |   }
  36  |   await expect(tab).toHaveAttribute("aria-current", "page");
  37  | }
  38  | 
  39  | export async function runQuery(page: Page, sql?: string): Promise<void> {
> 40  |   await page.waitForSelector('textarea[aria-label="SQL query input"]', { state: 'attached', timeout: 20000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 20000ms exceeded.
  41  |   const input = page.getByLabel("SQL query input");
  42  |   if (sql !== undefined) {
  43  |     await input.fill(sql, { timeout: 20000, force: true });
  44  |   }
  45  |   const runBtn = page.getByRole("button", { name: "Run Query" });
  46  |   await runBtn.waitFor({ state: 'visible', timeout: 10000 });
  47  |   await runBtn.click();
  48  | }
  49  | 
  50  | export async function logClueRow(page: Page, rowNumber: number): Promise<void> {
  51  |   const btn = page.getByRole("button", { name: `Log row ${rowNumber} as evidence` });
  52  |   await btn.waitFor({ state: 'visible', timeout: 20000 });
  53  |   await btn.click();
  54  | }
  55  | 
  56  | export async function openCaseFile(page: Page): Promise<void> {
  57  |   await page.getByRole("button", { name: "Case File" }).click();
  58  |   await expect(page.getByRole("heading", { name: "Pinned Facts" })).toBeVisible();
  59  | }
  60  | 
  61  | export async function closeCaseFile(page: Page): Promise<void> {
  62  |   await page.getByRole("button", { name: "Close Case File" }).click();
  63  |   await expect(page.getByRole("heading", { name: "Pinned Facts" })).toHaveCount(0);
  64  | }
  65  | 
  66  | export function getSceneImage(page: Page): Locator {
  67  |   return page.getByLabel("Noir Scene Visual").locator("img");
  68  | }
  69  | 
  70  | export async function solveThroughTriggerCheck(page: Page): Promise<void> {
  71  |   await goToQueryLab(page);
  72  |   await runQuery(page);
  73  |   await logClueRow(page, 1);
  74  | 
  75  |   await goToQueryLab(page);
  76  |   await runQuery(
  77  |     page,
  78  |     "SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = 'SQL City'"
  79  |   );
  80  |   await logClueRow(page, 1);
  81  | 
  82  |   await goToQueryLab(page);
  83  |   await runQuery(page, "SELECT * FROM InterviewLog WHERE ReportID = 10975 ORDER BY PersonID");
  84  |   await logClueRow(page, 1);
  85  |   await goToQueryLab(page);
  86  |   await expect(page.getByText("Rows returned: 6")).toBeVisible();
  87  |   await logClueRow(page, 5);
  88  | 
  89  |   await goToQueryLab(page);
  90  |   await runQuery(
  91  |     page,
  92  |     "SELECT * FROM PersonsOfInterest WHERE PersonID = 14887 OR PersonID = 16371"
  93  |   );
  94  |   await logClueRow(page, 1);
  95  |   await logClueRow(page, 2);
  96  | 
  97  |   await goToQueryLab(page);
  98  |   await runQuery(
  99  |     page,
  100 |     "SELECT * FROM FitNFlabClub WHERE FitMembershipStatus = 'gold' AND FitMemberID LIKE '48Z%'"
  101 |   );
  102 |   await logClueRow(page, 1);
  103 | 
  104 |   await goToQueryLab(page);
  105 |   await runQuery(page, "SELECT * FROM PersonsOfInterest WHERE PersonID = 67318");
  106 |   await logClueRow(page, 1);
  107 | 
  108 |   await goToQueryLab(page);
  109 |   await runQuery(page, "SELECT * FROM InterviewLog WHERE PersonID = 67318");
  110 |   await logClueRow(page, 1);
  111 | 
  112 |   await goToEvidenceBoard(page);
  113 |   await page.getByLabel("Student suspect full name").fill("Jeremy Bowers");
  114 |   await page.getByRole("button", { name: "Test Theory" }).click();
  115 |   await expect(
  116 |     page.getByRole("heading", { name: "First Suspect Confirmed" })
  117 |   ).toBeVisible();
  118 | }
  119 | 
  120 | export async function buildFullMastermindProfile(page: Page): Promise<void> {
  121 |   await solveThroughTriggerCheck(page);
  122 |   await goToQueryLab(page);
  123 |   await runQuery(page, "SELECT * FROM InterviewLog WHERE PersonID = 67318 AND ReportID = 10975");
  124 |   for (const rowNumber of [1, 2, 3, 4, 5, 6]) {
  125 |     await logClueRow(page, rowNumber);
  126 |   }
  127 |   await expect(page.getByText(/Mastermind profile clues pinned: 10\/10\./i)).toBeVisible();
  128 | }
  129 | 
```