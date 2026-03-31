const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'https://copilot-student.wowlabz.com' });
  const page = await context.newPage();
  
  await page.goto('/login');
  await page.fill('input[name="email"], input[type="text"]', 'dildar.singh@edufusiontech.com');
  await page.fill('input[name="password"], input[type="password"]', 'Dildar.@123');
  await page.click('button[type="submit"], button:has-text("Login")');
  
  await page.waitForLoadState('networkidle');
  console.log("URL is: ", page.url());
  
  const links = await page.$$eval('a', as => as.map(a => `<a href="${a.getAttribute('href')}">${a.textContent.trim().replace(/\n/g, ' ')}</a>`));
  console.log("LINKS on Dashboard:");
  console.log(links.filter(l => l.includes('Discussion') || l.includes('discussion') || l.includes('Course') || l.includes('Report')).join('\n'));
  
  const headings = await page.$$eval('h1, h2, div, span', hs => hs
    .filter(h => h.textContent.toLowerCase().includes('welcome'))
    .map(h => `<${h.tagName.toLowerCase()} class="${h.className}">${h.textContent.trim()}</${h.tagName.toLowerCase()}>`)
  );
  console.log("Elements with 'welcome':");
  console.log(headings.slice(0, 5).join('\n'));
  
  await browser.close();
})();
