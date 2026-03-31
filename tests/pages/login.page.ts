import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Selectors based on the-internet.herokuapp.com/login structure
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    // Using a more stable role-based locator
    this.loginButton = page.getByRole('button', { name: /login/i }); 
    this.successMessage = page.locator('#flash.success');
    this.errorMessage = page.locator('#flash.error');
  }

  // Action methods
  async navigateToLogin() {
    await this.navigate('/login');
  }

  async login(username: string, password: string) {
    await this.fillForm(this.usernameInput, username);
    await this.fillForm(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async isLoginSuccessful() {
    return await this.isElementVisible(this.successMessage);
  }

  async isLoginFailed() {
    return await this.isElementVisible(this.errorMessage);
  }
}
