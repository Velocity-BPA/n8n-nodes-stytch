/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { STYTCH_OAUTH_PROVIDERS } from '../../constants/constants';

export const oauthOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['oauth'],
      },
    },
    options: [
      {
        name: 'Attach',
        value: 'attach',
        description: 'Attach OAuth to existing user',
        action: 'Attach OAuth',
      },
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Authenticate an OAuth token',
        action: 'Authenticate OAuth',
      },
      {
        name: 'Get Providers',
        value: 'getProviders',
        description: 'List available OAuth providers',
        action: 'Get OAuth providers',
      },
    ],
    default: 'authenticate',
  },
];

export const oauthFields: INodeProperties[] = [
  // Token for authenticate
  {
    displayName: 'Token',
    name: 'token',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['oauth'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The OAuth callback token to authenticate',
  },
  // Provider for attach
  {
    displayName: 'Provider',
    name: 'provider',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['oauth'],
        operation: ['attach'],
      },
    },
    options: STYTCH_OAUTH_PROVIDERS,
    default: 'google',
    description: 'The OAuth provider to attach',
  },
  // User ID for attach
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['oauth'],
        operation: ['attach'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID to attach OAuth to',
  },
  // Options for authenticate
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['oauth'],
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
  // Options for attach
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['oauth'],
        operation: ['attach'],
      },
    },
    options: [
      {
        displayName: 'Login Redirect URL',
        name: 'loginRedirectUrl',
        type: 'string',
        default: '',
        description: 'URL to redirect to on login',
      },
      {
        displayName: 'Signup Redirect URL',
        name: 'signupRedirectUrl',
        type: 'string',
        default: '',
        description: 'URL to redirect to on signup',
      },
    ],
  },
];

export async function executeOAuthOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
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
        '/oauth/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'getProviders': {
      responseData = await stytchApiRequest.call(this, 'GET', '/oauth');
      break;
    }

    case 'attach': {
      const provider = this.getNodeParameter('provider', i) as string;
      const userId = this.getNodeParameter('userId', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        provider,
        user_id: userId,
      };

      if (options.loginRedirectUrl) {
        body.login_redirect_url = options.loginRedirectUrl;
      }
      if (options.signupRedirectUrl) {
        body.signup_redirect_url = options.signupRedirectUrl;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/oauth/attach',
        cleanRequestBody(body),
      );
      break;
    }
  }

  return responseData;
}
