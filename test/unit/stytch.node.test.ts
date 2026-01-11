/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Stytch } from '../../nodes/Stytch/Stytch.node';
import { StytchTrigger } from '../../nodes/Stytch/StytchTrigger.node';

describe('Stytch Node', () => {
  describe('Node Description', () => {
    const node = new Stytch();

    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('Stytch');
    });

    it('should have correct name', () => {
      expect(node.description.name).toBe('stytch');
    });

    it('should have correct version', () => {
      expect(node.description.version).toBe(1);
    });

    it('should require stytchApi credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials).toHaveLength(1);
      expect(node.description.credentials![0].name).toBe('stytchApi');
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have 12 resources', () => {
      const resourceProperty = node.description.properties.find(
        (p) => p.name === 'resource',
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty!.options).toHaveLength(12);
    });

    it('should have all expected resources', () => {
      const resourceProperty = node.description.properties.find(
        (p) => p.name === 'resource',
      );
      const resourceValues = (resourceProperty!.options as Array<{ value: string }>).map(
        (o) => o.value,
      );

      expect(resourceValues).toContain('user');
      expect(resourceValues).toContain('magicLink');
      expect(resourceValues).toContain('otp');
      expect(resourceValues).toContain('session');
      expect(resourceValues).toContain('oauth');
      expect(resourceValues).toContain('totp');
      expect(resourceValues).toContain('webAuthn');
      expect(resourceValues).toContain('password');
      expect(resourceValues).toContain('cryptoWallet');
      expect(resourceValues).toContain('b2bOrganization');
      expect(resourceValues).toContain('b2bMember');
      expect(resourceValues).toContain('b2bSso');
    });
  });
});

describe('Stytch Trigger Node', () => {
  describe('Node Description', () => {
    const node = new StytchTrigger();

    it('should have correct display name', () => {
      expect(node.description.displayName).toBe('Stytch Trigger');
    });

    it('should have correct name', () => {
      expect(node.description.name).toBe('stytchTrigger');
    });

    it('should be a trigger node', () => {
      expect(node.description.group).toContain('trigger');
    });

    it('should have webhook configuration', () => {
      expect(node.description.webhooks).toBeDefined();
      expect(node.description.webhooks).toHaveLength(1);
      expect(node.description.webhooks![0].httpMethod).toBe('POST');
    });

    it('should have events property', () => {
      const eventsProperty = node.description.properties.find((p) => p.name === 'events');
      expect(eventsProperty).toBeDefined();
      expect(eventsProperty!.type).toBe('multiOptions');
      expect(eventsProperty!.required).toBe(true);
    });

    it('should have webhook secret property', () => {
      const secretProperty = node.description.properties.find(
        (p) => p.name === 'webhookSecret',
      );
      expect(secretProperty).toBeDefined();
      expect(secretProperty!.typeOptions).toEqual({ password: true });
    });
  });
});
