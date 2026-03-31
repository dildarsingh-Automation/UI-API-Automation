import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('UI Login Flows - Demo Site', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('TC-001: Should login successfully with valid credentials', async ({ page }) => {
    // We can use environment variables or fallback values.
    // For demo purposes, the-internet herokuapp specifies `tomsmith`/`SuperSecretPassword!`
    const username = process.env.TEST_USERNAME || 'tomsmith';
    const password = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

    await test.step('Fill in login credentials and submit', async () => {
      await loginPage.login(username, password);
    });

    await test.step('Verify successful login', async () => {
      const isSuccess = await loginPage.isLoginSuccessful();
      expect(isSuccess).toBeTruthy();
      
      // Another assertion based on URL
      await expect(page).toHaveURL(/.*\/secure/);
    });
  });

  test('TC-002: Should fail login with invalid credentials', async () => {
    await test.step('Attempt login with an invalid user', async () => {
      await loginPage.login('invalidUser', 'wrongPassword123');
    });

    await test.step('Verify error message appears', async () => {
      const isFailed = await loginPage.isLoginFailed();
      expect(isFailed).toBeTruthy();
    });
  });
});
