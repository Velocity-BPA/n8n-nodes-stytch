/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IRequestOptions,
  NodeApiError,
  IDataObject,
} from 'n8n-workflow';

import {
  STYTCH_API_BASE_URL,
  STYTCH_TEST_BASE_URL,
  STYTCH_CONSUMER_API_VERSION,
  STYTCH_B2B_API_VERSION,
  STYTCH_PAGINATION_LIMIT,
} from '../constants/constants';

export interface IStytchCredentials {
  projectId: string;
  secret: string;
  environment: 'test' | 'live';
  productType: 'consumer' | 'b2b';
}

/**
 * Get the base URL for Stytch API requests
 */
export function getBaseUrl(credentials: IStytchCredentials): string {
  const baseUrl =
    credentials.environment === 'live' ? STYTCH_API_BASE_URL : STYTCH_TEST_BASE_URL;

  const apiVersion =
    credentials.productType === 'b2b' ? STYTCH_B2B_API_VERSION : STYTCH_CONSUMER_API_VERSION;

  return `${baseUrl}${apiVersion}`;
}

/**
 * Make an authenticated request to the Stytch API
 */
export async function stytchApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  uri?: string,
): Promise<any> {
  const credentials = (await this.getCredentials('stytchApi')) as IStytchCredentials;

  const baseUrl = getBaseUrl(credentials);
  const auth = Buffer.from(`${credentials.projectId}:${credentials.secret}`).toString('base64');

  const options: IRequestOptions = {
    method,
    uri: uri || `${baseUrl}${endpoint}`,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (body && Object.keys(body).length > 0 && method !== 'GET') {
    options.body = body;
  }

  if (query && Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error: any) {
    // Handle Stytch-specific error format
    if (error.response?.body) {
      const errorBody = error.response.body;
      throw new NodeApiError(this.getNode(), {
        message: errorBody.error_message || 'Unknown Stytch API error',
        description: `Error Type: ${errorBody.error_type || 'unknown'}. Request ID: ${errorBody.request_id || 'unknown'}`,
        httpCode: errorBody.status_code?.toString(),
      });
    }
    throw new NodeApiError(this.getNode(), error);
  }
}

/**
 * Make a paginated request to the Stytch API and return all items
 */
export async function stytchApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  propertyName: string = 'results',
): Promise<any[]> {
  const results: any[] = [];
  let cursor: string | undefined;
  const limit = STYTCH_PAGINATION_LIMIT;

  do {
    const requestQuery = {
      ...query,
      limit,
      ...(cursor ? { cursor } : {}),
    };

    const response = await stytchApiRequest.call(this, method, endpoint, body, requestQuery);

    const items = response[propertyName] || [];
    results.push(...items);

    cursor = response.results_metadata?.next_cursor;
  } while (cursor);

  return results;
}

/**
 * Make a request with rate limit handling and exponential backoff
 */
export async function stytchApiRequestWithRetry(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  maxRetries: number = 3,
): Promise<any> {
  let lastError: any;
  let delay = 1000; // Start with 1 second delay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await stytchApiRequest.call(this, method, endpoint, body, query);
    } catch (error: any) {
      lastError = error;

      // Check if it's a rate limit error
      const isRateLimited =
        error.httpCode === '429' ||
        error.message?.includes('too_many_requests') ||
        error.description?.includes('too_many_requests');

      if (isRateLimited && attempt < maxRetries) {
        // Wait with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for next attempt
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

/**
 * Validate phone number format (E.164)
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Clean and prepare request body by removing undefined/null values
 */
export function cleanRequestBody(body: IDataObject): IDataObject {
  const cleaned: IDataObject = {};

  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedCleaned = cleanRequestBody(value as IDataObject);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Parse JSON string safely
 */
export function parseJsonString(jsonString: string | undefined): IDataObject | undefined {
  if (!jsonString) {
    return undefined;
  }

  try {
    return JSON.parse(jsonString);
  } catch {
    return undefined;
  }
}
