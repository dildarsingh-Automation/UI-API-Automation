import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Base API Client providing reusable request handling,
 * centralized logging, and error management methods.
 */
export class BaseAPIClient {
  protected request: APIRequestContext;
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor(request: APIRequestContext, baseUrl: string = '', token?: string) {
    this.request = request;
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  protected getFullUrl(endpoint: string) {
    // If the test provides a relative path, optionally prefix it.
    // If Playwright config has a BaseURL natively, it will auto-resolve this later.
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Execute GET requests with logging and timeout handling.
   */
  protected async get(endpoint: string, params?: Record<string, any>): Promise<APIResponse> {
    const url = this.getFullUrl(endpoint);
    console.log(`\n========================================`);
    console.log(`[REQ] GET ${url}`);
    if (params) console.log(`[REQ PARAMS] ${JSON.stringify(params)}`);
    
    const startTime = Date.now();
    const response = await this.request.get(url, {
      headers: this.defaultHeaders,
      params: params,
    });
    const duration = Date.now() - startTime;
    
    console.log(`[RES STATUS] ${response.status()} (${duration}ms)`);
    console.log(`========================================\n`);
    return response;
  }

  /**
   * Execute POST requests with logging and timeout handling.
   */
  protected async post(endpoint: string, data: any): Promise<APIResponse> {
    const url = this.getFullUrl(endpoint);
    console.log(`\n========================================`);
    console.log(`[REQ] POST ${url}`);
    console.log(`[REQ BODY] ${JSON.stringify(data)}`);
    
    const startTime = Date.now();
    const response = await this.request.post(url, {
      headers: this.defaultHeaders,
      data: data,
    });
    const duration = Date.now() - startTime;
    
    console.log(`[RES STATUS] ${response.status()} (${duration}ms)`);
    console.log(`========================================\n`);
    return response;
  }
}

/**
 * Student API Client (API Layer POM Object)
 * Encapsulates all endpoints related to the Student domain.
 */
export class StudentAPIClient extends BaseAPIClient {
  
  /**
   * Fetch student details by mobile number.
   * Note: This endpoint (/api/v1/student/get/mobile) is a GET method on the server!
   */
  async getStudentByMobile(mobile: string): Promise<APIResponse> {
    return await this.get('/api/v1/student/get/mobile', { mobile });
  }

  /**
   * Fetch student with a completely custom params payload (for negative testing).
   */
  async getStudentCustomPayload(queryParams: any): Promise<APIResponse> {
    return await this.get('/api/v1/student/get/mobile', queryParams);
  }
}
