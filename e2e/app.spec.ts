import { test, expect } from "@playwright/test";

test("app carrega e exibe a Home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "FlashTap" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Jogar" })).toBeVisible();
  await expect(page.getByText("Melhor recorde")).toBeVisible();
});

test("botão Jogar navega para a tela de Jogo", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
    window.localStorage.setItem("flashtap:v1:consent", JSON.stringify("declined"));
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Jogar" }).click();
  // trailingSlash: true (ADR-006, compatibilidade com GitHub Pages) faz o Next
  // normalizar a rota para /jogo/.
  await expect(page).toHaveURL(/\/jogo\/?$/);
});
