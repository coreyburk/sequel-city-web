import { expect, test } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
import { openApplicationMenu, runQuery, logClueRow } from "./studentModeHarness";
test.beforeEach(async({page})=>installStudentModeApiMocks(page));
// Case-specific data varies; the page and editor do not.
for(const number of ["001","004"]){
 test(`Case ${number} uses the shared detective presentation and one editor`,async({page})=>{
  await page.goto("/");await expect(page.getByRole("heading",{name:"I'm Samuel Tupleton."})).toBeVisible();
  await page.getByRole("button",{name:new RegExp(`Select Case ${number}:`)}).click();await page.getByRole("button",{name:"Open Case File",exact:true}).click();
  await expect(page.getByLabel("Whole case briefing")).toContainText("Prove who committed the crime");await page.getByRole("button",{name:"Open Query Lab"}).click();
  await expect(page.getByLabel("SQL Query",{exact:true})).toHaveCount(1);await expect(page.getByLabel("Samuel's Guidance")).toContainText("Start with CrimeType");
  const portrait=page.getByRole("img",{name:"Samuel Tupleton, your SQL detective mentor"});await expect(portrait).toBeVisible();expect((await portrait.boundingBox())!.width).toBeGreaterThanOrEqual(200);
  await page.getByText("Hint",{exact:true}).click();await page.getByRole("button",{name:"Use starter"}).click();
  const editor=page.getByLabel("SQL Query",{exact:true});await editor.fill("SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND;");await editor.press("Control+End");
  await page.getByRole("button",{name:/City from case briefing/}).click();await expect(editor).toHaveValue(`SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportCity = '${number==="001"?"Sequel City":"Sequel City"}';`);
  await editor.fill("SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND");await editor.press("Control+End");await page.getByRole("button",{name:/Date from case briefing/}).click();await expect(editor).toHaveValue(`SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 AND ReportDate = ${number==="001"?"20230502":"20230115"}`);
  await runQuery(page,"SELECT * FROM CrimeType");await logClueRow(page,1);await expect(page.locator(".student-evidence-feedback--success")).toContainText("Clue logged");
  await editor.fill("My retained draft");await page.getByRole("button",{name:"Evidence Board",exact:true}).click();await expect(page.getByLabel("Case Progress",{exact:true})).toBeVisible();await expect(page.getByLabel("Evidence Notebook",{exact:true})).toContainText("CrimeID: 1080");
  await page.getByRole("button",{name:"Query Lab",exact:true}).click();await expect(editor).toHaveValue("My retained draft");
  await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
test("keeps Admin Query Runner outside the student surface",async({page})=>{
 page.on("pageerror", error => console.error("Admin browser exception:",error.message));
 await page.goto("/");await openApplicationMenu(page);await page.getByRole("button",{name:"Admin Mode",exact:true}).click();await expect(page.getByRole("heading",{name:"Query Runner",exact:true})).toBeVisible();await expect(page.getByLabel("SQL Query",{exact:true})).toHaveCount(0);
});

for(const number of ["001","004"]){
 test(`Case ${number} shows one useful feedback area for a valid empty query`,async({page})=>{
  await page.goto("/");await page.getByRole("button",{name:new RegExp(`Select Case ${number}:`)}).click();
  const opened=page.waitForResponse(response=>response.url().endsWith("/attempts")&&response.request().method()==="POST");
  await page.getByRole("button",{name:"Open Case File",exact:true}).click();const snapshot=await(await opened).json();await page.getByRole("button",{name:"Open Query Lab"}).click();
  await page.route("**/api/attempts/*/query",async route=>route.fulfill({json:{success:true,safety:{isAllowed:true,normalizedStatementType:"SELECT",violations:[],message:"Safe"},executionTimeMs:1,message:"Query executed successfully.",snapshot,progressSaved:true,data:{columns:[],rows:[],rowCount:0},feedback:{category:"no-matches",execution:"succeeded",evidence:"unchanged",severity:"info",title:"No matching rows",explanation:"The query ran and returned 0 rows.",nextAction:"Check your observed values or remove a condition."}}}));
  const editor=page.getByLabel("SQL Query",{exact:true});await editor.fill("SELECT * FROM CrimeType WHERE CrimeID = 2080");await page.getByRole("button",{name:"Run Query",exact:true}).click();
  await expect(page.getByLabel("Query feedback")).toContainText("No matching rows");await expect(page.getByText("No matching rows",{exact:true})).toHaveCount(1);await expect(page.getByLabel("Query feedback")).toContainText("Check your observed values");await expect(editor).toHaveValue("SELECT * FROM CrimeType WHERE CrimeID = 2080");
  await editor.fill("SELECT * FROM CrimeType");await expect(page.getByLabel("Query feedback")).toContainText("last executed query");
 });
}
