/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const STYTCH_API_BASE_URL = 'https://api.stytch.com';
export const STYTCH_TEST_BASE_URL = 'https://test.stytch.com';

export const STYTCH_CONSUMER_API_VERSION = '/v1';
export const STYTCH_B2B_API_VERSION = '/v1/b2b';

export const STYTCH_RATE_LIMIT = 1000; // requests per hour per user

export const STYTCH_PAGINATION_LIMIT = 100;

export const STYTCH_LOCALES = [
  { name: 'English', value: 'en' },
  { name: 'Spanish', value: 'es' },
  { name: 'French', value: 'fr' },
  { name: 'Portuguese (Brazil)', value: 'pt-br' },
  { name: 'German', value: 'de' },
  { name: 'Italian', value: 'it' },
  { name: 'Japanese', value: 'ja' },
  { name: 'Korean', value: 'ko' },
  { name: 'Chinese (Simplified)', value: 'zh-hans' },
  { name: 'Chinese (Traditional)', value: 'zh-hant' },
];

export const STYTCH_OAUTH_PROVIDERS = [
  { name: 'Amazon', value: 'amazon' },
  { name: 'Apple', value: 'apple' },
  { name: 'Bitbucket', value: 'bitbucket' },
  { name: 'Coinbase', value: 'coinbase' },
  { name: 'Discord', value: 'discord' },
  { name: 'Facebook', value: 'facebook' },
  { name: 'Figma', value: 'figma' },
  { name: 'GitHub', value: 'github' },
  { name: 'GitLab', value: 'gitlab' },
  { name: 'Google', value: 'google' },
  { name: 'HubSpot', value: 'hubspot' },
  { name: 'LinkedIn', value: 'linkedin' },
  { name: 'Microsoft', value: 'microsoft' },
  { name: 'Salesforce', value: 'salesforce' },
  { name: 'Slack', value: 'slack' },
  { name: 'Snapchat', value: 'snapchat' },
  { name: 'Spotify', value: 'spotify' },
  { name: 'Steam', value: 'steam' },
  { name: 'TikTok', value: 'tiktok' },
  { name: 'Twitch', value: 'twitch' },
  { name: 'Twitter', value: 'twitter' },
  { name: 'Yahoo', value: 'yahoo' },
];

export const STYTCH_HASH_TYPES = [
  { name: 'bcrypt', value: 'bcrypt' },
  { name: 'Argon2i', value: 'argon2i' },
  { name: 'Argon2id', value: 'argon2id' },
  { name: 'MD5', value: 'md5' },
  { name: 'SHA-1', value: 'sha1' },
  { name: 'scrypt', value: 'scrypt' },
  { name: 'PHPass', value: 'phpass' },
  { name: 'PBKDF2', value: 'pbkdf2' },
];

export const STYTCH_CRYPTO_WALLET_TYPES = [
  { name: 'Ethereum', value: 'ethereum' },
  { name: 'Solana', value: 'solana' },
];

export const STYTCH_AUTHENTICATOR_TYPES = [
  { name: 'Platform (Built-in)', value: 'platform' },
  { name: 'Cross-Platform (External)', value: 'cross-platform' },
];

export const STYTCH_MFA_POLICIES = [
  { name: 'Optional', value: 'OPTIONAL' },
  { name: 'Required for All', value: 'REQUIRED_FOR_ALL' },
];

export const STYTCH_AUTH_METHODS = [
  { name: 'SSO', value: 'sso' },
  { name: 'Magic Link', value: 'magic_link' },
  { name: 'Password', value: 'password' },
  { name: 'Google OAuth', value: 'google_oauth' },
  { name: 'Microsoft OAuth', value: 'microsoft_oauth' },
];

export const STYTCH_JIT_PROVISIONING_MODES = [
  { name: 'Restricted', value: 'RESTRICTED' },
  { name: 'Not Allowed', value: 'NOT_ALLOWED' },
  { name: 'All Allowed', value: 'ALL_ALLOWED' },
];

export const STYTCH_EMAIL_INVITES_MODES = [
  { name: 'All Allowed', value: 'ALL_ALLOWED' },
  { name: 'Restricted', value: 'RESTRICTED' },
  { name: 'Not Allowed', value: 'NOT_ALLOWED' },
];

export const STYTCH_WEBHOOK_EVENTS = [
  // User events
  { name: 'User Created', value: 'user.created' },
  { name: 'User Updated', value: 'user.updated' },
  { name: 'User Deleted', value: 'user.deleted' },
  // Session events
  { name: 'Session Created', value: 'session.created' },
  { name: 'Session Authenticated', value: 'session.authenticated' },
  { name: 'Session Revoked', value: 'session.revoked' },
  // Member events (B2B)
  { name: 'Member Created', value: 'member.created' },
  { name: 'Member Updated', value: 'member.updated' },
  { name: 'Member Deleted', value: 'member.deleted' },
  // Organization events (B2B)
  { name: 'Organization Created', value: 'organization.created' },
  { name: 'Organization Updated', value: 'organization.updated' },
  { name: 'Organization Deleted', value: 'organization.deleted' },
  // Authentication events
  { name: 'Magic Link Auth Success', value: 'magic_link.authenticate.success' },
  { name: 'OTP Auth Success', value: 'otp.authenticate.success' },
  { name: 'OAuth Auth Success', value: 'oauth.authenticate.success' },
  { name: 'Password Auth Success', value: 'password.authenticate.success' },
  { name: 'TOTP Auth Success', value: 'totp.authenticate.success' },
  { name: 'WebAuthn Auth Success', value: 'webauthn.authenticate.success' },
];

export const VELOCITY_BPA_LICENSE_NOTICE = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;
