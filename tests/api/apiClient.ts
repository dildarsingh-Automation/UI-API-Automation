import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Performs a GET request
   * @param path - The API endpoint path (e.g. '/api/users')
   * @param params - Optional query parameters
   */
  async get(path: string, params?: { [key: string]: string | number | boolean }): Promise<APIResponse> {
    const url = this.buildUrl(path, params);
    const response = await this.request.get(url, {
      headers: this.getDefaultHeaders(),
    });
    return response;
  }

  /**
   * Performs a POST request
   * @param path - The API endpoint path
   * @param data - The payload body
   */
  async post(path: string, data: any): Promise<APIResponse> {
    const url = this.buildUrl(path);
    const response = await this.request.post(url, {
      data,
      headers: this.getDefaultHeaders(),
    });
    return response;
  }

  /**
   * Default headers for all API requests
   */
  private getDefaultHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Add generic tokens if testing an authenticated API:
      // 'Authorization': `Bearer ${process.env.API_TOKEN || 'demo_token'}`,
    };
  }

  /**
   * Helper to construct the full URL
   */
  private buildUrl(path: string, params?: { [key: string]: string | number | boolean }): string {
    const baseUrl = (process.env.API_BASE_URL || 'https://reqres.in').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${baseUrl}${cleanPath}`;
    
    if (params) {
      const query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
        .join('&');
      url += (url.includes('?') ? '&' : '?') + query;
    }
    
    return url;
  }
}
