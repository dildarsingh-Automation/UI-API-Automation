const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://copilot-student.wowlabz.com/login');
  
  // wait a bit
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'login_start.png' });
  
  await page.fill('input[name="email"], input[type="text"]', 'dildar.singh@edufusiontech.com');
  await page.fill('input[name="password"], input[type="password"]', 'Dildar.@123');
  
  await page.screenshot({ path: 'login_filled.png' });
  
  await page.click('button[type="submit"], button:has-text("Login")');
  
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'login_after_submit.png' });
  
  console.log('Current URL: ', page.url());
  
  await browser.close();
})();
