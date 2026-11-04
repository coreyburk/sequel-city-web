import { expect, test } from "@playwright/test";
import { installStudentModeApiMocks } from "./studentModeApi";
import { openApplicationMenu, runQuery } from "./studentModeHarness";

test("reading size scales the workbench, keyboard adjusts live, preserves case state and survives reload", async ({ page }) => {
  await installStudentModeApiMocks(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.getByRole("button", { name: /^Select Case 001:/ }).first().click();
  await page.getByRole("button", { name: "Open Case File", exact: true }).click();
  await page.getByRole("button", { name: "Open Query Lab" }).click();
  await runQuery(page, "SELECT * FROM CrimeType");
  const editor = page.getByLabel("SQL Query", { exact: true });
  const cell = page.getByRole("cell").first();
  await expect(cell).toBeVisible();
  await expect(editor).toHaveValue("SELECT * FROM CrimeType");

  const fontSize = (el: Element) => parseFloat(getComputedStyle(el).fontSize);
  const original = await Promise.all([editor.evaluate(fontSize), cell.evaluate(fontSize)]);

  await openApplicationMenu(page);
  const slider = page.getByRole("slider", { name: /Text size/ });
  await slider.focus();

  // Test keyboard step controls
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("105");
  await expect(slider).toHaveAttribute("aria-valuetext", "105 percent");
  await slider.press("ArrowUp");
  await expect(slider).toHaveValue("110");
  await slider.press("ArrowDown");
  await expect(slider).toHaveValue("105");
  await slider.press("ArrowLeft");
  await expect(slider).toHaveValue("100");

  // Test End key to jump to 200%
  await slider.press("End");
  await expect(slider).toHaveValue("200");
  await expect(slider).toHaveAttribute("aria-valuetext", "200 percent");

  // Verify live font-size adjustment while menu is still open
  expect(await editor.evaluate(fontSize)).toBeCloseTo(original[0] * 2);
  expect(await cell.evaluate(fontSize)).toBeCloseTo(original[1] * 2);

  // Verify case state survived adjusting the control
  await expect(editor).toHaveValue("SELECT * FROM CrimeType");
  await expect(cell).toBeVisible();

  // Close menu with Escape
  await slider.press("Escape");
  await expect(slider).not.toBeVisible();

  // Verify case state and scaled font size after menu closure
  await expect(editor).toHaveValue("SELECT * FROM CrimeType");
  await expect(cell).toBeVisible();
  expect(await editor.evaluate(fontSize)).toBeCloseTo(original[0] * 2);
  expect(await cell.evaluate(fontSize)).toBeCloseTo(original[1] * 2);

  // Check layout on laptop and narrow screens
  for (const width of [1366, 1024, 375]) {
    await page.setViewportSize({ width, height: 768 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth
      ? [...document.querySelectorAll("main *")].filter(el => el.getBoundingClientRect().right > innerWidth + 1 && !el.closest("table")).slice(0, 12).map(el => el.tagName + "." + el.className) : []);
    expect(overflow, "overflow at " + width).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }

  // Check menu panel open at 375px narrow screen at 200% reading size
  await page.setViewportSize({ width: 375, height: 667 });
  await openApplicationMenu(page);
  const menuPanel = page.getByRole("navigation", { name: "Application menu" });
  await expect(menuPanel).toBeVisible();
  const menuBox = await menuPanel.boundingBox();
  expect(menuBox).not.toBeNull();
  if (menuBox) {
    expect(menuBox.x).toBeGreaterThanOrEqual(0);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(375 + 1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);

  // Verify persistence across reload
  await page.reload();
  await openApplicationMenu(page);
  await expect(slider).toHaveValue("200");
  await slider.press("Home");
  await expect(slider).toHaveValue("100");
  expect(await page.evaluate(() => localStorage.getItem("sequel-city.text-size"))).toBe("100");
});

test("migrates legacy stored size 'large' to 110%", async ({ page }) => {
  await installStudentModeApiMocks(page);
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("sequel-city.text-size", "large"));
  await page.reload();
  await openApplicationMenu(page);
  const slider = page.getByRole("slider", { name: /Text size/ });
  await expect(slider).toHaveValue("110");
  expect(await page.evaluate(() => document.documentElement.style.fontSize)).toBe("110%");
});

test("migrates legacy stored size 'larger' to 120%", async ({ page }) => {
  await installStudentModeApiMocks(page);
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("sequel-city.text-size", "larger"));
  await page.reload();
  await openApplicationMenu(page);
  const slider = page.getByRole("slider", { name: /Text size/ });
  await expect(slider).toHaveValue("120");
  expect(await page.evaluate(() => document.documentElement.style.fontSize)).toBe("120%");
});

test("falls back on invalid or corrupt stored sizes to 100%", async ({ page }) => {
  await installStudentModeApiMocks(page);
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("sequel-city.text-size", "corrupted-or-default"));
  await page.reload();
  await openApplicationMenu(page);
  const slider = page.getByRole("slider", { name: /Text size/ });
  await expect(slider).toHaveValue("100");
  expect(await page.evaluate(() => document.documentElement.style.fontSize)).toBe("100%");
});
