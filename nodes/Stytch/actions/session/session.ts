/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, stytchApiRequestAllItems, cleanRequestBody } from '../../transport/stytchApi';

export const sessionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['session'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Authenticate a session token',
        action: 'Authenticate session',
      },
      {
        name: 'Authenticate JWT',
        value: 'authenticateJwt',
        description: 'Authenticate a session JWT',
        action: 'Authenticate session JWT',
      },
      {
        name: 'Exchange',
        value: 'exchange',
        description: 'Exchange session for different token type',
        action: 'Exchange session',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a session by ID',
        action: 'Get session',
      },
      {
        name: 'Get JWKS',
        value: 'getJwks',
        description: 'Get JSON Web Key Set',
        action: 'Get JWKS',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many sessions for a user',
        action: 'Get many sessions',
      },
      {
        name: 'Revoke',
        value: 'revoke',
        description: 'Revoke a specific session',
        action: 'Revoke session',
      },
    ],
    default: 'authenticate',
  },
];

export const sessionFields: INodeProperties[] = [
  // Session ID for get
  {
    displayName: 'Session ID',
    name: 'sessionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The unique session ID',
  },
  // Session Token for authenticate
  {
    displayName: 'Session Token',
    name: 'sessionToken',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['authenticate', 'revoke', 'exchange'],
      },
    },
    default: '',
    description: 'The session token to authenticate or revoke',
  },
  // Session JWT for authenticateJwt
  {
    displayName: 'Session JWT',
    name: 'sessionJwt',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['authenticateJwt'],
      },
    },
    default: '',
    description: 'The session JWT to authenticate',
  },
  // User ID for getAll
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getAll'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The user ID to get sessions for',
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
        resource: ['session'],
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
  // Options for authenticateJwt
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['authenticateJwt'],
      },
    },
    options: [
      {
        displayName: 'Max Token Age Seconds',
        name: 'maxTokenAgeSeconds',
        type: 'number',
        typeOptions: {
          minValue: 0,
        },
        default: 300,
        description: 'Maximum age of the JWT in seconds',
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
    ],
  },
  // Return All for getAll
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },
];

export async function executeSessionOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'get': {
      const sessionId = this.getNodeParameter('sessionId', i) as string;
      responseData = await stytchApiRequest.call(this, 'GET', `/sessions/${sessionId}`);
      break;
    }

    case 'getAll': {
      const userId = this.getNodeParameter('userId', i) as string;
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const sessions = await stytchApiRequestAllItems.call(
          this,
          'GET',
          '/sessions',
          undefined,
          { user_id: userId },
          'sessions',
        );
        responseData = { sessions };
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        responseData = await stytchApiRequest.call(this, 'GET', '/sessions', undefined, {
          user_id: userId,
          limit,
        });
      }
      break;
    }

    case 'authenticate': {
      const sessionToken = this.getNodeParameter('sessionToken', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        session_token: sessionToken,
      };

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
        '/sessions/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticateJwt': {
      const sessionJwt = this.getNodeParameter('sessionJwt', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        session_jwt: sessionJwt,
      };

      if (options.sessionDurationMinutes) {
        body.session_duration_minutes = options.sessionDurationMinutes;
      }
      if (options.maxTokenAgeSeconds) {
        body.max_token_age_seconds = options.maxTokenAgeSeconds;
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
        '/sessions/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'revoke': {
      const sessionToken = this.getNodeParameter('sessionToken', i) as string;

      const body: IDataObject = {
        session_token: sessionToken,
      };

      responseData = await stytchApiRequest.call(this, 'POST', '/sessions/revoke', body);
      break;
    }

    case 'getJwks': {
      responseData = await stytchApiRequest.call(this, 'GET', '/sessions/jwks');
      break;
    }

    case 'exchange': {
      const sessionToken = this.getNodeParameter('sessionToken', i) as string;

      const body: IDataObject = {
        session_token: sessionToken,
      };

      responseData = await stytchApiRequest.call(this, 'POST', '/sessions/exchange', body);
      break;
    }
  }

  return responseData;
}
