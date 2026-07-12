import { defineConfig, devices } from "@playwright/test";

const CHROMIUM_EXECUTABLE_PATH = "/opt/pw-browsers/chromium";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        launchOptions: { executablePath: CHROMIUM_EXECUTABLE_PATH },
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { executablePath: CHROMIUM_EXECUTABLE_PATH },
      },
    },
  ],
});
