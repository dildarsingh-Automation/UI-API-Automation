const { chromium } = require('@playwright/test');
const { config } = require('./tests/utils/environment');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: config.baseURL });
  const page = await context.newPage();
  
  const { LoginPage } = require('./tests/pages/login.page');
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login(config.username, config.password);
  
  await page.waitForLoadState('networkidle');
  console.log("URL is: ", page.url());
  
  const links = await page.$$eval('a', as => as.map(a => `<a href="${a.href}">${a.textContent.trim().replace(/\n/g, ' ')}</a>`));
  console.log("LINKS on Dashboard:");
  console.log(links.join('\n'));
  
  const headings = await page.$$eval('h1, h2', hs => hs.map(h => `<${h.tagName.toLowerCase()}>${h.textContent.trim()}</${h.tagName.toLowerCase()}>`));
  console.log("HEADINGS on Dashboard:");
  console.log(headings.join('\n'));
  
  await browser.close();
})();
