import { test, expect } from '@playwright/test';
import { ApiClient } from '../api/apiClient';

const API_BASE_URL = process.env.API_BASE_URL || 'https://reqres.in';

test.describe('API Tests - Demo Endpoints', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('TC-API-001: Fetch list of users', async () => {
    // Correctly passing only the path + query params
    const response = await apiClient.get('/api/users', { page: 2 });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    
    expect(responseBody.page).toBe(2);
    expect(responseBody.data).toBeInstanceOf(Array);
    expect(responseBody.data.length).toBeGreaterThan(0);
    expect(responseBody.data[0]).toHaveProperty('id');
    expect(responseBody.data[0]).toHaveProperty('email');
  });

  test('TC-API-002: Create a new user', async () => {
    const payload = {
      name: 'John Doe',
      job: 'Automation Architect'
    };

    const startTime = Date.now();
    const response = await apiClient.post('/api/users', payload);
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.job).toBe(payload.job);
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('createdAt');

    // Performance assertion (should respond within 3s timeframe for demo)
    expect(duration).toBeLessThan(3000); 
  });

  test('TC-API-003: Negative test for non-existing user', async () => {
    const response = await apiClient.get('/api/users/23');
    
    expect(response.status()).toBe(404);
    
    const responseBody = await response.json();
    expect(responseBody).toEqual({});
  });
});
