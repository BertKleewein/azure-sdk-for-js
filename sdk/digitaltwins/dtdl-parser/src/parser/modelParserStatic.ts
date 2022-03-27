// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { EntityInfoStatic } from "./entityInfoStatic";
import { Model } from "./model";
import { ParsedObjectPropertyInfo } from "./parsedObjectPropertyInfo";
import { ElementPropertyConstraint } from "./type";
import { ParsingError } from "./parsingError";
import { AggregateContext } from "./aggregateContext";
export class ModelParserStatic {
  public static parseObject(
    model: Model,
    objectPropertyInfoList: ParsedObjectPropertyInfo[],
    elementPropertyConstraints: ElementPropertyConstraint[],
    aggregateContext: AggregateContext,
    parsingErrors: ParsingError[],
    object: any
  ) {
    EntityInfoStatic.parseObject(
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
