import playwright from "playwright";
import { test, expect } from "@playwright/test";
import { creds } from "../../data/credentials";

test.describe("SBT Deshboard Courses Validations", () => {
  let page: playwright.Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://elearning.securityblue.team/");
    await page.getByPlaceholder("john@example.com").fill(creds.username);
    await page.locator("#login-password").fill(creds.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    const welcomeText = await page.getByText(/Welcome back, /).textContent();
    expect(welcomeText).toContain(creds.name);
  });

  test.afterAll(async ({ browser }, testInfo) => {
    await page.getByRole("link", { name: "avatar" }).click();
    await page.getByRole("link", { name: /Logout/ }).click();
    expect(page.url()).toContain("/login");
    await browser.close();
  });

  test.describe("is able to buy free course", async () => {
	// skipping for now
    test("is able to navigate to Free Courses Page", async () => {
      await page.getByRole("link", { name: /Free Courses/ }).click();
      await page.locator('.card-footer .btn').last().click();
      await page.getByRole("button", { name: /Purchase Course/ }).click();
    });

    test("content is locked before purchasing", async () => {
      await page.getByRole("link", { name: /Free Courses/ }).click();
      await page.locator(".card-footer .btn").nth(3).click();
      await page.locator("li").filter({ hasText: "Content" }).click();
      const lockedContent = await page.locator(".alert h4").textContent();
      expect(lockedContent).toContain("Content Unavailable");
    });

    test("is able to access the purchased course content", async () => {
      await page.getByRole("link", { name: /Free Courses/ }).click();
      await page.locator(".card-footer .btn").first().click();
      await page.locator("li").filter({ hasText: "Content" }).click();
      await expect(page.getByPlaceholder("Search")).toBeVisible();
    });
  });

  test.describe("is able to buy paid course", async () => {
    test("is able to navigate to stripe page", async () => {
      await page.getByRole("link", { name: /Blue Team Level 1/ }).click();
      const purchaseButton = page.getByRole("button", { name: /Purchase Certification/ });
      await expect(purchaseButton).toHaveText(/Purchase Certification - £399/);
      await purchaseButton.click();
      await page.waitForURL(/checkout.stripe.com/, { timeout: 15000 });
      await expect(page.locator(".ProductSummary-name")).toContainText("Blue Team Level 1");
      await page.getByLabel('Back to Security Blue Team').click();
      await page.waitForURL("https://elearning.securityblue.team/home");
    });
  });
});
