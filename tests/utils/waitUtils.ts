import { Page, Locator } from '@playwright/test';

/**
 * Wait Utilities
 *
 * Standalone helpers for Playwright wait operations.
 * These are alternatives to raw page.waitForLoadState / page.waitForURL calls,
 * providing a consistent interface with warning-on-timeout instead of hard failures.
 *
 * All timeouts here align with playwright.config.ts defaults (actionTimeout/navigationTimeout).
 */

/**
 * Wait for the DOM to be fully loaded (domcontentloaded).
 * Suitable for SPAs where network never truly goes idle.
 */
export async function waitForDomReady(page: Page, timeout = 60000) {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout });
  } catch (e) {
    console.warn('waitForDomReady:', (e as Error).message);
  }
}

/**
 * Wait for outstanding AJAX / fetch requests to settle.
 * Uses domcontentloaded — networkidle is unreliable in SPA apps with background polling.
 */
export async function waitForAjax(page: Page, timeout = 30000) {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout });
  } catch (e) {
    console.warn('waitForAjax:', (e as Error).message);
  }
}

/**
 * Wait for an element to become visible, warning (not throwing) on timeout.
 */
export async function waitForElementVisible(page: Page, selector: string, timeout = 30000) {
  try {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout });
  } catch (e) {
    console.warn(`waitForElementVisible(${selector}):`, (e as Error).message);
  }
}

/**
 * Wait for the page URL to match a pattern, warning (not throwing) on timeout.
 */
export async function waitForUrl(page: Page, pattern: string | RegExp, timeout = 60000) {
  try {
    await page.waitForURL(pattern, { timeout });
  } catch (e) {
    console.warn('waitForUrl:', (e as Error).message);
  }
}

/**
 * Wait for a locator to reach a given state, returning the locator (or null on timeout).
 */
export async function waitForLocator(
  page: Page,
  selector: string,
  state: 'visible' | 'hidden' | 'attached' = 'visible',
  timeout = 30000
): Promise<Locator | null> {
  const locator = page.locator(selector).first();
  try {
    await locator.waitFor({ state, timeout });
    return locator;
  } catch (e) {
    console.warn(`waitForLocator(${selector}, ${state}):`, (e as Error).message);
    return null;
  }
}

/**
 * @deprecated Use waitForDomReady instead — same behaviour, correct name.
 */
export const waitForNetworkIdle = waitForDomReady;
