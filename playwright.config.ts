import { defineConfig, devices, ReporterDescription } from '@playwright/test';
import path from 'path';

/**
 * Production-Ready Playwright Configuration
 * 
 * Features:
 * - Parallel execution support
 * - Smart retries for CI/local
 * - Multiple reporter support (HTML, List, Allure)
 * - Pre-authenticated state for faster tests
 * - Comprehensive browser coverage
 * - Mobile responsive testing
 * - Enhanced timeouts for slow applications
 * 
 * Environment Variables:
 * - BASE_URL: Application URL (default: https://copilot-student.wowlabz.com)
 * - TEST_USERNAME: Login username
 * - TEST_PASSWORD: Login password
 * - TEST_ENV: Environment (qa/uat/prod)
 * - CI: Set to 'true' for CI execution
 * - HEADLESS: Set to 'false' to run in headed mode
 */

export default defineConfig({
  // Test directory - searches for files matching pattern
  testDir: './tests',
  
  // Glob patterns for test files
  testMatch: /.*\.spec\.ts$/,
  
  // Global timeout for each test (5 minutes for slow-loading pages)
  timeout: 10 * 60 * 1000,
  
  // Timeout for expect assertions
  expect: {
    timeout: 10 * 60 * 1000,
  },
  
  // Global setup - runs once before all tests
  globalSetup: require.resolve('./tests/global-setup.ts'),
  
  // Global teardown - runs once after all tests
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  
  // Run tests in parallel within files (effective for local dev with multiple workers).
  // Note: CI uses workers:1 (see below), so fullyParallel has no effect on CI — this
  // is intentional: CI runners share hardware and sequential execution is more stable.
  fullyParallel: true,
  
  // Fail build on CI if test.only is left behind
  forbidOnly: !!process.env.CI,
  
  // Retry configuration:
  // - CI: 2 retries (handle flaky tests)
  // - Local: 1 retry
  retries: process.env.CI ? 2 : 1,
  
  // Worker configuration:
  // - CI: 1 worker — intentional for stability on shared CI runners (see fullyParallel note above)
  //        Increase to 2+ once CI infrastructure is confirmed to support parallel execution
  // - Local: undefined — Playwright auto-selects based on CPU cores
  workers: 1,
  
  // Reporter configuration
  reporter: process.env.CI 
    ? [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['list'],
        ['allure-playwright'],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['list'],
        ['allure-playwright'],
      ],
  
  // Shared settings for all projects
  use: {
    // Base URL - can be overridden with BASE_URL env var
    baseURL: process.env.BASE_URL || 'https://copilot-student.wowlabz.com',
    
    // Use pre-authenticated state from global setup
    // Set to undefined to disable global pre-auth (tests will login via fixture or manually)
    // Use SKIP_AUTH=true to bypass authentication entirely
    storageState: undefined,
    
    // Trace options
    trace: 'retain-on-failure',
    
    // Screenshot options
    screenshot: 'only-on-failure',
    
    // Video recording
    video: 'off',
    
    // Action timeouts (5 minutes for slow-loading pages)
    actionTimeout: 30000,
    
    // Navigation timeouts (5 minutes for slow-loading pages)
    navigationTimeout: 60000,
    
    // Ignore HTTPS errors (useful for self-signed certs)
    ignoreHTTPSErrors: true,
    
    // Locale settings
    locale: 'en-US',
    
    // Timezone
    timezoneId: 'America/New_York',
    
    // Viewport set to null with start-maximized for fullscreen
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    
    // Run headed in local (non-CI) mode
    headless: true,
  },
  
  // Configure projects for major browsers - Commented out to run only chromium by default
  // To run all browsers, use: npx playwright test --project=chromium --project=firefox
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // Uncomment for Safari testing (may have issues on Windows)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Mobile testing projects - commented out
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    
    // Brand-specific testing (uncomment as needed)
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  
  // Output directory for test artifacts
  outputDir: 'test-results',
});

