// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { EntityInfo } from "./entityInfo";
import { ContentInfo } from "./contentInfo";
import { ComplexSchemaInfo } from "./complexSchemaInfo";
export interface InterfaceInfo extends EntityInfo {
  entityKind: "interface";
  contents?: { [value: string]: ContentInfo };
  extends?: InterfaceInfo[];
  schemas?: ComplexSchemaInfo[];
}
