import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Determine which site to test based on environment variable
  export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
    ["html"], 
    ["list"], 
    ["json", { outputFile: "test-results.json" }],
    ['allure-playwright',{
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
    }],
  ],
    // Global test timeout
    timeout: 30 * 1000, // 30 seconds
    // Global expect timeout
    expect: {
      timeout: 5000, // 5 seconds
    },
    use: {
      baseURL: process.env.BASE_URL,
      headless : true,
      trace: "on-first-retry",
      screenshot: "only-on-failure",
      video: "retain-on-failure",
      viewport: { width: 1280, height: 720 },
      actionTimeout: 10 * 1000, // 10 seconds
      navigationTimeout: 30 * 1000, // 30 seconds
    },
    projects: [
      {
        name: "chromium",
        use: {
          ...devices["Desktop Chrome"],
        },
      },
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },

        // Mobile testing
      },
      {
        name: "Mobile Chrome",
        use: { ...devices["Pixel 5"] },
      },
      {
        name: "Mobile Safari",
        use: { ...devices["iPhone 14"] },
      },
    ],
  });
