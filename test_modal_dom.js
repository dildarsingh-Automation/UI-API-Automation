const { chromium } = require('playwright');
const fs = require('fs');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto(process.env.BASE_URL + '/login');
  
  console.log('Logging in...');
  await page.waitForLoadState('domcontentloaded');
  // Wait for React to render the form
  await page.waitForTimeout(2000);
  
  await page.fill('input[type="email"], input[placeholder*="email" i]', process.env.TEST_USERNAME || 'dildar.singh@edufusiontech.com');
  await page.fill('input[type="password"], input[placeholder*="password" i]', process.env.TEST_PASSWORD || 'Dildar.@123');
  await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
  
  console.log('Waiting for URL...');
  await page.waitForURL(/\/(dashboard|home)/, { timeout: 30000 });
  console.log('Logged in successfully.');

  console.log('Navigating to discussion...');
  await page.goto(process.env.BASE_URL + '/LMS/discussion');
  
  console.log('Opening modal...');
  await page.click('button:has-text("Create Generic Discussion")');
  
  console.log('Waiting for modal to appear...');
  // Wait for the modal title to be visible to ensure it's rendered
  await page.waitForSelector('text="Create New Discussion"', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(2000); // Wait a bit more for dropdowns to initialize

  console.log('Dumping DOM...');
  const html = await page.content();
  fs.writeFileSync('modal_dom.html', html);
  console.log('DOM saved to modal_dom.html');

  await browser.close();
})();
