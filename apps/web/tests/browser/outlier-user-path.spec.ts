import { expect, test } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
async function open(page:any){await page.goto("/");await page.getByRole("button",{name:/Select Case 004:/}).click();await page.getByRole("button",{name:"Open Case File",exact:true}).click();await page.getByRole("button",{name:"Open Query Lab"}).click();}
test.beforeEach(async({page})=>installStudentModeApiMocks(page));
test("repository failure leaves the custom draft and current task intact",async({page})=>{
 await page.route("**/api/attempts/*/query",route=>route.fulfill({status:503,contentType:"application/json",body:JSON.stringify({message:"Case repository unavailable. Saved work has not been discarded."})}));
 await open(page);const editor=page.getByLabel("SQL Query",{exact:true});await editor.fill("SELECT * FROM CrimeType WHERE CrimeID > 0");await page.getByRole("button",{name:"Run Query",exact:true}).click();await expect(page.getByRole("alert")).toContainText("Saved work has not been discarded");await expect(editor).toHaveValue("SELECT * FROM CrimeType WHERE CrimeID > 0");await expect(page.getByLabel("Samuel's Guidance")).toContainText("Start with CrimeType");
});
test("a rejected clue does not display green acceptance or advance the evidence board",async({page})=>{
 await page.route("**/api/attempts/*/evidence",route=>route.fulfill({status:422,contentType:"application/json",body:JSON.stringify({message:"That row does not prove the current evidence task."})}));
 await open(page);await page.getByLabel("SQL Query",{exact:true}).fill("SELECT * FROM CrimeType");await page.getByRole("button",{name:"Run Query",exact:true}).click();await page.getByRole("button",{name:"Log row 1 as evidence"}).click();await expect(page.getByRole("alert")).toContainText("does not prove");await expect(page.locator(".student-evidence-feedback--success")).toHaveCount(0);await page.getByRole("button",{name:"Evidence Board",exact:true}).click();await expect(page.getByRole("progressbar",{name:"Proved case progress"})).toHaveAttribute("value","0");
});
test("starter replacement provides inline Undo and preserves the original draft",async({page})=>{
 await open(page);const editor=page.getByLabel("SQL Query",{exact:true});await editor.fill("My custom investigation draft");await page.getByRole("button",{name:"Use starter"}).click();await expect(editor).toHaveValue("SELECT * FROM CrimeType");await expect(page.getByRole("button",{name:"Undo starter"})).toBeVisible();await page.getByRole("button",{name:"Undo starter"}).click();await expect(editor).toHaveValue("My custom investigation draft");await expect(page.getByText("Your draft is retained.")).toBeVisible();
});
