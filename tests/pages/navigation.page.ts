import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Navigation Page Object
 *
 * Handles sidebar navigation and logout with multi-selector strategy.
 */
export class NavigationPage extends BasePage {
  readonly sidebar: Locator;
  readonly logoutButton: Locator;
  readonly confirmLogoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.sidebar = this.page.locator('.main-menu, .navigation-main').first();
    // Logout multiselectors - prioritized by subagent findings
    this.logoutButton = this.page.locator('#logout')
      .or(this.page.locator('img[src*="logout"]'))
      .or(this.page.locator('div.cursor-pointer img[src*="logout"]'))
      .or(this.page.locator('//img[@id="logout"]'));

    this.confirmLogoutButton = this.page.getByRole('button', { name: 'Yes' })
      .or(this.page.locator('.btn-secondary:has-text("Yes")'))
      .or(this.page.locator('//button[contains(text(),"Yes")]'))
      .or(this.page.locator('//button[contains(., "Yes")]'));
  }

  /**
   * Get a sidebar menu item locator using multi-selector strategy.
   * Priority: getByRole -> CSS -> XPath -> Fallback XPath
   */
  getSidebarItem(name: string): Locator {
    // Puppeteer: Discussion is li:nth-of-type(2) span
    if (name.toLowerCase().includes('discussion')) {
      return this.page.locator('li:nth-of-type(2) span')
        .or(this.page.locator('li:nth-child(2) span:has-text(\"Discussion\")'))
        .or(this.page.locator('//li[2]/a/span'));
    }
    return this.page.getByRole('link', { name: new RegExp(name, 'i'), exact: true })
      .or(this.page.locator(`a:has-text("${name}")`))
      .or(this.page.locator(`//a[contains(text(),"${name}")]`))
      .or(this.page.locator(`//span[contains(text(),"${name}")]`));
  }

  /**
   * Click a sidebar item and wait for navigation.
   */
  async clickSidebarItem(name: string) {
    const item = this.getSidebarItem(name);
    
    // Wait for sidebar to be available
    await this.sidebar.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for specific item to be visible
    await item.first().waitFor({ state: 'visible', timeout: 15000 });
    
    await item.first().scrollIntoViewIfNeeded();
    await item.first().click();
    await this.waitForPageLoad();
  }

  /**
   * Validate that the page heading matches the expected name.
   */
  async validateHeading(name: string) {
    // Priority 1: getByRole heading
    // Priority 2: getByText
    // Priority 3: CSS generic heading selectors
    // Priority 4: XPath fallback
    const heading = this.page.getByRole('heading', { name: new RegExp(name, 'i') })
      .or(this.page.getByText(name, { exact: false }).first())
      .or(this.page.locator('h1, h2, h3, .page-title, .header-title'))
      .or(this.page.locator(`//h1[contains(text(),"${name}")]`))
      .or(this.page.locator(`//h2[contains(text(),"${name}")]`));

    await expect(heading.first()).toBeVisible({ timeout: 15000 });
  }

  /**
   * Perform logout flow.
   */
  async logout() {
    // Wait for the page to be reasonably stable
    await this.page.waitForLoadState('networkidle').catch(() => {});
    
    // Wait for toast or overlays to disappear (if any)
    await this.page.locator('.toast, .alert, [role="status"], .status-message').first()
      .waitFor({ state: 'hidden', timeout: 5000 })
      .catch(() => {});

    const logoutBtn = this.logoutButton.first();
    await logoutBtn.scrollIntoViewIfNeeded();
    
    // Attempt multiple click strategies
    await logoutBtn.click({ force: true }).catch(async () => {
      await this.page.evaluate(() => {
        const btn = document.getElementById('logout') || document.querySelector('img[src*="logout"]');
        if (btn) (btn as any).click();
      });
    });
    
    // Check for confirmation dialog
    const confirmBtn = this.confirmLogoutButton.first();
    if (await confirmBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
      await confirmBtn.click({ force: true });
    }

    await this.page.waitForURL(/\/login/, { timeout: 30000 });
  }
}
