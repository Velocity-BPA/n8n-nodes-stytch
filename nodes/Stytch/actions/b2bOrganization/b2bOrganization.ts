/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { stytchApiRequest, stytchApiRequestAllItems, cleanRequestBody } from '../../transport/stytchApi';
import {
  STYTCH_MFA_POLICIES,
  STYTCH_AUTH_METHODS,
  STYTCH_JIT_PROVISIONING_MODES,
} from '../../constants/constants';

export const b2bOrganizationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new organization',
        action: 'Create an organization',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an organization',
        action: 'Delete an organization',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an organization by ID',
        action: 'Get an organization',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Search and list organizations',
        action: 'Get many organizations',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an organization',
        action: 'Update an organization',
      },
    ],
    default: 'get',
  },
];

export const b2bOrganizationFields: INodeProperties[] = [
  // Organization ID for get, update, delete
  {
    displayName: 'Organization ID',
    name: 'organizationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    placeholder: 'organization-xxx',
    description: 'The organization ID',
  },
  // Organization Name for create
  {
    displayName: 'Organization Name',
    name: 'organizationName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Display name for the organization',
  },
  // Organization Slug for create
  {
    displayName: 'Organization Slug',
    name: 'organizationSlug',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'my-organization',
    description: 'URL-friendly identifier for the organization',
  },
  // Return All for getAll
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
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
        resource: ['b2bOrganization'],
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
        resource: ['b2bOrganization'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Allowed Auth Methods',
        name: 'allowedAuthMethods',
        type: 'multiOptions',
        options: STYTCH_AUTH_METHODS,
        default: [],
        description: 'Specific auth methods allowed',
      },
      {
        displayName: 'Auth Methods',
        name: 'authMethods',
        type: 'options',
        options: [
          { name: 'All Allowed', value: 'ALL_ALLOWED' },
          { name: 'Restricted', value: 'RESTRICTED' },
        ],
        default: 'ALL_ALLOWED',
        description: 'Auth methods policy',
      },
      {
        displayName: 'Email Allowed Domains',
        name: 'emailAllowedDomains',
        type: 'string',
        default: '',
        placeholder: 'example.com, acme.com',
        description: 'Comma-separated list of allowed email domains',
      },
      {
        displayName: 'Email Invites',
        name: 'emailInvites',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'ALL_ALLOWED',
        description: 'Email invitation policy',
      },
      {
        displayName: 'Email JIT Provisioning',
        name: 'emailJitProvisioning',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'NOT_ALLOWED',
        description: 'Email JIT provisioning policy',
      },
      {
        displayName: 'MFA Methods',
        name: 'mfaMethods',
        type: 'options',
        options: [
          { name: 'All Allowed', value: 'ALL_ALLOWED' },
          { name: 'Restricted', value: 'RESTRICTED' },
        ],
        default: 'ALL_ALLOWED',
        description: 'MFA methods policy',
      },
      {
        displayName: 'MFA Policy',
        name: 'mfaPolicy',
        type: 'options',
        options: STYTCH_MFA_POLICIES,
        default: 'OPTIONAL',
        description: 'MFA enforcement policy',
      },
      {
        displayName: 'Organization Logo URL',
        name: 'organizationLogoUrl',
        type: 'string',
        default: '',
        description: 'URL of the organization logo',
      },
      {
        displayName: 'SSO Default Connection ID',
        name: 'ssoDefaultConnectionId',
        type: 'string',
        default: '',
        description: 'Default SSO connection ID',
      },
      {
        displayName: 'SSO JIT Provisioning',
        name: 'ssoJitProvisioning',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'NOT_ALLOWED',
        description: 'SSO JIT provisioning policy',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side trusted metadata',
      },
    ],
  },
  // Update Options
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['b2bOrganization'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Allowed Auth Methods',
        name: 'allowedAuthMethods',
        type: 'multiOptions',
        options: STYTCH_AUTH_METHODS,
        default: [],
        description: 'Specific auth methods allowed',
      },
      {
        displayName: 'Auth Methods',
        name: 'authMethods',
        type: 'options',
        options: [
          { name: 'All Allowed', value: 'ALL_ALLOWED' },
          { name: 'Restricted', value: 'RESTRICTED' },
        ],
        default: 'ALL_ALLOWED',
        description: 'Auth methods policy',
      },
      {
        displayName: 'Email Allowed Domains',
        name: 'emailAllowedDomains',
        type: 'string',
        default: '',
        placeholder: 'example.com, acme.com',
        description: 'Comma-separated list of allowed email domains',
      },
      {
        displayName: 'Email Invites',
        name: 'emailInvites',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'ALL_ALLOWED',
        description: 'Email invitation policy',
      },
      {
        displayName: 'Email JIT Provisioning',
        name: 'emailJitProvisioning',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'NOT_ALLOWED',
        description: 'Email JIT provisioning policy',
      },
      {
        displayName: 'MFA Methods',
        name: 'mfaMethods',
        type: 'options',
        options: [
          { name: 'All Allowed', value: 'ALL_ALLOWED' },
          { name: 'Restricted', value: 'RESTRICTED' },
        ],
        default: 'ALL_ALLOWED',
        description: 'MFA methods policy',
      },
      {
        displayName: 'MFA Policy',
        name: 'mfaPolicy',
        type: 'options',
        options: STYTCH_MFA_POLICIES,
        default: 'OPTIONAL',
        description: 'MFA enforcement policy',
      },
      {
        displayName: 'Organization Logo URL',
        name: 'organizationLogoUrl',
        type: 'string',
        default: '',
        description: 'URL of the organization logo',
      },
      {
        displayName: 'Organization Name',
        name: 'organizationName',
        type: 'string',
        default: '',
        description: 'Display name for the organization',
      },
      {
        displayName: 'Organization Slug',
        name: 'organizationSlug',
        type: 'string',
        default: '',
        description: 'URL-friendly identifier for the organization',
      },
      {
        displayName: 'SSO Default Connection ID',
        name: 'ssoDefaultConnectionId',
        type: 'string',
        default: '',
        description: 'Default SSO connection ID',
      },
      {
        displayName: 'SSO JIT Provisioning',
        name: 'ssoJitProvisioning',
        type: 'options',
        options: STYTCH_JIT_PROVISIONING_MODES,
        default: 'NOT_ALLOWED',
        description: 'SSO JIT provisioning policy',
      },
      {
        displayName: 'Trusted Metadata',
        name: 'trustedMetadata',
        type: 'json',
        default: '{}',
        description: 'Server-side trusted metadata',
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
        resource: ['b2bOrganization'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'Search query to filter organizations',
      },
    ],
  },
];

export async function executeB2bOrganizationOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<IDataObject | IDataObject[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'create': {
      const organizationName = this.getNodeParameter('organizationName', i) as string;
      const organizationSlug = this.getNodeParameter('organizationSlug', i) as string;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const body: IDataObject = {
        organization_name: organizationName,
        organization_slug: organizationSlug,
      };

      if (options.organizationLogoUrl) {
        body.organization_logo_url = options.organizationLogoUrl;
      }
      if (options.trustedMetadata) {
        try {
          body.trusted_metadata = JSON.parse(options.trustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (options.ssoDefaultConnectionId) {
        body.sso_default_connection_id = options.ssoDefaultConnectionId;
      }
      if (options.ssoJitProvisioning) {
        body.sso_jit_provisioning = options.ssoJitProvisioning;
      }
      if (options.emailAllowedDomains) {
        body.email_allowed_domains = (options.emailAllowedDomains as string)
          .split(',')
          .map((d) => d.trim());
      }
      if (options.emailJitProvisioning) {
        body.email_jit_provisioning = options.emailJitProvisioning;
      }
      if (options.emailInvites) {
        body.email_invites = options.emailInvites;
      }
      if (options.authMethods) {
        body.auth_methods = options.authMethods;
      }
      if (options.allowedAuthMethods && (options.allowedAuthMethods as string[]).length > 0) {
        body.allowed_auth_methods = options.allowedAuthMethods;
      }
      if (options.mfaMethods) {
        body.mfa_methods = options.mfaMethods;
      }
      if (options.mfaPolicy) {
        body.mfa_policy = options.mfaPolicy;
      }

      responseData = await stytchApiRequest.call(
        this,
        'POST',
        '/organizations',
        cleanRequestBody(body),
      );
      break;
    }

    case 'get': {
      const organizationId = this.getNodeParameter('organizationId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'GET',
        `/organizations/${organizationId}`,
      );
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const options = this.getNodeParameter('options', i) as IDataObject;

      const query: IDataObject = {};
      if (options.query) {
        query.query = options.query;
      }

      if (returnAll) {
        responseData = await stytchApiRequestAllItems.call(
          this,
          'POST',
          '/organizations/search',
          {},
          query,
          'organizations',
        );
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await stytchApiRequest.call(
          this,
          'POST',
          '/organizations/search',
          query,
        );
        responseData = (response.organizations as IDataObject[]) || [];
      }
      break;
    }

    case 'update': {
      const organizationId = this.getNodeParameter('organizationId', i) as string;
      const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

      const body: IDataObject = {};

      if (updateFields.organizationName) {
        body.organization_name = updateFields.organizationName;
      }
      if (updateFields.organizationSlug) {
        body.organization_slug = updateFields.organizationSlug;
      }
      if (updateFields.organizationLogoUrl) {
        body.organization_logo_url = updateFields.organizationLogoUrl;
      }
      if (updateFields.trustedMetadata) {
        try {
          body.trusted_metadata = JSON.parse(updateFields.trustedMetadata as string);
        } catch {
          // Ignore invalid JSON
        }
      }
      if (updateFields.ssoDefaultConnectionId) {
        body.sso_default_connection_id = updateFields.ssoDefaultConnectionId;
      }
      if (updateFields.ssoJitProvisioning) {
        body.sso_jit_provisioning = updateFields.ssoJitProvisioning;
      }
      if (updateFields.emailAllowedDomains) {
        body.email_allowed_domains = (updateFields.emailAllowedDomains as string)
          .split(',')
          .map((d) => d.trim());
      }
      if (updateFields.emailJitProvisioning) {
        body.email_jit_provisioning = updateFields.emailJitProvisioning;
      }
      if (updateFields.emailInvites) {
        body.email_invites = updateFields.emailInvites;
      }
      if (updateFields.authMethods) {
        body.auth_methods = updateFields.authMethods;
      }
      if (updateFields.allowedAuthMethods && (updateFields.allowedAuthMethods as string[]).length > 0) {
        body.allowed_auth_methods = updateFields.allowedAuthMethods;
      }
      if (updateFields.mfaMethods) {
        body.mfa_methods = updateFields.mfaMethods;
      }
      if (updateFields.mfaPolicy) {
        body.mfa_policy = updateFields.mfaPolicy;
      }

      responseData = await stytchApiRequest.call(
        this,
        'PUT',
        `/organizations/${organizationId}`,
        cleanRequestBody(body),
      );
      break;
    }

    case 'delete': {
      const organizationId = this.getNodeParameter('organizationId', i) as string;

      responseData = await stytchApiRequest.call(
        this,
        'DELETE',
        `/organizations/${organizationId}`,
      );
      break;
    }
  }

  return responseData;
}
