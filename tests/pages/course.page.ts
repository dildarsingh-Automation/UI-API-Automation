import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CoursePage extends BasePage {
  readonly createCourseButton: Locator;
  readonly searchInput: Locator;
  readonly draftTab: Locator;
  readonly publishedTab: Locator;
  readonly unassignedTab: Locator;
  readonly assignedTab: Locator;

  constructor(page: Page) {
    super(page);

    this.draftTab = this.page.getByRole('tab', { name: /Draft/i })
      .or(this.page.locator('//button[contains(text(),"Draft")]'))
      .or(this.page.locator('.nav-link:has-text("Draft")'));

    this.publishedTab = this.page.getByRole('tab', { name: /Published/i })
      .or(this.page.locator('//button[contains(text(),"Published")]'))
      .or(this.page.locator('.nav-link:has-text("Published")'));

    this.unassignedTab = this.page.getByRole('tab', { name: /Unassigned/i })
      .or(this.page.locator('//button[contains(text(),"Unassigned")]'))
      .or(this.page.locator('.nav-link:has-text("Unassigned")'));

    this.assignedTab = this.page.getByRole('tab', { name: /Assigned/i })
      .or(this.page.locator('//button[contains(text(),"Assigned")]'))
      .or(this.page.locator('.nav-link:has-text("Assigned")'));

    this.createCourseButton = this.page.getByRole('button', { name: /Create New Course/i })
      .or(this.page.locator('button:has-text("Create New Course")'))
      .or(this.page.locator('//button[contains(text(),"Create New Course")]'));

    this.searchInput = this.page.getByPlaceholder(/Search Course/i)
      .or(this.page.locator('input[placeholder*="Search Course"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search Course")]'));
  }

  async navigate() {
    await this.goto('/ERP/course');
    await this.waitForPageLoad();
  }
}
