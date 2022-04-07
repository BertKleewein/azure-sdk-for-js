// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TsAccess, TsLibrary } from "../codeGenerator";
import { TypeGenerator } from "./typeGenerator";
import { NameFormatter } from "./nameFormatter";

export class ParserCollectionGenerator implements TypeGenerator {
  private readonly _typeNames: string[];

  constructor(classNames: string[]) {
    this._typeNames = [];

    for (const className of classNames) {
      this._typeNames.push(className);
    }
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  public async generateType(parserLibrary: TsLibrary): Promise<void> {
    this.generateCode(parserLibrary);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(parserLibrary: TsLibrary): void {
    const parserCollectionClass = parserLibrary.class({
      name: "ParserCollection",
      exports: true,
    });
    parserCollectionClass.docString.line("A collection of all static ParserObjects.");
    parserCollectionClass.docString.line(
      "The properties on this object are populated at runtime as the parsers are loaded."
    );
    parserCollectionClass.docString.line("We do this to avoid circular dependencies.");

    parserCollectionClass.importObject("Parser");

    const parserInitializerClass = parserLibrary.class({
      name: "ParserInitializer",
      exports: true,
      deferStaticInitialization: true,
    });
    parserInitializerClass.docString.line("A class to initialize the parser objects at runtime");

    parserInitializerClass.importObject("ParserCollection");

    parserInitializerClass.field({
      name: "initialized?",
      type: "boolean",
      isStatic: true,
      access: TsAccess.Public,
    });

    const ifNotInitialized = parserInitializerClass.staticCtor.body.if("!this.initialized");

    ifNotInitialized.line("").line("// Populate ParserCollection object").line("");

    for (const typeName of this._typeNames) {
      const parserName = NameFormatter.formatNameAsParser(typeName);

      parserCollectionClass.field({
        name: parserName,
        type: "Parser",
        isStatic: true,
        access: TsAccess.Public,
      });

      parserInitializerClass.importObject(parserName);
      ifNotInitialized.line(`ParserCollection.${parserName} = ${parserName}`);
    }

    ifNotInitialized.line("").line("// Initialize parsers").line("");

    for (const typeName of this._typeNames) {
      const parserName = NameFormatter.formatNameAsParser(typeName);

      ifNotInitialized.line(`${parserName}.initialize()`);
    }

    ifNotInitialized.line("").line("// Initialize validator classes").line("");

    for (const typeName of this._typeNames) {
      const implName = NameFormatter.formatNameAsImplementation(typeName);

      parserInitializerClass.importObject(implName);
      ifNotInitialized.line(`${implName}.initialize()`);
    }

    parserInitializerClass.importObject("StandardElements");
    ifNotInitialized.line("").line(`StandardElements.initialize()`);

    parserInitializerClass.suffixCode.line("ParserInitializer.initialized = false");
  }
}
