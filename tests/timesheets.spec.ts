import playwright from "playwright";
import { test, expect } from "@playwright/test";
import { creds } from "../data/credentials";

test.describe("SBT Deshboard", () => {
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
    await page.locator(".user-dropdown").hover();
    const welcomeText = await page.locator(".tooltip-inner").textContent();
    expect(welcomeText).toContain(creds.name);
  });

  test.afterAll(async ({ browser }, testInfo) => {
    await page.locator('.dropdown > .dropdown-toggle').first().click();
    await page.getByRole('link', { name: 'Sign out' }).click();
    await expect(page.locator('.session-message')).toContainText('You have been logged out.');
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
      await page.getByRole('link', { name: 'This week' }).click();
      expect(page.locator('#widget_this_week')).toBeVisible(); 

      // revert the this week widget
      await page.getByRole('link', { name: 'This week' }).click();
    });
  });

  test.describe("is showing correct data", async () => {
    test("verify memebers data is correct", async () => {
      const widget = page.locator('#widget_members_detailed');
      await expect(widget.locator('.member-name')).toContainText("Jyotirmay Second");
      await expect(widget.locator('.project-name')).toContainText("Test Project");
      await expect(widget.locator('.task_name')).toContainText("First Task Edited");
    });
    test("verify projects data is correct", async () => {
      const widget = page.locator('#widget_project_budgets'); 
      await expect(widget.locator('.project-name')).toContainText("Test Project 2");
      await expect(widget.locator('.budget-amount')).toContainText("$100,000.00");
    });
  });

});
