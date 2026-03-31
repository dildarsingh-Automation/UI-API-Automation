import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavigationPage } from '../pages/navigation.page';
import { DashboardPage } from '../pages/dashboard.page';
import { config } from '../utils/environment';

/**
 * Extended fixtures for authenticated tests
 * 
 * Features:
 * - Pre-authenticated state via global-setup
 * - Manual login option when SKIP_AUTH=false
 * - Page object fixtures for common pages
 * - Automatic logout on test completion
 * 
 * Usage:
 * - Use 'authenticatedPage' fixture for pre-authenticated page
 * - Use 'loginPage', 'navigationPage', 'dashboardPage' fixtures
 * - Set SKIP_AUTH=true to bypass authentication
 */

export interface AuthFixtures {
  // Page fixtures
  loginPage: LoginPage;
  navigationPage: NavigationPage;
  dashboardPage: DashboardPage;
  
  // Authenticated page (pre-login)
  authenticatedPage: Page;
  
  // User info
  user: {
    username: string;
    password: string;
  };
}

// User object
const user = {
  username: config.username,
  password: config.password,
};

export const test = base.extend<AuthFixtures>({
  // Login page fixture - navigates to login page
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  // Navigation page fixture
  navigationPage: async ({ page }, use) => {
    const navigationPage = new NavigationPage(page);
    await use(navigationPage);
  },
  
  // Dashboard page fixture
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  // Authenticated page - uses pre-authenticated state from global setup
  authenticatedPage: async ({ page }, use) => {
    // Pre-authenticated state is already loaded via storageState in playwright.config
    // Just navigate to the base URL to ensure session is active
    await page.goto('/');
    
    await use(page);
  },
  
  // User credentials fixture
  user: async ({}, use) => {
    await use(user);
  },
});

// Re-export expect for use in tests
export const expect = test.expect;

/**
 * Helper function to create authenticated test
 * Use this for tests that require login
 * 
 * @example
 * import { authenticatedTest } from './fixtures/auth.fixture';
 * 
 * authenticatedTest('should display dashboard', async ({ page, dashboardPage }) => {
 *   await dashboardPage.goto();
 *   await expect(dashboardPage.welcomeMessage).toBeVisible();
 * });
 */
export const authenticatedTest = test.extend<AuthFixtures>({
  // Override authenticatedPage to always login
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(config.username, config.password);
    await use(page);
  },
});

