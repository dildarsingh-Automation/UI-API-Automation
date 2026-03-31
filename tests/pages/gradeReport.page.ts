import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Grade Report Page Object
 *
 * Handles marks upload and report viewing.
 * Uses multi-selector strategy for robustness.
 */
export class GradeReportPage extends BasePage {
  readonly uploadMarksButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.uploadMarksButton = this.page.getByRole('button', { name: /Upload Marks/i })
      .or(this.page.locator('button:has-text("Upload Marks")'))
      .or(this.page.locator('//button[contains(text(),"Upload Marks")]'));

    this.searchInput = this.page.getByPlaceholder(/Search by Session Name/i)
      .or(this.page.locator('input[placeholder*="Search by Session Name"]'))
      .or(this.page.locator('//input[contains(@placeholder, "Search by Session Name")]'));
  }

  get uploadInput(): Locator {
    return this.page.locator('input[type="file"]')
      .or(this.page.locator('input[name="file"]'))
      .or(this.page.locator('//input[@type="file"]'));
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /upload|submit|save/i })
      .or(this.page.locator('button.btn-primary:has-text("Upload")'))
      .or(this.page.locator('//button[contains(text(),"Upload")]'));
  }

  get successBanner(): Locator {
    return this.page.locator('.toast-success')
      .or(this.page.locator('.alert-success'))
      .or(this.page.locator('//div[contains(@class, "success")]'));
  }

  get errorBanner(): Locator {
    return this.page.locator('.toast-error')
      .or(this.page.locator('.alert-danger'))
      .or(this.page.locator('//div[contains(@class, "error")]'));
  }

  get loadingIndicator(): Locator {
    return this.page.locator('.spinner')
      .or(this.page.locator('[data-test="loading"]'));
  }

  /**
   * Navigate directly to the grade report page.
   */
  async navigate() {
    await this.goto('/ERP/grade-report');
    await this.waitForPageLoad();
  }

  /**
   * Upload a marks CSV file.
   */
  async uploadMarks(filePath: string) {
    await this.uploadInput.waitFor({ state: 'attached' });
    await this.uploadInput.setInputFiles(filePath);

    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();

    await this.loadingIndicator.waitFor({ state: 'hidden' }).catch(() => {});
    await this.successBanner.waitFor({ state: 'visible' });
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successBanner.textContent().catch(() => ''))?.trim() ?? '';
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorBanner.textContent().catch(() => ''))?.trim() ?? '';
  }
}
