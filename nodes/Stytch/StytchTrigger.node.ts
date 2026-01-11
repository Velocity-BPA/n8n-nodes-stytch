/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IHookFunctions,
  IWebhookFunctions,
  IDataObject,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { STYTCH_WEBHOOK_EVENTS, VELOCITY_BPA_LICENSE_NOTICE } from './constants/constants';

export class StytchTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stytch Trigger',
    name: 'stytchTrigger',
    icon: 'file:stytch.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when Stytch events occur',
    defaults: {
      name: 'Stytch Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'stytchApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        description: 'The events to listen to',
        options: STYTCH_WEBHOOK_EVENTS,
      },
      {
        displayName: 'Webhook Secret',
        name: 'webhookSecret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description:
          'The webhook signing secret from your Stytch dashboard for HMAC signature verification',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Verify Signature',
            name: 'verifySignature',
            type: 'boolean',
            default: true,
            description: 'Whether to verify the HMAC signature of incoming webhooks',
          },
          {
            displayName: 'Signature Header Name',
            name: 'signatureHeaderName',
            type: 'string',
            default: 'x-stytch-signature',
            description: 'The header name containing the HMAC signature',
          },
          {
            displayName: 'Timestamp Header Name',
            name: 'timestampHeaderName',
            type: 'string',
            default: 'x-stytch-signature-timestamp',
            description: 'The header name containing the webhook timestamp',
          },
          {
            displayName: 'Max Timestamp Age (Seconds)',
            name: 'maxTimestampAge',
            type: 'number',
            default: 300,
            description: 'Maximum age of timestamp to accept (prevents replay attacks)',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // Stytch webhooks are configured in the dashboard
        // We can't programmatically check if they exist
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // Log licensing notice
        this.logger.warn(VELOCITY_BPA_LICENSE_NOTICE);

        // Stytch webhooks need to be configured in the dashboard
        // Display the webhook URL to the user
        const webhookUrl = this.getNodeWebhookUrl('default');
        this.logger.info(`Stytch webhook URL: ${webhookUrl}`);
        this.logger.info(
          'Configure this webhook URL in your Stytch dashboard at https://stytch.com/dashboard/webhooks',
        );
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhooks are managed in Stytch dashboard
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = this.getBodyData() as IDataObject;
    const headers = this.getHeaderData() as IDataObject;

    const events = this.getNodeParameter('events', []) as string[];
    const webhookSecret = this.getNodeParameter('webhookSecret', '') as string;
    const options = this.getNodeParameter('options', {}) as IDataObject;

    // Verify signature if enabled and secret is provided
    const verifySignature = options.verifySignature !== false;
    const signatureHeaderName = (options.signatureHeaderName as string) || 'x-stytch-signature';
    const timestampHeaderName =
      (options.timestampHeaderName as string) || 'x-stytch-signature-timestamp';
    const maxTimestampAge = (options.maxTimestampAge as number) || 300;

    if (verifySignature && webhookSecret) {
      const signature = headers[signatureHeaderName] as string;
      const timestamp = headers[timestampHeaderName] as string;

      if (!signature || !timestamp) {
        return {
          webhookResponse: {
            status: 401,
            body: 'Missing signature or timestamp header',
          },
        };
      }

      // Check timestamp age to prevent replay attacks
      const timestampAge = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
      if (timestampAge > maxTimestampAge) {
        return {
          webhookResponse: {
            status: 401,
            body: 'Timestamp too old',
          },
        };
      }

      // Verify HMAC signature
      const rawBody = req.rawBody?.toString() || JSON.stringify(body);
      const signaturePayload = `${timestamp}.${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(signaturePayload)
        .digest('hex');

      // Constant-time comparison to prevent timing attacks
      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        return {
          webhookResponse: {
            status: 401,
            body: 'Invalid signature',
          },
        };
      }
    }

    // Extract event type from the payload
    const eventType = body.event_type as string;

    // Check if this event type should trigger the workflow
    if (events.length > 0 && !events.includes(eventType) && !events.includes('*')) {
      // Event not in the filter list, return OK but don't trigger workflow
      return {
        webhookResponse: {
          status: 200,
          body: 'Event filtered',
        },
      };
    }

    // Return the webhook data
    return {
      workflowData: [
        [
          {
            json: {
              eventType,
              ...body,
              headers,
              receivedAt: new Date().toISOString(),
            },
          },
        ],
      ],
    };
  }
}
