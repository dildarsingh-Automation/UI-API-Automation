import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { NavigationPage } from '../pages/navigation.page';
import { config } from '../utils/environment';

/**
 * Final Optimized Smoke Test - Speed + Reliability
 * Uses config creds, bypasses globalSetup issues
 */
test.describe('Smoke Tests @smoke', () => {
  test('smoke suite @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const navigationPage = new NavigationPage(page);

    console.log('🚀 Speed-optimized smoke test');

    // Fresh login - globalSetup storageState expires to login
    console.log('🔐 Login with config creds');
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await loginPage.emailInput.fill(config.username);
    await loginPage.passwordInput.fill(config.password);
    await loginPage.loginButton.click({ force: true });
    
    // Wait for dashboard post-login
    await page.waitForLoadState('networkidle', { timeout: 60000 });
    await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
    console.log('✅ Login success');

    // Sidebar validation
    await page.locator('.main-menu, .navigation-main, nav, aside').first().waitFor({ state: 'visible', timeout: 60000 });
    console.log('✅ Navigation ready');

    // Welcome Dildar
    await expect(page.locator('text=/welcome.*dildar/i')).toBeVisible({ timeout: 30000 });
    console.log('✅ Welcome verified');

    // Single nav test for speed
    console.log('🔄 Quick nav test');
    await navigationPage.clickSidebarItem('Discussion');
    await page.waitForLoadState('domcontentloaded');
    await navigationPage.validateHeading('Discussion');
    console.log('✅ Discussion nav PASS');

    // Logout
    await navigationPage.logout();
    await expect(page).toHaveURL(/login/, { timeout: 30000 });
    console.log('✅ Logout cycle complete');

    console.log('🎉 SMOKE PASS - Headless, Fast, Stable!');
  });
});
