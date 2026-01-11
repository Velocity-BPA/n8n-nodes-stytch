/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { VELOCITY_BPA_LICENSE_NOTICE } from './constants/constants';

// User resource
import { userOperations, userFields, executeUserOperation } from './actions/user/user';
// Magic Link resource
import {
  magicLinkOperations,
  magicLinkFields,
  executeMagicLinkOperation,
} from './actions/magicLink/magicLink';
// OTP resource
import { otpOperations, otpFields, executeOtpOperation } from './actions/otp/otp';
// Session resource
import {
  sessionOperations,
  sessionFields,
  executeSessionOperation,
} from './actions/session/session';
// OAuth resource
import { oauthOperations, oauthFields, executeOAuthOperation } from './actions/oauth/oauth';
// TOTP resource
import { totpOperations, totpFields, executeTotpOperation } from './actions/totp/totp';
// WebAuthn resource
import {
  webAuthnOperations,
  webAuthnFields,
  executeWebAuthnOperation,
} from './actions/webAuthn/webAuthn';
// Password resource
import {
  passwordOperations,
  passwordFields,
  executePasswordOperation,
} from './actions/password/password';
// Crypto Wallet resource
import {
  cryptoWalletOperations,
  cryptoWalletFields,
  executeCryptoWalletOperation,
} from './actions/cryptoWallet/cryptoWallet';
// B2B Organization resource
import {
  b2bOrganizationOperations,
  b2bOrganizationFields,
  executeB2bOrganizationOperation,
} from './actions/b2bOrganization/b2bOrganization';
// B2B Member resource
import {
  b2bMemberOperations,
  b2bMemberFields,
  executeB2bMemberOperation,
} from './actions/b2bMember/b2bMember';
// B2B SSO resource
import {
  b2bSsoOperations,
  b2bSsoFields,
  executeB2bSsoOperation,
} from './actions/b2bSso/b2bSso';

import { prepareOutput, prepareArrayOutput } from './utils/helpers';

export class Stytch implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stytch',
    name: 'stytch',
    icon: 'file:stytch.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Stytch passwordless authentication API',
    defaults: {
      name: 'Stytch',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'stytchApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'B2B Member',
            value: 'b2bMember',
            description: 'Manage organization members (B2B)',
          },
          {
            name: 'B2B Organization',
            value: 'b2bOrganization',
            description: 'Manage organizations (B2B)',
          },
          {
            name: 'B2B SSO',
            value: 'b2bSso',
            description: 'SSO authentication (B2B)',
          },
          {
            name: 'Crypto Wallet',
            value: 'cryptoWallet',
            description: 'Crypto wallet authentication',
          },
          {
            name: 'Magic Link',
            value: 'magicLink',
            description: 'Send and authenticate magic links',
          },
          {
            name: 'OAuth',
            value: 'oauth',
            description: 'OAuth social login authentication',
          },
          {
            name: 'OTP',
            value: 'otp',
            description: 'One-time passcode via SMS, WhatsApp, or email',
          },
          {
            name: 'Password',
            value: 'password',
            description: 'Password authentication and management',
          },
          {
            name: 'Session',
            value: 'session',
            description: 'Manage user sessions',
          },
          {
            name: 'TOTP',
            value: 'totp',
            description: 'Time-based one-time password (authenticator app)',
          },
          {
            name: 'User',
            value: 'user',
            description: 'Manage users',
          },
          {
            name: 'WebAuthn',
            value: 'webAuthn',
            description: 'WebAuthn (passkeys) authentication',
          },
        ],
        default: 'user',
      },
      // User operations and fields
      ...userOperations,
      ...userFields,
      // Magic Link operations and fields
      ...magicLinkOperations,
      ...magicLinkFields,
      // OTP operations and fields
      ...otpOperations,
      ...otpFields,
      // Session operations and fields
      ...sessionOperations,
      ...sessionFields,
      // OAuth operations and fields
      ...oauthOperations,
      ...oauthFields,
      // TOTP operations and fields
      ...totpOperations,
      ...totpFields,
      // WebAuthn operations and fields
      ...webAuthnOperations,
      ...webAuthnFields,
      // Password operations and fields
      ...passwordOperations,
      ...passwordFields,
      // Crypto Wallet operations and fields
      ...cryptoWalletOperations,
      ...cryptoWalletFields,
      // B2B Organization operations and fields
      ...b2bOrganizationOperations,
      ...b2bOrganizationFields,
      // B2B Member operations and fields
      ...b2bMemberOperations,
      ...b2bMemberFields,
      // B2B SSO operations and fields
      ...b2bSsoOperations,
      ...b2bSsoFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Log licensing notice once per execution
    this.logger.warn(VELOCITY_BPA_LICENSE_NOTICE);

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        switch (resource) {
          case 'user':
            responseData = await executeUserOperation.call(this, operation, i);
            break;

          case 'magicLink':
            responseData = await executeMagicLinkOperation.call(this, operation, i);
            break;

          case 'otp':
            responseData = await executeOtpOperation.call(this, operation, i);
            break;

          case 'session':
            responseData = await executeSessionOperation.call(this, operation, i);
            break;

          case 'oauth':
            responseData = await executeOAuthOperation.call(this, operation, i);
            break;

          case 'totp':
            responseData = await executeTotpOperation.call(this, operation, i);
            break;

          case 'webAuthn':
            responseData = await executeWebAuthnOperation.call(this, operation, i);
            break;

          case 'password':
            responseData = await executePasswordOperation.call(this, operation, i);
            break;

          case 'cryptoWallet':
            responseData = await executeCryptoWalletOperation.call(this, operation, i);
            break;

          case 'b2bOrganization':
            responseData = await executeB2bOrganizationOperation.call(this, operation, i);
            break;

          case 'b2bMember':
            responseData = await executeB2bMemberOperation.call(this, operation, i);
            break;

          case 'b2bSso':
            responseData = await executeB2bSsoOperation.call(this, operation, i);
            break;

          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Handle array responses (getAll operations)
        if (Array.isArray(responseData)) {
          returnData.push(...prepareArrayOutput(responseData, i));
        } else {
          returnData.push(prepareOutput(responseData, i));
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
