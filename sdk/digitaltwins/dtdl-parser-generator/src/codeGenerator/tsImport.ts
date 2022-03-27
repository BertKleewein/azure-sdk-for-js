// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter } from "./internal";
import { TsStatement } from "./interface/tsStatement";
import { pascalToCamel } from "./namingConventions";

export class TsImport implements TsStatement {
  private _tsImports: Set<TsStatement>;

  constructor() {
    this._tsImports = new Set();
  }

  addTsImport(text: string): void {
    const newObj = new TsImportGeneric(text);
    for (const i of this._tsImports) {
      if (newObj.equals(i)) {
        return;
      }
    }
    this._tsImports.add(newObj);
  }

  addTsImportObject(objectName: string, location?: string): void {
    const newObj = new TsImportObject(objectName, location);
    for (const i of this._tsImports) {
      if (newObj.equals(i)) {
        return;
      }
    }
    this._tsImports.add(newObj);
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    this._tsImports.forEach((statement) => {
      statement.generateCode(codeWriter);
    });
  }
}

export class TsImportGeneric implements TsStatement {
  private _statement: string;
  constructor(text: string) {
    this._statement = text;
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    codeWriter.writeLine(this._statement);
  }

  equals(other: TsStatement): boolean {
    if (other instanceof TsImportGeneric) {
      return (other as TsImportGeneric)._statement == this._statement;
    } else {
      return false;
    }
  }
}

export class TsImportObject implements TsStatement {
  private _location?: string;
  private _objectName: string;

  constructor(objectName: string, location?: string) {
    this._location = location;
    this._objectName = objectName;
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    if (this._location) {
      codeWriter.writeLine(`import { ${this._objectName} } from '${this._location}';`);
    } else {
      codeWriter.writeLine(
        `import { ${this._objectName} } from './${pascalToCamel(this._objectName)}';`
      );
    }
  }

  equals(other: TsStatement): boolean {
    if (other instanceof TsImportObject) {
      const otherObj = other as TsImportObject;
      return otherObj._location == this._location && otherObj._objectName == this._objectName;
    } else {
      return false;
    }
  }
}
