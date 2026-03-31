import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { NavigationPage } from '../pages/navigation.page';

/**
 * CORE ERP FLOWS
 * Exactly TWO test cases as requested.
 */

test.describe('ERP Core Flows', () => {
  // Ensure we start with a clean state for login tests
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    navigationPage = new NavigationPage(page);
  });

  /**
   * TEST CASE 1: login_logout
   */
  test('login_logout', async ({ page }) => {
    // 1 & 2. Launch browser & Navigate
    await loginPage.navigate();

    // 3. Verify login page loads
    await expect(loginPage.emailInput).toBeVisible();

    // 4. Enter credentials and login
    const username = process.env.TEST_USERNAME || 'admin@edufusiontech.com';
    const password = process.env.TEST_PASSWORD || 'vgu@123';
    await loginPage.login(username, password);

    // 5. Verify dashboard/home page loads successfully
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(dashboardPage.welcomeBanner).toBeVisible();

    // 6. Verify sidebar navigation is visible
    await expect(navigationPage.sidebar).toBeVisible();

    // 7, 8 & 9. Logout and verify redirection
    await navigationPage.logout();
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.emailInput).toBeVisible();
  });

  /**
   * TEST CASE 2: menutask
   */
  test('menutask', async ({ page }) => {
    // 1 & 2. Launch browser & Login
    await loginPage.navigate();
    const username = process.env.TEST_USERNAME || 'admin@edufusiontech.com';
    const password = process.env.TEST_PASSWORD || 'vgu@123';
    await loginPage.login(username, password);

    // 3. Verify dashboard loads successfully
    await expect(dashboardPage.welcomeBanner).toBeVisible();

    // 4. Locate the left sidebar menu (already identified in NavigationPage)
    
    // 5. Sequentially click each sidebar item
    const sidebarItems = [
      'Dashboard',
      'Discussion',
      'Virtual Class',
      'Course',
      'Program',
      'Role Management',
      'Examination',
      'Grade Report',
      'User Management',
      'Fees Management',
      'Reports',
      'Requests',
      'Announcements',
      'Add On'
    ];

    for (const item of sidebarItems) {
      // 6. Click sidebar menu item & wait for load
      await navigationPage.clickSidebarItem(item);
      
      // 6 & 7. Capture page heading and assert
      await navigationPage.validateHeading(item);
    }

    // 9 & 10. Logout and verify redirect
    await navigationPage.logout();
    await expect(page).toHaveURL(/.*login/);
  });
});
