import { test, expect } from "@playwright/test";

async function declineAnalyticsConsent(page: import("@playwright/test").Page) {
  // Avoids the unrelated cookie-consent dialog (US-24) colliding with the
  // generic role("dialog") queries these tests use for the tutorial modal.
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:consent", JSON.stringify("declined"));
  });
}

test("primeiro acesso exibe o modal Como Jogar automaticamente", async ({ page }) => {
  await declineAnalyticsConsent(page);
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Como jogar" })).toBeVisible();
  await expect(page.getByText("Como jogar")).toBeVisible();
});

test("fechar o modal persiste a flag e ele não reaparece em um novo acesso", async ({ page }) => {
  await declineAnalyticsConsent(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Entendi" }).click();
  await expect(page.getByRole("dialog", { name: "Como jogar" })).not.toBeVisible();

  await page.reload();
  await expect(page.getByRole("dialog", { name: "Como jogar" })).not.toBeVisible();
});

test("não exibe o modal quando a flag já está marcada como vista", async ({ page }) => {
  await declineAnalyticsConsent(page);
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
  });
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Como jogar" })).not.toBeVisible();
});

test("ícone de ajuda na tela de Jogo reabre o modal independente da flag (US-04)", async ({
  page,
}) => {
  await declineAnalyticsConsent(page);
  await page.addInitScript(() => {
    window.localStorage.setItem("flashtap:v1:tutorial-seen", "true");
  });
  await page.goto("/jogo");
  await expect(page.getByRole("dialog", { name: "Como jogar" })).not.toBeVisible();

  await page.getByRole("button", { name: "Como jogar" }).click();
  await expect(page.getByRole("dialog", { name: "Como jogar" })).toBeVisible();

  await page.getByRole("button", { name: "Entendi" }).click();
  await expect(page.getByRole("dialog", { name: "Como jogar" })).not.toBeVisible();
});
