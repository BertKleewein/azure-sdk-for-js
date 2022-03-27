// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { DtmiResolver } from "./type";
import { ModelParsingOption } from "./enum";
import { SupplementalTypeCollection } from "./supplementalTypeCollection";
import { ModelDict } from "./modelDict";
export interface ModelParser {
  getModels?: DtmiResolver;
  options: ModelParsingOption;
  maxDtdlVersion?: number;
  parse(jsonTexts: string[]): Promise<ModelDict>;

  getSupplementalTypeCollection(): SupplementalTypeCollection;
}
