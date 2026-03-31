# Playwright Automation Framework

A production-ready Playwright automation framework for end-to-end testing of ERP applications.

## Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **Fixtures** - Reusable test fixtures for authentication and page objects
- **Environment Variables** - Secure credential management
- **Test Tagging** - Run smoke or regression tests selectively
- **Retry Logic** - Built-in retries for flaky operations
- **Multiple Browsers** - Chrome, Firefox, and mobile testing support
- **Parallel Execution** - Fast test execution
- **Rich Reporting** - HTML, Allure, and JSON reporters

## Project Structure

```
Automation project/
├── tests/
│   ├── fixtures/           # Test fixtures
│   │   └── auth.fixture.ts
│   ├── pages/              # Page Object Models
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── dashboard.page.ts
│   │   ├── navigation.page.ts
│   │   ├── gradeReport.page.ts
│   │   └── userManagement.page.ts
│   ├── specs/              # Test specifications
│   │   ├── login.spec.ts
│   │   ├── dashboard.spec.ts
│   │   └── gradeReport.spec.ts
│   ├── utils/              # Utility functions
│   │   ├── environment.ts
│   │   ├── logger.ts
│   │   └── waitUtils.ts
│   ├── data/               # Test data
│   │   ├── sample-marks.csv
│   │   └── testData.ts
│   ├── global-setup.ts     # Pre-test setup
│   └── global-teardown.ts  # Post-test cleanup
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── .env.example           # Environment variable template
└── package.json
```

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy .env.example to .env and fill in values
cp .env.example .env
```

3. **Set required environment variables in `.env`:**
```env
BASE_URL=https://copilot-student.wowlabz.com
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

## Running Tests

### All Tests
```bash
npx playwright test
```

### Run by Tag
```bash
# Smoke tests only
npx playwright test --grep "@smoke"

# Regression tests only
npx playwright test --grep "@regression"
```

### Specific Browser
```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox
```

### Mobile Tests
```bash
npx playwright test --project="Mobile Chrome"
```

### Headed Mode (Visible Browser)
```bash
HEADLESS=false npx playwright test
```

### With Trace Viewer
```bash
npx playwright test --trace on
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application URL | https://copilot-student.wowlabz.com |
| `TEST_USERNAME` | Login username | Required |
| `TEST_PASSWORD` | Login password | Required |
| `TEST_ENV` | Environment (qa/uat/prod) | qa |
| `CI` | Running in CI | false |
| `SKIP_AUTH` | Skip authentication | false |
| `HEADLESS` | Run in headed mode | true |
| `LOG_LEVEL` | Logging level | INFO |

### Playwright Config Options

- **retries**: 1 for local, 2 for CI
- **workers**: Unlimited for local, 1 for CI
- **timeout**: 300s per test
- **actionTimeout**: 60s per action
- **navigationTimeout**: 60s for page navigation

## Best Practices

### Writing Tests

1. **Use Page Objects** - Keep page interaction logic in page classes
2. **Use Fixtures** - Reuse common setups via fixtures
3. **Avoid Hardcoded Waits** - Use Playwright's auto-wait feature
4. **Use Proper Locators** - Prefer `getByRole`, `getByText`, `getByTestId`
5. **Add Test Tags** - Use `@smoke` and `@regression` tags

### Locator Priority

```typescript
// Best - use data-test attributes
this.page.getByTestId('submit-button')

// Good - semantic roles
this.page.getByRole('button', { name: 'Submit' })

// Good - placeholder text
this.page.getByPlaceholder('Enter email')

// Okay - text content
this.page.getByText('Submit')

// Avoid - CSS selectors when possible
this.page.locator('#submit')
```

### Test Structure

```typescript
test.describe('Feature Name', () => {
  let page: Page;
  let myPage: MyPage;

  test.beforeEach(async ({ page }) => {
    myPage = new MyPage(page);
    await myPage.navigate();
  });

  test('should do something @smoke', async () => {
    // Arrange
    await myPage.doSomething();
    
    // Act
    const result = await myPage.getResult();
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Page Objects

### LoginPage
```typescript
const loginPage = new LoginPage(page);
await loginPage.navigate();
await loginPage.login(username, password);
```

### NavigationPage
```typescript
const navPage = new NavigationPage(page);
await navPage.goToSection('Grade Report');
await navPage.logout();
```

### DashboardPage
```typescript
const dashboardPage = new DashboardPage(page);
await dashboardPage.goto();
const message = await dashboardPage.getWelcomeMessage();
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright test
        env:
          CI: true
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

## Troubleshooting

### Tests Failing Due to Timeout
- Increase timeout in `playwright.config.ts`
- Check if application is slow to respond

### Authentication Issues
- Verify credentials in `.env` file
- Check if `storageState.json` is valid
- Set `SKIP_AUTH=false` to force fresh login

### Flaky Tests
- Tests automatically retry (1 local, 2 CI)
- Add explicit waits instead of hardcoded delays
- Use `force: true` for elements covered by overlays

## Notes

- **CometChat**: This is a third-party chat widget. "CometChat login failed!" messages are non-critical and should not cause test failures.
- **Storage State**: Pre-authenticated state is saved for faster tests.
- **Screenshots**: Automatically captured on test failure in `error-screenshots/`.

## License

MIT

