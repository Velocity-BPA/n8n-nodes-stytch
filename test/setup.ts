/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Test setup file

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging
  error: console.error,
};

// Mock timers if needed
jest.useFakeTimers();

// Global test helpers
export const mockExecuteFunctions = {
  getInputData: jest.fn().mockReturnValue([{ json: {} }]),
  getNodeParameter: jest.fn(),
  getCredentials: jest.fn().mockResolvedValue({
    projectId: 'project-test-xxx',
    secret: 'secret-test-xxx',
    environment: 'test',
    productType: 'consumer',
  }),
  helpers: {
    request: jest.fn(),
    httpRequest: jest.fn(),
  },
  continueOnFail: jest.fn().mockReturnValue(false),
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
};

export const mockWebhookFunctions = {
  getRequestObject: jest.fn().mockReturnValue({
    rawBody: Buffer.from('{}'),
  }),
  getBodyData: jest.fn().mockReturnValue({}),
  getHeaderData: jest.fn().mockReturnValue({}),
  getNodeParameter: jest.fn(),
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
};

export const createMockStytchResponse = (data: Record<string, unknown>) => ({
  status_code: 200,
  request_id: 'request-test-xxx',
  ...data,
});

export const createMockStytchError = (
  errorType: string,
  errorMessage: string,
  statusCode = 400,
) => ({
  status_code: statusCode,
  request_id: 'request-test-xxx',
  error_type: errorType,
  error_message: errorMessage,
  error_url: `https://stytch.com/docs/api/errors/${statusCode}`,
});
