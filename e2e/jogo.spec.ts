import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
  });
});

test("uma nova partida mostra o countdown, exibe a sequência e libera a interação (US-05/US-06)", async ({
  page,
}) => {
  await page.goto("/jogo");

  await expect(page.getByRole("status")).toBeVisible();

  const showingButton = page.getByRole("button", { name: /destacado/ });
  await expect(showingButton).toBeVisible({ timeout: 3000 });
  await expect(showingButton).toBeDisabled();

  await expect(page.getByRole("button", { name: /^Botão \d+$/ })).toHaveCount(12, {
    timeout: 3000,
  });
  const buttons = page.getByRole("button", { name: /^Botão \d+$/ });
  for (const button of await buttons.all()) {
    await expect(button).toBeEnabled();
  }
});
