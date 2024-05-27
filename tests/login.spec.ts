import playwright from "playwright";
import { test, expect } from "@playwright/test";
import { creds } from "../data/credentials";

test.describe("SBT Deshboard", () => {
  let page: playwright.Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://app.hubstaff.com/dashboard");
  });

  test("is able to login", async () => {
    await page.getByPlaceholder("Enter your work email").fill(creds.username);
    await page
      .getByPlaceholder("Enter 6 or more characters")
      .fill(creds.password);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.locator(".user-dropdown").hover();
    const welcomeText = await page.locator(".tooltip-inner").textContent();
    expect(welcomeText).toContain(creds.name);
  });

  test("is not able to login", async () => {
    await page.getByPlaceholder("Enter your work email").fill("test");
    await page
      .getByPlaceholder("Enter 6 or more characters")
      .fill("tester");
    await page.getByRole("button", { name: "Log in" }).click();
    const errorText = await page.locator(".list-group-item-danger").textContent();
    expect(errorText).toContain("Invalid email or password");
  });
});
