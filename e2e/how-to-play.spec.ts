import { test, expect } from "@playwright/test";

test("primeiro acesso exibe o modal Como Jogar automaticamente", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Como jogar")).toBeVisible();
});

test("fechar o modal persiste a flag e ele não reaparece em um novo acesso", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entendi" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await page.reload();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("não exibe o modal quando a flag já está marcada como vista", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
  });
  await page.goto("/");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
