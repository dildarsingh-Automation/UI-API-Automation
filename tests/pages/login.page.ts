import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 *
 * Handles user authentication with a 4-priority locator strategy.
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);

    // Priority 1: getByPlaceholder
    // Priority 2: CSS selector
    // Priority 3: XPath (Specific)
    // Priority 4: XPath (Alternative)
    this.emailInput = this.page.getByPlaceholder('Enter email')
      .or(this.page.locator('input[name="email"]'))
      .or(this.page.locator('//input[@placeholder="Enter email"]'))
      .or(this.page.locator('//input[contains(@class, "form-control")]').first());

    this.passwordInput = this.page.getByPlaceholder('············')
      .or(this.page.locator('input[name="password"]'))
      .or(this.page.locator('//input[@placeholder="············"]'))
      .or(this.page.locator('input[type="password"]'));

    this.loginButton = this.page.getByRole('button', { name: /login|sign in/i })
      .or(this.page.locator('button[type="submit"]'))
      .or(this.page.locator('//button[contains(text(),"Login")]'))
      .or(this.page.locator('button.btn-primary'));
  }

  async navigate() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string) {
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.first().scrollIntoViewIfNeeded();
    await this.emailInput.first().fill(username);
    await this.passwordInput.first().scrollIntoViewIfNeeded();
    await this.passwordInput.first().fill(password);
    await this.loginButton.first().scrollIntoViewIfNeeded();
    await this.loginButton.first().click();
    await this.page.waitForURL(/\/dashboard/, { timeout: 30000 });
  }

  async isVisible(): Promise<boolean> {
    return this.emailInput.isVisible().catch(() => false);
  }
}
