import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RoleManagementPage extends BasePage {
  readonly searchInput: Locator;
  readonly roleTable: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = this.page.getByPlaceholder(/Search Role/i)
      .or(this.page.locator('input[placeholder*="Search"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search")]'));

    this.roleTable = this.page.locator('table')
      .or(this.page.locator('.role-list-container'))
      .or(this.page.locator('//table'));
  }

  async navigate() {
    await this.goto('/ERP/role-management');
    await this.waitForPageLoad();
  }

  async editRole(roleName: string) {
    const row = this.page.locator(`tr:has-text("${roleName}")`);
    await row.locator('button:has-text("Edit")').click();
  }
}
