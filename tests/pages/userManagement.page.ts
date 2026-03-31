import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * User Management Page Object
 *
 * Covers search, add-user form, table, and tabs (Staff, Students).
 */
export class UserManagementPage extends BasePage {
  readonly staffTab: Locator;
  readonly studentTab: Locator;

  constructor(page: Page) {
    super(page);

    this.staffTab = this.page.getByRole('tab', { name: /Staff/i })
      .or(this.page.locator('//button[contains(text(),"Staff")]'))
      .or(this.page.locator('.nav-link:has-text("Staff")'));

    this.studentTab = this.page.getByRole('tab', { name: /Students/i })
      .or(this.page.locator('//button[contains(text(),"Students")]'))
      .or(this.page.locator('.nav-link:has-text("Students")'));
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/Search Users/i)
      .or(this.page.locator('input[placeholder*="Search"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search")]'));
  }

  get addButton(): Locator {
    return this.page.getByRole('button', { name: /Add New Staff|Add New Student/i })
      .or(this.page.locator('button:has-text("Add New")'))
      .or(this.page.locator('//button[contains(text(),"Add New")]'));
  }

  get tableRows(): Locator {
    return this.page.locator('table tbody tr')
      .or(this.page.locator('.user-table tr'));
  }

  get modal(): Locator {
    return this.page.locator('.modal-content')
      .or(this.page.locator('//div[contains(@class, "modal")]'));
  }

  get modalName(): Locator {
    return this.modal.getByLabel(/Name/i)
      .or(this.modal.locator('input[name*="name"]'));
  }

  get modalEmail(): Locator {
    return this.modal.getByLabel(/Email/i)
      .or(this.modal.locator('input[name*="email"]'));
  }

  get modalSave(): Locator {
    return this.modal.getByRole('button', { name: /Save|Submit/i })
      .or(this.modal.locator('button.btn-primary'));
  }

  get modalCancel(): Locator {
    return this.modal.getByRole('button', { name: /cancel/i })
      .or(this.modal.locator('button.btn-secondary'));
  }

  get toastMessage(): Locator {
    return this.page.locator('.toast-success')
      .or(this.page.locator('.alert-success'));
  }

  async navigate() {
    await this.goto('/ERP/user-management');
    await this.page.waitForLoadState('networkidle');
  }

  async search(term: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickAdd() {
    await this.addButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async fillAddForm(name: string, email: string) {
    await this.modalName.fill(name);
    await this.modalEmail.fill(email);
  }

  async saveNewUser() {
    await this.modalSave.click();
    await this.modal.waitFor({ state: 'hidden' }).catch(() => {});
  }

  async getFirstRowText(): Promise<string> {
    return (await this.tableRows.first().textContent())?.trim() ?? '';
  }

  async expectRowCount(expected: number) {
    await expect(this.tableRows).toHaveCount(expected);
  }

  async expectToast(text: string) {
    await expect(this.toastMessage).toContainText(text);
  }

  async createUser(name: string, email: string) {
    await this.clickAdd();
    await this.fillAddForm(name, email);
    await this.saveNewUser();
  }
}
