import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Dashboard Page Object
 *
 * Represents the main dashboard after successful login.
 */
export class DashboardPage extends BasePage {
  readonly welcomeBanner: Locator;
  readonly viewAnnouncementsButton: Locator;
  readonly yearSelect: Locator;

  constructor(page: Page) {
    super(page);

    this.welcomeBanner = this.page.getByRole('heading', { name: /welcome/i })
      .or(this.page.locator('h1:has-text("Welcome")'))
      .or(this.page.locator('//h1[contains(text(),"Welcome")]'));

    this.viewAnnouncementsButton = this.page.getByLabel(/View all announcements/i)
      .or(this.page.locator('button:has-text("View all announcements")'))
      .or(this.page.locator('//button[contains(text(),"View all announcements")]'));

    this.yearSelect = this.page.locator('select.year-select')
      .or(this.page.locator('//select[contains(@class, "year")]'));
  }

  async navigate() {
    await this.goto('/ERP/dashboard');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    return this.welcomeBanner.isVisible().catch(() => false);
  }
}
