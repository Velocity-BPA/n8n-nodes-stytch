/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  prepareOutput,
  prepareArrayOutput,
  buildNameObject,
  buildAttributesObject,
  parseMetadata,
  formatPhoneNumber,
  validateSessionDuration,
  toSnakeCase,
  toCamelCase,
  objectToSnakeCase,
  isValidUuid,
  isValidStytchId,
} from '../../nodes/Stytch/utils/helpers';

describe('Stytch Helpers', () => {
  describe('prepareOutput', () => {
    it('should wrap data in json property with pairedItem', () => {
      const data = { id: '123', name: 'test' };
      const result = prepareOutput(data, 0);
      expect(result).toEqual({ json: data, pairedItem: { item: 0 } });
    });

    it('should handle empty objects', () => {
      const result = prepareOutput({}, 1);
      expect(result).toEqual({ json: {}, pairedItem: { item: 1 } });
    });

    it('should use primaryKey to extract nested data', () => {
      const data = { user: { id: '123' }, status: 'ok' };
      const result = prepareOutput(data, 0, 'user');
      expect(result).toEqual({ json: { id: '123' }, pairedItem: { item: 0 } });
    });
  });

  describe('prepareArrayOutput', () => {
    it('should convert array to n8n output format', () => {
      const data = [{ id: '1' }, { id: '2' }];
      const result = prepareArrayOutput(data, 0);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ json: { id: '1' }, pairedItem: { item: 0 } });
      expect(result[1]).toEqual({ json: { id: '2' }, pairedItem: { item: 0 } });
    });

    it('should handle empty arrays', () => {
      const result = prepareArrayOutput([], 0);
      expect(result).toEqual([]);
    });
  });

  describe('buildNameObject', () => {
    it('should build name object with all fields', () => {
      const result = buildNameObject('John', 'M', 'Doe');
      expect(result).toEqual({
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
      });
    });

    it('should exclude empty fields', () => {
      const result = buildNameObject('John', '', 'Doe');
      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
      });
    });

    it('should return undefined for no values', () => {
      const result = buildNameObject('', '', '');
      expect(result).toBeUndefined();
    });
  });

  describe('buildAttributesObject', () => {
    it('should build attributes object', () => {
      const result = buildAttributesObject('192.168.1.1', 'Mozilla/5.0');
      expect(result).toEqual({
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
      });
    });

    it('should exclude empty fields', () => {
      const result = buildAttributesObject('192.168.1.1', '');
      expect(result).toEqual({
        ip_address: '192.168.1.1',
      });
    });

    it('should return undefined for no values', () => {
      const result = buildAttributesObject('', '');
      expect(result).toBeUndefined();
    });
  });

  describe('parseMetadata', () => {
    it('should parse valid JSON string', () => {
      const result = parseMetadata('{"key": "value"}');
      expect(result).toEqual({ key: 'value' });
    });

    it('should throw error for invalid JSON', () => {
      expect(() => parseMetadata('not json')).toThrow('Invalid JSON format for metadata');
    });

    it('should return undefined for empty string', () => {
      const result = parseMetadata('');
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const result = parseMetadata(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle nested objects', () => {
      const result = parseMetadata('{"nested": {"key": "value"}}');
      expect(result).toEqual({ nested: { key: 'value' } });
    });
  });

  describe('formatPhoneNumber', () => {
    it('should keep properly formatted E.164 numbers unchanged', () => {
      expect(formatPhoneNumber('+12025551234')).toBe('+12025551234');
    });

    it('should add plus sign if missing', () => {
      expect(formatPhoneNumber('12025551234')).toBe('+12025551234');
    });

    it('should remove spaces and dashes', () => {
      expect(formatPhoneNumber('+1 202-555-1234')).toBe('+12025551234');
    });

    it('should handle parentheses', () => {
      expect(formatPhoneNumber('+1 (202) 555-1234')).toBe('+12025551234');
    });
  });

  describe('validateSessionDuration', () => {
    it('should return valid duration within range', () => {
      expect(validateSessionDuration(60)).toBe(60);
    });

    it('should return minimum for values below range', () => {
      expect(validateSessionDuration(1)).toBe(5);
    });

    it('should return maximum for values above range', () => {
      expect(validateSessionDuration(1000000)).toBe(527040);
    });

    it('should handle boundary values', () => {
      expect(validateSessionDuration(5)).toBe(5);
      expect(validateSessionDuration(527040)).toBe(527040);
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('firstName')).toBe('first_name');
    });

    it('should handle multiple capitals', () => {
      expect(toSnakeCase('sessionDurationMinutes')).toBe('session_duration_minutes');
    });

    it('should handle already snake_case', () => {
      expect(toSnakeCase('first_name')).toBe('first_name');
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('first_name')).toBe('firstName');
    });

    it('should handle multiple underscores', () => {
      expect(toCamelCase('session_duration_minutes')).toBe('sessionDurationMinutes');
    });

    it('should handle already camelCase', () => {
      expect(toCamelCase('firstName')).toBe('firstName');
    });
  });

  describe('objectToSnakeCase', () => {
    it('should convert all keys to snake_case', () => {
      const result = objectToSnakeCase({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      });
      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      });
    });

    it('should handle nested objects', () => {
      const result = objectToSnakeCase({
        userName: 'test',
        userData: { firstName: 'John' },
      });
      expect(result).toEqual({
        user_name: 'test',
        user_data: { first_name: 'John' },
      });
    });
  });

  describe('isValidUuid', () => {
    it('should return true for valid UUID', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });
  });

  describe('isValidStytchId', () => {
    it('should return true for valid user ID', () => {
      expect(isValidStytchId('user-test-abcd1234', 'user')).toBe(true);
    });

    it('should return true for valid session ID', () => {
      expect(isValidStytchId('session-test-abcd1234', 'session')).toBe(true);
    });

    it('should return true for valid organization ID', () => {
      expect(isValidStytchId('organization-test-abcd1234', 'organization')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(isValidStytchId('invalid', 'user')).toBe(false);
    });

    it('should return false when prefix does not match', () => {
      expect(isValidStytchId('session-test-abcd1234', 'user')).toBe(false);
    });
  });
});
