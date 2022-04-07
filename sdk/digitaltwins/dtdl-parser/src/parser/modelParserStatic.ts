// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ParserCollection } from "./parserCollection";
import { Model } from "./model";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { ElementPropertyConstraint } from "./type";
import { ParsingError } from "./parsingError";
import { AggregateContext } from "./aggregateContext";
export class ModelParserStatic {
  public static parseObject(
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
    aggregateContext: AggregateContext,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parsingErrors: ParsingError[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    object: any
  ): void {
    ParserCollection.EntityInfoParser.parseObject(
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      [],
      aggregateContext,
      parsingErrors,
      object,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      true,
      false,
      new Set()
    );
  }
}
