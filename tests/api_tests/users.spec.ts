import { test, expect } from '@playwright/test';
import { ApiClient } from '../api/apiClient';

const API_BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

test.describe('API Tests - Placeholder Endpoints', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('TC-API-001: Fetch all posts', async () => {
    const response = await apiClient.get('/posts');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    expect(responseBody).toBeInstanceOf(Array);
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody[0]).toHaveProperty('userId');
  });

  test('TC-API-002: Create a new resource', async () => {
    const payload = {
      title: 'Demo Task',
      body: 'Professional framework demonstration',
      userId: 1
    };

    const response = await apiClient.post('/posts', payload);
    
    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody.title).toBe(payload.title);
    expect(responseBody).toHaveProperty('id');
  });

  test('TC-API-003: Negative test for non-existing resource', async () => {
    const response = await apiClient.get('/posts/9999');
    
    // JSONPlaceholder returns 404 for non-existent posts
    expect(response.status()).toBe(404);
  });
});
