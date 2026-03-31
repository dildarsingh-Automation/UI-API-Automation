import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProgramPage extends BasePage {
  readonly createProgramButton: Locator;

  constructor(page: Page) {
    super(page);

    this.createProgramButton = this.page.getByRole('button', { name: /Create New Program/i })
      .or(this.page.locator('button:has-text("Create New Program")'))
      .or(this.page.locator('//button[contains(text(),"Create New Program")]'));
  }

  async navigate() {
    await this.goto('/ERP/program');
    await this.waitForPageLoad();
  }
}
