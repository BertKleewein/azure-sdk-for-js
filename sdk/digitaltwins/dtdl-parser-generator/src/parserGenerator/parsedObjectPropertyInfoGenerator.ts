// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import { NameFormatter } from "./nameFormatter";
import { TsLibrary } from "../codeGenerator";
import { TypeGenerator } from "./typeGenerator";

export class ParsedObjectPropertyInfoGenerator implements TypeGenerator {
  private readonly _baseKindEnum: string;

  constructor(baseName: string) {
    this._baseKindEnum = NameFormatter.formatNameForEnumDisjunction(baseName);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  public async generateType(parserLibrary: TsLibrary): Promise<void> {
    this.generateCode(parserLibrary);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(parserLibrary: TsLibrary): void {
    const parsedObjectInterface = parserLibrary.interface({
      name: "ParsedObjectPropertyInfo",
      exports: true,
    });
    parsedObjectInterface.importObject(this._baseKindEnum);
    parsedObjectInterface.field({
      name: "expectedKinds",
      type: `${this._baseKindEnum}[]`,
      optional: true,
    });
    parsedObjectInterface.inline(
      "./parser-src/parserPartial/type/parsedObjectPropertyInfo.ts",
      "fields"
    );
  }
}
