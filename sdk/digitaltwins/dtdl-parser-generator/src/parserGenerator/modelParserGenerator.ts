// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* eslint-disable valid-jsdoc */

import { TsAccess, TsDeclarationType, TsLibrary } from "../codeGenerator";
import { NameFormatter } from "./nameFormatter";
import { TypeGenerator } from "./typeGenerator";

export class ModelParserGenerator implements TypeGenerator {
  private readonly _baseClassName: string;
  private readonly _baseClassParserName: string;

  constructor(baseName: string) {
    this._baseClassName = NameFormatter.formatNameAsImplementation(baseName);
    this._baseClassParserName = NameFormatter.formatNameAsParser(baseName);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  public async generateType(parserLibrary: TsLibrary): Promise<void> {
    this.generateCode(parserLibrary);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(parserLibrary: TsLibrary): void {
    const functionCreateParser = parserLibrary.function({
      name: "createParser",
      exports: true,
      returnType: "ModelParser",
    });
    functionCreateParser.summary(`Function for creation of the model parser.`);
    functionCreateParser
      .importObject("ModelParsingOption", "./enum")
      .importObject("ModelParser")
      .importObject("ModelParserImpl");
    functionCreateParser.parameter({ name: "parsingOptions", type: "ModelParsingOption" });

    functionCreateParser.body
      .line(`const impl = new ModelParserImpl();`)
      .line(`impl.options = parsingOptions;`)
      .line(`return impl;`);

    const interfaceName = "ModelParser";
    const modelParserInterface = parserLibrary.interface({ name: interfaceName, exports: true });
    modelParserInterface.field({ name: "getModels?", type: "DtmiResolver" });
    modelParserInterface.field({ name: "options", type: "ModelParsingOption" });
    modelParserInterface.field({ name: "maxDtdlVersion?", type: "number" });
    modelParserInterface
      .method({ name: "parse", returnType: "Promise<ModelDict>" })
      .parameter({ name: "jsonTexts", type: "string[]" });
    modelParserInterface
      .importObject("DtmiResolver", "./type")
      .importObject("ModelParsingOption", "./enum")
      .importObject("ModelDict");

    const inheritance = { name: interfaceName, type: TsDeclarationType.Interface };
    const parserClass = parserLibrary.class({
      name: "ModelParserImpl",
      exports: true,
      inheritance: [inheritance],
    });
    parserClass.docString.line(`Class for parsing the DTDL langauge.`);
    parserClass
      .importObject("DtmiResolver", "./type")
      .importObject("ElementPropertyConstraint", "./type")
      .importObject("ModelParsingOption", "./enum")
      .importObject("ParsingError")
      .importObject("createParsingError", "./parsingErrorImpl")
      .importObject("ResolutionError")
      .importObject("JsonSyntaxError")
      .importObject("ParsingException")
      .importObject("AggregateContext")
      .importObject("Model")
      .importObject("ModelDict")
      .importObject("ModelParser")
      .importObject("ParsedObjectPropertyInfo")
      .importObject("PartitionTypeCollection")
      .importObject("StandardElements")
      .importObject("RootableTypeCollection")
      .importObject("ModelParserStatic")
      .importObject("TypeChecker", "./type");
    parserClass.inline("./parser-src/parserPartial/modelParserImpl.ts", "fields");
    parserClass.ctor.body.inline("./parser-src/parserPartial/modelParserImpl.ts", "constructor");
    parserClass.inline("./parser-src/parserPartial/modelParserImpl.ts", "methods");

    const staticClass = parserLibrary.class({
      name: "ModelParserStatic",
      exports: true,
    });
    staticClass
      .importObject(this._baseClassParserName)
      .importObject("Model")
      .importObject("ParsedObjectPropertyInfo")
      .importObject("ElementPropertyConstraint", "./type")
      .importObject("ParsingError")
      .importObject("AggregateContext");

    const parseObjectMethod = staticClass.method({
      name: "parseObject",
      isStatic: true,
      access: TsAccess.Public,
      returnType: "void",
    });
    parseObjectMethod
      .parameter({ name: "model", type: "Model", shouldBeInterface: true })
      .parameter({ name: "objectPropertyInfoList", type: "ParsedObjectPropertyInfo[]" })
      .parameter({ name: "elementPropertyConstraints", type: "ElementPropertyConstraint[]" })
      .parameter({ name: "aggregateContext", type: "AggregateContext", shouldBeInterface: true })
      .parameter({ name: "parsingErrors", type: "ParsingError[]", mightBeAny: true })
      .parameter({ name: "object", type: "any", mightBeAny: true });

    parseObjectMethod.body.line(`${this._baseClassParserName}.parseObject(
      model,
      objectPropertyInfoList,
      elementPropertyConstraints,
      [],
      aggregateContext,
      parsingErrors,
      object,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      true,
      false,
      new Set(),
    )`);
  }
}
