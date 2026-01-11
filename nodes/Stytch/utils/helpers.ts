/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Prepare output data from API response
 */
export function prepareOutput(
  response: IDataObject,
  itemIndex: number,
  primaryKey?: string,
): INodeExecutionData {
  const json = primaryKey && response[primaryKey] ? response[primaryKey] : response;
  return {
    json: json as IDataObject,
    pairedItem: { item: itemIndex },
  };
}

/**
 * Prepare output data for array responses
 */
export function prepareArrayOutput(
  items: IDataObject[],
  itemIndex: number,
): INodeExecutionData[] {
  return items.map((item) => ({
    json: item,
    pairedItem: { item: itemIndex },
  }));
}

/**
 * Extract additional fields from n8n UI
 */
export function extractAdditionalFields(
  this: any,
  fieldName: string,
  itemIndex: number,
): IDataObject {
  const additionalFields = this.getNodeParameter(fieldName, itemIndex, {}) as IDataObject;
  return additionalFields;
}

/**
 * Build name object from individual fields
 */
export function buildNameObject(
  firstName?: string,
  middleName?: string,
  lastName?: string,
): IDataObject | undefined {
  const name: IDataObject = {};

  if (firstName) name.first_name = firstName;
  if (middleName) name.middle_name = middleName;
  if (lastName) name.last_name = lastName;

  return Object.keys(name).length > 0 ? name : undefined;
}

/**
 * Build attributes object for fraud detection
 */
export function buildAttributesObject(
  ipAddress?: string,
  userAgent?: string,
): IDataObject | undefined {
  const attributes: IDataObject = {};

  if (ipAddress) attributes.ip_address = ipAddress;
  if (userAgent) attributes.user_agent = userAgent;

  return Object.keys(attributes).length > 0 ? attributes : undefined;
}

/**
 * Parse metadata JSON safely
 */
export function parseMetadata(metadataString: string | undefined): IDataObject | undefined {
  if (!metadataString || metadataString.trim() === '') {
    return undefined;
  }

  try {
    return JSON.parse(metadataString);
  } catch {
    throw new Error('Invalid JSON format for metadata');
  }
}

/**
 * Format phone number to E.164
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except the leading +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

/**
 * Validate and format session duration
 */
export function validateSessionDuration(minutes: number): number {
  const MIN_DURATION = 5;
  const MAX_DURATION = 527040; // 1 year in minutes

  if (minutes < MIN_DURATION) {
    return MIN_DURATION;
  }

  if (minutes > MAX_DURATION) {
    return MAX_DURATION;
  }

  return Math.floor(minutes);
}

/**
 * Build options object for optional parameters
 */
export function buildOptionsObject(options: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function objectToSnakeCase(obj: IDataObject): IDataObject {
  const result: IDataObject = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[snakeKey] = objectToSnakeCase(value as IDataObject);
    } else {
      result[snakeKey] = value;
    }
  }

  return result;
}

/**
 * Handle error response from Stytch API
 */
export function handleStytchError(error: any): never {
  const errorMessage = error.error_message || error.message || 'Unknown error';
  const errorType = error.error_type || 'unknown_error';
  const statusCode = error.status_code || 500;
  const requestId = error.request_id || 'unknown';

  throw new Error(
    `Stytch API Error [${statusCode}]: ${errorMessage} (Type: ${errorType}, Request ID: ${requestId})`,
  );
}

/**
 * Merge default options with user-provided options
 */
export function mergeOptions(defaults: IDataObject, userOptions: IDataObject): IDataObject {
  return { ...defaults, ...buildOptionsObject(userOptions) };
}

/**
 * Check if value is a valid UUID
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Check if value is a valid Stytch ID format
 */
export function isValidStytchId(value: string, prefix: string): boolean {
  return value.startsWith(`${prefix}-`) && value.length > prefix.length + 1;
}
