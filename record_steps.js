const { chromium } = require('playwright');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login fresh
  console.log('Logging in...');
  await page.goto(process.env.BASE_URL + '/login');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', process.env.TEST_USERNAME);
  await page.fill('input[type="password"]', process.env.TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|home|ERP|LMS)/, { timeout: 30000 });
  console.log('Logged in. URL:', page.url());

  console.log('Navigating to discussion page...');
  await page.goto(process.env.BASE_URL + '/LMS/discussion');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for the discussion page to load
  await page.waitForSelector('button:has-text("Create Generic Discussion")', {timeout: 20000});
  await page.waitForTimeout(1000);

  // Click "Create Generic Discussion"
  console.log('Clicking Create Generic Discussion...');
  await page.waitForSelector('button:has-text("Create Generic Discussion")', {timeout: 15000});
  await page.click('button:has-text("Create Generic Discussion")');
  
  // Wait for modal
  await page.waitForSelector('text="Create New Discussion"', {timeout: 10000});
  console.log('Modal opened.');
  await page.waitForTimeout(1000);

  // --- TITLE ---
  const titleInput = await page.$('input[placeholder="Enter discussion title"]');
  if (titleInput) {
    console.log('TITLE: input[placeholder="Enter discussion title"]');
    const testTitle = 'Dildar Singh - AutoTest';
    await titleInput.fill(testTitle);
    console.log(`Filled title: ${testTitle}`);
  } else {
    console.log('TITLE INPUT NOT FOUND');
  }
  await page.waitForTimeout(500);

  // --- FACULTY ---
  console.log('\nLooking for Faculty dropdown...');
  // Try clicking the Faculty section
  const factSelectors = [
    '//div[normalize-space(text())="Faculty *"]/following-sibling::div[1]//div[contains(@class,"control")]',
    '//div[normalize-space(text())="Faculty *"]/following-sibling::div[1]',
    '(//div[contains(@class,"css-1hwfws3")])[1]',
  ];
  for (const sel of factSelectors) {
    try {
      const el = await page.$(`xpath=${sel}`);
      if (el) {
        console.log(`Faculty dropdown found with: xpath=${sel}`);
        await el.click({ force: true });
        await page.waitForTimeout(1000);
        // Click the option
        const optionSel = 'text="Faculty of Basic & Applied Sciences"';
        const opt = await page.$(optionSel);
        if (opt) {
          console.log(`Faculty option found: ${optionSel}`);
          await opt.click();
        } else {
          console.log('Faculty option NOT found, dumping visible options...');
          const options = await page.$$('text=/Faculty/i');
          for (const o of options) {
            console.log('  Option text:', await o.textContent());
          }
        }
        break;
      }
    } catch(e) {
      console.log(`Failed with xpath=${sel}: ${e.message}`);
    }
  }

  await page.waitForTimeout(1000);

  // --- PROGRAM ---
  console.log('\nLooking for Program dropdown...');
  const programSelectors = [
    '//div[normalize-space(text())="Program *"]/following-sibling::div[1]//div[contains(@class,"control")]',
    '//div[normalize-space(text())="Program *"]/following-sibling::div[1]',
  ];
  for (const sel of programSelectors) {
    try {
      const el = await page.$(`xpath=${sel}`);
      if (el) {
        console.log(`Program dropdown found with: xpath=${sel}`);
        await el.click({ force: true });
        await page.waitForTimeout(1000);
        const optionSel = 'text="Master of Science in Mathematics"';
        const opt = await page.$(optionSel);
        if (opt) {
          console.log(`Program option found: ${optionSel}`);
          await opt.click();
        } else {
          console.log('Program option NOT found');
        }
        break;
      }
    } catch(e) {
      console.log(`Failed: ${e.message}`);
    }
  }

  await page.waitForTimeout(1000);

  // --- CATEGORY ---
  console.log('\nLooking for Category dropdown...');
  const catSelectors = [
    'text="Select a category"',
    '//div[normalize-space(text())="Category *"]/following-sibling::div[1]',
  ];
  for (const sel of catSelectors) {
    try {
      const el = sel.startsWith('//') ? await page.$(`xpath=${sel}`) : await page.$(sel);
      if (el) {
        console.log(`Category dropdown found with: ${sel}`);
        await el.click({ force: true });
        await page.waitForTimeout(1000);
        const optionSel = 'text="Announcement for Exam"';
        const opt = await page.$(optionSel);
        if (opt) {
          console.log(`Category option found: ${optionSel}`);
          await opt.click();
        } else {
          console.log('Category option NOT found');
        }
        break;
      }
    } catch(e) {
      console.log(`Failed: ${e.message}`);
    }
  }

  await page.waitForTimeout(1000);

  // --- BATCH ---
  console.log('\nLooking for Batch dropdown...');
  const batchSelectors = [
    'text="Select a batch"',
    '//div[normalize-space(text())="Batch *"]/following-sibling::div[1]',
  ];
  for (const sel of batchSelectors) {
    try {
      const el = sel.startsWith('//') ? await page.$(`xpath=${sel}`) : await page.$(sel);
      if (el) {
        console.log(`Batch dropdown found with: ${sel}`);
        await el.click({ force: true });
        await page.waitForTimeout(1000);
        const optionSel = '//*[contains(text(),"24SMSAMAT")]';
        const opt = await page.$(`xpath=${optionSel}`);
        if (opt) {
          console.log(`Batch option found: xpath=${optionSel}`);
          await opt.click();
        } else {
          console.log('Batch option NOT found, listing visible options...');
          const options = await page.$$('[class*="option"]');
          for (const o of options.slice(0, 5)) {
            console.log('  Option text:', await o.textContent());
          }
        }
        break;
      }
    } catch(e) {
      console.log(`Failed: ${e.message}`);
    }
  }

  await page.waitForTimeout(1000);

  // --- DESCRIPTION ---
  console.log('\nLooking for Description editor...');
  const descSelectors = ['.ql-editor', 'div[contenteditable="true"]'];
  for (const sel of descSelectors) {
    const el = await page.$(sel);
    if (el) {
      console.log(`Description editor found with: ${sel}`);
      await el.click();
      await el.fill('Dildar test automation');
      console.log('Filled description');
      break;
    }
  }

  await page.waitForTimeout(1000);

  // Screenshot before submitting 
  await page.screenshot({ path: 'form_filled.png', fullPage: false });
  console.log('\nScreenshot saved to form_filled.png');

  // --- CREATE ---
  console.log('\nClicking Create button...');
  await page.click('button:has-text("Create")');
  await page.waitForTimeout(2000);

  // Screenshot after submitting
  await page.screenshot({ path: 'form_submitted.png', fullPage: false });
  console.log('Screenshot saved to form_submitted.png');

  // --- LOGOUT ---
  console.log('\nLogging out...');
  try {
    await page.click('#logout, img[src*="logout"]', { force: true });
    await page.waitForTimeout(1000);
    const yesBtn = await page.$('button:has-text("Yes")');
    if (yesBtn) await yesBtn.click();
    await page.waitForURL(/\/login/, { timeout: 15000 });
    console.log('Logged out successfully');
  } catch(e) {
    console.log('Logout error:', e.message);
  }

  await browser.close();
})();
