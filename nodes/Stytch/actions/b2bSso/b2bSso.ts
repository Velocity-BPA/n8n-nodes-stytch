/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';

export const b2bSsoOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['b2bSso'],
      },
    },
    options: [
      {
        name: 'Authenticate OIDC',
        value: 'authenticateOIDC',
        description: 'Authenticate using OIDC',
        action: 'Authenticate OIDC',
      },
      {
        name: 'Authenticate SAML',
        value: 'authenticateSAML',
        description: 'Authenticate using SAML',
        action: 'Authenticate SAML',
      },
      {
        name: 'Delete Connection',
        value: 'deleteConnection',
        description: 'Delete an SSO connection',
        action: 'Delete SSO connection',
      },
      {
        name: 'Get Connections',
        value: 'getConnections',
        description: 'List SSO connections for an organization',
        action: 'Get SSO connections',
      },
    ],
    default: 'getConnections',
  },
];

export const b2bSsoFields: INodeProperties[] = [
  // Organization ID for getConnections, deleteConnection
  {
    displayName: 'Organization ID',
    name: 'organizationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['getConnections', 'deleteConnection'],
      },
    },
    default: '',
    placeholder: 'organization-xxx',
    description: 'The organization ID',
  },
  // Connection ID for deleteConnection
  {
    displayName: 'Connection ID',
    name: 'connectionId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['deleteConnection'],
      },
    },
    default: '',
    description: 'The SSO connection ID to delete',
  },
  // Token for SAML authenticate
  {
    displayName: 'SSO Token',
    name: 'ssoToken',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['authenticateSAML', 'authenticateOIDC'],
      },
    },
    default: '',
    description: 'The SSO token returned from the IdP callback',
  },
  // PKCE Code Verifier for OIDC
  {
    displayName: 'PKCE Code Verifier',
    name: 'pkceCodeVerifier',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['authenticateOIDC'],
      },
    },
    default: '',
    description: 'PKCE code verifier if PKCE was used in the authorization request',
  },
  // Options for authenticateSAML
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['authenticateSAML'],
      },
    },
    options: [
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'string',
        default: 'en',
        description: 'Locale for the session',
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
        displayName: 'Session JWT',
        name: 'sessionJwt',
        type: 'string',
        default: '',
        description: 'Existing session JWT to extend',
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
  // Options for authenticateOIDC
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bSso'],
        operation: ['authenticateOIDC'],
      },
    },
    options: [
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'string',
        default: 'en',
        description: 'Locale for the session',
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
        displayName: 'Session JWT',
        name: 'sessionJwt',
        type: 'string',
        default: '',
        description: 'Existing session JWT to extend',
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

export async function executeB2bSsoOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'getConnections': {
      const organizationId = this.getNodeParameter('organizationId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'GET',
        `/sso/${organizationId}`,
      );
      break;
    }

    case 'deleteConnection': {
      const organizationId = this.getNodeParameter('organizationId', i) as string;
      const connectionId = this.getNodeParameter('connectionId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/sso/${organizationId}/connections/${connectionId}`,
      );
      break;
    }

    case 'authenticateSAML': {
      const ssoToken = this.getNodeParameter('ssoToken', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        sso_token: ssoToken,
      };

      if (options.sessionToken) {
        body.session_token = options.sessionToken;
      }
      if (options.sessionJwt) {
        body.session_jwt = options.sessionJwt;
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
      if (options.locale) {
        body.locale = options.locale;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/sso/saml/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticateOIDC': {
      const ssoToken = this.getNodeParameter('ssoToken', i) as string;
      const pkceCodeVerifier = this.getNodeParameter('pkceCodeVerifier', i, '') as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        sso_token: ssoToken,
      };

      if (pkceCodeVerifier) {
        body.pkce_code_verifier = pkceCodeVerifier;
      }
      if (options.sessionToken) {
        body.session_token = options.sessionToken;
      }
      if (options.sessionJwt) {
        body.session_jwt = options.sessionJwt;
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
      if (options.locale) {
        body.locale = options.locale;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/sso/oidc/authenticate',
        cleanRequestBody(body),
      );
      break;
    }
  }

  return responseData;
}
