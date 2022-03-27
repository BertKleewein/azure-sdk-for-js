// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ComplexSchemaInfo } from "./complexSchemaInfo";
import { EnumValueInfo } from "./enumValueInfo";
import { PrimitiveSchemaInfo } from "./primitiveSchemaInfo";
export interface EnumInfo extends ComplexSchemaInfo {
  entityKind: "enum";
  enumValues?: EnumValueInfo[];
  valueSchema?: PrimitiveSchemaInfo;
}
