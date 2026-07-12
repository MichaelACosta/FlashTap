import { test, expect } from "@playwright/test";

test("app carrega e exibe a Home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "FlashTap" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Jogar" })).toBeVisible();
  await expect(page.getByText("Melhor recorde")).toBeVisible();
});

test("botão Jogar navega para a tela de Jogo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Jogar" }).click();
  await expect(page).toHaveURL(/\/jogo$/);
});
