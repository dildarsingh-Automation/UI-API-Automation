import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ReportsPage extends BasePage {
  readonly generateTRButton: Locator;
  readonly sessionSelect: Locator;

  constructor(page: Page) {
    super(page);

    this.generateTRButton = this.page.getByRole('button', { name: /Generate TR/i })
      .or(this.page.locator('button:has-text("Generate TR")'))
      .or(this.page.locator('//button[contains(text(),"Generate TR")]'));

    this.sessionSelect = this.page.locator('select[name="session"]')
      .or(this.page.locator('//select[contains(@name, "session")]'));
  }

  async navigate() {
    await this.goto('/ERP/report-management');
    await this.waitForPageLoad();
  }
}
