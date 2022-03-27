// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { InDTMI } from "./internalDtmi";
import { ParsingError } from "./parsingError";
import { createParsingError } from "./parsingErrorImpl";

export class DTMI extends InDTMI {
  constructor(value: string) {
    if (InDTMI.createDtmi(value) === undefined) {
      throw DTMI._getInvalidIdException(value);
    }
    super(value);
  }

  private static _getInvalidIdException(val: string): ParsingError {
    return createParsingError("dtmi:dtdl:parsingError:invalidDtmi", {
      cause: `${val} is not a legal DTMI.`,
      action:
        "Replace the identifier with a string that conforms to the DTMI syntax -- see https://github.com/Azure/digital-twin-model-identifier.",
      primaryId: val
    });
  }
}
