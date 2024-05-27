import playwright from "playwright";
import { test, expect } from "@playwright/test";
import { creds } from "../data/credentials";

test.describe("Hubstaff Timesheets", () => {
  let page: playwright.Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://app.hubstaff.com/dashboard");
    await page.getByPlaceholder("Enter your work email").fill(creds.username);
    await page
      .getByPlaceholder("Enter 6 or more characters")
      .fill(creds.password);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByRole("link", { name: /Timesheets/ }).click();
    await page
      .getByRole("heading", { name: "View & edit timesheets" })
      .isVisible();
  });

  test.afterAll(async ({ browser }, testInfo) => {
    await page.locator(".dropdown > .dropdown-toggle").first().click();
    await page.getByRole("link", { name: "Sign out" }).click();
    await expect(page.locator(".session-message")).toContainText(
      "You have been logged out.", { timeout: 15000 }
    );
    await browser.close();
  });

  // we can use map and validate everything, but for now, let's keep it simple
  test("is able to add time to project", async () => {
    await page.locator('a').filter({ hasText: 'Add time' }).click({delay: 1000});
    await page.getByRole('combobox', { name: 'Select a project' }).click();
    await page.getByRole('treeitem', { name: 'Test Project', exact: true }).click();
    await page.getByRole('combobox', { name: 'Select a to-do' }).click();
    await page.getByRole('treeitem', { name: 'Test Admin Task' }).click();
    await page.getByRole('textbox').nth(3).fill('11');
    await page.getByLabel('Why are you adding this time').click();
    await page.getByRole('treeitem', { name: 'Forgot to start/stop timer' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('td').nth(1)).toContainText(/Test Project/);
    await expect(page.locator('td').nth(2)).toContainText(/Forgot to start/);
    await expect(page.locator('td').nth(8)).toContainText(/3:00/);
  });
  test("is able to delete time", async () => {
    await page.locator('td').first().click();
    await page.getByRole('button', { name: /Batch actions/ }).click();
    await page.getByRole('link', { name: 'Delete' }).click();
    await page.getByPlaceholder('Why are you deleting these').fill('Test automation!');
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(2000);
    await expect(page.locator('table[class*="has-actions"]')).toBeEmpty({timeout: 10000});
  });

});
