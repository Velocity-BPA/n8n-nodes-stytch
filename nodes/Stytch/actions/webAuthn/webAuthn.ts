/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { STYTCH_AUTHENTICATOR_TYPES } from '../../constants/constants';

export const webAuthnOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
      },
    },
    options: [
      {
        name: 'Authenticate Complete',
        value: 'authenticateComplete',
        description: 'Complete passkey authentication',
        action: 'Complete authentication',
      },
      {
        name: 'Authenticate Start',
        value: 'authenticateStart',
        description: 'Start passkey authentication',
        action: 'Start authentication',
      },
      {
        name: 'Register Complete',
        value: 'registerComplete',
        description: 'Complete passkey registration',
        action: 'Complete registration',
      },
      {
        name: 'Register Start',
        value: 'registerStart',
        description: 'Start passkey registration',
        action: 'Start registration',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update passkey name',
        action: 'Update passkey',
      },
    ],
    default: 'registerStart',
  },
];

export const webAuthnFields: INodeProperties[] = [
  // User ID for registerStart
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['registerStart', 'authenticateStart'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID',
  },
  // Domain for registerStart
  {
    displayName: 'Domain',
    name: 'domain',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['registerStart', 'authenticateStart'],
      },
    },
    default: '',
    placeholder: 'example.com',
    description: 'The relying party domain',
  },
  // WebAuthn Registration ID for update
  {
    displayName: 'WebAuthn Registration ID',
    name: 'webAuthnRegistrationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The WebAuthn registration ID to update',
  },
  // Name for update
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'New name for the passkey',
  },
  // Public Key Credential for registerComplete and authenticateComplete
  {
    displayName: 'Public Key Credential',
    name: 'publicKeyCredential',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['registerComplete', 'authenticateComplete'],
      },
    },
    default: '{}',
    description: 'The WebAuthn credential response from the browser',
  },
  // Options for registerStart
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['registerStart'],
      },
    },
    options: [
      {
        displayName: 'Authenticator Type',
        name: 'authenticatorType',
        type: 'options',
        options: STYTCH_AUTHENTICATOR_TYPES,
        default: 'platform',
        description: 'Type of authenticator to register',
      },
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
        description: 'Browser user agent string',
      },
    ],
  },
  // Options for authenticateStart
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['authenticateStart'],
      },
    },
    options: [
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
        description: 'Browser user agent string',
      },
    ],
  },
  // Options for registerComplete
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['registerComplete'],
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
  // Options for authenticateComplete
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webAuthn'],
        operation: ['authenticateComplete'],
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

export async function executeWebAuthnOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'registerStart': {
      const userId = this.getNodeParameter('userId', i) as string;
      const domain = this.getNodeParameter('domain', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        user_id: userId,
        domain,
      };

      if (options.userAgent) {
        body.user_agent = options.userAgent;
      }
      if (options.authenticatorType) {
        body.authenticator_type = options.authenticatorType;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/webauthn/register/start',
        cleanRequestBody(body),
      );
      break;
    }

    case 'registerComplete': {
      const publicKeyCredential = this.getNodeParameter('publicKeyCredential', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      let credential: IDataObject;
      try {
        credential = JSON.parse(publicKeyCredential);
      } catch {
        throw new Error('Invalid JSON for public key credential');
      }

      const body: IDataObject = {
        public_key_credential: credential,
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
        '/webauthn/register',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticateStart': {
      const userId = this.getNodeParameter('userId', i) as string;
      const domain = this.getNodeParameter('domain', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        user_id: userId,
        domain,
      };

      if (options.userAgent) {
        body.user_agent = options.userAgent;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/webauthn/authenticate/start',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticateComplete': {
      const publicKeyCredential = this.getNodeParameter('publicKeyCredential', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      let credential: IDataObject;
      try {
        credential = JSON.parse(publicKeyCredential);
      } catch {
        throw new Error('Invalid JSON for public key credential');
      }

      const body: IDataObject = {
        public_key_credential: credential,
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
        '/webauthn/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'update': {
      const webAuthnRegistrationId = this.getNodeParameter('webAuthnRegistrationId', i) as string;
      const name = this.getNodeParameter('name', i) as string;

      const body: IDataObject = {
        name,
      };

      responseData = await stytchApiRequest.call(
        this,
        'PUT',
        `/webauthn/${webAuthnRegistrationId}`,
        body,
      );
      break;
    }
  }

  return responseData;
}
