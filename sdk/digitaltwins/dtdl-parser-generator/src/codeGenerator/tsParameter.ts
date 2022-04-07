// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CodeWriter, TsParameterParams, TsLintSuppressor } from "./internal";

// TODO: Add ts_destructured_parameter.ts for creating parameters that are just
// destructured Objects.
export class TsParameter {
  private _name: string;
  private _type?: string;
  private _description?: string;
  private _initializer?: string;
  private _optional?: boolean;
  private _mightBeUnused?: boolean;
  private _shouldBeInterface?: boolean;
  private _mightBeAny?: boolean;

  constructor({
    name,
    type,
    description,
    initializer,
    optional,
    mightBeUnused,
    shouldBeInterface,
    mightBeAny,
  }: TsParameterParams) {
    this._name = name;
    this._type = type;
    this._description = description;
    this._initializer = initializer;
    this._optional = optional;
    this._mightBeUnused = mightBeUnused;
    this._shouldBeInterface = shouldBeInterface;
    this._mightBeAny = mightBeAny;
  }

  toString(): string {
    const tsLintSuppressor = new TsLintSuppressor();
    if (this._mightBeUnused) {
      tsLintSuppressor.noUnusedVars();
    }
    if (this._shouldBeInterface) {
      tsLintSuppressor.useInterfaceParameters();
    }
    if (this._mightBeAny) {
      tsLintSuppressor.explicitModuleBoundaryTypes();
    }
    const suffix = this._initializer ? this._initializer : "";
    if (this._type !== undefined && this._type !== "") {
      return `${tsLintSuppressor.toString()}${this._name}${this._chooseOptionalPunctuator()} ${
        this._type
      }${suffix}`;
    } else {
      return `${tsLintSuppressor.toString()}${this._name}${suffix}`;
    }
  }

  get name(): string {
    return this._name;
  }

  get type(): string | undefined {
    return this._type;
  }

  get description(): string | undefined {
    return this._description;
  }

  private _chooseOptionalPunctuator(): "?:" | ":" {
    if (this._optional) {
      return "?:";
    }
    return ":";
  }

  // eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
  generateCode(codeWriter: CodeWriter): void {
    const suffix = this._initializer ? ` = ${this._initializer}` : "";
    const punctuation = this._chooseOptionalPunctuator();
    codeWriter.writeLine(`${this._name}${punctuation} ${this._type}${suffix},`);
  }
}
