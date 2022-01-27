// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsStatement } from "./internal";

export class TsLine implements TsStatement {
  private _text: string;

  constructor(text: string) {
    this._text = text;
  }

  get text(): string {
    return this._text;
  }

  generateCode(codeWriter: CodeWriter): void {
    codeWriter.writeLine(this._text);
  }
}
