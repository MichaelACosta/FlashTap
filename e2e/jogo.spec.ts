import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
    window.localStorage.setItem("flashtap:v1:consent", JSON.stringify("declined"));
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

test("selecionar o botão correto marca Selected e habilita Enviar (US-07/US-09)", async ({
  page,
}) => {
  await page.goto("/jogo");

  const showingButton = page.getByRole("button", { name: /destacado/ });
  await expect(showingButton).toBeVisible({ timeout: 3000 });
  const correctId = await showingButton.textContent();

  await expect(page.getByRole("button", { name: /^Botão \d+$/ })).toHaveCount(12, {
    timeout: 3000,
  });

  const submitButton = page.getByRole("button", { name: "Enviar" });
  await expect(submitButton).toBeDisabled();

  await page.getByRole("button", { name: `Botão ${correctId}`, exact: true }).click();

  await expect(
    page.getByRole("button", { name: `Botão ${correctId}, selecionado` }),
  ).toBeDisabled();
  await expect(submitButton).toBeEnabled();
});

test("clicar em um botão errado encerra a partida e mostra a tela de Game Over (US-08)", async ({
  page,
}) => {
  await page.goto("/jogo");

  const showingButton = page.getByRole("button", { name: /destacado/ });
  await expect(showingButton).toBeVisible({ timeout: 3000 });
  const correctId = await showingButton.textContent();

  await expect(page.getByRole("button", { name: /^Botão \d+$/ })).toHaveCount(12, {
    timeout: 3000,
  });

  const wrongId = correctId === "1" ? "2" : "1";
  await page.getByRole("button", { name: `Botão ${wrongId}`, exact: true }).click();

  await expect(page.getByRole("button", { name: `Botão ${wrongId}, incorreto` })).toBeDisabled();
  const result = page.getByRole("region", { name: "Fim de partida" });
  await expect(result).toBeVisible();
  // Progresso e Recorde (US-17) mostram o mesmo valor "1.1" na primeira derrota.
  await expect(result.getByText("1.1")).toHaveCount(2);
});
