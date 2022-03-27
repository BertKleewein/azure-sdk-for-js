// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ContentInfo } from "./contentInfo";
import { SchemaInfo } from "./schemaInfo";
export interface PropertyInfo extends ContentInfo {
  entityKind: "property";
  schema?: SchemaInfo;
  writable?: boolean;
}
