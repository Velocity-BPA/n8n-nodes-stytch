/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { buildAttributesObject } from '../../utils/helpers';
import { STYTCH_LOCALES } from '../../constants/constants';

export const magicLinkOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['magicLink'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Authenticate a magic link token',
        action: 'Authenticate magic link',
      },
      {
        name: 'Create Embedded',
        value: 'createEmbedded',
        description: 'Create an embeddable magic link token',
        action: 'Create embedded magic link',
      },
      {
        name: 'Send by Email',
        value: 'sendByEmail',
        description: 'Send magic link via email',
        action: 'Send magic link by email',
      },
      {
        name: 'Send by Email (Embedded)',
        value: 'sendByEmailEmbedded',
        description: 'Create embeddable magic link for email',
        action: 'Send embedded magic link by email',
      },
    ],
    default: 'sendByEmail',
  },
];

export const magicLinkFields: INodeProperties[] = [
  // Email field for send operations
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['sendByEmail', 'sendByEmailEmbedded'],
      },
    },
    default: '',
    description: 'Email address to send the magic link to',
  },
  // Token for authentication
  {
    displayName: 'Token',
    name: 'token',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The magic link token to authenticate',
  },
  // User ID for embedded
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['createEmbedded'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID to create an embedded magic link for',
  },
  // Send by Email options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['sendByEmail'],
      },
    },
    options: [
      {
        displayName: 'Code Challenge',
        name: 'codeChallenge',
        type: 'string',
        default: '',
        description: 'PKCE code challenge for additional security',
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        default: '',
        description: 'IP address for fraud detection',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'options',
        options: STYTCH_LOCALES,
        default: 'en',
        description: 'Language for the email',
      },
      {
        displayName: 'Login Expiration Minutes',
        name: 'loginExpirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 10080,
        },
        default: 60,
        description: 'Expiration time for login magic link in minutes',
      },
      {
        displayName: 'Login Magic Link URL',
        name: 'loginMagicLinkUrl',
        type: 'string',
        default: '',
        description: 'URL to redirect user to on login',
      },
      {
        displayName: 'Login Template ID',
        name: 'loginTemplateId',
        type: 'string',
        default: '',
        description: 'Custom email template ID for login',
      },
      {
        displayName: 'Signup Expiration Minutes',
        name: 'signupExpirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 10080,
        },
        default: 10080,
        description: 'Expiration time for signup magic link in minutes',
      },
      {
        displayName: 'Signup Magic Link URL',
        name: 'signupMagicLinkUrl',
        type: 'string',
        default: '',
        description: 'URL to redirect user to on signup',
      },
      {
        displayName: 'Signup Template ID',
        name: 'signupTemplateId',
        type: 'string',
        default: '',
        description: 'Custom email template ID for signup',
      },
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
        description: 'User agent for fraud detection',
      },
    ],
  },
  // Authenticate options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['authenticate'],
      },
    },
    options: [
      {
        displayName: 'Code Verifier',
        name: 'codeVerifier',
        type: 'string',
        default: '',
        description: 'PKCE code verifier if code challenge was used',
      },
      {
        displayName: 'Session Custom Claims',
        name: 'sessionCustomClaims',
        type: 'json',
        default: '{}',
        description: 'Custom claims to include in session JWT',
      },
      {
        displayName: 'Session Duration Minutes',
        name: 'sessionDurationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 527040,
        },
        default: 60,
        description: 'Duration of the session in minutes',
      },
      {
        displayName: 'Session Token',
        name: 'sessionToken',
        type: 'string',
        default: '',
        description: 'Existing session token to extend',
      },
    ],
  },
  // Create Embedded options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['createEmbedded'],
      },
    },
    options: [
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 10080,
        },
        default: 60,
        description: 'Expiration time in minutes',
      },
    ],
  },
  // Send by Email Embedded options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['magicLink'],
        operation: ['sendByEmailEmbedded'],
      },
    },
    options: [
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 10080,
        },
        default: 60,
        description: 'Expiration time in minutes',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'options',
        options: STYTCH_LOCALES,
        default: 'en',
        description: 'Language for the email',
      },
    ],
  },
];

export async function executeMagicLinkOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'sendByEmail': {
      const email = this.getNodeParameter('email', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
      };

      if (options.loginMagicLinkUrl) {
        body.login_magic_link_url = options.loginMagicLinkUrl;
      }
      if (options.signupMagicLinkUrl) {
        body.signup_magic_link_url = options.signupMagicLinkUrl;
      }
      if (options.loginExpirationMinutes) {
        body.login_expiration_minutes = options.loginExpirationMinutes;
      }
      if (options.signupExpirationMinutes) {
        body.signup_expiration_minutes = options.signupExpirationMinutes;
      }
      if (options.loginTemplateId) {
        body.login_template_id = options.loginTemplateId;
      }
      if (options.signupTemplateId) {
        body.signup_template_id = options.signupTemplateId;
      }
      if (options.locale) {
        body.locale = options.locale;
      }
      if (options.codeChallenge) {
        body.code_challenge = options.codeChallenge;
      }

      const attributes = buildAttributesObject(
        options.ipAddress as string,
        options.userAgent as string,
      );
      if (attributes) {
        body.attributes = attributes;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/magic_links/email/send',
        cleanRequestBody(body),
      );
      break;
    }

    case 'sendByEmailEmbedded': {
      const email = this.getNodeParameter('email', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
      };

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }
      if (options.locale) {
        body.locale = options.locale;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/magic_links/email/login_or_create',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticate': {
      const token = this.getNodeParameter('token', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        token,
      };

      if (options.sessionToken) {
        body.session_token = options.sessionToken;
      }
      if (options.sessionDurationMinutes) {
        body.session_duration_minutes = options.sessionDurationMinutes;
      }
      if (options.sessionCustomClaims) {
        try {
          body.session_custom_claims = JSON.parse(options.sessionCustomClaims as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (options.codeVerifier) {
        body.code_verifier = options.codeVerifier;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/magic_links/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'createEmbedded': {
      const userId = this.getNodeParameter('userId', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        user_id: userId,
      };

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/magic_links/embeddable',
        cleanRequestBody(body),
      );
      break;
    }
  }

  return responseData;
}
