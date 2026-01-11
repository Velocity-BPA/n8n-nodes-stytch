/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { STYTCH_HASH_TYPES } from '../../constants/constants';

export const passwordOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['password'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Authenticate with password',
        action: 'Authenticate password',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Set password for a user',
        action: 'Create password',
      },
      {
        name: 'Migrate',
        value: 'migrate',
        description: 'Migrate existing password hash',
        action: 'Migrate password',
      },
      {
        name: 'Reset by Email',
        value: 'resetByEmail',
        description: 'Complete password reset via email token',
        action: 'Reset by email token',
      },
      {
        name: 'Reset by Email Start',
        value: 'resetByEmailStart',
        description: 'Start password reset flow via email',
        action: 'Start email reset',
      },
      {
        name: 'Reset by Existing Password',
        value: 'resetByExistingPassword',
        description: 'Change password using existing password',
        action: 'Change password',
      },
      {
        name: 'Reset by Session',
        value: 'resetBySession',
        description: 'Reset password via active session',
        action: 'Reset by session',
      },
      {
        name: 'Strength Check',
        value: 'strengthCheck',
        description: 'Check password strength',
        action: 'Check strength',
      },
    ],
    default: 'authenticate',
  },
];

export const passwordFields: INodeProperties[] = [
  // Email for authenticate, create, resetByEmailStart
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['authenticate', 'create', 'resetByEmailStart', 'migrate', 'resetByExistingPassword'],
      },
    },
    default: '',
    description: 'User email address',
  },
  // Password for authenticate, create, resetByExistingPassword
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['authenticate', 'create', 'strengthCheck', 'resetByExistingPassword'],
      },
    },
    default: '',
    description: 'The password',
  },
  // New password for resetByExistingPassword
  {
    displayName: 'New Password',
    name: 'newPassword',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetByExistingPassword'],
      },
    },
    default: '',
    description: 'The new password',
  },
  // Token for resetByEmail
  {
    displayName: 'Token',
    name: 'token',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetByEmail'],
      },
    },
    default: '',
    description: 'Password reset token from email',
  },
  // Password for resetByEmail
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetByEmail'],
      },
    },
    default: '',
    description: 'New password to set',
  },
  // Session token for resetBySession
  {
    displayName: 'Session Token',
    name: 'sessionToken',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetBySession'],
      },
    },
    default: '',
    description: 'Active session token',
  },
  // Password for resetBySession
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetBySession'],
      },
    },
    default: '',
    description: 'New password to set',
  },
  // Password hash for migrate
  {
    displayName: 'Password Hash',
    name: 'passwordHash',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['migrate'],
      },
    },
    default: '',
    description: 'Existing password hash to migrate',
  },
  // Hash type for migrate
  {
    displayName: 'Hash Type',
    name: 'hashType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['migrate'],
      },
    },
    options: STYTCH_HASH_TYPES,
    default: 'bcrypt',
    description: 'The hash algorithm used',
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
        resource: ['password'],
        operation: ['authenticate'],
      },
    },
    options: [
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
  // Options for create
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['create'],
      },
    },
    options: [
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
  // Options for resetByEmailStart
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetByEmailStart'],
      },
    },
    options: [
      {
        displayName: 'Code Challenge',
        name: 'codeChallenge',
        type: 'string',
        default: '',
        description: 'PKCE code challenge',
      },
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 1440,
        },
        default: 30,
        description: 'Reset token expiration in minutes',
      },
      {
        displayName: 'Login Redirect URL',
        name: 'loginRedirectUrl',
        type: 'string',
        default: '',
        description: 'URL to redirect to after reset',
      },
      {
        displayName: 'Reset Password Redirect URL',
        name: 'resetPasswordRedirectUrl',
        type: 'string',
        default: '',
        description: 'URL for password reset page',
      },
      {
        displayName: 'Reset Password Template ID',
        name: 'resetPasswordTemplateId',
        type: 'string',
        default: '',
        description: 'Custom email template ID',
      },
    ],
  },
  // Options for resetByEmail
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['resetByEmail'],
      },
    },
    options: [
      {
        displayName: 'Code Verifier',
        name: 'codeVerifier',
        type: 'string',
        default: '',
        description: 'PKCE code verifier',
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
  // Options for migrate
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['password'],
        operation: ['migrate'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'User first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'User last name',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side metadata',
      },
      {
        displayName: 'Untrusted Metadata',
        name: 'untrustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Client-writable metadata',
      },
    ],
  },
];

export async function executePasswordOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'create': {
      const email = this.getNodeParameter('email', i) as string;
      const password = this.getNodeParameter('password', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
        password,
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

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticate': {
      const email = this.getNodeParameter('email', i) as string;
      const password = this.getNodeParameter('password', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
        password,
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

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'strengthCheck': {
      const password = this.getNodeParameter('password', i) as string;

      const body: IDataObject = {
        password,
      };

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/strength_check',
        body,
      );
      break;
    }

    case 'migrate': {
      const email = this.getNodeParameter('email', i) as string;
      const passwordHash = this.getNodeParameter('passwordHash', i) as string;
      const hashType = this.getNodeParameter('hashType', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
        hash: passwordHash,
        hash_type: hashType,
      };

      if (options.firstName || options.lastName) {
        body.name = {};
        if (options.firstName) (body.name as IDataObject).first_name = options.firstName;
        if (options.lastName) (body.name as IDataObject).last_name = options.lastName;
      }
      if (options.trustedMetadata) {
        try {
          body.trusted_metadata = JSON.parse(options.trustedMetadata as string);
        } catch {
          // Ignore
        }
      }
      if (options.untrustedMetadata) {
        try {
          body.untrusted_metadata = JSON.parse(options.untrustedMetadata as string);
        } catch {
          // Ignore
        }
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/migrate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'resetByEmailStart': {
      const email = this.getNodeParameter('email', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
      };

      if (options.resetPasswordRedirectUrl) {
        body.reset_password_redirect_url = options.resetPasswordRedirectUrl;
      }
      if (options.loginRedirectUrl) {
        body.login_redirect_url = options.loginRedirectUrl;
      }
      if (options.expirationMinutes) {
        body.reset_password_expiration_minutes = options.expirationMinutes;
      }
      if (options.resetPasswordTemplateId) {
        body.reset_password_template_id = options.resetPasswordTemplateId;
      }
      if (options.codeChallenge) {
        body.code_challenge = options.codeChallenge;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/email/reset/start',
        cleanRequestBody(body),
      );
      break;
    }

    case 'resetByEmail': {
      const token = this.getNodeParameter('token', i) as string;
      const password = this.getNodeParameter('password', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        token,
        password,
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
          // Ignore
        }
      }
      if (options.codeVerifier) {
        body.code_verifier = options.codeVerifier;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/email/reset',
        cleanRequestBody(body),
      );
      break;
    }

    case 'resetByExistingPassword': {
      const email = this.getNodeParameter('email', i) as string;
      const password = this.getNodeParameter('password', i) as string;
      const newPassword = this.getNodeParameter('newPassword', i) as string;

      const body: IDataObject = {
        email,
        existing_password: password,
        new_password: newPassword,
      };

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/existing_password/reset',
        body,
      );
      break;
    }

    case 'resetBySession': {
      const sessionToken = this.getNodeParameter('sessionToken', i) as string;
      const password = this.getNodeParameter('password', i) as string;

      const body: IDataObject = {
        session_token: sessionToken,
        password,
      };

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/passwords/session/reset',
        body,
      );
      break;
    }
  }

  return responseData;
}
