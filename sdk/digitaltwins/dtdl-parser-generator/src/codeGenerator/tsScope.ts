// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CodeWriter,
  TsFor,
  TsForEach,
  TsFunction,
  TsFunctionParams,
  TsIf,
  TsInline,
  TsLibraryObject,
  TsLine,
  TsMultiLine,
  TsStatement,
  TsTry,
  TsWhile,
} from "./internal";

export class TsScope implements TsStatement {
  protected _firstLine?: string;
  protected _suppressBreak: boolean;
  protected _statements: TsStatement[];
  protected _inlines: TsInline[];
  public libraryObject?: TsLibraryObject;

  constructor(firstLine?: string, suppressBreak: boolean = false) {
    this._firstLine = firstLine;
    this._suppressBreak = suppressBreak;

    this._statements = [];
    this._inlines = [];
  }

  importObject(objectName: string, location?: string): this {
    (this.libraryObject as TsLibraryObject).importObject(objectName, location);
    return this;
  }

  line(text: string): TsScope {
    this._statements.push(new TsLine(text));
    return this;
  }

  multiLine(text: string): TsScope {
    const multiLine = new TsMultiLine(text);
    this._statements.push(multiLine);
    return this;
  }

  inline(filepath: string, identifier: string): void {
    this._inlines.push(new TsInline(filepath, identifier));
  }

  scope(firstLine: string): TsScope {
    const nestedScope = new TsScope(firstLine);
    nestedScope.libraryObject = this.libraryObject;
    this._statements.push(nestedScope);
    return nestedScope;
  }

  while(whileText: string): TsScope {
    const tsWhile = new TsWhile(whileText);
    tsWhile.libraryObject = this.libraryObject;
    this._statements.push(tsWhile);
    return tsWhile;
  }

  if(ifText: string): TsIf {
    const tsIf = new TsIf(ifText, this);
    tsIf.libraryObject = this.libraryObject;
    this._statements.push(tsIf);
    return tsIf;
  }

  try(): TsTry {
    const tsTry = new TsTry(this);
    tsTry.libraryObject = this.libraryObject;
    this._statements.push(tsTry);
    return tsTry;
  }

  for(text: string): TsFor {
    const tsFor = new TsFor(text);
    tsFor.libraryObject = this.libraryObject;
    this._statements.push(tsFor);
    return tsFor;
  }

  forEach(object: string, cbParams: string): TsForEach {
    const tsForEach = new TsForEach(object, cbParams);
    tsForEach.libraryObject = this.libraryObject;
    this._statements.push(tsForEach);
    return tsForEach;
  }

  function({
    name,
    returnType,
    functionType,
    abstract,
    access,
    isStatic,
  }: TsFunctionParams): TsFunction {
    const tsFunction = new TsFunction({
      name: name,
      returnType: returnType,
      functionType: functionType,
      abstract: abstract,
      access: access,
      isStatic: isStatic,
    });
    tsFunction.libraryObject = this.libraryObject;
    this._statements.push(tsFunction);
    return tsFunction;
  }

  statement(tsStatement: TsStatement): void {
    this._statements.push(tsStatement);
  }

  isEmpty(): boolean {
    return this._inlines.length > 0 || this._statements.length > 0;
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    if (this._firstLine) {
      codeWriter.writeLine(`${this._firstLine} `, true, this._suppressBreak);
    }
    codeWriter.openScope();
    for (let i = 0; i < this._inlines.length; i++) {
      const inlineBlock = this._inlines[i];
      inlineBlock.generateCode(codeWriter);
    }
    for (let i = 0; i < this._statements.length; i++) {
      const statement = this._statements[i];
      statement.generateCode(codeWriter);
    }
    codeWriter.closeScope();
  }
}
