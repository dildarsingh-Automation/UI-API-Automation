# Playwright Test Cases Documentation

## Overview
Documented test cases from `discussion.spec.ts`, `erp_core.spec.ts`, and `smoke.spec.ts`. Ready to share with team.

## 1. smoke.spec.ts - Smoke Tests @smoke
**File:** `tests/specs/smoke.spec.ts`

### Test Case: `smoke suite @smoke`
- **Description:** Speed-optimized smoke test verifying core user journey: login → dashboard validation → sidebar/Discussion navigation → logout.
- **Preconditions:** Config creds in `environment.ts`, Chromium browser.
- **Steps:**
  1. Navigate to `/login`, fill username/password from config, submit.
  2. Verify dashboard URL, networkidle.
  3. Validate sidebar visible (`.main-menu, .navigation-main, nav, aside`).
  4. Verify welcome message (`text=/welcome.*dildar/i`).
  5. Click sidebar 'Discussion' → wait domcontentloaded → validate heading (multi-selector).
  6. Logout → verify `/login` URL.
- **Expected Results:** All console logs ✅, final '🎉 SMOKE PASS'.
- **Status:** PASS (16.6s, fixed selector issue).
- **Tags:** `@smoke`
- **Dependencies:** LoginPage, NavigationPage.

---

## 2. discussion.spec.ts - Discussion Functionality @smoke
**File:** `tests/specs/discussion.spec.ts`

### Test Case: `should navigate to dashboard, discussion and create new discussion`
- **Description:** E2E discussion creation using global auth, verifies navigation + full CRUD flow.
- **Preconditions:** Global storageState auth.
- **Steps:**
  1. Navigate to Dashboard, verify title 'University Copilot'.
  2. Click sidebar 'Discussion' (2nd item).
  3. Verify Discussion page heading (`[role="heading"]:has-text("Discussion")`).
  4. Open create modal → Fill form: title (timestamped), Faculty of Basic & Applied Sciences, Master of Science in Mathematics, Announcements, 24SMSAMAT, description 'test'.
  5. Submit → Verify title visible in list.
  6. Logout.
- **Expected Results:** Discussion created & visible, logs '✅ Created discussion: ...' & '✅ Logged out'.
- **Status:** Verified structure (uses fixed smoke patterns).
- **Tags:** `@smoke`
- **Dependencies:** DashboardPage, NavigationPage, DiscussionPage.

---

## 3. erp_core.spec.ts - ERP Core Flows
**File:** `tests/specs/erp_core.spec.ts`

### Test Case 1: `login_logout`
- **Description:** Clean login → dashboard validation → sidebar check → logout cycle.
- **Preconditions:** No storageState (fresh), env vars TEST_USERNAME/PASSWORD or defaults.
- **Steps:**
  1. Navigate to login page, verify email input.
  2. Login with admin@edufusiontech.com / vgu@123.
  3. Verify dashboard URL + welcome banner.
  4. Verify sidebar visible.
  5. Logout → verify login page.
- **Expected Results:** Full cycle completes, inputs visible post-logout.
- **Status:** Core auth test.

### Test Case 2: `menutask`
- **Description:** Login → Navigate all ERP sidebar menus → validate each page heading → logout.
- **Preconditions:** Same as above.
- **Steps:**
  1. Login to dashboard.
  2. For each sidebar item (Dashboard, Discussion, Virtual Class, Course, Program, Role Management, Examination, Grade Report, User Management, Fees Management, Reports, Requests, Announcements, Add On):
     - Click item → validate heading via multi-selector.
  3. Logout.
- **Expected Results:** All 14 navigations succeed, headings match items.
- **Status:** Comprehensive menu coverage.
- **Dependencies:** LoginPage, DashboardPage, NavigationPage.

## Coverage Summary
- **Total Test Cases:** 4
- **Smoke:** 2 (login/nav critical paths)
- **Core:** 2 (auth + full menu)
- **Pages Covered:** Login, Dashboard, Discussion, All ERP modules via nav.
- **Run Command:** `npx playwright test tests/specs/ --reporter=html`

**Ready for team review!** Update statuses as tests run.
