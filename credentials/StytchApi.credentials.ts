/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class StytchApi implements ICredentialType {
  name = 'stytchApi';
  displayName = 'Stytch API';
  documentationUrl = 'https://stytch.com/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'Project ID',
      name: 'projectId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Stytch project ID (found in the Stytch Dashboard)',
    },
    {
      displayName: 'Secret',
      name: 'secret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Stytch project secret (found in the Stytch Dashboard)',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Test',
          value: 'test',
        },
        {
          name: 'Live',
          value: 'live',
        },
      ],
      default: 'test',
      required: true,
      description: 'The Stytch environment to use',
    },
    {
      displayName: 'Product Type',
      name: 'productType',
      type: 'options',
      options: [
        {
          name: 'Consumer (B2C)',
          value: 'consumer',
        },
        {
          name: 'B2B',
          value: 'b2b',
        },
      ],
      default: 'consumer',
      required: true,
      description: 'The Stytch product type to use',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.projectId}}',
        password: '={{$credentials.secret}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "live" ? "https://api.stytch.com" : "https://test.stytch.com"}}',
      url: '={{$credentials.productType === "b2b" ? "/v1/b2b/organizations" : "/v1/users"}}',
      method: 'GET',
      qs: {
        limit: 1,
      },
    },
  };
}
