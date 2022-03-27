// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ComplexSchemaInfo } from "./complexSchemaInfo";
import { MapKeyInfo } from "./mapKeyInfo";
import { MapValueInfo } from "./mapValueInfo";
export interface MapInfo extends ComplexSchemaInfo {
  entityKind: "map";
  mapKey?: MapKeyInfo;
  mapValue?: MapValueInfo;
}
