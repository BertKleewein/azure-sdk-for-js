// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ParsingError } from "./parsingError";
import { AggregateContext } from "./aggregateContext";
import { Model } from "./model";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { ElementPropertyConstraint } from "./type";
import { ValueConstraint } from "./type/valueConstraint";

export interface Parser {
  parseObject(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    parentId: string | undefined,
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
    allowIdReferenceSyntax: boolean,
    allowedVersions: Set<number>
  ): any;

  parseToken(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    valueConstraints: ValueConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    token: any,
    parentId: string | undefined,
    definedIn: string | undefined,
    propName: string | undefined,
    dtmiSeg: string | undefined,
    keyProp: string | undefined,
    idRequired: boolean,
    typeRequired: boolean,
    allowIdReferenceSyntax: boolean,
    allowedVersions: Set<number>
  ): number;

  parsePropertiesV2?(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    elementInfoAsAny: any,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    definedIn: string | undefined,
    allowIdReferenceSyntax: boolean
  ): void;

  parsePropertiesV3?(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    elementInfoAsAny: any,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: { [index: string]: any },
    definedIn: string | undefined,
    allowIdReferenceSyntax: boolean
  ): void;
}
