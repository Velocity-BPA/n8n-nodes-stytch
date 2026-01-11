/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, stytchApiRequestAllItems, cleanRequestBody } from '../../transport/stytchApi';

export const b2bMemberOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new member in an organization',
        action: 'Create a member',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a member',
        action: 'Delete a member',
      },
      {
        name: 'Delete Email',
        value: 'deleteEmail',
        description: 'Remove an email from a member',
        action: 'Delete member email',
      },
      {
        name: 'Delete Password',
        value: 'deletePassword',
        description: 'Remove password from a member',
        action: 'Delete member password',
      },
      {
        name: 'Delete Phone',
        value: 'deletePhone',
        description: 'Remove a phone from a member',
        action: 'Delete member phone',
      },
      {
        name: 'Delete TOTP',
        value: 'deleteTOTP',
        description: 'Remove TOTP registration from a member',
        action: 'Delete member TOTP',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a member by ID',
        action: 'Get a member',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Search and list members',
        action: 'Get many members',
      },
      {
        name: 'Reactivate',
        value: 'reactivate',
        description: 'Reactivate a deleted member',
        action: 'Reactivate a member',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a member',
        action: 'Update a member',
      },
    ],
    default: 'get',
  },
];

export const b2bMemberFields: INodeProperties[] = [
  // Organization ID for all operations
  {
    displayName: 'Organization ID',
    name: 'organizationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
      },
    },
    default: '',
    placeholder: 'organization-xxx',
    description: 'The organization ID',
  },
  // Member ID for get, update, delete, reactivate, delete* operations
  {
    displayName: 'Member ID',
    name: 'memberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['get', 'update', 'delete', 'reactivate', 'deleteEmail', 'deletePhone', 'deleteTOTP', 'deletePassword'],
      },
    },
    default: '',
    placeholder: 'member-xxx',
    description: 'The member ID',
  },
  // Email Address for create and deleteEmail
  {
    displayName: 'Email Address',
    name: 'emailAddress',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'user@example.com',
    description: 'Member email address',
  },
  // Email ID for deleteEmail
  {
    displayName: 'Email ID',
    name: 'emailId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['deleteEmail'],
      },
    },
    default: '',
    description: 'The email ID to remove',
  },
  // Phone ID for deletePhone
  {
    displayName: 'Phone ID',
    name: 'phoneId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['deletePhone'],
      },
    },
    default: '',
    description: 'The phone ID to remove',
  },
  // Return All for getAll
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  // Limit for getAll
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['b2bMember'],
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
  // Create Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Create Member as Pending',
        name: 'createMemberAsPending',
        type: 'boolean',
        default: false,
        description: 'Whether to create the member without sending an email verification',
      },
      {
        displayName: 'Is Breakglass',
        name: 'isBreakglass',
        type: 'boolean',
        default: false,
        description: 'Whether member has breakglass admin access',
      },
      {
        displayName: 'MFA Enrolled',
        name: 'mfaEnrolled',
        type: 'boolean',
        default: false,
        description: 'Whether MFA is enrolled for this member',
      },
      {
        displayName: 'MFA Phone Number',
        name: 'mfaPhoneNumber',
        type: 'string',
        default: '',
        placeholder: '+12025551234',
        description: 'Phone number for MFA (E.164 format)',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Member display name',
      },
      {
        displayName: 'Roles',
        name: 'roles',
        type: 'string',
        default: '',
        placeholder: 'admin, member',
        description: 'Comma-separated list of role slugs',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side trusted metadata',
      },
      {
        displayName: 'Untrusted Metadata',
        name: 'untrustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Client-writable metadata',
      },
    ],
  },
  // Update Fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Email Address',
        name: 'emailAddress',
        type: 'string',
        default: '',
        description: 'Member email address',
      },
      {
        displayName: 'Is Breakglass',
        name: 'isBreakglass',
        type: 'boolean',
        default: false,
        description: 'Whether member has breakglass admin access',
      },
      {
        displayName: 'MFA Enrolled',
        name: 'mfaEnrolled',
        type: 'boolean',
        default: false,
        description: 'Whether MFA is enrolled for this member',
      },
      {
        displayName: 'MFA Phone Number',
        name: 'mfaPhoneNumber',
        type: 'string',
        default: '',
        placeholder: '+12025551234',
        description: 'Phone number for MFA (E.164 format)',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Member display name',
      },
      {
        displayName: 'Roles',
        name: 'roles',
        type: 'string',
        default: '',
        placeholder: 'admin, member',
        description: 'Comma-separated list of role slugs',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side trusted metadata',
      },
      {
        displayName: 'Untrusted Metadata',
        name: 'untrustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Client-writable metadata',
      },
    ],
  },
  // Search Options for getAll
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bMember'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'Search query to filter members',
      },
      {
        displayName: 'Statuses',
        name: 'statuses',
        type: 'multiOptions',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Pending', value: 'pending' },
          { name: 'Invited', value: 'invited' },
        ],
        default: [],
        description: 'Filter by member status',
      },
    ],
  },
];

export async function executeB2bMemberOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};
  const organizationId = this.getNodeParameter('organizationId', i) as string;

  switch (operation) {
    case 'create': {
      const emailAddress = this.getNodeParameter('emailAddress', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        organization_id: organizationId,
        email_address: emailAddress,
      };

      if (options.name) {
        body.name = options.name;
      }
      if (options.trustedMetadata) {
        try {
          body.trusted_metadata = JSON.parse(options.trustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (options.untrustedMetadata) {
        try {
          body.untrusted_metadata = JSON.parse(options.untrustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (options.createMemberAsPending !== undefined) {
        body.create_member_as_pending = options.createMemberAsPending;
      }
      if (options.isBreakglass !== undefined) {
        body.is_breakglass = options.isBreakglass;
      }
      if (options.mfaEnrolled !== undefined) {
        body.mfa_enrolled = options.mfaEnrolled;
      }
      if (options.mfaPhoneNumber) {
        body.mfa_phone_number = options.mfaPhoneNumber;
      }
      if (options.roles) {
        body.roles = (options.roles as string).split(',').map((r) => ({ role_id: r.trim() }));
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        `/organizations/${organizationId}/members`,
        cleanRequestBody(body),
      );
      break;
    }

    case 'get': {
      const memberId = this.getNodeParameter('memberId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'GET',
        `/organizations/${organizationId}/members/${memberId}`,
      );
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        organization_ids: [organizationId],
      };

      if (options.query) {
        body.query = {
          operator: 'AND',
          operands: [
            {
              filter_name: 'member_email_fuzzy',
              filter_value: options.query,
            },
          ],
        };
      }
      if (options.statuses && (options.statuses as string[]).length > 0) {
        body.query = body.query || { operator: 'AND', operands: [] };
        (body.query as IDataObject).operands = [
          ...((body.query as IDataObject).operands as IDataObject[]),
          {
            filter_name: 'statuses',
            filter_value: options.statuses,
          },
        ];
      }

      if (returnAll) {
        responseData = await stytchApiRequestAllItems.call(
          this,
          'POST',
          '/organizations/members/search',
          body,
          {},
          'members',
        );
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        body.limit = limit;
        const response = await stytchApiRequest.call(
          this,
          'POST',
          '/organizations/members/search',
          body,
        );
        responseData = (response.members as IDataObject[]) || [];
      }
      break;
    }

    case 'update': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.emailAddress) {
        body.email_address = updateFields.emailAddress;
      }
      if (updateFields.name) {
        body.name = updateFields.name;
      }
      if (updateFields.trustedMetadata) {
        try {
          body.trusted_metadata = JSON.parse(updateFields.trustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (updateFields.untrustedMetadata) {
        try {
          body.untrusted_metadata = JSON.parse(updateFields.untrustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (updateFields.isBreakglass !== undefined) {
        body.is_breakglass = updateFields.isBreakglass;
      }
      if (updateFields.mfaEnrolled !== undefined) {
        body.mfa_enrolled = updateFields.mfaEnrolled;
      }
      if (updateFields.mfaPhoneNumber) {
        body.mfa_phone_number = updateFields.mfaPhoneNumber;
      }
      if (updateFields.roles) {
        body.roles = (updateFields.roles as string).split(',').map((r) => ({ role_id: r.trim() }));
      }

      responseData = await stytchApiRequest.call(
        this,
        'PUT',
        `/organizations/${organizationId}/members/${memberId}`,
        cleanRequestBody(body),
      );
      break;
    }

    case 'delete': {
      const memberId = this.getNodeParameter('memberId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}/members/${memberId}`,
      );
      break;
    }

    case 'reactivate': {
      const memberId = this.getNodeParameter('memberId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'PUT',
        `/organizations/${organizationId}/members/${memberId}/reactivate`,
        {},
      );
      break;
    }

    case 'deleteEmail': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      const emailId = this.getNodeParameter('emailId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}/members/${memberId}/emails/${emailId}`,
      );
      break;
    }

    case 'deletePhone': {
      const memberId = this.getNodeParameter('memberId', i) as string;
      const phoneId = this.getNodeParameter('phoneId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}/members/${memberId}/phone_numbers/${phoneId}`,
      );
      break;
    }

    case 'deleteTOTP': {
      const memberId = this.getNodeParameter('memberId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}/members/${memberId}/totp`,
      );
      break;
    }

    case 'deletePassword': {
      const memberId = this.getNodeParameter('memberId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}/members/${memberId}/password`,
      );
      break;
    }
  }

  return responseData;
}
