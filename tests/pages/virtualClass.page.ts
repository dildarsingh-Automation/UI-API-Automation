import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class VirtualClassPage extends BasePage {
  readonly createNewButton: Locator;
  readonly searchInput: Locator;
  readonly calendarTab: Locator;

  constructor(page: Page) {
    super(page);

    this.createNewButton = this.page.getByRole('button', { name: /Create New/i })
      .or(this.page.locator('button:has-text("Create New")'))
      .or(this.page.locator('//button[contains(text(),"Create New")]'));

    this.searchInput = this.page.getByPlaceholder(/Search/i)
      .or(this.page.locator('input[placeholder*="Search"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search")]'));

    this.calendarTab = this.page.getByRole('tab', { name: /Calendar/i })
      .or(this.page.locator('//div[contains(text(),"Calendar")]'))
      .or(this.page.locator('.nav-link:has-text("Calendar")'));
  }

  async navigate() {
    await this.goto('/ERP/virtual-class');
    await this.waitForPageLoad();
  }
}
