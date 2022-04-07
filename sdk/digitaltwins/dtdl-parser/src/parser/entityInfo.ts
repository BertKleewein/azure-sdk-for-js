// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { TypeChecker } from "./type";
import { LanguageStringType } from "./type";
import { SupplementalTypeInfo } from "./supplementalTypeInfo";
export interface EntityInfo extends TypeChecker {
  dtdlVersion: number;
  id: string;
  childOf: string | undefined;
  definedIn: string | undefined;
  entityKind:
    | "array"
    | "boolean"
    | "command"
    | "commandpayload"
    | "commandtype"
    | "component"
    | "date"
    | "datetime"
    | "double"
    | "duration"
    | "enum"
    | "enumvalue"
    | "field"
    | "float"
    | "integer"
    | "interface"
    | "long"
    | "map"
    | "mapkey"
    | "mapvalue"
    | "object"
    | "property"
    | "relationship"
    | "string"
    | "telemetry"
    | "time"
    | "unit"
    | "unitattribute"
    | "commandrequest"
    | "commandresponse"
    | "latenttype"
    | "namedlatenttype"
    | "reference";
  comment?: string;
  description?: LanguageStringType;
  displayName?: LanguageStringType;
  languageVersion?: number;
  supplementalTypeIds: string[];
  supplementalProperties: { [x: string]: any };
  supplementalTypes: SupplementalTypeInfo[];
  undefinedTypes: string[];
  undefinedProperties: { [name: string]: any };
  validateInstance(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instanceText: string
  ): boolean;
}
