import { defineConfig, devices } from "@playwright/test";

// Only set in sandboxed dev environments with a pre-installed browser at a
// fixed path; on CI/other machines, Playwright resolves its own installed
// browser (via `playwright install`), so this stays undefined there.
const CHROMIUM_EXECUTABLE_PATH = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

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
        launchOptions: CHROMIUM_EXECUTABLE_PATH
          ? { executablePath: CHROMIUM_EXECUTABLE_PATH }
          : undefined,
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: CHROMIUM_EXECUTABLE_PATH
          ? { executablePath: CHROMIUM_EXECUTABLE_PATH }
          : undefined,
      },
    },
  ],
});
