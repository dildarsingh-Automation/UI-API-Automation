import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class FeesManagementPage extends BasePage {
  readonly uploadButton: Locator;
  readonly templateButton: Locator;

  constructor(page: Page) {
    super(page);

    this.uploadButton = this.page.getByRole('button', { name: /Upload/i })
      .or(this.page.locator('button:has-text("Upload")'))
      .or(this.page.locator('//button[contains(text(),"Upload")]'));

    this.templateButton = this.page.getByRole('button', { name: /Template/i })
      .or(this.page.locator('button:has-text("Template")'))
      .or(this.page.locator('//button[contains(text(),"Template")]'));
  }

  async navigate() {
    await this.goto('/ERP/fees/staff');
    await this.waitForPageLoad();
  }
}
