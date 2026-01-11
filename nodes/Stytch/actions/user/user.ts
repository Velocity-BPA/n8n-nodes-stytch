/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, stytchApiRequestAllItems, cleanRequestBody } from '../../transport/stytchApi';
import { buildNameObject, parseMetadata } from '../../utils/helpers';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new user',
        action: 'Create a user',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Permanently delete a user',
        action: 'Delete a user',
      },
      {
        name: 'Delete Biometric',
        value: 'deleteBiometric',
        description: 'Remove biometric registration from user',
        action: 'Delete biometric registration',
      },
      {
        name: 'Delete Crypto Wallet',
        value: 'deleteCryptoWallet',
        description: 'Remove crypto wallet from user',
        action: 'Delete crypto wallet',
      },
      {
        name: 'Delete Email',
        value: 'deleteEmail',
        description: 'Remove email from user',
        action: 'Delete email from user',
      },
      {
        name: 'Delete OAuth',
        value: 'deleteOAuth',
        description: 'Remove OAuth connection from user',
        action: 'Delete OAuth connection',
      },
      {
        name: 'Delete Password',
        value: 'deletePassword',
        description: 'Remove password from user',
        action: 'Delete password from user',
      },
      {
        name: 'Delete Phone',
        value: 'deletePhone',
        description: 'Remove phone number from user',
        action: 'Delete phone from user',
      },
      {
        name: 'Delete TOTP',
        value: 'deleteTOTP',
        description: 'Remove TOTP registration from user',
        action: 'Delete TOTP registration',
      },
      {
        name: 'Delete WebAuthn',
        value: 'deleteWebAuthn',
        description: 'Remove WebAuthn registration from user',
        action: 'Delete WebAuthn registration',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a user by ID',
        action: 'Get a user',
      },
      {
        name: 'Get by Email',
        value: 'getByEmail',
        description: 'Search for a user by email',
        action: 'Get user by email',
      },
      {
        name: 'Get by Phone',
        value: 'getByPhone',
        description: 'Search for a user by phone number',
        action: 'Get user by phone',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many users',
        action: 'Get many users',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update user properties',
        action: 'Update a user',
      },
    ],
    default: 'create',
  },
];

export const userFields: INodeProperties[] = [
  // Create operation fields
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create', 'getByEmail'],
      },
    },
    default: '',
    description: 'Email address of the user',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Create User as Pending',
        name: 'createUserAsPending',
        type: 'boolean',
        default: false,
        description: 'Whether to create user without verification',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'First name of the user',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Last name of the user',
      },
      {
        displayName: 'Middle Name',
        name: 'middleName',
        type: 'string',
        default: '',
        description: 'Middle name of the user',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        placeholder: '+14155551234',
        description: 'Phone number in E.164 format',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side metadata (JSON)',
      },
      {
        displayName: 'Untrusted Metadata',
        name: 'untrustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Client-writable metadata (JSON)',
      },
    ],
  },
  // User ID field for operations that need it
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'update', 'delete', 'deleteBiometric', 'deleteCryptoWallet', 'deleteOAuth', 'deletePassword', 'deleteTOTP', 'deleteWebAuthn'],
      },
    },
    default: '',
    placeholder: 'user-xxx',
    description: 'The unique ID of the user',
  },
  // Phone number for getByPhone
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getByPhone'],
      },
    },
    default: '',
    placeholder: '+14155551234',
    description: 'Phone number in E.164 format',
  },
  // Email ID for deleteEmail
  {
    displayName: 'Email ID',
    name: 'emailId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteEmail'],
      },
    },
    default: '',
    description: 'The unique ID of the email to delete',
  },
  // Phone ID for deletePhone
  {
    displayName: 'Phone ID',
    name: 'phoneId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deletePhone'],
      },
    },
    default: '',
    description: 'The unique ID of the phone number to delete',
  },
  // WebAuthn ID
  {
    displayName: 'WebAuthn Registration ID',
    name: 'webAuthnRegistrationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteWebAuthn'],
      },
    },
    default: '',
    description: 'The unique ID of the WebAuthn registration to delete',
  },
  // TOTP ID
  {
    displayName: 'TOTP ID',
    name: 'totpId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteTOTP'],
      },
    },
    default: '',
    description: 'The unique ID of the TOTP registration to delete',
  },
  // Crypto Wallet ID
  {
    displayName: 'Crypto Wallet ID',
    name: 'cryptoWalletId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteCryptoWallet'],
      },
    },
    default: '',
    description: 'The unique ID of the crypto wallet to delete',
  },
  // Password ID
  {
    displayName: 'Password ID',
    name: 'passwordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deletePassword'],
      },
    },
    default: '',
    description: 'The unique ID of the password to delete',
  },
  // Biometric ID
  {
    displayName: 'Biometric Registration ID',
    name: 'biometricRegistrationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteBiometric'],
      },
    },
    default: '',
    description: 'The unique ID of the biometric registration to delete',
  },
  // OAuth Provider
  {
    displayName: 'OAuth Provider',
    name: 'oauthProvider',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['deleteOAuth'],
      },
    },
    default: '',
    description: 'The OAuth provider to disconnect (e.g., google, github)',
  },
  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'First name of the user',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Last name of the user',
      },
      {
        displayName: 'Middle Name',
        name: 'middleName',
        type: 'string',
        default: '',
        description: 'Middle name of the user',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side metadata (JSON)',
      },
      {
        displayName: 'Untrusted Metadata',
        name: 'untrustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Client-writable metadata (JSON)',
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
        resource: ['user'],
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
        resource: ['user'],
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

export async function executeUserOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'create': {
      const email = this.getNodeParameter('email', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

      const body: IDataObject = {
        email,
      };

      if (additionalFields.phoneNumber) {
        body.phone_number = additionalFields.phoneNumber;
      }

      if (additionalFields.createUserAsPending) {
        body.create_user_as_pending = additionalFields.createUserAsPending;
      }

      const name = buildNameObject(
        additionalFields.firstName as string,
        additionalFields.middleName as string,
        additionalFields.lastName as string,
      );
      if (name) {
        body.name = name;
      }

      if (additionalFields.trustedMetadata) {
        body.trusted_metadata = parseMetadata(additionalFields.trustedMetadata as string);
      }

      if (additionalFields.untrustedMetadata) {
        body.untrusted_metadata = parseMetadata(additionalFields.untrustedMetadata as string);
      }

      responseData = await stytchApiRequest.call(this, 'POST', '/users', cleanRequestBody(body));
      break;
    }

    case 'get': {
      const userId = this.getNodeParameter('userId', i) as string;
      responseData = await stytchApiRequest.call(this, 'GET', `/users/${userId}`);
      break;
    }

    case 'getByEmail': {
      const email = this.getNodeParameter('email', i) as string;
      responseData = await stytchApiRequest.call(this, 'GET', '/users/search', undefined, { email });
      break;
    }

    case 'getByPhone': {
      const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
      responseData = await stytchApiRequest.call(this, 'GET', '/users/search', undefined, {
        phone_number: phoneNumber,
      });
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;

      if (returnAll) {
        const users = await stytchApiRequestAllItems.call(
          this,
          'GET',
          '/users/search',
          undefined,
          undefined,
          'users',
        );
        responseData = { users };
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        responseData = await stytchApiRequest.call(this, 'GET', '/users/search', undefined, {
          limit,
        });
      }
      break;
    }

    case 'update': {
      const userId = this.getNodeParameter('userId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const body: IDataObject = {};

      const name = buildNameObject(
        updateFields.firstName as string,
        updateFields.middleName as string,
        updateFields.lastName as string,
      );
      if (name) {
        body.name = name;
      }

      if (updateFields.trustedMetadata) {
        body.trusted_metadata = parseMetadata(updateFields.trustedMetadata as string);
      }

      if (updateFields.untrustedMetadata) {
        body.untrusted_metadata = parseMetadata(updateFields.untrustedMetadata as string);
      }

      responseData = await stytchApiRequest.call(
        this,
        'PUT',
        `/users/${userId}`,
        cleanRequestBody(body),
      );
      break;
    }

    case 'delete': {
      const userId = this.getNodeParameter('userId', i) as string;
      responseData = await stytchApiRequest.call(this, 'DELETE', `/users/${userId}`);
      break;
    }

    case 'deleteEmail': {
      const emailId = this.getNodeParameter('emailId', i) as string;
      responseData = await stytchApiRequest.call(this, 'DELETE', `/users/emails/${emailId}`);
      break;
    }

    case 'deletePhone': {
      const phoneId = this.getNodeParameter('phoneId', i) as string;
      responseData = await stytchApiRequest.call(this, 'DELETE', `/users/phone_numbers/${phoneId}`);
      break;
    }

    case 'deleteWebAuthn': {
      const webAuthnRegistrationId = this.getNodeParameter('webAuthnRegistrationId', i) as string;
      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/users/webauthn_registrations/${webAuthnRegistrationId}`,
      );
      break;
    }

    case 'deleteTOTP': {
      const totpId = this.getNodeParameter('totpId', i) as string;
      responseData = await stytchApiRequest.call(this, 'DELETE', `/users/totps/${totpId}`);
      break;
    }

    case 'deleteCryptoWallet': {
      const cryptoWalletId = this.getNodeParameter('cryptoWalletId', i) as string;
      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/users/crypto_wallets/${cryptoWalletId}`,
      );
      break;
    }

    case 'deletePassword': {
      const passwordId = this.getNodeParameter('passwordId', i) as string;
      responseData = await stytchApiRequest.call(this, 'DELETE', `/users/passwords/${passwordId}`);
      break;
    }

    case 'deleteBiometric': {
      const biometricRegistrationId = this.getNodeParameter('biometricRegistrationId', i) as string;
      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/users/biometric_registrations/${biometricRegistrationId}`,
      );
      break;
    }

    case 'deleteOAuth': {
      const userId = this.getNodeParameter('userId', i) as string;
      const oauthProvider = this.getNodeParameter('oauthProvider', i) as string;
      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/users/${userId}/oauth_providers/${oauthProvider}`,
      );
      break;
    }
  }

  return responseData;
}
