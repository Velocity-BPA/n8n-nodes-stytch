/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const NodeConnectionType = {
  Main: 'main',
};

export interface IDataObject {
  [key: string]: unknown;
}

export interface INodeExecutionData {
  json: IDataObject;
  pairedItem?: { item: number };
}

export interface INodeProperties {
  displayName: string;
  name: string;
  type: string;
  default?: unknown;
  description?: string;
  required?: boolean;
  options?: unknown[];
  displayOptions?: unknown;
  typeOptions?: unknown;
  placeholder?: string;
  noDataExpression?: boolean;
}

export interface INodeTypeDescription {
  displayName: string;
  name: string;
  icon?: string;
  group: string[];
  version: number;
  subtitle?: string;
  description: string;
  defaults: { name: string };
  inputs: string[];
  outputs: string[];
  credentials?: unknown[];
  properties: INodeProperties[];
  webhooks?: unknown[];
}

export interface INodeType {
  description: INodeTypeDescription;
  execute?: () => Promise<INodeExecutionData[][]>;
  webhook?: () => Promise<unknown>;
}

export interface IExecuteFunctions {
  getInputData: () => INodeExecutionData[];
  getNodeParameter: (name: string, index: number, defaultValue?: unknown) => unknown;
  getCredentials: (name: string) => Promise<unknown>;
  helpers: {
    request: (options: unknown) => Promise<unknown>;
    httpRequest: (options: unknown) => Promise<unknown>;
  };
  continueOnFail: () => boolean;
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

export interface IHookFunctions {
  getNodeWebhookUrl: (name: string) => string;
  getCredentials: (name: string) => Promise<unknown>;
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

export interface IWebhookFunctions {
  getRequestObject: () => unknown;
  getBodyData: () => unknown;
  getHeaderData: () => unknown;
  getNodeParameter: (name: string, defaultValue?: unknown) => unknown;
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

export interface IWebhookResponseData {
  webhookResponse?: {
    status: number;
    body: string;
  };
  workflowData?: INodeExecutionData[][];
}

export interface ICredentialTestFunctions {
  helpers: {
    request: (options: unknown) => Promise<unknown>;
  };
}
