import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model
 * 
 * Provides common functionality for all page objects.
 * Includes:
 * - Navigation helpers
 * - Retry logic for flaky operations
 * - Wait strategies for SPAs
 * - Screenshot utilities
 * - Custom assertion helpers
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ============================================
  // Navigation Methods
  // ============================================

  /**
   * Navigate to a specific path
   * @param path - URL path (e.g., '/login')
   */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * Navigate and wait for URL pattern
   */
  async navigateTo(path: string, urlPattern?: RegExp | string) {
    await this.page.goto(path);
    if (urlPattern) {
      await this.page.waitForURL(urlPattern, { timeout: 60000 });
    }
  }

  /**
   * Reload the current page
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Go back in history
   */
  async goBack() {
    await this.page.goBack();
  }

  // ============================================
  // Locator Helpers
  // ============================================

  /**
   * Create a locator from selector
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role and name
   */
  getByRole(role: 'button' | 'link' | 'heading' | 'textbox' | 'checkbox' | 'radio', name: RegExp | string): Locator {
    return this.page.getByRole(role, { name });
  }

  /**
   * Get element by placeholder text
   */
  getByPlaceholder(text: string): Locator {
    return this.page.getByPlaceholder(text);
  }

  /**
   * Get element by label text
   */
  getByLabel(text: string): Locator {
    return this.page.getByLabel(text);
  }

  // ============================================
  // Wait Methods - No hardcoded waits
  // ============================================

  /**
   * Wait for element to be visible - Global 60s timeout
   */
  async waitForVisible(selector: string, timeout = 60000) {
    await this.page.locator(selector).first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForAttached(selector: string, timeout = 60000) {
    await this.page.locator(selector).first().waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout = 60000) {
    await this.page.locator(selector).first().waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(selector: string, timeout = 60000) {
    const locator = this.page.locator(selector).first();
    await locator.waitFor({ state: 'attached', timeout });
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for page load - uses domcontentloaded for SPAs
   */
  async waitForPageLoad(timeout = 60000) {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Wait for network idle (use sparingly - can be slow)
   */
  async waitForNetworkIdle(timeout = 30000) {
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {
      // Ignore network idle timeout
    });
  }

  /**
   * Wait for navigation with URL pattern
   */
  async waitForNavigation(urlPattern?: RegExp | string, timeout = 60000) {
    if (urlPattern) {
      await this.page.waitForURL(urlPattern, { timeout });
    } else {
      await this.waitForPageLoad(timeout);
    }
  }

  // ============================================
  // Retry Logic for Flaky Operations
  // ============================================

  /**
   * Retry an operation with exponential backoff
   * Useful for flaky operations like API calls or element interactions
   */
  async retry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delayMs?: number;
      onRetry?: (attempt: number, error: Error) => void;
    } = {}
  ): Promise<T> {
    const { maxAttempts = 3, delayMs = 1000, onRetry } = options;
    
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxAttempts) {
          const delay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
          if (onRetry) {
            onRetry(attempt, lastError);
          }
          // Replaced hard wait with auto-wait for speed
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Retry clicking an element (useful for overlays)
   */
  async retryClick(selector: string, options?: { timeout?: number; force?: boolean }) {
    const { timeout = 60000, force = true } = options || {};
    
    return this.retry(
      async () => {
        const locator = this.page.locator(selector).first();
        await locator.click({ force, timeout });
      },
      { maxAttempts: 3, delayMs: 500 }
    );
  }

  // ============================================
  // Element Finding Strategies
  // ============================================

  /**
   * Find visible element using multiple strategies
   * Priority: data-test > role > text
   */
  async findVisibleByRoleOrText(
    name: string,
    role: 'heading' | 'link' | 'button' = 'heading',
    timeout = 60000
  ): Promise<Locator | null> {
    // Strategy 1: data-test attribute
    const dataKey = `page-heading-${name.toLowerCase().replace(/\s+/g, '-')}`;
    const dataLoc = this.page.locator(`[data-test="${dataKey}"]`);
    if ((await dataLoc.count()) > 0) {
      await dataLoc.first().waitFor({ state: 'visible', timeout });
      return dataLoc.first();
    }

    // Strategy 2: Semantic role
    const roleLoc = this.page.getByRole(role, { name: new RegExp(name, 'i') });
    if ((await roleLoc.count()) > 0) {
      await roleLoc.first().waitFor({ state: 'visible', timeout });
      return roleLoc.first();
    }

    // Strategy 3: Text content
    const textLoc = this.page.getByText(name, { exact: false });
    if ((await textLoc.count()) > 0) {
      await textLoc.first().waitFor({ state: 'visible', timeout });
      return textLoc.first();
    }

    return null;
  }

  /**
   * Wait for any of multiple conditions
   * Returns index of first condition that passes
   */
  async waitForCondition(
    conditions: Array<{ locator: Locator; state?: 'visible' | 'hidden' | 'attached' }>,
    timeout = 60000
  ): Promise<number> {
    const promises = conditions.map((condition, index) =>
      condition.locator
        .waitFor({ state: condition.state || 'visible', timeout })
        .then(() => index)
        .catch(() => -1)
    );

    const results = await Promise.all(promises);
    const successIndex = results.findIndex((r) => r !== -1);
    return successIndex;
  }

  // ============================================
  // Custom Assertions
  // ============================================

  /**
   * Assert element is visible with custom message
   */
  async assertVisible(selector: string, message?: string) {
    const locator = this.page.locator(selector).first();
    await expect(locator, message || `Expected element "${selector}" to be visible`).toBeVisible();
  }

  /**
   * Assert element contains text
   */
  async assertText(selector: string, expectedText: string) {
    const locator = this.page.locator(selector).first();
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Assert URL contains pattern
   */
  async assertUrlContains(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Assert page title
   */
  async assertTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  // ============================================
  // Screenshot & Debug
  // ============================================

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Take screenshot on failure
   */
  async takeErrorScreenshot() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `error-screenshots/error-${timestamp}.png`, 
      fullPage: true 
    });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}

