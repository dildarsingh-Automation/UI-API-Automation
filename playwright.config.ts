import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Public Demo Playwright Configuration
 * 
 * Demonstrates:
 * - Parallel execution support
 * - Smart retries for CI/local
 * - Multiple reporter support (HTML, List, Allure)
 * - Environment variable usage
 * - Clean architecture
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts$/,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['allure-playwright']
  ],
  
  use: {
    // Base URL for UI tests
    baseURL: process.env.UI_BASE_URL || 'https://the-internet.herokuapp.com',
    
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    ignoreHTTPSErrors: true,
    
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    headless: process.env.CI ? true : false,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  
  outputDir: 'test-results',
});
