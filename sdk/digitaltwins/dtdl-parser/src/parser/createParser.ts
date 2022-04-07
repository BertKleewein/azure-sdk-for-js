// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */
/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable sort-imports */

import { ModelParsingOption } from "./enum";
import { ModelParser } from "./modelParser";
import { ModelParserImpl } from "./modelParserImpl";
import { ParserInitializer } from "./parserInitializer";
/**
 * Function for creation of the model parser.
 **/
export function createParser(parsingOptions: ModelParsingOption): ModelParser {
  ParserInitializer.initialize();
  const impl = new ModelParserImpl();
  impl.options = parsingOptions;
  return impl;
}
