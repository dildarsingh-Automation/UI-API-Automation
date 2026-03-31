const { chromium } = require('@playwright/test');
const { config } = require('./tests/utils/environment');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: config.baseURL });
  const page = await context.newPage();
  
  const { LoginPage } = require('./tests/pages/login.page');
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  
  try {
    // using incorrect password to see if it triggers the error message
    // wait, I will use correct first
    await loginPage.login(config.username, config.password);
    console.log("Success URL: ", page.url());
  } catch (e) {
    console.error("Test failed: ", e.message);
    await page.screenshot({ path: 'login_error.png' });
  }

  await browser.close();
})();
