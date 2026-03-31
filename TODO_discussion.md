# Fix Discussion Tests TODO

## Information Gathered
- `tests/specs/discussion.spec.ts`: Import error (wrong './base.page' path from specs/)
- `tests/pages/discussion.page.ts`: Complex locators for create modal (dropdowns, Quill editor); good but needs page-level waits.
- App: /ERP/discussion requires login → use auth fixtures.

## Plan
1. Fix `discussion.spec.ts`: Correct imports, add beforeEach nav to /ERP/discussion, test create discussion end-to-end.
2. Enhance `discussion.page.ts`: Add waitForPageLoaded(), retry for dropdowns.
3. Tests: navigate, create discussion, verify list, search.

## Steps
1. [ ] Create discussion-fixed.spec.ts
2. [ ] Test `npx playwright test tests/specs/discussion-fixed.spec.ts`
3. [ ] Replace original if passes

Ready to implement?

