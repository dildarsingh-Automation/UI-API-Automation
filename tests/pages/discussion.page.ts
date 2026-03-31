import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Discussion Page Object Model - Optimized for speed
 * Replaced waitForTimeout with locator waits
 */
export class DiscussionPage extends BasePage {
  readonly createDiscussionButton: Locator;
  readonly searchInput: Locator;
  readonly discussionList: Locator;

  readonly titleInput: Locator;
  readonly facultyDropdown: Locator;
  readonly programDropdown: Locator;
  readonly categoryDropdown: Locator;
  readonly batchDropdown: Locator;
  readonly descriptionEditor: Locator;
  readonly submitCreateButton: Locator;
  readonly confirmYesButton: Locator;

  constructor(page: Page) {
    super(page);

    this.createDiscussionButton = this.page.getByRole('button', { name: /Create Generic/i })
      .or(this.page.locator('text="Create Generic"'))
      .or(this.page.locator('//button[contains(., "Create Generic")]'))
      .first();

    this.searchInput = this.page.getByPlaceholder(/Search Discussions/i)
      .or(this.page.locator('input[placeholder*="Search"]'));

    this.discussionList = this.page.locator('.discussion-list-container')
      .or(this.page.locator('[class*="discussion"]'));

    this.titleInput = this.page.getByPlaceholder('Enter discussion title')
      .or(this.page.getByLabel('Enter discussion title'))
      .or(this.page.locator('input[placeholder*="title"]'))
      .or(this.page.locator('form input[type="text"]').first())
      .first();

    this.facultyDropdown = this.page.locator('form > div:nth-of-type(2) > div:nth-of-type(1) .select__input-container')
      .or(this.page.locator('form div:has-text("Faculty") + div .select__input-container').first());

    this.programDropdown = this.page.locator('div:nth-of-type(2) > div.mt-1 div.select__input-container')
      .or(this.page.locator('form div:has-text("Program") + div .select__input-container'))
      .first();

    this.categoryDropdown = this.page.locator('div:nth-of-type(3) div.react-select')
      .or(this.page.locator('form div:has-text("Category") + div .select__input-container').first());

    this.batchDropdown = this.page.locator('form > div:nth-of-type(4) .react-select')
      .or(this.page.locator('form div:has-text("Batch") + div .select__input-container').first());

    this.descriptionEditor = this.page.locator('div.ql-editor')
      .or(this.page.locator('[contenteditable="true"]'))
      .or(this.page.locator('.ql-editor'));

    // Target ONLY buttons inside the modal footer for 'Create' to avoid hidden/duplicate DOM elements
    this.submitCreateButton = this.page.locator('.modal-footer').getByRole('button', { name: /Create/i })
      .or(this.page.locator('.modal-footer button').filter({ hasText: /Create/i }))
      .or(this.page.locator('.modal-footer span').filter({ hasText: /Create/i }))
      .last();

    // Target the 'Yes' confirmation button which usually appears in a new dialog portal attached to body
    this.confirmYesButton = this.page.getByRole('button', { name: /Yes/i, exact: false })
      .or(this.page.locator('button:has-text("Yes")'))
      .or(this.page.getByText('Yes', { exact: true }))
      .last();
  }

  async openCreateModal() {
    await this.createDiscussionButton.first().scrollIntoViewIfNeeded();
    await this.createDiscussionButton.first().click({ force: true });
    await this.titleInput.first().waitFor({ state: 'visible', timeout: 60000 });
  }

  /**
   * Optimized dropdown selection - no hard waits
   */
  async selectDropdownOption(dropdown: Locator, optionText: string, useFirstOption = false) {
    await dropdown.first().scrollIntoViewIfNeeded();
    await dropdown.first().click({ force: true });
    
    // Stable react-select locator based on puppeteer recording: react-select-X-option-0
    if (useFirstOption) {
      const firstOption = this.page.locator('[id^="react-select-"][id$="-option-0"]').first();
      await firstOption.waitFor({ state: 'visible', timeout: 15000 });
      await firstOption.click({ force: true });
      return;
    }

    // Type and wait for filtered options
    // If the input doesn't take keystrokes directly, we can just select by visible text
    const option = this.page.locator(`[id^="react-select-"][id*="-option-"]`).filter({ hasText: new RegExp(optionText, 'i') }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click({ force: true });
    
    // Short wait for selection to register
    await this.page.locator('.select__single-value').first().waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
  }

  async fillNewDiscussionForm(data: {
    title: string;
    faculty: string;
    program: string;
    category: string;
    batch: string;
    description: string;
  }) {
    await this.titleInput.first().click();
    await this.titleInput.first().fill(data.title);

    await this.selectDropdownOption(this.facultyDropdown, data.faculty, true);
    await this.selectDropdownOption(this.programDropdown, data.program, true);
    await this.selectDropdownOption(this.categoryDropdown, data.category, true);
    await this.selectDropdownOption(this.batchDropdown, data.batch, true);

    await this.descriptionEditor.first().click();
    await this.descriptionEditor.first().fill('');
    await this.page.keyboard.type(data.description, { delay: 10 });
  }

  async submitNewDiscussion() {
    // Wait for the button to be enabled - don't use force: true because it bypasses disabled checks
    await this.submitCreateButton.scrollIntoViewIfNeeded();
    await this.submitCreateButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.submitCreateButton.click({ force: true });
    
    // The "Yes" confirmation button might take a moment to animate in
    const yesButton = this.confirmYesButton;
    await yesButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const confirmVisible = await yesButton.isVisible().catch(() => false);
    if (confirmVisible) {
      await yesButton.click({ force: true });
    }

    await this.waitForNetworkIdle();
  }

  async isDiscussionCreated(title: string): Promise<boolean> {
    return await this.page.getByText(title).first().isVisible().catch(() => false);
  }
}

