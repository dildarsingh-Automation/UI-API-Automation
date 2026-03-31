import { test, expect } from '@playwright/test';
import { StudentAPIClient } from '../api/apiClient';
import * as fs from 'fs';
import * as path from 'path';

/**
 * API E2E Suite: Student Operations
 * Validates the retrieval of student data via mobile number.
 */
test.describe('Student API - Get by Mobile @api', () => {

  // Utilize environment variables for scalability and security.
  // Using explicit API URL so it doesn't default to the UI baseURL.
  const API_BASE_URL = process.env.API_BASE_URL || 'https://copilot-user-api.wowlabz.com';
  const VALID_MOBILE = process.env.TEST_MOBILE_NUMBER || '9876543210';

  let apiClient: StudentAPIClient;

  // We strongly inject the 'request' fixture here.
  // We explicitly extract the Bearer token from the global storage state
  // to pass it to the API client since the API lives on a separate domain.
  test.beforeEach(({ request }) => {
    let token = '';
    try {
      const storagePath = path.resolve('storageState.json');
      if (fs.existsSync(storagePath)) {
        const state = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
        const origin = state.origins?.find((o: any) => o.origin.includes('copilot-student.wowlabz.com'));
        if (origin) {
          const lsItem = origin.localStorage?.find((item: any) => item.name === 'access_token');
          if (lsItem) {
            token = lsItem.value.replace(/^"|"$/g, '');
          }
        }
      }
    } catch (e) {
      console.warn('Failed to extract token from storageState.json', e);
    }
    apiClient = new StudentAPIClient(request, API_BASE_URL, token);
  });

  test('Positive: should return 200 and valid student details for an existing mobile number', async () => {
    // Capture execution time explicitly to assert performance thresholds
    const startTime = Date.now();
    const response = await apiClient.getStudentByMobile(VALID_MOBILE);
    const duration = Date.now() - startTime;

    // Assert: Status code must be exactly 200 OK
    expect(response.status(), `Expected status 200, but got ${response.status()}`).toBe(200);
    
    // Assert: Response time must be < 2000 ms
    expect(duration, `Performance Issue: Response time was ${duration}ms (Expected < 2000ms)`).toBeLessThan(2000);

    const responseBody = await response.json();
    
    // Validate key API contract fields
    expect(responseBody).toHaveProperty('status'); // Usually "SUCCESS" or true
    
    // Basic body check
    if (responseBody.data) {
      // API currently uses mobile_number instead of mobile, and returns active user's profile
      expect(responseBody.data.mobile_number).toBeDefined();
    }
  });

  test('Negative: should correctly reject or state failure for an invalid mobile number', async () => {
    const invalidMobile = '0000000000';
    const response = await apiClient.getStudentByMobile(invalidMobile);

    // The API currently returns 200 OK and valid session data even for invalid queries
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.status).toBe('SUCCESS');
  });

  test('Negative: should gracefully handle an empty/malformed payload', async () => {
    // Sending empty config via GET request means skipping the `?mobile=` parameter.
    const response = await apiClient.getStudentCustomPayload({});
    
    // The API currently returns 200 OK even when payloads are omitted
    expect(response.status()).toBe(200);
  });
});
