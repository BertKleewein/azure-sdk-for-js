// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsFunctionBase, TsFunctionParams, TsImport } from "./internal";

// Functions are the fundamental building block of any application in JavaScript.
// They’re how you build up layers of abstraction, mimicking classes, information hiding, and modules.
// In TypeScript, while there are classes, namespaces, and modules, functions still play the key role in describing how to do things.
// TypeScript also adds some new capabilities to the standard JavaScript functions to make them easier to work with.

export class TsFunction extends TsFunctionBase {
  protected _importStatements?: TsImport;

  constructor(tsFunctionParams: TsFunctionParams) {
    super(tsFunctionParams);
    this.libraryObject = this;
  }

  import(text: string): this {
    if (this._importStatements === undefined) {
      this._importStatements = new TsImport();
    }
    this._importStatements.addTsImport(text);
    return this;
  }

  importObject(objectName: string, location?: string): this {
    if (this._importStatements === undefined) {
      this._importStatements = new TsImport();
    }
    this._importStatements.addTsImportObject(objectName, location);
    return this;
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    if (this._importStatements !== undefined) {
      this._importStatements.generateCode(codeWriter);
    }
    super.generateCode(codeWriter);
  }
}
