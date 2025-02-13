/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator } from "@azure/core-paging";
import { Service } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { ServiceFabricMeshManagementClient } from "../serviceFabricMeshManagementClient";
import {
  ServiceResourceDescription,
  ServiceListNextOptionalParams,
  ServiceListOptionalParams,
  ServiceGetOptionalParams,
  ServiceGetResponse,
  ServiceListResponse,
  ServiceListNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Service operations. */
export class ServiceImpl implements Service {
  private readonly client: ServiceFabricMeshManagementClient;

  /**
   * Initialize a new instance of the class Service class.
   * @param client Reference to the service client
   */
  constructor(client: ServiceFabricMeshManagementClient) {
    this.client = client;
  }

  /**
   * Gets the information about all services of an application resource. The information include the
   * description and other properties of the Service.
   * @param resourceGroupName Azure resource group name
   * @param applicationResourceName The identity of the application.
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    applicationResourceName: string,
    options?: ServiceListOptionalParams
  ): PagedAsyncIterableIterator<ServiceResourceDescription> {
    const iter = this.listPagingAll(
      resourceGroupName,
      applicationResourceName,
      options
    );
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: () => {
        return this.listPagingPage(
          resourceGroupName,
          applicationResourceName,
          options
        );
      }
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    applicationResourceName: string,
    options?: ServiceListOptionalParams
  ): AsyncIterableIterator<ServiceResourceDescription[]> {
    let result = await this._list(
      resourceGroupName,
      applicationResourceName,
      options
    );
    yield result.value || [];
    let continuationToken = result.nextLink;
    while (continuationToken) {
      result = await this._listNext(
        resourceGroupName,
        applicationResourceName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      yield result.value || [];
    }
  }

  private async *listPagingAll(
    resourceGroupName: string,
    applicationResourceName: string,
    options?: ServiceListOptionalParams
  ): AsyncIterableIterator<ServiceResourceDescription> {
    for await (const page of this.listPagingPage(
      resourceGroupName,
      applicationResourceName,
      options
    )) {
      yield* page;
    }
  }

  /**
   * Gets the information about the service resource with the given name. The information include the
   * description and other properties of the service.
   * @param resourceGroupName Azure resource group name
   * @param applicationResourceName The identity of the application.
   * @param serviceResourceName The identity of the service.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    applicationResourceName: string,
    serviceResourceName: string,
    options?: ServiceGetOptionalParams
  ): Promise<ServiceGetResponse> {
    return this.client.sendOperationRequest(
      {
        resourceGroupName,
        applicationResourceName,
        serviceResourceName,
        options
      },
      getOperationSpec
    );
  }

  /**
   * Gets the information about all services of an application resource. The information include the
   * description and other properties of the Service.
   * @param resourceGroupName Azure resource group name
   * @param applicationResourceName The identity of the application.
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    applicationResourceName: string,
    options?: ServiceListOptionalParams
  ): Promise<ServiceListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, applicationResourceName, options },
      listOperationSpec
    );
  }

  /**
   * ListNext
   * @param resourceGroupName Azure resource group name
   * @param applicationResourceName The identity of the application.
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    resourceGroupName: string,
    applicationResourceName: string,
    nextLink: string,
    options?: ServiceListNextOptionalParams
  ): Promise<ServiceListNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, applicationResourceName, nextLink, options },
      listNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabricMesh/applications/{applicationResourceName}/services/{serviceResourceName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ServiceResourceDescription
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.applicationResourceName,
    Parameters.serviceResourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ServiceFabricMesh/applications/{applicationResourceName}/services",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ServiceResourceDescriptionList
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.applicationResourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ServiceResourceDescriptionList
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [
    Parameters.$host,
    Parameters.nextLink,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.applicationResourceName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
