import playwright from "playwright";
import { test, expect } from "@playwright/test";
import { creds } from "../data/credentials";

test.describe("Hubstaff Deshboard", () => {
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
    await page.locator(".user-dropdown").waitFor({ state: "visible" });
    await page.locator(".user-dropdown").hover();
    const welcomeText = await page.locator(".tooltip-inner").textContent();
    expect(welcomeText).toContain(creds.name);
  });

  test.afterAll(async ({ browser }, testInfo) => {
    await page.locator('.dropdown > .dropdown-toggle').first().click();
    await page.getByRole('link', { name: 'Sign out' }).click();
    const logoutMessage = page.locator('.session-message');
    await logoutMessage.waitFor({ state: 'visible' }); 
    await expect(logoutMessage).toContainText('You have been logged out.');
    await browser.close();
  });

  // we can use map and validate everything, but for now, let's keep it simple
  test.describe("is able to manage widgets", async () => {
    test("verify adding map works", async () => {
      await page.getByRole('link', { name: 'Manage widgets' }).click();
      await page.getByRole('link', { name: 'Map' }).click();
      const noActiveText = await page.locator('.app-map-stats-box').first().textContent();
      expect(noActiveText).toContain("No active members");
      expect(page.locator('.full-page-map-wrapper')).toBeVisible();

      // revert the map widget
      await page.getByRole('link', { name: 'Map' }).click();
    });
    test("verify adding this week works", async () => { 
      await page.getByRole('link', { name: 'This week', exact: true }).click();
      expect(page.locator('#widget_this_week')).toBeVisible(); 

      // revert the this week widget
      await page.getByRole('link', { name: 'This week', exact: true }).click();
    });
  });

  test.describe("is showing correct data", async () => {
    test("verify memebers data is correct", async () => {
      const widget = page.locator('#widget_members_detailed');
      await widget.waitFor({ state: 'visible' });
      await expect(widget.locator('a[class*="member-name"]')).toContainText("Jyotirmay Second");
      await expect(widget.locator('a[class*="project-name"]')).toContainText("Test Project");
      await expect(widget.locator('div[class*="task_name"]')).toContainText("First Task Edited");
    });
    test("verify projects data is correct", async () => {
      const widget = page.locator('#widget_project_budgets');
      await widget.waitFor({ state: 'visible' });
      await expect(widget.locator('span[class*="project-name"]')).toContainText("Test Project 2");
      await expect(widget.locator('span[class*="budget-amount"]')).toContainText("$100,000.00");
    });
  });

});
