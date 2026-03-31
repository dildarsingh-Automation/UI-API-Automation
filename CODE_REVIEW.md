# Code Review: Selenium Java Style Playwright Automation

This document reviews the Playwright TypeScript automation code and identifies issues, flaky test risks, bad locator strategies, synchronization issues, and provides corrected versions with explanations.

---

## 1. Code Issues Found & Fixed

### 1.1 Hardcoded Credentials (Security Risk)
**Location:** `tests/utils/environment.ts`
**Issue:** Credentials hardcoded directly in source code.
```typescript
// BEFORE (INSECURE)
username: 'dildar.singh@edufusiontech.com',
password: 'Dildar.@123',
```
**Fix:** Use environment variables or secrets management:
```typescript
// AFTER (IMPROVED)
username: process.env.TEST_USERNAME || 'default_user',
password: process.env.TEST_PASSWORD || 'default_pass',
```

### 1.2 Weak Password Locator
**Location:** `tests/pages/login.page.ts`
**Issue:** Using bullet characters as placeholder text is extremely fragile.
```typescript
// BEFORE (FRAGILE)
return this.page.getByRole('textbox', { name: '············' });
```
**Fix:** Use label-based selectors:
```typescript
// AFTER (STABLE)
return this.page.getByLabel(/password/i);
```

### 1.3 Deprecated Selector Syntax
**Location:** `tests/pages/base.page.ts`
**Issue:** Using deprecated `text=` selector syntax.
```typescript
// BEFORE (DEPRECATED)
const textLoc = this.page.locator(`text="${name}"`);
```
**Fix:** Use getByText method:
```typescript
// AFTER (CURRENT)
const textLoc = this.page.getByText(name, { exact: false });
```

### 1.4 Global Variable for Test State
**Location:** `tests/specs/userManagement.api.spec.ts`
**Issue:** Using global `let createdUser` variable - not thread-safe.
```typescript
// BEFORE (NOT THREAD-SAFE)
let createdUser: { id: number; name: string; email: string };
```
**Fix:** Use test context or describe block scope:
```typescript
// AFTER (SAFE FOR PARALLELISM)
test.describe.serial('User Management', () => {
  let createdUser = null;
  // ...
});
```

---

## 2. Flaky Test Risks Identified

### 2.1 Network Idle Waits
**Location:** Multiple files (`navigation.page.ts`, `userManagement.page.ts`, etc.)
**Issue:** Using `waitForNetworkIdle()` and `networkidle` load state - these are unreliable in SPAs because many applications have background polling.
```typescript
// BEFORE (FLAKY)
await this.page.waitForLoadState('networkidle');
```
**Fix:** Use `domcontentloaded` or wait for specific elements:
```typescript
// AFTER (STABLE)
await this.page.waitForLoadState('domcontentloaded');
// Or better - wait for specific element
await this.page.locator('.my-element').waitFor({ state: 'visible' });
```

### 2.2 Improper Try-Catch in Tests
**Location:** `tests/specs/gradeReport.spec.ts`
**Issue:** Swallowing exceptions and hiding real test failures.
```typescript
// BEFORE (HIDES FAILURES)
try {
  await grade.uploadMarks(marksFile);
} catch (err) {
  await page.screenshot(...);
  throw err;
}
```
**Fix:** Use Playwright's built-in screenshot on failure:
```typescript
// AFTER (PROPER)
test.describe('Grade Report Module', () => {
  test('admin can upload marks...', async ({ page }) => {
    // Playwright automatically captures screenshots on failure
    // when configured in playwright.config.ts
  });
});
```

### 2.3 Serial Test Dependencies
**Location:** `tests/specs/userManagement.api.spec.ts`
**Issue:** Tests depend on each other through shared global state.
**Fix:** Use `test.describe.serial` and proper cleanup in `afterEach`:
```typescript
test.afterEach(async ({ request }) => {
  if (!createdUser) return;
  try {
    await request.delete(...);
  } catch (e) {
    console.warn(`Cleanup failed: ${e.message}`);
  }
  createdUser = null;
});
```

---

## 3. Bad Locator Strategies

### 3.1 Text-Based Locators
**Issue:** Using partial text matches that can break with minor UI changes.
```typescript
// AVOID
this.page.locator('text=Discussion');
this.page.getByRole('link', { name: 'Discussion', exact: false });
```
**Fix:** Use data-test attributes or more specific selectors:
```typescript
// PREFERRED
this.page.locator('[data-test="nav-discussion"]');
this.page.getByRole('link', { name: /^Discussion$/i });
```

### 3.2 CSS Selectors Without Semantics
**Issue:** Using generic CSS selectors like `table#users tbody tr`.
```typescript
// LESS STABLE
this.page.locator('table#users tbody tr');
```
**Fix:** Add data-test attributes to the application:
```typescript
// MORE STABLE
this.page.getByRole('row');
// With data-test
this.page.locator('[data-test="user-row"]');
```

---

## 4. Synchronization Issues

### 4.1 No Wait for Element Attachment
**Issue:** Checking visibility without ensuring element is in DOM.
```typescript
// BEFORE (RACE CONDITION)
await locator.isVisible();
```
**Fix:** Always wait for element state first:
```typescript
// AFTER (PROPER)
await locator.waitFor({ state: 'visible', timeout: 10000 });
const isVisible = await locator.isVisible();
```

### 4.2 Not Waiting After Navigation
**Issue:** Performing actions immediately after navigation without waiting.
```typescript
// BEFORE (CAN FAIL)
await page.goto('/page');
await page.click('button'); // May fail if page not loaded
```
**Fix:** Wait for page load or specific element:
```typescript
// AFTER
await page.goto('/page');
await page.waitForLoadState('domcontentloaded');
await page.locator('button').waitFor({ state: 'visible' });
```

### 4.3 Pre-filled Form Fields
**Issue:** Not clearing fields before filling - can append to existing values.
```typescript
// BEFORE (CAN APPEND)
await this.emailInput.fill(username);
```
**Fix:** Clear first:
```typescript
// AFTER
await this.emailInput.clear();
await this.emailInput.fill(username);
```

---

## 5. Performance Improvements

### 5.1 Excessive Timeout Values
**Issue:** Using very long timeouts (30000ms+) that slow down tests.
**Fix:** Use reasonable timeouts with retry logic:
```typescript
// IMPROVED
await element.waitFor({ state: 'visible', timeout: 10000 });
```

### 5.2 Unnecessary Parallel Waits
**Issue:** Using `Promise.all` for sequential operations.
**Fix:** Use sequential waits where needed:
```typescript
// Only use Promise.all when operations are truly independent
await Promise.all([
  page1.click('btn1'),
  page2.click('btn2'),
]);
```

---

## 6. Best Practice Improvements

### 6.1 Missing Test Annotations
**Fix:** Add descriptive test annotations:
```typescript
test.slow('admin can upload marks and see success message', async ({ page }) => {
  // Test implementation
});
```

### 6.2 No Page Object Reuse
**Issue:** Creating new page objects in every test without fixture.
**Fix:** Use Playwright fixtures:
```typescript
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

### 6.3 No Custom Assertion Messages
**Fix:** Add custom messages for better debugging:
```typescript
expect(msg, 'Success message should contain "uploaded successfully"').toContain('uploaded successfully');
```

---

## Summary of Files Modified

| File | Changes |
|------|---------|
| `tests/pages/login.page.ts` | Fixed password locator, added verifyLoggedIn(), improved wait strategies |
| `tests/pages/base.page.ts` | Fixed deprecated selectors, improved wait methods |
| `tests/pages/navigation.page.ts` | Removed networkidle, added proper SPA navigation |
| `tests/pages/gradeReport.spec.ts` | Removed try-catch anti-pattern, added proper test structure |
| `tests/pages/userManagement.page.ts` | Improved locators, fixed synchronization |
| `tests/specs/userManagement.api.spec.ts` | Fixed global variable, added proper cleanup |
| `tests/specs/login.spec.ts` | Fixed test logic |
| `tsconfig.json` | Created for proper TypeScript support |

---

## Recommended Configuration Additions

Add to `playwright.config.ts`:
```typescript
use: {
  // ... existing config
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  actionTimeout: 10000,
  navigationTimeout: 30000,
},
```

---

## Conclusion

The original code had several issues that could cause flaky tests:
1. Using deprecated/fragile locators
2. Network idle waits inappropriate for SPAs
3. Global state between tests
4. Improper error handling

The corrected version addresses all these issues while maintaining the same test coverage with more stable, maintainable, and performant tests.

