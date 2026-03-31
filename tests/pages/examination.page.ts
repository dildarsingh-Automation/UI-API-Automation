import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ExaminationPage extends BasePage {
  readonly createSessionButton: Locator;
  readonly searchInput: Locator;
  readonly examSessionTab: Locator;
  readonly slotsTab: Locator;
  readonly admitCardTab: Locator;

  constructor(page: Page) {
    super(page);

    this.examSessionTab = this.page.getByRole('tab', { name: /Exam Session/i })
      .or(this.page.locator('//button[contains(text(),"Exam Session")]'))
      .or(this.page.locator('.nav-link:has-text("Exam Session")'));

    this.slotsTab = this.page.getByRole('tab', { name: /Slots/i })
      .or(this.page.locator('//button[contains(text(),"Slots")]'))
      .or(this.page.locator('.nav-link:has-text("Slots")'));

    this.admitCardTab = this.page.getByRole('tab', { name: /Admit Card/i })
      .or(this.page.locator('//button[contains(text(),"Admit Card")]'))
      .or(this.page.locator('.nav-link:has-text("Admit Card")'));

    this.createSessionButton = this.page.getByRole('button', { name: /Create New Session/i })
      .or(this.page.locator('button:has-text("Create New Session")'))
      .or(this.page.locator('//button[contains(text(),"Create New Session")]'));

    this.searchInput = this.page.getByPlaceholder(/Search by Session Name/i)
      .or(this.page.locator('input[placeholder*="Search by Session Name"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search by Session Name")]'));
  }

  async navigate() {
    await this.goto('/ERP/examination');
    await this.waitForPageLoad();
  }
}
