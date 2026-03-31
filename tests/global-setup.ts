import { chromium, expect } from '@playwright/test';
import * as fs from 'fs';
import { config } from './utils/environment';
import { LoginPage } from './pages/login.page';

/**
 * Global Setup — runs once before all tests.
 *
 * Performs a single authenticated login and saves the browser storage state
 * to `storageState.json` so that individual tests can skip re-logging in.
 *
 * If storageState.json already exists and is less than 24 hours old,
 * it will be reused instead of logging in again.
 *
 * Uses LoginPage POM for consistency — if the login selector changes,
 * only login.page.ts needs updating.
 */

const STORAGE_STATE_FILE = 'storageState.json';
const MAX_AGE_HOURS = 24;

function isStorageStateValid(): boolean {
  try {
    if (!fs.existsSync(STORAGE_STATE_FILE)) {
      return false;
    }
    const stats = fs.statSync(STORAGE_STATE_FILE);
    const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
    return ageInHours < MAX_AGE_HOURS;
  } catch {
    return false;
  }
}

export default async () => {
  // Check if valid storage state already exists
  if (isStorageStateValid()) {
    console.log('✅ Global setup: using existing login session (less than 24 hours old)');
    return;
  }

  console.log('🔐 Global setup: performing fresh login...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: config.baseURL,
  });
  const page = await context.newPage();

  // Use LoginPage POM — keeps selectors in one place
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(config.username, config.password);

  // Verify login success - fails if still on login
  await expect(page).not.toHaveURL(/login/, { timeout: 30000 });
  console.log('✅ Global setup: login successful. Final URL:', page.url());

  // Persist the authenticated session for all tests
  await context.storageState({ path: STORAGE_STATE_FILE });

  await browser.close();
};
