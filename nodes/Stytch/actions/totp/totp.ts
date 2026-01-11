/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';

export const totpOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['totp'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Verify a TOTP code',
        action: 'Authenticate TOTP',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create TOTP registration for a user',
        action: 'Create TOTP',
      },
      {
        name: 'Get Recovery Codes',
        value: 'getRecoveryCodes',
        description: 'Get TOTP recovery codes',
        action: 'Get recovery codes',
      },
      {
        name: 'Recover',
        value: 'recover',
        description: 'Authenticate with a recovery code',
        action: 'Recover with code',
      },
    ],
    default: 'create',
  },
];

export const totpFields: INodeProperties[] = [
  // User ID for create and getRecoveryCodes
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['create', 'getRecoveryCodes', 'recover'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID',
  },
  // TOTP Code for authenticate
  {
    displayName: 'TOTP Code',
    name: 'totpCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The 6-digit TOTP code from authenticator app',
  },
  // User ID or session token for authenticate
  {
    displayName: 'Authentication Method',
    name: 'authMethod',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['authenticate'],
      },
    },
    options: [
      {
        name: 'User ID',
        value: 'userId',
      },
      {
        name: 'Session Token',
        value: 'sessionToken',
      },
    ],
    default: 'userId',
    description: 'How to identify the user for authentication',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['authenticate'],
        authMethod: ['userId'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID',
  },
  {
    displayName: 'Session Token',
    name: 'sessionToken',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['authenticate'],
        authMethod: ['sessionToken'],
      },
    },
    default: '',
    description: 'The session token',
  },
  // Recovery code for recover
  {
    displayName: 'Recovery Code',
    name: 'recoveryCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['recover'],
      },
    },
    default: '',
    description: 'The TOTP recovery code',
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
        resource: ['totp'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 5,
          maxValue: 1440,
        },
        default: 60,
        description: 'Expiration time for the TOTP registration in minutes',
      },
    ],
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
        resource: ['totp'],
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
    ],
  },
  // Options for recover
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['totp'],
        operation: ['recover'],
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
];

export async function executeTotpOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'create': {
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
        '/totps',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticate': {
      const totpCode = this.getNodeParameter('totpCode', i) as string;
      const authMethod = this.getNodeParameter('authMethod', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        totp_code: totpCode,
      };

      if (authMethod === 'userId') {
        body.user_id = this.getNodeParameter('userId', i) as string;
      } else {
        body.session_token = this.getNodeParameter('sessionToken', i) as string;
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
        '/totps/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'getRecoveryCodes': {
      const userId = this.getNodeParameter('userId', i) as string;

      const body: IDataObject = {
        user_id: userId,
      };

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/totps/recovery_codes',
        body,
      );
      break;
    }

    case 'recover': {
      const userId = this.getNodeParameter('userId', i) as string;
      const recoveryCode = this.getNodeParameter('recoveryCode', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        user_id: userId,
        recovery_code: recoveryCode,
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
        '/totps/recover',
        cleanRequestBody(body),
      );
      break;
    }
  }

  return responseData;
}
