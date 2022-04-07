// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import { TsAccess, TsClass, TsLibrary } from "../codeGenerator";
import { NameFormatter } from "./nameFormatter";
import { ParserGeneratorValues } from "./parserGeneratorValues";
import { TypeGenerator } from "./typeGenerator";

export class StandardElementsGenerator implements TypeGenerator {
  private readonly _baseClassName: string;
  private readonly _digestElements: any[];

  constructor(baseName: string, digestElements: any[]) {
    this._baseClassName = NameFormatter.formatNameAsInterface(baseName);
    this._digestElements = digestElements;
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  public async generateType(parserLibrary: TsLibrary): Promise<void> {
    this.generateCode(parserLibrary);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(parserLibrary: TsLibrary): void {
    const standardElementsClass = parserLibrary.class({ name: "StandardElements", exports: true });
    standardElementsClass.importObject("ParsedObjectPropertyInfo");
    standardElementsClass.importObject("Model");
    standardElementsClass.importObject("ModelParserStatic");
    standardElementsClass.importObject("AggregateContext");
    standardElementsClass.importObject("InDTMI", "./internalDtmi");
    standardElementsClass.importObject("ParsingError");
    standardElementsClass.importObject("ParsingException");
    standardElementsClass.prefixCode.line("type EntityInfo = any;");
    standardElementsClass.docString.line(
      "A collection of values of standard elements from the DTDL metamodel."
    );
    standardElementsClass.inline("./parser-src/parserPartial/standardElements.ts", "fields");
    this._generateGetElementMethod(standardElementsClass);
    this._generateGetDigestElementsMethod(standardElementsClass);
    standardElementsClass.inline("./parser-src/parserPartial/standardElements.ts", "methods");
  }

  private _generateGetElementMethod(standardElementsClass: TsClass): void {
    const method = standardElementsClass.method({
      name: "getElement",
      returnType: this._baseClassName,
      isStatic: true,
      access: TsAccess.Private,
    });
    method.parameter({
      name: "elementId",
      type: ParserGeneratorValues.IdentifierType,
      shouldBeInterface: true,
    });
    method.body.line(`return this._standardModel.dict[elementId.value];`);
  }

  private _generateGetDigestElementsMethod(standardElementsClass: TsClass): void {
    const method = standardElementsClass.method({
      name: "getDigestElements",
      returnType: "any",
      isStatic: true,
      access: TsAccess.Private,
    });
    const digests = method.body.multiLine("return [");
    for (const digestElement of this._digestElements) {
      digests.line(JSON.stringify(digestElement));
      digests.line(",");
    }
    digests.line("];");
  }
}
