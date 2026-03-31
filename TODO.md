# Fix Discussion Test Failure - Approved Plan

## Steps:
- [x] 1. Edit navigation.page.ts: Add waits for sidebar and item visibility in clickSidebarItem()
- [x] 2. Edit discussion.spec.ts: Add dashboard verification after navigate()
- [x] 3. Test: npx playwright test tests/specs/discussion.spec.ts
- [x] 4. If fails, delete storageState.json && rerun for fresh auth
- [ ] 5. Complete: attempt_completion

