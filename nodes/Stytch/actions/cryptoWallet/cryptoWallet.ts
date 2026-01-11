/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { STYTCH_CRYPTO_WALLET_TYPES } from '../../constants/constants';

export const cryptoWalletOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['cryptoWallet'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Complete crypto wallet authentication',
        action: 'Authenticate crypto wallet',
      },
      {
        name: 'Authenticate Start',
        value: 'authenticateStart',
        description: 'Start crypto wallet authentication',
        action: 'Start crypto wallet authentication',
      },
    ],
    default: 'authenticateStart',
  },
];

export const cryptoWalletFields: INodeProperties[] = [
  // Crypto Wallet Type
  {
    displayName: 'Wallet Type',
    name: 'cryptoWalletType',
    type: 'options',
    options: STYTCH_CRYPTO_WALLET_TYPES,
    required: true,
    displayOptions: {
      show: {
        resource: ['cryptoWallet'],
        operation: ['authenticateStart'],
      },
    },
    default: 'ethereum',
    description: 'Type of crypto wallet',
  },
  // Crypto Wallet Address for authenticateStart
  {
    displayName: 'Wallet Address',
    name: 'cryptoWalletAddress',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['cryptoWallet'],
        operation: ['authenticateStart'],
      },
    },
    default: '',
    placeholder: '0x...',
    description: 'The crypto wallet address',
  },
  // Crypto Wallet ID for authenticate
  {
    displayName: 'Crypto Wallet ID',
    name: 'cryptoWalletId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['cryptoWallet'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The crypto wallet ID returned from authenticate start',
  },
  // Signature for authenticate
  {
    displayName: 'Signature',
    name: 'signature',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['cryptoWallet'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The signed message signature from the wallet',
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
        resource: ['cryptoWallet'],
        operation: ['authenticateStart'],
      },
    },
    options: [
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        description: 'User ID to associate with the wallet',
      },
      {
        displayName: 'SIWE Domain',
        name: 'siweDomain',
        type: 'string',
        default: '',
        description: 'Domain for Sign-In With Ethereum',
      },
      {
        displayName: 'SIWE URI',
        name: 'siweUri',
        type: 'string',
        default: '',
        description: 'URI for Sign-In With Ethereum',
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
        resource: ['cryptoWallet'],
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
];

export async function executeCryptoWalletOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'authenticateStart': {
      const cryptoWalletType = this.getNodeParameter('cryptoWalletType', i) as string;
      const cryptoWalletAddress = this.getNodeParameter('cryptoWalletAddress', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        crypto_wallet_type: cryptoWalletType,
        crypto_wallet_address: cryptoWalletAddress,
      };

      if (options.userId) {
        body.user_id = options.userId;
      }
      if (options.siweDomain) {
        body.siwe_params = body.siwe_params || {};
        (body.siwe_params as IDataObject).domain = options.siweDomain;
      }
      if (options.siweUri) {
        body.siwe_params = body.siwe_params || {};
        (body.siwe_params as IDataObject).uri = options.siweUri;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/crypto_wallets/authenticate/start',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticate': {
      const cryptoWalletId = this.getNodeParameter('cryptoWalletId', i) as string;
      const signature = this.getNodeParameter('signature', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        crypto_wallet_id: cryptoWalletId,
        signature,
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
        '/crypto_wallets/authenticate',
        cleanRequestBody(body),
      );
      break;
    }
  }

  return responseData;
}
