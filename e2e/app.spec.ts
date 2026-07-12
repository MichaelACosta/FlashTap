import { test, expect } from "@playwright/test";

test("app carrega", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "FlashTap" })).toBeVisible();
});
