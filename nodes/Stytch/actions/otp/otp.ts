/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, cleanRequestBody } from '../../transport/stytchApi';
import { buildAttributesObject } from '../../utils/helpers';
import { STYTCH_LOCALES } from '../../constants/constants';

export const otpOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['otp'],
      },
    },
    options: [
      {
        name: 'Authenticate',
        value: 'authenticate',
        description: 'Verify an OTP code',
        action: 'Authenticate OTP',
      },
      {
        name: 'Login or Create',
        value: 'loginOrCreate',
        description: 'Send OTP and create user if needed',
        action: 'Login or create with OTP',
      },
      {
        name: 'Send by Email',
        value: 'sendByEmail',
        description: 'Send OTP via email',
        action: 'Send OTP by email',
      },
      {
        name: 'Send by SMS',
        value: 'sendBySms',
        description: 'Send OTP via SMS',
        action: 'Send OTP by SMS',
      },
      {
        name: 'Send by WhatsApp',
        value: 'sendByWhatsApp',
        description: 'Send OTP via WhatsApp',
        action: 'Send OTP by WhatsApp',
      },
    ],
    default: 'sendBySms',
  },
];

export const otpFields: INodeProperties[] = [
  // Phone number for SMS and WhatsApp
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['sendBySms', 'sendByWhatsApp'],
      },
    },
    default: '',
    placeholder: '+14155551234',
    description: 'Phone number in E.164 format',
  },
  // Email for email OTP
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['sendByEmail'],
      },
    },
    default: '',
    description: 'Email address to send the OTP to',
  },
  // Method ID for authentication
  {
    displayName: 'Method ID',
    name: 'methodId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The method ID returned from the send operation',
  },
  // OTP Code for authentication
  {
    displayName: 'OTP Code',
    name: 'code',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['authenticate'],
      },
    },
    default: '',
    description: 'The OTP code entered by the user',
  },
  // Login or Create fields
  {
    displayName: 'Method',
    name: 'method',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['loginOrCreate'],
      },
    },
    options: [
      {
        name: 'Email',
        value: 'email',
      },
      {
        name: 'SMS',
        value: 'sms',
      },
      {
        name: 'WhatsApp',
        value: 'whatsapp',
      },
    ],
    default: 'email',
    description: 'The method to use for sending the OTP',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['loginOrCreate'],
        method: ['email'],
      },
    },
    default: '',
    description: 'Email address to send the OTP to',
  },
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['loginOrCreate'],
        method: ['sms', 'whatsapp'],
      },
    },
    default: '',
    placeholder: '+14155551234',
    description: 'Phone number in E.164 format',
  },
  // Options for SMS
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['sendBySms', 'sendByWhatsApp'],
      },
    },
    options: [
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        default: 10,
        description: 'OTP expiration time in minutes',
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        default: '',
        description: 'IP address for fraud detection',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'options',
        options: STYTCH_LOCALES,
        default: 'en',
        description: 'Language for the message',
      },
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
        description: 'User agent for fraud detection',
      },
    ],
  },
  // Options for Email OTP
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['sendByEmail'],
      },
    },
    options: [
      {
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        default: 10,
        description: 'OTP expiration time in minutes',
      },
      {
        displayName: 'IP Address',
        name: 'ipAddress',
        type: 'string',
        default: '',
        description: 'IP address for fraud detection',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'options',
        options: STYTCH_LOCALES,
        default: 'en',
        description: 'Language for the email',
      },
      {
        displayName: 'Login Template ID',
        name: 'loginTemplateId',
        type: 'string',
        default: '',
        description: 'Custom email template ID for login',
      },
      {
        displayName: 'Signup Template ID',
        name: 'signupTemplateId',
        type: 'string',
        default: '',
        description: 'Custom email template ID for signup',
      },
      {
        displayName: 'User Agent',
        name: 'userAgent',
        type: 'string',
        default: '',
        description: 'User agent for fraud detection',
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
        resource: ['otp'],
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
  // Options for login or create
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['otp'],
        operation: ['loginOrCreate'],
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
        displayName: 'Expiration Minutes',
        name: 'expirationMinutes',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 60,
        },
        default: 10,
        description: 'OTP expiration time in minutes',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'options',
        options: STYTCH_LOCALES,
        default: 'en',
        description: 'Language for the message',
      },
    ],
  },
];

export async function executeOtpOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject> {
  let responseData: IDataObject = {};

  switch (operation) {
    case 'sendBySms': {
      const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        phone_number: phoneNumber,
      };

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }
      if (options.locale) {
        body.locale = options.locale;
      }

      const attributes = buildAttributesObject(
        options.ipAddress as string,
        options.userAgent as string,
      );
      if (attributes) {
        body.attributes = attributes;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/otps/sms/send',
        cleanRequestBody(body),
      );
      break;
    }

    case 'sendByWhatsApp': {
      const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        phone_number: phoneNumber,
      };

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }
      if (options.locale) {
        body.locale = options.locale;
      }

      const attributes = buildAttributesObject(
        options.ipAddress as string,
        options.userAgent as string,
      );
      if (attributes) {
        body.attributes = attributes;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/otps/whatsapp/send',
        cleanRequestBody(body),
      );
      break;
    }

    case 'sendByEmail': {
      const email = this.getNodeParameter('email', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        email,
      };

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }
      if (options.locale) {
        body.locale = options.locale;
      }
      if (options.loginTemplateId) {
        body.login_template_id = options.loginTemplateId;
      }
      if (options.signupTemplateId) {
        body.signup_template_id = options.signupTemplateId;
      }

      const attributes = buildAttributesObject(
        options.ipAddress as string,
        options.userAgent as string,
      );
      if (attributes) {
        body.attributes = attributes;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/otps/email/send',
        cleanRequestBody(body),
      );
      break;
    }

    case 'authenticate': {
      const methodId = this.getNodeParameter('methodId', i) as string;
      const code = this.getNodeParameter('code', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        method_id: methodId,
        code,
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
        '/otps/authenticate',
        cleanRequestBody(body),
      );
      break;
    }

    case 'loginOrCreate': {
      const method = this.getNodeParameter('method', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {};

      if (method === 'email') {
        const email = this.getNodeParameter('email', i) as string;
        body.email = email;
      } else {
        const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
        body.phone_number = phoneNumber;
      }

      if (options.expirationMinutes) {
        body.expiration_minutes = options.expirationMinutes;
      }
      if (options.locale) {
        body.locale = options.locale;
      }
      if (options.createUserAsPending) {
        body.create_user_as_pending = options.createUserAsPending;
      }

      let endpoint: string;
      switch (method) {
        case 'email':
          endpoint = '/otps/email/login_or_create';
          break;
        case 'sms':
          endpoint = '/otps/sms/login_or_create';
          break;
        case 'whatsapp':
          endpoint = '/otps/whatsapp/login_or_create';
          break;
        default:
          endpoint = '/otps/email/login_or_create';
      }

      responseData = await stytchApiRequest.call(this, 'POST', endpoint, cleanRequestBody(body));
      break;
    }
  }

  return responseData;
}
