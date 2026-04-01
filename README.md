# 🚀 Playwright Complete Demo Framework (UI & API)

> **Important Note**: This repository is a sanitized standalone framework. It actively utilizes public demonstration sites (`the-internet.herokuapp.com` and `reqres.in`) to display modern testing architectures and methods. **No confidential project data, real URLs, credentials, or proprietary business logic will be found here.**

## 📖 Overview

A robust, enterprise-level automation framework built with TypeScript and [Playwright](https://playwright.dev/).

This framework integrates end-to-end (E2E) UI testing with detailed API integration tests, providing a generic structure that is robust, parallel-safe, and production-ready.

## 🛠️ Technology Stack

- **Testing Engine:** `Playwright`
- **Language:** `TypeScript`
- **API Testing:** Built-in Playwright Request Context
- **Reporting:** `Playwright HTML Reporter`, `Allure` 
- **Configuration:** `dotenv`
## 🧪 Test Scenarios Covered

### UI Automation

* Login functionality validation (valid & invalid credentials)
* Navigation and page validation
* Form interaction and submission

### API Automation

* GET student data validation by mobile number
* Negative scenarios for invalid input
* Empty and malformed payload validation

### Integration Testing

* API response validation with UI data consistency

### Performance Validation

* Response time checks (e.g., < 2000ms threshold)

## 📁 Repository Architecture

```text
├── .env.example              # Environment secret templates
├── playwright.config.ts      # Core runner config (retries, timeouts, reporters)
├── tests/
│   ├── pages/                # Page Object Model (POM) representations
│   │   ├── base.page.ts      # Abstracted interactions (clicks, assertions)
│   │   └── login.page.ts     # Example Component POM definition
│   ├── specs/                # UI spec definitions (e.g. login.spec.ts)
│   └── api_tests/            # Isolated REST API functional and integration tests
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables Config**
   Rename `.env.example` to `.env`. Modify values if needed. (By default, public URLs and standard demo credentials are set).

3. **Install Browsers**
   ```bash
   npx playwright install --with-deps chromium
   ```

## 🧪 Executing Tests

* **Headless execution (All Tests)**
  ```bash
  npm run test
  ```
  
* **Headed Execution (Visual Mode)**
  ```bash
  npm run test:headed
  ```
  
## 💡 Framework Quality Highlights

- **Agnostic Structure**: Ready to be cloned and integrated over any domain via `.env`.
- **Page Object Model (POM)**: Enforced object-oriented layout inside `/pages`.
- **Advanced Selectors**: Emphasizes generic role testing or unique attribute targeting for robustness.
- **Flakiness Mitigation**: Out-of-the-box parallelization capability combined with a configurable retry-hierarchy (`CI=1`/`Local=0`).
- **Resilient Waiting**: Complete removal of arbitrary `page.waitForTimeout` logic in favor of internal Playwright web-first assertions and actionability checks.

- ## 📊 Execution Report (Sample)

The framework generates detailed Playwright HTML reports including:

* Step-by-step execution logs
* API request/response validation
* Performance checks (response time monitoring)
* Pass/Fail summary

![Sample Report](./assets/report.png)


- <img width="1711" height="910" alt="image" src="https://github.com/user-attachments/assets/60918c5c-c969-40d7-8117-8c775ec2474d" />

